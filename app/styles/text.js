import { StyleSheet } from 'react-native';

// text styles

const styles = StyleSheet.create({
	headerContainer: {
		height: 40,
		flexDirection: 'row' 
	},

	// modal header text
	headerText: {
		color: 'maroon',
		textShadowColor: '#FFF',
		textShadowRadius: 5,

		textShadowOffset: {
			width: 1,
			height: 1
		},

		alignSelf: 'flex-start',
		fontSize: 24,
		justifyContent: 'flex-start'
	},

	// About Modal text container
	transparentContainer: {
		flex: 1,
		alignItems: 'flex-start',
		width: "100%",

		backgroundColor: 'rgba(0,0,0,0.4)',

		padding: 10,
	},

	// Container margin bottom
	containerMarginBottom: {
		marginBottom: 10
	},

	// About Modal text style
	aboutText: {
		color: '#CCC',
		textAlign: 'justify'
	},

	// Stats text style
	statsText: {
		color: '#CCC',
		textAlign: 'justify'
	},

	// Stats number
	statsText_c: {
		paddingLeft: 14,
		color: '#CCC',
		textAlign: 'justify'
	},

	// bold text
	bold: {
		fontWeight: 'bold'
	},

	// link text
	linkText: {
		color: '#FFF',
		textDecorationLine: 'underline'
	},

	// About Modal SubHeader text
	aboutHeaderText: {
		color: '#CCC',
		marginTop: 10,
		fontSize: 19,
		fontWeight: 'bold'
	},

	// regular white text
	whiteBoldText: {
		color: '#FFF',
		fontWeight: 'bold'
	},

	// center-align
	centerAlign: {
		alignSelf: 'center'
	},

});

export default styles;
