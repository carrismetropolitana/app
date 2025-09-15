/* * */

import { Container } from '@/components/layout/Container';
import { LargeButton } from '@/components/layout/LargeButton';
import { WidgetConfigHeader } from '@/components/widgets/common/WidgetConfigHeader';
import { WidgetConfigSelectLine } from '@/components/widgets/common/WidgetConfigSelectLine';
import { WidgetConfigSelectPattern } from '@/components/widgets/common/WidgetConfigSelectPattern';
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

	const widgetLineConfigContext = useWidgetLineConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetLineConfig' });

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
				videoUrl="https://carrismetropolitana.pt/app-view/widgets/videos/lines"
			/>

			<WidgetConfigSelectLine
				onSelectLineId={widgetLineConfigContext.actions.selectLineId}
				selectedLine={widgetLineConfigContext.data.selected_line}
			/>

			<WidgetConfigSelectPattern
				availablePatterns={widgetLineConfigContext.data.available_patterns}
				onTogglePatternId={widgetLineConfigContext.actions.selectPatternId}
				selectedPatternIds={widgetLineConfigContext.data.selected_pattern_id ? [widgetLineConfigContext.data.selected_pattern_id] : []}
			/>

			<View style={useStyles().buttonContainer}>
				<LargeButton
					disabled={!widgetLineConfigContext.flags.can_save}
					label="Save"
					onPress={widgetLineConfigContext.actions.saveWidget}
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
						onPress={widgetLineConfigContext.actions.deleteWidget}
						type="danger"
					/>
				)}
			</View>

		</Container>
	);

	//
}
