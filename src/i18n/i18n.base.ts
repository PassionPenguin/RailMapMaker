import { Locale } from '@types';

export type Dictionary = Record<Locale, Record<string, string>>;

export interface I18n<TKeys extends string = string> {
  dictionary: Dictionary;
  defaultLocale: Locale;
  localeNames: Record<Locale, string>;
  locales: Locale[];
  t: (key: TKeys, locale?: Locale, fallback?: string) => string;
  translate: (key: TKeys, locale?: Locale, fallback?: string) => string;
}

export function buildI18n<TKeys extends string>(
  dictionary: Dictionary,
  defaultLocale: Locale,
  localeNames: Record<Locale, string>
): I18n<TKeys> {
  const locales = Object.keys(dictionary) as Locale[];
  const translate = (key: TKeys, locale: Locale = defaultLocale, fallback?: string) => {
    const active = dictionary[locale] ?? dictionary[defaultLocale];
    return active?.[key] ?? dictionary[defaultLocale]?.[key] ?? fallback ?? key;
  };

  return { dictionary, defaultLocale, localeNames, locales, t: translate, translate };
}
