# SmartShuffle application
#### CPSC 376 Project 
#####  Max Model, Jalen Gabbidon, Johan Todi, Vivek Katara, and Lea Sparkman 

Smart Shuffle is an application that allows users to sign in with their Spotify, select a playlist, and "smart shuffle" their playlist based on a set of parameters, such as danceability, energy, tempo, valence, etc. Users can select a "peak" time, where the playlist should reach its highest energy point, and our application will shuffle the playlist in that order. 

## Frontend - React Native App 

#### Starting the App (after installing React Native) 
* This assumes you have XCode properly installed.
* run `pod install` from `mobile/ios/` directory 
* run `react-native run-ios` from `mobile/` directory

## Backend - shuffle microservice 
* run `yarn`
* run `node routes.js` from `./` root directory 
* or visit our live endpoint [here](https://frightful-barrow-37052.herokuapp.com/)

## Data Visualization 
* run `yarn` 
* run `yarn start`

Our data visualization site is also [live here](https://smartshuffle.web.app/), hosted on Firebase. 

### Our data: Firebase/Cloud Firestore 

Our data is stored in Firebase. We have given our TA (Justin Shi) access to our account, so he can view our implementation and the data that is stored there. The database will update each time a user shuffles a new playlist. This change can be seen live from the Firebase console. Our project console can be found [here](https://console.firebase.google.com/u/0/project/smartshuffle/database/firestore). 


