export async function getMovie(id: string) {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=590feda9`);
  const data = await response.json();
  return data;
}
