
import React, { PureComponent } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import Spotify from 'rn-spotify-sdk';


export default class PlayerScreen extends PureComponent {
	static navigationOptions = {
		title: 'Player',
	};

	constructor(props) {
		super(props);

		this.state = {
			spotifyUserName: null,
			songIDs: ["0PkpRtJqrwuXhbdtJuQm7E", "2YodwKJnbPyNKe8XXSE9V7"], //this.props.navigation.getParam("songIDs", []),

			currentSongIndex: 0,
		};

		this.spotifyLogoutButtonWasPressed = this.spotifyLogoutButtonWasPressed.bind(this);
	}

	componentDidMount() {
		// send api request to get user info
		Spotify.getMe().then((result) => {
			// update state with user info
			this.setState({ spotifyUserName: result.display_name });
			// play song
			Spotify.addListener('audioDeliveryDone', () => {
				this.playSong(this.state.currentSongIndex + 1)
			});

		});
	}

	playSong(index) {
		this.setState({ currentSongIndex: index });
		Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex], 0, 0)
			.then(() => { console.log('PLAYING') }).catch((error) => { Alert.alert('error', error); });
	}

	goToInitialScreen() {
		this.props.navigation.navigate('initial');
	}

	spotifyLogoutButtonWasPressed() {
		Spotify.logout().finally(() => {
			this.goToInitialScreen();
		});
	}

	render() {
		const songNames = this.state.songIDs
		const songs = []
		for (const [index, value] of songNames.entries()) {
			songs.push(
				<TouchableOpacity key={index} style={styles.rectangle} onPress={() => { this.playSong(index) }}>
					<View style={{ flex: 1, marginLeft: "5%", justifyContent: 'center', alignItems: 'flex-start' }}>
						<Text style={styles.title}>{value}</Text>
					</View>
				</TouchableOpacity>
			)
		}

		return (
			<View style={styles.container}>
				<View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
				</View>
				<ScrollView style={{ flex: 9, alignSelf: 'stretch' }} contentInsetAdjustmentBehavior="automatic">
					{songs}
				</ScrollView>
				<View style={{ height: 70, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableHighlight onPress={this.spotifyLogoutButtonWasPressed}>
						<Text>Logout</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
		backgroundColor: '#F5FCFF',
	},
	greeting: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	rectangle: {
		elevation: 5,
		marginLeft: "5.56%",
		marginTop: "1.39%",
		marginBottom: "1.39%",
		width: "88.89%",
		height: 80,
		borderRadius: 8,
		backgroundColor: "#fff",
		shadowColor: "#a2aabc",
		shadowOffset: {
			width: 0,
			height: -1
		},
		shadowRadius: 6,
		shadowOpacity: 1,
	},
	title: {
		fontSize: 20,
		color: "#1DB954",
	}
});
