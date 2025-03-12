import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./translations/en.json";
import translationPt from "./translations/pt.json";

const resources = {
  "pt": { translation: translationPt },
  "en": { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  // if (!savedLanguage) {
  //   savedLanguage = Localization.locale;
  // }

  i18n.use(initReactI18next).init({
    resources,
    lng: 'pt',
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;