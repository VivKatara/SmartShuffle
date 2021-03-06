import React, { Component } from 'react';
import { Alert, ScrollView, Platform, StyleSheet, Text, View, SafeAreaView, Picker, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationEvents } from 'react-navigation';
import { ActivityIndicator, Avatar, IconButton, Appbar, Card } from 'react-native-paper';
import { Slider } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';



export default class ShuffleParametersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistObject: this.props.navigation.getParam("playlist", []),
      tempo: 0.5,
      energy: 0.5,
      danceability: 0.5,
      instrumentalness: 0.5,
      liveness: 0.5,
      loudness: 0.5,
      speechiness: 0.5,
      valence: 0.5,
      acousticness: 0.5,
      pickerItems: [],
      genreName: "",
      showSpinner: false,
    }
    this.spotifyLogoutButtonWasPressed = this.spotifyLogoutButtonWasPressed.bind(this);
  }

  componentDidMount () {
      let items = ["Indie/Alternative", "Electro-Pop", "Rap", "Hip Hop", "Deep Haus", "R&B", "Soul", "Rock"];
      let pickerItems = items.map((a, i) => {
        return {value: items[i]}
      })
      console.log("PICKER ITEMS!!!!", pickerItems)
      this.setState({
        pickerItems: pickerItems,
      })
      console.log(this.state.playlistObject)
  }


  categoryValueChange = itemValue => {
    if (itemValue !== "") {
      this.setState({ genreName: itemValue });
    }
  }

  getSortedPlaylist = async () => {
    let request = "https://frightful-barrow-37052.herokuapp.com/smartshuffle?"
      + "tempo=" + this.state.tempo * 10
      + "&danceability=" + this.state.danceability * 10
      + "&instrumentalness=" + this.state.instrumentalness * 10
      + "&peak=" + this.state.energy * 10
      + "&liveness=" + this.state.liveness * 10
      + "&loudness=" + this.state.loudness * 10
      + "&speechiness=" + this.state.speechiness * 10
      + "&valence=" + this.state.valence * 10
      + "&acousticness=" + this.state.acousticness * 10
      + "&playlistId1=" + this.state.playlistObject[0].id
      + "&playlistId2=" + this.state.playlistObject[1].id
      + "&playlistId3=" + this.state.playlistObject[2].id
      + "&token=" + global.accessToken; //"BQAbXo6mvZz-RqP7RXcSk7WEUe2zxApUwN2gZvgmhWSLiE5o6vPsXixY9xVf5witUncu37yM9ehnGv4GgirjI9eqT8d6V5m58JuKqcyDIMlSRHtdDnXg3BhOca4MLsRVHRAG5K4YomGpv6qrDGxRFb2E7xWOIFXqoGl4PMdvnEQMBCCJQACJhdpHzcYiGpqku4mQLYC78w";


      this.setState({ showSpinner: true});

      const response = await fetch(request);
      const songs = await response.json();

      console.log(songs);
      this.setState({ showSpinner: false});
      this.props.navigation.navigate('player', { songIDs: songs });
  }


  spotifyLogoutButtonWasPressed() {
    Spotify.logout().finally(() => {
      this.goToInitialScreen();
    });
  }

  goToInitialScreen() {
    this.props.navigation.navigate('initial');
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 80, alignSelf:"stretch", justifyContent:"center"}}>
          <Text style={styles.maintenanceForm}>Shuffle Parameters: </Text>
        </View>
        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }} contentInsetAdjustmentBehavior="automatic">
        <View style={{ paddingLeft: 6, flex: 180, alignSelf: "stretch", justifyContent: "space-around" }}>
          <Text>Tempo: {this.state.tempo}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.tempo * 100) / 100}
            onValueChange={tempo => this.setState({ tempo: Math.round(tempo * 100) / 100 })}
          />
          <Text>Energy: {this.state.energy}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.energy * 100) / 100}
            onValueChange={energy => this.setState({ energy: Math.round(energy * 100) / 100 })}
          />
          {this.state.showSpinner && <ActivityIndicator style={{ paddingBottom: 0, flex: 1, justifyContent: 'center' }} size={76} color="#1DB954" animating={this.state.showSpinner} />}
          <Text>Danceability: {this.state.danceability}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.danceability * 100) / 100}
            onValueChange={danceability => this.setState({ danceability: Math.round(danceability * 100) / 100 })}
          />
          <Text>Instrumentalness: {this.state.instrumentalness}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.instrumentalness * 100) / 100}
            onValueChange={instrumentalness => this.setState({ instrumentalness: Math.round(instrumentalness * 100) / 100 })}
          />
          <Text>Valence: {this.state.valence}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.valence * 100) / 100}
            onValueChange={valence => this.setState({ valence: Math.round(valence * 100) / 100 })}
          />
          <Text>Speechiness: {this.state.speechiness}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.speechiness * 100) / 100}
            onValueChange={speechiness => this.setState({ speechiness: Math.round(speechiness * 100) / 100 })}
          />
          <Text>Loudness: {this.state.loudness}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.loudness * 100) / 100}
            onValueChange={loudness => this.setState({ loudness: Math.round(loudness * 100) / 100 })}
          />
          <Text>Liveness: {this.state.liveness}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.liveness * 100) / 100}
            onValueChange={liveness => this.setState({ liveness: Math.round(liveness * 100) / 100 })}
          />
          <Text>Acousticness: {this.state.acousticness}</Text>
          <Slider
            thumbTintColor="#1DB954"
            value={Math.round(this.state.acousticness * 100) / 100}
            onValueChange={acousticness => this.setState({ acousticness: Math.round(acousticness * 100) / 100 })}
          />
          <View style={{ paddingLeft: 6, height: 30, alignSelf: "stretch", justifyContent: "space-around" }}></View>
        </View>
        </ScrollView>
        <View style={{ height: 150, alignSelf: "stretch", justifyContent: "center", alignItems: "center" }}>
            <View style={{flex: 50, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity  style={styles.submitButton} onPress={this.getSortedPlaylist}>
                <View style={{flex: 1, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {styles.buttontext}>SHUFFLE</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex: 20, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
                <TouchableHighlight onPress={this.spotifyLogoutButtonWasPressed}>
                    <Text>Logout</Text>
                </TouchableHighlight>
            </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 24
  },
  button: {
    alignItems: 'center',
    height: 100,
    width: 200,
  },
  buttontext: {
    // fontFamily: "OpenSans",
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff"
  },
  submitButton: {
    width: 254,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#1DB954"
  },
  maintenanceForm: {
    // fontFamily: "OpenSans",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#1DB954"
  },
  categoryTitle: {
    height: 19,
    // fontFamily: "OpenSans",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#5f5151"
  }
});
