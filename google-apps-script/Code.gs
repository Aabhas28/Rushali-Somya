/**
 * Paste this into Extensions > Apps Script on the Google Sheet that should
 * collect RSVPs, then deploy it as a Web App. See RSVP_SETUP.md.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attending === "no" ? "Regretfully declines" : "Joyfully accepts",
    data.guests || "",
    data.note || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
