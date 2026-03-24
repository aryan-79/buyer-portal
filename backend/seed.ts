import 'dotenv/config';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import db from '@/lib/db';
import { properties, users } from '@/lib/db/schema';
import { env } from '@/lib/utils/env';

const CITIES = [
  { city: 'New York', country: 'US' },
  { city: 'London', country: 'GB' },
  { city: 'Paris', country: 'FR' },
  { city: 'Tokyo', country: 'JP' },
  { city: 'Dubai', country: 'AE' },
  { city: 'Sydney', country: 'AU' },
  { city: 'Toronto', country: 'CA' },
  { city: 'Berlin', country: 'DE' },
  { city: 'Singapore', country: 'SG' },
  { city: 'Barcelona', country: 'ES' },
];

const CURRENCIES: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  FR: 'EUR',
  JP: 'JPY',
  AE: 'AED',
  AU: 'AUD',
  CA: 'CAD',
  DE: 'EUR',
  SG: 'SGD',
  ES: 'EUR',
};

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1494526585095-c41746248156',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
];

const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
];

const TITLES = [
  'Luxury Penthouse in Downtown',
  'Cozy Studio Apartment',
  'Spacious Family Home',
  'Modern Loft with City Views',
  'Charming Cottage by the Lake',
  'Executive Suite in Business District',
  'Beachfront Villa',
  'Suburban Townhouse',
  'Heritage Mansion',
  'Minimalist Micro-Apartment',
  'Hillside Bungalow',
  'Garden View Flat',
  'Riverfront Duplex',
  'Sky-High Condo',
  'Rustic Farmhouse',
  'Urban Studio Nest',
  'Seaside Retreat',
  'Mountain Cabin',
  'Downtown Loft Suite',
  'Classic Victorian House',
  'Contemporary Terrace Home',
  'Budget-Friendly Starter Home',
  'Private Pool Villa',
  'Gated Community House',
  'Artist Warehouse Loft',
  'Eco-Friendly Green Home',
  'Smart Tech Apartment',
  'Old Town Heritage Flat',
  'Industrial Chic Studio',
  'Corner Penthouse Unit',
  'Quiet Cul-de-sac Home',
  'Tropical Garden House',
  'Rooftop Terrace Apartment',
  'New Build Family Residence',
  'Converted Church Loft',
  'Lakeside Chalet',
  'High-Rise City Apartment',
  'Colonial Style Estate',
  'Compact City Pad',
  'Woodland Retreat Cabin',
  'Upscale Serviced Apartment',
  'Bohemian Open-Plan Flat',
  'Mediterranean Style Villa',
  'Penthouse with Panoramic Views',
  'Affordable Inner-City Unit',
  'Countryside Manor',
  'Sunny Top-Floor Apartment',
  'Waterfront Luxury Condo',
  'Stylish One-Bedroom Flat',
  'Grand Family Estate',
];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];
const randPrice = () => parseFloat((rand(50000, 2000000) + Math.random()).toFixed(2));
const randArea = () => parseFloat((rand(30, 500) + Math.random()).toFixed(2));

async function seedUsers() {
  console.log('Seeding admin...');
  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, env.ADMIN_EMAIL));

  if (existingUser) {
    console.log('admin already exists');
    return;
  }

  const [user] = await db
    .insert(users)
    .values({
      fullName: 'Admin',
      email: env.ADMIN_EMAIL,
      password: await bcrypt.hash(env.ADMIN_PASSWORD, 10),
      role: 'admin',
      image: null,
    })
    .returning();
  console.log(`Seeded admin: ${user.email}`);
  return user;
}

async function seedProperties() {
  console.log('🌱 Seeding properties...');
  await db.delete(properties);
  const data = TITLES.map((title, i) => {
    const location = CITIES[i % CITIES.length];
    const currency = CURRENCIES[location.country];
    const bedroom = rand(0, 6);
    const bathroom = rand(1, 4);
    const kitchen = rand(1, 3);
    const livingroom = rand(0, 3);
    return {
      title,
      description: `This stunning property in ${location.city} offers ${bedroom} bedroom(s), ${bathroom} bathroom(s), and ${livingroom} living room(s). Located in a prime area with excellent access to local amenities, transport, and entertainment. A rare opportunity in the ${location.city} real estate market.`,
      price: randPrice(),
      currency,
      area: randArea(),
      address: `${rand(1, 999)} ${pick(['Main St', 'Park Ave', 'Oak Lane', 'Sunset Blvd', 'River Rd', 'Palm Dr'])}`,
      city: location.city,
      country: location.country,
      bedroom,
      bathroom,
      kitchen,
      livingroom,
      favouriteCount: rand(0, 200),
      coverImage: COVER_IMAGES[i % COVER_IMAGES.length],
      images: [pick(EXTRA_IMAGES), pick(EXTRA_IMAGES)],
    };
  });
  const inserted = await db.insert(properties).values(data).returning();
  console.log(`Seeded ${inserted.length} properties`);
}

async function seed() {
  await seedUsers();
  await seedProperties();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
