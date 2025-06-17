/* * */

import type { AccountWidget } from '@/types/account.types';

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

	let linkHref = '';
	const [headsign, setHeadsign] = useState<null | string>(null);
	const patternId = getPatternId(data);
	const isLine = data.data.type === 'lines';

	if (isLine && typeof patternId === 'string') {
		const beforeUnderscore = patternId.split('_')[0];
		linkHref = `/line/${beforeUnderscore}`;
	}
	else if (data.data.type === 'stops' && data.data.pattern_ids) {
		linkHref = `/stop/${(data.data).stop_id}`;
	}

	//
	// B. Fech data

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

	useEffect(() => {
		fetchHeadsign();
	}, [fetchHeadsign]);

	//
	// C. Render components

	return (
		// <Link href={linkHref} asChild>
		<ListItem onPress={() => router.push(linkHref)}>
			<TouchableOpacity disabled={isActive} onLongPress={drag} style={{ padding: 8 }}>
				<IconGripVertical color="#9696A0" size={24} />
			</TouchableOpacity>
			<ListItem.Content>
				<ListItem.Title>
					{headsign === null ? (
						<ActivityIndicator size="small" />
					) : data.data.type === 'smart_notifications' ? (
						<Text numberOfLines={1}>Notificação Inteligente</Text>
					) : (
						<Text numberOfLines={1}>{headsign || (isLine ? 'Linha Favorita' : 'Paragem Favorita')}</Text>
					)}
				</ListItem.Title>
				{headsign !== null && (
					<ListItem.Subtitle>
						{data.data.type === 'smart_notifications' ? (
							<Text>Descrição da Notificação Inteligente</Text>
						) : (
							<Text>{isLine ? 'Linha Favorita' : 'Paragem Favorita'}</Text>
						)}
					</ListItem.Subtitle>
				)}
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
		// </Link>
	);

	//
};
