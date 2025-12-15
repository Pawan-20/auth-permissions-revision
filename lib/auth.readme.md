# Problems and solutions to rate limiting with better auth

Using better-auth you can set up the rate limitter. Depending on config, it typically stores state in:

1. memory
2. database

## Problems

### 1. Serverless ≠ shared memory

In serverless systems, each instance of the server will have it's own memory and thus no shared state.  
The attacker therefore never hits the limit.  
In other words , Memory-based rate limiting is useless in serverless

### 2. Database-based rate limiting is slow & weak

no bot detection, attackers can hit your db 10k times thus giving you a DDOS attack.

## Some Options :

1. Use midlewares to handle rate limiting
2. Bot protection : Cloudflare Turnstile (most preferred modern solution, no CATCHA UI) / hCaptcha / reCAPTCHA
3. Use Arcejet : One tool that provides -
   - Arcjet provides:
     - Rate limiting
     - Bot detection
     - Email abuse protection
     - Works well with Next.js & serverless
