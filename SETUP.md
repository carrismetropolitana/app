### LOCAL SETUP

`npm i`


Copy the required environment files:
- For Android, copy to the `/android` folder: `google-services.json`
- For iOS copy to the `/ios` folder: `GoogleService-Info.plist`

`npm install`

For Android, no further actions required.

For iOS: `cd ios && npx pod-install`

`cd ..`

To run on a physical device or an emulator (it shows a list of devices including emulators for you to choose): 
`npm run ios`

`npm run android`
