export default interface IEncryptionProvider {
  encrypt(text: string | undefined): Promise<string>;
  decrypt(encryptedHex: string): Promise<string>;
}
