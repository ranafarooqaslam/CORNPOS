var Modifierparent = [];
function waitLoading(msg) {
    new $.Zebra_Dialog('<strong>' + msg + '</strong>', {
        'buttons': false,
        'position': ['top + 120'],
        'auto_close': 600
    });
}
function activeLink() {

    $("#lnkDineIn").removeClass("active");
    $("#lnkTakeaway").removeClass("active");
    $("#lnkDelivery").removeClass("active");

    if ($("#TableNo1").text() == "DLY") {
        $("#lnkDelivery").addClass("active");
        document.getElementById("hfCustomerType").value = "Delivery";

    } else if ($("#TableNo1").text() == "TKY") {

        $("#lnkTakeaway").addClass("active");
        document.getElementById("hfCustomerType").value = "Takeaway";

    } else {

        $("#lnkDineIn").addClass("active");
        document.getElementById("hfCustomerType").value = "Dine In";
    }
}
//=======Pending Bills
function GetPendingBills() {

    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmRePrintInvoice.aspx/SelectPendingBills", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ FromDate: document.getElementById("txtFromDate").value, ToDate: document.getElementById("txtToDate").value }),
                    success: LoadPendingBills
                }
            );
}
function LoadPendingBills(pendingBills) {

    pendingBills = JSON.stringify(pendingBills);
    pendingBills = jQuery.parseJSON(pendingBills.replace(/&quot;/g, '"'));
    pendingBills = eval(pendingBills.d);

    $("#tbl-pending-bills").empty();

    for (var i = 0, len = pendingBills.length; i < len; i++) {
        if (pendingBills[i].INVOICE_ID > 0) {
            var row = $('<tr><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="width:25%">' + pendingBills[i].InvoiceNo + '</td><td class="leftval" style="width:25%">' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="leftval" style="width:25%">' + pendingBills[i].TABLE_NO + '</td><td class="rightval" style="width:25%">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].CoverTable3 + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="display:none;">' + pendingBills[i].TIME_STAMP + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td></tr>');
            $('#tbl-pending-bills').append(row);
        }
    }
}
function GetPendingBill(saleInvoiceMasterId) {

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmRePrintInvoice.aspx/GetPendingBill", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "{'saleInvoiceMasterId':'" + saleInvoiceMasterId + "'}",
                success: LoadPendingBill
            }
        );
}
function LoadPendingBill(products) {
    document.getElementById("trPoints").style.display = "none";
    if (document.getElementById("hfTaxAuthority").value !== '0' && document.getElementById("hfTaxAuthority").value !== '3') {
        var qrCode = JSON.stringify(products);
        var result = jQuery.parseJSON(qrCode.replace(/&quot;/g, '"'));
        qrCode = eval(result.d);
        if (qrCode.length > 0) {
            if (document.getElementById("hfTaxAuthority").value == "2") {
                document.getElementById('imgQrCodePRA').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImagePRA").style.display = "table-row";
                document.getElementById("imgpra").style.display = "block";
                document.getElementById("trFBRInvoicePRA").style.display = "table-row";
                $("#FBRInvoiceNoPRA").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodePRA3').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImagePRA3").style.display = "table-row";
                document.getElementById("imgpra3").style.display = "block";
                document.getElementById("trFBRInvoicePRA3").style.display = "table-row";
                $("#FBRInvoiceNoPRA3").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodePRACafeBedaar').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImagePRACafeBedaar").style.display = "table-row";
                document.getElementById("imgpraCafeBedaar").style.display = "block";
                document.getElementById("trFBRInvoicePRACafeBedaar").style.display = "table-row";
                $("#FBRInvoiceNoPRACafeBedaar").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);
            }
            else if (document.getElementById("hfTaxAuthority").value == "1") {
                document.getElementById('imgQrCodeFBR').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBR").style.display = "table-row";
                document.getElementById("imgfbr").style.display = "block";
                document.getElementById("trFBRInvoiceFBR").style.display = "table-row";
                $("#FBRInvoiceNoFBR").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodeFBR3').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBR3").style.display = "table-row";
                document.getElementById("imgfbr3").style.display = "block";
                document.getElementById("trFBRInvoiceFBR3").style.display = "table-row";
                $("#FBRInvoiceNoFBR3").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodeFBRCafeBedaar').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBRCafeBedaar").style.display = "table-row";
                document.getElementById("imgfbrCafeBedaar").style.display = "block";
                document.getElementById("trFBRInvoiceFBRCafeBedaar").style.display = "table-row";
                $("#FBRInvoiceNoFBRCafeBedaar").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].InvoiceNumberFBR);
            }
        }

        if (document.getElementById("hfTaxAuthority").value == "5") {
            if (qrCode[0].QRCodePRA != "") {
                document.getElementById('imgQrCodePRA').src = 'data:image/png;base64,' + qrCode[0].QRCodePRA;
                document.getElementById("trQRImagePRA").style.display = "table-row";
                document.getElementById("imgpra").style.display = "block";
                document.getElementById("trFBRInvoicePRA").style.display = "table-row";
                $("#FBRInvoiceNoPRA").text('PRA Invoice No: ' + qrCode[0].InvoiceNumberPRA);

                document.getElementById('imgQrCodePRA3').src = 'data:image/png;base64,' + qrCode[0].QRCodePRA;
                document.getElementById("trQRImagePRA3").style.display = "table-row";
                document.getElementById("imgpra3").style.display = "block";
                document.getElementById("trFBRInvoicePRA3").style.display = "table-row";
                $("#FBRInvoiceNoPRA3").text('PRA Invoice No: ' + qrCode[0].InvoiceNumberPRA);

                document.getElementById('imgQrCodePRACafeBedaar').src = 'data:image/png;base64,' + qrCode[0].QRCodePRA;
                document.getElementById("trQRImagePRACafeBedaar").style.display = "table-row";
                document.getElementById("imgpraCafeBedaar").style.display = "block";
                document.getElementById("trFBRInvoicePRACafeBedaar").style.display = "table-row";
                $("#FBRInvoiceNoPRACafeBedaar").text('PRA Invoice No: ' + qrCode[0].InvoiceNumberPRA);
            }
            if (qrCode[0].QRCode != "") {
                document.getElementById('imgQrCodeFBR').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBR").style.display = "table-row";
                document.getElementById("imgfbr").style.display = "block";
                document.getElementById("trFBRInvoiceFBR").style.display = "table-row";
                $("#FBRInvoiceNoFBR").text('FBR Invoice No: ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodeFBR3').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBR3").style.display = "table-row";
                document.getElementById("imgfbr3").style.display = "block";
                document.getElementById("trFBRInvoiceFBR3").style.display = "table-row";
                $("#FBRInvoiceNoFBR3").text('FBR Invoice No: ' + qrCode[0].InvoiceNumberFBR);

                document.getElementById('imgQrCodeFBRCafeBedaar').src = 'data:image/png;base64,' + qrCode[0].QRCode;
                document.getElementById("trQRImageFBRCafeBedaar").style.display = "table-row";
                document.getElementById("imgfbrCafeBedaar").style.display = "block";
                document.getElementById("trFBRInvoiceFBRCafeBedaar").style.display = "table-row";
                $("#FBRInvoiceNoFBRCafeBedaar").text('FBR Invoice No: ' + qrCode[0].InvoiceNumberFBR);
            }
        }
    }

    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    $("#tble-ordered-products").empty();
    if (products == "") {
        Error("No Record Found");
    }
    else {
        if (products.length > 0) {            
            if (parseFloat(products[0].CustomerPoints) > 0) {
                document.getElementById("trPoints").style.display = "table-row";
                $("#lblPointsValue").text(products[0].CustomerPoints);
            }
        }
        var listItems = "<option value='" + products[0].orderBookerId + "'>" + products[0].BOOKER_NAME + "</option>";
        $("#ddlOrderBooker").html(listItems);
        $("#ddlOrderBooker").val(products[0].orderBookerId);
        $("#OrderNo1").text(products[0].InvoiceNo);
        $("#MaxOrderNo").text(products[0].ORDER_NO);
        $("#hfTableId").val(products[0].TABLE_ID);
        $("#hfTableNo").val(products[0].TABLE_NO);
        $("#txtTakeawayCustomer").val(products[0].TABLE_NO);
        $("#hfCurrentWorkDate").val(products[0].BILL_DATE);
        var amountDue = products[0].AMOUNTDUE;
        var discount = products[0].DISCOUNT;
        $("#TableNo1").text(products[0].TABLE_NO2);
        $('#hfPaymentType').val(products[0].PAYMENT_MODE_ID);
        $("#hfCustomerId").val(products[0].CUSTOMER_ID);
        $("#hfCustomerDetail").val(products[0].CustomerDetail3);
        $("#hfCustomerNo").val(products[0].CONTACT_NUMBER);
        $("#hfCustomerAddress").val(products[0].ADDRESS);
        $("#InvoiceTable3").text(products[0].CONTACT_NUMBER);
        $('#hfDiscountType').val(products[0].DISCOUNT_TYPE);
        $("#user-detail-bold").text(products[0].USER_NAME);
        $("#Cashier").text('Cashier: ' + products[0].USER_NAME);
        $("#hfCreditCardNo").val(products[0].CreditCardNo);
        $("#hfBankDiscountName").val(products[0].BankDiscountName);
        $("#hfCreditCardAccountTile").val(products[0].CreditCardAccountTile);
        if (products.length > 0) {
            $('#hfServiceType').val(products[0].SERVICE_CHARGES_TYPE);
        }
        if (products[0].MANUAL_ORDER_NO != "null") {
            $('#txtManualOrderNo').val(products[0].MANUAL_ORDER_NO);
        }
        if (products[0].coverTable != "null") {
            $('#txtCoverTable').val(products[0].coverTable);
        }
        if (products[0].SERVICE_CHARGES != "0") {
            document.getElementById("lblGSTOrService").innerHTML = "Service Charges";
            document.getElementById("dvServiceChargesPayment2").setAttribute("style", "display:block;");
            $('#hfServiceCharges').val(products[0].SERVICE_CHARGES);
            $('#txtService').val(products[0].SERVICE_CHARGES);
        }
        else {
            $('#hfServiceCharges').val('0');
            $('#txtService').val('');
        }
        activeLink();
        $('#txtCashRecieved').val(products[0].PAIDIN);
        $('#txtDiscount').val(products[0].DISCOUNT2);
        $('#hfITEM_DISCOUNT').val(products[0].ITEM_DISCOUNT);
        $('#hfSalesTax').val(parseFloat(products[0].GSTPER).toFixed(2));
        $('#hfSalesTaxValue').val(Math.round(products[0].GST, 0));
        if ($("#hfBillFormat").val() === "3") {
            document.getElementById("subTotal").innerHTML = Math.round(amountDue, 0) + Math.round(products[0].GST, 0);
        }
        else {
            document.getElementById("subTotal").innerHTML = Math.round(amountDue, 0);
        }
        document.getElementById("GrandTotal").innerHTML = Math.round(amountDue, 0);
        $("#Service-value").text($('#hfServiceCharges').val());
        $("#Service-value4").text($('#hfServiceCharges').val());
        $("#lblBalance").text(products[0].BALANCE);
        $("#hfBankDiscount").val(products[0].BankDiscount);
        $("#hfEmpDiscountType").val(products[0].EmpDiscountType);
        CalculateBalance();
        for (var i = 0, len = products.length; i < len; ++i) {
            addProductToOrderedProduct(products, i);
        }

        Modifierparent = [];
        for (var i = 0, len = products.length; i < len; ++i) {
            var obj = {};
            obj["ItemID"] = products[i].SKU_ID;
            obj["ParentID"] = products[i].MODIFIER_PARENT_ID;
            obj["ItemName"] = products[i].SKU_NAME;
            obj["Price"] = products[i].T_PRICE;
            obj["Qty"] = products[i].QTY;
            obj["Amount"] = products[i].AMOUNT;
            obj["ModifierParetn_Row_ID"] = products[i].ModifierParetn_Row_ID;
            obj["DISCOUNTItemWise"] = products[i].DISCOUNTItemWise;
            obj["SALE_INVOICE_DETAIL_ID"] = products[i].SALE_INVOICE_DETAIL_ID;
            Modifierparent.push(obj);
        }
        $("#lblDelChannel").text(products[0].DelChannelName);
        var tableData = storeTblValues();
        tableData = JSON.stringify(tableData);
        document.getElementById('hfOrderedproducts').value = tableData;
    }
}
function addProductToOrderedProduct(lstProducts, i) {
    var row = "";
    var checkItemDiscount = 0;
    for (var JJ = 0, len = lstProducts.length; JJ < len; ++JJ)
    {
        if (parseFloat(lstProducts[JJ].DISCOUNTItemWise) > 0)
        {
            checkItemDiscount = 1;
            break;
        }
    }
    if (checkItemDiscount == 0)
    {
        $("#tdGridDiscount").hide();
    }
    else {
        $("#tdGridDiscount").show();
    }
    if (checkItemDiscount == 1) {
        
        if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td><input  type="text" size="4"   value="' + lstProducts[i].T_PRICE + '" ></td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
        }
        else {
            if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
                if (lstProducts[i].MODIFIER == "0") {//CHECK IS MODIFIER OR NOT IF NOT THEN
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                }
                else {
                    if (lstProducts[i].T_PRICE == "0") {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '</td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;" class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td style="display:none;" class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
            }
            else {
                if (lstProducts[i].MODIFIER == "1") {
                    if (lstProducts[i].T_PRICE == "0") {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display: none;" ><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '</td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
                else {

                    if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {

                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNTItemWise + '</td><td class="table-text2">' + parseFloat(lstProducts[i].AMOUNT - lstProducts[i].DISCOUNTItemWise) + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
            }
        }
    }
    else {
        if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td><input  type="text" size="4"   value="' + lstProducts[i].T_PRICE + '" ></td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
        }
        else {
            if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
                if (lstProducts[i].MODIFIER == "0") {//CHECK IS MODIFIER OR NOT IF NOT THEN
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                }
                else {
                    if (lstProducts[i].T_PRICE == "0") {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '</td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;" class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td style="display:none;" class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
            }
            else {
                if (lstProducts[i].MODIFIER == "1") {
                    if (lstProducts[i].T_PRICE == "0") {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + 0 + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display: none;" ><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '</td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td class="table-text2">' + 0 + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
                else {

                    if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td><td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td class="table-text2">' + 0 + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                    else {

                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '</td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td class="table-text2">' + 0 + '</td><td class="table-text2" style="display:none;">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + lstProducts[i].INVOICE_ID + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].MANUAL_ORDER_NO + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES_TYPE + '</td><td style="display:none;">' + lstProducts[i].SERVICE_CHARGES + '</td><td style="display:none;">' + lstProducts[i].AMOUNTDUE + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + lstProducts[i].ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].CUSTOMER_NAME + '</td><td style="display:none;">' + lstProducts[i].DiscountRemarks + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                    }
                }
            }
        }
    }
    $("#tble-ordered-products").append(row);
}
$(document).ready(function () {    
    waitLoading('Loading');
    $(".nav-ic img").click(function () {
        $(".exit-text").slideToggle("slow", function () {
        });
    });
    //On Payments Click
    $("#tbl-pending-bills").delegate("tr", "click", function () {
        $(this).addClass('highlight').siblings().removeClass('highlight');
        $("#txtInvoiceNo").val($(this).find("td:eq(0)").text());
        $("#OrderTime").text($(this).find("td:eq(18)").text());
        $("#OrderTime3").text($(this).find("td:eq(18)").text());
        $("#OrderTime4").text($(this).find("td:eq(18)").text());
        GetPendingBill($("#txtInvoiceNo").val());
    });
    //On Payments Click
    $("#SearchInvoice").click(function () {
        GetPendingBills();
    });
    $("#PrintInvoice").click(function () {
        if ($("#hfInvoiceFormat").val() == "2") {
            ReprintInvoice3();
        }
        else if ($("#hfInvoiceFormat").val() == "3") {
            ReprintInvoice4();
        }
        else if ($("#hfInvoiceFormat").val() == "4") {
            ReprintInvoice5();
        }
        else if ($("#hfInvoiceFormat").val() == "5") {
            ReprintInvoiceCafeBedaar();
        }
        else {
            ReprintInvoice();
        }

    });
});
function ReprintInvoice() {

    if ($('#hfQRCodeImageName').val() != '') {
        document.getElementById('imgOpinionSurvey').src = '/images/' + $('#hfQRCodeImageName').val();
        document.getElementById("trOpinionSurvey").style.display = "block";
    }

    document.getElementById("trCardAccountTitle").style.display = "none";
    document.getElementById("trBankDiscount").style.display = "none";
    document.getElementById('trDiscReason').style.display = "none";

    $("#lblCreditCardNo").text("");
    $("#lblAccountTitle").text("");
    $("#lblBankDiscount").text("");
    $("#InvoiceTable").text("");
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal").style.display = "none";
        document.getElementById("trTotal2").style.display = "table-row";
        document.getElementById("GstRow").style.display = "none";
        document.getElementById("GstRow2").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax").style.display = "table-row";
        document.getElementById("GrandTotalRow").style.display = "none";
        document.getElementById("GrandTotalRow2").style.display = "table-row";
    }
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    $('#OrderInvoice').show();
    $('#OrderInvoiceName').show();
    $('#BillNoName').show();
    $('#BillNo').show();
    $('#CompanyAddress').show();
    $('#CompanyNumber').show();
    $('#imgLogo2').show();
    $("#SaleInvoiceText").text("Reprint Invoice");
    $("#CustomerType").text($("#hfCustomerType").val());
    $("#InvoiceDate").text($("#hfCurrentWorkDate").val());    
    if ($("#hfRegNo").val() == "") {
        document.getElementById('RegNo').style.display = "none";
    }
    else {
        $('#RegNo').show();
    }
    if ($("#hfSTRN").val() == "") {
        document.getElementById('spSTRN').style.display = "none";
    }
    else {
        $('#spSTRN').show();
    }
    document.getElementById('trKOTNo').style.display = "none";
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice").text($("#MaxOrderNo").text());
        document.getElementById('trKOTNo').style.display = "block";
        $("#KOTNo").text("KOT No:" + $("#txtManualOrderNo").val());
    }
    else {
        $("#OrderInvoice").text($("#MaxOrderNo").text());
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        if (orderedProducts[0].CUSTOMER_NAME !== "") {
            $("#CustomerDetail").text(orderedProducts[0].CUSTOMER_NAME + '-' + $("#InvoiceTable3").text());
            $('#CustomerDetail').show();
        }
        else if ($('#hfCustomerDetail').val().length > 0) {
            $("#CustomerDetail").text($('#hfCustomerDetail').val());
            $('#CustomerDetail').show();
        }
        else {
            $('#CustomerDetail').hide();
            $("#CustomerDetail").text('');
        }
        document.getElementById('OrderTakerName').style.display = "none";
        document.getElementById('OrderTaker').style.display = "none";
        $('#CoverTableName').show();
        $('#CoverTable').show();
        $("#CoverTableName").text("Token ID:");
        $("#CoverTable").text($("#txtCoverTable").val());
        document.getElementById('InvoiceTableName').style.display = "none";
        document.getElementById('InvoiceTable').style.display = "none";
    }
    else if (document.getElementById("hfCustomerType").value == "Delivery") {
        $("#OrderTakerName").text("D-M:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker").text(OTaker.substring(0, 10));
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail").text(CDetail.substring(0, 32));
        $("#InvoiceTableName").text("Ph:");
        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#CustomerDetail').show();
        $('#InvoiceTableName').show();
        $("#InvoiceTable").text($("#hfCustomerNo").val());
        $('#InvoiceTable').show();
        document.getElementById('CoverTableName').style.display = "none";
        document.getElementById('CoverTable').style.display = "none";
    }
    else {
        $("#OrderTakerName").text("O-T:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker").text(OTaker.substring(0, 10));
        $("#CoverTable").text($("#txtCoverTable").val());
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTableName").text("Token ID:");
            $("#InvoiceTableName").text("");
            $("#InvoiceTable").text("");
        }
        else {
            $("#CoverTableName").text("Cover Table:");
            $("#InvoiceTableName").text("Table No:");
            $("#InvoiceTable").text($("#TableNo1").text());
        }
        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#CoverTableName').show();
        $('#CoverTable').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTable').show();
        if (orderedProducts[0].CUSTOMER_NAME !== "") {
            $("#CustomerDetail").text(orderedProducts[0].CUSTOMER_NAME + '-' + $("#InvoiceTable3").text());
            $('#CustomerDetail').show();
        }
        else if ($('#hfCustomerDetail').val().length > 0) {
            $("#CustomerDetail").text($('#hfCustomerDetail').val());
            $('#CustomerDetail').show();
        }
        else {
            $('#CustomerDetail').hide();
            $("#CustomerDetail").text('');
        }
    }
    $("#BillNo").text($("#OrderNo1").text());

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    
    var checkItemDiscount = 0;
    for (var JJ = 0, len = orderedProducts.length; JJ < len; ++JJ) {
        if (parseFloat(orderedProducts[JJ].DISCOUNTItemWise) > 0 || parseFloat(orderedProducts[JJ].DISCOUNTDeal) > 0) {
            checkItemDiscount = 1;
            break;
        }
    }
    if (checkItemDiscount == 0) {
        $("#tdDiscount").hide();
        $('#tdTotal').attr('colspan', 3);
        $('#tdGTotal').attr('colspan', 3);
        $('#tdGST2').attr('colspan', 3);
        $('#tdExclusiveGST').attr('colspan', 3);
        $('#tdDiscountPrint').attr('colspan', 3);
        $('#tdGSRRow').attr('colspan', 3);
        $('#tdServiceChargesRow').attr('colspan', 3);
        $('#tdGrandTotalRow').attr('colspan', 3);
        $('#tdGrandTotalRow2').attr('colspan', 3);
        $('#tbPayIn').attr('colspan', 3);
        $('#tdBalance').attr('colspan', 3);
        $('#tdBalance2').attr('colspan', 3);
        $('#tdtrFBRInvoice').attr('colspan', 4);
        $('#tdtrQRImage').attr('colspan', 4);
        $('#tdtrGSTInfo').attr('colspan', 4);
        $('#tdtrBankDiscount').attr('colspan', 4);
        $('#tdtrCardAccountTitle').attr('colspan', 2);
        $('#tdtrPoints').attr('colspan', 2);
        $('#tdtrDiscReason').attr('colspan', 4);
        $('#tdtrOpinionSurvey').attr('colspan', 4);
        $('#tdSlipNote').attr('colspan', 4);
    }
    else {
        $("#tdDiscount").show();
        $('#tdTotal').attr('colspan', 4);
        $('#tdGTotal').attr('colspan', 4);
        $('#tdGST2').attr('colspan', 4);
        $('#tdExclusiveGST').attr('colspan', 4);
        $('#tdDiscountPrint').attr('colspan', 4);
        $('#tdGSRRow').attr('colspan', 4);
        $('#tdServiceChargesRow').attr('colspan', 4);
        $('#tdGrandTotalRow').attr('colspan', 4);
        $('#tdGrandTotalRow2').attr('colspan', 4);
        $('#tbPayIn').attr('colspan', 4);
        $('#tdBalance').attr('colspan', 4);
        $('#tdBalance2').attr('colspan', 4);
        $('#tdtrFBRInvoice').attr('colspan', 5);
        $('#tdtrQRImage').attr('colspan', 5);
        $('#tdtrGSTInfo').attr('colspan', 5);
        $('#tdtrBankDiscount').attr('colspan', 5);
        $('#tdtrCardAccountTitle').attr('colspan', 3);
        $('#tdtrPoints').attr('colspan', 3);
        $('#tdtrDiscReason').attr('colspan', 5);
        $('#tdtrOpinionSurvey').attr('colspan', 5);
        $('#tdSlipNote').attr('colspan', 5);
    }

    //#region Products Detail
    $('#invoiceDetailBody').empty(); // clear all skus  from invoice
    var row = "";
    var arr = [];
    var totalamountWithGST = 0;
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            var totalamount = 0;
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (!orderedProducts[i].VOID) {
                    if (uniqueDeals[j] == orderedProducts[i].I_D_ID) {
                        if (count == 0) {
                            count += 1;                            
                            var row = "";
                            var DISCOUNTDeal = orderedProducts[i].DISCOUNTDeal;
                            totalamount = (orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY) - parseFloat(DISCOUNTDeal);
                            if (checkItemDiscount == 1) {                                
                                if (parseFloat(DISCOUNTDeal) > 0) {
                                    row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + DISCOUNTDeal + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                }
                                else {
                                    row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + orderedProducts[i].DISCOUNTItemWise + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                }
                            }
                            else {
                                if (parseFloat(DISCOUNTDeal) > 0) {
                                    checkItemDiscount = 1;
                                    row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + DISCOUNTDeal + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                }
                                else {
                                    row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                }
                            }
                            $('#invoiceDetailBody').append(row);
                        }
                        break;
                    }
                }
            }
        }
    }
    var tableIdSet = new Set();
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = parseFloat(orderedProducts[i].AMOUNT);
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT).toFixed(2);
        }
        if (qty > 0) {
            if ($("#hfBillFormat").val() === "2") {
                var GstInclusive = $('#hfSalesTax').val();
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100);
                var amountWithGST = parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].T_PRICE.toString().indexOf(".") > 0) {
                    priceWithGST = parseFloat(priceWithGST).toFixed(2);
                    amountWithGST = parseFloat(amountWithGST).toFixed(2);
                }
                if (orderedProducts[i].MODIFIER == "false" || orderedProducts[i].MODIFIER == "0") {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var moddiscount = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (parseInt(orderedProducts[i].SKU_ID) === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                mod = mod + '<br>' + Modifierparent[k].ItemName;
                                modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                modamount = modamount + '<br>' + (parseFloat(Modifierparent[k].Amount) - parseFloat(Modifierparent[k].DISCOUNTItemWise));
                                moddiscount = moddiscount + '<br>' + Modifierparent[k].DISCOUNTItemWise;
                                modprice = modprice + '<br>' + Modifierparent[k].Price;
                                HasMod = 1;
                            }
                            if (Modifierparent[k].ParentID !== 0) {
                                arr.push(Modifierparent[k].ItemID);
                            }
                        }
                    }
                    var bool = true;
                    for (var arri = 0; arri < arr.length; arri++) {
                        if (arr[arri] == orderedProducts[i].SKU_ID) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool) {
                        if (HasMod == 0) {
                            if (checkItemDiscount == 1) {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNTItemWise + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (checkItemDiscount == 1) {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + moddiscount + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].MODIFIER == "false" || orderedProducts[i].MODIFIER == "0") {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var moddiscount = '';                   
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (parseInt(orderedProducts[i].SKU_ID) === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                mod = mod + '<br>' + Modifierparent[k].ItemName;
                                modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                modamount = modamount + '<br>' + (parseFloat(Modifierparent[k].Amount) - parseFloat(Modifierparent[k].DISCOUNTItemWise));
                                moddiscount = moddiscount + '<br>' + Modifierparent[k].DISCOUNTItemWise;
                                modprice = modprice + '<br>' + Modifierparent[k].Price;
                                HasMod = 1;
                            }
                            if (Modifierparent[k].ParentID !== 0) {
                                arr.push(Modifierparent[k].ItemID);
                            }
                        }
                    }
                    var bool = true;
                    for (var arri = 0; arri < arr.length; arri++) {
                        if (arr[arri] == orderedProducts[i].SKU_ID) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool) {
                        if (HasMod == 0) {
                            if (checkItemDiscount == 1) {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNTItemWise + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (checkItemDiscount == 1) {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + moddiscount + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else
                            {
                                row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody').append(row);
        }
    }

    $('#invoiceDetailBody tr').each(function () {
        var id = $(this).find('td:last').text().trim();
        if (id !== "") {
            tableIdSet.add(Number(id));
        }
    });
    orderedProducts.forEach(function (product) {
        var productId = product.SALE_INVOICE_DETAIL_ID.toString();
        if (!tableIdSet.has(Number(productId))) {
            var qty = product.QTY;
            var tprice = 0;
            var amount = 0;
            if (product.T_PRICE.toString().indexOf(".") == -1) {
                tprice = product.T_PRICE;
                amount = parseFloat(product.AMOUNT) - parseFloat(product.DISCOUNTItemWise);
            }
            else {
                tprice = parseFloat(product.T_PRICE).toFixed(2);
                amount = parseFloat(product.AMOUNT - parseFloat(product.DISCOUNTItemWise)).toFixed(2);
            }
            if (qty > 0) {
                if ($("#hfBillFormat").val() === "2") {
                    var GstInclusive = 0;
                    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
                        GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                    }
                    else {
                        GstInclusive = document.getElementById("hfSalesTax").value;
                    }
                    if (GstInclusive == "")
                    { GstInclusive = 0; }
                    var priceWithGST = (parseFloat(product.T_PRICE) + (parseFloat(product.T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                    var amountWithGST = (parseFloat(priceWithGST) * parseFloat(product.QTY)).toFixed(2);
                    totalamountWithGST += parseFloat(amountWithGST);

                    if (parseFloat(product.DISCOUNTItemWise) > 0) {
                        var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + priceWithGST + '</td>' +
                    '<td class="text-right">' + product.DISCOUNTItemWise + '</td>' +
                    '<td class="text-right">' + amountWithGST + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');

                    }
                    else {
                        var row = $(' <tr><td>' + product.SKU_NAME
                            + '</td><td class="text-right">'
                            + product.QTY + '</td><td class="text-right">'
                            + priceWithGST + '</td><td class="text-right">'
                            + amountWithGST + '</td><td style="display:none">'
                            + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + priceWithGST + '</td>' +
                    '<td class="text-right">' + amountWithGST + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                    }
                    $('#invoiceDetailBody').append(row);
                    tableIdSet.add(productId);
                }
                else {
                    if (parseFloat(product.DISCOUNTItemWise) > 0) {
                        var row = $(' <tr><td>' + product.SKU_NAME
                            + '</td><td class="text-right">'
                            + product.QTY + '</td><td class="text-right">'
                            + tprice + '</td><td class="text-right">'
                            + product.DISCOUNTItemWise + '</td><td class="text-right">'
                            + amount + '</td><td style="display:none">'
                            + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        $('#invoiceDetailBody').append(row);
                        tableIdSet.add(productId);
                    }
                    else {
                        var row = $('<tr>' +
                '<td>' + product.SKU_NAME + '</td>' +
                '<td class="text-right">' + product.QTY + '</td>' +
                '<td class="text-right">' + tprice + '</td>' +
                '<td class="text-right">' + amount + '</td>' +
                '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
            '</tr>');
                        $('#invoiceDetailBody').append(row);
                        tableIdSet.add(productId);

                    }
                }
            }
        }
    });
    //#endregion Products Detail
    if (orderedProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason').style.display = "table-row";
        $("#lblDiscReason").text("Discount/Complimentary Reason: " + orderedProducts[0].DiscountRemarks);
    }
    var Gst = 0;
    Gst = document.getElementById("hfSalesTax").value;
    $("#GST-text").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    $("#GST-text2").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    if (Gst == "")
    { Gst = 0; }
    $("#TotalValue").text($("#subTotal").text());
    $("#TotalValue2").text(parseFloat(totalamountWithGST).toFixed(0));
    $("#GrandTotal-value").text($("#GrandTotal").text());
    var amountDue = $("#subTotal").text();
    var text = "";
    var ServicePer = 0;
    if (orderedProducts[0].SERVICE_CHARGES_TYPE === "0") {
        ServicePer = Math.round(parseFloat(orderedProducts[0].SERVICE_CHARGES) / parseFloat(orderedProducts[0].AMOUNTDUE) * 100, 0);
    }
    //When Discount not enter through Print invoice POpUP-----------------
    if ($("#lblDiscountTotal").text() === "0") {
        Gst = $("#hfSalesTaxValue").val();
        $("#Discount-text").text(text);
        $("#Gst-value").text($("#hfSalesTaxValue").val());
        $("#Gst-value2").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                if (document.getElementById("hfCustomerType").value == "Delivery") {
                    $("#Service-text").text("Del. Chargs @" + ServicePer + " % :");
                }
                else {
                    $("#Service-text").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
                }
            }
            else {
                if (document.getElementById("hfCustomerType").value == "Delivery") {
                    $("#Service-text").text("Delivery Charges :");
                }
                else {
                    $("#Service-text").text("Service Charges :");
                }
            }
        }
        else {
            document.getElementById("ServiceChargesRow").style.display = "none";
        }
        $("#GrandTotal-value").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));
        $("#Discount-value").text(text);

        ShowHideInvoiceFootDiscount("false");
    }
    else {
        var discount = $("#lblDiscountTotal").text();
        Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);

        if ($("#hfDiscountType").val() == "0") {
            if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0) {
                $("#Discount-text").text('Discount : ');
            }
            else {
                if ($("#hfEmpDiscountType").val() == 11) {
                    var dic = "Discount @" + $("#hfBankDiscount").val() + " % :";
                    $("#Discount-text").text(dic);
                }
                else {
                    var dic = "Discount @" + $("#txtDiscount").val() + " % :";
                    $("#Discount-text").text(dic);
                }
            }
        }
        else {
            if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0) {
                var dis = (parseFloat($('#hfITEM_DISCOUNT').val()) / parseFloat(amountDue) * 100).toFixed(0);
                //$("#Discount-text").text("Disc @" + dis + "% :");
                $("#Discount-text").text('Discount :');
            }
            else {
                $("#Discount-text").text('Discount :');
            }
        }
        $("#Gst-value").text($("#hfSalesTaxValue").val());
        $("#Gst-value2").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                if (document.getElementById("hfCustomerType").value == "Delivery") {
                    $("#Service-text").text("Del. Chargs @" + ServicePer + " % :");
                }
                else {
                    $("#Service-text").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
                }
            }
            else {
                if (document.getElementById("hfCustomerType").value == "Delivery") {
                    $("#Service-text").text("Delivery Charges :");
                }
                else {
                    $("#Service-text").text("Service Charges :");
                }
            }
        }
        else {
            document.getElementById("ServiceChargesRow").style.display = "none";
        }
        $("#Discount-value").text(Math.round(parseFloat($("#lblDiscountTotal").text())), 0);
        $("#GrandTotal-value").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));

        ShowHideInvoiceFootDiscount("true");
    }
    if ($('#hfPaymentType').val() == "1") {//For Credit Card Payment
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if ($("#hfCreditCardNo").val() != "") {
            $("#lblCreditCardNo").text("Card No: " + $("#hfCreditCardNo").val());
        }
        if ($("#hfBankDiscountName").val() != "") {
            $("#lblBankDiscount").text("Bank Discount: " + $("#hfBankDiscountName").val());
        }
        if ($("#hfCreditCardAccountTile").val() != "") {
            $("#lblAccountTitle").text("Acc. Title : " + $("#hfCreditCardAccountTile").val());
        }

        $("#PayIn-text").text('Payment IN :');
        var cash = $("#txtCashRecieved").val();
        var credit = $("#lblPaymentDue").text();
        var credit = credit - cash;

        if (cash > 0) {
            $("#PayType").text('MOP: Mixed');
            $("#PayIn-value").text($("#txtCashRecieved").val());
            $("#balance-text").text('Credit Card:');
            $("#balance-value").text(parseFloat(credit) - parseFloat($("#hfPOSFee").val()))
            $("#balance-text2").text('Balance :');
            $("#balance-value2").text(0);
        }
        else {
            $("#PayType").text('MOP: Credit Card');
            $("#PayIn-value").text(credit + parseFloat($("#hfPOSFee").val()));
            $("#balance-text").text('Balance :');
            $("#balance-value").text(0)
            $("#balance-text2").text(text);
            $("#balance-value2").text(text);
        }

    }
    else if ($('#hfPaymentType').val() == "2") {
        $("#PayIn-text").text('Payment IN :');
        $("#PayType").text('MOP: Credit');
        $("#PayIn-value").text(0);
        $("#balance-text").text('Balance :');
        $("#balance-value").text(parseFloat($("#GrandTotal-value").text()) * -1 - parseFloat($("#hfPOSFee").val()));
        $("#balance-text2").text(text);
        $("#balance-value2").text(text);
    }
    else if ($('#hfPaymentType').val() == "3")
    {
        $("#PayType").text('MOP: Easypaisa');
    }
    else if ($('#hfPaymentType').val() == "4") {
        $("#PayType").text('MOP: Jazz Cash');
    }
    else if ($('#hfPaymentType').val() == "5") {
        $("#PayType").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType").text('MOP: Cash');
        $("#PayIn-text").text('Payment IN :');
        $("#balance-text").text('Change :');
        $("#balance-text2").text(text);
        $("#PayIn-value").text($("#txtCashRecieved").val());
        $("#balance-value").text(parseFloat($("#lblBalance").text()) - parseFloat($("#hfPOSFee").val()));
        $("#balance-value2").text(text);
    }
    ShowHideInvoiceFootGstReprint(Gst);
    ShowHideInvoiceFootTotal(Gst, $("#lblDiscountTotal").text());
    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue2").text();
        var tax = 0;
        tax = $("#Gst-value2").text();
        var discount = $("#Discount-value").text();
        var service = $("#Service-value").text();
        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
        if (service == '') {
            service = 0;
        }
        $("#ExclusiveST-value").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value2").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));

        if (discount == 0) {
            $("#GrandTotal-text2").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text2").text("Amount after Disc. :");
        }
    }

    var GstInfoValue = 0;
    GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
    GstInfoValue = parseFloat(amountDue) - GstInfoValue;
    $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));

    $('#BillNoName').show();
    $('#BillNo').show();
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
    }
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow").style.display = "table-row";
    }
    $.print("#dvSaleInvoice");
}
function ReprintInvoiceCafeBedaar() {
    $('#header').text('PAYMENT RECEIPT (Duplicate)');
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);

    document.getElementById('trDiscountCafeBeedar').style.display = "none";
    document.getElementById('trTaxCafeBeedar').style.display = "none";
    document.getElementById('trServiceChargesCafeBeedar').style.display = "none";
    $('#trTableCafeBeddar').hide();
    $('#tblCashCreditBothCafeBedaar').hide();
    $('#trCustomerNameCafeBeddar').hide();
    $('#trCustomerAddressCafeBeddar').hide();
    $('#trCashCafeBeddar').hide();
    $('#trCashLineCafeBeddar').hide();
    $('#trCreditCareCafeBeddar').hide();
    $('#trCreditCareLineCafeBeddar').hide();
    $('#trCreditCafeBeddar').hide();
    $('#trCreditLineCafeBeddar').hide();
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $('#trTableCafeBeddar').show();
    }

    if (orderedProducts[0].CUSTOMER_NAME != '' || $('#hfCustomerNo').val() != '') {
        $('#CustomerNameCafeBedaar').text(orderedProducts[0].CUSTOMER_NAME);
        $('#CustomerContactCafeBedaar').text('Contact#:' + $('#hfCustomerNo').val());
        $('#trCustomerNameCafeBeddar').show();
    }
    if ($("#hfCustomerAddress").val() != '') {
        $('#CustomerAddressafeBedaar').text($("#hfCustomerAddress").val());
        $('#trCustomerAddressCafeBeddar').show();
    }

    $('#AddressCafeBedaar').text($("#hfAddress").val());
    document.getElementById('imgLogoCafeBedaar').src = document.getElementById('imgLogo2').src;
    $("#CustomerTypeCafeBedaar").text(document.getElementById("hfCustomerType").value.toUpperCase());
    $("#TableNoCafeBeddar").text("Table: " + $("#TableNo1").text());
    $("#OrderTimeCafeBedaar").text("Order Time: " + moment().format('hh:mm A'));
    $("#OrderDateCafeBedaar").text("Order Date: " + $("#hfCurrentWorkDate").val());
    $("#OrderTakerCafeBedaar").text("Order Taker: " + $("#ddlOrderBooker option:selected").text());
    $("#CashierCafeBedaar").text('Cashier: ' + $("#user-detail-bold").text());
    $("#GuestCafeBedaar").text('Guests: ' + $('#txtCoverTable').val());
    $("#BillNoCafeBedaar").text("Bill No: " + $("#OrderNo1").text());
    $("#BillDateCafeBedaar").text("Bill : " + $("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#ltrlSlipNoteCafeBedaar").text($("#ltrlSlipNoteID").text());
    $("#ComapnyEmailCafeBedaar").text($("#hfCompanyEmail").val());
    $("#PNTNCafeBedaar").text("PNTN#" + $("#hfRegNo").val());
    $("#STRNCafeBedaar").text("STRN#" + $("#hfSTRN").val());

    $('#invoiceDetailCafeBedaar').empty(); // clear all skus  from invoice

    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();

    var row = "";
    var arr = [];
    var totalamountWithGST = 0;
    $('#invoiceDetailCafeBedaar').empty();
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            var totalamount = 0;
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (!orderedProducts[i].VOID) {
                    if (uniqueDeals[j] == orderedProducts[i].I_D_ID) {
                        if (count == 0) {
                            count += 1;
                            totalamount = orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY;
                            var row = $(' <tr><td><p>' + orderedProducts[i].DEAL_NAME + '</p></td><td class="text-right"><p>' + orderedProducts[i].DEAL_QTY + '</p></td><td class="text-right"><p>' + orderedProducts[i].A_PRICE + '</p></td><td class="text-right"><p>' + totalamount + '</p></td></tr>');
                            $('#invoiceDetailCafeBedaar').append(row);
                        }
                        break;
                    }
                }
            }
        }
    }
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = orderedProducts[i].AMOUNT;
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT).toFixed(2);
        }
        if (qty > 0) {
            if ($("#hfBillFormat").val() === "2") {
                var GstInclusive = $('#hfSalesTax').val();
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100);
                var amountWithGST = parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].T_PRICE.toString().indexOf(".") > 0) {
                    priceWithGST = parseFloat(priceWithGST).toFixed(2);
                    amountWithGST = parseFloat(amountWithGST).toFixed(2);
                }
                if (orderedProducts[i].MODIFIER == "false" || orderedProducts[i].MODIFIER == "0") {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (parseInt(orderedProducts[i].SKU_ID) === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                mod = mod + '<br>' + Modifierparent[k].ItemName;
                                modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                modprice = modprice + '<br>' + Modifierparent[k].Price;
                                HasMod = 1;
                            }
                            if (Modifierparent[k].ParentID !== 0) {
                                arr.push(Modifierparent[k].ItemID);
                            }
                        }
                    }
                    var bool = true;
                    for (var arri = 0; arri < arr.length; arri++) {
                        if (arr[arri] == orderedProducts[i].SKU_ID) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool) {
                        if (HasMod == 0) {
                            row = $(' <tr><td><p>' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p>' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p>' + priceWithGST + '</p></td><td class="text-right"><p>' + amountWithGST + '</p></td></tr>');
                        }
                        else {
                            row = $(' <tr><td><p>' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p>' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p>' + priceWithGST + modprice + '</p></td><td class="text-right"><p>' + amountWithGST + modamount + '</p></td></tr>');
                        }
                    }


                }
            }
            else {
                if (orderedProducts[i].MODIFIER == "false" || orderedProducts[i].MODIFIER == "0") {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (parseInt(orderedProducts[i].SKU_ID) === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                mod = mod + '<br>' + Modifierparent[k].ItemName;
                                modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                modprice = modprice + '<br>' + Modifierparent[k].Price;
                                HasMod = 1;
                            }
                            if (Modifierparent[k].ParentID !== 0) {
                                arr.push(Modifierparent[k].ItemID);
                            }
                        }
                    }
                    var bool = true;
                    for (var arri = 0; arri < arr.length; arri++) {
                        if (arr[arri] == orderedProducts[i].SKU_ID) {
                            bool = false;
                            break;
                        }
                    }
                    if (bool) {
                        if (HasMod == 0) {
                            row = $(' <tr><td><p>' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p>' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p>' + tprice + '</p></td><td class="text-right"><p>' + amount + '</p></td></tr>');
                        }
                        else {
                            row = $(' <tr><td><p>' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p>' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p>' + tprice + modprice + '</p></td><td class="text-right"><p>' + amount + modamount + '</p></td></tr>');
                        }
                    }
                }
            }
            $('#invoiceDetailCafeBedaar').append(row);
        }
    }

    $('#subTotalCafeBeedar').text($("#subTotal").text());
    if (parseFloat($("#lblDiscountTotal").text) > 0) {
        $('#discountCafeBeedar').text(parseFloat($("#lblDiscountTotal").text));
        document.getElementById('trDiscountCafeBeedar').style.display = "table-row";
    }
    if (parseFloat($('#hfSalesTaxValue').val()) > 0) {
        $('#taxCafeBeedar').text(parseFloat($('#hfSalesTaxValue').val()));
        document.getElementById('trTaxCafeBeedar').style.display = "table-row";
        if ($('#hfPaymentType').val() == 1) {
            $('#taxlabelCafeBeedar').text('Tax: GST ' + $("#hfSalesTax").val() + ' %');
        }
        else {
            $('#taxlabelCafeBeedar').text('Tax: GST ' + $("#hfSalesTax").val() + '%');
        }
    }
    if (orderedProducts[0].SERVICE_CHARGES > 0) {
        $('#sercicechargesCafeBeedar').text(orderedProducts[0].SERVICE_CHARGES);
        document.getElementById('trServiceChargesCafeBeedar').style.display = "table-row";
    }
    $('#totalCafeBeedar').text((parseFloat($("#subTotal").text()) - parseFloat($("#lblDiscountTotal").text()) + parseFloat($('#hfSalesTaxValue').val()) + parseFloat(orderedProducts[0].SERVICE_CHARGES) + parseFloat($("#hfPOSFee").val())).toString());

    $('#tenderedCafeBeedar').text($("#txtCashRecieved").val());
    if ($('#hfPaymentType').val() == '0') {
        $('#changeCafeBeedar').text((parseFloat($("#txtCashRecieved").val()) - parseFloat($('#totalCafeBeedar').text())).toFixed(2));
        $('#trCashCafeBeddar').show();
        $('#trCashLineCafeBeddar').show();
        $('#cashCafeBeedar').text($('#totalCafeBeedar').text());
    }
    else if ($('#hfPaymentType').val() == '1') {
        $('#changeCafeBeedar').text((parseFloat($("#txtCashRecieved").val()) - parseFloat($('#totalCafeBeedar').text())).toFixed(2));
        $('#trCreditCareCafeBeddar').show();
        $('#trCreditCareLineCafeBeddar').show();

        var cash = 0;
        if ($("#txtCashRecieved").val() != '') {
            cash = $("#txtCashRecieved").val();
        }
        if (parseFloat(cash) == 0) {
            $('#creditcardCafeBeedar').text($('#totalCafeBeedar').text());
            $('#changeCafeBeedar').text('0');
        }
        else {
            $('#trCashCafeBeddar').show();
            $('#trCashLineCafeBeddar').show();
            $('#cashCafeBeedar').text(cash);
            $('#creditcardCafeBeedar').text(parseFloat($('#totalCafeBeedar').text()) - parseFloat(cash));
            $('#changeCafeBeedar').text('0');
        }
    }
    else if ($('#hfPaymentType').val() == '2') {
        $('#changeCafeBeedar').text('0');
        $('#trCreditCafeBeddar').show();
        $('#trCreditLineCafeBeddar').show();
        $('#cardCafeBeedar').text($('#totalCafeBeedar').text());
    }

    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFeeCafeBeedar").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRowCafeBedaar").style.display = "table-row";
    }

    $.print("#dvInvoiceCafeBedaar");
}
function ReprintInvoice3() {
    $("#lblComapnyEmail").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote3").text($("#ltrlSlipNoteID").text());
    var colspan = 3;
    $('#tdTotal3').attr('colspan', colspan);
    $('#tdTotal23').attr('colspan', colspan);
    $('#tdGst23').attr('colspan', colspan);
    $('#tdGstCredit2').attr('colspan', colspan);
    $('#tdExclusiveTax3').attr('colspan', colspan);
    $('#tdDiscout3').attr('colspan', colspan);
    $('#tdGst3').attr('colspan', colspan);
    $('#tdGstCredit3').attr('colspan', colspan);
    $('#tdServiceCharges3').attr('colspan', colspan);
    $('#tdPOSFee3').attr('colspan', colspan);
    $('#tdNetTotal3').attr('colspan', colspan);
    $('#tdGrandTotal3').attr('colspan', colspan);
    $('#tdGrandTotal23').attr('colspan', colspan);
    $('#tdPaymentIn3').attr('colspan', colspan);
    $('#tdChange3').attr('colspan', colspan);
    $('#tdBalance3').attr('colspan', colspan);
    $('#tdAdvance3').attr('colspan', colspan);
    $('#tdAdvanceBalance3').attr('colspan', colspan);
    $('#tdAdvancepayment3').attr('colspan', colspan);

    $('#rowAdvance3').hide();
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal3").style.display = "none";
        document.getElementById("trTotal23").style.display = "table-row";
        document.getElementById("GstRow3").style.display = "none";
        document.getElementById("GstRow23").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax3").style.display = "table-row";
        document.getElementById("GrandTotalRow3").style.display = "none";
        document.getElementById("GrandTotalRow23").style.display = "table-row";
    }
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    $('#OrderInvoice3').show();
    $('#OrderInvoiceName3').show();
    $('#BillNoName3').show();
    $('#BillNo3').show();
    $('#CompanyAddress3').show();
    $('#CompanyNumber3').show();
    $('#imgLogo23').show();
    document.getElementById('imgLogo23').src = document.getElementById('imgLogo2').src;
    $("#SaleInvoiceText3").text("Duplicate Bill");
    $("#CustomerType3").text($("#hfCustomerType").val());
    $("#InvoiceDate3").text($("#hfCurrentWorkDate").val());
    if ($("#hfRegNo").val() == "") {
        document.getElementById('RegNo3').style.display = "none";
    }
    else {
        $('#RegNo3').text($("#hfTaxAuthorityLabel2").val() + ' : ' + $("#hfRegNo").val());
        $('#RegNo3').show();
    }
    if ($("#hfSTRN").val() == "") {
        document.getElementById('spSTRN3').style.display = "none";
    }
    else {
        $('#spSTRN3').show();
    }
    document.getElementById('trKOTNo3').style.display = "none";
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
        document.getElementById('trKOTNo3').style.display = "block";
        $("#KOTNo3").text("KOT No:" + $("#txtManualOrderNo").val());
    }
    else {
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($('#hfCustomerDetail').val().length > 0) {
            $("#CustomerDetail3").text($('#hfCustomerDetail').val());
            $('#CustomerDetail3').show();
        }
        else {
            $('#CustomerDetail3').hide();
            $("#CustomerDetail3").text('');
        }
        document.getElementById('OrderTakerName3').style.display = "none";
        document.getElementById('OrderTaker3').style.display = "none";
        document.getElementById('CoverTable3').style.display = "none";
        document.getElementById('InvoiceTableName3').style.display = "none";
        document.getElementById('InvoiceTable3').style.display = "none";
    }
    else if (document.getElementById("hfCustomerType").value == "Delivery") {
        $("#OrderTakerName3").text("D-M:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker3").text(OTaker.substring(0, 10));
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail3").text(CDetail.substring(0, 32));
        $("#InvoiceTableName3").text("Ph:");
        $('#OrderTakerName3').show();
        $('#OrderTaker3').show();
        $('#CustomerDetail3').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable3').show();
        document.getElementById('CoverTable3').style.display = "none";
    }
    else {
        $("#OrderTakerName3").text("O-T:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker3").text(OTaker.substring(0, 10));
        $("#CoverTable3").text($("#txtCoverTable").val());
        if ($("#hfEatIn").val() == "1") {
            $("#InvoiceTableName3").text("");
            $("#InvoiceTable3").text("");
        }
        else {
            $("#InvoiceTableName3").text("Table No:");
            $("#InvoiceTable3").text($("#TableNo1").text());
        }
        $('#OrderTakerName3').show();
        $('#OrderTaker3').show();
        $('#CoverTable3').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable3').show();
        if ($('#hfCustomerDetail').val().length > 0) {
            $("#CustomerDetail3").text($('#hfCustomerDetail').val());
            $('#CustomerDetail3').show();
        }
        else {
            $('#CustomerDetail3').hide();
            $("#CustomerDetail3").text('');
        }
    }
    $("#BillNo3").text($("#OrderNo1").text());
    //#region Products Detail
    $('#invoiceDetailBody3').empty(); // clear all skus  from invoice
    var row = "";
    var totalamountWithGST = 0;
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = orderedProducts[i].AMOUNT;
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT).toFixed(2);
        }
        if (qty > 0) {
            if ($("#hfBillFormat").val() === "2") {
                var GstInclusive = $('#hfSalesTax').val();
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100);
                var amountWithGST = parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].T_PRICE.toString().indexOf(".") > 0) {
                    priceWithGST = parseFloat(priceWithGST).toFixed(2);
                    amountWithGST = parseFloat(amountWithGST).toFixed(2);
                }
                if (orderedProducts[i].MODIFIER == "true") {
                    if (priceWithGST > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                }
            }
            else {
                if (orderedProducts[i].MODIFIER == "true") {
                    if (tprice > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                }
            }
            $('#invoiceDetailBody3').append(row);
        }
    }
    //#endregion Products Detail
    var Gst = 0;
    Gst = document.getElementById("hfSalesTax").value;
    $("#GST-text3").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    $("#GST-text23").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    if (Gst == "")
    { Gst = 0; }
    $("#TotalValue5").text($("#subTotal").text());
    $("#TotalValue23").text(parseFloat(totalamountWithGST).toFixed(0));
    $("#GrandTotal-value5").text(parseFloat($("#GrandTotal").text()) + parseFloat($("#hfPOSFee").val()));
    var amountDue = $("#subTotal").text();
    var text = "";
    var ServicePer = 0;
    if (orderedProducts[0].SERVICE_CHARGES_TYPE === "0") {
        ServicePer = parseInt(parseFloat(orderedProducts[0].SERVICE_CHARGES) / parseFloat(orderedProducts[0].AMOUNTDUE) * 100)
    }
    //When Discount not enter through Print invoice POpUP-----------------
    if ($("#lblDiscountTotal").text() === "0") {
        Gst = $("#hfSalesTaxValue").val();
        $("#Discount-text3").text(text);
        $("#Gst-value4").text($("#hfSalesTaxValue").val());
        $("#Gst-value23").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text4").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow3").style.display = "none";
        }
        $("#GrandTotal-value5").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));
        $("#Discount-value4").text(text);

        ShowHideInvoiceFootDiscount3("false");
    }
    else {
        var discount = $("#lblDiscountTotal").text();
        Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);

        if ($("#hfDiscountType").val() == "0") {
            var dic = "Discount @" + $("#txtDiscount").val() + " % :";
            $("#Discount-text3").text(dic);
        }
        else {
            if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0) {
                var dis = (parseFloat($('#hfITEM_DISCOUNT').val()) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text3").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text3").text('Discount :');
            }
        }

        $("#Gst-value4").text($("#hfSalesTaxValue").val());
        $("#Gst-value23").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text4").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow3").style.display = "none";
        }
        $("#Discount-value4").text($("#lblDiscountTotal").text());
        $("#GrandTotal-value5").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));
        ShowHideInvoiceFootDiscount3("true");
    }
    if ($('#hfPaymentType').val() == "1") {//For Credit Card Payment
        $("#PayIn-text3").text('Payment IN :');
        var cash = $("#txtCashRecieved").val();
        var credit = $("#lblPaymentDue").text();
        var credit = credit - cash;
        if (cash > 0) {
            $("#PayType3").text('MOP: Mixed');
            $("#PayIn-value3").text($("#txtCashRecieved").val());
            $("#balance-text3").text('Credit Card:');
            $("#balance-value3").text(parseFloat(credit) - parseFloat($("#hfPOSFee").val()))
            $("#balance-text23").text('Balance :');
            $("#balance-value23").text(0);
        }
        else {
            $("#PayType3").text('MOP: Credit Card');
            $("#PayIn-value3").text(credit);
            $("#balance-text3").text('Balance :');
            $("#balance-value3").text(0);
            $("#balance-text23").text(text);
            $("#balance-value23").text(text);
        }
    }
    else if ($('#hfPaymentType').val() == "2") {
        $("#PayIn-text3").text('Payment IN :');
        $("#PayType3").text('MOP: Credit');
        $("#PayIn-value3").text(0);
        $("#balance-text3").text('Balance :');
        $("#balance-value3").text(parseFloat($("#GrandTotal-value5").text()) * -1 - parseFloat($("#hfPOSFee").val()));
        $("#balance-text23").text(text);
        $("#balance-value23").text(text);
    }
    else if ($('#hfPaymentType').val() == "3")
    {
        $("#PayType3").text('MOP: Easypaisa');
    }
    else if ($('#hfPaymentType').val() == "4") {
        $("#PayType3").text('MOP: Jaz Cash');
    }
    else if ($('#hfPaymentType').val() == "5") {
        $("#PayType3").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType3").text('MOP: Cash');
        $("#PayIn-text3").text('Payment IN :');
        $("#balance-text3").text('Change :');
        $("#balance-text23").text(text);
        $("#PayIn-value3").text($("#txtCashRecieved").val());
        $("#balance-value3").text(parseFloat($("#lblBalance").text()) - parseFloat($("#hfPOSFee").val()));
        $("#balance-value23").text(text);
    }
    ShowHideInvoiceFootGstReprint3(Gst);
    ShowHideInvoiceFootTotal3(Gst, $("#lblDiscountTotal").text());
    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue23").text();
        var tax = 0;
        tax = $("#Gst-value23").text();
        var discount = $("#Discount-value4").text();
        var service = $("#Service-value").text();
        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
        if (service == '') {
            service = 0;
        }
        $("#ExclusiveST-value3").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value23").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        if (discount == 0) {
            $("#GrandTotal-text23").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text23").text("Amount after Disc. :");
        }
    }
    var GstInfoValue = 0;
    GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
    GstInfoValue = parseFloat(amountDue) - GstInfoValue;
    $("#lblGSTInfo3").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    $('#BillNoName3').show();
    $('#BillNo3').show();
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName3').style.display = "none";
        document.getElementById('BillNo3').style.display = "none";
    }
    var TotalDiscount = 0;
    var TotalSC = 0;
    try {
        TotalDiscount = $("#Discount-value4").text();
    } catch (e) {
        TotalDiscount = 0;
    }
    if (TotalDiscount == '') {
        TotalDiscount = 0;
    }
    try {
        TotalSC = $("#Service-value4").text();
    } catch (e) {
        TotalSC = 0;
    }
    if (TotalSC == '') {
        TotalSC = 0;
    }
    $("#NetTotal-value3").text(parseFloat($("#TotalValue5").text()) - parseFloat(TotalDiscount) + parseFloat(TotalSC));
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value3").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow3").style.display = "table-row";
    }
    $.print("#dvSaleInvoice3");
}
function ReprintInvoice4() {
    $("#LocationName4").text($("#hfLocationName").val());
    $("#lblComapnyEmail4").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote4").text($("#ltrlSlipNoteID").text());
    var colspan = 3;
    $('#tdTotal4').attr('colspan', colspan);
    $('#tdTotal24').attr('colspan', colspan);
    $('#tdGst24').attr('colspan', colspan);
    $('#tdGstCredit24').attr('colspan', colspan);
    $('#tdExclusiveTax4').attr('colspan', colspan);
    $('#tdDiscout4').attr('colspan', colspan);
    $('#tdGst4').attr('colspan', colspan);
    $('#tdGstCredit4').attr('colspan', colspan);
    $('#tdPOSFeeSaj').attr('colspan', colspan);
    $('#tdServiceCharges4').attr('colspan', colspan);
    $('#tdNetTotal4').attr('colspan', colspan);
    $('#tdGrandTotal4').attr('colspan', colspan);
    $('#tdGrandTotal24').attr('colspan', colspan);
    $('#tdPaymentIn4').attr('colspan', colspan);
    $('#tdChange4').attr('colspan', colspan);
    $('#tdBalance4').attr('colspan', colspan);
    $('#tdAdvance4').attr('colspan', colspan);
    $('#tdAdvanceBalance4').attr('colspan', colspan);
    $('#tdAdvancepayment4').attr('colspan', colspan);

    $('#rowAdvance4').hide();
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal4").style.display = "none";
        document.getElementById("trTotal24").style.display = "table-row";
        document.getElementById("GstRow4").style.display = "none";
        document.getElementById("GstRow24").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax4").style.display = "table-row";
        document.getElementById("GrandTotalRow4").style.display = "none";
        document.getElementById("GrandTotalRow24").style.display = "table-row";
    }
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    $('#OrderInvoice4').show();
    $('#OrderInvoiceName4').show();
    $('#CompanyAddress4').text($('#CompanyAddress').text());
    $('#CompanyNumber4').text($("#hfPhoneNo").val());
    $('#imgLogo24').show();
    document.getElementById('imgLogo24').src = document.getElementById('imgLogo2').src;
    $("#SaleInvoiceText4").text("Duplicate Bill");
    $("#CustomerType4").text($("#hfCustomerType").val());
    $("#InvoiceDate4").text($("#hfCurrentWorkDate").val());
    if ($("#hfRegNo").val() == "") {
        document.getElementById('RegNo4').style.display = "none";
    }
    else {
        $('#RegNo4').show();
        $('#RegNo4').text($("#hfTaxAuthorityLabel2").val() + " : " + $("#hfRegNo").val());
    }
    if ($("#hfSTRN").val() == "") {
        document.getElementById('spSTRN4').style.display = "none";
    }
    else {
        $('#spSTRN4').show();
        $('#spSTRN4').text("STRN : " + $("#hfSTRN").val());
    }
    document.getElementById('trKOTNo4').style.display = "none";
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice4").text($("#MaxOrderNo").text());
        document.getElementById('trKOTNo4').style.display = "block";
        $("#KOTNo4").text("KOT No:" + $("#txtManualOrderNo").val());
    }
    else {
        $("#OrderInvoice4").text($("#MaxOrderNo").text());
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        var CDetail = $("#hfTableNo").val();
        if (CDetail.length > 0) {            
            $("#CustomerDetail4").text("Customer :" + CDetail.substring(0, 32));
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
        }
        else {
            $('#CustomerPhoneNo').hide();
            $('#CustomerDetail4').hide();
            $("#CustomerDetail4").text('');
        }
        document.getElementById('OrderTakerName4').style.display = "none";
        document.getElementById('OrderTaker4').style.display = "none";
        document.getElementById('CoverTable4').style.display = "none";
        document.getElementById('InvoiceTableName4').style.display = "none";
        document.getElementById('InvoiceTable4').style.display = "none";
    }
    else if (document.getElementById("hfCustomerType").value == "Delivery") {
        $("#OrderTakerName4").text("D-M:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker4").text(OTaker.substring(0, 10));
        var CDetail = $("#hfTableNo").val();
        if (CDetail.length > 0) {

            $("#CustomerDetail4").text("Customer: " + CDetail.substring(0, 32));
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
        }
        else {
            $('#CustomerPhoneNo').hide();
            $('#CustomerDetail4').hide();
            $("#CustomerDetail4").text('');
        }
        $("#InvoiceTableName4").text("Ph:");
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        document.getElementById('CoverTable4').style.display = "none";
    }
    else {
        $("#OrderTakerName4").text("O-T:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker4").text(OTaker.substring(0, 10));
        $("#CoverTable4").text($("#txtCoverTable").val());
        if ($("#hfEatIn").val() == "1") {
            $("#InvoiceTableName4").text("");
            $("#InvoiceTable4").text("");
        }
        else {
            $("#InvoiceTableName4").text("Table No:");
            $("#InvoiceTable4").text($("#TableNo1").text());
        }
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#CoverTable4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        var CDetail = $("#hfTableNo").val();
        if (CDetail.length > 0) {

            $("#CustomerDetail4").text("Customer: " + CDetail.substring(0, 32));
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
        }
        else {
            $('#CustomerPhoneNo').hide();
            $('#CustomerDetail4').hide();
            $("#CustomerDetail4").text('');
        }
    }
    $("#BillNo4").text("BILL NO: " + $("#OrderNo1").text());
    //#region Products Detail
    $('#invoiceDetailBody4').empty(); // clear all skus  from invoice
    var row = "";
    var totalamountWithGST = 0;
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = orderedProducts[i].AMOUNT;
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT).toFixed(2);
        }
        if (qty > 0) {
            if ($("#hfBillFormat").val() === "2") {
                var GstInclusive = $('#hfSalesTax').val();
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100);
                var amountWithGST = parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].T_PRICE.toString().indexOf(".") > 0) {
                    priceWithGST = parseFloat(priceWithGST).toFixed(2);
                    amountWithGST = parseFloat(amountWithGST).toFixed(2);
                }
                if (orderedProducts[i].MODIFIER == "true") {
                    if (priceWithGST > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                }
            }
            else {
                if (orderedProducts[i].MODIFIER == "true") {
                    if (tprice > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                }
            }
            $('#invoiceDetailBody4').append(row);
        }
    }
    //#endregion Products Detail
    var Gst = 0;
    Gst = document.getElementById("hfSalesTax").value;
    $("#GST-text4").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    $("#GST-text24").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    if (Gst == "")
    { Gst = 0; }
    $("#TotalValue6").text($("#subTotal").text());
    $("#TotalValue24").text(parseFloat(totalamountWithGST).toFixed(0));
    $("#GrandTotal-value6").text(parseFloat($("#GrandTotal").text()) + parseFloat($("#hfPOSFee").val()));
    var amountDue = $("#subTotal").text();
    var text = "";
    var ServicePer = 0;
    if (orderedProducts[0].SERVICE_CHARGES_TYPE === "0") {
        ServicePer = parseInt(parseFloat(orderedProducts[0].SERVICE_CHARGES) / parseFloat(orderedProducts[0].AMOUNTDUE) * 100)
    }
    //When Discount not enter through Print invoice POpUP-----------------
    if ($("#lblDiscountTotal").text() === "0") {
        Gst = $("#hfSalesTaxValue").val();
        $("#Discount-text4").text(text);
        $("#Gst-value5").text($("#hfSalesTaxValue").val());
        $("#Gst-value24").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text5").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text5").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow4").style.display = "none";
        }
        $("#GrandTotal-value6").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));
        $("#Discount-value5").text(text);

        ShowHideInvoiceFootDiscount4("false");
    }
    else {
        var discount = $("#lblDiscountTotal").text();
        Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);
        if ($("#hfDiscountType").val() == "0") {
            var dic = "Discount @" + $("#txtDiscount").val() + " % :";
            $("#Discount-text4").text(dic);
        }
        else {
            if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0) {
                var dis = (parseFloat($('#hfITEM_DISCOUNT').val()) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text4").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text4").text('Discount :');
            }
        }

        $("#Gst-value5").text($("#hfSalesTaxValue").val());
        $("#Gst-value24").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text5").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text5").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow4").style.display = "none";
        }
        $("#Discount-value5").text($("#lblDiscountTotal").text());
        $("#GrandTotal-value6").text(parseFloat($("#lblPaymentDue").text()) + parseFloat($("#hfPOSFee").val()));
        ShowHideInvoiceFootDiscount4("true");
    }
    if ($('#hfPaymentType').val() == "1") {//For Credit Card Payment
        $("#PayIn-text4").text('Tendered-Amt:');
        var cash = $("#txtCashRecieved").val();
        var credit = $("#lblPaymentDue").text();
        var credit = credit - cash;
        if (cash > 0) {
            $("#PayType4").text('MOP: Mixed');
            $("#PayIn-value4").text($("#txtCashRecieved").val());
            $("#balance-text4").text('Credit Card:');
            $("#balance-value4").text(parseFloat(credit) - parseFloat($("#hfPOSFee").val()))
            $("#balance-text24").text('Balance :');
            $("#balance-value24").text(0);
        }
        else {
            $("#PayType4").text('MOP: Credit Card');
            $("#PayIn-value4").text(credit);
            $("#balance-text4").text('Change Due:');
            $("#balance-value4").text(0);
            $("#balance-text24").text(text);
            $("#balance-value24").text(text);
        }
    }
    else if ($('#hfPaymentType').val() == "2") {
        $("#PayIn-text4").text('Tendered-Amt:');
        $("#PayType4").text('MOP: Credit');
        $("#PayIn-value4").text(0);
        $("#balance-text4").text('Change Due:');
        $("#balance-value4").text(parseFloat($("#GrandTotal-value6").text()) * -1 - (parseFloat($("#hfPOSFee").val())));
        $("#balance-text24").text(text);
        $("#balance-value24").text(text);
    }
    else if ($('#hfPaymentType').val() == "3") {
        $("#PayType4").text('MOP: Easypaisa');
    }
    else if ($('#hfPaymentType').val() == "4") {
        $("#PayType4").text('MOP: Jaz Cash');
    }
    else if ($('#hfPaymentType').val() == "5") {
        $("#PayType4").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType4").text('MOP: Cash');
        $("#PayIn-text4").text('Tendered-Amt:');
        $("#balance-text4").text('Change Due:');
        $("#balance-text24").text(text);
        $("#PayIn-value4").text($("#txtCashRecieved").val());
        $("#balance-value4").text(parseFloat($("#lblBalance").text()) - parseFloat($("#hfPOSFee").val()));
        $("#balance-value24").text(text);
    }
    ShowHideInvoiceFootGstReprint4(Gst);
    ShowHideInvoiceFootTotal4(Gst, $("#lblDiscountTotal").text());
    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue24").text();
        var tax = 0;
        tax = $("#Gst-value24").text();
        var discount = $("#Discount-value5").text();
        var service = $("#Service-value").text();
        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
        if (service == '') {
            service = 0;
        }
        $("#ExclusiveST-value4").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value24").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        if (discount == 0) {
            $("#GrandTotal-text24").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text24").text("Amount after Disc. :");
        }
    }
    var GstInfoValue = 0;
    GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
    GstInfoValue = parseFloat(amountDue) - GstInfoValue;
    $("#lblGSTInfo4").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    var TotalDiscount = 0;
    var TotalSC = 0;
    try {
        TotalDiscount = $("#Discount-value5").text();
    } catch (e) {
        TotalDiscount = 0;
    }
    if (TotalDiscount == '') {
        TotalDiscount = 0;
    }
    try {
        TotalSC = $("#Service-value5").text();
    } catch (e) {
        TotalSC = 0;
    }
    if (TotalSC == '') {
        TotalSC = 0;
    }
    $("#NetTotal-value4").text(parseFloat($("#TotalValue6").text()) - parseFloat(TotalDiscount) + parseFloat(TotalSC));
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-valueSaj").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRowSaj").style.display = "table-row";
    }
    $.print("#dvSaleInvoice4");
}
function ReprintInvoice5() {
    $("#ltrlSlipNote5").text($("#ltrlSlipNoteID").text());
    var colspan = 3;
    $('#tdTotal5').attr('colspan', colspan);
    $('#tdTotal25').attr('colspan', colspan);
    $('#tdGst25').attr('colspan', colspan);
    $('#tdGstCredit25').attr('colspan', colspan);
    $('#tdDiscout5').attr('colspan', colspan);
    $('#tdGst5').attr('colspan', colspan);
    $('#tdGstCredit5').attr('colspan', colspan);
    $('#tdServiceCharges5').attr('colspan', colspan);
    $('#tdGrandTotal5').attr('colspan', colspan);
    $('#tdPaymentIn5').attr('colspan', colspan);
    $('#tdChange5').attr('colspan', colspan);
    $('#tdBalance5').attr('colspan', colspan);
    $('#tdAdvance5').attr('colspan', colspan);
    $('#tdAdvanceBalance5').attr('colspan', colspan);
    $('#tdAdvancepayment5').attr('colspan', colspan);

    $('#rowAdvance5').hide();
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal5").style.display = "none";
        document.getElementById("trTotal25").style.display = "table-row";
        document.getElementById("GstRow5").style.display = "none";
        document.getElementById("GstRow25").style.display = "table-row";
        document.getElementById("GrandTotalRow5").style.display = "none";
    }
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    $('#imgLogo5').show();
    document.getElementById('imgLogo5').src = document.getElementById('imgLogo2').src;
    $("#SaleInvoiceText5").text("Duplicate Bill");
    $("#InvoiceDate5").text($("#hfCurrentWorkDate").val());
    $("#CustomerType5").text($("#hfCustomerType").val());

    //#region Products Detail
    $('#invoiceDetailBody5').empty(); // clear all skus  from invoice
    var row = "";
    var totalamountWithGST = 0;
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = orderedProducts[i].AMOUNT;
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT).toFixed(2);
        }
        if (qty > 0) {
            if ($("#hfBillFormat").val() === "2") {
                var GstInclusive = $('#hfSalesTax').val();
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100);
                var amountWithGST = parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].T_PRICE.toString().indexOf(".") > 0) {
                    priceWithGST = parseFloat(priceWithGST).toFixed(2);
                    amountWithGST = parseFloat(amountWithGST).toFixed(2);
                }
                if (orderedProducts[i].MODIFIER == "true") {
                    if (priceWithGST > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td></tr>');
                }
            }
            else {
                if (orderedProducts[i].MODIFIER == "true") {
                    if (tprice > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                        row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                    }
                }
                else {
                    row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td></tr>');
                }
            }
            $('#invoiceDetailBody5').append(row);
        }
    }
    //#endregion Products Detail
    var Gst = 0;
    Gst = document.getElementById("hfSalesTax").value;
    $("#GST-text5").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    $("#GST-text25").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + Gst + " % :");
    if (Gst == "")
    { Gst = 0; }
    $("#TotalValue7").text($("#subTotal").text());
    $("#TotalValue25").text(parseFloat(totalamountWithGST).toFixed(0));
    $("#GrandTotal-value7").text($("#GrandTotal").text());
    var amountDue = $("#subTotal").text();
    var text = "";
    var ServicePer = 0;
    $("#Service-value7").text(orderedProducts[0].SERVICE_CHARGES);
    if (orderedProducts[0].SERVICE_CHARGES_TYPE === "0") {
        ServicePer = parseInt(parseFloat(orderedProducts[0].SERVICE_CHARGES) / parseFloat(orderedProducts[0].AMOUNTDUE) * 100)
    }
    //When Discount not enter through Print invoice POpUP-----------------
    if ($("#lblDiscountTotal").text() === "0") {
        Gst = $("#hfSalesTaxValue").val();
        $("#Discount-text5").text(text);
        $("#Gst-value6").text($("#hfSalesTaxValue").val());
        $("#Gst-value25").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text6").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow5").style.display = "none";
        }
        $("#GrandTotal-value7").text($("#lblPaymentDue").text());
        $("#Discount-value6").text(text);
        ShowHideInvoiceFootDiscount4("false");
    }
    else {
        var discount = $("#lblDiscountTotal").text();
        Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);
        if ($("#hfDiscountType").val() == "0") {
            var dic = "Discount @" + $("#txtDiscount").val() + " % :";
            $("#Discount-text5").text(dic);
        }
        else {
            if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0) {
                var dis = (parseFloat($('#hfITEM_DISCOUNT').val()) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text5").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text5").text('Discount :');
            }
        }
        $("#Gst-value6").text($("#hfSalesTaxValue").val());
        $("#Gst-value25").text($("#hfSalesTaxValue").val());
        $("#lblGSTTotal").text(Math.round(Gst, 0));
        if ($('#hfServiceCharges').val() != "0") {
            if ($('#hfServiceType').val() == "0") {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " @" + ServicePer + " % :");
            }
            else {
                $("#Service-text6").text("Service Charges :");
            }
        }
        else {
            document.getElementById("ServiceChargesRow5").style.display = "none";
        }
        $("#Discount-value6").text($("#lblDiscountTotal").text());
        $("#GrandTotal-value7").text($("#lblPaymentDue").text());
        ShowHideInvoiceFootDiscount4("true");
    }
    if ($('#hfPaymentType').val() == "1") {//For Credit Card Payment
        $("#PayIn-text6").text('Tendered-Amt:');
        var cash = $("#txtCashRecieved").val();
        var credit = $("#lblPaymentDue").text();
        var credit = credit - cash;
        if (cash > 0) {
            $("#PayType5").text('MOP: Mixed');
            $("#PayIn-value5").text($("#txtCashRecieved").val());
            $("#balance-text5").text('Credit Card:');
            $("#balance-value5").text(credit)
            $("#balance-text25").text('Balance :');
            $("#balance-value25").text(0);
        }
        else {
            $("#PayType5").text('MOP: Credit Card');
            $("#PayIn-value5").text(credit);
            $("#balance-text5").text('Change Due:');
            $("#balance-value5").text(0);
            $("#balance-text25").text(text);
            $("#balance-value25").text(text);
        }
    }
    else if ($('#hfPaymentType').val() == "2") {
        $("#PayIn-text6").text('Tendered-Amt:');
        $("#PayType5").text('MOP: Credit');
        $("#PayIn-value5").text(0);
        $("#balance-text5").text('Change Due:');
        $("#balance-value5").text(parseFloat($("#GrandTotal-value7").text()) * -1);
        $("#balance-text25").text(text);
        $("#balance-value25").text(text);
    }
    else if ($('#hfPaymentType').val() == "3") {
        $("#PayType5").text('MOP: Easypaisa');
    }
    else if ($('#hfPaymentType').val() == "4") {
        $("#PayType5").text('MOP: Jaz Cash');
    }
    else if ($('#hfPaymentType').val() == "5") {
        $("#PayType5").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType5").text('MOP: Cash');
        $("#PayIn-text6").text('Tendered-Amt:');
        $("#balance-text5").text('Change Due:');
        $("#balance-text25").text(text);
        $("#PayIn-value5").text($("#txtCashRecieved").val());
        $("#balance-value5").text($("#lblBalance").text());
        $("#balance-value25").text(text);
    }
    ShowHideInvoiceFootGstReprint4(Gst);
    ShowHideInvoiceFootTotal4(Gst, $("#lblDiscountTotal").text());
    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue25").text();
        var tax = 0;
        tax = $("#Gst-value25").text();
        var discount = $("#Discount-value6").text();
        var service = $("#Service-value").text();
        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
        if (service == '') {
            service = 0;
        }
    }
    var GstInfoValue = 0;
    GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
    GstInfoValue = parseFloat(amountDue) - GstInfoValue;
    $("#lblGSTInfo5").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    var TotalDiscount = 0;
    var TotalSC = 0;
    try {
        TotalDiscount = $("#Discount-value6").text();
    } catch (e) {
        TotalDiscount = 0;
    }
    if (TotalDiscount == '') {
        TotalDiscount = 0;
    }
    try {
        TotalSC = $("#Service-value7").text();
    } catch (e) {
        TotalSC = 0;
    }
    if (TotalSC == '') {
        TotalSC = 0;
    }
    $("#NetTotal-value").text(parseFloat($("#TotalValue6").text()) - parseFloat(TotalDiscount) + parseFloat(TotalSC));
    $.print("#dvSaleInvoice5");
}
function CalculateBalance() {

    var balance = 0;
    var amountDue = 0;
    var discount = 0;
    var gst = 0;
    var service = 0;
    service = $("#Service-value").text();
    discount = document.getElementById('txtDiscount').value;

    var discountType = $('#hfDiscountType').val(); //  document.getElementById("hfDiscountType").value;
    var cashRcd = 0;

    cashRcd = document.getElementById('txtCashRecieved').value;
    var grandTotal = 0;
    grandTotal = $("#GrandTotal").text();
    gst = document.getElementById("hfSalesTax").value;
    $("#GST-text3").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + gst + " % :");
    $("#GST-text23").text(document.getElementById("hfTaxAuthorityLabel").value + " @" + gst + " % :");
    $("#lblBalance").text('');
    $("#lblPaymentDue").text('');

    if ((discount == "")) {
        discount = 0;
    }
    if ((cashRcd == "")) {
        cashRcd = 0;
    }
    if ((gst == "")) {
        gst = 0;
    }
    if (service == "") {
        service = 0;
    }
    if (discountType == 0) {
        gst = $("#hfSalesTaxValue").val();
        if ($("#hfBillFormat").val() === "3") {
            discount = (parseFloat(grandTotal) + parseFloat(gst)) * parseFloat(discount / 100);
        }
        else {
            discount = parseFloat(grandTotal) * parseFloat(discount / 100);
        }
        if (parseFloat($('#hfITEM_DISCOUNT').val()) > 0)
        {
            discount = parseFloat($('#hfITEM_DISCOUNT').val());
        }
        balance = Math.round((grandTotal - discount + parseFloat(service) + parseFloat(gst)), 0);
        amountDue = Math.round(balance, 0);
        balance = cashRcd - balance;

    }
    else if (discountType == 1) {
        gst = $("#hfSalesTaxValue").val();
        balance = parseFloat(grandTotal) + parseFloat(service) + parseFloat(gst) - parseFloat(discount);
        amountDue = Math.round(balance, 0);
        balance = Math.round((cashRcd - balance), 0);
    }
    else {
        gst = $("#hfSalesTaxValue").val();
        balance = parseFloat(grandTotal) + parseFloat(gst) + parseFloat(service);
        amountDue = parseFloat(balance) - parseFloat(discount);
        balance = Math.round((cashRcd - amountDue), 0);
    }

    if (cashRcd == 0) {
        balance = 0;
    }
    $("#lblDiscountTotal").text(parseFloat(discount).toFixed(0));
    $("#lblGSTTotal").text(parseFloat(gst).toFixed(0));
    $("#lblBalance").text(parseFloat(balance).toFixed(0));
    $("#lblPaymentDue").text(parseFloat(amountDue).toFixed(0));
}
function storeTblValues() {
    var tableData = new Array();
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(9)').text() == "2") {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "SKU_NAME": $(tr).find('td:eq(1)').text(),
                //2 for +
                "QTY": $(tr).find('td:eq(2) input').val(),
                //4 for -
                "T_PRICE": $(tr).find('td:eq(3)').text(),
                "DISCOUNTItemWise": $(tr).find('td:eq(4)').text(),
                "AMOUNT": $(tr).find('td:eq(5)').text(),
                "CAT_ID": $(tr).find('td:eq(6)').text(),
                "INVOICE_ID": $(tr).find('td:eq(7)').text(),
                "IS_DESC": $(tr).find('td:eq(8)').text(),
                "DESC": $(tr).find('td:eq(9)').text(),
                "A_PRICE": $(tr).find('td:eq(11)').text(),
                "I_D_ID": $(tr).find('td:eq(12)').text(),
                "DEAL_QTY": $(tr).find('td:eq(13)').text(),
                "DEAL_NAME": $(tr).find('td:eq(15)').text(),
                "SERVICE_CHARGES_TYPE": $(tr).find('td:eq(17)').text(),
                "SERVICE_CHARGES": $(tr).find('td:eq(18)').text(),
                "AMOUNTDUE": $(tr).find('td:eq(19)').text(),
                "MODIFIER": $(tr).find('td:eq(20)').text(),
                "MODIFIER_PARENT_ID": $(tr).find('td:eq(21)').text(),
                "ModifierParetn_Row_ID": $(tr).find('td:eq(22)').text(),
                "CUSTOMER_NAME": $(tr).find('td:eq(23)').text(),
                "DiscountRemarks": $(tr).find('td:eq(24)').text(),
                "DISCOUNTDeal": $(tr).find('td:eq(25)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(26)').text()
            }
        }
        else {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "SKU_NAME": $(tr).find('td:eq(1)').text(),
                //2 for +
                "QTY": $(tr).find('td:eq(2) input').val(),
                //4 for -
                "T_PRICE": $(tr).find('td:eq(3)').text(),
                "DISCOUNTItemWise": $(tr).find('td:eq(4)').text(),
                "AMOUNT": $(tr).find('td:eq(5)').text(),
                "CAT_ID": $(tr).find('td:eq(6)').text(),
                "INVOICE_ID": $(tr).find('td:eq(7)').text(),
                "IS_DESC": $(tr).find('td:eq(8)').text(),
                "DESC": $(tr).find('td:eq(9)').text(),
                "A_PRICE": $(tr).find('td:eq(11)').text(),
                "I_D_ID": $(tr).find('td:eq(12)').text(),
                "DEAL_QTY": $(tr).find('td:eq(13)').text(),
                "DEAL_NAME": $(tr).find('td:eq(15)').text(),
                "SERVICE_CHARGES_TYPE": $(tr).find('td:eq(17)').text(),
                "SERVICE_CHARGES": $(tr).find('td:eq(18)').text(),
                "AMOUNTDUE": $(tr).find('td:eq(19)').text(),
                "MODIFIER": $(tr).find('td:eq(20)').text(),
                "MODIFIER_PARENT_ID": $(tr).find('td:eq(21)').text(),
                "ModifierParetn_Row_ID": $(tr).find('td:eq(22)').text(),
                "CUSTOMER_NAME": $(tr).find('td:eq(23)').text(),
                "DiscountRemarks": $(tr).find('td:eq(24)').text(),
                "DISCOUNTDeal": $(tr).find('td:eq(25)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(26)').text()
            }
        }
    });
    return tableData;
}
function Error(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Error', 'type': 'error' });
}
function Succes(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Success', 'type': 'information' });
}
function onlyNumbers(txt, event) {
    var charCode = (event.which) ? event.which : event.keyCode;

    if (charCode == 9 || charCode == 8) {
        return true;
    }
    if (charCode == 46) {
        return false;
    }
    if (charCode == 31 || charCode < 48 || charCode > 57)
        return false;

    return true;
}
function ShowHideInvoiceFootGstReprint(Gst) {
    document.getElementById("trGSTInfo").style.display = "none";
    if (Gst == 0) {
        document.getElementById("GstRow").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "3") {
            document.getElementById("GstRow").style.display = "none";
            document.getElementById("trGSTInfo").style.display = "table-row";
        }
        else {
            if ($("#hfBillFormat").val() === "2") {
                document.getElementById("GstRow").style.display = "none";
            }
            else {
                document.getElementById("GstRow").style.display = "table-row";
            }
        }
    }
}
function ShowHideInvoiceFootDiscount(Discount) {

    if (Discount == "false") {
        document.getElementById("DiscountRow").style.display = "none";

    }
    else {
        document.getElementById("DiscountRow").style.display = "table-row";

    }
}
function ShowHideInvoiceFootTotal(Gst, Discount) {

    if ((Gst == 0) && (Discount == 0)) {

        document.getElementById("GrandTotalRow").style.display = "none";
    }
    else {
        document.getElementById("GrandTotalRow").style.display = "table-row";
    }
}
function ShowHideInvoiceFootGstReprint3(Gst) {
    document.getElementById("trGSTInfo3").style.display = "none";
    if (Gst == 0) {
        document.getElementById("GstRow3").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "3") {
            document.getElementById("GstRow3").style.display = "none";
            document.getElementById("trGSTInfo3").style.display = "table-row";
        }
        else {
            if ($("#hfBillFormat").val() === "2") {
                document.getElementById("GstRow3").style.display = "none";
            }
            else {
                document.getElementById("GstRow3").style.display = "table-row";
            }
        }
    }
}
function ShowHideInvoiceFootDiscount3(Discount) {

    if (Discount == "false") {
        document.getElementById("DiscountRow3").style.display = "none";

    }
    else {
        document.getElementById("DiscountRow3").style.display = "table-row";

    }
}
function ShowHideInvoiceFootTotal3(Gst, Discount) {

    if ((Gst == 0) && (Discount == 0)) {
        document.getElementById("GrandTotalRow3").style.display = "none";
    }
    else {
        document.getElementById("GrandTotalRow3").style.display = "table-row";
    }
}
function ShowHideInvoiceFootGstReprint4(Gst) {
    document.getElementById("trGSTInfo4").style.display = "none";
    if (Gst == 0) {
        document.getElementById("GstRow4").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "3") {
            document.getElementById("GstRow4").style.display = "none";
            document.getElementById("trGSTInfo4").style.display = "table-row";
        }
        else {
            if ($("#hfBillFormat").val() === "2") {
                document.getElementById("GstRow4").style.display = "none";
            }
            else {
                document.getElementById("GstRow4").style.display = "table-row";
            }
        }
    }
}
function ShowHideInvoiceFootDiscount4(Discount) {

    if (Discount == "false") {
        document.getElementById("DiscountRow4").style.display = "none";

    }
    else {
        document.getElementById("DiscountRow4").style.display = "table-row";

    }
}
function ShowHideInvoiceFootTotal4(Gst, Discount) {

    if ((Gst == 0) && (Discount == 0)) {
        document.getElementById("GrandTotalRow4").style.display = "none";
    }
    else {
        document.getElementById("GrandTotalRow4").style.display = "table-row";
    }
}