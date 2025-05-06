/* * */

import StopDetailCharacterization from '@/components/stops/StopDetailCharacterization';
import StopDetailLineGoTrough from '@/components/stops/StopDetailLineGoTrough';
import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { StopDetailHeader } from '@/components/stops/StopDetailsHeader';
import { ScrollView } from 'react-native';

/* * */

export function StopDetail() {
	return (
		<ScrollView>
			<StopDetailHeader />
			<StopDetailNextArrivals />
			<StopDetailLineGoTrough />
			<StopDetailCharacterization />
		</ScrollView>
	);
}
