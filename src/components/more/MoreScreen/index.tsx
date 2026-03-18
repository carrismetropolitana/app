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

/* * */

export function MoreScreen() {
	return (
		<Container>
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
