// npm deps
const express = require('express');
const https = require('https');
const fetch = require('node-fetch'); 
const crypto = require('crypto');
const { URL } = require('url');
const QueryString = require('querystring');
const playlist_response = require('./sample_response.js'); 

//config firebase 
const admin = require('firebase-admin');
const functions = require('firebase-functions');
//initialize firebase app 
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartshuffle.firebaseio.com"
});

let db = admin.firestore();
var nonce = 0; 

//some firebase collections for songs, playlists, songtime, etc. 
let trackRef = db.collection('tracks'); 
let playlistRef = db.collection('playlistRef'); 
let metadataRef = db.collection('metadata'); 

const {spClientId, spClientSecret, spBaseUrl, authToken, port, spotify_token, sortParams} = require('./config');

const sort = require('./backend_modules/sort.js')
const playlist = require('./backend_modules/playlist.js')

//const {port, sortParams, authToken} = require('./config');

const sortingParams = sortParams.split(' ')

// Require the framework and instantiate it
const app = express();

// get the env variables to do their thing 
const dotenv = require('dotenv');
dotenv.config();

app.get('/', (req, res) => {
	res.send("Soon to be cool spotify-stuff");
});

app.get('/getPlaylists', async (req, res) => {
  console.log("trying to get some songs");//, req.query.token); 
  let request = "https://api.spotify.com/v1/me/playlists";

	let headers = 
	  {
	    	'Authorization' : "Bearer ",
	    	//req.query.token,
	      'Content-Type': 'application/json',
	      'Content-Length': '0'
	      // 'Content-Type': 'application/x-www-form-urlencoded',
	}

   await fetch(request, { 'headers': headers})
   .then(res => res.json())
   .then(data => {
      let response = []; 
      console.log("DATA: ", data); 
  let tracks = data.items; 
  for(let i = 0; i < tracks.length; i++){
  let trackData = {}
  trackData.id = tracks[i].id;
  trackData.name = tracks[i].name; 
  trackData.images = tracks[i].images; 
  response.push(trackData); 
  }

	console.log("data is: ", data); 

	nonce ++; 
   let setPlaylist = playlistRef.doc(nonce).set({
	  list: response 
	});
   	
   	console.log(data);
	res.send(response);

   
   
 res.send(response);

//      console.log(data); 
   })
   .catch(err => {
      res.send(err);
   });
 
  
  //do auth stuff and forward request
})

// app.get('/getPlaylists', function (req, res) {
// 		console.log("im here!!!");
//   //console.log("trying to get some songs", req.query.token); 
//   let request = "https://api.spotify.com/v1/me/playlists";
//   let headers = 
//   {
//     	'Authorization' : 'Bearer ' + spotify_token, //req.query.token,
//       'Content-Type': 'application/json',
//       'Content-Length': '0'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
// }

//    fetch(request, { 'headers': headers})
// 	   .then(res => res.json())
// 	   .then(data => {
// 	      let response = []; 
// 	      //console.log("DATA: ", data); 
// 		  let tracks = data.items; 
// 		  for(let i = 0; i < tracks.length; i++){
// 		  	let trackData = {}
// 		  	trackData.id = tracks[i].id;
// 		  	trackData.name = tracks[i].name; 
// 		  	trackData.images = tracks[i].images; 
// 		  	response.push(trackData); 
//   		}
// 	   console.log("data is: ", data); 
// 	   let setPlaylist = playlistRef.doc('playlist1').set({
// 		  list: response 
// 		});
	   	
// 	   	console.log(data);
//  		res.send(response);

// //	      console.log(data); 
// 	   })
// 	   .catch(err => {
// 	      res.send(err);
//    });
 //  let headers = {
	// 'Authorization' : 'Bearer ' + req.query.token,
	// // 'Authorization': authToken,
	// 'Content-Type': 'application/json',
	// 'Content-Length': '0'
 //  }
 //  console.log("trying to get some songs", req.query.token); 
 //  let request = "https://api.spotify.com/v1/me/playlists";

 //   await fetch(request, { 'headers': headers})
	//    .then(res => res.json())
	//    .then(data => {
	//       let response = []; 
	// 	  let tracks = data.items; 
	// 	  for(let i = 0; i < tracks.length; i++){
	// 	  	let trackData = {}
	// 	  	trackData.id = tracks[i].id;
	// 	  	trackData.name = tracks[i].name; 
	// 	  	trackData.images = tracks[i].images; 
	// 	  	response.push(trackData); 
 //  		}
 // 		res.send(response);
	//    })
	//    .catch(err => {
	//       res.send(err);
 //   });
 
  
//   //do auth stuff and forward request
// })

app.get('/smartshuffle', async (req, res) => {


	let headers = {
		//'Authorization' : 'Bearer ' + req.query.token,
		'Authorization': authToken,
		'Content-Type': 'application/json',
		'Content-Length': '0'
	}

	let trackIds = []
	let trackIdsWithVars = []

	let playlist1 = req.query.playlistId1 || 0
	let playlist2 = req.query.playlistId2 || 0
	let playlist3 = req.query.playlistId3 || 0

	let playlists = playlist.getAllPlaylists(playlist1, playlist2, playlist3);

	//Accumulating all the weights
	let tempoWeight = req.query.tempo || 0
	let danceWeight = req.query.danceability || 0
	let energyWeight = req.query.energy || 0
	let instrumentWeight = req.query.instrumentalness || 0
	let livenessWeight = req.query.liveness || 0
	let loudnessWeight = req.query.loudness || 0
	let speechWeight = req.query.speechiness || 0
	let valenceWeight = req.query.valence || 0
	let acousticWeight = req.query.acousticness || 0
	let weights = [tempoWeight, danceWeight, energyWeight, instrumentWeight, livenessWeight, loudnessWeight, speechWeight, valenceWeight, acousticWeight]

	//Get peak from request
	let peak = req.query.peak

	for (id in playlists) {
		let currPlaylist = playlists[id]
		let request = "https://api.spotify.com/v1/playlists/" + currPlaylist + "/tracks"
		await fetch(request, {method: 'GET', headers: headers}).then(response => response.json())
		.then((data) => {
			let items = data["items"]
			console.log("things\n\n\n\n", data); 
			trackIds.push(playlist.getTrackIdsFromPlaylist(items))
		})
	}

	trackIds = Array.prototype.concat.apply([], trackIds)
	let length = trackIds.length
	console.log(length)

	//add metadata about the songs and playlists added to DB 
	let increment = admin.firestore.FieldValue.increment(1);
	let numNewSongs = admin.firestore.FieldValue.increment(length);

	//init 
				// 	for(var i = 1900; i < 2020; i++){
				// 	console.log("setting year for ", i); 
				// 	let setYear = metadataRef.doc('decades').set({
				// 		[i]: 0,
				// 	})
				// }

	let setPlaylist = metadataRef.doc('stats').update({
		playlistcount: increment,
		songCount: numNewSongs,
	});

	trackIdsWithVars = await appendAudioFeatures(trackIds, sortingParams, headers)
	trackIdsWithWeights = sort.calculateTotalScore(trackIdsWithVars, weights)
	trackScoreObject = sort.createTrackScoreObject(trackIdsWithWeights)

	let peakElement = Math.round(peak * length)
	let sorted_tracks = sort.sort(trackIdsWithWeights, 1)
	let peakSortedTracks = sort.peakSort(peakElement, length, sorted_tracks)

	let sortedTracksNamesArtists = await addNameAndArtists(peakSortedTracks, headers);
	res.send(JSON.stringify(sortedTracksNamesArtists));
})

async function addNameAndArtists(sortedTracks, headers) {
	let tracksAndNameAndArtists = []
        let trackId = ""
        let name = ""
        let artist = ""
        let request = ""
        for (track in sortedTracks) {
            trackId = sortedTracks[track]
            request = "https://api.spotify.com/v1/tracks/" + trackId
			await fetch (request, {method: 'GET', headers: headers}).then(response => response.json())
			.then((data) => {
				console.log(data); 
				console.log("album data: ", data["album"])
				console.log("disk___: ", data["duration_ms"])
				name = data["name"]
				artist = data["album"]["artists"][0]["name"]
				tracksAndNameAndArtists.push([trackId, name, artist])

				//add song-specific metadata to firebase 
				console.log("HEEEEEEEERE: ", data)
				let popularity = admin.firestore.FieldValue.increment(data["popularity"] || 0);
				let duration = admin.firestore.FieldValue.increment(data["duration_ms"] || 0); 
				let release_year = data["album"]["release_date"] || 0;  
				release_year = release_year.substring(0, 4); 
				let setMetadata = metadataRef.doc('stats').update({
					popularity: popularity,
					songminutes: duration,
				});

				let increment = admin.firestore.FieldValue.increment(1);
				let setYear = metadataRef.doc('decades').update({
					[release_year]: increment, 
				})


			}).catch((err) => {
				console.log(err)
			})
		}
		return tracksAndNameAndArtists
}

async function appendAudioFeatures(trackIds, sortingParams, headers) {
	let trackIdsWithVars = []
	for (track in trackIds) {
		const url = "https://api.spotify.com/v1/audio-features/" + trackIds[track]
		await fetch(url, {method: 'GET', headers: headers}).then(response => response.json())
		.then((data) => {
			let parametersArray = []
			for (parameter in sortingParams) {
				if (sortingParams[parameter] == "tempo") {
					parametersArray.push(normalize(data[sortingParams[parameter]], 40, 220))
				}
				else if (sortingParams[parameter] == "loudness") {
					parametersArray.push(normalize(data[sortingParams[parameter]], -60, 0))
				}
				else {
					parametersArray.push(data[sortingParams[parameter]])
				}
			}
			trackIdsWithVars.push([trackIds[track], parametersArray])
		}).catch((err) => {
			console.log(err)
		})
	}
	return trackIdsWithVars
}

function getTrackIdsFromPlaylist(data) {
	let trackIds = []
	for (key in data) {
		trackIds.push(data[key]["track"]["id"]);
	}
	return trackIds;
}

function getUrl(route) {
	return spBaseUrl + route;''
}

// });

//Citing source: https://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
function normalize(val, min, max) {
	return (val - min)  / (max - min)
}

// start server
app.listen(port || 3200, () => {
	console.log(`Server is listening on port ${port}`);
})


//SmartShuffle - need to return song id, name of song, and artist in list of lists
//Merge Playlist enabled for 1-3 playlists in the smartShuffle endpoint
//Hence, you can delete the merge playlist endpoint and just work with what you have

