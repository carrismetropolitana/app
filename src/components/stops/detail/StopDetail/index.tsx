/* * */

import { Container } from '@/components/layout/Container';
import { StopDetailArrivals } from '@/components/stops/detail/StopDetailArrivals';
import { StopDetailHeader } from '@/components/stops/detail/StopDetailHeader';
import { StopDetailLines } from '@/components/stops/detail/StopDetailLines';

/* * */

export function StopDetail() {
	return (
		<Container>
			<StopDetailHeader />
			<StopDetailArrivals />
			<StopDetailLines />
		</Container>
	);
}
