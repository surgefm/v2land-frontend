import { Rule } from 'rc-field-form/lib/interface';

import { RedstoneService } from '@Services';

export const Rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 2, message: '用户名不得短于 2 个字符' },
    { max: 16, message: '用户名不得长于 16 个字符' },
    { whitespace: true, message: '用户名不得含有空格' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名不得含有除 a-z，A-Z，0-9 外的字符' },
    {
      async validator(rule, value) {
        if (value && +value === +value) return Promise.reject(new Error('用户名不得全为数字'));
        try {
          await RedstoneService.getClient(value);
          return Promise.reject(new Error('该用户名已被占用'));
        } catch (err) {
          return Promise.resolve();
        }
      },
    },
  ] as Rule[],

  nickname: [
    { required: true, message: '请输入昵称' },
    { min: 2, message: '昵称不得短于 2 个字符' },
    { max: 16, message: '昵称不得长于 16 个字符' },
    { pattern: /^[^@|%|\r]+$/, message: '昵称不得含有 @ 或 %。' },
    {
      validator(rule, value) {
        if (value && +value === +value) return Promise.reject(new Error('用户名不得全为数字'));
        return Promise.resolve();
      },
    },
  ] as Rule[],

  email: [
    { required: true, message: '请输入邮箱地址' },
    { type: 'email', message: '请输入正确的邮箱地址' },
  ] as Rule[],

  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码不得短于 6 个字符' },
    { max: 32, message: '密码不得长于 32 个字符' },
  ] as Rule[],
};
