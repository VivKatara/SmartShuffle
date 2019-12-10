import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, SafeAreaView, Picker, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationEvents, StackActions } from 'react-navigation';
import Spotify from 'rn-spotify-sdk';

export default class PlaylistsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: "",
      playlistName2: "",
      playlistName3: "",
      playlists: this.props.navigation.getParam("playlists", []),
      playlistIdDictionary: {},
      pickerItems: [],
    }
    this.spotifyLogoutButtonWasPressed = this.spotifyLogoutButtonWasPressed.bind(this);
  }

  componentDidMount() {
    let items = this.state.playlists;
    console.log(this.state.playlists);
    //console.log(items);
    let array = [];
    let dict = {};
    this.state.playlists.forEach(pl => {
      let name = pl.name;
      let picker = { value: pl.name };
      array.push(picker);
      dict[name] = pl.id;
    });
    this.setState({ pickerItems: array });
    this.setState({ playlistIdDictionary: dict });
    console.log(array);
  }


  selectPlaylist = () => {
    // Get playlist ID given name and pass both to next screen as an object
    let object = [{ "id": this.state.playlistIdDictionary[this.state.playlistName], "name": this.state.playlistName }, { "id": this.state.playlistName2 == "" ? 0 : this.state.playlistIdDictionary[this.state.playlistName2], "name": this.state.playlistName2 }, { "id": this.state.playlistName3 == "" ? 0 : this.state.playlistIdDictionary[this.state.playlistName3], "name": this.state.playlistName3 }]
    this.setState({
      playlistObject: object,
    })
    console.log(object);
    this.props.navigation.navigate('shuffleParameters', { playlist: object });
  }





  categoryValueChange = (pnumber, itemValue) => {
    if (itemValue !== "") {
        if (pnumber == 1) {
            this.setState({ playlistName: itemValue });
        }
        if (pnumber == 2) {
            this.setState({ playlistName2: itemValue });
        }
        if (pnumber == 3) {
            this.setState({ playlistName3: itemValue });
        }
    }
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
        <View style={{ flex: 50, alignSelf: "stretch", justifyContent: "flex-end" }}>
          <Text style={styles.maintenanceForm}>Select Playlists</Text>
        </View>
        <View style={{ paddingLeft: 6, flex: 162, alignSelf: "stretch", justifyContent: "space-around" }}>
          <View style={{height:100}}></View>
          <Dropdown label='Playlist 1' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(1, itemValue)} data={this.state.pickerItems} />
          <View style={{height:130}}></View>
          <Dropdown label='Playlist 2' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(2, itemValue)} disabled={this.state.playlistName == ""} data={this.state.pickerItems} />
          <View style={{height:130}}></View>
          <Dropdown label='Playlist 3' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(3, itemValue)} disabled={this.state.playlistName2 == ""} data={this.state.pickerItems} />
        </View>
        <View style={{ flex: 210, alignSelf: "stretch", justifyContent: "flex-start" }}></View>
        <View style={{ flex: 150, alignSelf: "stretch", justifyContent: "center", alignItems: "center" }}>
            <View style={{flex: 50, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={styles.submitButton} disabled={!(this.state.playlistName !== "")} onPress={this.selectPlaylist}>
                    <View style={{ flex: 1, alignSelf: "stretch", justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.buttontext}>SUBMIT</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
            </View>
            <View style={{flex: 50, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
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
    fontSize: 22,
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
