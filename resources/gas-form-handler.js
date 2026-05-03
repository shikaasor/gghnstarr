/**
 * Google Apps Script — unified form handler
 *
 * Deploy as a Web App:
 *   Extensions → Apps Script → Deploy → New deployment
 *   Type: Web App | Execute as: Me | Who has access: Anyone
 *
 * Paste the deployment URL into NEXT_PUBLIC_GAS_URL in .env.local and Vercel.
 *
 * Sheet tabs created automatically on first submission of each type:
 *   "Newsletter"   — email signups
 *   "Pledges"      — public AMR pledges
 *   "Commitments"  — healthcare worker prescribing commitments
 */

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (_) {
    return jsonResponse({ status: 'error', message: 'Invalid JSON' });
  }

  var formType = data.formType || 'unknown';
  var sheetName = { newsletter: 'Newsletter', pledge: 'Pledges', commitment: 'Commitments' }[formType] || 'Unknown';

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(getHeaders(formType));
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  }

  sheet.appendRow(getRow(formType, data));
  return jsonResponse({ status: 'success' });
}

function getHeaders(formType) {
  switch (formType) {
    case 'newsletter':  return ['Timestamp', 'Email', 'Source'];
    case 'pledge':      return ['Timestamp', 'Name', 'Country', 'Role', 'Commitment Statement'];
    case 'commitment':  return ['Timestamp', 'Name', 'Facility', 'Specialty', 'Specific Commitment'];
    default:            return ['Timestamp', 'Form Type', 'Raw Data'];
  }
}

function getRow(formType, data) {
  var ts = data.timestamp || new Date().toISOString();
  switch (formType) {
    case 'newsletter':  return [ts, data.email || '', data.source || ''];
    case 'pledge':      return [ts, data.name || '', data.country || '', data.role || '', data.commitmentStatement || ''];
    case 'commitment':  return [ts, data.name || '', data.facility || '', data.specialty || '', data.specificCommitment || ''];
    default:            return [ts, formType, JSON.stringify(data)];
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
