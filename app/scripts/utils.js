
import _ from 'lodash';

global.str = x=>JSON.stringify(x);


// shift all cards that match topGameCard to front of deck
export function shiftMatchingCards(topcard, cards, l = 5){
	let matching_cards = [];

	for (let i = k = 0; i < l && cards[i-k]; i+=1){
		let card = cards[i-k];

		if (type(card) == type(topcard) || card.value == topcard.value){
			matching_cards.push(card);
			cards.splice(i - k, 1);
			k += 1;
		}
	}

	matching_cards = _.shuffle(matching_cards);

	while (matching_cards.length){
		cards.unshift(matching_cards.pop());
	}
}


// Get card type (shape)
function type(x){
	return x.type == 'whot'? x.whotValue : x.type;
}


// map user rating to level
export function ratingToLevel(rating){
	rating = Math.floor(rating);
	
	/*
		novice:      900 - 1200
		amateur:     1201 - 1499
		competent:   1500 - 1899
		proficient:  1900 - 2199
		grandmaster: 2200+
	*/

	let rranges = [900, 1201, 1500, 1900, 2200];
	let levels = ['Novice', 'Amateur', 'Competent', 'Proficient', 'GrandMaster'];

	for (let i=rranges.length-1; i>=0; i-=1){
		if (rating >= rranges[i]){
			return levels[i];
		}
	}

	return 'Novice'; // 'Olodo' :/
}

