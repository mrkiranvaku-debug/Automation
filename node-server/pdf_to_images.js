 const { exec } = require('child_process');

exec(
`"C:\\Users\\Kiran Karthick S\\poppler-26.02.0\\Library\\bin\\pdftoppm.exe" -png "C:\\Users\\Kiran Karthick S\\.n8n-files\\assignment.pdf" "C:\\Users\\Kiran Karthick S\\.n8n-files\\page"`,
(err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Images Created');
});