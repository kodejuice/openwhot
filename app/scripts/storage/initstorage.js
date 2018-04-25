import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

var storage = new Storage({
	size: 500,

	storageBackend: AsyncStorage,

	defaultExpires: null,

	enableCache: true,
});

// globalize
global.storage = storage;


// Initializes Default storage data
export async function loadAppData() {

	return storage.load({ key: 'app' })
		.then(x => {
			global.appData = x;
		})
		.catch(async _ => {
			global.appData = await initializeAppData(storage);
		});
}


// initialize Apps default storage data
async function initializeAppData(store){
	let data = {
		// user info
		user: {
			// glicko2 rating variables
			rating: 1200,
			vol: 0.06, // volatility
			rd: 350, // rating deviation

			gameInProgress: null
		},

		// default settings
		settings: {
			music: true,
			voice: true,

			// card rules
			rules: {
				openCards: true,
				holdOn: true,
				pickTwo: true,
				pickThree: false,
				suspension: false,
				goMarket: true,
				defence: true
			}
		},

		// default stats
		stats: {
			wins: {
				novice: 0,
				amateur: 0,
				competent: 0,
				proficient: 0,
				grandmaster: 0
			},
			loss: {
				novice: 0,
				amateur: 0,
				competent: 0,
				proficient: 0,
				grandmaster: 0
			}
		},
	};

	store.save({
		key: 'app',
		data
	});

	return storage.load({key: 'app'});
}

