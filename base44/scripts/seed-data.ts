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
];

const vehicles = [
  {
    name: "Land Cruiser",
    slug: "land-cruiser",
    tagline: "The benchmark expedition platform.",
    badge: "Expedition ready",
    hero_headline: "Toyota Land Cruiser",
    hero_body: "A proven 4x4 platform with the durability, comfort and aftermarket depth needed for long-distance adventure.",
    description: "The Land Cruiser is the reference point for serious travel builds: strong drivetrains, deep parts support and a calm feel over rough ground.",
    hero_image_url: images.hero,
    featured_image_url: images.hero,
    hero_image_alt: "Toyota Land Cruiser on a remote trail",
    cta_primary_text: "Explore series",
    cta_primary_url: "#series",
    cta_secondary_text: "View specs",
    cta_secondary_url: "#specs",
    series: [
      { id: "lc-300", name: "300 Series", slug: "300-series", badge: "Modern flagship", description: "Refined, powerful and well suited to premium touring builds.", image_url: images.hero, cta_text: "Review setup" },
      { id: "lc-70", name: "70 Series", slug: "70-series", badge: "Heritage workhorse", description: "Mechanical, durable and loved for remote work.", image_url: images.forest, cta_text: "Review setup" },
    ],
    pros: ["Excellent long-range reliability", "Strong aftermarket ecosystem", "Comfortable at highway and trail pace"],
    cons: ["Premium purchase price", "Weight needs careful payload planning"],
    specs: [
      { feature: "Drivetrain", value: "Full-time or part-time 4WD" },
      { feature: "Best use", value: "Expedition touring" },
      { feature: "Build focus", value: "Suspension, protection, storage" },
    ],
    sort_order: 1,
    status: "published",
  },
  {
    name: "Tacoma",
    slug: "tacoma",
    tagline: "Compact pickup, huge build potential.",
    badge: "Field tested",
    hero_headline: "Toyota Tacoma",
    hero_body: "A practical midsize pickup platform for weekend trails, camping systems and modular overland builds.",
    description: "Tacoma builds shine when they stay light, organized and focused on flexible travel.",
    hero_image_url: images.camp,
    featured_image_url: images.camp,
    hero_image_alt: "Toyota Tacoma with rooftop tent",
    cta_primary_text: "Explore setup",
    cta_primary_url: "#series",
    cta_secondary_text: "View specs",
    cta_secondary_url: "#specs",
    series: [{ id: "tacoma-trd", name: "TRD Off-Road", slug: "trd-off-road", badge: "Trail base", description: "A smart starting point for practical, capable builds.", image_url: images.camp, cta_text: "Review setup" }],
    pros: ["Huge aftermarket support", "Easy to park and live with", "Great for modular storage systems"],
    cons: ["Payload disappears quickly", "Cabin space is tighter than full-size trucks"],
    specs: [
      { feature: "Body", value: "Midsize pickup" },
      { feature: "Best use", value: "Weekend overland" },
      { feature: "Build focus", value: "Weight control, storage, tires" },
    ],
    sort_order: 2,
    status: "published",
  },
  {
    name: "Hilux",
    slug: "hilux",
    tagline: "Durable, global and ready to work.",
    badge: "Heritage",
    hero_headline: "Toyota Hilux",
    hero_body: "A globally respected pickup platform with dependable engineering and practical load-carrying ability.",
    description: "Hilux builds are at their best when they combine practical protection, sensible suspension and reliable camp power.",
    hero_image_url: images.dunes,
    featured_image_url: images.dunes,
    hero_image_alt: "Toyota Hilux in desert terrain",
    cta_primary_text: "Explore setup",
    cta_primary_url: "#series",
    cta_secondary_text: "View specs",
    cta_secondary_url: "#specs",
    series: [{ id: "hilux-double-cab", name: "Double Cab", slug: "double-cab", badge: "Travel ready", description: "A balanced platform for people, tools and travel systems.", image_url: images.dunes, cta_text: "Review setup" }],
    pros: ["Global parts availability", "Strong commercial-duty reputation", "Excellent diesel touring base"],
    cons: ["Ride quality depends heavily on suspension setup", "Rear storage needs planning"],
    specs: [
      { feature: "Body", value: "Midsize pickup" },
      { feature: "Best use", value: "Remote touring" },
      { feature: "Build focus", value: "Suspension, canopy, electrical" },
    ],
    sort_order: 3,
    status: "published",
  },
  {
    name: "Defender",
    slug: "defender",
    tagline: "Modern comfort with serious terrain systems.",
    badge: "Premium",
    hero_headline: "Land Rover Defender",
    hero_body: "A modern adventure platform with strong comfort, technology and all-weather confidence.",
    description: "The Defender suits premium travel builds that prioritize comfort, traction systems and clean integration.",
    hero_image_url: images.forest,
    featured_image_url: images.forest,
    hero_image_alt: "Modern Defender on forest trail",
    cta_primary_text: "Explore setup",
    cta_primary_url: "#series",
    cta_secondary_text: "View specs",
    cta_secondary_url: "#specs",
    series: [{ id: "defender-110", name: "Defender 110", slug: "110", badge: "Touring sweet spot", description: "Long enough for travel systems while staying manageable on tight trails.", image_url: images.forest, cta_text: "Review setup" }],
    pros: ["Comfortable and composed", "Strong traction technology", "Great daily usability"],
    cons: ["Complex electronics", "Accessory choices should be deliberate"],
    specs: [
      { feature: "Body", value: "SUV" },
      { feature: "Best use", value: "Premium touring" },
      { feature: "Build focus", value: "Protection, storage, electronics" },
    ],
    sort_order: 4,
    status: "published",
  },
];

const articles = [
  {
    title: "Building a Lean Overland Setup",
    slug: "lean-overland-setup",
    excerpt: "A practical guide to choosing only the upgrades that improve capability, comfort and reliability.",
    content: "<p>A great 4x4 build starts with restraint. Start with tires, recovery, protection and storage before chasing every accessory.</p><p>Keep weight low, test one change at a time and let real trips guide the next upgrade.</p>",
    journal_category: "GEAR",
    status: "published",
    featured_image_url: images.camp,
    featured_image_alt: "Overland camp setup beside a 4x4",
    author: "4x4models Editorial",
    author_role: "Field editor",
    read_time: "6 min read",
    published_at: "2026-05-01T08:00:00.000Z",
  },
  {
    title: "Recovery Gear You Should Pack First",
    slug: "recovery-gear-pack-first",
    excerpt: "The recovery items that belong in every vehicle before winches, bumpers and big-ticket upgrades.",
    content: "<p>Reliable recovery starts with the basics: rated points, soft shackles, traction boards, gloves and a simple plan.</p><p>Train with the gear before you need it, and keep everything accessible.</p>",
    journal_category: "TRAILS",
    status: "published",
    featured_image_url: images.tracks,
    featured_image_alt: "Recovery tracks in sand",
    author: "4x4models Editorial",
    author_role: "Trail editor",
    read_time: "5 min read",
    published_at: "2026-05-03T08:00:00.000Z",
  },
  {
    title: "How to Plan Electrical Loads",
    slug: "plan-electrical-loads",
    excerpt: "A clear way to size batteries, chargers and wiring for fridges, lights and camp electronics.",
    content: "<p>List every device, estimate hours of use and build a daily watt-hour budget.</p><p>From there you can choose battery capacity and charging that matches how you actually travel.</p>",
    journal_category: "TECH",
    status: "published",
    featured_image_url: images.battery,
    featured_image_alt: "Vehicle electrical system close-up",
    author: "4x4models Editorial",
    author_role: "Workshop editor",
    read_time: "7 min read",
    published_at: "2026-05-05T08:00:00.000Z",
  },
];

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
];

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
    { page: "checkout", locale, section: "hero", key: "intro", value: l ? "Controleer je order en rond de demo checkout af." : "Review your order and complete the demo checkout." },
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
        { type: "VehicleIndex", props: { id: "home-vehicles", icon: "shield", eyebrow: "4x4", title: l ? "Uitgelichte platforms" : "Featured platforms", body: l ? "Open de modellen die de catalogus dragen." : "Open the models that define the catalog.", layout: "cards", showImages: true, defaultImageUrl: images.hero, defaultImageAlt: "4x4 platform", background: "surface", cards: [] } },
        { type: "PhotoTextBlock", props: { id: "home-story", eyebrow: l ? "Klaar voor de volgende build" : "Ready for the next build", title: l ? "Van inspiratie naar onderdelenlijst" : "From inspiration to parts list", body: l ? "Combineer modelresearch, productontdekking en journal-inzicht in dezelfde beheerbare ervaring." : "Combine model research, product discovery and journal insight without leaving the same managed experience.", imageUrl: images.camp, imageAlt: "Trail-ready 4x4", ctaLabel: l ? "Lees de journal" : "Read the journal", ctaUrl: path("/journal"), background: "raised", align: "left" } },
        { type: "ProductGrid", props: { id: "home-products", eyebrow: "Shop", title: l ? "Uitgelichte gear" : "Featured gear", body: l ? "Geselecteerde producten voor sterke, georganiseerde builds." : "Selected products for capable, organized builds.", cards: [], limit: 4, columns: 4, showImages: true, defaultImageUrl: images.workshop, defaultImageAlt: "4x4 gear", background: "muted", cta: { label: l ? "Shop alles" : "Shop all", url: path("/gear") } } },
        { type: "ArticleGrid", props: { id: "home-articles", eyebrow: "Journal", title: l ? "Uit de journal" : "From the journal", body: l ? "Nieuwe veldnotities en praktische buildtips." : "Fresh field notes and practical build advice.", cards: [], limit: 3, columns: 3, showImages: true, defaultImageUrl: images.camp, defaultImageAlt: "Journal", background: "surface", cta: { label: l ? "Bekijk journal" : "View journal", url: path("/journal") } } },
        { type: "Newsletter", props: { id: "home-newsletter", icon: "sparkles", title: l ? "Ontvang de trail update" : "Get the trail dispatch", body: l ? "Af en toe buildnotities, productkeuzes en praktische gidsen." : "Occasional build notes, product picks and practical guides.", placeholder: l ? "Vul je e-mail in" : "Enter your email", buttonText: l ? "Inschrijven" : "Subscribe", background: "raised" } },
      ],
    },
    vehicles: {
      root: { props: { title: "Vehicles" } },
      content: [
        { type: "Hero", props: { id: "vehicles-hero", icon: "compass", eyebrow: l ? "Modelcatalogus" : "Model directory", title: l ? "Vind het juiste 4x4 platform" : "Find the right 4x4 platform", body: l ? "Blader door trail-ready platforms, vergelijk sterke punten en open elke buildpagina vanuit een snelle catalogus." : "Browse trail-ready platforms, compare strengths, and open every build page from one fast catalog.", imageUrl: images.hero, imageAlt: "4x4 model catalog", overlay: "dark", align: "left", height: "standard", primaryText: l ? "Bekijk modellen" : "Browse models", primaryUrl: "#vehicles-index", secondaryText: l ? "Lees journal" : "Read journal", secondaryUrl: path("/journal") } },
        { type: "VehicleIndex", props: { id: "vehicles-index", icon: "grid", eyebrow: l ? "Alle modellen" : "All models", title: l ? "4x4 modelindex" : "4x4 model index", body: l ? "Een helder en snel overzicht van elk beheerd model in de catalogus." : "A clear, fast index of every managed model in the catalog.", layout: "cards", showImages: true, defaultImageUrl: images.workshop, defaultImageAlt: "4x4 model", background: "surface", cards: [] } },
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

async function upsert(entityName, query, data) {
  const entity = base44.entities[entityName];
  const records = await entity.filter(query, "-updated_date", 1, 0);
  if (records?.[0]?.id) {
    await entity.update(records[0].id, data);
    return { action: "updated", id: records[0].id };
  }
  const created = await entity.create(data);
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
    await upsert("BlogPost", { slug: article.slug, is_product: false }, { ...article, is_product: false });
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
