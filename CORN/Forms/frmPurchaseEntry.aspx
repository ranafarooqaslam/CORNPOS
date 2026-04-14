<%@ Page Language="C#" MasterPageFile="~/Forms/PageMaster.master" AutoEventWireup="true"
    CodeFile="frmPurchaseEntry.aspx.cs" Inherits="Forms_frmPurchaseEntry" Title="CORN :: Stock Register" %>

<%@ Register Assembly="DevExpress.Web.v16.1, Version=16.1.4.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="cc1" %>
<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="cphPage">
    <style type="text/css">
        .reduceSpace {
            padding: 0 2px;
        }
    </style>
    <script type="text/javascript">
        setInterval(() => {
            fetch("http://localhost:8088/weight")
                .then(r => r.text())
                .then(w => {
                    document.getElementById('<%=txtQuantity.ClientID%>').value = w;
                })
                .catch(err => console.log(err));
        }, 300);

        function calendarShown(sender, args) {
            sender._popupBehavior._element.style.zIndex = 10005;
        }
    </script>
    <script language="JavaScript" type="text/javascript">
        Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(BeginRequestHandler);
        function BeginRequestHandler(sender, args) {
            var oControl = args.get_postBackElement();
            oControl.value = "Wait...";
            oControl.disabled = true;
        }

        function CalculateITEMAmount() {
            debugger;
            var Qty = document.getElementById('<%=txtQuantity.ClientID%>').value;
            var Rate = document.getElementById('<%=txtPrice.ClientID%>').value;
            var Discount = document.getElementById('<%=txtItemDiscount.ClientID%>').value;
            var Gst = document.getElementById('<%=txtItemGST.ClientID%>').value;

            var gstType = 0;

            var list = document.getElementById('<%=rdoGSTType.ClientID%>'); //Client ID of the radiolist
            var inputs = list.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].checked) {
                    gstType = inputs[i].value;
                    break;
                }
            }

            if (isNaN(Qty) || Qty == undefined || Qty == "")
                Qty = 0;
            if (isNaN(Rate) || Rate == undefined || Rate == "")
                Rate = 0;
            if (isNaN(Discount) || Discount == undefined || Discount == "")
                Discount = 0;
            if (isNaN(Gst) || Gst == undefined || Gst == "")
                Gst = 0;

            var grossAmount = (parseFloat(Qty) * parseFloat(Rate));

            if (gstType == "1") {
                Gst = ((grossAmount - parseFloat(Discount)) * (Gst / 100));
            }

            var finalAmount = grossAmount - parseFloat(Discount) + parseFloat(Gst);

            document.getElementById("<%= txtAmount.ClientID %>").value = finalAmount.toFixed(2);
        }
        function CalculateNetAmount1() {            
            var str = 0;
            var grid = document.getElementById('<%=GrdPurchase.ClientID %>');
            for (var row = 1; row < grid.rows.length; row++) {
                str = str + Number(grid.rows[row].cells[9].innerText);
            }

            var GrossAmount = str;
            var Discount = $("[id$='txtDiscount']").val();            
            var freight = $("[id$='txtFreight']").val();
            var advancetax = $("[id$='txtAdvanceTax']").val();

            if (GrossAmount == "") {
                GrossAmount = 0;
            }
            if (Discount == "") {
                Discount = 0;
            }
            if (freight == "") {
                freight = 0;
            }
            if (advancetax == "")
            {
                advancetax = 0;
            }
            $("[id$='txtNetAmount']").val((parseFloat(GrossAmount) - parseFloat(Discount) + parseFloat(freight) + parseFloat(advancetax)).toFixed(2));
        }
    </script>
    <div class="main-contents">
        <div class="container">
            <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                <ContentTemplate>
                    <div class="row">
                        <div class="col-md-4">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Transaction Type</label>
                            <dx:ASPxComboBox ID="DrpDocumentType" runat="server" CssClass="form-control"
                                AutoPostBack="true" SelectedIndex="0" ClientInstanceName="DrpDocument"
                                OnSelectedIndexChanged="DrpDocumentType_SelectedIndexChanged">
                                <Items>
                                    <dx:ListEditItem Value="2" Text="Purchase" />
                                    <dx:ListEditItem Value="5" Text="Transfer Out"></dx:ListEditItem>
                                    <dx:ListEditItem Value="3" Text="Purchase Return"></dx:ListEditItem>
                                    <dx:ListEditItem Value="6" Text="Damage"></dx:ListEditItem>
                                    <dx:ListEditItem Value="20" Text="Production In"></dx:ListEditItem>
                                </Items>
                            </dx:ASPxComboBox>
                        </div>
                        <div class="col-md-4">
                            <label><span class="fa fa-caret-right rgt_cart"></span></label>
                            <asp:Label ID="lblDocumentNo" runat="server" Text="Document No" />
                            <dx:ASPxComboBox ID="drpDocumentNo" runat="server" CssClass="form-control" NullText="Plz Select Document No"
                                AutoPostBack="true" ClientInstanceName="DocNo"
                                OnSelectedIndexChanged="drpDocumentNo_SelectedIndexChanged">
                            </dx:ASPxComboBox>
                        </div>
                        <div class="col-md-4">
                            <asp:Literal ID="lbltoLocation" runat="server"><span class="fa fa-caret-right rgt_cart"></span>Supplier</asp:Literal>
                            <dx:ASPxComboBox ID="drpPrincipal" runat="server" CssClass="form-control">
                            </dx:ASPxComboBox>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <span class="fa fa-caret-right rgt_cart"></span>
                            <asp:Label ID="lblfromLocation" runat="server" Text="Purchase For" />
                            <dx:ASPxComboBox ID="drpDistributorID" runat="server" CssClass="form-control"
                                OnSelectedIndexChanged="drpDistributor_SelectedIndexChanged"
                                ClientInstanceName="drpDistributor" AutoPostBack="True">
                            </dx:ASPxComboBox>
                        </div>
                        <div class="col-md-4">
                            <asp:Literal ID="lblTransferFor" runat="server" Visible="false"><span class="fa fa-caret-right rgt_cart"></span>Transfer To</asp:Literal>
                            <dx:ASPxComboBox ID="DrpTransferFor" runat="server" CssClass="form-control"
                                Visible="false">
                            </dx:ASPxComboBox>
                            <asp:Literal ID="lblPaymentMode" runat="server"><span class="fa fa-caret-right rgt_cart"></span>Payment Mode</asp:Literal>
                            <dx:ASPxComboBox ID="ddlPaymentMode" runat="server" CssClass="form-control" SelectedIndex="0">
                                <Items>
                                    <dx:ListEditItem Value="1" Text="Credit" />
                                    <dx:ListEditItem Value="2" Text="Cash"></dx:ListEditItem>
                                    <dx:ListEditItem Value="3" Text="Advance"></dx:ListEditItem>
                                </Items>
                            </dx:ASPxComboBox>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <span class="fa fa-caret-right rgt_cart"></span>
                            <asp:Label ID="lblInvoice" runat="server" Text="INV/DC No" MaxLength="100" />
                            <asp:TextBox ID="txtDocumentNo" runat="server" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="col-md-4">
                            <span class="fa fa-caret-right rgt_cart"></span>
                            <asp:Label ID="Label1" runat="server" Text="Remarks" />
                            <asp:TextBox ID="txtBuiltyNo" runat="server" MaxLength="250" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="col-md-2" style="margin: 45px 0px 0px -5px;">
                              <asp:RadioButtonList runat="server" ID="rdoGSTType" Width="180px" onclick="CalculateITEMAmount()"
                                   RepeatDirection="Horizontal" Border-BorderStyle="None">
                                  <asp:ListItem Value="0" Text=" GST Value" Selected="True" />
                                  <asp:ListItem Value="1" Text=" GST %" />
                              </asp:RadioButtonList>
                        </div>
                        <div class="col-md-2" style="margin-top: 30px;">
                             <label>
                                <asp:Label ID="lblStock" ForeColor="Red" runat="server" Text="Closing Stock:0"></asp:Label>
                            </label>
                            <label>
                                <asp:Label ID="lblLastPrice" ForeColor="Red" runat="server" Text="Last Price: 0"></asp:Label>
                            </label>
                        </div>
                    </div>
                </ContentTemplate>
            </asp:UpdatePanel>
            <asp:UpdatePanel ID="UpdatePanel3" runat="server">
                <ContentTemplate>
                    <div class="row" style="margin-left:0">
                        <div class="col-md-2 reduceSpace">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Item Description</label>
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <asp:CheckBox ID="cbScan" runat="server" Text="By Scan" OnCheckedChanged="cbScan_CheckedChanged" AutoPostBack="true" />
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <label><span class="fa fa-caret-right rgt_cart"></span>UOM</label>
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <label runat="server" id="lblQty"><span class="fa fa-caret-right rgt_cart"></span>Pur. Qty</label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divBonuslbl" runat="server">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Bon. Qty</label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divPrice" runat="server">
                            <span class="fa fa-caret-right rgt_cart"></span>
                            <label>
                                <asp:Label ID="lblPrice" runat="server" Text="Price" /></label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divItemDisc" runat="server">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Disc</label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divItemGst" runat="server">
                            <label><span class="fa fa-caret-right rgt_cart"></span>GST</label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divAmount" runat="server">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Amount</label>
                        </div>
                        <div class="col-md-1 reduceSpace" id="lblExpiry" runat="server">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Expiry Date</label>
                        </div>
                         <div class="col-md-2 reduceSpace" id="divRemarks" runat="server">
                            <span class="fa fa-caret-right rgt_cart"></span>
                            <label>
                                <asp:Label ID="Label2" runat="server" Text="Remarks" /></label>
                        </div>
                    </div>
                    <asp:Panel ID="ItemPnl" runat="server" DefaultButton="btnAdd">
                    <div class="row" style="margin-left:0">
                        <div class="col-md-3 reduceSpace">
                            <dx:ASPxComboBox ID="ddlSkus" runat="server" CssClass="form-control" ClientInstanceName="ddlItem"
                                AutoPostBack="true" OnSelectedIndexChanged="ddlSkus_SelectedIndexChanged">
                            </dx:ASPxComboBox>
                            <asp:TextBox ID="txtSKUCode" runat="server" Visible="false" CssClass="form-control" onkeypress="return SKUCodeKeyPress(event);"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <asp:TextBox ID="txtUOM" runat="server" CssClass="form-control" Enabled="false"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <asp:TextBox ID="txtQuantity" runat="server" CssClass="form-control"
                                onkeypress="return QtyKeyPress(this,event);" onblur="CalculateITEMAmount();"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divBonusQty" runat="server">
                            <asp:TextBox ID="txtBonus" runat="server" CssClass="form-control"
                                onkeypress="return QtyKeyPress(this,event);"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divPrice2" runat="server">
                            <asp:TextBox ID="txtPrice" onblur="CalculateITEMAmount();" runat="server"
                                onkeypress="return onlyDotsAndNumbers(this,event);" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divItemDisc1" runat="server">
                            <asp:TextBox ID="txtItemDiscount" runat="server" CssClass="form-control"
                                onkeypress="return QtyKeyPress(this,event);" onblur="CalculateITEMAmount()"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divItemGST1" runat="server">
                            <asp:TextBox ID="txtItemGST" runat="server" CssClass="form-control"
                                onkeypress="return QtyKeyPress(this,event);" onblur="CalculateITEMAmount()"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divAmount2" runat="server">
                            <asp:TextBox ID="txtAmount" runat="server" CssClass="form-control" Enabled="false"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace" id="divExpiry" runat="server">
                            <asp:TextBox ID="txtExpiryDate" runat="server" CssClass="form-control" AutoComplete="off"></asp:TextBox>
                        <cc1:CalendarExtender ID="CalendarExtender2" OnClientShown="calendarShown" runat="server"
                           Format="dd-MMM-yyyy" TargetControlID="txtExpiryDate"></cc1:CalendarExtender>
                        </div>
                        <div class="col-md-4 reduceSpace" id="divtxtRemarks" runat="server">
                            <asp:TextBox ID="txtItemRemarks" runat="server"
                                CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="col-md-1 reduceSpace">
                            <asp:HiddenField ID="hfInventoryType" runat="server" Value="0" />
                            <asp:HiddenField ID="hfSKUID" runat="server" Value="0" />
                            <asp:HiddenField ID="hfItemGST" runat="server" Value="0" />
                            <asp:Button AccessKey="A" ID="btnAdd" OnClick="btnAdd_Click" CausesValidation="true" OnClientClick="CalculateITEMAmount();" runat="server" Text="Add" CssClass="btn btn-success" />
                        </div>
                    </div>
                        </asp:Panel>
                    <div class="row center">
                        <div class="col-md-9">
                            <asp:HiddenField ID="_rowNo" runat="server" Value="0" />
                            <asp:HiddenField ID="_privouseQty" runat="server" Value="0" />
                            <div class="emp-table">
                                <asp:Panel ID="Panel2" runat="server" Height="150px" Width="100%" ScrollBars="Vertical"
                                    BorderWidth="1px" BorderStyle="Groove" BorderColor="Silver">
                                    <asp:GridView ID="GrdPurchase" runat="server" AutoGenerateColumns="False" HorizontalAlign="Center"
                                        CssClass="table table-striped table-bordered table-hover table-condensed cf"
                                        OnRowDeleting="GrdPurchase_RowDeleting" OnRowEditing="GrdPurchase_RowEditing">
                                        <Columns>
                                            <asp:BoundField DataField="SKU_ID" HeaderText="SKU_ID" ReadOnly="true">
                                                <HeaderStyle CssClass="HidePanel" />
                                                <ItemStyle CssClass="HidePanel" />
                                            </asp:BoundField>
                                            <asp:BoundField DataField="SKU_CODE" ReadOnly="true">
                                                <HeaderStyle CssClass="HidePanel" />
                                                <ItemStyle CssClass="HidePanel" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Item" DataField="SKU_NAME" ReadOnly="true">
                                                <ItemStyle Width="30%" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="UOM" DataField="UOM_DESC" ReadOnly="true">
                                                <ItemStyle Width="5%" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Qty" DataField="Quantity" ReadOnly="true">
                                                <ItemStyle Width="10%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Bonus" DataField="FREE_SKU" ReadOnly="true">
                                                <ItemStyle Width="5%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Price" DataField="Price" DataFormatString="{0:f2}" ReadOnly="true">
                                                <ItemStyle Width="10%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                             <asp:BoundField HeaderText="Discount" DataField="DISCOUNT" DataFormatString="{0:f2}" ReadOnly="true">
                                                <ItemStyle Width="10%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                             <asp:BoundField HeaderText="GST" DataField="TAX" DataFormatString="{0:f2}" ReadOnly="true">
                                                <ItemStyle Width="7%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Amount" DataField="Amount" DataFormatString="{0:f2}" ReadOnly="true">
                                                <ItemStyle Width="12%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                            <asp:BoundField DataField="UOM_ID" ReadOnly="true">
                                                <HeaderStyle CssClass="HidePanel" />
                                                <ItemStyle CssClass="HidePanel" />
                                            </asp:BoundField>
                                            <asp:BoundField HeaderText="Remarks" DataField="Remarks" ReadOnly="true">
                                                <ItemStyle Width="15%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                             <asp:BoundField HeaderText="Expiry Date" DataField="Expiry_Date" ReadOnly="true">
                                                <ItemStyle Width="10%" HorizontalAlign="Right" />
                                            </asp:BoundField>
                                            <asp:TemplateField>
                                                <ItemTemplate>
                                                    <asp:LinkButton ID="btnEdit" runat="server" CommandName="Edit" class="fa fa-pencil" ToolTip="Edit">
                                                    </asp:LinkButton>
                                                </ItemTemplate>
                                                <ItemStyle HorizontalAlign="Center" Width="5%" />
                                            </asp:TemplateField>
                                            <asp:TemplateField>
                                                <ItemTemplate>
                                                    <asp:LinkButton ID="btnDelete" runat="server" CommandName="Delete" OnClientClick="javascript:return confirm('Are you sure you want to Delete?');return false;"
                                                        class="fa fa-trash-o"></asp:LinkButton>
                                                </ItemTemplate>
                                                <ItemStyle HorizontalAlign="Center" Width="5%" />
                                            </asp:TemplateField>
                                        </Columns>
                                    </asp:GridView>
                                </asp:Panel>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="row">
                                <div class="col-md-4 reduceSpace" id="divGrossAmount" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Gross Amt</label>
                                    <asp:TextBox ID="txtTotalAmount" runat="server" CssClass="form-control" Enabled="false"></asp:TextBox>
                                </div>
                                <div class="col-md-4 reduceSpace" id="divGSTAmount" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Gst Amount</label>
                                    <asp:TextBox ID="txtGstAmount" runat="server" CssClass="form-control" onkeyup="CalculateNetAmount1();"
                                        onkeypress="return onlyDotsAndNumbers(this,event);"></asp:TextBox>
                                </div>
                                <div class="col-md-4 reduceSpace" id="divDiscount" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Discount</label>
                                    <asp:TextBox ID="txtDiscount" runat="server" CssClass="form-control" onkeyup="CalculateNetAmount1();"
                                        onkeypress="return onlyDotsAndNumbers(this,event);"></asp:TextBox>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 reduceSpace" id="divFreight" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Freight</label>
                                    <asp:TextBox ID="txtFreight" runat="server" CssClass="form-control" onkeyup="CalculateNetAmount1();"
                                        onkeypress="return onlyDotsAndNumbers(this,event);"></asp:TextBox>
                                </div>
                                <div class="col-md-4 reduceSpace" id="divAdvanceTax" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Advance Tax</label>
                                    <asp:TextBox ID="txtAdvanceTax" runat="server" CssClass="form-control" onkeyup="CalculateNetAmount1();"
                                        onkeypress="return onlyDotsAndNumbers(this,event);"></asp:TextBox>
                                </div>
                                <div class="col-md-4 reduceSpace" id="divNetAmount" runat="server">
                                    <label><span class="fa fa-caret-right rgt_cart"></span>Net Amount</label>
                                    <asp:TextBox ID="txtNetAmount" runat="server" CssClass="form-control" Enabled="false"></asp:TextBox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                        </div>
                        <div class="col-md-2">
                            <label><span class="fa fa-caret-right rgt_cart"></span>Total Quantity</label>
                            <asp:TextBox ID="txtTotalQuantity" runat="server" CssClass="form-control" Enabled="false"></asp:TextBox>
                        </div>
                        <div class="col-md-7">
                        </div>
                    </div>
                </ContentTemplate>
            </asp:UpdatePanel>
            <div class="row">
                <div class="col-md-offset-5 col-md-3" style="margin-top: -55px;">
                    <div class="btnlist pull-right">
                        <asp:Button ID="btnSaveDocument" AccessKey="S" OnClick="btnSaveDocument_Click" runat="server" Text="Save" UseSubmitBehavior="False" CssClass="btn btn-success" />
                        <asp:Button ID="btnCancel" AccessKey="C" OnClick="btnCancel_Click" runat="server" Text="Cancel" UseSubmitBehavior="False" CssClass="btn btn-danger" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="../AjaxLibrary/ValidateDotsAndNumbers.js"></script>
    <script type="text/javascript" src="../AjaxLibrary/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" src="../AjaxLibrary/StockRegister20220413.js"></script>
</asp:Content>
