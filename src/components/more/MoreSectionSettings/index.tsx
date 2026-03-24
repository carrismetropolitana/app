/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconLanguage } from '@tabler/icons-react-native';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionSettings() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconLanguage color={systemVariables.text[100]} size={32} />,
			key: 'alerts',
			label: t($ => $.more.MoreSectionSettings.items.locale),
			onPress: async () => await Linking.openSettings(),
		},
	];

	//
	// B. Render components

	return (
        <ListSection
			items={LIST_ITEMS}
			title={t($ => $.more.MoreSectionSettings.heading)}
		/>
    );

	//
};
