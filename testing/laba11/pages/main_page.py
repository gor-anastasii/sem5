from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage

class MainPage(BasePage):
    SEARCH_INPUT = (By.CSS_SELECTOR, 'input#searchInput')
    AUTOCOMPLETE_SUGGESTION = (By.CSS_SELECTOR, '.autocomplete__text')

    def search(self, query):
        search_box = self.wait_for_element(*self.SEARCH_INPUT)
        search_box.click()
        search_box.clear()
        search_box.send_keys(query)

        WebDriverWait(self.driver, 10).until(
            EC.invisibility_of_element_located((By.CSS_SELECTOR, '.overlay--search'))
        )
        
        self.wait_for_element(*self.AUTOCOMPLETE_SUGGESTION).click()