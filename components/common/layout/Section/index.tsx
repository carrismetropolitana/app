/* * */
import { IconCaretRightFilled } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { useSectionStyles } from './styles';
/* * */

interface Props {
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

export function Section({ children, heading, href, subheading, target, variant = 'default', withBottomDivider, withGap, withPadding }: Props) {
	//

	//
	// A. Setup variables
	const sectionStyles = useSectionStyles();

	const styles = [
		// variant === 'default' && sectionStyles.stylesDefault,
		withBottomDivider && sectionStyles.withBottomDivider,
		withGap && sectionStyles.withGap,
		withPadding && sectionStyles.childrenWrapperWithPadding,
		// variant === 'default' && sectionStyles.stylesDefault,
		// variant === 'muted' && sectionStyles.stylesMuted,
		// variant === 'standout' && sectionStyles.stylesStandout,
		// variant === 'success' && sectionStyles.stylesSuccess,
		// variant === 'warning' && sectionStyles.stylesWarning,
	];
	const headerStyles = [
		withPadding && sectionStyles.headingWrapperWithPadding,
	];

	//
	// B. Render components

	return (
		<View data-with-padding-mobile={withPadding === true} style={[sectionStyles.container, styles]}>
			{(heading || subheading) && (
				<View style={[sectionStyles.headingWrapper, headerStyles]}>
					{heading && !href && <Text style={sectionStyles.heading}>{heading}</Text>}
					{heading && href && (
						<Link href={href} style={sectionStyles.href} target={target}>
							<Text style={sectionStyles.heading}>{heading}</Text>
							<IconCaretRightFilled size={18} style={sectionStyles.hrefIcon} />
						</Link>
					)}
					{subheading && <Text style={sectionStyles.subheading}>{subheading}</Text>}
				</View>
			)}

			{children && (
				<View style={sectionStyles.childrenWrapper}>
					{children}
				</View>
			)}

		</View>
	);

	//
}
