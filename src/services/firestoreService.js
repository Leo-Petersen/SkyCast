import { db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

// ---- Weather_Cache ----
// caches weather results so we don't burn through api calls.
// if a result is less than 30 min old we just use that instead of hitting the api again.

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in ms

export async function getCachedWeather(location) {
  try {
    const q = query(
      collection(db, "Weather_Cache"),
      where("location", "==", location),
      orderBy("fetched_at", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const data = snap.docs[0].data();
    const fetchedAt = data.fetched_at?.toDate?.() ?? new Date(data.fetched_at);

    if (Date.now() - fetchedAt.getTime() > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

export async function cacheWeather(weather) {
  try {
    await addDoc(collection(db, "Weather_Cache"), {
      location: weather.location,
      temperature: weather.temperature,
      weather_description: weather.description,
      humidity: weather.humidity,
      wind_speed: weather.wind_speed,
      icon_url: weather.icon_url,
      fetched_at: Timestamp.now(),
    });
  } catch (err) {
    console.error("Failed to write cache:", err);
  }
}

// ---- Saved_Locations ----
// lets users save cities they care about so they can check them quickly

const USER_ID = "default_user";

export async function getSavedLocations() {
  const q = query(
    collection(db, "Saved_Locations"),
    where("user_id", "==", USER_ID)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addSavedLocation(data) {
  await addDoc(collection(db, "Saved_Locations"), {
    user_id: USER_ID,
    city: data.city,
    region: data.region,
    country: data.country || "USA",
    lat: Number(data.lat) || 0,
    lon: Number(data.lon) || 0,
    is_primary: data.is_primary || false,
  });
}

export async function removeSavedLocation(id) {
  await deleteDoc(doc(db, "Saved_Locations", id));
}

// ---- Users ----
// gets (or creates) the default user doc.
// since there's no auth in this project, everyone shares one user profile.

export async function getUser() {
  const ref = doc(db, "Users", USER_ID);
  const snap = await getDoc(ref);

  if (snap.exists()) return { id: snap.id, ...snap.data() };

  // first time visiting, seed a user document
  const newUser = {
    email: "student@university.edu",
    name: "Weather User",
    created_at: Timestamp.now(),
    default_location: "Missoula, MT",
  };
  await setDoc(ref, newUser);
  return { id: USER_ID, ...newUser };
}

export async function updateDefaultLocation(city) {
  const ref = doc(db, "Users", USER_ID);
  await setDoc(ref, { default_location: city }, { merge: true });
}
