import { useEffect, useState } from "react";

interface Recipe {
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

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  async function fetchRecipes() {
    const response = await fetch("https://localhost:4000/recipes", {
      method: "GET"
    });
    const recipes = await response.json();
    setRecipes(recipes);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id}>
            <td>{recipe.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface RecipeArgs {
  id: number;
}

function Recipe({ id }: RecipeArgs) {
  const [recipe, setRecipe] = useState<Recipe>();

  async function fetchRecipe() {
    const response = await fetch(`https://localhost:4000/recipes/${id}`, {
      method: "GET"
    });
    const recipe = await response.json();
    setRecipe(recipe);
  }

  useEffect(() => {
    fetchRecipe();
  }, []);

  if (!recipe) {
    return <p>recipe not found</p>;
  }

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
      <RecipeForm recipe={recipe} />
    </>
  );
}

interface EditRecipeViewModel {
  id: number;
  name: string;
  ingredients: EditIngredientViewModel[];
  instructions: EditInstructionViewModel[];
}

interface EditInstructionViewModel {
  key: number;
  text: string;
}

interface FormArgs {
  recipe: Recipe;
}

function RecipeForm({ recipe }: FormArgs) {
  const keyedIngredients = recipe.ingredients.map((ingredient, index) => ({ key: index, ...ingredient }));
  const keyedInstructions = recipe.instructions.map((instruction, index) => ({ key: index, text: instruction }));
  const [recipeState, setRecipeState] = useState<EditRecipeViewModel>({
    ...recipe,
    ingredients: keyedIngredients,
    instructions: keyedInstructions
  });
  const [ingredientKey, setIngredientKey] = useState(recipeState.ingredients.length - 1);
  const [instructionKey, setInstructionKey] = useState(recipeState.instructions.length - 1);

  function handleAddIngredient(addedIngredient: EditIngredientViewModel): void {
    console.log(ingredientKey);
    const newKey = ingredientKey + 1;
    addedIngredient.key = newKey;
    setRecipeState({
      ...recipeState,
      ingredients: [...recipeState.ingredients, { ...addedIngredient }]
    });
    setIngredientKey(newKey);
  }

  function handleUpdateIngredient(updatedIngredient: EditIngredientViewModel): void {
    setRecipeState(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        if (ingredient.key === updatedIngredient.key) {
          return updatedIngredient;
        } else {
          return ingredient;
        }
      })
    }));
  }

  function handleDeleteIngredient(key: number): void {
    setRecipeState({
      ...recipeState,
      ingredients: recipeState.ingredients.filter((ingredient) => ingredient.key !== key)
    });
  }

  return (
    <form>
      <label htmlFor="recipe-name">
        <input id="recipe-name"
          value={recipeState.name}
          onChange={(e) => setRecipeState({ ...recipeState, name: e.target.value })} />
      </label>
      <IngredientListForm
        ingredients={recipeState.ingredients}
        onAdd={handleAddIngredient}
        onUpdate={handleUpdateIngredient}
        onDelete={handleDeleteIngredient} />
      <h3>Instructions</h3>
      <div className="add-instruction-inputs">
        <div className="input-group">
          <input type="text"></input>
        </div>
        <button type="button" className="btn-add-instruction">
          <i className="fa fa-plus"></i>
        </button>
      </div>
      <hr />
      <ul className="instruction-inputs">
        {recipeState.instructions.map((instruction) => (
          <li key={instruction.key}>
            <input className="instruction-input" type="text" value={instruction.text} />
            <i className="fa-regular fa-trash-can"></i>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => console.log(recipeState)}>Test</button>
    </form>
  )
}

interface EditIngredientViewModel {
  key: number;
  name: string;
  quantity: number;
  unit: string;
  otherUnitDescription?: string;
}

interface IngredientListFormArgs {
  ingredients: EditIngredientViewModel[];
  onAdd: (ingredient: EditIngredientViewModel) => void;
  onUpdate: (ingredient: EditIngredientViewModel) => void;
  onDelete: (key: number) => void;
};

function IngredientListForm({ ingredients, onAdd, onUpdate, onDelete }: IngredientListFormArgs) {
  const emptyIngredient: EditIngredientViewModel = {
    key: 0,
    name: "",
    quantity: 0,
    unit: "",
    otherUnitDescription: ""
  };
  const [newIngredient, setNewIngredient] = useState<EditIngredientViewModel>(emptyIngredient);

  const [units, setUnits] = useState<string[]>([]);
  async function fetchUnits() {
    const response = await fetch("https://localhost:4000/units");
    setUnits(await response.json());
  }

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <>
      <h3>Ingredients</h3>
      <div className="add-ingredient-inputs">
        <div className="input-group">
          <label>Name</label>
          <input type="text"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} />
        </div>
        <div className="input-group">
          <label>Quantity</label>
          <input type="number"
            value={newIngredient.quantity}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseInt(e.target.value) })} />
        </div>
        <div className="input-group">
          <label>Unit</label>
          <select
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}>
            {units.map((unit, index) => <option key={index}>{unit}</option>)}
          </select>
        </div>
        {newIngredient.unit === "Other" &&
          <div className="input-group">
            <label>Other Description</label>
            <input type="text"
              value={newIngredient.otherUnitDescription}
              onChange={(e) => setNewIngredient({ ...newIngredient, otherUnitDescription: e.target.value })} />
          </div>
        }
        <div>
          <button type="button" className="btn-add-ingredient" onClick={() => onAdd(newIngredient)}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <hr />
      <table className="ingredient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Other Description</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.key}>
              <td><input type="text"
                value={ingredient.name}
                onChange={(e) => onUpdate({ ...ingredient, name: e.target.value })} /></td>
              <td>
                <input type="number"
                  value={ingredient.quantity}
                  onChange={(e) => onUpdate({ ...ingredient, quantity: parseInt(e.target.value) })} />
              </td>
              <td>
                <select
                  value={ingredient.unit}
                  onChange={(e) => onUpdate({ ...ingredient, unit: e.target.value })}>
                  {units.map((unit, index) => <option key={index}>{unit}</option>)}
                </select>
              </td>
              <td>
                <input type="text"
                  disabled={ingredient.unit !== "Other"}
                  value={ingredient.otherUnitDescription || ""}
                  onChange={(e) => onUpdate({ ...ingredient, otherUnitDescription: e.target.value })} />
              </td>
              <td>
                <button type="button" onClick={() => onDelete(ingredient.key)}>
                  <i className="fa-regular fa-trash-can" aria-hidden="true"></i>
                </button>
              </td>
            </tr>))}
        </tbody>
      </table>
    </>
  );
}

export default Recipes;
export { Recipe, RecipeForm };