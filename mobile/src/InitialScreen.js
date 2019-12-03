
import React, { PureComponent } from 'react';
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import Spotify from 'rn-spotify-sdk';



export default class InitialScreen extends PureComponent {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			spotifyInitialized: false,
			playlists: []
		};
		this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(this);

	}

	componentDidMount() {
		this.initializeIfNeeded().catch((error) => {
			Alert.alert("Error", error.message);
		});
	}

	goToPlayer = async () => {
		global.accessToken = await Spotify.getSession().accessToken;
		console.log(global.accessToken);
		await this.getPlaylists();
		this.props.navigation.navigate('playlists', { playlists: this.state.playlists });
	}

	async getPlaylists() {
		const resp = await fetch('https://frightful-barrow-37052.herokuapp.com/getPlaylists?token=' + global.accessToken);
		// playlists is an array of playlist objects
		const playlists = await resp.json();
		console.log(playlists);
		this.setState({
			playlists: playlists
		});
	}

	async initializeIfNeeded() {
		// initialize Spotify if it hasn't been initialized yet
		if (!await Spotify.isInitializedAsync()) {
			// initialize spotify
			const spotifyOptions = {
				"clientID": "65403a2862f143c4ba0afacc991dd700",
				"sessionUserDefaultsKey": "SpotifySession",
				"redirectURL": "smartshuffleapp://smartshuffle",
				"scopes": ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
			};
			const loggedIn = await Spotify.initialize(spotifyOptions);
			// update UI state
			this.setState({
				spotifyInitialized: true
			});
			// handle initialization
			if (loggedIn) {
				this.goToPlayer();
			}
		}
		else {
			// update UI state
			this.setState({
				spotifyInitialized: true
			});
			// handle logged in
			if (await Spotify.isLoggedInAsync()) {
				this.goToPlayer();
			}
		}
	}

	spotifyLoginButtonWasPressed() {
		// log into Spotify
		Spotify.login().then((loggedIn) => {
			if (loggedIn) {
				// logged in
				this.goToPlayer();
			}
			else {
				// cancelled
			}
		}).catch((error) => {
			// error
			Alert.alert("Error", error.message);
		});
	}

	render() {
		if (!this.state.spotifyInitialized) {
			return (
				<View style={styles.container}>
					<ActivityIndicator animating={true} style={styles.loadIndicator}>
					</ActivityIndicator>
					<Text style={styles.loadMessage}>
						Loading...
					</Text>
				</View>
			);
		}
		else {
			return (
				<View style={styles.container}>
					<View style={{ flex: 100, alignItems: 'center', alignSelf: "stretch", justifyContent: "flex-end" }}>
		          		<Text style={styles.maintenanceForm}>SmartShuffle</Text>
		        	</View>
					<View style={{ flex: 120, alignItems: 'center', alignSelf: "stretch", justifyContent: "flex-end" }}>
					</View>
					<View style={{ flex: 300, alignItems: 'center', alignSelf: "stretch", justifyContent: "flex-start" }}>
						<Text style={styles.greeting}>
							Hey! You! Log into your spotify
						</Text>
						<TouchableHighlight onPress={this.spotifyLoginButtonWasPressed} style={styles.spotifyLoginButton}>
							<Text style={styles.spotifyLoginButtonText}>Log into Spotify</Text>
						</TouchableHighlight>
					</View>
				</View>
			);
		}
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		paddingLeft: 20,
        paddingRight: 24
	},
	maintenanceForm: {
      // fontFamily: "OpenSans",
      fontSize: 35,
      fontWeight: "normal",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#1DB954"
    },

	loadIndicator: {
		//
	},
	loadMessage: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},

	spotifyLoginButton: {
		justifyContent: 'center',
		borderRadius: 18,
		backgroundColor: 'green',
		overflow: 'hidden',
		width: 200,
		height: 40,
		margin: 20,
	},
	spotifyLoginButtonText: {
		fontSize: 20,
		textAlign: 'center',
		color: 'white',
	},

	greeting: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
});
