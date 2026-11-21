# Hirebay Client

Hirebay — equipment rental platform. Owners list equipment, an admin approves it, customers browse, favorite, book and pay with Stripe.

- Framework: Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui + BetterAuth
- Language: JavaScript (`.jsx`)
- Data: mock source behind `src/lib/data/*` + TanStack Query during Phase F; real API in Phase W (`NEXT_PUBLIC_DATA_SOURCE=api`)

```bash
npm run dev     # next dev on :3000
npm run lint
npm run build
```
