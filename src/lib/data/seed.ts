import type {
  Banner,
  BlogCategory,
  BlogPost,
  Category,
  Collection,
  Coupon,
  Customer,
  GlobalSeo,
  HomeSection,
  InventoryTransaction,
  MediaItem,
  NavigationItem,
  Order,
  Product,
  ProductVariant,
  Review,
  SitePage,
  SiteSettings,
  StockStatus,
  Testimonial,
} from "@/types";
import { readingTime, seededNumber, slugify } from "@/lib/utils";

/* ==========================================================================
   Demo catalogue.
   Everything here mirrors the Supabase schema one-to-one, so switching the
   data source on does not change a single component.
   ========================================================================== */

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

export function stockStatusFor(qty: number, threshold = 5): StockStatus {
  if (qty <= 0) return "out_of_stock";
  if (qty <= threshold) return "low_stock";
  return "in_stock";
}

export const seedCategories: Category[] = [
  {
    id: "cat-kurta-pajama",
    name: "Kurta Pajama",
    slug: "kurta-pajama",
    description:
      "Hand-finished kurta pajama sets in silk, linen and cotton blends — cut for festive evenings, mehndi mornings and everything in between.",
    image: "/media/categories/kurta-pajama.v3.jpg",
    parentId: null,
    displayOrder: 1,
    isActive: true,
    seo: {
      metaTitle: "Designer Kurta Pajama for Men | Danish Designer Studio",
      metaDescription:
        "Shop premium designer kurta pajama sets for weddings, Eid and festive occasions. Hand embroidery, luxury fabrics and free delivery across India.",
    },
  },
  {
    id: "cat-sherwani",
    name: "Sherwani",
    slug: "sherwani",
    description:
      "Groom sherwanis with zardozi, dabka and sequin craft — the centrepiece of the wedding wardrobe.",
    image: "/media/categories/sherwani.v3.jpg",
    parentId: null,
    displayOrder: 2,
    isActive: true,
    seo: {
      metaTitle: "Groom Sherwani Collection | Danish Designer Studio",
      metaDescription:
        "Luxury groom sherwanis with hand zardozi and dabka work. Made-to-measure Indian wedding wear delivered across India.",
    },
  },
  {
    id: "cat-bandhgala",
    name: "Bandhgala",
    slug: "bandhgala",
    description: "Tailored bandhgala suits with a sharp closed collar and a modern silhouette.",
    image: "/media/categories/bandhgala.v3.jpg",
    parentId: null,
    displayOrder: 3,
    isActive: true,
    seo: {
      metaTitle: "Men's Bandhgala Suits | Danish Designer Studio",
      metaDescription:
        "Premium bandhgala suits in velvet, raw silk and wool blends. Reception and cocktail-ready Indian formalwear.",
    },
  },
  {
    id: "cat-jodhpuri",
    name: "Jodhpuri",
    slug: "jodhpuri",
    description: "Open and classic jodhpuri sets with heritage cuts and contemporary detailing.",
    image: "/media/categories/jodhpuri.v3.jpg",
    parentId: null,
    displayOrder: 4,
    isActive: true,
    seo: {
      metaTitle: "Jodhpuri Suits & Open Jodhpuri Sets | Danish Designer Studio",
      metaDescription:
        "Shop open jodhpuri sets and classic jodhpuri suits crafted in premium fabrics with refined hand work.",
    },
  },
  {
    id: "cat-indo-western",
    name: "Indo Western",
    slug: "indo-western",
    description: "Draped, asymmetric and sequinned silhouettes for the modern celebration.",
    image: "/media/categories/indo-western.v3.jpg",
    parentId: null,
    displayOrder: 5,
    isActive: true,
    seo: {
      metaTitle: "Indo Western Outfits for Men | Danish Designer Studio",
      metaDescription:
        "Contemporary indo western outfits — draped kurtas, asymmetric jackets and sequin detailing for sangeet and reception.",
    },
  },
  {
    id: "cat-nehru-jackets",
    name: "Nehru Jackets",
    slug: "nehru-jackets",
    description: "Brocade and raw-silk nehru jackets that finish a kurta in one move.",
    image: "/media/categories/nehru-jackets.v3.jpg",
    parentId: null,
    displayOrder: 6,
    isActive: true,
    seo: {
      metaTitle: "Nehru Jackets for Men | Danish Designer Studio",
      metaDescription:
        "Brocade, velvet and raw silk nehru jackets designed to layer over kurta sets for festive occasions.",
    },
  },
];

export const seedCollections: Collection[] = [
  {
    id: "col-new",
    name: "New Collection",
    slug: "new-collection",
    description:
      "The newest arrivals from the Danish Designer Studio atelier — released in small batches through the season.",
    bannerImage: "/media/collections/new-collection.v3.jpg",
    thumbnail: "/media/collections/new-collection-thumb.v3.jpg",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    startsAt: null,
    endsAt: null,
    seo: {
      metaTitle: "New Collection 2026 | Danish Designer Studio",
      metaDescription:
        "Discover the newest Danish Designer Studio arrivals — sherwanis, bandhgalas and kurta sets released fresh this season.",
    },
  },
  {
    id: "col-wedding",
    name: "Wedding Collection",
    slug: "wedding-collection",
    description:
      "Everything the wedding week asks for: nikah, mehndi, sangeet, baraat and reception, in one wardrobe.",
    bannerImage: "/media/collections/wedding-collection.v3.jpg",
    thumbnail: "/media/collections/wedding-collection-thumb.v3.jpg",
    displayOrder: 2,
    isActive: true,
    isFeatured: true,
    startsAt: null,
    endsAt: null,
    seo: {
      metaTitle: "Indian Wedding Collection for Men | Danish Designer Studio",
      metaDescription:
        "Shop the Danish Designer Studio wedding collection — groom sherwanis, bandhgala suits and festive kurta sets for every wedding function.",
    },
  },
  {
    id: "col-groom",
    name: "Groom Collection",
    slug: "groom-collection",
    description: "Statement pieces built for the man at the centre of the frame.",
    bannerImage: "/media/collections/groom-collection.v3.jpg",
    thumbnail: "/media/collections/groom-collection-thumb.v3.jpg",
    displayOrder: 3,
    isActive: true,
    isFeatured: true,
    startsAt: null,
    endsAt: null,
    seo: {
      metaTitle: "Groom Collection | Danish Designer Studio",
      metaDescription:
        "Hand-crafted groom wear — zardozi sherwanis, velvet bandhgalas and heirloom-grade finishing.",
    },
  },
  {
    id: "col-festive",
    name: "Festive Collection",
    slug: "festive-collection",
    description: "Diwali, Eid, sangeet and every evening that deserves a little shine.",
    bannerImage: "/media/collections/festive-collection.v3.jpg",
    thumbnail: "/media/collections/festive-collection-thumb.v3.jpg",
    displayOrder: 4,
    isActive: true,
    isFeatured: false,
    startsAt: null,
    endsAt: null,
    seo: null,
  },
  {
    id: "col-eid",
    name: "Eid Collection",
    slug: "eid-collection",
    description: "Refined, comfortable and quietly festive — designed for the long Eid day.",
    bannerImage: "/media/collections/eid-collection.v3.jpg",
    thumbnail: "/media/collections/eid-collection-thumb.v3.jpg",
    displayOrder: 5,
    isActive: true,
    isFeatured: false,
    startsAt: null,
    endsAt: null,
    seo: null,
  },
  {
    id: "col-reception",
    name: "Reception Collection",
    slug: "reception-collection",
    description: "Black-tie energy with an Indian spine — tailored, tonal, photographic.",
    bannerImage: "/media/collections/reception-collection.v3.jpg",
    thumbnail: "/media/collections/reception-collection-thumb.v3.jpg",
    displayOrder: 6,
    isActive: true,
    isFeatured: true,
    startsAt: null,
    endsAt: null,
    seo: null,
  },
];

interface ProductSpec {
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  colors: [string, string][];
  sizes?: string[];
  collections: string[];
  flags?: Partial<
    Pick<Product, "isFeatured" | "isTrending" | "isBestSeller" | "isNewArrival" | "isPublished">
  >;
  material: string;
  fabric: string;
  tags: string[];
  short: string;
  body: string;
  sold: number;
  rating: [number, number];
}

const PRODUCT_SPECS: ProductSpec[] = [
  {
    slug: "noor-black-embroidered-kurta-set",
    name: "Noor Black Embroidered Kurta Pajama Set",
    category: "kurta-pajama",
    price: 8499,
    salePrice: 5799,
    stock: 24,
    colors: [
      ["Black", "#111114"],
      ["Deep Wine", "#5d1f2b"],
      ["Midnight Blue", "#16203a"],
    ],
    collections: ["new-collection", "festive-collection", "eid-collection"],
    flags: { isFeatured: true, isBestSeller: true, isNewArrival: true },
    material: "Viscose silk blend",
    fabric: "Art silk with resham thread work",
    tags: ["kurta", "embroidered", "festive", "black", "wedding"],
    short:
      "A matte black kurta set carrying antique-gold resham work across the placket and cuffs.",
    body:
      "Cut from a soft viscose-silk blend that falls without stiffness, the Noor kurta set is embroidered in antique gold resham across the placket, cuffs and hem. The panels are finished with a concealed side slit so the drape stays clean when you move, and the pyjama is cut straight with a drawstring waist for a full evening of comfort. Pair it with a brocade nehru jacket for a baraat, or wear it alone for an intimate nikah.",
    sold: 186,
    rating: [4.8, 64],
  },
  {
    slug: "regal-essence-kurta-pajama",
    name: "Regal Essence Trending Designer Kurta Pajama Set",
    category: "kurta-pajama",
    price: 9299,
    salePrice: 6299,
    stock: 18,
    colors: [
      ["Black", "#121215"],
      ["Ivory", "#efe9de"],
    ],
    collections: ["festive-collection", "wedding-collection"],
    flags: { isBestSeller: true, isTrending: true },
    material: "Dupion silk",
    fabric: "Dupion silk with zari border",
    tags: ["kurta", "zari", "silk", "festive"],
    short: "Dupion silk with a hand-set zari border and mandarin collar.",
    body:
      "The Regal Essence set is built on crisp dupion silk with a subtle slub that catches light without shine. A hand-set zari border runs the length of the placket and repeats at the cuff. Fully lined through the yoke for structure, with a straight pyjama in matching silk.",
    sold: 142,
    rating: [4.7, 51],
  },
  {
    slug: "shaan-gold-thread-kurta",
    name: "Shaan Gold Thread Work Kurta Pajama Set",
    category: "kurta-pajama",
    price: 7999,
    salePrice: 5299,
    stock: 4,
    colors: [
      ["Black", "#131316"],
      ["Rust", "#8a4a2b"],
    ],
    collections: ["festive-collection", "eid-collection"],
    flags: { isBestSeller: true, isTrending: true },
    material: "Cotton silk",
    fabric: "Cotton silk with metallic thread",
    tags: ["kurta", "gold", "thread-work", "eid"],
    short: "Floral metallic thread work spread across a deep-tone cotton-silk base.",
    body:
      "Metallic gold thread is worked into a spreading floral motif across the chest and sleeves, balanced by a plain back so the piece never tips into costume. Cotton silk keeps it breathable through a long day of celebration.",
    sold: 203,
    rating: [4.9, 78],
  },
  {
    slug: "midnight-velvet-bandhgala",
    name: "Midnight Velvet Bandhgala Suit",
    category: "bandhgala",
    price: 18999,
    salePrice: 14999,
    stock: 11,
    colors: [
      ["Midnight Blue", "#16203a"],
      ["Black", "#111114"],
    ],
    collections: ["reception-collection", "wedding-collection", "groom-collection"],
    flags: { isFeatured: true, isTrending: true, isNewArrival: true },
    material: "Cotton velvet",
    fabric: "Italian cotton velvet, full canvas front",
    tags: ["bandhgala", "velvet", "reception", "suit"],
    short: "A closed-collar velvet bandhgala with a canvassed front and mother-of-pearl buttons.",
    body:
      "Tailored from a dense Italian cotton velvet, this bandhgala holds a sharp closed collar and a lightly structured shoulder. The front is half-canvassed so it moulds to you over time rather than sitting flat. Finished with mother-of-pearl buttons and a bemberg lining that keeps the jacket cool under lights. Supplied with matching trousers.",
    sold: 96,
    rating: [4.9, 38],
  },
  {
    slug: "ivory-pearl-sherwani",
    name: "Ivory Pearl Hand-Embroidered Groom Sherwani",
    category: "sherwani",
    price: 42999,
    salePrice: 34999,
    stock: 6,
    colors: [
      ["Ivory", "#f0eade"],
      ["Champagne", "#ddcbab"],
    ],
    collections: ["wedding-collection", "groom-collection", "new-collection"],
    flags: { isFeatured: true, isBestSeller: true, isNewArrival: true },
    material: "Raw silk",
    fabric: "Raw silk with pearl, dabka and zardozi hand work",
    tags: ["sherwani", "groom", "ivory", "zardozi", "wedding"],
    short: "Pearl, dabka and zardozi worked by hand across an ivory raw-silk base.",
    body:
      "Roughly 180 hours of hand work sit on this sherwani. Pearls, dabka and zardozi are laid in a vertical vine across the front panels and climb the sleeve, leaving the back clean so the silhouette stays long. The raw silk is lined in cotton-satin and the hem is weighted so it hangs true through the ceremony. Supplied with a churidar and a matching dupatta.",
    sold: 54,
    rating: [5, 29],
  },
  {
    slug: "royal-maroon-sherwani",
    name: "Royal Maroon Zardozi Wedding Sherwani",
    category: "sherwani",
    price: 38999,
    salePrice: 31999,
    stock: 7,
    colors: [
      ["Maroon", "#5d1f2b"],
      ["Bottle Green", "#1f3a2c"],
    ],
    collections: ["wedding-collection", "groom-collection"],
    flags: { isFeatured: true, isTrending: true },
    material: "Velvet",
    fabric: "Silk velvet with zardozi",
    tags: ["sherwani", "maroon", "velvet", "groom"],
    short: "Silk velvet in deep maroon carrying full-panel zardozi craft.",
    body:
      "Deep maroon silk velvet with zardozi worked edge to edge on the front panels and collar. Structured through the shoulder and nipped lightly at the waist for a portrait-ready line. Includes churidar.",
    sold: 61,
    rating: [4.8, 33],
  },
  {
    slug: "obsidian-tiger-sherwani",
    name: "Obsidian Tiger Motif Designer Sherwani",
    category: "sherwani",
    price: 33999,
    salePrice: 28499,
    stock: 9,
    colors: [["Black", "#0f0f12"]],
    collections: ["groom-collection", "reception-collection"],
    flags: { isTrending: true, isNewArrival: true },
    material: "Suiting blend",
    fabric: "Matte suiting with silver thread appliqué",
    tags: ["sherwani", "black", "statement", "reception"],
    short: "A silver tiger motif sweeping across matte black — the statement piece of the line.",
    body:
      "A single silver-thread tiger motif sweeps from hem to shoulder across a matte black base. Everything else is deliberately quiet: plain collar, concealed placket, clean sleeve. Built for the reception entrance.",
    sold: 44,
    rating: [4.7, 21],
  },
  {
    slug: "heritage-open-jodhpuri",
    name: "Heritage Open Jodhpuri Set with Kurta",
    category: "jodhpuri",
    price: 21999,
    salePrice: 17999,
    stock: 13,
    colors: [
      ["Maroon", "#5f2330"],
      ["Ivory", "#efe9de"],
    ],
    collections: ["wedding-collection", "festive-collection"],
    flags: { isBestSeller: true, isTrending: true },
    material: "Silk blend",
    fabric: "Silk blend with multi-colour thread work",
    tags: ["jodhpuri", "open-jacket", "wedding", "set"],
    short: "An open jodhpuri jacket in multi-colour thread work over an ivory kurta set.",
    body:
      "The open jodhpuri jacket carries dense multi-colour thread work across both panels and is worn over a plain ivory kurta and churidar, both included. The contrast is the point — the jacket does the talking.",
    sold: 118,
    rating: [4.6, 42],
  },
  {
    slug: "emerald-silk-jodhpuri",
    name: "Emerald Silk Classic Jodhpuri Suit",
    category: "jodhpuri",
    price: 19999,
    stock: 8,
    colors: [
      ["Emerald", "#1f4a3a"],
      ["Charcoal", "#26262a"],
    ],
    collections: ["reception-collection", "festive-collection"],
    flags: { isNewArrival: true },
    material: "Raw silk",
    fabric: "Raw silk, half canvassed",
    tags: ["jodhpuri", "emerald", "silk", "suit"],
    short: "Deep emerald raw silk, cut close, with a self-toned button stance.",
    body:
      "A classic jodhpuri in deep emerald raw silk with self-toned buttons and a half-canvassed front. No embroidery — the colour and the cut carry it. Supplied with matching trousers.",
    sold: 37,
    rating: [4.7, 16],
  },
  {
    slug: "classic-black-bandhgala-suit",
    name: "Classic Black Handcrafted Bandhgala Suit",
    category: "bandhgala",
    price: 16999,
    salePrice: 13799,
    stock: 16,
    colors: [
      ["Black", "#111114"],
      ["Charcoal", "#2a2a2e"],
    ],
    collections: ["reception-collection", "new-collection"],
    flags: { isBestSeller: true, isFeatured: true },
    material: "Wool blend",
    fabric: "Wool-blend suiting with diagonal pintuck detail",
    tags: ["bandhgala", "black", "suit", "reception"],
    short: "Diagonal pintuck detailing across a clean black bandhgala front.",
    body:
      "Fine diagonal pintucks run across the chest of this bandhgala, catching light at an angle and disappearing head-on. Wool-blend suiting, bemberg lined, with a concealed hook at the collar. Trousers included.",
    sold: 131,
    rating: [4.8, 47],
  },
  {
    slug: "ivory-floral-indo-western",
    name: "Ivory Floral Draped Indo Western Set",
    category: "indo-western",
    price: 24999,
    salePrice: 19999,
    stock: 10,
    colors: [
      ["Ivory", "#f0eade"],
      ["Powder Blue", "#b9c8d6"],
    ],
    collections: ["wedding-collection", "new-collection"],
    flags: { isTrending: true, isNewArrival: true },
    material: "Georgette and raw silk",
    fabric: "Raw silk base with georgette drape",
    tags: ["indo-western", "drape", "ivory", "sangeet"],
    short: "A raw-silk base with a floral-embroidered georgette drape across one shoulder.",
    body:
      "A clean ivory raw-silk kurta and trouser, finished with a floral-embroidered georgette drape fixed at one shoulder. The drape is detachable, so the set works twice — once for the sangeet, once for a daytime function.",
    sold: 72,
    rating: [4.6, 25],
  },
  {
    slug: "cobalt-raw-silk-nehru-set",
    name: "Cobalt Raw Silk Nehru Jacket Set",
    category: "nehru-jackets",
    price: 12999,
    salePrice: 9999,
    stock: 21,
    colors: [
      ["Cobalt", "#1d3a6b"],
      ["Black", "#111114"],
    ],
    collections: ["festive-collection", "eid-collection"],
    flags: { isBestSeller: true },
    material: "Raw silk",
    fabric: "Raw silk with self jacquard",
    tags: ["nehru-jacket", "cobalt", "silk", "festive"],
    short: "A cobalt jacquard nehru jacket supplied with a tonal kurta and churidar.",
    body:
      "Self-jacquard raw silk in a deep cobalt, cut as a five-button nehru jacket with a mandarin collar. Comes with a tonal kurta and churidar so it works straight out of the box.",
    sold: 109,
    rating: [4.5, 36],
  },
  {
    slug: "champagne-zardozi-sherwani",
    name: "Champagne Zardozi Reception Sherwani",
    category: "sherwani",
    price: 36999,
    salePrice: 29999,
    stock: 5,
    colors: [["Champagne", "#ddcbab"]],
    collections: ["reception-collection", "groom-collection"],
    flags: { isFeatured: true },
    material: "Silk blend",
    fabric: "Silk blend with tonal zardozi",
    tags: ["sherwani", "champagne", "reception"],
    short: "Tonal zardozi on champagne — texture without contrast.",
    body:
      "Zardozi worked in the same tone as the base fabric, so the sherwani reads as texture at a distance and as craft up close. Ideal for receptions where the lighting is warm.",
    sold: 41,
    rating: [4.8, 19],
  },
  {
    slug: "onyx-mirror-work-kurta",
    name: "Onyx Mirror Work Festive Kurta Set",
    category: "kurta-pajama",
    price: 10499,
    salePrice: 7999,
    stock: 0,
    colors: [["Black", "#121215"]],
    collections: ["festive-collection"],
    flags: { isTrending: true },
    material: "Georgette",
    fabric: "Georgette with mirror and thread work",
    tags: ["kurta", "mirror-work", "festive", "sangeet"],
    short: "Hand-set mirror work scattered across a fluid georgette kurta.",
    body:
      "Small hand-set mirrors are scattered across the yoke and sleeves and fade out towards the hem. Georgette keeps the movement fluid under stage lighting. Comes with a cotton-silk churidar.",
    sold: 88,
    rating: [4.6, 30],
  },
  {
    slug: "saffron-festive-kurta-set",
    name: "Saffron Festive Cotton Silk Kurta Set",
    category: "kurta-pajama",
    price: 6499,
    salePrice: 4499,
    stock: 32,
    colors: [
      ["Saffron", "#c87f2e"],
      ["Sage", "#7d8a6a"],
    ],
    collections: ["eid-collection", "festive-collection"],
    flags: { isNewArrival: true },
    material: "Cotton silk",
    fabric: "Cotton silk with tonal placket embroidery",
    tags: ["kurta", "saffron", "eid", "daywear"],
    short: "A warm saffron cotton-silk kurta with tonal placket embroidery.",
    body:
      "Lightweight cotton silk in a warm saffron, with tonal embroidery limited to the placket. Built for daytime functions where a full festive kurta would be too much.",
    sold: 145,
    rating: [4.4, 44],
  },
  {
    slug: "charcoal-textured-bandhgala",
    name: "Charcoal Textured Bandhgala Jacket",
    category: "bandhgala",
    price: 14999,
    stock: 3,
    colors: [["Charcoal", "#2a2a2e"]],
    collections: ["reception-collection"],
    flags: {},
    material: "Textured suiting",
    fabric: "Textured wool-blend suiting",
    tags: ["bandhgala", "charcoal", "jacket"],
    short: "A textured charcoal bandhgala jacket, sold on its own to layer as you like.",
    body:
      "Jacket only. A textured charcoal weave with a closed collar and five self-toned buttons — designed to be worn over a kurta or with plain trousers.",
    sold: 58,
    rating: [4.5, 14],
  },
  {
    slug: "pearl-white-groom-sherwani",
    name: "Pearl White Sequin Groom Sherwani",
    category: "sherwani",
    price: 45999,
    salePrice: 38999,
    stock: 4,
    colors: [["Pearl White", "#f4f0e7"]],
    collections: ["groom-collection", "wedding-collection"],
    flags: { isFeatured: true, isTrending: true },
    material: "Raw silk",
    fabric: "Raw silk with sequin and dabka work",
    tags: ["sherwani", "white", "groom", "sequin"],
    short: "Sequin and dabka work laid over pearl-white raw silk, hem to collar.",
    body:
      "The most worked piece in the collection. Sequins and dabka cover the front panels and sleeves completely, laid over pearl-white raw silk. Heavily lined and weighted at the hem. Supplied with churidar, dupatta and a matching stole.",
    sold: 33,
    rating: [5, 17],
  },
  {
    slug: "wine-velvet-jodhpuri-set",
    name: "Wine Velvet Jodhpuri Suit",
    category: "jodhpuri",
    price: 23999,
    salePrice: 18999,
    stock: 12,
    colors: [
      ["Wine", "#5d1f2b"],
      ["Forest", "#22362b"],
    ],
    collections: ["wedding-collection", "reception-collection"],
    flags: { isBestSeller: true },
    material: "Velvet",
    fabric: "Cotton velvet with tonal buttons",
    tags: ["jodhpuri", "velvet", "wine"],
    short: "Cotton velvet in a deep wine with a close, modern jodhpuri cut.",
    body:
      "A modern jodhpuri in deep wine cotton velvet with tonal buttons and a slightly shorter length than the classic cut. Trousers included.",
    sold: 84,
    rating: [4.7, 27],
  },
  {
    slug: "sage-linen-kurta-pajama",
    name: "Sage Linen Everyday Kurta Pajama",
    category: "kurta-pajama",
    price: 4999,
    salePrice: 3499,
    stock: 40,
    colors: [
      ["Sage", "#7d8a6a"],
      ["Sand", "#c6b59a"],
      ["White", "#f2efe9"],
    ],
    collections: ["eid-collection"],
    flags: { isNewArrival: true },
    material: "Pure linen",
    fabric: "Washed pure linen",
    tags: ["kurta", "linen", "everyday", "summer"],
    short: "Washed pure linen, cut relaxed, for the days between the big ones.",
    body:
      "Washed linen with a relaxed body and a soft collar. No embroidery, no lining — just a well-cut kurta that gets better with every wash. Sold with a matching drawstring pyjama.",
    sold: 167,
    rating: [4.5, 58],
  },
  {
    slug: "imperial-blue-bandhgala",
    name: "Imperial Blue Raw Silk Bandhgala",
    category: "bandhgala",
    price: 17999,
    salePrice: 14499,
    stock: 14,
    colors: [
      ["Imperial Blue", "#1b2c4d"],
      ["Slate", "#3a4250"],
    ],
    collections: ["reception-collection", "new-collection"],
    flags: { isNewArrival: true, isTrending: true },
    material: "Raw silk",
    fabric: "Raw silk with contrast piping",
    tags: ["bandhgala", "blue", "silk"],
    short: "Imperial blue raw silk with a fine contrast piping along the collar.",
    body:
      "Raw silk in a saturated imperial blue, with a hairline contrast piping tracing the collar and pocket line. Half-canvassed, bemberg lined, trousers included.",
    sold: 67,
    rating: [4.6, 22],
  },
  {
    slug: "antique-gold-sherwani",
    name: "Antique Gold Brocade Sherwani",
    category: "sherwani",
    price: 31999,
    salePrice: 25999,
    stock: 6,
    colors: [["Antique Gold", "#b7924f"]],
    collections: ["wedding-collection", "festive-collection"],
    flags: {},
    material: "Brocade",
    fabric: "Banarasi-style brocade",
    tags: ["sherwani", "gold", "brocade", "wedding"],
    short: "A woven brocade sherwani — the pattern is in the cloth, not on it.",
    body:
      "Woven Banarasi-style brocade in antique gold. Because the pattern is woven rather than embroidered, the piece stays light and drapes softly. Churidar included.",
    sold: 49,
    rating: [4.7, 18],
  },
  {
    slug: "noir-sequin-indo-western",
    name: "Noir Sequin Asymmetric Indo Western",
    category: "indo-western",
    price: 22999,
    salePrice: 17999,
    stock: 9,
    colors: [["Black", "#0f0f12"]],
    collections: ["reception-collection", "new-collection"],
    flags: { isTrending: true, isNewArrival: true },
    material: "Suiting and georgette",
    fabric: "Matte suiting with sequin georgette panel",
    tags: ["indo-western", "sequin", "black", "sangeet"],
    short: "An asymmetric front with a sequinned panel — built for stage lighting.",
    body:
      "An asymmetric hem, a diagonal closure and a sequinned georgette panel worked into one side. Matte black everywhere else so the shine stays controlled. Trousers included.",
    sold: 56,
    rating: [4.6, 20],
  },
  {
    slug: "ivory-chikankari-kurta",
    name: "Ivory Chikankari Hand-Work Kurta Set",
    category: "kurta-pajama",
    price: 8999,
    salePrice: 6999,
    stock: 15,
    colors: [
      ["Ivory", "#f0eade"],
      ["Powder Blue", "#b9c8d6"],
    ],
    collections: ["eid-collection", "festive-collection", "new-collection"],
    flags: { isNewArrival: true, isFeatured: true },
    material: "Cotton",
    fabric: "Cotton with Lucknowi chikankari",
    tags: ["kurta", "chikankari", "ivory", "handwork"],
    short: "Lucknowi chikankari worked by hand across a fine ivory cotton.",
    body:
      "Genuine Lucknowi chikankari, hand-worked on fine ivory cotton across the yoke, placket and cuffs. Breathable enough for a summer nikah and quiet enough for a daytime function. Comes with a cotton churidar.",
    sold: 97,
    rating: [4.8, 34],
  },
  {
    slug: "rust-brocade-nehru-jacket",
    name: "Rust Brocade Nehru Jacket",
    category: "nehru-jackets",
    price: 7499,
    salePrice: 5499,
    stock: 26,
    colors: [
      ["Rust", "#8a4a2b"],
      ["Bottle Green", "#1f3a2c"],
      ["Black", "#111114"],
    ],
    collections: ["festive-collection"],
    flags: { isBestSeller: true },
    material: "Brocade",
    fabric: "Brocade with cotton lining",
    tags: ["nehru-jacket", "rust", "brocade", "layer"],
    short: "A woven rust brocade jacket that lifts any plain kurta.",
    body:
      "Jacket only. Woven rust brocade with a cotton lining and five tonal buttons — the fastest way to turn a plain kurta into festive wear.",
    sold: 124,
    rating: [4.5, 41],
  },
];

function buildVariants(spec: ProductSpec, productId: string): ProductVariant[] {
  const sizes = spec.sizes ?? ALL_SIZES;
  const variants: ProductVariant[] = [];
  const perCombo = Math.max(0, Math.floor(spec.stock / (sizes.length * spec.colors.length)));

  spec.colors.forEach(([color, hex], ci) => {
    sizes.forEach((size, si) => {
      // Distribute stock realistically: mid sizes carry more depth.
      const bias = size === "M" || size === "L" ? 2 : size === "XXL" ? -1 : 0;
      const qty = spec.stock === 0 ? 0 : Math.max(0, perCombo + bias + (ci === 0 ? 1 : 0));
      variants.push({
        id: `${productId}-v-${ci}-${si}`,
        productId,
        sku: `${spec.slug.slice(0, 6).toUpperCase()}-${color.slice(0, 3).toUpperCase()}-${size}`,
        size,
        color,
        colorHex: hex,
        price: null,
        salePrice: null,
        stockQuantity: qty,
        isActive: true,
      });
    });
  });
  return variants;
}

const BASE_DATE = new Date("2026-01-05T09:00:00.000Z").getTime();

export const seedProducts: Product[] = PRODUCT_SPECS.map((spec, index) => {
  const id = `prd-${spec.slug}`;
  const category = seedCategories.find((c) => c.slug === spec.category)!;
  const variants = buildVariants(spec, id);
  const createdAt = new Date(BASE_DATE - index * 36 * 60 * 60 * 1000).toISOString();
  const threshold = 5;

  return {
    id,
    name: spec.name,
    slug: spec.slug,
    sku: `DDS-${String(index + 1).padStart(4, "0")}`,
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    brand: "Danish Designer Studio",
    shortDescription: spec.short,
    description: spec.body,
    price: spec.price,
    salePrice: spec.salePrice ?? null,
    costPrice: Math.round(spec.price * 0.52),
    stockQuantity: spec.stock,
    lowStockThreshold: threshold,
    stockStatus: stockStatusFor(spec.stock, threshold),
    material: spec.material,
    fabric: spec.fabric,
    careInstructions:
      "Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.",
    tags: spec.tags,
    sizes: spec.sizes ?? ALL_SIZES,
    colors: spec.colors.map(([c]) => c),
    images: [1, 2, 3, 4].map((n) => ({
      id: `${id}-img-${n}`,
      url: `/media/products/${spec.slug}-${n}.v3.jpg`,
      alt: `${spec.name} — view ${n}`,
      displayOrder: n,
    })),
    videoUrl: null,
    variants,
    isFeatured: spec.flags?.isFeatured ?? false,
    isTrending: spec.flags?.isTrending ?? false,
    isBestSeller: spec.flags?.isBestSeller ?? false,
    isNewArrival: spec.flags?.isNewArrival ?? false,
    isPublished: spec.flags?.isPublished ?? true,
    displayOrder: index + 1,
    relatedProductIds: [],
    collectionSlugs: spec.collections,
    ratingAverage: spec.rating[0],
    ratingCount: spec.rating[1],
    soldCount: spec.sold,
    seo: {
      metaTitle: `${spec.name} | Danish Designer Studio`,
      metaDescription: spec.short,
      keywords: spec.tags,
      ogImage: `/media/products/${spec.slug}-1.v3.jpg`,
    },
    createdAt,
    updatedAt: createdAt,
  };
});

// Related products: same category first, then same collection.
for (const product of seedProducts) {
  const sameCategory = seedProducts.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug
  );
  const sameCollection = seedProducts.filter(
    (p) =>
      p.id !== product.id &&
      p.categorySlug !== product.categorySlug &&
      p.collectionSlugs.some((c) => product.collectionSlugs.includes(c))
  );
  product.relatedProductIds = [...sameCategory, ...sameCollection].slice(0, 6).map((p) => p.id);
}

export const seedTestimonials: Testimonial[] = [
  {
    id: "tst-1",
    authorName: "Arjun Mehta",
    location: "Mumbai, India",
    rating: 5,
    content:
      "Danish Designer Studio exceeded every expectation. The fabric and the hand work are genuinely stunning, and the fit out of the box was better than the last two pieces I had tailored locally. The team answered every message within the hour.",
    image: "/media/avatars/arjun.v3.jpg",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "tst-2",
    authorName: "Vikram Suri",
    location: "Delhi, India",
    rating: 5,
    content:
      "I wore the ivory pearl sherwani for my nikah. Three months later people still bring it up. The weight of it, the way the hem hangs — you can feel where the work went.",
    image: "/media/avatars/vikram.v3.jpg",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "tst-3",
    authorName: "Imran Qureshi",
    location: "Dubai, UAE",
    rating: 5,
    content:
      "Ordered from Dubai and it arrived in nine days, beautifully packed. The measurement guidance on the product page was accurate to the centimetre.",
    image: "/media/avatars/imran.v3.jpg",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "tst-4",
    authorName: "Rahul Bansal",
    location: "Bengaluru, India",
    rating: 4,
    content:
      "The velvet bandhgala is superb quality for the price. I sized up on the advice of their stylist and it was exactly right.",
    image: "/media/avatars/rahul.v3.jpg",
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "tst-5",
    authorName: "Zaid Ansari",
    location: "Lucknow, India",
    rating: 5,
    content:
      "The chikankari kurta is the real thing — hand-worked, not printed. Wore it through a full summer day and stayed comfortable.",
    image: "/media/avatars/zaid.v3.jpg",
    isActive: true,
    displayOrder: 5,
  },
];

export const seedReviews: Review[] = seedProducts.slice(0, 12).flatMap((product, i) => {
  const authors = [
    ["Rahul Bansal", "Superb finish for the price"],
    ["Zaid Ansari", "Exactly as photographed"],
    ["Kabir Nair", "Fit was spot on"],
  ] as const;
  return authors.slice(0, (i % 3) + 1).map((author, j) => ({
    id: `rev-${product.id}-${j}`,
    productId: product.id,
    productName: product.name,
    userId: null,
    authorName: author[0],
    rating: j === 2 ? 4 : 5,
    title: author[1],
    content:
      j === 0
        ? "Ordered for a family wedding and it arrived three days early. The fabric has real weight to it and the embroidery is neat on both sides, which is usually where cheaper pieces give themselves away."
        : j === 1
          ? "The colour matches the product photos closely. I usually take a Large and the Large fit true with a little room through the chest."
          : "Very good quality overall. Took one star off only because the churidar needed a small alteration at the ankle.",
    status: (i === 11 && j === 0 ? "pending" : "approved") as Review["status"],
    isFeatured: i < 2 && j === 0,
    isVerifiedPurchase: true,
    createdAt: new Date(BASE_DATE - (i * 3 + j) * 24 * 60 * 60 * 1000).toISOString(),
  }));
});

export const seedBlogCategories: BlogCategory[] = [
  { id: "bcat-1", name: "Style Guides", slug: "style-guides" },
  { id: "bcat-2", name: "Wedding", slug: "wedding" },
  { id: "bcat-3", name: "Fabric & Craft", slug: "fabric-and-craft" },
];

const BLOG_SPECS: [string, string, string, string, string, string[]][] = [
  [
    "sherwani-guide",
    "How To Choose A Groom Sherwani That Actually Suits You",
    "wedding",
    "Wedding",
    "Colour, craft, silhouette and the three measurements most grooms get wrong.",
    ["sherwani", "groom", "wedding", "buying guide"],
  ],
  [
    "kurta-fabric-guide",
    "A Practical Guide To Kurta Fabrics",
    "fabric-and-craft",
    "Fabric & Craft",
    "Silk, linen, cotton silk and georgette — what each one does in heat, in photos and over time.",
    ["fabric", "kurta", "linen", "silk"],
  ],
  [
    "wedding-colour-palette",
    "Wedding Colour Palettes For 2026",
    "wedding",
    "Wedding",
    "The palettes working best this season, and how to coordinate without matching exactly.",
    ["colour", "wedding", "trends"],
  ],
  [
    "bandhgala-styling",
    "Styling The Modern Bandhgala",
    "style-guides",
    "Style Guides",
    "Six ways to wear a bandhgala beyond the obvious wedding reception.",
    ["bandhgala", "styling", "formalwear"],
  ],
  [
    "eid-lookbook",
    "Eid Lookbook: Dressing For The Long Day",
    "style-guides",
    "Style Guides",
    "Morning prayers to evening dinners, in pieces that survive all of it.",
    ["eid", "lookbook", "festive"],
  ],
  [
    "measurement-guide",
    "Getting Your Measurements Right The First Time",
    "fabric-and-craft",
    "Fabric & Craft",
    "A tape measure, a mirror and ten minutes is all it takes.",
    ["measurements", "fit", "guide"],
  ],
];

function blogBody(title: string, excerpt: string) {
  return `## Start with the occasion, not the outfit

${excerpt} Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

The mistake most people make is shopping by photograph. A piece that photographs beautifully in a studio can read heavy in daylight, and a subtle tonal texture that looks plain on a screen often reads as quiet luxury in person.

## Let the fabric decide the silhouette

Raw silk holds structure and is the reason a bandhgala keeps its shoulder line all evening. Linen does the opposite — it relaxes, creases and softens, which is exactly what you want across a long summer day. Georgette moves, which makes it the right call when you will be on your feet under stage lights.

Match the fabric to the length of the day first. The silhouette follows naturally from there.

## Three details worth paying for

1. **Lining.** A bemberg or cotton-satin lining costs more and is the single biggest contributor to how a garment feels after four hours.
2. **Hem weighting.** A weighted hem is why a sherwani hangs straight in photographs instead of riding up.
3. **Finishing on the reverse.** Turn the piece inside out. Neat work on the back of embroidery is the clearest signal of where the hours went.

## Fit beats everything

No amount of hand work rescues a poor shoulder fit. Measure across the back, from the edge of one shoulder bone to the other, and treat that number as fixed — everything else can be adjusted afterwards, but the shoulder cannot.

If you are between sizes, size up and have the waist taken in. Adding cloth is difficult; removing it is routine.

## Care, so it survives the wardrobe

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.`;
}

export const seedBlogPosts: BlogPost[] = BLOG_SPECS.map(
  ([slug, title, catSlug, catName, excerpt, tags], i) => {
    const content = blogBody(title, excerpt);
    return {
      id: `blog-${slug}`,
      title,
      slug,
      excerpt,
      content,
      coverImage: `/media/blog/${slug}.v3.jpg`,
      authorName: "Danish Designer Studio Studio",
      categorySlug: catSlug,
      categoryName: catName,
      tags,
      status: "published" as const,
      publishedAt: new Date(BASE_DATE - i * 9 * 24 * 60 * 60 * 1000).toISOString(),
      readingMinutes: readingTime(content),
      faqs: [
        {
          question: "How far in advance should I order?",
          answer:
            "Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work.",
        },
        {
          question: "Do you ship outside India?",
          answer:
            "Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days.",
        },
        {
          question: "Can alterations be done locally?",
          answer:
            "Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery.",
        },
      ],
      seo: {
        metaTitle: `${title} | Danish Designer Studio Journal`,
        metaDescription: excerpt,
        keywords: tags,
        ogImage: `/media/blog/${slug}.v3.jpg`,
      },
    };
  }
);

export const seedHomeSections: HomeSection[] = [
  {
    id: "hs-hero",
    type: "hero",
    title: "Danish Designer Studio Collections",
    subtitle: "Celebrate simply, remember forever",
    displayOrder: 1,
    isActive: true,
    config: {
      primaryImage: "/media/banners/hero-primary.v3.jpg",
      primaryCta: { label: "Go to shop", href: "/shop" },
      cards: [
        {
          eyebrow: "Kurta Pajama",
          title: "New Modern",
          image: "/media/banners/hero-kurta.v3.jpg",
          cta: { label: "View product", href: "/category/kurta-pajama" },
        },
        {
          eyebrow: "Bandhgala Jodhpuri",
          title: "Big Discount",
          image: "/media/banners/hero-bandhgala.v3.jpg",
          cta: { label: "Grab offers", href: "/collection/reception-collection" },
        },
      ],
    },
  },
  {
    id: "hs-inspiration",
    type: "inspiration",
    title: "Looking for inspiration with a wild groom sherwani?",
    subtitle: "Celebrities outfits ideas",
    displayOrder: 2,
    isActive: true,
    config: {
      cta: { label: "Start shopping", href: "/collection/groom-collection" },
      images: [
        "/media/banners/inspiration-1.v3.jpg",
        "/media/banners/inspiration-2.v3.jpg",
        "/media/banners/inspiration-3.v3.jpg",
      ],
    },
  },
  {
    id: "hs-best",
    type: "best_sellers",
    title: "Most Purchased",
    subtitle: "Discounts and savings of up to 25%",
    displayOrder: 3,
    isActive: true,
    config: { limit: 8, cta: { label: "View all best sellers", href: "/shop?sort=best_selling" } },
  },
  {
    id: "hs-categories",
    type: "featured_categories",
    title: "Shop by silhouette",
    subtitle: "Six houses, one wardrobe",
    displayOrder: 4,
    isActive: true,
    config: { limit: 6 },
  },
  {
    id: "hs-editorial",
    type: "editorial",
    title: "Indian Vogue Timeless & Trendy",
    subtitle: "@danishdesignerstudio #DanishDesignerStudio",
    displayOrder: 5,
    isActive: true,
    config: {
      body:
        "Explore trendy Indian outfits crafted with elegance, rich colours and timeless tradition — a considered blend of modern tailoring and cultural dress.",
      cta: { label: "Go to shop", href: "/shop" },
      images: ["/media/banners/editorial-vogue.v3.jpg", "/media/banners/editorial-couple.v3.jpg"],
    },
  },
  {
    id: "hs-new",
    type: "new_arrivals",
    title: "New Arrivals",
    subtitle: "Released this season in small batches",
    displayOrder: 6,
    isActive: true,
    config: { limit: 8, cta: { label: "See new arrivals", href: "/shop?sort=newest" } },
  },
  {
    id: "hs-marquee",
    type: "marquee_banner",
    title: "New Arrivals",
    subtitle: null,
    displayOrder: 7,
    isActive: true,
    config: {
      image: "/media/banners/new-arrivals-strip.v3.jpg",
      cta: { label: "See new arrival", href: "/collection/new-collection" },
    },
  },
  {
    id: "hs-trust",
    type: "trust_badges",
    title: null,
    subtitle: null,
    displayOrder: 8,
    isActive: true,
    config: {
      badges: [
        { icon: "truck", title: "Fast delivery", text: "Free shipping all over India" },
        { icon: "shield", title: "Secure checkout", text: "256-bit payment protection" },
        { icon: "credit-card", title: "Razorpay gateway", text: "UPI, cards and net banking" },
        { icon: "percent", title: "10% first order", text: "Join the list and save" },
      ],
    },
  },
  {
    id: "hs-collections",
    type: "collection_banner",
    title: "Collections",
    subtitle: "Curated for the occasion",
    displayOrder: 9,
    isActive: true,
    config: { limit: 3, featuredOnly: true },
  },
  {
    id: "hs-trending",
    type: "trending",
    title: "Trending Products",
    subtitle: "Preorder now for exclusive deals and member gifts",
    displayOrder: 10,
    isActive: true,
    config: { limit: 8, cta: { label: "View all trending", href: "/shop?trending=1" } },
  },
  {
    id: "hs-testimonials",
    type: "testimonials",
    title: "What Our Customers Say",
    subtitle: null,
    displayOrder: 11,
    isActive: true,
    config: { background: "/media/banners/testimonial-bg.v3.jpg" },
  },
  {
    id: "hs-instagram",
    type: "instagram",
    title: "Follow on Instagram",
    subtitle: "@danishdesignerstudio",
    displayOrder: 12,
    isActive: true,
    config: {
      handle: "danishdesignerstudio",
      url: "https://instagram.com/danishdesignerstudio",
      images: [1, 2, 3, 4, 5, 6].map((n) => `/media/instagram/ig-${n}.v3.jpg`),
    },
  },
  {
    id: "hs-newsletter",
    type: "newsletter",
    title: "Subscribe and get 20% off your first order",
    subtitle: "Early access to new collections, styling notes and private sales. No noise.",
    displayOrder: 13,
    isActive: true,
    config: { buttonText: "Subscribe" },
  },
];

export const seedBanners: Banner[] = [
  {
    id: "ban-1",
    title: "Danish Designer Studio Collections",
    subtitle: "Celebrate simply, remember forever",
    eyebrow: "Autumn / Winter 2026",
    image: "/media/banners/hero-primary.v3.jpg",
    mobileImage: null,
    linkUrl: "/shop",
    buttonText: "Go to shop",
    placement: "home_hero",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "ban-2",
    title: "New Modern",
    subtitle: "Kurta Pajama",
    eyebrow: "Kurta Pajama",
    image: "/media/banners/hero-kurta.v3.jpg",
    mobileImage: null,
    linkUrl: "/category/kurta-pajama",
    buttonText: "View product",
    placement: "home_hero_card",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "ban-3",
    title: "Big Discount",
    subtitle: "Bandhgala Jodhpuri",
    eyebrow: "Bandhgala Jodhpuri",
    image: "/media/banners/hero-bandhgala.v3.jpg",
    mobileImage: null,
    linkUrl: "/collection/reception-collection",
    buttonText: "Grab offers",
    placement: "home_hero_card",
    displayOrder: 3,
    isActive: true,
  },
];

export const seedNavigation: NavigationItem[] = [
  { id: "nav-1", label: "Shop", href: "/shop", displayOrder: 1, isActive: true, location: "main", badge: null, parentId: null },
  { id: "nav-2", label: "About Us", href: "/about", displayOrder: 2, isActive: true, location: "main", badge: "HOT", parentId: null },
  { id: "nav-3", label: "Collections", href: "/collections", displayOrder: 3, isActive: true, location: "main", badge: null, parentId: null },
  { id: "nav-4", label: "Journal", href: "/blog", displayOrder: 4, isActive: true, location: "main", badge: null, parentId: null },
  { id: "nav-5", label: "Contact", href: "/contact", displayOrder: 5, isActive: true, location: "main", badge: null, parentId: null },

  { id: "nav-c1", label: "My Account", href: "/account", displayOrder: 1, isActive: true, location: "footer_customer", badge: null, parentId: null },
  { id: "nav-c2", label: "Orders", href: "/account/orders", displayOrder: 2, isActive: true, location: "footer_customer", badge: null, parentId: null },
  { id: "nav-c3", label: "Wishlist", href: "/wishlist", displayOrder: 3, isActive: true, location: "footer_customer", badge: null, parentId: null },
  { id: "nav-c4", label: "Journal", href: "/blog", displayOrder: 4, isActive: true, location: "footer_customer", badge: null, parentId: null },

  { id: "nav-k1", label: "Kurta Pajama", href: "/category/kurta-pajama", displayOrder: 1, isActive: true, location: "footer_categories", badge: null, parentId: null },
  { id: "nav-k2", label: "Sherwani", href: "/category/sherwani", displayOrder: 2, isActive: true, location: "footer_categories", badge: null, parentId: null },
  { id: "nav-k3", label: "Bandhgala", href: "/category/bandhgala", displayOrder: 3, isActive: true, location: "footer_categories", badge: null, parentId: null },
  { id: "nav-k4", label: "Jodhpuri", href: "/category/jodhpuri", displayOrder: 4, isActive: true, location: "footer_categories", badge: null, parentId: null },

  { id: "nav-p1", label: "Privacy Policy", href: "/privacy-policy", displayOrder: 1, isActive: true, location: "footer_policies", badge: null, parentId: null },
  { id: "nav-p2", label: "Terms & Conditions", href: "/terms", displayOrder: 2, isActive: true, location: "footer_policies", badge: null, parentId: null },
  { id: "nav-p3", label: "Shipping Policy", href: "/shipping-policy", displayOrder: 3, isActive: true, location: "footer_policies", badge: null, parentId: null },
  { id: "nav-p4", label: "Return Policy", href: "/return-policy", displayOrder: 4, isActive: true, location: "footer_policies", badge: null, parentId: null },
];

export const seedCoupons: Coupon[] = [
  {
    id: "cpn-1",
    code: "WELCOME20",
    description: "20% off your first order",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 3000,
    maxDiscount: 5000,
    usageLimit: 1000,
    usedCount: 214,
    startsAt: null,
    expiresAt: null,
    isActive: true,
  },
  {
    id: "cpn-2",
    code: "FESTIVE10",
    description: "Flat 10% off the festive collection",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: 3000,
    usageLimit: null,
    usedCount: 88,
    startsAt: null,
    expiresAt: null,
    isActive: true,
  },
  {
    id: "cpn-3",
    code: "FLAT1500",
    description: "₹1,500 off orders above ₹15,000",
    discountType: "fixed",
    discountValue: 1500,
    minOrderValue: 15000,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 37,
    startsAt: null,
    expiresAt: null,
    isActive: true,
  },
];

const policyBody = (heading: string, paras: string[]) =>
  `## ${heading}\n\n${paras.join("\n\n")}`;

export const seedPages: SitePage[] = [
  {
    id: "pg-privacy",
    title: "Privacy Policy",
    slug: "privacy-policy",
    isPublished: true,
    updatedAt: new Date(BASE_DATE).toISOString(),
    content: policyBody("What we collect", [
      "We collect the information you give us when you create an account, place an order or contact our team: your name, email address, phone number and shipping address. We also collect basic technical information such as your device type and the pages you visit, which helps us keep the store fast and secure.",
      "### How we use it\n\nYour information is used to process orders, arrange delivery, respond to support requests and — only if you opt in — send occasional styling notes and collection announcements. We do not sell personal data to anyone.",
      "### Payments\n\nCard and UPI details are handled entirely by our payment gateway. Danish Designer Studio never receives or stores your full card number, CVV or UPI PIN.",
      "### Cookies\n\nWe use cookies to keep you signed in, remember your cart and understand which pages are useful. You can clear or block cookies in your browser; the store will still work, though your cart may not persist between visits.",
      "### Your rights\n\nYou can request a copy of the data we hold about you, ask us to correct it, or ask us to delete your account entirely. Write to support@danishdesignerstudio.com and we will respond within seven working days.",
    ]),
    seo: {
      metaTitle: "Privacy Policy | Danish Designer Studio",
      metaDescription:
        "How Danish Designer Studio collects, uses and protects your personal information, and the rights you have over your data.",
    },
  },
  {
    id: "pg-terms",
    title: "Terms & Conditions",
    slug: "terms",
    isPublished: true,
    updatedAt: new Date(BASE_DATE).toISOString(),
    content: policyBody("Agreement", [
      "By using danishdesignerstudio.com and placing an order you agree to these terms. Please read them before you buy.",
      "### Orders and pricing\n\nAll prices are in Indian Rupees and include applicable taxes unless stated otherwise at checkout. We reserve the right to correct pricing errors and to cancel an order where a listing was clearly mispriced; you will be refunded in full in that case.",
      "### Product representation\n\nHand-worked garments vary slightly from piece to piece. Colours may also render differently between screens. Small variations in embroidery placement are a feature of hand craft, not a defect.",
      "### Made-to-measure\n\nMade-to-measure pieces are cut to the measurements you supply and cannot be cancelled once cutting has begun. Please check the measurement guide carefully before confirming.",
      "### Intellectual property\n\nAll photography, copy, designs and the Danish Designer Studio name are our property and may not be reproduced without written permission.",
      "### Governing law\n\nThese terms are governed by the laws of India, with jurisdiction in Uttar Pradesh.",
    ]),
    seo: {
      metaTitle: "Terms & Conditions | Danish Designer Studio",
      metaDescription:
        "The terms that apply when you shop with Danish Designer Studio — orders, pricing, made-to-measure and intellectual property.",
    },
  },
  {
    id: "pg-shipping",
    title: "Shipping Policy",
    slug: "shipping-policy",
    isPublished: true,
    updatedAt: new Date(BASE_DATE).toISOString(),
    content: policyBody("Delivery within India", [
      "Shipping is free on every order within India. In-stock pieces are dispatched within two working days and typically arrive in three to six working days depending on your city.",
      "### Made-to-measure timelines\n\nMade-to-measure sherwanis and bandhgalas take four to six weeks in the atelier before dispatch. Heavily hand-worked pieces can take up to ten weeks — the timeline is confirmed by our team within 24 hours of your order.",
      "### International delivery\n\nWe ship worldwide by tracked courier. International orders usually clear customs and arrive within seven to twelve working days. Import duties and local taxes are the responsibility of the recipient.",
      "### Tracking\n\nA tracking number and courier name are added to your order as soon as it leaves us, and are visible in your account under Orders. You will also receive an email.",
      "### Undelivered parcels\n\nIf a courier is unable to deliver after three attempts the parcel returns to us. We will contact you to arrange redelivery; a redelivery charge may apply for international orders.",
    ]),
    seo: {
      metaTitle: "Shipping Policy | Danish Designer Studio",
      metaDescription:
        "Free shipping across India, made-to-measure timelines, international delivery and order tracking.",
    },
  },
  {
    id: "pg-returns",
    title: "Return Policy",
    slug: "return-policy",
    isPublished: true,
    updatedAt: new Date(BASE_DATE).toISOString(),
    content: policyBody("Returns and exchanges", [
      "We accept returns on ready-to-wear pieces within seven days of delivery, provided the garment is unworn, unwashed and still carries its original tags and packaging.",
      "### How to start a return\n\nWrite to support@danishdesignerstudio.com with your order number and a photograph of the piece. We will arrange a pickup where a reverse courier is available, or share a return address if not.",
      "### Refunds\n\nApproved refunds are issued to the original payment method within five to seven working days of the piece reaching us and passing inspection.",
      "### Exchanges\n\nSize exchanges are free once per order within India, subject to availability. If your size is unavailable we will offer a full refund or store credit.",
      "### What we cannot accept\n\nMade-to-measure garments, altered pieces, and items returned without tags or original packaging cannot be accepted. Damaged or incorrect items are always our responsibility — tell us within 48 hours of delivery and we will replace or refund in full.",
    ]),
    seo: {
      metaTitle: "Return Policy | Danish Designer Studio",
      metaDescription:
        "Seven-day returns on ready-to-wear, free size exchanges within India, and how refunds are processed.",
    },
  },
];

export const seedSettings: SiteSettings = {
  siteName: "Danish Designer Studio",
  tagline: "Celebrate simply, remember forever",
  description:
    "Danish Designer Studio crafts premium Indian menswear — groom sherwanis, bandhgala suits, jodhpuri sets and hand-worked kurta pajamas, made in our own atelier and shipped worldwide.",
  logoUrl: "/logo.svg",
  email: "support@danishdesignerstudio.com",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  address: "Studio address line, City, State, India",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 0,
  flatShippingRate: 0,
  taxRate: 0,
  announcements: [
    {
      text: "Buy 2 to 3 pieces and save an extra 5% at checkout.",
      linkText: "Shop now",
      href: "/shop",
    },
    {
      text: "Free delivery all over India on every order.",
      linkText: "Shop now",
      href: "/shop",
    },
    {
      text: "New Collection 2026 has landed in the atelier.",
      linkText: "Explore",
      href: "/collection/new-collection",
    },
  ],
  socials: [
    { platform: "facebook", url: "https://facebook.com/danishdesignerstudio" },
    { platform: "instagram", url: "https://instagram.com/danishdesignerstudio" },
    { platform: "twitter", url: "https://x.com/danishdesignerstudio" },
    { platform: "pinterest", url: "https://pinterest.com/danishdesignerstudio" },
    { platform: "linkedin", url: "https://linkedin.com/company/danishdesignerstudio" },
    { platform: "youtube", url: "https://youtube.com/@danishdesignerstudio" },
    { platform: "whatsapp", url: "https://wa.me/919000000000" },
  ],
  footerDescription:
    "Danish Designer Studio is an atelier for premium Indian menswear — hand-worked, made to last, and cut for the moments you will be looking back on.",
  newsletterHeading: "Subscribe and get 20% off your first order",
  newsletterSubtext:
    "Early access to new collections, styling notes and private sales. No noise, unsubscribe any time.",
  instagramHandle: "danishdesignerstudio",
  pageImages: {
    aboutHero: "/media/banners/about-hero.v3.jpg",
    aboutPrimary: "/media/banners/editorial-vogue.v3.jpg",
    aboutSecondary: "/media/banners/about-secondary.v3.jpg",
    contactHero: "/media/banners/contact.v3.jpg",
  },
};

export const seedGlobalSeo: GlobalSeo = {
  siteTitle: "Danish Designer Studio — Premium Indian Menswear",
  titleTemplate: "%s | Danish Designer Studio",
  metaDescription:
    "Shop premium Indian menswear at Danish Designer Studio — groom sherwanis, bandhgala suits, jodhpuri sets and hand-embroidered kurta pajamas. Free delivery across India.",
  keywords: [
    "sherwani",
    "groom sherwani",
    "bandhgala suit",
    "jodhpuri suit",
    "kurta pajama",
    "indian menswear",
    "wedding wear for men",
    "danish designer studio",
  ],
  defaultOgImage: "/media/banners/og-default.v3.jpg",
  twitterHandle: "@danishdesignerstudio",
  twitterCardType: "summary_large_image",
  organizationName: "Danish Designer Studio",
  organizationLogo: "/logo.svg",
  robotsIndex: true,
  robotsFollow: true,
  googleSiteVerification: null,
};

export const seedCustomers: Customer[] = [
  ["Arjun Mehta", "arjun.mehta@example.com", "+91 98200 11223"],
  ["Vikram Suri", "vikram.suri@example.com", "+91 98110 44556"],
  ["Imran Qureshi", "imran.q@example.com", "+971 50 221 8890"],
  ["Rahul Bansal", "rahul.bansal@example.com", "+91 98450 77881"],
  ["Zaid Ansari", "zaid.ansari@example.com", "+91 94150 22334"],
  ["Kabir Nair", "kabir.nair@example.com", "+91 99010 55442"],
].map(([fullName, email, phone], i) => ({
  id: `cus-${i + 1}`,
  email,
  fullName,
  phone,
  avatarUrl: null,
  ordersCount: seededNumber(email, 1, 5),
  totalSpent: seededNumber(email, 8000, 92000),
  createdAt: new Date(BASE_DATE - (i + 2) * 21 * 24 * 60 * 60 * 1000).toISOString(),
  isAdmin: false,
}));

const ORDER_STATUSES: Order["status"][] = [
  "delivered",
  "shipped",
  "processing",
  "confirmed",
  "pending",
  "delivered",
  "cancelled",
  "delivered",
];

export const seedOrders: Order[] = ORDER_STATUSES.map((status, i) => {
  const customer = seedCustomers[i % seedCustomers.length];
  const product = seedProducts[(i * 3) % seedProducts.length];
  const second = seedProducts[(i * 5 + 2) % seedProducts.length];
  const qty = (i % 2) + 1;
  const unit = product.salePrice ?? product.price;
  const unit2 = second.salePrice ?? second.price;
  const items: Order["items"] = [
    {
      id: `oi-${i}-1`,
      productId: product.id,
      variantId: product.variants[2]?.id ?? null,
      name: product.name,
      slug: product.slug,
      image: product.images[0].url,
      sku: product.sku,
      size: "L",
      color: product.colors[0],
      unitPrice: unit,
      quantity: qty,
      total: unit * qty,
    },
  ];
  if (i % 3 === 0) {
    items.push({
      id: `oi-${i}-2`,
      productId: second.id,
      variantId: null,
      name: second.name,
      slug: second.slug,
      image: second.images[0].url,
      sku: second.sku,
      size: "M",
      color: second.colors[0],
      unitPrice: unit2,
      quantity: 1,
      total: unit2,
    });
  }
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = i % 4 === 0 ? Math.round(subtotal * 0.1) : 0;
  const createdAt = new Date(BASE_DATE - i * 4 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `ord-${i + 1}`,
    orderNumber: `DDS-2026-${String(1041 + i)}`,
    userId: null,
    email: customer.email,
    phone: customer.phone ?? "",
    customerName: customer.fullName,
    status,
    paymentStatus: (status === "cancelled"
      ? "failed"
      : status === "pending"
        ? "unpaid"
        : "paid") as Order["paymentStatus"],
    paymentMethod: i % 3 === 0 ? "Cash on Delivery" : "Razorpay",
    shippingAddress: {
      fullName: customer.fullName,
      phone: customer.phone ?? "",
      line1: `${12 + i} Rose Avenue`,
      line2: "Near Central Park",
      city: ["Mumbai", "Delhi", "Dubai", "Bengaluru", "Lucknow", "Pune"][i % 6],
      state: ["Maharashtra", "Delhi", "Dubai", "Karnataka", "Uttar Pradesh", "Maharashtra"][i % 6],
      postalCode: `4000${i}1`,
      country: i % 6 === 2 ? "United Arab Emirates" : "India",
    },
    items,
    subtotal,
    discount,
    shipping: 0,
    tax: 0,
    total: subtotal - discount,
    couponCode: discount ? "FESTIVE10" : null,
    trackingNumber:
      status === "shipped" || status === "delivered" ? `BLUEDART${900123 + i}` : null,
    courier: status === "shipped" || status === "delivered" ? "BlueDart" : null,
    notes: null,
    createdAt,
    updatedAt: createdAt,
  };
});

export const seedInventoryTransactions: InventoryTransaction[] = seedProducts
  .slice(0, 10)
  .map((product, i) => ({
    id: `inv-${i + 1}`,
    productId: product.id,
    productName: product.name,
    variantId: null,
    changeType: (i % 3 === 0 ? "restock" : i % 3 === 1 ? "sale" : "adjustment") as
      | "restock"
      | "sale"
      | "adjustment",
    quantityChange: i % 3 === 1 ? -(i % 4) - 1 : (i % 5) + 4,
    quantityAfter: product.stockQuantity,
    reason:
      i % 3 === 0
        ? "Atelier batch received"
        : i % 3 === 1
          ? "Order fulfilment"
          : "Stock count correction",
    createdBy: "admin@danishdesignerstudio.com",
    createdAt: new Date(BASE_DATE - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
  }));

export const seedMedia: MediaItem[] = [
  ...seedProducts.slice(0, 8).map((p, i) => ({
    id: `med-p-${i}`,
    name: `${p.slug}-1.svg`,
    url: p.images[0].url,
    bucket: "product-images",
    path: `${p.slug}/1.svg`,
    mimeType: "image/svg+xml",
    sizeBytes: 12_400 + i * 320,
    alt: p.images[0].alt,
    folder: "products",
    createdAt: p.createdAt,
  })),
  ...seedCollections.map((c, i) => ({
    id: `med-c-${i}`,
    name: `${c.slug}.svg`,
    url: c.bannerImage!,
    bucket: "collection-images",
    path: `${c.slug}.svg`,
    mimeType: "image/svg+xml",
    sizeBytes: 18_200 + i * 210,
    alt: `${c.name} banner`,
    folder: "collections",
    createdAt: new Date(BASE_DATE - i * 86_400_000).toISOString(),
  })),
];

export function seedProductBySlug(slug: string) {
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export function makeId(prefix: string, name: string) {
  return `${prefix}-${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
}
