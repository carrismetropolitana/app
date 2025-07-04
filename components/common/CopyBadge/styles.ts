import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

const container = {
	alignItems: 'center',
	borderRadius: 999,
	color: 'rgb(150, 150, 165)',
	cursor: 'pointer',
	flexWrap: 'wrap',
	fontWeight: 700,
	justifyContent: 'center',
	lineHeight: 1,
	padding: 20,
	textAlign: 'center',
	textTransform: 'uppercase',
} as const;

export const copyBadgeStyles = StyleSheet.create({
	container: {
		...container,
	},
	hasBorder: {
		...container,
		backgroundColor: 'rgb(30,30,40)',
		borderColor: 'rgb(80,80,65)',
		borderStyle: 'solid',
		borderWidth: 1,
		paddingRight: 15,
		paddingTop: 3,
	},
	sizeLg: {
		...container,
		fontSize: 10,
		letterSpacing: 0.5,
		paddingRight: 15,
	},
	sizeMd: {
		...container,
		fontSize: 10,
		letterSpacing: 0.5,
		paddingBottom: 8,
		paddingLeft: 3,
		paddingRight: 8,
		paddingTop: 3,

	},
	text: {
		color: theming.colorSystemText400,
		fontWeight: 700,
		textTransform: 'uppercase',
	},
});
