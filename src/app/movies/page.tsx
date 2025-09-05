import React from "react";
import Image from "next/image";
import { getCountryAndMovieObject } from "@/lib/get-country-and-movie";
import { getWeather } from "../api/get-weather";
import { getMovie } from "../api/get-movie";
export default async function page() {
  console.log("getCountryAndMovieObject", await getCountryAndMovieObject("afghanistan"));

  console.log("getWeather", await getWeather("afghanistan"));

  const movie = await getCountryAndMovieObject("afghanistan");

  console.log(movie.movie.imdbID);

  const movieData = await getMovie(movie.movie.imdbID);
  console.log("movieData", movieData);

  const weather = await getWeather(movie.weatherQuery);
  console.log("weather", weather);

  // console.log("getMovie", getMovie(""));
  return (
    <div>
      <h1>{movieData.Title}</h1>
      <p>{weather.location.name}</p>
      <p>{weather.current.temp_c}</p>
      <p>{weather.current.condition.text}</p>
      <Image src={movieData.Poster} alt={movieData.Title} width={100} height={100} />
    </div>
  );
}
