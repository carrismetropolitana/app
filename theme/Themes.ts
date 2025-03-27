import { createTheme } from '@rneui/themed';

import { theming } from './Variables';

const lightThemeDefinition = {
	components: {
		Button: {
			buttonStyle: {
				backgroundColor: theming.colorSystemBackground200,
			},
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
	},
	lightColors: {
		background: '#F5F5F5',
		primary: theming.colorPrimaryBlack,
		text: theming.colorPrimaryBlack,
	},
	mode: 'light' as const,
};

const darkThemeDefinition = {
	components: {
		Button: {
			buttonStyle: {
				backgroundColor: '#1E1E28',
			},
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
	},
	darkColors: {
		background: '#1E1E28',
		primary: theming.colorPrimaryWhite,
		text: theming.colorPrimaryWhite,
	},
	mode: 'dark' as const,
};

export const lightTheme = createTheme(lightThemeDefinition);
export const darkTheme = createTheme(darkThemeDefinition);
