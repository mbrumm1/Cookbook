import { Form, NavLink, Outlet, useLoaderData } from 'react-router-dom'
import './App.css'
import { Recipe } from './recipes/Recipes'
import config from './config';

export async function appLoader(): Promise<Recipe[]> {
  const response = await fetch(`${config.baseUrl}/recipes`, { method: "GET" });
  const recipes = await response.json();
  return recipes;
}

function App() {
  const recipes = useLoaderData() as Recipe[];

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h1>Recipes</h1>
        <Form action="recipes/create">
          <button type="submit" className="btn-light btn-block">Add</button>
        </Form>
        <nav>
          <ul className="nav-list">
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
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
