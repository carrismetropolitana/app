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
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardProps {
	data: Widget
	isDragging?: boolean
	onDragEnd: () => void
	onDragStart: () => void
}

/* * */

export function WidgetCard({ data, isDragging, onDragEnd, onDragStart }: WidgetCardProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// B. Handle actions

	const handleToggleOpen = async () => {
		const thisWidget = { ...data, settings: { ...data.settings, is_open: data.settings.is_open ? false : true } };
		const allWidgets = accountContext.data.account?.widgets.map(w => w._id === thisWidget._id ? thisWidget : w) || [];
		await accountContext.actions.update('widgets', allWidgets);
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onLongPress={onDragStart} onPress={handleToggleOpen} onPressOut={onDragEnd}>
			<View style={[styles.container, isDragging && styles.containerIsDragging]}>

				<View style={[styles.headerWrapper, data.settings.is_open && styles.headerWrapperIsOpen]}>
					{data.type === 'stop' && <WidgetCardStopHeader label={data.settings.label ?? 'Trabalho'} stopId={data.properties.stop_id} /> }
					{data.type === 'line' && <WidgetCardLineHeader patternId={data.properties.pattern_id} /> }
					{data.type === 'smart_notification' && <WidgetCardSmartNotificationHeader label={data.settings.label} selectedStartTime={data.properties.start_time} selectedWeekdays={data.properties.weekdays} /> }
					<WidgetCardOpenToggle isOpen={data.settings.is_open} />
				</View>

				{data.settings.is_open && (
					<View>
						{data.type === 'stop' && <WidgetCardStopBody data={data} />}
						{data.type === 'line' && <WidgetCardLineBody data={data} />}
						{data.type === 'smart_notification' && <WidgetCardSmartNotificationBody data={data} />}
					</View>
				)}

			</View>
		</TouchableOpacity>
	);

	//
}
