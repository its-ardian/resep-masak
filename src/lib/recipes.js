import data from "../data/recipes.json";
import { groupsOf, GROUP_OPTIONS } from "./categories";

export const ALL_RECIPES = data;
export { GROUP_OPTIONS, groupsOf };

const BY_ID = new Map(ALL_RECIPES.map((r) => [r.id, r]));

export function findRecipe(id) {
  return BY_ID.get(id) || null;
}

export function ingredientLines(recipe) {
  const lines = [];
  for (const group of recipe.ingredient_groups || []) {
    for (const item of group.items || []) lines.push(item);
  }
  return lines;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function filterRecipes({ query, group }) {
  let list = ALL_RECIPES;

  if (group) {
    list = list.filter((r) => groupsOf(r).includes(group));
  }

  const words = (query || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return list;

  const matches = list.filter((r) => {
    const text = (r.title + " " + ingredientLines(r).join(" ")).toLowerCase();
    return words.every((w) => text.includes(w));
  });

  // Resep yang judulnya cocok tampil lebih dulu
  const inTitle = (r) => words.every((w) => r.title.toLowerCase().includes(w));
  return matches.sort((a, b) => Number(inTitle(b)) - Number(inTitle(a)));
}
