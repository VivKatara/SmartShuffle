# SmartShuffle application
#### CPSC 376 Project 
#####  Max Model, Jalen Gabbidon, Johan Todi, Vivek Katara, and Lea Sparkman 

Smart Shuffle is an application that allows users to sign in with their Spotify, select a playlist, and "smart shuffle" their playlist based on a set of parameters, such as danceability, energy, tempo, valence, etc. Users can select a "peak" time, where the playlist should reach its highest energy point, and our application will shuffle the playlist in that order. 

## Frontend - React Native App 

#### YouTube Demo

https://www.youtube.com/watch?v=B-0ptZ1CBOM


#### Starting the App on iOS Simulator(after installing React Native) 
* NOTE: The react-native-material-dropdown component does not work well with iOS for unknown reasons. To choose a playlist on iOS, you must click at a specific height slightly above the dragdown.
* This assumes you have XCode properly installed.
* Navigate to /mobile/node_modules/rn-spotify-sdk/react-native.config.js and
change the packageImportPath to 'import com.lufinkey.react.spotify.RNSpotifyPackage;'
* run `pod install` from `mobile/ios/` directory 
* run `react-native run-ios` from `mobile/` directory

#### Starting the App on Android Simulator(after installing React Native) 
* This assumes you have an Android Studio Simulator properly installed.
* Instructions on how to setup Android Development Environment can be found at https://facebook.github.io/react-native/docs/getting-started
* Navigate to /mobile/node_modules/rn-spotify-sdk/react-native.config.js and
change the packageImportPath to 'import com.lufinkey.react.spotify.RNSpotifyPackage;'
* Open your Android AVD Emulator
* run `react-native run-android` from `mobile/` directory

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


