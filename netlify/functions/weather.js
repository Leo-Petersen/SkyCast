// Serverless function that proxies requests to the Weatherstack API.
// Weatherstack's free tier only supports HTTP, and our hosted site runs on
// HTTPS, so this function handles that mismatch. It also keeps the API key
// on the server so it never shows up in the browser.

export async function handler(event) {
  const city = event.queryStringParameters?.city;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing city parameter" }),
    };
  }

  const API_KEY = process.env.WEATHERSTACK_API_KEY;

  try {
    const res = await fetch(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}`
    );
    const data = await res.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error.info || "API error" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather" }),
    };
  }
}
