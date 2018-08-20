Pistachio
=========

The Green Nut.

Displays Greenhouse candidates by department/job.

Displays recent Gmail messages and imports them into Greenhouse.

Installing
----------
1. `npm install`
2. `npm run build`
3. Install `docker`
4. `docker-compose up`
5. `bin/setup.sh`

Doing
-----

Visit http://localhost:8082/wp-admin/admin.php?page=pistachio — you should see the UI.

Cover Letters
-------------

Some people attach a Résumé PDF *and* a Cover Letter PDF to their email
message. For these people, we still want to capture the contents of the
email message, which we'll store as a generic attachment rather than an
attachment in Greenhouse's Cover Letter slot.

That means we can't depend on the Cover Letter slot to tell us whether or
not we've attached the email message's contents.

Instead, we define a Cover Letter by convention: a Cover Letter is an
attachment with a filename matching `/Cover.Letter.Intro/`.

The "Upload" button just grabs the oldest email message in the candidate's
activity feed, and uploads its contents as a file with filename
`{Name} - Cover Letter Intro.txt`.
