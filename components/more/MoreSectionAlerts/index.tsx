/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionAlerts() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreSectionAlerts' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconAlertTriangle color={systemVariables.text[100]} size={32} />,
			key: 'alerts',
			label: t('items.service_alerts'),
			link: '/more/alerts',
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t('heading')}
		/>
	);

	//
};
