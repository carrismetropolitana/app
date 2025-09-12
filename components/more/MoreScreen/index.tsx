/* * */

import { MoreNews } from '@/components/more/MoreNews';
import { MoreScreenAppVersion } from '@/components/more/MoreScreenAppVersion';
import { MoreScreenDebugToggle } from '@/components/more/MoreScreenDebugToggle';
import { MoreScreenLocaleSwitch } from '@/components/more/MoreScreenLocaleSwitch';
import { MoreSectionAbout } from '@/components/more/MoreSectionAbout';
import { MoreSectionAlerts } from '@/components/more/MoreSectionAlerts';
import { MoreSectionSupport } from '@/components/more/MoreSectionSupport';
import { MoreSectionTariffs } from '@/components/more/MoreSectionTariffs';
import { SafeAreaView, ScrollView } from 'react-native';

import { useStyles } from './styles';

/* * */

export function MoreScreen() {
	return (
		<SafeAreaView style={useStyles().container}>
			<ScrollView>
				<MoreNews />
				<MoreSectionAlerts />
				<MoreSectionSupport />
				<MoreSectionTariffs />
				<MoreSectionAbout />
				<MoreScreenAppVersion />
				<MoreScreenLocaleSwitch />
				<MoreScreenDebugToggle />
			</ScrollView>
		</SafeAreaView>
	);
}
