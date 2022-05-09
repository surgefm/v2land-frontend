import { Rule } from 'rc-field-form/lib/interface';

import { RedstoneService } from '@Services';
import { TFunction } from 'next-i18next';

type RulesProps = {
  username?: string;
};

export const Rules = (t: TFunction, { username }: RulesProps = {}) => {
  return {
    username: [
      { required: true, message: t('Registration_Username_empty') },
      { min: 2, message: t('Registration_Username_min_length') },
      { max: 16, message: t('Registration_Username_max_length') },
      { whitespace: true, message: t('Registration_Username_no_space') },
      { pattern: /^[a-zA-Z0-9]+$/, message: t('Registration_Username_no_special_character') },
      {
        validator(rule, value) {
          const forbiddenUsernameSet: Set<string> = new Set<string>([
            'event',
            'topic',
            'register',
            'login',
            'logout',
            'about',
            'dashboard',
            'trending',
            'topics',
            'settings',
            'signup',
          ]);
          if (forbiddenUsernameSet.has(value))
            return Promise.reject(new Error(t('Registration_Username_not_forbidden')));

          return Promise.resolve();
        },
      },
      {
        async validator(rule, value) {
          if (value && +value === +value)
            return Promise.reject(new Error(t('Registration_Username_not_all_num')));
          if (value === username) {
            return Promise.resolve();
          }
          try {
            await RedstoneService.getClient(value);
            return Promise.reject(new Error(t('Registration_Username_used')));
          } catch (err) {
            return Promise.resolve();
          }
        },
      },
    ] as Rule[],

    nickname: [
      { required: true, message: t('Registration_Nickname_empty') },
      { min: 2, message: t('Registration_Nickname_min_length') },
      { max: 16, message: t('Registration_Nickname_max_length') },
      { pattern: /^[^@|%|\r]+$/, message: t('Registration_Nickname_invalid') },
      {
        validator(rule, value) {
          if (value && +value === +value)
            return Promise.reject(new Error(t('Registration_Nickname_not_all_num')));
          return Promise.resolve();
        },
      },
    ] as Rule[],

    email: [
      { required: true, message: t('Registration_Email_empty') },
      { type: 'email', message: t('Registration_Email_invalid') },
    ] as Rule[],

    password: [
      { required: true, message: t('Registration_Password_empty') },
      { min: 6, message: t('Registration_Password_min_length') },
      { max: 32, message: t('Registration_Password_max_length') },
      {
        async validator(rule, value) {
          return value.match(/[A-z]/i) && value.match(/[0-9]/)
            ? Promise.resolve()
            : Promise.reject(new Error(t('Registration_Password_should_num_letter_mix')));
        },
      },
    ] as Rule[],
  };
};
