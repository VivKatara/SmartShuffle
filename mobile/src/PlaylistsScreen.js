import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, SafeAreaView, Picker, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationEvents } from 'react-navigation';


export default class PlaylistsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: "",
      playlists: this.props.navigation.getParam("playlists", []),
      playlistIdDictionary: {},
      pickerItems: [],
    }
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
    let object = { "id": this.state.playlistIdDictionary[this.state.playlistName], "name": this.state.playlistName }
    this.setState({
      playlistObject: object,
    })
    console.log(object);
    this.props.navigation.navigate('shuffleParameters', { playlist: object });
  }





  categoryValueChange = itemValue => {
    if (itemValue !== "") {
      this.setState({ playlistName: itemValue });
    }
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 50, alignSelf: "stretch", justifyContent: "flex-end" }}>
          <Text style={styles.maintenanceForm}>Select Playlist</Text>
        </View>
        <View style={{ paddingLeft: 6, flex: 162, alignSelf: "stretch", justifyContent: "space-around" }}>
          <Dropdown label='Playlist' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(itemValue)} data={this.state.pickerItems} />
        </View>
        <View style={{ flex: 210, alignSelf: "stretch", justifyContent: "flex-start" }}></View>
        <View style={{ flex: 150, alignSelf: "stretch", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={styles.submitButton} disabled={!(this.state.playlistName !== "")} onPress={this.selectPlaylist}>
            <View style={{ flex: 1, alignSelf: "stretch", justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.buttontext}>SUBMIT</Text>
            </View>
          </TouchableOpacity>
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
