/* * */

import { Section } from '@/components/common/layout/Section'; ;
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { ListItem, Switch, Text } from '@rn-vui/themed';
import { IconNotification, IconToggleLeft, IconToggleRight } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	disabled: boolean
	heading: string
	// isToggle?: boolean
	patternId?: string
	subheading: string
	// toggle?: () => void
	// toggled?: boolean
	// untoggle?: () => void
}

export const OpenAddSmartNotification = ({ disabled, heading = '', patternId, subheading = '' }: Props) => {
	//

	//
	// A. Setup Variables

	const openAddSmartNotificationStyles = styles();
	const linesDetailContext = useLinesDetailContext();
	// const [open, setOpen] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'common' });

	//
	// C. Render Components

	return (
		<View style={{ marginBottom: 30, marginTop: 10 }}>
			<View style={openAddSmartNotificationStyles.sectionContainer}>
				<Section
					heading={heading}
					subheading={subheading}
				/>
			</View>
			<ListItem
				disabled={disabled}
				disabledStyle={openAddSmartNotificationStyles.disabled}
				onPress={() =>
					patternId ? router.push(`/addSmartNotification?patternId=${patternId}`) : router.push(`/addSmartNotification?lineId=${linesDetailContext.data.line?.id}`)}
			>
				<IconNotification color="#E64B23" size={24} />
				<ListItem.Content>
					<ListItem.Title style={openAddSmartNotificationStyles.listTitle}>
						<Text>{t('enable_notifications')}</Text>
					</ListItem.Title>
				</ListItem.Content>
				{/* {!isToggle && <ListItem.Chevron />}
				{isToggle && (<Switch onValueChange={toggled ? untoggle : toggle} value={toggled} />)} */}
			</ListItem>

		</View>
	);

	//
};
