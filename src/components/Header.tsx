import { useEffect, useMemo, useState, type ChangeEvent, type SubmitEvent } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useAppStore } from "../stores/useAppStore"

export default function Header() {

    const [searchFilters, setSearchFilters] = useState({
        ingredient: '',
        category: ''
    })

    const {pathname} = useLocation()

    const isHome = useMemo(() => pathname === '/' ,[pathname])

    const fetchCategories = useAppStore((state) => state.fetchCategories)
    const categories = useAppStore((state) => state.categories)
    const searchRecipes = useAppStore((state) => state.searchRecipes)
    

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearchFilters({
            ...searchFilters,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Validate
        if(Object.values(searchFilters).includes('')) {
            console.log('All fields are required')
            return
        }

        //Consult the recipes
        searchRecipes(searchFilters)
    }
  return (
    <header className={isHome ? 'bg-[url(/bg.jpg)] bg-center bg-cover' : 'bg-slate-800'}>
        <div className="mx-auto container px-5 py-16">
            <div className="flex justify-between items-center">
                <Link to="/">
                    <img src="/logo.svg" alt="Logotipo" className="w-32" />
                </Link>

                <nav className="flex gap-4">
                    <NavLink 
                        to="/"
                        className={({isActive}) => 
                            isActive ? 'text-orange-500 uppercase font-bold' : 'text-white uppercase font-bold'
                        }
                    >Home</NavLink>

                    <NavLink
                        to="/favorites"
                        className={({isActive}) => 
                            isActive ? 'text-orange-500 uppercase font-bold' : 'text-white uppercase font-bold'
                        }
                    >Favorites</NavLink>
                </nav>
            </div>

            {isHome && (
                <form 
                    className="sm:w-1/2 md:w-1/2 2xl:1/3 bg-orange-400 my-20 p-10 rounded-lg shadow space-y-6"
                    onSubmit={handleSubmit}
                    >
                    <div>
                        <label
                            htmlFor="ingredient"
                            className="block text-white uppercase font-extrabold text-lg mb-2"
                            >
                                Name or Ingredients:
                        </label>

                        <input
                            id="ingredient"
                            type="text" 
                            name="ingredient"
                            className="p-3 w-full rounded-lg focus:outline-none bg-white"
                            placeholder="Name or Ingredient. Ex. Vodka, Tequila, Coffee"
                            onChange={handleChange}
                            value={searchFilters.ingredient}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-white uppercase font-extrabold text-lg mb-2"
                            >
                                Category:
                        </label>

                        <select
                            id="category" 
                            name="category"
                            className="p-3 w-full rounded-lg focus:outline-none bg-white"
                            onChange={handleChange}
                            value={searchFilters.category}
                        >
                            <option value="">--Select--</option>
                            {categories.drinks.map(category => (
                                <option 
                                    key={category.strCategory}
                                    value={category.strCategory}
                                >
                                    {category.strCategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input type="submit" value="Search recipes" className="cursor-pointer bg-orange-800 hover:bg-orange-900 text-white font-extrabold w-full p-2 rounded-lg uppercase"/>
                </form>
            )}
        </div>
    </header>
  )
}
