import React from 'react';
import Modal from 'react-native-modal';

import {
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image
} from 'react-native';

import { DialogCloseButton } from 'app/components/buttons.js';

import styles from 'app/styles/text.js';
import image_styles from 'app/styles/images.js';


// Modal background image
const [headerBg, backButton] = [
	require('app/assets/images/backgrounds/header-bg.png'),
	require('app/assets/images/buttons/cancel.png')
];


///////////////////////////////////
// Dialog/Modal Header Component //
///////////////////////////////////


export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this._render = 	(
			<View style={[styles.headerContainer]}>

				<ImageBackground
					source={headerBg}
					style={{width: "100%", height: "100%"}}
				>

					<View style={{flex: 1, flexDirection: 'row'}}>
						{
							this.props.close ? 
								<View style={{flex: 1}} >

									<DialogCloseButton onClick={this.props.close}>
										<Image style={[image_styles.autoWidth]} source={backButton} />
									</DialogCloseButton>

								</View>
							: <View style={{flex:1}}>{/*empty component*/}</View>
						}

						<View style={{ flex: 2.8 }} >
							<Text style={[styles.headerText]}> {this.props.children} </Text>
						</View>
					</View>

				</ImageBackground>
			</View>
		);
	}


	render() {
		return this._render;
	}
}
