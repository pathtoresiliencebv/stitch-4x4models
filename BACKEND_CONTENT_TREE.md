# 4x4models - Backend Content Tree (TODO)

**Purpose:** This document defines ALL content needed in Base44 CMS for the 4x4models website.
**Frontend:** Next.js | **Backend:** Base44 (App ID: 699871557dfcaafa02868052)
**Status:** TODO - Base44 backend agent must create/populate this content

---

## WEBSITE STRUCTURE

```
4x4models.com
├── / (Homepage)
├── /shop
│   ├── /shop/cart
│   ├── /shop/checkout
│   └── /shop/order-confirmed
├── /journal
│   └── /journal (overview + article detail)
├── /gear
│   └── /gear (product listing)
├── /vehicles
│   ├── /vehicles (overview)
│   ├── /vehicles/land-cruiser
│   ├── /vehicles/tacoma
│   └── /vehicles/merch
└── /login, /register
```

---

## ENTITY: BlogPost

**Description:** Articles (is_product=false) AND Products (is_product=true) use the same entity.
**Frontend Query:** `blogService.list()` → `/entities/BlogPost?q={is_product:false,status:"published"}`

### Schema

```json
{
  "name": "BlogPost",
  "type": "object",
  "properties": {
    "title": { "type": "string", "maxLength": 200 },
    "slug": { "type": "string", "unique": true },
    "excerpt": { "type": "string", "maxLength": 500 },
    "content": { "type": "string" },
    "featured_image_url": { "type": "string", "format": "url" },
    "featured_image_alt": { "type": "string" },
    "author": { "type": "string" },
    "author_image_url": { "type": "string", "format": "url" },
    "category": { "type": "string", "enum": ["EXPEDITION", "TECH", "TRAILS", "GEAR", "MAINTENANCE"] },
    "is_product": { "type": "boolean", "default": false },
    "price": { "type": "number" },
    "rating": { "type": "number" },
    "reviews_count": { "type": "number" },
    "status": { "type": "string", "enum": ["draft", "review", "published"], "default": "draft" },
    "created_at": { "type": "string", "format": "datetime" },
    "published_at": { "type": "string", "format": "datetime" }
  },
  "required": ["title", "slug", "status"]
}
```

### Required Records by Type

#### ARTICLES (is_product: false)

| Slug | Title | Category | Status |
|------|-------|----------|--------|
| simpson-desert-expedition | Exploring the Simpson Desert | EXPEDITION | published |
| dual-battery-systems | 12V Dual Battery Systems Explained | TECH | published |
| rubicon-stock-fj | Conquering the Rubicon in a Stock FJ | TRAILS | published |
| rtt-comparison | Hard-Shell vs Soft-Shell RTTs | GEAR | published |
| cv-axle-repair | Field Repairs: Broken CV Axle | MAINTENANCE | published |

#### PRODUCTS (is_product: true)

| Slug | Title | Category | Price | Rating | Reviews |
|------|-------|----------|-------|--------|---------|
| heavy-duty-winch-12000lb | Heavy-Duty Recovery Winch 12,000lb | Recovery | 899.00 | 4.8 | 124 |
| old-man-emu-bp-51 | Old Man Emu BP-51 Suspension Kit | Suspension | 2450.00 | 5.0 | 89 |
| bfgoodrich-all-terrain-ko2 | BFGoodrich All-Terrain T/A KO2 | Tires | 240.00 | 4.6 | 312 |
| arb-intensity-v2-lights | ARB Intensity V2 LED Driving Lights | Lighting | 1200.00 | 4.9 | 156 |
| tactical-recovery-tracks | Tactical Recovery Tracks | Recovery | 249.99 | 4.7 | 89 |
| rooftop-tent-premium | Premium Rooftop Tent | Camping | 1899.00 | 4.8 | 67 |
| dual-battery-kit | Complete Dual Battery Kit | TECH | 599.00 | 4.5 | 124 |

---

## ENTITY: ProductCategory

**Description:** Categories for shop products

### Schema

```json
{
  "name": "ProductCategory",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "slug": { "type": "string", "unique": true },
    "description": { "type": "string" },
    "icon": { "type": "string" },
    "status": { "type": "string", "enum": ["published", "draft"] },
    "sort_order": { "type": "number" }
  },
  "required": ["name", "slug", "status"]
}
```

### Required Records

| Name | Slug | Icon | Sort Order |
|------|------|------|------------|
| Recovery | recovery | shield | 1 |
| Suspension | suspension | settings | 2 |
| Tires | tires | circle | 3 |
| Lighting | lighting | sun | 4 |
| Camping | camping | tent | 5 |

---

## ENTITY: Vehicle

**Description:** Vehicle platforms/builds

### Schema

```json
{
  "name": "Vehicle",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "slug": { "type": "string", "unique": true },
    "tagline": { "type": "string" },
    "hero_image_url": { "type": "string", "format": "url" },
    "hero_image_alt": { "type": "string" },
    "description": { "type": "string" },
    "badge": { "type": "string" },
    "series": {
      "type": "array",
      "items": {
        "name": { "type": "string" },
        "slug": { "type": "string" },
        "description": { "type": "string" },
        "image_url": { "type": "string" },
        "badge": { "type": "string" }
      }
    },
    "status": { "type": "string", "enum": ["published", "draft"] }
  },
  "required": ["name", "slug", "status"]
}
```

### Required Records

| Name | Slug | Tagline | Badge |
|------|------|---------|-------|
| Land Cruiser | land-cruiser | The Benchmark | Expedition Ready |
| Tacoma | tacoma | The Overlander | Field Tested |
| Hilux | hilux | The Indestructible | Heritage |

---

## HOMEPAGE CONTENT

### Hero Section

| Field | Value |
|-------|-------|
| badge | Global Community |
| headline | Fuel Your Off-Road Adventure |
| subheadline | 4x4models is your ultimate hub for off-road enthusiasts. Discover premium gear, explore legendary builds, and join a community that lives for the trail. |
| cta_primary_text | Explore the Journal |
| cta_primary_url | /journal |
| cta_secondary_text | Shop Gear |
| cta_secondary_url | /shop |
| background_image_url | (from external URL) |

### Featured Vehicles Section

| Field | Value |
|-------|-------|
| section_title | Legendary Rigs |
| section_subtitle | Explore the platforms that define off-road capability. |
| view_all_text | View All Models |
| view_all_url | /vehicles |

### Vehicle Cards (3 items)

| Vehicle | Label | Title | Link |
|---------|-------|-------|------|
| Land Cruiser | The Benchmark | Land Cruiser | /vehicles/land-cruiser |
| Tacoma | The Overlander | Tacoma | /vehicles/tacoma |
| Hilux | The Indestructible | Hilux | /vehicles/hilux |

### Newsletter Section

| Field | Value |
|-------|-------|
| headline | Prep For The Trail |
| body | Sign up for the dispatch and get our free Overland Packing Guide delivered instantly. |
| cta_text | Subscribe |
| placeholder | ENTER YOUR EMAIL |

---

## JOURNAL PAGE CONTENT

### Page Header

| Field | Value |
|-------|-------|
| search_placeholder | Search Journal... |

### Sidebar - Filters

| Field | Value |
|-------|-------|
| title | FILTERS |
| subtitle | REFINE SEARCH |

#### Model Filters

- Land Cruiser (70/80/100/200/300)
- Hilux
- Tacoma
- FJ Cruiser

#### Category Filters

- Gear Reviews
- Technical Guides
- Trail Reports

### Sidebar - Newsletter

| Field | Value |
|-------|-------|
| title | THE SITREP |
| description | Get technical guides and trail reports delivered directly to your inbox. No spam, just grit. |
| placeholder | CALLSIGN (EMAIL) |
| cta_text | SUBSCRIBE |

### Sidebar - Latest News

| Title |
|-------|
| ARB Releases New Summit Bar for LC300 |
| Toyota Announces Solid Axle Concept |
| Baja 1000: Tacoma Takes Class Win |

### Load More Button

| Field | Value |
|-------|-------|
| text | LOAD OLDER POSTS |

### Hero Article CTA

| Field | Value |
|-------|-------|
| text | READ FULL REPORT |

---

## GEAR PAGE CONTENT

### Page Header

| Field | Value |
|-------|-------|
| title | GEAR & MODS |
| description | Engineer your rig for the uncompromising outback. Curated, tested, and battle-ready components. |

### Sidebar - Filter Section

| Field | Value |
|-------|-------|
| title | FILTER GEAR |
| subtitle | Precision selection |
| cta_text | Apply Filters |

#### Brand Filter Options

- ARB
- TJM
- Old Man Emu

#### Vehicle Model Filter Options

- Land Cruiser 70
- Hilux
- Tacoma

#### Gear Type Filter Options

- Suspension
- Tires
- Camping
- Recovery
- Lighting

---

## VEHICLES OVERVIEW PAGE CONTENT

### Hero Section

| Field | Value |
|-------|-------|
| headline | Fuel Your Off-Road Adventure |
| body | The ultimate destination for Toyota enthusiasts. Build guides, gear reviews, and a community of overlanders ready for the dirt. |
| cta_primary_text | Read the Latest |
| cta_secondary_text | Join the Community |

### Featured Section

| Field | Value |
|-------|-------|
| section_title | Featured Rigs |

#### Featured Rig Cards

| Title | Description | Link |
|-------|-------------|------|
| The Desert Runner Build | Complete breakdown of long-travel suspension geometry and tire selection for high-speed desert operations. | /vehicles/tacoma |
| Heritage Expedition | Restoring and modernizing a 70-series for extended off-grid capability without losing its mechanical soul. | /vehicles/land-cruiser |
| Weekend Warrior Setup | Balancing daily drivability with weekend camping utility. A masterclass in modular packing. | /vehicles/hilux |

### Newsletter Banner

| Field | Value |
|-------|-------|
| badge | FREE GUIDE |
| headline | The Overland Packing Manual |
| description | Subscribe to the dispatch and get our 24-page guide to essential recovery gear, tools, and comms for your next major trip. |
| cta_text | Send It |
| placeholder | YOUR EMAIL ADDRESS |

---

## LAND CRUISER PAGE CONTENT

### Hero Section

| Field | Value |
|-------|-------|
| badge | Expedition Ready |
| headline | THE APEX PREDATOR |
| body | Engineered for the unforgiving. The Land Cruiser stands as a monolithic testament to mechanical endurance. |
| cta_primary_text | Build Your Rig |
| cta_secondary_text | View Specs |

### Build Section

| Field | Value |
|-------|-------|
| section_title | Build Your Rig |
| subtitle | Select a platform to begin customization. |

#### Series Cards

| Series | Badge | Description | CTA |
|--------|-------|-------------|-----|
| 300 Series | Flagship | The ultimate synthesis of luxury and unyielding off-road capability. | Configure 300 |
| 70 Series | Heritage | A utilitarian workhorse. Stripped down, reinforced, ready for anything. | Configure 70 |
| Tacoma | Agile | Mid-size agility meets heavy-duty overlanding potential. | Configure Tacoma |

### Journal Section

| Field | Value |
|-------|-------|
| section_title | Latest from the Journal |
| view_all_text | View All |

#### Journal Articles (3 items)

| Category | Read Time | Title | Excerpt |
|---------|----------|-------|---------|
| Route Guide | 12 Min Read | Navigating the High Sierras in Winter | A tactical breakdown of essential gear and modifications required for sub-zero high-altitude expeditions. |
| Tech Brief | 8 Min Read | Suspension Geometry 101 | Understanding the critical balance between articulation, payload capacity, and highway stability. |
| Field Notes | 5 Min Read | The Solitude of the Salt Flats | Reflections on a three-day solo crossing of the Mojave desert and the silence it brings. |

---

## TACOMA (PRODUCT REVIEW) PAGE CONTENT

### Hero Section

| Field | Value |
|-------|-------|
| badge | Lighting |
| label | Field Tested |
| headline | Piercing the Outback Dark |
| body | A comprehensive review of the ARB Intensity V2 LED Driving Lights. Do they live up to the rugged reputation? |
| author | Commander |
| author_role | 4x4 Enthusiast |
| date | Oct 12, 2024 |
| read_time | 8 Min Read |

### Table of Contents

| Field | Value |
|-------|-------|
| title | Contents |

| Anchor | Label |
|--------|-------|
| #build | Build Quality |
| #performance | Illumination Performance |
| #installation | Installation Process |
| #specs | Technical Specs |
| #verdict | Final Verdict |

### Pros & Cons

| Section | Items |
|---------|-------|
| The Good | Machined aluminum housing is virtually indestructible. / Exceptional throw distance; turns night into day. / Waterproofing handles deep river crossings flawlessly. |
| The Bad | Premium price point isn't for casual weekenders. / Significant weight requires sturdy bullbar mounting. |

### Section: Built Like a Tank

| Field | Value |
|-------|-------|
| headline | Built Like a Tank |
| body | When navigating treacherous corrugated roads or dense bushland, fragile gear is a liability. The V2's die-cast aluminum housing feels like a solid block of machined steel. There are no flimsy plastic bezels here; everything is bolted, sealed, and braced for impact. |

### Technical Specifications Table

| Feature | Specification |
|---------|--------------|
| Lumen Output | 20,000 Lumens (Pair) |
| Color Temperature | 5700K (Daylight) |
| IP Rating | IP68 Waterproof |
| Weight | 4.5kg per light |
| Voltage | 9-36V DC |

---

## CHECKOUT PAGE CONTENT

### Page Header

| Step | Headline | Subtitle |
|------|----------|----------|
| shipping | Secure Checkout | Complete your order to begin the next expedition. |
| review | Review Order | Verify your order details before payment. |

### Progress Indicator

| Step | Label |
|------|-------|
| 1 | Shipping |
| 2 | Payment |

### Shipping Form

| Field | Label | Placeholder |
|-------|-------|-------------|
| email | Email Address | adventurer@example.com |
| first_name | First Name | First Name |
| last_name | Last Name | Last Name |
| address_line1 | Street Address | Street Address |
| address_line2 | Apartment, suite, etc. (optional) | - |
| city | City | City |
| state | State/Province | State/Province |
| postal_code | Zip/Postal | Zip/Postal |
| country | Country | US |

### Buttons

| Context | Text |
|---------|------|
| Continue to Payment | Continue to Payment |
| Back to Shipping | Back to Shipping |
| Complete Purchase | Complete Purchase — [amount] |
| Processing | Processing... |

### Order Summary

| Field | Value |
|-------|-------|
| title | Order Summary |
| subtotal_label | Subtotal |
| shipping_label | Freight Shipping |
| shipping_free_threshold | FREE (over $500) |
| tax_label | Tax (8%) |
| total_label | Total |

### Payment Section

| Field | Value |
|-------|-------|
| title | Payment Method |
| secure_label | Secure Payment (Demo Mode) |
| description | In production, this would integrate with a payment processor like Stripe. For this demo, clicking "Complete Purchase" will simulate a successful payment. |

### Trust Badges

| Icon | Label |
|------|-------|
| Truck | Freight Shipping |
| Shield | Secure Payment |
| CreditCard | Easy Returns |

---

## ORDER CONFIRMED PAGE CONTENT

### Hero Section

| Field | Value |
|-------|-------|
| success_icon | CheckCircle |
| headline | Mission Accomplished |
| body | Your coordinates are locked. Your gear is being prepped for dispatch. Prepare for extraction. |

### Order Not Found State

| Field | Value |
|-------|-------|
| headline | Order Not Found |
| body | We could not find your order confirmation. Please check your email for details. |
| cta_text | Continue Shopping |

### Dispatch Manifest

| Field | Value |
|-------|-------|
| title | Dispatch Manifest |
| order_label | Order Designation |
| status_label | Status |
| delivery_label | Estimated Drop |

### Status Messages (in order)

1. Awaiting Cargo Load
2. Preparing Shipment
3. In Transit
4. Out for Delivery
5. Delivered

### Items Section

| Field | Value |
|-------|-------|
| title | Secured Assets |
| sku_label | SKU |

### Total Section

| Field | Value |
|-------|-------|
| label | Total Payload |

### Action Buttons

| Text | Icon |
|-------|------|
| Track Expedition | Truck |
| Back to Journal | FileText |

### Footer

| Field | Value |
|-------|-------|
| brand | 4X4MODELS |
| copyright | © 2026 4x4models. Engineered for the Outback. |

---

## MERCH PAGE CONTENT

(Products with is_product:true AND category:merch)

### Page Header

| Field | Value |
|-------|-------|
| title | MERCH |
| description | Official 4x4models merchandise. Premium apparel and accessories for the overland community. |

### Filter Options

| Filter Type | Options |
|-------------|---------|
| Category | Apparel, Accessories, Stickers |
| Size | S, M, L, XL, XXL |
| Color | Black, Olive, Desert Tan |

---

## STATIC CONTENT / UI STRINGS

### Navigation

| Key | Value |
|-----|-------|
| nav_explore | Explore |
| nav_journal | Journal |
| nav_shop | Shop |
| nav_merch | Merch |

### Shop Cart

| Key | Value |
|-----|-------|
| cart_title | Your Cargo |
| cart_empty | Your cart is empty |
| continue_shopping | Continue Shopping |
| checkout | Proceed to Checkout |

### Footer Links

| Link | URL |
|------|-----|
| Privacy Policy | /privacy |
| Terms of Service | /terms |
| Support | /support |
| Affiliates | /affiliates |

---

## SEO METADATA

### Homepage

| Field | Value |
|-------|-------|
| title | 4x4models - Off-Road Enthusiast Community |
| description | Your ultimate hub for off-road enthusiasts. Discover premium gear, explore legendary builds, and join a community that lives for the trail. |

### Journal

| Field | Value |
|-------|-------|
| title | Journal - 4x4models |
| description | Technical guides, trail reports, and gear reviews from the 4x4models community. |

### Shop

| Field | Value |
|-------|-------|
| title | Shop Gear - 4x4models |
| description | Curated off-road gear and equipment. Premium recovery, suspension, lighting, and camping essentials. |

---

## BACKEND API CONFIGURATION

```typescript
// API Configuration
const API_CONFIG = {
  baseUrl: 'https://stimulating-growth-suite-ai.base44.app/api',
  appId: '699871557dfcaafa02868052',
  apiKey: process.env.BASE44_API_KEY,
};

// Frontend Services
// blogService.list() → GET /entities/BlogPost?q={}
// productService.list() → GET /entities/BlogPost?q={is_product:true}
```

---

## TODO FOR BASE44 BACKEND AGENT

1. **Create Entities** - Set up BlogPost, ProductCategory, Vehicle entities in Base44
2. **Populate BlogPost Records** - Create all article records (is_product:false)
3. **Populate BlogPost Product Records** - Create all product records (is_product:true)
4. **Populate ProductCategory Records** - Create all 5 category records
5. **Populate Vehicle Records** - Create all 3 vehicle records with series data
6. **Set Static Content** - Configure homepage hero, newsletter, and all page content
7. **Verify API Access** - Ensure frontend can query all records correctly
8. **Test Filtering** - Verify category/status filters work on frontend

---

*Document generated for Base44 backend agent. Last updated: 2026-05-17*
