import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Mock search function (replace with API call)
    setResults([
      { name: "Paraben", risk: "High", description: "Preservative with potential irritant properties." },
      { name: "Hyaluronic Acid", risk: "Low", description: "Hydrating ingredient beneficial for skin." },
    ]);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan & Analyze Ingredients</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter ingredient or scan a label..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button className="border p-2 rounded">
          📷
        </button>
      </div>

      <div>
        {results.map((item, index) => (
          <div key={index} className="border rounded p-4 mb-2 shadow">
            <h2 className="font-semibold">{item.name}</h2>
            <p className={`text-sm ${item.risk === "High" ? "text-red-500" : "text-green-500"}`}>
              {item.risk} Risk
            </p>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
