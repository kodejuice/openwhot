/**
 * WhotGame Script
 *
 *  Used in the OpenWhot game
 *  
 * (C) Sochima Biereagu, 2018
 */

import _ from 'lodash';
import WhotAI from 'app/scripts/game/openwhot-ai.js';



export default class WhotGame extends WhotAI {

	constructor(obj, rules = {}, difficulty) {
		super();

		this.setRules(rules);

		if (_.isObject(obj.gameTurn)) {
			// a gameState object
			this.gameState = obj;

			// update 'special' property of all cards,
			//  incase of settings change

			let {cards} = this.gameState;

			for (var k in cards){
				if (k !== 'market_count')
					this._setSpecial(cards[k]);
			}
		}
		else {
			let _this = this, i = 0;
			let market = this._initCards(difficulty), movesHistory = [];
			let customCards = obj.cards || {};

			let player1Cards = this._fetchCards(market, customCards.player1 || 5, false, difficulty),
				player2Cards = this._fetchCards(market, customCards.player2 || 5, false, difficulty);

			// Get game starting card (card on top)
			let gameCard = market[i];
			while (gameCard.type === 'whot') gameCard = market[++i]
			market.splice(i, 1); // remove selected card deck

			this.players = [obj.player1, obj.player2];

			// game state
			this.gameState = {
				players: _this.players,
				difficulty: 'novice',

				gameTurn: {
					who: obj.player1,
					[obj.player1]: obj.player2,
					[obj.player2]: obj.player1
				},

				cards: {
					gameCards: [gameCard],
					[obj.player1]: player1Cards,
					[obj.player2]: player2Cards,

					// market picks, (used for game state evaluation)
					market_count: {
						[obj.player1]: 0,
						[obj.player2]: 0,
					},

					market
				},

				// AI ish (see openwhot-ai.js)
				movesHistory
			};

			this.setDifficulty(difficulty);
		}
	}


	// return available playable cards for player
	moves(player) {
		let gameCard = this.gameState.cards.gameCards[0]; // top gamecard
		let _cards = this.gameState.cards[player].slice(0); // copy of players cards

		if (_cards.length === 0){
			return {cards: []};
		}

		let moves = [],
			_this = this,
			rules = this.rules;

		// pick two ? pick three ? go market ?
		if (gameCard.special && !gameCard.old) {
			let tc = gameCard,
				v = tc.value;
			if (v === 2 || v === 5) {
				let valid = this._getCardsByNum(player, v)
								.map(x => {x.old=true; return x});

				if (rules.defence && valid.length > 0)
					return {cards: valid, msg: 'defended'};
				else
					return {cards: []};
			} else if (v === 14) {
				return {cards: []};
			}
		}


		let cards = [];
		// Expand player 'Whot cards'<20> into all shapes
		_cards.forEach(x => {
			let c = x.type == 'whot' ? _this._expandWhot() : [x];
			cards.push(...c);
		});

		cards.forEach(p => {
			if (_this._isCompatible(gameCard, p) || p.type == 'whot') {
				moves.push(p);
			}
		});

		return {cards: moves};
	}


	// play a card
	//  .play(player, {type: 'box', value: 5})
	//  .play(player, 'market')
	//  ...
	play(player, move, mm=false, done, oldCard=false) {

		// go market ?
		if (move === 'market') {
			let pickCount = 1;
			let tc = this.gameState.cards.gameCards[0],
				v = tc.value;

			if (tc.special && !tc.old && tc.played_by !== player){
				if (v == 2) pickCount = 2;
				else if(v == 5) pickCount = 3;

				// player doesn't have to pick (2 || 3) again
				tc.old = (pickCount!==1 || v==14);
			}

			if (!mm) {
				// only pick card(s) 
				//  if this wasnt a minimax call
				this.pick(player, pickCount, done);
			} else {
				// if its minimax call,
				//  just increment the market count of this player
				this.gameState.cards.market_count[player] += pickCount;			
			}
	
			if (mm) {
				this.gameState.movesHistory.push({
					type: 'market',
					picks: pickCount,
					turn: this.gameState.gameTurn.who
				});
			}

			this._toggleTurn(player, true);

			return;
		}

		//////////////////////////////////////
		// place card ontop gamecards stack //
		//////////////////////////////////////

		move.old = oldCard;
		move.played_by = player;
		move.turn = this.gameState.gameTurn.who; // current game turn ( useful to .unplay() )

		this.gameState.cards.gameCards.unshift(move); // place card ontop game cards
		this._removePlayerCard(player, move);         // remove played card from players deck

		if (mm) this.gameState.movesHistory.push(move);

		// switch turn
		this._toggleTurn(player);
	}


	// unplay card
	//  .unplay(player, {type: 'box', value: 5})
	//  .unplay(player, 'market')
	//  ...
	//  Used for AI move generation (minimax)
	unplay(player, move) {

		if (move.type === 'market'){
			this.gameState.cards.market_count[player] -= move.picks;
			this.gameState.gameTurn.who = move.turn;
			return;
		}

		let p_cards = this.gameState.cards[player];

		p_cards.push(move);	// add card back to players deck
		this.gameState.cards.gameCards.shift(); // remove from game cards

		// new topcard
		if (this.gameState.cards.gameCards.length)
			this.gameState.cards.gameCards[0].old = false;

		// switch turn
		this.gameState.gameTurn.who = move.turn;
	}


	// get random cards for player from market
	pick(player, cardsCount, fn) {
		if (this.gameState.cards.market.length <= 6)
			this._reloadMarket(fn);

		let cards = this._fetchCards(this.gameState.cards.market, cardsCount, player=='player', this.gameState.difficulty);
		this.gameState.cards[player].unshift(...cards);

		return cards;
	}


	// set game difficulty
	setDifficulty(diff){
		this.gameState.difficulty = diff;
	}


	// set game rules
	setRules(rules = {}) {
		this.rules = this._extendObj(rules, {
			holdOn: true,
			pickTwo: true,
			goMarket: true,
			defence: true,
			suspension: false,
			pickThree: false
		});
	}


	// initialize cards and shuffle
	_initCards(level) {
		let cards = [], self = this;
		let pack = {
			'whot': [20, 20, 20, 20, 20],
			'star': [1, 2, 3, 4, 5, 7, 8],
			'box': [1, 2, 3, 5, 7, 10, 11, 13, 14],
			'plus': [1, 2, 3, 5, 7, 10, 11, 13, 14],
			'tri': [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
			'circ': [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
		};

		if (level === 'competent'){
			pack['whot'] = pack['whot'].slice(3);
		}

		for (var t in pack) {
			if (pack.hasOwnProperty(t)) {
				pack[t].forEach((x) => {
					if (!self._bannedCard(x, level))
						cards.push(self._toMove([t, x]));
				});
			}
		}

		return _.shuffle(cards);
	}

	/////////////
	// HELPERS //
	/////////////

	_bannedCard(x, d) {
		if (x !== 20)
			return false;

		if (d === 'grandmaster' || d === 'proficient') {
			if (x === 20) return true;
		}
		return false;
	}

	// reload game market cards
	_reloadMarket(fn){
		let played = this.gameState.cards.gameCards;
		let {market} = this.gameState.cards;

		// get cards from played cards
		while (played.length > 1){
			market.push(played.pop());
		}

		if (fn) fn();
	}

	// toggle players turn
	_toggleTurn(player, q=false){
		if (q)
			return this.gameState.gameTurn.who = this.gameState.gameTurn[player];

		let card = this.gameState.cards.gameCards[0], // last played card
			v = card.value;

		// dont toggle if last played card is (1 || 8)
		//  ... (hold on || suspension)
		if (card.special && (v == 1 || v == 8)) return;

		this._toggleTurn(player, true);
	}

	// update 'special' property of cards
	_setSpecial(cards){
		for (var c of cards) if (c) {
			c.special = this._isSpecial(c.value);
		}
	}

	// get random cards from market
	_fetchCards(market, items, limit, level) {
		let cards = [], crd, d = level;

		if (typeof items === 'number') {
			while (cards.length < items) {
				crd = market.shift();

				if (limit){
					// skip a special card
					if (d === 'grandmaster' || d === 'proficient') {
						if (this._isSpecial(crd.value)) {
							market.push(crd);
							continue;
						}
					}
				}

				cards.push(crd);
			}
		} else {
			// fetch custom cards
			for (let i = 0; i < items.length; i += 1) {
				let [type, value] = items[i]; // e.g ['box', 2]
				let card = 
					market.filter(x => (x.type==type && type=='whot') || (x.type==type && x.value==value))[0];

				if (card) {
					cards.push(card);
					market.splice(market.indexOf(card), 1); // remove picked card					
				}
			}
		}

		return cards;
	}

	// expand 'Whot (20)' into all shapes
	_expandWhot() {
		let moves = [],
			_this = this;
		let p = this._toMove(['whot', 20]);
		let shapes = _.shuffle(['tri', 'box', 'plus', 'star', 'circ']);

		shapes.forEach(x => {
			moves.push(_this._extendObj({
				whotValue: x
			}, p, true));
		});
		return moves;
	}

	// remove players card
	_removePlayerCard(player, card) {
		let p_cards = this.gameState.cards[player];

		for (let i = 0; i < p_cards.length; i += 1) {
			if (p_cards[i].type == card.type && p_cards[i].value == card.value) {
				p_cards.splice(i, 1);
				return;
			}
		}
	}

	// check if player has a specific card
	_playerHasCard(player, card, cards=null) {
		let p_cards = !cards ? this.gameState.cards[player] : cards;

		return p_cards.filter(x => x.type == card.type && x.value == card.value).length > 0;
	}

	// get cards by their values
	_getCardsByNum(player, val) {
		let p_cards = this.gameState.cards[player];

		return p_cards.filter(x => x.value == val);
	}

	// convert a move in array format to object form
	// ['box', 5] => {type: 'box', value: 5}
	// ['whot', 'box'] => {type: 'whot', value: 20, whotValue: 'box'}
	// 
	_toMove(arr) {
		let o = {
			type: arr[0]
		};

		let x = arr[1];
		if (arr[0] == 'whot') {
			o.value = 20, o.special = true;
			o.whotValue = (x != 20) ? x : null;
		} else {
			o.value = x;
		}
		o.special = this._isSpecial(x);

		return o;
	}

	// check if two cards are compatible
	_isCompatible(card1, card2) {
		// card1 - top game card
		// card2 - card beign tested

		if (card1.type === 'whot') {
			if (card2.type === 'whot') {
				return true;
			} else if (card2.type !== card1.whotValue) {
				return false;
			}
		} else if (card2.type === 'whot') {
			// a whot card goes ontop any card
			return true;
		} else if (card1.type !== card2.type && +card1.value !== +card2.value) {
			return false;
		}
		return true;
	}


	// check if a card is special
	//  1 <hold on>, 2 <pick two>, ...
	_isSpecial(x) {
		let rules = this.rules;

		if ([1,2,5,8,14,20].includes(x)) {
			if (rules.holdOn && x == 1) return true;
			else if (rules.pickTwo && x == 2) return true;
			else if (rules.pickThree && x == 5) return true;
			else if (rules.suspension && x == 8) return true;
			else if (rules.goMarket && x == 14) return true;
			else if (x == 20) return true;
		}
		return false;
	}

	// extend an object with new entries
	_extendObj(obj, _default, clone = false) {
		return _.extend((clone ? _.clone(_default) :_default), obj);
	}

}

///////////////
// END CLASS //
///////////////



// let game = new WhotGame({
// 	player1: "player1",
// 	player2: "cpu",
// 	cards: {
// 		player1: [
// 			['box', 5],
// 			['tri', 4]
// 		],
// 		player2: [
// 			['box', 1],
// 			['box', 2],
// 			['box', 7]
// 		]
// 	}
// }, {
// 	suspension: true,
// 	defence: false
// });


// let player1 = game.players[0],
// 	player2 = game.players[1];

// game.gameState.cards.gameCards = [{ type: 'plus', value: 5 }];

// let moves = game.moves(player1);

