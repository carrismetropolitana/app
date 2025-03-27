import { createTheme } from '@rneui/themed';

import { theming } from './Variables';

const lightThemeDefinition = {
	components: {
		Button: {
			containerStyle: {
				backgroundColor: '#3498db',
				borderRadius: 5,
				paddingHorizontal: 20,
				paddingVertical: 10,
			},
			titleStyle: {
				color: '#ffffff',
				fontWeight: 'bold' as const,
			},
		},
		Text: {
			style: {
				color: '#000000',
				fontSize: 16,
			},
		},
	},
	lightColors: {
		background: '#F5F5F5',
		primary: theming.colorPrimaryBlack,
		text: theming.colorPrimaryBlack,
	},
	Link: {
		style: {
			color: '#000000',
			fontSize: 16,
		},
	},
	mode: 'light' as const,
};

const darkThemeDefinition = {
	components: {
		Button: {
			containerStyle: {
				backgroundColor: '#1abc9c',
				borderRadius: 5,
				paddingHorizontal: 20,
				paddingVertical: 10,
			},
			titleStyle: {
				color: '#ffffff',
				fontWeight: 'bold' as const,
			},
		},
	},
	darkColors: {
		background: '#1E1E28',
		primary: theming.colorPrimaryWhite,
		text: theming.colorPrimaryWhite,
	},
	Link: {
		style: {
			color: '#000000',
			fontSize: 16,
		},
	},
	mode: 'dark' as const,
};

export const lightTheme = createTheme(lightThemeDefinition);
export const darkTheme = createTheme(darkThemeDefinition);
