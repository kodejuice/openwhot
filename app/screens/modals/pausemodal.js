import React from 'react';
import Modal from 'react-native-modal';

import { Col, Row, Grid } from "react-native-easy-grid";

import {
	Text,
	View,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	Linking
} from 'react-native';

import { Button } from 'app/components/buttons.js';


import voice from 'app/scripts/voice-api/voice.js';

// modal background image
const [modalBg] = [require('app/assets/images/backgrounds/cards-bg.png')];

// helper
import { saveData } from 'app/scripts/storage/helpers.js';



// Modal Content
class Pause extends React.Component {
	state = {toggle:0}

	constructor(p) {
		super(p);

		// stop any playing sound
	}

	render() {
		const self = this;
		const restart = this.props.newgame;

		// camelCase
		const r = {
			'novice': 'Novice',
			'amateur': 'Amateur',
			'competent': 'Competent',
			'proficient': 'Proficient',
			'grandmaster': 'GrandMaster',
		};


		return (
			<View style={{
				margin: 15,
				marginTop: 2,
				marginBottom: 5,

				justifyContent: 'center',
			}}>
				<Button title='Resume' click={this.props.close}/>

				<Button title={`Voice: ${(appData.settings.voice ? 'On' : 'Off')}`} click={_ => {
					saveData(appData, 'settings', 'voice', !appData.settings.voice);
					self.setState({})
				}}/>

				<Button title={`${r[global.currGame.gameState.difficulty]}`} color='#888' click={_=>_}/>

				<Button title='Restart' click={_ => {
					restart();
					this.props.close();

					voice.Speak('Game restarted');
				}}/>

				<Button title='Abort' color='red' click={_ => {
					global.navigator.goBack(null);
				}}/>
			</View>
		);
	}
}


// Modal Class
export default class PauseModal extends React.Component {

	render() {

		return (
			<Modal
				animationInTiming={150}
				animationOutTiming={150}
				backdropColor='rgba(0,0,0,1)'
				onBackButtonPress={() => this.props.close()}
				style={{
					width: 170,
					borderWidth: 2,
					alignSelf: 'center',
					borderColor: 'brown',
				}}
				isVisible={true}
			>

				<ImageBackground
					source={modalBg}
					style={{width: "100%", height: "100%"}}
				>
					<View style={{ flex: 1, justifyContent: 'center'}}>
						<FlatList
						  data={[{key: 'null'}]}
						  renderItem={
						  	_ => <Pause newgame={this.props.newgame} close={this.props.close}/>
						}
						/>
					</View>
				</ImageBackground>
			</Modal>
		);
	}
}


