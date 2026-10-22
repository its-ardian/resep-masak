import { useMemo } from "react";
import { findRecipe, ingredientLines } from "../lib/recipes";
import { TrashIcon, XIcon } from "./Icons";

export default function GroceryList({
  mealPlan,
  extraGrocery,
  checked,
  onChangeChecked,
  onRemoveExtra,
  onClearAll,
}) {
  // One block per recipe: planned recipes first, then manually added ones
  const blocks = useMemo(() => {
    const map = new Map();

    const plannedIds = new Set();
    for (const day of Object.values(mealPlan)) {
      for (const id of Object.values(day || {})) {
        if (id) plannedIds.add(id);
      }
    }
    for (const id of plannedIds) {
      const recipe = findRecipe(id);
      if (recipe) {
        map.set(id, { id, title: recipe.title, items: ingredientLines(recipe), planned: true, manual: false });
      }
    }
    for (const [id, entry] of Object.entries(extraGrocery)) {
      const existing = map.get(id);
      if (existing) {
        existing.manual = true;
      } else {
        map.set(id, { id, title: entry.title, items: entry.items, planned: false, manual: true });
      }
    }
    return Array.from(map.values());
  }, [mealPlan, extraGrocery]);

  if (blocks.length === 0) {
    return (
      <div className="empty-state">
        <div className="font-display">Daftar belanja masih kosong</div>
        <div>Tambahkan resep ke rencana makan, atau tekan "Ke belanja" di detail resep.</div>
      </div>
    );
  }

  const totalItems = blocks.reduce((n, b) => n + b.items.length, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: "0.82rem", color: "var(--color-ink-faint)" }}>
          {blocks.length} resep · {totalItems} bahan
        </div>
        <button className="btn btn-ghost" onClick={onClearAll}>
          <TrashIcon style={{ width: 14, height: 14 }} />
          Kosongkan
        </button>
      </div>

      {blocks.map((block) => (
        <div className="card" key={block.id} style={{ padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{block.title}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-ink-faint)" }}>
                {block.planned ? "Dari rencana makan" : "Ditambahkan manual"}
              </div>
            </div>
            {block.manual && (
              <button className="icon-btn" aria-label="Hapus dari belanja" onClick={() => onRemoveExtra(block.id)}>
                <XIcon style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
          {block.items.map((line, i) => {
            const k = `${block.id}:${i}`;
            const isChecked = !!checked[k];
            return (
              <label
                key={k}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", opacity: isChecked ? 0.5 : 1 }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onChangeChecked({ ...checked, [k]: !isChecked })}
                />
                <span style={{ flex: 1, fontSize: "0.92rem", textDecoration: isChecked ? "line-through" : "none" }}>
                  {line}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
