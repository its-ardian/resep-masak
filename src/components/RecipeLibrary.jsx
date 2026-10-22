import { useMemo, useState } from "react";
import RecipeCard from "./RecipeCard";
import { filterRecipes } from "../lib/recipes";
import { GROUP_OPTIONS } from "../lib/categories";
import { SearchIcon } from "./Icons";

export default function RecipeLibrary({ favoriteIds, onToggleFavorite, onOpenRecipe }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");

  const results = useMemo(
    () => filterRecipes({ query, group: group || null }),
    [query, group]
  );

  return (
    <div>
      <div className="search-wrap">
        <SearchIcon className="search-icon" />
        <input
          className="search-input"
          placeholder="Cari resep atau bahan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={`select-pill${group ? " has-value" : ""}`} style={{ marginBottom: 14 }}>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          aria-label="Filter kelompok bahan"
        >
          <option value="">Semua kelompok bahan</option>
          {GROUP_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="font-display">Tidak ada resep ditemukan</div>
          <div>Coba kata kunci lain atau pilih kelompok bahan yang berbeda.</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)", marginBottom: 8 }}>
            {results.length} resep
          </div>
          {results.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              isFavorite={favoriteIds.includes(r.id)}
              onToggleFavorite={() => onToggleFavorite(r.id)}
              onClick={() => onOpenRecipe(r.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}