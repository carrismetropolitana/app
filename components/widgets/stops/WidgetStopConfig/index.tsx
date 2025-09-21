/* * */

import { Container } from '@/components/layout/Container';
import { LargeButton } from '@/components/layout/LargeButton';
import { WidgetConfigHeader } from '@/components/widgets/common/WidgetConfigHeader';
import { WidgetConfigSelectPattern } from '@/components/widgets/common/WidgetConfigSelectPattern';
import { WidgetConfigSelectStop } from '@/components/widgets/common/WidgetConfigSelectStop';
import { useWidgetStopConfigContext } from '@/contexts/WidgetStopConfig.context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { WidgetConfigLabelInput } from '../../common/WidgetConfigLabelInput';
import { useStyles } from './styles';

/* * */

interface WidgetStopConfigProps {
	widgetId?: string
}

/* * */

export function WidgetStopConfig({ widgetId }: WidgetStopConfigProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const widgetStopConfigContext = useWidgetStopConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetStopConfig' });

	//
	// B. Handle Actions

	const handleSave = () => {
		widgetStopConfigContext.actions.saveWidget();
		router.back();
	};

	const handleDelete = () => {
		widgetStopConfigContext.actions.deleteWidget();
		router.back();
	};

	//
	// C. Render Components

	return (
		<Container>

			<WidgetConfigHeader
				description={t('description')}
				title={t('title')}
				videoUrl="https://carrismetropolitana.pt/app-view/widgets/videos/stops"
			/>

			{/* * */}

			<WidgetConfigSelectStop
				description={t('step_1.description')}
				onSelectStopId={widgetStopConfigContext.actions.selectStopId}
				selectedStop={widgetStopConfigContext.data.selected_stop}
				title={t('step_1.title')}
			/>

			{/* * */}

			<WidgetConfigSelectPattern
				availablePatterns={widgetStopConfigContext.data.available_patterns}
				description={t('step_2.description')}
				onTogglePatternId={widgetStopConfigContext.actions.togglePatternId}
				onToggleSelectAll={widgetStopConfigContext.actions.toggleSelectAll}
				selectedPatternIds={widgetStopConfigContext.data.selected_pattern_ids}
				title={t('step_2.title')}
			/>

			{/* * */}

			<WidgetConfigLabelInput
				description={t('step_3.description')}
				onChange={widgetStopConfigContext.actions.selectLabel}
				title={t('step_3.title')}
				value={widgetStopConfigContext.data.selected_label}
			/>

			{/* * */}

			<View style={styles.buttonContainer}>
				<LargeButton
					disabled={!widgetStopConfigContext.flags.can_save}
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
