import type { H3Event } from "h3";

export default function defineAuthenticatedEventHandler<T>(handler: (event: H3Event) => T) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }
    return handler(event);
  });
}
