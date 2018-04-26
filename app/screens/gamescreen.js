import React from 'react';

import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	ImageBackground,
	DeviceEventEmitter,
} from 'react-native';

import _ from 'lodash';
import { Col, Row, Grid } from "react-native-easy-grid";
import WhotGame from 'app/scripts/game/openwhot.js';
import WhotModal from 'app/screens/modals/shapesmodal.js';
import GameWonModal from 'app/screens/modals/gamewonmodal.js';

import voice from 'app/scripts/voice-api/voice.js';

// helpers
import { saveData } from 'app/scripts/storage/helpers.js';
import { shiftMatchingCards } from 'app/scripts/utils.js';


// bg images
const [gameBg, wood] = [
	require('app/assets/images/backgrounds/game-bg.png'),
	require('app/assets/images/backgrounds/cards-bg.png')
];

// button
import {
	GameButton,
	RoundButton
} from 'app/components/buttons.js';

// styles
import img_styles from 'app/styles/images.js';


// images
const [pauseButton] = [
	require('app/assets/images/buttons/pause.png')
];

// Card Component
import Card from 'app/components/game/gamecard.js';


// Sort Button
import SortButton from 'app/components/game/sort_button.js';


// Device height
const height = Dimensions.get('window').height;


export default class GameScreen extends React.Component {
	constructor(props){
		super(props);

		this.initGame();

		this.state = {
			status: '',
			gameWon: null,
			shapesModal: false
		};
	}

	componentDidMount() {
		let state = currGame.gameState;

		// sort CPU cards
		this.sortCards(state, state.cards.cpu, true, false);

		// set game status message
		this.setState({status: gameStatus(state)});

		this.beginGame();
	}

	componentWillUnmount() {
		// (save or delete) gameState

		if (this.state.gameWon) {
			delete global.currGame;

			saveData(appData, 'user', 'gameInProgress', null);
		} else {
			saveData(appData, 'user', 'gameInProgress', currGame.gameState);
		}
	}


	beginGame() {

		let tc = currGame.gameState.cards.gameCards[0];

		if (tc.special && [1,2,5,8,14,20].includes(tc.value)) {
			// Play voice
			if (tc.value === 20)
				voice.Speak(tc.whotValue, 'player'); // "Give me {shape}"
			else
				voice.Speak(tc.value, 'player');
		}

		// cpu to play first ?
		if (currGame.gameState.gameTurn.who === 'cpu'){
			this.cpuPlay(currGame);
		}
	}



	initGame(newgame = null){
		let game,
			games,
			params = this.props.navigation.state.params;

		if (newgame || params.mode === 'newgame'){

			let p = _.shuffle(["player", "cpu"]);

			// init new game
			game = new WhotGame({
				player1: p[0],
				player2: p[1]
			}, appData.settings.rules);


			// set difficulty
			if (appData.settings.rules.openCards){
				game.setDifficulty(
					newgame
					? appData.user.gameInProgress.difficulty
					: params.diff
				);
			}

			// store game state, so user gets to resume next time
			saveData(appData, 'user', 'gameInProgress', game.gameState);
		}
		else {
			// use previous game data
			game = new WhotGame(params.data, appData.settings.rules);

			game.setDifficulty(
				appData.settings.rules.opencards
				? 'easy'
				: game.gameState.difficulty
			);
		}

		global.currGame = game;

		// max number of cards a player can see
		this.cardsPerView = cardsViewLimit(height);


		////////////////////
		// game restarted //
		////////////////////

		if (newgame) {
			this.setState({
				gameWon: null,
				status: gameStatus(game.gameState)
			});

			this.beginGame();
		}
	}


	render (){
		let state = currGame.gameState;
		saveData(appData, 'user', 'gameInProgress', state);

		let cpuCards = state.cards.cpu,
			usrCards = state.cards.player;

		let limit = this.cardsPerView;

		// cards mapped as Components
		let cpuCards_C = cpuCards.slice(0,limit).map((obj, i)=> cardComponent(obj, 'cpucard', null, i)),
			usrCards_C = usrCards.slice(0,limit).map((obj, i)=> cardComponent(obj, 'player', this.playerCardPress.bind(this, obj), i));

		return (
			<ImageBackground
				style={[img_styles.autoWidth]}
				source={gameBg}
			>
				<Grid>

					{/* CPUs deck */}
					<Row size={30} style={{borderBottomWidth: 1, borderBottomColor: 'maroon'}}>
						<View
							style={[deckPanelStyle]}
						>

							{/* pause button */}
							<GameButton style={{width: 60}} modal="pause" newgame={this.initGame.bind(this, true)}>
								<Image style={{width: 39, height: 39}} source={pauseButton} />
							</GameButton>

							<View style={{width: "83%", flexDirection: 'row', paddingLeft: 13}}>

								{/* card count*/}
								<View style={cardCountBox}>
									<Text style={cardCountText}> {cpuCards.length} </Text>
								</View>

								{/* cpu cards */}
								<View style={{width: "81%", flexDirection: 'row'}}>
									{cpuCards_C}
								</View>

								{/* cycle/sort button */}
								{
									appData.settings.rules.openCards && cpuCards.length > limit ?
										<View style={{marginLeft: 20}}>
											<SortButton onPress={this.sortCards.bind(this, state, cpuCards)}/>
										</View>
									: <View></View>
								}
							</View>

						</View>
					</Row>


					{/* Market, Game cards */}
					<Row size={54}>

						{/* whot shapes picker modal */}
						{this.state.shapesModal ? this.whotShapesModal() : <View></View>}

						{/* gamewon modal */}
						{this.state.gameWon ? this.gameWonModal() : <View></View>}


						{/* Market */}
						<View style={marketStyle}>
							<Card which='whot-card' clickable={1} type='market' onPress={this.marketPress.bind(this)}/>

							{/* market cards count*/}
							<View style={[cardCountBox, {width:35,alignSelf:'center',marginTop:2}]}>
								<Text style={cardCountText}> {state.cards.market.length} </Text>
							</View>
						</View>


						{/* Played Cards */ }
						<View style={{flex: 1, alignItems: 'flex-end'}}>
							<View style={playedCardStyle}>
								{cardComponent(state.cards.gameCards[0], 'gamecard')}

								{/* game status */}
								<View style={[cardCountBox, gameStatusBox]}>
									<Text style={[cardCountText, {fontWeight:'bold',textAlign:'center'}]}>
										{this.state.status}
									</Text>
								</View>
							</View>
						</View>

					</Row>


					{/* Players deck */}
					<Row size={30} style={{borderTopWidth: 1, borderTopColor: 'maroon'}}>
						<View
							style={[deckPanelStyle, {paddingLeft: 73}]}
						>

							{/* card count*/}
							<View style={cardCountBox}>
								<Text style={cardCountText}> {usrCards.length} </Text>
							</View>

							{/* card component */}
							<View style={{width: "71%", flexDirection: 'row'}}>
								{usrCards_C}
							</View>

							{/* cycle/sort button */}
							{
								usrCards.length > limit ?
									<View style={{marginLeft: 40}}>
										<SortButton onPress={this.sortCards.bind(this, state, usrCards)}/>
									</View>
								: <View></View>
							}
						</View>
					</Row>

				</Grid>
			</ImageBackground>
		);
	}


	///////////////////////////////
	// GameCards onPress Actions //
	///////////////////////////////


	// market cards press
	marketPress(animateFn, p = 'player') {
		let game = currGame,
			n = game.gameState.cards[p].length;

		currGame.lastPlayed = null;

		if (game.gameState.cards.market.length === 0){
			// play sound (no market)
			return;
		}

		if (p == 'player'){
			this._animate = animateFn;
		}
		else if (animateFn == null){
			animateFn = this._animate || setTimeout;
		}


		if (game.gameState.gameTurn.who !== p){
			// play sound (invalid)
			return;
		}

		game.play(p, 'market', null);
		n = game.gameState.cards[p].length - n;

		// play sound (market) n times

		// last picked
		currGame.pickCount = n;
		currGame.lastMarketPicker = (p === 'cpu') ? 'cpucard' : p;

		// re-render <update state> after animation
		animateFn(() => {
			this.setState({ status: gameStatus(game.gameState) });

			currGame.lastMarketPicker = null;

			// cpu play
			if (p === 'player') this.cpuPlay(game);
		});
	}


	// players card press
	playerCardPress(card, animateFn) {
		const game = currGame, p = 'player',
			p_cards = game.gameState.cards[p];

		if (game.gameState.gameTurn.who !== p){
			// play sound (invalid)
			return;
		}

		const moves = game.moves(p),
			cards = moves.cards;

		if (cards.length === 0){
			// play sound (invalid)
			return;
		}

		if (game._playerHasCard(p, card, cards)) {

			if (card.type === 'whot') {
				if (p_cards.length == 1){
					// "Game won"
					p_cards.length = 0;
					return this.gameWinHandler(p);
				}
				return this.setState({shapesModal: true});
			}

			game.play(p, card, null, null, moves.msg === 'defended');
			currGame.lastPlayed = 'player';
		} else {
			// play sound (invalid)
			return;
		}

		// re-render gamescreen (after gamecard animation)
		animateFn(() => {

			// Play voice
			if (p_cards.length > 1){
				if (moves.msg) {
					voice.Speak(moves.msg, p);
				} else if (card.special) {
					voice.Speak(card.value, p)
				}
			}

			this.setState({status: gameStatus(game.gameState)});
			currGame.lastPlayed = null;

			// check if 'game won' or 'last card'
			if (p_cards.length <= 1){
				if (p_cards.length === 1)
					this.gameWinHandler(p, 1);
				else
					return this.gameWinHandler(p);
			}

			// pass control to cpu if turn changed
			if (game.gameState.gameTurn.who !== p){
				this.cpuPlay(game);
			}
		});

	}


	// cpu play handler
	cpuPlay(game, prevCard) {
		let [mv, msg] = game.aiMove(), p = 'cpu';
		let cpu_cards = game.gameState.cards[p];

		setTimeout(_=>{
			if (mv === 'market'){
				if ([1, 8].includes(prevCard)){
					voice.Speak('Continue', p);
				}
				return this.marketPress(null, p);
			}

			game.play(p, mv, null, null, msg === 'defended');
			currGame.lastPlayed = 'cpu';

			// Play voice
			if (cpu_cards.length > 1){
				if (msg){
					voice.Speak(msg, p);
				}
				else if (mv.special){
					let m = (mv.value == 20) ? mv.whotValue : mv.value;
					voice.Speak(m, p);
				}
			}

			this.setState({status: gameStatus(game.gameState)});
			currGame.lastPlayed = null;

			// check if game is won
			if (cpu_cards.length <= 1){
				if (cpu_cards.length == 1)
					this.gameWinHandler(p, 1); // last card
				else
					return this.gameWinHandler(p);
			}

			// play again if turn didn't change
			if (game.gameState.gameTurn.who === p){
				this.cpuPlay(game, mv.value);
			}
			else if (!mv.special && [1, 8].includes(prevCard)){
				voice.Speak('Continue', p);
			}

		}, 250);
	}


	//////////////////////
	// game win handler //
	//////////////////////

	gameWinHandler(p, last_card=false) {
		if (last_card) {
			return voice.Speak('Last Card', p);
		}
		else {
			// clear game in progress
			saveData(appData, 'user', 'gameInProgress', false);

			voice.Speak('Check up', p);
			this.setState({gameWon: p});
		}
	}


	/////////////
	// HELPERS //
	/////////////

	// sort cards wrt top game card, and re-render GameScreen
	sortCards(state, cards, shuffle = false, reRender = true) {

		let top = state.cards.gameCards[0],
			l = cardsViewLimit( height );

		// cyclic shift
		for (let i = 0; cards.length >= l && i < l; i+=1){
			cards.push(cards.shift());
		}

		// shift cards ( sort )
		shiftMatchingCards(top, cards, l);

		if (reRender)
			this.setState({});
	}


	//////////////////////////////
	// Whot Shape Picker Dialog //
	//////////////////////////////

	whotShapesModal() {
		let game = currGame,
			self = this,
			p = 'player',
			p_cards = game.gameState.cards[p];

		const closeModal = _=>self.setState({shapesModal: false});

		const cardPress = shape => {
			closeModal();

			let card = game._toMove(['whot', shape]);
			game.play(p, card);

			currGame.lastPlayed = 'player';
			self.setState({status: gameStatus(game.gameState)});

			currGame.lastPlayed = null;

			// Play voice (Give me {shape})
			voice.Speak(shape, p);

			// cpu play
			if (p_cards.length > 0){
				if (p_cards.length == 1)
					this.gameWinHandler(p, 1); // 'lastcard' warning
				this.cpuPlay(game);
			}
			else {
				return this.gameWinHandler(p);
			}
		};

		return (
			<WhotModal
				close={closeModal}
				onCardPress={cardPress}
			/>
		);
	}


	///////////////////////
	// "Game Won" Dialog //
	///////////////////////

	gameWonModal() {
		let self = this,
			winner = this.state.gameWon;

		const goBack = _=>{
			// refresh home page (update rating)
			DeviceEventEmitter.emit('goBack', {});

			global.navigator.goBack(null);
		};

		const restart = _ => self.initGame.call(self, true)

		return (
			<GameWonModal
				player_won={winner === 'player'}
				difficulty={currGame.gameState.difficulty}

				goback={goBack}
				restart={restart}
			/>
		);
	}

}



/**
 *  Takes raw game card object from WhotGame class
	  then converts to <Card/> Component
 */
function cardComponent(o, cardowner, onpress=_=>_, idx){
	return (
		<Card
			index={idx}
			type={cardowner}
			owner={cardowner}
			key={Math.random()}

			onPress={onpress}
			data={[o.type, o.value]}
			which={`${o.value}-${o.type}`}

			clickable={cardowner=='player'}
		/>
	);
}



/**
 *  How many cards can the user see on
 *   the game screen ( truncated )
 */
function cardsViewLimit(deviceWidth){
	/*
	  Various device widths,
		and the `cards per view (limit)` on the game screen.

	   These are actually the device heights,
     	but the games orientation is 'landscape', hence 'widths'.
	 */
	let d_widths = [
		[[1920], 9],
		[[1280,1600], 8],
		[[800,854], 7],
		[[600], 6],
		[[300,400,480], 5],
		[[280], 4],
	];

	let dw = deviceWidth;
	for (let [widths, limit] of d_widths){
		if (widths.includes(dw) || dw >= widths[0]){
			return limit;
		}
	}
	return 2;
}


/**
 * Get game status
 *  i.e 'Pick Two', 'Your turn',  etc.
 */
function gameStatus(state){
	let status;
	let tc = state.cards.gameCards[0]; // top game card

	let specialMessages = {
		1: 'Hold On',
		8: 'Suspension',
		2: 'Pick Two',
		5: 'Pick Three',
		14: 'Go Market!',
	};

	let cardNames = {
		'star': 'Star',
		'box': 'Square',
		'plus': 'Cross',
		'circ': 'Circle',
		'tri': 'Triangle',
	};


	if (state.gameTurn.who === 'player'){

		if (tc.type === 'whot')
			status = `Play ${cardNames[tc.whotValue]}`;
		else if (tc.special && [2,5,14].includes(tc.value) && !tc.old)
			status = specialMessages[tc.value];
		else
			status = 'Your turn';
	}
	else {
		if (tc.special && [1,8].includes(tc.value))
			status = specialMessages[tc.value];
		else
			status = 'CPUs turn';
	}
	return status;
}


////////////
// styles //
////////////

let deckPanelStyle = {
	width: "100%",
	height: "100%",
	backgroundColor: 'rgba(0,0,0,0.7)',
	flexDirection: 'row',
};


const marketStyle = {
	marginTop: 20,
	marginLeft: 20
};


const playedCardStyle = {
	 flex: 1,
	 marginTop: 25,
	 marginRight: 55,
	 alignItems: 'flex-end',
};


let gameStatusBox = {
	width: 94,
	height: 24,

	marginTop: 5,
	marginRight: 5,

	borderColor: '#fff',
};


const cardCountBox = {
	height: 26,
	padding: 5,
	paddingTop: 0,

	marginTop: 27,

	borderWidth: 1,
	borderRadius: 5,
	borderColor: '#ccc',

	backgroundColor: '#333',
}

const cardCountText = {
	color: '#fff',
};
