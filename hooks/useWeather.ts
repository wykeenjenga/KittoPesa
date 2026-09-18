import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { DEFAULT_LOCATION, fetchWeather, Weather } from '../api/weather';

/**
 * Requests real device location (with graceful fallback to a fixed city if
 * denied, unsupported, or offline) and fetches real current-weather data.
 */
export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingDeviceLocation, setUsingDeviceLocation] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let lat = DEFAULT_LOCATION.latitude;
      let lon = DEFAULT_LOCATION.longitude;
      let label = DEFAULT_LOCATION.label;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
          label = 'Your location';
          if (!cancelled) setUsingDeviceLocation(true);
        }
      } catch {
        // Permission denied, unavailable on this platform, or timed out —
        // silently fall back to the default city.
      }

      try {
        const data = await fetchWeather(lat, lon);
        if (!cancelled) setWeather({ ...data, locationLabel: label });
      } catch {
        // Leave weather null; the UI shows a quiet fallback state.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, loading, usingDeviceLocation };
}
