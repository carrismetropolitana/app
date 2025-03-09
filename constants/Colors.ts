/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
	light: {
		text: "#11181C",
		background: "#fff",
		tint: tintColorLight,
		icon: "#687076",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: "#ECEDEE",
		background: "#151718",
		tint: tintColorDark,
		icon: "#9BA1A6",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
	},
};

export const CMColors = {
	static: {
		brandYellow: "#ffdd00",
	},
	light: {
		systemBackground100: "#fff",
		systemBackground200: "#f5f5f5",
		systemBackground300: "#f0f0f0",
		systemBackground900: "#000",

		systemBorder100: "rgb(230 230 250)",
		systemBorder200: "#bebec8",

		systemText100: "#000",
		systemText200: "#5a5a64",
		systemText300: "#9696a0",
		systemText400: "#d2d2dc",

		brandYellowForText: "#bfa600", // og brand color has too little contrast difference on white background
	},
	dark: {
		systemBackground100: "rgb(40 40 50)",
		systemBackground200: "rgb(30 30 40)",
		systemBackground300: "rgb(10 10 20)",

		systemBorder100: "rgb(60 60 65)",
		systemBorder200: "rgb(80 80 85)",

		systemText100: "rgb(255, 255, 255)",
		systemText200: "rgb(200, 200, 210)",
		systemText300: "rgb(150, 150, 165)",
		systemText400: "rgb(100, 100, 110)",

		brandYellowForText: "#ffdd00",
	},
};
