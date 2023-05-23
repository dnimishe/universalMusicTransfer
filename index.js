var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '81d8da50878f4ca089cd9af37af8be27',
    clientSecret: '163178a02502443782b33a6f9f48b410',
    redirectUri: 'http://localhost:8888/callback'
});

// Get an artist
spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
    .then(function (data) {
        console.log('Artist information', data.body);
    }, function (err) {
        console.error(err);
    });

// Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function (data) {
//         console.log('Artist albums', data.body);
//     },
//     function (err) {
//         console.error(err);
//     }
// );