import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rneui/themed';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
	const themeContext = useThemeContext();

	const styles = StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			justifyContent: 'center',
			padding: 20,
		},
		link: {
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
			marginTop: 15,
			paddingVertical: 15,
		},
	});

	return (
		<>
			<Stack.Screen options={{ headerShown: false, title: 'Oops!' }} />
			<View style={styles.container}>
				<Text>This screen doesn't exist.</Text>
				<Link href="/home" style={styles.link}>
					<Text>Go to home screen!</Text>
				</Link>
			</View>
		</>
	);
}
