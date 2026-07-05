const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {

const html =
process.argv[2];

const htmlPath =
"C:/Users/Kiran Karthick S/.n8n-files/answer.html";

const pdfPath =
"C:/Users/Kiran Karthick S/.n8n-files/answer.pdf";

fs.writeFileSync(
  htmlPath,
  html
);

const browser =
await puppeteer.launch({
  headless:true
});

const page =
await browser.newPage();

await page.goto(
  "file:///" +
  htmlPath.replace(/\\/g,'/'),
  {
    waitUntil:'networkidle0'
  }
);

await page.pdf({
  path:pdfPath,
  format:'A4',
  printBackground:true,
  margin:{
    top:'30px',
    bottom:'30px',
    left:'30px',
    right:'30px'
  }
});

await browser.close();

console.log(pdfPath);

})();