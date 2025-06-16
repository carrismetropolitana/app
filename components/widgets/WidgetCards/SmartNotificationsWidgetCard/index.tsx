/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { AccountWidget } from '@/types/account.types';
import { ListItem } from '@rn-vui/themed';
import { View } from 'react-native';

import { SmartNotificationWidgetCardBody } from '../SmartNotificationsWidgetCardBody';
import { SmartNotificationsWidgetCardHeader } from '../SmartNotificationsWidgetCardHeader';
import { SmartNotificationsWidgetCardToolbar } from '../SmartNotificationsWidgetCardToolbar';
import { styles } from './styles';

/* * */

interface SmartNotificationWidgetCardProps {
	data?: AccountWidget
	expanded?: boolean
	onToggle?: () => void
}

/* * */

export function SmartNotificationWidgetCard({ data, expanded = true, onToggle = () => console.log('jello') }: SmartNotificationWidgetCardProps) {
	//

	//
	// A. Setup variables

	const cardStyles = styles();

	//
	// B. Fetch Data

	//
	// D. Render Components

	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			icon={<AccordionToggle expanded={expanded} size={24} />}
			isExpanded={expanded}
			onPress={onToggle}
			content={(
				<SmartNotificationsWidgetCardHeader municipality="test" title="test 2" />
			)}
		>
			<View style={cardStyles.cardBody}>
				<SmartNotificationsWidgetCardToolbar />
				<LinesDetailContextProvider>
					<SmartNotificationWidgetCardBody lineId="10001" stopId="20001" />
				</LinesDetailContextProvider>
			</View>
		</ListItem.Accordion>
	);

	//
}
