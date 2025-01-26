import pytest
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from pages.main_page import MainPage
from pages.product_page import ProductPage
from pages.basket_page import BasketPage
import time

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

@pytest.fixture(scope="class")
def setup(request):
    chrome_options = Options()
    chrome_options.add_argument("--disable-notifications")
    
    driver = webdriver.Chrome(service=Service("C:\AllMine\Labs\тестирование\chromedriver.exe"), options=chrome_options)
    driver.implicitly_wait(10)
    request.cls.driver = driver
    request.cls.main_page = MainPage(driver)
    request.cls.product_page = ProductPage(driver)
    request.cls.cart_page = BasketPage(driver)
    yield
    driver.quit()

@pytest.mark.parametrize("language, search_term", [
    ("ru", "Кроссовки"),
    ("global", "Sneakers"),
])
class TestWildberries:

    @pytest.mark.skip(reason="Этот тест пропущен для примера.")
    def test_skip_example(self, language, search_term):
        assert True  # Пример пропуска теста

    def test_search_and_add_to_cart(self, language, search_term, setup):
        urls = {
            "ru": 'https://wildberries.by/',
            "global": 'https://www.wildberries.ru/'
        }
        url = urls.get(language)
        self.driver.get(url)
        logger.info(f"Открытие URL: {url}")

        # Закрытие уведомлений
        self.main_page.close_notification()

        # Поиск товара
        self.main_page.search_for(search_term)

        # Выбор и добавление товара в корзину
        self.product_page.click_first_product()
        self.product_page.select_size_and_add_to_cart()
        logger.info("Товар добавлен в корзину")

        # Проверка наличия товара в корзине
        self.driver.get(url + 'lk/basket')
        logger.info("Переход на страницу корзины")
        cart_items = self.cart_page.get_cart_items()
        #assert any(search_term in item.text for item in cart_items), f"{search_term} не добавлены в корзину"
        assert search_term in cart_items.text, f"{search_term} не добавлены в корзину"
        logger.info("Товар проверен в корзине")

        # Сохранение скриншота
        self.driver.save_screenshot(f"{search_term}_adding_to_basket.png")
        logger.info(f"Скриншот сохранен: {search_term}_adding_to_basket.png")

        # Работа с куками
        cookies = self.driver.get_cookies()
        logger.info("Куки: %s", cookies)

if __name__ == "__main__":
    pytest.main()
