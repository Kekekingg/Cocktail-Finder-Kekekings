[architecture.md](https://github.com/user-attachments/files/32984714/architecture.md)
# Architecture

[Español](./es/architecture.md) ·

## 1. Overview

Cocktail Finder is a client-side SPA (no backend). Data comes from TheCocktailDB; the only persistence is the browser's `localStorage`.

```
┌──────────────┐  events   ┌──────────────────────┐  calls   ┌───────────────┐
│ Components / │ ────────► │ Zustand store        │ ───────► │ RecipeService │──► TheCocktailDB
│ Views (React)│ ◄──────── │ recipeSlice          │ ◄─────── │ (Axios + Zod) │
└──────────────┘ selectors │ favoritesSlice       │          └───────────────┘
                           └──────────┬───────────┘
                                      │ setItem / getItem
                                      ▼
                                 localStorage ("favorites")
```

## 2. Layers

| Layer | Files | Responsibility |
|---|---|---|
| Routing | `router.tsx` | `BrowserRouter` with a shared `Layout` and two routes: `/` and `/favorites` |
| Layout | `layouts/Layout.tsx` | Renders `Header`, `<Outlet/>` and the global `Modal`; calls `loadFromStorage()` once on mount |
| Views | `views/IndexPage.tsx`, `views/FavoritesPage.tsx` | Read state and render lists of `DrinkCard` (or an empty-state message) |
| Components | `Header`, `DrinkCard`, `Modal` | Search form + nav, drink card, recipe dialog (Headless UI) |
| State | `stores/*` | Global state and actions, split into slices |
| Services | `services/RecipeService.ts` | HTTP requests and response validation |
| Schemas / types | `utils/recipes-schema.ts`, `types/index.ts` | Zod schemas and types derived from them |

## 3. State management: slice pattern

`useAppStore` merges two slices into a single store:

```ts
create<RecipesSliceType & FavoritesSliceType>()(devtools((...a) => ({
  ...createRecipesSlice(...a),
  ...createFavoritesSlice(...a),
})))
```

### recipeSlice

State: `categories`, `drinks`, `selectedRecipe`, `modal`.
Actions: `fetchCategories`, `searchRecipes`, `selectRecipe`, `closeModal`.

### favoritesSlice

State: `favorites: Recipe[]`.
Actions: `handleClickFavorite`, `favoriteExist`, `loadFromStorage`.

### Nested slice types

Each slice needs to reach the other one (favorites closes the modal). To type that, the `StateCreator` receives the combined type as its first generic:

```ts
StateCreator<FavoritesSliceType & RecipesSliceType, [], [], FavoritesSliceType>
//           ─────── full store ───────────────────      ── slice it returns ──
```

This lets `get()` see actions from both slices while the function still returns only its own slice.

## 4. Key flows

### 4.1 Search

1. `Header` mounts → `fetchCategories()` fills the category `<select>`.
2. User submits the form → both fields are required (otherwise it logs and returns).
3. `searchRecipes(filters)` → `getRecipies()` → validated → `drinks` updated.
4. `IndexPage` re-renders the cards.

### 4.2 View a recipe

1. `DrinkCard` "See Recipe" → `selectRecipe(idDrink)`.
2. `getRecipeById()` → validated → `selectedRecipe` set and `modal: true`.
3. `Modal` iterates `strIngredient1..15` / `strMeasure1..15` to build the list.

### 4.3 Favorites (commits `aa2ae94` and `995adf9`)

1. "Add to Favorite" → `handleClickFavorite(recipe)`.
2. If `favoriteExist(id)` → remove (functional `set((state) => ...)`); otherwise append (`set({ favorites: [...get().favorites, recipe] })`).
3. Modal is closed and the whole array is serialized to `localStorage['favorites']`.
4. On app start, `Layout` calls `loadFromStorage()`, which parses and hydrates `favorites`.
5. `FavoritesPage` maps `favorites` to `DrinkCard`s.

## 5. Data validation

Every response goes through `safeParse`. On success the parsed data is returned; on failure the function currently returns `undefined` (see [Known issues](./troubleshooting.md#known-issues)). Types are never written by hand: `Categories`, `SearchFilter`, `Drinks`, `Drink` and `Recipe` are all `z.infer<...>` of a schema, so schema and type cannot drift.

## 6. Persistence

| Key | Value | Written by | Read by |
|---|---|---|---|
| `favorites` | JSON array of `Recipe` | `handleClickFavorite` | `loadFromStorage` |

The full recipe object is stored (not just the id), so favorites render without extra requests.

## 7. Design decisions

- **Zustand slices** over Context/Redux: minimal boilerplate, and slices keep search and favorites logic separated.
- **Zod + inferred types**: validates untrusted API data and gives single-source typing.
- **Global modal in `Layout`**: one modal instance driven by store state, reused from Home and Favorites.
- **Full recipe in favorites**: trades a little storage for offline-friendly rendering.
