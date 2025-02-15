import { AppRegistry, useColorScheme } from "react-native";
import App from "./App";
import MoreScreen from "./components/screens/MoreScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FullScreenWebView from "./components/screens/FullScreenWebView";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import { View } from "react-native";
import { CMColors } from "./constants/CMColors";
import useThemedCMColor from "./hooks/useThemedCMColor";

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

const CMNavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: CMColors.light.systemBackground200,
        primary: CMColors.static.brandYellow,
        text: CMColors.light.systemText100,
    },
};

const CMDarkNavigationTheme = {
    ...DarkTheme,
    colors: {
        ...DefaultTheme.colors,
        background: CMColors.dark.systemBackground200,
        primary: CMColors.static.brandYellow,
        text: CMColors.dark.systemText100,
    },
};

const NativeNavigationStack = () => (
    <NavigationContainer
        theme={
            useColorScheme() === "dark"
                ? CMDarkNavigationTheme
                : CMNavigationTheme
        }
    >
        <Stack.Navigator>
            <Stack.Screen
                name="Mais"
                component={MoreScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="FullScreenWebView"
                component={FullScreenWebView}
                options={{
                    headerStyle: {
                        backgroundColor: useThemedCMColor(
                            "systemBackground200"
                        ),
                    },
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontSize: 26,
                    },
                    headerLargeTitleShadowVisible: false,
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

function withQueryClientProvider(Component) {
    return function WrappedComponent(props) {
        return (
            <QueryClientProvider client={queryClient}>
                <Component {...props} />
            </QueryClientProvider>
        );
    };
}

function withSafeAreaProvider(Component) {
    return function WrappedComponent(props) {
        return (
            <SafeAreaProvider>
                <Component {...props} />
            </SafeAreaProvider>
        );
    };
}

AppRegistry.registerComponent("HelloWorld", () => withQueryClientProvider(App));
AppRegistry.registerComponent("MoreScreen", () =>
    withSafeAreaProvider(withQueryClientProvider(NativeNavigationStack))
);

// AppRegistry.registerComponent("HelloWorld", () => App);
// AppRegistry.registerComponent("MoreScreen", () => (
//     <QueryClientProvider client={queryClient}>
//         <MoreScreen />
//     </QueryClientProvider>
// ));
