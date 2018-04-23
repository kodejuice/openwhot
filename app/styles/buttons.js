import { StyleSheet } from 'react-native';

// color styles

const styles = StyleSheet.create({
	// button container
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		width: "60%",

		marginLeft: 8
	},

	// home button
	homeButton: {
		alignItems: 'flex-start',
		alignSelf: 'flex-start',

		paddingTop: 10,

		width: 50,
		height: 60
	},

	// rounded corner button style
	roundCorner: {
		borderWidth: 1,
		borderColor:'rgba(0, 0, 0, 0.2)',

		width: 100,
		height: 105,

		borderRadius: 100
	},

	// plain button
	plainBtn: {
		width: "90%",
		height: 35,

		alignSelf: 'center',
		alignItems: 'center',

		justifyContent: 'flex-start',

		backgroundColor: 'maroon',

		padding: 4,
		margin: 10,
		borderRadius: 5,

		borderWidth: 1,
		borderColor: '#CCC'
	},

	plainBtnText: {
		fontSize: 23,
		marginTop: -5,

		color: "#CCC",

		textShadowOffset: {
			width: 1,
			height: 1
		},

		textShadowColor: '#FFF'
	},

	// dialog back-button
	backButton: {
		width: 35,
		height: 35,

		marginTop: 2,
		marginLeft: 2
	}
});

export default styles;