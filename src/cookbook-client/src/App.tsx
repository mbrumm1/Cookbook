import { Outlet } from 'react-router-dom'
import './App.css'
import Recipes, { Recipe } from './recipes/Recipes'

function App() {
  return (
    <>
      <div className="main">
        <Recipes />
        <Outlet />
      </div>
    </>
  )
}

export default App
