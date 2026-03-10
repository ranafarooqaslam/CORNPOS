var Modifierparent = [];
var HolderOrderClicke = 0;
var OldOrder = "";
var OldSKUID = 0;
var IsUserValidationPopup = 0;
var IsNewDeliveryOrder = 0;
var PaymentModes = [];

function waitLoading(msg) {
    new $.Zebra_Dialog('<strong>' + msg + '</strong>', {
        'buttons': false,
        'position': ['top + 120'],
        'auto_close': 600
    });
}

//=======Delivry Channel
function GetDelChannel() {
    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOS.aspx/GetDeliveryChannel", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: LoadDelChannel,
                    error: OnError
                }
            );
}

function LoadDelChannel(tblChannel) {
    tblChannel = JSON.stringify(tblChannel);
    var result = jQuery.parseJSON(tblChannel.replace(/&quot;/g, '"'));
    tblChannel = eval(result.d);
    for (var i = 0; i < tblChannel.length; i++) {
        var element = document.createElement("input");
        element.setAttribute("type", "button");
        element.setAttribute("value", tblChannel[i].intDCText);
        element.setAttribute("name", tblChannel[i].intDCText);
        element.setAttribute("id", tblChannel[i].intDCValue);
        if (i === 0) {
            $("#hfDeliveryChannel").val(tblChannel[0].intDCValue);
            element.style["background-color"] = "#7DAB49";
        }
        else {
            element.style["background-color"] = "#adadae";
        }
        element.style["margin-bottom"] = "5px";
        element.setAttribute("class", "box-sm");
        element.onclick = function () {
            changeClassDc(this);
        };
        var dvDeliveryChannel = document.getElementById("dvDeliveryChannel");
        dvDeliveryChannel.appendChild(element);
    }
}

//=======Item Less/Cancel Reason
function GetItemLessCancelReason() {
    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/GetItemLessCancelReason", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: LoadItemLessCancelReason,
                    error: OnError
                }
            );
}

function LoadItemLessCancelReason(tblReason) {
    tblReason = JSON.stringify(tblReason);
    var result = jQuery.parseJSON(tblReason.replace(/&quot;/g, '"'));
    tblReason = eval(result.d);
    var listItems = "";
    var listItems2 = "";
    for (var i = 0; i < tblReason.length; i++) {
        if (tblReason[i].TYPE_ID === 3) {
            listItems += "<option value='" + tblReason[i].REASON_ID + "'>" + tblReason[i].REASON_DESC + "</option>";
        }
        else {
            listItems2 += "<option value='" + tblReason[i].REASON_ID + "'>" + tblReason[i].REASON_DESC + "</option>";
        }
    }
    $("#ddlLessReason").html(listItems);
    $("#ddlCancelReason").html(listItems2);
    $("#ddlVoidReason").html(listItems2);
}
//=======Banks
function GetBanks() {
    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOS.aspx/GetBanks", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: LoadBanks,
                    error: OnError
                }
            );
}

function LoadBanks(tblBank) {
    tblBank = JSON.stringify(tblBank);
    var result = jQuery.parseJSON(tblBank.replace(/&quot;/g, '"'));
    tblBank = eval(result.d);
    var listItems = "";
    for (var i = 0; i < tblBank.length; i++) {
        listItems += "<option value='" + tblBank[i].ACCOUNT_HEAD_ID + "'>" + tblBank[i].ACCOUNT_HEAD + "</option>";
    }
    $("#ddlBank").html(listItems);
}

function GetBankDiscount() {
    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOS.aspx/GetBankDiscount", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: LoadBankDiscount,
                    error: OnError
                }
            );
}

function LoadBankDiscount(tblBankDiscount) {
    tblBankDiscount = JSON.stringify(tblBankDiscount);
    var result = jQuery.parseJSON(tblBankDiscount.replace(/&quot;/g, '"'));
    tblBankDiscount = eval(result.d);
    var listItems = "";
    for (var i = 0; i < tblBankDiscount.length; i++) {
        listItems += "<option value='" + tblBankDiscount[i].BankDiscountID + "'>" + tblBankDiscount[i].DiscountName + "</option>";
    }
    $("#ddlBankDiscount2").html(listItems);
    $("#ddlBankDiscount").html(listItems);

    tblBankDiscount = JSON.stringify(tblBankDiscount);
    document.getElementById("hfBankDiscount").value = tblBankDiscount;
}

function ApplyBankDiscount2() {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val().toString());
    if (DiscountDetail[0].DiscountTypeID == 4) {
        if ($('select#ddlBankDiscount2 option:selected').val().length > 0) {
            var DiscountPer = 0;
            var MaxLimit = 0;
            var grandTotal = 0;
            var discount = 0
            var discountNew = 0;
            var tblBankDiscount = document.getElementById("hfBankDiscount").value;
            tblBankDiscount = eval(tblBankDiscount);

            for (var i = 0, len = tblBankDiscount.length; i < len; ++i) {
                if (tblBankDiscount[i].BankDiscountID == $('select#ddlBankDiscount2 option:selected').val()) {
                    DiscountPer = tblBankDiscount[i].DiscountPer;
                    MaxLimit = tblBankDiscount[i].Limit;
                    break;
                }
            }
            grandTotal = $("#GrandTotal2").text();
            discount = parseFloat(grandTotal) * parseFloat(DiscountPer) / 100;
            if (parseFloat(discount) < parseFloat(MaxLimit)) {
                document.getElementById("txtDiscount2").value = DiscountPer;
            }
            else {
                if (parseFloat(MaxLimit) > 0) {
                    discountNew = MaxLimit / parseFloat(grandTotal) * 100;
                    document.getElementById("txtDiscount2").value = parseFloat(discountNew).toFixed(2);
                }
                else {
                    document.getElementById("txtDiscount2").value = DiscountPer;
                }
            }
            DiscType2(document.getElementById("percentage2"));
        }
    }
}

function ApplyBankDiscount() {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val().toString());
    if (DiscountDetail[0].DiscountTypeID == 4) {
        if ($('select#ddlBankDiscount option:selected').val().length > 0) {
            var DiscountPer = 0;
            var MaxLimit = 0;
            var grandTotal = 0;
            var discount = 0
            var discountNew = 0;
            var tblBankDiscount = document.getElementById("hfBankDiscount").value;
            tblBankDiscount = eval(tblBankDiscount);

            for (var i = 0, len = tblBankDiscount.length; i < len; ++i) {
                if (tblBankDiscount[i].BankDiscountID == $('select#ddlBankDiscount option:selected').val()) {
                    DiscountPer = tblBankDiscount[i].DiscountPer;
                    MaxLimit = tblBankDiscount[i].Limit;
                    break;
                }
            }
            grandTotal = $("#GrandTotal").text();
            discount = parseFloat(grandTotal) * parseFloat(DiscountPer) / 100;
            if (parseFloat(discount) < parseFloat(MaxLimit)) {
                document.getElementById("txtDiscount").value = DiscountPer;
            }
            else {
                if (parseFloat(MaxLimit) > 0) {
                    discountNew = MaxLimit / parseFloat(grandTotal) * 100;
                    document.getElementById("txtDiscount").value = parseFloat(discountNew).toFixed(2);
                }
                else {
                    document.getElementById("txtDiscount").value = DiscountPer;
                }
            }
            document.getElementById("txtDiscount").disabled = true;
            document.getElementById('txtDiscountReason').disabled = true;
            DiscType(document.getElementById("percentage"));
        }
    }
}

function EnableDisableService() {

    $('#lnkDineIn').hide();
    $('#lnkDelivery').hide();
    $('#lnkTakeaway').hide();
    var flag = false;
    if (document.getElementById("hfCan_DineIn").value == "True") {
        $('#lnkDineIn').show();
        flag = true;
        if ($('#hfDefaultServiceType').val() == '') {
            lnkCustomerType(null, 'Dine In');
        }
    }
    if (document.getElementById("hfCan_Delivery").value == "True") {
        $('#lnkDelivery').show();
        flag = true;
        if ($('#hfDefaultServiceType').val() == '') {
            lnkCustomerType(null, 'Delivery');
        }
    }
    if (document.getElementById("hfCan_TakeAway").value == "True") {
        $('#lnkTakeaway').show();
        flag = true;
        if ($('#hfDefaultServiceType').val() == '') {
            lnkCustomerType(null, 'Takeaway');
        }
    }

    return flag;
}
//========== #region Load===================\\

//======Sale Force
function loadSaleForce() {
    if (document.getElementById("hfBookingType").value == "0") {//For Point of Sale Screen
        $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/LoadSaleForce", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ customerType: document.getElementById("hfCustomerType").value }),
                    success: addSaleForce
                }
            );
    }
    else {//Load User who is logged in ON oRDER EBTRY SCREEN


        var spanText = document.getElementById('user-detail-bold').innerText;

        var listItems = "<option value='" + document.getElementById("hfUserId").value + "'>" + spanText + "</option>";
        $("#ddlOrderBooker").html(listItems);

        $("#ddlOrderBooker").val(document.getElementById("hfUserId").value);
    }
}

function addSaleForce(saleForce) {

    saleForce = JSON.stringify(saleForce);
    var result = jQuery.parseJSON(saleForce.replace(/&quot;/g, '"'));
    saleForce = eval(result.d);

    var listItems = "";
    for (var i = 0; i < saleForce.length; i++) {
        listItems += "<option value='" + saleForce[i].USER_ID + "'>" + saleForce[i].USER_NAME + "</option>";
    }

    $("#ddlOrderBooker").html(listItems);

}

//=======Discount User
function loadUsers(obj) {    
    var DiscountDetail = GetDiscountTemplateDetail(obj.value);
    document.getElementById("dvLoyaltyCard").setAttribute("style", "display:none;");
    document.getElementById("dvDiscountUser").setAttribute("style", "display:none;");
    document.getElementById("dvAuthorityUser").setAttribute("style", "display:none;");
    if (document.getElementById("hfCustomerType").value == "Takeaway") {
        document.getElementById("percentage").disabled = false;
        document.getElementById("value").disabled = false;
    }
    else {
        document.getElementById("percentage").disabled = true;
        document.getElementById("value").disabled = true;
    }
    document.getElementById("percentage").style["background-color"] = "#919399";
    document.getElementById("value").style["background-color"] = "#919399";

    $('#txtLoyaltyCustomer').val('');
    $('#txtDiscount').val('');
    $('#txtTotalPoints').val('');
    $('#txtRedeemedPoints').val('');
    $('#txtBalancePoints').val('');
    $('#txtAvailableDiscount').val('');
    $('#txtAllowedLimit').val('');
    $('#txtDiscountAvail').val('');
    $('#txtDiscountBalance').val('');
    if (DiscountDetail[0].DiscountTypeID == 2) {
        document.getElementById('txtDiscount').disabled = true;
        document.getElementById("dvLoyaltyCard").setAttribute("style", "display:block;");
        document.getElementById('txtLoyaltyCard').focus();
    }
    else if (DiscountDetail[0].DiscountTypeID == 1) {
        document.getElementById("dvDiscountUser").setAttribute("style", "display:block;");
        document.getElementById("dvAuthorityUser").setAttribute("style", "display:block;");
        loadLimit(document.getElementById("ddlDiscountUser"));
        loadPassword(document.getElementById("ddlDiscountUser2"));
        DiscType(document.getElementById("value"));
        document.getElementById('txtDiscount').value = $('#lblLimit').text();
        CalculateBalance();
    }
    else if (DiscountDetail[0].DiscountTypeID == 3 || DiscountDetail[0].DiscountTypeID == 4) {
        if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType').val() == "1") {
            document.getElementById("dvBankDiscount").setAttribute("style", "display:block;");
            $('#ddlBankDiscount').change();
        }
        if (document.getElementById("hfCustomerType").value == "Takeaway") {
            document.getElementById("percentage").disabled = false;
            document.getElementById("value").disabled = false;
        }

        document.getElementById('txtDiscount').value = document.getElementById('txtDiscount2').value;
        if (document.getElementById('txtDiscount').value != "") {
            if ($('#hfchkDiscountType').val() == 0) {
                DiscType(document.getElementById("percentage"));
            }
            else if ($('#hfchkDiscountType').val() == 1) {
                DiscType(document.getElementById("value"));
            }
        }
        else {

            document.getElementById("percentage").style["background-color"] = "#919399";
            document.getElementById("value").style["background-color"] = "#919399";
        }
        CalculateBalance();
        document.getElementById('txtDiscount').disabled = true;
    }
    else if (DiscountDetail[0].DiscountTypeID == 5) {
        ApplyDiscountTemplate(1, DiscountDetail);
    }
    document.getElementById("ddlDiscountType").disabled = true;
    document.getElementById("percentage").disabled = true;
    document.getElementById("value").disabled = true;
    document.getElementById("ddlBankDiscount").disabled = true;
    document.getElementById("txtCreditCardNo").disabled = true;
    document.getElementById("txtCreditCardAccountTile").disabled = true;
    document.getElementById("txtLoyaltyCard").disabled = true;
    document.getElementById("txtLoyaltyCustomer").disabled = true;
    if ($("#hfIS_CanGiveDiscount").val() == 'True' && $("#hfCustomerType").val() == "Takeaway") {
        document.getElementById("ddlDiscountType").disabled = false;
        document.getElementById("percentage").disabled = false;
        document.getElementById("value").disabled = false;
        document.getElementById("ddlBankDiscount").disabled = false;
        document.getElementById("txtCreditCardNo").disabled = false;
        document.getElementById("txtCreditCardAccountTile").disabled = false;
        document.getElementById("txtLoyaltyCard").disabled = false;
        document.getElementById("txtLoyaltyCustomer").disabled = false;
    }
}
//=======Discount User On Print Invoice Screen
function loadUsers2(obj) {    
    var DiscountDetail = GetDiscountTemplateDetail(obj.value);
    document.getElementById("dvBankDiscount2").setAttribute("style", "display:none;");
    document.getElementById("dvLoyaltyCard2").setAttribute("style", "display:none;");
    document.getElementById("dvDiscountUser2").setAttribute("style", "display:none;");
    document.getElementById("dvAuthorityUser2").setAttribute("style", "display:none;");
    document.getElementById("percentage2").disabled = true;
    document.getElementById("value2").disabled = true;
    //---on print invoice popup
    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("value2").style["background-color"] = "#919399";

    $('#txtLoyaltyCustomer2').val('');
    $('#txtDiscount2').val('');
    $('#txtNoOfVisits2').val('');
    $('#txtTotalPurchased2').val('');
    $('#txtTotalLoyaltyDiscount2').val('');
    $('#txtLoyaltyQuantity2').val('');

    $('#txtTotalPoints2').val('');
    $('#txtRedeemedPoints2').val('');
    $('#txtBalancePoints2').val('');
    $('#txtAvailableDiscount2').val('');
    $('#txtAvailableCash2').val('');

    $('#txtAllowedLimit2').val('');
    $('#txtDiscountAvail2').val('');
    $('#txtDiscountBalance2').val('');

    if (DiscountDetail[0].DiscountTypeID == 2) {
        document.getElementById('txtDiscount2').disabled = true;
        document.getElementById('txtDiscountReason2').disabled = true;
        document.getElementById("dvLoyaltyCard2").setAttribute("style", "display:block;");
        document.getElementById('txtLoyaltyCard2').focus();
    }
    else if (DiscountDetail[0].DiscountTypeID == 1) {
        document.getElementById("dvDiscountUser2").setAttribute("style", "display:block;");
        document.getElementById("dvAuthorityUser2").setAttribute("style", "display:block;");
        loadLimit2(document.getElementById("ddlDiscountUser2"));
        loadPassword(document.getElementById("ddlDiscountUser4"));
        DiscType(document.getElementById("value2"));
        document.getElementById('txtDiscount2').value = $('#lblLimit2').text();
        CalculateBalance2();
    }
    else if (DiscountDetail[0].DiscountTypeID == 3 || DiscountDetail[0].DiscountTypeID == 4) {
        document.getElementById("percentage2").disabled = false;
        document.getElementById("value2").disabled = false;
        if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType2').val() == "1") {
            document.getElementById("dvBankDiscount2").setAttribute("style", "display:block;");
            $('#ddlBankDiscount2').change();
        }
        if (document.getElementById('txtDiscount2').value != "") {
            if ($('#hfchkDiscountType').val() == 0) {
                DiscType(document.getElementById("percentage2"));
            }
            else if ($('#hfchkDiscountType').val() == 1) {
                DiscType(document.getElementById("value2"));
            }
        }
        else {

            document.getElementById("percentage2").style["background-color"] = "#919399";
            document.getElementById("value2").style["background-color"] = "#919399";
        }
        CalculateBalance2();
        document.getElementById('txtDiscount2').disabled = true;
        document.getElementById('txtDiscountReason2').disabled = true;
    }
    else if (DiscountDetail[0].DiscountTypeID == 5) {
        ApplyDiscountTemplate(2, DiscountDetail);
    }
    if ($("#hfIS_CanGiveDiscount").val() == 'False') {
        document.getElementById("ddlDiscountType2").disabled = true;
        document.getElementById("percentage2").disabled = true;
        document.getElementById("value2").disabled = true;
    }
}

function loadLimit(obj) {
    $('#lblLimit').text(0);
    $('#tble-discount-limit').find('tr').each(function () {
        if (obj.value == $(this).find("td:eq(0)").text()) {
            $('#lblLimit').text($(this).find("td:eq(1)").text());
            return;
        }
    });
}

function loadLimit2(obj) {
    $('#lblLimit2').text(0);
    $('#tble-discount-limit2').find('tr').each(function () {
        if (obj.value == $(this).find("td:eq(0)").text()) {
            $('#lblLimit2').text($(this).find("td:eq(1)").text());
            return;
        }
    });
}

function loadPassword(obj) {
    $('#hfManagerPassword').val('');
    $('#tble-discount-user').find('tr').each(function () {
        if (obj.value == $(this).find("td:eq(0)").text()) {
            $('#hfManagerPassword').val($(this).find("td:eq(1)").text());
            return;
        }
    });

    $('#tble-discount-user2').find('tr').each(function () {
        if (obj.value == $(this).find("td:eq(0)").text()) {
            $('#hfManagerPassword').val($(this).find("td:eq(1)").text());
            return;
        }
    });
}

function loadDiscountUser() {
    $.ajax
       (
           {
               type: "POST", //HTTP method
               url: "frmOrderPOSDropDownList.aspx/LoadDiscountUser", //page/method name
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: addDiscountUser
           }
       );
}

function addDiscountUser(response) {

    var xmlDoc = $.parseXML(response.d);
    var xml = $(xmlDoc);
    var Users = xml.find("Table");


    $("#ddlDiscountUser").empty();
    $("#ddlDiscountUser3").empty();
    $('#tble-discount-limit').empty();
    $('#tble-discount-limit2').empty();

    var listItems = "";
    $(Users).each(function () {
        listItems += "<option value='" + $(this).find("USER_ID").text() + "'>" + $(this).find("USER_NAME").text() + "</option>";
        var row = $('<tr ><td>' + $(this).find("USER_ID").text() + '</td><td>' + $(this).find("EMC_LimitPerDay").text() + '</td></tr>');
        $('#tble-discount-limit').append(row);
        $('#tble-discount-limit2').append(row);
    });

    $("#ddlDiscountUser").html(listItems);
    $("#ddlDiscountUser3").html(listItems);
    //------------------------------------------------------------------------------------------------------------------

    var DiscountUser = xml.find("Table1");
    $('#tble-discount-user').empty();
    $('#tble-discount-user2').empty();

    var listItems2 = "";
    $(DiscountUser).each(function () {
        listItems2 += "<option value='" + $(this).find("USER_ID").text() + "'>" + $(this).find("USER_NAME").text() + "</option>";
        var row = $('<tr ><td>' + $(this).find("USER_ID").text() + '</td><td>' + $(this).find("PASSWORD").text() + '</td></tr>');
        $('#tble-discount-user').append(row);
        $('#tble-discount-user2').append(row);
    });

    $("#ddlDiscountUser2").html(listItems2);
    $("#ddlDiscountUser4").html(listItems2);

}

//=======Tables
function LoadPendingTables(pendingTables) {
    var dv_lstTable = document.getElementById("dv_lstTable");
    while (dv_lstTable.hasChildNodes()) {
        dv_lstTable.removeChild(dv_lstTable.lastChild);
    }
    var tableId = 0;
    for (var i = 0, len = pendingTables.length; i < len; ++i) {
        if (i == 0) {
            tableId = pendingTables[i].TABLE_ID;
        }
        createTableButtons(pendingTables[i].TABLE_NO, pendingTables[i].TABLE_ID);
    }
}

function createTableButtons(value, id) {
    var element = document.createElement("input");
    element.setAttribute("type", "button");
    element.setAttribute("value", value);
    element.setAttribute("name", value);
    element.setAttribute("id", id);
    if ($("#hfTableId").val() == id.toString()) {
        element.setAttribute("class", "box-last-vc");
        element.setAttribute("style", "background-color: rgb(83, 180, 181);");
    }
    else {
        element.setAttribute("class", "box-last-vc");
    }
    element.onclick = function () { // Note this is a function
        var elementId = this.id;//for getting Table id in loop
        var flag = true;
        $('#tbl-pending-bills tr').each(function (row, tr) {
            if ($(tr).find('td:eq(14)').text() == elementId) {

                flag = false;

                $("#hfTableId").val(0);
                $("#hfTableNo").val("");

                Error("This Table is already Hold");

                var elementButton = document.getElementById(elementId);
                elementButton.parentNode.removeChild(elementButton);

                return;
            }
        });
        if (flag) {
            $("#hfTableId").val(this.id);
            $("#hfTableNo").val(this.value);
            changeTableClass(this);
        }
    };
    var dv_lstTable = document.getElementById("dv_lstTable");
    dv_lstTable.appendChild(element);
}

//=======Product and Category
function loadAllProducts() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/LoadAllProducts", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: sethfProductValue,
                error: OnError
            }
        );
}

function sethfProductValue(products) {

    products = JSON.stringify(products);

    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));

    products = eval(result.d);
    products = JSON.stringify(products);
    document.getElementById("hfProduct").value = products;

    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        if (lstProducts[i].SKU_ID == $('#ddlItem').val()) {
            $('#txtSKUPrice').val(parseFloat(lstProducts[i].T_PRICE).toFixed(2));
            $('#txtQuantity').val(lstProducts[i].DEFAULT_QTY);
        }
    }

}

//=======Selected Bill Detail
function GetPendingBill(saleInvoiceMasterId) {

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/GetPendingBill", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "{'saleInvoiceMasterId':'" + saleInvoiceMasterId + "'}",
                success: LoadPendingBill
            }
        );
}
function LoadPendingBill(products) {    
    OldOrder = "";
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    OldOrder = products;
    $("#tble-ordered-products").empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfCounter").val(0);
    if (products.length > 0) {
        $("#hfAmountDue").val(products[0].AMOUNTDUE);
        $("#txtRemarks").val(products[0].REMARKS);
        $('#txtManualOrderNo').val(products[0].MANUAL_ORDER_NO);
        if (products[0].CUSTOMER_TYPE_ID != 2 || products[0].SERVICE_CHARGES_TYPE == 1) {
            $('#hfServiceType').val(products[0].SERVICE_CHARGES_TYPE);
        }
        $('#hfPaymentType').val(products[0].PAYMENT_MODE_ID);
        $('#hfPaymentType2').val(products[0].PAYMENT_MODE_ID);
        $('#hfDeliveryChannelType').val(products[0].DELIVERY_CHANNEL);
        $("#MaxOrderNo").text(products[0].ORDER_NO);
        if (document.getElementById("hfDiscountAuthentication").value == '1') {
            $('#txtDiscountAuthRemarks').val(products[0].DiscountRemarks);
        }
        else {
            $('#txtDiscountReason2').val(products[0].DiscountRemarks);
            $('#txtDiscountReason').val(products[0].DiscountRemarks);
        }
        $('#hfInvoiceNo').val(products[0].InvoiceNo);
        if (products[0].IS_GST_VOID == false) {
            document.getElementById('hfIsGSTVoid').value = '0';
        }
        else {
            document.getElementById('hfIsGSTVoid').value = '1';
        }
        if (products[0].BANK_DISCOUNT_ID !== null) {
            $('#ddlBankDiscount2').val(products[0].BANK_DISCOUNT_ID);
            $('#ddlBankDiscount').val(products[0].BANK_DISCOUNT_ID);
        }
        $('#txtCreditCardNo2').val(products[0].CreditCardNo);
        $('#txtCreditCardNo').val(products[0].CreditCardNo);
        $('#txtCreditCardAccountTile2').val(products[0].CreditCardAccountTile);
        $('#txtCreditCardAccountTile').val(products[0].CreditCardAccountTile);
    }

    for (var i = 0, len = products.length; i < len; ++i) {
        addProductToOrderedProduct(products, i, $("#OrderNo1").text());
        $('#hfIsNewItemAdded').val('0');
        HolderOrderClicke = 0;
    }
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    $('#cash').click
    setTotals();
    $('#ddlBankDiscount2').change();
    $('#ddlBankDiscount').change();
}
function GetPendingBill2(saleInvoiceMasterId) {

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/GetPendingBill", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "{'saleInvoiceMasterId':'" + saleInvoiceMasterId + "'}",
                success: LoadPendingBill2
            }
        );
}
function LoadPendingBill2(products) {

    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);

    $("#tble-ordered-products").empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfCounter").val(0);

    if (products.length > 0) {
    $("#hfAmountDue").val(products[0].AMOUNTDUE);
        $("#txtRemarks").val(products[0].REMARKS);
        $('#txtManualOrderNo').val(products[0].MANUAL_ORDER_NO);
        if (products[0].CUSTOMER_TYPE_ID != 2 || products[0].SERVICE_CHARGES_TYPE == 1) {
            $('#hfServiceType').val(products[0].SERVICE_CHARGES_TYPE);
        }
        $('#hfPaymentType').val(products[0].PAYMENT_MODE_ID);
        $('#hfPaymentType2').val(products[0].PAYMENT_MODE_ID);
        $('#hfDeliveryChannelType').val(products[0].DELIVERY_CHANNEL);
        if (document.getElementById("hfDiscountAuthentication").value == '1') {
            $('#txtDiscountAuthRemarks').val(products[0].DiscountRemarks);
        }
        else {
            $('#txtDiscountReason2').val(products[0].DiscountRemarks);
            $('#txtDiscountReason').val(products[0].DiscountRemarks);
        }
        if (products[0].IS_GST_VOID == false) {
            document.getElementById('hfIsGSTVoid').value = '0';
        }
        else {
            document.getElementById('hfIsGSTVoid').value = '1';
        }
        $('#hfInvoiceNo').val(products[0].InvoiceNo);
        if (products[0].BANK_DISCOUNT_ID !== null) {
            $('#ddlBankDiscount2').val(products[0].BANK_DISCOUNT_ID);
            $('#ddlBankDiscount').val(products[0].BANK_DISCOUNT_ID);
        }
        $('#txtCreditCardNo2').val(products[0].CreditCardNo);
        $('#txtCreditCardNo').val(products[0].CreditCardNo);
        $('#txtCreditCardAccountTile2').val(products[0].CreditCardAccountTile);
        $('#txtCreditCardAccountTile').val(products[0].CreditCardAccountTile);
    }

    for (var i = 0, len = products.length; i < len; ++i) {
        addProductToOrderedProduct(products, i, $("#OrderNo1").text());
        $('#hfIsNewItemAdded').val('0');
        HolderOrderClicke = 0;
    }
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
    isDisable('false');
    document.getElementById("cash").style["background-color"] = "#7dab49";
    $('#hfPaymentType').val(0);
    if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True") {
        document.getElementById('valueServicePayment').style["background-color"] = "#919399";
        document.getElementById('percentageServicePayment').style["background-color"] = "#919399";
        if ($('#hfServiceType').val() == "0") {
            document.getElementById('percentageServicePayment').style["background-color"] = "#7dab49";
        }
        else {
            document.getElementById('valueServicePayment').style["background-color"] = "#7dab49";
        }
    }
    document.getElementById("btnSave").disabled = false;
    document.getElementById("percentage").disabled = false;
    document.getElementById("value").disabled = false;
    $('#payment').show("slow");
    $('#cash').click
    HolderOrderClicke = 0;
    CalculateServiceChages();
    CalculateServiceChagesPayment();
    $('#ddlBankDiscount2').change();
    $('#ddlBankDiscount').change();
}
function GetPendingBill3(saleInvoiceMasterId) {

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOS.aspx/GetPendingBill2", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "{'saleInvoiceMasterId':'" + saleInvoiceMasterId + "'}",
                success: LoadPendingBill3
            }
        );
}
function LoadPendingBill3(products) {
    $('#hfCustomerAdvanceAmount').val(0);
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    Modifierparent = [];
    if (products.length > 0) {
        $("#hfAmountDue").val(products[0].AMOUNTDUE);
        $("#ddlOrderBooker").val(products[0].orderBookerId);
        $('#txtManualOrderNo').val(products[0].MANUAL_ORDER_NO);
        $("#hfCustomerNo").val(products[0].ADDRESS);
        for (var i = 0, len = products.length; i < len; ++i) {
            var obj = {};
            obj["ItemID"] = products[i].SKU_ID;
            obj["ParentID"] = products[i].MODIFIER_PARENT_ID;
            obj["ItemName"] = products[i].DESC;
            obj["Price"] = products[i].T_PRICE;
            obj["Qty"] = products[i].QTY;
            obj["ModifierParetn_Row_ID"] = products[i].ModifierParetn_Row_ID;
            obj["SALE_INVOICE_DETAIL_ID"] = products[i].SALE_INVOICE_DETAIL_ID;
            Modifierparent.push(obj);
        }
    }
    UniqueSection(products);
}
//=======Pending Bills
function GetPendingBills() {

    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/SelectPendingBills", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ customerType: document.getElementById("hfCustomerType").value }),
                    success: LoadPendingBills
                }
            );
}

function LoadPendingBills(pendingBills) {
    var data = $.parseJSON(pendingBills.d);
    var data2 = data.Table5;
    var data3 = data.Table2;
    var data4 = data.Table3;
    var data5 = data.Table4;
    pendingBills = data.Table;
    $("#tbl-pending-bills").empty();

    var row = "";
    for (var i = 0, len = pendingBills.length; i < len; i++) {
        if (pendingBills[i].INVOICE_ID > 0) {

            if (pendingBills[i].SERVICE_TYPE == 'Delivery') {
                if (pendingBills[i].MANUAL_ORDER_NO != '') {
                    if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                        row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td></td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
                else {
                    if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                        row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
            }
            else if (pendingBills[i].SERVICE_TYPE == 'Dine In') {
                if (pendingBills[i].MANUAL_ORDER_NO != '') {
                    if (pendingBills[i].LOCKED) {
                        row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
                else {
                    if (pendingBills[i].LOCKED) {
                        row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
            }
            else {
                if (pendingBills[i].MANUAL_ORDER_NO != '') {
                    if (pendingBills[i].LOCKED) {
                        row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
                else {
                    if (pendingBills[i].LOCKED) {
                        row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                        else {
                            row = $('<tr ><td style="width:20px;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td></tr>');
                        }
                    }
                }
            }
            $('#tbl-pending-bills').append(row);
        }
    }
    $("#lblCounter1").text("(" + 0 + ")");
    $("#lblCounter2").text("(" + 0 + ")");
    $("#lblCounter3").text("(" + 0 + ")");

    if (data2.length != "0") {
        $("#lblCounter1").text("(" + data2[0].Takeaway + ")");
        $("#lblCounter2").text("(" + data2[0].Delivery + ")");
        $("#lblCounter3").text("(" + data2[0].DineIn + ")");
    }
    $("#lblKOTNotification").text('');
    if (data5.length > 0) {
        if (parseInt(data5[0].PendingKOT) > 0) {
            $("#lblKOTNotification").text(data5[0].PendingKOT + ' KOT(s) are pending!');
        }
    }
    if ($('#txtVacantTable').val().length == 0 && $("#hfEatIn").val() == "0" && document.getElementById("hfCustomerType").value == "Dine In") {
        LoadPendingTables(data4);
    }
}

//========== #endregion Load===================\\

$(document).ready(function () {
    if ($('#hfHidePrintInvoiceButton').val() == "1") {
        $("#PrintInvoice").hide();
    }
    $('#btnSaveHidden').hide();
    $('#btnDiscountAuthentication').hide();
    if (document.getElementById("hfHiddenReports").value == '1') {
        $('#btnSaveHidden').show();
    }
    if (document.getElementById("hfDiscountAuthentication").value == '1' && document.getElementById("hfAutoPromotion").value == '0' && $("#hfIS_CanGiveDiscount").val() == 'False') {
        $('#btnDiscountAuthentication').show();
    }
    if (document.getElementById("hfAutoPromotion").value == '1') {
        document.getElementById("ddlDiscountType2").disabled = true;
        document.getElementById("ddlDiscountType").disabled = true;
    }
    if (EnableDisableService()) {
        document.getElementById("percentage2").disabled = true;
        document.getElementById("value2").disabled = true;
        document.getElementById("percentage").disabled = true;
        document.getElementById("value").disabled = true;
        document.getElementById('txtItemDiscount').disabled = true;
        if (document.getElementById('hfItemWiseDiscount').value === '1') {
            document.getElementById('txtItemDiscount').disabled = false;
        }
        if ($("#hfIS_CanGiveDiscount").val() == 'False') {
            document.getElementById("ddlDiscountType").disabled = true;
            document.getElementById("ddlDiscountType2").disabled = true;
        }
        $('#txtCustomerSearch').keyup(function () {

            if ($('#txtCustomerSearch').val().length > 2) {
                LoadAllCustomers();
            }
            else if ($('#txtCustomerSearch').val().length < 3) {
                $("#tbl-customers").empty();
            }
        });

        $('#txtVacantTable').keyup(function () {
            $('#dv_lstTable').children('input').each(function () {
                if (this.value.toUpperCase().includes($('#txtVacantTable').val().toUpperCase())) {
                    this.style = "display:block;";
                }
                else {
                    this.style = "display:none;";
                }
            });
        });
        $('#txtPendingBills').keyup(function () {
            $('#tbl-pending-bills tr').each(function (row, tr) {
                if ($("#hfCustomerType").val() == "Takeaway") {
                    if ($(tr).find("td:eq(0)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())
                       || $(tr).find("td:eq(2)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())
                       || $(tr).find("td:eq(3)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())) {
                        $(tr).show();
                    }
                    else {
                        $(tr).hide();
                    }
                }
                else {
                    if ($(tr).find("td:eq(2)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())
                       || $(tr).find("td:eq(3)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())) {
                        $(tr).show();
                    }
                    else {
                        $(tr).hide();
                    }
                }
            });
        });
        waitLoading('Loading');
        $(".nav-ic img").click(function () {
            $(".exit-text").slideToggle("slow", function () {
            });
        });
        UnlockRecord();
        loadAllProducts();
        GetPendingBills();
        GetDelChannel();
        GetItemLessCancelReason();
        LoadEmployeeDiscountType();
        GetBanks();
        GetBankDiscount();
        if ($('#hfDefaultServiceType').val() !== '') {
            lnkCustomerType(null, $('#hfDefaultServiceType').val());
        }
        loadSaleForce();
        loadDiscountUser();
        LoadCustomersLedger();
        document.getElementById('dvServiceChargesPayment2').style.display = "none";
        document.getElementById('divServiceChargesPayment').style.display = "none";
        document.getElementById('divServiceChargesPayment2').style.display = "none";
        //On Pending Bill row Click
        $("#tbl-pending-bills").delegate("tr", "click", function () {
            if (IsUserValidationPopup == 1) {
                return;
            }
            ShowBill(this);
        });


        //On Payments Click
        $("#Payments").click(function () {
            if (IsUserValidationPopup == 1) {
                return;
            }
            if ($('#hfIsNewItemAdded').val() == '0') {
                document.getElementById('ddlBank').style.display = "none";
                document.getElementById('txtCardNo').style.display = "none";
                document.getElementById('txtCreditCardNo').style.display = "none";
                document.getElementById('txtCreditCardAccountTile').style.display = "none";
                if ($('#hfDisable').val() == "1") {
                    var tableData = storeTblValues();
                    if (tableData.length > 0) {
                        setTotals();
                        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
                            $('#lblGSTOrService').hide();
                            $('#lblGSTTotal').hide();
                        }
                        document.getElementById("btnSave").disabled = false;
                        $('#payment').show("slow");

                        if ($('#hfPaymentType').val() == "1") {
                            document.getElementById('ddlBank').style.display = "table-row";
                            document.getElementById('txtCardNo').style.display = "table-row";
                            PayType(document.getElementById("credit"));
                        }
                        else if ($('#hfPaymentType').val() == "2") {
                            PayType(document.getElementById("btnCredit"));
                        }
                        else if ($('#hfPaymentType').val() == "3") {
                            PayType(document.getElementById("btnEasypaisa"));
                        }
                        else if ($('#hfPaymentType').val() == "4") {
                            PayType(document.getElementById("btnJazzcash"));
                        }
                        else if ($('#hfPaymentType').val() == "5") {
                            PayType(document.getElementById("btnOnlineTransfer"));
                        }
                        else {
                            PayType(document.getElementById("cash"));
                        }

                        CalculateBalance();

                        $("#lblServiceChargesTotalPayment").text('0');
                        if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || document.getElementById("hfCustomerType").value == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
                            document.getElementById('valueServicePayment').style["background-color"] = "#919399";
                            document.getElementById('percentageServicePayment').style["background-color"] = "#919399";
                            if ($('#hfServiceType').val() == "0") {
                                document.getElementById('percentageServicePayment').style["background-color"] = "#7dab49";
                            }
                            else {
                                document.getElementById('valueServicePayment').style["background-color"] = "#7dab49";
                            }
                            CalculateServiceChagesPayment();
                            document.getElementById('dvServiceChargesPayment2').style.display = "block";
                            document.getElementById('divServiceChargesPayment').style.display = "block";
                            document.getElementById('divServiceChargesPayment2').style.display = "block";
                        }
                        else {
                            if ($("#hfCustomerType").val() === "Delivery") {
                                document.getElementById('dvServiceChargesPayment2').style.display = "block";
                                document.getElementById('divServiceChargesPayment').style.display = "block";
                                document.getElementById('divServiceChargesPayment2').style.display = "block";
                            }
                            else {
                                document.getElementById('dvServiceChargesPayment2').style.display = "none";
                                document.getElementById('divServiceChargesPayment').style.display = "none";
                                document.getElementById('divServiceChargesPayment2').style.display = "none";
                            }
                        }
                        if ($("#hfCustomerType").val() === "Delivery") {
                            $("#lblServiceCharges").text("Delivery Charges");
                            $("#lblServiceChg").text("Delivery Charges");
                        }
                        else {
                            $("#lblServiceCharges").text("Service Charges");
                            $("#lblServiceChg").text("Service Charges");
                        }
                        $('#txtCashRecieved').focus();
                    }
                }
            }
            else {
                alert('New item added first Hold order.');
            }
        });
        //On Print Invoice CLick
        $("#PrintInvoice").click(function () {
            if (IsUserValidationPopup == 1) {
                return;
            }
            if ($('#hfIsNewItemAdded').val() == '0') {
                if ($('#hfDisable').val() == "1") {
                    var tableData = storeTblValues();
                    if (tableData.length > 0) {
                        setTotals();
                        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
                            $('#lblGSTOrService2').hide();
                            $('#lblGSTTotal2').hide();
                        }
                        $('#payment2').show("slow");
                        if ($('#hfPaymentType2').val() == "1") {
                            PayType2(document.getElementById("credit2"));
                        }
                        else if ($('#hfPaymentType2').val() == "2") {
                            PayType2(document.getElementById("btnCredit2"));
                        }
                        else if ($('#hfPaymentType2').val() == "3") {
                            PayType2(document.getElementById("btnEasypaisa2"));
                        }
                        else if ($('#hfPaymentType2').val() == "4") {
                            PayType2(document.getElementById("btnJazzcash2"));
                        }
                        else if ($('#hfPaymentType2').val() == "5") {
                            PayType2(document.getElementById("btnOnlineTransfer2"));
                        }
                        else {
                            PayType2(document.getElementById("cash2"));
                        }
                        CalculateBalance();
                        CalculateBalance2();
                        $("#lblServiceChargesTotal").text('0');
                        if ($('#hfServiceCharges').val() == "True" || $('#hfIsDeliveryCharges').val() == "True" || document.getElementById("hfCustomerType").value == "Delivery" || $("#hfServiceChargesOnTakeaway").val() == "1") {
                            document.getElementById('valueService').style["background-color"] = "#919399";
                            document.getElementById('percentageService').style["background-color"] = "#919399";
                            if ($('#hfServiceType').val() == "0") {
                                document.getElementById('percentageService').style["background-color"] = "#7dab49";
                            }
                            else {
                                document.getElementById('valueService').style["background-color"] = "#7dab49";
                            }
                            CalculateServiceChages();
                            document.getElementById('dvServiceCharges2').style.display = "block";
                            document.getElementById('divServiceCharges').style.display = "block";
                            document.getElementById('divServiceCharges2').style.display = "block";
                        }
                        else {
                            document.getElementById('dvServiceCharges2').style.display = "none";
                            document.getElementById('divServiceCharges').style.display = "none";
                            document.getElementById('divServiceCharges2').style.display = "none";
                        }
                        if ($("#hfCustomerType").val() === "Delivery") {
                            $("#lblServiceCharges2").text("Delivery Charges");
                            $("#lblServiceChg2").text("Delivery Charges");
                        }
                        else {
                            $("#lblServiceCharges2").text("Service Charges");
                            $("#lblServiceChg2").text("Service Charges");
                        }
                        $('#btnSave2').focus();
                    }
                }
            }
            else {
                alert('New item added first Hold order.');
            }
        });

        $('#ddlItem').change(function () {
            var lstProducts = document.getElementById("hfProduct").value;
            lstProducts = eval(lstProducts);
            for (var i = 0, len = lstProducts.length; i < len; ++i) {
                if (lstProducts[i].SKU_ID == $('#ddlItem').val()) {
                    $('#txtSKUPrice').val(parseFloat(lstProducts[i].T_PRICE).toFixed(2));
                    $('#txtQuantity').val(lstProducts[i].DEFAULT_QTY);
                    document.getElementById("hfItemChange").value = 1;
                    break;
                }
            }
        });

        $(document).on('focus', '.select2', function (e) {
            if (e.originalEvent) {
                if (document.getElementById("hfItemChange").value == 1) {
                    if (document.getElementById("hfIsPriceOpenOnPOS").value == '0') {
                        $('#txtQuantity').focus();
                    }
                    else {
                        $('#txtSKUPrice').focus();
                    }
                }
            }
        });
        $('#ddlItem').focus();
    }
    else
    {
        alert("No Service Type assigned.!");
        location.href = 'Home.aspx';
    }

    document.getElementById("btnEasypaisa2").style.display = "none";
    document.getElementById("btnJazzcash2").style.display = "none";
    document.getElementById("btnOnlineTransfer2").style.display = "none";

    document.getElementById("btnEasypaisa").style.display = "none";
    document.getElementById("btnJazzcash").style.display = "none";
    document.getElementById("btnOnlineTransfer").style.display = "none";

    var lstPaymentModes = document.getElementById("hfPaymentModes").value;
    if (lstPaymentModes !== "") {
        PaymentModes = JSON.parse(lstPaymentModes);
        for (var i = 0; i < PaymentModes.length; i++) {
            if (PaymentModes[i].POSID == 3) {
                document.getElementById("btnEasypaisa2").style.display = "inline-block";
                document.getElementById("btnEasypaisa").style.display = "inline-block";
            }
            if (PaymentModes[i].POSID == 4) {
                document.getElementById("btnJazzcash2").style.display = "inline-block";
                document.getElementById("btnJazzcash").style.display = "inline-block";
            }
            if (PaymentModes[i].POSID == 5) {
                document.getElementById("btnOnlineTransfer2").style.display = "inline-block";
                document.getElementById("btnOnlineTransfer").style.display = "inline-block";
            }
        }
    }
});

function LoadEmployeeDiscountType() {
    var lstDiscTypes = document.getElementById("hfEmployeeDiscountType").value;
    lstDiscTypes = eval(lstDiscTypes);
    var listItems = "";
    for (var i = 0, len = lstDiscTypes.length; i < len; ++i) {
        listItems += "<option value='" + lstDiscTypes[i].EmployeeDiscountTypeID + "'>" + lstDiscTypes[i].DiscountTypeName + "</option>";
    }

    $("#ddlDiscountType").html(listItems);
    $("#ddlDiscountType2").html(listItems);
}
//#region Service Type Call in ShowBill
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

function calculateDealPrice() {

    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);

    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);

    var totalamount = 0;

    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            $('#tble-ordered-products').find('tr').each(function () {
                if (checkVoid($(this).find("td:eq(15)").text())) {//CHECK IS VOID OR NOT
                    if (uniqueDeals[j] == $(this).find("td:eq(23)").text()) {
                        if (count == 0) {
                            count += 1;
                            totalamount += parseFloat($(this).find("td:eq(22)").text()) * parseFloat($(this).find("td:eq(28)").text());
                        }
                        return;
                    }
                }
            });
        }
    }
    $("#DealPrice").text(totalamount);
}

function checkVoid(color) //check is item void or not //used on plus, delete, settotals
{
    if (color == "false") {
        return true;
    }
    else {
        return false;
    }
}

function setTotals() {
    var subtotal = 0.0;
    var grandTotal;
    var salesTax = 0;// document.getElementById("hfSalesTax").value;
    var itemdiscount = 0;
    var ItemWiseGST = 0;
    if ($('#hfPaymentType').val() == "1") {
        salesTax = document.getElementById("hfSalesTaxCreditCard").value;
    }
    else {
        salesTax = document.getElementById("hfSalesTax").value;
        if (parseInt($('#hfPaymentType').val()) > 2) {
            var lstPaymentModes = document.getElementById("hfPaymentModes").value;
            if (lstPaymentModes !== "") {
                PaymentModes = JSON.parse(lstPaymentModes);
                for (var i = 0; i < PaymentModes.length; i++) {
                    if (PaymentModes[i].POSID == parseInt($('#hfPaymentType').val())) {
                        salesTax = PaymentModes[i].Tax;
                        break;
                    }
                }
            }
        }
    }

    if (salesTax == "") {
        salesTax = 0;
    }

    var discountType = document.getElementById("hfDiscountType").value;
    var discount = document.getElementById('txtDiscount').value;
    var servicecharges = $("#lblServiceChargesTotalPayment").text();

    if (discount == "") {
        discount = 0;
    }

    if (servicecharges == "" || servicecharges == 'NaN') {
        servicecharges = 0;
    }
    var balance = 0;

    calculateDealPrice();

    subtotal = parseFloat($("#DealPrice").text());
    $('#tble-ordered-products tr').each(function (row, tr) {
        if (parseFloat($(tr).find("td:eq(23)").text()) == 0) {
            if (checkVoid($(tr).find('td:eq(15)').text())) {
                if ($(tr).find("td:eq(7)").text() != "") {
                    subtotal += parseFloat($(tr).find("td:eq(6)").text()) * parseFloat($(tr).find('td:eq(4) input').val());
                }
                else
                {
                    subtotal += parseFloat($(tr).find("td:eq(8)").text());
                }
                itemdiscount += parseFloat($(tr).find("td:eq(7)").text());
                ItemWiseGST += parseFloat($(tr).find("td:eq(47)").text());
            }
        }
    });
    if ($('#hfItemWiseGST').val() == "1") {
        grandTotal = subtotal;
        salesTax = ItemWiseGST;
        balance = Math.round((parseFloat(salesTax) - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + subtotal), 0);
    }
    else {
        if (discount > 0) {
            if (discountType == 0) {
                grandTotal = subtotal;
                discount = parseFloat(grandTotal) * (parseFloat(discount) / 100);
                if (document.getElementById("hfGSTCalculation").value == "1") {
                    salesTax = parseFloat(salesTax) / 100 * parseFloat(grandTotal);
                }
                else if (document.getElementById("hfGSTCalculation").value == "3") {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) + parseFloat(servicecharges));
                }
                else if (document.getElementById("hfGSTCalculation").value == "4") {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
                }
                else {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
                }
                balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + parseFloat(salesTax)), 0);
            }
            else if (discountType == 1 || discountType == 2) {
                grandTotal = subtotal;
                if (document.getElementById("hfGSTCalculation").value == "1") {
                    salesTax = parseFloat(salesTax) / 100 * grandTotal;
                }
                else if (document.getElementById("hfGSTCalculation").value == "3") {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) + parseFloat(servicecharges));
                }
                else if (document.getElementById("hfGSTCalculation").value == "4") {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
                }
                else {
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
                }
                balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + parseFloat(salesTax)), 0);
            }
        }
        else {
            grandTotal = subtotal;
            salesTax = (parseFloat(salesTax) / 100) * subtotal;
            balance = Math.round((parseFloat(salesTax) - parseFloat(discount) + parseFloat(servicecharges) + subtotal), 0);
        }
    }
    if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
        balance = Math.round((parseFloat(balance) - salesTax), 0);
    }
    $("#lblTotalGrossAmount").text(grandTotal);
    //----------Payment PopUp--------------\\
    document.getElementById("subTotal").innerHTML = Math.round(subtotal, 0);
    document.getElementById("lblGSTTotal").innerHTML = Math.round(salesTax, 0);
    document.getElementById("GrandTotal").innerHTML = Math.round(grandTotal, 0);
    $("#hfGrandTotal").val(subtotal);
    document.getElementById("lblBalance").innerHTML = "0"; Math.round(0);
    document.getElementById("lblPaymentDue").innerHTML = Math.round(balance);
    $("#lblDiscountTotal2").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
    //----------Print Invoice PopUp--------------\\
    document.getElementById("subTotal2").innerHTML = Math.round(subtotal, 0);
    document.getElementById("lblGSTTotal2").innerHTML = Math.round(salesTax, 0);
    document.getElementById("GrandTotal2").innerHTML = Math.round(grandTotal, 0);
    document.getElementById("lblPaymentDue2").innerHTML = Math.round(balance);
    $("#lblTotalNetAmount").text(balance);
    if ($('#hfPaymentType').val() == "0") {
        $('#txtCashRecieved').val(balance);
    }
    else {
        $('#txtCashRecieved').val(0);
    }
}

function UnlockRecord() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/UnlockRecord", //page/method name
                contentType: "application/json; charset=utf-8",
                success: UnloclRecordSuccess,
            }
        );
}
function UnloclRecordSuccess() {
}

//#region Menu Button

//Employee Discount Validation 
function ValidateDiscount(Id) {
    if (Id === undefined || Id === null || Id === -1) {
        return true;
    }
    var DiscountDetail = GetDiscountTemplateDetail(Id);
    if (DiscountDetail[0].DiscountTypeID == 1) {
        if ($("#ddlDiscountUser").val() == null) {
            Error("Please select Employee");
            return false;
        }

        if (parseFloat($('#lblLimit').text()) < parseFloat($('#txtDiscount').val())) {
            Error("Discount Limit is:" + $('#lblLimit').text());
            return false;

        }
    }
    else if (DiscountDetail[0].DiscountTypeID == 2) {
        if ($('#hfCardTypeId').val() == "3") {
            if (parseFloat(document.getElementById('txtDiscount').value) > parseFloat(document.getElementById('txtDiscountBalance').value)) {
                Error('Discount can not be greater than Balance Discount');
                $('#txtDiscount').focus();
                return false;
            }
        }
    }
    return true;
}

function ValidateDiscount2(Id) {
    
    if (Id === undefined || Id === null)
    {   
        return true;
    }
    var DiscountDetail = GetDiscountTemplateDetail(Id);
    if (DiscountDetail[0].DiscountTypeID == 1) {
        if ($("#ddlDiscountUser2").val() == null) {
            Error("Please select Employee");
            return false;
        }

        if (parseFloat($('#lblLimit2').text()) < parseFloat($('#txtDiscount2').val())) {
            Error("Discount Limit is:" + $('#lblLimit2').text());
            return false;

        }
    }
    else if (DiscountDetail[0].DiscountTypeID == 2) {
        if ($('#hfCardTypeId').val() == "3") {
            if (parseFloat(document.getElementById('txtDiscount2').value) > parseFloat(document.getElementById('txtDiscountBalance2').value)) {
                Error('Discount can not be greater than Balance Discount');
                $('#txtDiscount2').focus();
                return false;
            }
        }
    }
    return true;
}

//Deal Validation----------------------------------------------------------\\
function ValidateDealQty() {
    if ($('#txtDealQty').val() == "") {
        Error("Must enter Deal Qty");
        return false;
    }
    if ($('#txtDealQty').val() == "0") {
        Error("Deal Qty should be greater than zero");
        return false;
    }
    return true;
}

//used on createCategoriesButtons
function CheckCatDealQty(dealId) {
    //------------------------------------------------------------------

    if (dealId == 0) {
        return true;
    }

    //------------------------------------------------------------------
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);

    var flag = false;

    var CatQty = 0;
    var TotalCatQty = 0;
    var TotalCatGridQty = 0;

    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        if (lstProducts[i].DEAL == 1) {
            if (lstProducts[i].I_D_ID == dealId) {
                var count = 0;
                var CatGridQty = 0;
                var ItemGridQty = 0;

                TotalCatQty += lstProducts[i].Cat_Quantity * parseFloat($("#txtDealQty").val());

                $('#tble-ordered-products').find('tr').each(function () {
                    if (checkVoid($(this).find("td:eq(15)").text())) {//CHECK IS VOID OR NOT
                        if (dealId == $(this).find("td:eq(23)").text() && lstProducts[i].DIV_ID == $(this).find("td:eq(16)").text()) {
                            ItemGridQty += parseFloat($(this).find("td:eq(4) input").val());
                            if (count == 0) {
                                count++;
                                CatGridQty = parseFloat($(this).find("td:eq(28)").text()) * parseFloat($(this).find("td:eq(29)").text());
                                TotalCatGridQty += parseFloat($(this).find("td:eq(28)").text()) * parseFloat($(this).find("td:eq(29)").text());

                            }
                        }
                    }
                });
                if (ItemGridQty != CatGridQty) {
                    flag = true;
                    break;
                }
            }
        }
    }

    if (flag) {
        Error("Plz complete your Deal");
        return false;
    }

    if (TotalCatGridQty > 0) {
        if (TotalCatQty != TotalCatGridQty) {
            Error("Plz complete your Deal");
            return false;
        }
    }
    $("#hfDealId").val('0');
    return true;

}

//End Deal Validation----------------------------------------------------------\\

//Loyalty region

function LoadLoyaltyCardDetail() {
    if ($('#txtLoyaltyCard').val() != "") {
        $.ajax
           (
               {
                   type: "POST", //HTTP method
                   url: "frmOrderPOSDropDownList.aspx/LoadLoyaltyCardDetail", //page/method name
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   data: JSON.stringify({ cardNo: $('#txtLoyaltyCard').val() }),
                   success: LoyaltyCardDetail
               }
     );
    }
}

function LoadLoyaltyCardDetail2() {
    if ($('#txtLoyaltyCard2').val() != "") {
        $.ajax
           (
               {
                   type: "POST", //HTTP method
                   url: "frmOrderPOSDropDownList.aspx/LoadLoyaltyCardDetail", //page/method name
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   data: JSON.stringify({ cardNo: $('#txtLoyaltyCard2').val() }),
                   success: LoyaltyCardDetail2
               }
     );
    }
}

function LoyaltyCardDetail2(cardNo) {

    cardNo = JSON.stringify(cardNo);
    var result = jQuery.parseJSON(cardNo.replace(/&quot;/g, '"'));

    cardNo = eval(result.d);
    $('#hfCardNo').val('');
    $('#hfCardPurchasing').val('0');
    $('#hfCardTypeId').val('0');
    $('#hfCardPoints').val('0');
    $('#hfCardPurchasing').val('0');
    $('#hfCardAmountLimit').val('0');
    $('#txtLoyaltyCustomer2').val('');

    document.getElementById('txtDiscount2').value = '';
    document.getElementById('txtDiscountReason2').value = '';    
    CalculateBalance2();
    document.getElementById('rowPrivilege2').style.display = "none";
    document.getElementById('rowDirectorCard2').style.display = "none";
    if (cardNo.length > 0) {
        $('#hfCardTypeId').val(cardNo[0].CARD_TYPE_ID);

        if (cardNo[0].CARD_TYPE_ID == "1") {//Privilege Card for Customer
            document.getElementById('rowPrivilege2').style.display = "block";
            $('#txtLoyaltyCustomer2').val(cardNo[0].USER_NAME);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            DiscType(document.getElementById("percentage2"));
            $('#txtDiscount2').val(cardNo[0].DISCOUNT);
            $('#txtNoOfVisits2').val(cardNo[0].NoOfVisits);
            $('#txtTotalPurchased2').val(cardNo[0].TotalPurchase);
            $('#txtTotalLoyaltyDiscount2').val(cardNo[0].TotalDiscount);
            $('#txtLoyaltyQuantity2').val(cardNo[0].TotalQty);
            CalculateBalance2();
        }
        else if (cardNo[0].CARD_TYPE_ID == "2") {
            document.getElementById('rowRewardCard2').style.display = "block";
            $('#hfCardPoints').val(cardNo[0].POINTS);
            $('#hfCardPurchasing').val(cardNo[0].PURCHASING);
            $('#txtTotalPoints2').val(cardNo[0].TotalPurchase);
            $('#txtRedeemedPoints2').val(cardNo[0].POINTS);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            $('#txtLoyaltyCustomer2').val(cardNo[0].USER_NAME);
            $('#txtBalancePoints2').val(parseFloat(cardNo[0].TotalPurchase) - parseFloat(cardNo[0].POINTS));
            $('#txtAvailableDiscount2').val(cardNo[0].DISCOUNT);
            $('#txtAvailableCash2').val(cardNo[0].TotalQty);
            DiscType(document.getElementById("value"));
            if (parseFloat(cardNo[0].DISCOUNT) <= parseFloat($('#lblPaymentDue').text())) {
                $('#txtDiscount2').val(parseFloat(cardNo[0].DISCOUNT));
            }
            else {
                $('#txtDiscount2').val(parseFloat($('#lblPaymentDue').text()));
            }
            CalculateBalance2();
        }
        if (cardNo[0].CARD_TYPE_ID == "3") {//Director Card for employee
            document.getElementById('rowDirectorCard2').style.display = "block";
            $('#txtLoyaltyCustomer2').val(cardNo[0].USER_NAME);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            DiscType(document.getElementById("value2"));
            $('#txtAllowedLimit2').val(cardNo[0].AMOUNT_LIMIT);
            $('#txtDiscountAvail2').val(cardNo[0].TotalPurchase);
            $('#txtDiscountBalance2').val(cardNo[0].TotalDiscount);
            if (parseFloat(cardNo[0].TotalDiscount) < parseFloat($('#lblPaymentDue2').text())) {
                $('#txtDiscount2').val(parseFloat(cardNo[0].TotalDiscount));
            }
            else {
                $('#txtDiscount2').val(parseFloat($('#lblPaymentDue2').text()));
            }
            CalculateBalance2();
        }

        document.getElementById("txtDiscount2").disabled = true;
        document.getElementById('txtDiscountReason2').disabled = true;
        if (cardNo[0].CARD_TYPE_ID == "3" || cardNo[0].CARD_TYPE_ID == "2") {
            document.getElementById("txtDiscount2").disabled = false;
            document.getElementById('txtDiscountReason2').disabled = false;
        }
    }
    else {
        Error("Card No is not correct");
    }
}

function LoyaltyCardDetail(cardNo) {

    cardNo = JSON.stringify(cardNo);
    var result = jQuery.parseJSON(cardNo.replace(/&quot;/g, '"'));

    cardNo = eval(result.d);
    $('#hfCardNo').val('');
    $('#hfCardPurchasing').val('0');
    $('#hfCardTypeId').val('0');
    $('#hfCardPoints').val('0');
    $('#hfCardPurchasing').val('0');
    $('#hfCardAmountLimit').val('0');
    $('#txtLoyaltyCustomer').val('');

    document.getElementById('txtDiscount').value = '';
    CalculateBalance();
    document.getElementById('rowPrivilege').style.display = "none";
    document.getElementById('rowDirectorCard').style.display = "none";
    document.getElementById('rowRewardCard').style.display = "none";
    if (cardNo.length > 0) {
        $('#hfCardTypeId').val(cardNo[0].CARD_TYPE_ID);
        $('#hfCardNo').val(cardNo[0].strCardNo);
        $('#hfCardPurchasing').val(cardNo[0].PURCHASING);
        if (cardNo[0].CARD_TYPE_ID == "1") {//Privilege Card for Customer
            document.getElementById('rowPrivilege').style.display = "block";
            $('#txtLoyaltyCustomer').val(cardNo[0].USER_NAME);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            DiscType(document.getElementById("percentage"));
            $('#txtDiscount').val(cardNo[0].DISCOUNT);
            CalculateBalance();
        }
        else if (cardNo[0].CARD_TYPE_ID == "2") {//Reward Card for Customer
            document.getElementById('rowRewardCard').style.display = "block";
            $('#hfCardPurchasing').val(cardNo[0].PURCHASING);
            $('#txtRedeemedPoints').val(cardNo[0].POINTS);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            $('#txtLoyaltyCustomer').val(cardNo[0].USER_NAME);
            $('#txtBalancePoints').val(parseFloat(cardNo[0].TotalPurchase) - parseFloat(cardNo[0].POINTS));
            $('#txtAvailableDiscount').val(cardNo[0].DISCOUNT);
            DiscType(document.getElementById("value"));
            CurrentPoints = Math.floor(parseInt($('#lblPaymentDue').text()) / parseInt(cardNo[0].PURCHASING)) * parseInt(cardNo[0].POINTS);
            $('#hfCardPoints').val(CurrentPoints);
            $('#txtOpeningPoints').val(cardNo[0].TotalPurchase);
            $('#txtTotalPoints').val(parseInt(CurrentPoints) + parseFloat(cardNo[0].TotalPurchase));
            CalculateBalance();
        }
        if (cardNo[0].CARD_TYPE_ID == "3") {//Director Card for employee
            document.getElementById('rowDirectorCard').style.display = "block";
            $('#txtLoyaltyCustomer').val(cardNo[0].USER_NAME);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
            $("#ddlCustomer").val(cardNo[0].USER_ID).change();
            DiscType(document.getElementById("value"));
            $('#txtAllowedLimit').val(cardNo[0].AMOUNT_LIMIT);
            $('#txtDiscountAvail').val(cardNo[0].TotalPurchase);
            $('#txtDiscountBalance').val(cardNo[0].TotalDiscount);
            if (parseFloat(cardNo[0].TotalDiscount) < parseFloat($('#lblPaymentDue').text())) {
                $('#txtDiscount').val(parseFloat(cardNo[0].TotalDiscount));
            }
            else {
                $('#txtDiscount').val(parseFloat($('#lblPaymentDue').text()));
            }
            CalculateBalance();
        }

        document.getElementById("txtDiscount").disabled = true;
        if (cardNo[0].CARD_TYPE_ID == "3" || cardNo[0].CARD_TYPE_ID == "2")
        {
            document.getElementById("txtDiscount").disabled = false;
        }
    }
    else {
        Error("Card No is not correct");
    }
}

function DisableDiscount() {
    if ($('#txtLoyaltyCard').val() == "") {
        $('#dvDiscount2').find('*').prop('disabled', false);
        $('#txtDiscount2').val('');
        $('#hfCardTypeId').val('0');
        $('#hfCardPoints').val('0');
        $('#hfCardPurchasing').val('0');
        $('#hfCardAmountLimit').val('0');
        CalculateBalance2();
    }
}

function ValidateCardAmount() {
    if ($('#hfCardTypeId ').val() == "3") {
        if (parseFloat($('#txtDiscount2').val()) > parseFloat($('#hfCardAmountLimit').val())) {
            Error("Discount Limit is " + $('#hfCardAmountLimit').val());
            return false;
        }
    }
    return true;
}
//Loyalty endregion

///Qty [3] ,C1 [12], IS Void [13],Deal Price [21],A_Price[20], Deal ID [21], C2 [23], Deal Qty [27] ,Cat Qty [28], ,Cat Choice [29], Deal_name [32]
///UOM_ID": (33),"intStockMUnitCode": 34, "Stock_to_SaleOperator": 35, "Stock_to_SaleFactor": 36

//WHEN DIVISION IS VALUE BASE
function plusAmount(obj) {

    rowIndex = obj.closest('tr');

    var price = parseFloat($(rowIndex).find('td:eq(5) input').val());

    if (obj.value != "") {

        var tprice = parseFloat($(rowIndex).find('td:eq(20)').text());

        $(rowIndex).find('td:eq(3) input').val(parseFloat(price / tprice).toFixed(2));

        var amount = parseFloat(price).toFixed(2);

        $(rowIndex).find('td:eq(6)').text(amount);



    }
    else {
        $(rowIndex).find('td:eq(3) input').val(0);
        $(rowIndex).find('td:eq(6)').text(0);
    }

    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;

    $('#hfDisable').val("0");

}

function plusQty(obj) {
    if (IsUserValidationPopup == 1) {
        return;
    }
    var rowIndex = $(obj).parent();
    if (checkVoid($(rowIndex).find('td:eq(15)').text())) {
        var qty = parseFloat($(rowIndex).find('td:eq(4) input').val());
        qty = qty + 1;        
        $(rowIndex).find('td:eq(4) input').val(qty);
        var price = $(rowIndex).find('td:eq(6)').text();
        var discount = 0;
        if ($(rowIndex).find('td:eq(7)').text() == "")
        {
            discount = 0;
        }
        else
        {
            discount = $(rowIndex).find('td:eq(7)').text();
        }
        discount = parseFloat(discount) * parseFloat(qty);
        $(rowIndex).find("td:eq(48)").text(parseFloat(discount));
        var amount = parseFloat(qty * price).toFixed(2) - parseFloat(discount).toFixed(2);
        $(rowIndex).find('td:eq(8)').text(amount);
        $(rowIndex).find('td:eq(47)').text(amount * parseFloat($(rowIndex).find('td:eq(46)').text()) / 100);
        var tableData = storeTblValues();
        tableData = JSON.stringify(tableData);
        document.getElementById('hfOrderedproducts').value = tableData;
        setTotals();
        $('#hfDisable').val("0");
        $('#hfIsNewItemAdded').val('1');
    }
}

function resetColor() {
    $('#tble-ordered-products tr').removeClass("selected");
}

//Add new Row on Specific index for Nos and Extras
function AddRow(obj) {

    var rowNo = $(obj).closest('tr').index();//for getting on which row no click

    if ($("#hfRow").val() != rowNo) {
        resetColor();

    }

    $("#hfRow").val(rowNo);

    var rowIndex = $(obj).parent();
    $("#hfRowIndex").val(rowIndex);

    //$("#hfCounter").val($(rowIndex).find('td:eq(23)').text());

    $(obj).closest('tr').addClass('selected');
}
//-----------------------------------------------------------------------------\\

function storeTblValues() {

    var tableData = new Array();

    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(20)').text() == "2") {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "strERPCode": $(tr).find('td:eq(1)').text(),
                "SKU_NAME": $(tr).find('td:eq(2)').text(),
                "QTY": $(tr).find('td:eq(4) input').val(),
                "T_PRICE": $(tr).find('td:eq(6) input').val(),
                "DISCOUNT": $(tr).find('td:eq(7)').text(),
                "AMOUNT": $(tr).find('td:eq(8)').text(),
                "PRINTER": $(tr).find('td:eq(10)').text(),
                "PR_COUNT": $(tr).find('td:eq(11)').text(),
                "SEC_ID": $(tr).find('td:eq(12)').text(),
                "SECTION": $(tr).find('td:eq(13)').text(),
                "C1": $(tr).find('td:eq(14)').text(),
                "VOID": $(tr).find('td:eq(15)').text(),
                "CAT_ID": $(tr).find('td:eq(16)').text(),
                "INVOICE_ID": $(tr).find('td:eq(17)').text(),
                "DESC": $(tr).find('td:eq(19)').text(),
                "PRINT": $(tr).find('td:eq(20)').text(),
                "A_PRICE": $(tr).find('td:eq(22)').text(),
                "I_D_ID": $(tr).find('td:eq(23)').text(),
                "C2": $(tr).find('td:eq(24)').text(),
                "intDealID": $(tr).find('td:eq(26)').text(),
                "lngDealDetailID": $(tr).find('td:eq(27)').text(),
                "DEAL_QTY": $(tr).find('td:eq(28)').text(),
                "DEAL_NAME": $(tr).find('td:eq(33)').text(),
                "UOM_ID": $(tr).find('td:eq(34)').text(),
                "intStockMUnitCode": $(tr).find('td:eq(35)').text(),
                "Stock_to_SaleOperator": $(tr).find('td:eq(36)').text(),
                "Stock_to_SaleFactor": $(tr).find('td:eq(37)').text(),
                "DEFAULT_QTY": $(tr).find('td:eq(38)').text(),
                "IS_HasMODIFIER": $(tr).find('td:eq(39)').text(),
                "DeliveryType": $(tr).find('td:eq(40)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(40)').text(),
                //"IS_FREE": $(tr).find('td:eq(42)').text(),
                "IS_FREE": 0,
                "ORIGINAL_QTY": $(tr).find('td:eq(43)').text(),
                "PRINT_QTY": $(tr).find('td:eq(43)').text(),
                "MODIFIER_PARENT_ID": 0,
                "LessCancelReasonID": $(tr).find('td:eq(44)').text(),
                "SortOrder": $(tr).find('td:eq(45)').text(),
                "GSTPER": $(tr).find('td:eq(46)').text(),
                "ItemWiseGST": $(tr).find('td:eq(47)').text(),
                "ItemType": 1,
                //56 For TimeStamp
                "TIME_STAMP": $(tr).find('td:eq(49)').text()
            }
        }
        else {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "strERPCode": $(tr).find('td:eq(1)').text(),
                "SKU_NAME": $(tr).find('td:eq(2)').text(),
                "QTY": $(tr).find('td:eq(4) input').val(),
                "T_PRICE": $(tr).find('td:eq(6)').text(),
                "DISCOUNT": $(tr).find('td:eq(7)').text(),
                "AMOUNT": $(tr).find('td:eq(8)').text(),
                "PRINTER": $(tr).find('td:eq(10)').text(),
                "PR_COUNT": $(tr).find('td:eq(11)').text(),
                "SEC_ID": $(tr).find('td:eq(12)').text(),
                "SECTION": $(tr).find('td:eq(13)').text(),
                "C1": $(tr).find('td:eq(14)').text(),
                "VOID": $(tr).find('td:eq(15)').text(),
                "CAT_ID": $(tr).find('td:eq(16)').text(),
                "INVOICE_ID": $(tr).find('td:eq(17)').text(),
                "DESC": $(tr).find('td:eq(19)').text(),
                "PRINT": $(tr).find('td:eq(20)').text(),
                "A_PRICE": $(tr).find('td:eq(22)').text(),
                "I_D_ID": $(tr).find('td:eq(23)').text(),
                "C2": $(tr).find('td:eq(24)').text(),
                "intDealID": $(tr).find('td:eq(26)').text(),
                "lngDealDetailID": $(tr).find('td:eq(27)').text(),
                "DEAL_QTY": $(tr).find('td:eq(28)').text(),
                "DEAL_NAME": $(tr).find('td:eq(33)').text(),
                "UOM_ID": $(tr).find('td:eq(34)').text(),
                "intStockMUnitCode": $(tr).find('td:eq(35)').text(),
                "Stock_to_SaleOperator": $(tr).find('td:eq(36)').text(),
                "Stock_to_SaleFactor": $(tr).find('td:eq(37)').text(),
                "DEFAULT_QTY": $(tr).find('td:eq(38)').text(),
                "IS_HasMODIFIER": $(tr).find('td:eq(39)').text(),
                "DeliveryType": $(tr).find('td:eq(40)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(40)').text(),
                //"IS_FREE": $(tr).find('td:eq(42)').text(),
                "IS_FREE": 0,
                "ORIGINAL_QTY": $(tr).find('td:eq(43)').text(),
                "PRINT_QTY": $(tr).find('td:eq(43)').text(),
                "MODIFIER_PARENT_ID": 0,
                "LessCancelReasonID": $(tr).find('td:eq(44)').text(),
                "SortOrder": $(tr).find('td:eq(45)').text(),
                "GSTPER": $(tr).find('td:eq(46)').text(),
                "ItemWiseGST": $(tr).find('td:eq(47)').text(),
                "ItemType": 1,
                //56 For TimeStamp
                "TIME_STAMP": $(tr).find('td:eq(49)').text()
            }
        }
    });

    return tableData;
}

//Call on Pending Bills Row Click, And on HoldOrder Save When Takeaway
function ShowBill(tr) {
    if ($(tr).find("td:eq(22)").text() == "1") {
        Error('This record is locked by ' + $(tr).find("td:eq(23)").text());
        return;
    }
    if ($("#hfCustomerType").val() == "Delivery") {
        if ($(tr).find("td:eq(27)").text() == "3") {
            Error('This record is locked by rider');
            return;
        }
    }
    $("#lblDelChannel").text('');
    if (($("#lnkDelivery").attr("class")) == "box active") {
        $("#lblDelChannel").text('Delivery by: ' + $(tr).find("td:eq(26)").text());
    }
    $("#hfIsOldOrder").val('1');
    $("#hfVoidBy").val('');
    $("#txtLoyaltyCard").val('');
    $("#txtLoyaltyCard2").val('');
    $("#hfCardTypeId").val(0);
    $("#hfCardPoints").val(0);
    $("#hfCardPurchasing").val(0);
    $('#hfCardAmountLimit').val(0);
    $("#InvoiceTable").text('');
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#ddlDiscountType').val(1);
    $('#ddlDiscountType2').val(1);
    $('#txtLoyaltyCustomer2').val('');
    $('#txtLoyaltyCustomer').val('');
    $('#txtAllowedLimit').val('');
    $('#txtDiscountAvail').val('');
    $('#txtDiscountBalance').val('');
    $('#txtAllowedLimit2').val('');
    $('#txtDiscountAvail2').val('');
    $('#txtDiscountBalance2').val('');
    $("#lblTotalNetAmount").text($(tr).find("td:eq(3)").text());
    if (document.getElementById('hfCheckSMS').value == "0") {
        //Rregion Orderbooker
        if (document.getElementById("hfBookingType").value == "1") {//For Kitchen dialog not print
            if (document.getElementById("hfUserId").value == $(tr).find("td:eq(6)").text()) {
                var spanTxt = document.getElementById('user-detail-bold').innerText;
                var listItem = "<option value='" + $(tr).find("td:eq(6)").text() + "'>" + spanTxt + "</option>";
                $("#ddlOrderBooker").html(listItem);
                $("#ddlOrderBooker").val($(tr).find("td:eq(6)").text());
            }
            else {
                Error("Please Select your Order");
                return;
            }
        }
        //endregion Orderbooker
        $("#ddlOrderBooker").val($(tr).find("td:eq(6)").text());
        $("#OrderNo1").text($(tr).find("td:eq(0)").text());
        if ($(tr).find("td:eq(10)").text() == "DLY") {
            $("#OrderTime").text($(tr).find("td:eq(29)").text());
        }
        else if ($(tr).find("td:eq(10)").text() == "TKY") {
            $("#OrderTime").text($(tr).find("td:eq(26)").text());
        }
        else {
            $("#OrderTime").text($(tr).find("td:eq(27)").text());
        }
        $("#MaxOrderNo").text($(tr).find("td:eq(13)").text());
        $("#hfTableId").val($(tr).find("td:eq(14)").text());
        if (($("#lnkDineIn").attr("class")) == "box active") {
            $("#hfTableNo").val($(tr).find("td:eq(25)").text());
        }
        else {
            $("#hfTableNo").val($(tr).find("td:eq(25)").text());
        }
        $("#txtTakeawayCustomer").val($(tr).find("td:eq(24)").text());
        var amountDue = $(tr).find("td:eq(27)").text();
        var discount = $(tr).find("td:eq(3)").text();
        $('#txtDiscountAuth').val(discount);
        $("#TableNo1").text($(tr).find("td:eq(10)").text());

        $("#hfCustomerId").val($(tr).find("td:eq(11)").text());
        $("#ddlCustomer").val($(tr).find("td:eq(11)").text()).change();
        $("#hfCustomerNo").val($(tr).find("td:eq(15)").text());

        //region Loyalty
        $("#txtLoyaltyCard").val($(tr).find("td:eq(16)").text());
        $("#txtLoyaltyCard2").val($(tr).find("td:eq(16)").text());
        $("#hfCardTypeId").val($(tr).find("td:eq(17)").text());
        $("#hfCardPoints").val($(tr).find("td:eq(18)").text());
        $("#hfCardPurchasing").val($(tr).find("td:eq(19)").text());
        $('#hfCardAmountLimit').val($(tr).find("td:eq(20)").text());
        //endregion Loyalty
        $("#txtLoyaltyCard").blur();
        $("#txtLoyaltyCard2").blur();

        $("#InvoiceTable").text($(tr).find("td:eq(12)").text());
        $('#hfDiscountType').val($(tr).find("td:eq(4)").text());
        $('#hfchkDiscountType').val($(tr).find("td:eq(4)").text());
        try {
            $('#ddlDiscountType').val($(tr).find("td:eq(21)").text());
            $('#ddlDiscountType2').val($(tr).find("td:eq(21)").text());

        } catch (e) {
            $('#ddlDiscountType').val(1);
            $('#ddlDiscountType2').val(1);
        }

        $('#ddlDiscountType').change();
        $('#ddlDiscountType2').change();

        if ($(tr).find("td:eq(5)").text() != "null") {
            $('#txtCoverTable').val($(tr).find("td:eq(5)").text());
        }
        if ($(tr).find("td:eq(7)").text() != "null") {
            $('#txtDiscountReason2').val($(tr).find("td:eq(7)").text());
            $('#txtDiscountReason').val($(tr).find("td:eq(7)").text());
        }
        else {
            $('#txtDiscountReason2').val('');
            $('#txtDiscountReason').val('');
        }
        if ($(tr).find("td:eq(8)").text() != "-1") {
            $('#txtService').val($(tr).find("td:eq(8)").text());
            $('#txtService2').val($(tr).find("td:eq(8)").text());
        }
        else {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $('#txtService').val(parseFloat($("#hfDELIVERY_CHARGES_VALUE").val()).toFixed(0));
                $('#txtService2').val(parseFloat($("#hfDELIVERY_CHARGES_VALUE").val()).toFixed(0));
                $('#valueService').trigger("click");
                $('#valueServicePayment').trigger("click");
                $('#hfServiceType').val($("#hfDELIVERY_CHARGES_TYPE").val());
            }
            else {
                $('#txtService').val(parseFloat($("#hfServiceChargesValue").val()).toFixed(0));
                $('#txtService2').val(parseFloat($("#hfServiceChargesValue").val()).toFixed(0));
                $('#hfServiceType').val($("#hfServiceChargesType").val());
                CalculateServiceChages();
                CalculateServiceChagesPayment();
            }
        }

        activeLink(); //Active css of Main Buttons on selection of pending bills
        GetPendingBill($(tr).find("td:eq(0)").text());
        calculateDiscount(discount,0, amountDue);
        $('#hfDisable').val("1");
    }
    document.getElementById('hfCheckSMS').value = "0";
}
function ShowBill2(tr) {
    $("#lblDelChannel").text('');
    if (($("#lnkDelivery").attr("class")) == "box active") {
        $("#lblDelChannel").text('Delivery by: ' + $(tr).find("td:eq(26)").text());
    }
    $("#hfIsOldOrder").val('1');
    $("#hfVoidBy").val('');
    $("#txtLoyaltyCard").val('');
    $("#txtLoyaltyCard2").val('');
    $("#hfCardTypeId").val(0);
    $("#hfCardPoints").val(0);
    $("#hfCardPurchasing").val(0);
    $('#hfCardAmountLimit').val(0);
    $("#InvoiceTable").text('');
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#ddlDiscountType').val(1);
    $('#ddlDiscountType2').val(1);
    $('#txtLoyaltyCustomer2').val('');
    $('#txtLoyaltyCustomer').val('');
    $('#txtAllowedLimit').val('');
    $('#txtDiscountAvail').val('');
    $('#txtDiscountBalance').val('');
    $('#txtAllowedLimit2').val('');
    $('#txtDiscountAvail2').val('');
    $('#txtDiscountBalance2').val('');
    if (document.getElementById('hfCheckSMS').value == "0") {
        //Rregion Orderbooker
        if (document.getElementById("hfBookingType").value == "1") {//For Kitchen dialog not print

            if (document.getElementById("hfUserId").value == $(tr).find("td:eq(6)").text()) {
                var spanTxt = document.getElementById('user-detail-bold').innerText;
                var listItem = "<option value='" + $(tr).find("td:eq(6)").text() + "'>" + spanTxt + "</option>";
                $("#ddlOrderBooker").html(listItem);
                $("#ddlOrderBooker").val($(tr).find("td:eq(6)").text());
            }
            else {
                Error("Please Select your Order");
                return;
            }
        }
        //endregion Orderbooker
        $("#ddlOrderBooker").val($(tr).find("td:eq(6)").text());
        $("#OrderNo1").text($(tr).find("td:eq(0)").text());
        $("#MaxOrderNo").text($(tr).find("td:eq(13)").text());
        $("#hfTableId").val($(tr).find("td:eq(14)").text());
        if (($("#lnkDineIn").attr("class")) == "box active") {
            $("#hfTableNo").val($(tr).find("td:eq(25)").text());
        }
        else {
            $("#hfTableNo").val($(tr).find("td:eq(25)").text());
        }
        $("#txtTakeawayCustomer").val($(tr).find("td:eq(24)").text());
        var amountDue = $(tr).find("td:eq(27)").text();
        var discount = 0;
        var itemdiscount = 0;
        discount = $(tr).find("td:eq(3)").text();
        if (discount == 'null')
        {
            discount = 0;
        }
        $('#txtDiscountAuth').val(discount);
        itemdiscount = parseFloat($(tr).find("td:eq(25)").text());
        $("#TableNo1").text($(tr).find("td:eq(10)").text());

        $("#hfCustomerId").val($(tr).find("td:eq(11)").text());
        $("#ddlCustomer").val($(tr).find("td:eq(11)").text()).change();
        $("#hfCustomerNo").val($(tr).find("td:eq(15)").text());

        //region Loyalty
        $("#txtLoyaltyCard").val($(tr).find("td:eq(16)").text());
        $("#txtLoyaltyCard2").val($(tr).find("td:eq(16)").text());
        $("#hfCardTypeId").val($(tr).find("td:eq(17)").text());
        $("#hfCardPoints").val($(tr).find("td:eq(18)").text());
        $("#hfCardPurchasing").val($(tr).find("td:eq(19)").text());
        $('#hfCardAmountLimit').val($(tr).find("td:eq(20)").text());
        //endregion Loyalty
        $("#txtLoyaltyCard").blur();
        $("#txtLoyaltyCard2").blur();

        $("#InvoiceTable").text($(tr).find("td:eq(12)").text());
        $('#hfDiscountType').val($(tr).find("td:eq(4)").text());
        $('#hfchkDiscountType').val($(tr).find("td:eq(4)").text());
        try {
            $('#ddlDiscountType').val($(tr).find("td:eq(21)").text());
            $('#ddlDiscountType2').val($(tr).find("td:eq(21)").text());

        } catch (e) {
            $('#ddlDiscountType').val(1);
            $('#ddlDiscountType2').val(1);
        }

        $('#ddlDiscountType').change();
        $('#ddlDiscountType2').change();

        if ($(tr).find("td:eq(5)").text() != "null") {
            $('#txtCoverTable').val($(tr).find("td:eq(5)").text());
        }
        if ($(tr).find("td:eq(7)").text() != "null") {
            $('#txtDiscountReason2').val($(tr).find("td:eq(7)").text());
            $('#txtDiscountReason').val($(tr).find("td:eq(7)").text());
        }
        else {
            $('#txtDiscountReason2').val('');
            $('#txtDiscountReason').val('');
        }
        if ($(tr).find("td:eq(8)").text() != "-1") {
            $('#txtService').val($(tr).find("td:eq(8)").text());
            $('#txtService2').val($(tr).find("td:eq(8)").text());
        }
        else {
            if (document.getElementById("hfCustomerType").value == "Delivery") {
                $('#txtService').val(parseFloat($("#hfDELIVERY_CHARGES_VALUE").val()).toFixed(0));
                $('#txtService2').val(parseFloat($("#hfDELIVERY_CHARGES_VALUE").val()).toFixed(0));
                $('#valueService').trigger("click");
                $('#valueServicePayment').trigger("click");
                $('#hfServiceType').val($("#hfDELIVERY_CHARGES_TYPE").val());
            }
            else {
                $('#txtService').val(parseFloat($("#hfServiceChargesValue").val()).toFixed(0));
                $('#txtService2').val(parseFloat($("#hfServiceChargesValue").val()).toFixed(0));
                $('#hfServiceType').val($("#hfServiceChargesType").val());                
            }
        }
        activeLink(); //Active css of Main Buttons on selection of pending bills
        GetPendingBill2($(tr).find("td:eq(0)").text());
        calculateDiscount(discount, itemdiscount, amountDue);
        $('#hfDisable').val("1");
    }
    document.getElementById('hfCheckSMS').value = "0";
}
function NewOrder() {    
    if (IsUserValidationPopup == 1) {
        return;
    }
    $('#txtItemDiscount').val('');
    HolderOrderClicke = 0;
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $("#txtManualOrderNo").val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    GetPendingBills();
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    $("#hfCustomerId").val("0");
    $("#ddlCustomer").val('0').change();
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $("#txtCoverTable").val('');
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $("#txtTakeawayCustomer").val('');
    $("#hfCounter").val(0);
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    UnlockRecord();
}
//#region Printing

//For Removing Duplicates an Array Used in PrintOrder(), UniqueSECTN()
function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1)
            result.push(e);
    });
    return result;
}

var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) { return primer(x[field]) } :
        function (x) { return x[field] };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

function PrintOrder() {
    if (IsUserValidationPopup == 1) {
        return;
    }
    if ($('#hfIsNewItemAdded').val() == '0') {
        if (document.getElementById("hfCan_PrintOrder").value == "True") {
            $("#OrderprintType").text('');
            $("#divLess").css("display", "none");
            $("#divCancel").css("display", "none");
            $("#divAdd").css("display", "none");
            $("#divDuplicate").css("display", "none");
            $("#tblCancelItem").css("display", "none");
            $("#tblLessItem").css("display", "none");
            $("#tblAddItem").css("display", "block");
            if ($("#hfDisable").val() == "1") {
                var orderedProducts = $("#hfOrderedproducts").val();
                orderedProducts = eval(orderedProducts);
                orderedProducts = orderedProducts.sort(sort_by('C1', false, parseFloat));
                var uniqueSections = $.unique(orderedProducts.map(function (d) { return d.SEC_ID; }));
                uniqueSections = uniqueSections.sort();
                uniqueSections = unique(uniqueSections);
                for (var j = 0; j < uniqueSections.length; j++) {
                    $('#detail-section-skus').empty(); // clear all skus  from invoice
                    for (var i = 0, len = orderedProducts.length; i < len; i++) {
                        if (orderedProducts[i].PRINT == "true") {
                            if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                                var qty = orderedProducts[i].QTY;
                                //if (qty > 0) {
                                $("#SectionName").text(orderedProducts[i].SECTION);
                                $("#lblOrderNotes2").text($("#txtRemarks").val());
                                $("#CustoerType").text(document.getElementById("hfCustomerType").value);
                                if ($("#hfEatIn").val() == "1") {
                                    $("#TableNo").text("");
                                }
                                else {
                                    $("#TableNo").text("Table No : " + $("#hfTableNo").val());
                                }
                                $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                                if ($("#hfCustomerType").val() == "Takeaway") {
                                    $("#TableNo").text("Customer :" + $("#txtTakeawayCustomer").val());
                                }
                                else if ($("#hfCustomerType").val() == "Delivery") {
                                    if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                        $("#TableNo").text("");
                                    }
                                    else {
                                        $("#TableNo").text("Customer :" + $("#hfTableNo").val());
                                    }
                                    $("#kitchenOrderTaker").text("D-M : " + $('select#ddlOrderBooker option:selected').text());
                                }
                                if ($("#txtManualOrderNo").val() != "") {
                                    $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                                }
                                else {
                                    $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                                }
                                $("#Date").text($("#hfCurrentWorkDate").val());
                                $("#Time").text(moment().format('hh:mm A'));
                                if ($("#txtManualOrderNo").val() != "") {
                                    $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                                }
                                else {
                                    $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                                }
                                var row = $('<tr ><td>' + orderedProducts[i].C1 + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right">' + qty + '</td></tr>');
                                $('#detail-section-skus').append(row);
                            }
                        }
                    }
                    if ($("#detail-section-skus tr").length > 0) {
                        $("#divDuplicate").html('<hr>DUPLICATE ORDER<br><hr>');
                        $("#divDuplicate").css("display", "block");
                        document.getElementById("trLocationName").style.display = "none";
                        if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                            $("#LocationName").text(document.getElementById("hfLocationName").value);
                            document.getElementById("trLocationName").style.display = "block";
                        }
                        PrintInvoiceOfSection();
                    }
                }

                $('#tble-ordered-products').empty();
                $('#hfIsNewItemAdded').val('0');
                HolderOrderClicke = 0;
                $("#hfIsOldOrder").val('0');
                $('#hfOrderedproducts').val('');
                $('#hfCustomerId').val('0');
                $("#ddlCustomer").val('0').change();
                $("#hfTableNo").val("");
                $("#hfTableId").val("0");
                $('#hfDisable').val("0");
                $("#txtCoverTable").val('');
                if (document.getElementById("hfCustomerType").value == "Dine In") {
                    $("#TableNo1").text("N/A");
                }
                $("#OrderNo1").text("N/A");
                $("select#ddlOrderBooker").prop('selectedIndex', 0);
                $("#lblTotalGrossAmount").text("");
                $("#lblTotalNetAmount").text("");
                $('#txtItemDiscount').val('');
                $('#txtRemarks').val('');
                $('#txtCreditCardNo').val('');
                $('#txtCreditCardAccountTile').val('');
                $('#txtManualOrderNo').val('');
                $('#hfPaymentType').val('0');
                $("#hfDiscountRemarks").val('');
                $("#hfCounter").val(0);
                document.getElementById('dvDealUpdate').style.display = 'none';
                $("#txtDealQty").val('1');
                UnlockRecord();
            }
        }
        else {
            Error("You do not have access.");
        }
    } else {
        alert('New item added first Holde order.');
    }
}

//#endregion Printing Section 

// #region HoldOrder
function HoldOrder() {


    //When Dine IN Active
    if (($("#lnkDineIn").attr("class")) == "box active") {

        if (($("#hfTableNo").val() == "") || ($("#hfTableNo").val() == "DLY") || ($("#hfTableNo").val() == "TKY")) {

            Error("Table not selected");

            return;
        }
        if ($("#ddlOrderBooker").val() == null) {

            Error("Please select Order Taker");
            return;
        }
        if ($("#hfIsCoverTable").val() == "1") {

            if (($("#txtCoverTable").val() == "0") || ($("#txtCoverTable").val() == "")) {
                if ($("#hfEatIn").val() == "1") {
                    Error("Token ID not entered");
                    return;
                }
                else {
                    Error("Cover Table not entered");
                    return;
                }
            }
        }
    }
    if (($("#lnkDelivery").attr("class")) == "box active") {

        if ($("#ddlOrderBooker").val() == null) {

            Error("Please select Delivery Man");
            return;
        }

        if (($("#hfCustomerId").val() == "0")) {
            Error("Please select customer");
            return;
        }
    }
    if (($("#lnkTakeaway").attr("class")) == "box active") {
        if ($("#hfTakeawayTokenIDMandatory").val() == "1") {
            if ($('#txtCoverTable').val().length == 0) {
                Error("Please enter Token ID");
                return;
            }
        }
    }
    SaveOrder();
}

$('#dvHold').click(function (e) {
    if (IsUserValidationPopup == 1) {
        return;
    }
    var IsZeroQtyFound = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        var qty = 0;
        qty = $(tr).find('td:eq(4) input').val();
        if (qty == '') {
            qty = 0;
        }
        if (parseFloat(qty) == 0) {
            IsZeroQtyFound = 1;
        }
    });

    if (IsZeroQtyFound == 1) {
        Error('Quantity can not be zero');
        return;
    }

    $("#lblServiceChargesTotalPayment").text('0');
    if (document.getElementById("hfIsKOTMandatory").value == "1") {
        if (document.getElementById("txtManualOrderNo").value == "") {
            Error("Enter Manual KOT No");
            return;
        }
        else {
            if (document.getElementById("hfIsKOTUniquePerDay").value == "1") {
                CheckKOTNo();
            }
            else {
                fnHoldOrder();
            }
        }
    }
    else {
        fnHoldOrder();
    }
});
function CheckKOTNo() {
    $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOS.aspx/CheckKOTNo", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ manualOrderNo: $("#txtManualOrderNo").val(), isOldOder: document.getElementById("hfIsOldOrder").value, OldOrderID: $("#OrderNo1").text() }),
                    success: GetKOTNo,
                    error: OnError,
                    complete: function () {
                        $("#dvHold").attr("disabled", false);
                        me.data('requestRunning', false);
                    }
                });
}

function GetKOTNo(kots) {
    kots = JSON.stringify(kots);
    var result = jQuery.parseJSON(kots.replace(/&quot;/g, '"'));
    kots = eval(result.d);

    if (kots.length > 0) {
        Error("Manual KOT No already exist.");
    }
    else {
        fnHoldOrder();
    }
}
function fnHoldOrder() {
    var ServiceChargesType = document.getElementById("hfServiceChargesType").value;
    var customerid = 0;
    try {
        customerid = $('select#ddlCustomer option:selected').val();

    } catch (e) {
        customerid = 0;
    }
    if (customerid === undefined) {
        customerid = 0;
    }

    if (CheckCatDealQty($("#hfDealId").val())) {
        if (($("#lnkDineIn").attr("class")) == "box active") {
            if (($("#hfTableNo").val() == "") || ($("#hfTableNo").val() == "DLY") || ($("#hfTableNo").val() == "TKY")) {
                Error("Table not selected");
                return;
            }
            if ($("#ddlOrderBooker").val() == null) {
                Error("Please select Order Taker");
                return;
            }
            if ($("#hfIsCoverTable").val() == "1") {
                if (($("#txtCoverTable").val() == "0") || ($("#txtCoverTable").val() == "")) {
                    if ($("#hfEatIn").val() == "1") {
                        Error("Token ID not entered");
                        return;
                    }
                    else {
                        Error("Cover Table not entered");
                        return;
                    }
                }
            }
        }
        if (($("#lnkTakeaway").attr("class")) == "box active") {
            if ($("#ddlOrderBooker").val() == null) {
                Error("Please select Order Taker");
                return;
            }
            $('#hfServiceType').val($("#hfServiceChargesType").val());
            if (HolderOrderClicke == 1) {
                return;
            }
            HolderOrderClicke = 1;
        }
        if (($("#lnkDelivery").attr("class")) == "box active") {
            $('#hfServiceType').val($("#hfDELIVERY_CHARGES_TYPE").val());
            ServiceChargesType = document.getElementById("hfDELIVERY_CHARGES_TYPE").value;
            customerid = $("#hfCustomerId").val();
            if ($("#ddlOrderBooker").val() == null) {
                Error("Please select Delivery Man");
                return;
            }
            if (($("#hfCustomerId").val() == "0")) {
                Error("Please select customer");
                document.getElementById('divCustomer').style.visibility = 'visible';
                $('#txtCustomerSearch').focus();
                return;
            }
        }

        var table = document.getElementById('tble-ordered-products');
        if (table.rows.length == 0) {
            Error("Please enter Items");
            return;
        }
        var salesTax = 0;
        var subtotal = 0;
        var ItemWiseGST = 0;
        var itemdiscount = 0;
        $('#tble-ordered-products tr').each(function (row, tr) {
            if (parseFloat($(tr).find("td:eq(23)").text()) == 0) {
                if (checkVoid($(tr).find('td:eq(15)').text())) {
                    subtotal += parseFloat($(tr).find("td:eq(8)").text());
                    ItemWiseGST += parseFloat($(tr).find("td:eq(47)").text());
                    itemdiscount += parseFloat($(tr).find("td:eq(7)").text());
                }
            }
        });

        if ($('#hfItemWiseGST').val() == "1") {
            salesTax = ItemWiseGST;
        }
        else {
            salesTax = document.getElementById("hfSalesTax").value;
            if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only                
                salesTax = (parseFloat(salesTax) / 100) * (parseFloat(subtotal) + parseFloat(itemdiscount));
            }
            else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
                salesTax = parseFloat(salesTax) / 100 * parseFloat(subtotal);
            }
            else {//On Gross - Discount
                salesTax = (parseFloat(salesTax) / 100) * parseFloat(subtotal);
            }
        }        
        if (salesTax == "") {
            salesTax = 0;
        }
        document.getElementById("lblGSTTotal").innerHTML = Math.round(salesTax, 0);

        var me = $(this);
        //e.preventDefault();

        if (me.data('requestRunning')) {
            return;
        }

        me.data('requestRunning', true);
        $("#dvHold").attr("disabled", true);

        // var Id = $('select#ddlOrderBooker option:selected').val();
        var e = document.getElementById("ddlOrderBooker");
        var Id = e.options[e.selectedIndex].value;

        var ChannelValue = 0;
        try {
            ChannelValue = $("#hfDeliveryChannel").val();
        } catch (ex) {
            ChannelValue = 0;
        }

        $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/HoldOrder", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), orderBooker: Id, coverTable: $('#txtCoverTable').val(), customerType: document.getElementById("hfCustomerType").value, CustomerName: customerid, maxOrderNo: $("#MaxOrderNo").text(), printType: document.getElementById("hfBookingType").value, tableName: $("#hfTableNo").val(), takeAwayCustomer: $("#txtTakeawayCustomer").val(), bookerName: $('select#ddlOrderBooker option:selected').text(), tabId: $("#hfTableId").val(), CustomerNo: document.getElementById("hfCustomerNo").value, VoidBy: $('#hfVoidBy').val(), manualOrderNo: $("#txtManualOrderNo").val(), remarks: $("#txtRemarks").val(), Gst: $("#lblGSTTotal").text(), delChannel: ChannelValue, serviceCharges: ServiceChargesType, AdvanceAmount: $('#hfCustomerAdvanceAmount').val(), IsItemChanged: $('#hfIsNewItemAdded').val() }),
                    success: OrderSaved,
                    error: OnError,
                    complete: function () {
                        $("#dvHold").attr("disabled", false);
                        me.data('requestRunning', false);

                    }
                });
    }
}

function UniqueSection(products) {
    var IsCentralizedOrder = false;
    var sNO = 0;
    var sNoCancel = 0;
    var sNoLess = 0;
    var arr = [];
    var orderedProducts = products;
    orderedProducts = eval(orderedProducts);
    orderedProducts = orderedProducts.sort(sort_by('C1', false, parseFloat));

    var uniqueSections = $.unique(orderedProducts.map(function (d) { return d.SEC_ID; }));
    uniqueSections = uniqueSections.sort();
    uniqueSections = unique(uniqueSections);
    //New Order
    $("#OrderprintType").text('');
    $("#divLess").css("display", "none");
    $("#divCancel").css("display", "none");
    $("#divAdd").css("display", "none");
    $("#divDuplicate").css("display", "none");
    $("#tblCancelItem").css("display", "none");
    $("#tblLessItem").css("display", "none");
    $("#tblAddItem").css("display", "none");
    if (parseInt(orderedProducts[0].Seconds) < 2 || IsNewDeliveryOrder == 1) {
        for (var j = 0; j < uniqueSections.length; j++) {
            var arrDealIDs = [];
            $('#detail-section-skusCancel').empty();
            $('#detail-section-skus').empty(); // clear all skus  from invoice                
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                    $("#tblAddItem").css("display", "block");
                    var qty = orderedProducts[i].QTY;
                    $("#SectionName").text(orderedProducts[i].SECTION);
                    $("#lblOrderNotes2").text(products[0].REMARKS);
                    $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                    if ($("#hfEatIn").val() == "1") {
                        $("#TableNo").text("");
                    }
                    else {
                        $("#TableNo").text("TABLE NO : " + orderedProducts[i].TableDefination_No);
                    }
                    $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                    if ($("#hfCustomerType").val() == "Takeaway") {
                        $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                    }
                    else if ($("#hfCustomerType").val() == "Delivery") {
                        if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("CUSOTMER :" + orderedProducts[i].TableDefination_No + " " + document.getElementById('hfCustomerNo').value);
                        }
                        $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                    }
                    $("#Date").text($("#hfCurrentWorkDate").val());
                    $("#Time").text(moment().format('hh:mm A'));
                    if ($("#txtManualOrderNo").val() != "") {
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                    }
                    else {
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                    }
                    if (orderedProducts[i].I_D_ID == 0) {
                        if (orderedProducts[i].MODIFIER === false) {
                            var mod = '';
                            if (orderedProducts[i].IS_HasMODIFIER) {
                                var HasMod = 0;
                                for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                    if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                        if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                            mod = mod + '<br>' + Modifierparent[k].ItemName + ' - ' + Modifierparent[k].Qty;
                                            HasMod = 1;
                                        }
                                    }
                                }
                                if (HasMod == 0) {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                                else {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + mod + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                            }
                            else {
                                sNO = sNO + 1;
                                var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                $('#detail-section-skus').append(row);
                            }
                        }
                    }
                    else {
                        var uniqueDeal = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
                        uniqueDeal = uniqueDeal.sort();
                        uniqueDeal = unique(uniqueDeal);

                        for (var jj = 0; jj < uniqueDeal.length; jj++) {
                            if (uniqueDeal[jj] != 0) {
                                if (!orderedProducts[i].VOID) {
                                    if (uniqueDeal[jj] == orderedProducts[i].I_D_ID) {
                                        var boolDeal = true;
                                        for (var arriDeal = 0; arriDeal < arrDealIDs.length; arriDeal++) {
                                            if (arrDealIDs[arriDeal] == uniqueDeal[jj]) {
                                                boolDeal = false;
                                                break;
                                            }
                                        }
                                        if (boolDeal) {
                                            var row = $('<tr ><td></td><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                            $('#detail-section-skus').append(row);
                                            arrDealIDs.push(uniqueDeal[jj]);
                                        }
                                    }
                                }
                            }
                        }
                        if (orderedProducts[i].MODIFIER === false) {
                            var mod = '';
                            if (orderedProducts[i].IS_HasMODIFIER) {
                                var HasMod = 0;
                                for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                    if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                        if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                            mod = mod + '<br>' + Modifierparent[k].ItemName + ' - ' + Modifierparent[k].Qty;
                                            HasMod = 1;
                                        }
                                    }
                                }
                                if (HasMod == 0) {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                                else {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + mod + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                            }
                            else {
                                sNO = sNO + 1;
                                var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                $('#detail-section-skus').append(row);
                            }
                        }
                    }
                }
            }
            sortTableKOT();
            if ($("#detail-section-skus tr").length > 0) {
                document.getElementById("trLocationName").style.display = "none";
                if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                    $("#LocationName").text(document.getElementById("hfLocationName").value);
                    document.getElementById("trLocationName").style.display = "block";
                }
                PrintInvoiceOfSection();
            }
        }
    }
        //Running Order
    else {
        $("#OrderprintType").text('');
        $("#divLess").css("display", "none");
        $("#divCancel").css("display", "none");
        $("#divAdd").css("display", "none");
        $("#divDuplicate").css("display", "none");
        $("#tblCancelItem").css("display", "none");
        $("#tblLessItem").css("display", "none");
        $("#tblAddItem").css("display", "none");
        //Cancel Item
        for (var j = 0; j < uniqueSections.length; j++) {
            $('#detail-section-skus').empty(); // clear all skus  from invoice  
            $('#detail-section-skusCancel').empty();
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                    //Cancel Item
                    if (orderedProducts[i].VOID) {
                        $("#OrderprintType").text('Running Order...');
                        $("#divCancel").html('<br><hr>CANCELED ITEM<br><hr>');
                        $("#tblCancelItem").css("display", "block");
                        $("#divCancel").css("display", "block");
                        var qty = orderedProducts[i].QTY;
                        $("#SectionName").text(orderedProducts[i].SECTION);
                        $("#lblOrderNotes2").text(products[0].REMARKS);
                        $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                        if ($("#hfEatIn").val() == "1") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("TABLE NO : " + orderedProducts[i].TableDefination_No);
                        }
                        $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                        if ($("#hfCustomerType").val() == "Takeaway") {
                            $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                        }
                        else if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + orderedProducts[i].TableDefination_No + " " + document.getElementById('hfCustomerNo').value);
                            }
                            $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                        }
                        $("#Date").text($("#hfCurrentWorkDate").val());
                        $("#Time").text(moment().format('hh:mm A'));
                        if ($("#txtManualOrderNo").val() != "") {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                        }
                        else {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                        }
                        var mod = '';
                        sNO = sNO + 1;
                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                        $('#detail-section-skusCancel').append(row);
                    }
                }
            }
            sortTableKOT();
            if ($("#detail-section-skus tr").length > 0 || $("#detail-section-skusCancel tr").length > 0) {
                document.getElementById("trLocationName").style.display = "none";
                if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                    $("#LocationName").text(document.getElementById("hfLocationName").value);
                    document.getElementById("trLocationName").style.display = "block";
                }
                PrintInvoiceOfSection();
            }
        }
        $("#OrderprintType").text('');
        $("#divLess").css("display", "none");
        $("#divCancel").css("display", "none");
        $("#divAdd").css("display", "none");
        $("#divDuplicate").css("display", "none");
        $("#tblCancelItem").css("display", "none");
        $("#tblLessItem").css("display", "none");
        $("#tblAddItem").css("display", "none");
        //Add Item
        for (var j = 0; j < uniqueSections.length; j++) {
            var arrDealIDs = [];
            $('#detail-section-skus').empty(); // clear all skus  from invoice  
            $('#detail-section-skusCancel').empty();
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                    //Add New Item
                    if (orderedProducts[i].QTY - orderedProducts[i].PRINT_QTY > 0 && orderedProducts[i].QtyAddLess == 0 && !orderedProducts[i].VOID) {
                        $("#OrderprintType").text('Running Order...');
                        $("#divAdd").html('<br><hr>ADD ITEM<br><hr>');
                        $("#tblAddItem").css("display", "block");
                        $("#divAdd").css("display", "block");
                        var qty = orderedProducts[i].QTY;
                        $("#SectionName").text(orderedProducts[i].SECTION);
                        $("#lblOrderNotes2").text(products[0].REMARKS);
                        $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                        if ($("#hfEatIn").val() == "1") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("TABLE NO : " + orderedProducts[i].TableDefination_No);
                        }
                        $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                        if ($("#hfCustomerType").val() == "Takeaway") {
                            $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                        }
                        else if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + orderedProducts[i].TableDefination_No + " " + document.getElementById('hfCustomerNo').value);
                            }
                            $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                        }
                        $("#Date").text($("#hfCurrentWorkDate").val());
                        $("#Time").text(moment().format('hh:mm A'));
                        if ($("#txtManualOrderNo").val() != "") {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                        }
                        else {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                        }
                        if (orderedProducts[i].I_D_ID == 0) {
                            if (orderedProducts[i].MODIFIER === false) {
                                var mod = '';
                                if (orderedProducts[i].IS_HasMODIFIER) {
                                    var HasMod = 0;
                                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                            if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                                mod = mod + '<br>' + Modifierparent[k].ItemName + ' - ' + Modifierparent[k].Qty;
                                                HasMod = 1;
                                            }
                                        }
                                    }
                                    if (HasMod == 0) {
                                        sNO = sNO + 1;
                                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                        $('#detail-section-skus').append(row);
                                    }
                                    else {
                                        sNO = sNO + 1;
                                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + mod + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                        $('#detail-section-skus').append(row);
                                    }
                                }
                                else {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                            }
                        }
                        else {
                            var uniqueDeal = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
                            uniqueDeal = uniqueDeal.sort();
                            uniqueDeal = unique(uniqueDeal);

                            for (var jj = 0; jj < uniqueDeal.length; jj++) {
                                if (uniqueDeal[jj] != 0) {
                                    if (!orderedProducts[i].VOID) {
                                        if (uniqueDeal[jj] == orderedProducts[i].I_D_ID) {
                                            var boolDeal = true;
                                            for (var arriDeal = 0; arriDeal < arrDealIDs.length; arriDeal++) {
                                                if (arrDealIDs[arriDeal] == uniqueDeal[jj]) {
                                                    boolDeal = false;
                                                    break;
                                                }
                                            }
                                            if (boolDeal) {
                                                var row = $('<tr ><td></td><td>' + orderedProducts[i].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[i].DEAL_QTY + '</td><td style="display:none">' + orderedProducts[i].SALE_INVOICE_DETAIL_ID + '</td></tr>');
                                                $('#detail-section-skus').append(row);
                                                arrDealIDs.push(uniqueDeal[jj]);
                                            }
                                        }
                                    }
                                }
                            }
                            if (orderedProducts[i].MODIFIER === false) {
                                var mod = '';
                                if (orderedProducts[i].IS_HasMODIFIER) {
                                    var HasMod = 0;
                                    for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                        if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                            if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                                mod = mod + '<br>' + Modifierparent[k].ItemName + ' - ' + Modifierparent[k].Qty;
                                                HasMod = 1;
                                            }
                                        }
                                    }
                                    if (HasMod == 0) {
                                        sNO = sNO + 1;
                                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                        $('#detail-section-skus').append(row);
                                    }
                                    else {
                                        sNO = sNO + 1;
                                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + mod + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                        $('#detail-section-skus').append(row);
                                    }
                                }
                                else {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                            }
                        }
                    }
                }
            }
            sortTableKOT();
            if ($("#detail-section-skus tr").length > 0 || $("#detail-section-skusCancel tr").length > 0) {
                document.getElementById("trLocationName").style.display = "none";
                if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                    $("#LocationName").text(document.getElementById("hfLocationName").value);
                    document.getElementById("trLocationName").style.display = "block";
                }
                PrintInvoiceOfSection();
            }
        }
        $("#OrderprintType").text('');
        $("#divLess").css("display", "none");
        $("#divCancel").css("display", "none");
        $("#divAdd").css("display", "none");
        $("#divDuplicate").css("display", "none");
        $("#tblCancelItem").css("display", "none");
        $("#tblLessItem").css("display", "none");
        $("#tblAddItem").css("display", "none");
        //Increase Qty
        for (var j = 0; j < uniqueSections.length; j++) {
            $('#detail-section-skus').empty(); // clear all skus  from invoice  
            $('#detail-section-skusCancel').empty();
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                    //Increase Item Qty
                    if (orderedProducts[i].QtyAddLess > 0 && orderedProducts[i].LessAddType == 2 && !orderedProducts[i].VOID) {
                        $("#OrderprintType").text('Running Order...');
                        $("#divAdd").html('<br><hr>ADD ITEM QTY<br><hr>');
                        $("#tblAddItem").css("display", "block");
                        $("#divAdd").css("display", "block");
                        var qty = orderedProducts[i].QtyAddLess;
                        $("#SectionName").text(orderedProducts[i].SECTION);
                        $("#lblOrderNotes2").text(products[0].REMARKS);
                        $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                        if ($("#hfEatIn").val() == "1") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("TABLE NO : " + orderedProducts[i].TableDefination_No);
                        }
                        $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                        if ($("#hfCustomerType").val() == "Takeaway") {
                            $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                        }
                        else if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + orderedProducts[i].TableDefination_No + " " + document.getElementById('hfCustomerNo').value);
                            }
                            $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                        }
                        $("#Date").text($("#hfCurrentWorkDate").val());
                        $("#Time").text(moment().format('hh:mm A'));
                        if ($("#txtManualOrderNo").val() != "") {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                        }
                        else {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                        }
                        if (orderedProducts[i].MODIFIER === false) {
                            var mod = '';
                            if (orderedProducts[i].IS_HasMODIFIER) {
                                var HasMod = 0;
                                for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                    if (orderedProducts[i].SKU_ID === Modifierparent[k].ParentID && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                        if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                            mod = mod + '<br>' + Modifierparent[k].ItemName + ' - ' + Modifierparent[k].Qty;
                                            HasMod = 1;
                                        }
                                    }
                                }
                                if (HasMod == 0) {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                                else {
                                    sNO = sNO + 1;
                                    var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + mod + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                    $('#detail-section-skus').append(row);
                                }
                            }
                            else {
                                sNO = sNO + 1;
                                var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                                $('#detail-section-skus').append(row);
                            }
                        }
                    }
                }
            }
            sortTableKOT();
            if ($("#detail-section-skus tr").length > 0 || $("#detail-section-skusCancel tr").length > 0) {
                document.getElementById("trLocationName").style.display = "none";
                if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                    $("#LocationName").text(document.getElementById("hfLocationName").value);
                    document.getElementById("trLocationName").style.display = "block";
                }
                PrintInvoiceOfSection();
            }
        }
        $("#OrderprintType").text('');
        $("#divLess").css("display", "none");
        $("#divCancel").css("display", "none");
        $("#divAdd").css("display", "none");
        $("#divDuplicate").css("display", "none");
        $("#tblCancelItem").css("display", "none");
        $("#tblLessItem").css("display", "none");
        $("#tblAddItem").css("display", "none");
        //Decrease Qty
        for (var j = 0; j < uniqueSections.length; j++) {
            $('#detail-section-skus').empty(); // clear all skus  from invoice  
            $('#detail-section-skusCancel').empty();
            for (var i = 0, len = orderedProducts.length; i < len; i++) {
                if (orderedProducts[i].SEC_ID == uniqueSections[j]) {
                    //Decrease Item Qty
                    if (orderedProducts[i].QtyAddLess > 0 && orderedProducts[i].LessAddType == 1 && !orderedProducts[i].VOID) {
                        $("#OrderprintType").text('Running Order...');
                        $("#divCancel").html('<br><hr>LESS ITEM QTY<br><hr>');
                        $("#tblCancelItem").css("display", "block");
                        $("#divCancel").css("display", "block");
                        var qty = orderedProducts[i].QtyAddLess;
                        $("#SectionName").text(orderedProducts[i].SECTION);
                        $("#lblOrderNotes2").text(products[0].REMARKS);
                        $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                        if ($("#hfEatIn").val() == "1") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("TABLE NO : " + orderedProducts[i].TableDefination_No);
                        }
                        $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                        if ($("#hfCustomerType").val() == "Takeaway") {
                            $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                        }
                        else if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + orderedProducts[i].TableDefination_No + " " + document.getElementById('hfCustomerNo').value);
                            }
                            $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                        }
                        $("#Date").text($("#hfCurrentWorkDate").val());
                        $("#Time").text(moment().format('hh:mm A'));
                        if ($("#txtManualOrderNo").val() != "") {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                        }
                        else {
                            $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                        }
                        var mod = '';
                        sNO = sNO + 1;
                        var row = $('<tr ><td style="vertical-align: top;">' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right" style="vertical-align: top;">' + parseFloat(qty) + '</td></tr>');
                        $('#detail-section-skusCancel').append(row);
                    }
                }
            }
            sortTableKOT();
            if ($("#detail-section-skus tr").length > 0 || $("#detail-section-skusCancel tr").length > 0) {
                document.getElementById("trLocationName").style.display = "none";
                if (document.getElementById("hfLocationNameOnKOT").value == "1") {
                    $("#LocationName").text(document.getElementById("hfLocationName").value);
                    document.getElementById("trLocationName").style.display = "block";
                }
                PrintInvoiceOfSection();
            }
        }
    }
    UnlockRecord();
    var tableData = storeTblValuesPrint(orderedProducts);
    tableData = JSON.stringify(tableData);
    UpdatePrintRecord(tableData);
    $("#txtManualOrderNo").val('');
    IsNewDeliveryOrder = 0;
}
function PrintFullKOT() {

    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);

    var sNO = 0;
    var sNoCancel = 0;
    var sNoLess = 0;
    $('#detail-section-skus').empty(); // clear all skus  from invoice
    $('#detail-section-skusCancel').empty();
    $('#detail-section-skusLess').empty();
    $("#OrderprintType").text('');
    $("#divCancel").html('');
    $("#divAdd").html('');
    $("#divLess").html('');
    $("#divDuplicate").html('');
    $("#divLess").css("display", "none");
    $("#divCancel").css("display", "none");
    $("#divAdd").css("display", "none");
    $("#divDuplicate").css("display", "none");
    $("#tblAddItem").css("display", "none");
    $("#tblCancelItem").css("display", "none");
    $("#tblLessItem").css("display", "none");

    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        if (orderedProducts[i].PRINT == "true") {
            var qty = orderedProducts[i].QTY - orderedProducts[i].PR_COUNT;
            var IS_VOID = orderedProducts[i].VOID;
            if (IS_VOID == "false") {
                if (qty > 0) {
                    $("#tblAddItem").css("display", "block");
                    if (orderedProducts[i].INVOICE_ID != 'N/A') {
                        if (parseFloat(orderedProducts[i].INVOICE_ID) > 0) {
                            if (IsNewDeliveryOrder == 0) {
                                $("#OrderprintType").text('Running Order...');
                                $("#divAdd").html('<hr>ADD ITEM<br><hr>');
                                $("#divAdd").css("display", "block");
                            }
                        }
                    }
                    $("#SectionName").text('Full KOT');
                    $("#lblOrderNotes2").text($("#txtRemarks").val());
                    $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                    $("#TableNo").text("TABLE NO : " + $("#hfTableNo").val());
                    $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                    if ($("#hfCustomerType").val() == "Takeaway") {
                        $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                    }
                    else if ($("#hfCustomerType").val() == "Delivery") {
                        if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                            $("#TableNo").text("");
                        }
                        else {
                            $("#TableNo").text("CUSOTMER :" + $("#hfTableNo").val() + " " + document.getElementById('hfCustomerNo').value);
                        }
                        $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                    }
                    $("#Date").text($("#hfCurrentWorkDate").val());
                    $("#Time").text(moment().format('hh:mm A'));
                    if ($("#txtManualOrderNo").val() != "") {
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                    }
                    else {
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                    }
                    sNO = sNO + 1;
                    var row = $('<tr ><td>' + sNO + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right">' + qty + '</td></tr>');
                    $('#detail-section-skus').append(row);
                }
                else if (qty < 0) {
                    if (orderedProducts[i].INVOICE_ID != 'N/A') {
                        if (parseFloat(orderedProducts[i].INVOICE_ID) > 0) {
                            if (IsNewDeliveryOrder == 0) {
                                $("#OrderprintType").text('Running Order...');
                                $("#tblLessItem").css("display", "block");
                                $("#divLess").html('<br><hr>LESS ITEM<br><hr>');
                                $("#divLess").css("display", "block");
                            }
                            $("#SectionName").text('Full KOT');
                            $("#lblOrderNotes2").text($("#txtRemarks").val());
                            $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                            $("#TableNo").text("TABLE NO : " + $("#hfTableNo").val());
                            $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                            if ($("#hfCustomerType").val() == "Takeaway") {
                                $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                            }
                            else if ($("#hfCustomerType").val() == "Delivery") {
                                if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                    $("#TableNo").text("");
                                }
                                else {
                                    $("#TableNo").text("CUSOTMER :" + $("#hfTableNo").val());
                                }
                                $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                            }
                            $("#Date").text($("#hfCurrentWorkDate").val());
                            $("#Time").text(moment().format('hh:mm A'));
                            if ($("#txtManualOrderNo").val() != "") {
                                $("#PrintMaxOrderNo").text($("#MaxOrderNo").text() + "-" + $("#txtManualOrderNo").val());
                            }
                            else {
                                $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                            }
                            sNoLess = sNoLess + 1;
                            var row = $('<tr ><td>' + sNoLess + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td></tr>');
                            $('#detail-section-skusLess').append(row);
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].INVOICE_ID != 'N/A') {
                    if (parseFloat(orderedProducts[i].INVOICE_ID) > 0) {
                        if (IsNewDeliveryOrder == 0) {
                            $("#OrderprintType").text('Running Order...');
                            $("#divCancel").html('<br><hr>CANCELED ITEM<br><hr>');
                            $("#tblCancelItem").css("display", "block");
                            $("#divCancel").css("display", "block");
                        }
                        $("#SectionName").text('Full KOT');
                        $("#lblOrderNotes2").text($("#txtRemarks").val());
                        $("#CustoerType").text($("#hfCustomerType").val().toUpperCase());
                        $("#TableNo").text("TABLE NO : " + $("#hfTableNo").val());
                        $("#kitchenOrderTaker").text("O-T : " + $('select#ddlOrderBooker option:selected').text());
                        if ($("#hfCustomerType").val() == "Takeaway") {
                            $("#TableNo").text("CUSTOMER :" + $("#txtTakeawayCustomer").val());
                        }
                        else if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + $("#hfTableNo").val());
                            }
                            $("#kitchenOrderTaker").text("D-M :" + $('select#ddlOrderBooker option:selected').text());
                        }
                        $("#Date").text($("#hfCurrentWorkDate").val());
                        $("#Time").text(moment().format('hh:mm A'));
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                        sNoCancel = sNoCancel + 1;
                        var row = $('<tr ><td>' + sNoCancel + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right">' + orderedProducts[i].QTY + '</td></tr>');
                        $('#detail-section-skusCancel').append(row);
                    }
                }
            }
        }
    }
    if ($("#detail-section-skus tr").length > 0 || $("#detail-section-skusCancel tr").length > 0 || $("#detail-section-skusLess tr").length > 0) {
        document.getElementById("trLocationName").style.display = "none";
        if (document.getElementById("hfLocationNameOnKOT").value == "1") {
            $("#LocationName").text(document.getElementById("hfLocationName").value);
            document.getElementById("trLocationName").style.display = "block";
        }
        PrintInvoiceOfSection();
    }
    IsNewDeliveryOrder = 0;
}

function PrintInvoiceOfSection() {
    $("#hfDisable").val("0");
    $.print("#invoice-kitchen");
}

function SaveOrder() {
    var ServiceChargesType = document.getElementById("hfServiceChargesType").value;
    var Id = $('select#ddlOrderBooker option:selected').val();

    if (($("#lnkDelivery").attr("class")) == "box active") {
        ServiceChargesType = document.getElementById("hfDELIVERY_CHARGES_TYPE").value;
        if (Id == "") {
            Error("Please select Delivery Man");
            return;
        }

        if (($("#hfCustomerId").val() == "0")) {

            Error("Please select customer");

            return;
        }

    }
    if (CheckCatDealQty($("#hfDealId").val())) {
        $("#dvHold").attr("disabled", true);

        var ChannelValue = 1;
        try {
            ChannelValue = $("#hfDeliveryChannel").val();
        } catch (ex) {
            ChannelValue = 1;
        }

        $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/HoldOrder", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",

                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), orderBooker: Id, coverTable: $('#txtCoverTable').val(), customerType: document.getElementById("hfCustomerType").value, CustomerName: document.getElementById("hfCustomerId").value, maxOrderNo: $("#MaxOrderNo").text(), printType: document.getElementById("hfBookingType").value, tableName: $("#hfTableNo").val(), takeAwayCustomer: $("#txtTakeawayCustomer").val(), bookerName: $('select#ddlOrderBooker option:selected').text(), tabId: $("#hfTableId").val(), CustomerNo: document.getElementById("hfCustomerNo").value, VoidBy: $('#hfVoidBy').val(), manualOrderNo: $("#txtManualOrderNo").val(), remarks: $("#txtRemarks").val(), Gst: '0', delChannel: ChannelValue, serviceCharges: ServiceChargesType, AdvanceAmount: 0, IsItemChanged: $('#hfIsNewItemAdded').val() }),
                    success: function () {
                        //this case use for Delivery bcz when table is empty order saved function (unique Section) was not working 
                        if ($("#tble-ordered-products tr").length > 0) {//When Table is not empty for Delivery  else load tables
                            OrderSaved();
                        }
                        else {
                            GetPendingBills();
                        }
                    },
                    error: OnError,
                    complete: function () {
                        $("#dvHold").attr("disabled", false);
                    }

                }
            );
    }
}

function OrderSaved(dtStock) {
    dtStock = JSON.stringify(dtStock);
    var result = jQuery.parseJSON(dtStock.replace(/&quot;/g, '"'));
    dtStock = eval(result.d);
    if (dtStock.length > 0) {
        if (dtStock[0].SKU_NAME !== 'InvoiceID') {
            HolderOrderClicke = 0;
            Error(dtStock[0].SKU_NAME + ' has ' + dtStock[0].Stock + ' Stock');
            return;
        }
        if (dtStock[0].OrderNO !== 0) {
            $("#MaxOrderNo").text(dtStock[0].OrderNO);
        }
        if (dtStock[0].SKU_NAME == 'TableID') {
            Error('This table already taken.');
            return;
        }
    }

    if (document.getElementById("hfBookingType").value == "0") {//For Kitchen dialog not print

        var IsKOTPrint = 0;
        if (document.getElementById("hfCustomerType").value == "Takeaway") {
            if (document.getElementById("hfPrintKOTTakeaway").value == "True") {//Is KOT Print On Takeaway
                IsKOTPrint = 1;
            }
        }
        else if (document.getElementById("hfCustomerType").value == "Delivery") {
            if (document.getElementById("hfPrintKOTDelivery").value == "True") {//Is KOT Print On Delivery
                IsKOTPrint = 1;
            }
        }

        else if (document.getElementById("hfCustomerType").value == "Dine In") {
            if (document.getElementById("hfPrintKOT").value == "True") {//Is KOT Print On DineIn
                IsKOTPrint = 1;
            }
        }

        if (IsKOTPrint == 1) {
            GetPendingBill3(dtStock[0].Stock);
            if (document.getElementById("hfIsFullKOT").value == "1") {
                PrintFullKOT();
            }
        }
    }
    if (document.getElementById("hfCustomerType").value == "Takeaway" || (document.getElementById("hfCustomerType").value == "Dine In") && $("#hfEatIn").val() == "1") {
        GetPendingBills();
        LoadLastBill2(dtStock[0].Stock);
        $('#hfInvoiceId').val(dtStock[0].Stock);        
    }
    else {
        ClearOrder();
    }
}

function Error(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Error', 'type': 'error' });
}

function Succes(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Success', 'type': 'information' });
}

function OnError(xhr, errorType, exception) {

    var responseText;

    try {
        responseText = jQuery.parseJSON(xhr.responseText);
        $.Zebra_Dialog(responseText.Message, { 'title': 'Error', 'type': 'error' });

    } catch (e) {
        responseText = xhr.responseText;
        $.Zebra_Dialog(responseText, { 'title': 'Error', 'type': 'error' });
    }

}
// #endregion HoldOrder

//----------------on Payment Type  button Click---------------------------------\\
function PayType(myPayType) {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('select#ddlBankDiscount option:selected').val().length > 0 && $('#hfPaymentType').val() == "1") {
        return;
    }
    document.getElementById('ddlBank').style.display = "none";
    document.getElementById('txtCardNo').style.display = "none";
    document.getElementById('txtCreditCardNo').style.display = "none";
    document.getElementById('txtCreditCardAccountTile').style.display = "none";
    document.getElementById('txtCashRecieved').disabled = false;
    document.getElementById("cash").style["background-color"] = "#919399";
    document.getElementById("credit").style["background-color"] = "#919399";
    document.getElementById("btnCredit").style["background-color"] = "#919399";
    document.getElementById("btnEasypaisa").style["background-color"] = "#919399";
    document.getElementById("btnJazzcash").style["background-color"] = "#919399";
    document.getElementById("btnOnlineTransfer").style["background-color"] = "#919399";
    myPayType.style["background-color"] = "#7dab49";

    var currentValue = myPayType.value;
    $('#hfPaymentType').val(currentValue);
    $('#hfPaymentType2').val(currentValue);
    CalculateBalance();
    if ($('#hfPaymentType').val() == "0") {
        $('#txtCashRecieved').val($('#lblPaymentDue').text());
    }
    else if ($('#hfPaymentType').val() == "2" || $('#hfPaymentType').val() == "1") {
        document.getElementById('txtCashRecieved').disabled = true;
    }
    else {
        document.getElementById('ddlBank').style.display = "table-row";
        document.getElementById('txtCardNo').style.display = "table-row";
        document.getElementById('txtCreditCardNo').style.display = "table-row";
        document.getElementById('txtCreditCardAccountTile').style.display = "table-row";
        $('#txtCashRecieved').val(0);
    }
    document.getElementById("percentage").style["background-color"] = "#919399";    
    document.getElementById("dvBankDiscount").setAttribute("style", "display:none;");
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType').val() == "1") {
        document.getElementById("txtDiscount2").value = "";
        document.getElementById("dvBankDiscount").setAttribute("style", "display:block;");
        $('#ddlBankDiscount').change();
    }
}
function PayType2(myPayType) {
    document.getElementById('txtCashRecieved').disabled = false;
    document.getElementById("cash2").style["background-color"] = "#919399";
    document.getElementById("credit2").style["background-color"] = "#919399";
    document.getElementById("btnCredit2").style["background-color"] = "#919399";
    document.getElementById("btnEasypaisa2").style["background-color"] = "#919399";
    document.getElementById("btnJazzcash2").style["background-color"] = "#919399";
    document.getElementById("btnOnlineTransfer2").style["background-color"] = "#919399";
    myPayType.style["background-color"] = "#7dab49";
    var currentValue = myPayType.value;
    $('#hfPaymentType').val(currentValue);
    $('#hfPaymentType2').val(currentValue);
    if ($('#hfPaymentType2').val() == "2" || $('#hfPaymentType2').val() == "1") {
        document.getElementById('txtCashRecieved').disabled = true;
    }

    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("dvBankDiscount2").setAttribute("style", "display:none;");
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType2').val() == "1") {
        document.getElementById("txtDiscount2").value = "";
        document.getElementById("dvBankDiscount2").setAttribute("style", "display:block;");
        document.getElementById("dvBankDiscount").setAttribute("style", "display:block;");
        $('#ddlBankDiscount2').change();
        $('#ddlBankDiscount').change();
    }
    CalculateBalance2();
}
$('#btnVoid').click(function (e) {        
    $('#VoidValidation').show("slow");
});

$('#btnVoidTakeawayOrder').click(function (e) {
    var me = $(this);
    e.preventDefault();
    if (me.data('requestRunning')) {
        return;
    }
    me.data('requestRunning', true);
    $.ajax
            ({
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/VoidOrder", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ orderId: $("#OrderNo1").text(), VoidReasonID: $('select#ddlVoidReason option:selected').val() }),
                // success: ClearOnCancel,
                error: OnError,
                complete: function () {
                    $('#VoidValidation').hide("slow");
                    ClearOnCancel();
                    me.data('requestRunning', false);
                }
            });
});
$('#btnCancelTakeawayOrder').click(function (e) {
    $('#VoidValidation').hide("slow");
});
//----------------on Discount Type button Click---------------------------------\\
function DiscType(myDiscType) {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('select#ddlBankDiscount2 option:selected').val().length > 0 && $('#hfPaymentType2').val() == "1") {
        return;
    }
    document.getElementById("percentage").style["background-color"] = "#919399";
    document.getElementById("value").style["background-color"] = "#919399";

    //---on print invoice popup
    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("value2").style["background-color"] = "#919399";
    //-----------------------------------------------------------------------\\
    myDiscType.style["background-color"] = "#7dab49";
    var currentValue = myDiscType.value;
    document.getElementById('txtDiscount').disabled = false;
    document.getElementById('txtDiscount2').disabled = false;
    document.getElementById('txtDiscountReason2').disabled = false;
    $('#hfDiscountType').val(currentValue);
    if (myDiscType.id == 'percentage2' || myDiscType.id == 'value2') {

        CalculateBalance2();
    }
    else {

        CalculateBalance();
    }
}
function DiscType2(myDiscType) {
    document.getElementById("value").style["background-color"] = "#919399";
    document.getElementById("value2").style["background-color"] = "#919399";
    document.getElementById("percentage2").style["background-color"] = "#7dab49";
    document.getElementById("percentage").style["background-color"] = "#7dab49";
    var currentValue = myDiscType.value;
    document.getElementById('txtDiscount').disabled = true;
    document.getElementById('txtDiscount2').disabled = true;
    document.getElementById('txtDiscountReason2').disabled = true;
    $('#hfDiscountType').val(currentValue);
    CalculateBalance2();
}
function DiscTypeService(myDiscType) {

    document.getElementById("percentageService").style["background-color"] = "#919399";
    document.getElementById("valueService").style["background-color"] = "#919399";

    myDiscType.style["background-color"] = "#7dab49";

    $('#hfServiceType').val(myDiscType.value);

    CalculateServiceChages();
}
function DiscTypeServicePayment(myDiscType) {

    document.getElementById("percentageServicePayment").style["background-color"] = "#919399";
    document.getElementById("valueServicePayment").style["background-color"] = "#919399";

    myDiscType.style["background-color"] = "#7dab49";

    $('#hfServiceType').val(myDiscType.value);

    CalculateServiceChagesPayment();
}
function CalculateServiceChages() {
    var grandTotal = $("#GrandTotal2").text();
    var discountTotal = $("#lblDiscountTotal2").text();
    var gstTotal = $("#lblGSTTotal2").text();
    var serviceCharges = document.getElementById('txtService2').value;
    if (serviceCharges == "" || serviceCharges == "NaN" || document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($("#hfServiceChargesOnTakeaway").val() == "0") {
            serviceCharges = 0;
        }
    }
    if ($('#hfServiceType').val() == "0") {
        if (document.getElementById("hfServiceChargesCalculation").value == "1") {// On Gross Only
            var service = Math.round(grandTotal * serviceCharges / 100, 0);
            $("#lblServiceChargesTotal").text(parseFloat(service).toFixed(0));
        }
        else //document.getElementById("hfServiceChargesCalculation").value == "2" On Gross - Disocunt
        {
            var service = Math.round((parseFloat(grandTotal) - parseFloat($("#lblDiscountTotal2").text())) * serviceCharges / 100, 0);
            $("#lblServiceChargesTotal").text(parseFloat(service).toFixed(0));
        }
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + service), 0));
        }
        else {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + service), 0));
        }
    }
    else {
        $("#lblServiceChargesTotal").text(serviceCharges);
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(serviceCharges)), 0));
        }
        else {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + parseFloat(serviceCharges)), 0));
        }
    }
}
function CalculateServiceChagesPayment() {
    var grandTotal = $("#GrandTotal").text();
    var discountTotal = $("#lblDiscountTotal").text();
    var gstTotal = $("#lblGSTTotal").text();
    var serviceCharges = document.getElementById('txtService').value;
    if (serviceCharges == "" || document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($("#hfServiceChargesOnTakeaway").val() == "0") {
            serviceCharges = 0;
        }
    }
    if ($('#hfServiceType').val() == "0") {
        if (document.getElementById("hfServiceChargesCalculation").value == "1") {// On Gross Only
            var service = Math.round(grandTotal * serviceCharges / 100, 0);
            $("#lblServiceChargesTotalPayment").text(parseFloat(service).toFixed(0));
            if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
                $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + service), 0));
            }
            else {
                $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + service), 0));
            }
        }
        else //document.getElementById("hfServiceChargesCalculation").value == "2" On Gross - Disocunt
        {
            var service = Math.round((parseFloat(grandTotal) - parseFloat($("#lblDiscountTotal").text())) * serviceCharges / 100, 0);
            $("#lblServiceChargesTotalPayment").text(parseFloat(service).toFixed(0));
            if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
                $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + service), 0));
            }
            else {
                $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + service), 0));
            }
        }        
    }
    else {
        $("#lblServiceChargesTotalPayment").text(serviceCharges);
        if ($("#hfBillFormat").val() === "3" || $("#hfBillFormat").val() === "4") {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(serviceCharges)), 0));
        }
        else {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + parseFloat(serviceCharges)), 0));
        }
    }
    if ($('#hfPaymentType').val() === "0") {
        if ($('#txtCashRecieved').val() != "") {
            $('#txtCashRecieved').val($("#lblPaymentDue").text());
        }
    }
    else {
        $('#txtCashRecieved').val('0');
    }
}
//-----------------Calcualte on discount and cash Recd on Payment Click PopUp----\\ 

function CalculateBalance() {
    var balance = 0;
    var amountDue = 0;
    var discount = 0;
    var itemdiscount = 0;
    var gst = 0;
    var servicecharges = 0;
    var ItemWiseGST = 0;
    discount = document.getElementById('txtDiscount').value;

    $('#tble-ordered-products tr').each(function (row, tr) {
        if (parseFloat($(tr).find("td:eq(23)").text()) == 0) {
            if (checkVoid($(tr).find('td:eq(15)').text())) {
                itemdiscount += parseFloat($(tr).find("td:eq(7)").text());
                ItemWiseGST += parseFloat($(tr).find("td:eq(47)").text());
            }
        }
    });

    var discountType = $('#hfDiscountType').val(); //  document.getElementById("hfDiscountType").value;
    var cashRcd = 0;

    cashRcd = document.getElementById('txtCashRecieved').value;

    var grandTotal = 0;
    grandTotal = $("#GrandTotal").text();

    if (document.getElementById('hfIsGSTVoid').value == '0') {
        if ($('#hfPaymentType').val() == "0" || $('#hfPaymentType').val() == "2") {
            gst = document.getElementById("hfSalesTax").value;
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
            if (parseInt($('#hfPaymentType').val()) > 2) {
                var lstPaymentModes = document.getElementById("hfPaymentModes").value;
                if (lstPaymentModes !== "") {
                    PaymentModes = JSON.parse(lstPaymentModes);
                    for (var i = 0; i < PaymentModes.length; i++) {
                        if (PaymentModes[i].POSID == parseInt($('#hfPaymentType').val())) {
                            salesTax = PaymentModes[i].Tax;
                            break;
                        }
                    }
                }
            }
        }
    }
    servicecharges = $("#lblServiceChargesTotalPayment").text();

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
    if (servicecharges == "" || servicecharges == 'NaN') {
        servicecharges = 0;
    }
    if (discountType == 0) {
        discount = parseFloat(grandTotal) * parseFloat(discount / 100);
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat(grandTotal);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + parseFloat(gst)), 0);
        amountDue = Math.round(balance, 0);
        balance = cashRcd - balance;
    }
    else if (discountType == 1) {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat(grandTotal);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(balance, 0);
        balance = Math.round((cashRcd - balance), 0);
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat(grandTotal);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(gst) + parseFloat(servicecharges);
        amountDue = parseFloat(balance) - (parseFloat(discount) + parseFloat(itemdiscount));
        balance = Math.round((cashRcd - amountDue), 0);
    }

    if ($('#hfItemWiseGST').val() == "1") {
        gst = ItemWiseGST;
        balance = parseFloat(grandTotal) + parseFloat(gst) + parseFloat(servicecharges);
        amountDue = parseFloat(balance) - (parseFloat(discount) + parseFloat(itemdiscount));
        balance = Math.round((cashRcd - amountDue), 0);
    }

    if (cashRcd == 0) {
        balance = 0;
    }

    $("#lblDiscountTotal").text((parseFloat(discount) + parseFloat(itemdiscount)).toFixed(0));
    $("#lblGSTTotal").text(parseFloat(gst).toFixed(0));
    $("#lblBalance").text(parseFloat(0).toFixed(0));
    $("#lblPaymentDue").text(parseFloat(amountDue).toFixed(0));

    if ($('#hfPaymentType').val() == "0") {
        $('#txtCashRecieved').val($('#lblPaymentDue').text());
    }
    else {
        $('#txtCashRecieved').val(0);
    }
}
function CalculateBalance3() {
    var balance = 0;
    var amountDue = 0;
    var discount = 0;
    var itemdiscount = 0;
    var gst = 0;
    var servicecharges = 0;
    discount = document.getElementById('txtDiscount').value;

    $('#tble-ordered-products tr').each(function (row, tr) {
        if (parseFloat($(tr).find("td:eq(23)").text()) == 0) {
            if (checkVoid($(tr).find('td:eq(15)').text())) {
                itemdiscount += parseFloat($(tr).find("td:eq(7)").text());
            }
        }
    });

    var discountType = $('#hfDiscountType').val();
    var cashRcd = 0;
    cashRcd = document.getElementById('txtCashRecieved').value;
    var grandTotal = 0;
    grandTotal = $("#GrandTotal").text();
    if (document.getElementById('hfIsGSTVoid').value == '0') {
        if ($('#hfPaymentType').val() == "0" || $('#hfPaymentType').val() == "2") {
            gst = document.getElementById("hfSalesTax").value;
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
            if (parseInt($('#hfPaymentType').val()) > 2) {
                var lstPaymentModes = document.getElementById("hfPaymentModes").value;
                if (lstPaymentModes !== "") {
                    PaymentModes = JSON.parse(lstPaymentModes);
                    for (var i = 0; i < PaymentModes.length; i++) {
                        if (PaymentModes[i].POSID == parseInt($('#hfPaymentType').val())) {
                            salesTax = PaymentModes[i].Tax;
                            break;
                        }
                    }
                }
            }
        }
    }
    servicecharges = $("#lblServiceChargesTotalPayment").text();
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
    if (servicecharges == "" || servicecharges == "NaN") {
        servicecharges = 0;
    }
    if (discountType == 0) {
        discount = parseFloat(grandTotal) * parseFloat(discount / 100);
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = Math.round((parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + parseFloat(gst)), 0);
        amountDue = Math.round(balance, 0);
        balance = cashRcd - balance;
    }
    else if (discountType == 1) {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(balance, 0);
        balance = Math.round((cashRcd - balance), 0);
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst);
        amountDue = parseFloat(balance) - (parseFloat(discount) + parseFloat(itemdiscount));
        balance = Math.round((cashRcd - amountDue), 0);
    }
    if (cashRcd == 0) {
        balance = 0;
    }
    $("#lblDiscountTotal").text((parseFloat(discount) + parseFloat(itemdiscount)).toFixed(0));
    $("#lblGSTTotal").text(parseFloat(gst).toFixed(0));
    $("#lblBalance").text(parseFloat(balance).toFixed(0));
    $("#lblPaymentDue").text(parseFloat(amountDue).toFixed(0));
}

function SaveInvoice(recordtype) {
    var EmpDiscount = 0;
    if ($('select#ddlDiscountType option:selected').val() === undefined || $('select#ddlDiscountType option:selected').val() === null || $('select#ddlDiscountType option:selected').val() === 'null' || $('select#ddlDiscountType option:selected').val() === '') {
        //Do nothing.
    }
    else {
        EmpDiscount = $('select#ddlDiscountType option:selected').val();
    }
    if (ValidateDiscount(EmpDiscount)) {
        //Payment Validation=====================
        if ($('#hfPaymentType').val() == '') {
            Error("First Select Payment Type");
            return;
        }
        if ($('#hfPaymentType').val() == '0' && parseFloat($('#lblPaymentDue').text()) > 0) {
            if (!($("#hfCustomerType").val() === "Delivery" && $('#hfDeliveryChannelType').val() !== "0")) {
                if ($('#txtCashRecieved').val() == '') {
                    Error("Plz enter Amount");
                    return;
                }
                if ($('#txtCashRecieved').val() == '0') {
                    Error("Amount should be greater than zero");
                    return;
                }
                if (parseFloat($('#txtCashRecieved').val()) < parseFloat($('#lblPaymentDue').text())) {
                    Error("Amount should be greater than due Payment");
                    return;
                }
            }
        }
        //=======================================

        var salesTax = document.getElementById("hfSalesTax").value;

        var ManagerId = 0;
        var EM_UserID = 0;
        if (EmpDiscount == "1") {
            try {
                EM_UserID = $('select#ddlDiscountUser option:selected').val();
            } catch (e) {
                EM_UserID = 0;
            }
            if (EM_UserID == undefined) {
                EM_UserID = 0;
            }
            try {
                ManagerId = $('select#ddlDiscountUser2 option:selected').val();
            } catch (e) {
                ManagerId = 0;
            }
            if (ManagerId == undefined) {
                ManagerId = 0;
            }
        }

        if ($('#hfPaymentType').val() == '2') {
            if ($('select#ddlCustomer option:selected').val() === '0') {
                Error("Must select Customer");
                return;
            }
        }
        document.getElementById("btnSave").disabled = true;
        var custid = $('select#ddlCustomer option:selected').val();
        var bankID = 0;
        try {
            bankID = $('select#ddlBank option:selected').val();

        } catch (e) {
            bankID = 0;
        }
        if (bankID === undefined) {
            bankID = 0;
        }
        if (document.getElementById("hfCustomerType").value == "Delivery")
        {
            custid = $("#hfCustomerId").val();
        }

        var servicecharges = $('#lblServiceChargesTotalPayment').text();
        if (servicecharges == "" || servicecharges == "NaN")
        {
            servicecharges = 0;
        }

        var IsGstVoid = false;
        if ($('#hfIsGSTVoid').val() == '1') {
            IsGstVoid = true;
        }
        var customerAdvance = $('#hfCustomerAdvanceAmount').val();
        if (parseFloat($('#hfCustomerAdvanceAmount').val()) > parseFloat($("#lblPaymentDue").text())) {
            customerAdvance = $("#lblPaymentDue").text();
        }
        $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/InsertInvoice", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), Type: $('#hfCustomerType ').val(), amountDue: $("#hfAmountDue").val(), discount: $('#txtDiscount').val(), paidIn: $('#txtCashRecieved').val(), payType: $('#hfPaymentType').val(), Gst: $("#lblGSTTotal").text(), DiscType: $('#hfDiscountType').val(), gstPerAge: salesTax, Service: servicecharges, takeAwayCustomer: $("#txtTakeawayCustomer").val(), empDiscType: EmpDiscount, EMC_UserID: EM_UserID, Manager_UserID: ManagerId, PASSWORD: $('#hfManagerPassword').val(), customerID: custid, cardNo: $('#hfCardNo').val(), purchasing: $('#hfCardPurchasing').val(), manualOrderNo: $("#txtManualOrderNo").val(), remarks: $("#txtRemarks").val(), CustomerNo: document.getElementById("hfCustomerNo").value, netAmount: $("#lblPaymentDue").text(), chargestype: $('#hfServiceType').val(), BankID: bankID, IsGSTVoid: IsGstVoid, RecordType: recordtype, AdvanceAmount: customerAdvance, CreditCardNo: $('#txtCardNo').val() }),
                success: InvoiceSaved,
                error: OnError
            }
        );
    }
}

function InvoiceSaved(qrCodeAndItems) {

    var ItemList = JSON.stringify(qrCodeAndItems);
    var resultItem = jQuery.parseJSON(ItemList.replace(/&quot;/g, '"'));
    ItemList = eval(resultItem.d);
    if (document.getElementById("hfTaxAuthority").value !== '0' && document.getElementById("hfTaxAuthority").value !== '3') {
        var qrCode = eval(ItemList[0].strQRCode);
        var qrCodePRA = eval(ItemList[0].strQRCodePRA);
        if (ItemList[0].strQRCode != "") {
            if (document.getElementById("hfTaxAuthority").value == "2") {
                document.getElementById('imgQrCodePRA').src = 'data:image/png;base64,' + qrCode[0].QrString;
                document.getElementById("trQRImagePRA").style.display = "table-row";
                document.getElementById("imgpra").style.display = "block";
                document.getElementById("trFBRInvoicePRA").style.display = "table-row";
                $("#FBRInvoiceNoPRA").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].FBRInvoiceNumber);
            }
            else if (document.getElementById("hfTaxAuthority").value == "1") {
                document.getElementById('imgQrCodeFBR').src = 'data:image/png;base64,' + qrCode[0].QrString;
                document.getElementById("trQRImageFBR").style.display = "table-row";
                document.getElementById("imgfbr").style.display = "block";
                document.getElementById("trFBRInvoiceFBR").style.display = "table-row";
                $("#FBRInvoiceNoFBR").text($("#hfTaxInvoiceLable").val() + ': ' + qrCode[0].FBRInvoiceNumber);
            }
        }

        if (document.getElementById("hfTaxAuthority").value == "5") {
            if (ItemList[0].strQRCodePRA != "") {
                document.getElementById('imgQrCodePRA').src = 'data:image/png;base64,' + qrCodePRA[0].QrString;
                document.getElementById("trQRImagePRA").style.display = "table-row";
                document.getElementById("imgpra").style.display = "block";
                document.getElementById("trFBRInvoicePRA").style.display = "table-row";
                $("#FBRInvoiceNoPRA").text('PRA Invoice No: ' + qrCodePRA[0].FBRInvoiceNumber);
            }
            if (ItemList[0].strQRCode != "") {
                document.getElementById('imgQrCodeFBR').src = 'data:image/png;base64,' + qrCode[0].QrString;
                document.getElementById("trQRImageFBR").style.display = "table-row";
                document.getElementById("imgfbr").style.display = "block";
                document.getElementById("trFBRInvoiceFBR").style.display = "table-row";
                $("#FBRInvoiceNoFBR").text('FBR Invoice No: ' + qrCode[0].FBRInvoiceNumber);
            }
        }
    }
    PrintPaymentInvoice(ItemList);
    Clear();
    GetPendingBills();
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    UnlockRecord();
    $('#txtCustomerSMS').val('');
    $('#txtContactSMS').val('');
    $('#txtAddressSMS').val('');
}

function changeTableClass(btn) {
    var a, n;
    var a = document.getElementById("dv_lstTable").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#d4def7";
    }
    btn.style["background-color"] = "#53b4b5";

}

function changeClass(btn) {
    var a, n;
    a = document.getElementById("dv_lstCategory").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#d4def7";
    }
    btn.style["background-color"] = "#7DAB49";
}
function changeClassDc(btn) {
    var a, n;
    a = document.getElementById("dvDeliveryChannel").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#adadae";
    }
    btn.style["background-color"] = "#7DAB49";
    $("#hfDeliveryChannel").val(btn.id);
}
// #region Item Deletion

function UserValidationInDataBase(obj) {

    $("#hfVoidBy").val('');

    var UserId = document.getElementById('txtUserID').value;
    var UserPassword = document.getElementById('txtUserPass').value;
    var UserClick = document.getElementById('hfUserClick').value;

    //UserPassword.setAttribute('type', 'text');

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/ValidateUser", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ UserId: UserId, UserPass: UserPassword, UserClick: UserClick }),
                success: UserValidated,
                error: function () { Error("Authorization Failed!"); }
            }
        );
}

function UserValidated(UserAuth) {

    UserAuth = JSON.stringify(UserAuth);
    var result = jQuery.parseJSON(UserAuth.replace(/&quot;/g, '"'));
    UserAuth = eval(result.d);
    if (UserAuth != null) {
        if (UserAuth.length > 0) {
            $("#hfVoidBy").val(UserAuth[0].USER_ID);
            if ($("#hfUserClick").val() == "Decrease") {
                if (UserAuth[0].IsLessRight == true) {
                    $('#UserValidation').hide("slow");
                    IsUserValidationPopup = 0;
                    document.getElementById('txtUserID').value = "";
                    document.getElementById('txtUserPass').value = "";
                    $('#DecreaseConfirmation').show("slow");
                }
                else {
                    Error('This user Can not less Item!');
                }
            }
            else {
                if (UserAuth[0].IsDelRight == true) {
                    $('#UserValidation').hide("slow");
                    IsUserValidationPopup = 0;
                    document.getElementById('txtUserID').value = "";
                    document.getElementById('txtUserPass').value = "";
                    $('#DeletionConfirmation').show("slow");
                }
                else {
                    Error('This user can not delete Item!');
                }
            }
        }
        else {
            if ($("#hfUserClick").val() == "Decrease") {
                Error('This user Can not less Item!');
            }
            else {
                Error('This user can not delete Item!');
            }
        }
    }
    else {
        if ($("#hfUserClick").val() == "Decrease") {
            Error('This user Can not less Item!');
        }
        else {
            Error('This user can not delete Item!');
        }
    }
}

function CancelUserValidation() {
    $('#UserValidation').hide("slow");
    IsUserValidationPopup = 0;
    for (var i = 0, len = OldOrder.length; i < len; ++i) {
        $('#tble-ordered-products tr').each(function (row, tr) {
            if ($(tr).find('td:eq(0)').text() == OldOrder[i].SKU_ID.toString())
            $(tr).find('td:eq(4) input').val(OldOrder[i].QTY);            
        });
    }
}

function deleteItem(btn) {
    var rowIndex = $(btn).parent();
    if (checkVoid($(rowIndex).find('td:eq(15)').text())) {
        var Sku_id = $(rowIndex).find('td:eq(0)').text();
        var SkuType = $(rowIndex).find('td:eq(25)').text();//Check Hold or Not for new '' for already Hold 'H'
        var Cat_id = $(rowIndex).find('td:eq(16)').text();
        $("#hfskuId").val(Sku_id);
        $("#hfcatId").val(Cat_id);
        $("#hfDelIndex").val($(rowIndex).find('td:eq(14)').text());
        $("#lblReason").text('Cancel Reason');
        document.getElementById('ddlLessReason').style.display = "none";
        document.getElementById('ddlCancelReason').style.display = "block";
        if (SkuType == "") {
            deleteQty();
        }
        else {
            document.getElementById('txtUserID').value = "";
            document.getElementById('txtUserPass').value = "";
            $("#hfUserClick").val('Delete');
            $('#UserValidation').show("slow");
            IsUserValidationPopup = 1;
            $('#txtUserID').focus();
        }
    }
}

function deleteQty() {
    var Sku_Id = $("#hfskuId").val();
    var Cat_Id = $("#hfcatId").val();
    var C1 = $("#hfDelIndex").val();
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == Sku_Id && $(tr).find('td:eq(16)').text() == Cat_Id && $(tr).find('td:eq(14)').text() == C1) {
            $(tr).find('td:eq(15)').text(true);
            $(tr).find('td:eq(43)').text(0);
            $(tr).find('td:eq(9)').css('background-color', '#b20505');
            $(tr).find('td:eq(44)').text($('select#ddlCancelReason option:selected').val());
        }
    });
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
    $("#hfskuId").val('');
    $("#hfcatId").val('');
    $("#hfDelIndex").val('')
}

function DeletionProceed() {
    $('#DeletionConfirmation').hide("slow");
    deleteQty();
    $('#hfDisable').val("0");
}

function DeletionCancel() {
    $('#DeletionConfirmation').hide("slow");
    $("#hfskuId").val('');
    $("#hfcatId").val('');
    $("#hfUserClick").val('');
    $("#hfDelIndex").val('');

}

// #endregion Item Deletion

// #region Decrease Qty

function decreaseItem(btn) {

    var rowIndex = $(btn).parent();
    var Sku_id = $(rowIndex).find('td:eq(0)').text();
    var Cat_id = $(rowIndex).find('td:eq(16)').text();
    var SkuType = $(rowIndex).find('td:eq(25)').text();//Check Hold or Not for new '' and for already Hold 'H'

    var qty = $(rowIndex).find('td:eq(4) input').val();

    $("#lblReason").text('Less Reason');
    document.getElementById('ddlLessReason').style.display = "block";
    document.getElementById('ddlCancelReason').style.display = "none";

    if (qty > 1) {
        $("#hfskuId").val(Sku_id);
        $("#hfcatId").val(Cat_id);
        $("#hfDelId").val($(rowIndex).find('td:eq(22)').text());
        $("#hfDelIndex").val($(rowIndex).find('td:eq(14)').text());
        if (SkuType == "") {
            minusQty();
        }
        else {
            document.getElementById('txtUserID').value = "";
            document.getElementById('txtUserPass').value = "";
            $("#hfUserClick").val('Decrease');
            $('#UserValidation').show("slow");
            IsUserValidationPopup = 1;
            $('#txtUserID').focus();
        }
    }
}

function minusQty() {
    var Sku_Id = $("#hfskuId").val();
    var Cat_Id = $("#hfcatId").val();
    var Deal_Id = $("#hfDelId").val();
    var C1 = $("#hfDelIndex").val();
    var qty = 1;
    var nQty = 0;
    var discount2 = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == Sku_Id && $(tr).find('td:eq(16)').text() == Cat_Id && $(tr).find('td:eq(14)').text() == C1) {
            qty = $(tr).find('td:eq(4) input').val();
            if (Deal_Id != 0) {
                if (qty > parseFloat($(tr).find('td:eq(28)').text()) * parseFloat($(tr).find('td:eq(29)').text())) {
                    nQty = qty - 1;
                    discount2 = CalculatePromotion(parseInt(Sku_Id), nQty, parseFloat($(tr).find('td:eq(6)').text()));
                    $(tr).find('td:eq(4) input').val(nQty);
                    $(tr).find("td:eq(48)").text(parseFloat(discount2 * nQty));
                }
            }
            else {
                if (qty == "1") {

                } else {
                    nQty = qty - 1;
                    discount2 = CalculatePromotion(parseInt(Sku_Id), nQty, parseFloat($(tr).find('td:eq(6)').text()));
                    $(tr).find('td:eq(4) input').val(nQty);
                    $(tr).find("td:eq(48)").text(parseFloat(discount2 * nQty));
                }
            }
            var price = $(tr).find('td:eq(6)').text();
            var discount = 0;
            if ($(tr).find('td:eq(7)').text() =="")
            {
                discount = 0;
            }
            else {
                discount = $(tr).find('td:eq(7)').text();
            }
            var amount = parseFloat(nQty * price).toFixed(2) - parseFloat(discount).toFixed(2) - parseFloat(discount2).toFixed();
            $(tr).find('td:eq(8)').text(amount);
            $(tr).find('td:eq(44)').text($('select#ddlLessReason option:selected').val());
            $(tr).find('td:eq(47)').text(amount * parseFloat($(tr).find('td:eq(46)').text()) / 100);
            setTotals();
        }
    });
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;

    $("#hfskuId").val('');
    $("#hfcatId").val('');
    $("#hfDelId").val('');
    $("#hfDelIndex").val('');
}

function DecreaseProceed() {
    $('#DecreaseConfirmation').hide("slow");
    minusQty();
    $('#hfDisable').val("0");
}

function DecreaseCancel() {
    $('#DecreaseConfirmation').hide("slow");
    $("#hfskuId").val('');
    $("#hfcatId").val('');
    $("#hfUserClick").val('');
    $("#hfDelIndex").val('');
    $("#hfDelId").val('');

    for (var i = 0, len = OldOrder.length; i < len; ++i) {
        $('#tble-ordered-products tr').each(function (row, tr) {
            if ($(tr).find('td:eq(0)').text() == OldOrder[i].SKU_ID.toString())
                $(tr).find('td:eq(4) input').val(OldOrder[i].QTY);
        });
    }
}

// #endregion Decrease Qty

//------------------------on Print INvoice Click ---------------\\

//-------get Discount,Discount Type from dataBase on Bill selectoin and set on Print Invoice,Payment PopUp--\\

function isDisable(flag) {
    if (flag == 'true') {
        document.getElementById("percentage").disabled = true;
        document.getElementById("value").disabled = true;
    }
}

function isColored(flag) {
    if (flag == 'true') {

        document.getElementById("percentage2").style["background-color"] = "#7dab49";
        document.getElementById("percentage").style["background-color"] = "#7dab49";

        document.getElementById("value2").style["background-color"] = "#919399";
        document.getElementById("value").style["background-color"] = "#919399";
    }
    else {
        document.getElementById("value2").style["background-color"] = "#7dab49";
        document.getElementById("value").style["background-color"] = "#7dab49";

        document.getElementById("percentage2").style["background-color"] = "#919399";
        document.getElementById("percentage").style["background-color"] = "#919399";
    }
}

function calculateDiscount(discount,itemdiscount, amountDue) {

    $('#lblDiscountTotal').text('0');
    $("#lblDiscountTotal2").text('0');
    document.getElementById('txtDiscount').value = "";
    document.getElementById('txtDiscount2').value = "";
    document.getElementById('txtDiscountReason2').value = "";    
    var salesTax = 0;
        salesTax = document.getElementById("hfSalesTax").value;
    if (salesTax == "") {
        salesTax = 0;
    }
    var Total = Math.round(parseFloat(amountDue), 2);

    if (discount > 0 || itemdiscount>0) {
        document.getElementById('txtDiscount').value = discount;
        document.getElementById('txtDiscount2').value = discount;
        if ($('#hfDiscountType').val() == 0) {
            discount = Total * (discount / 100);
            $("#lblDiscountTotal2").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
            $("#lblDiscountTotal").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
            isColored('true');
        }
        else {
            $("#lblDiscountTotal2").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
            $("#lblDiscountTotal").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
            isColored('false');
        }
        document.getElementById('txtDiscount2').disabled = true;
        document.getElementById('txtDiscountReason2').disabled = true;
        if (document.getElementById("hfCustomerType").value == "Takeaway") {
            isDisable('false');
        }
        else {
            isDisable('true');
        }
        document.getElementById("lblGSTTotal").innerHTML = Math.round(salesTax);
        document.getElementById("lblGSTTotal2").innerHTML = Math.round(salesTax);
    }
    else {
        isDisable(false);
    }
}

//--------------------Calcualte on discount  on Print Invoice Click PopUp----\\ 
function CalculateBalance2() {
    var balance = 0;
    var amountDue = 0;
    var discount = 0;
    var itemdiscount=0;
    var ItemWiseGST = 0;
    discount = document.getElementById('txtDiscount2').value;

    $('#tble-ordered-products tr').each(function (row, tr) {
        if (parseFloat($(tr).find("td:eq(23)").text()) == 0) {
            if (checkVoid($(tr).find('td:eq(15)').text())) {
                itemdiscount += parseFloat($(tr).find("td:eq(7)").text());
                ItemWiseGST += parseFloat($(tr).find("td:eq(47)").text());
            }
        }
    });

    var discountType = $('#hfDiscountType').val();
    var grandTotal = $("#GrandTotal2").text();

    var gst = 0;
    if (document.getElementById('hfIsGSTVoid').value == '0') {
        if ($('#hfPaymentType2').val() == "0" || $('#hfPaymentType2').val() == "2") {
            gst = document.getElementById("hfSalesTax").value;
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
            if (parseInt($('#hfPaymentType').val()) > 2) {
                var lstPaymentModes = document.getElementById("hfPaymentModes").value;
                if (lstPaymentModes !== "") {
                    PaymentModes = JSON.parse(lstPaymentModes);
                    for (var i = 0; i < PaymentModes.length; i++) {
                        if (PaymentModes[i].POSID == parseInt($('#hfPaymentType').val())) {
                            salesTax = PaymentModes[i].Tax;
                            break;
                        }
                    }
                }
            }
        }
    }

    $("#lblBalance").text('');
    $("#lblPaymentDue").text('');

    if (discount == "") {
        discount = 0;
    }
    if (gst == "") {
        gst = 0;
    }
    if (discountType == 0) {

        discount = parseFloat(grandTotal) * parseFloat(discount) / 100;
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat(grandTotal);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            CalculateServiceChages();
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat($('#lblServiceChargesTotal').text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            CalculateServiceChages();
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat($('#lblServiceChargesTotal').text()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        amountDue = parseFloat(grandTotal) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(amountDue, 0);
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {
            gst = parseFloat(gst / 100) * parseFloat(grandTotal);
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {
            CalculateServiceChages();
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat($('#lblServiceChargesTotal').text()));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {
            CalculateServiceChages();
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) + parseFloat($('#lblServiceChargesTotal').text()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {
            gst = parseFloat(gst / 100) * (parseFloat(grandTotal) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        amountDue = parseFloat(grandTotal) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(amountDue, 0);
    }
    if ($('#hfItemWiseGST').val() == "1") {
        gst = ItemWiseGST;
        amountDue = parseFloat(grandTotal) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(amountDue, 0);
    }
    $("#lblPaymentDue2").text(Math.round(amountDue, 0));
    $("#lblDiscountTotal2").text(Math.round(parseFloat(discount) + parseFloat(itemdiscount), 0));
    $("#lblGSTTotal2").text(Math.round(gst, 0));
    CalculateServiceChages();
}

function UpdateOrder() {
    if (document.getElementById("hfDiscountAuthentication").value == '0') {
        $("#hfDiscountRemarks").val(document.getElementById('txtDiscountReason2').value);
    }
    var customerid = 0;
    var bankdiscountid = 0;
    try {
        customerid = $('select#ddlCustomer option:selected').val();

    } catch (e) {
        customerid = 0;
    }
    if (customerid === undefined) {
        customerid = 0;
    }

    try {
        bankdiscountid = $('select#ddlBankDiscount2 option:selected').val();

    } catch (e) {
        bankdiscountid = 0;
    }
    if (bankdiscountid === undefined) {
        bankdiscountid = 0;
    }

    var Id = $('select#ddlOrderBooker option:selected').val();
    if (($("#lnkDelivery").attr("class")) == "box active") {
        customerid = $("#hfCustomerId").val();
    }
    var EmpDiscount = 0;
    if ($('#hfDiscountType').val() === undefined || $('#hfDiscountType').val() === null || $('#hfDiscountType').val() === 'null' || $('#hfDiscountType').val() === '') {
        //Do nothing.
    }
    else {
        EmpDiscount = $('select#ddlDiscountType2 option:selected').val();
    }

    if (ValidateDiscount2(EmpDiscount)) {

        var salesTax = document.getElementById("hfSalesTax").value;
        var IsGstVoid = false;
        if ($('#hfIsGSTVoid').val() == '1')
        {
            IsGstVoid = true;
        }
        var sercharges = $('#txtService2').val();
        if (sercharges == "" || sercharges == "NaN" || document.getElementById("hfCustomerType").value == "Takeaway") {
            if ($("#hfServiceChargesOnTakeaway").val() == "0") {
                sercharges = 0;
            }
        }
        $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/UpdateOrder", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), amountDue: $("#GrandTotal2").text(), discount: $('#txtDiscount2').val(), Gst: $("#lblGSTTotal2").text(), DiscType: $('#hfDiscountType').val(), gstPerAge: salesTax, Service: sercharges, takeAwayCustomer: $("#txtTakeawayCustomer").val(), cardType: $('#hfCardTypeId').val(), cardNo: $("#txtLoyaltyCard2").val(), points: $("#hfCardPoints").val(), purchasing: $("#hfCardPurchasing").val(), customerID: customerid, manualOrderNo: $("#txtManualOrderNo").val(), remarks: $("#txtRemarks").val(), orderBookerId: Id, empDiscType: EmpDiscount, chargestype: $('#hfServiceType').val(), payType: $('#hfPaymentType2').val(), IsGSTVoid: IsGstVoid, DiscountRemarks: $("#hfDiscountRemarks").val(), BankDiscountID: bankdiscountid, CreditCardNo: $('#txtCreditCardNo2').val(), CreditCardAccountTile: $('#txtCreditCardAccountTile2').val(), AdvanceAmount: $('#hfCustomerAdvanceAmount').val() }),
                    success: invoiceSaved2,
                    error: OnError
                }
            );
    }
}

function invoiceSaved2(tblProducts) {
    tblProducts = JSON.stringify(tblProducts);
    var result = jQuery.parseJSON(tblProducts.replace(/&quot;/g, '"'));
    tblProducts = eval(result.d);

    if (document.getElementById("hfPrintInvoiceFromWS").value == "0") {
        if ($('#hfInvoiceFooterType').val() == '1') {
            PrintSaleInvoiceCashCreditCardBoth(tblProducts);
        }
        else {
            PrintSaleInvoice(tblProducts);
        }
    }
    Clear2();
    GetPendingBills();
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    UnlockRecord();
}

//----------------Can enter only numbers and decimal ---------------------------\\

function onlyNumbers(txt, event) {
    var charCode = (event.which) ? event.which : event.keyCode;

    if (charCode == 9 || charCode == 8) {
        return true;
    }
    if (charCode == 46) {
        return false;
    }
    if (charCode == 13) {
        if ($("#hfKeyBoadTextBoxID").val() == "txtCashRecieved") {
            event.preventDefault();
            $('.Custombtn23').click();
        }
        return true;
    }
    if (charCode == 31 || charCode < 48 || charCode > 57)
        return false;

    return true;
}

function onlyDotsAndNumbers(txt, event) {

    var charCode = (event.which) ? event.which : event.keyCode;

    if (charCode == 9 || charCode == 8) {
        return true;
    }
    if (charCode == 46) {
        if (txt.value.indexOf(".") < 0)
            return true;
        return false;
    }
    if (charCode == 31 || charCode < 48 || charCode > 57)
        return false;

    return true;
}

//------------------------------------------------------------------------------\\

//#region Time Calculation

function BillTime() {
    var refresh = 1000; // Refresh rate in milli seconds
    mytime = setTimeout('display_ct()', refresh);
    var PendingBillsSearch = '';
    var PendingTablessSearch = '';
    try {
        PendingBillsSearch = $('#txtPendingBills').val();
    } catch (e) {
        PendingBillsSearch = '';
    }
    if (PendingBillsSearch == undefined) {
        PendingBillsSearch = '';
    }
    if (PendingBillsSearch.length == 0) {
        GetPendingBills();
    }
    try {
        PendingTablessSearch = $('#txtVacantTable').val();
    } catch (e) {
        PendingTablessSearch = '';
    }
    if (PendingTablessSearch == undefined) {
        PendingTablessSearch = '';
    }
}

//--Used in BillTime();
function display_ct() {
    var strcount
    var d = new Date()

    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());

    document.getElementById('ct').innerHTML = h + ":" + m;
    tt = BillTime();
}

//--Used In display_ct();
function addZero(i) {//Used For Adding 0 Before Hour When Hour is Less than 10
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//--Used In GetPendingBills();
function diff(start, end) {//Get The updated Time For Hold Orders 
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

//#endregion Time Calculation
//#region Customer

//Called on page Load for Default ServiceType and on Button Click 
//obj2 used for Pageload 
function lnkCustomerType(obj, obj2) {
    $('#btnCancel').show();
    $("#lblCoverTable").text("Cover Table");
    if (IsUserValidationPopup == 1) {
        return;
    }
    var id = "";
    if (obj != null) {
        id = obj.id;
    }
    waitLoading('Loading');
    try {
        document.getElementById('dvCustomerLedger').style.display = 'block';
    } catch (e) {
    }

    $("#lnkDelivery").removeClass("active");
    $("#lnkTakeaway").removeClass("active"); 
    $("#lnkDineIn").removeClass("active");
    $("#txtTakeawayCustomer").val('');

    document.getElementById('hfCheckSMS').value = "0";

    if (id == "lnkDelivery" || obj2 == "Delivery") {
        isDisable('true');
        try {
            document.getElementById('dvCustomerLedger').style.display = 'block';
        } catch (e) {
        }
        $('#btnCancel').text("Cancel");
        $('#btnVoid').hide();
        $("#lnkDelivery").addClass("active");
        document.getElementById('dvTableNo').style.display = 'block';
        document.getElementById('dvTakeawayCustomer').style.display = "none";
        document.getElementById('divCustomer').style.visibility = 'visible';
        $('#txtCustomerSearch').focus();
        document.getElementById("hfCustomerType").value = "Delivery";
        document.getElementById('dvTableList').style.display = "none";
        document.getElementById('dvPendingBills').className = 'col-md-12 vac-det';

        $("#lblSaleForce").text("Delivery Man");
        $("#hfTableNo").val("");
        $("#hfTableId").val("0");
        $("#TableNo1").text("DLY");
        $("#OrderNo1").text("N/A");
        $("#txtCoverTable").val('');
        $("#txtTakeawayCustomer").val('');

        loadSaleForce();

        $('#txtCustomerSearch').val('');
        $("#tbl-customers").empty();
    }
    else if (id == "lnkTakeaway" || obj2 == "Takeaway") {
        $("#lblCoverTable").text("Token ID");
        isDisable('false');
        if ($("#hfTakeawayTokenIDMandatory").val() == "1") {
            $('#btnCancel').hide();
        }
        $('#btnCancel').text("Hold");
        if ($('#hfCanVoidOrder').val() == "0") {
            $('#btnVoid').hide();
        }
        else {
            $('#btnVoid').show();
        }
        $("#lnkTakeaway").addClass("active");
        document.getElementById('dvTakeawayCustomer').style.display = 'block';
        document.getElementById('dvTableNo').style.display = "none";
        document.getElementById('divCustomer').style.visibility = 'hidden';
        document.getElementById("hfCustomerType").value = "Takeaway";
        document.getElementById('dvTableList').style.display = "none";
        document.getElementById('dvPendingBills').className = 'col-md-12 vac-det';
        $("#hfTableNo").val("");
        $("#hfTableId").val("0");
        $("#TableNo1").text("TKY");
        $("#OrderNo1").text("N/A");
        $("#txtCoverTable").val('');
        $("#lblSaleForce").text("Order Taker");
        loadSaleForce();
    }
    else if (id == "lnkDineIn" || obj2 == "Dine In") {
        isDisable('true');
        if ($("#hfEatIn").val() == "1") {
            $("#lblCoverTable").text("Token ID");
        }
        $('#btnCancel').text("Cancel");
        $('#btnVoid').hide();

        $("#lnkDineIn").addClass("active");

        document.getElementById('dvTableNo').style.display = 'block';
        document.getElementById('dvTakeawayCustomer').style.display = "none";
        document.getElementById('divCustomer').style.visibility = 'hidden';
        document.getElementById("hfCustomerType").value = "Dine In";
        document.getElementById('dvTableList').style.display = "block";
        document.getElementById('dvPendingBills').className = 'col-md-5 vac-det';

        $("#lblSaleForce").text("Order Taker");
        loadSaleForce();

        NewOrder();
    }
    if (id != "") {
        GetPendingBills();
    }
}

function SaveCustomer() {

    if (ValidateCustomer()) {

        $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSDropDownList.aspx/InsertCustomer", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ cardID: $('#txtCustomerCardNo').val(), CNIC: $('#txtCustomerCNIC').val(), contactNumer: $('#txtPrimaryContact').val(), contactNumer2: $('#txtOtherContact').val(), customerName: $('#txtCustomerName').val(), address: $('#txtCustomerAddress').val(), DOB: $('#txtCustomerDOB').val(), OpeningAmount: $('#txtOpeningAmount').val(), Nature: $('#txtNature').val(), email: $('#txtEmail').val(), gender: $('#ddlGender').val(), occupation: $('#ddlOccupation').val() }),
                    success: ClearCustomer,
                    error: OnError
                }
            );
    }
}

function ValidateCustomer() {
    if ($('#txtCustomerName').val() == "") {
        Error("Must enter Customer Name");

        return false;
    }
    if ($('#txtPrimaryContact').val() == "") {
        Error("Must enter Primary Contact");

        return false;
    }
    if ($('#txtCustomerAddress').val() == "") {
        Error("Must enter Address");

        return false;
    }
    return true;
}

//On KEY UP txtCustomerSearch
function LoadAllCustomers() {
    $.ajax
       (
           {
               type: "POST", //HTTP method
               url: "frmOrderPOSDropDownList.aspx/LoadAllCustomers", //page/method name
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: JSON.stringify({ customerName: $('#txtCustomerSearch').val(), type: "Search" }),
               success: LoadAllCustomer
           }
 );
}

function LoadAllCustomer(customers) {

    customers = JSON.stringify(customers);
    var result = jQuery.parseJSON(customers.replace(/&quot;/g, '"'));

    customers = eval(result.d);

    $("#tbl-customers").empty();

    for (var i = 0, len = customers.length; i < len; i++) {
        var row = $('<tr ><td style="display:none;">' + customers[i].CUSTOMER_ID + '</td><td class="leftval">' + customers[i].CUSTOMER_NAME + '</td><td class="leftval">' + customers[i].CARD_NO + '</td><td class="leftval">' + customers[i].CONTACT_NUMBER + '</td><td class="leftval"  style="display:none;">' + customers[i].EMAIL_ADDRESS + '</td><td style="display:none;">' + customers[i].CNIC + '</td><td class="leftval"  style="display:none;">' + customers[i].REGDATE + '</td><td class="leftval">' + customers[i].ADDRESS + '</td><td class="leftval" style="display:none;">' + customers[i].GroupID + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerAdvance + '</td><td style="display:none;" align="center" onclick="ShowCustomer(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td>' + '<td align="center" onclick="ShowCustomer(this);"><a href="#"><span class="fa fa-share-square-o"></span></a></td></tr>');
        $('#tbl-customers').append(row);
    }
}

//On Save Customer
function LoadCustomers() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSDropDownList.aspx/LoadAllCustomers", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ customerName: "", type: "Max" }),
                success: LoadLastCustomer
            }
        );
}

function LoadLastCustomer(customers) {

    customers = JSON.stringify(customers);
    var result = jQuery.parseJSON(customers.replace(/&quot;/g, '"'));

    customers = eval(result.d);

    $("#tbl-customers").empty();

    for (var i = 0, len = customers.length; i < len; i++) {

        var row = $('<tr ><td style="display:none;">' + customers[i].CUSTOMER_ID + '</td><td class="leftval">' + customers[i].CUSTOMER_NAME + '</td><td class="leftval">' + customers[i].CARD_NO + '</td><td class="leftval">' + customers[i].CONTACT_NUMBER + '</td><td class="leftval"  style="display:none;">' + customers[i].EMAIL_ADDRESS + '</td><td class="leftval"  style="display:none;">' + customers[i].CNIC + '</td><td class="leftval" style="display:none;">' + customers[i].REGDATE + '</td><td class="leftval">' + customers[i].ADDRESS + '</td><td style="display:none;" align="center" onclick="ShowCustomer(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td>' + '<td align="center" onclick="ShowCustomer(this);"><a href="#"><span class="fa fa-share-square-o"></span></a></td></tr>');
        $('#tbl-customers').append(row);
    }

    var table = document.getElementById('tbl-customers');
    var lastRow = table.rows[table.rows.length - 1];

    ShowCustomer2(lastRow);
    if ($("#tble-ordered-products tr").length > 0) {
        IsNewDeliveryOrder = 1;
        $('#dvHold').trigger("click");
    }
    else {
        IsNewDeliveryOrder = 1;
        HoldOrder();
        LoadLastBill();
    }
}
function LoadCustomersLedger() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOS.aspx/LoadAllCustomers", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ customerName: "", type: "All" }),
                success: LoadCustomerLedger
            }
        );
}

function LoadCustomerLedger(data) {
    var cusinfo = JSON.stringify(data);
    var customer = jQuery.parseJSON(cusinfo.replace(/&quot;/g, '"'));
    cusinfo = eval(customer.d);
    cusinfo = JSON.stringify(cusinfo);
    document.getElementById("hfCustomerInfo").value = cusinfo;

    data = eval(data.d);
    var listItems = "<option value='0'>Select Customer</option>";
    $("[id$='ddlCustomer'] option").remove();
    for (var i = 0; i < data.length; i++) {
        if (document.getElementById('hfCustomerInfoOnBill').value === '1') {
            listItems += "<option value='" + data[i].CUSTOMER_ID + "'>" + data[i].Membership_No + '-' + data[i].CUSTOMER_NAME + "</option>";
        }
        else {
            listItems += "<option value='" + data[i].CUSTOMER_ID + "'>" + data[i].CUSTOMER_NAME + '-' + data[i].ADDRESS + '-' + data[i].CONTACT_NUMBER + '-' + data[i].strCardNo + "</option>";
        }
    }
    $("[id$='ddlCustomer']").html(listItems);
}

//After Insertion Select Last Customer
function ShowCustomer2(rowIndex) {

    document.getElementById('hfCustomerId').value = $(rowIndex).find('td:eq(0)').text();
    document.getElementById('hfCustomerNo').value = $(rowIndex).find('td:eq(3)').text();
    document.getElementById('hfTableNo').value = $(rowIndex).find('td:eq(1)').text();//Customer name used For Printing on Unique Section and Print Order
    document.getElementById('divCustomer').style.visibility = 'hidden';
    $("#tbl-customers").empty();
}

//Get Customer Detail on Selection Button on row click
function ShowCustomer(obj) {
    var rowIndex = $(obj).parent();
    document.getElementById('hfCustomerId').value = $(rowIndex).find('td:eq(0)').text();
    document.getElementById('hfCustomerNo').value = $(rowIndex).find('td:eq(3)').text();
    document.getElementById('hfTableNo').value = $(rowIndex).find('td:eq(1)').text();//Customer name used For Printing on Unique Section and Print Order
    $('#hfCustomerAdvanceAmount').val($(rowIndex).find('td:eq(9)').text());
    document.getElementById('divCustomer').style.visibility = 'hidden';
    $('#txtCustomerSearch').val('');
    $("#tbl-customers").empty();

    if ($("#tble-ordered-products tr").length > 0) {
        IsNewDeliveryOrder = 1;
        $('#dvHold').trigger("click");
    }
    else {
        IsNewDeliveryOrder = 1;
        HoldOrder();
        LoadLastBill();
    }
    $("#hfIsOldOrder").val('0');
}

function LoadLastBill() {

    setTimeout(function () {
        var table = document.getElementById('tbl-pending-bills');
        var lastRow = table.rows[table.rows.length - 1];

        if ($(lastRow).find("td:eq(10)").text() == "DLY") {

            var amountDue = $(lastRow).find("td:eq(2)").text();

            if (amountDue == 0) {

                ShowBill(lastRow);
            }
        }
        else {
            ShowBill(lastRow);
        }
    }, 1000);
}
function LoadLastBill2(InvoiceID) {

    setTimeout(function () {
        $('#tbl-pending-bills tr').each(function (row, tr) {
            if (parseFloat($(tr).find("td:eq(0)").text()) == parseFloat(InvoiceID)) {
                ShowBill2(tr);
            }
        });

    }, 1000);
}
//#endregion

//#region SMS

function SendSMS(obj) {

    var rowIndex = $(obj).parent();
    document.getElementById('hfCustomerNo').value = $(rowIndex).find('td:eq(15)').text();

    SMS(document.getElementById('hfCustomerNo').value, "2");
    document.getElementById('hfCheckSMS').value = "1";
}

//msgType: 1 for hold, 2 for Ride
function SMS(Number, Type) {
    //$.blockUI();

    //$.ajax
    //       (
    //           {
    //               type: "POST", //HTTP method
    //               url: "frmOrderPOSDropDownList.aspx/SendSMS", //page/method name
    //               contentType: "application/json; charset=utf-8",
    //               dataType: "json",
    //               data: JSON.stringify({ customerNo: Number, msgType: Type }),
    //               success: function (data) {
    //                   if (data.d == "100" || data.d == "Message Sent To Telecom") {
    //                       Succes(data.d);
    //                   } else {
    //                       Error(data.d);
    //                   }
    //               },
    //               error: OnError,
    //               complete: function () {

    //                   $.unblockUI();
    //               }
    //           }
    //       );
}

//#endregion

//region Clear

//ON Hold Order
function ClearOrder() {    
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtManualOrderNo').val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $('#hfOrderedproducts').val('');
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val("0").change();
    GetPendingBills();
    $("#hfIsOldOrder").val('0');
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    $('#hfDisable').val("0");
    $("#txtCoverTable").val('');
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $("#hfCounter").val(0);
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    UnlockRecord();
    $('#ddlItem').focus();
}

//ON Payment 
function Clear() {
    document.getElementById('imgQrCodePRA').src = '';
    document.getElementById('imgQrCodeFBR').src = '';
    $("#FBRInvoiceNo").text('');
    $("#FBRInvoiceNo3").text('');
    document.getElementById("trFBRInvoicePRA").style.display = "none";
    document.getElementById("trFBRInvoiceFBR").style.display = "none";
    document.getElementById("trQRImagePRA").style.display = "none";
    document.getElementById("trQRImageFBR").style.display = "none";
    $('#txtItemDiscount').val('');    
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtManualOrderNo').val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    $('#txtDiscount').val('');
    $('#txtCashRecieved').val('');
    $('#txtDiscountReason').val('');
    $('#txtDiscountReason2').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtCreditCardNo2').val('');
    $('#txtCreditCardAccountTile2').val('');
    $("#lblDiscountTotal").text('0.00');
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $('#hfDisable').val("0");
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    document.getElementById("btnSave").disabled = false;
    $('#payment').hide("slow");
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val("0").change();
    $('#hfCustomerNo').val('');
    $("#txtCoverTable").val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $("#hfCounter").val(0);
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');

    document.getElementById("percentage").style["background-color"] = "#919399";
    document.getElementById("value").style["background-color"] = "#919399";
    document.getElementById("cash").style["background-color"] = "#919399";
    document.getElementById("credit").style["background-color"] = "#919399";
    document.getElementById("btnCredit").style["background-color"] = "#919399";
    $("select#ddlDiscountType").prop('selectedIndex', 0);
    loadDiscountUser();
    loadUsers(document.getElementById("ddlDiscountType"));
}

function ClearOnCancel() {    
    $('#txtItemDiscount').val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtManualOrderNo').val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $('#txtDiscount').val('');
    $('#txtCashRecieved').val('');
    $('#hfDisable').val("0");
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#txtDiscountReason').val('');
    $('#txtDiscountReason2').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtCreditCardNo2').val('');
    $('#txtCreditCardAccountTile2').val('');
    document.getElementById("btnSave").disabled = false;
    $('#payment').hide("slow");
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val("0").change();
    $('#hfCustomerNo').val('');
    $("#txtCoverTable").val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $("#hfCounter").val(0);
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    document.getElementById("percentage").style["background-color"] = "#919399";
    document.getElementById("value").style["background-color"] = "#919399";
    document.getElementById("cash").style["background-color"] = "#919399";
    document.getElementById("credit").style["background-color"] = "#919399";
    document.getElementById("btnCredit").style["background-color"] = "#919399";
    $("select#ddlDiscountType").prop('selectedIndex', 0);
    UnlockRecord();
    loadDiscountUser();
    loadUsers(document.getElementById("ddlDiscountType"));
    $('#ddlItem').focus();
}

//ON Print Invoice
function Clear2() {    
    $('#txtItemDiscount').val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtManualOrderNo').val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $('#txtDiscount2').val('');
    $('#txtDiscountReason2').val('');
    $('#txtDiscountReason').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtCreditCardNo2').val('');
    $('#txtCreditCardAccountTile2').val('');
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#hfDisable').val("0");
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $("#txtCoverTable").val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val("0").change();
    $('#hfCustomerNo').val('');
    $("#txtTakeawayCustomer").val('');
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $('#payment2').hide("slow");
    if ($('#hfPaymentType2').val() == "0") {
        PayType2(document.getElementById("cash2"));
    }
    else if ($('#hfPaymentType2').val() == "1") {
        PayType2(document.getElementById("credit2"));
    }
    else if ($('#hfPaymentType2').val() == "2") {
        PayType2(document.getElementById("btnCredit2"));
    }
    else if ($('#hfPaymentType2').val() == "3") {
        PayType2(document.getElementById("btnEasypaisa2"));
    }
    else if ($('#hfPaymentType2').val() == "4") {
        PayType2(document.getElementById("btnJazzcash2"));
    }
    else if ($('#hfPaymentType2').val() == "5") {
        PayType2(document.getElementById("btnOnlineTransfer2"));
    }
    CalculateBalance2();

    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("value2").style["background-color"] = "#919399";
    $('#dvDiscount2').find('*').prop('disabled', false);
    document.getElementById('txtDiscount2').disabled = true;
    document.getElementById('txtDiscountReason2').disabled = true;
    document.getElementById('txtDiscount').disabled = true;
    $("#txtLoyaltyCard").val('');
    $('#hfCardTypeId').val('0');
    $('#hfCardPoints').val('0');
    $('#hfCardPurchasing').val('0');
    $('#hfCardAmountLimit').val('0');
}

function ClearOnCancel2() {    
    $('#txtItemDiscount').val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtManualOrderNo').val('');
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $('#txtDiscount2').val('');
    $('#txtDiscount').val('');
    $('#hfDisable').val("0");
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#txtDiscountReason2').val('');
    $('#txtDiscountReason').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtCreditCardNo2').val('');
    $('#txtCreditCardAccountTile2').val('');
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val("0").change();
    $('#hfCustomerNo').val('');
    $("#txtCoverTable").val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');
    $("select#ddlOrderBooker").prop('selectedIndex', 0);
    $('#payment2').hide("slow");
    if ($('#hfPaymentType2').val() == "0") {
        PayType2(document.getElementById("cash2"));
    }
    else if ($('#hfPaymentType2').val() == "1") {
        PayType2(document.getElementById("credit2"));
    }
    else if ($('#hfPaymentType2').val() == "2") {
        PayType2(document.getElementById("btnCredit2"));
    }
    else if ($('#hfPaymentType2').val() == "3") {
        PayType2(document.getElementById("btnEasypaisa2"));
    }
    else if ($('#hfPaymentType2').val() == "4") {
        PayType2(document.getElementById("btnJazzcash2"));
    }
    else if ($('#hfPaymentType2').val() == "5") {
        PayType2(document.getElementById("btnOnlineTransfer2"));
    }
    CalculateBalance2();
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    UnlockRecord();
    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("value2").style["background-color"] = "#919399";
    $('#dvDiscount2').find('*').prop('disabled', false);
    document.getElementById('txtDiscount2').disabled = true;
    document.getElementById('txtDiscountReason2').disabled = true;
    document.getElementById('txtDiscount').disabled = true;
    $("#txtLoyaltyCard").val('');
    $('#hfCardTypeId').val('0');
    $('#hfCardPoints').val('0');
    $('#hfCardPurchasing').val('0');
    $('#hfCardAmountLimit').val('0');
    $('#ddlItem').focus();
}

//ON Customer 
function ClearCustomer() {
    $('#txtCustomerCardNo').val('');
    $('#txtPrimaryContact').val('');
    $('#txtOtherContact').val('');
    $('#txtCustomerName').val('');
    $('#txtCustomerAddress').val('');
    $('#txtCustomerCNIC').val('');
    $('#txtCustomerDOB').val('');
    $('#txtCustomerSearch').val('');
    $('#txtEmail').val('');
    $('#txtOpeningAmount').val('');
    $('#txtNature').val('');
    $('#txtBarcode').val('');

    document.getElementById('divCustomer').style.visibility = 'hidden';

    LoadCustomers();

}

function CancelCustomer() {

    $('#txtCustomerCardNo').val('');
    $('#txtPrimaryContact').val('');
    $('#txtOtherContact').val('');
    $('#txtCustomerName').val('');
    $('#txtCustomerCNIC').val('');
    $('#txtCustomerDOB').val('');
    $('#txtCustomerAddress').val('');
    $('#txtEmail').val('');
    $('#txtOpeningAmount').val('');
    $('#txtNature').val('');
    $('#txtBarcode').val('');
    $('#txtCustomerSMS').val('');
    $('#txtContactSMS').val('');
    $('#txtAddressSMS').val('');
    document.getElementById('divCustomer').style.visibility = 'hidden';
}

function QtyFocused(e)
{
    e.select();
    document.getElementById("hfItemChange").value = 0;
}

function AddProductToGrid(e) {
    if (IsUserValidationPopup == 1) {
        return;
    }
    document.getElementById("hfItemChange").value = 0;
    $('#messageBox').text('');
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key == 13) {
        e.preventDefault();
        var lstProducts = document.getElementById("hfProduct").value;
        lstProducts = eval(lstProducts);
        if ($('#txtQuantity').val() != '') {
            if (parseFloat($('#txtQuantity').val()) <= 0)
            {
                $('#messageBox').text('Quantity should be greater than 0');
                $('#txtQuantity').focus();
                return;
            }
            var flage = false;
            for (var i = 0, len = lstProducts.length; i < len; ++i) {
                if (lstProducts[i].SKU_ID == $('#ddlItem').val()) {
                    flage = false;
                    addProductToOrderTable(lstProducts[i].SKU_ID);
                    $('#txtQuantity').val('1');
                    $('#txtItemDiscount').val('');
                    $('#ddlItem').focus();
                    break;
                }
            }
        }
    }
    else if(key == 46)
    {
        //Allow Decimal
    }
    else
    {
        if (key == 9 || key == 8) {
            e.preventDefault();
            return;
        }
        if (key == 46) {
            e.preventDefault();
            return;
        }
        if (key == 31 || key < 48 || key > 57) {
            e.preventDefault();
            return;
        }
    }
}
//Promotion Implementation
function CalculatePromotion(OrderedSKU_ID, OrderedQty, OrderedRate) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    var tblPromotion = document.getElementById("hftblPromotion").value;
    tblPromotion = eval(tblPromotion);
    var IsValidGroup = 0;
    var IsValidServiceType = 0;
    var Discount = 0;
    if (document.getElementById("hfAutoPromotion").value == '1') {
        for (var i = 0, len = tblPromotion.length; i < len; ++i) {
            var a = tblPromotion[i].START_TIME;
            var b = tblPromotion[i].END_TIME;
            var aa1 = a.split(":");
            var aa2 = b.split(":");
            var tt = time.split(":");
            var d1 = new Date(parseInt("2001", 10), (parseInt("01", 10)) - 1, parseInt("01", 10), parseInt(aa1[0], 10), parseInt(aa1[1], 10), parseInt(aa1[2], 10));
            var d2 = new Date(parseInt("2001", 10), (parseInt("01", 10)) - 1, parseInt("01", 10), parseInt(aa2[0], 10), parseInt(aa2[1], 10), parseInt(aa2[2], 10));
            var t2 = new Date(parseInt("2001", 10), (parseInt("01", 10)) - 1, parseInt("01", 10), parseInt(tt[0], 10), parseInt(tt[1], 10), parseInt(tt[2], 10));
            var dd1 = d1.valueOf();
            var dd2 = d2.valueOf();
            var tt2 = t2.valueOf();
            if (dd1 <= tt2 && dd2 >= tt2)
                if (($("#hfCustomerType").val() == "Dine In" && tblPromotion[i].CUSTOMER_TYPE_ID == 1) || ($("#hfCustomerType").val() == "Delivery" && tblPromotion[i].CUSTOMER_TYPE_ID == 2) || ($("#hfCustomerType").val() == "Takeaway" && tblPromotion[i].CUSTOMER_TYPE_ID == 3)) {
                    if (document.getElementById("hfCustomerGroup").value == tblPromotion[i].CUSTOMER_VOLUMECLASS_ID) {
                        if (tblPromotion[i].SKU_GROUP_ID !== 0) {
                            IsValidGroup = 0;
                            var tblGroupDetail = document.getElementById("hftblGroupDetail").value;
                            tblGroupDetail = eval(tblGroupDetail);
                            for (var j = 0, lenj = tblGroupDetail.length; j < lenj; ++j) {
                                if (tblGroupDetail[j].SKU_ID == OrderedSKU_ID && tblGroupDetail[j].SKU_GROUP_ID == tblPromotion[i].SKU_GROUP_ID) {
                                    IsValidGroup = 1;
                                    break;
                                }
                            }
                            if (IsValidGroup) {
                                if (tblPromotion[i].BASKET_ON == 82) {
                                    if (parseFloat(OrderedQty) >= tblPromotion[i].MIN_VAL && parseFloat(OrderedQty) <= tblPromotion[i].MAX_VAL) {
                                        if (tblPromotion[i].DISCOUNT > 0) {
                                            Discount += (parseFloat(OrderedRate) * parseFloat(OrderedQty)) * (parseFloat(tblPromotion[i].DISCOUNT) / 100);
                                        }
                                        Discount += parseFloat(tblPromotion[i].OFFER_VALUE) * parseFloat(OrderedQty);
                                    }
                                }
                                else {
                                    if (parseFloat(OrderedQty) * parseFloat(OrderedRate) >= tblPromotion[i].MIN_VAL && parseFloat(OrderedQty) * parseFloat(OrderedRate) <= tblPromotion[i].MAX_VAL) {
                                        if (tblPromotion[i].DISCOUNT > 0) {
                                            Discount += (parseFloat(OrderedRate) * parseFloat(OrderedQty)) * (parseFloat(tblPromotion[i].DISCOUNT) / 100);
                                        }
                                        Discount += parseFloat(tblPromotion[i].OFFER_VALUE) * parseFloat(OrderedQty);
                                    }
                                }
                            }
                        }
                        else {
                            if (tblPromotion[i].SKU_ID == OrderedSKU_ID) {
                                if (tblPromotion[i].BASKET_ON == 82) {
                                    if (parseFloat(OrderedQty) >= tblPromotion[i].MIN_VAL && parseFloat(OrderedQty) <= tblPromotion[i].MAX_VAL) {
                                        if (tblPromotion[i].DISCOUNT > 0) {
                                            Discount += (parseFloat(OrderedRate) * parseFloat(OrderedQty)) * (parseFloat(tblPromotion[i].DISCOUNT) / 100);
                                        }
                                        Discount += parseFloat(tblPromotion[i].OFFER_VALUE) * parseFloat(OrderedQty);
                                    }
                                }
                                else {
                                    if (parseFloat(OrderedQty) * parseFloat(OrderedRate) >= tblPromotion[i].MIN_VAL && parseFloat(OrderedQty) * parseFloat(OrderedRate) <= tblPromotion[i].MAX_VAL) {
                                        if (tblPromotion[i].DISCOUNT > 0) {
                                            Discount += (parseFloat(OrderedRate) * parseFloat(OrderedQty)) * (parseFloat(tblPromotion[i].DISCOUNT) / 100);
                                        }
                                        Discount += parseFloat(tblPromotion[i].OFFER_VALUE) * parseFloat(OrderedQty);
                                    }
                                }
                            }
                        }
                    }
                }
        }
    }
    return Discount;
}
function addProductToOrderTable(skuId) {
    var tableData;
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    var discount = 0;
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        var flage = false;
        if (lstProducts[i].SKU_ID == skuId) {
            var gstper = parseFloat(lstProducts[i].GSTPER);
            $('#tble-ordered-products').find('tr').each(function () {
                var td1 = $(this).find("td:eq(0)").text();
                var tdcat = $(this).find("td:eq(16)").text();
                var tdDeal = -1;
                if ($(this).find("td:eq(23)").text() != "") {
                    tdDeal = $(this).find("td:eq(23)").text();
                }
                if (skuId == td1 && lstProducts[i].IsUnGroup == false) {
                    discount = CalculatePromotion(skuId, parseFloat($(this).find("td:eq(4) input").val()) + parseFloat($('#txtQuantity').val()), parseFloat($(this).find("td:eq(6)").text()));
                    var color = $(this).find("td:eq(2)").css("color");
                    var next = $(this).next().find("td:eq(0)").text();
                    if (checkVoid($(this).find("td:eq(15)").text())) {//CHECK IS VOID OR NOT
                        if ($("#hfRow").val() == "") {//check row is selected or not if select not then update previous else add new
                            if (color == "rgb(255, 0, 0)") {
                                if (next != "") {
                                    flage = false;
                                }
                                else {
                                    if ($(this).find("td:eq(23)").text() == "0") {//when item_deal_id=0
                                        $(this).find("td:eq(4) input").val(parseFloat($(this).find("td:eq(4) input").val()) + parseFloat($('#txtQuantity').val()));
                                        if ($('#txtItemDiscount').val() == '') {
                                            var dsc = $(this).find("td:eq(7)").text();
                                            if (dsc == "")
                                            {
                                                dsc = 0;
                                            }
                                            $(this).find("td:eq(8)").text(parseFloat($(this).find("td:eq(6)").text()) * parseInt($(this).find("td:eq(4) input").val()) - parseFloat(dsc) - parseFloat(discount));
                                        }
                                        else {
                                            $(this).find("td:eq(7)").text(parseFloat($('#txtItemDiscount').val()));
                                            $(this).find("td:eq(8)").text(parseFloat($(this).find("td:eq(6)").text()) * parseInt($(this).find("td:eq(4) input").val()) - parseFloat($('#txtItemDiscount').val()));
                                            $(this).find("td:eq(47)").text(parseInt($(this).find("td:eq(8)").text()) * gstper / 100);
                                            $(this).find("td:eq(48)").text((parseFloat($(this).find("td:eq(4) input").val()) + 1) * discount);
                                        }
                                    }
                                    else {
                                        if (lstProducts[i].Is_CatChoice == "0") {
                                            $(this).find("td:eq(4) input").val(parseFloat($(this).find("td:eq(4) input").val()) + parseFloat($('#txtQuantity').val()));
                                        }
                                        else {
                                            $(this).find("td:eq(4) input").val(parseFloat($(this).find("td:eq(4) input").val()) + parseFloat($('#txtQuantity').val()));
                                        }
                                    }
                                    tableData = storeTblValues();
                                    tableData = JSON.stringify(tableData);
                                    document.getElementById('hfOrderedproducts').value = tableData;
                                    flage = true;
                                    $('#hfIsNewItemAdded').val('1');
                                }
                            }
                            else {//check for Modifier if row exist after then add new else update previous
                                if ($(this).find("td:eq(21)").text() == "2") {//WHEN DIVISION IS VALUE BASE
                                    $(this).find("td:eq(6) input").val(parseFloat($(this).find("td:eq(6) input").val()) + parseFloat($(this).find("td:eq(22)").text()));
                                    $(this).find("td:eq(4) input").val(parseFloat($(this).find("td:eq(6) input").val()) / parseFloat($(this).find("td:eq(22)").text()));
                                }
                                else {
                                    $(this).find("td:eq(4) input").val(parseFloat($(this).find("td:eq(4) input").val()) + parseFloat($('#txtQuantity').val()));
                                    if ($('#txtItemDiscount').val() == '') {
                                        var dsc = $(this).find("td:eq(7)").text();
                                        if (dsc == "") {
                                            dsc = 0;
                                        }
                                        $(this).find("td:eq(8)").text(parseFloat($(this).find("td:eq(6)").text()) * parseInt($(this).find("td:eq(4) input").val()) - parseFloat(dsc) - parseFloat(discount));
                                        $(this).find("td:eq(47)").text(parseInt($(this).find("td:eq(8)").text()) * gstper / 100);
                                        $(this).find("td:eq(48)").text((parseFloat($(this).find("td:eq(4) input").val()) + 1) * discount);
                                    }
                                    else {
                                        $(this).find("td:eq(7)").text(parseFloat($('#txtItemDiscount').val()));
                                        $(this).find("td:eq(8)").text(parseFloat($(this).find("td:eq(6)").text()) * parseInt($(this).find("td:eq(4) input").val()) - parseFloat($('#txtItemDiscount').val()));
                                        $(this).find("td:eq(47)").text(parseInt($(this).find("td:eq(8)").text()) * gstper / 100);
                                        $(this).find("td:eq(48)").text((parseFloat($(this).find("td:eq(4) input").val()) + 1) * discount);
                                    }                                    
                                }
                                tableData = storeTblValues();
                                tableData = JSON.stringify(tableData);
                                document.getElementById('hfOrderedproducts').value = tableData;
                                flage = true;
                                $('#hfIsNewItemAdded').val('1');
                            }
                        }
                    }
                }
            });
            if (flage) break;
            addProductToOrderedProduct2(lstProducts, i, $("#OrderNo1").text());
            break;
        }
    }
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
}

function addProductToOrderedProduct(lstProducts, i, invoiceId) {

    //--------------------For Maintaing Counter-----By Hassan------------------------------------------------\\
    //#region Counter
    var rowNo = $("#hfRow").val();//get which row is selected

    if ($("#OrderNo1").text() == "N/A") {//Check when it's new order
        if ($("#hfRowIndex").val() != "") {//Check row selection
            var x = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            x[23].innerHTML = parseFloat(parseFloat(x[23].innerHTML) + 0.1).toFixed(2);//Update C2

            var y = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            lstProducts[i].C1 = parseFloat((parseFloat(y[12].innerHTML) + parseFloat(x[23].innerHTML))).toFixed(2);
            lstProducts[i].C2 = -1;//FOR CHECK COUNT ON EDIT
        }
        else {
            $("#hfCounter").val(parseInt($("#hfCounter").val()) + 1);
            lstProducts[i].C1 = parseFloat($("#hfCounter").val()) + parseFloat(lstProducts[i].C1);
        }
    }
    else {
        if ($("#hfRowIndex").val() != "") {//Check row selection
            var x = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            x[23].innerHTML = parseFloat(parseFloat(x[23].innerHTML) + 0.1).toFixed(2);//Update C2

            var y = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            lstProducts[i].C1 = parseFloat((parseFloat(y[12].innerHTML) + parseFloat(x[23].innerHTML))).toFixed(2);
            lstProducts[i].C2 = -1;//FOR CHECK COUNT ON EDIT
        }
        else {
            if (lstProducts[i].C2 > 0 || lstProducts[i].C2 == 0) {
                $("#hfCounter").val(parseInt($("#hfCounter").val()) + 1);
                lstProducts[i].C1 = parseFloat($("#hfCounter").val());
            }
        }
    }
    //#endregion Counter
    //-----------------------------------------------------------------------------------------------\\

    var time = lstProducts[i].TIME_STAMP2;
    var row = "";
    var tprice = 0;
    var amount = 0;
    var gstamount = 0;
    var discount = 0;
    discount = CalculatePromotion(lstProducts[i].SKU_ID, lstProducts[i].QTY, lstProducts[i].T_PRICE);

    if (lstProducts[i].T_PRICE.toString().indexOf(".") == -1) {
        tprice = lstProducts[i].T_PRICE;
        amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(lstProducts[i].DISCOUNT);
    }
    else {
        tprice = parseFloat(lstProducts[i].T_PRICE).toFixed(2);
        amount = (parseFloat(lstProducts[i].AMOUNT) - parseFloat(lstProducts[i].DISCOUNT)).toFixed(2);
    }
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(amount) / 100;
    if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
        if (lstProducts[i].IsUnGroup) {
            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
        }
        else {
            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
        }
    }
    else {
        if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
            if (lstProducts[i].MODIFIER == "0") {//CHECK IS MODIFIER OR NOT IF NOT THEN
                if (lstProducts[i].IsUnGroup) {
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                }
                else {
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                }
            }
            else {
                if (lstProducts[i].T_PRICE == "0") {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled="disabled"></td><td style="display:none;"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
            }
        }
        else {
            if (lstProducts[i].MODIFIER == "1") {
                if (lstProducts[i].T_PRICE == "0") {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled="disabled"></td><td style="display: none;"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td<td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td<td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
            }
            else {
                if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td>td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td>td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].DISCOUNT + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td></tr>');
                    }
                }
            }
        }
    }

    if ($("#hfRow").val() != "") {//in case of product is selected in grid (AddRow(this));

        var i = $("#hfRow").val();
        $('#tble-ordered-products > tr').eq(i).after(row);
        $('#hfIsNewItemAdded').val('1');
    }

    else {
        $("#tble-ordered-products").append(row);
        $('#hfIsNewItemAdded').val('1');
    }
}

function addProductToOrderedProduct2(lstProducts, i, invoiceId) {

    //--------------------For Maintaing Counter-----By Hassan------------------------------------------------\\
    //#region Counter
    var rowNo = $("#hfRow").val();//get which row is selected

    if ($("#OrderNo1").text() == "N/A") {//Check when it's new order
        if ($("#hfRowIndex").val() != "") {//Check row selection
            var x = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            x[23].innerHTML = parseFloat(parseFloat(x[23].innerHTML) + 0.1).toFixed(2);//Update C2

            var y = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            lstProducts[i].C1 = parseFloat((parseFloat(y[12].innerHTML) + parseFloat(x[23].innerHTML))).toFixed(2);
            lstProducts[i].C2 = -1;//FOR CHECK COUNT ON EDIT

        }
        else {

            $("#hfCounter").val(parseInt($("#hfCounter").val()) + 1);
            lstProducts[i].C1 = parseFloat($("#hfCounter").val()) + parseFloat(lstProducts[i].C1);
        }
    }
    else {
        if ($("#hfRowIndex").val() != "") {//Check row selection
            var x = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            x[23].innerHTML = parseFloat(parseFloat(x[23].innerHTML) + 0.1).toFixed(2);//Update C2

            var y = document.getElementById("tble-ordered-products").rows[rowNo].cells;
            lstProducts[i].C1 = parseFloat((parseFloat(y[12].innerHTML) + parseFloat(x[23].innerHTML))).toFixed(2);
            lstProducts[i].C2 = -1;//FOR CHECK COUNT ON EDIT
        }
        else {
            if (lstProducts[i].C2 > 0 || lstProducts[i].C2 == 0) {
                $("#hfCounter").val(parseInt($("#hfCounter").val()) + 1);
                lstProducts[i].C1 = parseFloat($("#hfCounter").val());
            }
        }
    }
    //#endregion Counter
    //-----------------------------------------------------------------------------------------------\\

    var now = new Date();
    var time = now.toLocaleTimeString();
    now = now.getTime();
    now = `/Date(${now})/`;

    var row = "";
    var tprice = 0;
    var amount = 0;
    var amount2 = 0;
    var discount = 0;
    var gstamount = 0;
    var discount2 = 0;
    discount2 = CalculatePromotion(lstProducts[i].SKU_ID, parseFloat($('#txtQuantity').val()), lstProducts[i].T_PRICE);
    try {
        if ($('#txtItemDiscount').val() == '') {
            discount = 0;
        }
        else {
            discount = parseFloat($('#txtItemDiscount').val());
        }
    } catch (e) {
        discount = 0;
    }

    if (lstProducts[i].T_PRICE.toString().indexOf(".") == -1) {
        tprice = $('#txtSKUPrice').val();
        amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount) - parseFloat(discount2);
        amount2 = parseFloat($('#txtQuantity').val()) * tprice - parseFloat(discount)- parseFloat(discount2);
    }
    else {
        tprice = parseFloat($('#txtSKUPrice').val()).toFixed(2);
        amount = (parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount2)).toFixed(2);
        amount2 = parseFloat(parseFloat($('#txtQuantity').val()) * parseFloat(tprice) - parseFloat(discount2)).toFixed(2);
    }
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(amount) / 100;
    if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
    }
    else {
        if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
            if (lstProducts[i].MODIFIER == "0") {//CHECK IS MODIFIER OR NOT IF NOT THEN
                if (lstProducts[i].IsUnGroup)
                {
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                }
                else {
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                }
            }
            else {
                if (lstProducts[i].T_PRICE == "0") {
                    if (lstProducts[i].IsUnGroup)
                    {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" ><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled="disabled"></td><td style="display:none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td style="display:none;" class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red" colspan="6">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td style="display:none;" class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                    else
                    {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                }
            }
        }
        else {
            if (lstProducts[i].MODIFIER == "1") {
                if (lstProducts[i].T_PRICE == "0") {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled="disabled"></td><td style="display: none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2" style="color: red">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                    else
                    {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td style="color: red" class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                }
            }
            else {

                if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                    row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                }
                else {
                    if (lstProducts[i].IsUnGroup) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" disabled="disabled"></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td>' + lstProducts[i].strERPCode + '</td><td class="table-text2">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + $('#txtQuantity').val() + '"  style="text-align: center;" onkeyup="QtyChanged(this);" onblur="CheckQty(this);"></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + $('#txtItemDiscount').val() + '</td><td class="table-text2">' + amount2 + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount2 + '</td><td style="display:none;">' + now + '</td></tr>');
                    }
                }
            }
        }
    }

    if ($("#hfRow").val() != "") {//in case of product is selected in grid (AddRow(this));

        var i = $("#hfRow").val();
        $('#tble-ordered-products > tr').eq(i).after(row);
        $('#hfIsNewItemAdded').val('1');
    }

    else {
        $("#tble-ordered-products").append(row);
        $('#hfIsNewItemAdded').val('1');
    }

    if (lstProducts[i].IS_HasMODIFIER == "1") {
        $("#btnModifierItem").click();//Click Modifier Buttons
    }
}

function QtyChanged(obj) {
    var rowIndex = $(obj).closest('tr');
    if (checkVoid($(rowIndex).find('td:eq(15)').text())) {
        var qty = 0;
        if ($(rowIndex).find('td:eq(4) input').val() != "") {
            qty = parseFloat($(rowIndex).find('td:eq(4) input').val());
        }

        var price = $(rowIndex).find('td:eq(6)').text();
        var discount = $(rowIndex).find('td:eq(7)').text();
        if (discount == "")
        {
            discount = 0;
        }
        var amount = (parseFloat(qty * price) - parseFloat(discount)).toFixed(2);
        $(rowIndex).find('td:eq(8)').text(amount);
        var tableData = storeTblValues();
        tableData = JSON.stringify(tableData);
        document.getElementById('hfOrderedproducts').value = tableData;
        setTotals();
        $('#hfDisable').val("0");
    }
}

function CheckQty(obj) {
    $('#messageBox').text('');
    var rowIndex = $(obj).closest('tr');
    var OldQty = 0;
    for (var i = 0, len = OldOrder.length; i < len; ++i) {
        if (OldOrder[i].SKU_ID.toString() == $(rowIndex).find('td:eq(0)').text()) {
            OldQty = OldOrder[i].QTY;
            OldSKUID = OldOrder[i].SKU_ID;
            break;
        }
    }

    if (checkVoid($(rowIndex).find('td:eq(15)').text())) {
        if ($(rowIndex).find('td:eq(4) input').val() == "" || $(rowIndex).find('td:eq(4) input').val() == 0) {
            $('#messageBox').text('Quantity should be greater than 0');
            $(rowIndex).find('td:eq(4) input').focus();
            return;
        }
    }

    var qty = parseFloat($(rowIndex).find('td:eq(4) input').val());
    if(qty < OldQty)
    {
        $("#lblReason").text('Less Reason');
        document.getElementById('ddlLessReason').style.display = "block";
        document.getElementById('ddlCancelReason').style.display = "none";
        document.getElementById('txtUserID').value = "";
        document.getElementById('txtUserPass').value = "";
        $("#hfUserClick").val('Decrease');
        $('#UserValidation').show("slow");
        IsUserValidationPopup = 1;
        $('#txtUserID').focus();
    }
    
}

function PaymentReceivedPress(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key == 13) {
        e.preventDefault();
        $('#btnSave').focus();
     }
    else {
        if (key == 9 || key == 8) {
            e.preventDefault();
            return;
        }
        if (key == 46) {
            e.preventDefault();
            return;
        }
        if (key == 31 || key < 48 || key > 57) {
            e.preventDefault();
            return;
        }
    }
}

function VoidGST() {
    if (document.getElementById("hfCanVoidGST").value == "True") {
        if (parseFloat($("#lblGSTTotal2").text()) > 0) {
            document.getElementById('hfIsGSTVoid').value = '1';
        }
        else {
            document.getElementById('hfIsGSTVoid').value = '0';
        }
        CalculateBalance2();
    }
}
function DiscountAuthentication() {
    $('#DiscountValidation').show("slow");
}
function CancelAuthenticateDiscount() {
    document.getElementById('txtDiscountAuthUserID').value = "";
    document.getElementById('txtDiscountAuthUserPass').value = "";
    document.getElementById('txtDiscountAuthRemarks').value = "";
    document.getElementById('txtDiscountAuth').value = "";
    $('#DiscountValidation').hide("slow");
}
function AuthenticateDiscountUser() {
    if (document.getElementById('txtDiscountAuth').value == "") {
        Error("Enter discount!");
        return;
    }
    var UserId = document.getElementById('txtDiscountAuthUserID').value;
    var UserPassword = document.getElementById('txtDiscountAuthUserPass').value;
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOS.aspx/ValidateUser", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ UserId: UserId, UserPass: UserPassword, UserClick: "DiscountUser" }),
                success: DiscountUserAuthentication,
                error: function () { Error("Authorization Failed!"); }
            }
        );
}
function DiscountUserAuthentication(UserAuth) {
    UserAuth = JSON.stringify(UserAuth);
    var result = jQuery.parseJSON(UserAuth.replace(/&quot;/g, '"'));
    UserAuth = eval(result.d);
    if (UserAuth != null) {
        if (UserAuth.length > 0) {            
            document.getElementById("txtDiscount2").value = document.getElementById('txtDiscountAuth').value;
            if ($('select#ddlDiscountAuthType option:selected').val() == 1) {
                DiscType(document.getElementById("value2"));
            }
            else {
                DiscType(document.getElementById("percentage2"));
            }
            document.getElementById("txtDiscount2").disabled = true;
            $("#hfDiscountRemarks").val(document.getElementById('txtDiscountAuthRemarks').value);
            document.getElementById('txtDiscountAuthUserID').value = "";
            document.getElementById('txtDiscountAuthUserPass').value = "";
            document.getElementById('txtDiscountAuthRemarks').value = "";
            document.getElementById('txtDiscountAuth').value = "";
            $('#DiscountValidation').hide("slow");
        }
        else {
            Error('This user Can not give discount!');
        }
    }
    else {
        Error('This user Can not give discount!');
    }
}
function GetDiscountTemplateDetail(EmployeeDiscountTypeID) {
    var DiscountDetail = [];
    var obj = {};
    obj["DiscountTypeID"] = -1;
    obj["DiscountValue"] = 0;
    obj["DiscountBehaviour"] = 1;
    DiscountDetail.push(obj);
    var lstDiscTypes = document.getElementById("hfEmployeeDiscountType").value;
    lstDiscTypes = eval(lstDiscTypes);
    for (var i = 0, len = lstDiscTypes.length; i < len; ++i) {
        if (lstDiscTypes[i].EmployeeDiscountTypeID.toString() == EmployeeDiscountTypeID) {
            DiscountDetail = []
            var obj = {};
            obj["DiscountTypeID"] = lstDiscTypes[i].DiscountTypeID;
            obj["DiscountValue"] = lstDiscTypes[i].DiscountValue;
            obj["DiscountBehaviour"] = lstDiscTypes[i].DiscountBehaviour;
            DiscountDetail.push(obj);
            break;
        }
    }
    return DiscountDetail;
}
function ApplyDiscountTemplate(popup, DiscountDetail) {
    if (popup == 2) {
        document.getElementById("txtDiscount2").disabled = false;
        document.getElementById('txtDiscountReason2').disabled = false;
        document.getElementById("txtDiscount2").value = DiscountDetail[0].DiscountValue;
        if (DiscountDetail[0].DiscountBehaviour == 1) {
            DiscType(document.getElementById("percentage2"));
        }
        else {
            DiscType(document.getElementById("value2"));
        }
    }
    else {
        document.getElementById("txtDiscount").disabled = false;
        document.getElementById('txtDiscountReason').disabled = false;
        document.getElementById("txtDiscount").value = DiscountDetail[0].DiscountValue;
        if (DiscountDetail[0].DiscountBehaviour == 1) {
            DiscType(document.getElementById("percentage"));
        }
        else {
            DiscType(document.getElementById("value"));
        }
    }
}
function DeliveryChannelClick() {
    $('#txtCustomerSearch').val('');
    $("#tbl-customers").empty();
}
function sortTableKOT() {
    var sortOrder = 0;
    var arrData = $('#detail-section-skus').find('tr').get();
    arrData.sort(function (a, b) {
        var val1 = $(a).children('td').eq(3).text().toUpperCase();
        var val2 = $(b).children('td').eq(3).text().toUpperCase();
        if ($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val2 - val1 : val1 - val2;
        else
            return (val2 < val1) ? -sortOrder : (val2 > val1) ? sortOrder : 0;
    });
    $.each(arrData, function (index, row) {
        $('#detail-section-skus').append(row);
    });
}
function storeTblValuesPrint(products) {
    var tableData = new Array();
    for (var i = 0, len = products.length; i < len; i++) {
        tableData[i] = {
            "SKU_ID": products[i].SKU_ID,
            "SALE_INVOICE_ID": products[i].SALE_INVOICE_ID
        }
    }
    return tableData;
}
function UpdatePrintRecord(Items)
{
    $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOS.aspx/UpdatePrintRecords", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: Items}),
                    success: PrintDone,
                });
}
function PrintDone()
{

}
//----------------------------------------------------------