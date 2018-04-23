import { StyleSheet } from 'react-native';

// Componenets styles

const styles = StyleSheet.create({

	//  container
	OpacityContainer: {
		flex: 1,
		alignItems: 'flex-start',
		width: "100%",

		backgroundColor: 'rgba(0,0,0,0.4)',

		padding: 10,

		marginBottom: 6
	},

	// Opacity Text
	OpacityText: {
		color: '#fff',
		fontWeight: "bold",
		fontSize: 15,

		width: 50,
		flex: 1
	}

});

export default styles;