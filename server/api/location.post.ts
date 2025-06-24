import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join(".")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where: and(eq(location.name, result.data.name), eq(location.userId, event.context.user.id)),
  });
  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists",
    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const newSlug = `${slug}-${id}`;
    slug = newSlug;
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, slug),
    }));

    if (!existing) {
      slug = newSlug;
    }
  }

  try {
    const [createdLocation] = await db.insert(location).values({
      ...result.data,
      userId: event.context.user.id,
      slug,
    }).returning();
    return createdLocation;
  }
  catch (error) {
    const e = error as DrizzleError;

    if (e.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.name, location.user_id") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Location with this name already exists",
      }));
    }

    throw error;
  }
});
