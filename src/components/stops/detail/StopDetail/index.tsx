/* * */

import { Container } from '@/components/layout/Container';
import { StopDetailHeader } from '@/components/stops/detail/StopDetailHeader';

/* * */

export function StopDetail() {
	return (
		<Container>
			<StopDetailHeader />
			{/* <View style={{ marginTop: 16 }}>
				<StopDetailNextArrivals title="Próximas Passagens" />
			</View>
			<StopDetailLineGoTrough /> */}
		</Container>
	);
}
