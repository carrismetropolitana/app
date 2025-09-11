### LOCAL SETUP

Run `npm i`

Copy the required environment files:
- For Android, copy to the `/android` folder: `google-services-prod.json`
- For iOS copy to the `/ios` folder: `GoogleService-Info.plist`

`npm install`

#### For Android:

Copy "CarrisMetropolitanaAndroidKeystore.keystore" to `/android/app/src`

Copy the required keys (keystore) to the end of `/android/gradle.properties`

Check if on `/android/app/build.gradle` the buidToolsVersion, compileSdkVersion and targetSdkVersion is the latest that google allows (at the time is 35)

For android no more steps are needed.

#### For iOS:

Add this lines to Podfile under line 10 (where deployment target is set):

pod 'Firebase', :modular_headers => true
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true

`npm run ios-setup`

To run on a physical device or an emulator (it shows a list of devices including emulators for you to choose):

IOS: `npm run ios`

Android: `npm run android`

