-- =============================================================================
-- Danish Designer Studio — demo seed data
-- Generated from src/lib/data/seed.ts. Run AFTER 0001_init.sql.
-- Safe to re-run: every insert is idempotent on its natural key.
-- =============================================================================

begin;

-- Categories -----------------------------------------------------------------
insert into public.categories (name, slug, description, image, display_order, is_active, seo) values
  ('Kurta Pajama', 'kurta-pajama', 'Hand-finished kurta pajama sets in silk, linen and cotton blends — cut for festive evenings, mehndi mornings and everything in between.', '/media/categories/kurta-pajama.v3.jpg', 1, true, '{"meta_title":"Designer Kurta Pajama for Men | Danish Designer Studio","meta_description":"Shop premium designer kurta pajama sets for weddings, Eid and festive occasions. Hand embroidery, luxury fabrics and free delivery across India.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Sherwani', 'sherwani', 'Groom sherwanis with zardozi, dabka and sequin craft — the centrepiece of the wedding wardrobe.', '/media/categories/sherwani.v3.jpg', 2, true, '{"meta_title":"Groom Sherwani Collection | Danish Designer Studio","meta_description":"Luxury groom sherwanis with hand zardozi and dabka work. Made-to-measure Indian wedding wear delivered across India.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Bandhgala', 'bandhgala', 'Tailored bandhgala suits with a sharp closed collar and a modern silhouette.', '/media/categories/bandhgala.v3.jpg', 3, true, '{"meta_title":"Men''s Bandhgala Suits | Danish Designer Studio","meta_description":"Premium bandhgala suits in velvet, raw silk and wool blends. Reception and cocktail-ready Indian formalwear.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Jodhpuri', 'jodhpuri', 'Open and classic jodhpuri sets with heritage cuts and contemporary detailing.', '/media/categories/jodhpuri.v3.jpg', 4, true, '{"meta_title":"Jodhpuri Suits & Open Jodhpuri Sets | Danish Designer Studio","meta_description":"Shop open jodhpuri sets and classic jodhpuri suits crafted in premium fabrics with refined hand work.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Indo Western', 'indo-western', 'Draped, asymmetric and sequinned silhouettes for the modern celebration.', '/media/categories/indo-western.v3.jpg', 5, true, '{"meta_title":"Indo Western Outfits for Men | Danish Designer Studio","meta_description":"Contemporary indo western outfits — draped kurtas, asymmetric jackets and sequin detailing for sangeet and reception.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Nehru Jackets', 'nehru-jackets', 'Brocade and raw-silk nehru jackets that finish a kurta in one move.', '/media/categories/nehru-jackets.v3.jpg', 6, true, '{"meta_title":"Nehru Jackets for Men | Danish Designer Studio","meta_description":"Brocade, velvet and raw silk nehru jackets designed to layer over kurta sets for festive occasions.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, image = excluded.image,
  display_order = excluded.display_order, is_active = excluded.is_active, seo = excluded.seo;

-- Collections ----------------------------------------------------------------
insert into public.collections (name, slug, description, banner_image, thumbnail, display_order, is_active, is_featured, seo) values
  ('New Collection', 'new-collection', 'The newest arrivals from the Danish Designer Studio atelier — released in small batches through the season.', '/media/collections/new-collection.v3.jpg', '/media/collections/new-collection-thumb.v3.jpg', 1, true, true, '{"meta_title":"New Collection 2026 | Danish Designer Studio","meta_description":"Discover the newest Danish Designer Studio arrivals — sherwanis, bandhgalas and kurta sets released fresh this season.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Wedding Collection', 'wedding-collection', 'Everything the wedding week asks for: nikah, mehndi, sangeet, baraat and reception, in one wardrobe.', '/media/collections/wedding-collection.v3.jpg', '/media/collections/wedding-collection-thumb.v3.jpg', 2, true, true, '{"meta_title":"Indian Wedding Collection for Men | Danish Designer Studio","meta_description":"Shop the Danish Designer Studio wedding collection — groom sherwanis, bandhgala suits and festive kurta sets for every wedding function.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Groom Collection', 'groom-collection', 'Statement pieces built for the man at the centre of the frame.', '/media/collections/groom-collection.v3.jpg', '/media/collections/groom-collection-thumb.v3.jpg', 3, true, true, '{"meta_title":"Groom Collection | Danish Designer Studio","meta_description":"Hand-crafted groom wear — zardozi sherwanis, velvet bandhgalas and heirloom-grade finishing.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Festive Collection', 'festive-collection', 'Diwali, Eid, sangeet and every evening that deserves a little shine.', '/media/collections/festive-collection.v3.jpg', '/media/collections/festive-collection-thumb.v3.jpg', 4, true, false, null),
  ('Eid Collection', 'eid-collection', 'Refined, comfortable and quietly festive — designed for the long Eid day.', '/media/collections/eid-collection.v3.jpg', '/media/collections/eid-collection-thumb.v3.jpg', 5, true, false, null),
  ('Reception Collection', 'reception-collection', 'Black-tie energy with an Indian spine — tailored, tonal, photographic.', '/media/collections/reception-collection.v3.jpg', '/media/collections/reception-collection-thumb.v3.jpg', 6, true, true, null)
on conflict (slug) do update set
  name = excluded.name, description = excluded.description,
  banner_image = excluded.banner_image, thumbnail = excluded.thumbnail,
  display_order = excluded.display_order, is_active = excluded.is_active, is_featured = excluded.is_featured, seo = excluded.seo;

-- Products -------------------------------------------------------------------
insert into public.products (
  name, slug, sku, category_id, brand, short_description, description,
  price, sale_price, cost_price, stock_quantity, low_stock_threshold, stock_status,
  material, fabric, care_instructions, tags, sizes, colors,
  is_featured, is_trending, is_best_seller, is_new_arrival, is_published,
  display_order, rating_average, rating_count, sold_count, seo, created_at
) values
  (
    'Noor Black Embroidered Kurta Pajama Set', 'noor-black-embroidered-kurta-set', 'DDS-0001',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'A matte black kurta set carrying antique-gold resham work across the placket and cuffs.', 'Cut from a soft viscose-silk blend that falls without stiffness, the Noor kurta set is embroidered in antique gold resham across the placket, cuffs and hem. The panels are finished with a concealed side slit so the drape stays clean when you move, and the pyjama is cut straight with a drawstring waist for a full evening of comfort. Pair it with a brocade nehru jacket for a baraat, or wear it alone for an intimate nikah.',
    8499, 5799, 4419,
    24, 5, 'in_stock',
    'Viscose silk blend', 'Art silk with resham thread work', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'embroidered', 'festive', 'black', 'wedding']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black', 'Deep Wine', 'Midnight Blue']::text[],
    true, false, true, true, true,
    1, 4.8, 64, 186,
    '{"meta_title":"Noor Black Embroidered Kurta Pajama Set | Danish Designer Studio","meta_description":"A matte black kurta set carrying antique-gold resham work across the placket and cuffs.","keywords":["kurta","embroidered","festive","black","wedding"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/noor-black-embroidered-kurta-set-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2026-01-05T09:00:00.000Z'
  ),
  (
    'Regal Essence Trending Designer Kurta Pajama Set', 'regal-essence-kurta-pajama', 'DDS-0002',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'Dupion silk with a hand-set zari border and mandarin collar.', 'The Regal Essence set is built on crisp dupion silk with a subtle slub that catches light without shine. A hand-set zari border runs the length of the placket and repeats at the cuff. Fully lined through the yoke for structure, with a straight pyjama in matching silk.',
    9299, 6299, 4835,
    18, 5, 'in_stock',
    'Dupion silk', 'Dupion silk with zari border', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'zari', 'silk', 'festive']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black', 'Ivory']::text[],
    false, true, true, false, true,
    2, 4.7, 51, 142,
    '{"meta_title":"Regal Essence Trending Designer Kurta Pajama Set | Danish Designer Studio","meta_description":"Dupion silk with a hand-set zari border and mandarin collar.","keywords":["kurta","zari","silk","festive"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/regal-essence-kurta-pajama-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2026-01-03T21:00:00.000Z'
  ),
  (
    'Shaan Gold Thread Work Kurta Pajama Set', 'shaan-gold-thread-kurta', 'DDS-0003',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'Floral metallic thread work spread across a deep-tone cotton-silk base.', 'Metallic gold thread is worked into a spreading floral motif across the chest and sleeves, balanced by a plain back so the piece never tips into costume. Cotton silk keeps it breathable through a long day of celebration.',
    7999, 5299, 4159,
    4, 5, 'low_stock',
    'Cotton silk', 'Cotton silk with metallic thread', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'gold', 'thread-work', 'eid']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black', 'Rust']::text[],
    false, true, true, false, true,
    3, 4.9, 78, 203,
    '{"meta_title":"Shaan Gold Thread Work Kurta Pajama Set | Danish Designer Studio","meta_description":"Floral metallic thread work spread across a deep-tone cotton-silk base.","keywords":["kurta","gold","thread-work","eid"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/shaan-gold-thread-kurta-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2026-01-02T09:00:00.000Z'
  ),
  (
    'Midnight Velvet Bandhgala Suit', 'midnight-velvet-bandhgala', 'DDS-0004',
    (select id from public.categories where slug = 'bandhgala'),
    'Danish Designer Studio', 'A closed-collar velvet bandhgala with a canvassed front and mother-of-pearl buttons.', 'Tailored from a dense Italian cotton velvet, this bandhgala holds a sharp closed collar and a lightly structured shoulder. The front is half-canvassed so it moulds to you over time rather than sitting flat. Finished with mother-of-pearl buttons and a bemberg lining that keeps the jacket cool under lights. Supplied with matching trousers.',
    18999, 14999, 9879,
    11, 5, 'in_stock',
    'Cotton velvet', 'Italian cotton velvet, full canvas front', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['bandhgala', 'velvet', 'reception', 'suit']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Midnight Blue', 'Black']::text[],
    true, true, false, true, true,
    4, 4.9, 38, 96,
    '{"meta_title":"Midnight Velvet Bandhgala Suit | Danish Designer Studio","meta_description":"A closed-collar velvet bandhgala with a canvassed front and mother-of-pearl buttons.","keywords":["bandhgala","velvet","reception","suit"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/midnight-velvet-bandhgala-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-31T21:00:00.000Z'
  ),
  (
    'Ivory Pearl Hand-Embroidered Groom Sherwani', 'ivory-pearl-sherwani', 'DDS-0005',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'Pearl, dabka and zardozi worked by hand across an ivory raw-silk base.', 'Roughly 180 hours of hand work sit on this sherwani. Pearls, dabka and zardozi are laid in a vertical vine across the front panels and climb the sleeve, leaving the back clean so the silhouette stays long. The raw silk is lined in cotton-satin and the hem is weighted so it hangs true through the ceremony. Supplied with a churidar and a matching dupatta.',
    42999, 34999, 22359,
    6, 5, 'in_stock',
    'Raw silk', 'Raw silk with pearl, dabka and zardozi hand work', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'groom', 'ivory', 'zardozi', 'wedding']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Ivory', 'Champagne']::text[],
    true, false, true, true, true,
    5, 5, 29, 54,
    '{"meta_title":"Ivory Pearl Hand-Embroidered Groom Sherwani | Danish Designer Studio","meta_description":"Pearl, dabka and zardozi worked by hand across an ivory raw-silk base.","keywords":["sherwani","groom","ivory","zardozi","wedding"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/ivory-pearl-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-30T09:00:00.000Z'
  ),
  (
    'Royal Maroon Zardozi Wedding Sherwani', 'royal-maroon-sherwani', 'DDS-0006',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'Silk velvet in deep maroon carrying full-panel zardozi craft.', 'Deep maroon silk velvet with zardozi worked edge to edge on the front panels and collar. Structured through the shoulder and nipped lightly at the waist for a portrait-ready line. Includes churidar.',
    38999, 31999, 20279,
    7, 5, 'in_stock',
    'Velvet', 'Silk velvet with zardozi', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'maroon', 'velvet', 'groom']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Maroon', 'Bottle Green']::text[],
    true, true, false, false, true,
    6, 4.8, 33, 61,
    '{"meta_title":"Royal Maroon Zardozi Wedding Sherwani | Danish Designer Studio","meta_description":"Silk velvet in deep maroon carrying full-panel zardozi craft.","keywords":["sherwani","maroon","velvet","groom"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/royal-maroon-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-28T21:00:00.000Z'
  ),
  (
    'Obsidian Tiger Motif Designer Sherwani', 'obsidian-tiger-sherwani', 'DDS-0007',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'A silver tiger motif sweeping across matte black — the statement piece of the line.', 'A single silver-thread tiger motif sweeps from hem to shoulder across a matte black base. Everything else is deliberately quiet: plain collar, concealed placket, clean sleeve. Built for the reception entrance.',
    33999, 28499, 17679,
    9, 5, 'in_stock',
    'Suiting blend', 'Matte suiting with silver thread appliqué', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'black', 'statement', 'reception']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black']::text[],
    false, true, false, true, true,
    7, 4.7, 21, 44,
    '{"meta_title":"Obsidian Tiger Motif Designer Sherwani | Danish Designer Studio","meta_description":"A silver tiger motif sweeping across matte black — the statement piece of the line.","keywords":["sherwani","black","statement","reception"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/obsidian-tiger-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-27T09:00:00.000Z'
  ),
  (
    'Heritage Open Jodhpuri Set with Kurta', 'heritage-open-jodhpuri', 'DDS-0008',
    (select id from public.categories where slug = 'jodhpuri'),
    'Danish Designer Studio', 'An open jodhpuri jacket in multi-colour thread work over an ivory kurta set.', 'The open jodhpuri jacket carries dense multi-colour thread work across both panels and is worn over a plain ivory kurta and churidar, both included. The contrast is the point — the jacket does the talking.',
    21999, 17999, 11439,
    13, 5, 'in_stock',
    'Silk blend', 'Silk blend with multi-colour thread work', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['jodhpuri', 'open-jacket', 'wedding', 'set']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Maroon', 'Ivory']::text[],
    false, true, true, false, true,
    8, 4.6, 42, 118,
    '{"meta_title":"Heritage Open Jodhpuri Set with Kurta | Danish Designer Studio","meta_description":"An open jodhpuri jacket in multi-colour thread work over an ivory kurta set.","keywords":["jodhpuri","open-jacket","wedding","set"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/heritage-open-jodhpuri-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-25T21:00:00.000Z'
  ),
  (
    'Emerald Silk Classic Jodhpuri Suit', 'emerald-silk-jodhpuri', 'DDS-0009',
    (select id from public.categories where slug = 'jodhpuri'),
    'Danish Designer Studio', 'Deep emerald raw silk, cut close, with a self-toned button stance.', 'A classic jodhpuri in deep emerald raw silk with self-toned buttons and a half-canvassed front. No embroidery — the colour and the cut carry it. Supplied with matching trousers.',
    19999, null, 10399,
    8, 5, 'in_stock',
    'Raw silk', 'Raw silk, half canvassed', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['jodhpuri', 'emerald', 'silk', 'suit']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Emerald', 'Charcoal']::text[],
    false, false, false, true, true,
    9, 4.7, 16, 37,
    '{"meta_title":"Emerald Silk Classic Jodhpuri Suit | Danish Designer Studio","meta_description":"Deep emerald raw silk, cut close, with a self-toned button stance.","keywords":["jodhpuri","emerald","silk","suit"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/emerald-silk-jodhpuri-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-24T09:00:00.000Z'
  ),
  (
    'Classic Black Handcrafted Bandhgala Suit', 'classic-black-bandhgala-suit', 'DDS-0010',
    (select id from public.categories where slug = 'bandhgala'),
    'Danish Designer Studio', 'Diagonal pintuck detailing across a clean black bandhgala front.', 'Fine diagonal pintucks run across the chest of this bandhgala, catching light at an angle and disappearing head-on. Wool-blend suiting, bemberg lined, with a concealed hook at the collar. Trousers included.',
    16999, 13799, 8839,
    16, 5, 'in_stock',
    'Wool blend', 'Wool-blend suiting with diagonal pintuck detail', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['bandhgala', 'black', 'suit', 'reception']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black', 'Charcoal']::text[],
    true, false, true, false, true,
    10, 4.8, 47, 131,
    '{"meta_title":"Classic Black Handcrafted Bandhgala Suit | Danish Designer Studio","meta_description":"Diagonal pintuck detailing across a clean black bandhgala front.","keywords":["bandhgala","black","suit","reception"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/classic-black-bandhgala-suit-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-22T21:00:00.000Z'
  ),
  (
    'Ivory Floral Draped Indo Western Set', 'ivory-floral-indo-western', 'DDS-0011',
    (select id from public.categories where slug = 'indo-western'),
    'Danish Designer Studio', 'A raw-silk base with a floral-embroidered georgette drape across one shoulder.', 'A clean ivory raw-silk kurta and trouser, finished with a floral-embroidered georgette drape fixed at one shoulder. The drape is detachable, so the set works twice — once for the sangeet, once for a daytime function.',
    24999, 19999, 12999,
    10, 5, 'in_stock',
    'Georgette and raw silk', 'Raw silk base with georgette drape', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['indo-western', 'drape', 'ivory', 'sangeet']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Ivory', 'Powder Blue']::text[],
    false, true, false, true, true,
    11, 4.6, 25, 72,
    '{"meta_title":"Ivory Floral Draped Indo Western Set | Danish Designer Studio","meta_description":"A raw-silk base with a floral-embroidered georgette drape across one shoulder.","keywords":["indo-western","drape","ivory","sangeet"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/ivory-floral-indo-western-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-21T09:00:00.000Z'
  ),
  (
    'Cobalt Raw Silk Nehru Jacket Set', 'cobalt-raw-silk-nehru-set', 'DDS-0012',
    (select id from public.categories where slug = 'nehru-jackets'),
    'Danish Designer Studio', 'A cobalt jacquard nehru jacket supplied with a tonal kurta and churidar.', 'Self-jacquard raw silk in a deep cobalt, cut as a five-button nehru jacket with a mandarin collar. Comes with a tonal kurta and churidar so it works straight out of the box.',
    12999, 9999, 6759,
    21, 5, 'in_stock',
    'Raw silk', 'Raw silk with self jacquard', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['nehru-jacket', 'cobalt', 'silk', 'festive']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Cobalt', 'Black']::text[],
    false, false, true, false, true,
    12, 4.5, 36, 109,
    '{"meta_title":"Cobalt Raw Silk Nehru Jacket Set | Danish Designer Studio","meta_description":"A cobalt jacquard nehru jacket supplied with a tonal kurta and churidar.","keywords":["nehru-jacket","cobalt","silk","festive"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/cobalt-raw-silk-nehru-set-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-19T21:00:00.000Z'
  ),
  (
    'Champagne Zardozi Reception Sherwani', 'champagne-zardozi-sherwani', 'DDS-0013',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'Tonal zardozi on champagne — texture without contrast.', 'Zardozi worked in the same tone as the base fabric, so the sherwani reads as texture at a distance and as craft up close. Ideal for receptions where the lighting is warm.',
    36999, 29999, 19239,
    5, 5, 'low_stock',
    'Silk blend', 'Silk blend with tonal zardozi', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'champagne', 'reception']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Champagne']::text[],
    true, false, false, false, true,
    13, 4.8, 19, 41,
    '{"meta_title":"Champagne Zardozi Reception Sherwani | Danish Designer Studio","meta_description":"Tonal zardozi on champagne — texture without contrast.","keywords":["sherwani","champagne","reception"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/champagne-zardozi-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-18T09:00:00.000Z'
  ),
  (
    'Onyx Mirror Work Festive Kurta Set', 'onyx-mirror-work-kurta', 'DDS-0014',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'Hand-set mirror work scattered across a fluid georgette kurta.', 'Small hand-set mirrors are scattered across the yoke and sleeves and fade out towards the hem. Georgette keeps the movement fluid under stage lighting. Comes with a cotton-silk churidar.',
    10499, 7999, 5459,
    0, 5, 'out_of_stock',
    'Georgette', 'Georgette with mirror and thread work', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'mirror-work', 'festive', 'sangeet']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black']::text[],
    false, true, false, false, true,
    14, 4.6, 30, 88,
    '{"meta_title":"Onyx Mirror Work Festive Kurta Set | Danish Designer Studio","meta_description":"Hand-set mirror work scattered across a fluid georgette kurta.","keywords":["kurta","mirror-work","festive","sangeet"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/onyx-mirror-work-kurta-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-16T21:00:00.000Z'
  ),
  (
    'Saffron Festive Cotton Silk Kurta Set', 'saffron-festive-kurta-set', 'DDS-0015',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'A warm saffron cotton-silk kurta with tonal placket embroidery.', 'Lightweight cotton silk in a warm saffron, with tonal embroidery limited to the placket. Built for daytime functions where a full festive kurta would be too much.',
    6499, 4499, 3379,
    32, 5, 'in_stock',
    'Cotton silk', 'Cotton silk with tonal placket embroidery', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'saffron', 'eid', 'daywear']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Saffron', 'Sage']::text[],
    false, false, false, true, true,
    15, 4.4, 44, 145,
    '{"meta_title":"Saffron Festive Cotton Silk Kurta Set | Danish Designer Studio","meta_description":"A warm saffron cotton-silk kurta with tonal placket embroidery.","keywords":["kurta","saffron","eid","daywear"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/saffron-festive-kurta-set-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-15T09:00:00.000Z'
  ),
  (
    'Charcoal Textured Bandhgala Jacket', 'charcoal-textured-bandhgala', 'DDS-0016',
    (select id from public.categories where slug = 'bandhgala'),
    'Danish Designer Studio', 'A textured charcoal bandhgala jacket, sold on its own to layer as you like.', 'Jacket only. A textured charcoal weave with a closed collar and five self-toned buttons — designed to be worn over a kurta or with plain trousers.',
    14999, null, 7799,
    3, 5, 'low_stock',
    'Textured suiting', 'Textured wool-blend suiting', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['bandhgala', 'charcoal', 'jacket']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Charcoal']::text[],
    false, false, false, false, true,
    16, 4.5, 14, 58,
    '{"meta_title":"Charcoal Textured Bandhgala Jacket | Danish Designer Studio","meta_description":"A textured charcoal bandhgala jacket, sold on its own to layer as you like.","keywords":["bandhgala","charcoal","jacket"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/charcoal-textured-bandhgala-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-13T21:00:00.000Z'
  ),
  (
    'Pearl White Sequin Groom Sherwani', 'pearl-white-groom-sherwani', 'DDS-0017',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'Sequin and dabka work laid over pearl-white raw silk, hem to collar.', 'The most worked piece in the collection. Sequins and dabka cover the front panels and sleeves completely, laid over pearl-white raw silk. Heavily lined and weighted at the hem. Supplied with churidar, dupatta and a matching stole.',
    45999, 38999, 23919,
    4, 5, 'low_stock',
    'Raw silk', 'Raw silk with sequin and dabka work', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'white', 'groom', 'sequin']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Pearl White']::text[],
    true, true, false, false, true,
    17, 5, 17, 33,
    '{"meta_title":"Pearl White Sequin Groom Sherwani | Danish Designer Studio","meta_description":"Sequin and dabka work laid over pearl-white raw silk, hem to collar.","keywords":["sherwani","white","groom","sequin"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/pearl-white-groom-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-12T09:00:00.000Z'
  ),
  (
    'Wine Velvet Jodhpuri Suit', 'wine-velvet-jodhpuri-set', 'DDS-0018',
    (select id from public.categories where slug = 'jodhpuri'),
    'Danish Designer Studio', 'Cotton velvet in a deep wine with a close, modern jodhpuri cut.', 'A modern jodhpuri in deep wine cotton velvet with tonal buttons and a slightly shorter length than the classic cut. Trousers included.',
    23999, 18999, 12479,
    12, 5, 'in_stock',
    'Velvet', 'Cotton velvet with tonal buttons', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['jodhpuri', 'velvet', 'wine']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Wine', 'Forest']::text[],
    false, false, true, false, true,
    18, 4.7, 27, 84,
    '{"meta_title":"Wine Velvet Jodhpuri Suit | Danish Designer Studio","meta_description":"Cotton velvet in a deep wine with a close, modern jodhpuri cut.","keywords":["jodhpuri","velvet","wine"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/wine-velvet-jodhpuri-set-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-10T21:00:00.000Z'
  ),
  (
    'Sage Linen Everyday Kurta Pajama', 'sage-linen-kurta-pajama', 'DDS-0019',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'Washed pure linen, cut relaxed, for the days between the big ones.', 'Washed linen with a relaxed body and a soft collar. No embroidery, no lining — just a well-cut kurta that gets better with every wash. Sold with a matching drawstring pyjama.',
    4999, 3499, 2599,
    40, 5, 'in_stock',
    'Pure linen', 'Washed pure linen', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'linen', 'everyday', 'summer']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Sage', 'Sand', 'White']::text[],
    false, false, false, true, true,
    19, 4.5, 58, 167,
    '{"meta_title":"Sage Linen Everyday Kurta Pajama | Danish Designer Studio","meta_description":"Washed pure linen, cut relaxed, for the days between the big ones.","keywords":["kurta","linen","everyday","summer"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/sage-linen-kurta-pajama-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-09T09:00:00.000Z'
  ),
  (
    'Imperial Blue Raw Silk Bandhgala', 'imperial-blue-bandhgala', 'DDS-0020',
    (select id from public.categories where slug = 'bandhgala'),
    'Danish Designer Studio', 'Imperial blue raw silk with a fine contrast piping along the collar.', 'Raw silk in a saturated imperial blue, with a hairline contrast piping tracing the collar and pocket line. Half-canvassed, bemberg lined, trousers included.',
    17999, 14499, 9359,
    14, 5, 'in_stock',
    'Raw silk', 'Raw silk with contrast piping', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['bandhgala', 'blue', 'silk']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Imperial Blue', 'Slate']::text[],
    false, true, false, true, true,
    20, 4.6, 22, 67,
    '{"meta_title":"Imperial Blue Raw Silk Bandhgala | Danish Designer Studio","meta_description":"Imperial blue raw silk with a fine contrast piping along the collar.","keywords":["bandhgala","blue","silk"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/imperial-blue-bandhgala-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-07T21:00:00.000Z'
  ),
  (
    'Antique Gold Brocade Sherwani', 'antique-gold-sherwani', 'DDS-0021',
    (select id from public.categories where slug = 'sherwani'),
    'Danish Designer Studio', 'A woven brocade sherwani — the pattern is in the cloth, not on it.', 'Woven Banarasi-style brocade in antique gold. Because the pattern is woven rather than embroidered, the piece stays light and drapes softly. Churidar included.',
    31999, 25999, 16639,
    6, 5, 'in_stock',
    'Brocade', 'Banarasi-style brocade', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['sherwani', 'gold', 'brocade', 'wedding']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Antique Gold']::text[],
    false, false, false, false, true,
    21, 4.7, 18, 49,
    '{"meta_title":"Antique Gold Brocade Sherwani | Danish Designer Studio","meta_description":"A woven brocade sherwani — the pattern is in the cloth, not on it.","keywords":["sherwani","gold","brocade","wedding"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/antique-gold-sherwani-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-06T09:00:00.000Z'
  ),
  (
    'Noir Sequin Asymmetric Indo Western', 'noir-sequin-indo-western', 'DDS-0022',
    (select id from public.categories where slug = 'indo-western'),
    'Danish Designer Studio', 'An asymmetric front with a sequinned panel — built for stage lighting.', 'An asymmetric hem, a diagonal closure and a sequinned georgette panel worked into one side. Matte black everywhere else so the shine stays controlled. Trousers included.',
    22999, 17999, 11959,
    9, 5, 'in_stock',
    'Suiting and georgette', 'Matte suiting with sequin georgette panel', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['indo-western', 'sequin', 'black', 'sangeet']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Black']::text[],
    false, true, false, true, true,
    22, 4.6, 20, 56,
    '{"meta_title":"Noir Sequin Asymmetric Indo Western | Danish Designer Studio","meta_description":"An asymmetric front with a sequinned panel — built for stage lighting.","keywords":["indo-western","sequin","black","sangeet"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/noir-sequin-indo-western-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-04T21:00:00.000Z'
  ),
  (
    'Ivory Chikankari Hand-Work Kurta Set', 'ivory-chikankari-kurta', 'DDS-0023',
    (select id from public.categories where slug = 'kurta-pajama'),
    'Danish Designer Studio', 'Lucknowi chikankari worked by hand across a fine ivory cotton.', 'Genuine Lucknowi chikankari, hand-worked on fine ivory cotton across the yoke, placket and cuffs. Breathable enough for a summer nikah and quiet enough for a daytime function. Comes with a cotton churidar.',
    8999, 6999, 4679,
    15, 5, 'in_stock',
    'Cotton', 'Cotton with Lucknowi chikankari', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['kurta', 'chikankari', 'ivory', 'handwork']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Ivory', 'Powder Blue']::text[],
    true, false, false, true, true,
    23, 4.8, 34, 97,
    '{"meta_title":"Ivory Chikankari Hand-Work Kurta Set | Danish Designer Studio","meta_description":"Lucknowi chikankari worked by hand across a fine ivory cotton.","keywords":["kurta","chikankari","ivory","handwork"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/ivory-chikankari-kurta-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-03T09:00:00.000Z'
  ),
  (
    'Rust Brocade Nehru Jacket', 'rust-brocade-nehru-jacket', 'DDS-0024',
    (select id from public.categories where slug = 'nehru-jackets'),
    'Danish Designer Studio', 'A woven rust brocade jacket that lifts any plain kurta.', 'Jacket only. Woven rust brocade with a cotton lining and five tonal buttons — the fastest way to turn a plain kurta into festive wear.',
    7499, 5499, 3899,
    26, 5, 'in_stock',
    'Brocade', 'Brocade with cotton lining', 'Dry clean only. Store on a wide hanger inside the supplied cover. Steam lightly to release creases — do not iron directly over embroidery.',
    ARRAY['nehru-jacket', 'rust', 'brocade', 'layer']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], ARRAY['Rust', 'Bottle Green', 'Black']::text[],
    false, false, true, false, true,
    24, 4.5, 41, 124,
    '{"meta_title":"Rust Brocade Nehru Jacket | Danish Designer Studio","meta_description":"A woven rust brocade jacket that lifts any plain kurta.","keywords":["nehru-jacket","rust","brocade","layer"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/products/rust-brocade-nehru-jacket-1.v3.jpg","no_index":false,"no_follow":false}'::jsonb, '2025-12-01T21:00:00.000Z'
  )
on conflict (slug) do update set
  name = excluded.name, sku = excluded.sku, category_id = excluded.category_id,
  short_description = excluded.short_description, description = excluded.description,
  price = excluded.price, sale_price = excluded.sale_price, cost_price = excluded.cost_price,
  stock_quantity = excluded.stock_quantity, low_stock_threshold = excluded.low_stock_threshold,
  stock_status = excluded.stock_status, material = excluded.material, fabric = excluded.fabric,
  care_instructions = excluded.care_instructions, tags = excluded.tags,
  sizes = excluded.sizes, colors = excluded.colors, is_featured = excluded.is_featured,
  is_trending = excluded.is_trending, is_best_seller = excluded.is_best_seller,
  is_new_arrival = excluded.is_new_arrival, is_published = excluded.is_published,
  display_order = excluded.display_order, seo = excluded.seo;

-- Product images -------------------------------------------------------------
delete from public.product_images where product_id in (
  select id from public.products where slug in ('noor-black-embroidered-kurta-set', 'regal-essence-kurta-pajama', 'shaan-gold-thread-kurta', 'midnight-velvet-bandhgala', 'ivory-pearl-sherwani', 'royal-maroon-sherwani', 'obsidian-tiger-sherwani', 'heritage-open-jodhpuri', 'emerald-silk-jodhpuri', 'classic-black-bandhgala-suit', 'ivory-floral-indo-western', 'cobalt-raw-silk-nehru-set', 'champagne-zardozi-sherwani', 'onyx-mirror-work-kurta', 'saffron-festive-kurta-set', 'charcoal-textured-bandhgala', 'pearl-white-groom-sherwani', 'wine-velvet-jodhpuri-set', 'sage-linen-kurta-pajama', 'imperial-blue-bandhgala', 'antique-gold-sherwani', 'noir-sequin-indo-western', 'ivory-chikankari-kurta', 'rust-brocade-nehru-jacket')
);
insert into public.product_images (product_id, url, alt, display_order) values
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), '/media/products/noor-black-embroidered-kurta-set-1.v3.jpg', 'Noor Black Embroidered Kurta Pajama Set — view 1', 1),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), '/media/products/noor-black-embroidered-kurta-set-2.v3.jpg', 'Noor Black Embroidered Kurta Pajama Set — view 2', 2),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), '/media/products/noor-black-embroidered-kurta-set-3.v3.jpg', 'Noor Black Embroidered Kurta Pajama Set — view 3', 3),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), '/media/products/noor-black-embroidered-kurta-set-4.v3.jpg', 'Noor Black Embroidered Kurta Pajama Set — view 4', 4),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), '/media/products/regal-essence-kurta-pajama-1.v3.jpg', 'Regal Essence Trending Designer Kurta Pajama Set — view 1', 1),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), '/media/products/regal-essence-kurta-pajama-2.v3.jpg', 'Regal Essence Trending Designer Kurta Pajama Set — view 2', 2),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), '/media/products/regal-essence-kurta-pajama-3.v3.jpg', 'Regal Essence Trending Designer Kurta Pajama Set — view 3', 3),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), '/media/products/regal-essence-kurta-pajama-4.v3.jpg', 'Regal Essence Trending Designer Kurta Pajama Set — view 4', 4),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), '/media/products/shaan-gold-thread-kurta-1.v3.jpg', 'Shaan Gold Thread Work Kurta Pajama Set — view 1', 1),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), '/media/products/shaan-gold-thread-kurta-2.v3.jpg', 'Shaan Gold Thread Work Kurta Pajama Set — view 2', 2),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), '/media/products/shaan-gold-thread-kurta-3.v3.jpg', 'Shaan Gold Thread Work Kurta Pajama Set — view 3', 3),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), '/media/products/shaan-gold-thread-kurta-4.v3.jpg', 'Shaan Gold Thread Work Kurta Pajama Set — view 4', 4),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), '/media/products/midnight-velvet-bandhgala-1.v3.jpg', 'Midnight Velvet Bandhgala Suit — view 1', 1),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), '/media/products/midnight-velvet-bandhgala-2.v3.jpg', 'Midnight Velvet Bandhgala Suit — view 2', 2),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), '/media/products/midnight-velvet-bandhgala-3.v3.jpg', 'Midnight Velvet Bandhgala Suit — view 3', 3),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), '/media/products/midnight-velvet-bandhgala-4.v3.jpg', 'Midnight Velvet Bandhgala Suit — view 4', 4),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), '/media/products/ivory-pearl-sherwani-1.v3.jpg', 'Ivory Pearl Hand-Embroidered Groom Sherwani — view 1', 1),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), '/media/products/ivory-pearl-sherwani-2.v3.jpg', 'Ivory Pearl Hand-Embroidered Groom Sherwani — view 2', 2),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), '/media/products/ivory-pearl-sherwani-3.v3.jpg', 'Ivory Pearl Hand-Embroidered Groom Sherwani — view 3', 3),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), '/media/products/ivory-pearl-sherwani-4.v3.jpg', 'Ivory Pearl Hand-Embroidered Groom Sherwani — view 4', 4),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), '/media/products/royal-maroon-sherwani-1.v3.jpg', 'Royal Maroon Zardozi Wedding Sherwani — view 1', 1),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), '/media/products/royal-maroon-sherwani-2.v3.jpg', 'Royal Maroon Zardozi Wedding Sherwani — view 2', 2),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), '/media/products/royal-maroon-sherwani-3.v3.jpg', 'Royal Maroon Zardozi Wedding Sherwani — view 3', 3),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), '/media/products/royal-maroon-sherwani-4.v3.jpg', 'Royal Maroon Zardozi Wedding Sherwani — view 4', 4),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), '/media/products/obsidian-tiger-sherwani-1.v3.jpg', 'Obsidian Tiger Motif Designer Sherwani — view 1', 1),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), '/media/products/obsidian-tiger-sherwani-2.v3.jpg', 'Obsidian Tiger Motif Designer Sherwani — view 2', 2),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), '/media/products/obsidian-tiger-sherwani-3.v3.jpg', 'Obsidian Tiger Motif Designer Sherwani — view 3', 3),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), '/media/products/obsidian-tiger-sherwani-4.v3.jpg', 'Obsidian Tiger Motif Designer Sherwani — view 4', 4),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), '/media/products/heritage-open-jodhpuri-1.v3.jpg', 'Heritage Open Jodhpuri Set with Kurta — view 1', 1),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), '/media/products/heritage-open-jodhpuri-2.v3.jpg', 'Heritage Open Jodhpuri Set with Kurta — view 2', 2),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), '/media/products/heritage-open-jodhpuri-3.v3.jpg', 'Heritage Open Jodhpuri Set with Kurta — view 3', 3),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), '/media/products/heritage-open-jodhpuri-4.v3.jpg', 'Heritage Open Jodhpuri Set with Kurta — view 4', 4),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), '/media/products/emerald-silk-jodhpuri-1.v3.jpg', 'Emerald Silk Classic Jodhpuri Suit — view 1', 1),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), '/media/products/emerald-silk-jodhpuri-2.v3.jpg', 'Emerald Silk Classic Jodhpuri Suit — view 2', 2),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), '/media/products/emerald-silk-jodhpuri-3.v3.jpg', 'Emerald Silk Classic Jodhpuri Suit — view 3', 3),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), '/media/products/emerald-silk-jodhpuri-4.v3.jpg', 'Emerald Silk Classic Jodhpuri Suit — view 4', 4),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), '/media/products/classic-black-bandhgala-suit-1.v3.jpg', 'Classic Black Handcrafted Bandhgala Suit — view 1', 1),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), '/media/products/classic-black-bandhgala-suit-2.v3.jpg', 'Classic Black Handcrafted Bandhgala Suit — view 2', 2),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), '/media/products/classic-black-bandhgala-suit-3.v3.jpg', 'Classic Black Handcrafted Bandhgala Suit — view 3', 3),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), '/media/products/classic-black-bandhgala-suit-4.v3.jpg', 'Classic Black Handcrafted Bandhgala Suit — view 4', 4),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), '/media/products/ivory-floral-indo-western-1.v3.jpg', 'Ivory Floral Draped Indo Western Set — view 1', 1),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), '/media/products/ivory-floral-indo-western-2.v3.jpg', 'Ivory Floral Draped Indo Western Set — view 2', 2),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), '/media/products/ivory-floral-indo-western-3.v3.jpg', 'Ivory Floral Draped Indo Western Set — view 3', 3),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), '/media/products/ivory-floral-indo-western-4.v3.jpg', 'Ivory Floral Draped Indo Western Set — view 4', 4),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), '/media/products/cobalt-raw-silk-nehru-set-1.v3.jpg', 'Cobalt Raw Silk Nehru Jacket Set — view 1', 1),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), '/media/products/cobalt-raw-silk-nehru-set-2.v3.jpg', 'Cobalt Raw Silk Nehru Jacket Set — view 2', 2),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), '/media/products/cobalt-raw-silk-nehru-set-3.v3.jpg', 'Cobalt Raw Silk Nehru Jacket Set — view 3', 3),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), '/media/products/cobalt-raw-silk-nehru-set-4.v3.jpg', 'Cobalt Raw Silk Nehru Jacket Set — view 4', 4),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), '/media/products/champagne-zardozi-sherwani-1.v3.jpg', 'Champagne Zardozi Reception Sherwani — view 1', 1),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), '/media/products/champagne-zardozi-sherwani-2.v3.jpg', 'Champagne Zardozi Reception Sherwani — view 2', 2),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), '/media/products/champagne-zardozi-sherwani-3.v3.jpg', 'Champagne Zardozi Reception Sherwani — view 3', 3),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), '/media/products/champagne-zardozi-sherwani-4.v3.jpg', 'Champagne Zardozi Reception Sherwani — view 4', 4),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), '/media/products/onyx-mirror-work-kurta-1.v3.jpg', 'Onyx Mirror Work Festive Kurta Set — view 1', 1),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), '/media/products/onyx-mirror-work-kurta-2.v3.jpg', 'Onyx Mirror Work Festive Kurta Set — view 2', 2),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), '/media/products/onyx-mirror-work-kurta-3.v3.jpg', 'Onyx Mirror Work Festive Kurta Set — view 3', 3),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), '/media/products/onyx-mirror-work-kurta-4.v3.jpg', 'Onyx Mirror Work Festive Kurta Set — view 4', 4),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), '/media/products/saffron-festive-kurta-set-1.v3.jpg', 'Saffron Festive Cotton Silk Kurta Set — view 1', 1),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), '/media/products/saffron-festive-kurta-set-2.v3.jpg', 'Saffron Festive Cotton Silk Kurta Set — view 2', 2),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), '/media/products/saffron-festive-kurta-set-3.v3.jpg', 'Saffron Festive Cotton Silk Kurta Set — view 3', 3),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), '/media/products/saffron-festive-kurta-set-4.v3.jpg', 'Saffron Festive Cotton Silk Kurta Set — view 4', 4),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), '/media/products/charcoal-textured-bandhgala-1.v3.jpg', 'Charcoal Textured Bandhgala Jacket — view 1', 1),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), '/media/products/charcoal-textured-bandhgala-2.v3.jpg', 'Charcoal Textured Bandhgala Jacket — view 2', 2),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), '/media/products/charcoal-textured-bandhgala-3.v3.jpg', 'Charcoal Textured Bandhgala Jacket — view 3', 3),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), '/media/products/charcoal-textured-bandhgala-4.v3.jpg', 'Charcoal Textured Bandhgala Jacket — view 4', 4),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), '/media/products/pearl-white-groom-sherwani-1.v3.jpg', 'Pearl White Sequin Groom Sherwani — view 1', 1),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), '/media/products/pearl-white-groom-sherwani-2.v3.jpg', 'Pearl White Sequin Groom Sherwani — view 2', 2),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), '/media/products/pearl-white-groom-sherwani-3.v3.jpg', 'Pearl White Sequin Groom Sherwani — view 3', 3),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), '/media/products/pearl-white-groom-sherwani-4.v3.jpg', 'Pearl White Sequin Groom Sherwani — view 4', 4),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), '/media/products/wine-velvet-jodhpuri-set-1.v3.jpg', 'Wine Velvet Jodhpuri Suit — view 1', 1),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), '/media/products/wine-velvet-jodhpuri-set-2.v3.jpg', 'Wine Velvet Jodhpuri Suit — view 2', 2),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), '/media/products/wine-velvet-jodhpuri-set-3.v3.jpg', 'Wine Velvet Jodhpuri Suit — view 3', 3),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), '/media/products/wine-velvet-jodhpuri-set-4.v3.jpg', 'Wine Velvet Jodhpuri Suit — view 4', 4),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), '/media/products/sage-linen-kurta-pajama-1.v3.jpg', 'Sage Linen Everyday Kurta Pajama — view 1', 1),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), '/media/products/sage-linen-kurta-pajama-2.v3.jpg', 'Sage Linen Everyday Kurta Pajama — view 2', 2),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), '/media/products/sage-linen-kurta-pajama-3.v3.jpg', 'Sage Linen Everyday Kurta Pajama — view 3', 3),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), '/media/products/sage-linen-kurta-pajama-4.v3.jpg', 'Sage Linen Everyday Kurta Pajama — view 4', 4),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), '/media/products/imperial-blue-bandhgala-1.v3.jpg', 'Imperial Blue Raw Silk Bandhgala — view 1', 1),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), '/media/products/imperial-blue-bandhgala-2.v3.jpg', 'Imperial Blue Raw Silk Bandhgala — view 2', 2),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), '/media/products/imperial-blue-bandhgala-3.v3.jpg', 'Imperial Blue Raw Silk Bandhgala — view 3', 3),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), '/media/products/imperial-blue-bandhgala-4.v3.jpg', 'Imperial Blue Raw Silk Bandhgala — view 4', 4),
  ((select id from public.products where slug = 'antique-gold-sherwani'), '/media/products/antique-gold-sherwani-1.v3.jpg', 'Antique Gold Brocade Sherwani — view 1', 1),
  ((select id from public.products where slug = 'antique-gold-sherwani'), '/media/products/antique-gold-sherwani-2.v3.jpg', 'Antique Gold Brocade Sherwani — view 2', 2),
  ((select id from public.products where slug = 'antique-gold-sherwani'), '/media/products/antique-gold-sherwani-3.v3.jpg', 'Antique Gold Brocade Sherwani — view 3', 3),
  ((select id from public.products where slug = 'antique-gold-sherwani'), '/media/products/antique-gold-sherwani-4.v3.jpg', 'Antique Gold Brocade Sherwani — view 4', 4),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), '/media/products/noir-sequin-indo-western-1.v3.jpg', 'Noir Sequin Asymmetric Indo Western — view 1', 1),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), '/media/products/noir-sequin-indo-western-2.v3.jpg', 'Noir Sequin Asymmetric Indo Western — view 2', 2),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), '/media/products/noir-sequin-indo-western-3.v3.jpg', 'Noir Sequin Asymmetric Indo Western — view 3', 3),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), '/media/products/noir-sequin-indo-western-4.v3.jpg', 'Noir Sequin Asymmetric Indo Western — view 4', 4),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), '/media/products/ivory-chikankari-kurta-1.v3.jpg', 'Ivory Chikankari Hand-Work Kurta Set — view 1', 1),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), '/media/products/ivory-chikankari-kurta-2.v3.jpg', 'Ivory Chikankari Hand-Work Kurta Set — view 2', 2),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), '/media/products/ivory-chikankari-kurta-3.v3.jpg', 'Ivory Chikankari Hand-Work Kurta Set — view 3', 3),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), '/media/products/ivory-chikankari-kurta-4.v3.jpg', 'Ivory Chikankari Hand-Work Kurta Set — view 4', 4),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), '/media/products/rust-brocade-nehru-jacket-1.v3.jpg', 'Rust Brocade Nehru Jacket — view 1', 1),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), '/media/products/rust-brocade-nehru-jacket-2.v3.jpg', 'Rust Brocade Nehru Jacket — view 2', 2),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), '/media/products/rust-brocade-nehru-jacket-3.v3.jpg', 'Rust Brocade Nehru Jacket — view 3', 3),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), '/media/products/rust-brocade-nehru-jacket-4.v3.jpg', 'Rust Brocade Nehru Jacket — view 4', 4);

-- Product variants -----------------------------------------------------------
insert into public.product_variants (product_id, sku, size, color, color_hex, stock_quantity, is_active) values
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-BLA-S', 'S', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-BLA-M', 'M', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-BLA-L', 'L', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-BLA-XL', 'XL', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-BLA-XXL', 'XXL', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-DEE-S', 'S', 'Deep Wine', '#5d1f2b', 1, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-DEE-M', 'M', 'Deep Wine', '#5d1f2b', 3, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-DEE-L', 'L', 'Deep Wine', '#5d1f2b', 3, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-DEE-XL', 'XL', 'Deep Wine', '#5d1f2b', 1, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-DEE-XXL', 'XXL', 'Deep Wine', '#5d1f2b', 0, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-MID-S', 'S', 'Midnight Blue', '#16203a', 1, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-MID-M', 'M', 'Midnight Blue', '#16203a', 3, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-MID-L', 'L', 'Midnight Blue', '#16203a', 3, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-MID-XL', 'XL', 'Midnight Blue', '#16203a', 1, true),
  ((select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 'NOOR-B-MID-XXL', 'XXL', 'Midnight Blue', '#16203a', 0, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--BLA-S', 'S', 'Black', '#121215', 2, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--BLA-M', 'M', 'Black', '#121215', 4, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--BLA-L', 'L', 'Black', '#121215', 4, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--BLA-XL', 'XL', 'Black', '#121215', 2, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--BLA-XXL', 'XXL', 'Black', '#121215', 1, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--IVO-S', 'S', 'Ivory', '#efe9de', 1, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--IVO-M', 'M', 'Ivory', '#efe9de', 3, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--IVO-L', 'L', 'Ivory', '#efe9de', 3, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--IVO-XL', 'XL', 'Ivory', '#efe9de', 1, true),
  ((select id from public.products where slug = 'regal-essence-kurta-pajama'), 'REGAL--IVO-XXL', 'XXL', 'Ivory', '#efe9de', 0, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--BLA-S', 'S', 'Black', '#131316', 1, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--BLA-M', 'M', 'Black', '#131316', 3, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--BLA-L', 'L', 'Black', '#131316', 3, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--BLA-XL', 'XL', 'Black', '#131316', 1, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--BLA-XXL', 'XXL', 'Black', '#131316', 0, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--RUS-S', 'S', 'Rust', '#8a4a2b', 0, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--RUS-M', 'M', 'Rust', '#8a4a2b', 2, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--RUS-L', 'L', 'Rust', '#8a4a2b', 2, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--RUS-XL', 'XL', 'Rust', '#8a4a2b', 0, true),
  ((select id from public.products where slug = 'shaan-gold-thread-kurta'), 'SHAAN--RUS-XXL', 'XXL', 'Rust', '#8a4a2b', 0, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-MID-S', 'S', 'Midnight Blue', '#16203a', 2, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-MID-M', 'M', 'Midnight Blue', '#16203a', 4, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-MID-L', 'L', 'Midnight Blue', '#16203a', 4, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-MID-XL', 'XL', 'Midnight Blue', '#16203a', 2, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-MID-XXL', 'XXL', 'Midnight Blue', '#16203a', 1, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-BLA-S', 'S', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-BLA-M', 'M', 'Black', '#111114', 3, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-BLA-L', 'L', 'Black', '#111114', 3, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-BLA-XL', 'XL', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'midnight-velvet-bandhgala'), 'MIDNIG-BLA-XXL', 'XXL', 'Black', '#111114', 0, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--IVO-S', 'S', 'Ivory', '#f0eade', 1, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--IVO-M', 'M', 'Ivory', '#f0eade', 3, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--IVO-L', 'L', 'Ivory', '#f0eade', 3, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--IVO-XL', 'XL', 'Ivory', '#f0eade', 1, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--IVO-XXL', 'XXL', 'Ivory', '#f0eade', 0, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--CHA-S', 'S', 'Champagne', '#ddcbab', 0, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--CHA-M', 'M', 'Champagne', '#ddcbab', 2, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--CHA-L', 'L', 'Champagne', '#ddcbab', 2, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--CHA-XL', 'XL', 'Champagne', '#ddcbab', 0, true),
  ((select id from public.products where slug = 'ivory-pearl-sherwani'), 'IVORY--CHA-XXL', 'XXL', 'Champagne', '#ddcbab', 0, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--MAR-S', 'S', 'Maroon', '#5d1f2b', 1, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--MAR-M', 'M', 'Maroon', '#5d1f2b', 3, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--MAR-L', 'L', 'Maroon', '#5d1f2b', 3, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--MAR-XL', 'XL', 'Maroon', '#5d1f2b', 1, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--MAR-XXL', 'XXL', 'Maroon', '#5d1f2b', 0, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--BOT-S', 'S', 'Bottle Green', '#1f3a2c', 0, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--BOT-M', 'M', 'Bottle Green', '#1f3a2c', 2, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--BOT-L', 'L', 'Bottle Green', '#1f3a2c', 2, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--BOT-XL', 'XL', 'Bottle Green', '#1f3a2c', 0, true),
  ((select id from public.products where slug = 'royal-maroon-sherwani'), 'ROYAL--BOT-XXL', 'XXL', 'Bottle Green', '#1f3a2c', 0, true),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), 'OBSIDI-BLA-S', 'S', 'Black', '#0f0f12', 2, true),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), 'OBSIDI-BLA-M', 'M', 'Black', '#0f0f12', 4, true),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), 'OBSIDI-BLA-L', 'L', 'Black', '#0f0f12', 4, true),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), 'OBSIDI-BLA-XL', 'XL', 'Black', '#0f0f12', 2, true),
  ((select id from public.products where slug = 'obsidian-tiger-sherwani'), 'OBSIDI-BLA-XXL', 'XXL', 'Black', '#0f0f12', 1, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-MAR-S', 'S', 'Maroon', '#5f2330', 2, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-MAR-M', 'M', 'Maroon', '#5f2330', 4, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-MAR-L', 'L', 'Maroon', '#5f2330', 4, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-MAR-XL', 'XL', 'Maroon', '#5f2330', 2, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-MAR-XXL', 'XXL', 'Maroon', '#5f2330', 1, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-IVO-S', 'S', 'Ivory', '#efe9de', 1, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-IVO-M', 'M', 'Ivory', '#efe9de', 3, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-IVO-L', 'L', 'Ivory', '#efe9de', 3, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-IVO-XL', 'XL', 'Ivory', '#efe9de', 1, true),
  ((select id from public.products where slug = 'heritage-open-jodhpuri'), 'HERITA-IVO-XXL', 'XXL', 'Ivory', '#efe9de', 0, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-EME-S', 'S', 'Emerald', '#1f4a3a', 1, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-EME-M', 'M', 'Emerald', '#1f4a3a', 3, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-EME-L', 'L', 'Emerald', '#1f4a3a', 3, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-EME-XL', 'XL', 'Emerald', '#1f4a3a', 1, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-EME-XXL', 'XXL', 'Emerald', '#1f4a3a', 0, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-CHA-S', 'S', 'Charcoal', '#26262a', 0, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-CHA-M', 'M', 'Charcoal', '#26262a', 2, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-CHA-L', 'L', 'Charcoal', '#26262a', 2, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-CHA-XL', 'XL', 'Charcoal', '#26262a', 0, true),
  ((select id from public.products where slug = 'emerald-silk-jodhpuri'), 'EMERAL-CHA-XXL', 'XXL', 'Charcoal', '#26262a', 0, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-BLA-S', 'S', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-BLA-M', 'M', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-BLA-L', 'L', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-BLA-XL', 'XL', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-BLA-XXL', 'XXL', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-CHA-S', 'S', 'Charcoal', '#2a2a2e', 1, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-CHA-M', 'M', 'Charcoal', '#2a2a2e', 3, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-CHA-L', 'L', 'Charcoal', '#2a2a2e', 3, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-CHA-XL', 'XL', 'Charcoal', '#2a2a2e', 1, true),
  ((select id from public.products where slug = 'classic-black-bandhgala-suit'), 'CLASSI-CHA-XXL', 'XXL', 'Charcoal', '#2a2a2e', 0, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--IVO-S', 'S', 'Ivory', '#f0eade', 2, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--IVO-M', 'M', 'Ivory', '#f0eade', 4, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--IVO-L', 'L', 'Ivory', '#f0eade', 4, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--IVO-XL', 'XL', 'Ivory', '#f0eade', 2, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--IVO-XXL', 'XXL', 'Ivory', '#f0eade', 1, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--POW-S', 'S', 'Powder Blue', '#b9c8d6', 1, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--POW-M', 'M', 'Powder Blue', '#b9c8d6', 3, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--POW-L', 'L', 'Powder Blue', '#b9c8d6', 3, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--POW-XL', 'XL', 'Powder Blue', '#b9c8d6', 1, true),
  ((select id from public.products where slug = 'ivory-floral-indo-western'), 'IVORY--POW-XXL', 'XXL', 'Powder Blue', '#b9c8d6', 0, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-COB-S', 'S', 'Cobalt', '#1d3a6b', 3, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-COB-M', 'M', 'Cobalt', '#1d3a6b', 5, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-COB-L', 'L', 'Cobalt', '#1d3a6b', 5, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-COB-XL', 'XL', 'Cobalt', '#1d3a6b', 3, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-COB-XXL', 'XXL', 'Cobalt', '#1d3a6b', 2, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-BLA-S', 'S', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-BLA-M', 'M', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-BLA-L', 'L', 'Black', '#111114', 4, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-BLA-XL', 'XL', 'Black', '#111114', 2, true),
  ((select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 'COBALT-BLA-XXL', 'XXL', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), 'CHAMPA-CHA-S', 'S', 'Champagne', '#ddcbab', 2, true),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), 'CHAMPA-CHA-M', 'M', 'Champagne', '#ddcbab', 4, true),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), 'CHAMPA-CHA-L', 'L', 'Champagne', '#ddcbab', 4, true),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), 'CHAMPA-CHA-XL', 'XL', 'Champagne', '#ddcbab', 2, true),
  ((select id from public.products where slug = 'champagne-zardozi-sherwani'), 'CHAMPA-CHA-XXL', 'XXL', 'Champagne', '#ddcbab', 1, true),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), 'ONYX-M-BLA-S', 'S', 'Black', '#121215', 0, true),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), 'ONYX-M-BLA-M', 'M', 'Black', '#121215', 0, true),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), 'ONYX-M-BLA-L', 'L', 'Black', '#121215', 0, true),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), 'ONYX-M-BLA-XL', 'XL', 'Black', '#121215', 0, true),
  ((select id from public.products where slug = 'onyx-mirror-work-kurta'), 'ONYX-M-BLA-XXL', 'XXL', 'Black', '#121215', 0, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAF-S', 'S', 'Saffron', '#c87f2e', 4, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAF-M', 'M', 'Saffron', '#c87f2e', 6, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAF-L', 'L', 'Saffron', '#c87f2e', 6, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAF-XL', 'XL', 'Saffron', '#c87f2e', 4, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAF-XXL', 'XXL', 'Saffron', '#c87f2e', 3, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAG-S', 'S', 'Sage', '#7d8a6a', 3, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAG-M', 'M', 'Sage', '#7d8a6a', 5, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAG-L', 'L', 'Sage', '#7d8a6a', 5, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAG-XL', 'XL', 'Sage', '#7d8a6a', 3, true),
  ((select id from public.products where slug = 'saffron-festive-kurta-set'), 'SAFFRO-SAG-XXL', 'XXL', 'Sage', '#7d8a6a', 2, true),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), 'CHARCO-CHA-S', 'S', 'Charcoal', '#2a2a2e', 1, true),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), 'CHARCO-CHA-M', 'M', 'Charcoal', '#2a2a2e', 3, true),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), 'CHARCO-CHA-L', 'L', 'Charcoal', '#2a2a2e', 3, true),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), 'CHARCO-CHA-XL', 'XL', 'Charcoal', '#2a2a2e', 1, true),
  ((select id from public.products where slug = 'charcoal-textured-bandhgala'), 'CHARCO-CHA-XXL', 'XXL', 'Charcoal', '#2a2a2e', 0, true),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), 'PEARL--PEA-S', 'S', 'Pearl White', '#f4f0e7', 1, true),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), 'PEARL--PEA-M', 'M', 'Pearl White', '#f4f0e7', 3, true),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), 'PEARL--PEA-L', 'L', 'Pearl White', '#f4f0e7', 3, true),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), 'PEARL--PEA-XL', 'XL', 'Pearl White', '#f4f0e7', 1, true),
  ((select id from public.products where slug = 'pearl-white-groom-sherwani'), 'PEARL--PEA-XXL', 'XXL', 'Pearl White', '#f4f0e7', 0, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-WIN-S', 'S', 'Wine', '#5d1f2b', 2, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-WIN-M', 'M', 'Wine', '#5d1f2b', 4, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-WIN-L', 'L', 'Wine', '#5d1f2b', 4, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-WIN-XL', 'XL', 'Wine', '#5d1f2b', 2, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-WIN-XXL', 'XXL', 'Wine', '#5d1f2b', 1, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-FOR-S', 'S', 'Forest', '#22362b', 1, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-FOR-M', 'M', 'Forest', '#22362b', 3, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-FOR-L', 'L', 'Forest', '#22362b', 3, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-FOR-XL', 'XL', 'Forest', '#22362b', 1, true),
  ((select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 'WINE-V-FOR-XXL', 'XXL', 'Forest', '#22362b', 0, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAG-S', 'S', 'Sage', '#7d8a6a', 3, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAG-M', 'M', 'Sage', '#7d8a6a', 5, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAG-L', 'L', 'Sage', '#7d8a6a', 5, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAG-XL', 'XL', 'Sage', '#7d8a6a', 3, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAG-XXL', 'XXL', 'Sage', '#7d8a6a', 2, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAN-S', 'S', 'Sand', '#c6b59a', 2, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAN-M', 'M', 'Sand', '#c6b59a', 4, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAN-L', 'L', 'Sand', '#c6b59a', 4, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAN-XL', 'XL', 'Sand', '#c6b59a', 2, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-SAN-XXL', 'XXL', 'Sand', '#c6b59a', 1, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-WHI-S', 'S', 'White', '#f2efe9', 2, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-WHI-M', 'M', 'White', '#f2efe9', 4, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-WHI-L', 'L', 'White', '#f2efe9', 4, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-WHI-XL', 'XL', 'White', '#f2efe9', 2, true),
  ((select id from public.products where slug = 'sage-linen-kurta-pajama'), 'SAGE-L-WHI-XXL', 'XXL', 'White', '#f2efe9', 1, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-IMP-S', 'S', 'Imperial Blue', '#1b2c4d', 2, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-IMP-M', 'M', 'Imperial Blue', '#1b2c4d', 4, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-IMP-L', 'L', 'Imperial Blue', '#1b2c4d', 4, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-IMP-XL', 'XL', 'Imperial Blue', '#1b2c4d', 2, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-IMP-XXL', 'XXL', 'Imperial Blue', '#1b2c4d', 1, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-SLA-S', 'S', 'Slate', '#3a4250', 1, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-SLA-M', 'M', 'Slate', '#3a4250', 3, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-SLA-L', 'L', 'Slate', '#3a4250', 3, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-SLA-XL', 'XL', 'Slate', '#3a4250', 1, true),
  ((select id from public.products where slug = 'imperial-blue-bandhgala'), 'IMPERI-SLA-XXL', 'XXL', 'Slate', '#3a4250', 0, true),
  ((select id from public.products where slug = 'antique-gold-sherwani'), 'ANTIQU-ANT-S', 'S', 'Antique Gold', '#b7924f', 2, true),
  ((select id from public.products where slug = 'antique-gold-sherwani'), 'ANTIQU-ANT-M', 'M', 'Antique Gold', '#b7924f', 4, true),
  ((select id from public.products where slug = 'antique-gold-sherwani'), 'ANTIQU-ANT-L', 'L', 'Antique Gold', '#b7924f', 4, true),
  ((select id from public.products where slug = 'antique-gold-sherwani'), 'ANTIQU-ANT-XL', 'XL', 'Antique Gold', '#b7924f', 2, true),
  ((select id from public.products where slug = 'antique-gold-sherwani'), 'ANTIQU-ANT-XXL', 'XXL', 'Antique Gold', '#b7924f', 1, true),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), 'NOIR-S-BLA-S', 'S', 'Black', '#0f0f12', 2, true),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), 'NOIR-S-BLA-M', 'M', 'Black', '#0f0f12', 4, true),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), 'NOIR-S-BLA-L', 'L', 'Black', '#0f0f12', 4, true),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), 'NOIR-S-BLA-XL', 'XL', 'Black', '#0f0f12', 2, true),
  ((select id from public.products where slug = 'noir-sequin-indo-western'), 'NOIR-S-BLA-XXL', 'XXL', 'Black', '#0f0f12', 1, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--IVO-S', 'S', 'Ivory', '#f0eade', 2, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--IVO-M', 'M', 'Ivory', '#f0eade', 4, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--IVO-L', 'L', 'Ivory', '#f0eade', 4, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--IVO-XL', 'XL', 'Ivory', '#f0eade', 2, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--IVO-XXL', 'XXL', 'Ivory', '#f0eade', 1, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--POW-S', 'S', 'Powder Blue', '#b9c8d6', 1, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--POW-M', 'M', 'Powder Blue', '#b9c8d6', 3, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--POW-L', 'L', 'Powder Blue', '#b9c8d6', 3, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--POW-XL', 'XL', 'Powder Blue', '#b9c8d6', 1, true),
  ((select id from public.products where slug = 'ivory-chikankari-kurta'), 'IVORY--POW-XXL', 'XXL', 'Powder Blue', '#b9c8d6', 0, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-RUS-S', 'S', 'Rust', '#8a4a2b', 2, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-RUS-M', 'M', 'Rust', '#8a4a2b', 4, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-RUS-L', 'L', 'Rust', '#8a4a2b', 4, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-RUS-XL', 'XL', 'Rust', '#8a4a2b', 2, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-RUS-XXL', 'XXL', 'Rust', '#8a4a2b', 1, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BOT-S', 'S', 'Bottle Green', '#1f3a2c', 1, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BOT-M', 'M', 'Bottle Green', '#1f3a2c', 3, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BOT-L', 'L', 'Bottle Green', '#1f3a2c', 3, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BOT-XL', 'XL', 'Bottle Green', '#1f3a2c', 1, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BOT-XXL', 'XXL', 'Bottle Green', '#1f3a2c', 0, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BLA-S', 'S', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BLA-M', 'M', 'Black', '#111114', 3, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BLA-L', 'L', 'Black', '#111114', 3, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BLA-XL', 'XL', 'Black', '#111114', 1, true),
  ((select id from public.products where slug = 'rust-brocade-nehru-jacket'), 'RUST-B-BLA-XXL', 'XXL', 'Black', '#111114', 0, true)
on conflict (product_id, size, color) do update set stock_quantity = excluded.stock_quantity;

-- Collection membership ------------------------------------------------------
insert into public.collection_products (collection_id, product_id, display_order) values
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 2),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'noor-black-embroidered-kurta-set'), 3),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'regal-essence-kurta-pajama'), 1),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'regal-essence-kurta-pajama'), 2),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'shaan-gold-thread-kurta'), 1),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'shaan-gold-thread-kurta'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'midnight-velvet-bandhgala'), 1),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'midnight-velvet-bandhgala'), 2),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'midnight-velvet-bandhgala'), 3),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'ivory-pearl-sherwani'), 1),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'ivory-pearl-sherwani'), 2),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'ivory-pearl-sherwani'), 3),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'royal-maroon-sherwani'), 1),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'royal-maroon-sherwani'), 2),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'obsidian-tiger-sherwani'), 1),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'obsidian-tiger-sherwani'), 2),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'heritage-open-jodhpuri'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'heritage-open-jodhpuri'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'emerald-silk-jodhpuri'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'emerald-silk-jodhpuri'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'classic-black-bandhgala-suit'), 1),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'classic-black-bandhgala-suit'), 2),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'ivory-floral-indo-western'), 1),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'ivory-floral-indo-western'), 2),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 1),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'cobalt-raw-silk-nehru-set'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'champagne-zardozi-sherwani'), 1),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'champagne-zardozi-sherwani'), 2),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'onyx-mirror-work-kurta'), 1),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'saffron-festive-kurta-set'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'saffron-festive-kurta-set'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'charcoal-textured-bandhgala'), 1),
  ((select id from public.collections where slug = 'groom-collection'), (select id from public.products where slug = 'pearl-white-groom-sherwani'), 1),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'pearl-white-groom-sherwani'), 2),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 1),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'wine-velvet-jodhpuri-set'), 2),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'sage-linen-kurta-pajama'), 1),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'imperial-blue-bandhgala'), 1),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'imperial-blue-bandhgala'), 2),
  ((select id from public.collections where slug = 'wedding-collection'), (select id from public.products where slug = 'antique-gold-sherwani'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'antique-gold-sherwani'), 2),
  ((select id from public.collections where slug = 'reception-collection'), (select id from public.products where slug = 'noir-sequin-indo-western'), 1),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'noir-sequin-indo-western'), 2),
  ((select id from public.collections where slug = 'eid-collection'), (select id from public.products where slug = 'ivory-chikankari-kurta'), 1),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'ivory-chikankari-kurta'), 2),
  ((select id from public.collections where slug = 'new-collection'), (select id from public.products where slug = 'ivory-chikankari-kurta'), 3),
  ((select id from public.collections where slug = 'festive-collection'), (select id from public.products where slug = 'rust-brocade-nehru-jacket'), 1)
on conflict (collection_id, product_id) do nothing;

-- Homepage sections ----------------------------------------------------------
delete from public.home_sections;
insert into public.home_sections (type, title, subtitle, display_order, is_active, config) values
  ('hero', 'Danish Designer Studio Collections', 'Celebrate simply, remember forever', 1, true, '{"primaryImage":"/media/banners/hero-primary.v3.jpg","primaryCta":{"label":"Go to shop","href":"/shop"},"cards":[{"eyebrow":"Kurta Pajama","title":"New Modern","image":"/media/banners/hero-kurta.v3.jpg","cta":{"label":"View product","href":"/category/kurta-pajama"}},{"eyebrow":"Bandhgala Jodhpuri","title":"Big Discount","image":"/media/banners/hero-bandhgala.v3.jpg","cta":{"label":"Grab offers","href":"/collection/reception-collection"}}]}'::jsonb),
  ('inspiration', 'Looking for inspiration with a wild groom sherwani?', 'Celebrities outfits ideas', 2, true, '{"cta":{"label":"Start shopping","href":"/collection/groom-collection"},"images":["/media/banners/inspiration-1.v3.jpg","/media/banners/inspiration-2.v3.jpg","/media/banners/inspiration-3.v3.jpg"]}'::jsonb),
  ('best_sellers', 'Most Purchased', 'Discounts and savings of up to 25%', 3, true, '{"limit":8,"cta":{"label":"View all best sellers","href":"/shop?sort=best_selling"}}'::jsonb),
  ('featured_categories', 'Shop by silhouette', 'Six houses, one wardrobe', 4, true, '{"limit":6}'::jsonb),
  ('editorial', 'Indian Vogue Timeless & Trendy', '@danishdesignerstudio #DanishDesignerStudio', 5, true, '{"body":"Explore trendy Indian outfits crafted with elegance, rich colours and timeless tradition — a considered blend of modern tailoring and cultural dress.","cta":{"label":"Go to shop","href":"/shop"},"images":["/media/banners/editorial-vogue.v3.jpg","/media/banners/editorial-couple.v3.jpg"]}'::jsonb),
  ('new_arrivals', 'New Arrivals', 'Released this season in small batches', 6, true, '{"limit":8,"cta":{"label":"See new arrivals","href":"/shop?sort=newest"}}'::jsonb),
  ('marquee_banner', 'New Arrivals', null, 7, true, '{"image":"/media/banners/new-arrivals-strip.v3.jpg","cta":{"label":"See new arrival","href":"/collection/new-collection"}}'::jsonb),
  ('trust_badges', null, null, 8, true, '{"badges":[{"icon":"truck","title":"Fast delivery","text":"Free shipping all over India"},{"icon":"shield","title":"Secure checkout","text":"256-bit payment protection"},{"icon":"credit-card","title":"Razorpay gateway","text":"UPI, cards and net banking"},{"icon":"percent","title":"10% first order","text":"Join the list and save"}]}'::jsonb),
  ('collection_banner', 'Collections', 'Curated for the occasion', 9, true, '{"limit":3,"featuredOnly":true}'::jsonb),
  ('trending', 'Trending Products', 'Preorder now for exclusive deals and member gifts', 10, true, '{"limit":8,"cta":{"label":"View all trending","href":"/shop?trending=1"}}'::jsonb),
  ('testimonials', 'What Our Customers Say', null, 11, true, '{"background":"/media/banners/testimonial-bg.v3.jpg"}'::jsonb),
  ('instagram', 'Follow on Instagram', '@danishdesignerstudio', 12, true, '{"handle":"danishdesignerstudio","url":"https://instagram.com/danishdesignerstudio","images":["/media/instagram/ig-1.v3.jpg","/media/instagram/ig-2.v3.jpg","/media/instagram/ig-3.v3.jpg","/media/instagram/ig-4.v3.jpg","/media/instagram/ig-5.v3.jpg","/media/instagram/ig-6.v3.jpg"]}'::jsonb),
  ('newsletter', 'Subscribe and get 20% off your first order', 'Early access to new collections, styling notes and private sales. No noise.', 13, true, '{"buttonText":"Subscribe"}'::jsonb);

-- Banners --------------------------------------------------------------------
delete from public.banners;
insert into public.banners (title, subtitle, eyebrow, image, link_url, button_text, placement, display_order, is_active) values
  ('Danish Designer Studio Collections', 'Celebrate simply, remember forever', 'Autumn / Winter 2026', '/media/banners/hero-primary.v3.jpg', '/shop', 'Go to shop', 'home_hero', 1, true),
  ('New Modern', 'Kurta Pajama', 'Kurta Pajama', '/media/banners/hero-kurta.v3.jpg', '/category/kurta-pajama', 'View product', 'home_hero_card', 2, true),
  ('Big Discount', 'Bandhgala Jodhpuri', 'Bandhgala Jodhpuri', '/media/banners/hero-bandhgala.v3.jpg', '/collection/reception-collection', 'Grab offers', 'home_hero_card', 3, true);

-- Testimonials ---------------------------------------------------------------
delete from public.testimonials;
insert into public.testimonials (author_name, location, rating, content, image, display_order, is_active) values
  ('Arjun Mehta', 'Mumbai, India', 5, 'Danish Designer Studio exceeded every expectation. The fabric and the hand work are genuinely stunning, and the fit out of the box was better than the last two pieces I had tailored locally. The team answered every message within the hour.', '/media/avatars/arjun.v3.jpg', 1, true),
  ('Vikram Suri', 'Delhi, India', 5, 'I wore the ivory pearl sherwani for my nikah. Three months later people still bring it up. The weight of it, the way the hem hangs — you can feel where the work went.', '/media/avatars/vikram.v3.jpg', 2, true),
  ('Imran Qureshi', 'Dubai, UAE', 5, 'Ordered from Dubai and it arrived in nine days, beautifully packed. The measurement guidance on the product page was accurate to the centimetre.', '/media/avatars/imran.v3.jpg', 3, true),
  ('Rahul Bansal', 'Bengaluru, India', 4, 'The velvet bandhgala is superb quality for the price. I sized up on the advice of their stylist and it was exactly right.', '/media/avatars/rahul.v3.jpg', 4, true),
  ('Zaid Ansari', 'Lucknow, India', 5, 'The chikankari kurta is the real thing — hand-worked, not printed. Wore it through a full summer day and stayed comfortable.', '/media/avatars/zaid.v3.jpg', 5, true);

-- Navigation -----------------------------------------------------------------
delete from public.navigation_items;
insert into public.navigation_items (label, href, badge, location, display_order, is_active) values
  ('Shop', '/shop', null, 'main', 1, true),
  ('About Us', '/about', 'HOT', 'main', 2, true),
  ('Collections', '/collections', null, 'main', 3, true),
  ('Journal', '/blog', null, 'main', 4, true),
  ('Contact', '/contact', null, 'main', 5, true),
  ('My Account', '/account', null, 'footer_customer', 1, true),
  ('Orders', '/account/orders', null, 'footer_customer', 2, true),
  ('Wishlist', '/wishlist', null, 'footer_customer', 3, true),
  ('Journal', '/blog', null, 'footer_customer', 4, true),
  ('Kurta Pajama', '/category/kurta-pajama', null, 'footer_categories', 1, true),
  ('Sherwani', '/category/sherwani', null, 'footer_categories', 2, true),
  ('Bandhgala', '/category/bandhgala', null, 'footer_categories', 3, true),
  ('Jodhpuri', '/category/jodhpuri', null, 'footer_categories', 4, true),
  ('Privacy Policy', '/privacy-policy', null, 'footer_policies', 1, true),
  ('Terms & Conditions', '/terms', null, 'footer_policies', 2, true),
  ('Shipping Policy', '/shipping-policy', null, 'footer_policies', 3, true),
  ('Return Policy', '/return-policy', null, 'footer_policies', 4, true);

-- Blog -----------------------------------------------------------------------
insert into public.blog_categories (name, slug) values
  ('Style Guides', 'style-guides'),
  ('Wedding', 'wedding'),
  ('Fabric & Craft', 'fabric-and-craft')
on conflict (slug) do nothing;

insert into public.blog_posts (
  title, slug, excerpt, content, cover_image, author_name, category_id,
  tags, status, published_at, reading_minutes, faqs, seo
) values
  (
    'How To Choose A Groom Sherwani That Actually Suits You', 'sherwani-guide', 'Colour, craft, silhouette and the three measurements most grooms get wrong.', '## Start with the occasion, not the outfit

Colour, craft, silhouette and the three measurements most grooms get wrong. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/sherwani-guide.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'wedding'),
    ARRAY['sherwani', 'groom', 'wedding', 'buying guide']::text[], 'published', '2026-01-05T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"How To Choose A Groom Sherwani That Actually Suits You | Danish Designer Studio Journal","meta_description":"Colour, craft, silhouette and the three measurements most grooms get wrong.","keywords":["sherwani","groom","wedding","buying guide"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/sherwani-guide.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  ),
  (
    'A Practical Guide To Kurta Fabrics', 'kurta-fabric-guide', 'Silk, linen, cotton silk and georgette — what each one does in heat, in photos and over time.', '## Start with the occasion, not the outfit

Silk, linen, cotton silk and georgette — what each one does in heat, in photos and over time. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/kurta-fabric-guide.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'fabric-and-craft'),
    ARRAY['fabric', 'kurta', 'linen', 'silk']::text[], 'published', '2025-12-27T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"A Practical Guide To Kurta Fabrics | Danish Designer Studio Journal","meta_description":"Silk, linen, cotton silk and georgette — what each one does in heat, in photos and over time.","keywords":["fabric","kurta","linen","silk"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/kurta-fabric-guide.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  ),
  (
    'Wedding Colour Palettes For 2026', 'wedding-colour-palette', 'The palettes working best this season, and how to coordinate without matching exactly.', '## Start with the occasion, not the outfit

The palettes working best this season, and how to coordinate without matching exactly. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/wedding-colour-palette.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'wedding'),
    ARRAY['colour', 'wedding', 'trends']::text[], 'published', '2025-12-18T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"Wedding Colour Palettes For 2026 | Danish Designer Studio Journal","meta_description":"The palettes working best this season, and how to coordinate without matching exactly.","keywords":["colour","wedding","trends"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/wedding-colour-palette.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  ),
  (
    'Styling The Modern Bandhgala', 'bandhgala-styling', 'Six ways to wear a bandhgala beyond the obvious wedding reception.', '## Start with the occasion, not the outfit

Six ways to wear a bandhgala beyond the obvious wedding reception. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/bandhgala-styling.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'style-guides'),
    ARRAY['bandhgala', 'styling', 'formalwear']::text[], 'published', '2025-12-09T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"Styling The Modern Bandhgala | Danish Designer Studio Journal","meta_description":"Six ways to wear a bandhgala beyond the obvious wedding reception.","keywords":["bandhgala","styling","formalwear"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/bandhgala-styling.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  ),
  (
    'Eid Lookbook: Dressing For The Long Day', 'eid-lookbook', 'Morning prayers to evening dinners, in pieces that survive all of it.', '## Start with the occasion, not the outfit

Morning prayers to evening dinners, in pieces that survive all of it. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/eid-lookbook.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'style-guides'),
    ARRAY['eid', 'lookbook', 'festive']::text[], 'published', '2025-11-30T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"Eid Lookbook: Dressing For The Long Day | Danish Designer Studio Journal","meta_description":"Morning prayers to evening dinners, in pieces that survive all of it.","keywords":["eid","lookbook","festive"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/eid-lookbook.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  ),
  (
    'Getting Your Measurements Right The First Time', 'measurement-guide', 'A tape measure, a mirror and ten minutes is all it takes.', '## Start with the occasion, not the outfit

A tape measure, a mirror and ten minutes is all it takes. Before anything else, be clear about where the piece is going to be worn — a daytime nikah under open sky asks for very different cloth than an evening reception under warm lighting.

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

Dry clean only for anything embroidered. Store on a wide hanger inside a breathable cover, never in plastic for long stretches, and steam rather than iron. Done properly, a good piece stays wearable for a decade of occasions.', '/media/blog/measurement-guide.v3.jpg', 'Danish Designer Studio Studio',
    (select id from public.blog_categories where slug = 'fabric-and-craft'),
    ARRAY['measurements', 'fit', 'guide']::text[], 'published', '2025-11-21T09:00:00.000Z', 2, '[{"question":"How far in advance should I order?","answer":"Four to six weeks is comfortable for in-stock pieces that need minor alterations. Allow eight to ten weeks for made-to-measure sherwanis with heavy hand work."},{"question":"Do you ship outside India?","answer":"Yes. International orders are dispatched by tracked courier and usually clear customs within seven to twelve days."},{"question":"Can alterations be done locally?","answer":"Every garment is cut with extra seam allowance at the waist and sleeve so a local tailor can adjust the fit without disturbing the embroidery."}]'::jsonb, '{"meta_title":"Getting Your Measurements Right The First Time | Danish Designer Studio Journal","meta_description":"A tape measure, a mirror and ten minutes is all it takes.","keywords":["measurements","fit","guide"],"canonical_url":null,"og_title":null,"og_description":null,"og_image":"/media/blog/measurement-guide.v3.jpg","no_index":false,"no_follow":false}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, content = excluded.content,
  cover_image = excluded.cover_image, tags = excluded.tags, status = excluded.status,
  published_at = excluded.published_at, faqs = excluded.faqs, seo = excluded.seo;

-- Pages ----------------------------------------------------------------------
insert into public.pages (title, slug, content, is_published, seo) values
  ('Privacy Policy', 'privacy-policy', '## What we collect

We collect the information you give us when you create an account, place an order or contact our team: your name, email address, phone number and shipping address. We also collect basic technical information such as your device type and the pages you visit, which helps us keep the store fast and secure.

### How we use it

Your information is used to process orders, arrange delivery, respond to support requests and — only if you opt in — send occasional styling notes and collection announcements. We do not sell personal data to anyone.

### Payments

Card and UPI details are handled entirely by our payment gateway. Danish Designer Studio never receives or stores your full card number, CVV or UPI PIN.

### Cookies

We use cookies to keep you signed in, remember your cart and understand which pages are useful. You can clear or block cookies in your browser; the store will still work, though your cart may not persist between visits.

### Your rights

You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete your account entirely. Write to support@danishdesignerstudio.com and we will respond within seven working days.', true, '{"meta_title":"Privacy Policy | Danish Designer Studio","meta_description":"How Danish Designer Studio collects, uses and protects your personal information, and the rights you have over your data.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Terms & Conditions', 'terms', '## Agreement

By using danishdesignerstudio.com and placing an order you agree to these terms. Please read them before you buy.

### Orders and pricing

All prices are in Indian Rupees and include applicable taxes unless stated otherwise at checkout. We reserve the right to correct pricing errors and to cancel an order where a listing was clearly mispriced; you will be refunded in full in that case.

### Product representation

Hand-worked garments vary slightly from piece to piece. Colours may also render differently between screens. Small variations in embroidery placement are a feature of hand craft, not a defect.

### Made-to-measure

Made-to-measure pieces are cut to the measurements you supply and cannot be cancelled once cutting has begun. Please check the measurement guide carefully before confirming.

### Intellectual property

All photography, copy, designs and the Danish Designer Studio name are our property and may not be reproduced without written permission.

### Governing law

These terms are governed by the laws of India, with jurisdiction in Uttar Pradesh.', true, '{"meta_title":"Terms & Conditions | Danish Designer Studio","meta_description":"The terms that apply when you shop with Danish Designer Studio — orders, pricing, made-to-measure and intellectual property.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Shipping Policy', 'shipping-policy', '## Delivery within India

Shipping is free on every order within India. In-stock pieces are dispatched within two working days and typically arrive in three to six working days depending on your city.

### Made-to-measure timelines

Made-to-measure sherwanis and bandhgalas take four to six weeks in the atelier before dispatch. Heavily hand-worked pieces can take up to ten weeks — the timeline is confirmed by our team within 24 hours of your order.

### International delivery

We ship worldwide by tracked courier. International orders usually clear customs and arrive within seven to twelve working days. Import duties and local taxes are the responsibility of the recipient.

### Tracking

A tracking number and courier name are added to your order as soon as it leaves us, and are visible in your account under Orders. You will also receive an email.

### Undelivered parcels

If a courier is unable to deliver after three attempts the parcel returns to us. We will contact you to arrange redelivery; a redelivery charge may apply for international orders.', true, '{"meta_title":"Shipping Policy | Danish Designer Studio","meta_description":"Free shipping across India, made-to-measure timelines, international delivery and order tracking.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb),
  ('Return Policy', 'return-policy', '## Returns and exchanges

We accept returns on ready-to-wear pieces within seven days of delivery, provided the garment is unworn, unwashed and still carries its original tags and packaging.

### How to start a return

Write to support@danishdesignerstudio.com with your order number and a photograph of the piece. We will arrange a pickup where a reverse courier is available, or share a return address if not.

### Refunds

Approved refunds are issued to the original payment method within five to seven working days of the piece reaching us and passing inspection.

### Exchanges

Size exchanges are free once per order within India, subject to availability. If your size is unavailable we will offer a full refund or store credit.

### What we cannot accept

Made-to-measure garments, altered pieces, and items returned without tags or original packaging cannot be accepted. Damaged or incorrect items are always our responsibility — tell us within 48 hours of delivery and we will replace or refund in full.', true, '{"meta_title":"Return Policy | Danish Designer Studio","meta_description":"Seven-day returns on ready-to-wear, free size exchanges within India, and how refunds are processed.","keywords":null,"canonical_url":null,"og_title":null,"og_description":null,"og_image":null,"no_index":false,"no_follow":false}'::jsonb)
on conflict (slug) do update set
  title = excluded.title, content = excluded.content,
  is_published = excluded.is_published, seo = excluded.seo, updated_at = now();

-- Coupons --------------------------------------------------------------------
insert into public.coupons (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active) values
  ('WELCOME20', '20% off your first order', 'percentage', 20, 3000, 5000, 1000, true),
  ('FESTIVE10', 'Flat 10% off the festive collection', 'percentage', 10, 0, 3000, null, true),
  ('FLAT1500', '₹1,500 off orders above ₹15,000', 'fixed', 1500, 15000, null, 500, true)
on conflict (code) do update set
  description = excluded.description, discount_type = excluded.discount_type,
  discount_value = excluded.discount_value, min_order_value = excluded.min_order_value,
  max_discount = excluded.max_discount, usage_limit = excluded.usage_limit,
  is_active = excluded.is_active;

-- Site settings and SEO ------------------------------------------------------
insert into public.site_settings (id, data) values (1, '{"siteName":"Danish Designer Studio","tagline":"Celebrate simply, remember forever","description":"Danish Designer Studio crafts premium Indian menswear — groom sherwanis, bandhgala suits, jodhpuri sets and hand-worked kurta pajamas, made in our own atelier and shipped worldwide.","logoUrl":"/logo.svg","email":"support@danishdesignerstudio.com","phone":"+91 90000 00000","whatsapp":"919000000000","address":"Studio address line, City, State, India","currency":"INR","currencySymbol":"₹","freeShippingThreshold":0,"flatShippingRate":0,"taxRate":0,"announcements":[{"text":"Buy 2 to 3 pieces and save an extra 5% at checkout.","linkText":"Shop now","href":"/shop"},{"text":"Free delivery all over India on every order.","linkText":"Shop now","href":"/shop"},{"text":"New Collection 2026 has landed in the atelier.","linkText":"Explore","href":"/collection/new-collection"}],"socials":[{"platform":"facebook","url":"https://facebook.com/danishdesignerstudio"},{"platform":"instagram","url":"https://instagram.com/danishdesignerstudio"},{"platform":"twitter","url":"https://x.com/danishdesignerstudio"},{"platform":"pinterest","url":"https://pinterest.com/danishdesignerstudio"},{"platform":"linkedin","url":"https://linkedin.com/company/danishdesignerstudio"},{"platform":"youtube","url":"https://youtube.com/@danishdesignerstudio"},{"platform":"whatsapp","url":"https://wa.me/919000000000"}],"footerDescription":"Danish Designer Studio is an atelier for premium Indian menswear — hand-worked, made to last, and cut for the moments you will be looking back on.","newsletterHeading":"Subscribe and get 20% off your first order","newsletterSubtext":"Early access to new collections, styling notes and private sales. No noise, unsubscribe any time.","instagramHandle":"danishdesignerstudio","pageImages":{"aboutHero":"/media/banners/about-hero.v3.jpg","aboutPrimary":"/media/banners/editorial-vogue.v3.jpg","aboutSecondary":"/media/banners/about-secondary.v3.jpg","contactHero":"/media/banners/contact.v3.jpg"}}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();

insert into public.global_seo (id, data) values (1, '{"siteTitle":"Danish Designer Studio — Premium Indian Menswear","titleTemplate":"%s | Danish Designer Studio","metaDescription":"Shop premium Indian menswear at Danish Designer Studio — groom sherwanis, bandhgala suits, jodhpuri sets and hand-embroidered kurta pajamas. Free delivery across India.","keywords":["sherwani","groom sherwani","bandhgala suit","jodhpuri suit","kurta pajama","indian menswear","wedding wear for men","danish designer studio"],"defaultOgImage":"/media/banners/og-default.v3.jpg","twitterHandle":"@danishdesignerstudio","twitterCardType":"summary_large_image","organizationName":"Danish Designer Studio","organizationLogo":"/logo.svg","robotsIndex":true,"robotsFollow":true,"googleSiteVerification":null}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();

commit;
