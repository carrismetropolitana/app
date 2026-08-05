/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		expandButton: {
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.55)',
			borderRadius: 8,
			height: 36,
			justifyContent: 'center',
			width: 36,
		},
		fullscreenContainer: {
			flex: 1,
		},
		loadingOverlay: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			justifyContent: 'center',
			zIndex: 10,
		},
		previewContainer: {
			height: 250,
			overflow: 'hidden',
			width: '100%',
		},
		previewMapContainer: {
			flex: 1,
			minHeight: 1,
		},
		previewOverlay: {
			...StyleSheet.absoluteFill,
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
			padding: 12,
			zIndex: 20,
		},
		sheetBackground: {
			backgroundColor: systemVariables.background[200],
			overflow: 'hidden',
		},
		sheetContainer: {
			flex: 1,
		},
		sheetIndicator: {
			backgroundColor: systemVariables.text[100],
		},
		sheetRoot: {
			height: '100%',
			minHeight: 500,
			position: 'relative',
		},
	});
};
