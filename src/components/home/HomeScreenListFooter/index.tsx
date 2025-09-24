/* * */

import { HomeScreenCustomizeButton } from '@/components/home/HomeScreenCustomizeButton';
import { View } from 'react-native';

/* * */

export function HomeScreenListFooter() {
	return (
		<View style={{ marginVertical: 50 }}>
			<HomeScreenCustomizeButton />
		</View>
	);
}
