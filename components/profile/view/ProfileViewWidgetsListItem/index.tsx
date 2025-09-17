/* * */

import FavoriteItem from '@/components/common/FavoriteItem';
import { SwipeUnderlay } from '@/components/profile/SwipeUnderlay';
import { type Widget } from '@/schemas/widgets';
import { useSystemVariables } from '@/theme/global';
import { useRef } from 'react';
import { View } from 'react-native';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';

/* * */

interface ProfileViewWidgetsListItemProps {
	index: number
	item: Widget
}

/* * */

export function ProfileViewWidgetsListItem({ index, item }: ProfileViewWidgetsListItemProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();
	const itemRef = useRef<null | SwipeableItemImperativeRef>(null);

	//
	// B.Render Components

	return (
		<View style={{ backgroundColor: systemVariables.background[100] }}>
			<SwipeableItem
				key={item._id}
				ref={itemRef}
				activationThreshold={20}
				item={item}
				snapPointsLeft={[100]}
				// swipeEnabled={!isActive}
				onChange={({ openDirection }) => {
					if (openDirection !== OpenDirection.NONE) {
						itemRef.current?.close();
					}
				}}
				renderUnderlayLeft={({ open, percentOpen }) => (
					<SwipeUnderlay direction={OpenDirection.LEFT} index={item.settings?.display_order ?? index} open={open} percentOpen={percentOpen} />
				)}
			>
				<FavoriteItem data={item} />
			</SwipeableItem>
		</View>
	);

	//
};
