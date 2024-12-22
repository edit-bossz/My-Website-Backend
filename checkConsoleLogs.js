const puppeteer = require("puppeteer");

const url = process.env.TARGET_URL || "https://edit-bossz.github.io/My-Website/";
const checkText = process.env.CHECK_TEXT || "Response from server: Data recorded";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Visiting: ${url}`);
  let found = false;

  await page.goto(url, { waitUntil: "networkidle2" });

  page.on("console", (msg) => {
    if (msg.text().includes(checkText)) {
      found = true;
      console.log(`Found: "${checkText}"`);
    }
  });

  console.log("Checking for text in console...");
  await page.waitForTimeout(10000); // Wait for 10 seconds to capture console output

  if (!found) {
    console.log(`"${checkText}" not found.`);
    process.exit(1); // Exit with error if text is not found
  }

  console.log(`"${checkText}" found. Exiting and workflow will restart in 10 minutes.`);
  await browser.close();
})();
