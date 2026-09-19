import type { StateCreator } from "zustand"
import { getCategories, getRecipies } from "../services/RecipeServise"
import type { Categories, Drinks, Drink, SearchFilter } from "../types"

export type RecipesSliceType = {
    categories: Categories
    drinks: Drinks
    fetchCategories: () => Promise<void>
    searchRecipes: (searchFilters: SearchFilter) => Promise<void>
    selectRecipe: (id: Drink['idDrink']) => Promise<void>
}

export const createRecipesSlice : StateCreator<RecipesSliceType> = (set) => ({
    categories: {
        drinks: []
    },
    drinks: {
        drinks: []
    },

    fetchCategories: async () => {
        const categories = await getCategories()
        set({
            categories
        })
    },

    searchRecipes: async (filters) => {
        //We need ingredients and category so all of these are in recipe-schema
        const drinks = await getRecipies(filters)
        set({
            drinks
        })
    },

    selectRecipe: async (id) => {
        console.log(id)
    }
})