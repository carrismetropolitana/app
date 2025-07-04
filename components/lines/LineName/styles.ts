import { StyleSheet } from 'react-native';

const name = {
	height: '100%',
	width: '100%',
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
		paddingEnd: 20,
	},
	name: {
		fontSize: 16,
		fontWeight: 700,
	},
});
