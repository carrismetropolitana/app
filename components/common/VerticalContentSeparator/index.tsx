import Svg, { Circle, Rect } from 'react-native-svg';

import styles from './styles';

interface VerticalContentSeparatorProps {
	ending?: boolean
	middle?: boolean
	starting?: boolean

}

export const VerticalContentSeparator = ({ ending, middle, starting }: VerticalContentSeparatorProps) => {
	const verticalSeparatorStyles = styles();

	return (
		<>
			{starting && (
				<Svg fill="none" height="36" style={verticalSeparatorStyles.svg} viewBox="0 0 12 36" width="100%">
					<Circle cx="6" cy="6" fill="#BEBEC8" r="6" />
					<Rect fill="#BEBEC8" height="30" width="2" x="5" y="6" />
				</Svg>
			)}
			{middle && (
				<Svg fill="none" height="30" style={verticalSeparatorStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>
			)}
			{ending && (
				<Svg fill="none" height="30" style={verticalSeparatorStyles.svg} viewBox="0 0 2 30" width="100%">
					<Rect fill="#BEBEC8" height="30" width="2" />
				</Svg>
			)}
		</>
	);
};
