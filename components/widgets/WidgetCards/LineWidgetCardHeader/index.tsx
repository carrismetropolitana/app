/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface LineWidgetCardHeaderProps {
	lineId: string
	title: string
}

/* * */

export function LineWidgetCardHeader({ lineId, title }: LineWidgetCardHeaderProps) {
	const linesContext = useLinesContext();
	const headerStyles = styles();

	const isLoading = linesContext.flags?.is_loading;
	const lineData = linesContext.actions.getLineDataById
		? linesContext.actions.getLineDataById(lineId)
		: undefined;

	if (isLoading) {
		return (
			<View style={headerStyles.container}>
				<Text style={headerStyles.headerTitle}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={headerStyles.container}>
			<LineBadge color={lineData?.color} lineId={lineId} size="lg" />
			<Text style={headerStyles.headerTitle}>{title}</Text>
		</View>
	);
}
