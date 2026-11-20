// Starter article added once per database (tracked in the Settings table). Edit or unpublish it from /admin/posts.
export const seedPostsV4 = [
  {
    slug: "gdpr-cookie-consent-checklist-for-your-website",
    title: "GDPR and cookie consent: a practical checklist for your website",
    excerpt: "If your website has visitors from Europe, these are the steps that matter: consent, privacy policy, forms, and your rights requests.",
    category: "Guides",
    date: "2026-11-20",
    body: `If your website is visited by people in the European Union or the United Kingdom, the GDPR applies to how you handle their personal data, even if your business is based elsewhere. In practice this means getting consent before non-essential cookies and tracking, being open about what you collect, and being able to respond when someone asks about their data. This guide is general information, not legal advice, so have a qualified professional review your final setup.

## 1. Ask before you track
Analytics, advertising and other non-essential cookies should not run until the visitor agrees. A good cookie banner:
- Has **Reject all** that is as easy to click as **Accept all**.
- Lets people choose by category (essential, analytics, marketing).
- Starts with every optional category switched off.
- Can be reopened later, so consent is as easy to withdraw as to give.

## 2. Load tags only after consent
Tag managers and analytics scripts should wait for the visitor's choice. If you use Google tools, pass the choice on with Google Consent Mode so tags behave correctly when consent is denied.

## 3. Publish a clear privacy policy
Explain in plain language who you are, what you collect (forms, bookings, payments, newsletter, analytics), why, the legal basis, who you share it with (payment, email and hosting providers), how long you keep it, and how people can use their rights.

## 4. Make forms honest
Use an unticked consent checkbox that links to your privacy policy, collect only what you need, and keep a honeypot or rate limit to stop spam without invasive tracking.

## 5. Know your processors and transfers
List the services that handle personal data for you. If data leaves the EU or UK, make sure there is a valid transfer mechanism, such as an adequacy decision or Standard Contractual Clauses.

## 6. Be ready for rights requests
People can ask to see, correct, delete or take a copy of their data, and to object or withdraw consent. Decide who answers these requests and aim to reply within one month.

## 7. Keep data only as long as needed
Set retention periods, for example for unconverted enquiries, and delete data when the time is up.

## 8. Protect what you hold
Use HTTPS, strong passwords with two-factor authentication, access limits, backups and timely updates. If a breach happens, you may have to notify the authorities and the people affected.

## Quick self-check
Open your site in a private window. Do tracking cookies appear before you click anything? If so, fix that first.

BGeetech builds consent banners, privacy pages and compliant forms into every website. Book a free 30-minute consultation and we will review your setup.`,
  },
];
