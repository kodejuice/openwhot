import React from 'react';

import {
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import imgs from 'app/assets/images/cards.js';
import img_styles from 'app/styles/images.js';


import AnimatedStyles from 'react-native-animated-styles';



/////////////////////////
// Game Card Component //
/////////////////////////

// <Card
//     which='box-3'
//     clickable={true}
//     type='player' // ['cpucard', 'market', 'gamecard']
// />

export default class Card extends React.Component {
	constructor(props) {
		super(props);
	}

	handleViewRef = ref => this.view = ref;

	// for market card
	swing = (fn, t) => this.view.swing(95).then(fn);

	// for players card
	bounceOutUp = (fn, t) => this.view.bounceOutUp(70).then(fn);


	componentDidMount() {
		let {type, owner, index} = this.props;

		// played card animation
		if (type === 'gamecard'){
			var lastPlayer = currGame.lastPlayed;
			
			if (lastPlayer == 'cpu'){
				this.view.slideInDown(60);
			}
			else if (lastPlayer == 'player'){
				this.view.slideInUp(60);
			}
		}

		// newly picked cards animation
		if (owner === currGame.lastMarketPicker && index < currGame.pickCount){
			// perform an "Attention seeker" animation

			this.view.bounce(250);
		}
	}

	click() {
		if (!this.props.clickable)
			return;

		let {type} = this.props;

		let animateFn = 
			type == 'cpucard'
			? this.bounceOutDown : (type == 'market' || type=='gamecard')
			? this.swing : this.bounceOutUp; // 'player'

		this.props.onPress(animateFn);
	}


	render() {
		let img = imgs[this.props.which];

		if (this.props.type === 'cpucard' && !appData.settings.rules.openCards){
			img = imgs['whot-card'];
		}

		return (
			<TouchableOpacity activeOpacity={1} onPress={this.click.bind(this)}>

				<Animatable.View ref={this.handleViewRef}>
					<View style={cardStyle}>
						<Image source={img} style={img_styles.autoWidth}/>
					</View>
				</Animatable.View>

			</TouchableOpacity>
		);
	}
}


// card styling

let cardStyle = {
	width: 65,
	height: 83,

	marginLeft: 5,
};

