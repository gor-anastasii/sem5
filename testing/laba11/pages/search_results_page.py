from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage
import time

class SearchResultsPage(BasePage):
    RESULTS = (By.CSS_SELECTOR, '.j-card-link')
    ADD_TO_CART_BUTTON = (By.CSS_SELECTOR, 'button.order__button.btn-main')
    CART = (By.CSS_SELECTOR, '.j-b-basket-item')

    def click_first_result(self):
        results = self.driver.find_elements(*self.RESULTS)
        if results:
            self.driver.execute_script("arguments[0].scrollIntoView();", results[0])
            results[0].click()
        else:
            raise Exception('Товары не найдены.')

    def add_to_cart(self):
        add_to_cart_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(self.ADD_TO_CART_BUTTON)
        )
        add_to_cart_button.click()
        
        WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, '.success-message-selector'))  # замените селектор
        )

    def result_add_to_cart(self):
        self.driver.get('https://www.wildberries.by/lk/basket')
        print('Подсчет элементов в корзине')
        cart_items = WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.CART)
        )
        
        assert len(cart_items) > 0, "Корзина пуста, элементы не были добавлены!"
        print("Элементы успешно добавлены!")