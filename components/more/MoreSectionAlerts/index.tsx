/* * */

import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function MoreSectionAlerts() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreSectionAlerts' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconAlertTriangle size={32} />,
			key: 'alerts',
			label: t('items.service_alerts'),
			link: '/webview?url=https://carrismetropolitana.pt/alerts',
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
