from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options

import time

chrome_options = Options()
chrome_options.add_argument("--disable-notifications")

service = Service(ChromeDriverManager(driver_version="130.0.6723.70").install())
driver = webdriver.Chrome(service=service, options=chrome_options)
actions = ActionChains(driver)

url = 'https://wildberries.by/'
driver.get(url)
time.sleep(3)
try:
    driver.find_element(By.XPATH, "/html/body/div[4]/div/div/button[1]").click()
    driver.find_element(By.CLASS_NAME, "nav-element__burger").click()
except Exception as e:
    print("Ошибка при нажатии на кнопку меню:", e)

try:
    menu_el = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.XPATH, "/html/body/div[1]/div[3]/div[2]/ul/li[3]"))
    )
    actions.move_to_element(menu_el).perform()
except Exception as e:
    print("Ошибка при выборе элемента меню:", e)

time.sleep(4)
try:
    side_el = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "menu-burger__link"))
    )
    side_el.click()
except Exception as e:
    print("Ошибка при выборе элемента подменю:", e)

time.sleep(10)
driver.quit()