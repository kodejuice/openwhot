import React from 'react';
import Icon from '@expo/vector-icons/FontAwesome';

import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';

import _Modal from 'app/components/modal.js';
import PauseModal from 'app/screens/modals/pausemodal.js';
import { PlayContinue } from 'app/components/play_modal.js';

import styles from 'app/styles/buttons.js';


///////////////////////
// Home Menu buttons //
///////////////////////


export class GameButton extends React.Component {

	constructor(p) {
		super(p);
		this.state = { modalVisible: false };

		if (this.props.modal === 'pause'){
			this._modal = <PauseModal newgame={this.props.newgame} close={()=>this.modal('hide')}/>;
		} else {
			this._modal = <_Modal which={this.props.modal} close={()=>this.modal('hide')}/>;
		}

		this.click = this.click.bind(this);
	}

	modal(state) {
		this.setState({
			modalVisible: state === "show"
		});
	}

	click() {
		if (this.props.act === 'exit'){
			this.props.click();
		} else {
			this.modal("show");
		}
	}

	render() {
		return (
			<TouchableOpacity style={[this.props.style?this.props.style:styles.container]} activeOpacity={0.7}  onPress={this.click}>

				{this.state.modalVisible ? this._modal : <View></View>}

				<TouchableOpacity style={styles.homeButton} activeOpacity={0.7} onPress={this.click}>
					{this.props.children}
				</TouchableOpacity>

				<Text
					style={{
						color: '#fff',

						paddingLeft: (this.props.modal === 'settings')
							? 0
							: (this.props.modal === 'about')
							? 5
							: (this.props.act === 'exit')
							? 11
							: 9
					}}> {this.props.title} </Text>
			</TouchableOpacity>
		);
	}
}



///////////////////
// Round button  //
///////////////////

export class RoundButton extends React.Component {

	constructor(p) {
		super(p);
		this.state = {
			modalVisible: false,

			play_continue: !!appData.user.gameInProgress
		};

		this.click = this.click.bind(this);
	}


	click() {
		if (this.props.which === 'play'){
			this.modal('show');
		} else {
			this.props.onClick.call(this);
		}
	}

	modal(state, hide_playContinue = false) {
		this.setState({
			modalVisible: (state==="show" && this.props.which==='play'),

			play_continue: hide_playContinue? false : !!appData.user.gameInProgress
		});
	}

	render() {
		let modal = <View/>;

		if (this.props.which === 'play' && this.state.modalVisible){
			modal = (this.state.play_continue)

			// dialog overlay with the "Continue" and "New Game" button
			? <PlayContinue
				close={() => this.modal('hide')}
				newGameClick={() => this.modal("show", true)}
			/>

			// New Game Modal
			: <_Modal which="new game" close={()=>this.modal('hide')}/>;
		}


		return (
			<TouchableOpacity activeOpacity={0.7} style={{ marginRight: 20 }} onPress={this.click}>

				{ modal }

				<TouchableOpacity style={[styles.roundCorner]} activeOpacity={0.7} onPress={this.click}>
					{this.props.children}
				</TouchableOpacity>

				<Text
					style={{
						color: "#EEE",
						fontSize: 20
					}}>
						{this.props.title || ""}
				</Text>

			</TouchableOpacity>
		);
	}
}


////////////////////
// Dialog buttons //
////////////////////


// dialog close-button
export class DialogCloseButton extends React.Component {
	render () {
		return (
			<TouchableOpacity onPress={()=>this.props.onClick()}>

				<TouchableOpacity style={[styles.backButton]} activeOpacity={0.7} onPress={()=>this.props.onClick()}>
					{this.props.children}
				</TouchableOpacity>

			</TouchableOpacity>
		);
	}
}



// Modal Button
export class Button extends React.Component {
	render() {

		const buttonStyle = {
			padding: 8,
			width: '95%',
			marginBottom: 6,
			alignItems: 'center',
			backgroundColor: this.props.color || 'maroon',
			marginRight: this.props.marginRight || 0
		};

		const buttonText = {
			color: '#fff',
			fontSize: 18,
			textAlign: 'center',

			textShadowColor: '#ccc',
			textShadowRadius: 1,

			textShadowOffset: {
				width: 1,
				height: 1
			}
		};

		const IconStyle = {
			justifyContent: 'center'
		};

		return (
			<View style={{
				alignItems: 'center',
			}}>
				<TouchableOpacity
					style={buttonStyle}
					activeOpacity={0.7}
					onPress={this.props.click}
				>
						<View style={{
							alignSelf: 'center',
							alignItems: 'center',
							flexDirection: 'row',
						}}>
							{
								this.props.icon ?
								<Icon style={IconStyle} name={this.props.icon} size={15} color="#fff" />
								: <View/>
							}
							
							<Text style={buttonText}> {this.props.title} </Text>
						</View>
				</TouchableOpacity>
			</View>
		);

	}
}


