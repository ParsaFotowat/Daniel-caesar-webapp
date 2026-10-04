# Finish Phase 1, then start Phase 2 (QR Digital Warranty)

## Step A — Close Phase 1 (Brand Digital Presence)
- **Contact page:** concierge form (name, email/phone, topic, message), boutique address, hours and social links, in English and Persian.
- **Retailers page:** authorised retailer list grouped by city, with an "authorised dealer" badge and a map link for each one.
- **Navigation:** add Contact and Retailers to the header and footer.
- **SEO:** unique titles and descriptions on every page, a sitemap, and Persian text checked in RTL on desktop and mobile.
- Store details are placeholders until you send the real ones.

## Step B — Phase 2 (QR Digital Warranty), using Lovable Cloud
- **Warranty records:** each watch has a serial, model, sale date, retailer and status (active / pending / void).
- **QR code:** each record gets a QR code for the warranty card. Scanning it opens the watch's certificate page.
- **Activation:** the customer scans the QR code, enters their name and phone, and the warranty starts.
- **Admin panel (staff only, sign-in required):** create watches and serials, print or download QR codes, see activations, and void a record.
- **Public lookup:** the warranty page reads real records instead of the demo serials.
- SMS confirmation comes later. It needs an SMS provider, which you would choose.

## Technical details
- Contact form submissions are saved to a Cloud table. The admin panel can list them.
- Tables: watches_registry, warranties, retailers, contact_messages, plus a separate user_roles table with an admin role. Access is protected by row-level security.
- Public reads and activation go through server functions that check the input. Admin actions check the admin role on the server.
- QR codes are generated in the browser with a QR library and link to /warranty/$serial.
