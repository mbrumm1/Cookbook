import { Outlet } from 'react-router-dom'
import './App.css'
import Recipes from './recipes/Recipes'

function App() {
  return (
    <>
      <div className="main">
        <Recipes />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default App
