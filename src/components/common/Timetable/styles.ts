import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: theming.sizeSpacing15,
	},
	timetableWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: theming.sizeSpacing15,
	},
});
