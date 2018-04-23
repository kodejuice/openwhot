import React from 'react';
import Expo from 'expo';

// import Icon from '@expo/vector-icons/FontAwesome';

import {
	View,
	Text,
	Image,
	BackHandler,
	DeviceEventEmitter
} from 'react-native';

import { Col, Row, Grid } from "react-native-easy-grid";


import {
	GameButton,
	RoundButton
} from 'app/components/buttons.js';

import styles from 'app/styles/images.js';
import t from 'app/styles/text.js';

import { ratingToLevel } from 'app/scripts/utils.js';


// button images
const [playButton, statsButton, rulesButton, exitBtn, settingsButton] = [
	require('app/assets/images/buttons/play.png'),
	require('app/assets/images/buttons/profile.png'),
	require('app/assets/images/buttons/rules.png'),
	require('app/assets/images/buttons/cancel.png'),
	require('app/assets/images/buttons/settings.png')
];


// Home Screen

export default class Home extends React.Component {
	state = {};

	ranksColor = {
		'novice': 'gray',
		'amateur': 'green',
		'competent': 'blue',
		'proficient': 'yellow',
		'grandmaster': 'red'
	};

	componentWillMount() {
		let self = this;
		DeviceEventEmitter.addListener('goBack',
			_=> self.setState({})
		);
	}

	render() {
		let rating = Math.floor(appData.user.rating);
		let rank = ratingToLevel(rating);

		return (
			<Grid>

				{/* User rank and score */}
				<Row size={10} style={{height: 33}}>
					<Row style={{
						width: 159,
						height: 20,
						marginLeft: 5,
						borderRadius: 4,
						marginVertical: 3,
						flexDirection: 'row',
						backgroundColor: '#24272a'
					}}>

						{/* Rating badge-color */}
						<View style={{
							width: 10,
							height: 10,
							marginTop: 4,
							marginLeft: 4,
							marginRight: 2,
							borderWidth: 1,
							borderColor: '#ccc',
							borderRadius: 100,
							backgroundColor: this.ranksColor[rank.toLowerCase()],
						}}></View>

						{/* user rank */}
						<Text style={[t.whiteBoldText]}> {rank} </Text>

						<Col style={{
							marginRight: 3,
							alignItems: 'flex-end',
						}}>
							<Text style={{
								color: '#fff',
								paddingLeft: 7,
								borderLeftWidth: 1,
								borderLeftColor: '#ccc',
							}}> {rating} </Text>
						</Col>

					</Row>
				</Row>


				{/* Home Screen */}
				<Row size={90}>
				    <Col style={{width: 280}}>
					    <Row size={70}></Row>

						{/* Game buttons */}
					    <Row size={30}>
							<GameButton title="Stats" modal="statistics">
								<Image style={[styles.autoWidth]} source={statsButton} />
							</GameButton>

							<GameButton title="Settings" modal="settings">
								<Image style={[styles.autoWidth]} source={settingsButton} />
							</GameButton>

							<GameButton title="About" modal="about">
								<Image style={[styles.autoWidth]} source={rulesButton} />
							</GameButton>

							<GameButton title="Exit" click={()=> BackHandler.exitApp()} act='exit'>
								<Image style={[styles.autoWidth]} source={exitBtn} />
							</GameButton>
					    </Row>
				    </Col>

				    <Col>
					    <Row size={60}></Row>

						{/* Play button */}
					    <Row size={40}>
						    <Row size={40}></Row>

						    <RoundButton which="play">
							    <Image style={[styles.autoWidth]} source={playButton}/>
						    </RoundButton>
					    </Row>
				    </Col>
			    </Row>

			</Grid>
		);
	}
}
