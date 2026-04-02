import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  tls: process.env.NODE_ENV === "production" ? {} : undefined, // SSL for Upstash in production
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      console.error("Redis max retries reached");
      return null;
    }
    return Math.min(times * 200, 1000); // wait 200ms, 400ms, 600ms between retries
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

export default redis;