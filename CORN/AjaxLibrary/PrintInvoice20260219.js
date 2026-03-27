function PrintDeal(orderedProducts) {
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            var totalamount = 0;
            $('#tble-ordered-products').find('tr').each(function () {
                if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                    if (uniqueDeals[j] == $(this).find("td:eq(21)").text()) {
                        if (count == 0) {
                            count += 1;
                            totalamount = parseFloat($(this).find("td:eq(20)").text()) * parseFloat($(this).find("td:eq(27)").text());
                            if ($(this).find("td:eq(16)").text() == "true") {
                                var row = $(' <tr><td>' + $(this).find("td:eq(1)").text() + '<br />' + $(this).find("td:eq(17)").text() + '</td><td class="text-right">' + $(this).find("td:eq(3)").text() + '</td><td class="text-right">' + $(this).find("td:eq(20)").text() + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + $(this).find("td:eq(1)").text() + '</td><td class="text-right">' + $(this).find("td:eq(3)").text() + '</td><td class="text-right">' + $(this).find("td:eq(20)").text() + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            }
                            $('#invoiceDetailBody').append(row);
                            $('#invoiceDetailBody3').append(row);
                        }
                        return;
                    }
                }
            });
        }
    }
}

//Provissional Bill
function PrintSaleInvoice(tblProducts)
{
    if ($("#hfInvoiceFormat").val() === "2") {
        SaleInvoicePrint2(tblProducts);
    }
    else if ($("#hfInvoiceFormat").val() === "3") {
        SaleInvoicePrint3(tblProducts);
    }
    else if ($("#hfInvoiceFormat").val() === "4") {
        SaleInvoicePrint4(tblProducts);
    }
    else if ($("#hfInvoiceFormat").val() === "5") {
        SaleInvoicePrintCafeBedaar(tblProducts,0);
    }
    else {
        SaleInvoicePrint(tblProducts);
    }
}
function SaleInvoicePrint2(tblProducts) {
    $("#lblFacebkId").text($("#hfFacebkId").val());
    $("#GST-textCredit23").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#GST-text3").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-textCredit3").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#lblComapnyEmail").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote3").text($("#ltrlSlipNoteID").text());
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        document.getElementById("ServiceChargesRow3").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow3").style.display = "table-row";
    }
    document.getElementById("rowAdvance3").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount3").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount3").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer3").show();
        $("#tdGSTValue3").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer3").hide();
        $("#tdGSTValue3").hide();
    }
    $('#tdTotal3').attr('colspan', colspan);
    $('#tdTotal23').attr('colspan', colspan);
    $('#tdGst23').attr('colspan', colspan);
    $('#tdGstCredit23').attr('colspan', colspan);
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
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal3").style.display = "none";
        document.getElementById("trTotal23").style.display = "table-row";
        document.getElementById("GstRow3").style.display = "none";
        document.getElementById("GstRow23").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax3").style.display = "table-row";
        document.getElementById("GrandTotalRow3").style.display = "none";
        document.getElementById("GrandTotalRow23").style.display = "table-row";
    }
    document.getElementById('trNTN3').style.display = "none";
    document.getElementById('trOrderNotes3').style.display = "none";
    document.getElementById('trDiscReason3').style.display = "none";
    $("#GrandTotal-value5").text("");
    $("#lblOrderNotes3").text('');
    if ($("#hfShowNTNOnProvissionalBill").val() === "1") {
        document.getElementById('trNTN3').style.display = "table-row";
    }
    $("#InvoiceDate3").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#CustomerType3").text(document.getElementById("hfCustomerType").value);
    $("#Cashier3").text('Cashier: ' + $("#user-detail-bold").text());
    document.getElementById('trKOTNo3').style.display = "none";
    document.getElementById('trTakeawayOrderNo3').style.display = "none";
    document.getElementById('trOrderNo3').style.display = "table-row";
    document.getElementById("trCardAccountTitle3").style.display = "none";
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice3").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
        document.getElementById('trKOTNo3').style.display = "table-row";
        $("#KOTNo3").text("KOT No:" + $("#txtManualOrderNo").val());
    }
    else {
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($("#txtTakeawayCustomer").val() != "") {
            if ($('select#ddlCustomer option:selected').val() === '0') {
                $("#CustomerDetail3").text($("#txtTakeawayCustomer").val());
                $('#CustomerDetail3').show();
            }
            else {
                if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                    $("#CustomerDetail3").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
                }
                else {
                    $("#CustomerDetail3").text($('select#ddlCustomer option:selected').text());
                }
                $('#CustomerDetail3').show();
            }
        }
        $("#OrderTakerName3").text("O-T:");
        $('#OrderTakerName3').show();
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker3").text(OTaker);
        $('#OrderTaker3').show();
        $("#CoverTable3").text('Token ID: ' + $("#txtCoverTable").val());
        document.getElementById("CoverTable3").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName3').style.display = "none";
        document.getElementById('InvoiceTable3').style.display = "none";
        $("#spanTakeawayOrderNo3").text("Your Order No:" + $("#MaxOrderNo").text());
    }
    else if (document.getElementById("hfCustomerType").value == "Delivery") {
        $("#OrderTakerName3").text("D-M:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker3").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail3").text(CDetail);
        $("#InvoiceTableName3").text("Ph:");
        $('#OrderTakerName3').show();
        $('#OrderTaker3').show();
        $('#CustomerDetail3').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable3').show();
        $("#CoverTable3").text('');
        document.getElementById('trOrderNotes3').style.display = "table-row";
        $("#lblOrderNotes3").text($('#txtRemarks').val());
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable3").text('Token ID: ' + $("#txtCoverTable").val());
            $("#InvoiceTableName3").text("");
            $("#InvoiceTable3").text("");
        }
        else {
            $("#CoverTable3").text('Covers: ' + $("#txtCoverTable").val());
            $("#InvoiceTableName3").text("Table No:");
            $("#InvoiceTable3").text($("#TableNo1").text());
        }
        $("#OrderTakerName3").text("O-T:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker3").text(OTaker);
        document.getElementById("CoverTable3").setAttribute("style", "font-weight:normal;");
        $('#OrderTakerName3').show();
        $('#OrderTaker3').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable3').show();
        if ($('select#ddlCustomer option:selected').val() === '0') {
            $("#CustomerDetail3").text($("#txtTakeawayCustomer").val());
            $('#CustomerDetail3').show();
        }
        else {
            if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                $("#CustomerDetail3").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
            }
            else {
                $("#CustomerDetail3").text($('select#ddlCustomer option:selected').text());
            }
            $('#CustomerDetail3').show();
        }
    }
    $("#BillNo3").text($("#hfInvoiceNo").val());
    $('#BillNoName3').show();
    $('#BillNo3').show();
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#CompanyAddress3').show();
        $('#CompanyAddress3').text($("#hfAddress").val());
        $('#CompanyNumber3').show();
        $("#CompanyNumber3").text("Ph: " + $("#hfPhoneNo").val());
    }
    else {
        document.getElementById('CompanyAddress3').style.display = "none";
        document.getElementById('CompanyNumber3').style.display = "none";
    }
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo23').show();
        document.getElementById('imgLogo23').src = document.getElementById('imgLogo2').src;
    }
    else {
        document.getElementById('imgLogo23').style.display = "none";
    }
    document.getElementById('RegNo3').style.display = "none";
    document.getElementById('spSTRN3').style.display = "none";
    //#region Products Detail
    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN3').style.display = "none";
    }
    else {
        $('#spSTRN3').show();
        $('#spSTRN3').text("STRN : " + $("#hfSTRN").val());
    }
    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo3').style.display = "none";
    }
    else {
        $('#RegNo3').show();
        $('#RegNo3').text($("#hfTaxAuthorityLabel2").val() + ": " + $("#hfRegNo").val());
    }
    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody3').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody3').append(row);
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
                var GstInclusive = 0;
                if ($('#hfPaymentType2').val() == "1") {
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody3').append(row);
        }
    }
    sortTable3();
    var Gst = 0;
    if (parseFloat($('#hfCustomerGST').val()) > 0) {
        Gst = $('#hfCustomerGST').val();
    }
    else {
        if (document.getElementById('hfIsGSTVoid').value == '0') {
            if ($('#hfPaymentType2').val() == "1") {
                Gst = document.getElementById("hfSalesTaxCreditCard").value;
            }
            else {
                Gst = document.getElementById("hfSalesTax").value;
            }
        }
    }
    if (Gst == "")
    { Gst = 0; }
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (Gst > 0) {
            $("#SaleInvoiceText3").text("Sales Tax Invoice");
        }
        else {
            $("#SaleInvoiceText3").text("Sales Invoice");
        }
    }
    else {
        $("#SaleInvoiceText3").text("PRE RECEIPT");
    }
    $("#TotalValue5").text($("#subTotal").text());
    $("#TotalValue23").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = $("#subTotal").text();

    var text = "";
    $("#advance-text3").text(text);
    $("#advance-value3").text(text);
    $("#AdvanceBalance-text3").text(text);
    $("#AdvanceBalance-value3").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = $("#lblDiscountTotal2").text();
    if ($("#lblDiscountTotal2").text() == "0") {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val() - discount);
        }
        $("#Discount-text3").text(text);
        if ($('#hfPaymentType2').val() == "1") {
            $("#Gst-valueCredit4").text(Math.round(Gst, 0));
            $("#Gst-valueCredit23").text(Math.round(Gst, 0));
        }
        else {
            $("#Gst-value4").text(Math.round(Gst, 0));
            $("#Gst-value23").text(Math.round(Gst, 0));
        }
        $("#Discount-value4").text(text);
        ShowHideInvoiceFootDiscount3("false");
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val() - discount);
        }

        if ($("#hfDiscountType").val() == "0" && $("#txtDiscount2").val() != '') {
            var dic = "Disc @" + $("#txtDiscount2").val() + " % :";
            $("#Discount-text3").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text3").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text3").text('Discount :');
            }
        }
        if ($('#hfPaymentType2').val() == "1") {
            $("#Gst-valueCredit4").text(Math.round(Gst, 0));
            $("#Gst-valueCredit23").text(Math.round(Gst, 0));
        }
        else {
            $("#Gst-value4").text(Math.round(Gst, 0));
            $("#Gst-value23").text(Math.round(Gst, 0));
        }
        $("#Discount-value4").text($("#lblDiscountTotal2").text());
        ShowHideInvoiceFootDiscount3("true");
    }
    if ($("#txtDiscountReason2").val() != "") {
        document.getElementById('trDiscReason3').style.display = "table-row";
        $("#lblDiscReason3").text("Discount/Complimentary Reason: " + $("#txtDiscountReason2").val());
    }
    if ($("#txtDiscountAuthRemarks").val() != "") {
        document.getElementById('trDiscReason3').style.display = "table-row";
        $("#lblDiscReason3").text("Discount/Complimentary Reason: " + $("#txtDiscountAuthRemarks").val());
    }
    if ($('#hfItemWiseGST').val() == "1") {
        Gst = $("#lblGSTTotal2").text();
        $("#GST-text3").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text23").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value4").text(Math.round(Gst, 0));
        $("#Gst-value23").text(Math.round(Gst, 0));
    }

    if ($('#hfPaymentType2').val() == "1") {
        $("#Gst-valueCredit4").text(Math.round(Gst, 0));
        $("#Gst-valueCredit23").text(Math.round(Gst, 0));
    }
    else {
        $("#Gst-value4").text(Math.round(Gst, 0));
        $("#Gst-value23").text(Math.round(Gst, 0));
    }
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || document.getElementById("hfCustomerType").value == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if ($('#hfServiceType').val() == "0") {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $("#Service-text4").text("Del. Chargs @" + document.getElementById('txtService2').value + " % :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + document.getElementById('txtService2').value + " % :");
            }
        }
        else {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $("#Service-text4").text("Delivery Charges :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        $("#Service-value4").text($("#lblServiceChargesTotal").text());
        if (parseFloat($("#lblServiceChargesTotal").text()) > 0) {
            if (document.getElementById("hfCustomerType").value == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow3").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow3").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow3").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow3").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow3").style.display = "none";
    }
    if ($('#hfItemWiseGST').val() == "1") {
        Gst = $("#lblGSTTotal2").text();
        $("#GST-text3").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text23").text($('#hfTaxAuthorityLabel').val() + ' :');
    }
    ShowHideInvoiceFootGst3(Gst, parseInt($('#hfPaymentType2').val()));
    ShowHideInvoiceFootTotal3(Gst, $("#lblDiscountTotal2").text(), parseFloat(document.getElementById('txtService2').value));
    if ($('#hfPaymentType').val() == "1") {
        $("#Gst-valueCredit4").text(Math.round(Gst, 0));
        $("#Gst-valueCredit23").text(Math.round(Gst, 0));
    }
    else {
        $("#Gst-value4").text(Math.round(Gst, 0));
        $("#Gst-value23").text(Math.round(Gst, 0));
    }

    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue2").text();
        var tax = 0;

        if ($('#hfPaymentType').val() == "1") {
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
            tax = $("#Gst-value23").text();
        }

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
        $("#ExclusiveST-value3").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value23").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        if (discount == 0) {
            $("#GrandTotal-text23").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text23").text("Amount after Disc. :");
        }
    }
    $("#PayIn-text3").text(text);
    $("#PayIn-value3").text(text);
    $("#balance-text3").text(text);
    $("#balance-value3").text(text);
    $("#balance-text23").text(text);
    $("#balance-value23").text(text);
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if ($('#hfPaymentType').val() == "2") {
            $("#PayType3").text('MOP: Credit');
        }
        else if ($('#hfPaymentType').val() == "1") {
            $("#PayType3").text('MOP: Credit Card');
        }
        else if ($('#hfPaymentType').val() == "3") {
            $("#PayType3").text('MOP: Easypaisa');
        }
        else if ($('#hfPaymentType').val() == "4") {
            $("#PayType3").text('MOP: Jaz Cash');
        }
        else if ($('#hfPaymentType').val() == "5") {
            $("#PayType3").text('MOP: Online Tran');
        }
        else {
            $("#PayType3").text('MOP: Cash');
        }
    }
    else {
        $("#PayType3").text(text);
    }
    if ($('#hfHideOrderInvoieNo').val() == "1") {
        document.getElementById('trOrderNo3').style.display = "none";
        document.getElementById('BillNoName3').style.display = "none";
        document.getElementById('BillNo3').style.display = "none";
    }
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName3').style.display = "none";
        document.getElementById('BillNo3').style.display = "none";
    }
    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + parseFloat(Gst) + parseFloat($("#lblServiceChargesTotal").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }

    if ($('#hfPaymentType2').val() == "1") {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) - GstInfoValue;
        $("#lblGSTInfo3").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) - GstInfoValue;
        $("#lblGSTInfo3").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
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
    $("#GrandTotal-value5").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        $("#advance-text3").text('Customer Advance:');
        $("#advance-value3").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#AdvanceBalance-text3").text('Cust. Receivable:');
        $("#AdvanceBalance-value3").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');

    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value3").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow3").style.display = "table-row";
    }

    $.print("#dvSaleInvoice3");
}
function SaleInvoicePrint3(tblProducts) {
    $("#CustomerAddress").text("");
    $('#CustomerAddress').hide();
    $("#LocationName4").text($("#hfLocationName").val());
    $("#BillNo4").text("BILL NO: " + tblProducts[0].InvoiceNo);
    $("#lblFacebkId4").text($("#hfFacebkId").val());
    $("#GST-textCredit24").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#GST-text4").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-text24").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-textCredit4").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#lblComapnyEmail4").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote4").text($("#ltrlSlipNoteID").text());
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow4").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow4").style.display = "table-row";
    }
    document.getElementById("rowAdvance4").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount4").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount4").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer4").show();
        $("#tdGSTValue4").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer4").hide();
        $("#tdGSTValue4").hide();
    }
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
    $('#tdGrandTotal4').attr('colspan', colspan);
    $('#tdGrandTotal24').attr('colspan', colspan);
    $('#tdPaymentIn4').attr('colspan', colspan);
    $('#tdChange4').attr('colspan', colspan);
    $('#tdBalance4').attr('colspan', colspan);
    $('#tdAdvance4').attr('colspan', colspan);
    $('#tdAdvanceBalance4').attr('colspan', colspan);
    $('#tdAdvancepayment4').attr('colspan', colspan);
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal4").style.display = "none";
        document.getElementById("trTotal24").style.display = "table-row";
        document.getElementById("GstRow4").style.display = "none";
        document.getElementById("GstRow24").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax4").style.display = "table-row";
        document.getElementById("GrandTotalRow4").style.display = "none";
        document.getElementById("GrandTotalRow24").style.display = "table-row";
    }
    document.getElementById('trDiscReason4').style.display = "none";
    $("#GrandTotal-value6").text("");
    $("#lblOrderNotes4").text('');
    $("#InvoiceDate4").text($("#hfCurrentWorkDate").val());
    $("#CustomerType4").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#DeliveryChannel4").text(document.getElementById("hfDeliveryChannel4").value);
    $("#Cashier4").text('Cashier: ' + $("#user-detail-bold").text());
    document.getElementById('trKOTNo4').style.display = "none";
    document.getElementById('trTakeawayOrderNo4').style.display = "none";
    document.getElementById("trCardAccountTitle4").style.display = "none";
    if (tblProducts[0].MANUAL_ORDER_NO != "") {
        $("#OrderInvoice4").text(tblProducts[0].ORDER_NO + "-" + tblProducts[0].MANUAL_ORDER_NO);
        document.getElementById('trKOTNo4').style.display = "table-row";
        $("#KOTNo4").text("KOT No:" + tblProducts[0].MANUAL_ORDER_NO);
    }
    else {
        $("#OrderInvoice4").text(tblProducts[0].ORDER_NO);
    }

    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        if (tblProducts[0].CUSTOMER_ID === 0) {
            $("#CustomerDetail4").text("Customer: ");
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text("");
        }
        else {
            $("#CustomerDetail4").text("Customer: " + tblProducts[0].CUSTOMER_NAME);
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
            $('#CustomerDetail4').show();
        }

        $("#OrderTakerName4").text("O-T:");
        $('#OrderTakerName4').show();
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        $('#OrderTaker4').show();
        $("#CoverTable4").text('Token ID: ' + tblProducts[0].covertable);
        document.getElementById("CoverTable4").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName4').style.display = "none";
        document.getElementById('InvoiceTable4').style.display = "none";
        $("#spanTakeawayOrderNo4").text("Your Order No:" + tblProducts[0].ORDER_NO);
    }
    else if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        $("#OrderTakerName4").text("D-M:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        if (tblProducts[0].CUSTOMER_ID === 0) {
            $("#CustomerDetail4").text("Customer: ");
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text("");
        }
        else {
            $("#CustomerDetail4").text("Customer: " + tblProducts[0].CUSTOMER_NAME);
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
            $("#CustomerAddress").text("Address: " + $("#hfCustomerAddress").val());
            $('#CustomerAddress').show();
            $('#CustomerDetail4').show();
        }
        $("#InvoiceTableName4").text("Ph:");
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        $("#CoverTable4").text('');
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable4").text('Token ID: ' + tblProducts[0].covertable);
            $("#InvoiceTableName4").text("");
            $("#InvoiceTable4").text("");
        }
        else {
            $("#CoverTable4").text('Covers: ' + tblProducts[0].covertable);
            $("#InvoiceTableName4").text("Table No:");
            $("#InvoiceTabl4e").text($("#TableNo1").text());
        }
        $("#OrderTakerName4").text("O-T:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        document.getElementById("CoverTable4").setAttribute("style", "font-weight:normal;");
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        if (tblProducts[0].CUSTOMER_ID === 0) {
            $("#CustomerDetail4").text("Customer: ");
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text("");
        }
        else {
            $("#CustomerDetail4").text("Customer: " + tblProducts[0].CUSTOMER_NAME);
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
            $('#CustomerDetail4').show();
        }
    }
    $("#lblOrderNotes4").text($('#txtRemarks').val());
    $("#BillNo").text($("#hfInvoiceNo").val());
    $('#BillNoName').show();
    $('#BillNo').show();
    $('#CompanyAddress4').show();
    $('#CompanyAddress4').text($("#hfAddress").val());
    $('#CompanyNumber4').show();
    $('#CompanyNumber4').text($("#hfPhoneNo").val());
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo24').show();
        document.getElementById('imgLogo24').src = document.getElementById('imgLogo2').src;
    }
    else {
        document.getElementById('imgLogo24').style.display = "none";
    }
    //#region Products Detail
    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN4').style.display = "none";
    }
    else {
        $('#spSTRN4').show();
        $('#spSTRN4').text("STRN : " + $("#hfSTRN").val());
    }
    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo4').style.display = "none";
    }
    else {
        $('#RegNo4').show();
        $('#RegNo4').text($("#hfTaxAuthorityLabel2").val() + " : " + $("#hfRegNo").val());
    }

    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody4').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody4').append(row);
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
                var GstInclusive = 0;
                if (tblProducts[0].PAYMENT_MODE_ID == 1) {
                    document.getElementById("trCardAccountTitle").style.display = "table-row";
                    document.getElementById("trBankDiscount").style.display = "table-row";
                    if (tblProducts[0].CreditCardNo != "") {
                        $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
                    }
                    if (tblProducts[0].BankDiscountName != "") {
                        $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
                    }
                    if (tblProducts[0].CreditCardAccountTile != "") {
                        $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
                    }
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody4').append(row);
        }
    }
    sortTable4();

    $("#SaleInvoiceText4").text("PRE RECEIPT");
    $("#TotalValue6").text(tblProducts[0].AMOUNTDUE);
    $("#TotalValue24").text(parseFloat(totalamountWithGST).toFixed(0));

    var amountDue = tblProducts[0].AMOUNTDUE;

    var text = "";
    $("#advance-text4").text(text);
    $("#advance-value4").text(text);
    $("#AdvanceBalance-text4").text(text);
    $("#AdvanceBalance-value4").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text4").text(text);
        $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
        $("#Discount-value5").text(text);
        ShowHideInvoiceFootDiscount4("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && $("#txtDiscount2").val() != '') {
            var dic = "Disc @" + $("#txtDiscount2").val() + " % :";
            $("#Discount-text4").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text4").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text4").text('Discount :');
            }
        }
        $("#Gst-value5").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value24").text(Math.round(tblProducts[0].GST, 0));
        $("#Discount-value5").text(tblProducts[0].TotalDiscount);
        ShowHideInvoiceFootDiscount4("true");
    }
    if ($("#txtDiscountReason2").val() != "") {
        document.getElementById('trDiscReason4').style.display = "table-row";
        $("#lblDiscReason4").text("Discount/Complimentary Reason: " + $("#txtDiscountReason2").val());
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason4').style.display = "table-row";
        $("#lblDiscReason4").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#Gst-value5").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value24").text(Math.round(tblProducts[0].GST, 0));
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
    }
    else {
        $("#Gst-value5").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value24").text(Math.round(tblProducts[0].GST, 0));
    }
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text4").text("Del. Chargs @" + tblProducts[0].SERVICE_CHARGES + " % :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + tblProducts[0].SERVICE_CHARGES + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text4").text("Delivery Charges :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        $("#Service-value5").text($("#lblServiceChargesTotal").text());
        if (parseFloat(tblProducts[0].SERVICE_CHARGES) > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow4").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow4").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow4").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow4").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow4").style.display = "none";
    }

    ShowHideInvoiceFootGst4(tblProducts[0].GST, parseInt(tblProducts[0].PAYMENT_MODE_ID));
    ShowHideInvoiceFootTotal4(tblProducts[0].GST, tblProducts[0].TotalDiscount, parseFloat(tblProducts[0].SERVICE_CHARGES));
    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
    }
    else {
        $("#Gst-value5").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value24").text(Math.round(tblProducts[0].GST, 0));
    }

    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue2").text();
        var tax = 0;

        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
        }

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
        $("#ExclusiveST-value4").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value24").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        if (discount == 0) {
            $("#GrandTotal-text24").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text24").text("Amount after Disc. :");
        }
    }
    $("#PayIn-text4").text(text);
    $("#PayIn-value4").text(text);
    $("#balance-text4").text(text);
    $("#balance-value4").text(text);
    $("#balance-text24").text(text);
    $("#balance-value24").text(text);
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $("#PayType4").text('MOP: Credit');
        }
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#PayType4").text('MOP: Credit Card');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
            $("#PayType4").text('MOP: Easypaisa');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
            $("#PayType4").text('MOP: Jaz Cash');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
            $("#PayType4").text('MOP: Online Tran');
        }
        else {
            $("#PayType4").text('MOP: Cash');
        }
    }
    else {
        $("#PayType4").text(text);
    }
    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotal").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + parseFloat(tblProducts[0].GST) + parseFloat($("#lblServiceChargesTotal").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) - GstInfoValue;
        $("#lblGSTInfo4").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) - GstInfoValue;
        $("#lblGSTInfo4").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    }

    $("#GrandTotal-value24").text(parseFloat(totalvalue).toFixed(0));
    $("#GrandTotal-value6").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        $("#advance-text4").text('Customer Advance:');
        $("#advance-value4").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#AdvanceBalance-text4").text('Cust. Receivable:');
        $("#AdvanceBalance-value4").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-valueSaj").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRowSaj").style.display = "table-row";
    }

    $.print("#dvSaleInvoice4");
}
function SaleInvoicePrint4(tblProducts) {
    document.getElementById('imgLogo5').src = document.getElementById('imgLogo2').src;
    $("#GST-textCredit25").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val() + " :");
    $("#GST-text5").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val() + " :");
    $("#GST-textCredit5").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#ltrlSlipNote5").text($("#ltrlSlipNoteID").text());

    document.getElementById("trPoints5").style.display = "none";
    if (parseFloat(tblProducts[0].CustomerPoints) > 0) {
        document.getElementById("trPoints5").style.display = "table-row";
        $("#lblPointsValue5").text(tblProducts[0].CustomerPoints);
    }
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow5").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow5").style.display = "table-row";
    }
    document.getElementById("rowAdvance5").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer").show();
        $("#tdGSTValue").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer").hide();
        $("#tdGSTValue").hide();
    }
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
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal5").style.display = "none";
        document.getElementById("trTotal25").style.display = "table-row";
        try {
            document.getElementById("GstRow5").style.display = "none";
        } catch (e) {

        }
        document.getElementById("GstRow25").style.display = "table-row";
        document.getElementById("GrandTotalRow5").style.display = "none";
    }
    document.getElementById('trOrderNotes5').style.display = "none";
    document.getElementById('trDiscReason5').style.display = "none";
    $("#GrandTotal-value7").text("");
    $("#lblOrderNotes5").text('');
    $("#InvoiceDate5").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#CustomerType5").text(tblProducts[0].CUSTOMER_TYPE_ID);
    document.getElementById("trCardAccountTitle5").style.display = "none";
    document.getElementById("trBankDiscount5").style.display = "none";
    $("#lblCreditCardNo5").text("");
    $("#lblAccountTitle5").text("");
    $("#lblBankDiscount5").text("");
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        var CDetail = $("#hfTableNo").val();
        document.getElementById('trOrderNotes5').style.display = "table-row";
        $("#lblOrderNotes5").text(tblProducts[0].REMARKS);
    }
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo5').show();
    }
    else {
        document.getElementById('imgLogo5').style.display = "none";
    }
    //#region Products Detail    
    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody5').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody5').append(row);
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
            amount = parseFloat(orderedProducts[i].AMOUNT) - parseFloat(orderedProducts[i].DISCOUNT);
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT - parseFloat(orderedProducts[i].DISCOUNT)).toFixed(2);
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
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {

                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody5').append(row);
        }
    }
    sortTable();
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].GST > 0) {
            $("#SaleInvoiceText5").text("Sales Tax Invoice");
        }
        else {
            $("#SaleInvoiceText5").text("Sales Invoice");
        }
    }
    else {
        $("#SaleInvoiceText5").text("PRE RECEIPT");
    }

    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        $("#TotalValue7").text(tblProducts[0].AMOUNTDUE2);
    }
    else {
        $("#TotalValue7").text(tblProducts[0].AMOUNTDUE);
    }
    $("#TotalValue25").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        amountDue = tblProducts[0].AMOUNTDUE2;
    }
    else {
        amountDue = tblProducts[0].AMOUNTDUE;
    }
    var text = "";
    $("#advance-text5").text(text);
    $("#advance-value5").text(text);
    $("#AdvanceBalance-text5").text(text);
    $("#AdvanceBalance-value5").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text5").text(text);
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle5").style.display = "table-row";
            document.getElementById("trBankDiscount5").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value6").text(text);
        ShowHideInvoiceFootDiscount("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && tblProducts[0].DISCOUNT2 > 0) {
            var dic = "Disc @" + tblProducts[0].DISCOUNT2 + " % :";
            $("#Discount-text5").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text5").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text5").text('Discount :');
            }
        }
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle5").style.display = "table-row";
            document.getElementById("trBankDiscount5").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value6").text(tblProducts[0].TotalDiscount);
        ShowHideInvoiceFootDiscount("true");
    }
    if ($("#txtDiscountReason2").val() != "") {
        document.getElementById('trDiscReason5').style.display = "table-row";
        $("#lblDiscReason5").text("Discount/Complimentary Reason: " + $("#txtDiscountReason2").val());
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason5').style.display = "table-row";
        $("#lblDiscReason5").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text5").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text25").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
    }
    $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
    $("#Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));

    var service = tblProducts[0].SERVICE_CHARGES;
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (document.getElementById("hfServiceChargesCalculation").value == "2") {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)) * 100, 0);

            }
            else {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue)) * 100, 0);
            }
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text6").text("Del. Chargs @" + service + " % :");
            }
            else {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text6").text("Delivery Charges :");
            }
            else {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        $("#Service-value7").text(tblProducts[0].SERVICE_CHARGES);
        if (parseFloat(tblProducts[0].SERVICE_CHARGES) > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow5").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow5").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow5").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow5").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow5").style.display = "none";
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text5").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text25").text($('#hfTaxAuthorityLabel').val() + ' :');
    }
    ShowHideInvoiceFootGst(tblProducts[0].GST, parseInt(tblProducts[0].PAYMENT_MODE_ID));
    ShowHideInvoiceFootTotal(tblProducts[0].GST, tblProducts[0].TotalDiscount, tblProducts[0].SERVICE_CHARGES);
    $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
    $("#tblProducts[0].Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));

    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue25").text();
        var tax = 0;

        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle5").style.display = "table-row";
            document.getElementById("trBankDiscount5").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            tax = $("#Gst-valueCredit25").text();
        }
        else {
            tax = $("#Gst-value25").text();
        }

        var discount = $("#Discount-value6").text();
        var service = $("#Service-value7").text();
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
    $("#PayIn-text5").text(text);
    $("#PayIn-value5").text(text);
    $("#balance-text5").text(text);
    $("#balance-value5").text(text);
    $("#balance-text25").text(text);
    $("#balance-value25").text(text);
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $("#PayType5").text('MOP: Credit');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle5").style.display = "table-row";
            document.getElementById("trBankDiscount5").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#PayType5").text('MOP: Credit Card');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
            $("#PayType5").text('MOP: Easypaisa');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
            $("#PayType5").text('MOP: Jaz Cash');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
            $("#PayType5").text('MOP: Online Tran');
        }
        else {
            $("#PayType5").text('MOP: Cash');
        }
    }
    else {
        $("#PayType5").text(text);
    }

    var TotalValue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
    }
    else {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].GST) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
    }
    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        document.getElementById("trCardAccountTitle5").style.display = "table-row";
        document.getElementById("trBankDiscount5").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo5").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo5").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }

    $("#GrandTotal-value7").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        $("#advance-text5").text('Customer Advance:');
        $("#advance-value5").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#AdvanceBalance-text5").text('Cust. Receivable:');
        $("#AdvanceBalance-value5").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    $.print("#dvSaleInvoice5");
}
function SaleInvoicePrintCafeBedaar(tblProducts,type) {
    document.getElementById('trDiscountCafeBeedar').style.display = "none";
    document.getElementById('trTaxCafeBeedar').style.display = "none";
    document.getElementById('trServiceChargesCafeBeedar').style.display = "none";
    $('#tblPaymentCafeBedaar').hide();
    $('#trTableCafeBeddar').hide();
    $('#trCustomerNameCafeBeddar').hide();
    $('#trCustomerAddressCafeBeddar').hide();
    $('#trCashCafeBeddar').hide();
    $('#trCashLineCafeBeddar').hide();
    $('#trCreditCareCafeBeddar').hide();
    $('#trCreditCareLineCafeBeddar').hide();
    $('#trCreditCafeBeddar').hide();
    $('#trCreditLineCafeBeddar').hide();
    $('#tblCashCreditBothCafeBedaar').hide();

    if (tblProducts[0].CUSTOMER_TYPE_ID == "Dine In")
    {
        $('#trTableCafeBeddar').show();
    }
    if (tblProducts[0].CUSTOMER_NAME != '' || tblProducts[0].CONTACT_NUMBER != '')
    {
        $('#CustomerNameCafeBedaar').text(tblProducts[0].CUSTOMER_NAME);
        $('#CustomerContactCafeBedaar').text('Contact#:' + tblProducts[0].CONTACT_NUMBER);
        $('#trCustomerNameCafeBeddar').show();        
    }
    if ($("#hfCustomerAddress").val() != '')
    {
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
    $("#GuestCafeBedaar").text('Guests: ' + tblProducts[0].covertable);
    $("#BillNoCafeBedaar").text("Bill No: " + tblProducts[0].InvoiceNo);
    $("#BillDateCafeBedaar").text("Bill : " + $("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#OrderNoCafeBedaar").text("Order No : " + tblProducts[0].ORDER_NO);
    $("#ltrlSlipNoteCafeBedaar").text($("#ltrlSlipNoteID").text());
    $("#ComapnyEmailCafeBedaar").text($("#hfCompanyEmail").val());
    $("#PNTNCafeBedaar").text("PNTN#" + $("#hfRegNo").val());
    $("#STRNCafeBedaar").text("STRN#" + $("#hfSTRN").val());

    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailCafeBedaar').empty(); // clear all skus  from invoice

    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    var arr = [];
    var arrSaleInvoiceDetail = [];
    var totalamountWithGST = 0;
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            var totalamount = 0;
            $('#tble-ordered-products').find('tr').each(function () {
                if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                    if (uniqueDeals[j] == $(this).find("td:eq(21)").text()) {
                        if (count == 0) {
                            count += 1;
                            totalamount = parseFloat($(this).find("td:eq(20)").text()) * parseFloat($(this).find("td:eq(27)").text());
                            if ($(this).find("td:eq(16)").text() == "true") {
                                var row = $(' <tr><td><p style="margin:0; word-wrap: break-word;word-break: break-word; white-space: normal;">' + $(this).find("td:eq(32)").text() + '<br />' + $(this).find("td:eq(17)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + $(this).find("td:eq(27)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + $(this).find("td:eq(20)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + totalamount + '</p></td><td style="display:none">' + $(this).find("td:eq(40)").text() + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td><p style="margin:0;">' + $(this).find("td:eq(32)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + $(this).find("td:eq(27)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + $(this).find("td:eq(20)").text() + '</p></td><td class="text-right"><p style="margin:0;">' + totalamount + '</p></td><td style="display:none">' + $(this).find("td:eq(40)").text() + '</td></tr>');
                            }
                            $('#invoiceDetailCafeBedaar').append(row);

                        }
                        return;
                    }
                }
            });
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
                var GstInclusive = 0;
                if ($('#hfPaymentType').val() == "1") {
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);

                var mod = '';
                var modprice = '';
                var modamount = '';
                var modqty = '';
                var HasMod = 0;
                for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                    if (orderedProducts[i].SKU_ID === String(Modifierparent[k].ParentID) && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                        if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                            mod = mod + '<br>' + Modifierparent[k].ItemName;
                            modqty = modqty + '<br>' + Modifierparent[k].Qty;
                            modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Price) * parseFloat(Modifierparent[k].Qty);
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
                        if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                            var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + priceWithGST + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + amountWithGST + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        }
                        else {
                            var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + priceWithGST + '</p></td><td class="text-right"><p style="margin:0;">' + amountWithGST + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        }
                    }
                    else {
                        if (parseInt(priceWithGST) == 0) {
                            priceWithGST = '';
                            amountWithGST = '';
                        }
                        if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                            var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + priceWithGST + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + amountWithGST + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        }
                        else {
                            var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + priceWithGST + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + amountWithGST + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                        }
                    }
                }
            }
            else {
                var mod = '';
                var modprice = '';
                var modamount = '';
                var modqty = '';
                var HasMod = 0;
                for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                    if (orderedProducts[i].SKU_ID === String(Modifierparent[k].ParentID) && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                        if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                            mod = mod + '<br>' + Modifierparent[k].ItemName;
                            modqty = modqty + '<br>' + Modifierparent[k].Qty;
                            modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Price) * parseFloat(Modifierparent[k].Qty);
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
                        if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                            if ($('#hfItemWiseGST').val() == "1") {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].GSTPER + '</p></td><td class="text-right"><p style="margin:0;">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</p></td><td class="text-right"><p style="margin:0;">' + amount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + amount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if ($('#hfItemWiseGST').val() == "1") {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].GSTPER + '</p></td><td class="text-right"><p style="margin:0;">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</p></td><td class="text-right"><p style="margin:0;">' + amount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + '</p></td><td class="text-right"><p style="margin:0;">' + amount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (parseInt(tprice) == 0) {
                            tprice = '';
                            amount = '';
                        }
                        if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                            if ($('#hfItemWiseGST').val() == "1") {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].GSTPER + '</p></td><td class="text-right"><p style="margin:0;">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</p></td><td class="text-right"><p style="margin:0;">' + amount + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].DISCOUNT + '</p></td><td class="text-right"><p style="margin:0;">' + amount + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if ($('#hfItemWiseGST').val() == "1") {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].GSTPER + '</p></td><td class="text-right"><p style="margin:0;">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</p></td><td class="text-right"><p style="margin:0;">' + amount + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td><p style="margin:0;">' + orderedProducts[i].SKU_NAME + mod + '</p></td><td class="text-right"><p style="margin:0;">' + orderedProducts[i].QTY + modqty + '</p></td><td class="text-right"><p style="margin:0;">' + tprice + modprice + '</p></td><td class="text-right"><p style="margin:0;">' + amount + modamount + '</p></td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailCafeBedaar').append(row);
        }
    }

    $('#subTotalCafeBeedar').text(tblProducts[0].AMOUNTDUE.toFixed(2));
    if (tblProducts[0].TotalDiscount > 0)
    {
        $('#discountCafeBeedar').text(tblProducts[0].TotalDiscount.toFixed(2));
        document.getElementById('trDiscountCafeBeedar').style.display = "table-row";
    }
    if (tblProducts[0].GST > 0)
    {
        $('#taxCafeBeedar').text(tblProducts[0].GST.toFixed(2));
        document.getElementById('trTaxCafeBeedar').style.display = "table-row";
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $('#taxlabelCafeBeedar').text('Tax: GST ' + $("#hfSalesTaxCreditCard").val() + ' %');
        }
        else {
            $('#taxlabelCafeBeedar').text('Tax: GST ' + $("#hfSalesTax").val() + '%');
        }
    }
    if (tblProducts[0].SERVICE_CHARGES > 0)
    {
        $('#sercicechargesCafeBeedar').text(tblProducts[0].SERVICE_CHARGES.toFixed(2));
        document.getElementById('trServiceChargesCafeBeedar').style.display = "table-row";
    }
    $('#totalCafeBeedar').text((tblProducts[0].AMOUNTDUE - tblProducts[0].TotalDiscount + tblProducts[0].GST + tblProducts[0].SERVICE_CHARGES + parseFloat($("#hfPOSFee").val())).toFixed(2));
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFeeCafeBeedar").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRowCafeBedaar").style.display = "table-row";
    }
    if (type == 1)
    {        
        $('#tblPaymentCafeBedaar').show();
        if (parseFloat($("#txtCashRecieved").val()) > 0) {
            $('#tenderedCafeBeedar').text(parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()));
        }
        else {
            $('#tenderedCafeBeedar').text('0');
        }
        if (tblProducts[0].PAYMENT_MODE_ID == 0) {
            $('#changeCafeBeedar').text((parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()) - parseFloat($('#totalCafeBeedar').text())).toFixed(2));
            $('#trCashCafeBeddar').show();
            $('#trCashLineCafeBeddar').show();
            $('#cashCafeBeedar').text(parseFloat($('#totalCafeBeedar').text()));
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $('#changeCafeBeedar').text((parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()) - parseFloat($('#totalCafeBeedar').text())).toFixed(2));
            $('#trCreditCareCafeBeddar').show();
            $('#trCreditCareLineCafeBeddar').show();

            var cash = 0;
            if($("#txtCashRecieved").val() != '')
            {
                cash = $("#txtCashRecieved").val();
            }
            if(parseFloat(cash) == 0)
            {
                $('#creditcardCafeBeedar').text(parseFloat($('#totalCafeBeedar').text()) + parseFloat($("#hfPOSFee").val()));
                $('#changeCafeBeedar').text('0');
            }
            else {
                $('#trCashCafeBeddar').show();
                $('#trCashLineCafeBeddar').show();
                $('#cashCafeBeedar').text(parseFloat(cash) + parseFloat($("#hfPOSFee").val()));
                $('#creditcardCafeBeedar').text(parseFloat($('#totalCafeBeedar').text()) + parseFloat($("#hfPOSFee").val()) - parseFloat(cash));
                $('#changeCafeBeedar').text('0');
            }
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $('#changeCafeBeedar').text('0');
            $('#trCreditCafeBeddar').show();
            $('#trCreditLineCafeBeddar').show();
            $('#cardCafeBeedar').text(parseFloat($('#totalCafeBeedar').text()));
        }
    }
    else {
        if ($('#hfInvoiceFooterType').val() == '2')
        {
            var Gst = 0;
            var Gst2 = 0;
            if (document.getElementById("hfGSTCalculation").value == "1") {
                Gst = parseFloat($("#hfSalesTax").val()) / 100 * parseFloat(tblProducts[0].AMOUNTDUE);
                Gst2 = parseFloat($("#hfSalesTaxCreditCard").val()) / 100 * parseFloat(tblProducts[0].AMOUNTDUE);
            }
            else if (document.getElementById("hfGSTCalculation").value == "3") {
                Gst = parseFloat($("#hfSalesTax").val()) / 100 * (parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat($("#sercicechargesCafeBeedar").text()));
                Gst2 = parseFloat($("#hfSalesTaxCreditCard").val()) / 100 * (parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat($("#sercicechargesCafeBeedar").text()));
            }
            else if (document.getElementById("hfGSTCalculation").value == "4") {
                Gst = parseFloat($("#hfSalesTax").val()) / 100 * (parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat($("#sercicechargesCafeBeedar").text()) - tblProducts[0].TotalDiscount);
                Gst2 = parseFloat($("#hfSalesTaxCreditCard").val()) / 100 * (parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat($("#sercicechargesCafeBeedar").text()) - tblProducts[0].TotalDiscount);
            }
            else {
                Gst = parseFloat($("#hfSalesTax").val()) / 100 * parseFloat(tblProducts[0].AMOUNTDUE - tblProducts[0].TotalDiscount);
                Gst2 = parseFloat($("#hfSalesTaxCreditCard").val()) / 100 * parseFloat(tblProducts[0].AMOUNTDUE - tblProducts[0].TotalDiscount);
            }

            $('#tblTotalCafeBedaar').hide();
            $('#tblCashCreditBothCafeBedaar').show();
            $('#CashHeaderCafeBedaar').text($("#hfSalesTax").val() + "% Tax For Cash");
            $('#CreditCardHeaderCafeBedaar').text($("#hfSalesTaxCreditCard").val() + "% Tax For Credit Card");
            $('#SubTotalCashCafeBedaar').text(tblProducts[0].AMOUNTDUE.toFixed(2));
            $('#SubTotalCreditCardCafeBedaar').text(tblProducts[0].AMOUNTDUE.toFixed(2));
            $('#DiscountCashCafeBedaar').text(tblProducts[0].TotalDiscount.toFixed(2));
            $('#DiscountCreditCardCafeBedaar').text(tblProducts[0].TotalDiscount.toFixed(2));
            $('#GSTCashCafeBedaar').text(Gst.toFixed(2));
            $('#GSTCreditCardCafeBedaar').text(Gst2.toFixed(2));
            $('#ServiceChargesCashCafeBedaar').text(tblProducts[0].SERVICE_CHARGES.toFixed(2));
            $('#ServiceChargesCreditCardCafeBedaar').text(tblProducts[0].SERVICE_CHARGES.toFixed(2));
            $('#TotalCashCafeBedaar').text((tblProducts[0].AMOUNTDUE - tblProducts[0].TotalDiscount + Gst + tblProducts[0].SERVICE_CHARGES).toFixed(2));
            $('#TotalCreditCardCafeBedaar').text((tblProducts[0].AMOUNTDUE - tblProducts[0].TotalDiscount + Gst2 + tblProducts[0].SERVICE_CHARGES).toFixed(2));
        }
    }
    $.print("#dvInvoiceCafeBedaar");
}
function SaleInvoicePrint(tblProducts) {
    document.getElementById("trPoints").style.display = "none";
    if (parseFloat(tblProducts[0].CustomerPoints) > 0) {
        document.getElementById("trPoints").style.display = "table-row";
        $("#lblPointsValue").text(tblProducts[0].CustomerPoints);
    }
    document.getElementById("InvoiceTableName").setAttribute("style", "font-weight:normal;");
    document.getElementById("InvoiceTable").setAttribute("style", "font-weight:normal;");
    $("#CustomerDetail").text('');
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "table-row";
    }
    document.getElementById("rowAdvance").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer").show();
        $("#tdGSTValue").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer").hide();
        $("#tdGSTValue").hide();
    }
    $('#tdTotal').attr('colspan', colspan);
    $('#tdTotal2').attr('colspan', colspan);
    $('#tdGst2').attr('colspan', colspan);
    $('#tdGstCredit2').attr('colspan', colspan);
    $('#tdExclusiveTax').attr('colspan', colspan);
    $('#tdDiscout').attr('colspan', colspan);
    $('#tdGst').attr('colspan', colspan);
    $('#tdGstCredit').attr('colspan', colspan);
    $('#tdServiceCharges').attr('colspan', colspan);
    $('#tdPOSFee').attr('colspan', colspan);
    $('#tdGrandTotal').attr('colspan', colspan);
    $('#tdPOSFee').attr('colspan', colspan);
    $('#tdNetTotal').attr('colspan', colspan);
    $('#tdGrandTotal2').attr('colspan', colspan);
    $('#tdPaymentIn').attr('colspan', colspan);
    $('#tdChange').attr('colspan', colspan);
    $('#tdBalance').attr('colspan', colspan);
    $('#tdAdvance').attr('colspan', colspan);
    $('#tdAdvanceBalance').attr('colspan', colspan);
    $('#tdAdvancepayment').attr('colspan', colspan);
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal").style.display = "none";
        document.getElementById("trTotal2").style.display = "table-row";
        document.getElementById("GstRow").style.display = "none";
        document.getElementById("GstRow2").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax").style.display = "table-row";
        document.getElementById("GrandTotalRow").style.display = "none";
        document.getElementById("GrandTotalRow2").style.display = "table-row";
    }
    document.getElementById('trNTN').style.display = "none";
    document.getElementById('trOrderNotes').style.display = "none";
    document.getElementById('trDiscReason').style.display = "none";
    $("#GrandTotal-value").text("");
    $("#lblOrderNotes").text('');
    if ($("#hfShowNTNOnProvissionalBill").val() === "1") {
        document.getElementById('trNTN').style.display = "table-row";
    }
    $("#InvoiceDate").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#CustomerType").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#Cashier").text('Cashier: ' + $("#user-detail-bold").text());
    document.getElementById('trKOTNo').style.display = "none";
    document.getElementById('trTakeawayOrderNo').style.display = "none";
    document.getElementById('trOrderNo').style.display = "table-row";
    document.getElementById("trCardAccountTitle").style.display = "none";
    document.getElementById("trBankDiscount").style.display = "none";
    $("#lblCreditCardNo").text("");
    $("#lblAccountTitle").text("");
    $("#lblBankDiscount").text("");
    if (tblProducts[0].MANUAL_ORDER_NO != "") {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO + "-" + tblProducts[0].MANUAL_ORDER_NO);
        document.getElementById('trKOTNo').style.display = "table-row";
        $("#KOTNo").text("KOT No:" + tblProducts[0].MANUAL_ORDER_NO);
    }
    else {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO);
    }
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        if (tblProducts[0].CUSTOMER_NAME !== "")
        {
            $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME + '-' + tblProducts[0].CONTACT_NUMBER);
            $('#CustomerDetail').show();
        }
        else if (tblProducts[0].TAKEAWAY_CUSTOMER != "") {
            if (tblProducts[0].CUSTOMER_ID === 0) {
                $("#CustomerDetail").text(tblProducts[0].TAKEAWAY_CUSTOMER);
                $('#CustomerDetail').show();
            }
            else {
                if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                    $("#CustomerDetail").text(GetCustomerInfo(tblProducts[0].CUSTOMER_ID));
                }
                else {
                    $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME);
                }
                $('#CustomerDetail').show();
            }
        }
        $("#OrderTakerName").text("O-T:");
        $('#OrderTakerName').show();
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        $('#OrderTaker').show();
        $("#CoverTable").text('Token ID: ' + tblProducts[0].covertable);
        document.getElementById("CoverTable").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName').style.display = "none";
        document.getElementById('InvoiceTable').style.display = "none";
        $("#spanTakeawayOrderNo").text("Your Order No:" + tblProducts[0].ORDER_NO);
    }
    else if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        $("#OrderTakerName").text("D-M:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail").text(CDetail);
        $("#InvoiceTableName").text("Ph:");
        document.getElementById("InvoiceTableName").setAttribute("style", "font-weight:bold;");
        document.getElementById("InvoiceTable").setAttribute("style", "font-weight:bold;");
        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#CustomerDetail').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTable').show();
        $("#CoverTable").text('');
        document.getElementById('trOrderNotes').style.display = "table-row";
        $("#lblOrderNotes").text(tblProducts[0].REMARKS);
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable").text('Token ID: ' + tblProducts[0].covertable);
            $("#InvoiceTableName").text("");
            $("#InvoiceTable").text("");
        }
        else {
            $("#CoverTable").text('Covers: ' + tblProducts[0].covertable);
            $("#InvoiceTableName").text("Table No:");
            $("#InvoiceTable").text(tblProducts[0].TableNo);
        }
        $("#OrderTakerName").text("O-T:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        document.getElementById("CoverTable").setAttribute("style", "font-weight:normal;");

        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTable').show();
        if (tblProducts[0].CUSTOMER_ID === 0) {            
        }
        else {
            if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                $("#CustomerDetail").text(GetCustomerInfo(tblProducts[0].CUSTOMER_ID));
            }
            else {
                $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME + '-' + tblProducts[0].CONTACT_NUMBER);
            }
            $('#CustomerDetail').show();
        }
    }
    $("#BillNo").text(tblProducts[0].InvoiceNo);
    $('#BillNoName').show();
    $('#BillNo').show();
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#CompanyAddress').show();
        $('#CompanyNumber').show();
    }
    else {
        document.getElementById('CompanyAddress').style.display = "none";
        document.getElementById('CompanyNumber').style.display = "none";
    }
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo2').show();
    }
    else {
        document.getElementById('imgLogo2').style.display = "none";
    }
    document.getElementById('RegNo').style.display = "none";
    document.getElementById('spSTRN').style.display = "none";
    //#region Products Detail
    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN').style.display = "none";
    }
    else {
        $('#spSTRN').show();
    }
    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo').style.display = "none";
    }
    else {
        $('#RegNo').show();
    }

    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            var totalamount = 0;
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (!orderedProducts[i].VOID) {
                    if (uniqueDeals[j] == orderedProducts[i].I_D_ID) {
                        if (count == 0) {
                            count += 1;                            
                            var DISCOUNTDeal = orderedProducts[i].DISCOUNTDeal;
                            totalamount = orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY - parseFloat(DISCOUNTDeal);
                            if (parseFloat(DISCOUNTDeal) > 0) {
                                var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td>' + DISCOUNTDeal + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                $('#invoiceDetailBody').append(row);
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                $('#invoiceDetailBody').append(row);
                            }
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
            amount = parseFloat(orderedProducts[i].AMOUNT) - parseFloat(orderedProducts[i].DISCOUNT);
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT - parseFloat(orderedProducts[i].DISCOUNT)).toFixed(2);
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
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = '';
                    var moddiscount = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {

                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    var disc = 0;
                                    try {
                                        disc = parseFloat(Modifierparent[k].DISCOUNT);
                                    } catch (e) {
                                        disc = 0;
                                    }
                                    tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + (parseFloat(Modifierparent[k].Amount) - disc);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    moddiscount = moddiscount + '<br>' + Modifierparent[k].DISCOUNT;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + moddiscount + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + moddiscount + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
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
                amount = parseFloat(product.AMOUNT) - parseFloat(product.DISCOUNT);
            }
            else {
                tprice = parseFloat(product.T_PRICE).toFixed(2);
                amount = parseFloat(product.AMOUNT - parseFloat(product.DISCOUNT)).toFixed(2);
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

                    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {                        
                        var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + priceWithGST + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
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
                else
                {
                    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                        if ($('#hfItemWiseGST').val() == "1") {
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice.toFixed(2) + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
                    '<td class="text-right">' + product.GSTPER + '</td>' +
                    '<td class="text-right">' + parseFloat(product.ItemWiseGST).toFixed(2) + '</td>' +
                    '<td class="text-right">' + amount.toFixed(2) + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                        else {
                            var row = $(' <tr><td>' + product.SKU_NAME
                                + '</td><td class="text-right">'
                                + product.QTY + '</td><td class="text-right">'
                                + tprice + '</td><td class="text-right">'
                                + product.DISCOUNT + '</td><td class="text-right">'
                                + amount + '</td><td style="display:none">'
                                + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
                    '<td class="text-right">' + amount + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                    }
                    else {
                        if ($('#hfItemWiseGST').val() == "1") {
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice + '</td>' +
                    '<td class="text-right">' + product.GSTPER + '</td>' +
                    '<td class="text-right">' + parseFloat(product.ItemWiseGST).toFixed(2) + '</td>' +
                    '<td class="text-right">' + amount + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                        else {
                            var row = $(' <tr><td>'
                                + product.SKU_NAME + '</td><td class="text-right">'
                                + product.QTY + '</td><td class="text-right">'
                                + tprice + '</td><td class="text-right">'
                                + amount + '</td><td style="display:none">'
                                + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');

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
        }
    });

    sortTable();
    //if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
    //    if (tblProducts[0].GST > 0) {
    //        $("#SaleInvoiceText").text("Sales Tax Invoice");
    //    }
    //    else {
    //        $("#SaleInvoiceText").text("Sales Invoice");
    //    }
    //}
    //else {
        $("#SaleInvoiceText").text("PRE RECEIPT");
    //}

    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4")
    {
        $("#TotalValue").text(tblProducts[0].AMOUNTDUE2.toFixed(0));
    }
    else
    {
        $("#TotalValue").text(tblProducts[0].AMOUNTDUE.toFixed(0));
    }
    $("#TotalValue2").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        amountDue =  tblProducts[0].AMOUNTDUE2;
    }
    else {
        amountDue = tblProducts[0].AMOUNTDUE;
    }
    var text = "";
    $("#advance-text").text(text);
    $("#advance-value").text(text);
    $("#AdvanceBalance-text").text(text);
    $("#AdvanceBalance-value").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text").text(text);
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit2").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value").text(text);
        ShowHideInvoiceFootDiscount("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && tblProducts[0].DISCOUNT2 > 0) {
            if (tblProducts[0].EmpDiscountType == 11) {
                var dic = "Disc @" + tblProducts[0].BankDiscount + " % :";
                $("#Discount-text").text(dic);
            }
            else {
                var dic = "Disc @" + tblProducts[0].DISCOUNT2 + " % :";
                $("#Discount-text").text(dic);
            }
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text").text('Discount :');
            }
        }
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit2").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value").text(Math.round(tblProducts[0].TotalDiscount,0));
        ShowHideInvoiceFootDiscount("true");
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason').style.display = "table-row";
        $("#lblDiscReason").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text2").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
    }
    $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
    $("#Gst-valueCredit2").text(Math.round(tblProducts[0].GST, 0));

    var service = tblProducts[0].SERVICE_CHARGES;
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (document.getElementById("hfServiceChargesCalculation").value == "2") {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)) * 100, 0);

            }
            else {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue)) * 100, 0);
            }
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text").text("Del. Chargs @" + service + " % :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text").text("Delivery Charges :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        $("#Service-value").text(tblProducts[0].SERVICE_CHARGES);
        if (parseFloat(tblProducts[0].SERVICE_CHARGES) > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "none";
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text2").text($('#hfTaxAuthorityLabel').val() + ' :');
    }
    ShowHideInvoiceFootGst(tblProducts[0].GST, parseInt(tblProducts[0].PAYMENT_MODE_ID));
    ShowHideInvoiceFootTotal(tblProducts[0].GST, tblProducts[0].TotalDiscount, tblProducts[0].SERVICE_CHARGES);
    $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
    $("#tblProducts[0].GST-valueCredit2").text(Math.round(tblProducts[0].GST, 0));

    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue2").text();
        var tax = 0;

        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
        }

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
    $("#PayIn-text").text(text);
    $("#PayIn-value").text(text);
    $("#balance-text").text(text);
    $("#balance-value").text(text);
    $("#balance-text2").text(text);
    $("#balance-value2").text(text);
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $("#PayType").text('MOP: Credit');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            document.getElementById("trCardAccountTitle").style.display = "table-row";
            document.getElementById("trBankDiscount").style.display = "table-row";
            if (tblProducts[0].CreditCardNo != "") {
                $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
            }
            if (tblProducts[0].BankDiscountName != "") {
                $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
            }
            if (tblProducts[0].CreditCardAccountTile != "") {
                $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
            }
            $("#PayType").text('MOP: Credit Card');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
            $("#PayType").text('MOP: Easypaisa');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
            $("#PayType").text('MOP: Jaz Cash');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
            $("#PayType").text('MOP: Online Tran');
        }
        else {
            $("#PayType").text('MOP: Cash');
        }
    }
    else {
        $("#PayType").text(text);
    }
    if ($('#hfHideOrderInvoieNo').val() == "1") {
        document.getElementById('trOrderNo').style.display = "none";
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
    }
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
    }
    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].GST) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        if ($("#hfBillFormat").val() === "4") {
            var GstInfoValue = 0;
            var newGST = parseFloat(document.getElementById("hfSalesTax").value) - parseFloat(document.getElementById("hfSalesTaxCreditCard").value);
            GstInfoValue = parseFloat(amountDue) / ((newGST + 100) / 100);
            GstInfoValue = (parseFloat(GstInfoValue) * parseFloat(document.getElementById("hfSalesTaxCreditCard").value)) / (100 + parseFloat(document.getElementById("hfSalesTaxCreditCard").value));
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
        else {
            var GstInfoValue = 0;
            GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
            GstInfoValue = parseFloat(amountDue) - GstInfoValue;
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }

    $("#GrandTotal-value").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        $("#advance-text").text('Customer Advance:');
        $("#advance-value").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#AdvanceBalance-text").text('Cust. Receivable:');
        $("#AdvanceBalance-value").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow").style.display = "table-row";
    }

    $.print("#dvSaleInvoice");
}

//Final Bill
function PrintPaymentInvoice(tblProducts) {
    if ($("#hfInvoiceFormat").val() === "2") {
        PaymentInvoicePrint2(tblProducts);
    }
    else if ($("#hfInvoiceFormat").val() === "3") {
        PaymentInvoicePrint3(tblProducts);
    }
    else if ($("#hfInvoiceFormat").val() === "4")
    {
        PaymentInvoicePrint4(tblProducts);
    }    
    else if ($("#hfInvoiceFormat").val() === "5") {
        SaleInvoicePrintCafeBedaar(tblProducts, 1);
    }
    else {
        PaymentInvoicePrint(tblProducts);
    }
}
function PaymentInvoicePrint2(tblProducts) {
    $("#GST-textCredit23").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#GST-text3").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-textCredit3").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#lblComapnyEmail").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote3").text($("#ltrlSlipNoteID").text());
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        document.getElementById("ServiceChargesRow").style.display = "none";
        document.getElementById("ServiceChargesRow3").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "table-row";
        document.getElementById("ServiceChargesRow3").style.display = "table-row";
    }
    document.getElementById("rowAdvance").style.display = "none";
    document.getElementById("rowAdvance3").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer").show();
        $("#tdGSTValue").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer").hide();
        $("#tdGSTValue").hide();
    }
    $('#tdTotal').attr('colspan', colspan);
    $('#tdTotal3').attr('colspan', colspan);
    $('#tdTotal2').attr('colspan', colspan);
    $('#tdTotal23').attr('colspan', colspan);
    $('#tdGst2').attr('colspan', colspan);
    $('#tdGst23').attr('colspan', colspan);
    $('#tdGstCredit2').attr('colspan', colspan);
    $('#tdExclusiveTax').attr('colspan', colspan);
    $('#tdExclusiveTax3').attr('colspan', colspan);
    $('#tdDiscout').attr('colspan', colspan);
    $('#tdDiscout3').attr('colspan', colspan);
    $('#tdGst').attr('colspan', colspan);
    $('#tdGst3').attr('colspan', colspan);
    $('#tdGstCredit').attr('colspan', colspan);
    $('#tdGstCredit3').attr('colspan', colspan);
    $('#tdServiceCharges').attr('colspan', colspan);
    $('#tdPOSFee').attr('colspan', colspan);
    $('#tdServiceCharges3').attr('colspan', colspan);
    $('#tdPOSFee3').attr('colspan', colspan);
    $('#tdNetTotal3').attr('colspan', colspan);
    $('#tdGrandTotal').attr('colspan', colspan);
    $('#tdGrandTotal3').attr('colspan', colspan);
    $('#tdGrandTotal2').attr('colspan', colspan);
    $('#tdGrandTotal23').attr('colspan', colspan);
    $('#tdPaymentIn').attr('colspan', colspan);
    $('#tdPaymentIn3').attr('colspan', colspan);
    $('#tdChange').attr('colspan', colspan);
    $('#tdChange3').attr('colspan', colspan);
    $('#tdBalance').attr('colspan', colspan);
    $('#tdBalance3').attr('colspan', colspan);
    $('#tdAdvance').attr('colspan', colspan);
    $('#tdAdvance3').attr('colspan', colspan);
    $('#tdAdvanceBalance').attr('colspan', colspan);
    $('#tdAdvanceBalance3').attr('colspan', colspan);
    $('#tdAdvancepayment').attr('colspan', colspan);
    $('#tdAdvancepayment3').attr('colspan', colspan);
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal").style.display = "none";
        document.getElementById("trTotal3").style.display = "none";
        document.getElementById("trTotal2").style.display = "table-row";
        document.getElementById("trTotal23").style.display = "table-row";
        document.getElementById("GstRow").style.display = "none";
        document.getElementById("GstRow3").style.display = "none";
        document.getElementById("GstRow2").style.display = "table-row";
        document.getElementById("GstRow23").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax3").style.display = "table-row";
        document.getElementById("GrandTotalRow").style.display = "none";
        document.getElementById("GrandTotalRow3").style.display = "none";
        document.getElementById("GrandTotalRow2").style.display = "table-row";
        document.getElementById("GrandTotalRow23").style.display = "table-row";
    }
    $('#OrderInvoice').show();
    $('#OrderInvoice3').show();
    $('#OrderInvoiceName').show();
    $('#OrderInvoiceName3').show();
    $('#BillNoName').show();
    $('#BillNoName3').show();
    $('#BillNo').show();
    $('#BillNo3').show();
    $('#CompanyAddress').show();
    $('#CompanyAddress3').show();
    $('#CompanyAddress3').text($("#hfAddress").val());
    $('#CompanyNumber').show();
    $('#CompanyNumber3').show();
    $("#CompanyNumber3").text("Ph: " + $("#hfPhoneNo").val());
    $('#imgLogo2').show();
    $('#imgLogo23').show();
    document.getElementById('imgLogo23').src = document.getElementById('imgLogo2').src;
    $("#Cashier").text('Cashier: ' + $("#user-detail-bold").text());
    $("#Cashier3").text('Cashier: ' + $("#user-detail-bold").text());
    $("#CustomerType").text(document.getElementById("hfCustomerType").value);
    $("#CustomerType3").text(document.getElementById("hfCustomerType").value);
    $("#InvoiceDate").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#InvoiceDate3").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    document.getElementById("trCardAccountTitle").style.display = "none";
    document.getElementById("trCardAccountTitle3").style.display = "none";
    document.getElementById("trBankDiscount").style.display = "none";
    $("#lblCreditCardNo").text("");
    $("#lblCreditCardNo3").text("");
    $("#lblBankDiscount").text("");
    $("#lblAccountTitle").text("");
    $("#lblAccountTitle3").text("");
    $("#GrandTotal-value").text("");
    $("#GrandTotal-value5").text("");
    document.getElementById('trKOTNo').style.display = "none";
    document.getElementById('trKOTNo3').style.display = "none";
    document.getElementById('trDiscReason').style.display = "none";
    document.getElementById('trDiscReason3').style.display = "none";
    document.getElementById('trTakeawayOrderNo').style.display = "none";
    document.getElementById('trTakeawayOrderNo3').style.display = "none";
    document.getElementById('trOrderNo').style.display = "table-row";
    document.getElementById('trOrderNo3').style.display = "table-row";
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
        $("#OrderInvoice3").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
        document.getElementById('trKOTNo').style.display = "table-row";
        document.getElementById('trKOTNo3').style.display = "table-row";
        $("#KOTNo").text("KOT No:" + $("#txtManualOrderNo").val());
        $("#KOTNo3").text("KOT No:" + $("#txtManualOrderNo").val());
    }
    else {
        $("#OrderInvoice").text($("#MaxOrderNo").text());
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
    }

    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo').style.display = "none";
        document.getElementById('RegNo3').style.display = "none";
    }
    else {
        $('#RegNo').show();
        $('#RegNo3').show();
        $('#RegNo3').text($("#hfTaxAuthorityLabel2").val() + ": " + $("#hfRegNo").val());
    }

    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN').style.display = "none";
        document.getElementById('spSTRN3').style.display = "none";
    }
    else {
        $('#spSTRN').show();
        $('#spSTRN3').show();
        $('#spSTRN3').text("STRN : " + $("#hfSTRN").val());
    }
    if ($("#txtManualOrderNo").val() != "") {
        $("#OrderInvoice").text($("#MaxOrderNo").text());
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
    }
    else {
        $("#OrderInvoice").text($("#MaxOrderNo").text());
        $("#OrderInvoice3").text($("#MaxOrderNo").text());
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($("#txtTakeawayCustomer").val() != "") {
            if ($('select#ddlCustomer option:selected').val() === '0') {
                $("#CustomerDetail").text($("#txtTakeawayCustomer").val());
                $('#CustomerDetail').show();
                $("#CustomerDetail3").text($("#txtTakeawayCustomer").val());
                $('#CustomerDetail3').show();
            }
            else {
                if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                    $("#CustomerDetail").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
                    $("#CustomerDetail3").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
                }
                else {
                    $("#CustomerDetail").text($('select#ddlCustomer option:selected').text());
                    $("#CustomerDetail3").text($('select#ddlCustomer option:selected').text());
                }
                $('#CustomerDetail').show();
                $('#CustomerDetail3').show();
            }
        }
        $("#OrderTakerName").text("O-T:");
        $("#OrderTakerName3").text("O-T:");
        $('#OrderTakerName').show();
        $('#OrderTakerName3').show();
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker").text(OTaker);
        $("#OrderTaker3").text(OTaker);
        $('#OrderTaker').show();
        $('#OrderTaker3').show();
        $("#CoverTable").text('Token ID: ' + $("#txtCoverTable").val());
        $("#CoverTable3").text('Token ID: ' + $("#txtCoverTable").val());
        document.getElementById("CoverTable").setAttribute("style", "font-weight:bold;");
        document.getElementById("CoverTable3").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName').style.display = "none";
        document.getElementById('InvoiceTableName3').style.display = "none";
        document.getElementById('InvoiceTable').style.display = "none";
        document.getElementById('InvoiceTable3').style.display = "none";
        document.getElementById('trTakeawayOrderNo').style.display = "table-row";
        document.getElementById('trTakeawayOrderNo3').style.display = "table-row";
        document.getElementById('trOrderNo').style.display = "none";
        document.getElementById('trOrderNo3').style.display = "none";
        $("#spanTakeawayOrderNo").text("Your Order No:" + $("#MaxOrderNo").text());
        $("#spanTakeawayOrderNo3").text("Your Order No:" + $("#MaxOrderNo").text());
    }
    else if (document.getElementById("hfCustomerType").value == "Delivery") {
        $("#OrderTakerName").text("D-M:");
        $("#OrderTakerName3").text("D-M:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker").text(OTaker);
        $("#OrderTaker3").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail").text(CDetail);
        $("#CustomerDetail3").text(CDetail);
        $("#InvoiceTableName").text("Ph:");
        $("#InvoiceTableName3").text("Ph:");
        $('#OrderTakerName').show();
        $('#OrderTakerName3').show();
        $('#OrderTaker').show();
        $('#OrderTaker3').show();
        $('#CustomerDetail').show();
        $('#CustomerDetail3').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable').show();
        $('#InvoiceTable3').show();
        $("#CoverTable").text('');
        $("#CoverTable3").text('');
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable").text('Token ID: ' + $("#txtCoverTable").val());
            $("#CoverTable3").text('Token ID: ' + $("#txtCoverTable").val());
            $("#InvoiceTableName").text("");
            $("#InvoiceTableName3").text("");
            $("#InvoiceTable").text("");
            $("#InvoiceTable3").text("");
        }
        else {
            $("#CoverTable").text('Covers: ' + $("#txtCoverTable").val());
            $("#CoverTable3").text('Covers: ' + $("#txtCoverTable").val());
            $("#InvoiceTableName").text("Table No:");
            $("#InvoiceTableName3").text("Table No:");
            $("#InvoiceTable").text($("#TableNo1").text());
            $("#InvoiceTable3").text($("#TableNo1").text());
        }
        if ($('select#ddlCustomer option:selected').val() === '0') {
            $("#CustomerDetail").text($("#txtTakeawayCustomer").val());
            $('#CustomerDetail').show();
            $("#CustomerDetail3").text($("#txtTakeawayCustomer").val());
            $('#CustomerDetail3').show();
        }
        else {
            if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                $("#CustomerDetail").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
                $("#CustomerDetail3").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
            }
            else {
                $("#CustomerDetail").text($('select#ddlCustomer option:selected').text());
                $("#CustomerDetail3").text($('select#ddlCustomer option:selected').text());
            }
            $('#CustomerDetail').show();
            $('#CustomerDetail3').show();
        }
        $("#OrderTakerName").text("O-T:");
        $("#OrderTakerName3").text("O-T:");
        var OTaker = $("#ddlOrderBooker option:selected").text();
        $("#OrderTaker").text(OTaker);
        $("#OrderTaker3").text(OTaker);
        document.getElementById("CoverTable").setAttribute("style", "font-weight:normal;");
        document.getElementById("CoverTable3").setAttribute("style", "font-weight:normal;");
        $('#OrderTakerName').show();
        $('#OrderTakerName3').show();
        $('#OrderTaker').show();
        $('#OrderTaker3').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTableName3').show();
        $('#InvoiceTable').show();
        $('#InvoiceTable3').show();
    }
    $("#BillNo").text($("#hfInvoiceNo").val());
    $("#BillNo3").text($("#hfInvoiceNo").val());
    //#region Products Detail
    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody').empty(); // clear all skus  from invoice
    $('#invoiceDetailBody3').empty(); // clear all skus  from invoice
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            totalamount = orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY;
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody').append(row);
                            $('#invoiceDetailBody3').append(row);
                        }
                        break;
                    }
                }
            }
        }
    }

    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        //if (orderedProducts[i].I_D_ID == 0) {//For Normal Item Printing
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
                var GstInclusive = 0;
                if ($('#hfPaymentType').val() == "1") {
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);

                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody').append(row);
            $('#invoiceDetailBody3').append(row);
        }
    }
    sortTable();
    //--------------------------------------------------------------------------

    //#endregion Products Detail

    var Gst = 0;
    if (parseFloat($('#hfCustomerGST').val()) > 0) {
        Gst = $('#hfCustomerGST').val();
    }
    else {
        if (document.getElementById('hfIsGSTVoid').value == '0') {
            if ($('#hfPaymentType').val() == "1") {
                Gst = document.getElementById("hfSalesTaxCreditCard").value;
            }
            else {
                Gst = document.getElementById("hfSalesTax").value;
            }
        }
    }
    if (Gst == "")
    { Gst = 0; }
    if (Gst > 0) {
        $("#SaleInvoiceText").text("Sales Tax Invoice");
        $("#SaleInvoiceText3").text("Sales Tax Invoice");
    }
    else {
        $("#SaleInvoiceText").text("Sales Invoice");
        $("#SaleInvoiceText3").text("Sales Invoice");
    }
    $("#TotalValue").text($("#subTotal").text());
    $("#TotalValue5").text($("#TotalValue").text());
    $("#TotalValue2").text(parseFloat(totalamountWithGST).toFixed(0));
    $("#TotalValue23").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = $("#subTotal").text();

    var text = "";
    $("#advance-text").text(text);
    $("#advance-text3").text(text);
    $("#advance-value").text(text);
    $("#advance-value3").text(text);
    $("#AdvanceBalance-text").text(text);
    $("#AdvanceBalance-text3").text(text);
    $("#AdvanceBalance-value").text(text);
    $("#AdvanceBalance-value3").text(text);
    //When Discount not enter through Print invoice POpUP-----------------
    var discount = $("#lblDiscountTotal").text();
    if ($("#lblDiscountTotal").text() == "0") {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotalPayment").text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotalPayment").text()) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val() - discount);
        }
        $("#Discount-text").text(text);
        $("#Discount-text3").text(text);
        if ($('#hfPaymentType').val() == "1") {
            $("#Gst-valueCredit").text(Math.round(Gst, 0));
            $("#Gst-valueCredit4").text(Math.round(Gst, 0));
            $("#Gst-valueCredit2").text(Math.round(Gst, 0));
            $("#Gst-valueCredit23").text(Math.round(Gst, 0));
        }
        else {
            $("#Gst-value").text(Math.round(Gst, 0));
            $("#Gst-value4").text(Math.round(Gst, 0));
            $("#Gst-value2").text(Math.round(Gst, 0));
            $("#Gst-value23").text(Math.round(Gst, 0));
        }
        $("#Discount-value").text(text);
        $("#Discount-value4").text(text);
        ShowHideInvoiceFootDiscount3("false");
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotalPayment").text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotalPayment").text()) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat($("#hfGrandTotal").val() - discount);
        }
        if ($("#hfDiscountType").val() == "0" && $("#txtDiscount2").val() != '') {
            var dic = "Disc @" + $("#txtDiscount").val() + " % :";
            $("#Discount-text").text(dic);
            $("#Discount-text3").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text3").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text3").text('Discount :');
            }
        }

        if ($('#hfPaymentType').val() == "1") {
            $("#Gst-valueCredit").text(Math.round(Gst, 0));
            $("#Gst-valueCredit4").text(Math.round(Gst, 0));
            $("#Gst-valueCredit2").text(Math.round(Gst, 0));
            $("#Gst-valueCredit23").text(Math.round(Gst, 0));
        }
        else {
            $("#Gst-value").text(Math.round(Gst, 0));
            $("#Gst-value4").text(Math.round(Gst, 0));
            $("#Gst-value2").text(Math.round(Gst, 0));
            $("#Gst-value23").text(Math.round(Gst, 0));
        }
        $("#Discount-value").text($("#lblDiscountTotal").text());
        $("#Discount-value4").text($("#lblDiscountTotal").text());
        $("#GrandTotal-value").text($("#lblPaymentDue").text());
        $("#GrandTotal-value5").text($("#lblPaymentDue").text());
        ShowHideInvoiceFootDiscount3("true");
    }
    if ($("#txtDiscountReason").val() != "") {
        document.getElementById('trDiscReason').style.display = "table-row";
        document.getElementById('trDiscReason3').style.display = "table-row";
        $("#lblDiscReason").text("Discount/Complimentary Reason: " + $("#txtDiscountReason").val());
        $("#lblDiscReason3").text("Discount/Complimentary Reason: " + $("#txtDiscountReason").val());
    }
    if ($("#txtDiscountAuthRemarks").val() != "") {
        document.getElementById('trDiscReason').style.display = "table-row";
        document.getElementById('trDiscReason3').style.display = "table-row";
        $("#lblDiscReason").text("Discount/Complimentary Reason: " + $("#txtDiscountAuthRemarks").val());
        $("#lblDiscReason3").text("Discount/Complimentary Reason: " + $("#txtDiscountAuthRemarks").val());
    }
    if ($('#hfItemWiseGST').val() == "1") {
        Gst = $("#lblGSTTotal").text();
        $("#GST-text").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text3").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text2").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text23").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value").text(Math.round(Gst, 0));
        $("#Gst-value4").text(Math.round(Gst, 0));
        $("#Gst-value2").text(Math.round(Gst, 0));
        $("#Gst-value23").text(Math.round(Gst, 0));
    }

    if ($('#hfPaymentType').val() == "2") {
        $("#PayIn-text").text('Payment IN :');
        $("#PayIn-text3").text('Payment IN :');
        $("#PayType").text('MOP: Credit');
        $("#PayType3").text('MOP: Credit');
        $("#PayIn-value").text(0);
        $("#PayIn-value3").text(0);
        $("#balance-text").text('Balance :');
        $("#balance-text3").text('Balance :');
        $("#balance-value").text(parseFloat($("#GrandTotal-value").text()).toFixed(0) * -1);
        $("#balance-value3").text(parseFloat($("#GrandTotal-value").text()).toFixed(0) * -1);
        $("#balance-text2").text(text);
        $("#balance-text23").text(text);
        $("#balance-value2").text(text);
        $("#balance-value23").text(text);
    }
    else if ($('#hfPaymentType').val() == "1") {//For Credit Card Payment
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trCardAccountTitle3").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (document.getElementById("txtCreditCardNo").value != "") {
            $("#lblCreditCardNo").text("Card No: " + document.getElementById("txtCreditCardNo").value);
            $("#lblCreditCardNo3").text("Card No: " + document.getElementById("txtCreditCardNo").value);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (document.getElementById("txtCreditCardAccountTile").value != "") {
            $("#lblAccountTitle").text("Acc. Title : " + document.getElementById("txtCreditCardAccountTile").value);
            $("#lblAccountTitle3").text("Acc. Title : " + document.getElementById("txtCreditCardAccountTile").value);
        }
        $("#PayIn-text").text('Payment IN :');
        $("#PayIn-text3").text('Payment IN :');
        var cash = $("#txtCashRecieved").val();
        var credit = $("#lblPaymentDue").text();
        var credit = credit - cash;

        if (cash > 0) {
            $("#PayType").text('MOP: Mixed');
            $("#PayType3").text('MOP: Mixed');
            $("#PayIn-value").text($("#txtCashRecieved").val());
            $("#PayIn-value3").text(parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()));
            $("#balance-text").text('Credit Card:');
            $("#balance-text3").text('Credit Card:');
            $("#balance-value").text(parseFloat(credit).toFixed(0));
            $("#balance-value3").text(parseFloat(credit).toFixed(0));
            $("#balance-text2").text('Balance :');
            $("#balance-text23").text('Balance :');
            $("#balance-value2").text(0);
            $("#balance-value23").text(0);
        }
        else {
            $("#PayType").text('MOP: Credit Card');
            $("#PayType3").text('MOP: Credit Card');
            if (parseFloat($("#hfCustomerAdvanceAmount").val()) < parseFloat($("#lblPaymentDue").text())) {
                $("#PayIn-value").text(parseFloat(credit) - parseFloat($("#hfCustomerAdvanceAmount").val()));
                $("#PayIn-value3").text(parseFloat(credit) - parseFloat($("#hfCustomerAdvanceAmount").val()) + parseFloat($("#hfPOSFee").val()));
            }
            else {
                $("#PayIn-value").text(credit);
                $("#PayIn-value3").text(credit + parseFloat($("#hfPOSFee").val()));
            }
            $("#balance-text").text('Balance :');
            $("#balance-text3").text('Balance :');
            if (parseFloat($("#hfCustomerAdvanceAmount").val()) > parseFloat($("#lblPaymentDue").text())) {
                $("#balance-value").text(text);
                $("#balance-value3").text(text);
                $("#balance-text").text(text);
                $("#balance-text3").text(text);
            }
            else {
                $("#balance-value").text(0);
                $("#balance-value3").text(0);
            }
            $("#balance-text2").text(text);
            $("#balance-text23").text(text);
            $("#balance-value2").text(text);
            $("#balance-value23").text(text);
        }
    }
    else if ($('#hfPaymentType').val() == "3") {
        $("#PayType3").text('MOP: Easypaisa');
    }
    else if ($('#hfPaymentType').val() == "4") {
        $("#PayType3").text('MOP: Jaz Cash');
    }
    else if ($('#hfPaymentType').val() == "5") {
        $("#PayType3").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType").text('MOP: Cash');
        $("#PayType3").text('MOP: Cash');
        $("#PayIn-text").text('Payment IN :');
        $("#PayIn-text3").text('Payment IN :');
        $("#balance-text").text('Change :');
        $("#balance-text3").text('Change :');
        $("#balance-text2").text(text);
        $("#balance-text23").text(text);
        $("#PayIn-value").text($("#txtCashRecieved").val());
        $("#PayIn-value3").text(parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()));
        $("#balance-value").text(parseFloat($("#lblBalance").text()).toFixed(0));
        $("#balance-value3").text(parseFloat($("#lblBalance").text()).toFixed(0));
        $("#balance-value2").text(text);
        $("#balance-value23").text(text);
    }

    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || document.getElementById("hfCustomerType").value == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if ($('#hfServiceType').val() == "0") {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $("#Service-text").text("Del. Chargs @" + document.getElementById('txtService').value + " % :");
                $("#Service-text4").text("Del. Chargs @" + document.getElementById('txtService').value + " % :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " @" + document.getElementById('txtService').value + " % :");
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + document.getElementById('txtService').value + " % :");
            }
        }
        else {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $("#Service-text").text("Delivery Charges :");
                $("#Service-text4").text("Delivery Charges :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " :");
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        if (parseFloat($("#lblServiceChargesTotalPayment").text()) > 0) {
            if (document.getElementById("hfCustomerType").value == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow").style.display = "none";
                    document.getElementById("ServiceChargesRow3").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow").style.display = "table-row";
                    document.getElementById("ServiceChargesRow3").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow3").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow").style.display = "none";
            document.getElementById("ServiceChargesRow3").style.display = "none";
        }
        $("#Service-value").text($("#lblServiceChargesTotalPayment").text());
        $("#Service-value4").text($("#lblServiceChargesTotalPayment").text());
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "none";
        document.getElementById("ServiceChargesRow3").style.display = "none";
    }
    ShowHideInvoiceFootGst3(Gst, parseInt($('#hfPaymentType').val()));
    ShowHideInvoiceFootTotal3(Gst, $("#lblDiscountTotal").text(), parseFloat(document.getElementById('txtService2').value));

    if ($("#hfBillFormat").val() === "2") {
        var total = $("#TotalValue2").text();
        var tax = 0;

        if ($('#hfPaymentType').val() == "1") {
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
            tax = $("#Gst-value23").text();
        }
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
        $("#ExclusiveST-value3").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value2").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        $("#GrandTotal-value23").text(parseFloat(total) - parseFloat(discount) + parseFloat(service));
        if (discount == 0) {
            $("#GrandTotal-text2").text("Total Bill Amount :");
            $("#GrandTotal-text23").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text2").text("Amount after Disc. :");
            $("#GrandTotal-text23").text("Amount after Disc. :");
        }
    }
    if ($('#hfHideOrderInvoieNo').val() == "1") {
        document.getElementById('trOrderNo').style.display = "none";
        document.getElementById('trOrderNo3').style.display = "none";
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNoName3').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
        document.getElementById('BillNo3').style.display = "none";
    }
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNoName3').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
        document.getElementById('BillNo3').style.display = "none";
    }
    var tax = parseFloat($("#Gst-value").text());
    if ($('#hfPaymentType').val() == "1") {
        tax = parseFloat($("#Gst-valueCredit").text());
    }

    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + parseFloat($("#lblServiceChargesTotalPayment").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat($("#hfGrandTotal").val()) + tax + parseFloat($("#lblServiceChargesTotalPayment").text()) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }

    if ($('#hfPaymentType2').val() == "1") {
        if ($("#hfBillFormat").val() === "4") {
            var GstInfoValue = 0;
            var newGST = parseFloat(document.getElementById("hfSalesTax").value) - parseFloat(document.getElementById("hfSalesTaxCreditCard").value);
            GstInfoValue = parseFloat(amountDue) / ((newGST + 100) / 100);
            GstInfoValue = (parseFloat(GstInfoValue) * parseFloat(document.getElementById("hfSalesTaxCreditCard").value)) / (100 + parseFloat(document.getElementById("hfSalesTaxCreditCard").value));
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
        else {
            var GstInfoValue = 0;
            GstInfoValue = parseFloat($("#hfGrandTotal").val()) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
            GstInfoValue = parseFloat($("#hfGrandTotal").val()) - GstInfoValue;
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
            $("#lblGSTInfo3").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat($("#hfGrandTotal").val()) - GstInfoValue;
        $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        $("#lblGSTInfo3").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
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
    $("#GrandTotal-value").text(parseFloat(totalvalue).toFixed(0));
    $("#GrandTotal-value5").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        document.getElementById("rowAdvance").style.display = "table-row";
        document.getElementById("rowAdvance3").style.display = "table-row";
        $("#Advancepayment-text").text("Advance:");
        $("#Advancepayment-text3").text("Advance:");
        $("#Advancepayment-value").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#Advancepayment-value3").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        if (parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0) < 0) {
            if ($("#balance-value").text() == "") {
                $("#AdvanceBalance-text").text('Balance:');
                $("#AdvanceBalance-text3").text('Balance:');
            }
            else {
                $("#AdvanceBalance-text").text('Cust. Receivable:');
                $("#AdvanceBalance-text3").text('Cust. Receivable:');
            }
            $("#AdvanceBalance-value").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
            $("#AdvanceBalance-value3").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value3").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow3").style.display = "table-row";
    }

    $.print("#dvSaleInvoice3");
}
function PaymentInvoicePrint3(tblProducts) {
    $("#CustomerAddress").text("");
    $('#CustomerAddress').hide();
    $("#LocationName4").text($("#hfLocationName").val());
    $("#BillNo4").text("BILL NO: " + tblProducts[0].InvoiceNo);
    $("#lblFacebkId4").text($("#hfFacebkId").val());
    $("#GST-textCredit24").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#GST-text4").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-text24").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val());
    $("#GST-textCredit4").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#lblComapnyEmail4").text($("#hfCompanyEmail").val());
    $("#ltrlSlipNote4").text($("#ltrlSlipNoteID").text());

    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow4").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow4").style.display = "table-row";
    }
    document.getElementById("rowAdvance4").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount4").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount4").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer4").show();
        $("#tdGSTValue4").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer4").hide();
        $("#tdGSTValue4").hide();
    }
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
    $('#tdGrandTotal4').attr('colspan', colspan);
    $('#tdGrandTotal24').attr('colspan', colspan);
    $('#tdPaymentIn4').attr('colspan', colspan);
    $('#tdChange4').attr('colspan', colspan);
    $('#tdBalance4').attr('colspan', colspan);
    $('#tdAdvance4').attr('colspan', colspan);
    $('#tdAdvanceBalance4').attr('colspan', colspan);
    $('#tdAdvancepayment4').attr('colspan', colspan);
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal4").style.display = "none";
        document.getElementById("trTotal24").style.display = "table-row";
        document.getElementById("GstRow4").style.display = "none";
        document.getElementById("GstRow24").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax4").style.display = "table-row";
        document.getElementById("GrandTotalRow4").style.display = "none";
        document.getElementById("GrandTotalRow24").style.display = "table-row";
    }
    document.getElementById('trDiscReason4').style.display = "none";
    $("#GrandTotal-value6").text("");
    $("#lblOrderNotes4").text('');
    $("#InvoiceDate4").text($("#hfCurrentWorkDate").val());
    $("#CustomerType4").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#DeliveryChannel4").text(document.getElementById("hfDeliveryChannel4").value);
    $("#Cashier4").text('Cashier: ' + $("#user-detail-bold").text());
    document.getElementById('trKOTNo4').style.display = "none";
    document.getElementById('trTakeawayOrderNo4').style.display = "none";
    document.getElementById("trCardAccountTitle4").style.display = "none";
    if (tblProducts[0].MANUAL_ORDER_NO != "") {
        $("#OrderInvoice4").text(tblProducts[0].ORDER_NO + "-" + tblProducts[0].MANUAL_ORDER_NO);
        document.getElementById('trKOTNo4').style.display = "table-row";
        $("#KOTNo4").text("KOT No:" + tblProducts[0].MANUAL_ORDER_NO);
    }
    else {
        $("#OrderInvoice4").text(tblProducts[0].ORDER_NO);
    }
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        $("#CustomerDetail4").text("Customer: " + tblProducts[0].CUSTOMER_NAME);
        $("#OrderTakerName4").text("O-T:");
        $('#OrderTakerName4').show();
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        $('#OrderTaker4').show();
        $("#CoverTable4").text('Token ID: ' + tblProducts[0].covertable);
        document.getElementById("CoverTable4").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName4').style.display = "none";
        document.getElementById('InvoiceTable4').style.display = "none";
        $("#spanTakeawayOrderNo4").text("Your Order No:" + tblProducts[0].ORDER_NO);
    }
    else if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        $("#OrderTakerName4").text("D-M:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail4").text(CDetail);
        $("#InvoiceTableName4").text("Ph:");
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#CustomerDetail4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        $("#CoverTable4").text('');
        $("#CustomerAddress").text("Address: " + $("#hfCustomerAddress").val());
        $('#CustomerAddress').show();
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable4").text('Token ID: ' + tblProducts[0].covertable);
            $("#InvoiceTableName4").text("");
            $("#InvoiceTable4").text("");
        }
        else {
            $("#CoverTable4").text('Covers: ' + tblProducts[0].covertable);
            $("#InvoiceTableName4").text("Table No:");
            $("#InvoiceTabl4e").text($("#TableNo1").text());
        }
        $("#OrderTakerName4").text("O-T:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker4").text(OTaker);
        document.getElementById("CoverTable4").setAttribute("style", "font-weight:normal;");
        $('#OrderTakerName4').show();
        $('#OrderTaker4').show();
        $('#InvoiceTableName4').show();
        $('#InvoiceTable4').show();
        if (tblProducts[0].CUSTOMER_ID === 0) {
            $("#CustomerDetail4").text("Customer: " + $("#txtTakeawayCustomer").val());
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text("");
        }
        else {
            $("#CustomerDetail4").text("Customer: " + tblProducts[0].CUSTOMER_NAME);
            $('#CustomerDetail4').show();
            $("#CustomerPhoneNo").text($("#hfCustomerNo").val());
        }
    }
    $("#lblOrderNotes4").text($('#txtRemarks').val());
    $("#BillNo").text($("#hfInvoiceNo").val());
    $('#BillNoName').show();
    $('#BillNo').show();
    $('#CompanyAddress4').show();
    $('#CompanyAddress4').text($("#hfAddress").val());
    $('#CompanyNumber4').show();
    $('#CompanyNumber4').text($("#hfPhoneNo").val());
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo24').show();
        document.getElementById('imgLogo24').src = document.getElementById('imgLogo2').src;
    }
    else {
        document.getElementById('imgLogo24').style.display = "none";
    }
    //#region Products Detail
    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN4').style.display = "none";
    }
    else {
        $('#spSTRN4').show();
        $('#spSTRN4').text("STRN : " + $("#hfSTRN").val());
    }
    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo4').style.display = "none";
    }
    else {
        $('#RegNo4').show();
        $('#RegNo4').text($("#hfTaxAuthorityLabel2").val() + " : " + $("#hfRegNo").val());
    }

    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody4').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody4').append(row);
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
                var GstInclusive = 0;
                if (tblProducts[0].PAYMENT_MODE_ID == 1) {
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody4').append(row);
        }
    }
    sortTable4();

    $("#SaleInvoiceText4").text("Sales Invoice");
    $("#TotalValue6").text(tblProducts[0].AMOUNTDUE);
    $("#TotalValue24").text(parseFloat(totalamountWithGST).toFixed(0));

    var amountDue = tblProducts[0].AMOUNTDUE;

    var text = "";
    $("#advance-text4").text(text);
    $("#advance-value4").text(text);
    $("#AdvanceBalance-text4").text(text);
    $("#AdvanceBalance-value4").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text4").text(text);
        $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
        $("#Discount-value5").text(text);
        ShowHideInvoiceFootDiscount4("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && $("#txtDiscount2").val() != '') {
            var dic = "Disc @" + $("#txtDiscount2").val() + " % :";
            $("#Discount-text4").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text4").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text4").text('Discount :');
            }
        }
        $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
        $("#Discount-value5").text(tblProducts[0].TotalDiscount);
        ShowHideInvoiceFootDiscount4("true");
    }
    if ($("#txtDiscountReason2").val() != "") {
        document.getElementById('trDiscReason4').style.display = "table-row";
        $("#lblDiscReason4").text("Discount/Complimentary Reason: " + $("#txtDiscountReason2").val());
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason4').style.display = "table-row";
        $("#lblDiscReason4").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }

    if ($('#hfItemWiseGST').val() == "1") {
        $("#Gst-value5").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value24").text(Math.round(tblProducts[0].GST, 0));
    }
    $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
    $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text4").text("Del. Chargs @" + tblProducts[0].SERVICE_CHARGES + " % :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " @" + tblProducts[0].SERVICE_CHARGES + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text4").text("Delivery Charges :");
            }
            else {
                $("#Service-text4").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        $("#Service-value5").text(tblProducts[0].SERVICE_CHARGES);
        if (parseFloat(tblProducts[0].SERVICE_CHARGES) > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow4").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow4").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow4").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow4").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow4").style.display = "none";
    }

    ShowHideInvoiceFootGst4(tblProducts[0].GST, parseInt(tblProducts[0].PAYMENT_MODE_ID));
    ShowHideInvoiceFootTotal4(tblProducts[0].GST, tblProducts[0].TotalDiscount, parseFloat(tblProducts[0].SERVICE_CHARGES));
    $("#Gst-valueCreditSaj").text(Math.round(tblProducts[0].GST, 0));
    $("#Gst-valueCredit24").text(Math.round(tblProducts[0].GST, 0));

    if ($("#hfBillFormat").val() === "2") {
        var total = tblProducts[0].AMOUNTDUE;
        var tax = 0;
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
        }

        var discount = tblProducts[0].TotalDiscount;
        var service = tblProducts[0].SERVICE_CHARGES;
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
    $("#PayIn-text4").text(text);
    $("#PayIn-value4").text(text);
    $("#balance-text4").text(text);
    $("#balance-value4").text(text);
    $("#balance-text24").text(text);
    $("#balance-value24").text(text);
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $("#PayType4").text('MOP: Credit');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#PayType4").text('MOP: Credit Card');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
            $("#PayType4").text('MOP: Easypaisa');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
            $("#PayType4").text('MOP: Jaz Cash');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
            $("#PayType4").text('MOP: Online Tran');
        }
        else {
            $("#PayType4").text('MOP: Cash');
        }
    }
    else {
        $("#PayType4").text(text);
    }
    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat(tblProducts[0].AMOUNTDUE) + parseFloat(tblProducts[0].GST) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) - GstInfoValue;
        $("#lblGSTInfo4").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(tblProducts[0].AMOUNTDUE) - GstInfoValue;
        $("#lblGSTInfo4").text("Tax: Service Tax: " + parseFloat(GstInfoValue).toFixed(0));
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 2) {
        $("#PayIn-text4").text('Tendered-Amt:');
        $("#PayType4").text('MOP: Credit');
        $("#PayIn-value4").text(0);
        $("#balance-text4").text('Change Due:');
        $("#balance-value4").text(parseFloat($("#GrandTotal-value").text()).toFixed(0) * -1);
        $("#balance-text24").text(text);
        $("#balance-value24").text(text);
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 1) { //For Credit Card Payment
        document.getElementById("trCardAccountTitle4").style.display = "table-row";
        if (document.getElementById("txtCreditCardNo").value != "") {
            $("#lblCreditCardNo4").text("Card No: " + document.getElementById("txtCreditCardNo").value);
        }
        if (document.getElementById("txtCreditCardAccountTile").value != "") {
            $("#lblAccountTitle4").text("Acc. Title : " + document.getElementById("txtCreditCardAccountTile").value);
        }
        $("#PayIn-text4").text('Tendered-Amt:');
        var cash = $("#txtCashRecieved").val();
        var credit = tblProducts[0].AMOUNTDUE;
        var credit = credit - cash;

        if (cash > 0) {
            $("#PayType4").text('MOP: Mixed');
            $("#PayIn-value4").text(parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()));
            $("#balance-text4").text('Credit Card:');
            $("#balance-value4").text(parseFloat(credit).toFixed(0));
            $("#balance-text24").text('Balance :');
            $("#balance-value24").text(0);
        }
        else {
            $("#PayType").text('MOP: Credit Card');
            if (parseFloat($("#hfCustomerAdvanceAmount").val()) < parseFloat(tblProducts[0].AMOUNTDUE)) {
                $("#PayIn-value4").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()) + parseFloat($("#hfPOSFee").val()));
            }
            else {
                $("#PayIn-value4").text(credit + parseFloat($("#hfPOSFee").val()));
            }
            $("#balance-text4").text('Change Due:');
            if (parseFloat($("#hfCustomerAdvanceAmount").val()) > parseFloat(tblProducts[0].AMOUNTDUE)) {
                $("#balance-value4").text(text);
                $("#balance-text4").text(text);
            }
            else {
                $("#balance-value4").text(0);
            }
            $("#balance-text24").text(text);
            $("#balance-value24").text(text);
        }
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
        $("#PayType4").text('MOP: Easypaisa');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
        $("#PayType4").text('MOP: Jaz Cash');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
        $("#PayType4").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType4").text('MOP: Cash');
        $("#PayIn-text4").text('Tendered-Amt:');
        $("#balance-text4").text('Change Due:');
        $("#balance-text24").text(text);
        $("#PayIn-value4").text(parseFloat($("#txtCashRecieved").val()) + parseFloat($("#hfPOSFee").val()));
        $("#balance-value4").text(parseFloat($("#lblBalance").text()).toFixed(0));
        $("#balance-value24").text(text);
    }
    $("#GrandTotal-value24").text(parseFloat(totalvalue).toFixed(0));
    $("#GrandTotal-value6").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        $("#advance-text4").text('Customer Advance:');
        $("#advance-value4").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#AdvanceBalance-text4").text('Cust. Receivable:');
        $("#AdvanceBalance-value4").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-valueSaj").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRowSaj").style.display = "table-row";
    }
    $.print("#dvSaleInvoice4");
}
function PaymentInvoicePrint4(tblProducts) {
    document.getElementById('imgLogo5').src = document.getElementById('imgLogo2').src;
    $("#GST-textCredit25").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val() + " :");
    $("#GST-text5").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTax").val() + " :");
    $("#GST-textCredit5").text($("#hfTaxAuthorityLabel").val() + " @" + $("#hfSalesTaxCreditCard").val());
    $("#ltrlSlipNote5").text($("#ltrlSlipNoteID").text());
    document.getElementById("trPoints5").style.display = "none";
    if (parseFloat(tblProducts[0].CustomerPoints) > 0) {
        document.getElementById("trPoints5").style.display = "table-row";
        $("#lblPointsValue5").text(tblProducts[0].CustomerPoints);
    }

    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow5").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow5").style.display = "table-row";
    }
    document.getElementById("rowAdvance5").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer").show();
        $("#tdGSTValue").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer").hide();
        $("#tdGSTValue").hide();
    }
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
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal5").style.display = "none";
        document.getElementById("trTotal25").style.display = "table-row";
        try {
            document.getElementById("GstRow5").style.display = "none";
        } catch (e) {

        }
        document.getElementById("GstRow25").style.display = "table-row";
        document.getElementById("GrandTotalRow5").style.display = "none";
    }
    $('#imgLogo5').show();
    $("#CustomerType5").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#InvoiceDate5").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    document.getElementById("trCardAccountTitle5").style.display = "none";
    document.getElementById("trBankDiscount5").style.display = "none";
    $("#lblCreditCardNo5").text("");
    $("#lblAccountTitle5").text("");
    $("#lblBankDiscount5").text("");
    $("#GrandTotal-value7").text("");
    document.getElementById('trDiscReason5').style.display = "none";
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        var CDetail = $("#hfTableNo").val();
    }
    else {
        if ($("#hfEatIn").val() == "1") {
        }
        if (tblProducts[0].CUSTOMER_ID === 0) {
        }
    }
    //#region Products Detail
    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody5').empty(); // clear all skus  from invoice

    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            totalamount = orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY;
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody5').append(row);
                        }
                        break;
                    }
                }
            }
        }
    }

    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        //if (orderedProducts[i].I_D_ID == 0) {//For Normal Item Printing
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = parseFloat(orderedProducts[i].AMOUNT) - parseFloat(orderedProducts[i].DISCOUNT);
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT - parseFloat(orderedProducts[i].DISCOUNT)).toFixed(2);
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
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);

                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody5').append(row);
        }
    }
    sortTable();
    //--------------------------------------------------------------------------

    //#endregion Products Detail
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        $("#TotalValue7").text(tblProducts[0].AMOUNTDUE2);
    }
    else {
        $("#TotalValue7").text(tblProducts[0].AMOUNTDUE);
    }
    $("#TotalValue25").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        amountDue = tblProducts[0].AMOUNTDUE2;
    }
    else {
        amountDue = tblProducts[0].AMOUNTDUE;
    }
    var service = 0;
    var text = "";
    $("#advance-text5").text(text);
    $("#advance-value5").text(text);
    $("#AdvanceBalance-text5").text(text);
    $("#AdvanceBalance-value5").text(text);
    if (tblProducts[0].GST > 0) {
        $("#SaleInvoiceText5").text("Sales Tax Invoice");
    }
    else {
        $("#SaleInvoiceText5").text("Sales Invoice");
    }
    //When Discount not enter through Print invoice POpUP-----------------
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text5").text(text);
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value6").text(text);
        ShowHideInvoiceFootDiscount("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && tblProducts[0].DISCOUNT2 > 0) {
            var dic = "Disc @" + tblProducts[0].DISCOUNT2 + " % :";
            $("#Discount-text5").text(dic);
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text5").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text5").text('Discount :');
            }
        }

        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#Gst-valueCredit5").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit25").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value6").text(tblProducts[0].TotalDiscount);
        $("#GrandTotal-value7").text(amountDue);
        ShowHideInvoiceFootDiscount("true");
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason5').style.display = "table-row";
        $("#lblDiscReason5").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text5").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text25").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value6").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value25").text(Math.round(tblProducts[0].GST, 0));
    }
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (document.getElementById("hfServiceChargesCalculation").value == "2") {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)) * 100, 0);

            }
            else {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue)) * 100, 0);
            }
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text6").text("Del. Chargs @" + service + " % :");
            }
            else {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text").text("Delivery Charges :");
            }
            else {
                $("#Service-text6").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        if (tblProducts[0].SERVICE_CHARGES > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow5").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow5").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow5").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow5").style.display = "none";
        }
        $("#Service-value7").text(tblProducts[0].SERVICE_CHARGES);
    }
    else {
        document.getElementById("ServiceChargesRow5").style.display = "none";
    }
    if (tblProducts[0].PAYMENT_MODE_ID == 2) {
        $("#PayIn-text5").text('Payment IN :');
        $("#PayType5").text('MOP: Credit');
        $("#PayIn-value5").text(0);
        $("#balance-text5").text('Balance :');
        var totalvalue = 0;
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
        }
        else {
            totalvalue = parseFloat(amountDue) + tblProducts[0].GST + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
        }
        $("#balance-value5").text(parseFloat(totalvalue).toFixed(0) * -1);
        $("#balance-text25").text(text);
        $("#balance-value25").text(text);
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 1) {//For Credit Card Payment
        document.getElementById("trCardAccountTitle5").style.display = "table-row";
        document.getElementById("trBankDiscount5").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo5").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount5").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle5").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        $("#PayIn-text5").text('Payment IN :');
        var cash = tblProducts[0].PAIDIN;
        var credit = 0;
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            credit = Math.round((parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)), 0);
        }
        else {
            credit = Math.round((parseFloat(amountDue) + parseFloat(tblProducts[0].GST) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(tblProducts[0].TotalDiscount)), 0);
        }
        var credit = credit - cash;

        if (cash > 0) {
            $("#PayType5").text('MOP: Mixed');
            $("#PayIn-value5").text(tblProducts[0].PAIDIN);
            $("#balance-text5").text('Credit Card:');
            $("#balance-value5").text(parseFloat(credit).toFixed(0));
            $("#balance-text25").text('Balance :');
            $("#balance-value25").text(0);
        }
        else {
            $("#PayType5").text('MOP: Credit Card');
            if (parseFloat(tblProducts[0].AdvanceAmount) < parseFloat(amountDue)) {
                $("#PayIn-value5").text(parseFloat(credit) - parseFloat(tblProducts[0].AdvanceAmount));
            }
            else {
                $("#PayIn-value5").text(credit);
            }
            $("#balance-text5").text('Balance :');
            if (parseFloat(tblProducts[0].AdvanceAmount) > parseFloat(amountDue)) {
                $("#balance-value5").text(text);
                $("#balance-text5").text(text);
            }
            else {
                $("#balance-value5").text(0);
            }
            $("#balance-text25").text(text);
            $("#balance-value25").text(text);
        }
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
        $("#PayType5").text('MOP: Easypaisa');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
        $("#PayType5").text('MOP: Jaz Cash');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
        $("#PayType5").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType5").text('MOP: Cash');
        $("#PayIn-text5").text('Payment IN :');
        $("#balance-text5").text('Change :');
        $("#balance-text25").text(text);
        $("#PayIn-value5").text(tblProducts[0].PAIDIN);
        $("#balance-value5").text(parseFloat(tblProducts[0].BALANCE).toFixed(0));
        $("#balance-value25").text(text);
    }
    ShowHideInvoiceFootGst(tblProducts[0].GST, tblProducts[0].PAYMENT_MODE_ID);
    ShowHideInvoiceFootTotal(tblProducts[0].GST, tblProducts[0].TotalDiscount, parseFloat(document.getElementById('txtService2').value));

    if ($("#hfBillFormat").val() === "2") {
        var total = tblProducts[0].AMOUNTDUE;
        var tax = 0;
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            tax = $("#Gst-valueCredit25").text();
        }
        else {
            tax = $("#Gst-value25").text();
        }
        var discount = tblProducts[0].TotalDiscount;

        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
    }
    var tax = tblProducts[0].GST;
    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        tax = parseFloat($("#Gst-valueCredit5").text());
    }

    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
    }
    else {
        totalvalue = parseFloat(amountDue) + tax + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo5").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo5").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }
    $("#GrandTotal-value7").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat(tblProducts[0].AdvanceAmount) > 0) {
        document.getElementById("rowAdvance5").style.display = "table-row";
        $("#Advancepayment-text5").text("Advance:");
        $("#Advancepayment-value5").text(parseFloat(tblProducts[0].AdvanceAmount).toFixed(0));
        if (parseFloat(totalvalue).toFixed(0) - parseFloat(tblProducts[0].AdvanceAmount).toFixed(0) < 0) {
            if ($("#balance-value5").text() == "") {
                $("#AdvanceBalance-text5").text('Balance:');
            }
            else {
                $("#AdvanceBalance-text5").text('Cust. Receivable:');
            }
            $("#AdvanceBalance-value5").text(parseFloat(totalvalue).toFixed(0) - parseFloat(tblProducts[0].AdvanceAmount).toFixed(0));
        }
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    $.print("#dvSaleInvoice5");
}
function PaymentInvoicePrint(tblProducts) {

    if ($('#hfQRCodeImageName').val() != '') {
        document.getElementById('imgOpinionSurvey').src = '/images/' + $('#hfQRCodeImageName').val();
        document.getElementById("trOpinionSurvey").style.display = "block";
    }
    document.getElementById("trPoints").style.display = "none";
    if (parseFloat(tblProducts[0].CustomerPoints) > 0) {
        document.getElementById("trPoints").style.display = "table-row";
        $("#lblPointsValue").text(tblProducts[0].CustomerPoints);
    }

    document.getElementById("InvoiceTableName").setAttribute("style", "font-weight:normal;");
    document.getElementById("InvoiceTable").setAttribute("style", "font-weight:normal;");
    $("#CustomerDetail").text('');
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        document.getElementById("ServiceChargesRow").style.display = "none";
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "table-row";
    }
    document.getElementById("rowAdvance").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer").show();
        $("#tdGSTValue").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer").hide();
        $("#tdGSTValue").hide();
    }
    $('#tdTotal').attr('colspan', colspan);
    $('#tdTotal2').attr('colspan', colspan);
    $('#tdGst2').attr('colspan', colspan);
    $('#tdGstCredit2').attr('colspan', colspan);
    $('#tdExclusiveTax').attr('colspan', colspan);
    $('#tdDiscout').attr('colspan', colspan);
    $('#tdGst').attr('colspan', colspan);
    $('#tdGstCredit').attr('colspan', colspan);
    $('#tdServiceCharges').attr('colspan', colspan);
    $('#tdPOSFee').attr('colspan', colspan);
    $('#tdGrandTotal').attr('colspan', colspan);
    $('#tdGrandTotal2').attr('colspan', colspan);
    $('#tdPaymentIn').attr('colspan', colspan);
    $('#tdChange').attr('colspan', colspan);
    $('#tdBalance').attr('colspan', colspan);
    $('#tdAdvance').attr('colspan', colspan);
    $('#tdAdvanceBalance').attr('colspan', colspan);
    $('#tdAdvancepayment').attr('colspan', colspan);
    if ($("#hfBillFormat").val() === "2") {
        document.getElementById("trTotal").style.display = "none";
        document.getElementById("trTotal2").style.display = "table-row";
        document.getElementById("GstRow").style.display = "none";
        document.getElementById("GstRow2").style.display = "table-row";
        document.getElementById("trExcusiveSalesTax").style.display = "table-row";
        document.getElementById("GrandTotalRow").style.display = "none";
        document.getElementById("GrandTotalRow2").style.display = "table-row";
    }
    $('#OrderInvoice').show();
    $('#OrderInvoiceName').show();
    $('#BillNoName').show();
    $('#BillNo').show();
    $('#CompanyAddress').show();
    $('#CompanyNumber').show();
    $('#imgLogo2').show();
    $("#Cashier").text('Cashier: ' + $("#user-detail-bold").text());
    $("#CustomerType").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#InvoiceDate").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    document.getElementById("trCardAccountTitle").style.display = "none";
    document.getElementById("trBankDiscount").style.display = "none";
    $("#lblCreditCardNo").text("");
    $("#lblAccountTitle").text("");
    $("#lblBankDiscount").text("");
    $("#GrandTotal-value").text("");
    document.getElementById('trKOTNo').style.display = "none";
    document.getElementById('trDiscReason').style.display = "none";
    document.getElementById('trLoyaltyPoints').style.display = "none";
    document.getElementById('trTakeawayOrderNo').style.display = "none";
    document.getElementById('trOrderNo').style.display = "table-row";
    if (tblProducts[0].MANUAL_ORDER_NO != "") {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO + "-" + tblProducts[0].MANUAL_ORDER_NO);
        document.getElementById('trKOTNo').style.display = "table-row";
        $("#KOTNo").text("KOT No:" + tblProducts[0].MANUAL_ORDER_NO);
    }
    else {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO);
    }

    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo').style.display = "none";
    }
    else {
        $('#RegNo').show();
    }

    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN').style.display = "none";
    }
    else {
        $('#spSTRN').show();
    }

    if (tblProducts[0].MANUAL_ORDER_NO != "") {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO);
    }
    else {
        $("#OrderInvoice").text(tblProducts[0].ORDER_NO);
    }
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        if (tblProducts[0].CUSTOMER_NAME !== "") {
            $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME + '-' + tblProducts[0].CONTACT_NUMBER);
            $('#CustomerDetail').show();
        }
        else if (tblProducts[0].TAKEAWAY_CUSTOMER != "") {
            if (tblProducts[0].CUSTOMER_ID === 0) {
                $("#CustomerDetail").text(tblProducts[0].TAKEAWAY_CUSTOMER);
                $('#CustomerDetail').show();
            }
            else {
                if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                    $("#CustomerDetail").text(GetCustomerInfo(tblProducts[0].CUSTOMER_ID));
                }
                else {
                    $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME);
                }
                $('#CustomerDetail').show();
            }
        }
        $("#OrderTakerName").text("O-T:");
        $('#OrderTakerName').show();
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        $('#OrderTaker').show();
        $("#CoverTable").text('Token ID: ' + tblProducts[0].covertable);
        document.getElementById("CoverTable").setAttribute("style", "font-weight:bold;");
        document.getElementById('InvoiceTableName').style.display = "none";
        document.getElementById('InvoiceTable').style.display = "none";
        document.getElementById('trTakeawayOrderNo').style.display = "table-row";
        document.getElementById('trOrderNo').style.display = "none";
        $("#spanTakeawayOrderNo").text("Your Order No:" + tblProducts[0].ORDER_NO);
    }
    else if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
        $("#OrderTakerName").text("D-M:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail").text(CDetail);
        $("#InvoiceTableName").text("Ph:");
        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#CustomerDetail').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTable').show();
        document.getElementById("InvoiceTableName").setAttribute("style", "font-weight:bold;");
        document.getElementById("InvoiceTable").setAttribute("style", "font-weight:bold;");
        $("#CoverTable").text('');
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable").text('Token ID: ' + tblProducts[0].covertable);
            $("#InvoiceTableName").text("");
            $("#InvoiceTable").text("");
        }
        else {
            $("#CoverTable").text('Covers: ' + tblProducts[0].covertable);
            $("#InvoiceTableName").text("Table No:");
            $("#InvoiceTable").text(tblProducts[0].TableNo);
        }
        if (tblProducts[0].CUSTOMER_ID === 0) {            
        }
        else {
            if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                $("#CustomerDetail").text(GetCustomerInfo(tblProducts[0].CUSTOMER_ID));
            }
            else {
                $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME + '-' + tblProducts[0].CONTACT_NUMBER);
            }
            $('#CustomerDetail').show();
        }
        $("#OrderTakerName").text("O-T:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker").text(OTaker);
        document.getElementById("CoverTable").setAttribute("style", "font-weight:normal;");
        $('#OrderTakerName').show();
        $('#OrderTaker').show();
        $('#InvoiceTableName').show();
        $('#InvoiceTable').show();
    }
    $("#BillNo").text(tblProducts[0].InvoiceNo);
    //#region Products Detail
    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody').empty(); // clear all skus  from invoice

    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var DISCOUNTDeal = orderedProducts[i].DISCOUNTDeal;
                            totalamount = orderedProducts[i].A_PRICE * orderedProducts[i].DEAL_QTY - parseFloat(DISCOUNTDeal);
                            if (parseFloat(DISCOUNTDeal) > 0) {
                                var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + DISCOUNTDeal + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                $('#invoiceDetailBody').append(row);
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                                $('#invoiceDetailBody').append(row);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    var tableIdSet = new Set();
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        //if (orderedProducts[i].I_D_ID == 0) {//For Normal Item Printing
        var qty = orderedProducts[i].QTY;
        var tprice = 0;
        var amount = 0;
        if (orderedProducts[i].T_PRICE.toString().indexOf(".") == -1) {
            tprice = orderedProducts[i].T_PRICE;
            amount = parseFloat(orderedProducts[i].AMOUNT) - parseFloat(orderedProducts[i].DISCOUNT);
        }
        else {
            tprice = parseFloat(orderedProducts[i].T_PRICE).toFixed(2);
            amount = parseFloat(orderedProducts[i].AMOUNT - parseFloat(orderedProducts[i].DISCOUNT)).toFixed(2);
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
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);

                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    tableIdSet.add(Number(Modifierparent[k].SALE_INVOICE_DETAIL_ID));
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
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
                amount = parseFloat(product.AMOUNT) - parseFloat(product.DISCOUNT);
            }
            else {
                tprice = parseFloat(product.T_PRICE).toFixed(2);
                amount = parseFloat(product.AMOUNT - parseFloat(product.DISCOUNT)).toFixed(2);
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

                    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                        var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + priceWithGST + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
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
                    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                        if ($('#hfItemWiseGST').val() == "1") {
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice.toFixed(2) + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
                    '<td class="text-right">' + product.GSTPER + '</td>' +
                    '<td class="text-right">' + parseFloat(product.ItemWiseGST).toFixed(2) + '</td>' +
                    '<td class="text-right">' + amount.toFixed(2) + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                        else {
                            var row = $(' <tr><td>' + product.SKU_NAME
                                + '</td><td class="text-right">'
                                + product.QTY + '</td><td class="text-right">'
                                + tprice + '</td><td class="text-right">'
                                + product.DISCOUNT + '</td><td class="text-right">'
                                + amount + '</td><td style="display:none">'
                                + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice + '</td>' +
                    '<td class="text-right">' + product.DISCOUNT + '</td>' +
                    '<td class="text-right">' + amount + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                    }
                    else {
                        if ($('#hfItemWiseGST').val() == "1") {
                            var row = $('<tr>' +
                    '<td>' + product.SKU_NAME + '</td>' +
                    '<td class="text-right">' + product.QTY + '</td>' +
                    '<td class="text-right">' + tprice + '</td>' +
                    '<td class="text-right">' + product.GSTPER + '</td>' +
                    '<td class="text-right">' + parseFloat(product.ItemWiseGST).toFixed(2) + '</td>' +
                    '<td class="text-right">' + amount + '</td>' +
                    '<td style="display:none">' + product.SALE_INVOICE_DETAIL_ID + '</td>' +
                '</tr>');
                            $('#invoiceDetailBody').append(row);
                            tableIdSet.add(productId);
                        }
                        else {
                            var row = $(' <tr><td>'
                                + product.SKU_NAME + '</td><td class="text-right">'
                                + product.QTY + '</td><td class="text-right">'
                                + tprice + '</td><td class="text-right">'
                                + amount + '</td><td style="display:none">'
                                + product.SALE_INVOICE_DETAIL_ID + '</td></tr>');

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
        }
    });

    sortTable();
    //--------------------------------------------------------------------------

    //#endregion Products Detail
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        $("#TotalValue").text(tblProducts[0].AMOUNTDUE2.toFixed(0));
    }
    else {
        $("#TotalValue").text(tblProducts[0].AMOUNTDUE.toFixed(0));
    }
    $("#TotalValue2").text(parseFloat(totalamountWithGST).toFixed(0));
    var amountDue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        amountDue = tblProducts[0].AMOUNTDUE2;
    }
    else {
        amountDue = tblProducts[0].AMOUNTDUE;
    }
    var service = 0;
    var text = "";
    $("#advance-text").text(text);
    $("#advance-value").text(text);
    $("#AdvanceBalance-text").text(text);
    $("#AdvanceBalance-value").text(text);
    if (tblProducts[0].GST > 0) {
        $("#SaleInvoiceText").text("Sales Tax Invoice");
    }
    else {
        $("#SaleInvoiceText").text("Sales Invoice");
    }
    //When Discount not enter through Print invoice POpUP-----------------
    var discount = tblProducts[0].TotalDiscount;
    if (tblProducts[0].TotalDiscount == 0) {
        $("#Discount-text").text(text);
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit2").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value").text(text);
        ShowHideInvoiceFootDiscount("false");
    }
    else {
        if ($("#hfDiscountType").val() == "0" && tblProducts[0].DISCOUNT2 > 0) {
            if (tblProducts[0].EmpDiscountType == 11) {
                var dic = "Disc @" + tblProducts[0].BankDiscount + " % :";
                $("#Discount-text").text(dic);
            }
            else {
                var dic = "Disc @" + tblProducts[0].DISCOUNT2 + " % :";
                $("#Discount-text").text(dic);
            }
        }
        else {
            if (parseFloat(tblProducts[0].ITEM_DISCOUNT) > 0) {
                var dis = (parseFloat(tblProducts[0].TotalDiscount) / parseFloat(amountDue) * 100).toFixed(0);
                $("#Discount-text").text("Disc @" + dis + "% :");
            }
            else {
                $("#Discount-text").text('Discount :');
            }
        }

        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#Gst-valueCredit").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-valueCredit2").text(Math.round(tblProducts[0].GST, 0));
        }
        else {
            $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
            $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
        }
        $("#Discount-value").text(Math.round(tblProducts[0].TotalDiscount,0));
        $("#GrandTotal-value").text(amountDue);
        ShowHideInvoiceFootDiscount("true");
    }
    if (tblProducts[0].DiscountRemarks != "") {
        document.getElementById('trDiscReason').style.display = "table-row";
        $("#lblDiscReason").text("Discount/Complimentary Reason: " + tblProducts[0].DiscountRemarks);
    }
    if (parseFloat(tblProducts[0].LOYALTY_POINTS) > 0) {
        document.getElementById('trLoyaltyPoints').style.display = "table-row";
        $("#lblLoyaltyPoints").text("Loyalty Points: " + tblProducts[0].LOYALTY_POINTS);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text2").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value").text(Math.round(tblProducts[0].GST, 0));
        $("#Gst-value2").text(Math.round(tblProducts[0].GST, 0));
    }
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (document.getElementById("hfServiceChargesCalculation").value == "2") {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)) * 100, 0);

            }
            else {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue)) * 100, 0);
            }
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text").text("Del. Chargs @" + service + " % :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text").text("Delivery Charges :");
            }
            else {
                $("#Service-text").text($("#hfServiceChargesLabel").val() + " :");
            }
        }
        if (tblProducts[0].SERVICE_CHARGES > 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
                if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                    document.getElementById("ServiceChargesRow").style.display = "none";
                }
                else {
                    document.getElementById("ServiceChargesRow").style.display = "table-row";
                }
            }
            else {
                document.getElementById("ServiceChargesRow").style.display = "table-row";
            }
        }
        else {
            document.getElementById("ServiceChargesRow").style.display = "none";
        }
        $("#Service-value").text(tblProducts[0].SERVICE_CHARGES);
    }
    else {
        document.getElementById("ServiceChargesRow").style.display = "none";
    }
    if (tblProducts[0].PAYMENT_MODE_ID == 2) {
        $("#PayIn-text").text('Payment IN :');
        $("#PayType").text('MOP: Credit');
        $("#PayIn-value").text(0);
        $("#balance-text").text('Balance :');
        var totalvalue = 0;
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
        }
        else {
            totalvalue = parseFloat(amountDue) + tblProducts[0].GST + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
        }
        $("#balance-value").text(parseFloat(totalvalue).toFixed(0) * -1);
        $("#balance-text2").text(text);
        $("#balance-value2").text(text);
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 1) {//For Credit Card Payment
        document.getElementById("trCardAccountTitle").style.display = "table-row";
        document.getElementById("trBankDiscount").style.display = "table-row";
        if (tblProducts[0].CreditCardNo != "") {
            $("#lblCreditCardNo").text("Card No: " + tblProducts[0].CreditCardNo);
        }
        if (tblProducts[0].BankDiscountName != "") {
            $("#lblBankDiscount").text("Bank Discount: " + tblProducts[0].BankDiscountName);
        }
        if (tblProducts[0].CreditCardAccountTile != "") {
            $("#lblAccountTitle").text("Acc. Title : " + tblProducts[0].CreditCardAccountTile);
        }
        $("#PayIn-text").text('Payment IN :');
        var cash = tblProducts[0].PAIDIN;
        var credit = 0;
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            credit = Math.round((parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)), 0);
        }
        else
        {
            credit = Math.round((parseFloat(amountDue) + parseFloat(tblProducts[0].GST) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(tblProducts[0].TotalDiscount)), 0);
        }
        var credit = credit - cash;

        if (cash > 0) {
            $("#PayType").text('MOP: Mixed');
            $("#PayIn-value").text(tblProducts[0].PAIDIN);
            $("#balance-text").text('Credit Card:');
            $("#balance-value").text(parseFloat(credit).toFixed(0));
            $("#balance-text2").text('Balance :');
            $("#balance-value2").text(0);
        }
        else {
            $("#PayType").text('MOP: Credit Card');
            if (parseFloat(tblProducts[0].AdvanceAmount) < parseFloat(amountDue)) {
                $("#PayIn-value").text(parseFloat(credit) - parseFloat(tblProducts[0].AdvanceAmount));
            }
            else {
                $("#PayIn-value").text(credit);
            }
            $("#balance-text").text('Balance :');
            if (parseFloat(tblProducts[0].AdvanceAmount) > parseFloat(amountDue)) {
                $("#balance-value").text(text);
                $("#balance-text").text(text);
            }
            else {
                $("#balance-value").text(0);
            }
            $("#balance-text2").text(text);
            $("#balance-value2").text(text);
        }
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
        $("#PayType").text('MOP: Easypaisa');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
        $("#PayType").text('MOP: Jaz Cash');
    }
    else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
        $("#PayType").text('MOP: Online Tran');
    }
    else {//For Cash Payment
        $("#PayType").text('MOP: Cash');
        $("#PayIn-text").text('Payment IN :');
        $("#balance-text").text('Change :');
        $("#balance-text2").text(text);
        $("#PayIn-value").text(tblProducts[0].PAIDIN);
        $("#balance-value").text(parseFloat(tblProducts[0].BALANCE).toFixed(0));
        $("#balance-value2").text(text);
    }
    ShowHideInvoiceFootGst(tblProducts[0].GST, tblProducts[0].PAYMENT_MODE_ID);
    ShowHideInvoiceFootTotal(tblProducts[0].GST, tblProducts[0].TotalDiscount, parseFloat(document.getElementById('txtService2').value));

    if ($("#hfBillFormat").val() === "2") {
        var total = tblProducts[0].AMOUNTDUE;
        var tax = 0;
        if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            tax = $("#Gst-valueCredit2").text();
        }
        else {
            tax = $("#Gst-value2").text();
        }
        var discount = tblProducts[0].TotalDiscount;

        if (total == '') {
            total = 0;
        }
        if (tax == '') {
            tax = 0;
        }
        if (discount == '') {
            discount = 0;
        }
        $("#ExclusiveST-value").text(parseFloat(total) - parseFloat(tax));
        $("#GrandTotal-value2").text(parseFloat(total) - parseFloat(discount) + parseFloat(tblProducts[0].SERVICE_CHARGES));

        if (discount == 0) {
            $("#GrandTotal-text2").text("Total Bill Amount :");
        }
        else {
            $("#GrandTotal-text2").text("Amount after Disc. :");
        }
    }
    if ($('#hfHideOrderInvoieNo').val() == "1") {
        document.getElementById('trOrderNo').style.display = "none";
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
    }
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName').style.display = "none";
        document.getElementById('BillNo').style.display = "none";
    }
    var tax = tblProducts[0].GST;
    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        tax = parseFloat($("#Gst-valueCredit").text());
    }

    var totalvalue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        totalvalue = parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }
    else {
        totalvalue = parseFloat(amountDue) + tax + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    }

    if (tblProducts[0].PAYMENT_MODE_ID == 1) {
        if ($("#hfBillFormat").val() === "4") {
            var GstInfoValue = 0;
            var newGST = parseFloat(document.getElementById("hfSalesTax").value) - parseFloat(document.getElementById("hfSalesTaxCreditCard").value);
            GstInfoValue = parseFloat(amountDue) / ((newGST + 100) / 100);
            GstInfoValue = (parseFloat(GstInfoValue) * parseFloat(document.getElementById("hfSalesTaxCreditCard").value)) / (100 + parseFloat(document.getElementById("hfSalesTaxCreditCard").value));
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
        else {
            var GstInfoValue = 0;
            GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTaxCreditCard").value) + 100) / 100);
            GstInfoValue = parseFloat(amountDue) - GstInfoValue;
            $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTaxCreditCard").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
        }
    }
    else {
        var GstInfoValue = 0;
        GstInfoValue = parseFloat(amountDue) / ((parseFloat(document.getElementById("hfSalesTax").value) + 100) / 100);
        GstInfoValue = parseFloat(amountDue) - GstInfoValue;
        $("#lblGSTInfo").text("Sales Tax @ " + document.getElementById("hfSalesTax").value + "%: " + parseFloat(GstInfoValue).toFixed(0));
    }
    $("#GrandTotal-value").text(parseFloat(totalvalue).toFixed(0));
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat(tblProducts[0].AdvanceAmount) > 0) {
        document.getElementById("rowAdvance").style.display = "table-row";
        $("#Advancepayment-text").text("Advance:");
        $("#Advancepayment-value").text(parseFloat(tblProducts[0].AdvanceAmount).toFixed(0));
        if (parseFloat(totalvalue).toFixed(0) - parseFloat(tblProducts[0].AdvanceAmount).toFixed(0) < 0) {
            if ($("#balance-value").text() == "") {
                $("#AdvanceBalance-text").text('Balance:');
            }
            else {
                $("#AdvanceBalance-text").text('Cust. Receivable:');
            }
            $("#AdvanceBalance-value").text(parseFloat(totalvalue).toFixed(0) - parseFloat(tblProducts[0].AdvanceAmount).toFixed(0));
        }
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');

    if (parseFloat($("#hfPOSFee").val()) > 0) {
        $("#POSFee-value").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow").style.display = "table-row";
    }

    $.print("#dvSaleInvoice");
}

//Provissional Bill Both Cash and Credit Card Payments
function PrintSaleInvoiceCashCreditCardBoth(tblProducts) {
    $("#CustomerDetail").text('');
    document.getElementById("rowAdvance").style.display = "none";
    var colspan = 6;
    if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
        $("#tdDiscount2").show();
    }
    else {
        colspan = parseInt(colspan) - 1;
        $("#tdDiscount2").hide();
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#tdGSTPer2").show();
        $("#tdGSTValue2").show();
    }
    else {
        colspan = parseInt(colspan) - 2;
        $("#tdGSTPer2").hide();
        $("#tdGSTValue2").hide();
    }
    $('#tdTotal').attr('colspan', colspan);
    $('#tdTotal2').attr('colspan', colspan);
    $('#tdGst2').attr('colspan', colspan);
    $('#tdGstCredit2').attr('colspan', colspan);
    $('#tdExclusiveTax').attr('colspan', colspan);
    $('#tdDiscout').attr('colspan', colspan);
    $('#tdGst').attr('colspan', colspan);
    $('#tdGstCredit').attr('colspan', colspan);
    $('#tdServiceCharges').attr('colspan', colspan);
    $('#tdPOSFee').attr('colspan', colspan);
    $('#tdGrandTotal').attr('colspan', colspan);
    $('#tdGrandTotal2').attr('colspan', colspan);
    $('#tdPaymentIn').attr('colspan', colspan);
    $('#tdChange').attr('colspan', colspan);
    $('#tdBalance').attr('colspan', colspan);
    $('#tdAdvance').attr('colspan', colspan);
    $('#tdAdvanceBalance').attr('colspan', colspan);
    $('#tdAdvancepayment').attr('colspan', colspan);
    document.getElementById('trNTN2').style.display = "none";
    document.getElementById('trOrderNotes2').style.display = "none";
    document.getElementById('trDiscReason2').style.display = "none";
    $("#lblOrderNotes2").text('');
    if ($("#hfShowNTNOnProvissionalBill").val() === "1") {
        document.getElementById('trNTN2').style.display = "table-row";
    }
    $("#InvoiceDate2").text($("#hfCurrentWorkDate").val() + ' ' + moment().format('hh:mm A'));
    $("#myCustomerType2").text(tblProducts[0].CUSTOMER_TYPE_ID);
    $("#Cashier2").text('Cashier: ' + $("#user-detail-bold").text());

    document.getElementById('trKOTNo2').style.display = "none";
    document.getElementById('trTakeawayOrderNo2').style.display = "none";
    document.getElementById('trOrderNo2').style.display = "table-row";
    $("#OrderInvoice2").text(tblProducts[0].ORDER_NO);
    if (tblProducts[0].CUSTOMER_TYPE_ID == "Takeaway") {
        if (tblProducts[0].CUSTOMER_NAME !== "") {
            $("#CustomerDetail").text(tblProducts[0].CUSTOMER_NAME + '-' + tblProducts[0].CONTACT_NUMBER);
            $('#CustomerDetail').show();
        }
        else if ($("#txtTakeawayCustomer").val() != "") {
            if ($('select#ddlCustomer option:selected').val() === '0') {
                $("#CustomerDetail2").text($("#txtTakeawayCustomer").val());
                $('#CustomerDetail2').show();
            }
            else {
                if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                    $("#CustomerDetail2").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
                }
                else {
                    $("#CustomerDetail2").text($('select#ddlCustomer option:selected').text());
                }
                $('#CustomerDetail2').show();
            }
        }
        $("#OrderTakerName2").text("O-T:");
        $('#OrderTakerName2').show();
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker2").text(OTaker);
        $('#OrderTaker2').show();
        $("#CoverTable2").text('Token ID: ' + tblProducts[0].covertable);
        document.getElementById('InvoiceTableName2').style.display = "none";
        document.getElementById('InvoiceTable2').style.display = "none";
        $("#spanTakeawayOrderNo2").text("Your Order No:" + tblProducts[0].ORDER_NO);
    }
    else if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {

        $("#OrderTakerName2").text("D-M:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker2").text(OTaker);
        var CDetail = $("#hfTableNo").val();
        $("#CustomerDetail2").text(CDetail);
        $("#InvoiceTableName2").text("Ph:");
        $('#OrderTakerName2').show();
        $('#OrderTaker2').show();
        $('#CustomerDetail2').show();
        $('#InvoiceTableName2').show();
        $('#InvoiceTable2').show();
        $("#CoverTable2").text('');
        document.getElementById('trOrderNotes2').style.display = "table-row";
        $("#lblOrderNotes2").text($('#txtRemarks').val());
    }
    else {
        if ($("#hfEatIn").val() == "1") {
            $("#CoverTable2").text('Token ID: ' + tblProducts[0].covertable);
            $("#InvoiceTableName2").text("");
            $("#InvoiceTable2").text("");
        }
        else {
            $("#CoverTable2").text('Covers: ' + tblProducts[0].covertable);
            $("#InvoiceTableName2").text("Table No:");
            $("#InvoiceTable2").text(tblProducts[0].TableNo);
        }
        $("#OrderTakerName2").text("O-T:");
        var OTaker = tblProducts[0].OrderBookerName;
        $("#OrderTaker2").text(OTaker);
        $('#OrderTakerName2').show();
        $('#OrderTaker2').show();
        $('#InvoiceTableName2').show();
        $('#InvoiceTable2').show();
        if ($('select#ddlCustomer option:selected').val() === '0') {
            $("#CustomerDetail2").text($("#txtTakeawayCustomer").val());
            $('#CustomerDetail2').show();
        }
        else {
            if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
                $("#CustomerDetail2").text(GetCustomerInfo($('select#ddlCustomer option:selected').val()));
            }
            else {
                $("#CustomerDetail2").text($('select#ddlCustomer option:selected').text() + '-' + tblProducts[0].CONTACT_NUMBER);
            }
            $('#CustomerDetail2').show();
        }
    }
    $("#BillNo2").text(tblProducts[0].InvoiceNo);
    $('#BillNoName2').show();
    $('#BillNo2').show();
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#CompanyAddress').show();
        $('#CompanyNumber2').show();
    }
    else {
        document.getElementById('CompanyAddress').style.display = "none";
        document.getElementById('CompanyNumber2').style.display = "none";
    }
    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        $('#imgLogo22').show();
    }
    else {
        document.getElementById('imgLogo22').style.display = "none";
    }
    document.getElementById('RegNo2').style.display = "none";
    document.getElementById('spSTRN2').style.display = "none";

    //#region Products Detail
    if (document.getElementById("hfSTRN").value == "") {
        document.getElementById('spSTRN2').style.display = "none";
    }
    else {
        $('#spSTRN2').show();
    }
    if (document.getElementById("hfRegNo").value == "") {
        document.getElementById('RegNo2').style.display = "none";
    }
    else {
        $('#RegNo2').show();
    }

    var orderedProducts = tblProducts;
    orderedProducts = eval(orderedProducts);
    $('#invoiceDetailBody2').empty(); // clear all skus  from invoice

    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamountWithGST = 0;
    var arr = [];
    var arrSaleInvoiceDetail = [];
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
                            var row = $(' <tr><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td class="text-right">' + orderedProducts[i].A_PRICE + '</td><td class="text-right">' + totalamount + '</td></tr>');
                            $('#invoiceDetailBody2').append(row);
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
                var GstInclusive = 0;
                if (tblProducts[0].PAYMENT_MODE_ID == 1) {
                    GstInclusive = document.getElementById("hfSalesTaxCreditCard").value;
                }
                else {
                    GstInclusive = document.getElementById("hfSalesTax").value;
                }
                if (GstInclusive == "")
                { GstInclusive = 0; }
                var priceWithGST = (parseFloat(orderedProducts[i].T_PRICE) + (parseFloat(orderedProducts[i].T_PRICE) * parseFloat(GstInclusive) / 100)).toFixed(2);
                var amountWithGST = (parseFloat(priceWithGST) * parseFloat(orderedProducts[i].QTY)).toFixed(2);
                totalamountWithGST += parseFloat(amountWithGST);
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + priceWithGST + '</td><td class="text-right">' + amountWithGST + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                        else {
                            if (parseInt(priceWithGST) == 0) {
                                priceWithGST = '';
                                amountWithGST = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                            else {
                                var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + priceWithGST + modprice + '</td><td class="text-right">' + amountWithGST + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                            }
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].IS_MODIFIER === false) {
                    var mod = '';
                    var modprice = '';
                    var modamount = '';
                    var modqty = '';
                    var HasMod = 0;
                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                            if (parseFloat(Modifierparent[k].Price) > 0 || $("#hfShowModifirPriceOnBills").val() == "1") {
                                var boolSaleInvoiceDetail = true;
                                for (var arri = 0; arri < arrSaleInvoiceDetail.length; arri++) {
                                    if (arrSaleInvoiceDetail[arri] == Modifierparent[k].SALE_INVOICE_DETAIL_ID) {
                                        boolSaleInvoiceDetail = false;
                                        break;
                                    }
                                }
                                if (boolSaleInvoiceDetail) {
                                    mod = mod + '<br>' + Modifierparent[k].ItemName;
                                    modqty = modqty + '<br>' + Modifierparent[k].Qty;
                                    modamount = modamount + '<br>' + parseFloat(Modifierparent[k].Amount);
                                    modprice = modprice + '<br>' + Modifierparent[k].Price;
                                    HasMod = 1;
                                    arrSaleInvoiceDetail.push(Modifierparent[k].SALE_INVOICE_DETAIL_ID);
                                }
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
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td><td class="text-right">' + tprice + '</td><td class="text-right">' + amount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                        else {
                            if (parseInt(tprice) == 0) {
                                tprice = '';
                                amount = '';
                            }
                            if (document.getElementById('hfItemWiseDiscount').value === '1' || document.getElementById('hfAutoPromotion').value === '1') {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].DISCOUNT + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                            else {
                                if ($('#hfItemWiseGST').val() == "1") {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + orderedProducts[i].GSTPER + '</td><td class="text-right">' + parseFloat(orderedProducts[i].ItemWiseGST).toFixed(2) + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                                else {
                                    var row = $(' <tr><td>' + orderedProducts[i].SKU_NAME + mod + '</td><td class="text-right">' + orderedProducts[i].QTY + modqty + '</td><td class="text-right">' + tprice + modprice + '</td><td class="text-right">' + amount + modamount + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                }
                            }
                        }
                    }
                }
            }
            $('#invoiceDetailBody2').append(row);
        }
    }
    sortTable();
    //--------------------------------------------------------------------------
    //#endregion Products Detail

    var Gst = 0;
    var Gst2 = 0;
    if (tblProducts[0].GST > 0) {
        if (parseFloat($('#hfCustomerGST').val()) > 0) {
            Gst = $('#hfCustomerGST').val();
            Gst2 = $('#hfCustomerGST').val();
        }
        else {
            Gst = document.getElementById("hfSalesTax").value;
            Gst2 = document.getElementById("hfSalesTaxCreditCard").value;
        }
    }
    if (Gst == "")
    { Gst = 0; }
    if (Gst2 == "")
    { Gst2 = 0; }

    //if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
    //    if (Gst > 0) {
    //        $("#SaleInvoiceText").text("Sales Tax Invoice");
    //    }
    //    else {
    //        $("#SaleInvoiceText").text("Sales Invoice");
    //    }
    //}
    //else {
        $("#SaleInvoiceText2").text("PRE RECEIPT");
        $("#SaleInvoiceText3").text("PRE RECEIPT");
    //}

    var amountDue = 0;
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        amountDue = tblProducts[0].AMOUNTDUE2;
    }
    else {
        amountDue = tblProducts[0].AMOUNTDUE;
    }
    $("#TotalValue3").text(amountDue);
    $("#TotalValue4").text(amountDue);
    

    var text = "";
    $("#advance-text").text(text);
    $("#advance-value").text(text);
    $("#AdvanceBalance-text").text(text);
    $("#AdvanceBalance-value").text(text);
    //When Discount not enter through print invoice POpUP
    var discount = tblProducts[0].TotalDiscount;
    var service = tblProducts[0].SERVICE_CHARGES;
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (document.getElementById("hfServiceChargesCalculation").value == "2") {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue) - parseFloat(tblProducts[0].TotalDiscount)) * 100, 0);

            }
            else {
                service = Math.round(parseFloat(tblProducts[0].SERVICE_CHARGES) / (parseFloat(amountDue)) * 100, 0);
            }
        }
    }


    if (tblProducts[0].TotalDiscount == 0) {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat(amountDue);
            Gst2 = parseFloat(Gst2) / 100 * parseFloat(amountDue);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES));
            Gst2 = parseFloat(Gst2) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - discount);
            Gst2 = parseFloat(Gst2) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);
            Gst2 = parseFloat(Gst2) / 100 * parseFloat(amountDue - discount);
        }
        $("#Discount-text").text(text);
        $("#Gst-valueCredit3").text(Math.round(Gst2, 0));
        $("#Gst-value3").text(Math.round(Gst, 0));
        $("#Discount-value").text(text);
        $("#Discount-value2").text(text);
        $("#Discount-value3").text(text);
        ShowHideInvoiceFootDiscount2("false");
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            Gst = parseFloat(Gst) / 100 * parseFloat(amountDue);
            Gst2 = parseFloat(Gst2) / 100 * parseFloat(amountDue);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            Gst = parseFloat(Gst) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES));
            Gst2 = parseFloat(Gst2) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            Gst = parseFloat(Gst) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - discount);
            Gst2 = parseFloat(Gst2) / 100 * (parseFloat(amountDue) + parseFloat(tblProducts[0].SERVICE_CHARGES) - discount);
        }
        else {
            Gst = parseFloat(Gst) / 100 * parseFloat(amountDue - discount);
            Gst2 = parseFloat(Gst2) / 100 * parseFloat(amountDue - discount);
        }
        if ($("#hfDiscountType").val() == "0" && $("#txtDiscount2").val() != '') {
            var dic = "Disc @" + $("#txtDiscount2").val() + " % :";
            $("#Discount-text").text(dic);
        }
        else {
            $("#Discount-text").text('Discount :');
        }
        $("#Gst-valueCredit3").text(Math.round(Gst2, 0));
        $("#Gst-value3").text(Math.round(Gst, 0));
        $("#Discount-value").text(tblProducts[0].TotalDiscount);
        if ($('select#ddlDiscountType2 option:selected').val() == 9) {
            $("#Discount-value2").text(0);
        }
        else {
            $("#Discount-value2").text(tblProducts[0].TotalDiscount);
        }
        $("#Discount-value3").text(tblProducts[0].TotalDiscount);
        ShowHideInvoiceFootDiscount2("true");
    }
    if ($("#txtDiscountReason2").val() != "") {
        document.getElementById('trDiscReason2').style.display = "table-row";
        $("#lblDiscReason2").text("Discount/Complimentary Reason: " + $("#txtDiscountReason2").val());
    }
    if ($("#txtDiscountAuthRemarks").val() != "") {
        document.getElementById('trDiscReason2').style.display = "table-row";
        $("#lblDiscReason2").text("Discount/Complimentary Reason: " + $("#txtDiscountAuthRemarks").val());
    }
    if ($('#hfItemWiseGST').val() == "1") {
        $("#GST-text").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#GST-text2").text($('#hfTaxAuthorityLabel').val() + ' :');
        $("#Gst-value").text(Math.round(Math.round(tblProducts[0].GST, 0), 0));
        $("#Gst-value2").text(Math.round(Math.round(tblProducts[0].GST, 0), 0));
    }

    $("#Gst-valueCredit3").text(Math.round(Gst2, 0));
    $("#Gst-value3").text(Math.round(Gst, 0));
    
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || tblProducts[0].CUSTOMER_TYPE_ID == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
        if (tblProducts[0].SERVICE_CHARGES_TYPE == 0) {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text2").text("Delivery Charges @" + service + " % :");
                $("#Service-text3").text("Delivery Charges @" + service + " % :");
            }
            else {
                $("#Service-text2").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
                $("#Service-text3").text($("#hfServiceChargesLabel").val() + " @" + service + " % :");
            }
        }
        else {
            if (tblProducts[0].CUSTOMER_TYPE_ID == "Delivery") {
                $("#Service-text2").text("Delivery Charges :");
                $("#Service-text3").text("Delivery Charges :");
            }
            else {
                $("#Service-text2").text($("#hfServiceChargesLabel").val() + " :");
                $("#Service-text3").text($("#hfServiceChargesLabel").val() + " :");
            }
        }

        $("#Service-value2").text(tblProducts[0].SERVICE_CHARGES);
        $("#Service-value3").text(tblProducts[0].SERVICE_CHARGES);
        if (parseFloat(tblProducts[0].SERVICE_CHARGES) > 0) {
            document.getElementById("ServiceChargesRow2").style.display = "table-row";
            document.getElementById("ServiceChargesRow2Cash").style.display = "table-row";
        }
        else {
            document.getElementById("ServiceChargesRow2").style.display = "none";
            document.getElementById("ServiceChargesRow2Cash").style.display = "none";
        }
    }
    else {
        document.getElementById("ServiceChargesRow2").style.display = "none";
        document.getElementById("ServiceChargesRow2Cash").style.display = "none";
    }

    document.getElementById("POSFeeRow2Cash").style.display = "none";
    document.getElementById("POSFeeRow2").style.display = "none";
    if (parseFloat($("#hfPOSFee").val()) > 0)
    {
        $("#POSFee-value2").text(Math.round(parseFloat($("#hfPOSFee").val()),0));
        $("#POSFee-value2Cash").text(Math.round(parseFloat($("#hfPOSFee").val()), 0));
        document.getElementById("POSFeeRow2Cash").style.display = "table-row";
        document.getElementById("POSFeeRow2").style.display = "table-row";
    }
    ShowHideInvoiceFootGst(Gst, parseInt(tblProducts[0].PAYMENT_MODE_ID));
    ShowHideInvoiceFootTotal(Gst, tblProducts[0].TotalDiscount, parseFloat(tblProducts[0].SERVICE_CHARGES));
    $("#Gst-valueCredit3").text(Math.round(Gst2, 0));
    $("#Gst-value3").text(Math.round(Gst, 0));

    $("#PayIn-text").text(text);
    $("#PayIn-value").text(text);
    $("#balance-text").text(text);
    $("#balance-value").text(text);
    $("#balance-text2").text(text);
    $("#balance-value2").text(text);

    if ($("#hfProvisionalBillHeaderFormat").val() === "1") {
        if (tblProducts[0].PAYMENT_MODE_ID == 2) {
            $("#PayType").text('MOP: Credit');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 1) {
            $("#PayType").text('MOP: Credit Card');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 3) {
            $("#PayType").text('MOP: Easypaisa');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 4) {
            $("#PayType").text('MOP: Jaz Cash');
        }
        else if (tblProducts[0].PAYMENT_MODE_ID == 5) {
            $("#PayType").text('MOP: Online Tran');
        }
        else {
            $("#PayType").text('MOP: Cash');
        }
    }
    else {
        $("#PayType").text(text);
    }
    if ($('#hfHideOrderInvoieNo').val() == "1") {
        document.getElementById('trOrderNo2').style.display = "none";
        document.getElementById('BillNoName2').style.display = "none";
        document.getElementById('BillNo2').style.display = "none";
    }
    if ($("#hfHideBillNo").val() == "1") {
        document.getElementById('BillNoName2').style.display = "none";
        document.getElementById('BillNo2').style.display = "none";
    }
    var totalvalue = parseFloat(amountDue) + parseFloat(Gst) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount);
    if ($('select#ddlDiscountType2 option:selected').val() == 9) {
        totalvalue = parseFloat(amountDue) + parseFloat(Gst) + parseFloat(tblProducts[0].SERVICE_CHARGES);
    }

    var totalvalue2 = parseFloat(amountDue) + parseFloat(Gst2) + parseFloat(tblProducts[0].SERVICE_CHARGES) - parseFloat(discount) + parseFloat($("#hfPOSFee").val());
    $("#GrandTotal-value3").text(parseFloat(totalvalue).toFixed(0));
    $("#GrandTotal-value4").text(parseFloat(totalvalue2).toFixed(0));

    document.getElementById("rowAdvance2").style.display = "none";
    document.getElementById("rowCustomerRec").style.display = "none";
    if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
        document.getElementById("rowAdvance2").style.display = "table-row";
        document.getElementById("rowCustomerRec").style.display = "table-row";

        $("#advance-value2").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#advance-value22").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#custrec-value").text(parseFloat(totalvalue).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        $("#custrec-value2").text(parseFloat(totalvalue2).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
    }
    $("#tble-ordered-products").empty();
    $('#hfOrderedproducts').val('');
    $.print("#dvSaleInvoice2");
}

function ShowHideInvoiceFootGst(Gst, paymenttype) {
    document.getElementById("trGSTInfo").style.display = "none";
    try {
        document.getElementById("trGSTInfo5").style.display = "none";
    } catch (e) {

    }
    
    if (Gst == 0) {
        document.getElementById("GstRow2").style.display = "none";
        document.getElementById("GstRow25").style.display = "none";
        document.getElementById("GstRowCredit2").style.display = "none";
        document.getElementById("GstRowCredit25").style.display = "none";
        document.getElementById("GstRow").style.display = "none";
        try {
            document.getElementById("GstRow5").style.display = "none";
        } catch (e) {

        }
        document.getElementById("GstRowCredit").style.display = "none";
        try {
            document.getElementById("GstRowCredit5").style.display = "none";
        } catch (e) {

        }
    }
    else {
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            document.getElementById("GstRow2").style.display = "none";
            document.getElementById("GstRow25").style.display = "none";
            document.getElementById("GstRowCredit2").style.display = "none";
            document.getElementById("GstRowCredit25").style.display = "none";
            document.getElementById("GstRow").style.display = "none";
            try {
                document.getElementById("GstRow5").style.display = "none";
            } catch (e) {

            }
            document.getElementById("GstRowCredit").style.display = "none";
            try {
                document.getElementById("GstRowCredit5").style.display = "none";
            } catch (e) {

            }
            document.getElementById("trGSTInfo").style.display = "table-row";
            try {
                document.getElementById("trGSTInfo5").style.display = "table-row";
            } catch (e) {

            }
        }
        else {
            if (paymenttype == 0 || paymenttype == 2) {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow2").style.display = "table-row";
                    document.getElementById("GstRow25").style.display = "table-row";
                    document.getElementById("GstRowCredit2").style.display = "none";
                    document.getElementById("GstRowCredit25").style.display = "none";
                }
                else {
                    document.getElementById("GstRow").style.display = "table-row";
                    try {
                        document.getElementById("GstRow5").style.display = "table-row";
                    } catch (e) {

                    }
                    document.getElementById("GstRowCredit").style.display = "none";
                    try {
                        document.getElementById("GstRowCredit5").style.display = "none";
                    } catch (e) {

                    }
                }
            }
            else {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow2").style.display = "none";
                    document.getElementById("GstRow25").style.display = "none";
                    document.getElementById("GstRowCredit2").style.display = "table-row";
                    document.getElementById("GstRowCredit25").style.display = "table-row";
                }
                else {
                    document.getElementById("GstRow").style.display = "none";
                    try {
                        document.getElementById("GstRow5").style.display = "none";
                    } catch (e) {

                    }
                    document.getElementById("GstRowCredit").style.display = "table-row";
                    try {
                        document.getElementById("GstRowCredit5").style.display = "table-row";
                    } catch (e) {

                    }
                }
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
function ShowHideInvoiceFootDiscount2(Discount) {
    if (Discount == "false") {
        document.getElementById("DiscountRow2").style.display = "none";
        document.getElementById("DiscountRow2Cash").style.display = "none";
    }
    else {
        document.getElementById("DiscountRow2").style.display = "table-row";
        document.getElementById("DiscountRow2Cash").style.display = "table-row";
    }
}
function ShowHideInvoiceFootDiscount2Old(Discount) {
    if (Discount == "false") {
        document.getElementById("DiscountRow2").style.display = "none";        
    }
    else {
        document.getElementById("DiscountRow2").style.display = "table-row";
    }
}
function ShowHideInvoiceFootTotal(Gst, Discount, ServiceCharges) {
    if ((Gst == 0) && (Discount == 0) && (ServiceCharges == 0)) {
        document.getElementById("GrandTotalRow").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "2") {
            document.getElementById("GrandTotalRow").style.display = "none";
        }
        else {
            document.getElementById("GrandTotalRow").style.display = "table-row";
        }
    }
}

function ShowHideInvoiceFootGst3(Gst, paymenttype) {
    document.getElementById("trGSTInfo3").style.display = "none";
    if (Gst == 0) {
        document.getElementById("GstRow23").style.display = "none";
        document.getElementById("GstRowCredit23").style.display = "none";
        document.getElementById("GstRow3").style.display = "none";
        document.getElementById("GstRowCredit3").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            document.getElementById("GstRow23").style.display = "none";
            document.getElementById("GstRowCredit23").style.display = "none";
            document.getElementById("GstRow3").style.display = "none";
            document.getElementById("GstRowCredit3").style.display = "none";
            document.getElementById("trGSTInfo3").style.display = "table-row";
        }
        else {
            if (paymenttype == 0 || paymenttype == 2) {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow23").style.display = "table-row";
                    document.getElementById("GstRowCredit23").style.display = "none";
                }
                else {
                    document.getElementById("GstRow3").style.display = "table-row";
                    document.getElementById("GstRowCredit3").style.display = "none";
                }
            }
            else {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow23").style.display = "none";
                    document.getElementById("GstRowCredit23").style.display = "table-row";
                }
                else {
                    document.getElementById("GstRow3").style.display = "none";
                    document.getElementById("GstRowCredit3").style.display = "table-row";
                }
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
function ShowHideInvoiceFootTotal3(Gst, Discount, ServiceCharges) {
    if ((Gst == 0) && (Discount == 0) && (ServiceCharges == 0)) {
        document.getElementById("GrandTotalRow3").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "2") {
            document.getElementById("GrandTotalRow3").style.display = "none";
        }
        else {
            document.getElementById("GrandTotalRow3").style.display = "table-row";
        }
    }
}

function ShowHideInvoiceFootGst4(Gst, paymenttype) {
    document.getElementById("trGSTInfo4").style.display = "none"; 
    if (Gst == 0) {
        document.getElementById("GstRow24").style.display = "none";
        document.getElementById("GstRowCredit24").style.display = "none";
        document.getElementById("GstRow4").style.display = "none";
        document.getElementById("GstRowCredit4").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            document.getElementById("GstRow24").style.display = "none";
            document.getElementById("GstRowCredit24").style.display = "none";
            document.getElementById("GstRow4").style.display = "none";
            document.getElementById("GstRowCredit4").style.display = "none";
            document.getElementById("trGSTInfo4").style.display = "table-row";
        }
        else {
            if (paymenttype == 0 || paymenttype == 2) {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow24").style.display = "table-row";
                    document.getElementById("GstRowCredit24").style.display = "none";
                }
                else {
                    document.getElementById("GstRow4").style.display = "table-row";
                    document.getElementById("GstRowCredit4").style.display = "none";
                }
            }
            else {
                if ($("#hfBillFormat").val() === "2") {
                    document.getElementById("GstRow24").style.display = "none";
                    document.getElementById("GstRowCredit24").style.display = "table-row";
                }
                else {
                    document.getElementById("GstRow4").style.display = "none";
                    document.getElementById("GstRowCredit4").style.display = "table-row";
                }
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
function ShowHideInvoiceFootTotal4(Gst, Discount, ServiceCharges) {
    if ((Gst == 0) && (Discount == 0) && (ServiceCharges == 0)) {
        document.getElementById("GrandTotalRow4").style.display = "none";
    }
    else {
        if ($("#hfBillFormat").val() === "2") {
            document.getElementById("GrandTotalRow4").style.display = "none";
        }
        else {
            document.getElementById("GrandTotalRow4").style.display = "table-row";
        }
    }
}

function GetCustomerInfo(customerid) {
    var CustomerInfo = 'Membership: ';
    var cusinfo = document.getElementById("hfCustomerInfo").value;
    cusinfo = eval(cusinfo);
    for (var i = 0, len = cusinfo.length; i < len; ++i) {
        if (cusinfo[i].CUSTOMER_ID === parseInt(customerid)) {
            CustomerInfo = CustomerInfo + cusinfo[i].Membership_No + ', ' + cusinfo[i].CUSTOMER_NAME;
        }
    }
    return CustomerInfo;
}
function sortTable() {
    var sortOrder = 0;
    var arrData = $('#invoiceDetailBody').find('tr').get();
    arrData.sort(function (a, b) {
        var val1 = $(a).children('td').eq(4).text().toUpperCase();
        var val2 = $(b).children('td').eq(4).text().toUpperCase();
        if ($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val2 - val1 : val1 - val2;
        else
            return (val2 < val1) ? -sortOrder : (val2 > val1) ? sortOrder : 0;
    });
    $.each(arrData, function (index, row) {
        $('#invoiceDetailBody').append(row);
    });
}
function sortTable3() {
    var sortOrder = 0;
    var arrData = $('#invoiceDetailBody3').find('tr').get();
    arrData.sort(function (a, b) {
        var val1 = $(a).children('td').eq(4).text().toUpperCase();
        var val2 = $(b).children('td').eq(4).text().toUpperCase();
        if ($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val2 - val1 : val1 - val2;
        else
            return (val2 < val1) ? -sortOrder : (val2 > val1) ? sortOrder : 0;
    });
    $.each(arrData, function (index, row) {
        $('#invoiceDetailBody3').append(row);
    });
}
function sortTable4() {
    var sortOrder = 0;
    var arrData = $('#invoiceDetailBody4').find('tr').get();
    arrData.sort(function (a, b) {
        var val1 = $(a).children('td').eq(4).text().toUpperCase();
        var val2 = $(b).children('td').eq(4).text().toUpperCase();
        if ($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val2 - val1 : val1 - val2;
        else
            return (val2 < val1) ? -sortOrder : (val2 > val1) ? sortOrder : 0;
    });
    $.each(arrData, function (index, row) {
        $('#invoiceDetailBody4').append(row);
    });
}