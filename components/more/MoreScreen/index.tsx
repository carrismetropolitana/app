/* * */

import { MoreNews } from '@/components/more/MoreNews';
import { MoreSectionAlerts } from '@/components/more/MoreSectionAlerts';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

export function MoreScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<MoreNews />
				<MoreSectionAlerts />
			</ScrollView>
		</SafeAreaView>
	);
}
