document.getElementById('platform').addEventListener('change', function() {
  const otherPlatformContainer = document.getElementById('other-platform-container');
  if (this.value === 'Other') {
    otherPlatformContainer.style.display = 'block';  // Show custom platform input
  } else {
    otherPlatformContainer.style.display = 'none';   // Hide custom platform input
  }
});

document.getElementById('movie-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const movieName = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  let platform = document.getElementById('platform').value;

  // If "Other" is selected, get the custom platform value
  if (platform === 'Other') {
    const customPlatform = document.getElementById('other-platform').value;
    if (customPlatform) {
      platform = customPlatform;  // Use the custom platform entered by the user
    } else {
      alert("Please enter the custom OTT platform.");
      return;  // Stop form submission if no custom platform is entered
    }
  }

  // Post movie to backend API
  await fetch('http://localhost:3000/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: movieName, type, platform })
  });

  loadMovies();

  // Clear the input fields
  document.getElementById('name').value = '';
  document.getElementById('type').value = 'Movie';       // Reset type dropdown
  document.getElementById('platform').value = 'Prime Video';  // Reset platform dropdown to default value
  document.getElementById('other-platform').value = '';       // Clear the custom platform input
  document.getElementById('other-platform-container').style.display = 'none';  // Hide custom platform input
});

// Fetch and load movies
async function loadMovies() {
  const response = await fetch('http://localhost:3000/api/movies');
  const movies = await response.json();
  const tableBody = document.querySelector('#movie-table tbody');
  tableBody.innerHTML = '';
  movies.forEach((movie, index) => {
    const formattedDate = new Date(movie.dateAdded).toLocaleDateString('en-GB');  // Format date as DD/MM/YYYY
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${movie.name}</td>
      <td>${movie.type}</td>
      <td>${movie.platform}</td>
      <td>${formattedDate}</td>
      <td>
        <button onclick="addToWatchlist('${movie._id}')">Add to Weekend</button>
        <button onclick="deleteMovie('${movie._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(newRow);
  });
}

// Add movie to weekend watchlist
async function addToWatchlist(id) {
  const priority = prompt('Enter priority for the weekend watchlist (1 for highest)');
  if (priority && !isNaN(priority)) {
    await fetch(`http://localhost:3000/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Weekend', priority: parseInt(priority) })
    });
    loadMovies();
  }
}

// Delete movie
async function deleteMovie(id) {
  await fetch(`http://localhost:3000/api/movies/${id}`, { method: 'DELETE' });
  loadMovies();
}

// Load movies on page load
loadMovies();
