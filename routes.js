// npm deps
const express = require('express');
const https = require('https');
const fetch = require('node-fetch'); 
const crypto = require('crypto');
const { URL } = require('url');
const QueryString = require('querystring');
const playlist_response = require('./sample_response.js')

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
  console.log("trying to get some songs", req.query.token); 
  let request = "https://api.spotify.com/v1/me/playlists";
  let headers = 
  {
		'Authorization' : 'Bearer ' + req.query.token,
		'Content-Type': 'application/json',
      'Content-Length': '0'
}

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
	   
	   
//  		res.send(response);

//	      console.log(data); 
	   })
	   .catch(err => {
	      res.send(err);
   });
 
  
  //do auth stuff and forward request
})

app.get('/smartshuffle', async (req, res) => {
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

	// const playlistId = req.query.playlistId
	const playlistId = '4KK6ZMTlEeJ3B5A68YfU7V';
	let request = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	let headers = 
  	{
    	'Authorization' : authToken,
      	'Content-Type': 'application/json',
      	'Content-Length': '0'
	}
	
	await fetch(request, {method: 'GET', headers: headers}).then(response => response.json())
	.then(async (data) => {
		let items = data["items"];
		trackIds = getTrackIdsFromPlaylist(items);
		trackIdsWithVars = await appendAudioFeatures(trackIds, sortingParams);
		trackIdsWithWeights = calculateTotalScore(trackIdsWithVars, weights)
		console.log(trackIdsWithWeights)

		//TODO: Sort based on total score in trackIdsWithWeights
		let sorted_tracks = sort(trackIdsWithVars, 1);
		res.send(JSON.stringify(sorted_tracks));
	}).catch((err) => {
		console.log(err);
	})
})

//As of now, this just sorts on tempo
function sort(tracks, index){
	var sort_index = index;
	var sorted_array = tracks.sort(function(a, b) {
		return a[sort_index][0] > b[sort_index][0] ? 1: -1;
	});
	var song_array = [];
	for (var i = 0; i < sorted_array.length;i++){
		var song = sorted_array[i][0];
		song_array.push(song);
	}
	return song_array;
}

function calculateTotalScore(trackIdsWithVars, weights) {
	let trackIdsWithWeights = []
	let track = 0
	let score = 0
	let trackValues = []
	let pushItem = []
	for (tuple in trackIdsWithVars) {
		track = trackIdsWithVars[tuple][0]
		trackValues = trackIdsWithVars[tuple][1]
		for (value in trackValues) {
			score += (trackValues[value] * weights[value])
		}
		pushItem = [track, score]
		trackIdsWithWeights.push(pushItem)
		score = 0;
	}
	return trackIdsWithWeights
}

async function appendAudioFeatures(trackIds, sortingParams) {
	let headers = {
		'Authorization': authToken,
		'Content-Type': 'application/json',
		'Content-Length': 0
	}
	let trackIdsWithVars = []
	// let trackIdsWithVars = {}
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

// async function appendAudioFeatures(trackIds) {
// 	let headers = 
//   	{
// 		'Authorization' : authToken,
// 		'Content-Type': 'application/json',
//       	'Content-Length': '0'
// 	}
// 	let trackIdsWithVars = []
// 	for (track in trackIds) {
// 		const url = "https://api.spotify.com/v1/audio-features/" + trackIds[track];
// //		const url = getUrl("/audio-analysis/" + track);
// //		console.log(track)
// 		await fetch(url, {method: 'GET', headers: headers}).then(response => response.json())
// 		.then((data) => {
// //			console.log(data);
// 			trackIdsWithVars.push([trackIds[track], data["tempo"]])
// 		}).catch((err) => {
// 			console.log(err)
// 		})
// 	}
// 	return trackIdsWithVars
// }

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


// init spotify config
// const spClientCallback = process.env.SPOTIFY_CLIENT_CALLBACK;
// const authString = Buffer.from(spClientId+':'+spClientSecret).toString('base64');
// const authHeader = Basic ${authString};
// const spotifyEndpoint = 'https://accounts.spotify.com/api/token';

// // encryption
// const encSecret = process.env.ENCRYPTION_SECRET;
// const encMethod = process.env.ENCRYPTION_METHOD || "aes-256-ctr";
// const encrypt = (text) => {
// 	const aes = crypto.createCipher(encMethod, encSecret);
// 	let encrypted = aes.update(text, 'utf8', 'hex');
// 	encrypted += aes.final('hex');
// 	return encrypted;
// };
// const decrypt = (text) => {
// 	const aes = crypto.createDecipher(encMethod, encSecret);
// 	let decrypted = aes.update(text, 'hex', 'utf8');
// 	decrypted += aes.final('utf8');
// 	return decrypted;
// };

// // handle sending POST request
// function postRequest(url, data={}) {
// 	return new Promise((resolve, reject) => {
// 		// build request data
// 		url = new URL(url);
// 		const reqData = {
// 			protocol: url.protocol,
// 			hostname: url.hostname,
// 			port: url.port,
// 			path: url.pathname,
// 			method: 'POST',
// 			headers: {
// 				'Authorization': authHeader,
// 				'Content-Type': 'application/x-www-form-urlencoded'
// 			}
// 		}

// 		// create request
// 		const req = https.request(reqData, (res) => {
// 			// build response
// 			let buffers = [];
// 			res.on('data', (chunk) => {
// 				buffers.push(chunk);
// 			});

// 			res.on('end', () => {
// 				// parse response
// 				let result = null;
// 				try {
// 					result = Buffer.concat(buffers);
// 					result = result.toString();
// 					var contentType = res.headers['content-type'];
// 					if(typeof contentType == 'string') {
// 						contentType = contentType.split(';')[0].trim();
// 					}
// 					if(contentType == 'application/x-www-form-urlencoded') {
// 						result = QueryString.parse(result);
// 					}
// 					else if(contentType == 'application/json') {
// 						result = JSON.parse(result);
// 					}
// 				}
// 				catch(error) {
// 					error.response = res;
// 					error.data = result;
// 					reject(error);
// 					return;
// 				}
// 				resolve({response: res, result: result});
// 			});
// 		});

// 		// handle error
// 		req.on('error', (error) => {
// 			reject(error);
// 		});

// 		// send
// 		data = QueryString.stringify(data);
// 		req.write(data);
// 		req.end();
// 	});
// }

// // support form body
// app.use(express.urlencoded({extended: false}));

// /**
//  * Swap endpoint
//  * Uses an authentication code on body to request access and refresh tokens
//  */
// app.post('/swap', async (req, res) => {
// 	try {
// 		// build request data
// 		const reqData = {
// 			grant_type: 'authorization_code',
// 			redirect_uri: spClientCallback,
// 			code: req.body.code
// 		};

// 		// get new token from Spotify API
// 		const { response, result } = await postRequest(spotifyEndpoint, reqData);

// 		// encrypt refresh_token
// 		if (result.refresh_token) {
// 			result.refresh_token = encrypt(result.refresh_token);
// 		}

// 		// send response
// 		res.status(response.statusCode).json(result);
// 	}
// 	catch(error) {
// 		if(error.response) {
// 			res.status(error.response.statusCode);
// 		}
// 		else {
// 			res.status(500);
// 		}
// 		if(error.data) {
// 			res.send(error.data);
// 		}
// 		else {
// 			res.send("");
// 		}
// 	}
// });

// /**
//  * Refresh endpoint
//  * Uses the refresh token on request body to get a new access token
//  */
// app.post('/refresh', async (req, res) => {
// 	try {
// 		// ensure refresh token parameter
// 		if (!req.body.refresh_token) {
// 			res.status(400).json({error: 'Refresh token is missing from body'});
// 			return;
// 		}

// 		// decrypt token
// 		const refreshToken = decrypt(req.body.refresh_token);
// 		// build request data
// 		const reqData = {
// 			grant_type: 'refresh_token',
// 			refresh_token: refreshToken
// 		};
// 		// get new token from Spotify API
// 		const { response, result } = await postRequest(spotifyEndpoint, reqData);

// 		// encrypt refresh_token
// 		if (result.refresh_token) {
// 			result.refresh_token = encrypt(result.refresh_token);
// 		}

// 		// send response
// 		res.status(response.statusCode).json(result);
// 	}
// 	catch(error) {
// 		if(error.response) {
// 			res.status(error.response.statusCode);
// 		}
// 		else {
// 			res.status(500);
// 		}
// 		if(error.data) {
// 			res.send(error.data);
// 		}
// 		else {
// 			res.send("");
// 		}
// 	}
// });

// start server
app.listen(port || 3200, () => {
	console.log(`Server is listening on port ${port}`);
})