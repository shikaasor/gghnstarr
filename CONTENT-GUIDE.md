# How to Add a New Policy Brief to the GGHN STARR Website

This guide walks through adding a new weekly policy brief so it appears on the website automatically.

**You will need:**
- Access to the GGHN STARR Google Sheet (ask your team lead for the link)
- The PDF and infographic files for the new brief
- A Google Drive folder where files are stored (shared with you by your team)
- GitHub Desktop installed ([download here](https://desktop.github.com/)) and the repository cloned

**Time required:** 10–15 minutes

---

## Overview: How It Works

1. You add a row in the Google Sheet with the brief's details
2. You upload the PDF and infographic to Google Drive and copy the shareable links
3. You run a Google Apps Script that exports the Sheet to JSON
4. You paste the JSON output into a file in the repository
5. You commit the change using GitHub Desktop
6. Vercel (our hosting platform) detects the commit and automatically rebuilds the site within 2 minutes

---

## Step 1: Add the Brief to the Google Sheet

Open the GGHN STARR Briefs Google Sheet. Add a new row at the bottom with these columns:

| Column | What to Enter | Example |
|--------|---------------|---------|
| `slug` | A short URL-safe identifier — lowercase, hyphens only, no spaces | `week-04-antibiotic-stewardship` |
| `title` | The full title of the brief | `Strengthening Antibiotic Stewardship in Sub-Saharan Africa` |
| `weekNumber` | The week number as a plain number | `4` |
| `publicationDate` | The publication date in YYYY-MM-DD format | `2026-03-31` |
| `authorId` | The author's ID (from the Author IDs reference below) | `olawale-oladipo` |
| `keyTakeaway` | A single sentence capturing the key finding | `Countries with stewardship programs reduce AMR by 30%.` |
| `executiveSummary` | A 100–150 word paragraph summary | _(paste the full text)_ |
| `keyMessages` | 3–7 bullet points, one per line within the cell (press Alt+Enter for new lines inside a cell) | `Finding 1`↵`Finding 2`↵`Finding 3` |
| `pdfUrl` | Google Drive shareable link for the full brief PDF | `https://drive.google.com/file/d/ABC123/view?usp=sharing` |
| `infographicPdfUrl` | Google Drive shareable link for the 1-page infographic PDF | `https://drive.google.com/file/d/XYZ789/view?usp=sharing` |
| `thumbnailUrl` | Path to the thumbnail image: `/images/thumbnails/{slug}.jpg` | `/images/thumbnails/week-04-antibiotic-stewardship.jpg` |
| `themes` | Comma-separated themes from this list: `Governance`, `Laboratory Systems`, `Predictive Analytics`, `One Health`, `Stewardship` | `Governance, Stewardship` |

**Tip:** Copy an existing row as a template to get the format right, then edit each cell.

---

## Step 2: Upload Files to Google Drive

1. Open the GGHN STARR shared Google Drive folder
2. Upload the full brief PDF and name it: `week-04-{brief-topic}.pdf`
3. Upload the infographic PDF and name it: `week-04-{brief-topic}-infographic.pdf`
4. Right-click each file → **Share** → **Copy link**
   - Make sure the link is set to **"Anyone with the link can view"**
5. Paste each link into the `pdfUrl` and `infographicPdfUrl` cells in the Google Sheet

---

## Step 3: Upload the Thumbnail Image

The thumbnail is a small preview image (JPEG, roughly 600×400 pixels) that appears on the brief card.

1. Prepare the thumbnail image and name it: `week-04-{brief-topic}.jpg`
2. In GitHub Desktop, click **Repository** → **Open in Explorer** (or Finder on Mac) to find the cloned repository folder on your computer
3. Navigate to: `public/images/thumbnails/`
4. Copy your thumbnail file into this folder
5. The thumbnail will be picked up automatically when you commit in Step 6

---

## Step 4: Export the Google Sheet to JSON

A Google Apps Script converts your Sheet into the JSON format the website reads.

1. In the Google Sheet, click the menu: **Extensions** → **Apps Script**
2. In the script editor, find the function called `exportBriefsToJSON`
3. Click the **Run** button (▶) next to the function name
4. If prompted for permissions, click **Review permissions** → **Allow**
5. After it runs, click **View** → **Logs** (or press Ctrl+Enter)
6. You will see a block of text starting with `[` — this is the JSON output
7. Select all the text in the log (Ctrl+A) and copy it (Ctrl+C)

---

## Step 5: Update the Briefs Data File

1. In GitHub Desktop, click **Repository** → **Open in Explorer** (or Finder on Mac)
2. Navigate to the folder: `content/`
3. Open the file `briefs-index.json` with a text editor (Notepad, TextEdit, or VS Code)
4. Select all the existing content (Ctrl+A) and delete it
5. Paste the JSON you copied from the Apps Script log (Ctrl+V)
6. Save the file (Ctrl+S)

**Check:** The file should start with `[` and end with `]`. If it looks garbled, do not save — ask a developer for help.

---

## Step 6: Commit and Push Using GitHub Desktop

1. Open **GitHub Desktop**
2. You should see the changed files listed (`briefs-index.json` and the new thumbnail)
3. In the **Summary** box at the bottom left, type a commit message:
   `Add Week 4 brief: Antibiotic Stewardship`
4. Click the blue **Commit to main** button
5. Click **Push origin** (top right) to send your changes to GitHub

---

## Step 7: Wait for Vercel to Rebuild

After you push:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Open the **gghn-starr** project
3. Click **Deployments** — you should see a new deployment starting (status: Building)
4. Wait 1–3 minutes for it to complete (status: Ready)
5. Click **Visit** to open the live site and confirm the new brief appears on the Briefs page

---

## Troubleshooting

**The brief does not appear on the site after deploying:**
- Check that the `slug` in the JSON matches the `thumbnailUrl` path exactly
- Check that the Vercel deployment shows "Ready" (not "Error")
- Check that `briefs-index.json` is valid JSON — it must start with `[` and end with `]`

**The thumbnail image is broken (shows a grey box):**
- Check that the thumbnail file is in `public/images/thumbnails/` with the exact filename matching `thumbnailUrl`
- Check that the file was included in your GitHub Desktop commit

**The PDF download opens a Google Drive page instead of downloading:**
- This is expected — Google Drive opens a preview. Users can download from the preview page.
- To force a direct download link, replace `/view?usp=sharing` with `/uc?export=download` in the URL.

**The Apps Script asks for permissions every time:**
- This is normal for first-time use. Click Allow. It will not ask again on the same Google account.

---

## Author IDs Reference

When filling in `authorId`, use one of these values exactly:

| Author | authorId |
|--------|----------|
| Dr. Olawale Oladipo | `olawale-oladipo` |
| Dr. Amina Ibrahim | `amina-ibrahim` |

---

## Theme Values Reference

Use only these exact values in the `themes` column (comma-separated):

- `Governance`
- `Laboratory Systems`
- `Predictive Analytics`
- `One Health`
- `Stewardship`

---

*Guide maintained by the GGHN STARR technical team. Last updated: 2026-03-30.*
