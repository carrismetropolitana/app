import { createTheme } from '@rneui/themed';

import { theming } from './Variables';

const lightThemeDefinition = {
	components: {
		Button: {
			buttonStyle: {
				backgroundColor: theming.colorSystemBackgroundLight200,
				borderColor: theming.colorSystemBorder200,
				borderWidth: 1,
				padding: 20,
			},
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
		ListItem: {
			containerStyle: {
				backgroundColor: theming.colorPrimaryWhite,
				borderColor: theming.colorSystemBorder100,
				borderWidth: 1,
			},
		},
	},
	lightColors: {
		background: theming.colorSystemBackgroundLight200,
		itemBackground: theming.colorPrimaryBlack,
		primary: theming.colorPrimaryBlack,
		text: theming.colorPrimaryBlack,
	},
	mode: 'light' as const,
};

const darkThemeDefinition = {
	components: {
		Button: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundDark200,
				borderColor: theming.colorSystemBorderDark200,
				borderWidth: 1,
			},
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
		ListItem: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundDark100,
				borderColor: theming.colorSystemBorderDark200,
				borderWidth: 1,
			},
		},
	},
	darkColors: {
		background: theming.colorSystemBackgroundDark200,
		itemBackground: theming.colorPrimaryWhite,
		primary: theming.colorPrimaryWhite,
		text: theming.colorPrimaryWhite,
	},
	mode: 'dark' as const,
};

export const lightTheme = createTheme(lightThemeDefinition);
export const darkTheme = createTheme(darkThemeDefinition);
