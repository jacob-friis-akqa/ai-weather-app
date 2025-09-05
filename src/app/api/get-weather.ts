export async function getWeather(location: string) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=d3a2110f6f76431ab7f100429250509&q=${location}&aqi=no`);
  const data = await response.json();
  return data;
}
