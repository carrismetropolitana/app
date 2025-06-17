/* * */

import { AlertsCarousel } from '@/components/common/AlertsCarousel';
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useTranslation } from 'react-i18next';

/* * */

export function LinesDetailAlerts() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('lines.LinesDetailAlerts');
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Render components

	if (!linesDetailContext.data.line || !linesDetailContext.data.active_alerts || linesDetailContext.data.active_alerts?.length === 0) {
		return null;
	}

	return (
		<Surface variant="alerts">
			<Section heading={t('heading')} withGap>
				<AlertsCarousel alerts={linesDetailContext.data.active_alerts} />
			</Section>
		</Surface>
	);

	//
}
