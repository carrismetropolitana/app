import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import useThemedCMColor from "../../hooks/useThemedCMColor";
import { Linking } from "react-native";

export default function FullScreenWebView({ navigation, route }) {
    useEffect(() => {
        navigation.setOptions({
            title: route.params.title,
        });
    }, []);

    return (
        <WebView
            source={{ uri: route.params.url }}
            decelerationRate="normal"
            contentInsetAdjustmentBehavior="automatic"
            style={{
                flex: 1,
                backgroundColor: useThemedCMColor("systemBackground200"),
            }}
            // injectedJavaScript="document.querySelector('h1').remove();true;"
            // onMessage={(event) => {}}
            // ref={() => {}}
            onShouldStartLoadWithRequest={(event) => {
                if (
                    event.url !== route.params.url &&
                    !route.params.openExternalLinksInWebView // "defaults" to false
                ) {
                    Linking.openURL(event.url);
                    return false;
                }
                return true;
            }}
        />
    );
}
