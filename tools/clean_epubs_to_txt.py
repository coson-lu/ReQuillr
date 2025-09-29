#!/usr/bin/env python3
import json
from pathlib import Path
import re
from ebooklib import epub  # pip install ebooklib beautifulsoup4 lxml
from bs4 import BeautifulSoup

INPUT_DIR = Path("input_epubs")
OUTPUT_DIR = Path("output_texts")
INPUT_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Normalize curly quotes/dashes/spaces
REPLACEMENTS = {
    "\u2018": "'", "\u2019": "'",
    "\u201C": '"', "\u201D": '"',
    "\u2013": "-", "\u2014": "-",
    "\u00A0": " ",
}

NOISE_HEAD_RE = re.compile(
    r"^\s*(CHAPTER|CONTENTS|BOOK|PART|THE END|EPILOGUE|PROLOGUE|INTRODUCTION)\b",
    re.I,
)

def normalize_quotes(s: str) -> str:
    for a, b in REPLACEMENTS.items():
        s = s.replace(a, b)
    s = re.sub(r"[‘’]", "'", s)
    s = re.sub(r"[“”]", '"', s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r'[\ufeff\u200b\u200c\u200d\u2060]', '', s)
    return s.strip()

def is_noise_paragraph(text: str) -> bool:
    t = text.strip()
    if not t:
        return True
    if "project gutenberg" in t.lower():
        return True
    if NOISE_HEAD_RE.match(t):
        return True
    if len(t) < 80 and re.fullmatch(r"[^a-z]*[A-Z]{3,}[^a-z]*", t):  # short ALL-CAPS heading
        return True
    if re.fullmatch(r"\d+", t):  # page numbers
        return True
    return False

# NEW — patterns that typically mark the start of publication/back-matter notes
PUB_TAIL_PATTERNS = [
    re.compile(r'^\s*.+\bwas published in\b.+\bby\b.+\.\s*$', re.I),
    re.compile(r'^\s*This (?:edition|ebook) was published\b.*\.\s*$', re.I),
    re.compile(r'^\s*Originally published in\b.*\.\s*$', re.I),
    re.compile(r'^\s*(Standard Ebooks|Project Gutenberg)\b', re.I),
    re.compile(r'^\s*ISBN\b', re.I),
]

TAIL_SEARCH_WINDOW = 0.30  # NEW — only look in the last 30% of paragraphs for a tail marker

# NEW — truncate everything from the first detected publication-tail marker onward
def truncate_after_publication_notice(paragraphs):
    if not paragraphs:
        return paragraphs
    start_idx = int(len(paragraphs) * (1.0 - TAIL_SEARCH_WINDOW))
    for i in range(start_idx, len(paragraphs)):
        p = paragraphs[i]
        if any(rx.search(p) for rx in PUB_TAIL_PATTERNS):
            return paragraphs[:i]  # drop marker paragraph and everything after it
    return paragraphs

def extract_paragraphs(epub_path: Path):
    book = epub.read_epub(str(epub_path))
    paras = []
    for item in book.get_items():
        # robust: treat only HTML/XHTML documents as content
        if hasattr(epub, "EpubHtml") and isinstance(item, epub.EpubHtml):
            try:
                soup = BeautifulSoup(item.get_content(), "lxml")
            except Exception:
                soup = BeautifulSoup(item.get_content(), "html.parser")

            for tag in soup(["nav", "header", "footer", "script", "style", "aside"]):
                tag.decompose()
            for cap in soup.find_all(["figcaption", "caption"]):
                cap.decompose()

            # Use only <p> for safety (avoids grabbing layout divs)
            for p in soup.find_all("p"):
                text = p.get_text(separator=" ", strip=True)
                if not text or is_noise_paragraph(text):
                    continue
                paras.append(text)

    # Normalize and consolidate lightly
    cleaned = [normalize_quotes(p) for p in paras]

    consolidated = []
    i = 0
    while i < len(cleaned):
        cur = cleaned[i]
        # If paragraph doesn't end in terminal punctuation and next starts lowercase, merge
        if (
            i + 1 < len(cleaned)
            and not re.search(r'[.!?]["\']?$', cur)
            and re.match(r"^[a-z0-9]", cleaned[i + 1])
        ):
            merged = cur + " " + cleaned[i + 1]
            i += 2
            while (
                i < len(cleaned)
                and not re.search(r'[.!?]["\']?$', merged)
                and re.match(r"^[a-z0-9]", cleaned[i])
            ):
                merged += " " + cleaned[i]
                i += 1
            consolidated.append(merged.strip())
        else:
            consolidated.append(cur.strip())
            i += 1

    # NEW — cut off any publication/back-matter tail
    consolidated = truncate_after_publication_notice(consolidated)
    return consolidated

def main():
    epubs = sorted(INPUT_DIR.glob("*.epub"))
    books = []
    if not epubs:
        print("No EPUBs found in ./input_epubs/. Drop files there and re-run.")
        return

    for ep in epubs:
        try:
            paragraphs = extract_paragraphs(ep)
        except Exception as e:
            print(f"ERROR parsing {ep.name}: {e}")
            continue

        if not paragraphs:
            print(f"No paragraphs extracted from {ep.name}. Skipping.")
            continue

        title, author = ep.stem.split(" by ")

        out_path = OUTPUT_DIR / (ep.stem + ".txt")
        out_text = "\n".join(paragraphs).strip() + "\n"  # single '\n' between paragraphs
        out_path.write_text(out_text, encoding="utf-8")

        books.append({
            "title": title,
            "author": author,
            "text": out_text,
        })

        print(f"Wrote: {out_path}  ({len(paragraphs)} paragraphs)")

    with open('../public/texts.json', 'w') as file:
        json.dump(books, file, indent=4)


if __name__ == "__main__":
    main()

