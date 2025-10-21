/* * */

import { Container } from '@/components/layout/Container';
import { StopDetailArrivals } from '@/components/stops/detail/StopDetailArrivals';
import { StopDetailHeader } from '@/components/stops/detail/StopDetailHeader';

/* * */

export function StopDetail() {
	return (
		<Container>
			<StopDetailHeader />
			<StopDetailArrivals />
			{/* <StopDetailLineGoTrough /> */}
		</Container>
	);
}
