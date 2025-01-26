from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

from .base_page import BasePage

class MainPage(BasePage):
    SEARCH_INPUT = (By.CSS_SELECTOR, "#searchInput")
    NOTIFICATION_CLOSE_BTN = (By.XPATH, "/html/body/div[4]/div/div/button[1]")

    def close_notification(self):
        self.click_element(*self.NOTIFICATION_CLOSE_BTN)
        time.sleep(3)

    def search_for(self, term):
        search_box = self.find_element(*self.SEARCH_INPUT)
        search_box.send_keys(term)
        search_box.send_keys(Keys.RETURN)
        search_box.send_keys(Keys.RETURN)
        time.sleep(3)
