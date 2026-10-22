// Kelompok bahan otomatis dari nama bahan di setiap resep.
// Satu resep bisa masuk beberapa kelompok (misal "Sup Cream Ayam Jagung" = Ayam + Sayur).
// `exclude` dicek per bahan, jadi "kaldu ayam" atau "telur ayam" tidak dihitung sebagai ayam.

const RULES = [
  {
    key: "ikan",
    label: "🐟 Ikan & Seafood",
    match: /\b(ikan|salmon|tuna|udang|kakap|nila|lele|kembung|gabus|teri|tenggiri|cumi|kerang|dori)\b/i,
  },
  {
    key: "ayam",
    label: "🍗 Ayam",
    match: /\bayam\b/i,
    exclude: /\b(telur|kaldu)\b/i,
  },
  {
    key: "daging",
    label: "🥩 Daging",
    match: /\b(daging|sapi)\b/i,
    exclude: /\b(ikan|ayam|udang|kelapa|buah|babi)\b/i,
  },
  {
    key: "telur",
    label: "🥚 Telur",
    match: /\b(telur|puyuh)\b/i,
  },
  {
    key: "tahu",
    label: "🧈 Tahu & Tempe",
    match: /\b(tahu|tempe|tempeh)\b/i,
  },
  {
    key: "sayur",
    label: "🥦 Sayur",
    match:
      /\b(wortel|bayam|brokoli|buncis|sawi|pokcoy|pakcoy|labu|tomat|jamur|toge|seledri|daun bawang|bawang daun|bawang bombai|bawang bombay|kangkung|timun|terong|kol|jagung|kacang merah|daun singkong|melinjo|jantung pisang|pare)\b/i,
    exclude: /\bsaus tomat\b/i,
  },
  {
    key: "buah",
    label: "🍎 Buah",
    match: /\b(pisang|pepaya|mangga|alpukat|avokad|jeruk|apel|pir|belimbing|nangka|markisa|sirsak|stroberi|melon|semangka|kurma)\b/i,
    exclude: /\b(jeruk nipis|air jeruk|daun jeruk)\b/i,
  },
  {
    key: "karbo",
    label: "🍚 Nasi & Karbo",
    match:
      /\b(nasi|beras|bubur|makaroni|mie|mi|pasta|roti|oats|kentang|singkong|ubi|soun|sohun|tapioka|tepung|maizena)\b/i,
  },
  {
    key: "susu",
    label: "🥛 Susu & Olahan",
    match: /\b(susu|keju|yogurt|yoghurt|mentega|margarin|krim|santan)\b/i,
    exclude: /\b(asi|formula)\b/i,
  },
];

export const GROUP_OPTIONS = [
  ...RULES.map(({ key, label }) => ({ key, label })),
  { key: "lainnya", label: "🍽️ Lainnya" },
];

const cache = new Map();

export function groupsOf(recipe) {
  if (cache.has(recipe.id)) return cache.get(recipe.id);

  // Each ingredient is a plain line such as "200 gr tepung tapioka"
  const names = [];
  for (const group of recipe.ingredient_groups || []) {
    for (const item of group.items || []) names.push(item);
  }

  const keys = new Set();
  for (const name of names) {
    for (const rule of RULES) {
      if (rule.match.test(name) && !(rule.exclude && rule.exclude.test(name))) {
        keys.add(rule.key);
      }
    }
  }

  const result = keys.size ? [...keys] : ["lainnya"];
  cache.set(recipe.id, result);
  return result;
}
