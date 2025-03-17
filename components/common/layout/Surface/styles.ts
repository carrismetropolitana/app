import { StyleSheet } from 'react-native';

const container = {
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
} as const;

export const surfaceStyles = StyleSheet.create({
	containerAlerts: {
		...container,
		borderColor: '#fff',
		borderLeftWidth: 0,
		borderRadius: 0,
		borderRightWidth: 0,
		borderWidth: 1,
	},
	containerBrand: {
		...container,
		backgroundColor: '#ffdd01',
	},
	containerBrand2: {
		...container,
		backgroundColor: '#fff',
		borderColor: '#ffdd01',
		borderRadius: 0,
		borderWidth: 5,
	},
	containerDebug: {
		...container,
		backgroundColor: '#fff',
		borderColor: '#055252',
		borderRadius: 0,
		borderStyle: 'dashed',
		borderWidth: 1,
	},
	containerDefault: {
		...container,
		backgroundColor: '#f5f5f5',
		borderRadius: 0,
		borderWidth: 0,
	},
	containerMuted: {
		...container,
		backgroundColor: '#fff',
	},
	containerPersistent: {
		...container,
		borderColor: '#fff',
		borderLeftWidth: 0,
		borderRadius: 0,
		borderRightWidth: 0,
		borderWidth: 1,
	},
	containerStandOut: {
		...container,
		borderLeftWidth: 0,
		borderRadius: 0,
		borderRightWidth: 0,
		marginLeft: 0,
		marginRight: 0,
	},
	containerSuccess: {
		...container,
		backgroundColor: '#fff',
		borderColor: '#5dba50',
		borderRadius: '22px',
		borderWidth: 3,
	},
	containerWarning: {
		...container,
		backgroundColor: '#fff',
		borderTopColor: '#FF6900',
		borderTopWidth: 5,
		borderWidth: 0,
		boxShadow: '0',
	},
	forceOverflow: {
		overflow: 'hidden',
	},
	fullHeight: {
		height: '100%',
	},
});
