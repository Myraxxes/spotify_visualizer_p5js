async function searchSongs(query) {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = '';
    matchesContainer.hidden = false;

    const tracks = data.tracks?.items || [];

    tracks.forEach(track => {
        const div = document.createElement('div');
        div.classList.add('match-item');
        div.textContent = `${track.name} – ${track.artists[0].name}`;
        div.addEventListener('click', () => selectTrack(track));
        matchesContainer.appendChild(div);
    });
}

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    searchSongs(query);
});

document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) searchSongs(query);
    }
});

function selectTrack(track) {
    setImage(track.album.images[0].url, track);

    document.getElementById('song-details').hidden = false;
    document.getElementById('cover-image').src =
        track.album.images[0]?.url || '';
    document.getElementById('song-title').textContent = track.name;
    document.getElementById('artist-name').textContent =
        track.artists[0].name;
}