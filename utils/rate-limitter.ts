import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60 * 15,
});

export const captchaLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60 * 15,
});
