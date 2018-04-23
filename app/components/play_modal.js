import React from 'react';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

import Icon from '@expo/vector-icons/FontAwesome';

import {
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image,
	Picker
} from 'react-native';

import { RoundButton } from 'app/components/buttons.js';


import Header from 'app/components/header.js';

import btn_styles from 'app/styles/buttons.js';
import img_styles from 'app/styles/images.js';
import text_styles from 'app/styles/text.js';


// bg images
const [playButton, restart] = [
	require('app/assets/images/buttons/newgame.png'),
	require('app/assets/images/buttons/play.png')
];


/////////////////////////////////
// Play_Continue Overlay Modal //
/////////////////////////////////

export class PlayContinue extends React.Component {

	// Route to game page
	continueGame(){
		const { navigate } = global.navigator;

		// close current modal
		this.props.close();

		// Route >>
		navigate('GameScreen', {
			mode: 'continue',
			data: appData.user.gameInProgress
		});
	}


	render() {
		return (
			<Modal
				animationOutTiming={200}
				animationInTiming={200}
				onBackButtonPress={() => this.props.close()}
				backdropColor='rgba(0,0,0,0.9)'
				style={{
					width: 400,
					height: 100,
					alignSelf: 'center',
				}}
				isVisible={true}
			>

				<View style={{
					flex: 1,
					flexDirection: 'row'
				}}>

					{/* Continue Button */}
					<View style={{
						flex: 1,
						justifyContent: 'center'
					}}>
						<RoundButton
							onClick={()=>this.continueGame()}
							which="continue"
							title={"  Continue"}
						>
							<Image style={[img_styles.autoWidth]} source={playButton}/>
						</RoundButton>
					</View>


					{/* New Game Button */}
					<View style={{
						flex: 1,
						alignItems: 'flex-end',
						justifyContent: 'center'
					}}>
						<RoundButton
							onClick={()=>this.props.newGameClick()}
							which="newgame"
							title={" New Game  "}
						>
							<Image style={[img_styles.autoWidth]} source={restart}/>
						</RoundButton>
					</View>
				</View>
			</Modal>
		);
	}
}



////////////////////////
// New game - Modal   //
////////////////////////

export class NewGame extends React.Component {

	state = {
		gametype: 'select',
		difficultyOption: true,
	};


	// header component
	header(title, margtop = 0) {
		let headerStyle = {
			marginTop: margtop || 6,
			backgroundColor: 'rgba(165,49,41,0.9)',
			padding: 4,
			borderBottomColor: 'maroon',
			borderBottomWidth: 1
		};

		return (
			<TouchableOpacity style={headerStyle} activeOpacity={1}>
				<Text style={text_styles.whiteBoldText}> {title} </Text>
			</TouchableOpacity>
		);
	}


	// "Start game" button click
	//  - Routes to game-play scrren
	startGame() {

		const { navigate } = global.navigator;

		let diff = this.state.difficultyOption;
			diff = (diff === "select" || diff == !0) ? null : diff;

		if(!diff && appData.settings.rules.openCards)
			return alert("Select Difficulty Level!");

		// close current modal
		this.props.close();

		// Route >>
		navigate('GameScreen', {
			diff,
			mode: 'newgame'
		});
	}


	// "Start Game" button
	startButton(){

		const buttonStyle = {
			padding: 8,
			backgroundColor: 'maroon',
			width: '95%',
			alignItems: 'center'
		};

		const buttonText = {
			color: '#fff',
			fontWeight: 'bold',
			fontSize: 18,
			textAlign: 'center',

			textShadowColor: '#ccc',
			textShadowRadius: 7,

			textShadowOffset: {
				width: 1,
				height: 1
			}
		};

		const IconStyle = {
			justifyContent: 'center'
		};

		return (
			<View style={{
				alignItems: 'center',
			}}>
				<TouchableOpacity
					style={buttonStyle}
					activeOpacity={0.7}
					onPress={this.startGame.bind(this)}
				>
						<View style={{
							alignSelf: 'center',
							alignItems: 'center',
							flexDirection: 'row',
						}}>
							<Icon style={IconStyle} name="play" size={15} color="#fff" />
							<Text style={buttonText}> {"  START GAME"}
							</Text>
						</View>

				</TouchableOpacity>
			</View>
		);
	}


	// Modal content
	render() {
		const pickerStyle = {
			color: "#DDD",
			backgroundColor: 'rgba(165,49,41,0.5)',
		};

		const pickerContainer = {
			borderBottomWidth: 1,
			borderBottomColor: '#333'
		};

		return (
			<View>
				{this.header("Game Type")}

				{/* game type - picker */}
				<View style={pickerContainer}>
						<Picker
							style={pickerStyle}
							selectedValue={this.state.gametype}
						>
							<Picker.Item label={"Against CPU"} value="cpu" />
						</Picker>
				</View>


				{/* game difficulty - picker */}
				{ this.state.difficultyOption && appData.settings.rules.openCards ?
					<View>
						{this.header("Difficulty Level", 10 /*margin-top*/)}

						<View style={pickerContainer}>
							<Picker
								style={pickerStyle}
								selectedValue={this.state.difficultyOption}
								onValueChange={
									(diff) => {
										if (diff !== 'select'){
											this.setState({
												difficultyOption: diff
											});
										}
									}
								}>
								<Picker.Item label="Select Level:" value="select"/>
								<Picker.Item label={"Novice"} value="novice" />
								<Picker.Item label={"Amateur"} value="amateur" />
								<Picker.Item label={"Competent"} value="competent" />
								<Picker.Item label={"Proficient"} value="proficient" />
								<Picker.Item label={"Grand Master"} value="grandmaster" />
							</Picker>
						</View>
					</View>
					: <View></View>
				}


				{/* Start game button */}
				{ 
					<View style={{
						flex: 1,
						marginTop: 15,
						marginBottom: 5,
						justifyContent: 'flex-end'
					}}>

						{this.startButton()}

					</View>
				}
			</View>
		);
	}

}

