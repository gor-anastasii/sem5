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

try:
    driver.get('https://www.wildberries.by/')
    print('Сайт открыт')
    time.sleep(1)

    search_box = driver.find_element(By.CSS_SELECTOR, 'input#searchInput')
    search_box.click()
    time.sleep(3)

    search_box.send_keys('кроссовки')
    time.sleep(3)

    first_suggestion = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, '.autocomplete__text'))
    )
    first_suggestion.click()
    time.sleep(3)
    search_box.clear()

    search_box.send_keys('футболка оверсайз')
    time.sleep(3)

    second_suggestion = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, '.autocomplete__text'))
    )
    second_suggestion.click()
    time.sleep(3)
    search_box.clear()

    search_box.send_keys('маркеры')
    time.sleep(3)

    suggestions = WebDriverWait(driver, 5).until(
        EC.visibility_of_all_elements_located((By.CSS_SELECTOR, '.autocomplete__text'))
    )
    last_suggestion = suggestions[-1]
    last_suggestion.click()
    time.sleep(7)

    results = driver.find_elements(By.CSS_SELECTOR, '.j-card-link')
    if results:
        driver.execute_script("arguments[0].scrollIntoView();", results[0])
        time.sleep(3)

        results[0].click()
        time.sleep(7)

        add_to_cart_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.order__button.btn-main'))
        )
        driver.execute_script("arguments[0].scrollIntoView();", add_to_cart_button)
        add_to_cart_button.click()
        time.sleep(8)
    else:
        print('Товары не найдены.')

except Exception as e:
    print("Произошла ошибка:", e)
finally:
    driver.quit()
    print('Драйвер закрыт')
