import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function WellnessLibrary() {
  const [data, setData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load suggestions from backend when the page opens
  useEffect(() => {
    fetch(`${API_BASE}/admin/wellness-suggestions`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load suggestions:", err));
  }, []);

  const handleChange = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/admin/wellness-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    alert("Saved!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Wellness Library</h1>
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1 capitalize">{key}</label>
          <textarea
            className="w-full border p-2 rounded-md"
            rows={3}
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

