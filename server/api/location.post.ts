import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-handler";

export default defineAuthenticatedEventHandler(async (event) => {
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

  const existingLocation = await findLocationByName(result.data, event.context.user.id);
  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    if (!slug) {
      return sendError(event, createError({
        statusCode: 500,
        statusMessage: "Failed to generate unique slug",
      }));
    }

    return insertLocation(result.data, slug, event.context.user.id);
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
