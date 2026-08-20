/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { Container } from '@/components/layout/Container';
import { LargeButton } from '@/components/layout/LargeButton';
import { LineSelectionTrigger } from '@/components/selection/line/LineSelectionTrigger';
import { WidgetConfigHeader } from '@/components/widgets/config/WidgetConfigHeader';
import { WidgetConfigLabelInput } from '@/components/widgets/config/WidgetConfigLabelInput';
import { WidgetConfigSelectPattern } from '@/components/widgets/config/WidgetConfigSelectPattern';
import { WidgetConfigSelectWaypoint } from '@/components/widgets/config/WidgetConfigSelectWaypoint';
import { WidgetSmartNotificationConfigDistanceInput } from '@/components/widgets/config/WidgetSmartNotificationConfigDistanceInput';
import { WidgetSmartNotificationConfigSchedule } from '@/components/widgets/config/WidgetSmartNotificationConfigSchedule';
import { WidgetSmartNotificationConfigSeparator } from '@/components/widgets/config/WidgetSmartNotificationConfigSeparator';
import { WidgetSmartNotificationConfigWarning } from '@/components/widgets/config/WidgetSmartNotificationConfigWarning';
import { useWidgetSmartNotificationConfigContext } from '@/contexts/WidgetSmartNotificationConfig.context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

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

	const styles = useStyles();

	const widgetSmartNotificationConfigContext = useWidgetSmartNotificationConfigContext();

	const { t } = useTranslation();

	//
	// B. Handle actions

	const handleSave = () => {
		widgetSmartNotificationConfigContext.actions.saveWidget();
		router.back();
	};

	const handleDelete = () => {
		widgetSmartNotificationConfigContext.actions.deleteWidget();
		router.back();
	};

	//
	// C. Render components

	return (
		<Container>
			<WidgetConfigHeader
				description={t($ => $.widgets.WidgetSmartNotificationConfig.description)}
				title={t($ => $.widgets.WidgetSmartNotificationConfig.title)}
				videoUrl="/account/widgets/smart_notification/video"
			/>
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="start" />
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfig.step_1.title)}</Text>
			<LineSelectionTrigger
				onSelect={widgetSmartNotificationConfigContext.actions.selectLineId}
				selectedLineId={widgetSmartNotificationConfigContext.data.selected_line?._id}
			/>
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="middle" />
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfig.step_2.title)}</Text>
			{!widgetSmartNotificationConfigContext.data.selected_line && (
				<NoDataLabel
					accessibilityHint={t($ => $.widgets.WidgetSmartNotificationConfig.step_2.no_data.accessibility_hint)}
					text={t($ => $.widgets.WidgetSmartNotificationConfig.step_2.no_data.label)}
				/>
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
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfig.step_3.title)}</Text>
			<WidgetSmartNotificationConfigDistanceInput
				onChange={widgetSmartNotificationConfigContext.actions.selectDistance}
				value={widgetSmartNotificationConfigContext.data.selected_distance}
			/>
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="middle" />
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfig.step_4.title)}</Text>
			{!widgetSmartNotificationConfigContext.data.selected_pattern_id && (
				<NoDataLabel
					accessibilityHint={t($ => $.widgets.WidgetSmartNotificationConfig.step_4.no_data.accessibility_hint)}
					text={t($ => $.widgets.WidgetSmartNotificationConfig.step_4.no_data.label)}
				/>
			)}
			{widgetSmartNotificationConfigContext.data.selected_pattern_id && (
				<WidgetConfigSelectWaypoint
					availableWaypoints={widgetSmartNotificationConfigContext.data.available_waypoints}
					onSelectWaypoint={widgetSmartNotificationConfigContext.actions.selectWaypoint}
					selectedWaypoint={widgetSmartNotificationConfigContext.data.selected_waypoint}
				/>
			)}
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="middle" />
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfig.step_5.title)}</Text>
			<WidgetSmartNotificationConfigSchedule
				endTime={widgetSmartNotificationConfigContext.data.selected_end_time}
				onEndTimeChange={widgetSmartNotificationConfigContext.actions.selectEndTime}
				onStartTimeChange={widgetSmartNotificationConfigContext.actions.selectStartTime}
				onToggleWeekday={widgetSmartNotificationConfigContext.actions.selectWeekday}
				selectedWeekdays={widgetSmartNotificationConfigContext.data.selected_weekdays}
				startTime={widgetSmartNotificationConfigContext.data.selected_start_time}
			/>
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="middle" />
			{/* * */}
			<WidgetConfigLabelInput
				onChange={widgetSmartNotificationConfigContext.actions.selectLabel}
				value={widgetSmartNotificationConfigContext.data.selected_label}
			/>
			{/* * */}
			<WidgetSmartNotificationConfigSeparator style="end" />
			{/* * */}
			<WidgetSmartNotificationConfigWarning
				selectedDistance={widgetSmartNotificationConfigContext.data.selected_distance}
				selectedEndTime={widgetSmartNotificationConfigContext.data.selected_end_time}
				selectedLine={widgetSmartNotificationConfigContext.data.selected_line}
				selectedStartTime={widgetSmartNotificationConfigContext.data.selected_start_time}
				selectedWaypoint={widgetSmartNotificationConfigContext.data.selected_waypoint}
				selectedWeekdays={widgetSmartNotificationConfigContext.data.selected_weekdays}
			/>
			{/* * */}
			<View style={styles.buttonContainer}>
				<LargeButton
					disabled={!widgetSmartNotificationConfigContext.flags.can_save}
					label={t($ => $.widgets.WidgetSmartNotificationConfig.actions.save)}
					onPress={handleSave}
					type="primary"
				/>
				{!widgetId && (
					<LargeButton
						label={t($ => $.widgets.WidgetSmartNotificationConfig.actions.cancel)}
						onPress={router.back}
						type="secondary"
					/>
				)}
				{widgetId && (
					<LargeButton
						label={t($ => $.widgets.WidgetSmartNotificationConfig.actions.delete)}
						onPress={handleDelete}
						type="danger"
					/>
				)}
			</View>
		</Container>
	);

	//
}
