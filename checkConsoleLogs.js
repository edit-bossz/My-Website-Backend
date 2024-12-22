const puppeteer = require("puppeteer");

const url = process.env.TARGET_URL || "https://edit-bossz.github.io/My-Website/";
const checkText = process.env.CHECK_TEXT || "Response from server: Data recorded";
const maxRetries = 3; // Number of retries
const retryDelay = 5000; // Delay between retries (in milliseconds)

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log(`Visiting: ${url}`);
  let found = false;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt} of ${maxRetries}...`);
    await page.goto(url, { waitUntil: "networkidle2" });

    page.on("console", (msg) => {
      if (msg.text().includes(checkText)) {
        found = true;
        console.log(`Found: "${checkText}"`);
      }
    });

    // Wait for a short duration to capture console output
    await new Promise((resolve) => setTimeout(resolve, 10000));

    if (found) break; // Exit loop if text is found

    if (attempt < maxRetries) {
      console.log(`"${checkText}" not found. Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
    }
  }

  if (!found) {
    console.log(`"${checkText}" not found after ${maxRetries} attempts.`);
    process.exit(1); // Exit with error if text is not found
  }

  console.log(`"${checkText}" found. Exiting and workflow will restart in 10 minutes.`);
  await browser.close();
})();
