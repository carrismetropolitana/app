/* * */

import StopDetailCharacterization from '@/components/stops/StopDetailCharacterization';
import StopDetailLineGoTrough from '@/components/stops/StopDetailLineGoTrough';
import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { StopDetailHeader } from '@/components/stops/StopDetailsHeader';
import { ScrollView } from 'react-native';

import { styles } from './styles';

/* * */

export function StopDetail() {
	//

	//
	// A. Setup variables

	const stopDetailStyles = styles();

	//
	// B. Render components

	return (
		<ScrollView style={stopDetailStyles.wrapper}>
			<StopDetailHeader />
			<StopDetailNextArrivals description title />
			<StopDetailLineGoTrough />
			<StopDetailCharacterization />
		</ScrollView>
	);

	//
}
