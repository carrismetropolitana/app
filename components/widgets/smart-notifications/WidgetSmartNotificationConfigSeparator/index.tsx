/* * */

import { useSystemVariables } from '@/theme/global';
import Svg, { Circle, Rect } from 'react-native-svg';

/* * */

interface WidgetSmartNotificationConfigSeparatorProps {
	style: 'end' | 'middle' | 'start'
}

/* * */

export function WidgetSmartNotificationConfigSeparator({ style }: WidgetSmartNotificationConfigSeparatorProps) {
	//

	if (style === 'start') {
		return (
			<Svg fill="none" height="36" style={{ marginVertical: 20 }} viewBox="0 0 12 36" width="100%">
				<Circle cx="6" cy="6" fill={useSystemVariables().text[400]} r="6" />
				<Rect fill={useSystemVariables().text[400]} height="30" width="2" x="5" y="6" />
			</Svg>
		);
	}

	if (style === 'middle') {
		return (
			<Svg fill="none" height="30" style={{ marginVertical: 20 }} viewBox="0 0 2 30" width="100%">
				<Rect fill={useSystemVariables().text[400]} height="30" width="2" />
			</Svg>
		);
	}

	if (style === 'end') {
		return (
			<Svg fill="none" height="36" style={{ marginVertical: 20 }} viewBox="0 0 12 36" width="100%">
				<Rect fill={useSystemVariables().text[400]} height="30" width="2" x="5" y="6" />
				<Circle cx="6" cy="30" fill={useSystemVariables().text[400]} r="6" />
			</Svg>
		);
	}

	//
};
