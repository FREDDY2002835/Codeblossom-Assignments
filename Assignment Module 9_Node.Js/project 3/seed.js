require('dotenv').config();
const pool = require('./src/db/pool');

const seed = async () => {
  console.log('🌱 Seeding Brewhouse inventory...');

  await pool.query('TRUNCATE items, categories, suppliers RESTART IDENTITY CASCADE');

  // Categories
  const catRes = await pool.query(`
    INSERT INTO categories (name, description) VALUES
      ('Green Beans', 'Unroasted coffee beans sourced from farms worldwide'),
      ('Roasted Beans', 'House-roasted and third-party roasted coffee beans'),
      ('Brewing Equipment', 'Pour-over, espresso, and drip brewing equipment'),
      ('Grinders', 'Burr and blade grinders for all brewing methods'),
      ('Milk & Dairy', 'Fresh dairy and plant-based milk alternatives'),
      ('Syrups & Sweeteners', 'Flavoring syrups, sugars, and natural sweeteners'),
      ('Packaging', 'Cups, bags, lids, sleeves, and takeaway materials'),
      ('Cleaning Supplies', 'Descalers, portafilter brushes, group head cleaners')
    RETURNING id, name
  `);
  const cats = {};
  catRes.rows.forEach(r => { cats[r.name] = r.id; });
  console.log('✓ Categories created');

  // Suppliers
  const supRes = await pool.query(`
    INSERT INTO suppliers (name, contact_email, country) VALUES
      ('Yirgacheffe Direct Trade Co.', 'orders@yirgacheffe.et', 'Ethiopia'),
      ('Colombia Highlands Export', 'sales@colhighlands.co', 'Colombia'),
      ('Sumatra Green Source', 'procurement@sumatrasource.id', 'Indonesia'),
      ('La Marzocco Distributors', 'parts@lamarzocco.com', 'Italy'),
      ('Baratza Grinders Ltd.', 'orders@baratza.com', 'United States'),
      ('Monin Syrups Europe', 'b2b@monin.com', 'France'),
      ('EcoPack Solutions', 'orders@ecopack.com', 'Netherlands'),
      ('Oatly B2B', 'trade@oatly.com', 'Sweden')
    RETURNING id, name
  `);
  const sups = {};
  supRes.rows.forEach(r => { sups[r.name] = r.id; });
  console.log('✓ Suppliers created');

  // Items
  await pool.query(`
    INSERT INTO items (name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold) VALUES
      ('Yirgacheffe G1 Washed', 'Floral, bergamot, stone fruit. Grade 1 washed process.', ${cats['Green Beans']}, ${sups['Yirgacheffe Direct Trade Co.']}, 120, 8.50, 'kg', 20),
      ('Colombia Huila Natural', 'Red cherry, caramel, tropical fruit. Natural process.', ${cats['Green Beans']}, ${sups['Colombia Highlands Export']}, 80, 9.20, 'kg', 15),
      ('Sumatra Mandheling', 'Dark, earthy, full body. Classic wet-hulled Sumatran.', ${cats['Green Beans']}, ${sups['Sumatra Green Source']}, 55, 7.80, 'kg', 15),
      ('Rwanda Nyamasheke Honey', 'Sweet, complex honey process from Western Rwanda.', ${cats['Green Beans']}, ${sups['Yirgacheffe Direct Trade Co.']}, 8, 10.50, 'kg', 15),
      ('House Espresso Blend', 'Balanced espresso blend. Chocolate, caramel, orange zest.', ${cats['Roasted Beans']}, NULL, 45, 22.00, 'kg', 10),
      ('Seasonal Single Origin Filter', 'Rotating single origin for filter brewing. Currently Kenyan AA.', ${cats['Roasted Beans']}, NULL, 18, 28.00, 'kg', 8),
      ('Decaf Swiss Water Process', 'Swiss Water decaf. Full flavor, zero caffeine.', ${cats['Roasted Beans']}, NULL, 4, 26.00, 'kg', 5),
      ('Hario V60 02 Ceramic', 'Classic pour-over dripper. White ceramic.', ${cats['Brewing Equipment']}, NULL, 24, 18.00, 'units', 5),
      ('Chemex 6-Cup', 'Classic chemex brewer with wooden collar.', ${cats['Brewing Equipment']}, NULL, 10, 42.00, 'units', 3),
      ('AeroPress Original', 'Portable, versatile brewer. Includes 350 filters.', ${cats['Brewing Equipment']}, NULL, 3, 35.00, 'units', 5),
      ('Fellow Stagg EKG Kettle', 'Electric gooseneck kettle with temperature control.', ${cats['Brewing Equipment']}, NULL, 6, 165.00, 'units', 2),
      ('Baratza Encore ESP', 'Entry-level espresso grinder with 40-step adjustment.', ${cats['Grinders']}, ${sups['Baratza Grinders Ltd.']}, 5, 195.00, 'units', 2),
      ('Baratza Virtuoso+', 'Premium filter grinder. 40mm conical burrs.', ${cats['Grinders']}, ${sups['Baratza Grinders Ltd.']}, 3, 279.00, 'units', 1),
      ('Comandante C40 MK4', 'Hand grinder. High-precision nitrogen steel burrs.', ${cats['Grinders']}, NULL, 8, 210.00, 'units', 2),
      ('Whole Milk 2L', 'Fresh whole milk from local dairy. 3.5% fat.', ${cats['Milk & Dairy']}, NULL, 40, 2.80, 'units', 20),
      ('Oat Milk Barista Edition 1L', 'Oatly barista oat milk. Froths perfectly.', ${cats['Milk & Dairy']}, ${sups['Oatly B2B']}, 60, 3.20, 'units', 24),
      ('Almond Milk Unsweetened 1L', 'Barista-grade almond milk.', ${cats['Milk & Dairy']}, NULL, 20, 2.90, 'units', 12),
      ('Monin Vanilla Syrup 1L', 'Classic vanilla flavoring syrup.', ${cats['Syrups & Sweeteners']}, ${sups['Monin Syrups Europe']}, 8, 12.50, 'units', 3),
      ('Monin Caramel Syrup 1L', 'Rich caramel flavoring syrup.', ${cats['Syrups & Sweeteners']}, ${sups['Monin Syrups Europe']}, 6, 12.50, 'units', 3),
      ('Monin Hazelnut Syrup 1L', 'Toasted hazelnut flavoring syrup.', ${cats['Syrups & Sweeteners']}, ${sups['Monin Syrups Europe']}, 2, 12.50, 'units', 3),
      ('Demerara Sugar 5kg', 'Raw cane demerara sugar. Golden and coarse.', ${cats['Syrups & Sweeteners']}, NULL, 15, 9.00, 'kg', 5),
      ('12oz Single Wall Cups x1000', 'Kraft single wall takeaway cups.', ${cats['Packaging']}, ${sups['EcoPack Solutions']}, 3000, 0.12, 'units', 500),
      ('Flat Lids x1000', 'Recyclable flat lids for 12oz cups.', ${cats['Packaging']}, ${sups['EcoPack Solutions']}, 2000, 0.08, 'units', 500),
      ('Coffee Sleeves x500', 'Kraft paper cup sleeves.', ${cats['Packaging']}, ${sups['EcoPack Solutions']}, 400, 0.06, 'units', 500),
      ('Puly Caff Espresso Cleaner', 'Backflush detergent for espresso machines. 900g.', ${cats['Cleaning Supplies']}, NULL, 4, 18.00, 'units', 2),
      ('Cafiza Cleaning Tablets x100', 'Espresso machine cleaning tablets.', ${cats['Cleaning Supplies']}, NULL, 2, 14.00, 'units', 2)
  `);
  console.log('✓ Items created');

  console.log('✅ Seeding complete!');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});