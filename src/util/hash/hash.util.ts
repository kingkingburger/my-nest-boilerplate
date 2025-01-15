import * as crypto from 'crypto';

/**
 * Node.js 기본 crypto 모듈의 pbkdf2 함수를 이용해 비밀번호를 해싱해요.
 * 반복 횟수, 해시 알고리즘 등은 필요에 따라 조정할 수 있어요.
 */
export const hashUtil = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString('hex');

  // 반복 횟수, 해시 길이, 알고리즘은 상황에 따라 조정해 주세요.
  const iterations = 310000;
  const keylen = 64;
  const digest = 'sha512';

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest,
      (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          // 해싱된 비밀번호와 salt를 함께 저장할 수도 있고, 필요하다면 구분자를 사용해 합쳐서 저장해도 돼요.
          const hashed = `${salt}:${derivedKey.toString('hex')}`;
          resolve(hashed);
        }
      },
    );
  });
};
