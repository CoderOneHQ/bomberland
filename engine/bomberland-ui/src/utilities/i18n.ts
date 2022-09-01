import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";

const resources = {
    en: {
        translation: en,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: ["en"],

    keySeparator: ".",

    interpolation: {
        escapeValue: false,
    },
});
