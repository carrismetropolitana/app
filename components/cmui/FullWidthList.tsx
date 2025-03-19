import useThemedCMColor from '@/hooks/useThemedCMColor';
import React, { cloneElement, createContext, useContext } from 'react';
import {
	Pressable,
	type StyleProp,
	StyleSheet,
	Text,
	type TextStyle,
	TouchableOpacity,
	View,
	type ViewStyle,
} from 'react-native';

// to share styling and theme information
interface FullWidthListContextType {
	styles: ReturnType<typeof makeStyles>
	systemText100: string
	systemText400: string
}

const FullWidthListContext = createContext<FullWidthListContextType | null>(
	null,
);

interface FullWidthListProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
}

export const FullWidthList: React.FC<FullWidthListProps> & {
	Divider: typeof Divider
	Item: typeof Item
	Section: typeof Section
} = ({ children, style }) => {
	const systemText100 = useThemedCMColor('systemText100');
	const systemText200 = useThemedCMColor('systemText200');
	const systemText300 = useThemedCMColor('systemText300');
	const systemText400 = useThemedCMColor('systemText400');
	const systemBackground100 = useThemedCMColor('systemBackground100');
	const systemBackground200 = useThemedCMColor('systemBackground200');
	const systemBorder100 = useThemedCMColor('systemBorder100');

	const styles = makeStyles({
		systemBackground100,
		systemBackground200,
		systemBorder100,
		systemText100,
		systemText200,
		systemText300,
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
	style?: StyleProp<ViewStyle>
}

const Divider: React.FC<DividerProps> = ({ style }) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error('Divider must be used within a List');
	const { styles } = context;

	return <View style={[styles.divider, style]} />;
};

// ---- section component ----
interface SectionProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
	subtitle?: string
	subtitleStyle?: StyleProp<TextStyle>
	title?: string
	titleStyle?: StyleProp<TextStyle>
}

const Section: React.FC<SectionProps> = ({
	children,
	style,
	subtitle,
	subtitleStyle,
	title,
	titleStyle,
}) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error('Section must be used within a List');
	const { styles } = context;

	// process children to insert dividers
	const childrenArray = React.Children.toArray(children).filter(
		child => React.isValidElement(child) && child.type !== Divider,
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
	bottomText?: string
	disabled?: boolean
	leadingIcon?: React.ReactNode
	onPress?: () => void
	style?: StyleProp<ViewStyle>
	title: string
	topText?: string
}

type ItemProps =
	| (BaseItemProps & { externalAction?: boolean, trailingIcon?: never })
	| (BaseItemProps & { externalAction?: never, trailingIcon?: React.ReactNode });

const Item: React.FC<ItemProps> = ({
	bottomText,
	disabled = false,
	externalAction,
	leadingIcon,
	onPress,
	style,
	title,
	topText,
	trailingIcon,
}) => {
	const context = useContext(FullWidthListContext);
	if (!context) throw new Error('Item must be used within a List');
	const { styles, systemText100, systemText400 } = context;

	const resolvedTrailingIcon
		= trailingIcon
		  || (externalAction ? (
			<IconExternalLink color={systemText400} size={20} />
		  ) : (
			<IconChevronRight color={systemText400} size={20} />
		  ));

	const menuItemContent = (
		<>
			<View style={styles.menuDescriptor}>
				{/* avoid this cloneElement shit */}
				{cloneElement(leadingIcon as React.ReactElement, {
					color: disabled ? styles.primaryDisabled.color : (leadingIcon as React.ReactElement).props.color,
				})}
				<View style={styles.textContainer}>
					{topText && (
						<Text
							style={[styles.topText, disabled && styles.secondaryDisabled]}
						>
							{topText} {disabled && '(Disabled)'}
						</Text>
					)}
					<Text style={[styles.menuText, disabled && styles.primaryDisabled]}>
						{title}
					</Text>
					{bottomText && (
						<Text
							style={[styles.bottomText, disabled && styles.secondaryDisabled]}
						>
							{bottomText}
						</Text>
					)}
				</View>
			</View>
			{/* avoid this cloneElement shit */}
			{cloneElement(resolvedTrailingIcon as React.ReactElement, {
				color: disabled ? styles.tertiaryDisabled.color : (resolvedTrailingIcon as React.ReactElement).props.color,
			})}
		</>
	);

	return process.env.EXPO_OS === 'android' ? (
		<Pressable
			android_ripple={{ color: '#eee' }}
			disabled={disabled}
			onPress={onPress}
			style={[styles.menuItem, style]}
		>
			{menuItemContent}
		</Pressable>
	) : (
		<TouchableOpacity
			activeOpacity={0.7}
			disabled={disabled}
			onPress={onPress}
			style={[styles.menuItem, style]}
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
import { IconChevronRight, IconExternalLink } from '@tabler/icons-react-native';

const makeStyles = ({
	systemBackground100,
	systemBackground200,
	systemBorder100,
	systemText100,
	systemText200,
	systemText300,
}: {
	systemBackground100: string
	systemBackground200: string
	systemBorder100: string
	systemText100: string
	systemText200: string
	systemText300: string
}) =>
	StyleSheet.create({
		bottomText: {
			color: systemText300,
			fontSize: 12,
			fontWeight: 500,
			marginTop: 2,
		},
		container: {},
		divider: {
			backgroundColor: systemBorder100,
			height: 1,
		},
		menuDescriptor: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 14,
			justifyContent: 'space-between',
		},
		menuItem: {
			alignItems: 'center',
			backgroundColor: systemBackground100,
			display: 'flex',
			flexDirection: 'row',
			gap: 8,
			justifyContent: 'space-between',
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		menuText: {
			color: systemText100,
			fontSize: 18,
			fontWeight: '700',
		},
		primaryDisabled: {
			color: '#9696A0',
		},
		secondaryDisabled: {
			color: '#D2D2DC',
		},
		sectionContent: {
			backgroundColor: systemBackground100,
			overflow: 'hidden',
		},
		sectionHeader: {
			color: systemText200,
			fontSize: 16,
			fontWeight: '600',
			marginLeft: 16,
			marginTop: 24,
		},
		sectionSubHeader: {
			color: systemText300,
			fontSize: 12,
			fontWeight: '500',
			marginBottom: 10,
			marginLeft: 16,
			width: '90%',
		},
		tertiaryDisabled: {
			color: '#F0F0F0',
		},
		textContainer: {
			flexDirection: 'column',
			justifyContent: 'center',
		},
		topText: {
			color: systemText300,
			fontSize: 12,
			fontWeight: 600,
			marginBottom: 2,
		},
	});

export default FullWidthList;
