# Connecting the RSVP form to a Google Sheet

The RSVP form posts to `/api/rsvp`, which forwards each submission to a
Google Apps Script "Web App" URL that appends a row to a Google Sheet.

## 1. Create the sheet

Make a new Google Sheet. Add a header row (optional, for your own reference):

```
Timestamp | Name | Response | Guests | Note
```

## 2. Add the script

In the sheet: **Extensions → Apps Script**. Replace the default code with the
contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs) in
this repo, then save.

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Click **Deploy**, authorize when prompted, and copy the resulting URL
   (ends in `/exec`).

## 4. Wire it into the app

Add the URL to `.env.local` (create it from `.env.local.example`):

```
GOOGLE_SHEET_RSVP_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

Restart `npm run dev` (or redeploy) after adding it. New RSVPs will now
appear as rows in the sheet.
