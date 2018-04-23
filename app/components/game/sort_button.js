import React from 'react';

import {
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';

import styles from 'app/styles/buttons.js';


const [sortButton] = [
	require('app/assets/images/buttons/sort.png')
];


////////////////////////////
// Game Cards Sort Button //
////////////////////////////


export default class SortButton extends React.Component {

	constructor(p) {
		super(p);
		
		this.click = this.click.bind(this);
	}

	click() {
		this.props.onPress();
	}

	render() {
		return (
			<TouchableOpacity style={{width: 70}} activeOpacity={0.7} onPress={this.click}>

				<TouchableOpacity style={styles.homeButton} activeOpacity={0.7} onPress={this.click}>
					<Image style={{width: 45, height: 45}} source={sortButton} />
				</TouchableOpacity>

			</TouchableOpacity>
		);
	}
}