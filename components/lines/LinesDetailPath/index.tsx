/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { LinesDetailPathList } from '@/components/lines/LinesDetailPathList';
import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { View } from 'react-native';

/* * */

export function LinesDetailPath() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('lines.LinesDetailPath');

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDateContext();

	//
	// B. Render components

	if (!linesDetailContext.data.active_pattern || !operationalDayContext.data.selected_date?.js_date) {
		return (
			<Surface>
				<NoDataLabel text="Sem dados" />
			</Surface>
		);
	}

	return (
		<View>
			<LinesDetailPathMap />
			<LinesDetailPathList />
		</View>

	);

	//
}
