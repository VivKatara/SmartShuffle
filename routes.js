// npm deps
const express = require('express');
const https = require('https');
const fetch = require('node-fetch'); 
const crypto = require('crypto');
const { URL } = require('url');
const QueryString = require('querystring');
const playlist_response = require('./sample_response.js')

const {spClientId, spClientSecret, spBaseUrl, authToken, port} = require('./config');

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


app.get('/getPlaylists', function (req, res) {
  console.log("trying to get some songs", req.query.token); 
  let request = "https://api.spotify.com/v1/me/playlists";
  let headers = 
  {
    	'Authorization' : 'Bearer ' + req.query.token,
      'Content-Type': 'application/json',
      'Content-Length': '0'
      // 'Content-Type': 'application/x-www-form-urlencoded',
}

   fetch(request, { 'headers': headers})
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


// init spotify config
const spClientCallback = process.env.SPOTIFY_CLIENT_CALLBACK;
const authString = Buffer.from(spClientId+':'+spClientSecret).toString('base64');
const authHeader = Basic ${authString};
const spotifyEndpoint = 'https://accounts.spotify.com/api/token';

// encryption
const encSecret = process.env.ENCRYPTION_SECRET;
const encMethod = process.env.ENCRYPTION_METHOD || "aes-256-ctr";
const encrypt = (text) => {
	const aes = crypto.createCipher(encMethod, encSecret);
	let encrypted = aes.update(text, 'utf8', 'hex');
	encrypted += aes.final('hex');
	return encrypted;
};
const decrypt = (text) => {
	const aes = crypto.createDecipher(encMethod, encSecret);
	let decrypted = aes.update(text, 'hex', 'utf8');
	decrypted += aes.final('utf8');
	return decrypted;
};

// handle sending POST request
function postRequest(url, data={}) {
	return new Promise((resolve, reject) => {
		// build request data
		url = new URL(url);
		const reqData = {
			protocol: url.protocol,
			hostname: url.hostname,
			port: url.port,
			path: url.pathname,
			method: 'POST',
			headers: {
				'Authorization': authHeader,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}

		// create request
		const req = https.request(reqData, (res) => {
			// build response
			let buffers = [];
			res.on('data', (chunk) => {
				buffers.push(chunk);
			});

			res.on('end', () => {
				// parse response
				let result = null;
				try {
					result = Buffer.concat(buffers);
					result = result.toString();
					var contentType = res.headers['content-type'];
					if(typeof contentType == 'string') {
						contentType = contentType.split(';')[0].trim();
					}
					if(contentType == 'application/x-www-form-urlencoded') {
						result = QueryString.parse(result);
					}
					else if(contentType == 'application/json') {
						result = JSON.parse(result);
					}
				}
				catch(error) {
					error.response = res;
					error.data = result;
					reject(error);
					return;
				}
				resolve({response: res, result: result});
			});
		});

		// handle error
		req.on('error', (error) => {
			reject(error);
		});

		// send
		data = QueryString.stringify(data);
		req.write(data);
		req.end();
	});
}

// support form body
app.use(express.urlencoded({extended: false}));

/**
 * Swap endpoint
 * Uses an authentication code on body to request access and refresh tokens
 */
app.post('/swap', async (req, res) => {
	try {
		// build request data
		const reqData = {
			grant_type: 'authorization_code',
			redirect_uri: spClientCallback,
			code: req.body.code
		};

		// get new token from Spotify API
		const { response, result } = await postRequest(spotifyEndpoint, reqData);

		// encrypt refresh_token
		if (result.refresh_token) {
			result.refresh_token = encrypt(result.refresh_token);
		}

		// send response
		res.status(response.statusCode).json(result);
	}
	catch(error) {
		if(error.response) {
			res.status(error.response.statusCode);
		}
		else {
			res.status(500);
		}
		if(error.data) {
			res.send(error.data);
		}
		else {
			res.send("");
		}
	}
});

/**
 * Refresh endpoint
 * Uses the refresh token on request body to get a new access token
 */
app.post('/refresh', async (req, res) => {
	try {
		// ensure refresh token parameter
		if (!req.body.refresh_token) {
			res.status(400).json({error: 'Refresh token is missing from body'});
			return;
		}

		// decrypt token
		const refreshToken = decrypt(req.body.refresh_token);
		// build request data
		const reqData = {
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		};
		// get new token from Spotify API
		const { response, result } = await postRequest(spotifyEndpoint, reqData);

		// encrypt refresh_token
		if (result.refresh_token) {
			result.refresh_token = encrypt(result.refresh_token);
		}

		// send response
		res.status(response.statusCode).json(result);
	}
	catch(error) {
		if(error.response) {
			res.status(error.response.statusCode);
		}
		else {
			res.status(500);
		}
		if(error.data) {
			res.send(error.data);
		}
		else {
			res.send("");
		}
	}
});

// start server
app.listen(port || 3200, () => {
	console.log(Server is listening on port ${port});
})