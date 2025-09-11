/* * */

import StopDetailNextArrivalsByPatternID from '@/components/stops/StopDetailNextArrivalsByPatternID';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

/* * */

interface Props {
	patternIds?: string[]
	stopId: string
}

/* * */

export function StopWidgetCardBody({ patternIds, stopId }: Props) {
	//

	//
	// A. Setup variables

	const stopDetailContext = useStopsDetailContext();
	const localeContext = useLocaleContext();

	const { t } = useTranslation('translation', { keyPrefix: 'stopWidgetCard.stopWidgetCardBody' });

	//
	// B. Fetch Data
	useEffect(() => {
		if (!stopId) return;
		stopDetailContext.actions.setActiveStopId(stopId);
	}, [stopId]);
	//
	// B. Render Components

	if (!stopId) {
		return (
			<View>
				<Text>There has been an error. Try again later.</Text>
			</View>
		);
	}

	return (
		<View accessibilityHint={t('accessibilityHint')} accessibilityLabel={t('accessibilityLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="list">
			{ stopId && (
				<StopDetailNextArrivalsByPatternID key={stopId} descriptionEnabled={false} href={`/stop/${stopId}`} patternIds={patternIds} />
			)}
		</View>
	);

	//
}
