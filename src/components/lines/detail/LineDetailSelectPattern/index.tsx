/* * */

import { LineDetailSelectPatternModal } from '@/components/lines/detail/LineDetailSelectPatternModal';
import { LineBadge } from '@/components/lines/LineBadge';
import { ListSection } from '@/components/list/ListSection';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useSystemVariables } from '@/theme/global';
import { type Line } from '@carrismetropolitana/api-types/network';
import { IconArrowLoopRight, IconArrowsRightLeft } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function LineDetailSelectPattern() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const lineDetailContext = useLineDetailContext();

	const [modalVisible, setModalVisible] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.LineDetailSelectPattern' });

	//
	// B. Handle actions

	const handleSelectPattern = (patternId: string) => {
		lineDetailContext.actions.selectPattern(patternId);
		setModalVisible(false);
	};

	//
	// C. Render components

	return (
		<>

			{!lineDetailContext.data.selected_pattern_id && (
				<ListSection
					description="description"
					title="title"
					items={[{
						icon: <IconArrowLoopRight color="#FF6900" />,
						key: 'select-line',
						label: t('label'),
						onPress: () => setModalVisible(true),
					}]}
				/>
			)}

			{lineDetailContext.data.selected_pattern_id && (
				<ListSection
					description="description"
					title="title"
					items={[{
						icon: <LineBadge lineId={lineDetailContext.data.selected_pattern_id} withAlertIcon />,
						key: 'selected-line',
						label: 'selectedLine.long_name',
						onPress: () => setModalVisible(true),
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
						size: 'sm',
					}]}
				/>
			)}

			<LineDetailSelectPatternModal
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSelectPattern={handleSelectPattern}
			/>

		</>
	);

	//
}
