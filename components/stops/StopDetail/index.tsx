/* * */

import TabBarOnly from '@/components/common/layout/TabOnly';
import StopDetailLineGoTrough from '@/components/stops/StopDetailLineGoTrough';
import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { StopDetailHeader } from '@/components/stops/StopDetailsHeader';
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { styles } from './styles';

/* * */

export function StopDetail() {
	//

	//
	// A. Setup variables

	const stopDetailStyles = styles();
	const screenHeight = Dimensions.get('screen').height;

	//
	// B. Render components

	return (
		<View style={{ height: screenHeight - 100 }}>
			<ScrollView showsVerticalScrollIndicator={false} style={stopDetailStyles.wrapper}>
				<StopDetailHeader />
				<View style={{ marginTop: 16 }}>
					<StopDetailNextArrivals title="Próximas Passagens" />
				</View>
				<StopDetailLineGoTrough />
				{/* <StopDetailCharacterization /> */}
			</ScrollView>
		</View>
	);

	//
}
