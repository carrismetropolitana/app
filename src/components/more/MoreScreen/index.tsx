/* * */

import { Container } from '@/components/layout/Container';
import { MoreAppVersion } from '@/components/more/MoreAppVersion';
import { MoreDebugToggle } from '@/components/more/MoreDebugToggle';
import { MoreNews } from '@/components/more/MoreNews';
import { MoreSectionAbout } from '@/components/more/MoreSectionAbout';
import { MoreSectionAlerts } from '@/components/more/MoreSectionAlerts';
import { MoreSectionFares } from '@/components/more/MoreSectionFares';
import { MoreSectionSettings } from '@/components/more/MoreSectionSettings';
import { MoreSectionSupport } from '@/components/more/MoreSectionSupport';
import { Platform } from 'react-native';

/* * */

export function MoreScreen() {
	return (
		<Container safeTop={Platform.OS === 'android'}>
			<MoreNews />
			<MoreSectionAlerts />
			<MoreSectionSupport />
			<MoreSectionFares />
			<MoreSectionAbout />
			<MoreSectionSettings />
			<MoreAppVersion />
			<MoreDebugToggle />
		</Container>
	);
}
