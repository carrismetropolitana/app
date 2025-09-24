import { IconCaretRightFilled } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import { Text, View, ViewProps } from 'react-native';

import { useSectionStyles } from './styles';

interface Props extends ViewProps {
	accessibilityHint?: string
	/** Acessibilidade extra */
	accessibilityLabel?: string
	accessibilityLanguage?: string
	children?: React.ReactNode
	heading?: string
	href?: string
	subheading?: string
	target?: '_blank' | '_self'
	variant?: 'default' | 'muted' | 'standout' | 'success' | 'warning'

	withBottomDivider?: boolean
	withGap?: boolean
	withPadding?: 'desktop' | 'mobile' | boolean
}

/* * */

export function Section({
	accessibilityHint,
	accessibilityLabel,
	accessibilityLanguage,
	children,
	heading,
	href,
	subheading,
	target,
	variant = 'default',
	withBottomDivider,
	withGap,
	withPadding,
	...rest
}: Props) {
	//
	// A. Setup variables
	const sectionStyles = useSectionStyles();

	const styles = [
		withBottomDivider && sectionStyles.withBottomDivider,
		withGap && sectionStyles.withGap,
		withPadding && sectionStyles.childrenWrapperWithPadding,
	];

	const headerStyles = [
		withPadding && sectionStyles.headingWrapperWithPadding,
	];

	//
	// B. Render components
	return (
		<View style={[sectionStyles.container, styles]} {...rest}>
			{(heading || subheading) && (
				<View
					accessibilityHint={accessibilityHint}
					accessibilityLabel={accessibilityLabel || heading}
					accessibilityLanguage={accessibilityLanguage}
					accessibilityRole="header"
					accessible={true}
					style={[sectionStyles.headingWrapper, headerStyles]}
				>
					{heading && !href && (
						<Text style={sectionStyles.heading}>{heading}</Text>
					)}
					{heading && href && (
						<Link href={href} style={sectionStyles.href} target={target}>
							<Text style={sectionStyles.heading}>{heading}</Text>
							<IconCaretRightFilled size={18} style={sectionStyles.hrefIcon} />
						</Link>
					)}
					{subheading && (
						<Text style={sectionStyles.subheading}>{subheading}</Text>
					)}
				</View>
			)}
			{children && (
				<View style={sectionStyles.childrenWrapper}>{children}</View>
			)}
		</View>
	);
}
