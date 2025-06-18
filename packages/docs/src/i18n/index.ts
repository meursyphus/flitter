export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_LIST: { title: string; locale: string }[] = [
  {
    title: "English",
    locale: "en",
  },
  {
    title: "한국어",
    locale: "ko",
  },
  {
    title: "简体中文",
    locale: "zh-cn",
  },
  {
    title: "日本語",
    locale: "ja",
  },
  {
    title: "Français",
    locale: "fr",
  },
];

export const SUPPORTED_LANGUAGES = LANGUAGE_LIST.map(
  (language) => language.locale,
);
