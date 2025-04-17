import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const useSectionStyles = () => {
	const themeContext = useThemeContext();

	return StyleSheet.create({
		/* * */
		/* CONTAINER */
		container: {
			paddingBottom: 0,
			width: '100%',
		},
		withGap: {
			gap: 15,
		},
		/* * */
		/* CONTAINER / MODIFIERS */
		withBottomDivider: {
			borderBottomColor: 'rgb(230 230 250)',
			borderBottomWidth: 1,
		},
		/* * */
		/* HEADING  WRAPPER */
		headingWrapper: {
			alignItems: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			justifyContent: 'flex-start',
			padding: 10,
			paddingLeft: 15,
			width: '100%',
		},
		headingWrapperWithPadding: {
			alignItems: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			justifyContent: 'flex-start',
			paddingBottom: 0,
			width: '100%',
		},
		/* * */
		/* HEADING */
		heading: {
			color: themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorPrimaryWhite,
			fontSize: 16,
			fontWeight: 600,

		},
		href: {
			alignItems: 'baseline',
			display: 'flex',
			gap: 5,
			justifyContent: 'flex-start',
		},

		hrefHover: {
			textDecorationLine: 'underline',
		},
		hrefIcon: {
			color: 'rgb(100 100 110)',
			transform: 'translate(0, 2px)',
		},

		successHeading: {
			color: '#5dba50',
		},
		warningHeading: {
			color: '#FF6900',
		},
		/* * */
		/* SUBHEADING */
		subheading: {
			color: theming.colorSystemText300,
			fontSize: 12,
			fontWeight: '400',
			maxWidth: 500,
			width: '100%',
		},
		/* * */
		/* CHILDREN WRAPPER */
		childrenWrapper: {
			alignItems: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			padding: 20,
			width: '100%',
		},
		/* * */
		/* CHILDREN WRAPPER / MODIFIERS */
		childrenWrapperWithGap: {
			gap: 15,
		},

		childrenWrapperWithPadding: {
			padding: 20,
		},
	});
};
