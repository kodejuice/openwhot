
import React from 'react';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from "react-native-easy-grid";
import {
	Text,
	View,
	Image,
	Linking,
	FlatList,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';
import glicko2 from 'glicko2';
import { Button } from 'app/components/buttons.js';

// helper
import { saveStat, saveData } from 'app/scripts/storage/helpers.js';
import { ratingToLevel } from 'app/scripts/utils.js';

// styles
import styles from 'app/styles/images.js';
import imgs from 'app/assets/images/cards.js';


// modal background image
const [winBg] = [
	require('app/assets/images/backgrounds/win-bg.png')
];

// text image
const [youwin, youlose] = [
	require('app/assets/images/text/youwin.png'),
	require('app/assets/images/text/youlose.png'),
];



class GameWonView extends React.Component {
	cpuRatings = {
		'novice': 1000,
		'amateur': 1200,
		'competent': 1500,
		'proficient': 1900,
		'grandmaster': 2200,
	};

	constructor(props) {
		super(props);

		this.oldRating = appData.user.rating;

		// update stats
		this.updateStats();

		// calculate new glicko rating
		this.updateRating();
	}


	updateRating() {
		let ranking = new glicko2.Glicko2();

		let {rating, rd, vol} = appData.user;
		let cpuRating = this.cpuRatings[this.props.difficulty];

		let player = ranking.makePlayer(rating, rd, vol),
			cpu = ranking.makePlayer(cpuRating, 200, 0.06);

		ranking.updateRatings([[player, cpu, +this.props.player_won]]);

		// update player rating data
		saveData(appData, 'user', 'rating', player.getRating());
		saveData(appData, 'user', 'rd', player.getRd());
		saveData(appData, 'user', 'vol', player.getVol());
	}


	updateStats() {
		let count,
			diff = this.props.difficulty;

		if (this.props.player_won){
			count = appData.stats.wins[diff];

			saveStat(appData, 'wins', diff, count + 1);
		} else {
			count = appData.stats.loss[diff];

			saveStat(appData, 'loss', diff, count + 1);
		}
	}


	render (){
		let rdiff = Math.floor(appData.user.rating) - Math.floor(this.oldRating); // rating difference
			rdiff = (rdiff >= 0) ? `+${rdiff}` : `${rdiff}`;

		let rating = Math.floor(appData.user.rating);

		return (
			<Grid>
				<Row size={20} style={{
					marginTop: 10,
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
					<Image source={this.props.player_won ? youwin : youlose} style={{width: 250, height: 60}}/>
				</Row>

				<Row size={60} style={{
					marginTop: 40,
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
					<Text style={textStyle}> New Score: </Text>
					<Text style={[textStyle]}> {rating} {" "} [{rdiff}]</Text>
				</Row>

				<Row size={20} style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					marginTop: 52,
				}}>
					<Button marginRight={30} icon='refresh' title='Replay' click={this.props.restart} color='grey' col={true}/>
					<Button marginRight={20} icon='home' title='Home' click={this.props.goback} color='maroon' col={true}/>
				</Row>
			</Grid>
		);
	}
}


export default class GameWonModal extends React.Component {

	render() {
		return (
			<Modal
				animationInTiming={100}
				animationOutTiming={1}
				backdropColor='rgba(0,0,0,0.7)'
				style={{
					width: 300,
					borderWidth: 1,
					borderRadius: 1,
					borderColor: '#ccc',
					alignSelf: 'center',
				}}
				isVisible={true}
			>

				<ImageBackground
					source={winBg}
					style={{width: "100%", height: "100%"}}
				>

					<View style={{ flex: 1 }}>
						<FlatList
						  data={[{key: 'null'}]}
						  renderItem={
						  	_ => <GameWonView
							  		player_won={this.props.player_won}
			  						difficulty={this.props.difficulty}

									goback={this.props.goback}
									restart={this.props.restart}
							  	/>
						  }
						/>
					</View>

				</ImageBackground>
			</Modal>
		);
	}
}


///////////
// Style //
///////////

const textStyle = {
	color: '#fff',

	fontSize: 18,
	fontWeight: 'bold',

	textShadowOffset: {
		width: 1,
		height: 1
	},

	textShadowColor: '#ccc',
};


