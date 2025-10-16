/* * */

import { Container } from '@/components/layout/Container';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailMap } from '@/components/lines/detail/LineDetailMap';
import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';
import { LineDetailSelectOperationalDate } from '@/components/lines/detail/LineDetailSelectOperationalDate';
import { LineDetailSelectPattern } from '@/components/lines/detail/LineDetailSelectPattern';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { ActivityIndicator } from 'react-native';
// import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';

/* * */

export function LineDetail() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();

	//
	// B. Render components

	if (lineDetailContext.flags.loading) {
		return (
			<Container safeTop>
				<ActivityIndicator size="large" />
			</Container>
		);
	}

	return (
		<Container>
			<LineDetailHeader />
			<LineDetailSelectOperationalDate />
			<LineDetailSelectPattern />
			{/* <LineDetailAlerts /> */}
			<LineDetailMap />
			<LineDetailPath />
		</Container>
	);

	//
}
