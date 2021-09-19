export default interface IStorageProvider {
  saveLink(link: string, folder: string, fileName: string): Promise<string>;
  saveFile(file: string, folder: string): Promise<string>;
  deleteFile(file: string, folder: string): Promise<void>;
}
