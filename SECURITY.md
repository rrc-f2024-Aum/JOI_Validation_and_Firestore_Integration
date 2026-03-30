# Security Configuration

This document explains the security setup for the Event Management API. The goal is to follow industry best practices for a JSON-based REST API, keeping things flexible for development while enforcing stricter security in production..

Security was implemented using:

- Helmet.js (HTTP security headers)
- Custom CORS configuration
- Environment-based configuration using `NODE_ENV`

---

# Helmet.js Configuration

## Configuration Overview

The API uses a custom Helmet configuration defined in `config/helmetConfig.ts`.

Base configuration applied in all environments:

```ts
{
  contentSecurityPolicy: false,
  hidePoweredBy: true,
  noSniff: true,
  originAgentCluster: true,
  xssFilter: true
}
```

Additional production-only configuration:

```ts
{
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: "deny" },
  referrerPolicy: { policy: "no-referrer" }
}
```

---

## Justification of Each Helmet Setting

### 1. contentSecurityPolicy: false

Since our API only returns JSON and doesn't serve HTML, CSP isn't needed. Disabling it avoids unnecessary overhead.  

**Benefit:** Appropriate optimization for API-only services.

---

### 2. hidePoweredBy: true

Removes the `X-Powered-By` header from responses.

**Benefit:** Prevents attackers from identifying the underlying technology stack.

---

### 3. noSniff: true

Prevents browsers from guessing the content type, helping defend against certain XSS attacks.

**Benefit:** Protects against content-type confusion attacks and certain XSS vectors.

---

### 4. originAgentCluster: true 

Enables the `Origin-Agent-Cluster` header, which instructs the browser to isolate the origin into its own process.

**Benefit:** Improves security by preventing cross-origin data leaks and enforcing stronger origin isolation.

---

### 5. xssFilter: true

Adds extra XSS protection for older browsers, complementing modern security measures.

**Benefit:** Adds additional XSS protection for older browsers.

---

### 6. hsts (Production Only)

```ts
hsts: {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}
```

HTTP Strict Transport Security enforces HTTPS connections for one year (31536000 seconds).

- `includeSubDomains` ensures subdomains are protected.
- `preload` allows the domain to be included in browser preload lists.

**Benefit:** Prevents protocol downgrade attacks and man-in-the-middle attacks.

Disabled in development because HTTPS is typically not configured locally.

---

### 7. frameguard: { action: "deny" }

Prevents the API from being embedded inside an iframe.

**Benefit:** Protects against clickjacking attacks.

---

### 8. referrerPolicy: { policy: "no-referrer" }

Stops browsers from sending referrer URLs, helping protect sensitive information.

**Benefit:** Reduces leakage of potentially sensitive URL information.

---

## Helmet Sources

1. Helmet.js Official Documentation  
   https://helmetjs.github.io/

2. OWASP Secure Headers Project  
   https://owasp.org/www-project-secure-headers/

3. MDN Web Docs - HTTP Security Headers  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

4. MDN Web Docs - HTTP Strict Transport Security  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security

---

# CORS Configuration

## Configuration Overview

The API uses environment-based CORS configuration defined in `config/corsConfig.ts`.

### Development Mode

```ts
{
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
```

### Production Mode

```ts
{
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 7200,
  exposedHeaders: ["Content-Length"]
}
```

---

## Justification of Each CORS Setting

### 1. origin

- Development: `origin: true` allows all origins for easier testing.
- Production: Only origins listed in `ALLOWED_ORIGINS` are permitted.

**Benefit:** Prevents unauthorized domains from accessing the API in production.

---

### 2. credentials: true

Allows cookies or authentication headers to be sent.

**Benefit:** Necessary if authentication tokens or session-based credentials are used.

---

### 3. methods

Restricted to:

```
GET, POST, PUT, DELETE
```

**Benefit:** Limits the allowed HTTP methods to only those supported by the API, reducing attack surface.

---

### 4. allowedHeaders

Restricted to:

```
Content-Type, Authorization
```

**Benefit:** Prevents unexpected custom headers from being accepted.

---

### 5. maxAge: 7200

Caches preflight request results for 2 hours (7200 seconds).

**Benefit:**  
- Reduces unnecessary preflight requests  
- Improves performance  
- Still maintains controlled access

---

### 6. exposedHeaders: ["Content-Length"]

Allows the client to access the `Content-Length` response header.

**Benefit:** Enables frontend applications to read response size when needed.

---

## CORS Sources

1. MDN Web Docs - Cross-Origin Resource Sharing (CORS)  
   https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

2. OWASP - CORS Misconfiguration  
   https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny

3. Express.js CORS Middleware Documentation  
   https://expressjs.com/en/resources/middleware/cors.html
