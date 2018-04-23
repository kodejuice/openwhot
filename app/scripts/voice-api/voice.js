
import Expo from 'expo';


const specialMessages = {
	1: 'Hold On',
	2: 'Pick Two',
	5: 'Pick Three',
	8: 'Suspension',
	14: 'Go Market',

	'defended': 'Defended',
	'continue': 'Continue',
	'check up': 'Check up',
	'last card': 'Last Card !',
	'game restarted': 'Game restarted',
};

const cardNames = {
	'star': 'Give me Star',
	'box': 'Give me Square',
	'plus': 'Give me Cross',
	'circ': 'Give me Circle',
	'tri': 'Give me Triangle',
};



class Voice {
	Speak(m, who='player') {
		if (!appData.settings.voice)
			return;

		m = (''+m).toLowerCase();

		if (m in specialMessages)
			return this.play(specialMessages[m], who);
		else if (m in cardNames)
			return this.play(cardNames[m], who);

		return this.play(m);
	}

 
	play(msg, player) {
		Expo.Speech.speak(msg)
	}


	sound(msg) {
		if (!appData.settings.music)
			return;

		// TODO: convert TTS to pre-recorded voice
	}
}



const voice = new Voice();
export default voice;
