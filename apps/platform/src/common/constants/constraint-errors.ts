import { I18nTranslations } from '../../generated/i18n.generated';

type ErrorKeys = {
  [K in keyof I18nTranslations]: K;
}[keyof I18nTranslations];

export const constraintErrors: Record<string, ErrorKeys> = {
  UQ_user_username: 'error.unique.username' as ErrorKeys,
  UQ_user_email: 'error.unique.email' as ErrorKeys,
};
