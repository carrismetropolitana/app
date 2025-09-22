/* * */

import { Container } from '@/components/layout/Container';
import { MoreAppVersion } from '@/components/more/MoreAppVersion';
import { MoreDebugToggle } from '@/components/more/MoreDebugToggle';
import { MoreLocaleSwitch } from '@/components/more/MoreLocaleSwitch';
import { MoreNews } from '@/components/more/MoreNews';
import { MoreSectionAbout } from '@/components/more/MoreSectionAbout';
import { MoreSectionAlerts } from '@/components/more/MoreSectionAlerts';
import { MoreSectionSupport } from '@/components/more/MoreSectionSupport';
import { MoreSectionTariffs } from '@/components/more/MoreSectionTariffs';

/* * */

export function MoreScreen() {
	return (
		<Container safeTop>
			<MoreNews />
			<MoreSectionAlerts />
			<MoreSectionSupport />
			<MoreSectionTariffs />
			<MoreSectionAbout />
			<MoreAppVersion />
			<MoreLocaleSwitch />
			<MoreDebugToggle />
		</Container>
	);
}
