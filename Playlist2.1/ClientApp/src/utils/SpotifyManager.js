import { makePlaylist } from './PlaylistMaker';

const limit = 20;
const clientId = "02917ec1f58141e6ab4386be7230172d";

export const getPlaylists = (token) =>
    fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=12', {
        headers: { Authorization: `Bearer ${token}` }
    }).then((response) => response.json())

export const getToken = () =>
    fetch('api/spotify/publictoken', {
        method: 'get',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => response.json())
        .then(response => JSON.parse(response))
        .then(response => response.access_token)

export const autocomplete = (name, token) =>
    fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(name)}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.json())

export const login = () => {
    return new Promise((resolve, reject) => {
        let url = 'https://accounts.spotify.com/en/authorize?response_type=token&client_id=' +
            clientId + '&redirect_uri=' + encodeURIComponent("https://localhost:44365/api/spotify/login") +
            '&scope=' + encodeURIComponent('playlist-modify-public playlist-modify-private');
        window.open(
            url,
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=400,height=500'
        );
        window.addEventListener('storage', (data) => {
            if (data.key === 'access_token') {
                resolve(data.newValue);
            }
        });
    })
}

export const getUser = (token) =>
    fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.json())

export const getPlaylistsByCategory = (id, token) =>
    fetch(`https://api.spotify.com/v1/browse/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then((response) => response.json())

export const getTrack = (id, token) =>
    fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.json())

export const getTracks = (track, token) => {
    return new Promise((resolve, reject) =>
        fetch(`https://api.spotify.com/v1/artists/${track.artists[0].id}/related-artists`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(({ artists }) => {
                var relatedArtists = artists.slice(0, limit - 1);
                if (relatedArtists.length) {
                    const trackList = [];
                    relatedArtists.push(track.artists[0])
                    for (var i = relatedArtists.length - 1; i >= 0; i--) {
                        var total = relatedArtists.length - 1;
                        fetch(`https://api.spotify.com/v1/artists/${artists[i].id}/top-tracks?country=US`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                            .then(response => response.json())
                            .then(({ tracks }) => {
                                if (tracks.length) {

                                    for (var e = tracks.length - 1; e >= 0; e--) {
                                        trackList.push(tracks[e]);
                                        if (e === 0) {
                                            total -= 1;
                                            if (total === 0) {

                                                let tracks = makePlaylist(trackList, track.popularity)
                                                let mainTrack = { image: track.album.images[0].url, title: `${track.name}, ${track.artists[0].name}` }
                                                resolve({ tracks: tracks, mainTrack: mainTrack });
                                            }
                                        }
                                    }
                                } else {
                                    total -= 1;
                                }
                            })
                    }
                } else {
                    console.log('No related artists')
                }
            })
        )
}
export const getPlaylistTracks = (id, token) =>
    fetch(`https://api.spotify.com/v1/users/spotify/playlists/${id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.json())
        .then(({ items }) => {
            let length = items.length;
            let tracks = [];
            for (var i = 0; i < length; i++) {
                tracks.push(items[i].track);
            }
            return tracks;
        })

export const getPlaylist = (id, token) => 
    fetch(`https://api.spotify.com/v1/users/spotify/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.json())

export const savePlaylist = (token, userId, name, isPublic, tracks) => {
    return new Promise((resolve, reject) =>
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' },
            body: JSON.stringify({ name: name, public: isPublic })
        }).then(response => response.json())
            .then(myPlaylist => {
                let trackList = tracks.map(track => track.uri);
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${myPlaylist.id}/tracks`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ uris: trackList })
                }).then(response => {
                    resolve(myPlaylist)
                })
            })
    )
}