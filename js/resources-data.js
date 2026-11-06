/* =========================================================
   Elevartemis Resources — CONTENT FILE
   ---------------------------------------------------------
   Everything on the Resources page is built from this file.
   To add a guide, tool, or article, copy an entry and edit it.

   url      Link to the PDF, template, tool, or article.
            Leave it '' and the card shows "Coming soon" with
            a "Get it when it's ready" link to the newsletter.
   gated    true = ask for an email before the download
            (only works once NEWSLETTER.action is set below).
   ========================================================= */

window.ELEVARTEMIS_RESOURCES = {

  /* ---------- Newsletter signups ----------
     action: paste your Formspree form link here, e.g.
             'https://formspree.io/f/abcd1234'
             (use a SEPARATE Formspree form from the contact form).
             Later you can swap in Mailchimp, Kit, MailerLite, etc.
             and set emailField to the name their form uses.
     Until a link is set, signups open an email to Elevartemis@gmail.com. */
  NEWSLETTER: {
    action: '',
    emailField: 'email',
    fallbackEmail: 'Elevartemis@gmail.com'
  },

  /* ---------- Guide categories (order = filter order) ---------- */
  guideCategories: ['Getting Started', 'Website & SEO', 'Social Media', 'Planning & Strategy', 'Measurement'],

  /* ---------- Free guides & ebooks ---------- */
  guides: [
    { id: 'starter-guide', category: 'Getting Started', format: 'Ebook',
      title: 'Small Business Marketing Starter Guide',
      desc: 'The basics in plain English: who to reach, what to say, and which few channels to start with.',
      url: '', gated: true },
    { id: 'no-team-plan', category: 'Getting Started', format: 'Guide + template',
      title: 'The No-Marketing-Team Marketing Plan',
      desc: 'A one-page plan you can build in an afternoon and actually keep up with.',
      url: '', gated: true },
    { id: 'website-essentials', category: 'Website & SEO', format: 'Checklist',
      title: 'Website Essentials Checklist',
      desc: 'What every small-business website needs to earn trust and turn visitors into calls.',
      url: '', gated: false },
    { id: 'local-seo', category: 'Website & SEO', format: 'Checklist',
      title: 'Local SEO Checklist',
      desc: 'Step-by-step fixes that help nearby customers find you in search and on maps.',
      url: '', gated: false },
    { id: 'seo-vs-aeo', category: 'Website & SEO', format: 'Guide',
      title: 'SEO vs. AEO: What Small Businesses Need to Know',
      desc: 'How search is changing with AI answers, and what to do about it without starting over.',
      url: '', gated: true },
    { id: '30-day-planner', category: 'Social Media', format: 'Planner',
      title: '30-Day Social Media Content Planner',
      desc: 'A month of post ideas organized by purpose, so you always know what goes up next.',
      url: '', gated: true },
    { id: 'what-to-post', category: 'Social Media', format: 'Guide',
      title: "What to Post When You Don't Know What to Post",
      desc: 'Dependable post types that work for almost any business, with examples.',
      url: '', gated: false },
    { id: 'annual-calendar', category: 'Planning & Strategy', format: 'Template',
      title: 'Annual Marketing Calendar',
      desc: 'Map your year of promotions, seasons, and campaigns on one page.',
      url: '', gated: false },
    { id: 'campaign-template', category: 'Planning & Strategy', format: 'Template',
      title: 'Campaign Planning Template',
      desc: 'Goal, audience, offer, channels, timeline, and measurement, all in one place.',
      url: '', gated: false },
    { id: 'budget-worksheet', category: 'Planning & Strategy', format: 'Worksheet',
      title: 'Marketing Budget Worksheet',
      desc: 'Decide what to spend, where it goes, and what you expect it to return.',
      url: '', gated: false },
    { id: 'metrics-guide', category: 'Measurement', format: 'Guide',
      title: 'Small Business Marketing Metrics Guide',
      desc: 'The handful of numbers that matter, and the ones you can safely ignore.',
      url: '', gated: true },
    { id: 'utm-ga4', category: 'Measurement', format: 'Guide',
      title: 'UTM & GA4 Basics',
      desc: 'Track where your customers come from, without needing to become an analyst.',
      url: '', gated: false }
  ],

  /* ---------- Featured interactive tool (future) ---------- */
  featuredTool: {
    id: 'website-checkup',
    title: 'How healthy is your website?',
    desc: 'Take the 3-minute Website Marketing Checkup and get a short list of what to fix first.',
    url: ''
  },

  /* ---------- Tools & templates ----------
     kind: Template | Worksheet | Checklist | Calculator
     interactive: true for tools that run in the browser */
  tools: [
    { id: 'marketing-calendar', kind: 'Template', title: 'Marketing calendar', desc: 'Plan campaigns and promotions month by month.', url: '' },
    { id: 'content-calendar', kind: 'Template', title: 'Content calendar', desc: 'Schedule posts, emails, and articles in one view.', url: '' },
    { id: 'campaign-brief', kind: 'Template', title: 'Campaign brief', desc: 'Get everyone aligned before a campaign starts.', url: '' },
    { id: 'website-checklist', kind: 'Checklist', title: 'Website checklist', desc: 'Review your site the way a customer would.', url: '' },
    { id: 'social-worksheet', kind: 'Worksheet', title: 'Social media planning worksheet', desc: 'Choose your platforms, pillars, and posting rhythm.', url: '' },
    { id: 'budget-calculator', kind: 'Calculator', title: 'Marketing budget calculator', desc: 'Estimate a sensible budget from your revenue goals.', url: '', interactive: true },
    { id: 'persona-worksheet', kind: 'Worksheet', title: 'Customer persona worksheet', desc: 'Get clear on who you serve and what they need to hear.', url: '' },
    { id: 'gbp-checklist', kind: 'Checklist', title: 'Google Business Profile checklist', desc: 'Complete and optimize your profile for local search.', url: '' },
    { id: 'seo-aeo-checklist', kind: 'Checklist', title: 'SEO & AEO checklist', desc: 'Help search engines and AI assistants understand your business.', url: '' },
    { id: 'results-template', kind: 'Template', title: 'Campaign results template', desc: 'Report what happened and what to do next.', url: '' },
    { id: 'audit-checklist', kind: 'Checklist', title: 'Marketing audit checklist', desc: 'Take stock of everything you are doing today.', url: '' }
  ],

  /* ---------- Marketing Library articles ----------
     related: id of a guide or tool to recommend alongside it
     service: optional { label, href } for a gentle next step */
  articleCategories: ['Search', 'Social & Content', 'Website', 'Strategy', 'Measurement'],
  articles: [
    { id: 'seo-what-it-does', category: 'Search', title: 'What does SEO actually do for a small business?',
      excerpt: 'Less magic, more plumbing: how search visibility turns into phone calls.', url: '', related: 'local-seo' },
    { id: 'post-every-day', category: 'Social & Content', title: 'Do I really need to post on social media every day?',
      excerpt: 'Why consistency matters more than frequency, and how to pick a rhythm you can keep.', url: '', related: '30-day-planner' },
    { id: 'homepage-say', category: 'Website', title: 'What should my homepage say?',
      excerpt: 'The five questions every visitor is asking, and where to answer each one.', url: '', related: 'website-essentials',
      service: { label: 'Website help', href: 'services.html#websites' } },
    { id: 'how-much-spend', category: 'Strategy', title: 'How much should a small business spend on marketing?',
      excerpt: 'A practical way to set a budget, whatever stage you are at.', url: '', related: 'budget-worksheet' },
    { id: 'seo-vs-aeo-article', category: 'Search', title: "What's the difference between SEO and AEO?",
      excerpt: 'Search results and AI answers work differently. Here is what that means for you.', url: '', related: 'seo-vs-aeo' },
    { id: 'website-not-enough', category: 'Website', title: "Why having a website isn't enough",
      excerpt: 'A website is a tool, not a strategy. What it takes for yours to bring in business.', url: '', related: 'no-team-plan',
      service: { label: 'Ongoing support', href: 'services.html#ongoing' } },
    { id: 'track-ga', category: 'Measurement', title: 'What should I track in Google Analytics?',
      excerpt: 'Skip the 200 reports. These are the few numbers worth checking each month.', url: '', related: 'utm-ga4' },
    { id: 'testimonial-10', category: 'Social & Content', title: 'How to turn one customer testimonial into 10 pieces of content',
      excerpt: 'Get more mileage out of the proof you already have.', url: '', related: 'what-to-post' }
  ],

  /* ---------- "Not sure where to start?" paths ----------
     Each path recommends one guide, one tool, one article,
     and a related service. Use ids from the lists above. */
  paths: [
    { id: 'starting', label: "I'm starting my business", icon: 'seed',
      intro: 'Start with the fundamentals: who you serve, what makes you different, and the few channels worth your time.',
      guide: 'starter-guide', tool: 'persona-worksheet', article: 'website-not-enough',
      service: { label: 'Strategy & Planning', href: 'services.html#strategy' } },
    { id: 'customers', label: 'I need more customers', icon: 'people',
      intro: 'Make sure the people already searching for what you do can find you, trust you, and contact you.',
      guide: 'local-seo', tool: 'gbp-checklist', article: 'testimonial-10',
      service: { label: 'Campaigns & Customer Growth', href: 'services.html#campaigns' } },
    { id: 'website', label: 'My website needs work', icon: 'browser',
      intro: 'Focus on clarity and conversion first. Most websites need better messaging before they need a new design.',
      guide: 'website-essentials', tool: 'website-checklist', article: 'homepage-say',
      service: { label: 'Websites & Digital Presence', href: 'services.html#websites' } },
    { id: 'post', label: "I don't know what to post", icon: 'chat',
      intro: 'Pick a few content pillars and a realistic rhythm, and posting stops being a daily guessing game.',
      guide: 'what-to-post', tool: 'content-calendar', article: 'post-every-day',
      service: { label: 'Content, SEO & Visibility', href: 'services.html#content-seo' } },
    { id: 'plan', label: 'I need a marketing plan', icon: 'map',
      intro: 'A simple plan beats a perfect one. Set goals, choose channels, and put it on a calendar.',
      guide: 'no-team-plan', tool: 'marketing-calendar', article: 'how-much-spend',
      service: { label: 'Strategy & Planning', href: 'services.html#strategy' } },
    { id: 'working', label: "I don't know if my marketing is working", icon: 'chart',
      intro: 'Track a few numbers that connect to revenue, then check them on a regular schedule.',
      guide: 'metrics-guide', tool: 'results-template', article: 'track-ga',
      service: { label: 'Ongoing Marketing Support', href: 'services.html#ongoing' } }
  ]
};
