import aes from 'aes-js';
import IEncryptionProvider from '../models/IEncryptionProvider';

const key = aes.utils.utf8.toBytes(`${process.env.AES_KEY}`);



export default class AESEncryptionProvider implements IEncryptionProvider {
  public async encrypt(text: string): Promise<string> {
    const bytesInfo = aes.utils.utf8.toBytes(text);
    const aesCTR = new aes.ModeOfOperation.ctr(key);
    const encryptedBytes = aesCTR.encrypt(bytesInfo);
    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex;
  }

  public async decrypt(encryptedHex: string): Promise<string> {
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
    const aesCTR = new aes.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCTR.decrypt(encryptedBytes);
    const text = aes.utils.utf8.fromBytes(decryptedBytes);

    return text;
  }
}
