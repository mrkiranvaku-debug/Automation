 const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

const classroomUrl = process.argv[2];

if (
  !classroomUrl ||
  !classroomUrl.startsWith("https://")
) {
  console.log("Invalid Classroom URL");
  process.exit(1);
}

const browser =
await chromium.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
});

const context = await browser.newContext({
  storageState: 'auth.json'
});

const page = await context.newPage();

await page.goto(classroomUrl, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});

await page.waitForTimeout(5000);

await page.waitForSelector(
  'a[href*="drive.google.com"]',
  {
    timeout: 30000
  }
);

const links = await page
  .locator("a")
  .evaluateAll(elements =>
    elements.map(e => ({
      text: e.innerText,
      href: e.href
    }))
  );

 
const attachment = links.find(
  link =>
    link.href &&
    link.href.includes("drive.google.com")
);

if (!attachment) {

  console.error("No attachment found.");
  console.error(
    "Reading text directly from Classroom page..."
  );

  await page.waitForTimeout(3000);

 

  await page.screenshot({
    path:
      "C:/Users/Kiran Karthick S/.n8n-files/error.png",
    fullPage: true
  });

console.error("Screenshot saved");

  const text =
    await page.evaluate(
      () => document.body.innerText
    );

  const outputPath =
    "C:/Users/Kiran Karthick S/.n8n-files/classroom_output.txt";

  fs.writeFileSync(
    outputPath,
    text
  );

console.error(
  "Saved classroom text."
);

  await browser.close();
  return;
}

console.error("Attachment Found:");
console.error(attachment);

console.error(
  "Current URL:",
  page.url()
);

/* ONLY CHANGE IS HERE */
await page.goto(
  attachment.href,
  {
    waitUntil: "domcontentloaded",
    timeout: 60000
  }
);

await page.waitForSelector(
  'button[aria-label="Download"]',
  {
    timeout: 30000
  }
);

const downloadButton =
  page.locator(
    'button[aria-label="Download"]'
  );

if (
  await downloadButton.count() > 0
) {

  const downloadPromise =
    page.waitForEvent(
      'download'
    );

  await downloadButton
    .first()
    .click();

  const download =
    await downloadPromise;

 const fileName =
  download.suggestedFilename();

const filePath =
  `C:/Users/Kiran Karthick S/.n8n-files/${fileName}`;

await download.saveAs(filePath);

await download.path();

await page.waitForTimeout(3000);
process.stdout.write(filePath);

 

 
}
else {
  console.error(
    'Download button not found'
  );
}

 

await browser.close();

})();
