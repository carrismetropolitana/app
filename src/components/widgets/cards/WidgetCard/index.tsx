/* * */

import { WidgetCardLineBody } from '@/components/widgets/cards/WidgetCardLineBody';
import { WidgetCardLineHeader } from '@/components/widgets/cards/WidgetCardLineHeader';
import { WidgetCardOpenToggle } from '@/components/widgets/cards/WidgetCardOpenToggle';
import { WidgetCardSmartNotificationBody } from '@/components/widgets/cards/WidgetCardSmartNotificationBody';
import { WidgetCardSmartNotificationHeader } from '@/components/widgets/cards/WidgetCardSmartNotificationHeader';
import { WidgetCardStopBody } from '@/components/widgets/cards/WidgetCardStopBody';
import { WidgetCardStopHeader } from '@/components/widgets/cards/WidgetCardStopHeader';
import { useAccountContext } from '@/contexts/Account.context';
import { type Widget } from '@/schemas/widgets';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardProps {
	data: Widget
	isDragging?: boolean
	onDragStart: () => void
}

/* * */

export function WidgetCard({ data, isDragging, onDragStart }: WidgetCardProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	//
	// B. Handle actions

	const handleToggleOpen = async () => {
		await Haptics.selectionAsync();
		const thisWidget = { ...data, settings: { ...data.settings, is_open: data.settings.is_open ? false : true } };
		const allWidgets = accountContext.data.account?.widgets.map(w => w._id === thisWidget._id ? thisWidget : w) || [];
		await accountContext.actions.update('widgets', allWidgets);
	};

	const handleDragStart = async () => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onDragStart();
	};

	//
	// C. Render components

	return (
		<View style={[styles.container, isDragging && styles.containerIsDragging]}>
			<TouchableOpacity
				accessibilityHint={data.settings.is_open ? t($ => $.widgets.WidgetCard.accessibility_hint.expanded) : t($ => $.widgets.WidgetCard.accessibility_hint.collapsed)}
				accessibilityState={{ expanded: data.settings.is_open }}
				onLongPress={handleDragStart}
				onPress={handleToggleOpen}
				style={[styles.headerWrapper, data.settings.is_open && styles.headerWrapperIsOpen]}
			>
				{data.type === 'stop' && <WidgetCardStopHeader label={data.settings.label} stopId={data.properties.stop_id} /> }
				{data.type === 'line' && <WidgetCardLineHeader patternId={data.properties.pattern_id} /> }
				{data.type === 'smart_notification' && <WidgetCardSmartNotificationHeader label={data.settings.label} patternId={data.properties.pattern_id} selectedEndTime={data.properties.end_time} selectedStartTime={data.properties.start_time} selectedWeekdays={data.properties.weekdays} /> }
				<WidgetCardOpenToggle isOpen={data.settings.is_open} />
			</TouchableOpacity>
			{data.settings.is_open && (
				<View>
					{data.type === 'stop' && <WidgetCardStopBody data={data} />}
					{data.type === 'line' && <WidgetCardLineBody data={data} />}
					{data.type === 'smart_notification' && <WidgetCardSmartNotificationBody data={data} />}
				</View>
			)}
		</View>
	);

	//
}
