import { createTheme } from '@rneui/themed';

const lightThemeDefinition = {
	colors: {
		background: '#f5f5f5',
		primary: '#3498db',
		text: '#000000',
	},
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
	mode: 'light' as const,
};

const darkThemeDefinition = {
	colors: {
		background: '#282832',
		primary: '#1abc9c',
		text: '#ffffff',
	},
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
		Text: {
			style: {
				color: '#ffffff',
				fontSize: 16,
			},
		},
	},
	mode: 'dark' as const,
};

export const lightTheme = createTheme(lightThemeDefinition);
export const darkTheme = createTheme(darkThemeDefinition);
