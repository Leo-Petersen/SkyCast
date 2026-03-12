import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSavedLocations,
  addSavedLocation,
  removeSavedLocation,
} from "../services/firestoreService";

export default function SavedLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("USA");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const data = await getSavedLocations();
      setLocations(data);
    } catch (err) {
      setError("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!city || !region) return;

    try {
      await addSavedLocation({ city, region, country, lat, lon, is_primary: isPrimary });
      // reset form
      setCity("");
      setRegion("");
      setCountry("USA");
      setLat("");
      setLon("");
      setIsPrimary(false);
      setShowForm(false);
      // reload the list
      setLoading(true);
      await loadLocations();
    } catch (err) {
      setError("Couldn't save location.");
    }
  }

  async function handleRemove(id) {
    try {
      await removeSavedLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      setError("Couldn't remove location.");
    }
  }

  // clicking "view weather" just takes you to the search page
  function handleView(loc) {
    navigate(`/search`);
  }

  return (
    <div className="page">
      <h1 className="page-title">Saved Locations</h1>
      <p className="page-subtitle">Your favorite cities</p>

      {!showForm && (
        <button className="location-btn" onClick={() => setShowForm(true)}>
          + Add Location
        </button>
      )}

      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <div className="form-row">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="State / Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
            Primary location
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {!loading && locations.length === 0 && (
        <p className="empty">No saved locations yet. Add one above!</p>
      )}

      {!loading && locations.length > 0 && (
        <div className="locations-list">
          {locations.map((loc) => (
            <div key={loc.id} className="loc-card">
              <div className="loc-info">
                <span className="loc-city">{loc.city}</span>
                <span className="loc-region">
                  {loc.region}{loc.country ? `, ${loc.country}` : ""}
                </span>
                {loc.is_primary && <span className="loc-badge">Primary</span>}
              </div>
              <div className="loc-actions">
                <button className="btn-remove" onClick={() => handleRemove(loc.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
