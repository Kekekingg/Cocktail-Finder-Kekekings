[README.md](https://github.com/user-attachments/files/32984597/README.md)
# 🍹 Cocktail Finder

[Español](./README.es.md) · 

Cocktail Finder is a single-page app to search cocktail recipes by **ingredient** and **category**, view the full recipe in a modal, and save favorites that persist across sessions.

**Live demo:** https://cocktail-tracker-kekekings.netlify.app/

## Features

- Search drinks by name/ingredient and category (data from [TheCocktailDB](https://www.thecocktaildb.com/api.php)).
- Recipe modal with ingredients, measures and instructions.
- Add / remove favorites from the modal.
- Favorites persisted in `localStorage` and restored on load.
- Runtime validation of every API response with Zod.
- Two routes: Home (`/`) and Favorites (`/favorites`).

## Tech stack

| Area | Tools |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS 4, Headless UI |
| Routing | React Router 7 |
| State | Zustand 5 (slice pattern + `devtools` middleware) |
| HTTP | Axios |
| Validation | Zod schemas (types inferred with `z.infer`) |
| Tooling | Vite, ESLint |

## Getting started

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/Kekekingg/Cocktail-Finder-Kekekings.git
cd Cocktail-Finder-Kekekings
npm install
npm run dev
```

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

No API key or environment variables are needed: the app uses TheCocktailDB public test key (`1`).

## Project structure

```
src/
├── components/   Header (search form + nav), DrinkCard, Modal
├── layouts/      Layout (Header + Outlet + Modal, loads favorites)
├── services/     RecipeService.ts  → API calls
├── stores/       useAppStore.ts, recipeSlice.ts, favoritesSlice.ts
├── types/        Types inferred from the Zod schemas
├── utils/        recipes-schema.ts → Zod schemas
├── views/        IndexPage, FavoritesPage
├── router.tsx
└── main.tsx
```

## Documentation

- [Architecture](./docs/architecture.md)
- [API & events reference](./docs/api-reference.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Roadmap / known limitations

See the "Known issues" section in the [troubleshooting guide](./docs/troubleshooting.md#known-issues).

## Author

**Keke** — Full Stack Developer · [Portfolio](https://portfolio-erik-reyes-keke.netlify.app) · [GitHub](https://github.com/Kekekingg)
