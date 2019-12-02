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
      v1: 0.5,
      v2: 0.5,
      v3: 0.5,
      v4: 0.5,
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
      console.log(pickerItems)
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



  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 50, alignSelf:"stretch", justifyContent:"center"}}>
          <Text style={styles.maintenanceForm}>Shuffle Parameters:  {this.state.playlistObject.name}</Text>
        </View>
        <View style={{paddingLeft: 6, flex: 180, alignSelf:"stretch", justifyContent:"space-around"}}>
            <Text>BPM: {this.state.v1}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.v1 * 100 ) / 100}
                onValueChange={v1 => this.setState({ v1: Math.round( v1 * 100 ) / 100 })}
            />
            <Text>Happiness/Mood: {this.state.v2}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.v2 * 100 ) / 100}
                onValueChange={v2 => this.setState({ v2: Math.round( v2 * 100 ) / 100 })}
            />

            <ActivityIndicator style={{paddingBottom:30, flex: 1, justifyContent: 'center'  }} size={76} color="#1DB954" animating={this.state.showSpinner}/>
            <Text>Danceability: {this.state.v3}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.v3 * 100 ) / 100}
                onValueChange={v3 => this.setState({ v3: Math.round( v3 * 100 ) / 100 })}
            />
            <Text>Instrumentation: {this.state.v4}</Text>
            <Slider
                thumbTintColor= "#1DB954"
                value={Math.round( this.state.v4 * 100 ) / 100}
                onValueChange={v4 => this.setState({ v4: Math.round( v4 * 100 ) / 100 })}
            />
            <Dropdown label='Genre' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(itemValue)} data={this.state.pickerItems}/>
            <View style={{paddingLeft: 6, height:30, alignSelf:"stretch", justifyContent:"space-around"}}></View>
        </View>
        <View style={{flex: 70, alignSelf:"stretch", justifyContent:"center", alignItems: "center"}}>
          <TouchableOpacity style={styles.submitButton} disabled={!(this.state.genreName !== "")} onPress={() => {
              this.setState({
                showSpinner: true,
            });
            let ok = setTimeout(() => {
                this.setState({
                  showSpinner: false,
              });
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
