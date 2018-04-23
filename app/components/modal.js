import React from 'react';
import Modal from 'react-native-modal';

import {
	View,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	Linking
} from 'react-native';

import styles from 'app/styles/components.js';
import text_styles from 'app/styles/text.js';

import Header from 'app/components/header.js';

// modal background image
const [modalBg] = [require('app/assets/images/backgrounds/modal-bg.png')];


// modals
import Stats from 'app/screens/modals/stats.js';
import About from 'app/screens/modals/about.js';
import Settings from 'app/screens/modals/settings.js';
import { NewGame } from 'app/components/play_modal.js';


export default class _Modal extends React.Component {

	render() {

		const modalContent = {
			'statistics': < Stats />,
			'about': < About />,
			'settings': < Settings />,
			'new game': <NewGame close={this.props.close}/>
		};

		return (
			<Modal
				animationOutTiming={150}
				animationInTiming={150}
				onBackButtonPress={() => this.props.close()}
				backdropColor='rgba(0,0,0,0.4)'
				style={{
					width: 300,
					borderWidth: 3,
					borderTopWidth: 0,
					alignSelf: 'center',
					borderColor: 'brown',
				}}
				isVisible={true}
			>

				<ImageBackground
					source={modalBg}
					style={{width: "100%", height: "100%"}}
				>
					<View style={{ flex: 1 }}>
						<Header close={this.props.close}> {this.props.which.toUpperCase()} {"              "} </Header>

						<FlatList
						  data={[{key: '1'}]}
						  renderItem={({item}) => modalContent[this.props.which] }
						/>
					</View>
				</ImageBackground>
			</Modal>
		);
	}
}

