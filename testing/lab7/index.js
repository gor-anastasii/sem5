const { Builder, By, until } = require('selenium-webdriver');

(async function testing() {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {

        await driver.get('https://www.wikipedia.org');

        const cssSelector1 = await driver.findElement(By.css('input#searchInput'));
        console.log('Элемент найден по CSS-селектору 1:\n', await cssSelector1.getAttribute('outerHTML'));

        const cssSelector2 = await driver.findElement(By.css('button[type="submit"]'));
        console.log('\n\nЭлемент найден по CSS-селектору 2:\n', await cssSelector2.getAttribute('outerHTML'));

        const cssSelector3 = await driver.findElement(By.css('.central-featured'));
        console.log('\n\nЭлемент найден по CSS-селектору 3:\n', await cssSelector3.getAttribute('outerHTML'));


        const xpath1 = await driver.findElement(By.xpath('//h1'));
        console.log('\n\nЭлемент найден по XPath 1:\n', await xpath1.getAttribute('outerHTML'));

        const xpath2 = await driver.findElement(By.xpath('//button[@type="submit"]'));
        console.log('\n\nЭлемент найден по XPath 2:\n', await xpath2.getAttribute('outerHTML'));

        const xpath3 = await driver.findElement(By.xpath('//select[@id="searchLanguage"]'));
        console.log('\n\nЭлемент найден по XPath 3:\n', await xpath3.getAttribute('outerHTML'));


        const tagElement = await driver.findElement(By.tagName('h1'));
        console.log('\n\nЭлемент найден по тегу:\n', await tagElement.getAttribute('outerHTML'));

        const partialLinkText = await driver.findElement(By.partialLinkText('English'));
        console.log('\n\nЭлемент найден по частичному тексту ссылки:\n', await partialLinkText.getAttribute('outerHTML'));

    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        await driver.quit();
    }
})()