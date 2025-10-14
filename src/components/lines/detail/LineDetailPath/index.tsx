/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
// import { LineDetailPathList } from '@/components/lines/detail/LineDetailPathList';
import { LineDetailPathMap } from '@/components/lines/detail/LineDetailPathMap';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function LineDetailPath() {
	//

	//
	// A. Setup variables

	const t = useTranslation('translation', { keyPrefix: 'lines.LineDetailPath' }).t;

	const lineDetailContext = useLineDetailContext();

	//
	// B. Render components

	if (!lineDetailContext.data.selected_pattern_id) {
		return (
			<View>
				<NoDataLabel text={t('no_data')} />
			</View>
		);
	}

	return (
		<View>
			<LineDetailPathMap />
			{/* <LineDetailPathList /> */}
		</View>

	);

	//
}
