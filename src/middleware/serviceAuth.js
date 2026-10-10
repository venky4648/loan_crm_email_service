import { env } from "../config/env.js";

export function serviceAuthMiddleware(req, res, next) {
  const providedToken = req.headers["x-service-auth"];

  if (!providedToken) {
    return res.status(401).json({
      success: false,
      error: "Service authentication required",
      message: "Missing X-Service-Auth header",
    });
  }

  if (providedToken !== env.SERVICE_AUTH_TOKEN) {
    return res.status(403).json({
      success: false,
      error: "Invalid service authentication token",
    });
  }

  next();
}
