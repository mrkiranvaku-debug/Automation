const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();

const WordExtractor = require('word-extractor');
const mammoth = require('mammoth');

const extractor = new WordExtractor();

app.use(bodyParser.json());

app.post('/classroom', (req, res) => {
    const url = req.body.url;

    console.log('Received:', url);

    exec(`node classroom_test.js "${url}"`, (err, stdout, stderr) => {

        console.log('===== STDOUT =====');
        console.log(stdout);

        console.log('===== STDERR =====');
        console.log(stderr);

        if (err) {
            console.error('EXEC ERROR:');
            console.error(err);

            res.status(500).send(err.message);
            return;
        }

       res.json({
  filePath: stdout.trim()
});
    });
});
 const fs = require('fs');

app.post('/pdf', (req, res) => {

    const answer = req.body?.answer || '';

    fs.writeFileSync(
        'C:/Users/Kiran Karthick S/.n8n-files/answer.txt',
        answer
    );

    exec('node create_pdf.js', (err) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error');
            return;
        }

        res.send('PDF Created');
    });

});
app.post('/pdf-images', (req, res) => {

    exec('node pdf_to_images.js', (err) => {

        if (err) {
            console.error(err);
            res.status(500).send('Error');
            return;
        }

         setTimeout(() => {
    res.send('Images Created');
}, 3000);

    });

});

app.post('/extract-doc', async (req, res) => {

    try {

        const filePath = req.body.filePath;

        const doc =
            await extractor.extract(filePath);

        const text =
            doc.getBody();

        res.json({
            text: text
        });

    }
    catch (err) {
        console.error(err);

        res.status(500).send(
            'DOC extraction failed'
        );
    }
});

app.post('/extract-docx', async (req, res) => {

    try {

        const filePath =
            req.body.filePath;

        const result =
            await mammoth.extractRawText({
                path: filePath
            });

        res.json({
            text: result.value
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).send(
            'DOCX extraction failed'
        );
    }
});
app.post('/html-to-pdf', async (req, res) => {

    try {

        const html =
            req.body.html || '';

        const htmlPath =
            'C:/Users/Kiran Karthick S/.n8n-files/answer.html';

        const pdfPath =
            'C:/Users/Kiran Karthick S/.n8n-files/answer.pdf';

        fs.writeFileSync(
            htmlPath,
            html
        );

        const puppeteer =
            require('puppeteer');

        const browser =
            await puppeteer.launch({
                headless: true
            });

        const page =
            await browser.newPage();

        await page.goto(
            'file:///' +
            htmlPath.replace(/\\/g, '/'),
            {
                waitUntil: 'networkidle0'
            }
        );

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '30px',
                bottom: '30px',
                left: '30px',
                right: '30px'
            }
        });

        await browser.close();

        res.json({
            pdfPath: pdfPath
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).send(
            'PDF generation failed'
        );
    }
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});