// Fetch and load watchlist movies, sorted by priority
async function loadWatchlist() {
  const response = await fetch('http://localhost:3000/api/movies');
  const movies = await response.json();
  const tableBody = document.querySelector('#watchlist-table tbody');
  tableBody.innerHTML = '';

  // Filter movies that are added to the weekend watchlist
  let weekendMovies = movies.filter(movie => movie.status === 'Weekend');

  // Sort weekend movies by priority (ascending order)
  weekendMovies.sort((a, b) => a.priority - b.priority);

  // Display weekend movies in the sorted order with serial numbers
  let sno = 1;
  weekendMovies.forEach(movie => {
    const priorityClass = getPriorityClass(movie.priority);  // Get class based on priority
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${sno++}</td>
      <td>${movie.name}</td>
      <td>${movie.platform}</td>
      <td class="${priorityClass}">${movie.priority}</td>
      <td>
        <button onclick="markWatched('${movie._id}')">Watched</button>
      </td>
    `;
    tableBody.appendChild(newRow);
  });
}

// Function to assign CSS class based on priority
function getPriorityClass(priority) {
  if (priority === 1) return 'priority-high';  // High priority
  if (priority === 2) return 'priority-medium';  // Medium priority
  return 'priority-low';  // Low priority
}

// Mark movie as watched (remove from weekend list)
async function markWatched(id) {
  await fetch(`http://localhost:3000/api/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Watched', priority: 0 })  // Reset priority
  });
  loadWatchlist();  // Reload the watchlist after marking as watched
}

// Load watchlist on page load
loadWatchlist();
