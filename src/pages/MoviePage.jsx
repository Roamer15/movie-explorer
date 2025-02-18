import { DetailMovieContext } from "../Context/context";
import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import Cast from "../components/cast/Cast";
import Hero from "../components/hero/Hero";
import SimilarMovies from "../components/similar/SimilarMovies";
import { useNavigate } from "react-router";
import Footer from '../components/footer/Footer'

const API_KEY = import.meta.env.VITE_BASE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_BASE_URL;

const MoviePage = () => {
  const { selectedMovie } = useContext(DetailMovieContext);
  const { id } = useParams();
  const [cast, setCast] = useState([]);

  const apiKey = import.meta.env.VITE_BASE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_BASE_URL;
  const IMAGE_PATH = import.meta.env.VITE_BASE_IMG_PATH;

  const { setSelectedMovie } = useContext(DetailMovieContext)
  const navigate = useNavigate()

  const handleMovieDetail = (movie) => {
    console.log(movie)
    setSelectedMovie(movie)
    navigate(`/details/${movie.id}`)
  }

  const handleStorage = (movie) => {
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    const isMovieInWatchlist = watchlist.some((item) =>{
          item.id === movie.id});
  
    if (!isMovieInWatchlist) {
      watchlist.push(movie);
  
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      console.log(movie.title)
  
      alert(`movie added to watchlist: ${movie.title}`);
    } else {
      alert(`Movie is already in the watchlist: ${movie.title}`);
    }
  };

  // Fetch Cast Data
  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
        );
        const data = await response.json();
        setCast(data.cast.slice(0, 6)); // Get the top 6 cast members
      } catch (error) {
        console.error("Error fetching cast:", error);
      }
    };

    fetchCast();
  }, [id]);

  if (!selectedMovie || selectedMovie.id !== parseInt(id)) {
    return <h2>Movie not found. Please go back and select a movie.</h2>;
  }

  return (
    <>
      <Hero
        backgroundImage={selectedMovie.backdrop_path? selectedMovie.backdrop_path:selectedMovie.poster_path}
        description={selectedMovie.overview}
        title={selectedMovie.title}
        storage={handleStorage}
        movie={selectedMovie}
      />
      <Cast cast={cast} />

      <h1 className="h1-detail">More Like this</h1>

      <SimilarMovies
        API_KEY={apiKey}
        BASE_URL={baseUrl}
        IMAGE_PATH={IMAGE_PATH}
        genre={selectedMovie.genre_ids[0]}
        detail={handleMovieDetail}
      />

      <SimilarMovies
        API_KEY={apiKey}
        BASE_URL={baseUrl}
        IMAGE_PATH={IMAGE_PATH}
        genre={selectedMovie.genre_ids[1]}
        detail={handleMovieDetail}
      />

      <Footer />
    </>
  );
};

export default MoviePage;
