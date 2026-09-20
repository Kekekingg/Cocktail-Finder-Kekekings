import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createRecipesSlice, type RecipesSliceType } from './recipeSlice'
import { type FavoritesSliceType, createFavoritesSlice } from './favoritesSlice'

//Set lets us writte in the state
//...a take a copy of all the arguments
export const useAppStore = create<RecipesSliceType & FavoritesSliceType>()(devtools( (...a) => ({
    ...createRecipesSlice(...a),
    ...createFavoritesSlice(...a),
})))