import React from 'react';

const Movies = () => {
  const movies = [
    { title: 'Movie 1', id: 1 },
    { title: 'Movie 2', id: 2 },
    { title: 'Movie 3', id: 3 },
  ];

  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;