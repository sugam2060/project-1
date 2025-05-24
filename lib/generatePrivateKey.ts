import { v4 as uuidv4 } from "uuid";
export const  generatePrivateKey = (): string  => {
  const uuid = uuidv4().replace(/-/g, ''); // 32-character hex string
  const key = uuid.slice(0, 20); // use first 20 characters

  // Break into 5 blocks of 4 characters
  const blocks = key.match(/.{1,4}/g) || [];

  return blocks.join('-');
}