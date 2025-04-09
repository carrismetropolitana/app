/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { LineBadge } from '@/components/lines/LineBadge';
import { LineName } from '@/components/lines/LineName';
import { Text } from '@rneui/themed';
import { View } from 'react-native';

import { lineDisplayStyles } from './styles';

/* * */

interface Props {
	color?: string
	lineData?: Line
	longName?: string
	municipality?: string[]
	shortName?: string
	size?: 'lg' | 'md'
	textColor?: string
	width?: number
}

/* * */

export function LineDisplay({ color, lineData, longName, municipality, shortName, size = 'md', textColor, width = 200 }: Props) {
	//

	const onPress = () => {
		alert('clicked');
	};

	if (lineData) {
		return (
			<View style={lineDisplayStyles.container}>
				<LineBadge color={lineData.color} onPress={onPress} shortName={lineData.short_name} size={size} textColor={lineData.text_color} />
				<LineName align="left" longName={lineData.long_name} />

			</View>
		);
	}

	if (longName && shortName && color && textColor) {
		return (
			<View style={lineDisplayStyles.container}>
				<LineBadge color={color} shortName={shortName} size={size} textColor={textColor} />
				<LineName align="left" longName={longName} municipality={municipality} />
			</View>
		);
	}

	return (
		<View>
			<Text>000</Text>
		</View>
		// TODO Add skeleton loader
		// <div className={lineDisplayStyles.container}>
		// 	<Skeleton height={24} radius={9999} width={65} />
		// 	<Skeleton height={24} width={width} />
		// </div>
	);

	//
}
