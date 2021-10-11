import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string, folder: string): Promise<string> {
    this.storage.push(folder, file);

    return file;
  }

  public async saveLink(
    link: string,
    fileName: string,
  ): Promise<string> {
    this.storage.push(link, fileName);

    return link;
  }

  public async deleteFile(file: string, folder: string): Promise<void> {
    const findFolder = this.storage.filter(
      storageFolder => storageFolder === folder,
    );

    const findIndex = this.storage.findIndex(
      async storageIndex =>
        storageIndex === file &&
        findFolder?.filter(storageFolder => storageFolder === folder),
    );

    this.storage.splice(findIndex, 1);
  }
}

export default FakeStorageProvider;
