from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

url = "https://edit-bossz.github.io/My-Website/"
expected_response = "Response from server: Data recorded"

options = Options()
options.add_argument("--headless")  # Runs Chrome in headless mode
options.add_argument("--remote-debugging-port=9222")  # Enables remote debugging
service = Service("/usr/lib/chromium-browser/chromium-driver")
driver = webdriver.Chrome(service=service, options=options)

driver.get(url)

while True:
    time.sleep(10)  # Wait for 10 seconds
    logs = driver.get_log('browser')  # Get console logs from the browser

    # Check if any of the logs contain the expected response
    for log in logs:
        print(log)
        if expected_response in log['message']:
            print("Success: Found expected response in console log.")
            driver.quit()
            break
    else:
        print("Waiting for expected response in console log...")