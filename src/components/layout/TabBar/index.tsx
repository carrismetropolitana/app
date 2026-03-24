/* * */

import { useSystemVariables } from '@/theme/global';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

/* * */

export function TabBar() {
	//

	//
	// A. Setup variables
	const systemVariables = useSystemVariables();
	const { t } = useTranslation();
	//
	// C. Render components
	return (
		<NativeTabs tintColor={systemVariables.text[100]}>
			<NativeTabs.Trigger name="(home)" options={{ title: t($ => $._app.sitemap['(tabs)/home'].title) }}>
				<Label>{t($ => $._app.sitemap['(tabs)/home'].title)}</Label>
				<Icon
					androidSrc={<VectorIcon family={MaterialIcons} name="person" />}
					sf={{ default: 'person.circle', selected: 'person.circle.fill' }}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(lines)" options={{ title: t($ => $._app.sitemap['(tabs)/lines'].title) }}>
				<Label>{t($ => $._app.sitemap['(tabs)/lines'].title)}</Label>
				<Icon androidSrc={<VectorIcon family={MaterialIcons} name="swap-calls" />} sf="arrow.trianglehead.swap" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(stops)" options={{ title: t($ => $._app.sitemap['(tabs)/stops'].title) }}>
				<Label>{t($ => $._app.sitemap['(tabs)/stops'].title)}</Label>
				<Icon
					androidSrc={<VectorIcon family={MaterialIcons} name="map" />}
					sf={{ default: 'map', selected: 'map.fill' }}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="more" options={{ title: t($ => $._app.sitemap['(tabs)/more'].title) }}>
				<Label>{t($ => $._app.sitemap['(tabs)/more'].title)}</Label>
				<Icon
					androidSrc={<VectorIcon family={MaterialIcons} name="more-horiz" />}
					sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	);

	//
}
