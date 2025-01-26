const { Builder, By, until } = require('selenium-webdriver');

(async function searchProductOnWildberries() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://www.wildberries.by/');
        console.log('Сайт открыт');

        console.log("Тест 1")
        const searchField = await driver.findElement(By.css('input#searchInput'));
        await searchField.click();
        await driver.sleep(1000);

        await searchField.sendKeys('кроссовки');
        await driver.sleep(1000);  

        await driver.wait(until.elementLocated(By.css('.autocomplete__text')), 5000);
        const firstSuggestion = await driver.wait(until.elementIsVisible(driver.findElement(By.css('.autocomplete__text'))), 5000);
        await firstSuggestion.click();
        await driver.sleep(2000); 

        for (let i = 0; i < 2; i++) {
            await driver.executeScript("window.scrollBy(0, 1000);");
            await driver.sleep(1000);
        }

        await searchField.clear();

        console.log('Тест 2')
        await searchField.sendKeys('футболка оверсайз');
        await driver.sleep(1000); 

        await driver.wait(until.elementLocated(By.css('.autocomplete__text')), 5000);
        const secondSuggestion = await driver.wait(until.elementIsVisible(driver.findElement(By.css('.autocomplete__text'))), 5000);
        await secondSuggestion.click();
        await driver.sleep(2000); 

        await searchField.clear();

        console.log('Тест 3')
        await searchField.sendKeys('маркеры');
        await driver.sleep(1000);

        const suggestions = await driver.wait(until.elementsLocated(By.css('.autocomplete__text')), 5000);
        const lastSuggestion = suggestions[suggestions.length - 1]; 

        await driver.wait(until.elementIsVisible(lastSuggestion), 5000);
        await lastSuggestion.click();
        await driver.sleep(2000);

        const results = await driver.findElements(By.css('.j-card-link'));
        if (results.length > 0) {
            await driver.executeScript("arguments[0].scrollIntoView();", results[0]); 
            await driver.sleep(1000); 

            await results[0].click();
            await driver.sleep(2000); 

            const addToCartButton = await driver.wait(until.elementLocated(By.css('button.order__button.btn-main')), 10000);
            await driver.executeScript("arguments[0].scrollIntoView();", addToCartButton); 
            await driver.wait(until.elementIsVisible(addToCartButton), 8000);

            await driver.executeScript("arguments[0].click();", addToCartButton);
            await driver.sleep(5000);

        } else {
            console.log('Товары не найдены.');
        }

        console.log('Тест 4')
        await searchField.clear();
        await searchField.sendKeys('топпинг');
        await driver.sleep(1000);

        const suggestions2 = await driver.wait(until.elementsLocated(By.css('.autocomplete__text')), 5000);
        const lastSuggestion2 = suggestions2[2]; 

        await driver.wait(until.elementIsVisible(lastSuggestion2), 5000);
        await lastSuggestion2.click();
        await driver.sleep(2000);

        // const results2 = await driver.findElements(By.css('.j-card-link'));
        // if (results.length > 0) {
        //     await driver.executeScript("arguments[0].scrollIntoView();", results2[0]); 
        //     await driver.sleep(1000); 

        //     await results2[0].click();
        //     await driver.sleep(2000); 

        //     const addToCartButton = await driver.wait(until.elementLocated(By.css('button.order__button.btn-main')), 10000);
        //     await driver.executeScript("arguments[0].scrollIntoView();", addToCartButton); 
        //     await driver.wait(until.elementIsVisible(addToCartButton), 8000);

        //     await driver.executeScript("arguments[0].click();", addToCartButton);
        //     await driver.sleep(5000);

        //     await driver.get('https://www.wildberries.by/lk/basket');
        //     await driver.sleep(8000);
        // } else {
        //     console.log('Товары не найдены.');
        // }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        await driver.quit();
        console.log('Драйвер закрыт');
    }
})();