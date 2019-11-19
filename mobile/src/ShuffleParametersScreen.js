import React, {Component} from 'react';
import { Alert, Platform, StyleSheet, Text, View, SafeAreaView, Picker, TouchableOpacity} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationEvents } from 'react-navigation';

type Props = {};


export default class ShuffleParametersScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      playlistObject: this.props.navigation.getParam("playlistObject", {}),
      pickerItems: [],
    }
  }


  submitForm = () => {
      this.props.navigation.navigate('shuffleParameters', {playlistObject: this.state.playlistObject});
  }


  componentWillMount () {
      let items = this.state.playlists;
      let pickerItems = items.map((a, i) => {
        return {value: items[i].name}
      })
      this.setState({
        pickerItems: pickerItems,
      })
  }


  categoryValueChange = itemValue => {
    if (itemValue !== "") {
      this.setState({category: itemValue});
    }
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 50, alignSelf:"stretch", justifyContent:"flex-end"}}>
          <Text style={styles.maintenanceForm}>Select Playlist</Text>
        </View>
        <View style={{paddingLeft: 6, flex: 162, alignSelf:"stretch", justifyContent:"space-around"}}>
          <Dropdown label='Playlist' onChangeText={(itemValue, itemIndex) => this.categoryValueChange(itemValue)} data={this.state.pickerItems}/>
        </View>
        <View style={{flex: 210, alignSelf:"stretch", justifyContent:"flex-start"}}></View>
        <View style={{flex: 150, alignSelf:"stretch", justifyContent:"center", alignItems: "center"}}>
          <TouchableOpacity style={styles.submitButton} disabled={!(this.state.category !== "")} onPress={ this.submitForm }>
            <View style={{flex: 1, alignSelf:"stretch", justifyContent: 'center', alignItems: 'center'}}>
              <Text style = {styles.buttontext}>SUBMIT</Text>
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
  button:{
    alignItems: 'center',
    height: 100,
    width: 200,
  },
  buttontext: {
    // fontFamily: "OpenSans",
    width:"100%",
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
    backgroundColor: "#df5434"
  },
  maintenanceForm: {
    height: 22,
    // fontFamily: "OpenSans",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#df5434"
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
