// in production, calls our netlify serverless function which proxies to weatherstack.
// in local dev, calls weatherstack directly since localhost is already http.

export async function fetchWeather(city) {
  let url;

  if (import.meta.env.DEV) {
    // local development - call weatherstack directly (http is fine on localhost)
    const key = import.meta.env.VITE_WEATHERSTACK_KEY;
    url = `http://api.weatherstack.com/current?access_key=${key}&query=${encodeURIComponent(city)}`;
  } else {
    // production - go through the netlify serverless proxy
    url = `/api/weather?city=${encodeURIComponent(city)}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.info || data.error || "Could not fetch weather");
  }

  // pull out just what we need from the response
  return {
    location: `${data.location.name}, ${data.location.region}`,
    country: data.location.country,
    temperature: data.current.temperature,
    feelslike: data.current.feelslike,
    description: data.current.weather_descriptions?.[0] || "",
    humidity: data.current.humidity,
    wind_speed: data.current.wind_speed,
    icon_url: data.current.weather_icons?.[0] || "",
    localtime: data.location.localtime,
  };
}