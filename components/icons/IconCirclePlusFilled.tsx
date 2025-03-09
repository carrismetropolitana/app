import Svg, { Path } from "react-native-svg";

export default function IconCirclePlusFilled({
	color,
	size,
}: {
	color?: string;
	size?: number;
}) {
	return (
		<Svg
			width={size || 24}
			height={size || 24}
			color={color}
			viewBox="0 0 24 24"
			fill="currentColor"
			className="icon icon-tabler icons-tabler-filled icon-tabler-circle-plus"
		>
			<Path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<Path d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14zm8.071 4.071a1 1 0 1 0 -2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0 -2h-2v-2z" />
		</Svg>
	);
}
