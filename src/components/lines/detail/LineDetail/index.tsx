/* * */

import { Container } from '@/components/layout/Container';
// import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailSelectOperationalDate } from '@/components/lines/detail/LineDetailSelectOperationalDate';
import { LineDetailSelectPattern } from '@/components/lines/detail/LineDetailSelectPattern';
// import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';

/* * */

export function LineDetail() {
	return (
		<Container>
			<LineDetailHeader />
			<LineDetailSelectOperationalDate />
			<LineDetailSelectPattern />
			{/* <LineDetailAlerts /> */}
			{/* <LineDetailPath /> */}
		</Container>
	);
}
