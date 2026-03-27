<%@ Page Language="C#" AutoEventWireup="true" ValidateRequest="false"
    CodeFile="frmOrderPOSCode.aspx.cs"
    Inherits="Forms_frmOrderPOSCode"
    EnableEventValidation="false" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="cc1" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>CORN :: Point of Sales</title>
    <link href="../css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../css/zebra_dialog.css" rel="stylesheet" type="text/css" />
    <link href="../css/tree-style.css" rel="stylesheet" type="text/css" />
    <link href="../css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link rel="icon" type="image/x-icon" href="../images/icon.ico">
    <link href="../css/calender.css" rel="stylesheet" type="text/css" />
    <link href="../AjaxLibrary/select2/dist/css/select2.min.css" rel='stylesheet' type='text/css'>
    <link href="../css/CustomKeyBoard.css" rel="stylesheet" type="text/css" />
    <style>
        html {
            height: 100vh;
            overflow: hidden;
        }

        .container {
            margin-top: 1vh;
            margin-bottom: 0px !important;
            height: 100vh;
            min-height: 98vh;
            max-height: 98vh;
        }

        .order-tab + .order-tab {
            margin-left: 0%;
        }

        .s1-center {
            float: left;
            width: 76%;
        }

        div .logo_main {
            width: 8%;
        }

        .exit-text {
            display: none;
        }

        @media (min-width: 1441px) {
            .bg-w {
                height: 29vh;
            }

            .emp-table {
                height: 35vh;
            }

            .bg-product {
                height: 43vh;
            }

            .height-180 {
                height: 20vh;
            }

            .vac-det {
                height: 23vh;
            }
        }

        @media (max-width: 1440px) {
            .divCustomer {
                top: -12vh !important;
            }

            .CustInf {
                max-height: 475px;
                overflow: auto;
            }

            .customerLedger {
                max-width: 250px !important;
                margin-top: 14%;
            }

            .bg-w {
                height: 22vh;
            }

            .emp-table {
                height: 28vh;
            }

            .bg-product {
                height: 47vh;
            }

            .height-180 {
                height: 15vh;
            }

            .vac-det {
                height: 18vh;
            }
        }
    </style>
</head>
<body onload="BillTime()">
    <form id="Form1" method="POST" runat="server">
        <asp:ScriptManager ID="MainScriptManager" runat="server" AsyncPostBackTimeout="30000"
            EnablePartialRendering="true" />
        <asp:HiddenField runat="server" ID="hfServiceType" Value="0" />
        <asp:HiddenField runat="server" ID="hfProduct" />
        <asp:HiddenField runat="server" ID="hfOrderedproducts" />
        <asp:HiddenField runat="server" ID="hfSalesTax" />
        <asp:HiddenField runat="server" ID="hfSalesTaxCreditCard" />
        <asp:HiddenField runat="server" ID="hfIsCoverTable" />
        <asp:HiddenField runat="server" ID="hfServiceCharges" />
        <asp:HiddenField runat="server" ID="hfCompanyName" />
        <asp:HiddenField runat="server" ID="hfLocationName" />
        <asp:HiddenField runat="server" ID="hfAddress" />
        <asp:HiddenField runat="server" ID="hfPhoneNo" />
        <asp:HiddenField runat="server" ID="hfRegNo" />
        <asp:HiddenField runat="server" ID="hfFacebkId" />
        <asp:HiddenField runat="server" ID="hfCompanyEmail" />
        <asp:HiddenField runat="server" ID="hfInvoiceId" />
        <asp:HiddenField runat="server" ID="hfPaymentType" />
        <asp:HiddenField runat="server" ID="hfPaymentType2" />
        <asp:HiddenField runat="server" ID="hfDiscountType" />
        <asp:HiddenField runat="server" ID="hfCurrentWorkDate" />
        <asp:HiddenField runat="server" ID="hfskuId" />
        <%-- Used on Deletion and Decrease Qty--%>
        <asp:HiddenField runat="server" ID="hfcatId" />
        <asp:HiddenField runat="server" ID="hfUserClick" />
        <asp:HiddenField runat="server" ID="hfDisable" Value="0" />
        <asp:HiddenField runat="server" ID="hfCustomerId" Value="0" />
        <asp:HiddenField ID="hfCustomerNo" runat="server" Value="" />
        <asp:HiddenField runat="server" ID="hfBookingType" Value="0" />
        <asp:HiddenField runat="server" ID="hfReport" Value="" />
        <asp:HiddenField runat="server" ID="hfRowIndex" Value="" />
        <%-- Used for Toggle color on row Click --%>

        <%--for Yes and no's--%>
        <asp:HiddenField runat="server" ID="hfRow" Value="" />
        <asp:HiddenField ID="hfUserId" Value="" runat="server" />
        <asp:HiddenField ID="hfCounter" Value="0" runat="server" />
        <%-- Used for Serials on Item Click --%>
        <asp:HiddenField runat="server" ID="hfCheckSMS" Value="0" />
        <%-- update on Delivery bills icon Click --%>
        <asp:HiddenField runat="server" ID="hfCategoryType" Value="0" />
        <%-- update on Category Type Selection Modifer or Menu --%>
        <asp:HiddenField runat="server" ID="hfDealId" Value="0" />
        <asp:HiddenField ID="hfSTRN" runat="server" Value="" />
        <input type="hidden" name="hfDelIndex" id="hfDelIndex" value=""><%-- Used counter C1 for index Quantity,Delete Decrease--%>
        <input type="hidden" name="hfDelId" id="hfDelId" value=""><%-- Get DealID of row index for Quantity Decrease--%>
        <input type="hidden" name="hfSkuId" id="hfSkuId" value=""><%-- Used for getting modifier Items on Selection--%>

        <asp:HiddenField runat="server" ID="hfStockStatus" Value="0" />
        <input type="hidden" name="hfCardNo" id="hfCardNo" value="">
        <input type="hidden" name="hfCardTypeId" id="hfCardTypeId" value="0">
        <input type="hidden" name="hfCardDiscount" id="hfCardDiscount" value="0">
        <input type="hidden" name="hfCardPoints" id="hfCardPoints" value="0">
        <input type="hidden" name="hfCardPurchasing" id="hfCardPurchasing" value="0">
        <input type="hidden" name="hfCardAmountLimit" id="hfCardAmountLimit" value="0">

        <asp:HiddenField runat="server" ID="hfIsCard" Value="0" />
        <input type="hidden" name="hfchkDiscountType" id="hfchkDiscountType" value="0" />


        <asp:HiddenField runat="server" ID="hfCan_DineIn" Value="" />
        <asp:HiddenField runat="server" ID="hfCan_Delivery" Value="" />
        <asp:HiddenField runat="server" ID="hfCan_TakeAway" Value="" />
        <asp:HiddenField ID="hfVoidBy" runat="server" Value="" />
        <asp:HiddenField ID="hfIS_CanGiveDiscount" runat="server" Value="0" />
        <asp:HiddenField ID="hfModifiedItemsShown" runat="server" Value="0" />
        <asp:HiddenField ID="hfPrintKOT" runat="server" Value="0" />
        <asp:HiddenField ID="hfPrintKOTDelivery" runat="server" Value="0" />
        <asp:HiddenField ID="hfPrintKOTTakeaway" runat="server" Value="0" />
        <asp:HiddenField runat="server" ID="hfCan_PrintOrder" Value="" />
        <asp:HiddenField ID="hfGrandTotal" runat="server" Value="0" />
        <asp:HiddenField ID="hfTaxAuthorityLabel" runat="server" Value="0" />
        <asp:HiddenField ID="hfTaxAuthorityLabel2" runat="server" Value="0" />
        <asp:HiddenField ID="hfGSTCalculation" runat="server" Value="0" />
        <asp:HiddenField ID="hfServiceChargesCalculation" runat="server" Value="1" />
        <asp:HiddenField ID="hfServiceChargesValue" runat="server" Value="0" />
        <asp:HiddenField ID="hfDeliveryChannelType" runat="server" Value="1" />
        <asp:HiddenField ID="hfIsOldOrder" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsKOTMandatory" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsKOTUniquePerDay" runat="server" Value="0" />
        <asp:HiddenField ID="hfPrintCustomerOnDelivery" runat="server" Value="0" />
        <asp:HiddenField ID="hfServiceChargesType" runat="server" Value="1" />
        <asp:HiddenField ID="hfShowNTNOnProvissionalBill" runat="server" Value="1" />
        <asp:HiddenField ID="hfBillFormat" runat="server" Value="1" />
        <asp:HiddenField ID="hfTaxAuthority" runat="server" Value="0" />
        <asp:HiddenField ID="hfProvisionalBillHeaderFormat" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsNewItemAdded" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsFullKOT" runat="server" Value="0" />
        <asp:HiddenField ID="hfHideOrderInvoieNo" runat="server" Value="0" />
        <asp:HiddenField ID="hfDeliveryChannel" runat="server" Value="0" />
        <asp:HiddenField ID="hfCanVoidGST" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsGSTVoid" runat="server" Value="0" />
        <asp:HiddenField ID="hfItemWiseDiscount" runat="server" Value="0" />
        <asp:HiddenField ID="hfIsPriceOpenOnPOS" runat="server" Value="0" />
        <asp:HiddenField ID="hfEmployeeDiscountType" runat="server" Value="" />
        <asp:HiddenField ID="hfInvoiceFooterType" runat="server" Value="0" />
        <asp:HiddenField ID="hfItemWiseGST" runat="server" Value="0" />
        <asp:HiddenField ID="hfCustomerInfoOnBill" runat="server" Value="0" />
        <asp:HiddenField ID="hfCustomerInfo" runat="server" Value="" />
        <asp:HiddenField ID="hftblPromotion" runat="server" Value="" />
        <asp:HiddenField ID="hftblGroupDetail" runat="server" Value="" />
        <asp:HiddenField ID="hfAutoPromotion" runat="server" Value="0" />
        <asp:HiddenField ID="hfCustomerGroup" runat="server" Value="0" />
        <asp:HiddenField ID="hfPrintInvoiceFromWS" runat="server" Value="0" />
        <asp:HiddenField ID="hfHiddenReports" runat="server" Value="0" />
        <asp:HiddenField ID="hfLocationNameOnKOT" runat="server" Value="0" />
        <asp:HiddenField ID="hfDiscountAuthentication" runat="server" Value="0" />
        <asp:HiddenField ID="hfDiscountRemarks" runat="server" Value="0" />
        <asp:HiddenField ID="hfInvoiceNo" runat="server" Value="0" />
        <asp:HiddenField ID="hfBankDiscount" runat="server" Value="" />
        <asp:HiddenField ID="hfCustomerAdvance" runat="server" Value="" />
        <asp:HiddenField ID="hfCustomerAdvanceAmount" runat="server" Value="0" />
        <asp:HiddenField ID="hfCanVoidOrder" runat="server" Value="0" />
        <asp:HiddenField ID="hfTakeawayTokenIDMandatory" runat="server" Value="0" />
        <asp:HiddenField ID="hfShowModifirPriceOnBills" runat="server" Value="0" />
        <asp:HiddenField ID="hfEatIn" runat="server" Value="0" />
        <asp:HiddenField ID="hfAmountDue" runat="server" Value="0" />
        <asp:HiddenField ID="hfServiceChargesOnTakeaway" runat="server" Value="0" />
        <asp:HiddenField ID="hfHideBillNo" runat="server" Value="0" />
        <asp:HiddenField runat="server" ID="hfIsDeliveryCharges" Value="0" />
        <asp:HiddenField runat="server" ID="hfDELIVERY_CHARGES_TYPE" Value="0" />
        <asp:HiddenField runat="server" ID="hfDELIVERY_CHARGES_VALUE" Value="0" />
        <asp:HiddenField ID="hfDailySalesReportColumns" runat="server" Value="" />
        <asp:HiddenField ID="hfPOSCodeAddToGrid" runat="server" Value="0" />
        <asp:HiddenField ID="hfHidePrintInvoiceButton" runat="server" Value="0" />
        <asp:HiddenField ID="hfInvoiceFormat" runat="server" Value="1" />
        <asp:HiddenField ID="hfShowDatesOnPOSReports" runat="server" Value="0" />
        <asp:HiddenField ID="hfPOSFee" runat="server" Value="0" />
        <asp:HiddenField ID="hfQRCodeImageName" runat="server" Value="" />
        <asp:HiddenField ID="hfPaymentModes" runat="server" Value="" />
        <span id='ct' style="display: none;"></span><%--Getting Current Time of System For Calculating Order Time--%>
        <div class="container" style="margin-bottom: 5px;">
            <div class="row">
                <div class="s1-left">
                    <div class="logom logo_main">
                        <img id="imgLogo" src="../images/watch.png" runat="server" alt="../images/watch.png" />
                        <input type="text" id="username" style="width: 0; height: 0; visibility: hidden; position: absolute; left: 0; top: 0" />
                        <input type="password" style="width: 0; height: 0; visibility: hidden; position: absolute; left: 0; top: 0" />
                    </div>
                    <div class="s1-right">
                        <div class="user-detail">
                            <span class="user-detail-bold" id="user-detail-bold">
                                <asp:Literal ID="lblUserName" runat="server" Text="Label"></asp:Literal></span><br />
                            <asp:Literal ID="lblDateTime" runat="server" Text="Label"></asp:Literal>
                        </div>
                        <div class="nav-ic" style="cursor: pointer;">
                            <img src="../images/nav-opt.png" alt="Nav" />
                            <div class="exit-text">
                                <asp:LinkButton runat="server" ID="lnkExit" OnClick="lnkExit_OnClick">Exit</asp:LinkButton>
                                <a id="lnkHelp" href="#" onclick="ShwoShortKeyHelp();">Short keys</a>
                            </div>
                        </div>
                    </div>
                    <div class="s1-center">
                        <div class="order-tab" style="border-radius: 5px !important; height: 66px; background-color: #ffffff; cursor: auto; width: 25%;">
                            <div id="dvCustomerLedger" style="margin-top: 30px">
                                <span class="order-tab-blk" style="text-align: left;">
                                    <asp:DropDownList ID="ddlCustomer" runat="server" Width="100%">
                                        <asp:ListItem Value="0" Text="Select Customer"></asp:ListItem>
                                        <asp:ListItem Value="1" Text="Select Customer"></asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:HiddenField runat="server" ID="hfCustomer" Value="0" />
                                </span>
                            </div>
                            <label id="MaxOrderNo" style="display: none;"></label>
                            <div id="messageBox" style="padding: 0; color: red; margin-top: 20px;">
                            </div>
                        </div>
                        <div class="order-tab" style="background: white;">
                            <label id="lblManualOrderNo" style="font-weight: normal;">
                                Manual KOT No</label>
                            <br />
                            <span class="order-tab-blk">
                                <asp:TextBox runat="server" ID="txtManualOrderNo" Width="88%" Height="25px" MaxLength="10"></asp:TextBox>
                            </span>
                        </div>
                        <div class="order-tab" style="background: white;">
                            <label id="lblSaleForce" style="font-weight: normal;">
                                Order Taker</label>
                            <br />
                            <span class="order-tab-blk">
                                <asp:DropDownList runat="server" ID="ddlOrderBooker" Width="88%">
                                </asp:DropDownList>
                            </span>
                        </div>
                        <div class="order-tab" style="background: white;">
                            <label id="lblCoverTable" style="font-weight: normal;">
                                Cover Table</label>
                            <br />
                            <span class="order-tab-blk">
                                <asp:TextBox runat="server" ID="txtCoverTable" Width="88%" Height="25px" MaxLength="4"
                                    onkeypress="return onlyNumbers(this,event);"></asp:TextBox>
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="clear">
                    </div>
                </div>
                <div style="height: 15px; float: right; margin-right: 10px;">
                    <asp:Label ID="lblLicense" runat="server" Text="" ForeColor="Red" Font-Bold="true"></asp:Label>
                </div>
                <div style="height: 15px;margin-right: 10px;">
                    <label id="lblKOTNotification" style="font-weight: bold;color:red"></label>
                </div>
                <div class="col-md-6 gray-bg">
                    <div class="col-md-12 delivery_main">
                        <div class="btn-bg">
                            <asp:HiddenField runat="server" ID="hfCustomerType" Value="Dine In" />
                            <asp:HiddenField runat="server" ID="hfDefaultServiceType" Value="Dine In" />
                            <div class="box" id="lnkTakeaway" onclick="lnkCustomerType(this, 0);">
                                <span>
                                    <img src="../images/Cus.png" alt="" /></span>
                                Takeaway
                                    <label id="lblCounter1"></label>
                            </div>
                            <div class="box" id="lnkDelivery" onclick="lnkCustomerType(this, 0);" aria-disabled="true">

                                <span>
                                    <img src="../images/delivery.png" alt="" /></span>
                                Delivery
                                    <label id="lblCounter2"></label>
                            </div>
                            <div class="box active" id="lnkDineIn" onclick="lnkCustomerType(this, 0);">

                                <span>
                                    <img src="../images/dine.png" alt="" /></span>
                                Dine In
                                    <label id="lblCounter3"></label>
                            </div>
                            <div id="divCustomer" style="min-width: 190%; z-index: 5000; top: -8vh; left: 3.5%; position: absolute; background-color: rgb(198, 198, 198); padding: 0px 10px 10px; border: 1px solid rgb(0, 0, 0); max-width: 190%; visibility: hidden; border-radius: 7px;">
                                <div class="row">
                                    <div class="col-md-12 new-col">
                                        <p style="margin: 0px 40px 0px 10px; padding: 20px 0px;">Customer Information</p>
                                    </div>

                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="col-md-6 CustInf">
                                            <div class="col-md-12" style="margin-top: 15px;">
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Delivery Channel
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;" id="dvDeliveryChannel" onclick="DeliveryChannelClick()">
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Name <span style="color: red">*</span>
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtCustomerName" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />

                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Primary Contact <span style="color: red">*</span>
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtPrimaryContact" runat="server" class="form-control" style="font-size: 15px; height: 28px;"
                                                        onkeypress="return onlyNumbers(this,event);" />
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Address <span style="color: red">*</span>
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtCustomerAddress" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />

                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Other Contact
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtOtherContact" runat="server" class="form-control" style="font-size: 15px; height: 28px;"
                                                        onkeypress="return onlyNumbers(this,event);" />
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Gender
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <asp:DropDownList runat="server" ID="ddlGender" class="form-control">
                                                        <asp:ListItem Value="1" Text="Male"></asp:ListItem>
                                                        <asp:ListItem Value="2" Text="Female"></asp:ListItem>
                                                        <asp:ListItem Value="3" Text="Kid"></asp:ListItem>
                                                    </asp:DropDownList>
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Occupation
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <asp:DropDownList runat="server" ID="ddlOccupation" class="form-control">
                                                        <asp:ListItem Value="1" Text="Business Owner"></asp:ListItem>
                                                        <asp:ListItem Value="2" Text="Employee"></asp:ListItem>
                                                        <asp:ListItem Value="3" Text="Student"></asp:ListItem>
                                                    </asp:DropDownList>
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Email
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtEmail" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />
                                                </div>

                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        CNIC
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px;">
                                                    <input type="text" id="txtCustomerCNIC" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />

                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Date of Birth
                                                    </label>
                                                </div>
                                                <div class="col-md-7" style="margin-top: 7px;">
                                                    <asp:TextBox ID="txtCustomerDOB" runat="server" class="form-control" Style="font-size: 15px; height: 28px;" />
                                                </div>
                                                <div class="col-md-1" style="margin: 7px -20px;">
                                                    <input type="image" id="ibtnCustomerDOB" src="../images/calender.png" style="width: 33px" />
                                                    <cc1:CalendarExtender ID="CEStartDate" runat="server" TargetControlID="txtCustomerDOB"
                                                        PopupButtonID="ibtnCustomerDOB" Format="dd-MMM-yyyy" PopupPosition="TopRight" CssClass="calender"></cc1:CalendarExtender>
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px; display: none;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Card ID
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px; display: none;">
                                                    <input type="text" id="txtCustomerCardNo" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />

                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px; display: none;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Nature
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px; display: none;">
                                                    <input type="text" id="txtNature" runat="server" class="form-control" style="font-size: 15px; height: 28px;" />
                                                </div>
                                                <div class="col-md-4" style="margin-top: 7px; display: none;">
                                                    <label style="font: bold 17px sans-serif;">
                                                        Opening Points
                                                    </label>
                                                </div>
                                                <div class="col-md-8" style="margin-top: 7px; display: none;">
                                                    <input type="text" id="txtOpeningAmount" runat="server" class="form-control" style="font-size: 15px; height: 28px;"
                                                        onkeypress="return onlyDotsAndNumbers(this,event);" value="0" />
                                                </div>
                                                <div class="col-md-5">
                                                </div>
                                                <div class="col-md-3 btn-mar">
                                                    <button class="btn btn-toolbar" type="button" style="min-width: 100px; font-size: 15px; color: #FFF; background-color: #3c8d75;"
                                                        id="btnSaveCustomer" onclick="SaveCustomer();">
                                                        Save</button>

                                                </div>
                                                <div class="col-md-4 btn-mar">
                                                    <button class="btn btn-toolbar" type="button" style="min-width: 100px; font-size: 15px; color: #FFF; background-color: #f94d72;"
                                                        id="btnCancelCustomer" onclick="CancelCustomer();">
                                                        Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6" style="border-left: 1px solid #dadada;">
                                            <div class="col-md-12" style="margin-top: 7px;">
                                                <input type="text" id="txtCustomerSearch" class="form-control" style="font-size: 18px;"
                                                    placeholder="Search" />
                                            </div>
                                            <div class="col-md-12 table-top">
                                                <div class="table-bar">
                                                    <div class="emp-table scrolla" style="height: 400px;">
                                                        <table class="table table-striped table-bordered table-hover table-condensed cf">
                                                            <thead class="cf head" style="background-color: #7dab49;">
                                                                <tr>
                                                                    <th class="numeric table-text-head">Customer Name
                                                                    </th>
                                                                    <th class="numeric table-text-head">Card Id
                                                                    </th>
                                                                    <th class="numeric table-text-head">Contact No
                                                                    </th>
                                                                    <th class="numeric table-text-head">Address
                                                                    </th>
                                                                    <th colspan="2" class="numeric table-text-head" style="align-content: center;">Action
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="tbl-customers">
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                    </div>
                                </div>

                            </div>
                            <div class="clear">
                            </div>
                        </div>
                        <div class="clear">
                        </div>
                        <!--2nd level start-->
                        <div class="bg-w" style="height: 80px; margin-left: 5px; margin-right: 10px; background-color: #eff2f8;">
                            <div class="order-tab" style="background-color: #eff2f8; width: 100%; text-align: left;">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="width: 20%; padding-right: 10px;">
                                            <input id="cbScan" name="cbScan" type="checkbox" />
                                            <label id="lblcbScan" style="font-weight: normal;">W.S Scan</label>
                                            <br />
                                            <label id="lblSKUCode" style="font-weight: normal;">Item Code</label>
                                            <br />
                                            <span class="order-tab-blk">
                                                <asp:TextBox runat="server" ID="txtSKUCode" Width="100%" Height="25px" onkeypress="GetSKUInfo(event);"></asp:TextBox>
                                            </span>
                                        </td>
                                        <td style="width: 40%; padding-right: 10px;">
                                            <br />
                                            <label id="lblSKUName" style="font-weight: normal;">Item Name</label>
                                            <br />
                                            <span class="order-tab-blk">
                                                <asp:TextBox runat="server" ID="txtSKUName" Width="100%" Height="25px" ReadOnly="true"></asp:TextBox>
                                            </span>
                                        </td>
                                        <td style="width: 20%; padding-right: 10px;">
                                            <br />
                                            <label id="lblSKUPrice" style="font-weight: normal;">Price</label>
                                            <br />
                                            <span class="order-tab-blk">
                                                <asp:TextBox runat="server" ID="txtSKUPrice" Width="100%" Height="25px" ReadOnly="true" onkeypress="AddProductToGrid(event);" onfocus="this.select();" onmouseup="return false;"></asp:TextBox>
                                            </span>
                                        </td>
                                        <td style="width: 20%">
                                            <br />
                                            <label id="lblSKUQty" style="font-weight: normal;">Quantity</label>
                                            <br />
                                            <span class="order-tab-blk">
                                                <asp:TextBox runat="server" ID="txtQuantity" Width="100%" Height="25px" onkeypress="AddProductToGrid(event);" onfocus="this.select();" onmouseup="return false;"></asp:TextBox>
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <!--2nd level ends-->
                    </div>
                    <div class="col-md-12 item_pd_top" style="padding-right: 0px;">
                        <div class="col-md-12 table-top item_pd_left">
                            <div class="table-bar">
                                <div class="emp-table scrolla" style="height: 344px;">
                                    <table class="table table-striped table-bordered table-hover table-condensed cf">
                                        <thead class="cf head" style="background-color: #7dab49;">
                                            <tr>
                                                <th class="numeric table-text-head">CODE
                                                </th>
                                                <th class="numeric table-text-head">ITEM(S)
                                                </th>
                                                <th class="table-text-head" style="text-align: center;" colspan="3">QTY
                                                </th>
                                                <th class="numeric table-text-head">PRICE
                                                </th>
                                                <th class="numeric table-text-head">AMOUNT
                                                </th>
                                                <th class="numeric table-text-head"></th>
                                            </tr>
                                        </thead>
                                        <tbody id="tble-ordered-products">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-12" style="background-color: #7dab49; padding: 3px 0px 3px 30px; color: #fff; font-size: medium">
                                <div class="row">
                                    <div class="col-md-3" id="dvTakeawayCustomer" style="display: none;">
                                        <input type="text" id="txtTakeawayCustomer" runat="server"
                                            class="form-control" placeholder="Takeaway Customer" />
                                    </div>
                                    <div class="col-md-3" id="dvTableNo">
                                        Table No : 
                                        <label id="TableNo1">N/A</label>
                                    </div>
                                    <div class="col-md-3">
                                        Order No : 
                                        <label id="OrderNo1">N/A</label>
                                    </div>
                                    <div class="col-md-3">
                                        Gross Amount : 
                                    <label id="lblTotalGrossAmount">0.00</label>
                                    </div>
                                    <div class="col-md-3">
                                        Net Amt : 
                                    <label id="lblTotalNetAmount">0.00</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-md-6 gray-bg">
                    <div class="col-md-12">
                        <div class=" btn-bg">
                            <div class="box-last" onclick="NewOrder();">
                                New Order<br />
                                <span>
                                    <img src="../images/new-icon.png" alt="" /></span>
                            </div>

                            <div class="box-last" id="dvHold">
                                Hold Order<br />
                                <span>
                                    <img src="../images/pause.png" alt="" /></span>
                            </div>
                            <div class="box-last" onclick="PrintOrder();">
                                Print Order<br />
                                <span>
                                    <img src="../images/pr.png" alt="" /></span>
                            </div>
                            <div class="box-last" id="PrintInvoice">
                                Print Invoice<br />
                                <span>
                                    <img src="../images/print.png" alt="" /></span>
                            </div>
                            <div class="box-last" id="Payments">
                                Payments<br />
                                <span>
                                    <img src="../images/cur.png" style="margin-top: 10px;" alt="" /></span>
                            </div>
                            <div class="box-last" id="btnShowReports">
                                Reports<br />
                                <span>
                                    <img src="../images/file.png" style="margin-top: 10px;" alt="" /></span>
                            </div>
                            <div class="clear">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 table-top item_pd_left" style="padding-top: 0px; padding-bottom: 10px;">
                        <div style="width: 100%; background-color: #eff2f8; float: left; padding: 5px 5px;">
                            <div class="col-md-12 vac-det" style="border-right: 1px solid cadetblue; height: 30px;">
                                <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                    <input type="text" id="txtRemarks" runat="server"
                                        class="form-control" placeholder="ORDER NOTES" style="width: 95%; height: 24px;" />
                                </div>
                            </div>
                        </div>
                        <div class="table-bar">
                            <div class="col-md-7 vac-det" style="border-right: 1px solid cadetblue; height: 360px;" id="dvTableList">
                                <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                    <input type="text" id="txtVacantTable" runat="server"
                                        class="form-control" placeholder="VACANT TABLES" style="width: 94%; height: 24px;" />
                                </div>
                                <div class="col-md-12 height-180 table-bar scrolla" style="height: 320px;">
                                    <div class="pad" id="dv_lstTable">
                                    </div>
                                    <asp:HiddenField runat="server" ID="hfTableNo" />
                                    <asp:HiddenField ID="hfTableId" Value="0" runat="server" />
                                </div>
                            </div>
                            <div class="col-md-5 vac-det " id="dvPendingBills" style="height: 350px;">
                                <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                    <input type="text" id="txtPendingBills" runat="server"
                                        class="form-control" placeholder="PENDING BILLS" style="width: 94%; height: 24px;" />
                                </div>
                                <div class="height-180 scrolla peb" style="width: 100%; height: 320px;">
                                    <table class="pbill" id="tbl-pending-bills" style="width: 100%;">
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="col-md-12 item_pd_left">
                        <div class="col-md-12" style="padding: 3px 0px 3px 0px; font-size: medium">
                            <div class="row">
                                <div class="col-md-4">
                                </div>
                                <div class="col-md-3" id="dvDealQty" style="display: none;">
                                    <input type="text" id="txtDealQty" runat="server"
                                        class="form-control" placeholder="Deal Qty" onkeypress="return onlyNumbers(this,event);" />
                                </div>
                                <div class="col-md-2" id="dvDealUpdate" style="display: none;">
                                    <button type="button" runat="server"
                                        class="btn btn-toolbar" id="btnDealUpdate" onclick="UpdateDeal();">
                                        Update</button>
                                </div>
                                <div class="col-md-3" id="dvClosingStock" style="display: none">
                                    <div class="col-md-5">
                                        <label id="lblClosing" style="font-weight: normal;">
                                            Closing</label>
                                    </div>
                                    <div class="col-md-7">
                                        <input type="text" id="txtClosingStock" disabled="disabled"
                                            class="form-control" runat="server" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <label id="DealPrice" style="display: none">0</label>
        </div>
        <%-- Order Print Information --%>

        <% Response.WriteFile("~/Forms/printKOT.htm");%>

        <%-----------------------------%>

        <%-- Invoice Print Information --%>
        <div style="display: none; width: 3.2in">
            <div id="dvSaleInvoice">
                <style type="text/css">
                    #dvSaleInvoice {
                        width: 2.5in;
                    }

                    #SaleInvoice {
                        width: 2.5in;
                    }

                    #CompanyName {
                        font-size: 18px;
                        font-weight: bold;
                    }

                    #SaleInvoiceText {
                        font-size: 14px;
                    }

                    #InvoiceDate {
                        font-weight: bold;
                    }

                    #CustomerType {
                        font-weight: bold;
                    }

                    #phoneNo {
                        font-weight: bold;
                    }

                    #hrSaleInvoiceHead {
                        border: #333333 solid 1px;
                    }

                    #invoiceDetail {
                        width: 92%;
                        margin-top: 10px;
                    }

                    #invoiceDetailBody tr td {
                        border: #333333 solid 2px;
                        font-family: sans-serif;
                        font-size: 10px;
                        font-weight: normal;
                        padding: 5px;
                    }

                    #GrandTotal-value {
                        font-weight: bold;
                    }
                </style>
                <table id="SaleInvoice">
                    <tr>
                        <td colspan="2">
                            <table align="center">
                                <tr>
                                    <td class="logom2" style="width: 100%;">
                                        <img id="imgLogo2" runat="server" src="../images/watch.png" />
                                    </td>

                                </tr>
                            </table>
                        </td>

                    </tr>

                    <tr>
                        <td colspan="2" align="center">
                            <span style="font-size: 10px;">
                                <%=hfFacebkId.Value %></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-size: 16px; font-family: sans-serif; font-style: italic;">
                            <label id="SaleInvoiceText">
                                Sale Invoice</label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-style: italic; font-family: sans-serif; font-size: 9px;">
                            <label id="CompanyAddress" style="font-size: 10px;">
                                <%=hfAddress.Value %>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-style: italic; font-family: sans-serif; font-size: 9px;">
                            <label id="CompanyNumber" style="font-size: 10px;">
                                Ph: &nbsp;<%=hfPhoneNo.Value %>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <label id="InvoiceDate">
                                12-dec-2014 12:02 PM
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 40%;">
                            <label id="CustomerType">
                                DINE IN</label>
                        </td>
                        <td align="right" style="width: 60%;">
                            <label id="PayType">
                            </label>
                        </td>
                    </tr>
                    <tr id="trNTN">
                        <td align="left" style="font-style: italic; font-size: 12px; margin-bottom: 5px; width: 30%">
                            <span id="RegNo" style="font-style: normal; font-size: 12px; display: none;"><%=hfTaxAuthorityLabel2.Value%> : &nbsp;<%=hfRegNo.Value%></span>
                        </td>
                        <td align="left" style="font-style: italic; font-size: 12px; margin-bottom: 5px; width: 70%;">
                            <span id="spSTRN" style="font-style: normal; font-size: 12px; display: none;">STRN : &nbsp;<%=hfSTRN.Value%></span>
                        </td>
                    </tr>
                    <tr>
                        <%-- Cashier --%>
                        <td align="left" style="width: 100%" colspan="2">
                            <span id="Cashier" style="margin-left: 0%; font-size: 12px; font-style: normal;"></span>
                        </td>
                    </tr>
                    <tr>
                        <%--OrderBooker and CoverTable--%>
                        <td style="width: 50%;">
                            <span id="OrderTakerName" style="font-size: 12px; display: none;"></span>
                            <span id="OrderTaker" style="font-style: normal; font-size: 12px; display: none;"></span>
                        </td>
                        <td style="width: 50%; text-align: right;">
                            <span id="CoverTable" style="font-style: normal; font-size: 12px;" />
                        </td>
                    </tr>
                    <tr>
                        <%--Customer Name and Address --%>
                        <td align="left" style="width: 100%" colspan="2">
                            <%--In Delivery Type used as Customer Phone 
                            <span id="CustomerNameDetail" style="font-style: italic; font-size: 12px; width: 15%; display:none;" ></span>--%>
                            <span id="CustomerDetail" style="margin-left: 0%; font-size: 12px; font-style: normal; display: none;"></span>
                        </td>
                    </tr>
                    <tr id="trOrderNo">
                        <td align="left" style="width: 60%"></td>
                        <td align="left" style="width: 40%">
                            <span id="OrderInvoiceName" style="font-size: 12px;">Order No:  </span>
                            <span id="OrderInvoice" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 100%" colspan="2">
                            <span style="font-size: 12px;">Order Time:  </span>
                            <span id="OrderTime" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>
                        </td>
                    </tr>
                    <tr>
                        <%--Table No and Bill No --%>
                        <td align="left" style="width: 60%">

                            <%--In Delivery Type used as Customer Phone --%>
                            <span id="InvoiceTableName" style="font-size: 12px; width: 15%; margin-bottom: 8px;"></span>
                            <span id="InvoiceTable" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>


                        </td>
                        <td align="left" style="width: 40%">
                            <span id="BillNoName" style="font-size: 12px;">Bill No:</span>
                            <span id="BillNo" style="margin-left: 2%; font-style: normal; font-size: 12px;"></span>
                        </td>
                    </tr>
                    <tr id="trKOTNo">
                        <td align="left" style="width: 100%">
                            <span id="KOTNo" style="font-size: 12px;">KOT No:  </span>
                        </td>
                    </tr>
                    <tr id="trTakeawayOrderNo" style="display: none;">
                        <td colspan="2">
                            <span id="spanTakeawayOrderNo" style="font-size: 20px; font-weight: bold;">Order No:  </span>
                        </td>
                    </tr>
                    <tr>
                        <%--Product Detail--%>
                        <td colspan="2">
                            <table id="invoiceDetail">
                                <thead id="invoiceDetailHead">
                                    <tr>
                                        <td style="text-align: left; font-size: 12px; font-family: sans-serif; width: 35%">Item Name
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 10%">Qty
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 10%">Rate
                                        </td>
                                        <td id="tdDiscount" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">Disc
                                        </td>
                                        <td id="tdGSTPer" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">GST %
                                        </td>
                                        <td id="tdGSTValue" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">GST
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 15%">Amount
                                        </td>
                                    </tr>
                                </thead>
                                <tbody id="invoiceDetailBody">
                                </tbody>
                                <tfoot id="invoiceDetailFoot">
                                    <%--Calculation Detail--%>
                                    <tr id="trTotal">
                                        <td colspan="6" align="right" id="tdTotal">
                                            <label id="TotalValue-text">
                                                Total :</label>
                                        </td>
                                        <td align="right">
                                            <label id="TotalValue">
                                                6000</label>
                                        </td>
                                    </tr>
                                    <tr id="trTotal2" style="display: none;">
                                        <td colspan="6" align="right" id="tdTotal2">
                                            <label id="TotalValue-text2">
                                                Grand Total :</label>
                                        </td>
                                        <td align="right">
                                            <label id="TotalValue2">
                                                6000</label>
                                        </td>
                                    </tr>
                                    <tr id="GstRow2" style="display: none;">
                                        <td colspan="6" align="right" id="tdGst2">
                                            <label id="GST-text2">
                                                <%=hfTaxAuthorityLabel.Value%> @<%=hfSalesTax.Value %> % :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Gst-value2">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="GstRowCredit2" style="display: none;">
                                        <td colspan="6" align="right">
                                            <label id="GST-textCredit2" id="tdGstCredit2">
                                                <%=hfTaxAuthorityLabel.Value%> @<%=hfSalesTaxCreditCard.Value %> % :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Gst-valueCredit2">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="trExcusiveSalesTax" style="display: none;">
                                        <td colspan="6" align="right" id="tdExclusiveTax">
                                            <label>
                                                Amount Exclusive S.T
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="ExclusiveST-value">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="DiscountRow">
                                        <td colspan="6" align="right" id="tdDiscout">
                                            <label id="Discount-text">
                                                Discount :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Discount-value">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr id="GstRow">
                                        <td colspan="6" align="right" id="tdGst">
                                            <label id="GST-text">
                                                <%=hfTaxAuthorityLabel.Value%> @<%=hfSalesTax.Value %> % :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Gst-value">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="GstRowCredit" style="display: none;">
                                        <td colspan="6" align="right" id="tdGstCredit">
                                            <label id="GST-textCredit">
                                                <%=hfTaxAuthorityLabel.Value%> @<%=hfSalesTaxCreditCard.Value %> % :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Gst-valueCredit">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="ServiceChargesRow">
                                        <td colspan="6" align="right" id="tdServiceCharges">
                                            <label id="Service-text">
                                                Service Charges :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Service-value">
                                                600</label>
                                        </td>
                                    </tr>
                                    <tr id="GrandTotalRow">
                                        <td colspan="6" align="right" id="tdGrandTotal">
                                            <label id="GrandTotal-text">
                                                Grand Total :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="GrandTotal-value">0</label>
                                        </td>
                                    </tr>
                                    <tr id="rowAdvance">
                                        <td colspan="6" align="right" id="tdAdvancepayment">
                                            <label id="Advancepayment-text">
                                                Grand Total :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="Advancepayment-value">0</label>
                                        </td>
                                    </tr>
                                    <tr id="GrandTotalRow2" style="display: none;">
                                        <td colspan="6" align="right" id="tdGrandTotal2">
                                            <label id="GrandTotal-text2">
                                                Amount after Disc. :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="GrandTotal-value2">0</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="6" align="right" id="tdPaymentIn">
                                            <label id="PayIn-text">
                                                Payment IN :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="PayIn-value">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="6" align="right" id="tdChange">
                                            <label id="balance-text">
                                                Change :
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="balance-value">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="6" align="right" id="tdBalance">
                                            <label id="balance-text2">
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="balance-value2">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="6" align="right" id="tdAdvance">
                                            <label id="advance-text">
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="advance-value">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="6" align="right" id="tdAdvanceBalance">
                                            <label id="AdvanceBalance-text">
                                            </label>
                                        </td>
                                        <td align="right">
                                            <label id="AdvanceBalance-value">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr id="trGSTInfo" style="display: none;">
                                        <td colspan="7" style="font-size: 12px;">
                                            <label id="lblGSTInfo"></label>
                                        </td>
                                    </tr>
                                    <tr id="trFBRInvoicePRA" style="display: none;">
                                        <td colspan="7">
                                            <label id="FBRInvoiceNoPRA">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr id="trQRImagePRA" style="display: none">
                                        <td colspan="3">
                                            <img id="imgQrCodePRA" src="" height="100" width="100">
                                        </td>
                                        <td colspan="4">
                                            <img id="imgpra" src="../images/logopra.jpg" height="100" width="100" style="display: none;">
                                        </td>
                                    </tr>
                                    <tr id="trFBRInvoiceFBR" style="display: none;">
                                        <td colspan="7">
                                            <label id="FBRInvoiceNoFBR">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr id="trQRImageFBR" style="display: none">
                                        <td colspan="3">
                                            <img id="imgQrCodeFBR" src="" height="100" width="100">
                                        </td>
                                        <td colspan="4">
                                            <img id="imgfbr" src="../images/logofbr.jpg" height="100" width="100" style="display: none;">
                                        </td>
                                    </tr>
                                    <tr id="trOrderNotes">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblOrderNotes"></label>
                                        </td>
                                    </tr>
                                    <tr id="trBankDiscount" style="display: none;">
                                        <td colspan="7" style="font-size: 12px;">
                                            <label id="lblBankDiscount"></label>
                                        </td>
                                    </tr>
                                    <tr id="trCardAccountTitle" style="display: none;">
                                        <td colspan="1" style="font-size: 12px;">
                                            <label id="lblCreditCardNo">Card No:12345</label>
                                        </td>
                                        <td colspan="6" style="font-size: 12px;">
                                            <label id="lblAccountTitle">Acc. Title: Ali</label>
                                        </td>
                                    </tr>
                                    <tr id="trPoints" style="display: none;">
                                        <td colspan="3" style="font-size: 12px;">
                                            <label id="lblPointsLabel">Remaining Points</label>
                                        </td>
                                        <td colspan="4" style="font-size: 12px;">
                                            <label id="lblPointsValue">10.5</label>
                                        </td>
                                    </tr>
                                    <tr id="trDiscReason">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblDiscReason"></label>
                                        </td>
                                    </tr>
                                    <tr id="trLoyaltyPoints">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblLoyaltyPoints"></label>
                                        </td>
                                    </tr>
                                    <tr id="trOpinionSurvey" style="display: none;">
                                        <td colspan="7" style="font-size: 10px;">
                                            <img id="imgOpinionSurvey" runat="server" src="../images/GuestOpenionSurveryQRCode.jpeg" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="7" style="font-size: 10px;">
                                            <hr style="border: 1px solid black;" />
                                            <asp:Literal runat="server" ID="ltrlSlipNote"></asp:Literal>
                                            <label style="font-size: 10px;"><%=hfCompanyEmail.Value %></label>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="dvSaleInvoice2">
                <style type="text/css">
                    #dvSaleInvoice2 {
                        width: 2.8in;
                    }

                    #SaleInvoice2 {
                        width: 2.8in;
                    }

                    #CompanyName2 {
                        font-size: 18px;
                        font-weight: bold;
                    }

                    #SaleInvoiceText2 {
                        font-size: 14px;
                    }

                    #InvoiceDate2 {
                        font-weight: bold;
                    }

                    #CustomerType2 {
                        font-weight: bold;
                    }

                    #phoneNo2 {
                        font-weight: bold;
                    }

                    #hrSaleInvoiceHead2 {
                        border: #333333 solid 1px;
                    }

                    #invoiceDetail2 {
                        width: 92%;
                        margin-top: 10px;
                    }

                    #invoiceDetailBody2 tr td {
                        border: #333333 solid 2px;
                        font-family: sans-serif;
                        font-size: 10px;
                        font-weight: normal;
                        padding: 5px;
                    }

                    #GrandTotal-value2 {
                        font-weight: bold;
                    }
                </style>
                <table id="SaleInvoice2">
                    <tr>
                        <td colspan="2">
                            <table align="center">
                                <tr>
                                    <td class="logom2" style="width: 100%;">
                                        <img id="imgLogo22" runat="server" src="../images/watch.png" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <span style="font-size: 10px;">
                                <%=hfFacebkId.Value %></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-size: 16px; font-family: sans-serif; font-style: italic;">
                            <label id="SaleInvoiceText2">
                                Sale Invoice</label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-style: italic; font-family: sans-serif; font-size: 9px;">
                            <label id="CompanyAddress2" style="font-size: 10px;">
                                <%=hfAddress.Value %>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center" style="font-style: italic; font-family: sans-serif; font-size: 9px;">
                            <label id="CompanyNumber2" style="font-size: 10px;">
                                Ph: &nbsp;<%=hfPhoneNo.Value %>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <label id="InvoiceDate2">
                                12-dec-2014 12:02 PM
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 40%;">
                            <label id="CustomerType2">
                                DINE IN</label>
                        </td>
                        <td align="right" style="width: 60%;">
                            <label id="PayType2">
                            </label>
                        </td>
                    </tr>
                    <tr id="trNTN2">
                        <td align="left" style="font-style: italic; font-size: 12px; margin-bottom: 5px; width: 30%">
                            <span id="RegNo2" style="font-style: normal; font-size: 12px; display: none;"><%=hfTaxAuthorityLabel2.Value%> : &nbsp;<%=hfRegNo.Value%></span>
                        </td>
                        <td align="left" style="font-style: italic; font-size: 12px; margin-bottom: 5px; width: 70%;">
                            <span id="spSTRN2" style="font-style: normal; font-size: 12px; display: none;">STRN : &nbsp;<%=hfSTRN.Value%></span>
                        </td>
                    </tr>
                    <tr>
                        <%-- Cashier --%>
                        <td align="left" style="width: 100%" colspan="2">
                            <span id="Cashier2" style="margin-left: 0%; font-size: 12px; font-style: normal;"></span>
                        </td>
                    </tr>
                    <tr>
                        <%--OrderBooker and CoverTable--%>
                        <td style="width: 50%;">
                            <span id="OrderTakerName2" style="font-size: 12px; display: none;"></span>
                            <span id="OrderTaker2" style="font-size: 12px; font-style: normal; font-size: 12px; display: none;"></span>
                        </td>
                        <td style="width: 50%; text-align: right;">
                            <span id="CoverTable2" style="font-style: normal; font-size: 12px;" />
                        </td>
                    </tr>
                    <tr>
                        <%--Customer Name and Address --%>
                        <td align="left" style="width: 100%" colspan="2">
                            <%--In Delivery Type used as Customer Phone 
                            <span id="CustomerNameDetail" style="font-style: italic; font-size: 12px; width: 15%; display:none;" ></span>--%>
                            <span id="CustomerDetail2" style="margin-left: 0%; font-size: 12px; font-style: normal; display: none;"></span>
                        </td>
                    </tr>
                    <tr id="trOrderNo2">
                        <td colspan="2" style="text-align: right">
                            <span id="OrderInvoiceName2" style="font-style: italic; font-size: 12px;">Order No:  </span>
                            <span id="OrderInvoice2" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>
                        </td>
                    </tr>
                    <tr>
                        <%--Table No and Bill No --%>
                        <td align="left" style="width: 60%">
                            <span id="InvoiceTableName2" style="font-style: italic; font-size: 12px; width: 15%; margin-bottom: 8px;"></span>
                            <span id="InvoiceTable2" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>

                        </td>
                        <td style="width: 40%; text-align: right;">
                            <span id="BillNoName2" style="font-style: italic; font-size: 12px;">Bill No:</span>
                            <span id="BillNo2" style="margin-left: 2%; font-style: normal; font-size: 12px;"></span>
                        </td>
                    </tr>
                    <tr id="trKOTNo2">
                        <td align="left" style="width: 100%">
                            <span id="KOTNo2" style="font-style: italic; font-size: 12px;">KOT No:  </span>
                        </td>
                    </tr>
                    <tr id="trTakeawayOrderNo2" style="display: none;">
                        <td colspan="2">
                            <span id="spanTakeawayOrderNo2" style="font-size: 20px; font-weight: bold;">Order No:  </span>
                        </td>
                    </tr>
                    <tr>
                        <%--Product Detail--%>
                        <td colspan="2">
                            <table id="invoiceDetail2" style="border-collapse: collapse;">
                                <thead id="invoiceDetailHead2">
                                    <tr>
                                        <td style="text-align: left; font-size: 12px; font-family: sans-serif; width: 35%">Item Name
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 10%">Qty
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 10%">Rate
                                        </td>
                                        <td id="tdDiscount2" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">Disc
                                        </td>
                                        <td id="tdGSTPer2" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">GST %
                                        </td>
                                        <td id="tdGSTValue2" align="center" style="font-size: 12px; font-family: sans-serif; width: 10%; display: none;">GST
                                        </td>
                                        <td align="center" style="font-size: 12px; font-family: sans-serif; width: 15%">Amount
                                        </td>
                                    </tr>
                                </thead>
                                <tbody id="invoiceDetailBody2">
                                </tbody>
                                <tfoot id="invoiceDetailFoot2">
                                    <tr style="height: 20px;">
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr style="border-bottom: 1pt solid black;">
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfSalesTax.Value %> % Tax For Cash </label>
                                        </td>
                                    </tr>
                                    <tr style="height: 10px;">
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">Total :
                                            <label id="TotalValue3">6000</label>
                                        </td>
                                    </tr>
                                    <tr id="DiscountRow2">
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Discount : </label>
                                            <label style="font-size: 10px; font-weight: bold; font-family: sans-serif;" id="Discount-value2">6000</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfTaxAuthorityLabel.Value%> <%=hfSalesTax.Value %> % : </label>
                                            <label style="font-size: 10px; font-weight: bold; font-family: sans-serif;" id="Gst-value3">600</label>
                                        </td>
                                    </tr>
                                    <tr id="ServiceChargesRow2">
                                        <td colspan="4">
                                            <label id="Service-text2" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Ser. Charges :</label>
                                            <label id="Service-value2" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">Grand Total :
                                            <label id="GrandTotal-value3">0</label>
                                        </td>
                                    </tr>
                                    <tr id="rowAdvance2">
                                        <td colspan="4">
                                            <label id="advance-text2" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Customer Advance :</label>
                                            <label id="advance-value2" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr id="rowCustomerRec">
                                        <td colspan="4">
                                            <label id="custrec-text" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Cust. Receeivable :</label>
                                            <label id="custrec-value" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr style="height: 10px;">
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr style="border-bottom: 1pt solid black;">
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfSalesTaxCreditCard.Value %> % Tax For Credit Card </label>
                                        </td>
                                    </tr>
                                    <tr style="height: 10px;">
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">Total :
                                            <label id="TotalValue4">6000</label>
                                        </td>
                                    </tr>
                                    <tr id="DiscountRow22">
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Discount : </label>
                                            <label style="font-size: 10px; font-weight: bold; font-family: sans-serif;" id="Discount-value3">6000</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfTaxAuthorityLabel.Value%> <%=hfSalesTaxCreditCard.Value %> % : </label>
                                            <label style="font-size: 10px; font-weight: bold; font-family: sans-serif;" id="Gst-valueCredit3">600</label>
                                        </td>
                                    </tr>
                                    <tr id="ServiceChargesRow22">
                                        <td colspan="4">
                                            <label id="Service-text3" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">S.C : </label>
                                            <label id="Service-value3" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">Grand Total :
                                            <label id="GrandTotal-value4">0</label>
                                        </td>
                                    </tr>
                                    <tr id="rowAdvance22">
                                        <td colspan="4">
                                            <label id="advance-text22" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Customer Advance :</label>
                                            <label id="advance-value22" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr id="rowCustomerRec2">
                                        <td colspan="4">
                                            <label id="custrec-text2" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Cust. Receeivable :</label>
                                            <label id="custrec-value2" style="font-size: 10px; font-weight: bold; font-family: sans-serif;">0</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr id="trOrderNotes2">
                                        <td style="font-size: 10px;" colspan="4">
                                            <label id="lblOrderNotes2"></label>
                                        </td>
                                    </tr>
                                    <tr id="trDiscReason2">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblDiscReason2"></label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 10px;" colspan="4">
                                            <label style="font-size: 10px;" id="lblDelChannel2"></label>
                                            <hr style="border: 1px solid black;" />
                                            <asp:Literal runat="server" ID="ltrlSlipNote2"></asp:Literal>
                                            <label style="font-size: 10px;"><%=hfCompanyEmail.Value %></label>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <br />
            <br />
        </div>

        <script src="../js/jquery-1.10.2.js"></script>
        <script src="../js/jquery-2.0.2.min.js"></script>

        <% Response.WriteFile("~/Forms/popUpPayment.aspx");%>
        <%-- On Payment click --%>
        <% Response.WriteFile("~/Forms/popUpPayment2.aspx");%>
        <%-- On Print Invoice click --%>
        <% Response.WriteFile("~/Forms/rptSalesSummary.htm");%>
        <% Response.WriteFile("~/Forms/rptDailySummpary.htm");%>
        <% Response.WriteFile("~/Forms/rptSalesDetail.htm");%>
        <% Response.WriteFile("~/Forms/rptItemSalesDetail.htm");%>
        <% Response.WriteFile("~/Forms/rptDailySales.htm");%>
        <% Response.WriteFile("~/Forms/rptCategorySalesDetail.htm");%>
        <% Response.WriteFile("~/Forms/rptServiceWiseSales.htm");%>
        <% Response.WriteFile("~/Forms/printInvoice5.htm");%>
        <% Response.WriteFile("~/Forms/popUpUserValidation.aspx");%>
        <% Response.WriteFile("~/Forms/popUpDeletionConfirmation.aspx");%>
        <% Response.WriteFile("~/Forms/popUpDecreaseConfirmation.aspx");%>
        <% Response.WriteFile("~/Forms/popShortCutkeys.aspx");%>

        <script type="text/javascript" src="../AjaxLibrary/moment-with-locales.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/jQuery.print.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/zebra_dialog.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/jquery.lightbox_me.js"></script>
        <script src="../js/plugins/Block/jquery.blockUI.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/order-posCode20260324.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/PrintInvoice20260327.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/Reports20251219.js"></script>
        <script src="../AjaxLibrary/select2/dist/js/select2.min.js" type='text/javascript'></script>
        <script type="text/javascript" src="../AjaxLibrary/CommonFunction20230816.js"></script>
        <script>
            function pageLoad() {
                $("#ddlCustomer").select2();
            }
        </script>
    </form>
</body>
</html>