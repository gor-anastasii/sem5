from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import time

service = Service(ChromeDriverManager(driver_version="130.0.6723.70").install())
driver = webdriver.Chrome(service=service)
actions = ActionChains(driver)

url = 'https://www.saucedemo.com/'
driver.get(url)

time.sleep(1)

#login

try:
    username_box = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "user-name"))
    )
    username_query = "standard_user"
    username_box.send_keys(username_query)

    password_box = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "password"))
    )
    password_query = "secret_sauce"
    password_box.send_keys(password_query)
    time.sleep(1)

    submit_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="submit"]'))
    )
    submit_button.click()

except Exception as e:
    print("Ошибка при ожидании элемента:", e)

time.sleep(10)

driver.quit()