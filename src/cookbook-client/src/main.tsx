import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { appLoader } from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Recipe, deleteRecipeAction, recipeLoader, recipesLoader } from './recipes/Recipes.tsx';
import EditRecipe, { editRecipeAction } from './recipes/EditRecipe.tsx';
import CreateRecipe, { createRecipeAction } from './recipes/CreateRecipe.tsx';
import RecipeIndex from './recipes/RecipeIndex.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    children: [
      {
        index: true,
        element: <RecipeIndex />
      },
      {
        path: "recipes/:recipeId",
        element: <Recipe />,
        loader: recipeLoader
      },
      {
        path: "recipes/create",
        element: <CreateRecipe />,
        action: createRecipeAction
      },
      {
        path: "recipes/:recipeId/edit",
        element: <EditRecipe />,
        loader: recipeLoader,
        action: editRecipeAction
      },
      {
        path: "recipes/:recipeId/delete",
        action: deleteRecipeAction
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
