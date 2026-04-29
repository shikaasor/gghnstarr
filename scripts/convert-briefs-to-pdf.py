"""
Convert policy brief .docx files to PDF and copy to public/briefs/.
Uses docx2pdf (requires Microsoft Word on Windows).

Mapping from source filename to output slug:
"""
import os
import sys
import shutil
from pathlib import Path

RESOURCES_ROOT = Path("resources/GGHN STARR_5th Interministrial AMR Meeting. Mar - Jun 2026/Briefs")
MERCY_DIR = RESOURCES_ROOT / "Mercy_s Briefs/Drafts for review"
OUTPUT_DIR = Path("public/briefs")

# Maps (source_dir, filename) -> output slug
MAPPING = {
    (MERCY_DIR, "Policy Brief #1_Multi Country PEA (Outline).docx"):       "brief-01-multi-country-pea.pdf",
    (MERCY_DIR, "Policy Brief #2_Why countries struggle with AMR.docx"):   "brief-02-why-countries-struggle-amr.pdf",
    (MERCY_DIR, "Policy Brief #3_The political economy of AMR in Africa.docx"): "brief-03-political-economy-amr-africa.pdf",
    (MERCY_DIR, "Policy Brief #4_Global impact of funding shifts.docx"):   "brief-04-global-impact-funding-shifts.pdf",
    (MERCY_DIR, "Policy Brief #5_A threat to health & national security.docx"): "brief-05-threat-health-national-security.pdf",
    (MERCY_DIR, "Policy Brief #6_Domestic Budgets, Donor Leverage & Sustainability.docx"): "brief-06-domestic-budgets-donor-leverage.pdf",
    (MERCY_DIR, "Policy Brief #7_Strengthening One Health Governance for AMR.docx"): "brief-07-one-health-governance.pdf",
    (MERCY_DIR, "Policy Brief #8_Achieveing Intra and Integrated AMR_AMU Surveillance.docx"): "brief-08-amr-amu-surveillance.pdf",
    (MERCY_DIR, "Policy Brief #9_Optimizing & maximizing local laboratory systems.docx"): "brief-09-local-laboratory-systems.pdf",
    (MERCY_DIR, "Policy Brief #10_Stewardship & IPC - Cost effective interventions.docx"): "brief-10-stewardship-ipc-interventions.pdf",
    (MERCY_DIR, "Policy Brief #11_Livestock, Food Safety, Food Security & Trade.docx"): "brief-11-livestock-food-safety-trade.pdf",
    (MERCY_DIR, "Policy Brief #12_Environmental AMR - The Missing Pillar in National Plans.docx"): "brief-12-environmental-amr.pdf",
    (MERCY_DIR, "Policy Brief #13_Digital Transformation for AMR - AI, Interoperability & Real Time Data.docx"): "brief-13-digital-transformation-amr.pdf",
    (MERCY_DIR, "Policy Brief #14_Post Shock Political–Economic Conditions (Outline).docx"): "brief-14-post-shock-political-economic.pdf",
    (MERCY_DIR, "Policy Brief #15_Key Messages for the 5th Global AMR Conference (Outline).docx"): "brief-15-key-messages-5th-amr-conference.pdf",
    # Samson's brief
    (RESOURCES_ROOT / "Samson_s Briefs", "2page brief sample for Samson.docx"): "brief-16-predictive-modeling-amr-africa.pdf",
}

def convert_with_docx2pdf():
    from docx2pdf import convert
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    success, failed = [], []

    for (src_dir, src_name), out_name in MAPPING.items():
        src = src_dir / src_name
        dst = OUTPUT_DIR / out_name
        if not src.exists():
            print(f"  MISSING  {src_name}")
            failed.append(src_name)
            continue
        try:
            import tempfile, uuid
            tmp = Path(tempfile.gettempdir()) / f"{uuid.uuid4()}.pdf"
            convert(str(src), str(tmp))
            shutil.move(str(tmp), str(dst))
            print(f"  OK       {out_name}")
            success.append(out_name)
        except Exception as e:
            print(f"  FAILED   {out_name}: {e}")
            failed.append(src_name)

    print(f"\n{len(success)}/{len(MAPPING)} converted. {len(failed)} failed.")
    return len(failed) == 0

if __name__ == "__main__":
    print("Converting policy briefs .docx to PDF...\n")
    ok = convert_with_docx2pdf()
    sys.exit(0 if ok else 1)
