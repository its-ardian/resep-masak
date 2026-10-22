// Thin localStorage wrapper. The app is client-only: no backend, no accounts.
const KEYS = {
  favorites: "devina.favorites",
  mealPlan: "devina.mealPlan",
  groceryChecked: "devina.groceryChecked",
  extraGrocery: "devina.extraGrocery",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable (private browsing)
  }
}

export const storage = { KEYS, read, write };
