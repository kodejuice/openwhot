/**
 * Whot shapes modal (screens/gamescreen.js)
 */

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

import styles from 'app/styles/images.js';

import imgs from 'app/assets/images/cards.js';


class Shapes extends React.Component {
	state = {a:0}

	render() {
		const _this = this;
		const restart = this.props.newgame;

		let	box = imgs['box'],
			tri = imgs['tri'],
			plus = imgs['plus'],
			star = imgs['star'],
			circle = imgs['circ'];

		return (
			<View style={{
				marginTop: 15,
				marginBottom: 5,
			}}>
				<Grid>
					{this.cardRow(plus, box, ['plus', 'box'])}
					{this.cardRow(star, null, ['star'])}
					{this.cardRow(tri, circle, ['tri', 'circ'])}
				</Grid>
			</View>
		);
	}

	cardRow(card1, card2, c) {
		let click = this.props.onPress;
		return (
			<Row style={{marginBottom: 19, justifyContent: 'center'}}>
				<Col onPress={click.bind(this, c[0])} style={{width: 84, marginLeft: 8}}>
					<Image style={styles.whotCard} source={card1}/>
				</Col>

				{ card2 ?
					(
						<Col onPress={click.bind(this, card2?c[1]:c[0])} style={{marginRight: 8}}>
							<Image style={styles.whotCard} source={card2}/>
						</Col>
					) : <View/>
				}
			</Row>
		);
	}
}



export default class WhotModal extends React.Component {

	render() {
		return (
			<Modal
				animationInTiming={1}
				animationOutTiming={1}
				backdropColor='rgba(0,0,0,0.7)'
				onBackdropPress={() => this.props.close()}
				onBackButtonPress={() => this.props.close()}
				style={{
					width: 170,
					borderWidth: 1,
					borderRadius: 1,
					alignSelf: 'center',
					borderColor: '#ccc',
					backgroundColor: 'rgba(0,0,0,0.3)',
				}}
				isVisible={true}
			>

				<View style={{ flex: 1 }}>
					<FlatList
					  data={[{key: 'null'}]}
					  renderItem={
					  	_ => <Shapes onPress={this.props.onCardPress}/>
					  }
					/>
				</View>
			</Modal>
		);
	}
}
