/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Container } from '@/components/layout/Container';
import { LargeButton } from '@/components/layout/LargeButton';
import { WidgetConfigHeader } from '@/components/widgets/common/WidgetConfigHeader';
import { WidgetConfigSelectLine } from '@/components/widgets/common/WidgetConfigSelectLine';
import { WidgetConfigSelectPattern } from '@/components/widgets/common/WidgetConfigSelectPattern';
import { WidgetSmartNotificationConfigDistanceInput } from '@/components/widgets/smart-notifications/WidgetSmartNotificationConfigDistanceInput';
import { WidgetSmartNotificationConfigSeparator } from '@/components/widgets/smart-notifications/WidgetSmartNotificationConfigSeparator';
import { useWidgetSmartNotificationConfigContext } from '@/contexts/WidgetSmartNotificationConfig.context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { WidgetConfigSelectWaypoint } from '../../common/WidgetConfigSelectWaypoint';
import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigProps {
	widgetId?: string
}

/* * */

export function WidgetSmartNotificationConfig({ widgetId }: WidgetSmartNotificationConfigProps) {
	//

	//
	// A. Setup variables

	const widgetSmartNotificationConfigContext = useWidgetSmartNotificationConfigContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetSmartNotificationConfig' });

	//
	// B. Handle Actions

	const handleSave = () => {
		widgetSmartNotificationConfigContext.actions.saveWidget();
		router.back();
	};

	//
	// C. Render Components

	return (
		<Container>

			<WidgetConfigHeader
				description={t('description')}
				title={t('title')}
				videoUrl="https://carrismetropolitana.pt/app-view/widgets/videos/smart-notifications"
			/>

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="start" />

			<Text style={useStyles().text}>{t('step_1.title')}</Text>

			<WidgetConfigSelectLine
				onSelectLineId={widgetSmartNotificationConfigContext.actions.selectLineId}
				selectedLine={widgetSmartNotificationConfigContext.data.selected_line}
			/>

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="middle" />

			<Text style={useStyles().text}>{t('step_2.title')}</Text>

			{!widgetSmartNotificationConfigContext.data.selected_line && (
				<NoDataLabel text={t('step_2.no_data')} />
			)}

			{widgetSmartNotificationConfigContext.data.selected_line && (
				<WidgetConfigSelectPattern
					availablePatterns={widgetSmartNotificationConfigContext.data.available_patterns}
					onTogglePatternId={widgetSmartNotificationConfigContext.actions.selectPatternId}
					selectedPatternIds={widgetSmartNotificationConfigContext.data.selected_pattern_id ? [widgetSmartNotificationConfigContext.data.selected_pattern_id] : []}
				/>
			)}

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="middle" />

			<Text style={useStyles().text}>{t('step_3.title')}</Text>

			<WidgetSmartNotificationConfigDistanceInput
				onChange={widgetSmartNotificationConfigContext.actions.selectDistance}
				value={widgetSmartNotificationConfigContext.data.selected_distance}
			/>

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="middle" />

			<Text style={useStyles().text}>{t('step_4.title')}</Text>

			{!widgetSmartNotificationConfigContext.data.selected_pattern_id && (
				<NoDataLabel text={t('step_4.no_data')} />
			)}

			{widgetSmartNotificationConfigContext.data.selected_pattern_id && (
				<WidgetConfigSelectWaypoint
					availableWaypoints={widgetSmartNotificationConfigContext.data.available_waypoints}
					onToggleWaypoint={widgetSmartNotificationConfigContext.actions.selectWaypoint}
					selectedWaypoint={widgetSmartNotificationConfigContext.data.selected_waypoint}
				/>
			)}

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="middle" />

			<Text style={useStyles().text}>{t('step_5.title')}</Text>

			{/* * */}

			<WidgetSmartNotificationConfigSeparator style="end" />

			{/* * */}

			<View style={useStyles().buttonContainer}>
				<LargeButton
					disabled={!widgetSmartNotificationConfigContext.flags.can_save}
					label="Save"
					onPress={handleSave}
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
						onPress={widgetSmartNotificationConfigContext.actions.deleteWidget}
						type="danger"
					/>
				)}
			</View>

		</Container>
	);

	//
}
