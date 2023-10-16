// Event listener for page load
document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "api_key=988e17afa010ca134f38ace964916dd5";
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_URL =
    BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const searchURL = BASE_URL + "/search/movie?" + API_KEY;

  // Fetch the movie data from the API
  function fetchMovies(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => displayMovies(data.results))
      .catch((error) => console.log("Error:", error));
  }

  // Show the respective movies on my page
  const displayMovies = (movies) => {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; // Avoids the movie details appear twice
    movies.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      movieList.appendChild(movieCard);
    });
  };

  // Fetch and display the list of genres
  const fetchGenres = () => {
    const genresUrl = `${BASE_URL}/genre/movie/list?${API_KEY}`;
    fetch(genresUrl)
      .then((response) => response.json())
      .then((data) => {
        const genres = data.genres;
        console.log("Available Genres:");
        genres.forEach((genre) => {
          console.log(`${genre.id}: ${genre.name}`);
          createGenreButton(genre.id, genre.name);
        });
      })
      .catch((error) => console.log("Error:", error));
  };

  // Fetch movies by genre
  const fetchMoviesByGenre = (genreId) => {
    const genreUrl = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${genreId}`;
    fetchMovies(genreUrl);
  };

  // Create genre buttons
  const createGenreButton = (genreId, genreName) => {
    const genreButton = document.createElement("button");
    genreButton.textContent = genreName;
    genreButton.className = "button";
    genreButton.addEventListener("click", () => {
      fetchMoviesByGenre(genreId);
    });
    document.getElementById("genre-buttons").appendChild(genreButton);
  };

  // Call the fetchGenres function to retrieve the list of genres
  fetchGenres();

  // Movie card

  const createMovieCard = (movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.id = `movie-${movie.id}`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const image = document.createElement("img");
    image.src = IMG_URL + movie.poster_path;
    image.alt = movie.title;

    const movieDetails = document.createElement("div");
    movieDetails.classList.add("movie-details");

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${movie.vote_average} `;
    rating.classList.add("rating");

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    const comments = document.createElement("textarea");
    comments.placeholder = "Add your comments...";
    comments.classList.add("comments");

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.className = "button";
    
    // Create a message element to display the "Thank You" message
    const messageElement = document.createElement("p");
    messageElement.id = "message";

    // Event listener for submit button
    submitButton.addEventListener("click", () => {
      const comment = comments.value.trim();
      if (comment) {
        console.log(`Submitted comment: ${comment}`);
        messageElement.textContent = "Thank You!"; // Update the message element's content
        comments.value = ""; // Clear the textarea after submission
      }
    });

    movieDetails.appendChild(title);
    movieDetails.appendChild(rating);
    movieDetails.appendChild(overview);
    movieDetails.appendChild(comments);
    movieDetails.appendChild(submitButton);
    movieDetails.appendChild(messageElement); 

    imageContainer.appendChild(image);
    imageContainer.appendChild(movieDetails);

    movieCard.appendChild(imageContainer);

    movieCard.addEventListener("mouseover", () => {
      showTooltip(movie.title);
    });

    movieCard.addEventListener("mouseout", () => {
      hideTooltip();
    });

    movieCard.addEventListener("click", () => {
      fetchMovieDetails(movie.id);
    });

    return movieCard;
  };

  // Fetch movie details
  const fetchMovieDetails = (movieId) => {
    const detailsUrl = `${BASE_URL}/movie/${movieId}?${API_KEY}`;
    fetch(detailsUrl)
      .then((response) => response.json())
      .then((data) => {
        // Instead of displaying the details, you can update the tooltip message
        const movieTitle = data.title;
        showTooltip(movieTitle);
      })
      .catch((error) => console.log("Error:", error));
  };

  // Display movie details
  const displayMovieDetails = (movie) => {
    const movieInfo = document.getElementById("movie-info");
    movieInfo.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    movieInfo.appendChild(title);
    movieInfo.appendChild(overview);
  };

  // Event listener for form submission
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      const searchUrl = `${searchURL}&query=${searchTerm}`;
      fetchMovies(searchUrl);
    }
    searchInput.value = "";
  });

  // Handling Page Load Event
  fetchMovies(API_URL);
});
