/* * */

import { Container } from '@/components/layout/Container';
import { LargeButton } from '@/components/layout/LargeButton';
import { LineSelectionTrigger } from '@/components/selection/line/LineSelectionTrigger';
import { WidgetConfigHeader } from '@/components/widgets/config/WidgetConfigHeader';
import { WidgetConfigSelectPattern } from '@/components/widgets/config/WidgetConfigSelectPattern';
import { useWidgetLineConfigContext } from '@/contexts/WidgetLineConfig.context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetLineConfigProps {
	widgetId?: string
}

/* * */

export function WidgetLineConfig({ widgetId }: WidgetLineConfigProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const widgetLineConfigContext = useWidgetLineConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetLineConfig' });

	//
	// B. Handle actions

	const handleSave = () => {
		widgetLineConfigContext.actions.saveWidget();
		router.back();
	};

	const handleDelete = () => {
		widgetLineConfigContext.actions.deleteWidget();
		router.back();
	};

	//
	// C. Render components

	return (
		<Container>

			<WidgetConfigHeader
				description={t('description')}
				title={t('title')}
				videoUrl="/account/widgets/line/video"
			/>

			{/* * */}

			<LineSelectionTrigger
				description={t('step_1.description')}
				onSelect={widgetLineConfigContext.actions.selectLineId}
				selectedLineId={widgetLineConfigContext.data.selected_line?.id}
				title={t('step_1.title')}
			/>

			{/* * */}

			<WidgetConfigSelectPattern
				availablePatterns={widgetLineConfigContext.data.available_patterns}
				description={t('step_2.description')}
				onTogglePatternId={widgetLineConfigContext.actions.selectPatternId}
				selectedPatternIds={widgetLineConfigContext.data.selected_pattern_id ? [widgetLineConfigContext.data.selected_pattern_id] : []}
				title={t('step_2.title')}
			/>

			{/* * */}

			<View style={styles.buttonContainer}>
				<LargeButton
					disabled={!widgetLineConfigContext.flags.can_save}
					label={t('actions.save')}
					onPress={handleSave}
					type="primary"
				/>
				{!widgetId && (
					<LargeButton
						label={t('actions.cancel')}
						onPress={router.back}
						type="secondary"
					/>
				)}
				{widgetId && (
					<LargeButton
						label={t('actions.delete')}
						onPress={handleDelete}
						type="danger"
					/>
				)}
			</View>

		</Container>
	);

	//
}
