/* * */

import { createTheme } from '@rn-vui/themed';

import { theming } from './Variables';

/* * */

// A. Define theming - light mode
const lightThemeDefinition = {
	components: {
		Button: {
			buttonStyle: {
				backgroundColor: theming.colorSystemBackgroundLight100,
			},
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
		Input: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundLight100,
				borderColor: theming.colorSystemBorder200,
				borderRadius: 5,
				borderWidth: 1,
				height: 50,
			
				paddingTop: 5,
			},
			inputContainerStyle: {
				borderBottomWidth: 0,
			},
			inputStyle: {
				color: theming.colorSystemText300,
				fontSize: 17,
				fontWeight: theming.fontWeightText as '500',
			},
		},
		ListItem: {
			containerStyle: {
				// height: 70,
				// minHeigth: 70, ---> uncomment this to make lineItems slimmer, beware it breaks the profile inputs
				// maxHeight: 200,
				backgroundColor: theming.colorPrimaryWhite,
				borderColor: theming.colorSystemBorder100,
				borderWidth: 1,
			},
		},
		ListItemAccordion: {
			containerStyle: {
				backgroundColor: theming.colorPrimaryWhite,
			},
		},
		Overlay: {
			backdropStyle: {
				backgroundColor: 'rgba(0,0,0,0.5)',
			},
			overlayStyle: {
				backgroundColor: theming.colorSystemBackgroundLight200,
				borderRadius: 12,
				padding: 20,
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

//
// B. Define theming - dark mode

const darkThemeDefinition = {
	components: {
		Button: {
			// containerStyle: {
			// 	backgroundColor: theming.colorSystemBackgroundDark100,
			// },
			titleStyle: {
				color: theming.colorSystemText200,
			},
		},
		Input: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundDark100,
				borderColor: theming.colorSystemBorder200,
				borderRadius: 5,
				borderWidth: 1,
				height: 50,
				paddingLeft: 50,
				paddingTop: 5,
			},
			inputContainerStyle: {
				borderBottomWidth: 0,
			},
			inputStyle: {
				color: theming.colorSystemText200,
				fontSize: 17,
				fontWeight: theming.fontWeightText as '500',
			},
		},
		ListItem: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundDark100,
				borderColor: theming.colorSystemBorderDark200,
				borderWidth: 1,
			},
		},
		ListItemAccordion: {
			containerStyle: {
				backgroundColor: theming.colorSystemBackgroundDark100,
				borderRadius: 10,
			},
		},
		Overlay: {
			backdropStyle: {
				backgroundColor: 'rgba(0,0,0,0.5)',
			},
			overlayStyle: {
				backgroundColor: theming.colorSystemBackgroundDark200,
				borderRadius: 12,
				padding: 20,
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

//
// C. Export the themes

export const lightTheme = createTheme(lightThemeDefinition);
export const darkTheme = createTheme(darkThemeDefinition);

//
