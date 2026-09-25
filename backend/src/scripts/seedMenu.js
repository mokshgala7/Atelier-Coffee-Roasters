import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const categoryNames = [
  'Hot Coffees',
  'Hot Chocolate',
  'Cold Coffees',
  'Shakes & Smoothies',
  'Iced Tea',
  'Mocktails',
  'Matcha',
  'Desserts',
  'Brownies'
];

const rawProductsData = [
  ['cappuccino', 'Cappuccino', 140, 'Hot Coffees', 'Rich double shot espresso topped with steamed textured milk foam and subtle dusted cacao.', '120 kcal'],
  ['latte', 'Cafe Latte', 140, 'Hot Coffees', 'Silky steamed whole milk poured gently over our signature balanced seasonal house espresso.', '145 kcal'],
  ['espresso', 'Artisanal Double Espresso', 120, 'Hot Coffees', 'Concentrated extraction showcasing bright stone fruit acidity and rich cocoa crema.', '5 kcal'],
  ['americano', 'Americano', 130, 'Hot Coffees', 'Double espresso lengthened with hot filtered water for a clean, nuanced profile.', '10 kcal'],
  ['cafe-mocha', 'Cafe Mocha', 160, 'Hot Coffees', 'Artisanal dark chocolate ganache melted into espresso and warm microfoam milk.', '210 kcal'],
  ['hot-chocolate', 'Classic Hot Chocolate', 160, 'Hot Chocolate', 'Rich melted Belgian dark chocolate whisked with warm cream and organic milk.', '260 kcal'],
  ['hot-chocolate-cool-burst', 'Hot Chocolate Cool Burst', 180, 'Hot Chocolate', 'Rich melted chocolate infused with chilled mint crystal essence.', '270 kcal'],
  ['classic-cold-coffee', 'Classic Cold Coffee', 150, 'Cold Coffees', 'Double espresso blended with chilled milk and natural raw demerara sugar.', '180 kcal'],
  ['iced-americano', 'Iced Americano', 130, 'Cold Coffees', 'Espresso over crystal rock ice and chilled filtered water for high clarity.', '10 kcal'],
  ['iced-latte', 'Iced Latte', 150, 'Cold Coffees', 'Double shot espresso floating gently over chilled full cream milk and ice.', '130 kcal'],
  ['iced-coffee-condensed-milk', 'Iced Coffee with Condensed Milk', 160, 'Cold Coffees', 'Vietnamese-style iced brew combined with sweet caramelized condensed milk.', '220 kcal'],
  ['mocha-frappe', 'Mocha Frappe', 200, 'Cold Coffees', 'Blended iced coffee with Dutch cacao, chocolate chips, and fresh cream.', '310 kcal'],
  ['caramel-frappe', 'Caramel Frappe', 200, 'Cold Coffees', 'Blended frappe with slow-simmered artisanal salted butterscotch caramel.', '325 kcal'],
  ['bourbon-milkshake', 'Bourbon Milkshake', 200, 'Shakes & Smoothies', 'Creamy vanilla bean shake infused with natural bourbon vanilla essence.', '340 kcal'],
  ['oreo-milkshake', 'Oreo Milkshake', 200, 'Shakes & Smoothies', 'Dark chocolate biscuit crumble blended into rich Madagascar vanilla ice cream.', '360 kcal'],
  ['banana-caramel-milkshake', 'Banana Caramel Milkshake', 200, 'Shakes & Smoothies', 'Fresh caramelized bananas spun with vanilla cream and salted caramel drizzle.', '310 kcal'],
  ['nutella-hazelnut-milkshake', 'Nutella Hazelnut Milkshake', 220, 'Shakes & Smoothies', 'Roasted Piedmont hazelnut spread blended with rich whole milk and cocoa.', '380 kcal'],
  ['blueberry-smoothie', 'Blueberry Smoothie', 220, 'Shakes & Smoothies', 'Wild forest blueberries blended with Greek yogurt and raw wildflower honey.', '210 kcal'],
  ['lemon-iced-tea', 'Lemon Iced Tea', 130, 'Iced Tea', 'Nilgiri black tea infused with cold-pressed Meyer lemon juice and mint.', '90 kcal'],
  ['peach-apricot-iced-tea', 'Peach Apricot Iced Tea', 140, 'Iced Tea', 'Fragrant Ceylon tea steeped with organic orchard peach and apricot nectar.', '95 kcal'],
  ['berry-fizz', 'Berry Fizz', 150, 'Mocktails', 'Crushed seasonal berries topped with sparkling botanical soda and lime.', '110 kcal'],
  ['mint-mojito', 'Mint Mojito', 150, 'Mocktails', 'Fresh spearmint leaves muddled with raw cane sugar and bubbly soda water.', '85 kcal'],
  ['pink-punch', 'Pink Punch', 160, 'Mocktails', 'Ruby pink grapefruit juice, guava reduction, and effervescent tonic.', '105 kcal'],
  ['chilli-guava', 'Chilli Guava', 160, 'Mocktails', 'Ripe pink guava nectar seasoned with black salt, Kashmiri chilli, and lime.', '115 kcal'],
  ['peach-slush', 'Peach Slush', 160, 'Mocktails', 'Shaved ice infused with natural sweet peach puree and lemon zest.', '125 kcal'],
  ['peach-berry-slush', 'Peach Berry Slush', 170, 'Mocktails', 'Dual-layer slush of crushed wild blackberries and ripe summer peach.', '130 kcal'],
  ['iced-matcha-latte', 'Iced Matcha Latte', 180, 'Matcha', 'Ceremonial grade Uji green tea whisked over cold milk and crystal ice.', '140 kcal'],
  ['iced-matcha-americano', 'Iced Matcha Americano', 160, 'Matcha', 'Pure stone-ground ceremonial matcha whisked with sparkling spring water.', '15 kcal'],
  ['hot-matcha-latte', 'Hot Matcha Latte', 180, 'Matcha', 'Warm textured oat milk paired with sweet earthy Kyoto matcha foam.', '155 kcal'],
  ['dirty-matcha', 'Dirty Matcha', 200, 'Matcha', 'Uji green tea latte crowned with an artisanal double shot of espresso.', '165 kcal'],
  ['oreo-matcha', 'Oreo Matcha', 200, 'Matcha', 'Stone-ground green tea shake blended with crunchy Oreo crumbles and sweet cream.', '280 kcal'],
  ['banana-caramel-matcha', 'Banana Caramel Matcha', 220, 'Matcha', 'Caramelized bananas and butterscotch syrup married with chilled Uji tea.', '295 kcal'],
  ['choco-lava-cake', 'Choco Lava Cake', 80, 'Desserts', 'Warm miniature dark chocolate molten cake with liquid chocolate fondant.', '340 kcal'],
  ['classic-chocolate-mousse', 'Classic Chocolate Mousse', 100, 'Desserts', 'Silky whipped dark chocolate mousse with airy texture and cacao dusting.', '260 kcal'],
  ['triple-chocolate-mousse', 'Triple Chocolate Mousse', 120, 'Desserts', 'Layered white, milk, and dark chocolate mousses with roasted cocoa nibs.', '310 kcal'],
  ['ferrero-nutella-mousse', 'Ferrero Nutella Mousse', 120, 'Desserts', 'Decadent Nutella mousse topped with toasted Piedmont hazelnuts and crumble.', '365 kcal'],
  ['tiramisu', 'Tiramisu', 175, 'Desserts', 'Italian savoiardi soaked in house espresso, mascarpone cream, and bitter cocoa.', '290 kcal'],
  ['blueberry-cheesecake', 'Blueberry Cheese Cake', 130, 'Desserts', 'New York cheesecake on buttery graham crust with wild blueberry compote.', '380 kcal'],
  ['choco-chip-cookie', 'Choco Chip Cookie', 100, 'Desserts', 'Soft-baked artisan cookie studded with semi-sweet chocolate and Maldon salt.', '210 kcal'],
  ['double-choco-chip-cookie', 'Double Choco Chip Cookie', 110, 'Desserts', 'Dark Dutch chocolate dough loaded with bittersweet chocolate chunks.', '230 kcal'],
  ['nutella-sea-salt-cookie', 'Nutella Sea Salt Cookie', 110, 'Desserts', 'Warm cookie stuffed with a melting Nutella core and flaky sea salt.', '250 kcal'],
  ['marshmallow-cookie', 'Marshmallow Cookie', 125, 'Desserts', 'Chewy brown butter cookie with toasted vanilla marshmallows and chocolate chips.', '240 kcal'],
  ['classic-fudge-brownie', 'Classic Fudge Brownie', 110, 'Brownies', 'Dense fudgy dark chocolate brownie with a glossy crinkled top.', '320 kcal'],
  ['triple-chocolate-brownie', 'Triple Chocolate Brownie', 130, 'Brownies', 'Brownie layered with ganache, chocolate chunks, and white chocolate drizzle.', '360 kcal'],
  ['crunchy-praline-brownie', 'Crunchy Praline Brownie', 130, 'Brownies', 'Chocolate brownie topped with candied pecans and almond praline.', '375 kcal'],
  ['cookie-dough-brownie', 'Cookie Dough Brownie', 130, 'Brownies', 'Double-baked brownie infused with chocolate chip cookie dough ribbons.', '390 kcal']
];

async function seedDatabase() {
  console.log('🌱 Starting idempotent Atelier Coffee Roasters menu seed...');
  await connectDatabase();

  // 1. Seed Categories
  let categoriesUpserted = 0;
  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await Category.findOneAndUpdate(
      { slug },
      { $set: { name, slug, order: i } },
      { upsert: true, new: true }
    );
    categoriesUpserted++;
  }
  console.log(`✅ Upserted ${categoriesUpserted} categories.`);

  // 2. Seed Products
  let productsUpserted = 0;
  for (const item of rawProductsData) {
    const [slug, name, price, category, description, calories] = item;
    await Product.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          name,
          price,
          category,
          description,
          image: slug,
          nutrition: { calories, protein: '6g', carbs: '18g', fat: '6g' },
          available: true
        }
      },
      { upsert: true, new: true }
    );
    productsUpserted++;
  }
  console.log(`✅ Upserted ${productsUpserted} products.`);

  // 3. Ensure Default Admin User Exists
  const adminEmail = 'admin@ateliercoffee.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AtelierAdmin2026!', salt);
    await User.create({
      name: 'Atelier Head Roaster (Admin)',
      email: adminEmail,
      phone: '+91 98200 12345',
      password: hashedPassword,
      role: 'admin'
    });
    console.log(`✅ Created default administrator account (${adminEmail})`);
  } else {
    // Ensure existing user has admin role
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    }
    console.log(`✅ Default administrator verified (${adminEmail})`);
  }

  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();
  console.log(`🎉 Idempotent seed finished successfully! MongoDB Atlas totals: ${categoryCount} categories, ${productCount} products.`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
