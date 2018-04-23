
/////////////////////
// Storage Helpers //
/////////////////////


export function saveStat(store, prop1, prop2, value){
	store.stats[prop1][prop2] = value;

	// resave apps data
	storage.save({
		key: 'app',
		data: store
	});
}


export function saveData(store, prop1, prop2, value){
	store[prop1][prop2] = value;

	// resave apps data
	storage.save({
		key: 'app',
		data: store
	});
}


export function saveSettings(store, prop, value, rules = false){
	// store['settings'][props] = value;
	//  ...
	//  e.g store['settings']['music'] = false

	if (rules)
		store.settings.rules[prop] = value;
	else
		store.settings[prop] = value;

	// resave apps data
	storage.save({
		key: 'app',
		data: store
	});
}

