/* * */

import { HomeScreenCustomizeButton } from '@/components/home/HomeScreenCustomizeButton';
import { View } from 'react-native';

/* * */

export function HomeScreenListFooter() {
	return (
		<View style={{ marginBottom: 150, marginTop: 50 }}>
			<HomeScreenCustomizeButton />
		</View>
	);
}
