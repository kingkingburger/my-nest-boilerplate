// hash.util.ts

import * as crypto from 'crypto';

/**
 * Node.js 기본 crypto 모듈의 pbkdf2 함수를 이용해 비밀번호를 해싱해요.
 * @param password 해싱할 평문 비밀번호
 * @param salt 이미 생성된 salt가 있다면 재사용하고, 없다면 새로 생성해요.
 * @returns "salt:derivedKey" 형태의 문자열
 *
 * 참고: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback
 */
export const hashUtil = async (
  password: string,
  salt?: string,
): Promise<string> => {
  // 전달된 salt가 없으면 새로 생성해요.
  const currentSalt = salt ?? crypto.randomBytes(16).toString('hex');
  const iterations = 310000;
  const keylen = 64;
  const digest = 'sha512';

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      currentSalt,
      iterations,
      keylen,
      digest,
      (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          // "salt:derivedKey" 형태로 반환해요.
          const hashed = `${currentSalt}:${derivedKey.toString('hex')}`;
          resolve(hashed);
        }
      },
    );
  });
};

/**
 * 입력받은 패스워드를 다시 해싱해서
 * DB에 저장된 해싱 패스워드와 일치하는지 확인해요.
 * @param plainPassword 입력받은 평문 비밀번호
 * @param storedHashedPassword "salt:derivedKey" 형태로 저장된 비밀번호
 * @returns 비밀번호가 일치하면 true, 그렇지 않으면 false
 */
export const verifyPassword = async (
  plainPassword: string,
  storedHashedPassword: string,
): Promise<boolean> => {
  // DB에 저장된 해시값("salt:derivedKey" 형태)을 해석해요.
  const [storedSalt, storedDerivedKey] = storedHashedPassword.split(':');

  // plainPassword를 동일한 salt로 해싱
  const hashedInputPassword = await hashUtil(plainPassword, storedSalt);

  // hashedInputPassword 역시 "salt:derivedKey" 형태이므로
  const [, derivedKeyOfInput] = hashedInputPassword.split(':');

  // derivedKey 부분을 비교해 일치하는지 확인
  return derivedKeyOfInput === storedDerivedKey;
};
