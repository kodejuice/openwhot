import React from 'react';
import { Col, Row, Grid } from "react-native-easy-grid";

import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

import Header from 'app/components/header.js';
import text_styles from 'app/styles/text.js';

import { ratingToLevel } from 'app/scripts/utils.js';


////////////////////////
// Statistics - Modal //
////////////////////////


export default class Stats extends React.Component {
	render (){
		let skill_level = ratingToLevel(appData.user.rating);
		
		let levels = [
			"Novice",
			"Amateur",
			"Competent",
			"Proficient",
			"GrandMaster"
		];

		let details = levels.map(level => {
			let lvl_lcase = level.toLowerCase();

			return (
				<Row size={20} key={level} style={{marginBottom: 9}}>
					{this.levelBadge(level)}
					<Col style={{width: 100}}>
						<Text style={[text_styles.statsText]}> {level} </Text>
					</Col>
					<Col style={{width: 100}}>
						<Text style={[text_styles.statsText_c]}>{appData.stats.wins[lvl_lcase]|0}</Text>
					</Col>
					<Col style={{width: 100}}>
						<Text style={[text_styles.statsText_c]}>{appData.stats.loss[lvl_lcase]|0}</Text>
					</Col>
				</Row>
			);
		});


		return (
			<View>
				<View style={[text_styles.transparentContainer, text_styles.containerMarginBottom]}>
					<Text style={[text_styles.statsText]}>
						Your Skill Level: <Text style={[text_styles.whiteBoldText]}> {skill_level}</Text>
						{"\n\nRating"}: <Text style={[text_styles.whiteBoldText]}> {Math.floor(appData.user.rating)} </Text>
					</Text>
				</View>

				<TouchableOpacity activeOpacity={1} style={text_styles.transparentContainer}>
					<Grid>
						<Row size={20} style={{marginBottom: 20}}>
							{this.levelBadge('head')}
							<Col style={{width: 100}}>
								<Text style={[text_styles.statsText, text_styles.bold]}> Level </Text>
							</Col>
							<Col style={{width: 100}}>
								<Text style={[text_styles.statsText, text_styles.bold]}> Won </Text>
							</Col>
							<Col style={{width: 100}}>
								<Text style={[text_styles.statsText, text_styles.bold]}> Lost </Text>
							</Col>
						</Row>

						{details}
					</Grid>
				</TouchableOpacity>

			</View>
		);
	}

	levelBadge(level){
		let colors = {
			'head': 'white',
			'novice': 'gray',
			'amateur': 'green',
			'competent': 'blue',
			'proficient': 'yellow',
			'grandmaster': 'red',
		};

		return (
			<View style={{
				width: 10,
				height: 10,
				marginTop: 4,
				marginLeft: 4,
				marginRight: 2,
				borderWidth: 1,
				borderColor: '#ccc',
				borderRadius: 100,
				backgroundColor: colors[level.toLowerCase()],
				opacity: level === 'head' ? 0 : 100
			}}></View>
		);
	}
}
