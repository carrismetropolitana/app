import { StyleSheet } from 'react-native';

const container = {
	alignItems: 'center',
	backgroundColor: '#5a5a64',
	borderRadius: 999,
	color: '#fff',
	display: 'flex',
	fontWeight: 800,
	justifyContent: 'center',
	letterSpacing: 1,
	lineHeight: 1,
	position: 'relative',
} as const;

export const lineBadgeStyles = StyleSheet.create({
	alertIcon: {
		alignItems: 'center',
		backgroundColor: '#000',
		borderRadius: 999,
		color: '#054B8C',
		display: 'flex',
		height: 20,
		justifyContent: 'center',
		position: 'absolute',
		right: -10,
		top: -10,
		width: 20,
	},
	clickable: { cursor: 'pointer',
		transitionDuration: '0.2s',
		transitionProperty: 'all',
		transitionTimingFunction: 'ease',
	},
	default: {
		...container,
	},
	sizeLg: {
		...container,
		fontSize: 16,
		maxHeight: 26,
		maxWidth: 65,
		minHeight: 26,
		minWidth: 65 },
	sizeMd: {
		fontSize: 16,
		maxHeight: 26,
		maxWidth: 65,
		minHeight: 26,
		minWidth: 65,
	},
});
