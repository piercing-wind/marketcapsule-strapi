const html_to_pdf = require('html-pdf-node');

exports.invoiceHtml = ()=>{
    return `<html>
    <head>
      <title>HTML to PDF</title>
    </head>
    <body>
      <h1>Hello, World!</h1>
      <p>This is an example HTML content.</p>
    </body>
    </html>`
}

exports.convertHtmlIntoPdf = async (html) => {
    let options = { format: 'A4' };

    let file = { content: html };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    console.log("pdfBuffer",pdfBuffer);    
    return pdfBuffer

}