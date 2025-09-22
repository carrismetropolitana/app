/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { StopDisplay } from '@/components/stops/StopDisplay';
import { useLocaleContext } from '@/contexts/Locale.context';
import { ListItem } from '@rn-vui/themed';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	icon?: React.ReactNode
	itemClick?: (item) => void
	items?: number
	size?: 'lg' | 'md'
}
/* * */
export function VirtualizedListingStops({ data, icon, itemClick, items, size }: Props) {
	//

	//
	// A. Fetch data

	const getItem = (data: [], index: number) => data[index];
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'virtualizedListingLines' });

	//
	// B. Render components

	const renderItem = ({ item }) => (
		<ListItem onPress={itemClick && (() => itemClick(item))} bottomDivider topDivider>
			{itemClick
				? (
					<ListItem.Content>
						<ListItem.Title>
							<StopDisplay size={size} stopData={item} />
						</ListItem.Title>
					</ListItem.Content>
				)
				: (
					<Link href={`/stops/${item.id}`} asChild>
						<ListItem.Content>
							<StopDisplay size={size} stopData={item} />
						</ListItem.Content>
					</Link>
				)}

			{icon ? icon : <ListItem.Chevron iconStyle={{ fontSize: 24 }} />}
		</ListItem>

	);

	return (
		<VirtualizedList
			accessibilityHint={t('virtualizedListAccessibilityHint')}
			accessibilityLabel={t('virtualizedListAccessibilityLabel')}
			accessibilityLanguage={localeContext.data.locale}
			accessibilityRole="text"
			data={data}
			getItem={getItem}
			getItemCount={data => data?.length || 0}
			initialNumToRender={items}
			keyExtractor={item => item.id}
			renderItem={renderItem}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={(
				<NoDataLabel />
			)}
		/>
	);

	//
}
