"""Genera la foto di copertina di una ricetta con Gemini (Nano Banana 2).

Uso:
  python scripts/generate_image.py "Risotto zucca e salsiccia"
  python scripts/generate_image.py "Carbonara" --style "dark moody photography"
  python scripts/generate_image.py --slug carbonara,cacio-e-pepe   # dai foto.prompt di recipes.json
  python scripts/generate_image.py --all                            # tutte le ricette senza png
Opzioni: --model gemini-3.1-flash-image  --out img/raw  --force  --dry

Legge GEMINI_API_KEY da .env (UTF-8 o UTF-16). Output: <out>/<slug>.png + <slug>.json (prompt, modello, data).
Poi: `npm run images:optimize` → img/<slug>.webp
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODELLO_DEFAULT = "gemini-3.1-flash-image"
OUT_DEFAULT = ROOT / "img" / "raw"

# Template condiviso: coerenza tra le 57 foto (SPEC §8), stessa linea di gen-images.mjs.
STILE_DEFAULT = (
    "editorial food photography, white ceramic plate on light grey linen, "
    "soft natural daylight from the left, 45-degree angle, minimal Swiss composition, "
    "neutral muted background, shallow depth of field, no text, no hands, "
    "no cutlery clutter, no garnish overload"
)
# Ingredienti che Michele non mangia: non devono comparire nemmeno come decorazione.
# Formato fisso (pagina sinistra del libro): nel prompt, così vale anche fuori dallo script.
FORMATO = "Vertical 4:5 portrait format."
ESCLUSIONI = "Do not include any tomatoes, cherry tomatoes, peas, green beans, artichokes, broccoli or cauliflower."


def read_env_key(path: Path, name: str) -> str | None:
    """Legge NAME=valore da un file .env; accetta UTF-8 (con/senza BOM) e UTF-16 (BOM)."""
    if not path.exists():
        return None
    raw = path.read_bytes()
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        text = raw.decode("utf-16")
    else:
        text = raw.decode("utf-8-sig")
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        if k.strip() == name:
            return v.strip().strip("'\"")
    return None


def slugify(nome: str) -> str:
    s = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s.lower())
    return s.strip("-")


def build_prompt(piatto: str, style: str | None = None) -> str:
    return f"{style or STILE_DEFAULT}, {piatto}. {FORMATO} {ESCLUSIONI}"


def genera(client, modello: str, prompt: str) -> bytes:
    from google.genai import types

    logging.getLogger("google_genai").setLevel(logging.ERROR)  # silenzia l'avviso AFC, irrilevante qui

    res = client.models.generate_content(
        model=modello,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="4:5"),
        ),
    )
    for part in res.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            return part.inline_data.data
    raise RuntimeError("nessuna immagine nella risposta")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("piatto", nargs="?", help="nome del piatto (usato come prompt e per lo slug)")
    ap.add_argument("--style", help="stile visivo; sostituisce quello di default")
    ap.add_argument("--slug", help="slug da recipes.json, separati da virgola")
    ap.add_argument("--all", action="store_true", help="tutte le ricette di recipes.json")
    ap.add_argument("--model", default=MODELLO_DEFAULT)
    ap.add_argument("--out", type=Path, default=OUT_DEFAULT)
    ap.add_argument("--force", action="store_true", help="rigenera anche se il png esiste")
    ap.add_argument("--dry", action="store_true", help="stampa i prompt senza chiamare l'API")
    a = ap.parse_args(argv)

    # lista di (slug, descrizione)
    if a.piatto:
        lavori = [(slugify(a.piatto), a.piatto)]
    elif a.slug or a.all:
        ricette = json.loads((ROOT / "data" / "recipes.json").read_text("utf-8"))
        voluti = set(a.slug.split(",")) if a.slug else None
        lavori = [(r["slug"], r["foto"]["prompt"]) for r in ricette if not voluti or r["slug"] in voluti]
        if voluti and len(lavori) < len(voluti):
            print(f"slug non trovati: {voluti - {s for s, _ in lavori}}", file=sys.stderr)
    else:
        ap.error("indica un piatto, --slug o --all")

    a.out.mkdir(parents=True, exist_ok=True)
    if not a.force:
        lavori = [(s, p) for s, p in lavori if not (a.out / f"{s}.png").exists()]
    print(f"{len(lavori)} immagini da generare con {a.model}{' (dry run)' if a.dry else ''}")
    if not lavori:
        return 0

    client = None
    if not a.dry:
        key = read_env_key(ROOT / ".env", "GEMINI_API_KEY")
        if not key:
            print("Manca GEMINI_API_KEY in .env", file=sys.stderr)
            return 1
        from google import genai

        client = genai.Client(api_key=key)

    errori = 0
    for slug, piatto in lavori:
        prompt = build_prompt(piatto, a.style)
        if a.dry:
            print(f"- {slug}: {prompt[:90]}...")
            continue
        print(f"- {slug} ... ", end="", flush=True)
        try:
            png = genera(client, a.model, prompt)
            (a.out / f"{slug}.png").write_bytes(png)
            meta = {"modello": a.model, "prompt": prompt, "data": datetime.now(timezone.utc).isoformat()}
            (a.out / f"{slug}.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), "utf-8")
            print(f"ok ({len(png) // 1024} KB)")
        except Exception as e:  # noqa: BLE001 - continua con le altre
            errori += 1
            msg = str(e)
            if "free_tier" in msg and "limit: 0" in msg:
                msg = ("429: i modelli immagine di Gemini non sono nel piano gratuito; "
                       "attiva la fatturazione su https://aistudio.google.com (Settings > Plan)")
            print(f"ERRORE: {msg[:300]}")
    return 1 if errori else 0


if __name__ == "__main__":
    sys.exit(main())
