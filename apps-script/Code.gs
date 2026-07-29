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
  try {
    var data = JSON.parse(e.postData.contents);
    var row = [new Date()];
    FIELDS.forEach(function (field) {
      var value = data[field];
      if (Array.isArray(value)) value = value.join(', ');
      row.push(value || '');
    });

    // Only the sheet write needs to be serialized; email sending can happen
    // outside the lock so concurrent submissions don't queue up behind it.
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) {
      throw new Error('Could not acquire lock — another submission is in progress');
    }
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

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
  }
}
