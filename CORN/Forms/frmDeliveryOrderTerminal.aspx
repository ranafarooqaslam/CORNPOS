<%@ Page Language="C#" AutoEventWireup="true" CodeFile="frmDeliveryOrderTerminal.aspx.cs" Inherits="Forms_frmDeliveryOrderTerminal" EnableEventValidation="false"%>

<!doctype html>
<html>
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>CORN :: Delivery Order Terminal</title>
    <link href="../css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../css/zebra_dialog.css" rel="stylesheet" type="text/css" />
    <link href="../css/tree-style.css" rel="stylesheet" type="text/css" />
    <link href="../css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link rel="icon" type="image/x-icon" href="../images/icon.ico">
</head>
<body onload="BillTime()">
    <form id="Form1" method="POST" runat="server">
        <asp:ScriptManager ID="MainScriptManager" runat="server" AsyncPostBackTimeout="30000" EnablePartialRendering="true" />
        <asp:HiddenField runat="server" ID="hfProduct" />
        <asp:HiddenField runat="server" ID="hfOrderedproducts" />
        <asp:HiddenField runat="server" ID="hfSalesTax" />
        <asp:HiddenField runat="server" ID="hfIsCoverTable" />
        <asp:HiddenField runat="server" ID="hfInvoiceId" />
        <asp:HiddenField runat="server" ID="hfCurrentWorkDate" />
        <asp:HiddenField runat="server" ID="hfskuId" />
        <asp:HiddenField runat="server" ID="hfOrderNo" Value="0" />
        <asp:HiddenField ID="hfInvoiceFooterType" runat="server" Value="0" />
        <asp:HiddenField runat="server" ID="hfFacebkId" />
        <asp:HiddenField runat="server" ID="hfAddress" />
        <asp:HiddenField runat="server" ID="hfPhoneNo" />
        <asp:HiddenField ID="hfTaxAuthorityLabel" runat="server" Value="0" />
        <asp:HiddenField ID="hfTaxAuthorityLabel2" runat="server" Value="0" />
        <asp:HiddenField runat="server" ID="hfRegNo" />
        <asp:HiddenField ID="hfSTRN" runat="server" Value="" />
        <asp:HiddenField runat="server" ID="hfSalesTaxCreditCard" />
        <asp:HiddenField runat="server" ID="hfCompanyEmail" />
        <asp:HiddenField ID="hfItemWiseDiscount" runat="server" Value="0" />
        <asp:HiddenField ID="hfAutoPromotion" runat="server" Value="0" />
        <asp:HiddenField ID="hfServiceChargesCalculation" runat="server" Value="1" />
        <asp:HiddenField ID="hfProvisionalBillHeaderFormat" runat="server" Value="0" />
        <asp:HiddenField ID="hfShowNTNOnProvissionalBill" runat="server" Value="1" />
        <asp:HiddenField runat="server" ID="hfTableNo" />
        <div class="header-wrapper">
            <span id='ct' style="display: none;"></span><%--Getting Current Time of System For Calculating Order Time--%>
            <div class="container" style="margin-bottom: 5px;">
                <div class="row">
                    <div class="s1-left">
                        <div class="logom logo_main">
                            <img id="imgLogo" src="../images/watch.png" runat="server" alt="../images/watch.png" />
                        </div>
                        <div class="s1-right">
                            <div class="user-detail">
                                Welcome - <span class="user-detail-bold">
                                    <asp:Literal ID="lblUserName" runat="server" Text="Label"></asp:Literal></span><br />
                                <asp:Literal ID="lblDateTime" runat="server" Text="Label"></asp:Literal>
                            </div>
                            <div class="nav-ic">
                                <img src="../images/nav-opt.png" alt="Nav" />
                                <div class="exit-text">
                                    <asp:LinkButton runat="server" ID="lnkExit" OnClick="lnkExit_OnClick">Exit</asp:LinkButton>
                                </div>
                            </div>
                        </div>
                        <div class="s1-center">
                            <div class="order-tab">
                                Order No<br />
                                <span class="order-tab-blk">
                                    <label id="OrderNo1">
                                        N/A</label>
                                    <label id="MaxOrderNo" style="display: none;"></label>
                                </span>
                            </div>
                            <div class="order-tab">
                                Delivery Man<br />
                                <span class="order-tab-blk">
                                    <asp:DropDownList runat="server" ID="ddlOrderBooker" Width="88%">
                                    </asp:DropDownList>
                                </span>
                            </div>
                            <div class="order-tab">
                                <div class="box" id="btnUpdateOrder" onclick="UpdateOrder();" style="width: 90%; background-color: #7dab49;">
                                    Update Order
                                </div>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="clear">
                    </div>
                </div>
                <div class="col-md-12 gray-bg">
                    <div class="clear">
                    </div>
                    <div class="col-md-4 table-top">
                        <div class="col-md-12 table-top" style="padding-top: 0px; padding-bottom: 10px; padding-left: 5px;">
                            <div class="table-bar">

                                <div class="col-md-12 vac-det-Kitchen ">
                                    <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                        Pending Orders
                                    </div>
                                    <div class="height-465 scrolla peb" style="width: 100%;">
                                        <table class="porder" id="tbl-pending-bills" style="width: 100%;">
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="clear">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 table-top">
                        <div class="col-md-12 table-top" style="padding-top: 0px; padding-bottom: 10px; padding-left: 5px;">
                            <div class="table-bar">
                                <div class="col-md-12 vac-det-Kitchen ">
                                    <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                        Running Orders
                                    </div>
                                    <div class="height-465 scrolla peb" style="width: 100%;">
                                        <table class="porder" id="tbl-running-bills" style="width: 100%;">
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="clear">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 table-top">
                        <div class="col-md-12 table-top" style="padding-top: 0px; padding-bottom: 10px; padding-left: 5px;">
                            <div class="table-bar">
                                <div class="col-md-12 vac-det-Kitchen ">
                                    <div style="background-color: #7dab49; padding: 5px 0px 5px 30px; color: #fff;">
                                        Dispatched Orders
                                    </div>
                                    <div class="height-465 scrolla peb" style="width: 100%;">
                                        <table class="porder" id="tbl-dispatch-bills" style="width: 100%;">
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="clear">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 table-bottom">
                        <div class="table-bar">
                            <div class="emp-table scrolla" style="height: 500px;">
                                <table class="table table-striped table-bordered table-hover table-condensed cf">
                                    <thead class="cf head" style="background-color: #7dab49;">
                                        <tr>
                                            <th class="numeric table-text-head">SECTION
                                            </th>
                                            <th class="numeric table-text-head">ITEM(S)
                                            </th>
                                            <th class="table-text-head" style="text-align: center;">QTY
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tble-ordered-products">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="clear">
                    </div>

                </div>
            </div>
        </div>
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
                            <span id="CoverTable" style="font-style: normal; font-size: 12px; font-weight: bold" />
                        </td>
                    </tr>
                    <tr>
                        <%--Customer Name and Address --%>
                        <td align="left" style="width: 100%" colspan="2">
                            <%--In Delivery Type used as Customer Phone 
                            <span id="CustomerNameDetail" style="font-style: italic; font-size: 12px; width: 15%; display:none;" ></span>--%>
                            <span id="CustomerDetail" style="margin-left: 0%; font-size: 12px; font-style: normal; display: none; font-weight: bold;"></span>
                        </td>
                    </tr>
                    <tr id="trOrderNo">
                        <td colspan="2" style="text-align: right">
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
                            <span id="InvoiceTableName" style="font-size: 12px; width: 15%; margin-bottom: 8px;"></span>
                            <span id="InvoiceTable" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>

                        </td>
                        <td style="width: 40%; text-align: right;">
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
                                        <td colspan="6" align="right" id="tdGstCredit2">
                                            <label id="GST-textCredit2">
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
                                                Ser. Charges :
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
                                    <tr id="trFBRInvoice" style="display: none;">
                                        <td colspan="7">
                                            <label id="FBRInvoiceNo">
                                            </label>
                                        </td>
                                    </tr>
                                    <tr id="trQRImage" style="display: none">
                                        <td colspan="7">
                                            <img id="imgQrCode" src="" height="100" width="100">
                                        </td>
                                    </tr>
                                    <tr id="trOrderNotes">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblOrderNotes"></label>
                                        </td>
                                    </tr>
                                    <tr id="trGSTInfo" style="display: none;">
                                        <td colspan="7" style="font-size: 12px;">
                                            <label id="lblGSTInfo"></label>
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
                                    <tr id="trDiscReason">
                                        <td colspan="7" style="font-size: 10px;">
                                            <label id="lblDiscReason"></label>
                                        </td>
                                    </tr>
                                    <tr id="trOpinionSurvey" style="display: none;">
                                        <td colspan="7" style="font-size: 10px;">
                                            <img id="imgOpinionSurvey" runat="server" src="../images/GuestOpenionSurveryQRCode.jpeg" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="7" style="font-size: 10px;">
                                            <label style="font-size: 10px;" id="lblDelChannel"></label>
                                            <hr style="border: 1px solid black;" />
                                            <span id="ltrlSlipNoteID">
                                                <asp:Literal runat="server" ID="ltrlSlipNote"></asp:Literal></span>
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

                    #myCustomerType2 {
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
                            <label id="myCustomerType2">
                            </label>
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
                        <td align="left" style="width: 100%" colspan="2">
                            <span style="font-size: 12px;">Order Time:  </span>
                            <span id="OrderTime1" style="margin-left: 2%; font-size: 12px; font-style: normal;"></span>
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
                                            <label id="Service-text2" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">Service Charges :</label>
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
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfSalesTaxCreditCard.Value %> % Tax For Credit Card</label>
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
                                            <label style="font-size: 10px; font-weight: normal; font-family: sans-serif;"><%=hfTaxAuthorityLabel.Value%> <%=hfSalesTaxCreditCard.Value %> % :</label>
                                            <label style="font-size: 10px; font-weight: bold; font-family: sans-serif;" id="Gst-valueCredit3">600</label>
                                        </td>
                                    </tr>
                                    <tr id="ServiceChargesRow22">
                                        <td colspan="4">
                                            <label id="Service-text3" style="font-size: 10px; font-weight: normal; font-family: sans-serif;">S.C :</label>
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
        <script type="text/javascript" src="../AjaxLibrary/moment-with-locales.js"></script>
        <script src="../AjaxLibrary/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/jQuery.print.js"></script>        
        <script type="text/javascript" src="../AjaxLibrary/zebra_dialog.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/DeliveryOrderTerminal20240816.js"></script>
        <script type="text/javascript" src="../AjaxLibrary/PrintInvoice20260327.js"></script>
    </form>
</body>
</html>