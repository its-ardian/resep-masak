import { useState } from "react";
import { ArrowLeftIcon, HeartIcon, PlusIcon, BagIcon } from "./Icons";
import { formatDate } from "../lib/recipes";
import { groupsOf } from "../lib/categories";

export default function RecipeDetail({
  recipe,
  isFavorite,
  onToggleFavorite,
  onBack,
  onAddToPlan,
  onAddToGrocery,
}) {
  const [addedToGrocery, setAddedToGrocery] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const groups = groupsOf(recipe);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
        <button className="icon-btn" onClick={onBack} aria-label="Kembali">
          <ArrowLeftIcon style={{ width: 18, height: 18 }} />
        </button>
        <button
          className={`icon-btn${isFavorite ? " active" : ""}`}
          onClick={onToggleFavorite}
          aria-label="Simpan ke favorit"
        >
          <HeartIcon filled={isFavorite} style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <h1 className="font-display" style={{ fontSize: "1.4rem", marginBottom: 8 }}>
        {recipe.title}
      </h1>

      <div className="recipe-meta-row" style={{ marginBottom: 6 }}>
        <span className="badge">{formatDate(recipe.date)}</span>
        {groups.map((g) => (
          <span className="badge kkal" key={g}>{g}</span>
        ))}
      </div>

      <a
        href={recipe.source}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "0.85rem", color: "var(--color-daun-dark)", fontWeight: 600 }}
      >
        ▶ Tonton videonya di YouTube
      </a>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => {
            onAddToPlan();
            setAddedToPlan(true);
          }}
        >
          <PlusIcon style={{ width: 16, height: 16 }} />
          {addedToPlan ? "Pilih hari" : "Ke rencana"}
        </button>
        <button
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={() => {
            onAddToGrocery();
            setAddedToGrocery(true);
          }}
        >
          <BagIcon style={{ width: 16, height: 16 }} />
          {addedToGrocery ? "Di belanja" : "Ke belanja"}
        </button>
      </div>

      {(recipe.ingredient_groups || []).some((g) => g.items.length) && (
        <div className="section-title">Bahan</div>
      )}
      {(recipe.ingredient_groups || []).map((group, gi) => (
        <div key={gi} className="card" style={{ padding: "12px 14px", marginBottom: 10 }}>
          {group.group && (
            <div className="ingredient-group-title" style={{ marginBottom: 6 }}>
              {group.group}
            </div>
          )}
          {group.items.map((line, ii) => (
            <div className="ingredient-row" key={ii}>
              <span>{line}</span>
            </div>
          ))}
        </div>
      ))}

      {recipe.steps?.length > 0 && <div className="section-title">Cara membuat</div>}
      {(recipe.steps || []).map((section, si) => (
        <div key={si} className="card" style={{ padding: "12px 14px", marginBottom: 10 }}>
          {section.heading && (
            <div className="ingredient-group-title" style={{ marginBottom: 6 }}>
              {section.heading}
            </div>
          )}
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: "0.92rem", lineHeight: 1.55 }}>
            {section.items.map((step, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{step}</li>
            ))}
          </ol>
        </div>
      ))}

      {recipe.notes?.length > 0 && (
        <>
          <div className="section-title">Pelengkap</div>
          <div className="card" style={{ padding: "12px 14px" }}>
            {recipe.notes.map((n, i) => (
              <div key={i} style={{ fontSize: "0.92rem", padding: "3px 0" }}>• {n}</div>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          marginTop: 20,
          fontSize: "0.75rem",
          color: "var(--color-ink-faint)",
          lineHeight: 1.5,
        }}
      >
        Resep oleh Devina Hermawan. Takaran dan langkah mengikuti video di YouTube-nya. Situs ini tidak resmi.
      </div>
    </div>
  );
}
