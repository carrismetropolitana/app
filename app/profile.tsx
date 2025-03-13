import FullWidthList from '@/components/cmui/FullWidthList';
import ProfileScreen from '@/components/screens/ProfileScreen';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
	return <ProfileScreen />;
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#fff',
		flex: 1,
		fontFamily: 'Inter',
		justifyContent: 'center',
	},
	text: {
		color: 'rgba(150, 150, 160, 1)',
		fontSize: 20,
		fontWeight: 900,
		textTransform: 'uppercase',
	},
});
