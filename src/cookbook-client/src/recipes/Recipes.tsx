import { useEffect, useState } from "react";
import { Form, Link, useLoaderData } from "react-router-dom";

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

export async function recipesLoader(): Promise<Recipe[]> {
  const response = await fetch("https://localhost:4000/recipes", { method: "GET" });
  const recipes = await response.json();
  return recipes;
}

export default function Recipes() {
  const recipes = useLoaderData() as Recipe[];

  return (
    <div className="side-nav">
      <h1>Recipes</h1>
      <nav>
        {recipes.map((recipe) => (
          <ul key={recipe.id}>
            <li><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></li>
          </ul>
        ))}
      </nav>
    </div>
  )
}

export async function recipeLoader({ params }: any): Promise<Recipe> {
  const response = await fetch(`https://localhost:4000/recipes/${params.recipeId}`, { method: "GET" });
  const recipe = await response.json();
  return recipe;
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
        <div className="recipe-menu">
          <Form action="edit">
            <button type="submit" className="btn-edit">Edit</button>
          </Form>
          <div>
            <button type="button" className="btn-delete">Delete</button>
          </div>
        </div>
      </div>
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

enum EditSection {
  Ingredients,
  Instructions
}

export function EditRecipe() {
  const recipe = useLoaderData() as Recipe;
  const keyedIngredients = recipe.ingredients.map((ingredient, index) => ({ key: index, ...ingredient }));
  const keyedInstructions = recipe.instructions.map((instruction, index) => ({ key: index, text: instruction }));
  const [recipeState, setRecipeState] = useState<EditRecipeViewModel>({
    ...recipe,
    ingredients: keyedIngredients,
    instructions: keyedInstructions
  });
  const [ingredientKey, setIngredientKey] = useState(recipeState.ingredients.length - 1);
  const [instructionKey, setInstructionKey] = useState(recipeState.instructions.length - 1);
  const [units, setUnits] = useState<string[]>([]);
  const [editSection, setEditSection] = useState<EditSection>(EditSection.Ingredients);
  const [instructionsVisible, setInstructionsVisible] = useState<boolean>(true);

  async function fetchUnits() {
    const response = await fetch("https://localhost:4000/units");
    setUnits(await response.json());
  }

  useEffect(() => {
    fetchUnits();
  }, []);

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

  function handleAddInstruction(newInstruction: EditInstructionViewModel): void {
    const newKey = instructionKey + 1;
    newInstruction.key = newKey;
    setRecipeState({
      ...recipeState,
      instructions: [...recipeState.instructions, { ...newInstruction }]
    });
    setInstructionKey(newKey);
  }

  function handleUpdateInstruction(updatedInstruction: EditInstructionViewModel): void {
    setRecipeState({
      ...recipeState,
      instructions: recipeState.instructions.map(
        (instruction) => {
          if (instruction.key === updatedInstruction.key) {
            return updatedInstruction;
          } else {
            return instruction;
          }
        }
      )
    });
  }

  function handleDeleteInstruction(key: number): void {
    setRecipeState({
      ...recipeState,
      instructions: recipeState.instructions.filter((instruction) => instruction.key !== key)
    })
  }

  return (
    <form id="edit-recipe-form">
      <div className="edit-recipe-name input-group">
        <input id="recipe-name"
          value={recipeState.name}
          onChange={(e) => setRecipeState({ ...recipeState, name: e.target.value })} />
      </div>
      <div className="tabs">
        <div className={instructionsVisible ? "active" : "inactive"} 
          onClick={() => setInstructionsVisible(true)}>
          <h3>Ingredients</h3>
        </div>
        <div className={instructionsVisible ? "inactive" : "active"}
          onClick={() => setInstructionsVisible(false)}>
          <h3>Instructions</h3>
        </div>
      </div>
      {instructionsVisible ?
        <>
          <AddIngredient units={units} onAdd={handleAddIngredient} />
          <hr />
          <EditIngredientList
            units={units}
            ingredients={recipeState.ingredients}
            onUpdate={handleUpdateIngredient}
            onDelete={handleDeleteIngredient} />
        </> :
        <>
          <AddInstruction onAdd={handleAddInstruction} />
          <hr />
          <EditInstructionList
            instructions={recipeState.instructions}
            onUpdate={handleUpdateInstruction}
            onDelete={handleDeleteInstruction} />
        </>}
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

interface AddIngredientProps {
  units: string[];
  onAdd: (ingredient: EditIngredientViewModel) => void;
}

export function AddIngredient({ units, onAdd }: AddIngredientProps) {
  const emptyIngredient: EditIngredientViewModel = {
    key: 0,
    name: "",
    quantity: 0,
    unit: "",
    otherUnitDescription: ""
  };
  const [newIngredient, setNewIngredient] = useState<EditIngredientViewModel>(emptyIngredient);

  function handleAdd(newIngredient: EditIngredientViewModel): void {
    onAdd(newIngredient);
    setNewIngredient(emptyIngredient);
  }

  return (
    <div className="add-ingredient-inputs">
      <div className="input-group">
        <label>Name</label>
        <input type="text"
          className="name-input"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} />
      </div>
      <div className="input-group">
        <label>Quantity</label>
        <input type="number"
          className="quantity-input"
          value={newIngredient.quantity}
          onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseInt(e.target.value) })} />
      </div>
      <div className="input-group">
        <label>Unit</label>
        <select
          className="unit-input"
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}>
          {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
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
        <button type="button" className="btn-add-ingredient" onClick={() => handleAdd(newIngredient)}>
          <i className="fa-solid fa-circle-plus"></i>
        </button>
      </div>
    </div>
  );
}

interface EditIngredientListProps {
  units: string[];
  ingredients: EditIngredientViewModel[];
  onUpdate: (ingredient: EditIngredientViewModel) => void;
  onDelete: (key: number) => void;
};

export function EditIngredientList({ units, ingredients, onUpdate, onDelete }: EditIngredientListProps) {
  return (
    <>
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
                  {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
                </select>
              </td>
              <td>
                {ingredient.unit === "Other" && <input type="text"
                  disabled={ingredient.unit !== "Other"}
                  value={ingredient.otherUnitDescription || ""}
                  onChange={(e) => onUpdate({ ...ingredient, otherUnitDescription: e.target.value })} />}
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

interface AddInstructionProps {
  onAdd: (instruction: EditInstructionViewModel) => void;
}

export function AddInstruction({ onAdd }: AddInstructionProps) {
  const emptyInstruction: EditInstructionViewModel = { key: 0, text: "" };
  const [instruction, setInstruction] = useState<EditInstructionViewModel>(emptyInstruction);

  return (
    <div className="add-instruction-inputs">
      <div className="input-group">
        <input type="text"
          value={instruction.text}
          onChange={(e) => setInstruction({ ...instruction, text: e.target.value })} />
      </div>
      <button type="button" className="btn-add-instruction"
        onClick={() => onAdd(instruction)}>
        <i className="fa-solid fa-circle-plus"></i>
      </button>
    </div>
  );
}

interface EditInstructionListProps {
  instructions: EditInstructionViewModel[];
  onUpdate: (instruction: EditInstructionViewModel) => void;
  onDelete: (key: number) => void;
}

export function EditInstructionList({ instructions, onUpdate, onDelete }: EditInstructionListProps) {
  return (
    <ul className="instruction-inputs">
      {instructions.map((instruction) => (
        <li key={instruction.key}>
          <input className="instruction-input" type="text"
            value={instruction.text}
            onChange={(e) => onUpdate({ ...instruction, text: e.target.value })} />
          <button type="button" className="btn-delete-item" onClick={() => onDelete(instruction.key)}>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </li>
      ))}
    </ul>
  )
}