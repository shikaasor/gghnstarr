"""
Extraction script: AMR Resource Repository.xlsx -> content/education.json
One-shot, re-runnable. Committed for provenance.
"""

import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

XLSX_PATH = Path(__file__).parent / "AMR Resource Repository.xlsx"
OUTPUT_PATH = Path(__file__).parent.parent.parent / "content" / "education.json"
CURATED_PATH = OUTPUT_PATH  # same file; curated records live there already

# Map xlsx Type column -> ContentFormat enum
TYPE_TO_FORMAT = {
    "journal paper": "Publication",
    "journal article": "Publication",
    "article": "Publication",
    "preprint paper": "Publication",
    "paper": "Publication",
    "conference paper": "Publication",
    "patent": "Publication",
    "website": "Article",
    "mobile application": "Article",
    "online course": "Course",
    "video": "Video",
}

# Map xlsx Region column -> WHORegion token
REGION_MAP = {
    "african region (afro)": "AFRO",
    "european region (euro)": "EURO",
    "region of the americas (paho)": "PAHO",
    "eastern mediterranean region (emro)": "EMRO",
    "western pacific region (wpro)": "WPRO",
    "south-east asia region (searo)": "SEARO",
    "all regions": "All regions",
}

# Default audience by format
FORMAT_AUDIENCE = {
    "Publication": ["Healthcare Worker"],
    "Article": ["Healthcare Worker"],
    "Course": ["Healthcare Worker"],
    "Download": ["Policymaker"],
    "Video": ["General Public"],
    "Webinar": ["Healthcare Worker"],
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def map_format(type_val: str) -> str:
    key = (type_val or "").lower().strip()
    return TYPE_TO_FORMAT.get(key, "Download")


def map_region(region_val: str) -> str | None:
    key = (region_val or "").lower().strip()
    if not key:
        return None  # blank cell -> omit region entirely
    result = REGION_MAP.get(key)
    if result is None:
        print(f"WARNING: unmapped region '{region_val}' -> skipping", file=sys.stderr)
        return None
    return result


def extract_year(source_val: str) -> int | None:
    matches = re.findall(r"(?:19|20)\d{2}", source_val or "")
    if matches:
        return int(matches[-1])
    return None


def fix_url(url_val: str) -> str:
    url_val = (url_val or "").strip()
    if not url_val:
        return ""
    if url_val.lower().startswith("http"):
        return url_val
    # Bare DOI
    return f"https://doi.org/{url_val}"


def derive_source(source_val: str, url_val: str) -> str:
    s = (source_val or "").strip()
    if s:
        return s
    parsed = urlparse(url_val)
    netloc = parsed.netloc.lstrip("www.")
    return netloc if netloc else "Unknown"


def build_items() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(min_row=2, values_only=True))

    seen_ids: set[str] = set()
    items: list[dict] = []

    for row in rows:
        title = (str(row[0]) if row[0] is not None else "").strip()
        type_col = (str(row[1]) if row[1] is not None else "").strip()
        purpose = (str(row[2]) if row[2] is not None else "").strip()
        description = (str(row[3]) if row[3] is not None else "").strip()
        source_col = (str(row[4]) if row[4] is not None else "").strip()
        url_col = (str(row[5]) if row[5] is not None else "").strip()
        region_col = (str(row[6]) if row[6] is not None else "").strip()
        # row[7] = Global use (H) — not used

        fmt = map_format(type_col)

        # Determine tab
        tab = "resources"
        if "course" in type_col.lower() or "training" in purpose.lower():
            tab = "training"

        # Build slug id, prefix with amr- to avoid collision with curated ids.
        # Use a content hash suffix for collisions so IDs are stable across
        # re-runs regardless of row order (avoids fragile sequential counters).
        base_slug = "amr-" + slugify(title)[:60]
        slug = base_slug
        if slug in seen_ids:
            h = hashlib.md5(title.encode()).hexdigest()[:6]
            slug = f"{base_slug}-{h}"
        seen_ids.add(slug)

        url = fix_url(url_col)
        source = derive_source(source_col, url)
        year = extract_year(source_col)

        region = map_region(region_col)
        item: dict = {
            "id": slug,
            "tab": tab,
            "title": title,
            "audiences": FORMAT_AUDIENCE.get(fmt, ["Policymaker"]),
            "format": fmt,
            "topics": ["Research"],
            "source": source,
            "sourceVerified": False,
            "url": url,
            "description": description,
        }
        if region is not None:
            item["region"] = region
        if year is not None:
            item["year"] = year

        items.append(item)

    return items


if __name__ == "__main__":
    items = build_items()
    print(len(items))
    print(items[0])

    # Read the existing 15 curated records
    with open(CURATED_PATH, encoding="utf-8") as f:
        curated = json.load(f)

    combined = curated + items
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(combined)} records to {OUTPUT_PATH}")
