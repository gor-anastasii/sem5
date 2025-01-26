from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

from .base_page import BasePage

class ProductPage(BasePage):
    PRODUCT_LINK = (By.CLASS_NAME, "product-card__link")
    ADD_TO_CART_BUTTON = (By.XPATH, "/html/body/div[1]/main/div[2]/div/div[3]/div/div[3]/div[12]/div[2]/div/div/div/button")
    SIZE_BUTTON = (By.CLASS_NAME, "sizes-list__button")
    POPUP_SIZE_LIST = (By.CLASS_NAME, "popup-list-of-sizes")

    def click_first_product(self):
        self.wait_for_element(20, EC.visibility_of_element_located(self.PRODUCT_LINK)).click()

    def select_size_and_add_to_cart(self):
        self.click_element(*self.SIZE_BUTTON)
        self.driver.execute_script("arguments[0].scrollIntoView();", self.find_element(*self.ADD_TO_CART_BUTTON))
        self.click_element(*self.ADD_TO_CART_BUTTON)
        
        try:
            self.wait_for_element(5, EC.visibility_of_element_located(self.POPUP_SIZE_LIST))
            self.click_element(*self.SIZE_BUTTON)
        except Exception:
            pass
