import React from 'react';

import { Col, Row, Grid } from "react-native-easy-grid";

import {
	View,
	Text,
	TouchableOpacity,
	Linking
} from 'react-native';

import styles from 'app/styles/components.js';
import text_styles from 'app/styles/text.js';

import Header from 'app/components/header.js';
import { SettingsSwitch } from 'app/components/switch.js';


//////////////////////
// Settings - Modal //
//////////////////////


export default class Settings extends React.Component {
	constructor(props){
		super(props);

		let options = [
			{prop: "music", title: "Sound"},
			{prop: "voice", title: "Feedback Voice"},

			{prop: "openCards", title: "Open Cards"},
			{prop: "holdOn", title: "Hold On (1)"},
			{prop: "pickTwo", title: "Pick Two (2)"},
			{prop: "pickThree", title: "Pick Three (5)"},
			{prop: "suspension", title: "Suspension (8)"},
			{prop: "goMarket", title: "Go Market (14)"},
			{prop: "defence", title: "Defense"},
		];

		// build settings options from above array
		this.settings = options.slice(0, 2).map(x => (
			<TouchableOpacity key={x.prop} activeOpacity={1} style={styles.OpacityContainer}>
				<View style={{flex: 1, flexDirection: 'row'}} >
					<Text style={[styles.OpacityText]}> {x.title} </Text>
					<SettingsSwitch for={x.prop} />
					</View>
			</TouchableOpacity>
		));

		// then, card rules
		//  a (<Header />) is placed ontop this settings
		//  so i have to separate it from the above
		this.card_rules = options.slice(2).map(x => (
			<TouchableOpacity key={x.prop} activeOpacity={1} style={styles.OpacityContainer}>
				<View style={{flex: 1, flexDirection: 'row'}} >
					<Text style={[styles.OpacityText]}> {x.title} </Text>
					<SettingsSwitch for={x.prop} />
					</View>
			</TouchableOpacity>
		));
	}


	render() {
		return (
			<View style={{flex: 1, flexDirection: 'column'}}>
				{this.settings}

				<Header> <Text> Card Rules </Text> </Header>
				{this.card_rules}
			</View>
		);
	}
}

