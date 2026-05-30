# 4x4models Website Content Mapping

**Versie:** 1.0
**Datum:** 2026-05-17
**Frontend:** Next.js 16.2.4
**Backend:** Base44 (appId: 699871557dfcaafa02868052)

---

## OVERZICHT STRUCTUUR

```
4x4models Website
├── / (Home)
├── /shop (Winkelwagen + Checkout flow)
│   ├── /shop/cart
│   ├── /shop/checkout
│   ├── /shop/payment (redirect)
│   └── /shop/order-confirmed
├── /journal
│   ├── /journal (overzicht)
│   ├── /journal/[slug] (artikel)
│   ├── /journal/latest
│   └── /journal/adventurer/[slug]
├── /gear
│   ├── /gear
│   ├── /gear/tactical-recovery-tracks
│   ├── /gear/tactical-recovery-tracks/modern-edition
│   └── /gear/tactical-recovery-tracks/sleek-edition
├── /vehicles
│   ├── /vehicles (overzicht)
│   ├── /vehicles/land-cruiser
│   ├── /vehicles/tacoma
│   └── /vehicles/merch
├── /login
└── /register
```

---

## GLOBALE LAYOUT ELEMENTEN

### 🧭 Header / Navigatie

**Bestand:** `src/components/Navbar.tsx`
**Type:** Statisch (met uitzondering van cart count)

| Veld | Waarde | Type |
|------|--------|------|
| Logo | `/images/logo.png` | ✅ Dynamisch (logo.svg in public) |
| Merknaam | "4x4models" | ✅ Wil dynamisch |
| Menu: Vehicles | `/vehicles` | Statisch |
| Menu: Gear & Mods | `/gear` | Statisch |
| Menu: Journal | `/journal` | Statisch |
| Menu: Shop | `/shop` | Statisch |
| Cart icoon | - | Dynamisch (CartContext) |
| User/Login | `/login` | Statisch |
| Logout | - | Dynamisch (AuthContext) |

---

### 🧭 Footer

**Bestand:** `src/components/Footer.tsx`
**Type:** Gemixt

| Veld | Waarde | Regels |
|------|--------|--------|
| Merknaam | "4x4models" | 10 | ✅ Wil dynamisch |
| Tagline | "Fuel your off-road adventure with the ultimate Toyota 4x4 community." | 13-14 | ⚠️ Kan dynamisch |
| Explore > Vehicles | `/vehicles` | 19 | Statisch |
| Explore > Gear & Mods | `/gear` | 20 | Statisch |
| Explore > Journal | `/journal` | 21 | Statisch |
| Explore > Shop | `/shop` | 22 | Statisch |
| Support > About | `#` | 28 | Statisch |
| Support > Contact | `#` | 29 | Statisch |
| Support > FAQ | `#` | 30 | Statisch |
| Legal > Privacy Policy | `#` | 36 | ❌ Blijft hardcoded |
| Legal > Terms of Service | `#` | 37 | ❌ Blijft hardcoded |
| Copyright | "© 2026 4x4models. All rights reserved." | 42 | ⚠️ Kan dynamisch |

---

### 🧭 SEO Metadata (Global)

**Bestand:** `src/app/layout.tsx`

| Veld | Waarde |
|------|--------|
| title | "4x4models \| Premium Off-Road Adventures" |
| description | "Your hub for 4x4 off-road content, vehicle guides, gear reviews, and adventure stories." |

---

## 📄 PAGINA: Home

**Route:** `/`
**Bestand:** `src/app/(main)/page.tsx`
**Type:** Statisch met uitzondering van nieuwsbrief
**SEO:** ✅ Dynamisch via metadata

### 🧩 Hero Sectie

| Veld | Waarde | Type | ✅ Gewenst |
|-------|--------|------|------------|
| Logo | `/images/logo.png` (80x80) | ✅ Dynamisch | Ja |
| Badge | "Global Community" | Statisch | Ja |
| Heading | "FUEL YOUR OFF-ROAD ADVENTURE" | Statisch | Ja |
| Subheading | "4x4models is your ultimate hub for off-road enthusiasts..." | Statisch | Ja |
| CTA 1 | "Explore the Journal" → `/journal` | Statisch | Ja |
| CTA 2 | "Shop Gear" → `/shop` | Statisch | Ja |
| Background | Google AI image (hardcoded URL) | ⚠️ Moet vervangen | Via base44 |

### 🧩 Featured Vehicles Grid

**Type:** Statisch (hardcoded)

| Veld | Waarde |
|------|--------|
| Sectie titel | "Legendary Rigs" |
| Subtitel | "Explore the platforms that define off-road capability." |
| Link | "View All Models" → `/vehicles` |

**Items (3 voertuigen):**

| Item | Velden |
|------|--------|
| Land Cruiser | Tag: "The Benchmark", Title: "Land Cruiser", Image: Google AI, Link: `/vehicles/land-cruiser` |
| Tacoma | Tag: "The Overlander", Title: "Tacoma", Image: Google AI, Link: `/vehicles/tacoma` |
| Hilux | Tag: "The Indestructible", Title: "Hilux", Image: Google AI, Link: `#` |

### 🧩 Newsletter Sectie

| Veld | Waarde | Type |
|------|--------|------|
| Icoon | `<Map>` lucide | Statisch |
| Heading | "Prep For The Trail" | Statisch |
| Subheading | "Sign up for the dispatch and get our free Overland Packing Guide..." | Statisch |
| Input placeholder | "ENTER YOUR EMAIL" | Statisch |
| Button | "Subscribe" | Statisch |

---

## 📄 PAGINA: Shop Overzicht

**Route:** `/shop`
**Bestand:** `src/app/(main)/shop/page.tsx`
**Type:** Gemixt (statisch + dynamisch via CartContext)
**Data bron:** `productService.list()` → BlogPost (is_product: true, status: "active")

### 🧩 Header

| Veld | Waarde | Type |
|------|--------|------|
| Back link | "Back to Home" → `/` | Statisch |
| Logo | `/images/logo.png` | ✅ Dynamisch |
| Titel | "4x4models Shop" | Statisch |
| "Your Cargo" heading | "Your Cargo" | Statisch |

### 🧩 Cart Items (uit CartContext)

**Data bron:** `useCart()` uit `CartContext.tsx`

| Velden per item |
|-----------------|
| featured_image_url |
| title |
| sku |
| price |
| quantity |

### 🧩 Order Summary

| Veld | Waarde |
|------|--------|
| Subtotal | Berekend uit cart |
| Shipping | $45 (of FREE >$500) |
| Taxes | "Calculated at checkout" |
| Total | subtotal + shipping |
| Button | "Proceed to Checkout" → `/shop/checkout` |
| Shipping notice | "Heavy items require freight shipping. Free shipping over $500." |

---

## 📄 PAGINA: Checkout

**Route:** `/shop/checkout`
**Bestand:** `src/app/(main)/shop/checkout/page.tsx`
**Type:** Statisch (formulier)

### 🧩 Checkout Formulier

**Velden:**

| Veld | Type | Validatie | Verplicht |
|------|------|-----------|------------|
| Email | email | ✅ | Ja |
| First Name | text | ✅ | Ja |
| Last Name | text | ✅ | Ja |
| Street Address | text | ✅ | Ja |
| Apartment (optioneel) | text | - | Nee |
| City | text | ✅ | Ja |
| State/Province | text | ✅ | Ja |
| Zip/Postal | text | ✅ | Ja |

### 🧩 Statische Teksten

| Veld | Waarde | Locatie |
|------|--------|---------|
| Heading (step 1) | "Secure Checkout" | 125 |
| Heading (step 2) | "Review Order" | 125 |
| Subtitle (step 1) | "Complete your order to begin the next expedition." | 129-131 |
| Subtitle (step 2) | "Verify your order details before payment." | 129-131 |
| Progress: Step 1 | "Shipping" | 141 |
| Progress: Step 2 | "Payment" | 148 |
| Section: Shipping | "Shipping Details" | 162 |
| Email label | "Email Address" | 168 |
| Address label | "Shipping Address" | 181 |
| Button (step 1) | "Continue to Payment" | 256 |
| Button (step 2) | "Complete Purchase — $X.XX" | 354-355 |
| Secure note | "Secure Payment (Demo Mode)" | 332 |
| Demo warning | "In production, this would integrate with Stripe..." | 336-338 |
| Back button | "Back to Shipping" | 364 |
| Order Summary title | "Order Summary" | 374 |
| Subtotal label | "Subtotal" | 410 |
| Shipping label | "Freight Shipping" | 414 |
| Tax label | "Tax (8%)" | 418 |
| Total label | "Total" | 425 |
| Secure badge | "Secure Encrypted Transaction" | 435 |

---

## 📄 PAGINA: Order Confirmed

**Route:** `/shop/order-confirmed`
**Bestand:** `src/app/(main)/shop/order-confirmed/page.tsx`
**Type:** Statisch met sessionStorage data

### 🧩 Statische Teksten

| Veld | Waarde |
|------|--------|
| Heading | "Order Confirmed" |
| Subtitle | "Your gear is being prepared." |
| Order number label | "Order Number" |
| Email notice | "A confirmation has been sent to your email." |
| Continue button | "Continue Shopping" → `/shop` |
| Footer copyright | "© 2026 4x4models. Engineered for the Outback." |

---

## 📄 PAGINA: Journal Overzicht

**Route:** `/journal`
**Bestand:** `src/app/(main)/journal/page.tsx`
**Type:** Gemixt (statisch + mock data)
**Data bron:** `blogService.list()` → BlogPost (is_product: false, status: "published")

### 🧩 Hero Post

| Veld | Waarde |
|------|--------|
| Category | EXPEDITION (hardcoded) |
| Date | OCT 14, 2023 (hardcoded) |
| Title | "Exploring the Simpson Desert" |
| Excerpt | "A 600km unassisted crossing..." |
| Image | Google AI URL |
| Author | M. Johnson |
| CTA | "READ FULL REPORT" |

### 🧩 Grid Posts (4 artikelen)

**Mock data fields:**

| Veld |
|------|
| slug |
| category (EXPEDITION, TECH, TRAILS, GEAR, MAINTENANCE) |
| date |
| title |
| excerpt |
| image |
| author |

### 🧩 Sidebar Filters

| Filter | Opties |
|--------|--------|
| Models | Land Cruiser (70/80/100/200/300), Hilux, Tacoma, FJ Cruiser |
| Categories | Gear Reviews, Technical Guides, Trail Reports |

### 🧩 Sidebar: Latest News (hardcoded)

| Item |
|------|
| "ARB Releases New Summit Bar for LC300" |
| "Toyota Announces Solid Axle Concept" |
| "Baja 1000: Tacoma Takes Class Win" |

### 🧩 Newsletter (Sitrep)

| Veld | Waarde |
|------|--------|
| Titel | "THE SITREP" |
| Beschrijving | "Get technical guides and trail reports..." |
| Input placeholder | "CALLSIGN (EMAIL)" |
| Button | "SUBSCRIBE" |

---

## 📄 PAGINA: Journal Artikel

**Route:** `/journal/[slug]`
**Bestand:** `src/app/(main)/journal/[slug]/page.tsx`
**Type:** Statisch (hardcoded mock data)

### 🧩 Hero Sectie

| Veld | Waarde |
|------|--------|
| Category badge | "Editor's Choice" |
| Title | "The Simpson Desert: Sand, Sweat & Survival" |
| Subtitle | "A grueling 500-kilometer trek..." |
| Author name | "Jack Reynolds" |
| Author role | "Expedition Lead" |
| Date | "Oct 12, 2024" |
| Hero image | Google AI URL |

### 🧩 Field Sitreps (4 items)

| Velden |
|--------|
| type (Gear Update, Route Condition, Vehicle News, Event) |
| title |
| excerpt |

### 🧩 Deep Dives (3 items)

| Velden |
|--------|
| slug |
| category |
| title |
| excerpt |
| author / date |
| image |
| alt |
| readTime |

### 🧩 Archives (3 items)

| Velden |
|--------|
| slug |
| category |
| title |
| excerpt |
| image |
| alt |

### 🧩 Newsletter Formulier

| Veld | Waarde |
|------|--------|
| Titel | "The Sitrep" |
| Beschrijving | "Field intelligence, gear reviews..." |
| Input placeholder | "ENTER COMM-LINK (EMAIL)" |
| Button | "Initialize Uplink" |
| Footer text | "Encrypted transmission. No spam." |

---

## 📄 PAGINA: Gear Overzicht

**Route:** `/gear`
**Bestand:** `src/app/(main)/gear/page.tsx`
**Type:** Statisch (hardcoded product data)
**Data bron:** `productService.list()` → BlogPost (is_product: true, status: "active")

### 🧩 Header

| Veld | Waarde |
|------|--------|
| Breadcrumb | Home > Gear & Mods |
| Heading | "GEAR & MODS" |
| Subtitle | "Engineer your rig for the uncompromising outback..." |

### 🧩 Product Grid (3 items)

**Hardcoded product data:**

| Item | Velden |
|------|--------|
| Recovery Winch | title, rating (4.8), reviews (124), price ($899.00), description, category (Recovery), image |
| OME BP-51 Suspension | title, rating (5.0), reviews (89), price ($2,450.00), description, category (Suspension), image |
| BFGoodrich KO2 | title, rating (4.6), reviews (312), price (From $240.00), description, category (Tires), image |

### 🧩 Sidebar Filters

| Filter | Opties |
|--------|--------|
| Brand | ARB, TJM, Old Man Emu |
| Vehicle Model | Land Cruiser 70, Hilux, Tacoma |
| Gear Type | Suspension, Tires, Camping, Recovery, Lighting |

---

## 📄 PAGINA: Tactical Recovery Tracks

**Route:** `/gear/tactical-recovery-tracks`
**Bestand:** `src/app/(main)/gear/tactical-recovery-tracks/page.tsx`
**Type:** Statisch (hardcoded)

### 🧩 Product Gallery

| Veld | Waarde |
|------|--------|
| Main image | Google AI URL |
| Grid images (3) | Google AI URLs |

### 🧩 Product Info

| Veld | Waarde |
|------|--------|
| Title | "Tactical Recovery Tracks" |
| Rating | 4.8 |
| Reviews count | 342 |
| Price | $295.00 |
| Shipping notice | "Free shipping to mainland outposts." |
| CTA | "Add to Arsenal" |
| Button (Modern) | "From $295.00" |
| Button (Sleek) | "From $349.00" |

### 🧩 Description

| Veld | Waarde |
|------|--------|
| Heading | "Built for the Unforgiving." |
| Paragraphs | 2x long description |
| Spec: Material Matrix | "Engineering-grade, fiber-reinforced Nylon..." |
| Spec: Physical Profile | "1150mm x 330mm x 85mm..." |
| Traction Nodes | Aggressive Cleats, Self-Cleaning, Dual Ramps |

### 🧩 Edition Variants

| Edition | Price | Description |
|---------|-------|-------------|
| Modern Edition | From $295.00 | "Enhanced basalt-polymer construction..." |
| Sleek Edition | From $349.00 | "Streamlined profile with integrated mounting..." |

---

## 📄 PAGINA: Vehicles Overzicht

**Route:** `/vehicles`
**Bestand:** `src/app/(main)/vehicles/page.tsx`
**Type:** Statisch (hardcoded)

### 🧩 Hero Sectie

| Veld | Waarde |
|------|--------|
| Heading | "FUEL YOUR OFF-ROAD ADVENTURE" |
| Subheading | "The ultimate destination for Toyota enthusiasts..." |
| CTA 1 | "Read the Latest" |
| CTA 2 | "Join the Community" |
| Background | Google AI image |

### 🧩 Featured Rigs Grid (3 items)

| Item | Velden |
|------|--------|
| Tacoma | title, description, image, badge label |
| Land Cruiser | title, description, image, badge label |
| Hilux | title, description, image, badge label |

### 🧩 Newsletter Banner

| Veld | Waarde |
|------|--------|
| Badge | "FREE GUIDE" |
| Heading | "The Overland Packing Manual" |
| Description | "Subscribe to the dispatch and get our 24-page guide..." |
| Input placeholder | "YOUR EMAIL ADDRESS" |
| Button | "Send It" |

### 🧩 Mobile Bottom Nav

| Item | Link |
|------|------|
| Home | `/` |
| Explore | `#` |
| Garage | `#` |
| Profile | `#` |

---

## 📄 PAGINA: Land Cruiser

**Route:** `/vehicles/land-cruiser`
**Bestand:** `src/app/(main)/vehicles/land-cruiser/page.tsx`
**Type:** Statisch (hardcoded)

### 🧩 Hero Sectie

| Veld | Waarde |
|------|--------|
| Badge | "Expedition Ready" |
| Heading | "THE APEX PREDATOR" |
| Subheading | "Engineered for the unforgiving. The Land Cruiser stands as a monolithic..." |
| CTA 1 | "Build Your Rig" → `#build` |
| CTA 2 | "View Specs" → `#specs` |
| Hero image | Google AI URL |

### 🧩 Build Your Rig (3 series)

| Series | Badge | Description |
|--------|-------|-------------|
| 300 Series | "Flagship" | "The ultimate synthesis of luxury and unyielding..." |
| 70 Series | "Heritage" | "A utilitarian workhorse. Stripped down..." |
| Tacoma | "Agile" | "Mid-size agility meets heavy-duty overlanding..." |

### 🧩 Journal Preview (3 articles)

**Hardcoded met fields:**

| Veld |
|------|
| category |
| readTime |
| title |
| excerpt |
| image |
| alt |

---

## 📄 PAGINA: Tacoma

**Route:** `/vehicles/tacoma`
**Bestand:** `src/app/(main)/vehicles/tacoma/page.tsx`
**Type:** Statisch (hardcoded)

### 🧩 Sub-Navbar

| Veld | Waarde |
|------|--------|
| Logo | `/images/logo.png` | ✅ Dynamisch |
| Menu items | Explore, Reviews, Builds, Community, Gear, Shop |

---

## 📄 PAGINA: Merch

**Route:** `/vehicles/merch`
**Bestand:** `src/app/(main)/vehicles/merch/page.tsx`
**Type:** Statisch (hardcoded)

### 🧩 Banner

| Veld | Waarde |
|------|--------|
| Badge | "10% off for Newsletter Subscribers" |
| Code | "Use code OUTBACK10 at checkout" |

### 🧩 Header

| Veld | Waarde |
|------|--------|
| Heading | "TACTICAL SUPPLY" |
| Subheading | "Built for the elements. Designed for the enthusiast..." |

### 🧩 Product Grid

| Item | Velden |
|------|--------|
| Featured: Vintage Land Cruiser Tee | title, description, price ($35.00), image, CTA ("Get it on Etsy") |
| Overland Patch | title, description, price ($12.00), image, CTA ("Buy") |
| Tactical Camp Mug | title, description, price ($28.00), image, CTA ("Buy") |
| Recovery Gear Duffel | title, description, price ($85.00), image, CTA ("Buy") |
| Shipping Feature Card | title, description, CTA |

---

## 📄 PAGINA: Login

**Route:** `/login`
**Bestand:** `src/app/(auth)/login/page.tsx`
**Type:** Dynamisch (AuthContext)

### 🧩 Formulier

| Veld | Type | Validatie |
|------|------|-----------|
| Email | email | ✅ verplicht |
| Password | password | ✅ verplicht |

### 🧩 Statische Teksten

| Veld | Waarde |
|------|--------|
| Heading | "4x4models" |
| Subtitle | "Sign in to your account" |
| Button | "Sign In" |
| Loading | "Signing in..." |
| Error | "Invalid email or password" |

---

## 📄 PAGINA: Register

**Route:** `/register`
**Bestand:** `src/app/(auth)/register/page.tsx`
**Type:** Dynamisch (AuthContext)

### 🧩 Formulier

| Veld | Type | Validatie |
|------|------|-----------|
| Full Name | text | ✅ verplicht |
| Email | email | ✅ verplicht |
| Password | password | min 8 chars |

### 🧩 Statische Teksten

| Veld | Waarde |
|------|--------|
| Heading | "4x4models" |
| Subtitle | "Create your account" |
| Button | "Create Account" |
| Loading | "Creating account..." |
| Link | "Already have an account? Sign in" |

---

## BASE44 ENTITIES & API

### Entity: BlogPost

**Filter voor producten:** `{ is_product: true, status: "active" }`
**Filter voor artikelen:** `{ is_product: false, status: "published" }`

**Velden in base44:**

| Veld | Type | Beschrijving |
|------|------|--------------|
| title | string | Product/Artikel titel |
| slug | string | URL-vriendelijke identifier |
| content | string | HTML/Markdown content |
| meta_description | string | SEO beschrijving |
| focus_keyword | string | SEO keyword |
| featured_image_url | string | Hoofdafbeelding |
| status | enum | draft, review, published |
| is_product | boolean | Product vs artikel |
| price | number | Prijs (voor producten) |
| sale_price | number | Aanbiedingsprijs |
| sku | string | Voorraad SKU |
| stock | number | Voorraad hoeveelheid |
| category_id | string | Categorie referentie |
| tags | array | Tags |
| secondary_keywords | array | SEO secundaire keywords |
| word_count | number | Woord count |
| author | string | Auteur naam |
| category | string | Categorie label (EXPEDITION, TECH, etc.) |

### Entity: ProductCategory

**Filter:** `{ status: "published" }`

**Velden:**

| Veld | Type |
|------|------|
| name | string |
| slug | string |
| description | string |

### Entity: Order

**Via session na checkout**

**Velden:**

| Veld | Type |
|------|------|
| order_number | string |
| items | array |
| subtotal | number |
| shipping_cost | number |
| tax | number |
| total | number |
| status | enum |
| shipping_address | object |
| payment_status | enum |
| created_date | datetime |

---

## GEWENSTE DYNAMISCHE FEATURES

| # | Pagina/Sectie | huidige status | Gewenste status |
|---|----------------|----------------|-----------------|
| 1 | Hero achtergrond | Hardcoded Google AI | base44 Media entity |
| 2 | Featured Vehicles | Hardcoded | Vehicle entity (nog niet in base44) |
| 3 | Gear producten | Hardcoded | BlogPost (is_product: true) |
| 4 | Journal artikelen | Hardcoded mock | BlogPost (is_product: false) |
| 5 | Voertuig info | Hardcoded | Vehicle entity (nodig: aanmaken in base44) |
| 6 | Footer tekst | Statisch | base44 WebsitePage of Settings |
| 7 | Meta descriptions | Statisch | base44 SEO velden per pagina |

---

## NOOT: Vehicle Entity ontbreekt

De `/vehicles` pagina's bevatten hardcoded voertuig data. Er is GEEN Vehicle entity in de base44 backend.

**Opties:**
1. Vehicle entity aanmaken in base44 (aanraden)
2. Voertuigen modelleren als ProductCategory
3. Voertuigen als speciale BlogPost records (is_product: false, category: "vehicle")

**Aanbevolen velden voor Vehicle entity:**

| Veld | Type |
|------|------|
| name | string |
| slug | string |
| tagline | string |
| description | string |
| featured_image_url | string |
| gallery_images | array |
| series | array |
| specs | object |
| status | enum |
| sort_order | number |
