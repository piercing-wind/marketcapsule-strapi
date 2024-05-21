exports.invoiceHtml = (data)=>{
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <style>
            *{
                margin: 0px;
                padding: 0px;
              box-sizing: border-box;
              font-family: "Montserrat", sans-serif;
            }
            body{
                background: #F2F2F2 0% 0% no-repeat padding-box;
    padding-left: 175px;
    padding-right: 175px;
    
            }
            .mainDiv{
                padding: 30px 0px;
                background: #FFFFFF 0% 0% no-repeat padding-box;
            }
            .headingMainDiv{
                display: flex;
                justify-content: center;
                align-items: center;
                
            }
          .headingDiv > h5{
    margin-bottom: 26px;
           }
            .fontSize19{
                color:#000000;
                font-weight:normal;
                font-size: 19px;
            }
            .fontSize18{
                color:#000000;
                font-weight:normal;
                font-size: 18px;
            }
            .fontSize16{
                color:#000000;
                font-weight:normal;
                font-size: 16px;
            }
            .semibold{
                font-weight:600;
            }
            .medium{
                font-weight:500;
    
            }
    
            .darkBlue{
                color: #0603AF;
            }
    
            /* tax invoice  */
            .taxInvoiceHeadingDiv{
                background: #E6E6E6 0% 0% no-repeat padding-box;
                display: flex;
                justify-content: center;
                padding: 16px;
                margin-top: 30px;
            }
    
            .taxInvoiceDetailDiv{
                padding: 25px 25px 36px 25px;
            }
    
            .invoiceUpperDiv{
                display: flex;
                column-gap: 60px;
                align-items: center;
            }
    
            .invoiceLowerDiv{
                display: flex;
                column-gap: 75px;
                align-items: center;
                margin-top: 38px;
            }
            .textCenter{
                text-align: center;
            }
    
            /* particular table */
            .table{
                border-spacing: 0px;
            }
            .table th{
                color:#000000;
                font-weight:500;
                font-size: 18px; 
            }
    
            .table td{
                color:#000000;
                font-weight:normal;
                font-size: 18px;
                padding-top: 12px;
            }
    
            .table .medium{
                font-weight:500;
    
            }
    
            
            .table .totalAmount{
                color: #040280;
                font-weight:500;
    
            }
    
            .headingRow{
                background: #E6E6E6 0% 0% no-repeat padding-box;
            }
    
            .headingRow th{
    padding-top: 18px;
    padding-bottom: 18px;
            }
    
            .dashBorder td{
                border-bottom: 1px dashed #A9A9A9;
                padding-bottom: 16px;
            }
    
            .grayBorder td{
                border-bottom: 1px solid #A9A9A9;
                padding-bottom: 16px;
            }
    
            .grayBorder1{
                border-bottom: 1px solid #A9A9A9;
    
            }
    
            /* payment details div */
            .paymentDetailsDiv{
                background: #E6E6E6 0% 0% no-repeat padding-box;
                display: flex;
                padding: 16px;
                margin-top: 8px;
            }
    
            .paymentLowerDiv{
                display: flex;
                column-gap: 118px;
                align-items: center;
            }
        </style>
      </head>
      <body>
        <div class="mainDiv">
    
            <!-- heading div -->
            <div class="headingMainDiv">
    
                <div class="headingDiv">
                    <h5 class="fontSize19 semibold textCenter ">Market Capsule</h5>
                    <p class="fontSize18 textCenter" style="margin-bottom: 9px;">CIN: ${data.CIN}</p>
                    <p class="fontSize18 textCenter" style="margin-bottom: 19px;">Address: ${data.address}</p>
                    <div>
                        <span class="fontSize18">GSTIN</span>
                        <span class="fontSize18 medium">${data.GSTIN}</span>
                        <span class="fontSize18">|</span>
                        <span  class="fontSize18 medium">${data.mobile}</span>
                        <span class="fontSize18">|</span>
                        <span class="fontSize18 medium">${data.email}</span>
        
                    </div>
                </div>
            </div>
            <!-- tax invoice div -->
    
            <div class="taxInvoiceDiv">
                <div class="taxInvoiceHeadingDiv">
                    <h5 class="fontSize19 darkBlue semibold">TAX INVOICE</h5>
                </div>
                <div class="taxInvoiceDetailDiv">
                    <div class="invoiceUpperDiv" >
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Bill To</h6>
                            <p class="fontSize18" style="margin-bottom: 9px;">Name: ${data.userFullName}</p>
                            <p class="fontSize18">GSTIN: Not Applicable / Unregistered</p>
                        </div>
                        <div>
                            <p class="fontSize18">Address: Online Services</p>
                        </div>
                    </div>
        
                    <div class="invoiceLowerDiv">
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Place of Supply</h6>
                            <p class="fontSize18"></p>
                        </div>
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Invoice No.</h6>
                            <p class="fontSize18">${data.invoiceNo}</p>
                        </div>
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Invoice Date</h6>
                            <p class="fontSize18">${data.invoiceDate}</p>
                        </div>
                    </div>
    
                </div>
            </div>
    
            <!-- particulars table -->
            
            <table class="table" style="width: 100%;">
                <tr class="headingRow">
                  <th>S.NO.</th>
                  <th style="text-align: start;">PARTICULARS</th>
                  <th style="text-align: start;">AMOUNT</th>
                </tr>
                <tr >
                  <td class="textCenter">01</td>
                  <td>${data.planName}</td>
                  <td>${data.totalAmount}</td>
                </tr>
                <tr class="dashBorder"> 
                    <td></td>
                    <td>Discount</td>
                    <td>${data.discount?data.discount:"-"}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td class="medium">Total Charges</td>
                    <td class="medium">4,999</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>CGST @ 9%</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>SGST @ 9%</td>
                    <td>-</td>
                  </tr>
                  <tr class="grayBorder">
                    <td></td>
                    <td>IGST @ 18%</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td class="totalAmount">Total Amount Payable</td>
                    <td class="totalAmount">${data.totalPayableAmount}</td>
                  </tr>
                  
                         
               
              </table>
              
              <div style="margin-top: 50px; padding-left: 25px;">
                <p class="fontSize18  " style="margin-bottom: 18px;">${data.totalPayableAmountInWords}</p>
                <h6 class="fontSize16 semibold">In words</h6>
              </div>
    
    
               <!-- payment details-->
    
            <div class="taxInvoiceDiv">
                <div class="paymentDetailsDiv">
                    <h5 class="fontSize18  medium">PAYMENT DETAILS</h5>
                </div>
                <div class="taxInvoiceDetailDiv grayBorder1">
                    
                    <div class="paymentLowerDiv ">
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Bank Account No.</h6>
                            <p class="fontSize18">XXXXXXXX1234</p>
                        </div>
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">Account Type</h6>
                            <p class="fontSize18">Current</p>
                        </div>
                        <div>
                            <h6 class="fontSize16 semibold" style="margin-bottom: 9px;">IFSC Code</h6>
                            <p class="fontSize18">PNBXXXXXXX</p>
                        </div>
                    </div>
    
                </div>
            </div>
    
            <!-- auth signature -->
            <div   class="taxInvoiceDetailDiv" style="padding-bottom: 0px;" >
                <p class="fontSize18" style="text-align: right;">Authorized Signatory</p>
            </div>
        </div>
    
      </body>
    </html>`
}