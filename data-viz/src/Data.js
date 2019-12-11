import React from 'react';
import './App.css';
import Chart from "react-google-charts";

import styled from "styled-components";

export const Container = styled.div``;
export const Nav = styled.nav``;

//config firebase 
var firebase = require('firebase'); 

const options1 = {
  title: "Most Popular Years",
  pieHole: 0.3,
  is3D: false,
  backgroundColor: { fill:'transparent' },
	hAxis: {
    	textStyle:{color: 'ffffff'}
	},
	titleTextStyle: {
    	color: '#FFF',
		fontSize: 16,
	},
	legend: {textStyle: {color: 'white'}}
};
const options2 = {
  title: "Top Decades",
  pieHole: 0.3,
  is3D: false,
  backgroundColor: { fill:'transparent' },
	hAxis: {
    	textStyle:{color: 'ffffff'}
	},
	titleTextStyle: {
    	color: '#FFF',
		fontSize: 16,
	},
	legend: {textStyle: {color: 'white'}}
};

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
//		console.log('hello world!'); 
		db.collection("metadata")
	    .get()
	    .then(querySnapshot => {
	      const data = querySnapshot.docs.map(doc => doc.data());
			var average_song_length = ((data[2]["songminutes"]/1000)/data[2]["songCount"]).toFixed(2);
			var average_popularity = (data[2]["popularity"]/data[2]["songCount"]).toFixed(2);
			
			var decades = data[0];
			const newdata1 = [
  				["Year", "Playlists"]
			];
			
			Object.keys(decades).forEach(function(key) {
				newdata1.push([key, decades[key]]);
			});
			
			
			const newdata2 = [
  				["Decade", "Playlists"],
				["1980", 23],
				["1990", 43],
				["2000", 18],
				["2010", 32],
			];
			
			const newdata3 = [
				["Decade", "Songs"],
				["< 1990's", 0],
				["1990's", 0],
				["2000's", 0],
				["2010's", 0],
				["> 2020's", 0],
			]
			Object.keys(decades).forEach(function(key) {
				if ( Number(key) < 1990){
					newdata3[1][1] += decades[key];
				} else if ( 1990 < Number(key) && Number(key) < 2000){
					console.log("key:", key);
					newdata3[2][1] += decades[key];
				} else if ( 2000 < Number(key) && Number(key) < 2010){
					newdata3[3][1] += decades[key];
				} else if ( 2010 < Number(key) && Number(key) < 2020){
					newdata3[4][1] += decades[key];
				} else if (Number(key) > 2020){
					newdata3[5][1] += decades[key];
				}
			});
			
			//prepare chart data
	      this.setState({ 
			  playlists: data,
              both_types: false,
              total_success_docs: 43,
			  average_latency: 42,
			  totalplaylists: data[2]["playlistcount"],
			  totalsongs: data[2]["songCount"],
			  average_song_length: average_song_length,
			  average_popularity: average_popularity,
			  newdata1: newdata1,
			  newdata2: newdata3
	    });
	})
		
		//make a new fetch to the playlist ref section
		db.collection("playlistRef")
	    .get()
	    .then(querySnapshot => {
			const data = querySnapshot.docs.map(doc => doc.data());
			var results = [];
			for (var i=0; i<data.length; i++){
				results.push([data[i]["list"]["name"], data[i]["list"]["images"][0]["url"]]);
			}
			const listItems = results.map((number) =>
				<div style={{textAlignLast: "left"}}><img src={number[1]} style={{height: "40px", width: "40px"}}/> <a href={number[1]} style={{fontSize: "20px", color: "white"}} target="_blank">{number[0]}</a> <br /> <br /> </div>
			);
			this.setState({
				listItems: listItems
			})
		})
	}
	
	
			  
   render() {
      return (
		  <div style={{marginTop: "-30px"}}>
		  
		    <div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "35px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle
                        </Container>
                    </Container>
		  
                    <Container className="card-value pt-4 text-x-large">
		  				<Chart
          				chartType="PieChart"
          				width="300px"
          				height="200px"
          				data={this.state.newdata1}
		  				options={options1}
        			/>
                      
                    </Container>
                </Container>
            </Container></div>
		  
		  	<div id="graph" style={{display: "inline-block",  boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{  margin: "35px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle
                        </Container>
                    </Container>
		  
                    <Container className="card-value pt-4 text-x-large">
		  				<Chart
          				chartType="PieChart"
          				width="300px"
          				height="200px"
          				data={this.state.newdata2}
		  				options={options2}
        			/>
                      
                    </Container>
                </Container>
            </Container></div>
		  
		  	<div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "35px" }}>
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle All Playlists
                        </Container>
                    </Container>
		  
                    <Container className="card-value pt-4 text-x-large" style={{height: "200px", overflow: "scroll"}}>
		  				 <ul>{this.state.listItems}</ul>
                    </Container>
                </Container>
            </Container></div>
		  
		  <br /><br />
		  
		  		  
  		<div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "55px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle
                        </Container>
                    </Container>
		  
                    <Container className="card-value pt-4 text-medium">
		  				Total Songs Played
		  				<br /><br />
		  				<Container className="card-value pt-4 text-x-large">
                        {this.state.totalsongs}
                        <span className="text-large pr-1">songs</span>

                    </Container>
                      
                    </Container>
                </Container>
            </Container></div>
		  		  

		  
  		<div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "55px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle
                        </Container>
                    </Container>
		  
                    <Container className="card-value pt-4 text-medium">
		  				Average Song Length:
		  				<br /><br />
		  				<Container className="card-value pt-4 text-x-large">
		  				{this.state.average_song_length}
                        <span className="text-large pr-1">seconds</span>

                    </Container>
                      
                    </Container>
                </Container>
            </Container></div>
		  		  

		  
  		<div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "55px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                           SmartShuffle
                        </Container>
                    </Container>
	
                    <Container className="card-value pt-4 text-medium">
		  				Total Playlists Shuffled:
		  				<br /><br />
		  				<Container className="card-value pt-4 text-x-large">
                        {this.state.totalplaylists}
                        <span className="text-large pr-1">playlists</span>

                    </Container>
                      
                    </Container>
                </Container>
            </Container></div>
		  		  
  		<div id="graph" style={{display: "inline-block", boxShadow: "10px 10px 5px #162238"}}><Container style={{display: "inlineBlock"}}>
                <Container className="card grid-card is-card-dark" style={{ margin: "55px" }} >
                    <Container className="card-heading">
                        <Container className="is-dark-text-light letter-spacing text-small">
                            SmartShuffle
                        </Container>
                    </Container>
	
                    <Container className="card-value pt-4 text-medium">
		  			Average Popularity:
		  				<br /><br />
		  				<Container className="card-value pt-4 text-x-large">
                        {this.state.average_popularity}/30
                        <span className="text-large pr-1">points</span>

                    </Container>
                      
                    </Container>
                </Container>
            </Container></div>
		  </div>
      );
   }
}

export default Data; 