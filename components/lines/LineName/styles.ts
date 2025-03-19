import { StyleSheet } from 'react-native';

const name = {
	color: '#000',
	justifyContent: 'flex-start',
	lineClamp: 3,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	width: '100%',
} as const;

export const lineNameStyles = StyleSheet.create({
	alignCenter: {
		...name,
		alignItems: 'center',
		textAlign: 'center',
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
	name: {
		fontSize: 16,
		fontWeight: 700,
	},
});
