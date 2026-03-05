"use client";

import { useState, useEffect } from "react";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: string | null;
  date: string;
}

interface SearchResult {
  product_name: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  serving_size?: string;
}

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function FoodPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "Lunch",
  });
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadEntries = () => {
    fetch("/api/food")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const searchFood = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          search
        )}&search_simple=1&action=process&json=1&page_size=8`
      );
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const selectFood = (product: SearchResult) => {
    setForm({
      ...form,
      name: product.product_name || search,
      calories: String(
        Math.round(product.nutriments["energy-kcal_100g"] || 0)
      ),
      protein: String(
        Math.round(product.nutriments.proteins_100g || 0)
      ),
      carbs: String(
        Math.round(product.nutriments.carbohydrates_100g || 0)
      ),
      fat: String(Math.round(product.nutriments.fat_100g || 0)),
    });
    setSearchResults([]);
    setSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    setLoading(true);

    await fetch("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        calories: parseInt(form.calories),
        protein: form.protein ? parseFloat(form.protein) : null,
        carbs: form.carbs ? parseFloat(form.carbs) : null,
        fat: form.fat ? parseFloat(form.fat) : null,
        mealType: form.mealType,
      }),
    });

    setForm({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      mealType: "Lunch",
    });
    setLoading(false);
    loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/food?id=${id}`, { method: "DELETE" });
    loadEntries();
  };

  const todayEntries = entries.filter(
    (e) =>
      new Date(e.date).toDateString() === new Date().toDateString()
  );
  const totalCals = todayEntries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = todayEntries.reduce(
    (s, e) => s + (e.protein || 0),
    0
  );
  const totalCarbs = todayEntries.reduce(
    (s, e) => s + (e.carbs || 0),
    0
  );
  const totalFat = todayEntries.reduce(
    (s, e) => s + (e.fat || 0),
    0
  );

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Food <span className="text-gold">Tracker</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gold">{totalCals}</p>
          <p className="text-xs text-dark-muted">kcal today</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold">{Math.round(totalProtein)}g</p>
          <p className="text-xs text-dark-muted">Protein</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold">{Math.round(totalCarbs)}g</p>
          <p className="text-xs text-dark-muted">Carbs</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold">{Math.round(totalFat)}g</p>
          <p className="text-xs text-dark-muted">Fat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="font-semibold mb-3">Search Food Database</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFood()}
                className="input-dark flex-1"
                placeholder="Search OpenFoodFacts..."
              />
              <button
                onClick={searchFood}
                className="btn-gold px-4"
                disabled={searching}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((product, i) => (
                  <button
                    key={i}
                    onClick={() => selectFood(product)}
                    className="w-full text-left p-2 rounded border border-dark-border hover:border-gold transition-colors text-sm"
                  >
                    <p className="font-medium truncate">
                      {product.product_name || "Unknown"}
                    </p>
                    <p className="text-dark-muted text-xs">
                      {product.nutriments["energy-kcal_100g"] || "?"} kcal/100g
                      • P:{product.nutriments.proteins_100g || 0}g C:
                      {product.nutriments.carbohydrates_100g || 0}g F:
                      {product.nutriments.fat_100g || 0}g
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="font-semibold mb-3">Log Food</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="input-dark"
                  placeholder="Chicken Breast"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Meal
                </label>
                <select
                  value={form.mealType}
                  onChange={(e) =>
                    setForm({ ...form, mealType: e.target.value })
                  }
                  className="input-dark"
                >
                  {mealTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  value={form.calories}
                  onChange={(e) =>
                    setForm({ ...form, calories: e.target.value })
                  }
                  className="input-dark"
                  placeholder="250"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Protein
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.protein}
                    onChange={(e) =>
                      setForm({ ...form, protein: e.target.value })
                    }
                    className="input-dark"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Carbs
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.carbs}
                    onChange={(e) =>
                      setForm({ ...form, carbs: e.target.value })
                    }
                    className="input-dark"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">
                    Fat
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fat}
                    onChange={(e) =>
                      setForm({ ...form, fat: e.target.value })
                    }
                    className="input-dark"
                    placeholder="5"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Log Food"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-semibold mb-4">Today&apos;s Food Log</h2>
            {todayEntries.length === 0 ? (
              <p className="text-dark-muted text-sm">
                Nothing logged yet today. What did you eat?
              </p>
            ) : (
              <div className="space-y-2">
                {mealTypes.map((meal) => {
                  const mealEntries = todayEntries.filter(
                    (e) => e.mealType === meal
                  );
                  if (mealEntries.length === 0) return null;
                  return (
                    <div key={meal}>
                      <h3 className="text-sm text-gold font-semibold mt-3 mb-2">
                        {meal}
                      </h3>
                      {mealEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-2 border-b border-dark-border last:border-0"
                        >
                          <div>
                            <span className="font-medium">{entry.name}</span>
                            <div className="flex gap-3 text-xs text-dark-muted mt-0.5">
                              <span>{entry.calories} kcal</span>
                              {entry.protein !== null && (
                                <span>P: {entry.protein}g</span>
                              )}
                              {entry.carbs !== null && (
                                <span>C: {entry.carbs}g</span>
                              )}
                              {entry.fat !== null && (
                                <span>F: {entry.fat}g</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-dark-muted hover:text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
