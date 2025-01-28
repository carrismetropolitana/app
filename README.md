# Carris Metropolitana Mobile App Monorepo

In lieu of better maintaining feature parity between Android and iOS, CMetropolitana's app is being progressively migrated to React Native.

To achieve a relatively smooth transition, the transition process will begin by maintaining both current native apps as brownfield apps, progressively rewriting views to be presented with React Native.

## React Native Architecture

-   Zustand: for client state management
-   TanStack Query: for server state management on the client
-   New arch
-   Bundling with Hermes

## Build instructions

Each native app loads the JS bundle to present RN views — therefore the jsbundle must be compiled before the native apps.
