const html_to_pdf = require('html-pdf-node');


exports.convertHtmlIntoPdf = async (html) => {
    let options = { format: 'A4' };

    let file = { content: html };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    console.log("pdfBuffer",pdfBuffer);    
    return pdfBuffer

}