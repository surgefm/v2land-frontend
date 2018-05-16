const timeout = 30000;

describe(
  '/ (Home Page)',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.goto('http://localhost:3000');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('should load without error', async () => {
      const text = await page.evaluate(
        () => document.head.title.textContent,
      );
      expect(text).toContain('浪潮');
    });
  },
  timeout,
);
