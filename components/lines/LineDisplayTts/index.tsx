/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
// import { audioTtsUrl } from '@/settings/service-urls';
import { IconPlayerPause, IconVolume } from '@tabler/icons-react-native';
import { AudioPlayer, AudioSource } from 'expo-audio';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	patternId?: string
}

/* * */

export function LineDisplayTts({ patternId }: Props) {
	//

	//
	// A. Setup variables

	const localeContext = useLocaleContext();
	const { t } = useTranslation('lines.LinesDetail.lineDetailsHeader');
	const [isPlaying, setIsPlaying] = useState(false);
	// const [sound, setSound] = useState<AudioPlayer | null>(null);
	const ttsStyles = styles();
	// const analyticsContext = useAnalyticsContext();

	//
	// B. Transform data

	// useEffect(() => {
	// 	const loadSound = async () => {
	// 		const { sound } = await Audio.Sound.createAsync({ uri: `${audioTtsUrl}/patterns/${patternId}.mp3` });
	// 		setSound(sound);
	// 	};
	// 	loadSound();
	// }, [patternId]);

	// useEffect(() => {
	// 	if (!sound) return;
	// 	const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
	// 		if (!status.isLoaded) {
	// 			setIsPlaying(false);
	// 			return;
	// 		}
	// 		setIsPlaying(status.isPlaying);
	// 	};
	// 	sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
	// 	return () => {
	// 		sound.setOnPlaybackStatusUpdate(null);
	// 	};
	// }, [sound]);

	// C. Handle actions

	// const handleToogleAudio = async () => {
	// 	if (!sound) return;
	// 	if (isPlaying) {
	// 		await sound.pauseAsync();
	// 	}
	// 	else {
	// 		await sound.playFromPositionAsync(0);
	// 	}
	// 	// analyticsContext.actions.capture(ampli => ampli.stopAudioPlayed({ audio_played: 'true', stop_id: patternId || '' }));
	// };

	//
	// D. Render components

	return null;

	// return sound && (
	// 	<TouchableOpacity
	// 		accessibilityHint={t('ttsAccessibilityHint')}
	// 		accessibilityLabel={t('ttsAccessibilityLabel')}
	// 		accessibilityLanguage={localeContext.locale}
	// 		accessibilityRole="button"
	// 		onPress={handleToogleAudio}
	// 	>
	// 		<View>
	// 			{isPlaying ? <IconPlayerPause color={ttsStyles.icon.color} /> : <IconVolume color={ttsStyles.icon.color} />}
	// 		</View>
	// 	</TouchableOpacity>
	// );

	//
}
