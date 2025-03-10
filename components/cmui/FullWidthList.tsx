import React, { createContext, useContext } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable,
	type StyleProp,
	type ViewStyle,
	type TextStyle,
} from "react-native";
import useThemedCMColor from "@/hooks/useThemedCMColor";

// to share styling and theme information
type FullWidthListContextType = {
	styles: ReturnType<typeof makeStyles>;
	systemText100: string;
	systemText400: string;
};

const FullWidthListContext = createContext<FullWidthListContextType | null>(
	null,
);

interface FullWidthListProps {
	style?: StyleProp<ViewStyle>;
	children: React.ReactNode;
}

export const FullWidthList: React.FC<FullWidthListProps> & {
	Section: typeof Section;
	Item: typeof Item;
	Divider: typeof Divider;
} = ({ style, children }) => {
	const systemText100 = useThemedCMColor("systemText100");
	const systemText200 = useThemedCMColor("systemText200");
	const systemText300 = useThemedCMColor("systemText300");
	const systemText400 = useThemedCMColor("systemText400");
	const systemBackground100 = useThemedCMColor("systemBackground100");
	const systemBackground200 = useThemedCMColor("systemBackground200");
	const systemBorder100 = useThemedCMColor("systemBorder100");

	const styles = makeStyles({
		systemBackground100,
		systemBackground200,
		systemText100,
		systemText200,
		systemText300,
		systemBorder100,
	});

	return (
		<FullWidthListContext.Provider
			value={{ styles, systemText100, systemText400 }}
		>
			<View style={[styles.container, style]}>{children}</View>
		</FullWidthListContext.Provider>
	);
};

// ---- divider component ----
interface DividerProps {
	style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ style }) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error("Divider must be used within a List");
	const { styles } = context;

	return <View style={[styles.divider, style]} />;
};

// ---- section component ----
interface SectionProps {
	title?: string;
	subtitle?: string;
	titleStyle?: StyleProp<TextStyle>;
	subtitleStyle?: StyleProp<TextStyle>;
	style?: StyleProp<ViewStyle>;
	children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
	title,
	subtitle,
	titleStyle,
	subtitleStyle,
	style,
	children,
}) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error("Section must be used within a List");
	const { styles } = context;

	// process children to insert dividers
	const childrenArray = React.Children.toArray(children).filter(
		(child) => React.isValidElement(child) && child.type !== Divider,
	);

	const processedChildren: React.ReactNode[] = [];

	// top divider
	processedChildren.push(<Divider key="divider-top" />);

	// items with dividers between them
	childrenArray.forEach((child, index) => {
		processedChildren.push(child);
		// add divider after each item (including the last one which serves as bottom divider)
		processedChildren.push(
			<Divider
				key={`divider-${
					// biome-ignore lint/suspicious/noArrayIndexKey: has to be
					index
				}`}
			/>,
		);
	});

	return (
		<View style={[style]}>
			{title && <Text style={[styles.sectionHeader, titleStyle]}>{title}</Text>}
			{subtitle && (
				<Text style={[styles.sectionSubHeader, subtitleStyle]}>{subtitle}</Text>
			)}
			<View style={styles.sectionContent}>{processedChildren}</View>
		</View>
	);
};

// ---- item component ----
interface BaseItemProps {
	title: string;
	topText?: string;
	bottomText?: string;
	leadingIcon?: React.ReactNode;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
}

type ItemProps =
	| (BaseItemProps & { trailingIcon?: React.ReactNode; externalAction?: never })
	| (BaseItemProps & { externalAction?: boolean; trailingIcon?: never });

const Item: React.FC<ItemProps> = ({
	title,
	topText,
	bottomText,
	leadingIcon,
	trailingIcon,
	externalAction,
	onPress,
	style,
	disabled = false, // TODO: grayscale-ify the contents when disabled
}) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error("Item must be used within a List");
	const { styles, systemText100, systemText400 } = context;

	const resolvedTrailingIcon =
		trailingIcon ||
		(externalAction ? (
			<IconExternalLink size={20} color={systemText400} />
		) : (
			<IconChevronRight size={20} color={systemText400} />
		));

	const menuItemContent = (
		<>
			<View style={styles.menuDescriptor}>
				{leadingIcon}
				<View style={styles.textContainer}>
					{topText && <Text style={styles.topText}>{topText}</Text>}
					<Text style={styles.menuText}>{title}</Text>
					{bottomText && <Text style={styles.bottomText}>{bottomText}</Text>}
				</View>
			</View>
			{resolvedTrailingIcon}
		</>
	);

	return process.env.EXPO_OS === "android" ? (
		<Pressable
			android_ripple={{ color: "#eee" }}
			style={[styles.menuItem, style]}
			onPress={onPress}
			disabled={disabled}
		>
			{menuItemContent}
		</Pressable>
	) : (
		<TouchableOpacity
			activeOpacity={0.7}
			style={[styles.menuItem, style]}
			onPress={onPress}
			disabled={disabled}
		>
			{menuItemContent}
		</TouchableOpacity>
	);
};

// attach sub-components to List
FullWidthList.Section = Section;
FullWidthList.Item = Item;
FullWidthList.Divider = Divider;

// default trailing icons
import { IconChevronRight, IconExternalLink } from "@tabler/icons-react-native";

const makeStyles = ({
	systemBackground100,
	systemBackground200,
	systemText100,
	systemText200,
	systemText300,
	systemBorder100,
}: {
	systemBackground100: string;
	systemBackground200: string;
	systemText100: string;
	systemText200: string;
	systemText300: string;
	systemBorder100: string;
}) =>
	StyleSheet.create({
		container: {},
		sectionHeader: {
			marginTop: 24,
			fontWeight: "600",
			fontSize: 16,
			color: systemText200,
			marginLeft: 16,
		},
		sectionSubHeader: {
			fontSize: 12,
			fontWeight: "500",
			color: systemText300,
			marginLeft: 16,
			marginBottom: 10,
			width: "90%",
		},
		sectionContent: {
			backgroundColor: systemBackground100,
			overflow: "hidden",
		},
		menuItem: {
			backgroundColor: systemBackground100,
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 8,
			paddingVertical: 12,
			paddingHorizontal: 16,
		},
		divider: {
			height: 1,
			backgroundColor: systemBorder100,
		},
		menuDescriptor: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 14,
		},
		menuText: {
			fontSize: 18,
			fontWeight: "700",
			color: systemText100,
		},
		textContainer: {
			flexDirection: "column",
			justifyContent: "center",
		},
		topText: {
			fontSize: 12,
			fontWeight: 600,
			color: systemText300,
			marginBottom: 2,
		},
		bottomText: {
			fontSize: 12,
			fontWeight: 500,
			color: systemText300,
			marginTop: 2,
		},
	});

export default FullWidthList;
