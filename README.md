
## 🚀 App Carris Metropolitana

#### Development

1. Run `npm i` to install required packages.
2. Run `npm run prebuild:clean` to generate Xcode and Android projects from the definitions in the `app.json` file.
3. Run `npm run dev:ios` or `npm run dev:android` (or both) to install the development apps in the phones. For iOS it is required a Developer Account.
4. Run `npm run dev` from then on to start the expo development server and push code to the installed apps.

---

#### Building and Submission

1. Run `npm run build:ios` or `npm run build:android` to generate compiled binaries for each platform.
2. Run `npm run publish:ios` or `npm run publish:android` to push those binaries to the stores using Expo EAS service.
