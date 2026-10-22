import { useEffect, useState } from "react";
import { storage } from "./lib/storage";
import { findRecipe, ingredientLines } from "./lib/recipes";

import BottomNav from "./components/BottomNav";
import RecipeLibrary from "./components/RecipeLibrary";
import RecipeDetail from "./components/RecipeDetail";
import FavoritesList from "./components/FavoritesList";
import MealPlanner from "./components/MealPlanner";
import GroceryList from "./components/GroceryList";

const TAB_META = {
  recipes: { title: "Resep ala Chef Devina", subtitle: "Koleksi resep dari channel YouTube-nya" },
  favorites: { title: "Favorit", subtitle: "Resep yang kamu simpan" },
  planner: { title: "Rencana Makan", subtitle: "Susun menu seminggu ke depan" },
  grocery: { title: "Daftar Belanja", subtitle: "Dari rencana dan resep yang ditambahkan" },
};

export default function App() {
  const [tab, setTab] = useState("recipes");
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [pendingPlanId, setPendingPlanId] = useState(null);

  const [favorites, setFavorites] = useState(() => storage.read(storage.KEYS.favorites, []));
  const [mealPlan, setMealPlan] = useState(() => storage.read(storage.KEYS.mealPlan, {}));
  const [groceryChecked, setGroceryChecked] = useState(() => storage.read(storage.KEYS.groceryChecked, {}));
  const [extraGrocery, setExtraGrocery] = useState(() => storage.read(storage.KEYS.extraGrocery, {}));

  useEffect(() => storage.write(storage.KEYS.favorites, favorites), [favorites]);
  useEffect(() => storage.write(storage.KEYS.mealPlan, mealPlan), [mealPlan]);
  useEffect(() => storage.write(storage.KEYS.groceryChecked, groceryChecked), [groceryChecked]);
  useEffect(() => storage.write(storage.KEYS.extraGrocery, extraGrocery), [extraGrocery]);

  function toggleFavorite(recipeId) {
    setFavorites((f) => (f.includes(recipeId) ? f.filter((id) => id !== recipeId) : [...f, recipeId]));
  }

  function addToGrocery(recipe) {
    setExtraGrocery((g) => ({ ...g, [recipe.id]: { title: recipe.title, items: ingredientLines(recipe) } }));
  }

  function removeExtraGrocery(recipeId) {
    setExtraGrocery((g) => {
      const next = { ...g };
      delete next[recipeId];
      return next;
    });
  }

  function goToTab(key) {
    setTab(key);
    setOpenRecipeId(null);
  }

  const openRecipe = openRecipeId ? findRecipe(openRecipeId) : null;
  const meta = TAB_META[tab];

  const groceryCount = (() => {
    const ids = new Set(Object.values(mealPlan).flatMap((day) => Object.values(day || {})));
    Object.keys(extraGrocery).forEach((id) => ids.add(id));
    return ids.size;
  })();

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1 className="app-title">{openRecipe ? "Detail Resep" : meta.title}</h1>
        <div className="app-subtitle">{openRecipe ? "Bahan dan cara membuat" : meta.subtitle}</div>
      </div>

      <div className="app-content">
        {openRecipe ? (
          <RecipeDetail
            recipe={openRecipe}
            isFavorite={favorites.includes(openRecipe.id)}
            onToggleFavorite={() => toggleFavorite(openRecipe.id)}
            onBack={() => setOpenRecipeId(null)}
            onAddToPlan={() => {
              setPendingPlanId(openRecipe.id);
              setTab("planner");
              setOpenRecipeId(null);
            }}
            onAddToGrocery={() => addToGrocery(openRecipe)}
          />
        ) : tab === "recipes" ? (
          <RecipeLibrary
            favoriteIds={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenRecipe={setOpenRecipeId}
          />
        ) : tab === "favorites" ? (
          <FavoritesList
            favoriteIds={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenRecipe={setOpenRecipeId}
          />
        ) : tab === "planner" ? (
          <MealPlanner
            mealPlan={mealPlan}
            onChangeMealPlan={setMealPlan}
            pendingRecipeId={pendingPlanId}
            onConsumePending={() => setPendingPlanId(null)}
          />
        ) : (
          <GroceryList
            mealPlan={mealPlan}
            extraGrocery={extraGrocery}
            checked={groceryChecked}
            onChangeChecked={setGroceryChecked}
            onRemoveExtra={removeExtraGrocery}
            onClearAll={() => {
              if (confirm("Kosongkan rencana makan dan seluruh daftar belanja?")) {
                setMealPlan({});
                setExtraGrocery({});
                setGroceryChecked({});
              }
            }}
          />
        )}
      </div>

      <BottomNav active={tab} onChange={goToTab} groceryCount={groceryCount} />
    </div>
  );
}
