import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom"
import RecipeForm from "./RecipeForm";
import { Recipe } from "./Recipes";
import config from "../config";

export async function editRecipeAction({ request }: ActionFunctionArgs): Promise<Response> {
  const recipe = await request.json();
  console.log("editRecipeAction: ", recipe);
  await fetch(`${config.baseUrl}/recipes/${recipe.id}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  return redirect(`/recipes/${recipe.id}`);
}

export default function EditRecipe() {
  const recipe = useLoaderData() as Recipe;

  return (
    <RecipeForm recipe={recipe} method="put" />
  );
}