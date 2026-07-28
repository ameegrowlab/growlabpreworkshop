/**
 * GrowLab Pre-Workshop Questionnaire — form handler.
 *
 * Bound to the "GrowLab Coordinator Responses" Google Sheet.
 * Deploy as a web app (Execute as: Me, Who has access: Anyone) and
 * POST JSON matching FIELDS below to the resulting /exec URL.
 */

var NOTIFY_EMAIL = 'amee@growlab.au';

var FIELDS = [
  'name', 'role', 'school', 'program', 'format', 'date', 'time', 'room',
  'students', 'year', 'ages', 'jobs', 'stream', 'careers', 'energy',
  'needs', 'sensitive', 'prior', 'priorDetail', 'goal', 'other',
  'av', 'wifi', 'devices', 'avnotes'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var row = [new Date()];
    FIELDS.forEach(function (field) {
      var value = data[field];
      if (Array.isArray(value)) value = value.join(', ');
      row.push(value || '');
    });
    sheet.appendRow(row);

    var subject = 'Pre-Workshop Questionnaire — ' + (data.school || 'School');
    var bodyLines = FIELDS.map(function (field) {
      var value = data[field];
      if (Array.isArray(value)) value = value.join(', ');
      return field + ': ' + (value || 'Not specified');
    });
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: bodyLines.join('\n')
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
