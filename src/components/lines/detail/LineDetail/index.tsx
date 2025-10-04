/* * */

import { Container } from '@/components/layout/Container';
import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';

/* * */

export function LineDetail() {
	return (
		<Container>
			<LineDetailHeader />
			<LineDetailAlerts />
			<LineDetailPath />
		</Container>
	);
}
