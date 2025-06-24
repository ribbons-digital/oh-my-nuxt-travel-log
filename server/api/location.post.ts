import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

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

  const [createdLocation] = await db.insert(location).values({
    ...result.data,
    userId: event.context.user.id,
    slug: result.data.name.toLowerCase().replace(/ /g, "-"),
  }).returning();

  return createdLocation;
});
