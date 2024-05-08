import { ActionFunctionArgs, redirect } from "react-router-dom";
import config from "../config";
import { RecipeHookForm } from "./RecipeForm";
import { Recipe } from "./Recipes";

export async function createRecipeAction({ request }: ActionFunctionArgs): Promise<Response> {
    const recipe = await request.json();
    const response = await fetch(`${config.baseUrl}/recipes`, {
        method: "POST",
        body: JSON.stringify(recipe),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const newRecipe = await response.json();    
    return redirect(`/recipes/${newRecipe.id}`);
}

export default function CreateRecipe() {
    const recipe: Recipe = {
        id: 0,
        name: "",
        ingredients: [],
        instructions: []
    }

    return (
        <RecipeHookForm recipe={recipe} />
    );
}