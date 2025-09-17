/* * */

import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconBellRinging, IconBusStop, IconCirclePlus } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function ProfileViewWidgetsCreate() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();
	const { t } = useTranslation('translation', { keyPrefix: 'profile.ProfileViewWidgetsCreate' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconBusStop color="#FF6900" size={30} />,
			key: 'stop',
			label: t('stop'),
			link: '/widgets/create/stop',
			replaceChevron: <IconCirclePlus color={systemVariables.background[100]} fill="#3CB43C" size={30} />,
		},
		{
			icon: <IconArrowLoopRight color="#C61D23" size={30} />,
			key: 'line',
			label: t('line'),
			link: '/widgets/create/line',
			replaceChevron: <IconCirclePlus color={systemVariables.background[100]} fill="#3CB43C" size={30} />,
		},
		{
			icon: <IconBellRinging color="#0C807E" size={30} />,
			key: 'smart_notification',
			label: t('smart_notification'),
			link: '/widgets/create/smart-notification',
			replaceChevron: <IconCirclePlus color={systemVariables.background[100]} fill="#3CB43C" size={30} />,
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t('title')}
		/>
	);

	//
};
