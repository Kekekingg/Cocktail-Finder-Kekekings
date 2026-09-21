import { type StateCreator } from "zustand";
import type { Recipe } from "../types";
import { createRecipesSlice, type RecipesSliceType } from "./recipeSlice";


export type FavoritesSliceType = {
    favorites: Recipe[]
    handleClickFavorite: (recipe: Recipe) => void
    favoriteExist: (id: Recipe['idDrink']) => boolean
    loadFromStorage: () => void
}

/*
  This <FavoritesSliceType & RecipesSliceType, [], [], FavoritesSliceType>
  is because Zustand has very limited documentation for TypeScript.
  This is called a "nested type" and is used for consuming data from another slice.
*/
export const createFavoritesSlice : StateCreator<FavoritesSliceType & RecipesSliceType ,[] ,[], FavoritesSliceType> = (set, get, api) => ({
    favorites: [],
    handleClickFavorite: (recipe) => {
        if(get().favoriteExist(recipe.idDrink)) {
            set((state) => ({
                favorites: state.favorites.filter( favorite => favorite.idDrink !== recipe.idDrink)
            }))
        } else {
            set({
                favorites: [...get().favorites, recipe]
            })
        }
        createRecipesSlice(set, get, api).closeModal()
        localStorage.setItem('favorites', JSON.stringify(get().favorites))
    },

    favoriteExist: (id) => {
        return get().favorites.some(favorite => favorite.idDrink === id)
    },
    loadFromStorage: () => {
        const storedFavorites = localStorage.getItem('favorites')
        if(storedFavorites) {
            set ({
                favorites: JSON.parse(storedFavorites)
            })
        }
    }
})
/*
Difference between the two set usages:

1.set((state) => ({
    favorites: state.favorites.filter( favorite => favorite.idDrink !== recipe.idDrink)
}))

2. set({
    favorites: [...get().favorites, recipe]
})
1. set((state) => ({ ... }))
   - Receives the current state as an argument.
   - Best when the update depends on the previous state.
   - Example: removing a favorite with filter.

2. set({ ... })
   - Directly passes the new state object.
   - Useful for adding or replacing without complex logic.
   - Example: adding a new favorite with spread.

In short:
- Use the functional form when you need to calculate the new state based on the old one.
- Use the direct form when you just want to overwrite or append data.

Both are correct so this is only to practice and let you know that you can choose whichever you want.
*/

//Slice Pattern