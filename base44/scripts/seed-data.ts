// Idempotent content seed for the 4x4models CMS.

const images = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_uZxJ55ZHov8fGYS1Fv_iE4Z8PTeUobJMAjRyMMHF5GTXjl5oGJvByQDO3cDfTsj0LbPACKMiPzT9MAOP0W0inVCtO3pZzF2ZfmIizNJP5tKvy9g_niE3dOUl9vGQKvv26LUL30ISrBBVWuixGJubPE6P2vXalQONKrVbNBWahoaFhcuYaLqWs39f3sJe6ZMNMQMfP0NoCrEikuuOLwaHmVdSIQbN8HmBj3jeyCotEchiJCS9ij6yP1bPkzxN2Qq0wSsna_p0ydQ",
  camp: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNRjZHZJa60Fc1DXSHTaItLVi0kbD2I9QPfRTABc2vnBNrWBlAqONJZveRAAmIcEXOaq-pWfwPy2QYFnPIW6DG5U7AhtAkVCVYs85NfOeXQbNP0S6kTlKu0LCnapOtFEJkOTfqtTx-tUs9ipoREkWy4UiccfoJj-KRspjPt2NbimkLw1Ut4TxQydkX-3eJS_Yuw0nHo_dUgs8855hNEAXPGHZ9LnNYgpLMB6RlRqIl5f8sw3MaAUZUD9P9_G9EXK-OIwjM3j7G9LE",
  workshop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFh0HM0cWIZFxyQVyZL27xPsGWEIjTKl0lOr0z6lSu3_yCHj3bVWmXtU-rvkxmNQ-azVwSWrQCo4Y842T6bhU-I777GUUZDqfJjx3puuYSWETtx7iNi5G2dft3xx4B69RCZ3o1_fdOJ-53fwLCEe4hHSL64MgFHc9219TulZrWJl2JlbwsOOMH0ZmXSmHV8AmBSXbwKlLklM6QgKOijOXFJNmL1G6mqjWL1QhUo1QftM_--VKH4Po2B-I2q7f-W4BZzJj3DpbhiU6N",
  dunes: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF5dhK-IX3wz1fwpS2bw7CJqcMmYJbhr1QnszuKBQGstDdp2zOlMsdmxHom8AnYeD8SBIshser7-40HQ9EqoRgXjCT7lyHu6kC1Jy2nT99q6OL5yfJv2OydygDhI1spJkaTPjySRCDPt3SpT0cpcyt22Q1y5Zz5nO3Lp-8MjMZuAx7K738dgv5b01VZXDL6ev89KyY3UiiztiJd87nClMW0eYSKLB8I6qVutlzjIudMhPXkDR0yAleYE48x7G-mne9vm4-Nt79a8WF",
  forest: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhSISQzUMdEmQpn2w9IvX005GlPw0S1VE8W7GBSbvRtj5h8uT1UZVH-_A8It9nccEFgxH2sxRWro3WZ21m1GuAXkCF97GuYGDtO7aZw6u-WF5CqqQdux_JVe_yJQmB7Iqtr1jk0Jsb3fbO3IoExSy2Cj1YzNdbncwvVNJK25dCZyoats0S2ZyQaC84ofDbLO_-9qFx1gT-lNxvSIBYt7vxo0qoEYtdvSaVK0JOHxIlf69m_8UpLrQR6lvkFvI36vVOMjUo4RfsijF0",
  battery: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeYvMc9rb6DaFWg_rOdCq6OlMK5lA98IWwbVf47KWFF6ycYC-uung_lfTjNZjhE6czhvN54Jgz_NtLzBpgeGHC-PmwHmeE9yHM7MhjLbm0Qa_Qn5Nz6-5EGg1EswKzu0juW1onDBWiKWcFOLmcukN6Fgdv8lFa-R8QBFK313fSSy5aEKXDcmjwVZ3LXG2kIwVcx4LDdbWMqRDLujNLyIfMRlkDaywNktyqxbqIt4cWjgpLYzIAvDLm_GW3xRTOwDXnyBnu8H14IrgA",
  tire: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVSdPhVCQwcqYhbXI9gFz_-iGtDaUSBTav6JCb81PoBRY6fijJkZpGpZ0VMYdaXZ2zdEIfnPgExLORwc3jTqQsR5v_Pl6bGvj99fA3dDxxp1djZnZNVGePYAYKJ48Yw_Fa0RPw82JVaEFYZ78Vrtuk0FVvlhcG8mLKZRHhEQBtQSUAoPXdrwRhYG5s3yO0Y_ztD6f6_RhPpViB-hJxYNhjSLLiqF8wUJghLnYUmkUx11vAxmsWIYhNKb_JMsBlRCGh4Y7iTg-kwybg",
  light: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnwuAoUQYBWqomJO3XPksrHwXJmZqdZj3KBauiASCP-mz7m8S5EyzG9l4Q0ERfMdiSn8aktCHzFb9JiRrAQ0sCvYaL-UqDfeD8hL9_Nh5NgKh16zcDWBUxD6J-Co-549xs8jAOTYU2MBSrAe5u0-d30lr8_vXkNqoNZwl6UYB6RtTKOOPwY6OsmwARjsQsYfjhwzoJ0H3PEdlxnUXDME_C2rvnEcJVwIOqrA6F_sS6A4FmB1ZNClPWPcXvEY16OxK3nkMjkSW75IjH",
  tracks: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-73OR-XfRGxOnOjVfkntd4Ru6tyDh7JUMUEzoGkIDLXMYkDwTWBQxBBY5CSkOrYgTmK_lKwwOQMz0OOKYL6PR2SCr9mmUgpMpkzAdObf7JVlCDcnXPiZ6WqctJwn7b1WWxYV9tToMQVapoyz6tjeuvAPphwxRymE9bRqlZeun2sf6eoebk_bkQf98sSFCzMpmFrD4Sh24AdcSmLd14qv_WlmyfhHG6WMg8wJeCpEvjLSccyJB1PcsaRkD-jNKu3lYckTtxh7OS_mW",
};

const categories = [
  { name: "Recovery", slug: "recovery", icon: "shield", description: "Winches, tracks and recovery essentials.", featured_image_url: images.tracks, status: "published", sort_order: 1 },
  { name: "Lighting", slug: "lighting", icon: "zap", description: "LED driving lights and trail visibility upgrades.", featured_image_url: images.light, status: "published", sort_order: 2 },
  { name: "Camping", slug: "camping", icon: "tent", description: "Shelter, storage and camp comfort.", featured_image_url: images.camp, status: "published", sort_order: 3 },
  { name: "Tires", slug: "tires", icon: "circle", description: "All-terrain tires and wheel accessories.", featured_image_url: images.tire, status: "published", sort_order: 4 },
  { name: "Electrical", slug: "electrical", icon: "battery", description: "Power systems, charging and camp electrics.", featured_image_url: images.battery, status: "published", sort_order: 5 },
].map((category) => ({
  ...category,
  seo_title: `${category.name} gear for 4x4 builds`,
  meta_description: category.description,
  content: `<p>${category.description}</p><p>Use this collection as a compact buying guide: start with the vehicle use case, check fitment and payload, then choose durable gear that solves one job well.</p>`,
  faq_items: [
    { question: `When should I buy ${category.name.toLowerCase()} gear?`, answer: "Buy after you know the terrain, vehicle payload and trip length you are building for." },
    { question: "How is this collection maintained?", answer: "Products and guide copy are managed from the admin catalog." },
  ],
  related_article_slugs: ["recovery-gear-pack-first", "first-5-upgrades", "compact-catalog-guide"],
}));

const vehicleSeeds = [
  ["Toyota", "Land Cruiser", "land-cruiser", "SUV", "Expedition ready", "The benchmark expedition platform.", 1, 59195, images.hero],
  ["Toyota", "4Runner", "4runner", "SUV", "Trailhunter", "New-generation trail SUV with real touring range.", 2, 45065, images.forest],
  ["Toyota", "Tacoma", "tacoma", "Pickup", "Field tested", "Compact pickup, huge build potential.", 3, 39995, images.camp],
  ["Toyota", "Hilux", "hilux", "Pickup", "Global icon", "Durable, global and ready to work.", 4, 36000, images.dunes],
  ["Lexus", "GX", "lexus-gx", "SUV", "Luxury crawler", "Premium comfort on a Prado-derived 4x4 platform.", 5, 67835, images.forest],
  ["Jeep", "Wrangler", "wrangler", "SUV", "Rock crawl", "The classic removable-roof trail reference.", 6, 38030, images.dunes],
  ["Jeep", "Gladiator", "gladiator", "Pickup", "Rubicon", "Open-air pickup character with Wrangler hardware.", 7, 54515, images.tracks],
  ["Jeep", "Grand Cherokee", "grand-cherokee", "SUV", "Overland", "Family comfort with available true 4WD systems.", 8, 42585, images.forest],
  ["Ford", "Bronco", "bronco", "SUV", "All-rounder", "A modern Wrangler rival with daily usability.", 9, 42790, images.dunes],
  ["Ford", "Ranger Raptor", "ranger-raptor", "Pickup", "Desert speed", "High-speed off-road pickup with serious suspension.", 10, 58965, images.dunes],
  ["Chevrolet", "Colorado ZR2", "colorado-zr2", "Pickup", "Technical trails", "Midsize truck tuned for rocks, ruts and rough trails.", 11, 52795, images.tracks],
  ["GMC", "Canyon AT4X", "canyon-at4x", "Pickup", "Premium pickup", "Luxury-leaning off-road truck with ZR2 bones.", 12, 59395, images.workshop],
  ["Land Rover", "Defender", "defender", "SUV", "Premium", "Modern comfort with serious terrain systems.", 13, 65350, images.forest],
  ["Ineos", "Grenadier", "grenadier", "SUV", "Mechanical", "Purpose-built premium 4x4 with honest hardware.", 14, 85995, images.hero],
  ["Mercedes-Benz", "G-Class", "g-class", "SUV", "Icon", "Luxury status with real ladder-frame capability.", 15, 148250, images.workshop],
  ["Suzuki", "Jimny", "jimny", "SUV", "Lightweight", "Small, simple and loved where trails get tight.", 16, 28000, images.forest],
  ["Nissan", "Patrol", "patrol", "SUV", "Desert proven", "Big-capacity touring SUV with deep regional loyalty.", 17, 58000, images.dunes],
  ["Nissan", "Frontier Pro-4X", "frontier-pro-4x", "Pickup", "Value pick", "Simple midsize truck with factory off-road hardware.", 18, 39990, images.tracks],
  ["Mitsubishi", "Triton", "triton", "Pickup", "Global pickup", "Work-ready global truck for practical touring.", 19, 36000, images.camp],
  ["Mitsubishi", "Pajero Sport", "pajero-sport", "SUV", "Family tourer", "Body-on-frame SUV based on proven pickup roots.", 20, 42000, images.forest],
  ["Isuzu", "D-Max", "d-max", "Pickup", "Diesel utility", "Efficient diesel pickup favored for remote work.", 21, 35000, images.workshop],
  ["Rivian", "R1T", "rivian-r1t", "Electric", "EV truck", "Electric adventure pickup with clever storage and torque.", 22, 69900, images.battery],
  ["Rivian", "R1S", "rivian-r1s", "Electric", "EV SUV", "Three-row electric SUV with real trail modes.", 23, 75900, images.battery],
  ["Scout", "Traveler", "scout-traveler", "Coming soon", "Watchlist", "Upcoming electric 4x4 to watch for future builds.", 24, 60000, images.hero],
  ["Jeep", "Recon", "recon", "Coming soon", "Watchlist", "Electric Wrangler-adjacent concept for future trail buyers.", 25, 60000, images.battery],
];

const vehicles = vehicleSeeds.map(([brand, name, slug, segment, badge, tagline, rank, price, image]) => ({
  brand,
  name,
  slug,
  segment,
  badge,
  tagline,
  market_region: segment === "Coming soon" ? "Future" : "Global",
  trending_rank: rank,
  price_from: price,
  use_cases: segment === "Pickup" ? ["overland", "gear hauling", "trail weekends"] : ["overland", "trail touring", "daily adventure"],
  hero_headline: `${brand} ${name}`,
  hero_body: `${tagline} Managed as a compact, research-friendly 4x4 model page with specs, pros, watch points and build direction.`,
  description: `${brand} ${name} is included because it is a relevant current 4x4 platform for buyers comparing capability, aftermarket support and real-world touring use.`,
  hero_image_url: image,
  featured_image_url: image,
  hero_image_alt: `${brand} ${name} 4x4 model`,
  featured_image_alt: `${brand} ${name} 4x4 model`,
  cta_primary_text: "Explore setup",
  cta_primary_url: "#series",
  cta_secondary_text: "View specs",
  cta_secondary_url: "#specs",
  gallery_images: [{ url: image, alt: `${brand} ${name}` }],
  series: [{ id: slug, name, slug, badge, description: `${segment} platform for compact comparison and build planning.`, image_url: image, cta_text: "Review setup" }],
  pros: ["Relevant current 4x4 platform", "Strong enthusiast interest", "Clear upgrade path"],
  cons: ["Final build depends on payload and market availability", "Pricing and trims vary by region"],
  specs: [
    { feature: "Brand", value: brand },
    { feature: "Segment", value: segment },
    { feature: "Best use", value: segment === "Coming soon" ? "Watchlist" : "Trail and travel builds" },
  ],
  seo_title: `${brand} ${name} 4x4 guide`,
  meta_description: `${brand} ${name} specs, strengths, watch points and build direction for 4x4 buyers.`,
  faq_items: [
    { question: `Is the ${brand} ${name} good for overlanding?`, answer: "Use case, payload and market specification matter most; start with the specs and build only what the trip requires." },
    { question: "Can I link gear and articles to this model?", answer: "Yes, related product and journal slugs can be managed in the admin." },
  ],
  related_product_slugs: ["tactical-recovery-tracks", "complete-dual-battery-kit", "premium-rooftop-tent"],
  related_article_slugs: ["first-5-upgrades", "compact-catalog-guide", "used-4x4-buying-checklist"],
  sort_order: rank,
  status: "published",
}));

const articleTopics = [
  ["bronco-vs-wrangler", "Ford Bronco vs Jeep Wrangler", "Ford Bronco vs Jeep Wrangler: which trail icon fits your build?", "TRAILS", images.dunes],
  ["land-cruiser-vs-defender", "Land Cruiser vs Defender", "Toyota Land Cruiser vs Land Rover Defender for premium touring.", "EXPEDITION", images.hero],
  ["best-midsize-off-road-trucks", "Best midsize off-road trucks", "Colorado ZR2, Canyon AT4X, Ranger Raptor, Gladiator and Tacoma compared.", "TECH", images.tracks],
  ["recovery-gear-pack-first", "Recovery gear to pack first", "The recovery basics every 4x4 should carry before the first trail day.", "GEAR", images.tracks],
  ["tire-size-without-ruining-the-build", "Tire size without ruining the build", "How to choose useful tire upgrades without killing range or gearing.", "TECH", images.tire],
  ["rooftop-tent-vs-ground-tent", "Rooftop tent vs ground tent", "A practical camping comparison for weekend and long-distance 4x4 trips.", "GEAR", images.camp],
  ["payload-mistakes", "Payload mistakes that break builds", "Why weight planning matters more than the next accessory.", "MAINTENANCE", images.workshop],
  ["electric-off-roaders", "Electric off-roaders to watch", "Rivian, Scout and Jeep Recon show where electric 4x4s are heading.", "TECH", images.battery],
  ["used-4x4-buying-checklist", "Used 4x4 buying checklist", "What to inspect before buying a used trail or overland platform.", "MAINTENANCE", images.forest],
  ["ranger-raptor-build-plan", "Ranger Raptor build plan", "A compact, fast-trail setup for Ford's desert-focused midsize truck.", "EXPEDITION", images.dunes],
  ["jimny-lightweight-build", "Jimny lightweight build", "How to keep a small 4x4 useful without overloading it.", "TRAILS", images.forest],
  ["family-overland-platforms", "Family overland platforms", "The SUVs that make long weekends easier with passengers and gear.", "EXPEDITION", images.camp],
  ["dual-battery-basics", "Dual battery basics", "A simple way to size power for fridge, lighting and charging.", "TECH", images.battery],
  ["compact-catalog-guide", "How to compare 4x4 platforms", "A faster way to shortlist models by use case, size and upgrade path.", "GEAR", images.hero],
  ["trail-lighting-guide", "Trail lighting guide", "Where auxiliary lighting helps and where it only adds clutter.", "GEAR", images.light],
  ["first-5-upgrades", "The first 5 upgrades", "Tires, recovery, protection, storage and power before cosmetic parts.", "GEAR", images.workshop],
];

const articles = articleTopics.flatMap(([slug, title, excerpt, category, image], index) => [
  {
    locale: "en",
    title,
    slug,
    excerpt,
    content: `<p>${excerpt}</p><p>Start with the use case, then compare size, payload, drivetrain, aftermarket support and maintenance. A good 4x4 build stays focused before it gets expensive.</p>`,
    journal_category: category,
    status: "published",
    featured_image_url: image,
    featured_image_alt: title,
    author: "4x4models Editorial",
    author_role: "Field editor",
    read_time: "6 min read",
    published_at: new Date(Date.UTC(2026, 4, index + 1, 8)).toISOString(),
    related_vehicle_slugs: ["land-cruiser", "bronco", "wrangler"],
    related_product_slugs: ["tactical-recovery-tracks", "complete-dual-battery-kit"],
  },
  {
    locale: "nl",
    title,
    slug,
    excerpt: `${excerpt} Nederlandse editie.`,
    content: `<p>${excerpt} Nederlandse editie.</p><p>Begin bij het gebruiksdoel en vergelijk daarna formaat, laadvermogen, aandrijving, aftermarket en onderhoud. Een goede 4x4 build blijft eerst gefocust.</p>`,
    journal_category: category,
    status: "published",
    featured_image_url: image,
    featured_image_alt: title,
    author: "4x4models Editorial",
    author_role: "Field editor",
    read_time: "6 min read",
    published_at: new Date(Date.UTC(2026, 4, index + 1, 8)).toISOString(),
    related_vehicle_slugs: ["land-cruiser", "bronco", "wrangler"],
    related_product_slugs: ["tactical-recovery-tracks", "complete-dual-battery-kit"],
  },
]);

const products = [
  {
    title: "Heavy-Duty Recovery Winch 12000lb",
    slug: "heavy-duty-winch-12000lb",
    excerpt: "Waterproof recovery winch with synthetic rope, wireless remote and a compact control box.",
    content: "<p>A dependable winch for self-recovery, built for trail work and bad-weather use.</p>",
    category: "Recovery",
    product_type: "Recovery",
    price: 899,
    sale_price: 849,
    rating: 4.8,
    reviews_count: 124,
    sku: "REC-WINCH-12000",
    stock: 18,
    status: "published",
    is_product: true,
    featured_image_url: images.workshop,
    featured_image_alt: "Heavy duty recovery winch",
    product_images: [{ url: images.workshop, alt: "Heavy duty recovery winch" }],
    vendor: "4x4models",
    track_inventory: true,
  },
  {
    title: "Tactical Recovery Tracks",
    slug: "tactical-recovery-tracks",
    excerpt: "Reinforced traction boards for sand, mud and snow, with aggressive tread and carry handles.",
    content: "<p>Light enough to move quickly and strong enough for repeated recovery use.</p>",
    category: "Recovery",
    product_type: "Recovery boards",
    price: 249,
    rating: 4.7,
    reviews_count: 89,
    sku: "REC-TRACKS-BLK",
    stock: 40,
    status: "published",
    is_product: true,
    featured_image_url: images.tracks,
    featured_image_alt: "Recovery tracks in desert sand",
    product_images: [{ url: images.tracks, alt: "Recovery tracks in desert sand" }],
    vendor: "4x4models",
    track_inventory: true,
  },
  {
    title: "Premium Rooftop Tent",
    slug: "premium-rooftop-tent",
    excerpt: "Fast-deploy hard-shell rooftop tent for two adults, built for all-season travel.",
    content: "<p>A low-profile rooftop tent with quick setup, durable shell and comfortable interior.</p>",
    category: "Camping",
    product_type: "Shelter",
    price: 1899,
    rating: 4.8,
    reviews_count: 67,
    sku: "CAMP-RTT-PRO",
    stock: 8,
    status: "published",
    is_product: true,
    featured_image_url: images.camp,
    featured_image_alt: "Rooftop tent on a trail vehicle",
    product_images: [{ url: images.camp, alt: "Rooftop tent on a trail vehicle" }],
    vendor: "4x4models",
    track_inventory: true,
  },
  {
    title: "Complete Dual Battery Kit",
    slug: "complete-dual-battery-kit",
    excerpt: "DC-DC charger, lithium battery and wiring essentials for reliable camp power.",
    content: "<p>A complete electrical foundation for fridges, lights and charging on multi-day trips.</p>",
    category: "Electrical",
    product_type: "Electrical",
    price: 599,
    rating: 4.5,
    reviews_count: 124,
    sku: "ELEC-DBK-100",
    stock: 21,
    status: "published",
    is_product: true,
    featured_image_url: images.battery,
    featured_image_alt: "Dual battery system installation",
    product_images: [{ url: images.battery, alt: "Dual battery system installation" }],
    vendor: "4x4models",
    track_inventory: true,
  },
].map((product) => ({
  ...product,
  seo_title: `${product.title} for 4x4 builds`,
  meta_description: product.excerpt,
  faq_items: [
    { question: "How do I choose the right setup?", answer: "Start with vehicle fitment, payload, trip length and terrain before adding accessories." },
    { question: "Where is this product managed?", answer: "Product copy, images, stock and related links are managed from the admin catalog." },
  ],
  options: product.slug === "tactical-recovery-tracks" ? [
    { name: "Color", type: "color", values: [{ label: "Black" }, { label: "Sand" }] },
  ] : undefined,
  related_vehicle_slugs: ["land-cruiser", "tacoma", "bronco"],
  related_article_slugs: ["recovery-gear-pack-first", "first-5-upgrades", "compact-catalog-guide"],
}));

const globalContent = {
  en: [
    ["brand", "name", "4x4models"],
    ["brand", "logo", "", "", "/images/logo.png"],
    ["nav", "vehicles", "Vehicles"],
    ["nav", "gear", "Gear"],
    ["nav", "journal", "Journal"],
    ["nav", "shop", "Shop"],
    ["nav", "sign_in", "Sign in"],
    ["nav", "sign_out", "Sign out"],
    ["footer", "tagline", "Premium 4x4 model research, gear and field-tested stories."],
    ["footer", "copyright", "Copyright 2026 4x4models. All rights reserved."],
    ["footer", "explore", "Explore"],
    ["footer", "support", "Support"],
    ["footer", "legal", "Legal"],
    ["footer", "about", "About"],
    ["footer", "contact", "Contact"],
    ["footer", "faq", "FAQ"],
    ["footer", "privacy", "Privacy policy"],
    ["footer", "terms", "Terms of service"],
  ],
  nl: [
    ["brand", "name", "4x4models"],
    ["brand", "logo", "", "", "/images/logo.png"],
    ["nav", "vehicles", "Modellen"],
    ["nav", "gear", "Gear"],
    ["nav", "journal", "Journal"],
    ["nav", "shop", "Shop"],
    ["nav", "sign_in", "Inloggen"],
    ["nav", "sign_out", "Uitloggen"],
    ["footer", "tagline", "Premium 4x4 modelresearch, gear en geteste verhalen."],
    ["footer", "copyright", "Copyright 2026 4x4models. Alle rechten voorbehouden."],
    ["footer", "explore", "Ontdek"],
    ["footer", "support", "Support"],
    ["footer", "legal", "Juridisch"],
    ["footer", "about", "Over ons"],
    ["footer", "contact", "Contact"],
    ["footer", "faq", "FAQ"],
    ["footer", "privacy", "Privacybeleid"],
    ["footer", "terms", "Voorwaarden"],
  ],
};

function textRecords(locale) {
  const l = locale === "nl";
  return [
    ...globalContent[locale].map(([section, key, value, value_long = "", image_url = "", link_url = ""]) => ({ page: "global", locale, section, key, value, value_long, image_url, link_url })),
    { page: "cart", locale, section: "empty", key: "title", value: l ? "Je winkelwagen is leeg" : "Your cart is empty" },
    { page: "cart", locale, section: "empty", key: "cta", value: l ? "Bekijk gear" : "Browse gear" },
    { page: "cart", locale, section: "cart", key: "title", value: l ? "Je winkelwagen" : "Your cart" },
    { page: "cart", locale, section: "summary", key: "title", value: l ? "Orderoverzicht" : "Order summary" },
    { page: "cart", locale, section: "summary", key: "subtotal", value: l ? "Subtotaal" : "Subtotal" },
    { page: "cart", locale, section: "summary", key: "shipping", value: l ? "Verzending" : "Shipping" },
    { page: "cart", locale, section: "summary", key: "free", value: l ? "Gratis" : "Free" },
    { page: "cart", locale, section: "summary", key: "total", value: "Total" },
    { page: "cart", locale, section: "summary", key: "checkout", value: l ? "Naar afrekenen" : "Proceed to checkout" },
    { page: "checkout", locale, section: "hero", key: "title", value: l ? "Veilig afrekenen" : "Secure checkout" },
    { page: "checkout", locale, section: "hero", key: "intro", value: l ? "Controleer je order en betaal veilig online." : "Review your order and pay securely online." },
    { page: "checkout", locale, section: "form", key: "title", value: l ? "Contact en levering" : "Contact and delivery" },
    { page: "checkout", locale, section: "summary", key: "title", value: l ? "Orderoverzicht" : "Order summary" },
    { page: "checkout", locale, section: "summary", key: "subtotal", value: l ? "Subtotaal" : "Subtotal" },
    { page: "checkout", locale, section: "summary", key: "shipping", value: l ? "Verzending" : "Shipping" },
    { page: "checkout", locale, section: "summary", key: "tax", value: "Tax" },
    { page: "checkout", locale, section: "summary", key: "total", value: "Total" },
    { page: "checkout", locale, section: "summary", key: "complete", value: l ? "Bestelling afronden" : "Complete purchase" },
    { page: "order-confirmed", locale, section: "hero", key: "title", value: l ? "Bestelling bevestigd" : "Order confirmed" },
    { page: "order-confirmed", locale, section: "hero", key: "body", value: l ? "Je order is opgeslagen en klaar voor opvolging." : "Your order is saved and ready for follow-up." },
    { page: "order-confirmed", locale, section: "hero", key: "cta", value: l ? "Verder winkelen" : "Continue shopping" },
    { page: "product-detail", locale, section: "trust", key: "checkout", value: l ? "Veilig afrekenen" : "Secure checkout" },
    { page: "product-detail", locale, section: "trust", key: "curated", value: l ? "Geselecteerde gear" : "Curated gear" },
    { page: "vehicle-detail", locale, section: "series", key: "headline", value: l ? "Series en varianten" : "Series and variants" },
    { page: "vehicle-detail", locale, section: "specs", key: "headline", value: l ? "Specificaties" : "Technical specs" },
    { page: "vehicle-detail", locale, section: "pros_cons", key: "pros_title", value: l ? "Sterk" : "Strengths" },
    { page: "vehicle-detail", locale, section: "pros_cons", key: "cons_title", value: l ? "Let op" : "Watch points" },
    { page: "vehicle-detail", locale, section: "journal", key: "headline", value: l ? "Laatste uit de journal" : "Latest from the journal" },
    { page: "vehicle-detail", locale, section: "journal", key: "cta", value: l ? "Alles bekijken" : "View all" },
  ].map((record, index) => ({ ...record, sort_order: index + 1, notes: "Premium CMS seed" }));
}

function puckData(page, locale) {
  const l = locale === "nl";
  const path = (target) => `/${locale}${target}`;
  const common = {
    home: {
      root: { props: { title: "Home" } },
      content: [
        { type: "Hero", props: { id: "home-hero", icon: "compass", eyebrow: l ? "Gemaakt voor de trail" : "Built for the trail", title: l ? "4x4 modellen, gear en verhalen op een plek" : "4x4 models, gear and stories in one place", body: l ? "Ontdek sterke platforms, praktische upgrades en geteste adviezen in een premium 4x4 hub." : "Explore capable platforms, practical upgrades and field-tested advice in one premium 4x4 hub.", imageUrl: images.hero, imageAlt: "4x4models", overlay: "dark", align: "left", height: "standard", primaryText: l ? "Ontdek modellen" : "Explore models", primaryUrl: path("/vehicles"), secondaryText: l ? "Shop gear" : "Shop gear", secondaryUrl: path("/gear") } },
        { type: "VehicleIndex", props: { id: "home-vehicles", icon: "shield", eyebrow: "4x4", title: l ? "Uitgelichte platforms" : "Featured platforms", body: l ? "Open de modellen die de catalogus dragen." : "Open the models that define the catalog.", layout: "compact", showImages: true, defaultImageUrl: images.hero, defaultImageAlt: "4x4 platform", background: "surface", cards: [] } },
        { type: "PhotoTextBlock", props: { id: "home-story", eyebrow: l ? "Klaar voor de volgende build" : "Ready for the next build", title: l ? "Van inspiratie naar onderdelenlijst" : "From inspiration to parts list", body: l ? "Combineer modelresearch, productontdekking en journal-inzicht in dezelfde beheerbare ervaring." : "Combine model research, product discovery and journal insight without leaving the same managed experience.", imageUrl: images.camp, imageAlt: "Trail-ready 4x4", ctaLabel: l ? "Lees de journal" : "Read the journal", ctaUrl: path("/journal"), background: "raised", align: "left" } },
        { type: "ProductGrid", props: { id: "home-products", eyebrow: "Shop", title: l ? "Uitgelichte gear" : "Featured gear", body: l ? "Geselecteerde producten voor sterke, georganiseerde builds." : "Selected products for capable, organized builds.", cards: [], limit: 4, columns: 4, showImages: true, defaultImageUrl: images.workshop, defaultImageAlt: "4x4 gear", background: "muted", cta: { label: l ? "Shop alles" : "Shop all", url: path("/gear") } } },
        { type: "ArticleGrid", props: { id: "home-articles", eyebrow: "Journal", title: l ? "Uit de journal" : "From the journal", body: l ? "Nieuwe veldnotities en praktische buildtips." : "Fresh field notes and practical build advice.", cards: [], limit: 3, columns: 3, showImages: true, defaultImageUrl: images.camp, defaultImageAlt: "Journal", background: "surface", cta: { label: l ? "Bekijk journal" : "View journal", url: path("/journal") } } },
        { type: "Newsletter", props: { id: "home-newsletter", icon: "sparkles", title: l ? "Ontvang de trail update" : "Get the trail dispatch", body: l ? "Af en toe buildnotities, productkeuzes en praktische gidsen." : "Occasional build notes, product picks and practical guides.", placeholder: l ? "Vul je e-mail in" : "Enter your email", buttonText: l ? "Inschrijven" : "Subscribe", background: "raised" } },
      ],
    },
    vehicles: {
      root: { props: { title: "Vehicles" } },
      content: [
        { type: "Hero", props: { id: "vehicles-hero", icon: "compass", eyebrow: l ? "Modelcatalogus" : "Model directory", title: l ? "Vind het juiste 4x4 platform" : "Find the right 4x4 platform", body: l ? "Compacte index met actuele 4x4 modellen, merken, trending keuzes en journal-links." : "A compact index of current 4x4 models, brands, trending picks and journal links.", imageUrl: images.hero, imageAlt: "4x4 model catalog", overlay: "dark", align: "left", height: "compact", primaryText: l ? "Bekijk modellen" : "Browse models", primaryUrl: "#vehicles-index", secondaryText: l ? "Lees journal" : "Read journal", secondaryUrl: path("/journal") } },
        { type: "VehicleIndex", props: { id: "vehicles-index", icon: "grid", eyebrow: l ? "Alle modellen" : "All models", title: l ? "4x4 modelindex" : "4x4 model index", body: l ? "Een snel overzicht per merk, gesorteerd op trending en eenvoudig scanbaar op mobiel." : "A fast brand-led index sorted by trending rank and easy to scan on mobile.", layout: "compact", showImages: true, defaultImageUrl: images.workshop, defaultImageAlt: "4x4 model", background: "surface", cards: [] } },
        { type: "TextPhotoBlock", props: { id: "vehicles-guidance", eyebrow: l ? "Kies met zekerheid" : "Choose with confidence", title: l ? "Gemaakt om echte capaciteit te vergelijken" : "Built for comparing real capability", body: l ? "Elke modelpagina kan series, specs, pluspunten, aandachtspunten, beeld en acties bevatten." : "Every model page can hold series, specs, pros, cons, imagery and calls to action.", imageUrl: images.camp, imageAlt: "Overland camp", ctaLabel: l ? "Open de journal" : "Open the journal", ctaUrl: path("/journal"), background: "raised", align: "left" } },
        { type: "ArticleGrid", props: { id: "vehicles-journal", eyebrow: "Journal", title: l ? "Meest gelezen" : "Most read", body: l ? "Populaire gidsen en veldnotities voor kiezen en verbeteren." : "Popular guides and field notes for choosing and improving your rig.", cards: [], limit: 3, columns: 3, showImages: true, defaultImageUrl: images.hero, defaultImageAlt: "Journal", background: "surface", cta: { label: l ? "Alles bekijken" : "View all", url: path("/journal") } } },
      ],
    },
    journal: {
      root: { props: { title: "Journal" } },
      content: [
        { type: "Hero", props: { id: "journal-hero", icon: "book", eyebrow: "Journal", title: l ? "Veldnotities, gidsen en buildverhalen" : "Field notes, guides and build stories", body: l ? "Lees praktische verhalen voor betere traildagen, slimmere upgrades en strakkere voorbereiding." : "Read practical stories for better trail days, smarter upgrades and cleaner preparation.", imageUrl: images.camp, imageAlt: "4x4 journal", overlay: "dark", align: "left", height: "standard", primaryText: l ? "Laatste verhalen" : "Latest stories", primaryUrl: "#journal-articles", secondaryText: l ? "Shop gear" : "Shop gear", secondaryUrl: path("/gear") } },
        { type: "ArticleGrid", props: { id: "journal-articles", eyebrow: "Journal", title: l ? "Laatste artikelen" : "Latest articles", body: l ? "Bekijk de nieuwste gidsen, reisverslagen en werkplaatsnotities." : "Browse the newest guides, trip reports and workshop notes.", cards: [], limit: 12, columns: 3, showImages: true, defaultImageUrl: images.hero, defaultImageAlt: "Journal", background: "surface", cta: { label: "", url: "" } } },
      ],
    },
    gear: {
      root: { props: { title: "Gear" } },
      content: [
        { type: "Hero", props: { id: "gear-hero", icon: "package", eyebrow: l ? "Gear en upgrades" : "Gear and upgrades", title: l ? "Premium uitrusting voor sterke builds" : "Premium kit for capable builds", body: l ? "Shop zorgvuldig gekozen recovery, verlichting, camping en werkplaatsgear uit de catalogus." : "Shop curated recovery, lighting, camping and workshop gear managed from the catalog.", imageUrl: images.workshop, imageAlt: "4x4 gear", overlay: "dark", align: "left", height: "standard", primaryText: l ? "Shop gear" : "Shop gear", primaryUrl: "#gear-products", secondaryText: l ? "Modelcatalogus" : "Model catalog", secondaryUrl: path("/vehicles") } },
        { type: "ProductGrid", props: { id: "gear-products", eyebrow: "Shop", title: l ? "Productcatalogus" : "Product catalog", body: l ? "Een compact overzicht van actieve producten, met elke kaart beheerd vanuit de catalogus." : "A compact overview of active products, with every card managed from the catalog.", cards: [], limit: 12, columns: 3, showImages: true, defaultImageUrl: images.workshop, defaultImageAlt: "4x4 product", background: "muted", cta: { label: "", url: "" } } },
      ],
    },
  };
  return common[page];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry(operation) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const status = error?.status || error?.originalError?.response?.status;
      if (status !== 429 || attempt === 3) throw error;
      await sleep((attempt + 1) * 30000);
    }
  }
}

async function upsert(entityName, query, data) {
  const entity = base44.entities[entityName];
  const records = await withRetry(() => entity.filter(query, "-updated_date", 1, 0));
  if (records?.[0]?.id) {
    await withRetry(() => entity.update(records[0].id, data));
    return { action: "updated", id: records[0].id };
  }
  const created = await withRetry(() => entity.create(data));
  return { action: "created", id: created?.id };
}

async function seed() {
  console.log("Seeding premium CMS content...");

  for (const category of categories) {
    await upsert("ProductCategory", { slug: category.slug }, category);
  }

  for (const vehicle of vehicles) {
    await upsert("Vehicle", { slug: vehicle.slug }, vehicle);
  }

  for (const article of articles) {
    await upsert("BlogPost", { slug: article.slug, locale: article.locale, is_product: false }, { ...article, is_product: false });
  }

  for (const product of products) {
    await upsert("BlogPost", { slug: product.slug, is_product: true }, product);
  }

  for (const locale of ["en", "nl"]) {
    for (const record of textRecords(locale)) {
      await upsert("SiteContent", { page: record.page, section: record.section, key: record.key, locale }, record);
    }

    for (const page of ["home", "vehicles", "journal", "gear"]) {
      await upsert(
        "SiteContent",
        { page, section: "puck", key: "data", locale },
        {
          page,
          locale,
          section: "puck",
          key: "data",
          value: `CMS page: ${page}/${locale}`,
          value_long: JSON.stringify(puckData(page, locale)),
          notes: "Premium page builder seed",
        }
      );
    }
  }

  for (const [key, url] of Object.entries(images)) {
    await upsert("SiteContent", { page: "media", section: "library", key: `seed-${key}`, locale: "en" }, {
      page: "media",
      locale: "en",
      section: "library",
      key: `seed-${key}`,
      value: `Seed image ${key}`,
      value_long: `4x4models ${key}`,
      image_url: url,
      notes: "Premium media seed",
    });
  }

  console.log("Premium CMS seed complete.");
}

await seed();
