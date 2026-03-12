export default function WeatherDisplay({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2 className="weather-location">{weather.location}</h2>
      <p className="weather-time">{weather.localtime}</p>

      {weather.icon_url && (
        <img
          className="weather-icon"
          src={weather.icon_url}
          alt={weather.description}
        />
      )}

      <div className="weather-temp">{weather.temperature}°C</div>
      <p className="weather-desc">{weather.description}</p>

      <div className="weather-details">
        <div className="detail">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">
            {weather.feelslike != null ? `${weather.feelslike}°C` : "N/A"}
          </span>
        </div>
        <div className="detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.wind_speed} km/h</span>
        </div>
      </div>
    </div>
  );
}
