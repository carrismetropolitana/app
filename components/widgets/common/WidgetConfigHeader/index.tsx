/* * */

import { ListSection } from '@/components/list/ListSection';
import { type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { IconPlayerPlayFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetStopHeaderProps {
	description: string
	title: string
	videoUrl: string
}

/* * */

export function WidgetConfigHeader({ description, title, videoUrl }: WidgetStopHeaderProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigHeader' });

	const LIST_ITEMS: ListSectionItemProps[] = [
		{
			icon: <IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />,
			key: 'video',
			label: t('video_label'),
			link: `/webview?url=${encodeURIComponent(videoUrl)}`,
		},
	];

	//
	// B. Render Componnent

	return (
		<>
			<View style={useStyles().container}>
				<Text style={useStyles().title}>{title}</Text>
				<Text style={useStyles().description}>{description}</Text>
			</View>
			<ListSection items={LIST_ITEMS} />
		</>
	);
	//
};
