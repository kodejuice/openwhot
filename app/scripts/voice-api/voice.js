
import Expo from 'expo';
import sounds from 'app/assets/sound/voices.js';


// voice file
const voiceFile = (which)=> (player)=> sounds[player][which];

// sfx file
const sfxFile = (which)=> sounds[which];


const specialMessages = {
	1: voiceFile('holdon'),
	2: voiceFile('picktwo'),
	5: voiceFile('pickthree'),
	8: voiceFile('suspension'),
	14: voiceFile('gomarket'),

	'defended': voiceFile('defended'),
	'continue': voiceFile('continue'),
	'check up': voiceFile('checkup'),
	'last card': voiceFile('lastcard'),
	'wait': voiceFile('wait'),
};


const cardRequests = {
	'star': voiceFile('star'),
	'box': voiceFile('square'),
	'plus': voiceFile('cross'),
	'circ': voiceFile('circle'),
	'tri': voiceFile('triangle'),
};


class Voice {
	Speak(m, who='player') {
		if (!appData.settings.voice)
			return;

		m = `${m}`.toLowerCase();

		if (m in specialMessages){
			return this.play(specialMessages[m], who);
		}
		else if (m in cardRequests){
			return this.play(cardRequests[m], who);
		}

		return;
	}


	// play voice feedback
	async play(file, player) {
		const sound = file(player);
		const soundObject = new Expo.Audio.Sound();

		try {
			await soundObject.loadAsync(sound);
			await soundObject.playAsync();
		} catch (error) {
			alert(error);
		}
	}


	// play sound effect
	async sfx(which) {
		if (!appData.settings.music)
			return;

		const sfx = sfxFile(which.toLowerCase());
		const soundObject = new Expo.Audio.Sound();

		try {
			await soundObject.loadAsync(sfx);
			soundObject.playAsync();

			return soundObject;
		} catch (error) {
			alert(error);
		}
	}
}



const voice = new Voice();
export default voice;
