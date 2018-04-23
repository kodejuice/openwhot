import React from 'react';
import { Font } from 'expo';
import { StackNavigator } from 'react-navigation';
import { ImageBackground, View, StatusBar, Text } from 'react-native';


// init app data
import {
	loadAppData
} from 'app/scripts/storage/initstorage.js';


// Screens
import Home from 'app/screens/home.js';
import GameScreen from 'app/screens/gamescreen.js';


// App
class HomeScreen extends React.Component {
	state = {
		appDataLoaded: false
	}

	async componentDidMount() {

		// load database
		await loadAppData();

		// load Font
		await Font.loadAsync({
			'cooky': require('app/assets/fonts/cooky.ttf'),
		});

		// set custom Font
		Text.defaultProps.style = {
			fontFamily: 'cooky'
		};

		global.navigator = this.props.navigation;

		this.setState({ appDataLoaded: true });
	}


	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<StatusBar hidden = {true}/>

				<ImageBackground
					style={{width: "100%", height: "100%"}}
					source={require('app/assets/images/backgrounds/home-bg.png')}
				>

				{
					this.state.appDataLoaded ? (
						<Home />
					) : <View><Text style={{color: '#fff'}}> Loading... </Text></View>
				}

				</ImageBackground>
			</View>
		);
	}
}


export default StackNavigator(
	{
		Home: { screen: HomeScreen },
		GameScreen: { screen: GameScreen },
	},
	{
		headerMode: 'none',
		navigationOptions: {
			headerVisible: false,
		}
	}
);

