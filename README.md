![Logo](public/assets/logo-color.svg)

# Nexus

Web GUI of the Mañana Capital back-office system, live at [manana.kotas.host](https://manana.kotas.host).

- Angular 22, standalone components with signals
- [NG-ZORRO](https://ng.ant.design) (Ant Design)
- [Apache ECharts](https://echarts.apache.org) for charts
- OpenID Connect (authorization code with PKCE) against the [backend](https://nexus.kotas.host)

## Development

Requires Node 22 or newer.

    npm install
    npm start              # http://localhost:4200, expects the backend at http://localhost:5034
    npm test               # unit tests
    npm run e2e            # browser tests, see below

Browser tests in `e2e/` run against the built app at `E2E_BASE_URL` (default `http://localhost:4200`).
`layout.spec.ts` uses mocked data: many funds and years at every screen size, no page may scroll sideways.
`real-backend.spec.ts` drives real logins against a running backend, it needs `E2E_PASSWORD` for the logins `e2e-admin` and `e2e-investor`.

## Deployment

A static site on Cloudflare Workers, the same way as the personal website and the blog:

    npm run build
    npx wrangler deploy    # needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID

`public/_headers` sets the security headers. Allowing the UI at another address means adding it to `Identity__AllowedOrigins__N` of the backend.

## Support

Email: <info@manana.capital>
