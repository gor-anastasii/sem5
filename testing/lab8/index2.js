const { Builder, By, until } = require('selenium-webdriver');

(async function loginToSwagLabs() {
    let driver = await new Builder().forBrowser('chrome').build();

    console.log('Драйвер создан');
    try {
        await driver.get('https://www.saucedemo.com/');
        console.log('Сайт открыт');

        // Находим поле ввода логина и вводим логин
        const usernameField = await driver.findElement(By.id('user-name'));
        await usernameField.sendKeys('standard_user');
        console.log('Логин введен');

        // Находим поле ввода пароля и вводим пароль
        const passwordField = await driver.findElement(By.id('password'));
        await passwordField.sendKeys('secret_sauce');
        console.log('Пароль введен');

        // Находим кнопку входа и кликаем по ней
        const loginButton = await driver.findElement(By.css('input[type="submit"]'));
        await loginButton.click();
        console.log('Кнопка входа нажата');

        // Ожидаем загрузки страницы после входа
        await driver.wait(until.urlContains('inventory.html'), 5000);
        console.log('Успешный вход в систему');
        
        await driver.sleep(5000)

    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        await driver.quit();
        console.log('Драйвер закрыт');
    }
})();