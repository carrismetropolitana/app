/* * */

import { Container } from '@/components/layout/Container';
// import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailToolbar } from '@/components/lines/detail/LineDetailToolbar';
// import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';

/* * */

export function LineDetail() {
	return (
		<Container>
			<LineDetailHeader />
			<LineDetailToolbar />
			{/* <LineDetailAlerts /> */}
			{/* <LineDetailPath /> */}
		</Container>
	);
}
