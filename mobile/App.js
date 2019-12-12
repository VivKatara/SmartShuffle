
import React, { Component } from 'react';
import {
	Alert,
	Linking,
	Platform,
	StyleSheet,
	Text,
	View
} from 'react-native';
import {
	createSwitchNavigator,
	createAppContainer
} from 'react-navigation';

// import InitialScreen from './src/InitialScreen.js';
// import PlayerScreen from './src/PlayerScreen.js';
//
//
// const MainApp = createSwitchNavigator({
// 	initial: {
// 		screen: InitialScreen,
// 		path: 'initial'
// 	},
// 	player: {
// 		screen: PlayerScreen,
// 		path: 'player'
// 	},
// });
//
// const App = createSwitchNavigator({
// 	player: {
// 		screen: MainApp,
// 		path: ''
// 	},
// });

import InitialScreen from './src/InitialScreen.js';
import PlayerScreen from './src/PlayerScreen.js';
import PlaylistsScreen from './src/PlaylistsScreen.js';
import ShuffleParametersScreen from './src/ShuffleParametersScreen.js';

const App = createSwitchNavigator({
	initial: { screen:InitialScreen },
	playlists: { screen:PlaylistsScreen },
	player: { screen:PlayerScreen },
	shuffleParameters: { screen:ShuffleParametersScreen },
});

const AppContainer = createAppContainer(App);

export default () => {
	return <AppContainer uriPrefix='smartshuffleapp://' />;
};
