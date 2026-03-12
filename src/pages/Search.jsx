import { useState } from "react";
import WeatherDisplay from "../components/WeatherDisplay";
import { fetchWeather } from "../services/weatherService";
import { getCachedWeather, cacheWeather } from "../services/firestoreService";

export default function Search() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    const city = query.trim();
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // try the cache first
      const cached = await getCachedWeather(city);
      if (cached) {
        setWeather({
          location: cached.location,
          temperature: cached.temperature,
          description: cached.weather_description,
          humidity: cached.humidity,
          wind_speed: cached.wind_speed,
          icon_url: cached.icon_url,
          feelslike: null,
          localtime: "",
        });
        setLoading(false);
        return;
      }

      const data = await fetchWeather(city);
      setWeather(data);
      await cacheWeather(data);
    } catch (err) {
      setError(err.message || "Couldn't find that city. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Search</h1>
      <p className="page-subtitle">Look up weather for any city</p>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {!loading && weather && <WeatherDisplay weather={weather} />}
    </div>
  );
}
