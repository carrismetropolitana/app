import { StyleSheet } from 'react-native';

const name = {
	width: '90%',
} as const;

export const lineNameStyles = StyleSheet.create({
	alignCenter: {
		...name,
		justifyContent: 'center',
	},
	alignleft: {
		...name,
		alignItems: 'flex-start',
		textAlign: 'left',
	},
	alignRight: {
		...name,
		alignItems: 'flex-end',
		textAlign: 'right',
	},
	container: {
		paddingEnd: 30,
	},
	name: {
		fontSize: 16,
		fontWeight: 700,
	},
});
