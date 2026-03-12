export default function About() {
  return (
    <div className="page">
      <h1 className="page-title">About</h1>

      <div className="about-text">
        <p>
          SkyCast is a weather app I built for our first assignment. It shows the current
          weather for Missoula Montana by default, but you can also use your
          browser's location or search for any city. Weather data comes from the
          Weatherstack API, and recent lookups get cached in Firebase Firestore
          so we're not hitting the API every single time.
        </p>
        <p>
          Built with React, Vite, Firebase Firestore, and hosted on Netlify. The
          Weatherstack API calls go through a Netlify serverless function to keep
          the API key off the client.
        </p>
        <p>
          Best viewed on desktop, but it works fine on mobile too.
        </p>
        <p className="author">Leo Denver Petersen</p>
      </div>
    </div>
  );
}
