/* * */

import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconBellRinging, IconBusStop, IconCirclePlusFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function AccountViewWidgetsCreate() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconBusStop color="#FF6900" size={30} />,
			key: 'stop',
			label: t($ => $.account.AccountViewWidgetsCreate.stop),
			link: '/account/widgets/stop',
			replaceChevron: <IconCirclePlusFilled color={systemVariables.status.ok} size={30} />,
		},
		{
			icon: <IconArrowLoopRight color="#C61D23" size={30} />,
			key: 'line',
			label: t($ => $.account.AccountViewWidgetsCreate.line),
			link: '/account/widgets/line',
			replaceChevron: <IconCirclePlusFilled color={systemVariables.status.ok} size={30} />,
		},
		{
			icon: <IconBellRinging color="#0C807E" size={30} />,
			key: 'smart_notification',
			label: t($ => $.account.AccountViewWidgetsCreate.smart_notification),
			link: '/account/widgets/smart_notification',
			replaceChevron: <IconCirclePlusFilled color={systemVariables.status.ok} size={30} />,
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t($ => $.account.AccountViewWidgetsCreate.title)}
		/>
	);

	//
};
