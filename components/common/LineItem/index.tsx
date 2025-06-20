// src/components/common/LineItem.tsx
import { LineDisplay } from '@/components/lines/LineDisplay';
import { Line } from '@carrismetropolitana/api-types/network';
import { ListItem } from '@rn-vui/themed';
import React from 'react';

interface LineItemProps {
	icon?: React.ReactNode
	lineData: Line
	municipality?: string[]
	onPress?: () => void
	size?: 'lg' | 'md'
}

export function LineItem({ icon, lineData, municipality, onPress, size }: LineItemProps) {
	return (
		<ListItem onPress={onPress} bottomDivider topDivider>
			<ListItem.Content>
				<LineDisplay lineData={lineData} municipality={municipality} size={size} />
			</ListItem.Content>
			{icon ?? <ListItem.Chevron />}
		</ListItem>
	);
}

export const MemoizedLineItem = React.memo(LineItem);
