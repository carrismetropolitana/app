/* * */

import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { IconArrowLoopRight, IconBellRinging, IconBusStop, IconCirclePlus } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';

/* * */

export function ProfileViewWidgetsCreate() {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'profile' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconBusStop color="#FF6900" size={30} />,
			key: 'stop',
			label: 'Adicionar Paragem',
			link: '/addFavoriteStop',
			replaceChevron: <IconCirclePlus color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100} fill="#3CB43C" size={30} />,
		},
		{
			icon: <IconArrowLoopRight color="#C61D23" size={30} />,
			key: 'line',
			label: 'Adicionar Linha',
			link: '/addFavoriteLine',
			replaceChevron: <IconCirclePlus color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100} fill="#3CB43C" size={30} />,
		},
		{
			icon: <IconBellRinging color="#0C807E" size={30} />,
			key: 'notification',
			label: 'Adicionar Notificação Inteligente',
			link: '/addSmartNotification',
			replaceChevron: <IconCirclePlus color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100} fill="#3CB43C" size={30} />,
		},
	];

	//
	// B. Render components

	return (
		<ListSection
			items={LIST_ITEMS}
			title={t('addNewWidgetSectionTitle')}
		/>
	);

	//
};
