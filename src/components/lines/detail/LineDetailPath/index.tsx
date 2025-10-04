/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { LineDetailPathList } from '@/components/lines/detail/LineDetailPathList';
import { LineDetailPathMap } from '@/components/lines/detail/LineDetailPathMap';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { View } from 'react-native';

/* * */

export function LineDetailPath() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('lines.LineDetailPath');

	const lineDetailContext = useLineDetailContext();
	const operationalDayContext = useOperationalDateContext();

	//
	// B. Render components

	if (!lineDetailContext.data.active_pattern || !operationalDayContext.data.selected_date?.js_date) {
		return (
			<Surface>
				<NoDataLabel text="Sem dados" />
			</Surface>
		);
	}

	return (
		<View>
			<LineDetailPathMap />
			<LineDetailPathList />
		</View>

	);

	//
}
