import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  async function searchRecipes() {
    if (!search.trim()) {
      setError("Please enter a food name!");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedRecipe(null);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError("No recipes found!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function getIngredients(recipe) {
    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

    return ingredients;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🍽️ Recipe Finder</h1>
        <p>Find delicious recipes for your favourite food!</p>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search recipes... (e.g. chicken)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchRecipes();
          }}
        />

        <button onClick={searchRecipes}>
          Search
        </button>
      </div>

      {loading && <h2>Loading recipes...</h2>}

      {error && <p className="error">{error}</p>}

      <div className="recipe-container">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.idMeal}>
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
            />

            <div className="recipe-info">
              <h2>{recipe.strMeal}</h2>

              <p>
                🌍 {recipe.strArea || "Various"} Cuisine
              </p>

              <p>
                🍴 {recipe.strCategory}
              </p>

              <button
                onClick={() => setSelectedRecipe(recipe)}
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="recipe-details">
          <button
            className="close-btn"
            onClick={() => setSelectedRecipe(null)}
          >
            ✖ Close
          </button>

          <h1>{selectedRecipe.strMeal}</h1>

          <img
            src={selectedRecipe.strMealThumb}
            alt={selectedRecipe.strMeal}
          />

          <h2>Ingredients</h2>

          <ul>
            {getIngredients(selectedRecipe).map(
              (ingredient, index) => (
                <li key={index}>{ingredient}</li>
              )
            )}
          </ul>

          <h2>Instructions</h2>

          <p className="instructions">
            {selectedRecipe.strInstructions}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;