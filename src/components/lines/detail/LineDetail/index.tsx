/* * */

import { Container } from '@/components/layout/Container';
import { LineDetailAlerts } from '@/components/lines/detail/LineDetailAlerts';
import { LineDetailHeader } from '@/components/lines/detail/LineDetailHeader';
import { LineDetailMap } from '@/components/lines/detail/LineDetailMap';
import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';
import { LineDetailSelectOperationalDate } from '@/components/lines/detail/LineDetailSelectOperationalDate';
import { LineDetailSelectPattern } from '@/components/lines/detail/LineDetailSelectPattern';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export function LineDetail() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();




	 //



	 
	const accessibilityContext = useAccessibilityContext();

	//
	// B. Render components

	if (lineDetailContext.flags.loading) {
		return (
			<Container safeTop>
				<ActivityIndicator size="large" />
			</Container>
		);
	}

	return (
		<SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<Container>
					{!accessibilityContext.flags.screen_reader && <LineDetailMap />}
					<LineDetailHeader />
					<LineDetailSelectOperationalDate />
					<LineDetailSelectPattern />
					<LineDetailAlerts />
					<LineDetailPath />
				</Container>
			</View>
		</SafeAreaView>

	);

	//
}
