export type Weather = {
  tempC: number;
  code: number;
  windKph: number;
  locationLabel: string;
};

export const DEFAULT_LOCATION = { latitude: -1.2921, longitude: 36.8219, label: 'Nairobi' };

export function describeWeatherCode(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear sky' };
  if (code === 1 || code === 2) return { emoji: '🌤️', label: 'Partly cloudy' };
  if (code === 3) return { emoji: '☁️', label: 'Overcast' };
  if (code === 45 || code === 48) return { emoji: '🌫️', label: 'Foggy' };
  if ([51, 53, 55, 56, 57].includes(code)) return { emoji: '🌦️', label: 'Drizzle' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { emoji: '🌧️', label: 'Rainy' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { emoji: '❄️', label: 'Snowy' };
  if ([95, 96, 99].includes(code)) return { emoji: '⛈️', label: 'Thunderstorm' };
  return { emoji: '🌡️', label: 'Weather' };
}

/** Real, free, no-key weather API — open-meteo.com. */
export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<Omit<Weather, 'locationLabel'>> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather fetch failed');
  const data = await res.json();
  return {
    tempC: data.current.temperature_2m,
    code: data.current.weather_code,
    windKph: data.current.wind_speed_10m,
  };
}
