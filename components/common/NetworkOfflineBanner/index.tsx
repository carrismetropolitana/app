/* * */

import { FAB } from "@rn-vui/themed"
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { Routes } from "@/utils/routes";
import { IconAlertTriangleFilled } from "@tabler/icons-react-native";
import { useThemeContext } from "@/contexts/Theme.context";
import { theming } from "@/theme/Variables";

/* * */

export default function NetworkOfflineBanner() {
    //

    //A. Setup variables
    const themeContext = useThemeContext();
    const [visible, setVisible] = useState(false);
    const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundLight100;
    const networkOfflineStyles = styles();

    //
    //B. Transform data

    const handleNetworkStatus = () => {
        fetch(Routes.DEV_API_ACCOUNTS, { method: 'HEAD' })
            .then(response => {
                setVisible(!response.ok);
                console.log('Network is online');
            })
            .catch(() => {
                setVisible(true);
            });
    }

    useEffect(() => {
        handleNetworkStatus();
        const interval = setInterval(handleNetworkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    //
    // C. Render components
    return (

        <FAB
            style={networkOfflineStyles.fab}
            disabled
            disabledStyle={networkOfflineStyles.fabButton}
            disabledTitleStyle={networkOfflineStyles.fabButtonTitle}
            visible={visible}
            size="small"
            title="Network Offline"
            icon={<IconAlertTriangleFilled fill={backgroundColor} size={18} />}
        />

    )

}
