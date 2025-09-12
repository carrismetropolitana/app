/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { RenderFavoriteItem } from '@/components/profile/RenderFavoriteItem';
import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { NestableDraggableFlatList, type RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

/* * */

export function WidgetsList() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();

	//
	// B. Transform Data

	const orderedWidgets: AccountWidget[] = useMemo(() => {
		if (!profileContext.data.profile?.widgets) return [];
		return profileContext.data.profile.widgets.sort((a, b) => (a.settings?.display_order ?? 0) - (b.settings?.display_order ?? 0));
	}, [profileContext.data.profile?.widgets]);

	//
	// C. Handle actions

	const handleDragEnd = ({ data }: { data: AccountWidget[] }) => {
		profileContext.actions.updateLocalProfile({ widgets: data });
	};

	const widgetKey = (widget: AccountWidget) => {
		if (widget.data.type === 'lines')
			return `lines-${widget.data.pattern_id}`;
		if (widget.data.type === 'stops')
			return `stops-${widget.data.stop_id}`;
		if (widget.data.type === 'smart_notifications')
			return `smart_notifications-${widget.data.id || ''}`;
		return JSON.stringify(widget);
	};

	//
	// C. Render Components

	const renderItem = ({ drag, isActive, item }: RenderItemParams<AccountWidget>) => {
		return (
			<TouchableOpacity delayLongPress={500} disabled={isActive} onLongPress={drag}>
				<ScaleDecorator>
					<RenderFavoriteItem drag={drag} index={0} isActive={isActive} item={item} />
				</ScaleDecorator>
			</TouchableOpacity>
		);
	};

	if (!orderedWidgets.length) {
		return <NoDataLabel text="No widgets added yet" />;
	}

	return (
		<NestableDraggableFlatList
			data={orderedWidgets}
			keyExtractor={item => widgetKey(item)}
			onDragEnd={handleDragEnd}
			renderItem={renderItem}
		/>
	);

	//
}
