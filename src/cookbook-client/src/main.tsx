import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { EditRecipe, Recipe, recipeLoader, recipesLoader } from './recipes/Recipes.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: recipesLoader,
    children: [
      {
        path: "/recipes/:recipeId",
        element: <Recipe />,
        loader: recipeLoader
      },
      {
        path: "recipes/:recipeId/edit",
        element: <EditRecipe />,
        loader: recipeLoader
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
