import { FintAdminportalMockupsPage } from './app.po';

describe('fint-adminportal-mockups App', function() {
  let page: FintAdminportalMockupsPage;

  beforeEach(() => {
    page = new FintAdminportalMockupsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
