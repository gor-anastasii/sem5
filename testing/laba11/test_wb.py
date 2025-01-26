from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from pages.main_page import MainPage
from pages.search_results_page import SearchResultsPage
import time

chrome_options = Options()
chrome_options.add_argument("--disable-notifications")
service = Service("C:\AllMine\Labs\тестирование\chromedriver.exe")
driver = webdriver.Chrome(service=service, options=chrome_options)


try:
    driver.get('https://www.wildberries.by/')
    print('Сайт открыт')
    time.sleep(1)

    main_page = MainPage(driver)
    # main_page.search('кроссовки')
    # time.sleep(3)

    main_page.search('маркеры')
    time.sleep(3)

    search_results_page = SearchResultsPage(driver)
    search_results_page.click_first_result()
    time.sleep(7)

    search_results_page.add_to_cart()

    search_results_page.result_add_to_cart()
    time.sleep(8)

except Exception as e:
    print("Произошла ошибка:", e)
finally:
    driver.quit()
    print('Драйвер закрыт')