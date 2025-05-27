// src/components/common/LineItem.tsx
import React from 'react';
import { ListItem } from '@rn-vui/themed';
import { TouchableOpacity } from 'react-native';
import { LineDisplay } from '@/components/lines/LineDisplay';

interface LineItemProps {
    lineData: any;
    municipality?: string[];
    size?: 'lg' | 'md';
    onPress?: () => void;
    icon?: React.ReactNode;
}

export function LineItem({ lineData, municipality, size, onPress, icon }: LineItemProps) {
    return (
        <ListItem bottomDivider topDivider onPress={onPress}>
            <ListItem.Content>
                <LineDisplay lineData={lineData} municipality={municipality} size={size} />
            </ListItem.Content>
            {icon ?? <ListItem.Chevron />}
        </ListItem>
    );
}

export const MemoizedLineItem = React.memo(LineItem);
