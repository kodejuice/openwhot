import React from 'react';

import { Switch } from 'react-native-switch';

import _Modal from 'app/components/modal.js';
import styles from 'app/styles/buttons.js';

import { saveSettings } from 'app/scripts/storage/helpers.js';


// switches
let switsh = {
	"music":  () => _S(appData.settings.music, (val) => saveSettings(appData, 'music', val)),
	"voice": () => _S(appData.settings.voice, (val) => saveSettings(appData, 'voice', val)),

	// card rules
	"openCards": () =>_S(appData.settings.rules.openCards, (val) => saveSettings(appData, 'openCards', val, true)),
	"holdOn": () =>_S(appData.settings.rules.holdOn, (val) => saveSettings(appData, 'holdOn', val, true)),
	"pickTwo": () =>_S(appData.settings.rules.pickTwo, (val) => saveSettings(appData, 'pickTwo', val, true)),
	"pickThree": () =>_S(appData.settings.rules.pickThree, (val) => saveSettings(appData, 'pickThree', val, true)),
	"suspension": () =>_S(appData.settings.rules.suspension, (val) => saveSettings(appData, 'suspension', val, true)),
	"goMarket": () =>_S(appData.settings.rules.goMarket, (val) => saveSettings(appData, 'goMarket', val, true)),
	"defence": () =>_S(appData.settings.rules.defence, (val) => saveSettings(appData, 'defence', val, true))
};


// returns a (<Switch />) Component
function _S(value, onChange){
	return (
		<Switch
			value={value}
			onValueChange={onChange}
			activeText={'On'}
			inActiveText={'Off'}
			backgroundActive={'green'}
			backgroundInactive={'gray'}
			circleActiveColor={'#30a566'}
			circleInActiveColor={'#000000'}
		/>
	);
}


/* SettingsSwitch class */
export class SettingsSwitch extends React.Component {
	render (){
		return switsh[this.props.for]();
	}
}

