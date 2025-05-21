/* * */

import { FAB } from "@rn-vui/themed"
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { Routes } from "@/utils/routes";
import { IconAlertTriangleFilled } from "@tabler/icons-react-native";
import { useThemeContext } from "@/contexts/Theme.context";
import { theming } from "@/theme/Variables";
import { useTranslation } from "react-i18next";

/* * */

export default function NetworkOfflineBanner() {
    //

    //A. Setup variables
    const themeContext = useThemeContext();
    const { t } = useTranslation('translation', { keyPrefix: 'common.offlineBanner' });
    const [visible, setVisible] = useState(false);
    const networkOfflineStyles = styles();
    const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundLight100;

    //
    //B. Transform data

    const handleNetworkStatus = () => {
        fetch(Routes.API_ACCOUNTS, { method: 'HEAD' })
            .then(response => {
                const isOnline = response.status === 200 || response.status === 403 || response.status === 401 || response.status === 500;
                isOnline ? setVisible(false) : setVisible(true);
            })
            .catch(() => {
                setVisible(false);
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
            title={t("message")}
            icon={<IconAlertTriangleFilled fill={backgroundColor} size={22} />}
        />
    )

}
