const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQAVqJIds6BZhXCRLE27wCwAOYonBsds8v7uRoEi_WTAPrvZ9-8pmBQ8CnxzZVaGBP1p1bIcG58gnhgaonoanHgLvui69gfW-sFNSMwTilCXZWPR4EQIF7sgb5QBs0rzEWx2bn8IM9vlPPNuvmkD04ERK8r3OG1Oa23iE9evl_P-Lqh6LBUta4pkurQ2KqHaqL-Ig1rw7w8fJTxb1QjuCv_TkDIu7wGGd3fLQ68UEbrXazR_O34axiBKiGAUWfexefFyOw8fzwrj_CE4J3krbi2KA3tDCg-52ZKLuhRcJ9SIxT08dxeUa-dsC1RAYg0";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
    (async () => {
        const me = await spotifyApi.getMe();
        console.log(me.body);
        getUserPlaylists(me.body.id);
    })().catch(e => {
        console.error(e);
    });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
    const data = await spotifyApi.getUserPlaylists(userName, { limit: 50 })

    console.log("---------------+++++++++++++++++++++++++")
    let playlists = []
    fs.mkdirSync('playlists', { recursive: true }, (err) => {
        if (err) throw err;
    });
    for (let playlist of data.body.items) {
        console.log(playlist.name + " " + playlist.id)

        let tracks = await getPlaylistTracks(playlist.id, playlist.name);
        // console.log(tracks);

        const tracksJSON = { tracks }
        let data = JSON.stringify(tracksJSON);
        let modifiedPlaylistName = await modifyPlaylistName(playlist.name)
        fs.writeFileSync('./playlists/' + modifiedPlaylistName + '.json', data);
    }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {
    var offset = 0
    let tracks = [];
    var data = []
    var endOfList = false
    while (!endOfList) {
        data = await spotifyApi.getPlaylistTracks(playlistId, {
            offset: offset,
            limit: 100,
            fields: 'total, items'
        })

        let playlistLength = data.body.total;

        if (offset > playlistLength) {
            endOfList = true
        }
    
        // console.log('The playlist contains these tracks', data.body);
        // console.log('The playlist contains these tracks: ', data.body.items[0].track);
        // console.log("'" + playlistName + "'" + ' contains these tracks:');
    
        for (let track_obj of data.body.items) {
            const track = track_obj.track
            tracks.push(track);
            // console.log(track.name + " : " + track.artists[0].name)
        }
        console.log("---------------+++++++++++++++++++++++++")
        offset += 100
    }


    return tracks;
}

async function modifyPlaylistName(playlistName) {
    playlistName = playlistName.replaceAll('/', '|')
    return playlistName
}

getMyData();