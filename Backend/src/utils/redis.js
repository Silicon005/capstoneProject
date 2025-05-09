const { createClient } = require("redis");

const redis = createClient({ url: process.env.REDIS_URL, });

redis.on("connect", () => { console.log("✅ Redis connected"); });

redis.on("error", (err) => { console.error("❌ Redis Client Error:", err); });

(async () => { try { await redis.connect(); } catch (err) { console.error("❌ Redis connection failed:", err); } })();

module.exports = redis;
