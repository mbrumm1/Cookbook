import './App.css'
import Recipes, { Recipe } from './recipes/Recipes'

function App() {
  return (
    <>
      <Recipes />
      <Recipe id={1} />
    </>
  )
}

export default App
