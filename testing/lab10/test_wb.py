import pytest
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

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
    yield
    driver.quit()

@pytest.mark.parametrize("language, search_term", [
    ("ru", "Кроссовки"),
    ("global", "Sneakers"),
])

class TestWildberries:

    @pytest.mark.skip(reason="Этот тест пропущен")
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
        try:
            close_btn = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, "/html/body/div[4]/div/div/button[1]"))
            )
            close_btn.click()
            logger.info("Уведомление закрыто")
        except Exception as e:
            logger.error(f"Ошибка при закрытии уведомлений: {e}")

        # Поиск товара
        try:
            search_box = self.driver.find_element(By.CSS_SELECTOR, "#searchInput")
            search_box.send_keys(search_term)
            search_box.send_keys(Keys.RETURN)
            logger.info(f"Поиск товара: {search_term}")
        except Exception as e:
            logger.error(f"Ошибка при вводе поискового запроса: {e}")

        # Ожидание результатов поиска
        try:
            product_link = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "product-card__link"))
            )
            product_link.click()
            logger.info("Товар найден и открыт")
        except Exception as e:
            logger.error(f"Ошибка при ожидании элемента: {e}")

        # Добавление в корзину
        try:
            add_to_cart_button = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/main/div[2]/div/div[3]/div/div[3]/div[12]/div[2]/div/div/div/button"))
            )
            self.driver.execute_script("arguments[0].scrollIntoView();", add_to_cart_button)
            add_to_cart_button.click()
            logger.info("Товар добавлен в корзину")

            # Проверка всплывающего окна размеров
            try:
                popup = WebDriverWait(self.driver, 5).until(
                    EC.visibility_of_element_located((By.CLASS_NAME, "popup-list-of-sizes"))
                )
                # Нажатие на элемент размера
                size_button = WebDriverWait(self.driver, 20).until(
                    EC.element_to_be_clickable((By.CLASS_NAME, "sizes-list__button"))
                )
                size_button.click()
                logger.info("Элемент размера выбран из всплывающего окна")
            except Exception as e:
                logger.info("Size already chosen:", e)

        except Exception as e:
            logger.error(f"Ошибка при добавлении в корзину: {e}")

        # Проверка наличия товара в корзине
        self.driver.get(url + 'lk/basket')
        logger.info("Переход на страницу корзины")
        try:
            cart_items = self.driver.find_elements(By.CLASS_NAME, "list-item__good")
            assert any(search_term in item.text for item in cart_items), f"{search_term} не добавлены в корзину"
            logger.info("Товар проверен в корзине")
        except Exception as e:
            logger.error(f"Ошибка при проверке корзины: {e}")

        # Сохранение скриншота
        self.driver.save_screenshot(f"{search_term}_adding_to_basket.png")
        logger.info(f"Скриншот сохранен: {search_term}_adding_to_basket.png")

        # Работа с куками
        cookies = self.driver.get_cookies()
        logger.info("Куки: %s", cookies)

if __name__ == "__main__":
    pytest.main()
