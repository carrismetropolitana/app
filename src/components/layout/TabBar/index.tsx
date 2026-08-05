/* * */

import { useSystemVariables } from '@/theme/global';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
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
			<NativeTabs.Trigger name="(home)">
				<NativeTabs.Trigger.Label>{t($ => $._app.sitemap['(tabs)/home'].title)}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					md="person"
					sf={{ default: 'person.circle', selected: 'person.circle.fill' }}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(lines)">
				<NativeTabs.Trigger.Label>{t($ => $._app.sitemap['(tabs)/lines'].title)}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon md="swap_calls" sf="arrow.trianglehead.swap" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="(stops)">
				<NativeTabs.Trigger.Label>{t($ => $._app.sitemap['(tabs)/stops'].title)}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					md="map"
					sf={{ default: 'map', selected: 'map.fill' }}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="more">
				<NativeTabs.Trigger.Label>{t($ => $._app.sitemap['(tabs)/more'].title)}</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					md="more_horiz"
					sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	);

	//
}
