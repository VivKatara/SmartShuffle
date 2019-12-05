// npm deps
const express = require('express');
const https = require('https');
const fetch = require('node-fetch'); 
const crypto = require('crypto');
const { URL } = require('url');
const QueryString = require('querystring');
const playlist_response = require('./sample_response.js')
const sort = require('./backend_modules/sort.js')
const playlist = require('./backend_modules/playlist.js')

const {spBaseUrl, port, sortParams, authToken} = require('./config');

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
  let headers = {
	'Authorization' : 'Bearer ' + req.query.token,
	// 'Authorization': authToken,
	'Content-Type': 'application/json',
	'Content-Length': '0'
  }
  console.log("trying to get some songs", req.query.token); 
  let request = "https://api.spotify.com/v1/me/playlists";

   await fetch(request, { 'headers': headers})
	   .then(res => res.json())
	   .then(data => {
	      let response = []; 
	      //console.log("DATA: ", data); 
		  let tracks = data.items; 
		  for(let i = 0; i < tracks.length; i++){
		  	let trackData = {}
		  	trackData.id = tracks[i].id;
		  	trackData.name = tracks[i].name; 
		  	trackData.images = tracks[i].images; 
		  	response.push(trackData); 
  		}
	   
	   
 		res.send(response);

//	      console.log(data); 
	   })
	   .catch(err => {
	      res.send(err);
   });
 
  
  //do auth stuff and forward request
})

app.get('/smartshuffle', async (req, res) => {

	let headers = {
		'Authorization' : 'Bearer ' + req.query.token,
		// 'Authorization': authToken,
		'Content-Type': 'application/json',
		'Content-Length': '0'
	}

	let trackIds = []
	let trackIdsWithVars = []

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
	let length = 0
	let peakElement = 0

	// const playlistId = req.query.playlistId
	const playlistId = '4KK6ZMTlEeJ3B5A68YfU7V';
	let request = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	
	await fetch(request, {method: 'GET', headers: headers}).then(response => response.json())
	.then(async (data) => {
		let items = data["items"];
		trackIds = playlist.getTrackIdsFromPlaylist(items);
		length = trackIds.length

		trackIdsWithVars = await appendAudioFeatures(trackIds, sortingParams, headers);
		trackIdsWithWeights = sort.calculateTotalScore(trackIdsWithVars, weights)
		trackScoreObject = sort.createTrackScoreObject(trackIdsWithWeights)

		//Sort tracks normally, and then sort around a peak
		peakElement = Math.round(peak * length)
		let sorted_tracks = sort.sort(trackIdsWithWeights, 1);
		let peakSortedTracks = sort.peakSort(peakElement, length, sorted_tracks);

		res.send(JSON.stringify(peakSortedTracks));
	}).catch((err) => {
		console.log(err);
	})
})

app.get('/mergePlaylists', async (req, res) => {

	let headers = {
		'Authorization' : 'Bearer ' + req.query.token,
		// 'Authorization': authToken,
		'Content-Type': 'application/json',
		'Content-Length': '0'
	}
	
	let playlistsToMerge = ["3wda1hegnus9iiw3lldj7lga6", "3KWLpSp2FWi5xkJHTM1nfy"]
	// let name = req.query.name
	let name = "New Merged Playlist"
	let playlist = ""
	let tracks = []
	for (id in playlistsToMerge) {
		playlist = playlistsToMerge[id]
		tracks = await getTracksFromPlaylist(playlist)
		// let tracks = await getTracksFromPlaylist(playlist)
	}
	console.log(tracks)
})

async function getTracksFromPlaylist(playlistId) {

	let request = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	let trackIds = []

	await fetch(request, {method: 'GET', headers: headers}).then(response => response.json())
	.then(async (data) => {
		let items = data["items"];
		let trackIds = playlist.getTrackIdsFromPlaylist(items);
		// console.log(trackIds)
		return trackIds;
	})
	.catch((err) => {
		console.log(err);
	})
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


//Citing source: https://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
function normalize(val, min, max) {
	return (val - min)  / (max - min)
}

// start server
app.listen(port || 3200, () => {
	console.log(`Server is listening on port ${port}`);
})