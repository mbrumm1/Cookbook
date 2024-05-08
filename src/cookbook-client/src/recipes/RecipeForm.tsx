import { useEffect, useState } from "react";
import { Recipe, Ingredient, Instruction } from "./Recipes";
import config from "../config";
import { FormMethod, useSubmit } from "react-router-dom";
import { FieldError, SubmitHandler, useFieldArray, useForm } from "react-hook-form";

// export interface EditRecipeViewModel {
//   id: number;
//   name: string;
//   ingredients: EditIngredientViewModel[];
//   instructions: EditInstructionViewModel[];
// }

// interface EditInstructionViewModel {
//   key: number;
//   text: string;
// }

// interface RecipeFormProps {
//   recipe: Recipe;
//   method: FormMethod;
// }

// export default function RecipeForm({ recipe, method }: RecipeFormProps) {
//   const keyedIngredients = recipe.ingredients.map((ingredient, index) => ({ key: index, ...ingredient }));
//   const keyedInstructions = recipe.instructions.map((instruction, index) => ({ key: index, text: instruction }));
//   const [recipeState, setRecipeState] = useState<EditRecipeViewModel>({
//     ...recipe,
//     ingredients: keyedIngredients,
//     instructions: keyedInstructions
//   });
//   const [ingredientKey, setIngredientKey] = useState(recipeState.ingredients.length - 1);
//   const [instructionKey, setInstructionKey] = useState(recipeState.instructions.length - 1);
//   const [units, setUnits] = useState<string[]>([]);
//   const [instructionsVisible, setInstructionsVisible] = useState<boolean>(true);
//   const submit = useSubmit();

//   async function fetchUnits() {
//     const response = await fetch(`${config.baseUrl}/units`);
//     setUnits(await response.json());
//   }

//   useEffect(() => {
//     fetchUnits();
//   }, []);

//   function handleAddIngredient(addedIngredient: EditIngredientViewModel): void {
//     console.log(ingredientKey);
//     const newKey = ingredientKey + 1;
//     addedIngredient.key = newKey;
//     setRecipeState({
//       ...recipeState,
//       ingredients: [...recipeState.ingredients, { ...addedIngredient }]
//     });
//     setIngredientKey(newKey);
//   }

//   function handleUpdateIngredient(updatedIngredient: EditIngredientViewModel): void {
//     setRecipeState(recipe => ({
//       ...recipe,
//       ingredients: recipe.ingredients.map((ingredient) => {
//         if (ingredient.key === updatedIngredient.key) {
//           return updatedIngredient;
//         } else {
//           return ingredient;
//         }
//       })
//     }));
//   }

//   function handleDeleteIngredient(key: number): void {
//     setRecipeState({
//       ...recipeState,
//       ingredients: recipeState.ingredients.filter((ingredient) => ingredient.key !== key)
//     });
//   }

//   function handleAddInstruction(newInstruction: EditInstructionViewModel): void {
//     const newKey = instructionKey + 1;
//     newInstruction.key = newKey;
//     setRecipeState({
//       ...recipeState,
//       instructions: [...recipeState.instructions, { ...newInstruction }]
//     });
//     setInstructionKey(newKey);
//   }

//   function handleUpdateInstruction(updatedInstruction: EditInstructionViewModel): void {
//     setRecipeState({
//       ...recipeState,
//       instructions: recipeState.instructions.map(
//         (instruction) => {
//           if (instruction.key === updatedInstruction.key) {
//             return updatedInstruction;
//           } else {
//             return instruction;
//           }
//         }
//       )
//     });
//   }

//   function handleDeleteInstruction(key: number): void {
//     setRecipeState({
//       ...recipeState,
//       instructions: recipeState.instructions.filter((instruction) => instruction.key !== key)
//     })
//   }

//   function handleSubmit(model: EditRecipeViewModel, method: FormMethod) {
//     const recipe: Recipe = {
//       id: model.id,
//       name: model.name,
//       ingredients: model.ingredients.map((ingredient) => ({
//         name: ingredient.name,
//         quantity: ingredient.quantity,
//         unit: ingredient.unit,
//         otherUnitDescription: ingredient.otherUnitDescription
//       })),
//       instructions: model.instructions.map((instruction) => instruction.text)
//     }
//     submit(recipe as any, { method: method, encType: "application/json" });
//   }

//   return (
//     <form id="edit-recipe-form">
//       <div className="edit-recipe-name input-group">
//         <input id="recipe-name"
//           placeholder="Recipe Name"
//           value={recipeState.name}
//           required
//           onChange={(e) => setRecipeState({ ...recipeState, name: e.target.value })} />
//       </div>
//       <div className="tabs">
//         <div className={instructionsVisible ? "active" : "inactive"}
//           onClick={() => setInstructionsVisible(true)}>
//           <h3>Ingredients</h3>
//         </div>
//         <div className={instructionsVisible ? "inactive" : "active"}
//           onClick={() => setInstructionsVisible(false)}>
//           <h3>Instructions</h3>
//         </div>
//       </div>
//       {instructionsVisible ?
//         <>
//           <EditIngredientList
//             units={units}
//             ingredients={recipeState.ingredients}
//             onAdd={handleAddIngredient}
//             onUpdate={handleUpdateIngredient}
//             onDelete={handleDeleteIngredient} />
//         </> :
//         <>
//           <EditInstructionList
//             instructions={recipeState.instructions}
//             onAdd={handleAddInstruction}
//             onUpdate={handleUpdateInstruction}
//             onDelete={handleDeleteInstruction} />
//         </>}
//       <div className="recipe-menu">
//         <button
//           type="button"
//           className="btn-dark btn-submit-recipe"
//           onClick={() => handleSubmit(recipeState, method)}>Submit</button>
//       </div>
//     </form>
//   )
// }

// interface EditIngredientViewModel {
//   key: number;
//   name: string;
//   quantity: number;
//   unit: string;
//   otherUnitDescription?: string;
// }

// interface AddIngredientRowProps {
//   units: string[];
//   onAdd: (ingredient: EditIngredientViewModel) => void;
// }

// function AddIngredientRow({ units, onAdd }: AddIngredientRowProps) {
//   const emptyIngredient: EditIngredientViewModel = {
//     key: 0,
//     name: "",
//     quantity: 0,
//     unit: "Cup",
//     otherUnitDescription: ""
//   };
//   const [ingredient, setIngredient] = useState<EditIngredientViewModel>(emptyIngredient);

//   function handleAdd(ingredient: EditIngredientViewModel): void {
//     console.log(ingredient);
//     onAdd(ingredient);
//     setIngredient(emptyIngredient);
//   }

//   return (
//     <tr className="add-ingredient-row">
//       <td><input type="text"
//         value={ingredient.name}
//         placeholder="Ingredient"
//         onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })} /></td>
//       <td>
//         <input type="number"
//           value={ingredient.quantity}
//           onChange={(e) => setIngredient({ ...ingredient, quantity: parseInt(e.target.value) })} />
//       </td>
//       <td>
//         <select
//           value={ingredient.unit}
//           onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}>
//           {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
//         </select>
//       </td>
//       <td>
//         {ingredient.unit === "Other" && <input type="text"
//           disabled={ingredient.unit !== "Other"}
//           value={ingredient.otherUnitDescription || ""}
//           onChange={(e) => setIngredient({ ...ingredient, otherUnitDescription: e.target.value })} />}
//       </td>
//       <td>
//         <button type="button" className="btn-dark btn-block" onClick={() => handleAdd(ingredient)}>Add</button>
//       </td>
//     </tr>
//   );
// }

// interface EditIngredientListProps {
//   units: string[];
//   ingredients: EditIngredientViewModel[];
//   onAdd: (ingredient: EditIngredientViewModel) => void;
//   onUpdate: (ingredient: EditIngredientViewModel) => void;
//   onDelete: (key: number) => void;
// };

// function EditIngredientList({ units, ingredients, onAdd, onUpdate, onDelete }: EditIngredientListProps) {
//   return (
//     <>
//       <table className="ingredient-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Quantity</th>
//             <th>Unit</th>
//             <th>Other Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           <AddIngredientRow units={units} onAdd={onAdd} />
//           {ingredients.map((ingredient) => (
//             <tr key={ingredient.key}>
//               <td><input type="text"
//                 value={ingredient.name}
//                 onChange={(e) => onUpdate({ ...ingredient, name: e.target.value })} /></td>
//               <td>
//                 <input type="number"
//                   value={ingredient.quantity}
//                   onChange={(e) => onUpdate({ ...ingredient, quantity: parseInt(e.target.value) })} />
//               </td>
//               <td>
//                 <select
//                   value={ingredient.unit}
//                   onChange={(e) => onUpdate({ ...ingredient, unit: e.target.value })}>
//                   {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
//                 </select>
//               </td>
//               <td>
//                 {ingredient.unit === "Other" && <input type="text"
//                   disabled={ingredient.unit !== "Other"}
//                   value={ingredient.otherUnitDescription || ""}
//                   onChange={(e) => onUpdate({ ...ingredient, otherUnitDescription: e.target.value })} />}
//               </td>
//               <td>
//                 <button type="button" className="btn-transparent btn-small" onClick={() => onDelete(ingredient.key)}>
//                   <i className="fa-regular fa-trash-can" aria-hidden="true"></i>
//                 </button>
//               </td>
//             </tr>))}
//         </tbody>
//       </table>
//     </>
//   );
// }

// interface AddInstructionProps {
//   onAdd: (instruction: EditInstructionViewModel) => void;
// }

// function AddInstruction({ onAdd }: AddInstructionProps) {
//   const emptyInstruction: EditInstructionViewModel = { key: 0, text: "" };
//   const [instruction, setInstruction] = useState<EditInstructionViewModel>(emptyInstruction);

//   function handleAdd(instruction: EditInstructionViewModel): void {
//     onAdd(instruction);
//     setInstruction(emptyInstruction);
//   }

//   return (
//     <li key={instruction.key} className="add-instruction-row instruction-item">
//       <input className="instruction-input" type="text"
//         value={instruction.text}
//         onChange={(e) => setInstruction({ ...instruction, text: e.target.value })} />
//       <button type="button" className="btn-add-instruction btn-dark" onClick={() => handleAdd(instruction)}>Add</button>
//     </li>
//   );
// }

// interface EditInstructionListProps {
//   instructions: EditInstructionViewModel[];
//   onAdd: (instruction: EditInstructionViewModel) => void;
//   onUpdate: (instruction: EditInstructionViewModel) => void;
//   onDelete: (key: number) => void;
// }

// function EditInstructionList({ instructions, onAdd, onUpdate, onDelete }: EditInstructionListProps) {
//   return (
//     <ul className="instruction-inputs">
//       <AddInstruction onAdd={onAdd} />
//       {instructions.map((instruction) => (
//         <li key={instruction.key} className="instruction-item">
//           <input className="instruction-input" type="text"
//             value={instruction.text}
//             onChange={(e) => onUpdate({ ...instruction, text: e.target.value })} />
//           <button type="button" className="btn-delete-item btn-transparent btn-small" onClick={() => onDelete(instruction.key)}>
//             <i className="fa-regular fa-trash-can"></i>
//           </button>
//         </li>
//       ))}
//     </ul>
//   )
// }

interface RecipeHookFormProps {
  recipe: Recipe
}

export function RecipeHookForm({ recipe }: RecipeHookFormProps) {
  const [ingredientsVisible, setIngredientsVisible] = useState<boolean>(true);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: recipe
  });
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "ingredients" });
  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({ control, name: "instructions" });
  const onSubmit: SubmitHandler<Recipe> = (data) => console.log(data);
  //const submit = useSubmit();
  const [units, setUnits] = useState<string[]>([]);

  async function fetchUnits() {
    const response = await fetch(`${config.baseUrl}/units`);
    setUnits(await response.json());
  }

  useEffect(() => {
    fetchUnits();
  }, []);

  const emptyIngredient: Ingredient = { name: "", quantity: 0, unit: "Cup" };
  const [newIngredient, setNewIngredient] = useState<Ingredient>(emptyIngredient);
  const emptyInstruction: Instruction = { text: "" };
  const [newInstruction, setNewInstruction] = useState<Instruction>(emptyInstruction);

  function handleAddIngredient(ingredient: Ingredient): void {
    appendIngredient(ingredient);
    setNewIngredient(emptyIngredient);
  }

  function handleAddInstruction(instruction: Instruction): void {
    appendInstruction(instruction);
    setNewInstruction(emptyInstruction);
  }

  return (
    <form id="edit-recipe-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="edit-recipe-name input-group w-50">
        <InputError fieldError={errors.name} />
        <input id="recipe-name"
          placeholder="Recipe Name"
          {...register("name", {
            required: "required",
            maxLength: { value: 500, message: "cannot be more than 500 characters." }
          })} />
      </div>
      <div className="tabs">
        <div className={ingredientsVisible ? "active" : "inactive"}
          onClick={() => setIngredientsVisible(true)}>
          <h3>Ingredients</h3>
        </div>
        <div className={ingredientsVisible ? "inactive" : "active"}
          onClick={() => setIngredientsVisible(false)}>
          <h3>Instructions</h3>
        </div>
      </div>
      {ingredientsVisible ?
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
              <tr className="add-ingredient-row">
                <td><input type="text"
                  value={newIngredient.name}
                  placeholder="Ingredient"
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} /></td>
                <td>
                  <input type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseInt(e.target.value) })} />
                </td>
                <td>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}>
                    {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
                  </select>
                </td>
                <td>
                  {newIngredient.unit === "Other" && <input type="text"
                    disabled={newIngredient.unit !== "Other"}
                    value={newIngredient.otherUnitDescription || ""}
                    onChange={(e) => setNewIngredient({ ...newIngredient, otherUnitDescription: e.target.value })} />}
                </td>
                <td>
                  <button type="button" className="btn-dark btn-block" onClick={() => handleAddIngredient(newIngredient)}>Add</button>
                </td>
              </tr>
              {ingredientFields.map((ingredient, index) => (
                <tr key={ingredient.id}>
                  <td>
                    <div className="input-group">
                      <InputError fieldError={errors.ingredients?.[index]?.name} />
                      <input type="text"
                        {...register(`ingredients.${index}.name`, {
                          required: "required",
                          maxLength: { value: 250, message: "cannot be more than 250 characters" }
                        })} />
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <InputError fieldError={errors.ingredients?.[index]?.quantity} />
                      <input type="number"
                        {...register(`ingredients.${index}.quantity`, {
                          min: { value: 1, message: "must be between 1 and 99" },
                          max: { value: 99, message: "must be between 1 and 99" }
                        })} />
                    </div>
                  </td>
                  <td>
                    <select {...register(`ingredients.${index}.unit`)}>
                      {units.map((unit, index) => <option key={index} value={unit}>{unit}</option>)}
                    </select>
                  </td>
                  <td>
                    {ingredient.unit === "Other" &&
                      <input type="text"
                        disabled={ingredient.unit !== "Other"}
                        {...register(`ingredients.${index}.otherUnitDescription`)} />}
                  </td>
                  <td>
                    <button type="button" className="btn-transparent btn-small" onClick={() => removeIngredient(index)}>
                      <i className="fa-regular fa-trash-can" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </> :
        <>
          <ul className="instruction-inputs">
            <li className="add-instruction-row instruction-item">
              <input className="instruction-input" type="text"
                value={newInstruction.text}
                onChange={(e) => setNewInstruction({ ...newInstruction, text: e.target.value })} />
              <button type="button" className="btn-add-instruction btn-dark" onClick={() => handleAddInstruction(newInstruction)}>Add</button>
            </li>
            {instructionFields.map((instruction, index) => (
              <li key={instruction.id} className="instruction-item">
                <div className="input-group">
                  <InputError fieldError={errors.instructions?.[index]?.text} />
                  <input className="instruction-input" type="text"
                    {...register(`instructions.${index}.text`, {
                      required: "required",
                      maxLength: { value: 1000, message: "cannot be more than 1000 characters" }
                    })} />
                </div>
                <button type="button" className="btn-delete-item btn-transparent btn-small" onClick={() => removeInstruction(index)}>
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </li>
            ))}
          </ul>
        </>}
      <div className="recipe-menu">
        <button
          type="submit"
          className="btn-dark btn-submit-recipe">Submit</button>
      </div>
    </form>
  );
}

interface InputErrorProps {
  fieldError?: FieldError;
}

function InputError({ fieldError }: InputErrorProps) {
  return (
    <>
      {fieldError &&
        <i
          className="fa-solid fa-circle-exclamation error-icon"
          title={fieldError?.message}></i>}
    </>
  );
}