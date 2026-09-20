import { z } from 'zod'
import { CategoryApiResponseSchema, DrinkAPIResponse, DrinksAPIResponse, RecipeAPIResponseSchema, SearchFilterSchema } from '../utils/recipes-schema'

export type Categories = z.infer<typeof CategoryApiResponseSchema>
export type SearchFilter = z.infer<typeof SearchFilterSchema>
export type Drinks = z.infer<typeof DrinksAPIResponse> //Plural -> Drinks
export type Drink = z.infer<typeof DrinkAPIResponse>//Singular -> Drink
export type Recipe = z.infer<typeof RecipeAPIResponseSchema>