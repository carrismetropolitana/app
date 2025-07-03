/* * */

import FavoriteItem from '@/components/common/FavoriteItem';
import { SwipeUnderlay } from '@/components/screens/ProfileScreen/SwipeUnderlay';
import { AccountWidget } from '@/types/account.types';
import { useRef } from 'react';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';

/* * */

interface RenderFavoriteItemProps {
	drag: () => void
	index: number
	isActive: boolean
	item: AccountWidget
}

/* * */

export const RenderFavoriteItem = ({ drag, index, isActive, item }: RenderFavoriteItemProps) => {
	//

	//
	// A. Setup Variables

	const key = widgetKey(item);
	const itemRefs = useRef<Map<string, SwipeableItemImperativeRef>>(new Map());

	function widgetKey(widget: AccountWidget) {
		if (widget.data.type === 'lines') return `lines-${widget.data.pattern_id}`;
		if (widget.data.type === 'stops') return `stops-${widget.data.stop_id}`;
		if (widget.data.type === 'smart_notifications') return `smart_notifications-${widget.data.id || ''}`;
	}

	//
	// B.Render Components

	return (
		<ScaleDecorator>
			<SwipeableItem
				key={key}
				ref={(ref) => { if (ref && key) itemRefs.current.set(key, ref); }}
				activationThreshold={20}
				item={item}
				snapPointsLeft={[100]}
				swipeEnabled={!isActive}
				onChange={({ openDirection }) => {
					if (openDirection !== OpenDirection.NONE) {
						itemRefs.current.forEach((r, k) => {
							if (k !== key) r.close();
						});
					}
				}}
				renderUnderlayLeft={({ open, percentOpen }) => (
					<SwipeUnderlay direction={OpenDirection.LEFT} index={item.settings?.display_order ?? index} open={open} percentOpen={percentOpen} />
				)}
			>
				<FavoriteItem data={item} drag={drag} isActive={isActive} />
			</SwipeableItem>
		</ScaleDecorator>
	);

	//
};
