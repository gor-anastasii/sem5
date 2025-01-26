from selenium.webdriver.common.by import By
from .base_page import BasePage

class BasketPage(BasePage):
    CART_ITEMS = (By.CLASS_NAME, "list-item__good")

    def get_cart_items(self):
        return self.find_element(*self.CART_ITEMS)
