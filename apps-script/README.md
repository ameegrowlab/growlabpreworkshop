# GrowLab form handler — deployment steps

The Google Sheet **"GrowLab Coordinator Responses"** has already been created in
Drive with the header row matching the fields below.

Deploying the Apps Script web app has to be done manually in the Apps Script
editor — there's no API access available here to create/deploy it for you.

1. Open the **GrowLab Coordinator Responses** sheet.
2. Go to **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in the contents of
   [`Code.gs`](./Code.gs) from this folder.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, then **Authorize access** and approve the permissions
   (it needs to read/write the Sheet and send email).
8. Copy the **Web app URL** (ends in `/exec`) and send it back — the HTML
   form's submit button will be wired up to POST to it.

## Fields

```
name, role, school, program, format, date, time, room, students, year,
ages, jobs, stream, careers, energy, needs, sensitive, prior, priorDetail,
goal, other, av, wifi, devices, avnotes
```
