import { StyleSheet } from 'react-native';

const container = {
	alignItems: 'center',
	backgroundColor: '#5a5a64',
	borderRadius: 999,
	color: '#fff',
	fontWeight: 800,
	justifyContent: 'center',
	textAlign: 'center',
} as const;

export const lineBadgeStyles = StyleSheet.create({
	alertIcon: {
		alignItems: 'center',
		backgroundColor: 'red',
		borderRadius: 999,
		display: 'flex',
		height: 20,
		justifyContent: 'center',
		padding: 10,
		position: 'absolute',
		right: -10,
		top: -10,
		width: 20,

	},
	clickable: {
		transitionDuration: '0.2s',
		transitionProperty: 'all',
		transitionTimingFunction: 'ease',
	},
	default: {
		...container,
	},
	sizeLg: {
		...container,
		fontSize: 20,
		maxHeight: 30,
		maxWidth: 70,
		minHeight: 30,
		minWidth: 70,
		padding: 2,
	},
	sizeMd: {
		...container,
		fontSize: 14,
		maxHeight: 26,
		maxWidth: 65,
		minHeight: 26,
		minWidth: 65,
		padding: 3,
	},
});
