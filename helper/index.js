const html_to_pdf = require('html-pdf-node');


exports.convertHtmlIntoPdf = async (html) => {
    let options = { format: 'A4' };

    let file = { content: html };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    console.log("pdfBuffer",pdfBuffer);    
    return pdfBuffer

}

exports.addDaysToDate = (date, days) => {
    const millisecondsInDay = 86400000; // 24 * 60 * 60 * 1000
    const timestamp = date.getTime() + days * millisecondsInDay;
    return new Date(timestamp);
}