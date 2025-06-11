/* * */

import { audioTtsUrl } from '@/settings/urls.settings';
import { IconPlayerPause, IconVolume } from '@tabler/icons-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	stopId?: string
}

/* * */

export function StopDisplayTts({ stopId }: Props) {
	//

	//
	// A. Setup variables

	const [isPlaying, setIsPlaying] = useState(false);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const ttsStyles = styles();
	// const analyticsContext = useAnalyticsContext();

	//
	// B. Transform data

	useEffect(() => {
		const loadSound = async () => {
			const { sound } = await Audio.Sound.createAsync(
				{ uri: `${audioTtsUrl}/stops/${stopId}.mp3` },
			);
			setSound(sound);
		};
		loadSound();
	}, [stopId]);

	useEffect(() => {
		if (!sound) return;

		const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
			if (!status.isLoaded) {
				setIsPlaying(false);
				return;
			}
			setIsPlaying(status.isPlaying);
		};

		sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

		return () => {
			sound.setOnPlaybackStatusUpdate(null);
		};
	}, [sound]);

	//
	// C. Handle actions

	const handleToogleAudio = () => {
		if (isPlaying) {
			sound?.pauseAsync();
		}
		else {
			sound?.playAsync();
		}
		// analyticsContext.actions.capture(ampli => ampli.stopAudioPlayed({ audio_played: 'true', stopId: patternId || '' }));
	};

	//
	// D. Render components

	return sound && (
		<TouchableOpacity onPress={handleToogleAudio}>
			<View>
				{isPlaying
					? <IconPlayerPause color={ttsStyles.icon.color} />
					: <IconVolume color={ttsStyles.icon.color} />}
			</View>
		</TouchableOpacity>
	);

	//
}
