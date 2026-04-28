function getClientIp(req) {
  // Check headers first (useful when behind proxies)
  const headers = [
    "x-client-ip",
    "x-forwarded-for",
    "cf-connecting-ip", // Cloudflare
    "fastly-client-ip", // Fastly
    "true-client-ip", // Akamai
    "x-real-ip", // Nginx
    "x-cluster-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
  ];

  // Check each header in order
  for (const header of headers) {
    const value = req.headers[header];
    if (value) {
      // Handle x-forwarded-for which may contain multiple IPs
      if (header === "x-forwarded-for") {
        return value.split(",")[0].trim();
      }
      return value;
    }
  }

  // Fallback to connection info
  return (
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "unknown"
  );
}

module.exports = getClientIp;
