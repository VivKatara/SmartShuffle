import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, SafeAreaView, Picker, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationEvents } from 'react-navigation';
import { ActivityIndicator } from 'react-native-paper';
import { Slider } from 'react-native-elements';



export default class ShuffleParametersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistObject: this.props.navigation.getParam("playlist", {}),
      tempo: 0.5,
      energy: 0.5,
      danceability: 0.5,
      instrumentalness: 0.5,
      pickerItems: [],
      genreName: "",
      showSpinner: false,
    }
  }

  componentWillMount () {
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

  getSortedPlaylist = () => {
    console.log("a submission is happening");
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 50, alignSelf:"stretch", justifyContent:"center"}}>
          <Text style={styles.maintenanceForm}>Shuffle Parameters:  {this.state.playlistObject.name}</Text>
        </View>
        <View style={{paddingLeft: 6, flex: 180, alignSelf:"stretch", justifyContent:"space-around"}}>
            <Text>Tempo: {this.state.tempo}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.tempo * 100 ) / 100}
                onValueChange={tempo => this.setState({ tempo: Math.round( tempo * 100 ) / 100 })}
            />
            <Text>Energy: {this.state.energy}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.energy * 100 ) / 100}
                onValueChange={energy => this.setState({ energy: Math.round( energy * 100 ) / 100 })}
            />

            <ActivityIndicator style={{paddingBottom:30, flex: 1, justifyContent: 'center'  }} size={76} color="#1DB954" animating={this.state.showSpinner}/>
            <Text>Danceability: {this.state.danceability}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.danceability * 100 ) / 100}
                onValueChange={danceability => this.setState({ danceability: Math.round( danceability * 100 ) / 100 })}
            />
            <Text>Instrumentalness: {this.state.instrumentalness}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.instrumentalness * 100 ) / 100}
                onValueChange={instrumentalness => this.setState({ instrumentalness: Math.round( instrumentalness * 100 ) / 100 })}
            />
            <Dropdown label='Genre' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(itemValue)} data={this.state.pickerItems}/>
            <View style={{paddingLeft: 6, height:30, alignSelf:"stretch", justifyContent:"space-around"}}></View>
        </View>
        <View style={{flex: 70, alignSelf:"stretch", justifyContent:"center", alignItems: "center"}}>
          <TouchableOpacity  style={styles.submitButton} disabled={!(this.state.genreName !== "")} onPress={() => {
              this.setState({
                showSpinner: true,
            });

            this.getSortedPlaylist()
            let ok = setTimeout(() => {
                this.setState({
                  showSpinner: false,
              });


              // console.log("got the sorted playlist");
            this.props.navigation.navigate("player");

            }, 5000);
            }}>
            <View style={{flex: 1, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
              <Text style = {styles.buttontext}>SHUFFLE</Text>
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
