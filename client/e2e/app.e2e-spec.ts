import { FintAdminportalPage } from './app.po';

describe('fint-adminportal App', function() {
  let page: FintAdminportalPage;

  beforeEach(() => {
    page = new FintAdminportalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
