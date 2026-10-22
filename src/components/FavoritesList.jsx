import RecipeCard from "./RecipeCard";
import { findRecipe } from "../lib/recipes";

export default function FavoritesList({ favoriteIds, onToggleFavorite, onOpenRecipe }) {
  const recipes = favoriteIds.map((id) => findRecipe(id)).filter(Boolean);

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="font-display">Belum ada favorit</div>
        <div>Tekan ikon hati di resep untuk menyimpannya di sini.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)", marginBottom: 8 }}>
        {recipes.length} resep favorit
      </div>
      {recipes.map((r) => (
        <RecipeCard
          key={r.id}
          recipe={r}
          isFavorite
          onToggleFavorite={() => onToggleFavorite(r.id)}
          onClick={() => onOpenRecipe(r.id)}
        />
      ))}
    </div>
  );
}
