
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
			currentSongIndex: 0,
			pause: false,
			songIDs: this.props.navigation.getParam("songIDs", ["song1","song2","song3"]),
		};

		this.spotifyLogoutButtonWasPressed = this.spotifyLogoutButtonWasPressed.bind(this);
		this.playNext = this.playNext.bind(this);
		this.playPrev = this.playPrev.bind(this);
		this.playPause = this.playPause.bind(this);
	}

	componentDidMount() {
		// send api request to get user info
		Spotify.getMe().then((result) => {
			// update state with user info
			this.setState({ spotifyUserName: result.display_name });
			// play song
			Spotify.addListener('audioDeliveryDone', () => {
				this.playSong(this.state.currentSongIndex + 1);
				console.log("fired");
			});

		});
	}

	playSong(index) {
		console.log(index);
		this.setState({ currentSongIndex: index });
		Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
			.then(() => { Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
				.then(() => { console.log('PLAYING') }).catch((error) => { Alert.alert('error', error); }); }).catch((error) => { Alert.alert('error', error); });
		this.setState({ pause: false });
	}

	goToInitialScreen() {
		this.props.navigation.navigate('initial');
	}

	spotifyLogoutButtonWasPressed() {
		Spotify.logout().finally(() => {
			this.goToInitialScreen();
		});
	}


	playNext() {
		let current = this.state.currentSongIndex;
		var next = 0;
		if (current + 1 < this.state.songIDs.length) {
			next = current + 1;
		}

		this.setState({ currentSongIndex: next });
		Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
			.then(() => { Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
				.then(() => { console.log('PLAYING') }).catch((error) => { Alert.alert('error', error); }); }).catch((error) => { Alert.alert('error', error); });
		this.setState({ pause: false });
	}

	playPrev() {
		let current = this.state.currentSongIndex;
		var next = this.state.songIDs.length - 1;
		if (current - 1 > 0) {
			next = current - 1;
		}

		this.setState({ currentSongIndex: next });
		Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
			.then(() => { Spotify.playURI("spotify:track:" + this.state.songIDs[this.state.currentSongIndex][0], 0, 0)
				.then(() => { console.log('PLAYING') }).catch((error) => { Alert.alert('error', error); }); }).catch((error) => { Alert.alert('error', error); });
		this.setState({ pause: false });
	}


	playPause() {
		let pause = this.state.pause;
		this.setState({ pause: !pause });
		if (!pause) {
			Spotify.setPlaying(false);
		}
		else {
			Spotify.setPlaying(true);
		}
	}


	render() {
		const songNames = this.state.songIDs
		const songs = []
		for (const [index, value] of songNames.entries()) {
			songs.push(
				<TouchableOpacity key={index} style={styles.rectangle} onPress={() => { this.playSong(index) }}>
					<View style={{backgroundColor: this.state.currentSongIndex == index ? "df5434" : "#fff", height:80, marginLeft:"5%", alignSelf:'stretch', justifyContent: 'center', alignItems: 'center'}}>
						<Text style={styles.title}>{value[1]}</Text>
						<Text style={styles.artist}>{value[2]}</Text>
					</View>
				</TouchableOpacity>
			)
		}

		return (
			<View style={styles.container}>
				<View style={{ height: 70, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={styles.header}>{this.state.songIDs[this.state.currentSongIndex][1] + " - " + this.state.songIDs[this.state.currentSongIndex][2]}</Text>
				</View>
				<ScrollView style={{ flex: 9, alignSelf: 'stretch' }} contentInsetAdjustmentBehavior="automatic">
					{songs}
				</ScrollView>
				<View style={{ height: 70, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ flex:1, flexDirection:"row", justifyContent: 'space-around', alignItems: 'center' }}>
						<TouchableHighlight style={{paddingLeft:50}} onPress={this.playPrev}>
							<Text style={styles.but}> {"<<"} </Text>
						</TouchableHighlight>
						<View style={{ flex:1, flexDirection:"row", justifyContent: 'space-around', alignItems: 'center' }}></View>
						<TouchableHighlight onPress={this.playPause}>
							<Text style={styles.but2}>Play/Pause</Text>
						</TouchableHighlight>
						<View style={{ flex:1, flexDirection:"row", justifyContent: 'space-around', alignItems: 'center' }}></View>
						<TouchableHighlight style={{paddingRight:50}}onPress={this.playNext}>
							<Text style={styles.but}> >> </Text>
						</TouchableHighlight>
					</View>
				</View>
				<View style={{ height: 32, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableHighlight onPress={this.spotifyLogoutButtonWasPressed}>
						<Text>Home</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	but: {
		fontSize: 30
	},
	but2: {
		fontSize: 24
	},
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
      shadowColor: "#1DB954",
      shadowOffset: {
        width: 0,
        height: -1
      },
      shadowRadius: 6,
      shadowOpacity: 1,
   },
   header: {
	   fontSize:25,
	   paddingTop:4,
	   color:"#000000",
   },
   title: {
	   fontSize:17,
	   color:"#1DB954",
   },
   artist: {
	   fontSize:12,
	   color:"#1DB954",
	   paddingTop:3.5,
   }
});
