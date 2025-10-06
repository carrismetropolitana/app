/* * */

import { Container } from '@/components/layout/Container';
// import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailOperationalDate } from '@/components/lines/detail/LineDetailOperationalDate';
import { LineDetailSelectPattern } from '@/components/lines/detail/LineDetailSelectPattern';
// import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';

/* * */

export function LineDetail() {
	return (
		<Container>
			<LineDetailHeader />
			<LineDetailOperationalDate />
			<LineDetailSelectPattern title="Selecione um destino" />
			{/* <LineDetailAlerts /> */}
			{/* <LineDetailPath /> */}
		</Container>
	);
}
