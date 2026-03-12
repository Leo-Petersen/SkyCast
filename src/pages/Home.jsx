import { useState, useEffect } from "react";
import WeatherDisplay from "../components/WeatherDisplay";
import { fetchWeather } from "../services/weatherService";
import { getUser, getCachedWeather, cacheWeather } from "../services/firestoreService";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingGeo, setUsingGeo] = useState(false);

  // load missoula weather on mount (or whatever the user's default is)
  useEffect(() => {
    async function init() {
      try {
        const user = await getUser();
        const city = user.default_location || "Missoula, MT";
        await loadWeather(city);
      } catch (err) {
        setError("Something went wrong loading weather.");
        setLoading(false);
      }
    }
    init();
  }, []);

  async function loadWeather(city) {
    setLoading(true);
    setError("");
    try {
      // check firestore cache first
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

      // nothing in cache, hit the api
      const data = await fetchWeather(city);
      setWeather(data);
      await cacheWeather(data);
    } catch (err) {
      setError(err.message || "Failed to load weather.");
    } finally {
      setLoading(false);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation.");
      return;
    }

    setUsingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        loadWeather(coords);
        setUsingGeo(false);
      },
      () => {
        setError("Couldn't get your location. Make sure location access is enabled.");
        setUsingGeo(false);
      }
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Current Weather</h1>
      <p className="page-subtitle">Missoula, Montana</p>

      <button
        className="location-btn"
        onClick={handleUseLocation}
        disabled={usingGeo}
      >
        {usingGeo ? "Getting location..." : "Use My Location Instead"}
      </button>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <WeatherDisplay weather={weather} />}
    </div>
  );
}
