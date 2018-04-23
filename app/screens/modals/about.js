import React from 'react';
import { Col, Row, Grid } from "react-native-easy-grid";

import {
	View,
	Text,
	TouchableOpacity,
	Linking
} from 'react-native';

import Header from 'app/components/header.js';
import text_styles from 'app/styles/text.js';



///////////////////
// About - Modal //
///////////////////

export default class About extends React.Component {
	constructor(props){
		super(props);

		this.open = Linking.openURL.bind(Linking);

		this.about_text =  `
Open Whot is a variation of the Naija Whot Game, with a twist that makes it very fun to play

The only difference between OpenWhot and the casual Whot you play is that you don't hide your cards in OpenWhot, instead of covering your cards from not beign seen, you open your cards.

This forces players to really think, which makes the game more fun, challenging and interesting.

Open Whot doesn't alter the rules of the game, so you play with the normal game rules, but with your cards open / revealed.

Have fun!`;
	}


	render() {
		return 	(
			<TouchableOpacity activeOpacity={1} style={text_styles.transparentContainer}>
				<View style={{flex: 1, flexDirection: 'row'}} >
					<Text style={[text_styles.aboutText]}>{this.about_text}</Text>
				</View>
				<Header title="hello">App Info</Header>
				<View style={{flex: 1, flexDirection: 'column'}}>

					{/* APP info */}
					<Text style={[text_styles.aboutText]}>
						{`\nVersion: 1.0\n\nBuilt with React Native\n\nThis game is open sourced at github`}
						<Text
							style={[text_styles.linkText]}
							onPress={() => this.open('http://github.com/kodejuice/openwhot')}>
								{`  http://github.com/kodejuice/openwhot`}
						</Text>
					</Text>

					{/* Developer info */}
					<Text style={[text_styles.aboutHeaderText]}> {"Developer Info"} </Text>
					<Text style={[text_styles.aboutText]}>
						{`   Sochima Biereagu  `}
						<Text onPress={_=>this.open('http://twitter.com/kodejuice')} style={[text_styles.linkText]}>
							{`@KodeJuice`}
						</Text>
						{` / `}
						<Text onPress={_=>this.open('http://github.com/kodejuice')} style={[text_styles.linkText]}>
							{`Github`}
						</Text>
						{` / `}
						<Text onPress={_=>this.open('http://kodejuice.wordpress.com/')} style={[text_styles.linkText]}>
							{`Blog`}
						</Text>
					</Text>

				</View>
			</TouchableOpacity>
		);
	}
}
