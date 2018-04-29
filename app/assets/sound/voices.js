

// Game sounds/sfx effects


const sounds = {
	'cpu': {
		'checkup': require('app/assets/sound/voice/cpu/checkup.wav'),
		'continue': require('app/assets/sound/voice/cpu/continue.wav'),
		'defended': require('app/assets/sound/voice/cpu/defended.wav'),
		'gomarket': require('app/assets/sound/voice/cpu/gomarket.wav'),
		'holdon': require('app/assets/sound/voice/cpu/holdon.wav'),
		'lastcard': require('app/assets/sound/voice/cpu/lastcard.wav'),
		'pickthree': require('app/assets/sound/voice/cpu/pickthree.wav'),
		'picktwo': require('app/assets/sound/voice/cpu/picktwo.wav'),
		'suspension': require('app/assets/sound/voice/cpu/suspension.wav'),
		'wait': require('app/assets/sound/voice/cpu/wait.wav'),

		// cards requests
		'circle': require('app/assets/sound/voice/cpu/cards/circle.wav'),
		'cross': require('app/assets/sound/voice/cpu/cards/cross.wav'),
		'square': require('app/assets/sound/voice/cpu/cards/square.wav'),
		'star': require('app/assets/sound/voice/cpu/cards/star.wav'),
		'triangle': require('app/assets/sound/voice/cpu/cards/triangle.wav'),
	},


	'player': {
		'checkup': require('app/assets/sound/voice/player/checkup.wav'),
		'continue': require('app/assets/sound/voice/player/continue.wav'),
		'defended': require('app/assets/sound/voice/player/defended.wav'),
		'gomarket': require('app/assets/sound/voice/player/gomarket.wav'),
		'holdon': require('app/assets/sound/voice/player/holdon.wav'),
		'lastcard': require('app/assets/sound/voice/player/lastcard.wav'),
		'pickthree': require('app/assets/sound/voice/player/pickthree.wav'),
		'picktwo': require('app/assets/sound/voice/player/picktwo.wav'),
		'suspension': require('app/assets/sound/voice/player/suspension.wav'),

		// cards requests
		'circle': require('app/assets/sound/voice/player/cards/circle.wav'),
		'cross': require('app/assets/sound/voice/player/cards/cross.wav'),
		'square': require('app/assets/sound/voice/player/cards/square.wav'),
		'star': require('app/assets/sound/voice/player/cards/star.wav'),
		'triangle': require('app/assets/sound/voice/player/cards/triangle.wav'),
	},


	// sfx
	'intro': require('app/assets/sound/sfx/intro.wav'),
	'market': require('app/assets/sound/sfx/market.wav'),
	'youwin': require('app/assets/sound/sfx/youwin.wav'),
	'youlose': require('app/assets/sound/sfx/youlose.wav'),
	'invalid': require('app/assets/sound/sfx/invalid.wav'),
	'cardplay': require('app/assets/sound/sfx/cardplay.wav'),
	'defended': require('app/assets/sound/sfx/defended.wav'),
};


export default sounds;
