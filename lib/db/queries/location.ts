import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocation } from "../schema";

import db from "..";
import { location } from "../schema";

export async function findLocations(userId: string) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findLocationByName(existing: InsertLocation, userId: string) {
  return db.query.location.findFirst({
    where: and(eq(location.name, existing.name), eq(location.userId, userId)),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 5);
export async function findUniqueSlug(slug: string) {
  let existing = !!(await findLocationBySlug(slug));

  while (existing) {
    const id = nanoid();
    const newSlug = `${slug}-${id}`;

    existing = !!(await findLocationBySlug(slug));

    if (!existing) {
      return newSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: string) {
  const [createdLocation] = await db.insert(location).values({
    ...insertable,
    userId,
    slug,
  }).returning();

  return createdLocation;
}
