/* * */

import type { AccountWidget } from '@/types/account.types';

import { useStopsContext } from '@/contexts/Stops.context';
import { Routes } from '@/utils/routes';
import { ListItem } from '@rn-vui/themed';
import { IconGripVertical } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

/* * */

interface FavoriteItemProps {
	data: AccountWidget
	drag?: () => void
	isActive?: boolean
}

/* * */

const getPatternId = (widget: AccountWidget): string | undefined => {
	const { pattern_id, pattern_ids, type } = widget.data as any;
	if (type === 'lines' && typeof pattern_id === 'string') {
		return pattern_id;
	}
	if (type === 'stops' && Array.isArray(pattern_ids) && pattern_ids.length > 0) {
		return pattern_ids[0];
	}
	return undefined;
};

/* * */

export default function FavoriteItemComponent({ data, drag, isActive }: FavoriteItemProps) {
	//

	// A.Setup variables

	const stopsContext = useStopsContext();
	let linkHref = '';
	const [headsign, setHeadsign] = useState<null | string>(null);
	const [stopName, setStopName] = useState<null | string>(null);
	const patternId = getPatternId(data);
	const isLine = data.data.type === 'lines';
	const isStop = data.data.type === 'stops';
	const isSmartNotification = data.data.type === 'smart_notifications';

	// Type guards for stop_id and pattern_ids
	function getStopId(widget: AccountWidget): string | undefined {
		if (widget.data.type === 'stops' && 'stop_id' in widget.data) {
			return widget.data.stop_id;
		}
		if (widget.data.type === 'smart_notifications' && 'stop_id' in widget.data) {
			return widget.data.stop_id;
		}
		return undefined;
	}
	function getPatternIds(widget: AccountWidget): string[] | undefined {
		if (widget.data.type === 'stops' && 'pattern_ids' in widget.data) {
			return widget.data.pattern_ids;
		}
		return undefined;
	}

	const stopId = getStopId(data);
	const patternIds = getPatternIds(data);

	if (isLine && typeof patternId === 'string') {
		const favoriteLineWidgetID = data.data.type === 'lines' ? data.settings?.display_order : null;
		// const beforeUnderscore = patternId.split('_')[0];
		linkHref = `/addFavoriteLine/?widgetId=${favoriteLineWidgetID}`;
	}
	else if (isStop && patternIds && stopId) {
		const favoriteStopWidgetID = data.data.type === 'stops' ? data.settings?.display_order : null;
		linkHref = `/addFavoriteStop/?widgetId=${favoriteStopWidgetID}`;
	}
	else if (isSmartNotification) {
		const smartNotificationData = data.data.type === 'smart_notifications' ? data.data : null;
		linkHref = `/addSmartNotification/?smartNotificationId=${smartNotificationData?.id}`;
	}

	//
	// B. Fetch data

	const fetchHeadsign = useCallback(async () => {
		if (!patternId) {
			setHeadsign('');
			return;
		}

		try {
			const response = await fetch(`${Routes.API}/patterns/${patternId}`);
			const json = await response.json();
			if (Array.isArray(json) && json[0]?.headsign) {
				setHeadsign(json[0].headsign);
			}
			else {
				setHeadsign('');
			}
		}
		catch {
			setHeadsign('');
		}
	}, [patternId]);

	const fetchStopName = useCallback(() => {
		if (!stopId || !stopsContext.actions.getStopById) {
			setStopName('');
			return;
		}
		const stop = stopsContext.actions.getStopById(stopId);
		if (stop && stop.long_name) {
			setStopName(stop.long_name);
		}
		else {
			setStopName('');
		}
	}, [stopId, stopsContext.actions]);

	useEffect(() => {
		fetchHeadsign();
	}, [fetchHeadsign]);

	useEffect(() => {
		if (isStop || isSmartNotification) {
			fetchStopName();
		}
	}, [fetchStopName, isStop, isSmartNotification]);

	//
	// C. Render components

	const mainLabel = isLine
		? (headsign || 'Linha Favorita')
		: (stopName || (isStop ? 'Paragem Favorita' : isSmartNotification ? 'Notificação Inteligente' : ''));

	const subLabel = isLine
		? 'Linha Favorita'
		: (isStop ? 'Paragem Favorita' : isSmartNotification ? 'Notificação Inteligente' : '');

	return (
		<ListItem onPress={() => router.push(linkHref)}>
			<TouchableOpacity disabled={isActive} onLongPress={drag} style={{ padding: 8 }}>
				<IconGripVertical color="#9696A0" size={24} />
			</TouchableOpacity>
			<ListItem.Content>
				<ListItem.Title>
					{(isLine && headsign === null) || ((isStop || isSmartNotification) && stopName === null) ? (
						<ActivityIndicator size="small" />
					) : (
						<Text numberOfLines={1}>{mainLabel}</Text>
					)}
				</ListItem.Title>
				{((isLine && headsign !== null) || ((isStop || isSmartNotification) && stopName !== null)) && (
					<ListItem.Subtitle>
						<Text>{subLabel}</Text>
					</ListItem.Subtitle>
				)}
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	);

	//
};
