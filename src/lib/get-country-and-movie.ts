import { COUNTRY_DATA } from "../../countries";

export async function getCountryAndMovieObject(name: string) {
  const country = COUNTRY_DATA[name as keyof typeof COUNTRY_DATA];
  return country;
}
