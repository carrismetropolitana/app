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

	const widgetStopConfigContext = useWidgetStopConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetStopConfig' });

	//
	// B. Handle Actions

	//
	// C. Fetch Data

	//
	// D. Render Components

	return (
		<Container>

			<WidgetConfigHeader
				description={t('description')}
				title={t('title')}
				videoUrl="https://carrismetropolitana.pt/app-view/widgets/videos/stops"
			/>

			<WidgetConfigSelectStop
				onSelectStopId={widgetStopConfigContext.actions.selectStopId}
				selectedStop={widgetStopConfigContext.data.selected_stop}
			/>

			<WidgetConfigSelectPattern
				availablePatterns={widgetStopConfigContext.data.available_patterns}
				onTogglePatternId={widgetStopConfigContext.actions.togglePatternId}
				onToggleSelectAll={widgetStopConfigContext.actions.toggleSelectAll}
				selectedPatternIds={widgetStopConfigContext.data.selected_pattern_ids}
			/>

			<View style={useStyles().buttonContainer}>
				<LargeButton
					disabled={!widgetStopConfigContext.flags.can_save}
					label="Save"
					onPress={widgetStopConfigContext.actions.confirmWidget}
					type="primary"
				/>
				{!widgetId && (
					<LargeButton
						label="Cancelar"
						onPress={router.back}
						type="secondary"
					/>
				)}
				{widgetId && (
					<LargeButton
						label="Eliminar"
						onPress={widgetStopConfigContext.actions.deleteWidget}
						type="danger"
					/>
				)}
			</View>

		</Container>
	);

	//
}
