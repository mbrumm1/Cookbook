import { ActionFunctionArgs, Form, Link, NavLink, redirect, useLoaderData } from "react-router-dom";
import config from "../config";

export interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
};

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  otherUnitDescription?: string;
};

export async function recipesLoader(): Promise<Recipe[]> {
  const response = await fetch(`${config.baseUrl}/recipes`, { method: "GET" });
  const recipes = await response.json();
  return recipes;
}

export default function Recipes() {
  const recipes = useLoaderData() as Recipe[];

  return (
    <div className="side-nav">
      <div className="recipe-menu-header">
        <h1><Link to="/">Recipes</Link></h1>
        <Form action="recipes/create">
          <button type="submit">Add</button>
        </Form>
      </div>
      <nav>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <NavLink 
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
                to={`/recipes/${recipe.id}`}>
                  {recipe.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export async function recipeLoader({ params }: any): Promise<Recipe> {
  const response = await fetch(`${config.baseUrl}/recipes/${params.recipeId}`, { method: "GET" });
  const recipe = await response.json();
  return recipe;
}

export async function deleteRecipeAction({ params }: ActionFunctionArgs) {
  await fetch(`${config.baseUrl}/recipes/${params.recipeId}`, { method: "DELETE" });
  return redirect("/");
}

export function Recipe() {
  const recipe = useLoaderData() as Recipe;

  function formatQuantityAndUnit({ quantity, unit, otherUnitDescription }: Ingredient) {
    if (unit !== "Other" && quantity > 1) {
      unit += "s";
    }
    if (!otherUnitDescription) {
      otherUnitDescription = "";
    }
    return `${quantity} ${unit === "Other" ? otherUnitDescription : unit}`;
  }

  return (
    <>
      <div className="recipe">
        <div className="recipe-menu">
          <Form action="edit">
            <button type="submit" className="btn-edit">Edit</button>
          </Form>
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (!confirm("Are you sure you want to delete this recipe?")) {
                event.preventDefault();
              }
            }}>
            <button type="submit" className="btn-delete">Delete</button>
          </Form>
        </div>
        <h1 className="recipe-name">{recipe.name}</h1>
        <ul className="recipe-ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient">
              <span>
                {formatQuantityAndUnit(ingredient)}
              </span>
              {ingredient.name}
            </li>
          ))}
        </ul>
        <ul className="recipe-instructions">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

