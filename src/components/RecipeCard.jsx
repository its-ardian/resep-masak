import { HeartIcon } from "./Icons";
import { groupsOf, formatDate } from "../lib/recipes";
import { GROUP_OPTIONS } from "../lib/categories";

const LABEL = Object.fromEntries(GROUP_OPTIONS.map((o) => [o.key, o.label]));

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onClick }) {
  const groups = groupsOf(recipe).slice(0, 3);

  return (
    <div
      className="recipe-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <div className="recipe-card-body">
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-meta-row">
          <span className="badge">{formatDate(recipe.date)}</span>
          {groups.map((g) => (
            <span className="badge kkal" key={g}>
              {LABEL[g]}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`card-fav${isFavorite ? " active" : ""}`}
        aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <HeartIcon filled={isFavorite} style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}
