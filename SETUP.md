### LOCAL SETUP

`npm i`


Copy the required environment files:
- For Android, copy to the `/android` folder: `google-services.json`
- For iOS copy to the `/ios` folder: `Info.plist`

`npx expo prebuild`

For Android, no further actions required.

For iOS: `cd ios && npx pod-install`

`cd ..`

`npm run ios`

`npm run android`