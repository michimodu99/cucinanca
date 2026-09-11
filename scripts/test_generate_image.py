# python -m unittest scripts/test_generate_image.py
import tempfile
import unittest
from pathlib import Path

from generate_image import FORMATO, build_prompt, read_env_key, slugify


class TestReadEnvKey(unittest.TestCase):
    def _write(self, data: bytes) -> Path:
        d = tempfile.mkdtemp()
        p = Path(d) / ".env"
        p.write_bytes(data)
        return p

    def test_reads_utf8(self):
        p = self._write(b"GEMINI_API_KEY=abc123\n")
        self.assertEqual(read_env_key(p, "GEMINI_API_KEY"), "abc123")

    def test_reads_utf16_with_bom(self):
        p = self._write("GEMINI_API_KEY=abc123\r\n".encode("utf-16"))
        self.assertEqual(read_env_key(p, "GEMINI_API_KEY"), "abc123")

    def test_strips_quotes_and_spaces(self):
        p = self._write(b'# commento\nGEMINI_API_KEY = "abc123" \n')
        self.assertEqual(read_env_key(p, "GEMINI_API_KEY"), "abc123")

    def test_missing_key_returns_none(self):
        p = self._write(b"ALTRO=1\n")
        self.assertIsNone(read_env_key(p, "GEMINI_API_KEY"))


class TestSlugify(unittest.TestCase):
    def test_accents_and_spaces(self):
        self.assertEqual(slugify("Risotto zucca e salsiccia"), "risotto-zucca-e-salsiccia")
        self.assertEqual(slugify("Purè di patate!"), "pure-di-patate")


class TestBuildPrompt(unittest.TestCase):
    def test_default_style_contains_dish_and_style_no_exclusions(self):
        p = build_prompt("risotto with pumpkin and sausage")
        self.assertIn("risotto with pumpkin and sausage", p)
        self.assertIn("editorial food photography", p)
        self.assertNotIn("Do not include", p)
        self.assertTrue(p.endswith(FORMATO))

    def test_prompt_always_states_4_5_portrait_format(self):
        for style in (None, "dark moody photography"):
            p = build_prompt("carbonara", style=style)
            self.assertIn("4:5", p)
            self.assertIn("portrait", p)

    def test_custom_style_replaces_default_but_keeps_format(self):
        p = build_prompt("carbonara", style="dark moody photography")
        self.assertIn("dark moody photography", p)
        self.assertNotIn("editorial food photography", p)
        self.assertTrue(p.endswith(FORMATO))


if __name__ == "__main__":
    unittest.main()
