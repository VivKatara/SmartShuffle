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

//some firebase collections for songs, playlists, songtime, etc. 
let trackRef = db.collection('tracks'); 
let playlistRef = db.collection('playlistRef'); 

const {spClientId, spClientSecret, spBaseUrl, authToken, port, spotify_token} = require('./config');

//Env vars
//const {spClientId, spClientSecret, spBaseUrl, port} = require('./config');

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
	    	'Authorization' : "Bearer BQBZNMkUKcPBSexCn0hYPriEpgjLMwMO26G1LseYltk3mKK4fVbaNtC3hGLad-Q1tgZvwwc_xICR4SLiRBwn_bJFeq-vxhlMGGZGvkwS-pHk00bz_K1R4aJjbbk88OB4irQwY7Al3D7nqzZP5aQbsKtafNYd_phlGY5ndZqTuMGvcPPhOjB8YdIdKD0UmJURNUmmLoycRg",
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
   let setPlaylist = playlistRef.doc('playlist1').set({
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
 
  
//   //do auth stuff and forward request
// })

app.get('/smartshuffle', async (req, res) => {

	let trackIds = []
	let trackIdsWithVars = []
	// const playlistId = req.playlistId
	const playlistId = '4KK6ZMTlEeJ3B5A68YfU7V';
//	const url = getUrl("https://api.spotify.com/v1//playlists/" + playlistId + "/tracks");
	const url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	let headers = 
  	{
    	'Authorization' : 'Bearer BQCaiSPbWAU3MQ8KT3PdteZYZpHfBefN6wnTOO-cHkgFEOXqlJCY2rjNLUFxT_XjjZg-ATwl_kT9jf6tm_JmQbvRqPGdd67CvQhXgkCqeWusXivPWrucU08Y8PgzGfEoazMOSw-3dC1al14IqKxp-S11QP1C8yhLqtwjUCmvFGDvg4mKt1HxlyIzMl1m6n8DVSOoiURadQ',
      	'Content-Type': 'application/json',
      	'Content-Length': '0'
      // 'Content-Type': 'application/x-www-form-urlencoded',
	}
	
	await fetch(url, {method: 'GET', headers: headers}).then(response => response.json())
	.then(async (data) => {
//		console.log(data);
//		console.log(data.items);
		let items = data["items"];
//		console.log(items);
		trackIds = getTrackIdsFromPlaylist(items);
		console.log("track_ids:", trackIds);
		trackIdsWithVars = await appendAudioAnalysis(trackIds);
		console.log("with vars:", trackIdsWithVars);
		
		let sorted_tracks = sort(trackIdsWithVars, 1);
		console.log("sorted:", sorted_tracks);
		res.send(JSON.stringify(sorted_tracks));

//		res.send(trackIdsWithVars);
	}).catch((err) => {
		console.log(err);
	})
})

function sort(tracks, index){
	var sort_index = index;
	var sorted_array = tracks.sort(function(a, b) {
		return a[sort_index] > b[sort_index] ? 1: -1;
	});
	var song_array = [];
	for (var i = 0; i < sorted_array.length;i++){
		var song = sorted_array[i][0];
		song_array.push(song);
	}
	return song_array;
}

async function appendAudioAnalysis(trackIds) {
	let headers = 
  	{
    	'Authorization' : 'Bearer BQCaiSPbWAU3MQ8KT3PdteZYZpHfBefN6wnTOO-cHkgFEOXqlJCY2rjNLUFxT_XjjZg-ATwl_kT9jf6tm_JmQbvRqPGdd67CvQhXgkCqeWusXivPWrucU08Y8PgzGfEoazMOSw-3dC1al14IqKxp-S11QP1C8yhLqtwjUCmvFGDvg4mKt1HxlyIzMl1m6n8DVSOoiURadQ',
      	'Content-Type': 'application/json',
      	'Content-Length': '0'
      // 'Content-Type': 'application/x-www-form-urlencoded',
	}
	let trackIdsWithVars = []
	for (track in trackIds) {
		const url = "https://api.spotify.com/v1/audio-analysis/" + trackIds[track];
//		const url = getUrl("/audio-analysis/" + track);
//		console.log(track)
		await fetch(url, {method: 'GET', headers: headers}).then(response => response.json())
		.then((data) => {
//			console.log(data);
			trackIdsWithVars.push([trackIds[track], data["track"]["tempo"]])
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

// start server
app.listen(port || 3200, () => {
	console.log("Server is listening on port", port);
})