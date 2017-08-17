import { EduChangeDetectionPage } from './app.po';

describe('edu-change-detection App', () => {
  let page: EduChangeDetectionPage;

  beforeEach(() => {
    page = new EduChangeDetectionPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
