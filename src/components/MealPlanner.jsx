import { useMemo, useState } from "react";
import { ALL_RECIPES, findRecipe } from "../lib/recipes";

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const SLOTS = [
  { key: "pagi", label: "Pagi" },
  { key: "siang", label: "Siang" },
  { key: "malam", label: "Malam" },
];

const SORTED_RECIPES = [...ALL_RECIPES].sort((a, b) => a.title.localeCompare(b.title, "id"));

function startOfWeek(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day + offset * 7);
  return d;
}

function keyOf(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function MealPlanner({
  mealPlan,
  onChangeMealPlan,
  pendingRecipeId,
  onConsumePending,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [pendingDay, setPendingDay] = useState(null);
  const [pendingSlot, setPendingSlot] = useState("siang");

  const weekStart = useMemo(() => startOfWeek(weekOffset), [weekOffset]);
  const days = useMemo(
    () =>
      DAY_NAMES.map((name, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return { name, date: d, key: keyOf(d) };
      }),
    [weekStart]
  );

  const pendingRecipe = pendingRecipeId ? findRecipe(pendingRecipeId) : null;
  const effectivePendingDay = pendingDay || days[0].key;

  function setSlot(dayKey, slot, recipeId) {
    onChangeMealPlan((plan) => {
      const next = { ...plan };
      const day = { ...(next[dayKey] || {}) };
      if (recipeId) day[slot] = recipeId;
      else delete day[slot];
      if (Object.keys(day).length) next[dayKey] = day;
      else delete next[dayKey];
      return next;
    });
  }

  function savePending() {
    setSlot(effectivePendingDay, pendingSlot, pendingRecipeId);
    onConsumePending();
  }

  const weekLabel = `${days[0].date.getDate()}/${days[0].date.getMonth() + 1} – ${days[6].date.getDate()}/${days[6].date.getMonth() + 1}`;

  return (
    <div>
      {pendingRecipe && (
        <div className="card" style={{ padding: "14px", marginBottom: 14, borderColor: "var(--color-kunyit)" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink-soft)" }}>Tambahkan ke rencana:</div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{pendingRecipe.title}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select
              className="plan-select"
              value={effectivePendingDay}
              onChange={(e) => setPendingDay(e.target.value)}
              aria-label="Pilih hari"
            >
              {days.map((d) => (
                <option key={d.key} value={d.key}>{d.name}, {d.date.getDate()}/{d.date.getMonth() + 1}</option>
              ))}
            </select>
            <select
              className="plan-select"
              value={pendingSlot}
              onChange={(e) => setPendingSlot(e.target.value)}
              aria-label="Pilih waktu makan"
            >
              {SLOTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={savePending}>Simpan</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onConsumePending}>Batal</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <button className="btn btn-secondary" onClick={() => setWeekOffset((w) => w - 1)}>← Minggu lalu</button>
        <button className="btn btn-secondary" onClick={() => setWeekOffset((w) => w + 1)}>Minggu depan →</button>
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--color-ink-faint)", marginBottom: 6 }}>
        {weekOffset === 0 ? "Minggu ini" : weekOffset > 0 ? `${weekOffset} minggu lagi` : `${-weekOffset} minggu lalu`} · {weekLabel}
      </div>

      {days.map((day) => (
        <div key={day.key} style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ marginTop: 6 }}>
            {day.name}, {day.date.getDate()}/{day.date.getMonth() + 1}
          </div>
          {SLOTS.map((slot) => {
            const current = mealPlan[day.key]?.[slot.key] || "";
            return (
              <div key={slot.key} className="plan-row">
                <span className="plan-slot">{slot.label}</span>
                <select
                  className="plan-select"
                  value={current}
                  onChange={(e) => setSlot(day.key, slot.key, e.target.value)}
                  aria-label={`${day.name} ${slot.label}`}
                >
                  <option value="">Pilih resep…</option>
                  {SORTED_RECIPES.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
