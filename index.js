import { AppRegistry } from "react-native";
import App from "./App";
import MoreScreen from "./components/screens/MoreScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

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
    withSafeAreaProvider(withQueryClientProvider(MoreScreen))
);

// AppRegistry.registerComponent("HelloWorld", () => App);
// AppRegistry.registerComponent("MoreScreen", () => (
//     <QueryClientProvider client={queryClient}>
//         <MoreScreen />
//     </QueryClientProvider>
// ));
