/* * */

import { LiveIcon } from '@/components/arrivals/LiveIcon';
import { Dates } from '@/core-replica';
import { type ArrivalStatus } from '@/schemas/realtime-arrival';
import { useSystemVariables } from '@/theme/global';
import { IconClockHour9 } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ArrivalTimeProps {
	status?: ArrivalStatus
	time?: null | number
}

/* * */

export function ArrivalTime({ status, time }: ArrivalTimeProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

	const [relativeTimeDisplay, setRelativeTimeDisplay] = useState<string | undefined>(undefined);
	const [absoluteTimeDisplay, setAbsoluteTimeDisplay] = useState<string | undefined>(undefined);

	//
	// C. Transform data

	useEffect(() => {
		const run = () => {
			// Skip if no data
			if (!time) return;
			// Transform unix seconds into minutes
			const now = Dates.now('Europe/Lisbon').unix_timestamp / 1000;
			const minutes = Math.max(0, Math.floor((time - now) / 60));
			// Return minutes with correct pluralization
			setRelativeTimeDisplay(`${minutes} min`);
		};
		run();
		const interval = setInterval(run, 10_000);
		return () => clearInterval(interval);
	}, [time]);

	useEffect(() => {
		const run = () => {
			// Skip if no data
			if (!time) return;
			// Transform unix seconds into HH:MM format
			const date = new Date(time * 1000);
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			// Return time in HH:MM format
			setAbsoluteTimeDisplay(`${hours}:${minutes}`);
		};
		run();
		const interval = setInterval(run, 10_000);
		return () => clearInterval(interval);
	}, [time]);

	//
	// B. Render components

	if (status === 'realtime') {
		return (
			<View accessibilityLabel={t($ => $.arrivals.ArrivalTime.realtime.accessibility_label)} style={[styles.container, { gap: 1 }]}>
				<LiveIcon />
				<Text style={[styles.title, { color: systemVariables.status.live }]}>
					{relativeTimeDisplay}
				</Text>
			</View>
		);
	}

	if (status === 'scheduled') {
		return (
			<View accessibilityLabel={t($ => $.arrivals.ArrivalTime.scheduled.accessibility_label)} style={styles.container}>
				<IconClockHour9 color={systemVariables.text[100]} size={16} />
				<Text accessibilityRole="timer" style={styles.title}>
					{absoluteTimeDisplay}
				</Text>
			</View>
		);
	}

	//
};
