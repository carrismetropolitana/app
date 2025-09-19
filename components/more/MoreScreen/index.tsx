/* * */

import { MoreAppVersion } from '@/components/more/MoreAppVersion';
import { MoreDebugToggle } from '@/components/more/MoreDebugToggle';
import { MoreLocaleSwitch } from '@/components/more/MoreLocaleSwitch';
import { MoreNews } from '@/components/more/MoreNews';
import { MoreSectionAbout } from '@/components/more/MoreSectionAbout';
import { MoreSectionAlerts } from '@/components/more/MoreSectionAlerts';
import { MoreSectionSupport } from '@/components/more/MoreSectionSupport';
import { MoreSectionTariffs } from '@/components/more/MoreSectionTariffs';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from './styles';

/* * */

export function MoreScreen() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<MoreNews />
				<MoreSectionAlerts />
				<MoreSectionSupport />
				<MoreSectionTariffs />
				<MoreSectionAbout />
				<MoreAppVersion />
				<MoreLocaleSwitch />
				<MoreDebugToggle />
			</ScrollView>
		</SafeAreaView>
	);

	//
}
