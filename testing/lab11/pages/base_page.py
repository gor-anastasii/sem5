from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def find_element(self, *locator):
        return self.driver.find_element(*locator)

    def wait_for_element(self, timeout, condition):
        return WebDriverWait(self.driver, timeout).until(condition)

    def click_element(self, *locator):
        element = self.find_element(*locator)
        element.click()
