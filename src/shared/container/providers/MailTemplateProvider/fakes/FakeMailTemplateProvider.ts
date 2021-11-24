import IMailTemplateMailProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateMailProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeMailTemplateProvider;
