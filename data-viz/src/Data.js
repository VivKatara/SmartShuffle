import React from 'react';
import './App.css';
//config firebase 
var firebase = require('firebase'); 

//let playlistRef = admin.database().ref("playlistRef");
//let playlistRef = db.ref("playlistRef");

var config = {
  apiKey: "ZR7L2UB8W6VfS5swH4DZ0aWoqtJfZqCAplhgJv3q", // redacted key
  databaseURL: "https://smartshuffle.firebaseio.com",
  projectId: "smartshuffle",
};

var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.firestore(); 

// Attach an asynchronous callback to read the data at our posts reference

class Data extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { 
	  	playlists: [], 
	  	artists: []
	  };
	  //this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		console.log('hello world!'); 
		db.collection("playlistRef")
	    .get()
	    .then(querySnapshot => {
	      const data = querySnapshot.docs.map(doc => doc.data());
	      console.log(data);
	      this.setState({ playlists: data });
	    });
	    console.log(this.state.playlists); 
	}

   render() {
      return (
         <div>
         
         </div>

      );
   }
}

export default Data; 