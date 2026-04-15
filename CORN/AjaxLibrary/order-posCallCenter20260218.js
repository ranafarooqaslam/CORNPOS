var audio = new Audio('audio_file.mp3');
var Modifierparent = [];
var OpenItemValues = [];
var HolderOrderClicke = 0;
var IsUserValidationPopup = 0;
var rowIndexComments = 0;
var IsNewDeliveryOrder = 0;
var ModifierParentCounter = 1;
var hfModifierParetn_Row_ID = 0;

function waitLoading(msg) {
    new $.Zebra_Dialog('<strong>' + msg + '</strong>', {
        'buttons': false,
        'position': ['top + 120'],
        'auto_close': 600
    });
}

//=======Item Less/Cancel Reason
function GetItemLessCancelReason() {
    $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/GetItemLessCancelReason", //page/method name
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

function ApplyBankDiscount2() {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val().toString());
    document.getElementById('txtDiscount2').disabled = true;
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
                else{
                    document.getElementById("txtDiscount2").value = DiscountPer;
                }
            }
            document.getElementById('txtDiscount2').disabled = false;
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
    $('#lnkDelivery').hide();
    $('#lnkTakeaway').hide();
    var flag = false;    
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
//=======Discount User
function loadUsers(obj) {
    var DiscountDetail = GetDiscountTemplateDetail(obj.value);
    document.getElementById("dvBankDiscount").setAttribute("style", "display:none;");
    document.getElementById("dvLoyaltyCard").setAttribute("style", "display:none;");
    document.getElementById("dvDiscountUser").setAttribute("style", "display:none;");
    document.getElementById("dvAuthorityUser").setAttribute("style", "display:none;");
    document.getElementById("percentage").disabled = true;
    document.getElementById("value").disabled = true;
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
    if ($("#hfIS_CanGiveDiscount").val() == 'True' && document.getElementById("hfAutoPromotion").value == '0') {
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
    document.getElementById('txtDiscount2').disabled = true;
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
        if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType2').val() == "1")
        {
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
               url: "frmOrderPOSCallCenter.aspx/LoadDiscountUser", //page/method name
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

//=======Product and Category
function LoadSections() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadSection", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: GetSections,
                error: OnError
            }
        );
}
function GetSections(sections) {
    sections = JSON.stringify(sections);
    var result = jQuery.parseJSON(sections.replace(/&quot;/g, '"'));
    sections = eval(result.d);
    sections = JSON.stringify(sections);
    sections = eval(sections);
    var listItems = "";
    for (var i = 0, len = sections.length; i < len; ++i) {
        listItems += "<option value='" + sections[i].SECTION_ID + "'>" + sections[i].SECTION_NAME + "</option>";
    }
    $("#ddlSectionOpenItem").html(listItems);
}
function LoadOpenItemCategory() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/GetOpenItemCategory", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: GetOpenItemCategory,
                error: OnError
            }
        );
}
function GetOpenItemCategory(categories) {
    categories = JSON.stringify(categories);
    var result = jQuery.parseJSON(categories.replace(/&quot;/g, '"'));
    categories = eval(result.d);
    categories = JSON.stringify(categories);
    categories = eval(categories);
    var listItems = "";
    for (var i = 0, len = categories.length; i < len; ++i) {
        listItems += "<option value='" + categories[i].SKU_HIE_ID + "'>" + categories[i].SKU_HIE_NAME + "</option>";
    }
    $("#ddlCategoryOpenItem").html(listItems);
}
function LoadOpenItem() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/GetOpenItems", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ LocationID: $('select#ddlLocation option:selected').val() }),
                success: GetOpenItems,
                error: OnError
            }
        );
}
function GetOpenItems(products) {
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    products = JSON.stringify(products);
    document.getElementById("hfOpenItems").value = products;
    var lstProducts = document.getElementById("hfOpenItems").value;
    lstProducts = eval(lstProducts);
    for (var i = 0, len = lstProducts.length; i < len; ++i)
    {
        OpenItemValues.push(lstProducts[i].SKU_NAME);
    }
}
function loadAllProducts() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadAllProducts", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ LocationID: $('select#ddlLocation option:selected').val() }),
                success: sethfProductValue,
                error: OnError
            }
        );
}

function LoadAllModifiers() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadModifierItems", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: setModifierItems,
                error: OnError
            }
        );
}

function setModifierItems(products) {
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    products = JSON.stringify(products);
    document.getElementById("hfModifierItems").value = products;
}

function sethfProductValue(products) {
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    products = JSON.stringify(products);
    document.getElementById("hfProduct").value = products;
    loadProductCategory("btnMenuItem");
}
function LoadModifiers() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadModifiers", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ LocationID: $('select#ddlLocation option:selected').val() }),
                success: sethfModifiers,
                error: OnError
            }
        );
}
function sethfModifiers(products) {
    products = JSON.stringify(products);

    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));

    products = eval(result.d);
    products = JSON.stringify(products);
    document.getElementById("hfModifiers").value = products;
}

function loadProductCategory(obj) {
    var CategoryType = false;
    $("#hfCategoryType").val("0");
    //#region Modifier Button
    if (obj.id == "btnModifierItem") {
        if ($("#hfSkuId").val() == "") {
            Error("Plz Select Item in Menu");
            return;
        }
        CategoryType = true;
        $("#hfCategoryType").val("1");
        if (obj.id == "btnModifierItem") {
            document.getElementById('dvDealQty').style.display = "block";
            document.getElementById('dvDealUpdate').style.display = "block";
        }
        else {
            document.getElementById('dvDealQty').style.display = "none";
            document.getElementById('dvDealUpdate').style.display = "none";
        }
        document.getElementById('dv_lstModifyCategory').style.display = "block";
        document.getElementById('dv_lstModifyProducts').style.display = "block";
        document.getElementById('btnMenuItem').style.backgroundColor = "#eff2bd";
        document.getElementById('btnModifierItem').style.backgroundColor = "#d4def7";
        $('#divModifierParentName').html('');
        $('#divModifier').show("slow");

        $.ajax
     (
      {
          type: "POST", //HTTP method
          url: "frmOrderPOSCallCenter.aspx/LoadProductCategroy", //page/method name
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify({ ItemType: CategoryType, ItemId: $("#hfSkuId").val(), LocationID: $('select#ddlLocation option:selected').val() }),
          success: addModifierCategories,
          error: OnError
      }
     );
    }
        //#region Menu Button
    else {
        resetColor();
        $("#hfRow").val('');
        $("#hfRowIndex").val('');
        document.getElementById('btnModifierItem').style.backgroundColor = "#eff2bd";
        document.getElementById('btnMenuItem').style.backgroundColor = "#d4def7";
        document.getElementById('dv_lstModifyCategory').style.display = "none";
        document.getElementById('dv_lstModifyProducts').style.display = "none";
        document.getElementById('dv_lstCategory').style.display = "block";
        document.getElementById('dv_lstProducts').style.display = "block";
        a = document.getElementById("dv_lstCategory").children;
        if (a.length == 0) {
            $.ajax
           (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadProductCategroy", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ ItemType: CategoryType, ItemId: 0, LocationID: $('select#ddlLocation option:selected').val() }),
                success: addCategories,
                error: OnError
            }
           );
        }
    }
}
function LoadParentCategory() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadParentCategroy", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({}),
                success: GetParentCategory
            }
        );
}

function GetParentCategory(data) {

    data = eval(data.d);
    var listItems = "<option value='0'>Select Facility</option>";
    $("[id$='ddlParentCategory'] option").remove();
    for (var i = 0; i < data.length; i++) {
        listItems += "<option value='" + data[i].CAT_ID + "'>" + data[i].CAT_NAME + "</option>";
    }
    $("[id$='ddlParentCategory']").html(listItems);
}

//=======Product Closing Status on Item Click
function LoadProductStatus(skuId) {
    if ($("#hfStockStatus").val() == "True") {
        document.getElementById('dvClosingStock').style.display = "block";


        $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/LoadProductStatus", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ id: skuId, LocationID: $('select#ddlLocation option:selected').val() }),
                    success: ProductStatus,
                    error: OnError
                }
            );
    }
}

function ProductStatus(productStatus) {
    productStatus = JSON.stringify(productStatus);
    var result = jQuery.parseJSON(productStatus.replace(/&quot;/g, '"'));
    productStatus = eval(result.d);

    $("#txtClosingStock").val(0);

    if (productStatus.length != "0") {
        $("#txtClosingStock").val(productStatus[0].CLOSING_STOCK);
    }
}
//=======Selected Bill Detail
function GetPendingBill(saleInvoiceMasterId) {

    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/GetPendingBill", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "{'saleInvoiceMasterId':'" + saleInvoiceMasterId + "'}",
                success: LoadPendingBill
            }
        );
}
function LoadPendingBill(products) {   
    $('#hfCustomerAdvanceAmount').val(0);
    products = JSON.stringify(products);
    var result = jQuery.parseJSON(products.replace(/&quot;/g, '"'));
    products = eval(result.d);
    if (products.length > 0) {
        $("#hfDeliveryChannel4").val(products[0].DeliveryChannel);
        $("#hfAmountDue").val(products[0].AMOUNTDUE);
        $('#txtRemarks').val(products[0].REMARKS);
        if (products[0].CUSTOMER_TYPE_ID != 2 || products[0].SERVICE_CHARGES_TYPE == 1) {
            if (products[0].CustomerServiceCharges > 0) {
                $('#hfServiceType').val(products[0].CustomerServiceType);
                $('#txtService').val(products[0].CustomerServiceCharges);
                $('#txtService2').val(products[0].CustomerServiceCharges);
            }
            else
            {
                $('#hfServiceType').val(products[0].SERVICE_CHARGES_TYPE);
            }
        }
        $('#hfPaymentType').val(products[0].PAYMENT_MODE_ID);
        $('#hfPaymentType2').val(products[0].PAYMENT_MODE_ID);
        $('#ddlPaymentMode').val(products[0].PAYMENT_MODE_ID).change();
        $('#hfDeliveryChannelType').val(products[0].DELIVERY_CHANNEL);
        $("#MaxOrderNo").text(products[0].ORDER_NO);
        $('#txtDiscountReason2').val(products[0].DiscountRemarks);
        $('#txtDiscountReason').val(products[0].DiscountRemarks);
        if (document.getElementById("hfDiscountAuthentication").value == '1') {
            $('#txtDiscountAuthRemarks').val(products[0].DiscountRemarks);
            $('#txtDiscountReason2').val("");
            $('#txtDiscountReason').val("");
        }
        $('#hfInvoiceNo').val(products[0].InvoiceNo);
        if (products[0].IS_GST_VOID == false)
        {
            document.getElementById('hfIsGSTVoid').value = '0';
        }
        else {
            document.getElementById('hfIsGSTVoid').value = '1';
        }
        if (products[0].BANK_DISCOUNT_ID !== null)
        {
            if (parseInt(products[0].BANK_DISCOUNT_ID) > 0) {
                $('#ddlBankDiscount2').val(products[0].BANK_DISCOUNT_ID);
                $('#ddlBankDiscount').val(products[0].BANK_DISCOUNT_ID);
            }
        }
        $('#txtCreditCardNo2').val(products[0].CreditCardNo);
        $('#txtCreditCardNo').val(products[0].CreditCardNo);
        $('#txtCreditCardAccountTile2').val(products[0].CreditCardAccountTile);
        $('#txtCreditCardAccountTile').val(products[0].CreditCardAccountTile);
        $("#hfCustomerAdvanceAmount").val(products[0].AdvanceAmount);
        $("#hfCustomerGST").val(products[0].CustomerGST);
        $("#hfCustomerDiscount").val(products[0].CustomerDiscount);
        $("#hfCustomerDiscountType").val(products[0].CustomerDiscountType);
        $("#hfCustomerDiscount").val(products[0].CustomerServiceCharges);
        $("#hfCustomerDiscountType").val(products[0].CustomerServiceType);
        if(products[0].CustomerGST > 0)
        {
            $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
            document.getElementById('dvCustomerGST').style.display = "block";
        }
        else {
            document.getElementById('dvCustomerGST').style.display = "none";
        }
        if (products[0].CustomerDiscount > 0) {
            document.getElementById("hfDiscountType").value = products[0].CustomerDiscountType;
            document.getElementById('txtDiscount').value = products[0].CustomerDiscount;
            document.getElementById('txtDiscount2').value = products[0].CustomerDiscount;
            document.getElementById("percentage2").disabled = false;
            document.getElementById("value2").disabled = false;
            if (products[0].CustomerDiscountType == 1) {
                DiscType(document.getElementById("value2"));
            }
            else {
                DiscType(document.getElementById("percentage2"));
            }
        }

        if (products[0].CUSTOMER_TYPE_ID == 2) {
            $("#hfCustomerType").val('Delivery');
        }
        else {
            $("#hfCustomerType").val('Takeaway');
        }
    }
    $("#tble-ordered-products").empty();    
    $('#hfCustomerGroup').val(0);    
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfCounter").val(0);
    Modifierparent = [];
    for (var i = 0, len = products.length; i < len; ++i) {
        var obj = {};
        obj["ItemID"] = products[i].SKU_ID;
        obj["ParentID"] = products[i].MODIFIER_PARENT_ID;
        obj["ItemName"] = products[i].SKU_NAME;
        obj["Price"] = products[i].T_PRICE;
        obj["Qty"] = products[i].QTY;
        obj["ModifierParetn_Row_ID"] = products[i].ModifierParetn_Row_ID;
        obj["SALE_INVOICE_DETAIL_ID"] = products[i].SALE_INVOICE_DETAIL_ID;
        Modifierparent.push(obj);
    }
    for (var i = 0, len = products.length; i < len; ++i) {        
        addProductToOrderedProductIndent(products, i, $("#OrderNo1").text());
    }
    if (products.length > 0) {
        $('#hfIsNewItemAdded').val('0');
        HolderOrderClicke = 0;
    }
    $('#tble-ordered-products').find('tr').each(function () {
        var tdFree = $(this).find("td:eq(41)").text();
        if (tdFree == "1") {
            $(this).css({ "background-color": "yellow" });
        }
    });

    ModifierParentCounter = fnMaxModifierParent_Row_ID();

    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;    
    setTotals();
    $('#ddlBankDiscount2').change();
    $('#ddlBankDiscount').change();
}
//=======Pending Bills
function GetPendingBills() {
    $.ajax
       (
           {
               type: "POST", //HTTP method
               url: "frmOrderPOSCallCenter.aspx/SelectPendingBills", //page/method name
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: JSON.stringify({ customerType: document.getElementById("hfCustomerType").value, LocationID: $('select#ddlLocation option:selected').val() }),
               success: LoadPendingBills
           }
       );
}

function LoadPendingBills(pendingBills) {
    var data = $.parseJSON(pendingBills.d);
    var data2 = data.Table1;
    var data3 = data.Table2;
    pendingBills = data.Table;

    $("#tbl-pending-bills").empty();
    $("#tbl-pending-bills-detail").empty();
    var row = "";
    var rowDetail = "";
    for (var i = 0, len = pendingBills.length; i < len; i++) {
        rowDetail = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td>' + pendingBills[i].OrderStatus + '</td><td>' + pendingBills[i].INVOICE_ID + '</td><td>' + pendingBills[i].ORDER_TIME + '</td><td>' + pendingBills[i].CUSTOMER_NAME + '<br>' + pendingBills[i].CONTACT_NUMBER + '</td><td>' + pendingBills[i].CustomerAddress + '</td><td>' + pendingBills[i].PaymentMode + '</td></tr>');
        $("#tbl-pending-bills-detail").append(rowDetail);
        if (pendingBills[i].INVOICE_ID > 0) {
            if (pendingBills[i].SERVICE_TYPE == 'Delivery') {
                if ($('#hfOrderNOInPendingBills').val() == '1') {
                    if (pendingBills[i].MANUAL_ORDER_NO != '') {
                        if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {
                            if (pendingBills[i].DeliveryType == '1') {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
                            else {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {

                                    if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                        if ($("#hfEcommAlarm").val() == "false") {
                                            PlaySound();
                                        }
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                    else {
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {
                            if (pendingBills[i].DeliveryType == '1') {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
                            else {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                        if ($("#hfEcommAlarm").val() == "false") {
                                            PlaySound();
                                        }
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                    else {
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].ORDER_NO + '-' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (pendingBills[i].MANUAL_ORDER_NO != '') {
                        if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {
                            if (pendingBills[i].DeliveryType == '1') {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
                            else {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                        if ($("#hfEcommAlarm").val() == "false") {
                                            PlaySound();
                                        }
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                    else {
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (pendingBills[i].LOCKED || pendingBills[i].Order_Delivery_Status_ID === 3) {
                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="background-color: #f4e27e;" align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {
                            if (pendingBills[i].DeliveryType == '1') {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
                            else {
                                if (pendingBills[i].InvoicePrited == '1') {
                                    row = $('<tr style="background-color: #6699cc;"><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                        if ($("#hfEcommAlarm").val() == "false") {
                                            PlaySound();
                                        }
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                    else {
                                        row = $('<tr><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].DelChannel + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td align="center" onclick="SendSMS(this);"><a href="#"><span class="fa fa-mobile"></span></a></td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (pendingBills[i].MANUAL_ORDER_NO != '') {
                    if (pendingBills[i].LOCKED) {
                        if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                            row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: red;width:20px;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                        }
                        else {
                            if (pendingBills[i].FORM_ID == 7) {
                                row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: #f4e27e;width:20px;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + '-' + pendingBills[i].MANUAL_ORDER_NO + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: #f4e27e;width:20px;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            if (pendingBills[i].FORM_ID == 7) {
                                row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + '-' + pendingBills[i].MANUAL_ORDER_NO + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {
                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                if ($("#hfEcommAlarm").val() == "false") {
                                    PlaySound();
                                }
                                row = $('<tr><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + + '-' + pendingBills[i].MANUAL_ORDER_NO + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                if (pendingBills[i].FORM_ID == 7) {
                                    row = $('<tr><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + + '-' + pendingBills[i].MANUAL_ORDER_NO + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '-' + pendingBills[i].MANUAL_ORDER_NO + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
                        }
                    }
                }
                else {
                    if (pendingBills[i].LOCKED) {
                        if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                            row = $('<tr><td style="background-color: red;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: red;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: red;">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval" style="background-color: red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                        }
                        else {
                            if (pendingBills[i].FORM_ID == 7) {
                                row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: #f4e27e;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval" style="background-color: #f4e27e">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="background-color: #f4e27e;width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="background-color: #f4e27e;display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="background-color: #f4e27e;">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval" style="background-color: #f4e27e;">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px;color: red;background-color: #f4e27e">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (pendingBills[i].InvoicePrited == '1') {
                            if (pendingBills[i].FORM_ID == 7) {
                                row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                row = $('<tr style="background-color: #6699cc;"><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                        }
                        else {

                            if (pendingBills[i].FORM_ID == 7 && pendingBills[i].DeliveryType != 3) {
                                if ($("#hfEcommAlarm").val() == "false") {
                                    PlaySound();
                                }
                                row = $('<tr><td style="width:20px;color:red;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval" style="color:red">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval" style="color:red">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                            }
                            else {
                                if (pendingBills[i].FORM_ID == 7) {
                                    row = $('<tr><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].CUSTOMER_NAME + ' - ' + pendingBills[i].CONTACT_NUMBER + ' - ' + pendingBills[i].OrderBooker + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                                else {
                                    row = $('<tr><td style="width:20px;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].INVOICE_ID + '</td><td class="leftval">' + pendingBills[i].TABLE_NO3 + '</td><td class="rightval">' + pendingBills[i].TOTAL_NET_AMOUNT.toFixed(0) + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].DISCOUNT_TYPE + '</td><td style="display:none;">' + pendingBills[i].coverTable + '</td><td style="display:none;">' + pendingBills[i].orderBookerId + '</td><td style="display:none;">' + pendingBills[i].approvedBy + '</td><td style="display:none;">' + pendingBills[i].SERVICE_CHARGES + '</td><td style="font-size: 12px; color: red;">' + diff(pendingBills[i].TIME_STAMP, document.getElementById('ct').innerHTML) + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO2 + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].ORDER_NO + '</td><td style="display:none;">' + pendingBills[i].TABLE_ID + '</td><td style="display:none;">' + pendingBills[i].CONTACT_NUMBER + '</td><td style="display:none;">' + pendingBills[i].CARD_NO + '</td><td style="display:none;">' + pendingBills[i].CARD_TYPE_ID + '</td><td style="display:none;">' + pendingBills[i].CARD_POINTS + '</td><td style="display:none;">' + pendingBills[i].PURCHASING + '</td><td style="display:none;">' + pendingBills[i].AMOUNT_LIMIT + '</td><td style="display:none;">' + pendingBills[i].EmpDiscountType + '</td><td style="display:none;">' + pendingBills[i].LOCKED + '</td><td style="display:none;">' + pendingBills[i].LOCKED_BY + '</td><td style="display:none;">' + pendingBills[i].TABLE_NO + '</td><td style="display:none;">' + pendingBills[i].DelChannel + '</td><td style="display:none;">' + pendingBills[i].Order_Delivery_Status_ID + '</td><td style="display:none;">' + pendingBills[i].ITEM_DISCOUNT + '</td><td style="display:none;">' + pendingBills[i].ORDER_TIME + '</td><td style="display:none;">' + pendingBills[i].CUSTOMER_NAME + '</td><td style="display:none;">' + pendingBills[i].GroupID + '</td><td style="display:none;">' + pendingBills[i].AMOUNTDUE + '</td><td style="display:none;">' + pendingBills[i].CustomerAddress + '</td></tr>');
                                }
                            }
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

    if (data3.length != "0") {
        $("#lblCounter1").text("(" + data3[0].Takeaway + ")");
        $("#lblCounter2").text("(" + data3[0].Delivery + ")");
        $("#lblCounter3").text("(" + data3[0].DineIn + ")");
    }
}

//========== #endregion Load===================\\

$(document).ready(function () {
    $(document).on('keydown', '#tbl-customers tr', function (e) {
        var currentRow = $(this);
        var nextRow;

        // Check for the arrow key pressed
        switch (e.keyCode) {
            case 38: // Up arrow key
                nextRow = currentRow.prev('tr');
                if (nextRow.length) {
                    nextRow.focus();
                }
                else
                {
                    $('#txtPrimaryContact').focus();
                }
                break;
            case 40: // Down arrow key
                nextRow = currentRow.next('tr');
                if (nextRow.length) {
                    nextRow.focus();
                }
                break;
            case 13: // Enter key
                ClearCustomerData();
                e.stopImmediatePropagation();
                ShowCustomer(currentRow);
                $("#dvCustomerGrid").hide();
                break;
        }
    });

    // Function to add highlight class to the row when clicked
    $(document).on('click', '#tbl-customers tr', function (e) {
        ClearCustomerData();
        e.stopImmediatePropagation();
        var currentRow = $(this);
        ShowCustomer(currentRow);
        $("#dvCustomerGrid").hide();
    });

    $(document).on('keydown', '#txtPrimaryContact', function (e) {
        if (e.keyCode == 40) {
            if (("#tbl-customers tr").length > 0 && $('#dvCustomerGrid').is(':visible')) {
                $("#tbl-customers tr:first").focus();
            }
        }
    });

    if ($('#hfHidePrintInvoiceButton').val() == "1") {
        $("#PrintInvoice").hide();
    }
    LoadLocationDropDown();
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
        if (document.getElementById("hfCanVoidGST").value !== "True") {
            document.getElementById('lblGSTTotal2').style.cursor = "default";
        }
        document.getElementById("percentage2").disabled = true;
        document.getElementById("value2").disabled = true;
        document.getElementById("percentage").disabled = true;
        document.getElementById("value").disabled = true;
        if ($("#hfIS_CanGiveDiscount").val() == 'False') {
            document.getElementById("ddlDiscountType").disabled = true;
            document.getElementById("ddlDiscountType2").disabled = true;
        }
        $('#txtPrimaryContact').keyup(function () {
            var keyCode = event.key || event.which || event.keyCode;
            if ($('#txtPrimaryContact').val().length > 2) {
                if (parseInt($("#hfDeliveryChannel").val()) > 1) {
                    LoadAllCustomers("SearchThirdParty");
                }
                else {
                    LoadAllCustomers("Search");
                }
            }
            else if ($('#txtPrimaryContact').val().length < 3) {
                $('#hfCustomerId').val('0');
                $("#tbl-customers").empty();
                $("#dvCustomerGrid").hide();
            }
        });
        $('#txtSearchItem').keyup(function () {
            SearchItem($('#txtSearchItem').val());
        });
        $('#txtPendingBills').keyup(function () {
            $('#tbl-pending-bills tr').each(function (row, tr) {
                if ($(tr).find("td:eq(2)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())
                                       || $(tr).find("td:eq(3)").text().toUpperCase().includes($('#txtPendingBills').val().toUpperCase())) {
                    $(tr).show();
                }
                else {
                    $(tr).hide();
                }
            });
        });
        waitLoading('Loading');
        $(".nav-ic img").click(function () {
            $(".exit-text").slideToggle("slow", function () {
            });
        });
        UnlockRecord();
        LoadSections();
        LoadOpenItemCategory();
        GetItemLessCancelReason();
        if ($('#hfDefaultServiceType').val() !== '') {
            lnkCustomerType(null, $('#hfDefaultServiceType').val());
        }
        loadDiscountUser();
        document.getElementById('dvServiceChargesPayment2').style.display = "none";
        document.getElementById('divServiceChargesPayment').style.display = "none";
        document.getElementById('divServiceChargesPayment2').style.display = "none";
        document.getElementById('dvServiceCharges2').style.display = "none";
        document.getElementById('divServiceCharges').style.display = "none";
        document.getElementById('divServiceCharges2').style.display = "none";
        //On Pending Bill row Click
        $("#tbl-pending-bills").delegate("tr", "click", function () {
            ShowBill(this);
        });
        $("#tbl-pending-bills-detail").delegate("tr", "click", function () {
            var invoiceid = $(this).find("td:eq(0)").text();

            $('#tbl-pending-bills tr').each(function (row, tr) {
                let cellValue = $(tr).find("td:eq(0)").text();
                if (cellValue === invoiceid) {
                    $('#pending-bills-detail').trigger('close');
                    ShowBill($(tr));
                    return false;
                }
                
            });
        });
        $("#btnClose").click(function () {
            ClearOnCancel2();
            $('#popUpBill').hide("slow");
        });
        LoadEmployeeDiscountType();
        if ($('#hfShowParentCategory').val() === "1") {
            LoadParentCategory();
        }
        $('#ddlParentCategory').on("change.select2", function () {
            addCategories2(parseInt($('select#ddlParentCategory option:selected').val()));
        });
        $('#ddlLocation').on("change.select2", function () {
            LocationChanged($('select#ddlLocation option:selected').val());
        });
        $("#dvCustomerLedger").click(function () {
            document.getElementById('dvDeliveryChannel').style.display = 'block';
            document.getElementById('dvDeliveryChannelLablel').style.display = 'block';
            document.getElementById('divCustomer').style.visibility = 'visible';
            $('#txtPrimaryContact').focus();
            document.getElementById('dvDeliveryChannel').style.display = 'none';
            document.getElementById('dvDeliveryChannelLablel').style.display = 'none';
        });

        $(function () {
            $("#txtOpentItemName").autocomplete({
                source: OpenItemValues
            });
        });

    }
    else {
        alert("No Service Type assigned.!");
        location.href = 'Home.aspx';
    }
});
function ClearCustomerData()
{
    $('#hfCustomerId').val('0');
    $("#txtCustomerName").val('');
    $('#txtPrimaryContact').val('');
    $('#txtCustomerAddress').val('');
    $('#txtOtherContact').val('');
    $('#ddlGender').val(0);
    $('#ddlOccupation').val(0);
    $('#txtEmail').val('');
    $('#txtCustomerDOB').val('');
    $('#lblFirstOrderValue').text('');
    $('#lblLastOrderValue').text('');
    $('#lblOrdersValue').text('');
    $('#lblAmountValues').text('');
}
//#region Service Type Call in ShowBill
function LoadEmployeeDiscountType()
{    
    var lstDiscTypes = document.getElementById("hfEmployeeDiscountType").value;
    lstDiscTypes = eval(lstDiscTypes);
    var listItems = "";    
    for (var i = 0, len = lstDiscTypes.length; i < len; ++i) {
        listItems += "<option value='" + lstDiscTypes[i].EmployeeDiscountTypeID + "'>" + lstDiscTypes[i].DiscountTypeName + "</option>";
    }
    $("#ddlDiscountType").html(listItems);
    $("#ddlDiscountType2").html(listItems);
}
function SearchItem(name) {
    var dvLstProducts = document.getElementById("dv_lstProducts");
    while (dvLstProducts.hasChildNodes()) {
        dvLstProducts.removeChild(dvLstProducts.lastChild);
    }
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        if (lstProducts[i].MODIFIER == 0) {
            if (lstProducts[i].SKU_NAME.toLowerCase().indexOf(name.toLowerCase()) >= 0 && lstProducts[i].I_D_ID == 0) {
                var element = document.createElement("input");
                element.setAttribute("type", "button");
                element.setAttribute("value", lstProducts[i].SKU_NAME);
                element.setAttribute("name", lstProducts[i].CAT_ID);
                element.setAttribute("id", lstProducts[i].SKU_ID);
                element.setAttribute("class", "box-sm3");
                element.onclick = function () {
                    $("#hfSkuId").val(this.id);
                    addProductToOrderTable(this.id, this.name, 0);
                    changeProductClass(this);
                };
                dvLstProducts.appendChild(element);
            }
        }
    }
}
function activeLink() {
   $("#lnkTakeaway").removeClass("active");
    $("#lnkDelivery").removeClass("active");

    if ($("#hfCustomerType").val() == "Delivery") {
        $("#lnkDelivery").addClass("active");
        document.getElementById("hfCustomerType").value = "Delivery";

    } else if ($("#hfCustomerType").val() == "Takeaway") {
        $("#lnkTakeaway").addClass("active");
        document.getElementById("hfCustomerType").value = "Takeaway";
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
                if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                    if (uniqueDeals[j] == $(this).find("td:eq(21)").text()) {
                        if (count == 0) {
                            count += 1;
                            totalamount += parseFloat($(this).find("td:eq(20)").text()) * parseFloat($(this).find("td:eq(27)").text());
                        }
                        return;
                    }
                }
            });
        }
    }
    $("#DealPrice").text(totalamount);
}
function calculateDealDiscount() {
    if ($("#hfOrderedproducts").val() == '')
        return 0;

    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    var DealDiscount = 0;
    for (var j = 0; j < uniqueDeals.length; j++) {
        if (uniqueDeals[j] != 0) {
            var count = 0;
            $('#tble-ordered-products').find('tr').each(function () {
                if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                    if (uniqueDeals[j] == $(this).find("td:eq(21)").text()) {
                        if (count == 0) {
                            count += 1;
                            DealDiscount += parseFloat($(this).find("td:eq(57)").text());
                        }
                        return;
                    }
                }
            });
        }
    }
    return DealDiscount;
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
    var grandTotal = 0.0;
    var salesTax = 0;
    var itemdiscount = 0;
    var dealDiscount = calculateDealDiscount();
    if (parseFloat($('#hfCustomerGST').val()) > 0) {
        salesTax = $('#hfCustomerGST').val();
        document.getElementById('dvCustomerGST').style.display = "block";
    }
    else {
        document.getElementById('dvCustomerGST').style.display = "none";
        if ($('#hfPaymentType').val() == "1") {
            salesTax = document.getElementById("hfSalesTaxCreditCard").value;
        }
        else {
            salesTax = document.getElementById("hfSalesTax").value;
        }
    }
    if (salesTax == "") {
        salesTax = 0;
    }

    var discountType = "0";
    var discount = 0;
    if (parseFloat($('#hfCustomerDiscount').val()) > 0) {
        discountType = $('#hfCustomerDiscountType').val();
        discount = $('#hfCustomerDiscount').val();
    }
    else {
        discountType = document.getElementById("hfDiscountType").value;
        discount = document.getElementById('txtDiscount').value;
    }
    var servicecharges = $("#lblServiceChargesTotalPayment").text();
    if (discount == "") {
        discount = 0;
    }

    var balance = 0;
    if (servicecharges == "") {
        servicecharges = 0;
    }
    calculateDealPrice();

    subtotal = parseFloat($("#DealPrice").text());
    var ItemWiseGST = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if (parseFloat($(tr).find("td:eq(21)").text()) == 0) {
            if (checkVoid($(tr).find('td:eq(13)').text())) {
                if ($(tr).find('td:eq(41)').text() != "1") {
                    subtotal += parseFloat($(tr).find("td:eq(5)").text()) * parseFloat($(tr).find("td:eq(3) input").val());
                    ItemWiseGST += parseFloat($(tr).find("td:eq(50)").text());
                    itemdiscount += parseFloat($(tr).find("td:eq(51)").text());
                }
            }
        }
    });
    if ($('#hfItemWiseGST').val() == "1") {
        grandTotal = subtotal;
        salesTax = ItemWiseGST;
        balance = Math.round((parseFloat(salesTax) + parseFloat(servicecharges) + subtotal), 0);
    }
    else {
        if (parseFloat(discount) > 0) {
            if (discountType == "0") {
                grandTotal = subtotal;
                discount = grandTotal * (discount / 100);
                if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
                    salesTax = parseFloat(salesTax) / 100 * parseFloat(subtotal);
                }
                else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(subtotal) + parseFloat(servicecharges));
                }
                else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(subtotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
                }
                else {//On Gross - Discount
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(subtotal) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
                }
                balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)) + parseFloat(servicecharges) + parseFloat(salesTax)), 0);
            }
            else if (discountType == "1" || discountType == "2") {
                grandTotal = subtotal;
                if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
                    salesTax = parseFloat(salesTax) / 100 * subtotal;
                }
                else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(subtotal) + parseFloat(servicecharges));
                }
                else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
                    salesTax = parseFloat(salesTax) / 100 * (parseFloat(subtotal) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
                }
                else {//On Gross - Discount
                    salesTax = parseFloat(salesTax) / 100 * (subtotal - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
                }
                balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)) + parseFloat(servicecharges) + parseFloat(salesTax)), 0);
            }
        }
        else {
            grandTotal = subtotal;
            salesTax = (parseFloat(salesTax) / 100) * subtotal;
            balance = Math.round((parseFloat(salesTax) + parseFloat(servicecharges) + subtotal - (parseFloat(itemdiscount) + parseFloat(dealDiscount))), 0);
        }
    }

    if ($("#hfBillFormat").val() === "3") {
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
    checkAdvance("2");
    $("#lblDiscountTotal2").text(Math.round((parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)), 0));
    //----------Print Invoice PopUp--------------\\
    document.getElementById("subTotal2").innerHTML = Math.round(subtotal, 0);
    document.getElementById("lblGSTTotal2").innerHTML = Math.round(salesTax, 0);
    document.getElementById("GrandTotal2").innerHTML = Math.round(grandTotal, 0);    
    document.getElementById("lblPaymentDue2").innerHTML = Math.round(balance);
    $("#lblTotalNetAmount").text(balance);
    checkAdvance("1");
    if ($('#hfPaymentType').val() == "0") {
        if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0)
        {
            $('#txtCashRecieved').val(parseFloat(balance).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
        else {
            $('#txtCashRecieved').val(balance);
        }
    }
    else {
        $('#txtCashRecieved').val(0);
    }
}

function checkAdvance(type)
{
    if (type == "1") {
        document.getElementById('dvAdvanceLable2').style.display = "none";
        document.getElementById('dvAdvanceAmount2').style.display = "none";
        document.getElementById('dvBalanceLable2').style.display = "none";
        document.getElementById('dvBalanceAmount2').style.display = "none";
        if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
            document.getElementById('dvAdvanceLable2').style.display = "block";
            document.getElementById('dvAdvanceAmount2').style.display = "block";
            document.getElementById('dvBalanceLable2').style.display = "block";
            document.getElementById('dvBalanceAmount2').style.display = "block";
            $("#lblAdvance2").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
            $("#lblBalanceAmount2").text(parseFloat($("#lblPaymentDue2").text()).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
    }
    else
    {
        document.getElementById('dvAdvanceLable').style.display = "none";
        document.getElementById('dvAdvanceAmount').style.display = "none";
        document.getElementById('dvBalanceLable').style.display = "none";
        document.getElementById('dvBalanceAmount').style.display = "none";
        if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
            document.getElementById('dvAdvanceLable').style.display = "block";
            document.getElementById('dvAdvanceAmount').style.display = "block";
            document.getElementById('dvBalanceLable').style.display = "block";
            document.getElementById('dvBalanceAmount').style.display = "block";
            $("#lblAdvance").text(parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
            $("#lblBalanceAmount").text(parseFloat($("#lblPaymentDue").text()).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
    }
}
function UnlockRecord() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/UnlockRecord", //page/method name
                contentType: "application/json; charset=utf-8",
                success: UnloclRecordSuccess,
            }
        );
}

function UnloclRecordSuccess() {
}
//#region Modifier Button
function addModifierCategories(categories) {

    var dv_lstModifyCategory = document.getElementById("dv_lstModifyCategory");
    while (dv_lstModifyCategory.hasChildNodes()) {
        dv_lstModifyCategory.removeChild(dv_lstModifyCategory.lastChild);
    }

    categories = JSON.stringify(categories);
    var result = jQuery.parseJSON(categories.replace(/&quot;/g, '"'));
    categories = eval(result.d);

    var catId = 0;
    for (var i = 0, len = categories.length; i < len; ++i) {
        if (i == 0) {
            catId = categories[i].CAT_ID;
        }
        createModifierCategoriesButtons(categories[i].CAT_NAME, categories[i].CAT_ID);
    }

    createModifierProductButtons(catId, $("#hfCategoryType").val(), $("#hfSkuId").val());
}

function createModifierCategoriesButtons(value, id) {

    var element = document.createElement("input");
    element.setAttribute("type", "button");
    element.setAttribute("value", value);
    element.setAttribute("name", value);
    element.setAttribute("id", id);
    element.setAttribute("style", "width:99%;");
    element.setAttribute("class", "box-sm");

    element.onclick = function () { // Note this is a function

        document.getElementById('dvDealQty').style.display = "none";
        document.getElementById('dvDealUpdate').style.display = "none";

        createModifierProductButtons(this.id, $("#hfCategoryType").val(), $("#hfSkuId").val());
        changeClass(this);
    };

    var dv_lstModifyCategory = document.getElementById("dv_lstModifyCategory");
    dv_lstModifyCategory.appendChild(element);
}

function createModifierProductButtons(catId, type, skuId) {

    var dv_lstModifyProducts = document.getElementById("dv_lstModifyProducts");
    while (dv_lstModifyProducts.hasChildNodes()) {
        dv_lstModifyProducts.removeChild(dv_lstModifyProducts.lastChild);
    }

    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);

    var lstModifierProducts = document.getElementById("hfModifiers").value;
    lstModifierProducts = eval(lstModifierProducts);
    var arr = [];
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        //------------------------------------------------------------------
        if (lstProducts[i].I_D_ID == 0) {
            if (lstProducts[i].CAT_ID == catId && lstProducts[i].MODIFIER == type && lstProducts[i].SKU_ID == skuId) {

                //Create an input type dynamically.   
                var element = document.createElement("input");
                //Assign different attributes to the element. 
                element.setAttribute("type", "button");
                element.setAttribute("value", lstProducts[i].SKU_NAME);
                element.setAttribute("name", lstProducts[i].SKU_NAME);
                element.setAttribute("id", lstProducts[i].ModifierSKU_ID);
                arr.push(lstProducts[i].ModifierSKU_ID);
                element.setAttribute("style", "width:19.7%;background-color:" + lstProducts[i].BUTTON_COLOR);
                element.setAttribute("class", "box-sm3");
                element.onclick = function () { // Note this is a function
                    addProductToOrderTableModifier(this.id, catId, $("#hfModifierItemParentDealID").val());
                };
                dv_lstModifyProducts.appendChild(element);
            }
        }

    }

    //Packages   
    for (var i = 0, len = lstModifierProducts.length; i < len; ++i) {
        if (lstModifierProducts[i].I_D_ID == 0) {
            var id = 0;
            if (lstModifierProducts[i].CAT_ID == catId && lstModifierProducts[i].MODIFIER == type && lstModifierProducts[i].SKU_ID == skuId) {
                var bool = true;
                for (var arri = 0; arri < arr.length; arri++) {
                    if (arr[arri] == lstModifierProducts[i].ModifierSKU_ID) {
                        bool = false;
                        break;
                    }
                }
                if (bool) {//Create an input type dynamically.   
                    var element = document.createElement("input");
                    //Assign different attributes to the element. 
                    element.setAttribute("type", "button");
                    element.setAttribute("value", lstModifierProducts[i].SKU_NAME);
                    element.setAttribute("name", lstModifierProducts[i].SKU_NAME);
                    element.setAttribute("id", lstModifierProducts[i].ModifierSKU_ID);
                    element.setAttribute("style", "width:23%;background-color:" + lstModifierProducts[i].BUTTON_COLOR);
                    element.setAttribute("class", "box-sm3");
                    element.onclick = function () { // Note this is a function
                        addProductToOrderTableModifierPackage(this.id, catId, $("#hfModifierItemParentDealID").val());
                    };
                    dv_lstModifyProducts.appendChild(element);
                }
            }
        }
    }
}

//#region Menu Button
function addCategories(categories) {

    var categories2 = JSON.stringify(categories);
    var result = jQuery.parseJSON(categories2.replace(/&quot;/g, '"'));
    categories2 = eval(result.d);
    categories2 = JSON.stringify(categories2);
    document.getElementById("hfCategory").value = categories2;


    var dv_lstCategory = document.getElementById("dv_lstCategory");
    while (dv_lstCategory.hasChildNodes()) {
        dv_lstCategory.removeChild(dv_lstCategory.lastChild);
    }

    categories = JSON.stringify(categories);
    var result = jQuery.parseJSON(categories.replace(/&quot;/g, '"'));
    categories = eval(result.d);
    var catId = 0;
    var IsDealCategory = 0;
    for (var i = 0, len = categories.length; i < len; ++i) {
        if (i == 0) {
            catId = categories[i].CAT_ID;
            IsDealCategory = categories[i].IsDealCategory;
        }
        createCategoriesButtons(categories[i].CAT_NAME, categories[i].CAT_ID,categories[i].IsDealCategory);
    };
    createProductButtons(catId, $("#hfCategoryType").val(),IsDealCategory);
}

function addCategories2(ParentCategoryID) {
    var categories = document.getElementById("hfCategory").value;
    var dv_lstCategory = document.getElementById("dv_lstCategory");
    while (dv_lstCategory.hasChildNodes()) {
        dv_lstCategory.removeChild(dv_lstCategory.lastChild);
    }
    categories = eval(categories);
    var catId = 0;
    var IsDealCategory = 0;
    var count = 0;
    for (var i = 0, len = categories.length; i < len; ++i) {
        if (categories[i].IsDealCategory == 1 || categories[i].ParentCategoryID == ParentCategoryID || ParentCategoryID == 0) {
            if (count == 0) {
                catId = categories[i].CAT_ID;
                IsDealCategory = categories[i].IsDealCategory;
            }
            createCategoriesButtons(categories[i].CAT_NAME, categories[i].CAT_ID, categories[i].IsDealCategory);
            count++;
        }
    }
    createProductButtons(catId, $("#hfCategoryType").val(), IsDealCategory);
}


function createCategoriesButtons(value, id, IsDealCategory) {
    var element = document.createElement("input");
    element.setAttribute("type", "button");
    element.setAttribute("value", value);
    element.setAttribute("name", IsDealCategory);
    element.setAttribute("id", id);
    if (IsDealCategory === 1) {
        element.setAttribute("class", "box-sm4");
    }
    else {
        element.setAttribute("class", "box-sm");
    }
    element.onclick = function () { // Note this is a function

        if ($("#hfDealId").val() == "0") {
            document.getElementById('dvDealQty').style.display = "none";
            document.getElementById('dvDealUpdate').style.display = "none";
            createProductButtons(this.id, $("#hfCategoryType").val(),IsDealCategory);
            changeClass2(this);
        }
        else {
            if (CheckCatDealQty($("#hfDealId").val())) {
                document.getElementById('dvDealQty').style.display = "none";
                document.getElementById('dvDealUpdate').style.display = "none";
                createProductButtons(this.id, $("#hfCategoryType").val(), IsDealCategory);
                changeClass2(this);
            }
            else
            {
                Error("Plz complete your Deal");
            }
        }
    };
    var dvLstCategory = document.getElementById("dv_lstCategory");
    dvLstCategory.appendChild(element);
}

function createProductButtons(catId, type, IsDealCategory) {
    if (IsDealCategory == 0)
    {
        dvDealPanel.style.display = "none";
        dvProductsPanel.style.width = "49.5%";
    }
    else
    {
        dvDealPanel.style.display = "block";
        dvProductsPanel.style.width = "32.95%";
    }
    $('#hfDefaultCategoryID').val(catId);
    var dvLstProducts = document.getElementById("dv_lstProducts");
    while (dvLstProducts.hasChildNodes()) {
        dvLstProducts.removeChild(dvLstProducts.lastChild);
    }

    var dvLstSubCategory = document.getElementById("dv_lstSubCategory");
    while (dvLstSubCategory.hasChildNodes()) {
        dvLstSubCategory.removeChild(dvLstSubCategory.lastChild);
    }
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);

    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        //------------------------------------------------------------------
        if (lstProducts[i].I_D_ID == 0 && IsDealCategory ==0) {
            if (lstProducts[i].CAT_ID == catId && lstProducts[i].MODIFIER == type) {                
                //Create an input type dynamically.   
                var element = document.createElement("input");
                //Assign different attributes to the element. 
                element.setAttribute("type", "button");
                element.setAttribute("value", lstProducts[i].SKU_NAME);
                element.setAttribute("name", lstProducts[i].SKU_NAME);
                element.setAttribute("id", lstProducts[i].SKU_ID);
                element.setAttribute("class", "box-sm3");
                element.onclick = function () { // Note this is a function
                    //LoadProductStatus(this.id);
                    $("#hfSkuId").val(this.id);//FOR MODIFIER ITEMS
                    addProductToOrderTable(this.id, catId, 0);
                    changeProductClass(this);
                };
                dvLstProducts.appendChild(element);
            }
        }
            //------------------------------------------------------------------
        else if (lstProducts[i].I_D_ID != 0 && lstProducts[i].DEAL == 1) {
            if (lstProducts[i].I_D_ID == catId && lstProducts[i].MODIFIER == type) {
                var dealId = lstProducts[i].I_D_ID;
                var CatQty = lstProducts[i].Cat_Quantity;
                var IsCatRes = lstProducts[i].IS_CATEGORY_RESTRICTED;
                var MaxCatQty = lstProducts[i].MAX_CATEGORY;
                var element = document.createElement("input");
                element.setAttribute("type", "button");
                element.setAttribute("value", lstProducts[i].SKU_NAME);
                element.setAttribute("name", lstProducts[i].SKU_NAME);
                element.setAttribute("id", lstProducts[i].SKU_ID);
                element.setAttribute("class", "box-sm2");
                element.onclick = function () { // Note this is a function
                    //------------------------------------------------------------------
                    $('#hfDealId').val(dealId);
                    $("#hfcatId").val(this.id);
                    $('#txtDealQty').val(1);

                    document.getElementById('dvDealQty').style.display = 'block';
                    document.getElementById('dvDealUpdate').style.display = 'none';
                    $('#tble-ordered-products').find('tr').each(function () {
                        if (dealId == $(this).find("td:eq(21)").text()) {
                            document.getElementById('dvDealUpdate').style.display = 'block';
                            if ($(this).find("td:eq(27)").text() == "0") {
                                $('#txtDealQty').val("1");
                            }
                            else {
                                $('#txtDealQty').val(parseFloat($(this).find("td:eq(27)").text()));
                            }
                            return;
                        }
                    });
                    if (IsCatRes) {
                        alert(MaxCatQty);
                    }
                    createSubProductButtons(this.id, dealId, $("#hfCategoryType").val());
                    changeSubCatClass(this)
                };

                dvLstSubCategory.appendChild(element);
            }
        }

    }
}

function createSubProductButtons(catId, dealId, type) {

    var dvLstProducts = document.getElementById("dv_lstProducts");
    while (dvLstProducts.hasChildNodes()) {
        dvLstProducts.removeChild(dvLstProducts.lastChild);
    }
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);

    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        if (lstProducts[i].I_D_ID != 0 && lstProducts[i].DEAL == 0) {
            if (lstProducts[i].CAT_ID == catId && lstProducts[i].I_D_ID == dealId && lstProducts[i].MODIFIER == type) {
                var CatQty = lstProducts[i].Cat_Quantity;
                if (lstProducts[i].Is_ItemChoice == "0") {
                    if (ValidateDealQty()) {//First Validate
                        if (CheckItemDealQty(dealId, catId, lstProducts[i].SKU_ID, CatQty, lstProducts[i].QTY, 1)) {
                            addDealProductToOrderTable(lstProducts[i].SKU_ID, catId, dealId, $('#txtDealQty').val());
                        }
                        else {
                            break;
                        }
                    }
                }
                else {
                    //Create an input type dynamically.   
                    var element = document.createElement("input");
                    //Assign different attributes to the element. 
                    element.setAttribute("type", "button");
                    element.setAttribute("value", lstProducts[i].SKU_NAME);
                    element.setAttribute("name", lstProducts[i].QTY);
                    element.setAttribute("id", lstProducts[i].SKU_ID);
                    element.setAttribute("class", "box-sm3");
                    element.onclick = function () { // Note this is a function
                        //LoadProductStatus(this.id);
                        $("#hfSkuId").val(this.id);
                        if (ValidateDealQty()) {//First Validate

                            if (CheckItemDealQty(dealId, catId, this.id, CatQty, parseFloat(this.name), 2)) {
                                $("#hfSkuId").val(this.id);
                                addDealProductToOrderTable(this.id, catId, dealId, $('#txtDealQty').val());
                                changeProductClass(this);
                            }
                            $('#tble-ordered-products').find('tr').each(function () {//Show Update button if Deal Exist
                                if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                                    if (dealId == $(this).find("td:eq(21)").text()) {
                                        document.getElementById('dvDealUpdate').style.display = 'block';
                                        return;
                                    }
                                }
                            });
                        }
                    };
                    dvLstProducts.appendChild(element);
                }
            }
        }
    }
}
//-----------------------------------------------------------\\

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

    if (Id === undefined || Id === null) {
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
                $('#tble-ordered-products').find('tr').each(function () {
                    if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                        if (dealId == $(this).find("td:eq(21)").text() && lstProducts[i].DIV_ID == $(this).find("td:eq(14)").text()) {
ItemGridQty += parseFloat($(this).find("td:eq(3) input").val());

                            TotalCatQty += parseFloat($(this).find("td:eq(3) input").val());


                            if (count == 0) {
                                count++;
                                CatGridQty = parseFloat($(this).find("td:eq(27)").text()) * parseFloat($(this).find("td:eq(28)").text());
                                TotalCatGridQty += parseFloat($(this).find("td:eq(27)").text()) * parseFloat($(this).find("td:eq(28)").text());
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
        return false;
    }
    if (TotalCatGridQty > 0) {
        if (TotalCatQty != TotalCatGridQty) {
            return false;
        }
    }
    $("#hfDealId").val('0');
    return true;

}

//used in createSubProductButtons()
function CheckItemDealQty(dealId, catId, ItemId, CatQty, ItemQty, Type) {

    if ($("#tble-ordered-products tr").length > 0) {
        var flag = false;
        var flagmsg = "";
        var dealQty = 0;

        dealQty = $('#txtDealQty').val();

        $('#tble-ordered-products').find('tr').each(function () {
            if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                if (dealId == $(this).find("td:eq(21)").text() && catId == $(this).find("td:eq(14)").text()) {
                    if ($(this).find("td:eq(32)").text() == "0") {
                        if (ItemId != $(this).find("td:eq(0)").text()) {
                            flag = true;
                            return;
                        }
                        else {
                            ItemQty += parseFloat($(this).find("td:eq(3) input").val());
                        }
                    }
                    else {
                        ItemQty += parseFloat($(this).find("td:eq(3) input").val());
                    }
                }
            }
        });

        dealQty = dealQty * CatQty;

        $('#tble-ordered-products').find('tr').each(function () {
            if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                if (dealId == $(this).find("td:eq(21)").text() && catId == $(this).find("td:eq(14)").text()) {
                    dealQty = parseFloat($(this).find("td:eq(27)").text()) * parseFloat($(this).find("td:eq(28)").text());
                    return;
                }
            }
        });
        //--First Check Optional or Not
        if (flag) {

            Error("Cannot enter Optional Item");
            return false;
        }
        //--For Check Whole Deal
        if (ItemQty > dealQty) {
            ItemQty -= ItemQty;
            Error("Cannot enter Deal Qty is not equal with Item Qty");
            return false;
        }

        return true;
    }
    return true;
}

//Type used for checking click on Update button 
//1 for Updates
function CheckDealQty(dealId, catId, CatQty, Type) {

    var qty = 0;
    var dealQty = 0;

    $('#tble-ordered-products').find('tr').each(function () {
        if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
            if (dealId == $(this).find("td:eq(21)").text()) {
                qty += parseFloat($(this).find("td:eq(3) input").val());
            }
        }
    });
    //this type use on Update Deal Button Click
    if (Type == 1) {
        if (qty > $('#txtDealQty').val()) {
            Error("Deal Qty is not equal with Item Qty");
            return false;
        }
        return true;
    }


}

function UpdateDeal() {
    var dealId = $('#hfDealId').val();
    var tableData;
    $('#tble-ordered-products').find('tr').each(function () {

        if (dealId == $(this).find("td:eq(21)").text()) {
            if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                $(this).find("td:eq(27)").text($('#txtDealQty').val());

            }
        }
    });
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    //}
}
//End Deal Validation----------------------------------------------------------\\

//Loyalty region

function LoadLoyaltyCardDetail() {
    if ($('#txtLoyaltyCard').val() != "") {
        $.ajax
           (
               {
                   type: "POST", //HTTP method
                   url: "frmOrderPOSCallCenter.aspx/LoadLoyaltyCardDetail", //page/method name
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
                   url: "frmOrderPOSCallCenter.aspx/LoadLoyaltyCardDetail", //page/method name
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
            DiscType(document.getElementById("percentage"));
            $('#txtDiscount').val(cardNo[0].DISCOUNT);
            CalculateBalance();
        }
        else if (cardNo[0].CARD_TYPE_ID == "2") {//Reward Card for Customer
            var CurrentPoints = 0;
            document.getElementById('rowRewardCard').style.display = "block";
            $('#hfCardPurchasing').val(cardNo[0].PURCHASING);
            $('#txtRedeemedPoints').val(cardNo[0].POINTS);
            $('#hfCustomerId').val(cardNo[0].USER_ID);
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
            DiscType(document.getElementById("value"));
            $('#txtAllowedLimit').val(cardNo[0].AMOUNT_LIMIT);
            $('#txtDiscountAvail').val(cardNo[0].TotalDiscount);
            $('#txtDiscountBalance').val(parseFloat(cardNo[0].AMOUNT_LIMIT) - parseFloat(cardNo[0].TotalDiscount));
            if (parseFloat(cardNo[0].AMOUNT_LIMIT) - parseFloat(cardNo[0].TotalDiscount) < parseFloat($('#lblPaymentDue').text())) {
                $('#txtDiscount').val(parseFloat(cardNo[0].AMOUNT_LIMIT) - parseFloat(cardNo[0].TotalDiscount));
            }
            else {
                $('#txtDiscount').val(parseFloat($('#lblPaymentDue').text()));
            }
            CalculateBalance();
        }

        document.getElementById("txtDiscount").disabled = true;
        if (cardNo[0].CARD_TYPE_ID == "3" || cardNo[0].CARD_TYPE_ID == "2") {
            document.getElementById("txtDiscount").disabled = false;
        }
    }  
}

function DisableDiscount() {
    if ($('#txtLoyaltyCard').val() == "") {
        $('#dvDiscount2').find('*').prop('disabled', false);
        $('#txtDiscount2').val('');
        $('#txtDiscountReason2').val('');        
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
//Products Grid---------------------------------------------------------------\\
function addProductToOrderTable(skuId, catId, dealId) {
    $("#hfModifierItemParent").val(skuId);
    $("#hfModifierItemParentDealID").val(dealId);
    var tableData;
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    var discount = 0;
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        var flage = false;        
        if (lstProducts[i].SKU_ID == skuId && lstProducts[i].CAT_ID == catId && lstProducts[i].I_D_ID == dealId) {            
            var gstper = parseFloat(lstProducts[i].GSTPER);
            $('#tble-ordered-products').find('tr').each(function () {                
                var td1 = $(this).find("td:eq(0)").text();
                var tdcat = $(this).find("td:eq(14)").text();
                var tdDeal = -1;                
                if ($(this).find("td:eq(21)").text() != "") {
                    tdDeal = $(this).find("td:eq(21)").text();//finding dealID
                }
                if (skuId == td1 && catId == tdcat && tdDeal == dealId && lstProducts[i].IsUnGroup == false) {
                    discount = CalculatePromotion(skuId, parseFloat($(this).find("td:eq(3) input").val()) + 1, parseFloat($(this).find("td:eq(5)").text()));
                    if (!lstProducts[i].IsSaleWeight) {
                        var color = $(this).find("td:eq(1)").css("color");//finding color for modifier 
                        var next = $(this).next().find("td:eq(0)").text();//finding for modifier next row 
                        if (checkVoid($(this).find("td:eq(13)").text()) && ($(this).find("td:eq(41)").text() != "1")) {//CHECK IS VOID OR NOT AND NOT IS_FREE(Not Comlimentary Item)
                            if ($("#hfRow").val() == "") {//check row is selected or not if select not then update previous else add new
                                if (color == "rgb(255, 0, 0)") {
                                    if (next != "") {
                                        flage = false;
                                    }
                                    else {
                                        if ($(this).find("td:eq(21)").text() == "0") {//when item_deal_id=0
                                            $(this).find("td:eq(51)").text(discount);
                                            $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + 1);
                                            if ($(this).find('td:eq(41)').text() != "1") {
                                                $(this).find("td:eq(6)").text(parseFloat($(this).find("td:eq(5)").text()) * parseInt($(this).find("td:eq(3) input").val()) - parseInt($(this).find("td:eq(51)").text()));
                                            }
                                            else
                                            {
                                                $(this).find("td:eq(6)").text(0);
                                            }
                                            if ($("#OrderNo1").text() == "N/A") {
                                                $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                            }                                            
                                            $(this).find("td:eq(50)").text(parseInt($(this).find("td:eq(6)").text()) * gstper / 100);                                            
                                        }
                                        else {
                                            if (lstProducts[i].Is_CatChoice == "0") {
                                                $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                                if ($("#OrderNo1").text() == "N/A") {
                                                    $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                                }                                                
                                            }
                                            else {
                                                $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + 1);
                                                if ($("#OrderNo1").text() == "N/A") {
                                                    $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                                }
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
                                    if ($(this).find("td:eq(19)").text() == "2") {//WHEN DIVISION IS VALUE BASE
                                        $(this).find("td:eq(5) input").val(parseFloat($(this).find("td:eq(5) input").val()) + parseFloat($(this).find("td:eq(20)").text()));
                                        $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(5) input").val()) / parseFloat($(this).find("td:eq(20)").text()));
                                        if ($("#OrderNo1").text() == "N/A") {
                                            $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                        }                                        
                                    }
                                    else {
                                        if (dealId == "0") {//when item_deal_id=0
                                            $(this).find("td:eq(51)").text(discount);
                                            $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + 1);
                                            if ($(this).find('td:eq(41)').text() != "1") {
                                                $(this).find("td:eq(6)").text(parseFloat($(this).find("td:eq(5)").text()) * parseInt($(this).find("td:eq(3) input").val()) - parseInt($(this).find("td:eq(51)").text()));
                                            }
                                            else
                                            {
                                                $(this).find("td:eq(6)").text(0);
                                            }
                                            if ($("#OrderNo1").text() == "N/A") {
                                                $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                            }
                                            $(this).find("td:eq(50)").text(parseInt($(this).find("td:eq(6)").text()) * gstper / 100);
                                        }
                                        else {
                                            if (lstProducts[i].Is_CatChoice == "1") {
                                                $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                                if ($("#OrderNo1").text() == "N/A") {
                                                    $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                                }
                                            }
                                            else {
                                                $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + 1);
                                                if ($("#OrderNo1").text() == "N/A") {
                                                    $(this).find("td:eq(42)").text($(this).find("td:eq(3) input").val());
                                                }
                                            }
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
                }
            });
            if (lstProducts[i].IsSaleWeight) {
                addProductToOrderedProduct(lstProducts, i, $("#OrderNo1").text());
                break;
            }
            else {
                if (flage) break;
                addProductToOrderedProduct(lstProducts, i, $("#OrderNo1").text());
                break;
            }
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
    
    var now = new Date();
    var time = now.toLocaleTimeString();
    now = now.getTime();
    now = `/Date(${now})/`;
    var row = "";
    var tprice = 0;
    var amount = 0;
    var gstamount = 0;
    var discountDeal = 0;
    var discount = 0;
    discount = CalculatePromotion(lstProducts[i].SKU_ID, 1, lstProducts[i].T_PRICE);
    if (lstProducts[i].T_PRICE.toString().indexOf(".") == -1) {
        tprice = lstProducts[i].T_PRICE;
        amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount);
    }
    else {
        tprice = parseFloat(lstProducts[i].T_PRICE).toFixed(2);
        amount = (parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount)).toFixed(2);
    }
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(amount) / 100;
    var ModifierParetn_Row_ID = ModifierParentCounter++;

    if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
        if (invoiceId == "N/A") {
            if (lstProducts[i].IsSaleWeight) {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
        }
        else {
            if (lstProducts[i].IsSaleWeight) {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
        }
    }
    else {
        if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
            if (lstProducts[i].MODIFIER == "0" && lstProducts[i].MODIFIERPackage == 0) {//CHECK IS MODIFIER OR NOT IF NOT THEN
                if (invoiceId == "N/A") {
                    if (lstProducts[i].IsSaleWeight) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                    }
                    else {
                        if (lstProducts[i].IsUnGroup) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (lstProducts[i].IsSaleWeight) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                    }
                    else {
                        if (lstProducts[i].IsUnGroup) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                }
            }
            else {
                if (lstProducts[i].T_PRICE == "0") {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;"></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;"></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;"></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;"></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
                    }
                }
            }
        }
        else {
            if (lstProducts[i].MODIFIER == "1" || lstProducts[i].MODIFIERPackage > 0) {
                if (lstProducts[i].T_PRICE == "0") {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                }
            }
            else {
                if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px;><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                            }
                        }
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

    if (lstProducts[i].INVOICE_ID == 'N/A' || parseFloat(lstProducts[i].INVOICE_ID) <= 0) {
        if (lstProducts[i].IS_HasMODIFIER == "1") {
            $('#btnModifierItem').trigger("click");            
            $('#divModifier').show("slow");
            $('#divModifierParentName').html(lstProducts[i].SKU_NAME);
            hfModifierParetn_Row_ID = ModifierParetn_Row_ID;
        }
    }
}
function addProductToOrderedProductOpenItem(itemID,price,qty) {
    var row = "";
    var tprice = 0;
    var amount = 0;
    var gstamount = 0;
    var discount = 0;
    discount = 0;
    var now = new Date();    
    now = now.getTime();
    now = `/Date(${now})/`;

    if (price.toString().indexOf(".") == -1) {
        tprice = price;
        amount = parseFloat(price) * parseFloat(qty);
    }
    else {
        tprice = parseFloat(price).toFixed(2);
        amount = parseFloat(price) * parseFloat(qty).toFixed(2);
    }
    gstamount = 0;
    var ModifierParetn_Row_ID = 0;
    row = $('<tr><td style="display:none;">' + itemID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + $("#txtOpentItemName").val() + '</td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + qty + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + "N/A" + '</td><td style="display:none;">' + qty + '</td><td style="display:none;">' + $("#ddlSectionOpenItem").val() + '</td><td style="display:none;">' + $("#ddlSectionOpenItem").text() + '</td><td style="display:none;">' + 1 + '</td><td style="display:none;">' + "false" + '</td><td style="display:none;">' + $("#ddlCategoryOpenItem").val() + '</td><td style="display:none;">' + "N/A" + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + $("#txtOpentItemName").val() + '</td><td style="display:none;">' + 1 + '</td><td style="display:none;">' + 1 + '</td><td style="display:none;">' + price + '</td><td style="display:none;">' + 0 + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + 1 + '</td><td style="display:none;"></td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + "N/A" + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + qty + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + now + '</td></tr>');
  

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
function addProductToOrderedProductIndent(lstProducts, i, invoiceId) {

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

    var ModifierParetn_Row_ID = lstProducts[i].ModifierParetn_Row_ID;
    var time = lstProducts[i].TIME_STAMP2;
    var row = "";
    var tprice = 0;
    var amount = 0;
    var gstamount = 0;
    var discount = 0;
    if (lstProducts[i].IS_FREE == "0") {
        discount = CalculatePromotion(lstProducts[i].SKU_ID, lstProducts[i].QTY, lstProducts[i].T_PRICE);
    }
    if (lstProducts[i].T_PRICE.toString().indexOf(".") == -1) {
        tprice = lstProducts[i].T_PRICE;
        amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount);
    }
    else {
        tprice = parseFloat(lstProducts[i].T_PRICE).toFixed(2);
        amount = (parseFloat(lstProducts[i].AMOUNT)- parseFloat(discount)).toFixed(2);
    }
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(amount) / 100;
    if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
        if (invoiceId == "N/A") {
            if (lstProducts[i].IsSaleWeight) {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
            }
        }
        else {
            if (lstProducts[i].IsSaleWeight) {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + tprice + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
            }
        }
    }
    else {
        if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
            if (lstProducts[i].MODIFIER == "0" && lstProducts[i].MODIFIERPackage == 0) {//CHECK IS MODIFIER OR NOT IF NOT THEN
                if (invoiceId == "N/A") {
                    if (lstProducts[i].IsSaleWeight) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                    }
                    else {
                        if (lstProducts[i].IsUnGroup) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (lstProducts[i].IsSaleWeight) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                    }
                    else {
                        if (lstProducts[i].IsUnGroup) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                }
            }
            else {
                if (lstProducts[i].T_PRICE == "0") {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;"></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;"></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;"></td> <td style="display:none;"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display:none;"></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + tprice + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].DEFAULT_QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + tprice + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
                    }
                }
            }
        }
        else {
            if (lstProducts[i].MODIFIER == "1" || lstProducts[i].MODIFIERPackage > 0) {
                if (lstProducts[i].T_PRICE == "0") {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display: none;"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display: none;"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                }
            }
            else {
                if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                    }
                }
                else {
                    if (invoiceId == "N/A") {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
                    }
                    else {
                        if (lstProducts[i].IsSaleWeight) {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;"  disabled></td><td align="center"></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><<td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                        }
                        else {
                            if (lstProducts[i].IsUnGroup) {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center"><span style="margin-right: 5px;><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center"><span style="margin-left: 5px;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                            else {
                                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span><br> <span style="color: #E91E63;">' + lstProducts[i].ItemComments + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">' + lstProducts[i].DeliveryType + '</td><td style="display:none;">' + lstProducts[i].SALE_INVOICE_DETAIL_ID + '</td><td style="display:none;">' + lstProducts[i].IS_FREE + '</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + lstProducts[i].MODIFIER_PARENT_ID + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;">' + lstProducts[i].ItemComments + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + lstProducts[i].TIME_STAMP3 + '</td><td style="display:none;">' + lstProducts[i].DISCOUNTDeal + '</td></tr>');
                            }
                        }
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

    if (lstProducts[i].INVOICE_ID == 'N/A' || parseFloat(lstProducts[i].INVOICE_ID) <= 0) {
        if (lstProducts[i].IS_HasMODIFIER == "1") {
            $('#btnModifierItem').trigger("click");
            $('#divModifier').show("slow");
            $('#divModifierParentName').html(lstProducts[i].SKU_NAME);
            hfModifierParetn_Row_ID = ModifierParetn_Row_ID;
        }
    }
}
function addDealProductToOrderTable(skuId, catId, dealId, DealQty) {
    $("#hfModifierItemParent").val(skuId);
    $("#hfModifierItemParentDealID").val(dealId);
    var tableData;
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        var flag = false;
        var gstper = parseFloat(lstProducts[i].GSTPER);
        if (lstProducts[i].SKU_ID == skuId && lstProducts[i].CAT_ID == catId && lstProducts[i].I_D_ID == dealId) {
            $('#tble-ordered-products').find('tr').each(function () {
                var td1 = $(this).find("td:eq(0)").text();
                var tdcat = $(this).find("td:eq(14)").text();
                var tddealId = $(this).find("td:eq(21)").text();
                if (skuId == td1 && catId == tdcat && dealId == tddealId && lstProducts[i].IsUnGroup == false) {
                    var color = $(this).find("td:eq(1)").css("color");//finding color for modifier 
                    var next = $(this).next().find("td:eq(0)").text();//finding for modifier next row 
                    if (checkVoid($(this).find("td:eq(13)").text())) {//CHECK IS VOID OR NOT
                        if ($("#hfRow").val() == "") {//check row is selected or not if select not then update previous else add new
                            if (color == "rgb(255, 0, 0)") {
                                if (next != "") {
                                    flag = false;
                                }
                                else {
                                    if (lstProducts[i].Is_CatChoice == "0") {
                                        $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                    }
                                    else {
                                        $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                    }
                                    tableData = storeTblValues();
                                    tableData = JSON.stringify(tableData);
                                    document.getElementById('hfOrderedproducts').value = tableData;
                                    flag = true;
                                }
                            }
                            else {//check for Modifier if row exist after then add new else update previous
                                if (lstProducts[i].Is_CatChoice == "1") {
                                    $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                }
                                else {
                                    $(this).find("td:eq(3) input").val(parseFloat($(this).find("td:eq(3) input").val()) + lstProducts[i].QTY);
                                }
                                tableData = storeTblValues();
                                tableData = JSON.stringify(tableData);
                                document.getElementById('hfOrderedproducts').value = tableData;
                                flag = true;
                            }
                        }
                    }
                }
            });
            if (flag) break;
            addDealProductToOrderedProduct(lstProducts, i, $("#OrderNo1").text(), DealQty);
            break;
        }
    }
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;

    setTotals();
}
function addDealProductToOrderedProduct(lstProducts, i, invoiceId, DealQty) {

    //--------------------For Maintaing Counter-----By Hassan---------------------------------------\\
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
    var gstamount = 0;    
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(lstProducts[i].AMOUNT) / 100;
    var discount = 0;
    var discountDeal = 0;
    discountDeal = CalculatePromotion(lstProducts[i].I_D_ID, DealQty, lstProducts[i].A_PRICE);
    var row = "";
    var ModifierParetn_Row_ID = ModifierParentCounter++;
    if (lstProducts[i].I_D_ID != "0") {//WHEN DEALS IS ON 
        if (lstProducts[i].MODIFIER == "1" || lstProducts[i].MODIFIERPackage > 0) {
            if (lstProducts[i].T_PRICE == "0") {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + 1 + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td style="display: none;" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + DealQty + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + DealQty + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
        }
        else {
            if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" ><span style="margin-right: 5px; cursor: pointer;" ><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;" ><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + DealQty + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
            else {
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"  ><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + lstProducts[i].AMOUNT + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + lstProducts[i].I_D_ID + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + DealQty + '</td><td style="display:none;">' + lstProducts[i].Cat_Quantity + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstProducts[i].DEFAULT_QTY + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + ModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
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

    if (lstProducts[i].INVOICE_ID == 'N/A' || parseFloat(lstProducts[i].INVOICE_ID) <= 0) {
        if (lstProducts[i].IS_HasMODIFIER == "1") {
            $('#btnModifierItem').trigger("click");
            $('#divModifier').show("slow");
            $('#divModifierParentName').html(lstProducts[i].SKU_NAME);
            hfModifierParetn_Row_ID = ModifierParetn_Row_ID;
        }
    }
}
function addProductToOrderTableModifier(skuId, catId, dealId) {
    var tableData;
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    var ItemName = "";
    var ModifierQty = 0;
    var UOM = "";
    var lstModifer = document.getElementById("hfModifierItems").value;
    lstModifer = eval(lstModifer);

    for (var j = 0, len2 = lstModifer.length; j < len2; ++j) {
        for (var i = 0, len = lstProducts.length; i < len; ++i) {
            var flage = false;
            if (lstProducts[i].SKU_ID == skuId && lstProducts[i].CAT_ID == catId && dealId == $("#hfDealId").val() && $("#hfModifierItemParent").val() == lstModifer[j].SKU_ID && skuId == lstModifer[j].ModifierSKU_ID) {
                ItemName = lstProducts[i].SKU_NAME;
                UOM = lstModifer[j].Stock_Unit;
                if (flage) break;
                addProductToOrderedProductModifier(lstProducts, i, $("#OrderNo1").text(), $('#txtDealQty').val());
                break;
            }
        }
    }
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
}
function addProductToOrderedProductModifier(lstProducts, i, invoiceId, dealQty) {
    var lstModifer = document.getElementById("hfModifierItems").value;
    lstModifer = eval(lstModifer);
    var ItemName = "";
    var UOM = "";
    var ModifierQty = 0;
    var gstamount = 0;
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(lstProducts[i].AMOUNT) / 100;
    var discount = 0;
    discount = CalculatePromotion(lstProducts[i].SKU_ID, 1, lstProducts[i].T_PRICE);
    var amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount);
    for (var j = 0, len = lstModifer.length; j < len; ++j) {
        if (lstModifer[j].ModifierSKU_ID == lstProducts[i].SKU_ID && $("#hfModifierItemParent").val() == lstModifer[j].SKU_ID) {

            ItemName = lstProducts[i].SKU_NAME;
            UOM = lstModifer[j].Stock_Unit;
            ModifierQty = lstModifer[j].Default_Qty;

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

            var row = "";
            if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + lstProducts[i].T_PRICE + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
            }
            else {
                if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 

                    if (lstProducts[i].MODIFIER == "0" && lstProducts[i].MODIFIERPackage == 0) {//CHECK IS MODIFIER OR NOT IF NOT THEN
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + $hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                    }
                    else {
                        if (lstProducts[i].T_PRICE == "0") {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input  type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + lstProducts[i].T_PRICE + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                        }
                    }
                }
                else {
                    if (lstProducts[i].MODIFIER == "1" || lstProducts[i].MODIFIERPackage > 0) {
                        if (lstProducts[i].T_PRICE == "0") {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display: none;" align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display: none;" class="table-text2">' + 0 + '</td><td style="display: none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                        }
                    }
                    else {

                        if (lstProducts[i].Is_ItemChoice == "1") {//WHEN DEALS IS ON AND IS_DEFAULT SET TO TRUE  
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);" ><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
                        }
                        else {
                            row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '</td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;"  disabled></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td align="center" onclick="AddRow(this);"><a href="#"><span class="fa fa-pencil-square-o"></span></a></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td align="center" onclick="AddComment(this);"><a href="#"><span class="fa fa-pencil"></span></a></td><td style="display:none;"></td><td style="display:none;"></td></tr>');
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

            if (lstProducts[i].INVOICE_ID == 'N/A' || parseFloat(lstProducts[i].INVOICE_ID) <= 0) {
                if (lstProducts[i].IS_HasMODIFIER == "1") {
                    $('#btnModifierItem').trigger("click")
                    $('#divModifier').show("slow");
                }
            }

            var obj = {};
            obj["ItemID"] = lstProducts[i].SKU_ID;
            obj["ParentID"] = $("#hfModifierItemParent").val();
            obj["ItemName"] = ItemName;
            obj["Price"] = lstProducts[i].T_PRICE;
            obj["Qty"] = lstProducts[i].QTY;
            obj["ModifierParetn_Row_ID"] = $('#hfModifierParetn_Row_ID ').val();
            Modifierparent.push(obj);

            $("#modifierMessage").css("display", "block");
            $("#modifierMessage").html(' ' + ItemName + ' ' + ModifierQty + ' ' + UOM + ' added successfully.');
            $("#modifierMessage").delay(500).fadeOut("slow");

            break;
        }
    }
}
function addProductToOrderTableModifierPackage(skuId, catId, dealId) {
    var tableData;
    var lstProducts = document.getElementById("hfProduct").value;
    lstProducts = eval(lstProducts);
    var ItemName = "";
    var ModifierQty = 0;
    var UOM = "";
    var lstModifer = document.getElementById("hfModifiers").value;
    lstModifer = eval(lstModifer);

    for (var j = 0, len2 = lstModifer.length; j < len2; ++j) {
        for (var i = 0, len = lstProducts.length; i < len; ++i) {
            var flage = false;
            if (lstProducts[i].SKU_ID == parseInt(skuId) && lstProducts[i].CAT_ID == catId && dealId == $("#hfDealId").val() && $("#hfModifierItemParent").val() == lstModifer[j].SKU_ID && parseInt(skuId) == lstModifer[j].ModifierSKU_ID) {
                ItemName = lstProducts[i].SKU_NAME;
                UOM = lstModifer[j].Stock_Unit;
                if (flage) break;
                addProductToOrderedProductModifierPackage(lstProducts, i, $("#OrderNo1").text(), $('#txtDealQty').val());
                break;
            }
        }
    }
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
}
function addProductToOrderedProductModifierPackage(lstProducts, i, invoiceId, dealQty) {
    var lstModifer = document.getElementById("hfModifierItems").value;
    lstModifer = eval(lstModifer);

    var now = new Date();
    var time = now.toLocaleTimeString();
    now = now.getTime();
    now = `/Date(${now})/`;
    var ItemName = "";
    var UOM = "";
    var ModifierQty = 0;
    var gstamount = 0;
    gstamount = parseFloat(lstProducts[i].GSTPER) * parseFloat(lstProducts[i].AMOUNT) / 100;
    var discount = 0;
    var discountDeal = 0;
    discount = CalculatePromotion(lstProducts[i].SKU_ID, 1, lstProducts[i].T_PRICE);
    var amount = parseFloat(lstProducts[i].AMOUNT) - parseFloat(discount);
    for (var j = 0, len = lstModifer.length; j < len; ++j) {
        if (lstModifer[j].ModifierSKU_ID == lstProducts[i].SKU_ID && $("#hfModifierItemParent").val() == lstModifer[j].SKU_ID) {
            ItemName = lstProducts[i].SKU_NAME;
            UOM = lstModifer[j].Stock_Unit;
            ModifierQty = lstModifer[j].Default_Qty;

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

            var row = "";
            if (lstProducts[i].DIV_ID == "2") {//WHEN DIVISION IS VALUE BASE FOR ALIALFAZAL
                row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstProducts[i].QTY + '"  style="text-align: center;" disabled ></td><td align="center"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td><input type="text" size="4" onkeyup="plusAmount(this);" onkeypress="return onlyDotsAndNumbers(this, event);" value="' + lstProducts[i].T_PRICE + '"></td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
            }
            else {
                if (lstProducts[i].I_D_ID == "0") {//WHEN DEALS IS OFF 
                    if (lstProducts[i].T_PRICE == "0" || lstProducts[i].IsPackage) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display:none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display:none;"><input  type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td style="display:none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display:none;" class="table-text2">' + lstProducts[i].T_PRICE + '</td><td style="display:none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + lstProducts[i].T_PRICE + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                    }
                }
                else {
                    if (lstProducts[i].T_PRICE == "0" || lstProducts[i].IsPackage) {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td class="table-text2" style="color: red" colspan="6" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td style="display: none;" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td style="display: none;" align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td style="display: none;" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td style="display: none;" class="table-text2">' + 0 + '</td><td style="display: none;" class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
                    }
                    else {
                        row = $('<tr><td style="display:none;">' + lstProducts[i].SKU_ID + '</td><td style="color: red" class="table-text2" ondblclick="AddRowFree(this);">' + lstProducts[i].SKU_NAME + '<span style="color:red"> - ' + time + '</span></td><td align="center" onclick="plusQty(this);"><span style="margin-right: 5px; cursor: pointer;"><img src="../images/plus.png"></span></td> <td align="center"><input type="text" size="2" value="' + lstModifer[j].Default_Qty + '"  style="text-align: center;" disabled ></td><td align="center" onclick="decreaseItem(this);"><span style="margin-left: 5px; cursor: pointer;"><img src="../images/minus.png"></span></td><td class="table-text2">' + 0 + '</td><td class="table-text2">' + amount + '</td><td align="center" onclick="deleteItem(this);"><a href="#"><span class="fa fa-times"></span></a></td><td style="display:none;">' + lstProducts[i].PRINTER + '</td><td style="display:none;">' + lstProducts[i].PR_COUNT + '</td><td style="display:none;">' + lstProducts[i].SEC_ID + '</td><td style="display:none;">' + lstProducts[i].SECTION + '</td><td style="display:none;">' + lstProducts[i].C1 + '</td><td style="display:none;">' + lstProducts[i].VOID + '</td><td style="display:none;">' + lstProducts[i].CAT_ID + '</td><td style="display:none;">' + invoiceId + '</td><td style="display:none;">' + lstProducts[i].IS_DESC + '</td><td style="display:none;">' + lstProducts[i].DESC + '</td><td style="display:none;">' + lstProducts[i].PRINT + '</td><td style="display:none;">' + lstProducts[i].DIV_ID + '</td><td style="display:none;">' + lstProducts[i].A_PRICE + '</td><td style="display:none;">' + $("#hfModifierItemParentDealID").val() + '</td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].C2 + '</td><td style="display:none;">' + lstProducts[i].H + '</td><td style="display:none;">' + lstProducts[i].intDealID + '</td><td style="display:none;">' + lstProducts[i].lngDealDetailID + '</td><td style="display:none;">' + lstProducts[i].DEAL_QTY + '</td><td style="display:none;">' + dealQty + '</td><td style="display:none;">' + lstProducts[i].Is_CatChoice + '</td><td style="display:none;">' + lstProducts[i].Is_ItemChoice + '</td><td style="display:none;">' + lstProducts[i].Is_Optional + '</td><td style="display:none;">' + lstProducts[i].DEAL_NAME + '</td><td style="display:none;">' + lstProducts[i].UOM_ID + '</td><td style="display:none;">' + lstProducts[i].intStockMUnitCode + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleOperator + '</td><td style="display:none;">' + lstProducts[i].Stock_to_SaleFactor + '</td><td style="display:none;">' + lstModifer[j].Default_Qty + '</td><td style="display:none;">' + lstProducts[i].IS_HasMODIFIER + '</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">0</td><td style="display:none;">' + lstProducts[i].ORIGINAL_QTY + '</td><td style="display:none;">' + lstProducts[i].PRINT_QTY + '</td><td style="display:none;">' + lstProducts[i].MODIFIER + '</td><td style="display:none;">' + $("#hfModifierItemParent").val() + '</td><td style="display:none;">' + 0 + '</td><td style="display:none;">' + lstProducts[i].SortOrder + '</td><td style="display:none;">' + hfModifierParetn_Row_ID + '</td><td style="display:none;">' + lstProducts[i].GSTPER + '</td><td style="display:none;">' + gstamount + '</td><td style="display:none;">' + discount + '</td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;">' + lstProducts[i].SKU_NAME + '</td><td style="display:none;">' + now + '</td><td style="display:none;">' + discountDeal + '</td></tr>');
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

            if (lstProducts[i].INVOICE_ID == 'N/A' || parseFloat(lstProducts[i].INVOICE_ID) <= 0) {
                if (lstProducts[i].IS_HasMODIFIER == "1") {
                    $('#btnModifierItem').trigger("click")
                    $('#divModifier').show("slow");
                }
            }

            var obj = {};
            obj["ItemID"] = lstProducts[i].SKU_ID;
            obj["ParentID"] = $("#hfModifierItemParent").val();
            obj["ItemName"] = ItemName;
            obj["Price"] = lstProducts[i].T_PRICE;
            obj["Qty"] = lstProducts[i].QTY;
            obj["ModifierParetn_Row_ID"] = $('#hfModifierParetn_Row_ID ').val();
            Modifierparent.push(obj);

            $("#modifierMessage").css("display", "block");
            $("#modifierMessage").html(' ' + ItemName + ' ' + ModifierQty + ' ' + UOM + ' added successfully.');
            $("#modifierMessage").delay(500).fadeOut("slow");

            break;
        }
    }
}

function fnMaxModifierParent_Row_ID() {
    var max = 0;
    $('#tble-ordered-products tr').each(function () {
        var val = $(this).find('td:eq(48)').text();
        val = parseInt(val, 10);
        if (!isNaN(val) && val > max) {
            max = val;
        }
    });
    return max + 1;
}
//WHEN DIVISION IS VALUE BASE
function plusAmount(obj) {
    rowIndex = obj.closest('tr');
    var price = parseFloat($(rowIndex).find('td:eq(5) input').val());
    if (obj.value != "") {
        var tprice = parseFloat($(rowIndex).find('td:eq(20)').text());
        $(rowIndex).find('td:eq(3) input').val(parseFloat(price / tprice).toFixed(2));
        var amount = parseFloat(price).toFixed(2);
        if ($(rowIndex).find('td:eq(41)').text() != "1") {
            $(rowIndex).find('td:eq(6)').text(amount);
        }
        else
        {
            $(rowIndex).find('td:eq(6)').text(0);
        }
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
    var rowIndex = $(obj).parent();
    if (checkVoid($(rowIndex).find('td:eq(13)').text())) {
        var qty = parseFloat($(rowIndex).find('td:eq(3) input').val());
        qty = qty + 1;
        var discount = CalculatePromotion(parseInt($(rowIndex).find('td:eq(0)').text()), qty, parseFloat($(rowIndex).find('td:eq(5)').text()));
        $(rowIndex).find("td:eq(51)").text(parseFloat(discount));

        $(rowIndex).find('td:eq(3) input').val(qty);
        var price = $(rowIndex).find('td:eq(5)').text();
        var amount = (parseFloat(qty * price) - parseFloat(discount)).toFixed(2);
        if ($(rowIndex).find('td:eq(41)').text() != "1") {
            $(rowIndex).find('td:eq(6)').text(amount);
        }
        else
        {
            $(rowIndex).find('td:eq(6)').text(0);
        }
        $(rowIndex).find('td:eq(50)').text(amount * parseFloat($(rowIndex).find('td:eq(49)').text()) /100 );
        if ($("#OrderNo1").text() == "N/A") {
            $(rowIndex).find('td:eq(42)').text($(rowIndex).find('td:eq(3) input').val());
        }
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
    $(obj).closest('tr').addClass('selected');
    var ModifierParetn_Row_ID = $(rowIndex).find('td:eq(48)').text();
    $("#hfSkuId").val($(rowIndex).find('td:eq(0)').text());
    $("#hfModifierItemParent").val($(rowIndex).find('td:eq(0)').text());
    $("#hfModifierItemParentDealID").val('0');
    if ($(rowIndex).find('td:eq(38)').text() == "true" || $(rowIndex).find('td:eq(38)').text() == "1") {
        $('#btnModifierItem').trigger("click");
        $('#divModifier').show("slow");
        $('#divModifierParentName').html($(rowIndex).find('td:eq(1)').text());
        hfModifierParetn_Row_ID = ModifierParetn_Row_ID;
    }

}
function AddComment(obj)
{
    var rowIndex = $(obj).parent();
    rowIndexComments = $(obj).parent().index();
    var ItemName = $(rowIndex).find('td:eq(1)').text();
    $('#hfskuId').val($(rowIndex).find('td:eq(0)').text());
    $('#ItemCommentPopuplblHeader').text(ItemName);
    $('#txtItemCommentPopupComment').val($(rowIndex).find('td:eq(53)').text());
    $('#ItemCommentPopup').show();
    $('#txtItemCommentPopupComment').focus();
}
//-----------------------------------------------------------------------------\\

function storeTblValues() {
    var tableData = new Array();
    $('#tble-ordered-products tr').each(function (row, tr) {        
        if ($(tr).find('td:eq(19)').text() == "2") {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "SKU_NAME": $(tr).find('td:eq(1)').text(),
                //2 for +
                "QTY": $(tr).find('td:eq(3) input').val(),
                //4 for -
                "T_PRICE": $(tr).find('td:eq(5) input').val(),
                "AMOUNT": $(tr).find('td:eq(6)').text(),
                //7 column is of delete button
                "PRINTER": $(tr).find('td:eq(8)').text(),
                "PR_COUNT": $(tr).find('td:eq(9)').text(),
                "SEC_ID": $(tr).find('td:eq(10)').text(),
                "SECTION": $(tr).find('td:eq(11)').text(),
                "C1": $(tr).find('td:eq(12)').text(),
                "VOID": $(tr).find('td:eq(13)').text(),
                "CAT_ID": $(tr).find('td:eq(14)').text(),
                "INVOICE_ID": $(tr).find('td:eq(15)').text(),                
                "DESC": $(tr).find('td:eq(17)').text(),
                "PRINT": $(tr).find('td:eq(18)').text(),
                "A_PRICE": $(tr).find('td:eq(20)').text(),
                "I_D_ID": $(tr).find('td:eq(21)').text(),
                //22 column for Selection
                "C2": $(tr).find('td:eq(23)').text(),
                "intDealID": $(tr).find('td:eq(25)').text(),
                "lngDealDetailID": $(tr).find('td:eq(26)').text(),
                "DEAL_QTY": $(tr).find('td:eq(27)').text(),
                "DEAL_NAME": $(tr).find('td:eq(32)').text(),
                "UOM_ID": $(tr).find('td:eq(33)').text(),
                "intStockMUnitCode": $(tr).find('td:eq(34)').text(),
                "Stock_to_SaleOperator": $(tr).find('td:eq(35)').text(),
                "Stock_to_SaleFactor": $(tr).find('td:eq(36)').text(),
                "DEFAULT_QTY": $(tr).find('td:eq(37)').text(),
                "IS_HasMODIFIER": $(tr).find('td:eq(38)').text(),
                "DeliveryType": $(tr).find('td:eq(39)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(40)').text(),
                "IS_FREE": $(tr).find('td:eq(41)').text(),
                "ORIGINAL_QTY": $(tr).find('td:eq(42)').text(),
                "PRINT_QTY": $(tr).find('td:eq(43)').text(),
                "MODIFIER": $(tr).find('td:eq(44)').text(),
                "MODIFIER_PARENT_ID": $(tr).find('td:eq(45)').text(),
                "LessCancelReasonID": $(tr).find('td:eq(46)').text(),
                "SortOrder": $(tr).find('td:eq(47)').text(),
                "ModifierParetn_Row_ID": $(tr).find('td:eq(48)').text(),
                "GSTPER": $(tr).find('td:eq(49)').text(),
                "ItemWiseGST": $(tr).find('td:eq(50)').text(),
                "DISCOUNT": $(tr).find('td:eq(51)').text(),
                "ItemComments": $(tr).find('td:eq(53)').text(),
                "ItemType": $(tr).find('td:eq(54)').text(),
                //55 For TimeStamp
                "TIME_STAMP": $(tr).find('td:eq(55)').text(),
                //56 for DISCOUNTDeal
                "DISCOUNTDeal": $(tr).find('td:eq(56)').text()
            }
        }
        else {
            tableData[row] = {
                "SKU_ID": $(tr).find('td:eq(0)').text(),
                "SKU_NAME": $(tr).find('td:eq(1)').text(),
                //2 for +
                "QTY": $(tr).find('td:eq(3) input').val(),
                //4 for-
                "T_PRICE": $(tr).find('td:eq(5)').text(),
                "AMOUNT": $(tr).find('td:eq(6)').text(),
                //7 column is of delete button
                "PRINTER": $(tr).find('td:eq(8)').text(),
                "PR_COUNT": $(tr).find('td:eq(9)').text(),
                "SEC_ID": $(tr).find('td:eq(10)').text(),
                "SECTION": $(tr).find('td:eq(11)').text(),
                "C1": $(tr).find('td:eq(12)').text(),
                "VOID": $(tr).find('td:eq(13)').text(),
                "CAT_ID": $(tr).find('td:eq(14)').text(),
                "INVOICE_ID": $(tr).find('td:eq(15)').text(),
                "DESC": $(tr).find('td:eq(17)').text(),
                "PRINT": $(tr).find('td:eq(18)').text(),
                "A_PRICE": $(tr).find('td:eq(20)').text(),
                "I_D_ID": $(tr).find('td:eq(21)').text(),
                //22 column for Selection
                "C2": $(tr).find('td:eq(23)').text(),
                "intDealID": $(tr).find('td:eq(25)').text(),
                "lngDealDetailID": $(tr).find('td:eq(26)').text(),
                "DEAL_QTY": $(tr).find('td:eq(27)').text(),
                "DEAL_NAME": $(tr).find('td:eq(32)').text(),
                "UOM_ID": $(tr).find('td:eq(33)').text(),
                "intStockMUnitCode": $(tr).find('td:eq(34)').text(),
                "Stock_to_SaleOperator": $(tr).find('td:eq(35)').text(),
                "Stock_to_SaleFactor": $(tr).find('td:eq(36)').text(),
                "DEFAULT_QTY": $(tr).find('td:eq(37)').text(),
                "IS_HasMODIFIER": $(tr).find('td:eq(38)').text(),
                "DeliveryType": $(tr).find('td:eq(39)').text(),
                "SALE_INVOICE_DETAIL_ID": $(tr).find('td:eq(40)').text(),
                "IS_FREE": $(tr).find('td:eq(41)').text(),
                "ORIGINAL_QTY": $(tr).find('td:eq(42)').text(),
                "PRINT_QTY": $(tr).find('td:eq(43)').text(),
                "MODIFIER": $(tr).find('td:eq(44)').text(),
                "MODIFIER_PARENT_ID": $(tr).find('td:eq(45)').text(),
                "LessCancelReasonID": $(tr).find('td:eq(46)').text(),
                "SortOrder": $(tr).find('td:eq(47)').text(),
                "ModifierParetn_Row_ID": $(tr).find('td:eq(48)').text(),
                "GSTPER": $(tr).find('td:eq(49)').text(),
                "ItemWiseGST": $(tr).find('td:eq(50)').text(),
                "DISCOUNT": $(tr).find('td:eq(51)').text(),
                "ItemComments": $(tr).find('td:eq(53)').text(),
                "ItemType": $(tr).find('td:eq(54)').text(),
                //55 For TimeStamp
                "TIME_STAMP": $(tr).find('td:eq(55)').text(),
                //56 for DISCOUNTDeal
                "DISCOUNTDeal": $(tr).find('td:eq(56)').text()
            }
        }
    });
    return tableData;
}

function storeTblValuesPrint(products) {
    var tableData = new Array();
    for (var i = 0, len = products.length; i < len; i++)
    {
        tableData[i] = {
            "SKU_ID": products[i].SKU_ID,
            "SALE_INVOICE_ID": products[i].SALE_INVOICE_ID
            }
    }
    return tableData;
}


//Call on Pending Bills Row Click, And on HoldOrder Save When Takeaway
function ShowBill(tr) {
    $("#OrderTime4").text($(tr).find("td:eq(30)").text());
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    if ($(tr).find("td:eq(24)").text() == "1") {
        Error('This record is locked by ' + $(tr).find("td:eq(25)").text());
        return;
    }
    if ($("#hfCustomerType").val() == "Delivery")
    {
        if ($(tr).find("td:eq(28)").text() == "3") {
            Error('This record is locked by rider');
            return;
        }
        $("#OrderTime4").text($(tr).find("td:eq(31)").text());
    }
    $("#lblDelChannel").text('');
    $("#lblDelChannel3").text('');
    if (($("#lnkDelivery").attr("class")) == "box active") {
        $("#lblDelChannel").text('Delivery by: ' + $(tr).find("td:eq(28)").text());
        $("#lblDelChannel3").text('Delivery by: ' +$(tr).find("td:eq(28)").text());
    }
    $("#lblDelChannel2").text('');
    if (($("#lnkDelivery").attr("class")) == "box active") {
        $("#lblDelChannel2").text('Delivery by: ' + $(tr).find("td:eq(28)").text());
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
        $("#OrderNo1").text($(tr).find("td:eq(1)").text());
        $("#OrderTime").text($(tr).find("td:eq(30)").text());
        $("#OrderTime3").text($(tr).find("td:eq(30)").text());        
        $("#MaxOrderNo").text($(tr).find("td:eq(15)").text());
        $("#hfTableId").val($(tr).find("td:eq(16)").text());
            $("#hfTableNo").val($(tr).find("td:eq(27)").text());
        $("#txtTakeawayCustomer").val($(tr).find("td:eq(26)").text());

        var amountDue = $(tr).find("td:eq(33)").text();
        var discount = 0;
        var itemdiscount = 0;
        discount = $(tr).find("td:eq(4)").text();
        if (discount == 'null') {
            discount = 0;
        }
        $('#txtDiscountAuth').val(discount);
        itemdiscount = parseFloat($(tr).find("td:eq(29)").text());

        $("#TableNo1").text($(tr).find("td:eq(12)").text());

        $("#hfCustomerId").val($(tr).find("td:eq(13)").text());
        $("#hfCustomerNo").val($(tr).find("td:eq(17)").text());

        //region Loyalty
        $("#txtLoyaltyCard").val($(tr).find("td:eq(18)").text());
        $("#txtLoyaltyCard2").val($(tr).find("td:eq(18)").text());
        $("#hfCardTypeId").val($(tr).find("td:eq(19)").text());
        $("#hfCardPoints").val($(tr).find("td:eq(20)").text());
        $("#hfCardPurchasing").val($(tr).find("td:eq(21)").text());
        $('#hfCardAmountLimit').val($(tr).find("td:eq(22)").text());
        //endregion Loyalty
        $("#txtLoyaltyCard").blur();
        $("#txtLoyaltyCard2").blur();

        $("#InvoiceTable").text($(tr).find("td:eq(14)").text());
        $('#hfDiscountType').val($(tr).find("td:eq(5)").text());
        $('#hfchkDiscountType').val($(tr).find("td:eq(5)").text());
        try {
            $('#ddlDiscountType').val($(tr).find("td:eq(23)").text());
            $('#ddlDiscountType2').val($(tr).find("td:eq(23)").text());

        } catch (e) {
            $('#ddlDiscountType').val(1);
            $('#ddlDiscountType2').val(1);
        }

        $('#ddlDiscountType').change();
        $('#ddlDiscountType2').change();        

        if ($(tr).find("td:eq(8)").text() != "null") {
            $('#txtDiscountReason2').val($(tr).find("td:eq(8)").text());
            $('#txtDiscountReason').val($(tr).find("td:eq(8)").text());
        }
        else {
            $('#txtDiscountReason2').val('');
            $('#txtDiscountReason').val('');
        }
        if ($(tr).find("td:eq(9)").text() != "-1") {
            $('#txtService').val($(tr).find("td:eq(9)").text());
            $('#txtService2').val($(tr).find("td:eq(9)").text());            
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
        document.getElementById("hfNotificationStop").value = "1";
        StopSound();        
        GetPendingBill($(tr).find("td:eq(1)").text());        
        calculateDiscount(discount, itemdiscount, amountDue);
        $('#hfDisable').val("1");

        var listItems = "";
        $("[id$='ddlCustomer'] option").remove();
		
		if(document.getElementById("hfCustomerType").value == "Delivery")
        {
			listItems = "<option value='" + $(tr).find("td:eq(13)").text() + "'>" + $(tr).find("td:eq(32)").text() + "</option>";
			$("[id$='ddlCustomer']").html(listItems);
			$('#hfCustomerAddress').val($(tr).find("td:eq(35)").text());
		}
		else{
			listItems = "<option value='" + $(tr).find("td:eq(13)").text() + "'>" + $(tr).find("td:eq(31)").text() + "</option>";
			$("[id$='ddlCustomer']").html(listItems);
			$('#hfCustomerAddress').val($(tr).find("td:eq(34)").text());
		}
		$('#hfCustomerGroup').val($(tr).find("td:eq(33)").text());
		
    }
    document.getElementById('hfCheckSMS').value = "0";
}
function EmptyCustomerDDL()
{
    var listItems = "";
    $("[id$='ddlCustomer'] option").remove();
    listItems = "<option value='0'>Select Customer</option>";
    $("[id$='ddlCustomer']").html(listItems);
    $("[id$='ddlCustomer']").val(0);
}
function NewOrder() {
    ModifierParentCounter = 1;
    $('#ddlPaymentMode').val('-1').change();
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $("#hfDiscountRemarks").val('');
    $('#hfPaymentType').val('0');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();    
    $('#hfIsNewItemAdded').val('0');
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    GetPendingBills();
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    $("#hfCustomerId").val("0");
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    $("#OrderNo1").text("N/A");
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $("#txtTakeawayCustomer").val('');
    $("#hfCounter").val(0);
    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    UnlockRecord();
}
//#region Printing

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
//#endregion Printing Section 

function UpdatePrintRecord(Items)
{
    $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/UpdatePrintRecords", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: Items}),
                    success: PrintDone,
                    error: OnHoldError,                    
                });
}
function PrintDone()
{

}
// #region HoldOrder
function HoldOrder() {
    //When Dine IN Active
    if (($("#lnkDelivery").attr("class")) == "box active") {
        if (($("#hfCustomerId").val() == "0")) {
            Error("Please select customer");
            return;
        }
    }
    SaveOrder();
}

$('#dvHold').click(function (e) {
    if ($("#OrderNo1").text() != "N/A")
    {
        Error("Order can not be update.");
        return;
    }
    $("#lblServiceChargesTotalPayment").text('0');
    if (document.getElementById("hfIsKOTMandatory").value == "1") {
        if (document.getElementById("hfIsKOTUniquePerDay").value == "1") {
            CheckKOTNo();
        }
        else {
            fnHoldOrder();
        }
    }
    else {
        fnHoldOrder();
    }
});

$('#dvPendings').click(function (e) {
    $('#pending-bills-detail').lightbox_me({
        centered: true,
        onLoad: function () {
            
        }
    });
});
function CheckKOTNo() {
    $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/CheckKOTNo", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ manualOrderNo: '', isOldOder: document.getElementById("hfIsOldOrder").value, OldOrderID: $("#OrderNo1").text() }),
                    success: GetKOTNo,
                    error: OnHoldError,
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
    var customerid = "0";
    try {
        customerid = $('select#ddlCustomer option:selected').val();

    } catch (e) {
        customerid = "0";
    }
    if (customerid === undefined) {
        customerid = "0";
    }
    var flag = true;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            flag = CheckCatDealQty($(tr).find('td:eq(21)').text());
            if(!flag)
            {
                return false;
            }
        }
    });
    if (flag) {
        var table = document.getElementById('tble-ordered-products');
        if (table.rows.length == 0) {
            Error("Please enter Items");
            return;
        }
        
        if (($("#lnkDelivery").attr("class")) == "box active" || $("#hfCustomerMandatoryOnPOS").val() == "1") {
            $('#hfServiceType').val($("#hfDELIVERY_CHARGES_TYPE").val());
            ServiceChargesType = document.getElementById("hfDELIVERY_CHARGES_TYPE").value;
            customerid = $("#hfCustomerId").val();
            if (($("#hfCustomerId").val() == "0")) {
                Error("Please select customer");
                if (($("#lnkDelivery").attr("class")) == "box active") {
                    document.getElementById('dvDeliveryChannel').style.display = 'none';
                    document.getElementById('dvDeliveryChannelLablel').style.display = 'none';
                    document.getElementById('divCustomer').style.visibility = 'visible';
                }
                else {
                    document.getElementById('divCustomer').style.visibility = 'visible';
                    document.getElementById('dvDeliveryChannel').style.display = 'none';
                    document.getElementById('dvDeliveryChannelLablel').style.display = 'none';
                }
                $('#txtPrimaryContact').focus();
                return;
            }

            if ($('select#ddlPaymentMode option:selected').val() == '-1') {
                Error("Select MOP");
                return;
            }
        }

        var salesTax = 0;
        var subtotal = 0;
        var ItemWiseGST = 0;
        var itemdiscount = 0;
        $('#tble-ordered-products tr').each(function (row, tr) {
            if ($(tr).find("td:eq(13)").text() == 'false') {
                if ($(tr).find('td:eq(21)').text() == '0') {
                    if ($(tr).find('td:eq(41)').text() != "1") {
                        subtotal += parseFloat($(tr).find("td:eq(6)").text());
                        ItemWiseGST += parseFloat($(tr).find("td:eq(50)").text());
                        itemdiscount += parseFloat($(tr).find("td:eq(51)").text());
                    }
                }
            }
        });
        if ($('#hfItemWiseGST').val() == "1") {
            salesTax = ItemWiseGST;            
        }
        else {
            if (parseFloat($('#hfCustomerGST').val()) > 0) {
                salesTax = $('#hfCustomerGST').val();
                $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
                document.getElementById('dvCustomerGST').style.display = "block";
            }
            else {
                document.getElementById('dvCustomerGST').style.display = "none";
                salesTax = document.getElementById("hfSalesTax").value;
            }
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
        if (me.data('requestRunning')) {
            return;
        }
        me.data('requestRunning', true);
        $("#dvHold").attr("disabled", true);        
        var ChannelValue = 0;
        try {
            ChannelValue = $("#hfDeliveryChannel").val();
        } catch (ex) {
            ChannelValue = 0;
        }
        $.ajax
                ({
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/HoldOrder", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), orderBooker: 0, coverTable: 0, customerType: document.getElementById("hfCustomerType").value, CustomerName: customerid, maxOrderNo: $("#MaxOrderNo").text(), printType: document.getElementById("hfBookingType").value, tableName: 0, takeAwayCustomer: $("#txtTakeawayCustomer").val(), bookerName: '', tabId: 0, CustomerNo: document.getElementById("hfCustomerNo").value, VoidBy: $('#hfVoidBy').val(), manualOrderNo: '', remarks: $("#txtRemarks").val(), Gst: $("#lblGSTTotal").text(), Customer: document.getElementById("hfCustomerName").value, delChannel: ChannelValue, serviceCharges: ServiceChargesType, formid: 5, AdvanceAmount: $('#hfCustomerAdvanceAmount').val(), CustomerGST: $('#hfCustomerGST').val(), CustomerDiscount: $('#hfCustomerDiscount').val(), CustomerDiscountType: $('#hfCustomerDiscountType').val(), CustomerServiceCharges: $('#hfCustomerServiceCharges').val(), CustomerServiceType: 0, LocationID: $('select#ddlLocation option:selected').val(), PaymentMode: $('select#ddlPaymentMode option:selected').val() }),
                    success: OrderSaved,
                    error: OnHoldError,
                    complete: function () {
                        $("#dvHold").attr("disabled", false);
                        me.data('requestRunning', false);

                    }
                });        
    }
    else
    {
        Error("Plz complete your Deal");
    }
}

function IsModifierDeleted(orderedProducts,ModifierID)
{
    var ModifierDeleted = false;
    for (var i = 0, len = orderedProducts.length; i < len; i++)
    {
        if(orderedProducts[i].SKU_ID == ModifierID && orderedProducts[i].VOID == "true")
        {
            ModifierDeleted = true;
            break;
        }
    }
    return ModifierDeleted;
}
function PrintFullKOTIndent() {
    var orderedProducts = $("#hfOrderedproducts").val();
    orderedProducts = eval(orderedProducts);
    var sNO = 0;
    var sNoCancel = 0;
    var sNoLess = 0;
    var arr = [];
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
    //For Deal Printing
    var uniqueDeals = $.unique(orderedProducts.map(function (d) { return d.I_D_ID; }));
    uniqueDeals = uniqueDeals.sort();
    uniqueDeals = unique(uniqueDeals);
    //for (var jj = 0; jj < uniqueDeals.length; jj++) {
    //    if (uniqueDeals[jj] != 0) {
    //        var count = 0;
    //        for (var ii = 0, len = orderedProducts.length; ii < len; ii++) {
    //            var IS_VOID = orderedProducts[ii].VOID;
    //            if (IS_VOID == "false") {
    //                if (uniqueDeals[jj] == orderedProducts[ii].I_D_ID) {
    //                    if (count == 0) {
    //                        count += 1;
    //                        var row = $('<tr ><td></td><td>' + orderedProducts[ii].DEAL_NAME + '</td><td class="text-right">' + orderedProducts[ii].QTY + '</td></tr>');
    //                        $('#detail-section-skus').append(row);
    //                    }
    //                    break;
    //                }
    //            }
    //        }
    //    }
    //}
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        arr.push(orderedProducts[i].SKU_ID);
    }
    for (var i = 0, len = orderedProducts.length; i < len; i++) {
        if (orderedProducts[i].PRINT == "true") {
            var qty = orderedProducts[i].QTY - orderedProducts[i].PR_COUNT;
            var IS_VOID = orderedProducts[i].VOID;
            if (IS_VOID == "false") {
                if (qty > 0 || orderedProducts[i].IS_HasMODIFIER == "1") {
                    $("#tblAddItem").css("display", "block");
                    if (orderedProducts[i].INVOICE_ID != 'N/A') {
                        if (document.getElementById("hfIsOldOrder").value === "1") {
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
                    }
                    $("#Date").text($("#hfCurrentWorkDate").val());
                    $("#Time").text(moment().format('hh:mm A'));
                        $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());

                    if (orderedProducts[i].MODIFIER === "0" || orderedProducts[i].MODIFIER === "false") {
                        var mod = '';
                        if (orderedProducts[i].IS_HasMODIFIER) {
                            var HasMod = 0;
                            for (var k = 0, lenk = Modifierparent.length; k < lenk; ++k) {
                                if (orderedProducts[i].SKU_ID === String(Modifierparent[k].ParentID) && parseInt(orderedProducts[i].ModifierParetn_Row_ID) === parseInt(Modifierparent[k].ModifierParetn_Row_ID)) {
                                    if (!IsModifierDeleted(orderedProducts, Modifierparent[k].ItemID)) {
                                        mod = mod + '<br>' + Modifierparent[k].ItemName;
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
                else if (qty < 0) {
                    if (orderedProducts[i].INVOICE_ID != 'N/A') {
                        if (document.getElementById("hfIsOldOrder").value === "1") {
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
                            if ($("#hfCustomerType").val() == "Delivery") {
                                if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                    $("#TableNo").text("");
                                }
                                else {
                                    $("#TableNo").text("CUSOTMER :" + $("#hfTableNo").val());
                                }
                            }
                            $("#Date").text($("#hfCurrentWorkDate").val());
                            $("#Time").text(moment().format('hh:mm A'));
                                $("#PrintMaxOrderNo").text($("#MaxOrderNo").text());
                            
                            sNoLess = sNoLess + 1;
                            var row = $('<tr ><td>' + sNoLess + '</td><td>' + orderedProducts[i].DESC + '</td><td class="text-right">' + parseFloat(qty) * -1 + '</td></tr>');
                            $('#detail-section-skusLess').append(row);
                        }
                    }
                }
            }
            else {
                if (orderedProducts[i].INVOICE_ID != 'N/A') {
                    if (document.getElementById("hfIsOldOrder").value === "1") {
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
                        if ($("#hfCustomerType").val() == "Delivery") {
                            if (document.getElementById("hfPrintCustomerOnDelivery").value == "0") {
                                $("#TableNo").text("");
                            }
                            else {
                                $("#TableNo").text("CUSOTMER :" + $("#hfTableNo").val());
                            }
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
function PrintInvoiceOfSection2() {
    $("#hfDisable").val("0");
    $.print("#invoice-kitchen2");
}

function SaveOrder() {
    var ServiceChargesType = document.getElementById("hfServiceChargesType").value;    
    if (($("#lnkDelivery").attr("class")) == "box active" || $("#hfCustomerMandatoryOnPOS").val() == "1") {
        if (($("#hfCustomerId").val() == "0")) {
            ServiceChargesType = document.getElementById("hfDELIVERY_CHARGES_TYPE").value;
            Error("Please select customer");
            return;
        }
    }
    var flag = true;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            flag = CheckCatDealQty($(tr).find('td:eq(21)').text());
            if (!flag) {
                return false;
            }
        }
    });
    if (flag) {
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
                    url: "frmOrderPOSCallCenter.aspx/HoldOrder", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), orderBooker: 0, coverTable: 0, customerType: document.getElementById("hfCustomerType").value, CustomerName: document.getElementById("hfCustomerId").value, maxOrderNo: $("#MaxOrderNo").text(), printType: document.getElementById("hfBookingType").value, tableName: 0, takeAwayCustomer: $("#txtTakeawayCustomer").val(), bookerName: '', tabId: 0, CustomerNo: document.getElementById("hfCustomerNo").value, VoidBy: $('#hfVoidBy').val(), manualOrderNo: '', remarks: $("#txtRemarks").val(), Gst: '0', Customer: document.getElementById("hfCustomerName").value, delChannel: ChannelValue, serviceCharges: ServiceChargesType, formid: 5, AdvanceAmount: 0, CustomerGST: $("#hfCustomerGST").val(), CustomerDiscount: $('#hfCustomerDiscount').val(), CustomerDiscountType: $('#hfCustomerDiscountType').val(), CustomerServiceCharges: $('#hfCustomerServiceCharges').val(), CustomerServiceType: $('#hfCustomerServiceType').val(), LocationID: $('select#ddlLocation option:selected').val(), PaymentMode: $('select#ddlPaymentMode option:selected').val() }),
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
    else {
        Error("Plz complete your Deal");
    }
}

function OrderSaved(dtStock) {
    ModifierParentCounter = 1;
    Modifierparent = [];
    dtStock = JSON.stringify(dtStock);
    var result = jQuery.parseJSON(dtStock.replace(/&quot;/g, '"'));
    dtStock = eval(result.d);
    if (dtStock.length > 0) {
        if (dtStock[0].OrderNO !== 0) {
            $("#MaxOrderNo").text(dtStock[0].OrderNO);
        }
    }
    ClearOrder();
    ClearCustomerData();
}
function Error(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Error', 'type': 'error' });
}

function Succes(Msg) {

    $.Zebra_Dialog(Msg, { 'title': 'Success', 'type': 'information' });
}

function OnHoldError(xhr, errorType, exception) {

    var responseText;

    try {
        responseText = jQuery.parseJSON(xhr.responseText);
        $.Zebra_Dialog(responseText.Message, { 'title': 'Error', 'type': 'error' });

    } catch (e) {
        me.data('requestRunning', false);
        responseText = xhr.responseText;
        $.Zebra_Dialog(responseText, { 'title': 'Error', 'type': 'error' });
    }

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
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val().toString());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('select#ddlBankDiscount option:selected').val().length > 0 && $('#hfPaymentType').val() == "1") {
        return;
    }
    document.getElementById('ddlBank').style.display = "none";
    document.getElementById('txtCardNo').style.display = "none";
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
        if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
            $('#txtCashRecieved').val(parseFloat($('#lblPaymentDue').text()).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
        else {
            $('#txtCashRecieved').val($('#lblPaymentDue').text());
        }
    }
    else if ($('#hfPaymentType').val() == "2" || $('#hfPaymentType').val() == "1") {
        document.getElementById('txtCashRecieved').disabled = true;        
    }
    else {
        document.getElementById('ddlBank').style.display = "table-row";
        document.getElementById('txtCardNo').style.display = "table-row";
        $('#txtCashRecieved').val(0);
    }

    document.getElementById("percentage").style["background-color"] = "#919399";    
    document.getElementById("dvBankDiscount").setAttribute("style", "display:none;");
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val().toString());

    if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType').val() == "1") {
        document.getElementById("txtDiscount").value = "";
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
    $('#hfPaymentType2').val(currentValue);
    $('#hfPaymentType').val(currentValue);
    if ($('#hfPaymentType2').val() == "2" || $('#hfPaymentType2').val() == "1") {
        document.getElementById('txtCashRecieved').disabled = true;
    }

    document.getElementById("percentage2").style["background-color"] = "#919399";
    document.getElementById("dvBankDiscount2").setAttribute("style", "display:none;");
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val().toString());
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
                url: "frmOrderPOSCallCenter.aspx/VoidOrder", //page/method name
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
$('#btnItemCommentPopupCancel').click(function (e) {
    $('#ItemCommentPopup').hide();
});
$('#btnItemCommentPopupSave').click(function (e) {
    var index = 0;
    $('#tble-ordered-products').find('tr').each(function () {

        if ($('#hfskuId').val() == $(this).find("td:eq(0)").text() && index == rowIndexComments) {            
            $(this).find("td:eq(53)").text($('#txtItemCommentPopupComment').val());            
            if ($("#OrderNo1").text() != "N/A") {
                $(this).find("td:eq(43)").text(0);
                var skuname = $(this).find("td:eq(55)").text();
                var comment = $('#txtItemCommentPopupComment').val();
                $(this).find("td:eq(1)").html(skuname + '<br><span style="color: #E91E63;">' + comment + '</span>');
            }
            else {
                var skuname = $(this).find("td:eq(55)").text();
                var comment = $('#txtItemCommentPopupComment').val();
                $(this).find("td:eq(1)").html(skuname + '<br><span style="color: #E91E63;">' + comment + '</span>');
            }
            $('#txtItemCommentPopupComment').val('');
            var tableData = storeTblValues();
            tableData = JSON.stringify(tableData);
            document.getElementById('hfOrderedproducts').value = tableData;
            $('#hfIsNewItemAdded').val('1');
        }
        index += 1;
    });
    $('#ItemCommentPopup').hide();
});
$('#btnSplitBillCancel').click(function (e) {
    $('#dvSplitBill').hide();
});
$('#btnSplitBillSave').click(function (e) {
    SaveSplitOrder();
});
//----------------on Discount Type button Click---------------------------------\\
function DiscType(myDiscType) {
    var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType2 option:selected').val().toString());
    if (DiscountDetail[0].DiscountTypeID == 4 && $('select#ddlBankDiscount2 option:selected').val().length > 0 && $('#hfPaymentType2').val() == "1")
    {
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
    $('#hfCustomerDiscountType').val(currentValue);
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
    $('#hfCustomerServiceType').val(myDiscType.value);
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
            var service = Math.round(parseFloat(grandTotal) * parseFloat(serviceCharges) / 100, 0);
            $("#lblServiceChargesTotal").text(parseFloat(service).toFixed(0));
        }
        else //document.getElementById("hfServiceChargesCalculation").value == "2" On Gross - Disocunt
        {
            var service = Math.round((parseFloat(grandTotal) - parseFloat($("#lblDiscountTotal2").text())) * parseFloat(serviceCharges) / 100, 0);
            $("#lblServiceChargesTotal").text(parseFloat(service).toFixed(0));
        }
        if ($("#hfBillFormat").val() === "3") {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + service), 0));
        }
        else {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + service), 0));
        }
    }
    else {
        $("#lblServiceChargesTotal").text(serviceCharges);
        if ($("#hfBillFormat").val() === "3") {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(serviceCharges)), 0));
        }
        else {
            $("#lblPaymentDue2").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + parseFloat(serviceCharges)), 0));
        }
    }
    checkAdvance("1");
}
function CalculateServiceChagesPayment() {
    var grandTotal = $("#GrandTotal").text();
    var discountTotal = $("#lblDiscountTotal").text();
    var gstTotal = $("#lblGSTTotal").text();
    var serviceCharges = document.getElementById('txtService').value;
    var service = Math.round(grandTotal * serviceCharges / 100, 0);
    if (serviceCharges == "" || document.getElementById("hfCustomerType").value == "Takeaway") {
        if ($("#hfServiceChargesOnTakeaway").val() == "0") {
            serviceCharges = 0;
        }
    }
    if ($('#hfServiceType').val() == "0") {
        if (document.getElementById("hfServiceChargesCalculation").value == "1") {// On Gross Only
            service = Math.round(grandTotal * serviceCharges / 100, 0);
            $("#lblServiceChargesTotalPayment").text(parseFloat(service).toFixed(0));
        }
        else //document.getElementById("hfServiceChargesCalculation").value == "2" On Gross - Disocunt
        {
            service = Math.round((parseFloat(grandTotal) - parseFloat($("#lblDiscountTotal").text())) * serviceCharges / 100, 0);
            $("#lblServiceChargesTotalPayment").text(parseFloat(service).toFixed(0));
        }
        if ($("#hfBillFormat").val() === "3") {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + service), 0));
        }
        else {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + service), 0));
        }
    }
    else {
        $("#lblServiceChargesTotalPayment").text(serviceCharges);
        if ($("#hfBillFormat").val() === "3") {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(serviceCharges)), 0));
        }
        else {
            $("#lblPaymentDue").text(Math.round((grandTotal - discountTotal + parseFloat(gstTotal) + parseFloat(serviceCharges)), 0));
        }
    }
    if ($('#hfPaymentType').val() === "0") {
        if ($('#txtCashRecieved').val() != "") {
            if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
                $('#txtCashRecieved').val(parseFloat($('#lblPaymentDue').text()).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
            }
            else {
                $('#txtCashRecieved').val($("#lblPaymentDue").text());
            }
        }
    }
    else {
        $('#txtCashRecieved').val('0');
    }
    checkAdvance("2");
}
//-----------------Calcualte on discount and cash Recd on Payment Click PopUp----\\ 

function CalculateBalance() {
    CalculateServiceChagesPayment();
    var balance = 0;
    var amountDue = 0;
    var discount = 0;
    var itemdiscount = 0;
    var dealDiscount = 0;
    dealDiscount = calculateDealDiscount();
    var gst = 0;
    var ItemWiseGST = 0;
    var servicecharges = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            if ($(tr).find('td:eq(21)').text() == '0') {
                ItemWiseGST += parseFloat($(tr).find("td:eq(50)").text());
                itemdiscount += parseFloat($(tr).find("td:eq(51)").text());
            }
        }
    });

    discount = document.getElementById('txtDiscount').value;
    var discountType = $('#hfDiscountType').val();
    var cashRcd = 0;
    cashRcd = document.getElementById('txtCashRecieved').value;
    var grandTotal = 0;
    grandTotal = $("#GrandTotal").text();
    if (document.getElementById('hfIsGSTVoid').value == '0') {
        if ($('#hfPaymentType').val() == "0" || $('#hfPaymentType').val() == "2") {
            if (parseFloat($('#hfCustomerGST').val()) > 0) {
                $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
                document.getElementById('dvCustomerGST').style.display = "block";
                gst = $('#hfCustomerGST').val();
            }
            else {
                document.getElementById('dvCustomerGST').style.display = "none";
                gst = document.getElementById("hfSalesTax").value;
            }
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
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
    if (servicecharges == "") {
        servicecharges = 0;
    }
    if (discountType == "0") {
        discount = parseFloat(grandTotal) * parseFloat(discount / 100);
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        else {//On Gross - Discount
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)) + parseFloat(servicecharges) + parseFloat(gst)), 0);
        amountDue = Math.round(balance, 0);
        balance = cashRcd - balance;
    }
    else if (discountType == "1") {
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        else {//On Gross - Discount
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount));
        amountDue = Math.round(balance, 0);
        balance = Math.round((cashRcd - balance), 0);
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        else {//On Gross - Discount
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst);
        amountDue = parseFloat(balance) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount));
        balance = Math.round((cashRcd - amountDue), 0);
    }

    if ($('#hfItemWiseGST').val() == "1") {
        gst = ItemWiseGST;
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst);
        amountDue = parseFloat(balance) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount));
        balance = Math.round((cashRcd - amountDue), 0);
    }
    if (cashRcd == 0) {
        balance = 0;
    }
    $("#lblDiscountTotal").text((parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(dealDiscount)).toFixed(0));
    $("#lblGSTTotal").text(parseFloat(gst).toFixed(0));
    $("#lblBalance").text(parseFloat(0).toFixed(0));
    if ($("#hfBillFormat").val() === "3") {
        amountDue = parseFloat(amountDue) - parseFloat(gst);
    }
    $("#lblPaymentDue").text(parseFloat(amountDue).toFixed(0));
    checkAdvance("2");
    if ($('#hfPaymentType').val() == "0") {
        if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0) {
            $('#txtCashRecieved').val(parseFloat($('#lblPaymentDue').text()).toFixed(0) - parseFloat($("#hfCustomerAdvanceAmount").val()).toFixed(0));
        }
        else {
            $('#txtCashRecieved').val($('#lblPaymentDue').text());
        }
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
            if (checkVoid($(tr).find('td:eq(13)').text())) {
                itemdiscount += parseFloat($(tr).find("td:eq(51)").text());
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
            if (parseFloat($('#hfCustomerGST').val()) > 0) {
                $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
                document.getElementById('dvCustomerGST').style.display = "block";
                gst = $('#hfCustomerGST').val();
            }
            else {
                document.getElementById('dvCustomerGST').style.display = "none";
                gst = document.getElementById("hfSalesTax").value;
            }
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
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
    if (servicecharges == "") {
        servicecharges = 0;
    }
    if (discountType == "0") {
        discount = parseFloat(grandTotal) * parseFloat(discount / 100);
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {// On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {// On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {//On Gross - Discount
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = Math.round((grandTotal - (parseFloat(discount) + parseFloat(itemdiscount)) + parseFloat(servicecharges) + parseFloat(gst)), 0);
        amountDue = Math.round(balance, 0);
        balance = cashRcd - balance;
    }
    else if (discountType == "1") {
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {// On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {// On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {//On Gross - Discount
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        balance = parseFloat(grandTotal) + parseFloat(servicecharges) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount));
        amountDue = Math.round(balance, 0);
        balance = Math.round((cashRcd - balance), 0);
    }
    else {
        if (document.getElementById("hfGSTCalculation").value == "1") {// On Gross Only
            gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
        }
        else if (document.getElementById("hfGSTCalculation").value == "3") {// On Gross + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges));
        }
        else if (document.getElementById("hfGSTCalculation").value == "4") {// On Gross - Discount + Service Charges
            gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat(servicecharges) - (parseFloat(discount) + parseFloat(itemdiscount)));
        }
        else {//On Gross - Discount
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
    if ($("#hfBillFormat").val() === "3") {
        amountDue = parseFloat(amountDue) - parseFloat(gst);
        $("#lblBalance").text((parseFloat(cashRcd) - parseFloat(amountDue)).toFixed(0));
    }
    $("#lblPaymentDue").text(parseFloat(amountDue).toFixed(0));
    checkAdvance("2");
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
                    Error("Please enter amount");
                    return;
                }
                if ($("#hfCustomerAdvance").val() == "1" && parseFloat($("#hfCustomerAdvanceAmount").val()) > 0)
                {
                    if (parseFloat($('#txtCashRecieved').val()) < parseFloat($('#lblPaymentDue').text()) - parseFloat($("#hfCustomerAdvanceAmount").val())) {
                        Error("Amount should be greater than due Payment");
                        return;
                    }
                }
                else {
                    if (parseFloat($('#txtCashRecieved').val()) < parseFloat($('#lblPaymentDue').text())) {
                        Error("Amount should be greater than due Payment");
                        return;
                    }
                }
            }
        }
        //=======================================

        var salesTax = 0;
        if (parseFloat($('#hfCustomerGST').val()) > 0) {
            $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
            document.getElementById('dvCustomerGST').style.display = "block";
            salesTax = $('#hfCustomerGST').val();
        }
        else {
            document.getElementById('dvCustomerGST').style.display = "none";
            salesTax = document.getElementById("hfSalesTax").value;
        }

        var ManagerId = 0;
        var EM_UserID = 0;
        var bankID = 0;
        try {
            bankID = $('select#ddlBank option:selected').val();

        } catch (e) {
            bankID = 0;
        }
        if (bankID === undefined) {
            bankID = 0;
        }
        var DiscountDetail = GetDiscountTemplateDetail(EmpDiscount);
        if (DiscountDetail[0].DiscountTypeID == 1) {
            try {
                EM_UserID = $('select#ddlDiscountUser option:selected').val();
            } catch (e) {
                EM_UserID = 0;
            }
            if (EM_UserID == undefined)
            {
                EM_UserID = 0;
            }
            ManagerId = $('select#ddlDiscountUser2 option:selected').val();
        }
        if ($('#hfPaymentType').val() == '2') {
            if ($('select#ddlCustomer option:selected').val() === '0') {
                Error("Must select Customer");
                return;
            }
        }

        var customerid2 = 0;
        var BankPortion = 0;
        var DiscountDetail = GetDiscountTemplateDetail($('select#ddlDiscountType option:selected').val().toString());
        if (DiscountDetail[0].DiscountTypeID == 4 && $('#hfPaymentType').val() == "1") {
            var tblBankDiscount = document.getElementById("hfBankDiscount").value;
            tblBankDiscount = eval(tblBankDiscount);
            for (var i = 0, len = tblBankDiscount.length; i < len; ++i) {
                if (tblBankDiscount[i].BankDiscountID == $('select#ddlBankDiscount option:selected').val()) {
                    BankPortion = tblBankDiscount[i].BankPortion;
                    break;
                }
            }
        }
        try {
            customerid2 = $('select#ddlCustomer option:selected').val();

        } catch (e) {
            customerid2 = 0;
        }
        if (customerid2 === undefined) {
            customerid2 = 0;
        }
        var customerAdvance = $('#hfCustomerAdvanceAmount').val();
        if (parseFloat($('#hfCustomerAdvanceAmount').val()) > parseFloat($("#lblPaymentDue").text()))
        {
            customerAdvance = $("#lblPaymentDue").text();
        }
        var IsGstVoid = false;
        if ($('#hfIsGSTVoid').val() == '1') {
            IsGstVoid = true;
        }

        document.getElementById("btnSave").disabled = true;
        if (document.getElementById("hfCustomerType").value == "Takeaway" || document.getElementById("hfCustomerType").value == "Dine In") {
            $.ajax
            (
                {
                    type: "POST", //HTTP method
                    url: "frmOrderPOSCallCenter.aspx/InsertInvoice2", //page/method name
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), Type: $('#hfCustomerType ').val(), amountDue: $("#hfAmountDue").val(), discount: $('#txtDiscount').val(), paidIn: $('#txtCashRecieved').val(), payType: $('#hfPaymentType').val(), Gst: $("#lblGSTTotal").text(), DiscType: $('#hfDiscountType').val(), gstPerAge: salesTax, Service: $('#lblServiceChargesTotalPayment').text(), takeAwayCustomer: $("#txtTakeawayCustomer").val(), empDiscType: EmpDiscount, EMC_UserID: EM_UserID, Manager_UserID: ManagerId, PASSWORD: $('#hfManagerPassword').val(), customerID: customerid2, cardNo: $('#hfCardNo').val(), purchasing: $('#hfCardPurchasing').val(), manualOrderNo: '', remarks: $("#txtRemarks").val(), contactNumer: $('#txtContactSMS').val(), customerName: $('#txtCustomerSMS').val(), address: $('#txtAddressSMS').val(), netAmount: $("#lblPaymentDue").text(), chargestype: $('#hfServiceType').val(), DeliveryChannelType: $('#hfDeliveryChannelType').val(), BankID: bankID, IsGSTVoid: IsGstVoid, RecordType: recordtype, AdvanceAmount: customerAdvance, BankPortion: BankPortion, CreditCardNo: $('#txtCardNo').val() }),
                    success: InvoiceSaved,
                    error: OnError
                }
            );
        }
        else {
            $.ajax
                (
                    {
                        type: "POST", //HTTP method
                        url: "frmOrderPOSCallCenter.aspx/InsertInvoice", //page/method name
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ orderedProducts: $('#hfOrderedproducts').val(), Type: $('#hfCustomerType ').val(), amountDue: $("#hfAmountDue").val(), discount: $('#txtDiscount').val(), paidIn: $('#txtCashRecieved').val(), payType: $('#hfPaymentType').val(), Gst: $("#lblGSTTotal").text(), DiscType: $('#hfDiscountType').val(), gstPerAge: salesTax, Service: $('#lblServiceChargesTotalPayment').text(), takeAwayCustomer: $("#txtTakeawayCustomer").val(), empDiscType: EmpDiscount, EMC_UserID: EM_UserID, Manager_UserID: ManagerId, PASSWORD: $('#hfManagerPassword').val(), customerID: $("#hfCustomerId").val(), cardNo: $('#hfCardNo').val(), purchasing: $('#hfCardPurchasing').val(), manualOrderNo: '', remarks: $("#txtRemarks").val(), CustomerNo: document.getElementById("hfCustomerNo").value, netAmount: $("#lblPaymentDue").text(), chargestype: $('#hfServiceType').val(), DeliveryChannelType: $('#hfDeliveryChannelType').val(), BankID: bankID, IsGSTVoid: IsGstVoid, RecordType: recordtype, AdvanceAmount: customerAdvance, BankPortion: BankPortion, CreditCardNo: $('#txtCardNo').val() }),
                        success: InvoiceSaved,
                        error: OnError
                    }
                );
        }
    }
}

function InvoiceSaved(qrCodeAndItems) {

    var ItemList = JSON.stringify(qrCodeAndItems);
    var resultItem = jQuery.parseJSON(ItemList.replace(/&quot;/g, '"'));
    ItemList = eval(resultItem.d);

    if (document.getElementById("hfTaxAuthority").value !== '0' && document.getElementById("hfTaxAuthority").value !== '3') {
        var qrCode = eval(ItemList[0].strQRCode);
        if (qrCode.length > 0) {
            document.getElementById('imgQrCode').src = 'data:image/png;base64,' + qrCode[0].QrString;
            document.getElementById('imgQrCode3').src = 'data:image/png;base64,' + qrCode[0].QrString;
            if (document.getElementById("hfTaxAuthority").value === '1') {
                $("#FBRInvoiceNo").text('FBR Invoice No: ' + qrCode[0].FBRInvoiceNumber);
                $("#FBRInvoiceNo3").text('FBR Invoice No: ' + qrCode[0].FBRInvoiceNumber);
            }
            else if (document.getElementById("hfTaxAuthority").value === '2')
            {
                $("#FBRInvoiceNo").text('PRA Invoice No: ' + qrCode[0].FBRInvoiceNumber);
                $("#FBRInvoiceNo3").text('PRA Invoice No: ' + qrCode[0].FBRInvoiceNumber);
            }
            else if (document.getElementById("hfTaxAuthority").value === '4') {
                $("#FBRInvoiceNo").text('SBR Invoice No: ' + qrCode[0].FBRInvoiceNumber);
                $("#FBRInvoiceNo3").text('SBR Invoice No: ' + qrCode[0].FBRInvoiceNumber);
            }
            document.getElementById("trFBRInvoice").style.display = "table-row";
            document.getElementById("trFBRInvoice3").style.display = "table-row";
            document.getElementById("trQRImage").style.display = "table-row";
            document.getElementById("trQRImage3").style.display = "table-row";
        }
    }
    Modifierparent = [];
    ModifierParentCounter = 1;
    if (ItemList.length > 0) {
        for (var i = 0, len = ItemList.length; i < len; ++i) {
            var obj = {};
            obj["ItemID"] = ItemList[i].SKU_ID;
            obj["ParentID"] = ItemList[i].MODIFIER_PARENT_ID;
            obj["ItemName"] = ItemList[i].SKU_NAME;
            obj["Price"] = ItemList[i].T_PRICE;
            obj["Qty"] = ItemList[i].QTY;
            obj["Amount"] = ItemList[i].AMOUNT;
            obj["ModifierParetn_Row_ID"] = ItemList[i].ModifierParetn_Row_ID;
            obj["SALE_INVOICE_DETAIL_ID"] = ItemList[i].SALE_INVOICE_DETAIL_ID;
            Modifierparent.push(obj);
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
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
}

function changeClass(btn) {
    var a, n;
    a = document.getElementById("dv_lstCategory").children;
    for (n = 0; n < a.length; n++) {
        if (a[n].name == '0') {
            a[n].style["background-color"] = "#d4def7";
        }
        else {
            a[n].style["background-color"] = "#e2e3e8";
        }
    }

    btn.style["background-color"] = "#7DAB49";

    a = document.getElementById("dv_lstModifyCategory").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#d4def7";
    }
    btn.style["background-color"] = "#7DAB49";
}
function changeClass2(btn) {
    var a, n;
    a = document.getElementById("dv_lstCategory").children;
    for (n = 0; n < a.length; n++) {
        if (a[n].name == '0') {
            a[n].style["background-color"] = "#d4def7";
        }
        else {
            a[n].style["background-color"] = "#e2e3e8";
        }
    }

    btn.style["background-color"] = "#7DAB49";

    a = document.getElementById("dv_lstModifyCategory").children;
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

function changeSubCatClass(btn) {
    var a, n;
    var a = document.getElementById("dv_lstSubCategory").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#d4def7";
    }
    btn.style["background-color"] = "#7DAB49";

}

function changeProductClass(btn) {
    var a, n;
    a = document.getElementById("dv_lstProducts").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#e2e3e8";
    }
    btn.style["background-color"] = "#7DAB49";

    a = document.getElementById("dv_lstModifyProducts").children;
    for (n = 0; n < a.length; n++) {
        a[n].style["background-color"] = "#e2e3e8";
    }
    btn.style["background-color"] = "#7DAB49";

}

// #region Item Deletion

function UserValidationInDataBase(obj) {

    $("#hfVoidBy").val('');
    var UserId = document.getElementById('txtUserID').value;
    var UserPassword = document.getElementById('txtUserPass').value;
    var UserClick = document.getElementById('hfUserClick').value;
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/ValidateUser", //page/method name
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
}

function deleteItem(btn) {
    var rowIndex = $(btn).parent();
    var RowID = $(rowIndex).find('td:eq(48)').text();
    var SkuType = $(rowIndex).find('td:eq(24)').text();//Check Hold or Not for new '' for already Hold 'H'
    $("#lblReason").text('Cancel Reason');
    document.getElementById('ddlLessReason').style.display = "none";
    document.getElementById('ddlCancelReason').style.display = "block";
    if (checkVoid($(rowIndex).find('td:eq(13)').text())) {        
        if (SkuType == "") {
            DeleteModifiers($(rowIndex).find('td:eq(0)').text(), RowID);
            var Sku_id = $(rowIndex).find('td:eq(0)').text();            
            var Cat_id = $(rowIndex).find('td:eq(14)').text();
            $("#hfskuId").val(Sku_id);
            $("#hfcatId").val(Cat_id);
            $("#hfDelIndex").val($(rowIndex).find('td:eq(12)').text());            
            removeQty();
        }
        else {
            var Sku_id = $(rowIndex).find('td:eq(0)').text();
            var Cat_id = $(rowIndex).find('td:eq(14)').text();
            $("#hfskuId").val(Sku_id);
            $("#hfcatId").val(Cat_id);
            $("#hfDelIndex").val($(rowIndex).find('td:eq(12)').text());
            document.getElementById('txtUserID').value = "";
            document.getElementById('txtUserPass').value = "";
            $("#hfUserClick").val('Delete');
            $('#UserValidation').show("slow");
            $('#ddlItemType').val(1);
            $('#txtUserID').focus();
        }
    }
}

function deleteQty() {
    var Sku_Id = $("#hfskuId").val();
    var Cat_Id = $("#hfcatId").val();
    var C1 = $("#hfDelIndex").val();
    DeleteModifiersSoft(Sku_Id, C1);
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == Sku_Id && $(tr).find('td:eq(14)').text() == Cat_Id && $(tr).find('td:eq(12)').text() == C1) {
            $(tr).find('td:eq(13)').text(true);
            $(tr).find('td:eq(43)').text(0);
            $(tr).find('td:eq(7)').css('background-color', '#b20505');
            $(tr).find('td:eq(46)').text($('select#ddlCancelReason option:selected').val());
            $(tr).find('td:eq(54)').text($('select#ddlItemType option:selected').val());
        }
    });
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfDelIndex").val('')
}
function removeQty() {
    var Sku_Id = $("#hfskuId").val();
    var Cat_Id = $("#hfcatId").val();
    var C1 = $("#hfDelIndex").val();
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == Sku_Id && $(tr).find('td:eq(14)').text() == Cat_Id && $(tr).find('td:eq(12)').text() == C1) {
            $(tr).remove();
        }
    });
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfDelIndex").val('')
}
function DeleteModifiers(LineItemID,RowID)
{
    var flag = true;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            if ($(tr).find('td:eq(45)').text() == LineItemID && $(tr).find('td:eq(48)').text() == RowID) {

                var Sku_id = $(tr).find('td:eq(0)').text();
                var SkuType = $(tr).find('td:eq(24)').text();//Check Hold or Not for new '' for already Hold 'H'
                var Cat_id = $(tr).find('td:eq(14)').text();
                $("#hfskuId").val(Sku_id);
                $("#hfcatId").val(Cat_id);
                $("#hfDelIndex").val($(tr).find('td:eq(12)').text());
                removeQty();                
            }
        }
    });
    return flag;
}
function DeleteModifiersSoft(LineItemID, RowID) {
    var flag = true;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            if ($(tr).find('td:eq(45)').text() == LineItemID && $(tr).find('td:eq(48)').text() == RowID) {
                $(tr).find('td:eq(13)').text(true);
                $(tr).find('td:eq(43)').text(0);
                $(tr).find('td:eq(7)').css('background-color', '#b20505');
                $(tr).find('td:eq(46)').text($('select#ddlCancelReason option:selected').val());
                $(tr).find('td:eq(54)').text($('select#ddlItemType option:selected').val());
            }
        }
    });
    return flag;
}
function DeletionProceed() {
    $('#DeletionConfirmation').hide("slow");
    deleteQty();
    $('#hfDisable').val("0");
}

function DeletionCancel() {
    $('#DeletionConfirmation').hide("slow");
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfUserClick").val('');
    $("#hfDelIndex").val('');

}

// #endregion Item Deletion

// #region Decrease Qty

function decreaseItem(btn) {
    var rowIndex = $(btn).parent();
    var Sku_id = $(rowIndex).find('td:eq(0)').text();
    var Cat_id = $(rowIndex).find('td:eq(14)').text();
    var SkuType = $(rowIndex).find('td:eq(24)').text();//Check Hold or Not for new '' and for already Hold 'H'
    var qty = $(rowIndex).find('td:eq(3) input').val();
    var oldqty = $(rowIndex).find('td:eq(9)').text();
    $("#lblReason").text('Less Reason');
    document.getElementById('ddlLessReason').style.display = "block";
    document.getElementById('ddlCancelReason').style.display = "none";
    if (qty > 1) {
        $("#hfskuId").val(Sku_id);
        $("#hfcatId").val(Cat_id);
        $("#hfDelId").val($(rowIndex).find('td:eq(21)').text());
        $("#hfDelIndex").val($(rowIndex).find('td:eq(12)').text());
        if (SkuType == "" || parseFloat(qty) > parseFloat(oldqty)) {
            minusQty();
        }
        else {
            document.getElementById('txtUserID').value = "";
            document.getElementById('txtUserPass').value = "";
            $("#hfUserClick").val('Decrease');
            $('#UserValidation').show("slow");
            $('#ddlItemType').val(1);
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
    var discount = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == Sku_Id && $(tr).find('td:eq(14)').text() == Cat_Id && $(tr).find('td:eq(12)').text() == C1) {
            qty = $(tr).find('td:eq(3) input').val();
            if (Deal_Id != 0) {
                if (qty > parseFloat($(tr).find('td:eq(27)').text()) * parseFloat($(tr).find('td:eq(28)').text())) {
                    nQty = qty - 1;
                    $(tr).find('td:eq(3) input').val(nQty);
                }
            }
            else {
                if (qty == "1") {
                } else {
                    nQty = qty - 1;
                    $(tr).find('td:eq(3) input').val(nQty);
                    discount = CalculatePromotion(parseInt(Sku_Id), nQty, parseFloat($(tr).find('td:eq(5)').text()));
                    $(tr).find("td:eq(51)").text(parseFloat(discount));

                }
            }
            var price = $(tr).find('td:eq(5)').text();
            var amount = (parseFloat(nQty * price) - parseFloat(discount)).toFixed(2);
            if ($(tr).find('td:eq(41)').text() != "1") {
                $(tr).find('td:eq(6)').text(amount);
            }
            else
            {
                $(tr).find('td:eq(6)').text(0);
            }
            $(tr).find('td:eq(50)').text(amount * parseFloat($(tr).find('td:eq(49)').text()) / 100);
            if ($("#OrderNo1").text() == "N/A") {
                $(tr).find('td:eq(42)').text($(tr).find('td:eq(3) input').val());
            }
            $(tr).find('td:eq(46)').text($('select#ddlLessReason option:selected').val());
            $(tr).find('td:eq(54)').text($('select#ddlItemType option:selected').val());
            setTotals();
        }
    });
    var tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
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
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfUserClick").val('');
    $("#hfDelIndex").val('');
    $("#hfDelId").val('');

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

function calculateDiscount(discount, itemdiscount, amountDue) {
    $('#lblDiscountTotal').text('0');
    $("#lblDiscountTotal2").text('0');
    document.getElementById('txtDiscount').value = "";
    document.getElementById('txtDiscount2').value = "";
    document.getElementById('txtDiscountReason2').value = "";    
    var salesTax = 0;
    if (parseFloat($('#hfCustomerGST').val()) > 0) {
        $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
        document.getElementById('dvCustomerGST').style.display = "block";
        salesTax = $('#hfCustomerGST').val();
    }
    else {
        document.getElementById('dvCustomerGST').style.display = "none";
        salesTax = document.getElementById("hfSalesTax").value;
    }
    salesTax = parseFloat(salesTax) / 100 * amountDue;
    if (salesTax == "") {
        salesTax = 0;
    }
    var Total = Math.round(parseFloat(amountDue), 2);
    if (discount > 0 || itemdiscount > 0) {
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
        isDisable('true');        
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
    var itemdiscount = 0;
    var discountDeal = 0;
    discountDeal = calculateDealDiscount();
    discount = document.getElementById('txtDiscount2').value;
    var discountType = $('#hfDiscountType').val();
    var grandTotal = $("#GrandTotal2").text();
    var gst = 0;
    var ItemWiseGST = 0;
    $('#tble-ordered-products tr').each(function (row, tr) {
        if ($(tr).find("td:eq(13)").text() == 'false') {
            if ($(tr).find('td:eq(21)').text() == '0') {
                ItemWiseGST += parseFloat($(tr).find("td:eq(50)").text());
                itemdiscount += parseFloat($(tr).find("td:eq(51)").text());
            }
        }
    });

    if (document.getElementById('hfIsGSTVoid').value == '0') {
        if ($('#hfPaymentType2').val() == "0" || $('#hfPaymentType2').val() == "2") {
            if (parseFloat($('#hfCustomerGST').val()) > 0) {
                $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
                document.getElementById('dvCustomerGST').style.display = "block";
                gst = $('#hfCustomerGST').val();
            }
            else {
                document.getElementById('dvCustomerGST').style.display = "none";
                gst = document.getElementById("hfSalesTax").value;
            }
        }
        else {
            gst = document.getElementById("hfSalesTaxCreditCard").value;
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
    if (discountType == "0") {
        discount = parseFloat(grandTotal) * parseFloat(discount) / 100;
    }
    $("#lblDiscountTotal2").text(Math.round((parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(discountDeal)), 0));
    if (document.getElementById("hfGSTCalculation").value == "1") {//On Gross Only
        gst = parseFloat(gst / 100) * parseFloat($("#hfGrandTotal").val());
    }
    else if (document.getElementById("hfGSTCalculation").value == "3") {//On Gross + Service Charges
        CalculateServiceChages();
        gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat($('#lblServiceChargesTotal').text()));
    }
    else if (document.getElementById("hfGSTCalculation").value == "4") {//On Gross - Discount + Service Charges
        CalculateServiceChages();
        gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) + parseFloat($('#lblServiceChargesTotal').text()) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(discountDeal)));
    }
    else {//On Gross - Discount
        gst = parseFloat(gst / 100) * (parseFloat($("#hfGrandTotal").val()) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(discountDeal)));
    }
    if ($('#hfItemWiseGST').val() == "1") {
        gst = ItemWiseGST;
        amountDue = parseFloat(grandTotal) + parseFloat(gst) - (parseFloat(discount) + parseFloat(itemdiscount) + parseFloat(discountDeal));
        amountDue = Math.round(amountDue, 0);
    }

    if ($("#hfBillFormat").val() === "3") {
        amountDue = parseFloat(amountDue) - parseFloat(gst);
    }
    $("#lblPaymentDue2").text(Math.round(amountDue, 0));    
    $("#lblGSTTotal2").text(Math.round(gst, 0));
    CalculateServiceChages();
    checkAdvance("1");
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
    var id = "";
    if (obj != null) {
        id = obj.id;
    }
    waitLoading('Loading');
    try {
        document.getElementById('dvCustomerLedger').style.display = 'block';
    } catch (e) {
    }
    $("#txtTakeawayCustomer").val('');
    document.getElementById('hfCheckSMS').value = "0";
    $("#lnkDelivery").removeClass("active");
    $("#lnkTakeaway").removeClass("active");
    $("#txtTakeawayCustomer").val('');

    if (id == "lnkDelivery" || obj2 == "Delivery") {        
        document.getElementById('dvDeliveryChannel').style.display = 'block';
        document.getElementById('dvDeliveryChannelLablel').style.display = 'block';
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
        document.getElementById("hfCustomerType").value = "Delivery";
        document.getElementById('dvPendingBills').className = 'col-md-12 vac-det';
        $("#lblSaleForce").text("Delivery Man");
        $("#hfTableNo").val("");
        $("#hfTableId").val("0");
        $("#TableNo1").text("DLY");
        $("#OrderNo1").text("N/A");
        $("#txtTakeawayCustomer").val('');
        $('#txtPrimaryContact').val('');
        $("#tbl-customers").empty();
    }
    else if (id == "lnkTakeaway" || obj2 == "Takeaway") {
        $("#lblCoverTable").text("Token ID");
        isDisable('false');
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
        document.getElementById('dvPendingBills').className = 'col-md-12 vac-det';
        $("#hfTableNo").val("");
        $("#hfTableId").val("0");
        $("#TableNo1").text("TKY");
        $("#OrderNo1").text("N/A");
        $("#txtCoverTable").val('');
        $("#lblSaleForce").text("Order Taker");
    }
    if (id != "") {
        GetPendingBills();
    }
}

function SaveCustomer() {
    if (parseInt($("#hfCustomerId").val()) > 0) {
        $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/UpdateCustomerAddress", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ CustomerID: $("#hfCustomerId").val(), Address: $('#txtCustomerAddress').val(), LocationID: $('select#ddlLocation option:selected').val() }),
                success: CustomerAddressUpdated
            }
        );
    }
    else {
        if (parseInt($("#hfDeliveryChannel").val()) > 1 && document.getElementById("hfCustomerType").value == 'Delivery') {
            if ($('#txtCustomerName').val() == "") {
                Error("Must enter Customer Name");
                return false;
            }
            $.ajax
                    (
                        {
                            type: "POST", //HTTP method
                            url: "frmOrderPOSCallCenter.aspx/InsertCustomerThirdParty", //page/method name
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ ThirdPartyDeliveryID: $("#hfDeliveryChannel").val(), Name: $('#txtCustomerName').val(), Address: $('#txtCustomerAddress').val(), ContactNo: $('#txtPrimaryContact').val() }),
                            success: ClearCustomerThirdParty,
                            error: OnError
                        }
                    );
        }
        else {
            if (ValidateCustomer()) {

                $.ajax
                    (
                        {
                            type: "POST", //HTTP method
                            url: "frmOrderPOSCallCenter.aspx/InsertCustomer", //page/method name
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ cardID: $('#txtCustomerCardNo').val(), CNIC: $('#txtCustomerCNIC').val(), contactNumer: $('#txtPrimaryContact').val(), contactNumer2: $('#txtOtherContact').val(), customerName: $('#txtCustomerName').val(), address: $('#txtCustomerAddress').val(), DOB: $('#txtCustomerDOB').val(), OpeningAmount: $('#txtOpeningAmount').val(), Nature: $('#txtNature').val(), email: $('#txtEmail').val(), gender: $('#ddlGender').val(), occupation: $('#ddlOccupation').val(), LocationID: $('select#ddlLocation option:selected').val() }),
                            success: ClearCustomer,
                            error: OnError
                        }
                    );
            }
        }
    }
}
function CustomerAddressUpdated(result)
{
    document.getElementById('divCustomer').style.visibility = 'hidden';
    return;
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

//On KEY UP txtPrimaryContact
function LoadAllCustomers(Searchtype) {
    $.ajax
       (
           {
               type: "POST", //HTTP method
               url: "frmOrderPOSCallCenter.aspx/LoadAllCustomers", //page/method name
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: JSON.stringify({ customerName: $('#txtPrimaryContact').val(), type: Searchtype, LocationID: $('select#ddlLocation option:selected').val() }),
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
        var row = $('<tr tabindex="0" style="cursor: pointer;"><td style="display:none;">' + customers[i].CUSTOMER_ID + '</td><td class="leftval">' + customers[i].CUSTOMER_NAME + '</td><td class="leftval">' + customers[i].CONTACT_NUMBER + '</td><td class="leftval"  style="display:none;">' + customers[i].EMAIL_ADDRESS + '</td><td style="display:none;">' + customers[i].CNIC + '</td><td class="leftval"  style="display:none;">' + customers[i].REGDATE + '</td><td class="leftval">' + customers[i].ADDRESS + '</td><td class="leftval" style="display:none;">' + customers[i].GroupID + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerAdvance + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerGST + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerDiscount + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerDiscountType + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerServiceCharges + '</td><td class="leftval" style="display:none;">' + customers[i].CustomerServiceType + '</td><td class="leftval" style="display:none;">' + customers[i].CONTACT2 + '</td><td class="leftval" style="display:none;">' + customers[i].GENDER + '</td><td class="leftval" style="display:none;">' + customers[i].OCCUPATION + '</td><td class="leftval" style="display:none;">' + customers[i].FirstOrderDate + '</td><td class="leftval" style="display:none;">' + customers[i].LastOrderDate + '</td><td class="leftval" style="display:none;">' + customers[i].TotalOrders + '</td><td class="leftval" style="display:none;">' + customers[i].TotalAmount + '</td></tr>');
        $('#tbl-customers').append(row);
    }
    if (customers.length > 0) {
        $("#dvCustomerGrid").show();
    }
    else {
        $("#dvCustomerGrid").hide();
    }
}
//Load Location
function LoadLocationDropDown() {
    $.ajax
       (
           {
               type: "POST", //HTTP method
               url: "frmOrderPOSCallCenter.aspx/LoadLocation", //page/method name
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: LocationDropDown
           }
 );
}
function LocationDropDown(locations) {
    locations = JSON.stringify(locations);
    var result = jQuery.parseJSON(locations.replace(/&quot;/g, '"'));
    locations = eval(result.d);
    var locations2 = JSON.stringify(locations);
    var listItems = "";
    $("[id$='ddlLocation'] option").remove();
    for (var i = 0, len = locations.length; i < len; i++) {
        listItems += "<option value='" + locations[i].DISTRIBUTOR_ID + "'>" + locations[i].DISTRIBUTOR_NAME + "</option>";      
    }
    $("[id$='ddlLocation']").html(listItems);
    UnlockRecord();
    LoadOpenItem();
    LoadModifiers();
    LoadAllModifiers();    
    loadAllProducts();
    GetPendingBills();
}
function LocationChanged(SelectedValue) {
    UnlockRecord();
    NewOrder();
    //Clear Items
    var dvLstProducts = document.getElementById("dv_lstProducts");
    while (dvLstProducts.hasChildNodes()) {
        dvLstProducts.removeChild(dvLstProducts.lastChild);
    }
    //Clear Categories
    var dv_lstCategory = document.getElementById("dv_lstCategory");
    while (dv_lstCategory.hasChildNodes()) {
        dv_lstCategory.removeChild(dv_lstCategory.lastChild);
    }
    LoadOpenItem();
    LoadModifiers();
    LoadAllModifiers();
    loadAllProducts();
    GetPendingBills();
}
//On Save Customer
function LoadCustomers() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadAllCustomers", //page/method name
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ customerName: "", type: "Max", LocationID: $('select#ddlLocation option:selected').val() }),
                success: LoadLastCustomer
            }
        );
}
function LoadCustomersThirdParty() {
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/LoadCustomerThirdPartyDelivery", //page/method name
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

    ShowCustomer2(customers);
    if (document.getElementById("hfCustomerType").value == 'Delivery') {
        IsNewDeliveryOrder = 1;
        if ($("#tble-ordered-products tr").length > 0) {            
            $('#dvHold').trigger("click");
        }
    }
}

//After Insertion Select Last Customer
function ShowCustomer2(customers) {
    document.getElementById('hfCustomerId').value = customers[0].CUSTOMER_ID;
    document.getElementById('hfCustomerNo').value = customers[0].CONTACT_NUMBER;
    document.getElementById('hfTableNo').value = customers[0].CUSTOMER_NAME;//Customer name used For Printing on Unique Section and Print Order
    document.getElementById('divCustomer').style.visibility = 'hidden';
    $("#tbl-customers").empty();
    $("#dvCustomerGrid").hide();
    var listItems = "";
    $("[id$='ddlCustomer'] option").remove();
    listItems = "<option value='" + customers[0].CUSTOMER_ID + "'>" + customers[0].CUSTOMER_NAME + "</option>";
    $("[id$='ddlCustomer']").html(listItems);
}

//Get Customer Detail on Selection Button on row click
function ShowCustomer(obj) {
    var rowIndex = $(obj);
    document.getElementById('hfCustomerId').value = $(rowIndex).find('td:eq(0)').text();
    document.getElementById('hfCustomerName').value = $(rowIndex).find('td:eq(1)').text();
    document.getElementById('hfCustomerNo').value = $(rowIndex).find('td:eq(3)').text();

    $("#txtCustomerName").val($(rowIndex).find('td:eq(1)').text());
    $('#txtPrimaryContact').val($(rowIndex).find('td:eq(2)').text());
    $('#txtCustomerAddress').val($(rowIndex).find('td:eq(6)').text());
    $('#txtOtherContact').val($(rowIndex).find('td:eq(14)').text());
    $('#ddlGender').val($(rowIndex).find('td:eq(15)').text());
    $('#ddlOccupation').val($(rowIndex).find('td:eq(16)').text());
    $('#txtEmail').val($(rowIndex).find('td:eq(3)').text());
    $('#txtCustomerDOB').val($(rowIndex).find('td:eq(5)').text());
    $('#lblFirstOrderValue').text($(rowIndex).find('td:eq(17)').text());
    $('#lblLastOrderValue').text($(rowIndex).find('td:eq(18)').text());
    $('#lblOrdersValue').text($(rowIndex).find('td:eq(19)').text());
    $('#lblAmountValues').text($(rowIndex).find('td:eq(20)').text());
    
    $('#hfCustomerGroup').val($(rowIndex).find('td:eq(8)').text());
    $('#hfCustomerAdvanceAmount').val($(rowIndex).find('td:eq(9)').text());
    $('#hfCustomerGST').val($(rowIndex).find('td:eq(10)').text());
    $('#hfCustomerDiscount').val($(rowIndex).find('td:eq(11)').text());
    $('#hfCustomerDiscountType').val($(rowIndex).find('td:eq(12)').text());
    $('#hfCustomerServiceCharges').val($(rowIndex).find('td:eq(13)').text());
    $('#hfCustomerServiceType').val($(rowIndex).find('td:eq(14)').text());        
    $("#tbl-customers").empty();
    $("#dvCustomerGrid").hide();
    if (document.getElementById("hfCustomerType").value == 'Delivery') {
        IsNewDeliveryOrder = 1;
        if ($("#tble-ordered-products tr").length > 0) {
            $('#dvHold').trigger("click");
        }
    }
    document.getElementById("hfIsOldOrder").value = "0";
    if (parseFloat($('#hfCustomerGST').val()) > 0)
    {
        $("#txtCustomerGSTValue").val($("#hfCustomerGST").val());
        document.getElementById('dvCustomerGST').style.display = "block";
    }
    else
    {
        document.getElementById('dvCustomerGST').style.display = "none";
    }
    var listItems = "";
    $("[id$='ddlCustomer'] option").remove();
    listItems = "<option value='" + document.getElementById('hfCustomerId').value + "'>" + document.getElementById('hfCustomerName').value + "</option>";
    $("[id$='ddlCustomer']").html(listItems);
}

function LoadLastBill() {

    setTimeout(function () {
        var table = document.getElementById('tbl-pending-bills');
        var lastRow = table.rows[table.rows.length - 1];
        if ($(lastRow).find("td:eq(12)").text() == "DLY") {
            var amountDue = $(lastRow).find("td:eq(3)").text();
            if (amountDue == 0) {
                ShowBill(lastRow);
            }
        }
        else {
            ShowBill(lastRow);
        }
    }, 1000);
}

//#endregion

//#region SMS

function SendSMS(obj) {

    var rowIndex = $(obj).parent();
    document.getElementById('hfCustomerNo').value = $(rowIndex).find('td:eq(15)').text();

    SMS(document.getElementById('hfCustomerNo').value, document.getElementById('hfDeliveryStartedSMSText').value);
    document.getElementById('hfCheckSMS').value = "1";
}

//msgType: 1 for hold, 2 for Ride
function SMS(Number, message) {
    $.blockUI();
    $.ajax
           (
               {
                   type: "POST", //HTTP method
                   url: "frmOrderPOSCallCenter.aspx/SendSMS", //page/method name
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   data: JSON.stringify({ customerNo: Number, msg: message }),
                   success: function (data) {
                       if (data.d == "100" || data.d == "Message Sent To Telecom" || data.d == "Message Sent Successfully!") {
                           //Succes(data.d);
                       } else {
                           Error(data.d);
                       }
                   },
                   error: OnError,
                   complete: function () {
                       $.unblockUI();
                   }
               }
           );
}

//#endregion

//region Clear

//ON Hold Order
function ClearOrder() {    
    Modifierparent = [];
    ModifierParentCounter = 1;
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#ddlPaymentMode').val('-1').change();
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $('#hfOrderedproducts').val('');
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val(0).change();
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    GetPendingBills();
    $("#hfIsOldOrder").val('0');
    $("#hfTableNo").val("");
    $("#hfTableId").val("0");
    $('#hfDisable').val("0");

    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $("#hfCounter").val(0);

    document.getElementById('dvDealUpdate').style.display = 'none';
    $("#txtDealQty").val('1');
    UnlockRecord();
}

//ON Payment 
function Clear() {    
    Modifierparent = [];
    ModifierParentCounter = 1;
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#ddlPaymentMode').val('-1').change();
    document.getElementById('imgQrCode').src = '';
    document.getElementById('imgQrCode3').src = '';
    $("#FBRInvoiceNo").text('');
    $("#FBRInvoiceNo3").text('');
    document.getElementById("trFBRInvoice").style.display = "none";
    document.getElementById("trFBRInvoice3").style.display = "none";
    document.getElementById("trQRImage").style.display = "none";
    document.getElementById("trQRImage3").style.display = "none";
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $("#hfDiscountRemarks").val('');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
    $("#hfIsOldOrder").val('0');
    $('#hfOrderedproducts').val('');
    $('#hfPaymentType').val(0);
    $('#txtDiscount').val('');
    $('#txtCashRecieved').val('');
    $('#txtDiscountReason').val('');    
    $('#txtDiscountReason2').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#txtCreditCardNo2').val('');
    $('#txtCreditCardAccountTile2').val('');
    $("#lblDiscountTotal").text('0.00');
    $("#lblServiceChargesTotalPayment").text('0');
    $("#lblTotalGrossAmount").text("");
    $("#lblTotalNetAmount").text("");
    $('#hfDisable').val("0");
    $('#hfDiscountType').val('');
    $('#hfchkDiscountType').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    document.getElementById("btnSave").disabled = false;
    $('#payment').hide("slow");
    if (document.getElementById("hfCustomerType").value == "Dine In") {
        $("#TableNo1").text("N/A");
    }
    $("#OrderNo1").text("N/A");
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val(0).change();
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    $('#hfCustomerNo').val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');
    $("#hfCounter").val(0);

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

    if ($('#hfModifiedItemsShown').val() == '1') {
        document.getElementById('dv_lstModifyCategory').style.display = "block";
        document.getElementById('dv_lstModifyProducts').style.display = "block";
    }
    else {
        document.getElementById('dv_lstModifyCategory').style.display = "none";
        document.getElementById('dv_lstModifyProducts').style.display = "none";
    }
    document.getElementById('dv_lstProducts').style.display = "block";
    document.getElementById('dv_lstCategory').style.display = "block";
}

function ClearOnCancel() {    
    Modifierparent = [];
    ModifierParentCounter = 1;
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#ddlPaymentMode').val('-1').change();
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
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
    $("#ddlCustomer").val(0).change();
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    $('#hfCustomerNo').val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');
    $("#hfCounter").val(0);
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
    if ($('#hfModifiedItemsShown').val() == '1') {
        document.getElementById('dv_lstModifyCategory').style.display = "block";
        document.getElementById('dv_lstModifyProducts').style.display = "block";
    }
    else {
        document.getElementById('dv_lstModifyCategory').style.display = "none";
        document.getElementById('dv_lstModifyProducts').style.display = "none";
    }
    UnlockRecord();
    document.getElementById('dv_lstProducts').style.display = "block";
    document.getElementById('dv_lstCategory').style.display = "block";
}

//ON Print Invoice
function Clear2() {    
    Modifierparent = [];
    ModifierParentCounter = 1;
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#ddlPaymentMode').val('-1').change();
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
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
    $("#txtService").val('');
    $("#txtService2").val('');
    $('#hfCustomerId').val('0');
    $("#ddlCustomer").val(0).change();
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    $('#hfCustomerNo').val('');
    $("#txtTakeawayCustomer").val('');
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
    document.getElementById('dv_lstModifyCategory').style.display = "block";
    document.getElementById('dv_lstModifyProducts').style.display = "block";
    document.getElementById('dv_lstProducts').style.display = "block";
    document.getElementById('dv_lstCategory').style.display = "block";    
}

function ClearOnCancel2() {    
    Modifierparent = [];
    ModifierParentCounter = 1;
    document.getElementById('hfIsGSTVoid').value = '0';
    $('#ddlPaymentMode').val('-1').change();
    $('#hfPaymentType').val('0');
    $("#hfDiscountRemarks").val('');
    $('#txtRemarks').val('');
    $('#txtCreditCardNo').val('');
    $('#txtCreditCardAccountTile').val('');
    $('#tble-ordered-products').empty();
    $('#hfCustomerGroup').val(0);
    $('#hfCustomerAddress').val('');
    EmptyCustomerDDL();
    $('#hfIsNewItemAdded').val('0');
    HolderOrderClicke = 0;
    $("#hfSkuId").val("");
    $("#hfcatId").val("");
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
    $("#ddlCustomer").val(0).change();
    $("#hfCustomerGST").val("0");
    $("#hfCustomerDiscount").val("0");
    $("#hfCustomerDiscountType").val("0");
    $("#hfCustomerServiceCharges").val("0");
    $("#hfCustomerServiceType").val("0");
    $('#hfCustomerNo').val('');
    $("#txtService").val('');
    $("#txtService2").val('');
    $("#txtTakeawayCustomer").val('');

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
    UnlockRecord();
    document.getElementById('dv_lstModifyCategory').style.display = "block";
    document.getElementById('dv_lstModifyProducts').style.display = "block";
    document.getElementById('dv_lstProducts').style.display = "block";
    document.getElementById('dv_lstCategory').style.display = "block";
}

//ON Customer 
function ClearCustomer(CustomerID) {
    CustomerID = JSON.stringify(CustomerID);
    var result = jQuery.parseJSON(CustomerID.replace(/&quot;/g, '"'));
    CustomerID = eval(result.d);
    if (CustomerID[0].CUSTOMER_ID == 0) {
        alert("Primary Contact already exist!.");
        return;
    }
    else {
        $('#txtCustomerCardNo').val('');
        $('#txtOtherContact').val('');
        $('#txtCustomerName').val('');
        $('#txtCustomerAddress').val('');
        $('#txtCustomerCNIC').val('');
        $('#txtCustomerDOB').val('');
        $('#txtPrimaryContact').val('');
        $('#txtEmail').val('');
        $('#txtOpeningAmount').val('');
        $('#txtNature').val('');
        $('#txtBarcode').val('');
        document.getElementById('divCustomer').style.visibility = 'hidden';
        LoadCustomers();
    }
}
function ClearCustomerThirdParty() {
    $('#txtCustomerCardNo').val('');
    $('#txtPrimaryContact').val('');
    $('#txtOtherContact').val('');
    $('#txtCustomerName').val('');
    $('#txtCustomerAddress').val('');
    $('#txtCustomerCNIC').val('');
    $('#txtCustomerDOB').val('');
    $('#txtEmail').val('');
    $('#txtOpeningAmount').val('');
    $('#txtNature').val('');
    $('#txtBarcode').val('');
    document.getElementById('divCustomer').style.visibility = 'hidden';
    LoadCustomersThirdParty();
}

function CancelCustomer() {
    $('#hfCustomerId').val('0');
    $("#dvCustomerGrid").hide();
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
    if ($('#hfCustomerEngagement').val() === "1")
    {
        $('#hfCustomerEngagementCancel').val('1');
        $('#dvHold').trigger("click");
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
function ModifierDone() {
    $('#btnMenuItem').trigger("click");
    //$('#' + $('#hfDefaultCategoryID').val() + '').trigger("click");
    $('#divModifier').hide("slow");
}
//----------------------------------------------------------

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
function sortTableKOT2() {
    var sortOrder = 0;
    var arrData = $('#detail-section-skus2').find('tr').get();
    arrData.sort(function (a, b) {
        var val1 = $(a).children('td').eq(3).text().toUpperCase();
        var val2 = $(b).children('td').eq(3).text().toUpperCase();
        if ($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val2 - val1 : val1 - val2;
        else
            return (val2 < val1) ? -sortOrder : (val2 > val1) ? sortOrder : 0;
    });
    $.each(arrData, function (index, row) {
        $('#detail-section-skus2').append(row);
    });
}
function AddRowFree(obj) {
    if (document.getElementById("hfCan_ComplimentaryItem").value == "True") {
        var rowIndex = $(obj).parent();
        if ($(rowIndex).find('td:eq(41)').text() != "1") {
            $(obj).closest('tr').css({ "background-color": "yellow" });
            $(rowIndex).find('td:eq(41)').text(1);
            $(rowIndex).find('td:eq(6)').text(0);
            var tableData = storeTblValues();
            tableData = JSON.stringify(tableData);
            document.getElementById('hfOrderedproducts').value = tableData;
            setTotals();
        }
    }
}
function VoidGST()
{
    if (document.getElementById("hfCanVoidGST").value == "True") {
        if(parseFloat($("#lblGSTTotal2").text()) > 0)
        {
            document.getElementById('hfIsGSTVoid').value = '1';
        }
        else
        {
            document.getElementById('hfIsGSTVoid').value = '0';
        }
        CalculateBalance2();
    }
}
function DiscountAuthentication()
{
    $('#DiscountValidation').show("slow");
}
function CancelAuthenticateDiscount()
{
    document.getElementById('txtDiscountAuthUserID').value = "";
    document.getElementById('txtDiscountAuthUserPass').value = "";
    document.getElementById('txtDiscountAuthRemarks').value = "";
    document.getElementById('txtDiscountAuth').value = "";
    $('#DiscountValidation').hide("slow");
}
function AuthenticateDiscountUser() {
    if (document.getElementById('txtDiscountAuth').value == "")
    {
        Error("Enter discount!");
        return;
    }
    var UserId = document.getElementById('txtDiscountAuthUserID').value;
    var UserPassword = document.getElementById('txtDiscountAuthUserPass').value;
    $.ajax
        (
            {
                type: "POST", //HTTP method
                url: "frmOrderPOSCallCenter.aspx/ValidateUser", //page/method name
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
            if ($('select#ddlDiscountAuthType option:selected').val() == 1)
            {
                DiscType(document.getElementById("value2"));
            }
            else
            {
                DiscType(document.getElementById("percentage2"));
            }
            document.getElementById("txtDiscount2").disabled = true;
            $("#hfDiscountRemarks").val(document.getElementById('txtDiscountAuthRemarks').value);            
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
function ApplyDiscountTemplate(popup,DiscountDetail) {
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
    else
    {
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
function AddOpenItem()
{
    if($("#txtOpentItemName").val().trim().length == 0)
    {
        Error("Enter Item Name");
        $("#txtOpentItemName").val('');
        $("#txtOpentItemName").focus();
        return;
    }
    if ($("#txtQuantityOpenItem").val().length == 0) {
        Error("Enter Quantity");
        $("#txtQuantityOpenItem").focus();
        return;
    }

    if ($("#txtPriceOpenItem").val().length == 0) {
        Error("Enter Price");
        $("#txtPriceOpenItem").focus();
        return;
    }

    if (parseFloat($("#txtQuantityOpenItem").val()) == 0) {
        Error("Quantity must be greater than zero");
        $("#txtQuantityOpenItem").val('1');
        $("#txtQuantityOpenItem").focus();
        return;
    }

    if (parseFloat($("#txtPriceOpenItem").val()) == 0) {
        Error("Price must be greater than zero");
        $("#txtPriceOpenItem").val('1');
        $("#txtPriceOpenItem").focus();
        return;
    }

    var OpenItemID = 0;
    var lstProducts = document.getElementById("hfOpenItems").value;
    lstProducts = eval(lstProducts);
    for (var i = 0, len = lstProducts.length; i < len; ++i) {
        if(lstProducts[i].SKU_NAME == $("#txtOpentItemName").val())
        {
            OpenItemID = lstProducts[i].SKU_ID;
            break;
        }
    }

    if (OpenItemID > 0) {
        var price = 0;
        if ($("#txtPriceOpenItem").val().length > 0) {
            price = parseFloat($("#txtPriceOpenItem").val());
        }
        addProductToOrderedProductOpenItem(OpenItemID, price, $("#txtQuantityOpenItem").val());
        $("#txtOpentItemName").val('');
        $("#txtQuantityOpenItem").val('');
        $("#txtPriceOpenItem").val('');
        tableData = storeTblValues();
        tableData = JSON.stringify(tableData);
        document.getElementById('hfOrderedproducts').value = tableData;
        setTotals();
        CloseOpenItemPopup();
    }
    else {
if($("#ddlCategoryOpenItem").val() == null || $("#ddlCategoryOpenItem").val() == undefined)
{
Error("Select Category!.");
return;
}
        $.ajax
           (
               {
                   type: "POST", //HTTP method
                   url: "frmOrderPOSCallCenter.aspx/InsertOpenItem", //page/method name
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   data: JSON.stringify({ ItemName: $("#txtOpentItemName").val().trim(), CategoryID: $("#ddlCategoryOpenItem").val(), SectionID: $("#ddlSectionOpenItem").val() }),
                   success: OpenItemAdded,
                   error: function () { Error("Open item not saved!"); }
               }
           );
    }
}
function OpenItemAdded(ItemID) {
    ItemID = eval(ItemID.d);
    var price = 0;
    if ($("#txtPriceOpenItem").val().length > 0) {
        price = parseFloat($("#txtPriceOpenItem").val());
    }
    addProductToOrderedProductOpenItem(ItemID, price, $("#txtQuantityOpenItem").val());
    $("#txtOpentItemName").val('');
    $("#txtQuantityOpenItem").val('');
    $("#txtPriceOpenItem").val('');
    tableData = storeTblValues();
    tableData = JSON.stringify(tableData);
    document.getElementById('hfOrderedproducts').value = tableData;
    setTotals();
    LoadOpenItem();
    CloseOpenItemPopup();
}
function ApplyCustomerGST()
{
    $("#hfCustomerGST").val($("#txtCustomerGSTValue").val());
    setTotals();
}
function DeliveryChannelClick() {
    $('#txtPrimaryContact').val('');
    $("#tbl-customers").empty();
    $("#dvCustomerGrid").hide();
}
function PlaySound() {
    audio.play();
}
function StopSound() {
    audio.pause();
    audio.currentTime = 0.0;
}