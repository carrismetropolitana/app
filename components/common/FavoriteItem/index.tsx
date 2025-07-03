/* * */

import type { AccountWidget } from '@/types/account.types';

import { useStopsContext } from '@/contexts/Stops.context';
import { Routes } from '@/utils/routes';
import { ListItem } from '@rn-vui/themed';
import { IconGripVertical } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableHighlight, View } from 'react-native';

import styles from './styles';

/* * */

interface FavoriteItemProps {
	data: AccountWidget
	drag?: () => void
	isActive?: boolean
}

/* * */

export default function FavoriteItemComponent({ data, drag, isActive }: FavoriteItemProps) {
	//

	//
	// A. Setup Variables

	let linkHref = '';
	const stopsContext = useStopsContext();
	const [headsign, setHeadsign] = useState<'' | string>('');
	const [stopName, setStopName] = useState<'' | string>('');

	const isLine = data.data.type === 'lines';
	const isStop = data.data.type === 'stops';
	const isSmart = data.data.type === 'smart_notifications';

	const favoriteItemStyles = styles();

	//
	// B. Fetch Data

	const getPatternId = (w: AccountWidget): string | undefined => {
		const { pattern_id, pattern_ids, type } = w.data as any;
		if (type === 'lines' && typeof pattern_id === 'string') return pattern_id;
		if (type === 'stops' && Array.isArray(pattern_ids) && pattern_ids.length > 0) return pattern_ids[0];
		return undefined;
	};
	const getStopId = (w: AccountWidget): string | undefined => {
		if ((w.data).type === 'stops' && 'stop_id' in w.data) return (w.data).stop_id;
		if ((w.data).type === 'smart_notifications' && 'stop_id' in w.data) return (w.data).stop_id;
		return undefined;
	};

	const patternId = getPatternId(data);
	const stopId = getStopId(data);

	const fetchHeadsign = useCallback(async () => {
		if (!patternId) return;
		const resp = await fetch(`${Routes.API}/patterns/${patternId}`);
		const data = await resp.json();
		setHeadsign(Array.isArray(data) ? data[0]?.headsign || '' : '');
	}, [patternId]);

	const fetchStopName = useCallback(() => {
		if (!stopId || !stopsContext.actions.getStopById) return;

		const stopData = stopsContext.actions.getStopById(stopId);
		setStopName(stopData?.long_name || '');
	}, [stopId, stopsContext.actions]);

	useEffect(() => {
		if (isLine) fetchHeadsign();
	}, [fetchHeadsign, isLine]);

	useEffect(() => {
		if (isStop || isSmart) fetchStopName();
	}, [fetchStopName, isStop, isSmart]);

	//
	// C. Transform Data

	if (isLine && typeof patternId === 'string') {
		const favoriteLineWidgetID = data.settings?.display_order;
		linkHref = `/addFavoriteLine/?widgetId=${favoriteLineWidgetID}`;
	}
	else if (isStop && stopId) {
		const favoriteStopWidgetID = data.settings?.display_order;
		linkHref = `/addFavoriteStop/?widgetId=${favoriteStopWidgetID}`;
	}
	else if (isSmart) {
		const smartNotificationData = data.data as any;
		linkHref = `/addSmartNotification/?smartNotificationId=${smartNotificationData.id}`;
	}

	const mainLabel = isLine ? (headsign === null ? '' : headsign || 'Linha Favorita') : (stopName || (isStop ? 'Paragem Favorita' : 'Notificação Inteligente'));
	const subLabel = isLine ? 'Linha Favorita' : (isStop ? 'Paragem Favorita' : 'Notificação Inteligente');

	//
	// D. Render Components

	return (
		<View style={favoriteItemStyles.wrapper}>
			<TouchableHighlight disabled={isActive} onLongPress={drag} onPress={() => router.push(linkHref)} style={favoriteItemStyles.container} underlayColor="rgba(0,0,0,0.05)">
				<View style={favoriteItemStyles.inner}>
					<View style={favoriteItemStyles.grip}>
						<IconGripVertical color="#9696A0" size={24} />
					</View>
					<ListItem.Content>
						<ListItem.Title>
							{((isLine && headsign === null) || ((isStop || isSmart) && stopName === null))
								? <ActivityIndicator size="small" />
								: <Text numberOfLines={1}>{mainLabel}</Text>}
						</ListItem.Title>
						{((isLine && headsign !== null) || ((isStop || isSmart) && stopName !== null)) && (
							<ListItem.Subtitle>
								<Text>{subLabel}</Text>
							</ListItem.Subtitle>
						)}
					</ListItem.Content>
					<ListItem.Chevron />
				</View>
			</TouchableHighlight>
		</View>
	);

	//
}
