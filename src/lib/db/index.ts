import "server-only";
import bcrypt from "bcryptjs";
import mysql2 from "mysql2";
import { DataTypes, Sequelize, type Model, type ModelStatic } from "sequelize";
import { posts as staticPosts } from "@/lib/content";
import { seedDemos } from "@/lib/db/seed";

export type DB = {
  sequelize: Sequelize;
  AdminUser: ModelStatic<Model>;
  Lead: ModelStatic<Model>;
  Order: ModelStatic<Model>;
  Post: ModelStatic<Model>;
  Demo: ModelStatic<Model>;
  Booking: ModelStatic<Model>;
};

const g = globalThis as unknown as { __bgeeDb?: Promise<DB> };

function connect(): Sequelize {
  const { DB_HOST = "127.0.0.1", DB_PORT = "3306", DB_NAME, DB_USER, DB_PASS = "" } = process.env;
  if (!DB_NAME || !DB_USER) throw new Error("Database is not configured (set DB_NAME and DB_USER)");
  return new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: "mysql",
    dialectModule: mysql2, // explicit so bundlers/hosts do not need to resolve it dynamically
    logging: false,
    pool: { max: 5, min: 0, acquire: 8000, idle: 10000 },
    define: { charset: "utf8mb4", collate: "utf8mb4_unicode_ci" },
  });
}

function defineModels(s: Sequelize): Omit<DB, "sequelize"> {
  const str = (n = 255) => DataTypes.STRING(n);
  return {
    AdminUser: s.define("AdminUser", {
      email: { type: str(190), allowNull: false, unique: true },
      name: str(120),
      passwordHash: { type: str(100), allowNull: false },
    }),
    Lead: s.define("Lead", {
      name: { type: str(120), allowNull: false },
      email: { type: str(190), allowNull: false },
      phone: str(40),
      service: str(160),
      budget: str(80),
      message: DataTypes.TEXT,
      source: { type: str(20), defaultValue: "contact" },
      status: { type: str(20), defaultValue: "new" }, // new | contacted | won | lost
      notes: DataTypes.TEXT,
    }),
    Order: s.define("Order", {
      ref: { type: str(24), allowNull: false, unique: true },
      status: { type: str(20), defaultValue: "pending" }, // pending | paid | cancelled
      tier: str(20),
      cycle: str(20),
      amountCents: DataTypes.INTEGER,
      currency: { type: str(3), defaultValue: "usd" },
      businessName: str(160),
      domain: str(190),
      slogan: str(300),
      email: str(190),
      phone: str(40),
      industry: str(60),
      style: str(40),
      colors: str(60),
      logoPath: str(255),
      notes: DataTypes.TEXT,
      stripeSessionId: str(255),
    }),
    Post: s.define("Post", {
      slug: { type: str(190), allowNull: false, unique: true },
      title: { type: str(250), allowNull: false },
      excerpt: DataTypes.TEXT,
      category: { type: str(60), defaultValue: "General" },
      body: DataTypes.TEXT("long"),
      coverUrl: str(500),
      published: { type: DataTypes.BOOLEAN, defaultValue: false },
      publishedAt: DataTypes.DATE,
      readMinutes: { type: DataTypes.INTEGER, defaultValue: 3 },
    }),
    Booking: s.define("Booking", {
      ref: { type: str(24), allowNull: false, unique: true },
      status: { type: str(20), defaultValue: "pending" }, // pending | paid | cancelled
      serviceSlug: str(120),
      service: str(200),
      minutes: { type: DataTypes.INTEGER, defaultValue: 30 },
      slotDate: { type: DataTypes.DATEONLY, allowNull: false },
      slotTime: { type: str(5), allowNull: false },
      timezone: str(60),
      name: { type: str(120), allowNull: false },
      email: { type: str(190), allowNull: false },
      phone: str(40),
      goal: DataTypes.TEXT,
      amountCents: DataTypes.INTEGER,
      currency: { type: str(3), defaultValue: "usd" },
      stripeSessionId: str(255),
      notes: DataTypes.TEXT,
    }),
    Demo: s.define("Demo", {
      slug: { type: str(190), allowNull: false, unique: true },
      title: { type: str(200), allowNull: false },
      category: { type: str(80), defaultValue: "CRM" },
      summary: DataTypes.TEXT,
      description: DataTypes.TEXT("long"),
      url: str(500),
      demoUser: str(160),
      demoPass: str(160),
      imageUrl: str(500),
      features: DataTypes.TEXT, // one feature per line
      published: { type: DataTypes.BOOLEAN, defaultValue: true },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    }),
  };
}

/** Additive upgrades for tables created by an earlier version (sync() never alters existing tables). */
async function addMissingColumns(db: DB) {
  const qi = db.sequelize.getQueryInterface();
  const bookings = await qi.describeTable("Bookings");
  if (!bookings.minutes) await qi.addColumn("Bookings", "minutes", { type: DataTypes.INTEGER, defaultValue: 30 });
}

async function seed(db: DB) {
  // First admin from env (only when no admin exists yet)
  if ((await db.AdminUser.count()) === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await db.AdminUser.create({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      name: "Admin",
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    });
  }
  // Starter blog posts from the static content
  if ((await db.Post.count()) === 0) {
    for (const p of staticPosts) {
      await db.Post.create({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        body: p.body.map((b) => (b.h ? `## ${b.h}\n\n${b.p}` : b.p)).join("\n\n"),
        published: true,
        publishedAt: new Date(p.date),
        readMinutes: p.readMinutes,
      });
    }
  }
  if ((await db.Demo.count()) === 0) {
    for (const d of seedDemos) await db.Demo.create({ ...d, published: true });
  }
}

/** Connects once per server process (cached on globalThis so dev reloads reuse the pool). */
export function getDb(): Promise<DB> {
  g.__bgeeDb ??= (async () => {
    const sequelize = connect();
    const db: DB = { sequelize, ...defineModels(sequelize) };
    await sequelize.authenticate();
    await sequelize.sync(); // creates missing tables; use migrations once the schema stabilises
    await addMissingColumns(db);
    await seed(db);
    return db;
  })().catch((e) => {
    g.__bgeeDb = undefined; // allow retry on the next request
    throw e;
  });
  return g.__bgeeDb;
}

export const plain = <T = Record<string, unknown>>(m: Model | null): T | null => (m ? (m.get({ plain: true }) as T) : null);
