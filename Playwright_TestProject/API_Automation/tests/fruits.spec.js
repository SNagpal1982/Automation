import {test, expect} from '@playwright/test';

const url = "https://demo.playwright.dev/api-mocking/api/v1/fruits";
test('Get fruits list', async ({request}) => {

    // const url = "https://demo.playwright.dev/api-mocking/api/v1/fruits";
    const response = await request.get(url);
    await expect(response.status()).toBe(200);
    const responseData = await response.json();    
    console.log(JSON.stringify(responseData));
    const fruiteName = responseData.map(fruit => fruit.name);
    await expect(fruiteName).toContain("Apple");

});

test.only('gets the json from api and adds a new fruit', async ({ page }) => {
  // Get the response and add to it
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Mocked Fruit', id: 100 });
    // Fulfill using the original response, while patching the response body
    // with the given JSON object.
    await route.fulfill({ response, json });
  });

  // Go to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // Assert that the new fruit is visible
  await expect(page.getByText('Mocked Fruit', { exact: true })).toBeVisible();
});