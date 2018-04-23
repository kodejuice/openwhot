/**
 * WhotGame AI
 *
 *  Used in the OpenWhot game (openwhot.js)
 *  
 * (C) Sochima Biereagu, 2018
 */

import _ from 'lodash';

export default class WhotAI {

	// get AI move
	aiMove() {

		// incomplete
		
		let {cards, msg} = this.moves('cpu');

		if (cards.length === 0){
			return ['market', ];
		}

		return [_.shuffle(cards)[0], msg];
	}

}

