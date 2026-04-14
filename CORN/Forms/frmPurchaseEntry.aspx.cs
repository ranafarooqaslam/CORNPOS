using System;
using System.Data;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;
using CORNBusinessLayer.Classes;
using CORNBusinessLayer.Reports;
using CORNCommon.Classes;
using System.Globalization;
using System.Web;

/// <summary>
/// From For Purchase, TranferOut, Purchase Return, TranferIn And Damage
/// </summary>
public partial class Forms_frmPurchaseEntry : System.Web.UI.Page
{
    readonly SKUPriceDetailController _pController = new SKUPriceDetailController();
    readonly PurchaseController _mPurchaseCtrl = new PurchaseController();
    readonly SkuController SKUCtl = new SkuController();
    readonly DataControl _dc = new DataControl();

    DataTable _purchaseSkus;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
        Response.Cache.SetNoStore();
        Response.AppendHeader("pragma", "no-cache");

        if (!Page.IsPostBack)
        {
            this.GetAppSettingDetail();
            GSTSetting();
            DrpDocumentType.Focus();
            LoadPrincipal();
            LoadDistributor();
            CreatTable();
            GetDocumentNo();
            btnAdd.Attributes.Add("onclick", "return ValidateForm();");
            ddlSkus_SelectedIndexChanged(null, null);
            DrpDocumentType_SelectedIndexChanged(null,null);
            txtExpiryDate.Attributes.Add("readonly", "readonly");
            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributorID.Value.ToString())
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }
            if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
            {
                txtExpiryDate.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
            }
        }
    }

    private void CreatTable()
    {
        _purchaseSkus = new DataTable();
        _purchaseSkus.Columns.Add("PURCHASE_DETAIL_ID", typeof(long));
        _purchaseSkus.Columns.Add("SKU_ID", typeof(int));
        _purchaseSkus.Columns.Add("SKU_Code", typeof(string));
        _purchaseSkus.Columns.Add("SKU_Name", typeof(string));
        _purchaseSkus.Columns.Add("UOM_DESC", typeof(string));
        _purchaseSkus.Columns.Add("PRICE", typeof(decimal));
        _purchaseSkus.Columns.Add("Quantity", typeof(decimal));
        _purchaseSkus.Columns.Add("FREE_SKU", typeof(decimal));
        _purchaseSkus.Columns.Add("AMOUNT", typeof(decimal));
        _purchaseSkus.Columns.Add("UOM_ID", typeof(int));
        _purchaseSkus.Columns.Add("S_UOM_ID", typeof(int));
        _purchaseSkus.Columns.Add("S_Quantity", typeof(decimal));
        _purchaseSkus.Columns.Add("DISCOUNT", typeof(decimal));
        _purchaseSkus.Columns.Add("TAX", typeof(decimal));
        _purchaseSkus.Columns.Add("Remarks", typeof(string));
        _purchaseSkus.Columns.Add("Expiry_Date", typeof(string));

        Session.Add("PurchaseSKUS", _purchaseSkus);

    }

    private void GSTSetting()
    {
        txtGstAmount.Enabled = false;
        rdoGSTType.Enabled = true;
        txtItemGST.Enabled = true;
        DataTable dt = (DataTable)Session["dtAppSettingDetail"];
        if (dt.Rows.Count > 0)
        {
            if(dt.Rows[0]["PurchaseGSTType"].ToString() == "2")
            {
                rdoGSTType.SelectedValue = "1";
                txtGstAmount.Enabled = true;
                rdoGSTType.Enabled = false;
                txtItemGST.Enabled = false;                
            }
        }
    }

    #region Load

    private DataTable GetCOAConfiguration()
    {
        try
        {
            COAMappingController _cController = new COAMappingController();
            DataTable dt = _cController.SelectCOAConfiguration(5, Constants.ShortNullValue, Constants.LongNullValue, "Level 4");
            if (dt.Rows.Count > 0)
            {
                return dt;
            }
            else
            {
                return null;
            }
        }
        catch (Exception ex)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + ex + "');", true);
            return null;
        }
    }

    private void GetDocumentNo()
    {
        int TypeID = Convert.ToInt32(DrpDocumentType.Value);
        if (DrpDocumentType.Value.ToString() == "20")
        {
            TypeID = 22;
        }
        drpDocumentNo.Items.Clear();
        drpDocumentNo.Items.Add(new DevExpress.Web.ListEditItem("New", Constants.LongNullValue.ToString()));
        if (TypeID == 5)
        {
            DataTable dt = _mPurchaseCtrl.SelectPurchaseDocumentNo(TypeID, Constants.IntNullValue, int.Parse(Session["UserId"].ToString()), Convert.ToDateTime(Session["CurrentWorkDate"]));            
            clsWebFormUtil.FillDxComboBoxList(drpDocumentNo, dt, 0, 0, false);
            drpDocumentNo.SelectedIndex = 0;
        }
        else
        {
            DataTable dt = _mPurchaseCtrl.SelectPurchaseDocumentNo(TypeID, Constants.IntNullValue, Constants.LongNullValue, int.Parse(Session["UserId"].ToString()), 0);
            clsWebFormUtil.FillDxComboBoxList(drpDocumentNo, dt, 0, 0, false);
            drpDocumentNo.SelectedIndex = 0;
        }
    }

    private void LoadPrincipal()
    {
        DataTable mDt = _pController.SelectDataPrice(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, int.Parse(Session["UserId"].ToString()), Constants.IntNullValue, 4, Constants.DateNullValue);
        clsWebFormUtil.FillDxComboBoxList(drpPrincipal, mDt, 0, 1, true);

        if (mDt.Rows.Count > 0)
        {
            drpPrincipal.SelectedIndex = 0;
        }

    }

    private void LoadDistributor()
    {
        DistributorController DController = new DistributorController();
        DataTable dt = DController.GetDistributorWithMaxDayClose(Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), int.Parse(this.Session["CompanyId"].ToString()), 1);
        clsWebFormUtil.FillDxComboBoxList(drpDistributorID, dt, "DISTRIBUTOR_ID", "DISTRIBUTOR_NAME");

        if (dt.Rows.Count > 0)
        {
            drpDistributorID.SelectedIndex = 0;
        }
        Session.Add("dtLocationInfo", dt);
    }

    private void LoadToDistributor()
    {
        var dController = new DistributorController();
        DataTable dt = dController.SelectDistributorInfo(Constants.IntNullValue, Constants.IntNullValue, int.Parse(Session["CompanyId"].ToString()));
        clsWebFormUtil.FillDxComboBoxList(DrpTransferFor, dt, 0, 2, true);

        if (dt.Rows.Count > 0)
        {
            DrpTransferFor.SelectedIndex = 0;
        }
    }

    private void LoadDocumentDetail()
    {
        DataTable dt = _mPurchaseCtrl.SelectPurchaseDocumentNo(Constants.IntNullValue, Constants.IntNullValue, long.Parse(drpDocumentNo.Value.ToString()), Constants.IntNullValue, Constants.IntNullValue);
        if (dt.Rows.Count > 0)
        {
            if (DrpDocumentType.SelectedIndex == 0)
            {
                drpDistributorID.Value = dt.Rows[0]["SOLD_TO"].ToString();
                drpPrincipal.Value = dt.Rows[0]["SOLD_FROM"].ToString();
                txtDocumentNo.Text = dt.Rows[0][2].ToString();
                txtBuiltyNo.Text = dt.Rows[0]["BUILTY_NO"].ToString();
                txtGstAmount.Text = dt.Rows[0]["GST_AMOUNT"].ToString();
                txtAdvanceTax.Text = dt.Rows[0]["GST_ADVANCE"].ToString();
                txtDiscount.Text = dt.Rows[0]["DISCOUNT"].ToString();
                txtFreight.Text = dt.Rows[0]["FREIGHT_AMOUNT"].ToString();
                ddlPaymentMode.Value = dt.Rows[0]["PAYMENT_MODE"].ToString();
            }
            else if (DrpDocumentType.SelectedIndex == 1)
            {
                drpDistributorID.Value = dt.Rows[0]["SOLD_FROM"].ToString();
                DrpTransferFor.Value = dt.Rows[0]["SOLD_TO"].ToString();
                txtAmount.Text = dt.Rows[0]["TOTAL_AMOUNT"].ToString();
                txtGstAmount.Text = dt.Rows[0]["GST_AMOUNT"].ToString();
                txtAdvanceTax.Text = dt.Rows[0]["GST_ADVANCE"].ToString();
                txtNetAmount.Text = dt.Rows[0]["NET_AMOUNT"].ToString();
                txtDocumentNo.Text = dt.Rows[0][2].ToString();
                txtBuiltyNo.Text = dt.Rows[0]["BUILTY_NO"].ToString();
            }
            else if (DrpDocumentType.SelectedIndex == 2)
            {
                drpPrincipal.Value = dt.Rows[0]["SOLD_TO"].ToString();
                drpDistributorID.Value = dt.Rows[0]["SOLD_FROM"].ToString();
                txtAmount.Text = dt.Rows[0]["TOTAL_AMOUNT"].ToString();
                txtGstAmount.Text = dt.Rows[0]["GST_AMOUNT"].ToString();
                txtAdvanceTax.Text = dt.Rows[0]["GST_ADVANCE"].ToString();
                DrpTransferFor.Text = dt.Rows[0]["DISCOUNT"].ToString();
                txtNetAmount.Text = dt.Rows[0]["NET_AMOUNT"].ToString();
                txtDocumentNo.Text = dt.Rows[0][2].ToString();
                txtBuiltyNo.Text = dt.Rows[0]["BUILTY_NO"].ToString();
            }
            else
            {
                DrpTransferFor.Value = dt.Rows[0]["SOLD_FROM"].ToString();
                drpDistributorID.Value = dt.Rows[0]["SOLD_TO"].ToString();
                txtDocumentNo.Text = dt.Rows[0][2].ToString();
                txtBuiltyNo.Text = dt.Rows[0]["BUILTY_NO"].ToString();
            }
            _purchaseSkus = _mPurchaseCtrl.SelectPurchaseDetail(Constants.IntNullValue, long.Parse(dt.Rows[0][0].ToString()));
            Session.Add("PurchaseSKUS", _purchaseSkus);

            if (DrpDocumentType.Value.ToString() == "2")
            {
                decimal discount = 0;
                decimal gst = 0;
                foreach (DataRow item in _purchaseSkus.Rows)
                {
                    var tax = Convert.ToDecimal(_dc.chkNull_0(item["TAX"].ToString()));
                    var disc = Convert.ToDecimal(_dc.chkNull_0(item["DISCOUNT"].ToString()));
                    gst = gst + tax;
                    discount = discount + disc;
                }

                txtGstAmount.Text = (Convert.ToDecimal(_dc.chkNull_0(txtGstAmount.Text)) - gst).ToString();
                txtDiscount.Text = (Convert.ToDecimal(_dc.chkNull_0(txtDiscount.Text)) - discount).ToString();
            }

            LoadGird();
        }
    }

    private void LoadGird()
    {
        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];

        if (_purchaseSkus != null)
        {
            GrdPurchase.DataSource = _purchaseSkus;
            GrdPurchase.DataBind();
            decimal totalValue = _purchaseSkus.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["Quantity"].ToString()));
            decimal totalAmount = _purchaseSkus.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["AMOUNT"].ToString()));
            txtTotalQuantity.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalValue);

            decimal grossAmount = 0;
            decimal totalgst = 0;
            foreach (GridViewRow item in GrdPurchase.Rows)
            {
                var qty = Convert.ToDecimal(_dc.chkNull_0(item.Cells[4].Text));
                var price = Convert.ToDecimal(_dc.chkNull_0(item.Cells[6].Text));
                grossAmount = grossAmount + (qty * price);
                totalgst += Convert.ToDecimal(_dc.chkNull_0(item.Cells[8].Text));
            }

            txtTotalAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", grossAmount);
            txtGstAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalgst);
            if (DrpDocumentType.SelectedIndex == 0)
            {
                txtNetAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", grossAmount + Convert.ToDecimal(_dc.chkNull_0(txtGstAmount.Text)) + Convert.ToDecimal(_dc.chkNull_0(txtAdvanceTax.Text)) - Convert.ToDecimal(_dc.chkNull_0(txtDiscount.Text)) + Convert.ToDecimal(_dc.chkNull_0(txtFreight.Text)));
            }
            else
            {
                txtNetAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", grossAmount + Convert.ToDecimal(_dc.chkNull_0(txtGstAmount.Text)) + Convert.ToDecimal(_dc.chkNull_0(txtAdvanceTax.Text)) - Convert.ToDecimal(_dc.chkNull_0(txtDiscount.Text)));
            }
        }
    }

    private void LoadSkuDetail()
    {
        ddlSkus.Items.Clear();
        hfInventoryType.Value = "0";
        //if (drpPrincipal.Items.Count > 0)
        //{
            DataTable dtskuPrice = new DataTable();
            if (Session["ProductionInPriceFromBOM"].ToString() == "1" && DrpDocumentType.Value.ToString() == "20")
            {
                dtskuPrice = _pController.SelectDataPrice(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Convert.ToInt32(drpDistributorID.Value), int.Parse(Session["UserId"].ToString()), Constants.IntNullValue, 6, Convert.ToDateTime(Session["CurrentWorkDate"]));
            }
            else
            {
                if (Session["IsLocationWiseItem"].ToString() == "1" && 
                    (DrpDocumentType.Value.ToString() == Constants.Document_Purchase.ToString() ||
                    DrpDocumentType.Value.ToString() == Constants.Document_Purchase_Return.ToString() ||
                    DrpDocumentType.Value.ToString() == Constants.Document_Transfer_Out.ToString() ||
                     DrpDocumentType.Value.ToString() == Constants.Document_Damaged.ToString()))
                {
                    dtskuPrice = SKUCtl.SelectSkuInfo(Constants.IntNullValue, int.Parse(drpDistributorID.SelectedItem.Value.ToString()), Constants.IntNullValue, 26, int.Parse(Session["CompanyId"].ToString()), Convert.ToInt32(DrpDocumentType.Value));
                }
                else
                {
                    dtskuPrice = SKUCtl.SelectSkuInfo(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, 23, int.Parse(Session["CompanyId"].ToString()), Convert.ToInt32(DrpDocumentType.Value));
                }
            }
            DataTable dtskuPrice2 = _pController.GetItemsInventory(Convert.ToInt32(drpDistributorID.Value), Convert.ToDateTime(Session["CurrentWorkDate"]),1);
            clsWebFormUtil.FillDxComboBoxList(ddlSkus, dtskuPrice, "SKU_ID", "SKU_NAME", true);
            if (dtskuPrice.Rows.Count > 0)
            {
                ddlSkus.SelectedIndex = 0;
                if (dtskuPrice.Rows[0]["IsInventoryWeight"].ToString() != "")
                {
                    if (Convert.ToBoolean(dtskuPrice.Rows[0]["IsInventoryWeight"]))
                    {
                        hfInventoryType.Value = "1";
                    }
                }
            }
            else
            {
                ddlSkus.SelectedIndex = -1;
            }
            Session.Add("Dtsku_Price", dtskuPrice);
            Session.Add("dtskuPrice2", dtskuPrice2);
        //}
    }

    #endregion

    #region IndexChnage

    protected void DrpDocumentType_SelectedIndexChanged(object sender, EventArgs e)
    {
        GrdPurchase.Columns[5].Visible = true;
        GrdPurchase.Columns[6].Visible = true;
        GrdPurchase.Columns[7].Visible = false;
        GrdPurchase.Columns[8].Visible = false;
        GrdPurchase.Columns[11].Visible = false;
        GrdPurchase.Columns[12].Visible = false;
        GrdPurchase.Columns[9].HeaderText = "Amount";
        if (DrpDocumentType.Value.ToString() == "20")
        {
            GrdPurchase.Columns[5].Visible = false;
            GrdPurchase.Columns[6].Visible = false;
            GrdPurchase.Columns[9].HeaderText = "Price";
            GrdPurchase.Columns[12].Visible = true;
        }
        if (DrpDocumentType.Value.ToString() == "2")
        {
            GrdPurchase.Columns[7].Visible = true;
            GrdPurchase.Columns[8].Visible = true;
            GrdPurchase.Columns[12].Visible = true;
        }

        lblInvoice.Text = "INV/DC  No";
        divPrice.Visible = true;
        divPrice2.Visible = true;
        divAmount.Visible = true;
        divAmount2.Visible = true;
        divGrossAmount.Visible = true;
        divGSTAmount.Visible = true;
        divDiscount.Visible = true;
        divNetAmount.Visible = true;
        lblStock.Visible = false;
        lblLastPrice.Visible = false;
        lblPaymentMode.Visible = false;
        ddlPaymentMode.Visible = false;
        lblQty.InnerText = "Qty";
        divBonusQty.Visible = false;
        divBonuslbl.Visible = false;
        divItemDisc.Visible = false;
        divItemGst.Visible = false;
        divItemDisc1.Visible = false;
        divItemGST1.Visible = false;
        divFreight.Visible = false;
        divAdvanceTax.Visible = false;
        rdoGSTType.Visible = false;
        divRemarks.Visible = false;
        divtxtRemarks.Visible = false;
        lblExpiry.Visible = false;
        divExpiry.Visible = false;
        if (DrpDocumentType.SelectedIndex == 0)
        {
            lblQty.InnerText = "Pur. Qty";
            lblPaymentMode.Visible = true;
            ddlPaymentMode.Visible = true;
            lblStock.Visible = true;
            lblLastPrice.Visible = true;
            lbltoLocation.Text = "<span class='fa fa-caret-right rgt_cart'></span>Supplier";
            lblfromLocation.Text = "Purchase For";
            drpDistributorID.Enabled = true;
            drpPrincipal.Enabled = true;
            DrpTransferFor.Visible = false;
            lblTransferFor.Visible = false;
            divBonusQty.Visible = true;
            divItemDisc1.Visible = true;
            divItemGST1.Visible = true;
            divBonuslbl.Visible = true;
            divItemDisc.Visible = true;
            divItemGst.Visible = true;
            divFreight.Visible = true;
            divAdvanceTax.Visible = true;
            lblExpiry.Visible = true;
            divExpiry.Visible = true;
            txtPrice.Text = "";
            txtSKUCode.Text = "";
            GetDocumentNo();
            drpPrincipal.Visible = true;
            lbltoLocation.Visible = true;
            rdoGSTType.Visible = true;
        }
        else if (DrpDocumentType.SelectedIndex == 1)
        {
            lblStock.Visible = true;
            lblfromLocation.Text = "Transfer From";
            drpDistributorID.Enabled = true;
            drpPrincipal.Visible = false;
            lbltoLocation.Visible = false;
            LoadToDistributor();
            DrpTransferFor.Visible = true;
            lblInvoice.Text = "Driver Name";
            lblTransferFor.Visible = true;
            lblTransferFor.Text = "<span class='fa fa-caret-right rgt_cart'></span>Transfer To";
            txtPrice.Text = "";
            txtBonus.Text = "";
            txtSKUCode.Text = "";
            divPrice.Visible = false;
            divPrice2.Visible = false;
            divAmount.Visible = false;
            divAmount2.Visible = false;
            divGrossAmount.Visible = false;
            divGSTAmount.Visible = false;
            divDiscount.Visible = false;
            divNetAmount.Visible = false;
            GetDocumentNo();
        }
        else if (DrpDocumentType.SelectedIndex == 2)
        {
            lbltoLocation.Text = "<span class='fa fa-caret-right rgt_cart'></span>Supplier";
            lblfromLocation.Text = "Return From";
            drpDistributorID.Enabled = true;           
            DrpTransferFor.Visible = false;
            lblTransferFor.Visible = false;
            drpPrincipal.Visible = true;
            lbltoLocation.Visible = true;
            txtPrice.Text = "";
            txtBonus.Text = "";
            txtSKUCode.Text = "";
            GetDocumentNo();
        }
        else if (DrpDocumentType.SelectedIndex == 4)
        {
            lblfromLocation.Text = "Location";
            drpDistributorID.Enabled = true;
            drpPrincipal.Visible = false;
            lbltoLocation.Visible = false;
            DrpTransferFor.Visible = false;
            lblTransferFor.Visible = false;
            txtPrice.Text = "";
            txtSKUCode.Text = "";
            txtBonus.Text = "";
            divAmount.Visible = false;
            divAmount2.Visible = false;
            divGrossAmount.Visible = false;
            divGSTAmount.Visible = false;
            divDiscount.Visible = false;
            divNetAmount.Visible = false;
            divExpiry.Visible = true;
            lblExpiry.Visible = true;
            GetDocumentNo();
        }
        else
        {
            lblfromLocation.Text = "Location";
            drpDistributorID.Enabled = true;
            drpPrincipal.Visible = false;
            lbltoLocation.Visible = false;
            DrpTransferFor.Visible = false;
            lblTransferFor.Visible = false;
            txtPrice.Text = "";
            txtSKUCode.Text = "";
            txtBonus.Text = "";
            divPrice.Visible = false;
            divPrice2.Visible = false;
            divAmount.Visible = false;
            divAmount2.Visible = false;
            divGrossAmount.Visible = false;
            divGSTAmount.Visible = false;
            divDiscount.Visible = false;
            divNetAmount.Visible = false;            
            GetDocumentNo();
        }

        if (DrpDocumentType.SelectedIndex == 3)
        {
            divRemarks.Visible = true;
            divtxtRemarks.Visible = true;
            txtItemRemarks.Text = "";
            GrdPurchase.Columns[11].Visible = true;
        }
        DrpDocumentType.Focus();
        txtQuantity.Text = "";
        txtBonus.Text = "";
        txtDiscount.Text = string.Empty;
        txtFreight.Text = string.Empty;
        txtGstAmount.Text = string.Empty;
        txtAdvanceTax.Text = String.Empty;
        txtAmount.Text = "0";
        btnAdd.Text = "Add";
        _privouseQty.Value = "0";
        txtNetAmount.Text = "0";
        txtDocumentNo.Text = "";
        txtBuiltyNo.Text = "";
        LoadSkuDetail();
        ddlSkus_SelectedIndexChanged(null, null);
    }

    protected void drpDocumentNo_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (drpDocumentNo.SelectedItem.Value.ToString() == Constants.LongNullValue.ToString())
        {
            txtFreight.Text = "0";
            CreatTable();
            Session.Add("PurchaseSKUS", _purchaseSkus);
            LoadGird();
            ClearAll();
            drpDistributorID.Enabled = true;
            DrpDocumentType.Enabled = true;
        }
        else
        {
            txtBuiltyNo.Text = "";
            txtDocumentNo.Text = "";
            drpDistributorID.Enabled = false;
            DrpDocumentType.Enabled = false;
            LoadDocumentDetail();
            LoadSkuDetail();
        }
        drpDocumentNo.Focus();
    }

    protected void drpDistributor_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadSkuDetail();
        drpDistributorID.Focus();
        lblStock.Text = "Closing Stock: 0";
        lblLastPrice.Text = "Last Price: 0";
        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributorID.Value.ToString())
            {
                if (dr["MaxDayClose"].ToString().Length > 0)
                {
                    CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                    break;
                }
            }
        }
        if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
        {
            txtExpiryDate.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
        }
        if (ddlSkus.Items.Count > 0 && drpDistributorID.Items.Count > 0)
        {
            DataSet dsClosing = SKUCtl.GetSKUClosingStockLastPrice(Convert.ToInt32(ddlSkus.Value), Convert.ToInt32(drpDistributorID.Value),CurrentWorkDate);
            if (dsClosing.Tables[0].Rows.Count > 0)
            {
                lblStock.Text = "Closing Stock: " + String.Format("{0:0.00}", dsClosing.Tables[0].Rows[0]["CLOSING_STOCK"]);
            }
            if (dsClosing.Tables[1].Rows.Count > 0)
            {
                lblLastPrice.Text = "Last Price: " + String.Format("{0:0.00}", dsClosing.Tables[1].Rows[0]["PRICE"]);
                hfItemGST.Value = dsClosing.Tables[1].Rows[0]["Tax"].ToString();
            }
        }
    }

    protected void ddlSkus_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtPrice.Text = "";        
        if (Session["DisablePriceOnProductionIn"].ToString() == "1")
        {
            txtPrice.Enabled = true;
            if (DrpDocumentType.Value.ToString() == "20")
            {
                txtPrice.Enabled = false;
            }
        }

        txtQuantity.Enabled = true;
        lblStock.Text = "Closing Stock: 0";
        lblLastPrice.Text = "Last Price: 0";
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        if (ddlSkus.Items.Count > 0)
        {
            DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + ddlSkus.SelectedItem.Value + "'");
            if (foundRows.Length > 0)
            {
                if (DrpDocumentType.Value.ToString() == "20")
                {
                    if (Session["ProductionInPriceFromBOM"].ToString() == "1")
                    {
                        if (Convert.ToDecimal(foundRows[0]["FinishedSKUPrice"]) == 0)
                        {
                            txtPrice.Text = String.Format("{0:0.00}", foundRows[0]["ProductionInPrice"]);
                        }
                        else
                        {
                            txtPrice.Text = foundRows[0]["FinishedSKUPrice"].ToString();
                            txtPrice.Enabled = false;
                        }
                    }
                    else
                    {
                        txtPrice.Text = String.Format("{0:0.00}", foundRows[0]["ProductionInPrice"]);
                    }
                }
                txtUOM.Text = foundRows[0]["UOM_DESC"].ToString();
                if (foundRows[0]["IsInventoryWeight"].ToString() != "")
                {
                    if (Convert.ToBoolean(foundRows[0]["IsInventoryWeight"]))
                    {
                        hfInventoryType.Value = "1";
                    }
                    else
                    {
                        txtQuantity.Text = string.Empty;
                        txtBonus.Text = "";
                        hfInventoryType.Value = "0";
                    }
                }
                else
                {
                    txtQuantity.Text = string.Empty;
                    txtBonus.Text = "";
                }

                if (ddlSkus.Items.Count > 0 && drpDistributorID.Items.Count > 0)
                {
                    DateTime CurrentWorkDate = Constants.DateNullValue;
                    DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
                    foreach (DataRow dr in dtLocationInfo.Rows)
                    {
                        if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributorID.Value.ToString())
                        {
                            if (dr["MaxDayClose"].ToString().Length > 0)
                            {
                                CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                                break;
                            }
                        }
                    }
                    DataSet dsClosing = SKUCtl.GetSKUClosingStockLastPrice(Convert.ToInt32(ddlSkus.Value), Convert.ToInt32(drpDistributorID.Value),CurrentWorkDate);
                    if (dsClosing.Tables[0].Rows.Count > 0)
                    {
                        lblStock.Text = "Closing Stock: " + String.Format("{0:0.00}", dsClosing.Tables[0].Rows[0]["CLOSING_STOCK"]);
                    }
                    if (dsClosing.Tables[1].Rows.Count > 0)
                    {
                        lblLastPrice.Text = "Last Price: " + String.Format("{0:0.00}", dsClosing.Tables[1].Rows[0]["PRICE"]);
                        hfItemGST.Value = dsClosing.Tables[1].Rows[0]["Tax"].ToString();
                    }
                }
            }
        }
        txtQuantity.Focus();
    }
    #endregion

    #region Grid Operations

    protected void GrdPurchase_RowEditing(object sender, GridViewEditEventArgs e)
    {
        _rowNo.Value = e.NewEditIndex.ToString();
        ddlSkus.Value = GrdPurchase.Rows[e.NewEditIndex].Cells[0].Text;
        txtQuantity.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[4].Text;
        if (drpDocumentNo.Value.ToString() == Constants.LongNullValue.ToString())
        {
            _privouseQty.Value = "0";
        }
        else
        {
            _privouseQty.Value = GrdPurchase.Rows[e.NewEditIndex].Cells[4].Text;
        }
        txtBonus.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[5].Text;
        if (DrpDocumentType.Value.ToString() == "20")
        {
            if (Session["ProductionInPriceFromBOM"].ToString() == "1")
            {
                txtPrice.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[9].Text;
            }
            else
            {
                txtPrice.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[6].Text;
            }
        }
        else
        {
            txtPrice.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[6].Text;
        }
        txtItemDiscount.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[7].Text;

        if (rdoGSTType.SelectedValue == "1")
        {
            var gstAmount = _dc.chkNull_0(GrdPurchase.Rows[e.NewEditIndex].Cells[8].Text);
            var amount = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * decimal.Parse(_dc.chkNull_0(txtQuantity.Text));
            var discount = _dc.chkNull_0(GrdPurchase.Rows[e.NewEditIndex].Cells[7].Text);
            var netAmount = amount - decimal.Parse(discount);

            var gstPercent = (decimal.Parse(gstAmount) / netAmount) * 100;
            txtItemGST.Text = gstPercent.ToString();
        }
        else
        {
            txtItemGST.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[8].Text;
        }

        txtAmount.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[9].Text;

        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + ddlSkus.SelectedItem.Value + "'");
        if (foundRows.Length > 0)
        {
            txtUOM.Text = foundRows[0]["UOM_DESC"].ToString();
        }
        ddlSkus.Enabled = false;
        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributorID.Value.ToString())
            {
                if (dr["MaxDayClose"].ToString().Length > 0)
                {
                    CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                    break;
                }
            }
        }
        DataSet dsClosing = SKUCtl.GetSKUClosingStockLastPrice(Convert.ToInt32(ddlSkus.Value), Convert.ToInt32(drpDistributorID.Value), CurrentWorkDate);
        if (dsClosing.Tables[0].Rows.Count > 0)
        {
            decimal closing = Convert.ToDecimal(dsClosing.Tables[0].Rows[0]["CLOSING_STOCK"]) + Convert.ToDecimal(_privouseQty.Value);
            lblStock.Text = "Closing Stock: " + String.Format("{0:0.00}", closing);
        }
        txtQuantity.Focus();
        txtItemRemarks.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[11].Text;
        txtExpiryDate.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[12].Text;
        btnAdd.Text = "Update";
    }

    protected void GrdPurchase_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
        if (_purchaseSkus.Rows.Count > 0)
        {
            _purchaseSkus.Rows.RemoveAt(e.RowIndex);
            Session.Add("PurchaseSKUS", _purchaseSkus);
            LoadGird();
        }
    }

    #endregion

    private bool CheckDublicateSku(string SKUID)
    {
        try
        {
            _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
            DataRow[] foundRows = _purchaseSkus.Select("SKU_ID  = '" + SKUID + "'");
            if (foundRows.Length == 0)
            {
                return true;
            }
            return false;
        }
        catch (Exception)
        {

            throw;
        }
    }

    #region Click OPerations

    protected void btnAdd_Click(object sender, EventArgs e)
    {
        try
        {
            if (drpDocumentNo.Value.ToString() == Constants.LongNullValue.ToString())
            {
                if (DrpDocumentType.SelectedIndex == 0)
                {
                    if (decimal.Parse(_dc.chkNull_0(txtQuantity.Text)) <= 0 && decimal.Parse(_dc.chkNull_0(txtBonus.Text)) <= 0)
                    {
                        ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please enter Quantity.');", true);
                        txtQuantity.Focus();
                        return;
                    }
                }
                else
                {
                    if (decimal.Parse(_dc.chkNull_0(txtQuantity.Text)) <= 0)
                    {
                        ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please enter Quantity.');", true);
                        txtQuantity.Focus();
                        return;
                    }
                }
                if (DrpDocumentType.Value.ToString() == "2" || DrpDocumentType.Value.ToString() == "3")
                {
                    if (decimal.Parse(_dc.chkNull_0(txtPrice.Text)) <= 0)
                    {
                        ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please enter Price.');", true);
                        txtPrice.Focus();
                        return;
                    }
                }
            }

            if (DrpDocumentType.SelectedIndex == 0 || DrpDocumentType.SelectedIndex == 2) //0:purchase, 2=Purchase return
            {
                if (drpPrincipal.SelectedIndex == -1)
                {
                    ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please select Supplier');", true);
                    return;
                }
            }

            DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
            DataTable dtskuPrice2 = (DataTable)Session["dtskuPrice2"];
            DataRow[] foundRows;
            DataRow[] foundRows2;
            string wQty = "";
            string ERPCode = "";
            decimal Qty = 0;
            if (cbScan.Checked)
            {
                if (txtSKUCode.Text.Length > 0)
                {
                    try
                    {
                        ERPCode = txtSKUCode.Text.Substring(0, 7);
                        wQty = txtSKUCode.Text.Substring(7, 6);
                        Convert.ToInt32(wQty);
                    }
                    catch (Exception ex)
                    {
                        wQty = "";
                    }
                    foundRows = dtskuPrice.Select("ERPCode = '" + ERPCode + "'");
                    if (foundRows.Length > 0 && wQty.Length > 0)
                    {                        
                        foundRows2 = dtskuPrice2.Select("ERPCode = '" + ERPCode + "'");
                        Qty = Convert.ToDecimal(wQty.Substring(0,2) + "." + wQty.Substring(2,4));
                    }
                    else
                    {
                        foundRows = dtskuPrice2.Select("ERPCode = '" + txtSKUCode.Text + "'");
                        foundRows2 = dtskuPrice2.Select("ERPCode = '" + txtSKUCode.Text + "'");
                        Qty = decimal.Parse(_dc.chkNull_0(txtQuantity.Text));
                    }
                }
                else
                {
                    return;
                }
            }
            else
            {
                foundRows = dtskuPrice.Select("SKU_ID = '" + ddlSkus.SelectedItem.Value + "'");
                foundRows2 = dtskuPrice2.Select("SKU_ID = '" + ddlSkus.SelectedItem.Value + "'");
                Qty = decimal.Parse(_dc.chkNull_0(txtQuantity.Text));
            }

            if (foundRows.Length > 0)
            {
                _purchaseSkus = (DataTable)Session["PurchaseSKUS"];

                decimal currentStock = -1;
                if (Convert.ToBoolean(Session["VALIDATE_STOCK"]) == false)
                {
                    currentStock = -1;
                }
                else
                {
                    currentStock = CheckStockStatus(int.Parse(_dc.chkNull_0(foundRows[0]["SKU_ID"].ToString())));
                }
                if (btnAdd.Text == "Add")
                {
                    if (CheckDublicateSku(foundRows[0]["SKU_ID"].ToString()))
                    {
                        if (currentStock == -1)
                        {
                            DataRow dr = _purchaseSkus.NewRow();
                            dr["SKU_ID"] = foundRows[0]["SKU_ID"];
                            dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                            dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                            dr["UOM_ID"] = foundRows[0]["UOM_ID"];
                            dr["Quantity"] = Qty;
                            dr["S_UOM_ID"] = foundRows[0]["S_UOM_ID"];
                            dr["UOM_DESC"] = txtUOM.Text;
                            dr["DISCOUNT"] = decimal.Parse(_dc.chkNull_0(txtItemDiscount.Text));

                            if (DrpDocumentType.SelectedIndex == 0)
                            {
                                dr["FREE_SKU"] = _dc.chkNull_0(txtBonus.Text);
                            }
                            else
                            {
                                dr["FREE_SKU"] = 0;
                            }
                            if (decimal.Parse(_dc.chkNull_0(foundRows[0]["UOM_ID"].ToString())) != decimal.Parse(_dc.chkNull_0(foundRows[0]["S_UOM_ID"].ToString())))
                            {
                                dr["S_Quantity"] = DataControl.QuantityConversion(Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["DEFAULT_QTY"].ToString())), foundRows[0]["PS_OPERATOR"].ToString(), Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["PS_FACTOR"].ToString())), Qty, Constants.DecimalNullValue, "");
                            }
                            else
                            {
                                dr["S_Quantity"] = Qty;
                            }

                            if (DrpDocumentType.SelectedItem.Value.ToString() == "2" || DrpDocumentType.SelectedItem.Value.ToString() == "3" || DrpDocumentType.SelectedItem.Value.ToString() == "20")
                            {
                                if (DrpDocumentType.Value.ToString() == "20")
                                {
                                    if (Session["ProductionInPriceFromBOM"].ToString() == "1")
                                    {
                                        dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                        dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) / Qty;
                                    }
                                    else
                                    {
                                        dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                        dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * Qty;
                                    }
                                }
                                else if (DrpDocumentType.Value.ToString() == "2")
                                {
                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtAmount.Text));
                                }
                                else
                                {
                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * Qty;
                                }

                                if (rdoGSTType.SelectedValue == "1")
                                {
                                    var gross = decimal.Parse(dr["PRICE"].ToString()) * decimal.Parse(dr["Quantity"].ToString());
                                    var discount = decimal.Parse(dr["DISCOUNT"].ToString());

                                    var netAmount = gross - discount;
                                    var gst = netAmount * (decimal.Parse(_dc.chkNull_0(txtItemGST.Text)) / 100);

                                    dr["TAX"] = gst;
                                }
                                else
                                {
                                    dr["TAX"] = decimal.Parse(_dc.chkNull_0(txtItemGST.Text));
                                }
                            }
                            else
                            {
                                if (lblLastPrice.Text.Replace("Last Price: ","").Trim().Length > 0)
                                {
                                    dr["PRICE"] = Convert.ToDecimal(lblLastPrice.Text.Replace("Last Price: ", "").Trim());
                                    dr["AMOUNT"] = decimal.Parse(lblLastPrice.Text.Replace("Last Price: ", "").Trim()) * Qty;
                                    dr["TAX"] = Convert.ToDecimal(hfItemGST.Value) * Qty;
                                }
                                else
                                {
                                    dr["PRICE"] = 0;
                                    dr["AMOUNT"] = 0;
                                    dr["TAX"] = 0;
                                }
                            }
                            dr["Remarks"] = txtItemRemarks.Text;
                            dr["Expiry_Date"] = txtExpiryDate.Text;
                            _purchaseSkus.Rows.Add(dr);
                        }
                        else
                        {
                            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('  " + foundRows[0]["SKU_NAME"].ToString() + " Current closing Stock is " + currentStock + "');", true);
                            return;
                        }
                    }
                    else
                    {
                        if (cbScan.Checked)
                        {
                            foreach (DataRow dr in _purchaseSkus.Rows)
                            {
                                if (dr["SKU_ID"].ToString() == foundRows[0]["SKU_ID"].ToString())
                                {
                                    dr["Quantity"] = Convert.ToDecimal(dr["Quantity"]) + Qty;
                                    if (DrpDocumentType.SelectedIndex == 0)
                                    {
                                        dr["FREE_SKU"] = Convert.ToDecimal(dr["FREE_SKU"]) + Convert.ToDecimal(_dc.chkNull_0(txtBonus.Text));
                                    }
                                    if (decimal.Parse(_dc.chkNull_0(foundRows[0]["UOM_ID"].ToString())) != decimal.Parse(_dc.chkNull_0(foundRows[0]["S_UOM_ID"].ToString())))
                                    {
                                        dr["S_Quantity"] = Convert.ToDecimal(dr["S_Quantity"]) + DataControl.QuantityConversion(Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["DEFAULT_QTY"].ToString())), foundRows[0]["PS_OPERATOR"].ToString(), Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["PS_FACTOR"].ToString())), Qty, Constants.DecimalNullValue, "");
                                    }
                                    else
                                    {
                                        dr["S_Quantity"] = Convert.ToDecimal(dr["S_Quantity"]) + Qty;
                                    }
                                    if (DrpDocumentType.SelectedItem.Value.ToString() == "2" || DrpDocumentType.SelectedItem.Value.ToString() == "20")
                                    {
                                        if (txtPrice.Text.Length > 0)
                                        {
                                            if (DrpDocumentType.Value.ToString() == "20")
                                            {
                                                if (Session["ProductionInPriceFromBOM"].ToString() == "1")
                                                {
                                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) / decimal.Parse(dr["Quantity"].ToString());
                                                }
                                                else
                                                {
                                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * decimal.Parse(dr["Quantity"].ToString());
                                                }
                                            }
                                            else if (DrpDocumentType.Value.ToString() == "2")
                                            {
                                                dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                                dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtAmount.Text));
                                            }
                                            else
                                            {
                                                dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                                dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * decimal.Parse(dr["Quantity"].ToString());
                                            }       
                                        }
                                        else
                                        {
                                            dr["AMOUNT"] = decimal.Parse(dr["PRICE"].ToString()) * decimal.Parse(dr["Quantity"].ToString());
                                        }
                                    }
                                    else
                                    {
                                        if (foundRows2.Length > 0)
                                        {
                                            dr["AMOUNT"] = decimal.Parse(foundRows2[0]["DISTRIBUTOR_PRICE"].ToString()) * decimal.Parse(dr["Quantity"].ToString());
                                            dr["TAX"] = Convert.ToDecimal(hfItemGST.Value) * decimal.Parse(dr["Quantity"].ToString());
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        else
                        {
                            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('  " + foundRows[0]["SKU_NAME"].ToString() + " Already Exists ');", true);
                            return;
                        }
                    }
                }
                else if (btnAdd.Text == "Update")
                {
                    if (currentStock == -1)
                    {
                        DataRow dr = _purchaseSkus.Rows[Convert.ToInt32(_rowNo.Value)];
                        dr["SKU_ID"] = foundRows[0]["SKU_ID"];
                        dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                        dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                        dr["UOM_ID"] = foundRows[0]["UOM_ID"];
                        dr["Quantity"] = Qty;
                        dr["UOM_DESC"] = txtUOM.Text;
                        dr["S_UOM_ID"] = foundRows[0]["S_UOM_ID"];
                        dr["DISCOUNT"] = decimal.Parse(_dc.chkNull_0(txtItemDiscount.Text));
                        if (DrpDocumentType.SelectedIndex == 0)
                        {
                            dr["FREE_SKU"] = _dc.chkNull_0(txtBonus.Text);
                        }
                        else
                        {
                            dr["FREE_SKU"] = 0;
                        }
                        if (decimal.Parse(_dc.chkNull_0(foundRows[0]["UOM_ID"].ToString())) != decimal.Parse(_dc.chkNull_0(foundRows[0]["S_UOM_ID"].ToString())))
                        {
                            dr["S_Quantity"] = DataControl.QuantityConversion(Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["DEFAULT_QTY"].ToString())), foundRows[0]["PS_OPERATOR"].ToString(), Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["PS_FACTOR"].ToString())), Qty, Constants.DecimalNullValue, "");
                        }
                        else
                        {
                            dr["S_Quantity"] = Qty;
                        }

                        if (DrpDocumentType.SelectedItem.Value.ToString() == "2" || DrpDocumentType.SelectedItem.Value.ToString() == "20")
                        {
                            if (DrpDocumentType.Value.ToString() == "20")
                            {
                                if (Session["ProductionInPriceFromBOM"].ToString() == "1")
                                {
                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) / Qty;
                                }
                                else
                                {
                                    dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                    dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * Qty;
                                }
                            }
                            else if (DrpDocumentType.Value.ToString() == "2")
                            {
                                dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtAmount.Text));
                            }
                            else
                            {
                                dr["PRICE"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text));
                                dr["AMOUNT"] = decimal.Parse(_dc.chkNull_0(txtPrice.Text)) * Qty;
                            }

                            if (rdoGSTType.SelectedValue == "1")
                            {
                                var gross = decimal.Parse(dr["PRICE"].ToString()) * decimal.Parse(dr["Quantity"].ToString());
                                var discount = decimal.Parse(dr["DISCOUNT"].ToString());
                                var netAmount = gross - discount;
                                var gst = netAmount * (decimal.Parse(_dc.chkNull_0(txtItemGST.Text)) / 100);

                                dr["TAX"] = gst;
                            }
                            else
                            {
                                dr["TAX"] = decimal.Parse(_dc.chkNull_0(txtItemGST.Text));
                            }
                        }
                        else
                        {
                            if (foundRows2.Length > 0)
                            {
                                dr["PRICE"] = foundRows2[0]["DISTRIBUTOR_PRICE"];
                                dr["AMOUNT"] = decimal.Parse(foundRows2[0]["DISTRIBUTOR_PRICE"].ToString()) * Qty;
                                dr["TAX"] = Convert.ToDecimal(hfItemGST.Value) * Qty;
                            }
                            else
                            {
                                dr["PRICE"] = 0;
                                dr["AMOUNT"] = 0;
                                dr["TAX"] = 0;
                            }
                        }
                        dr["Remarks"] = txtItemRemarks.Text;
                        dr["Expiry_Date"] = txtExpiryDate.Text;
                    }
                    else
                    {
                        ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('  " + ddlSkus.SelectedItem.Text + "Current closing Stock is " + currentStock.ToString() + "');", true);
                        return;
                    }
                }
                Session.Add("PurchaseSKUS", _purchaseSkus);
                ClearAll();
                LoadGird();
                DisAbaleOption(true);
                if (cbScan.Checked)
                {
                    ScriptManager.GetCurrent(Page).SetFocus(txtSKUCode);
                }
                else
                {
                    ScriptManager.GetCurrent(Page).SetFocus(ddlSkus);
                }
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Wrong Item Select');", true);
            }
        }
        catch (Exception)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Some error occurred');", true);
        }
    }

    protected void btnSaveDocument_Click(object sender, EventArgs e)
    {
        if (DrpDocumentType.SelectedIndex == 1)
        {
            if (drpDistributorID.SelectedItem.Value.ToString() == DrpTransferFor.SelectedItem.Value.ToString())
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Transfer to Location must be different ');", true);
                return;
            }
        }
        else if (DrpDocumentType.SelectedIndex == 0 || DrpDocumentType.SelectedIndex == 2) //0:purchase, 2=Purchase return
        {
            if (drpPrincipal.SelectedIndex == -1)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please select Supplier');", true);
                return;
            }
        }

        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
        if (_purchaseSkus.Rows.Count > 0)
        {
            var mDayClose = new DistributorController();
            DataTable dt = mDayClose.SelectMaxDayClose(Constants.IntNullValue, Convert.ToInt32(drpDistributorID.SelectedItem.Value));
            if (dt.Rows.Count > 0)
            {
                if (CalculatePurchase(DateTime.Parse(dt.Rows[0]["CLOSING_DATE"].ToString())))
                {
                    _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
                    _purchaseSkus.Rows.Clear();
                    Session.Add("PurchaseSKUS", _purchaseSkus);
                    ClearAll();
                    txtBuiltyNo.Text = "";
                    txtDocumentNo.Text = "";
                    txtTotalQuantity.Text = "";
                    txtDiscount.Text = string.Empty;
                    txtFreight.Text = string.Empty;
                    txtGstAmount.Text = string.Empty;
                    txtAdvanceTax.Text = string.Empty;
                    LoadGird();
                    GetDocumentNo();
                    drpDistributorID.Enabled = true;
                    DrpDocumentType.Enabled = true;
                    DisAbaleOption(false);
                    this.LoadSkuDetail();
                    ddlSkus_SelectedIndexChanged(null, null);
                    ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Successfully Save ');", true);
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('some error occurred');", true);
                }
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dayclose not found for selected location!');", true);
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert(' At least one Item must enter');", true);

        }
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        DisAbaleOption(false);
        CreatTable();
        LoadGird();
        ClearAll();
        txtDocumentNo.Text = "";
        txtBuiltyNo.Text = "";
        txtDocumentNo.Text = "";
    }

    #endregion

    private bool GetFinanceConfig()
    {
        try
        {
            DataTable dt = (DataTable)Session["dtAppSettingDetail"];
            if (dt.Rows.Count > 0)
            {
                return Convert.ToInt32(dt.Rows[0]["IsFinanceIntegrate"]) == 1 ? true : false;
            }
            return false;
        }
        catch (Exception)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Error in Financial Setting!');", true);
            throw;
        }
    }

    private bool CalculatePurchase(DateTime mWorkDate)
    {
        var dtPurchaseDetail = (DataTable)Session["PurchaseSKUS"];

        decimal mTotalAmount = dtPurchaseDetail.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["AMOUNT"].ToString()));
        decimal mNetAmount = mTotalAmount + Convert.ToDecimal(_dc.chkNull_0(txtGstAmount.Text)) + Convert.ToDecimal(_dc.chkNull_0(txtAdvanceTax.Text)) - Convert.ToDecimal(_dc.chkNull_0(txtDiscount.Text));
        bool mResult = false;
        long PurchaseID = Constants.LongNullValue;

        decimal grossAmount = 0;
        decimal itemDiscount = 0;
        decimal itemGST = 0;
        foreach (GridViewRow item in GrdPurchase.Rows)
        {
            var qty = Convert.ToDecimal(_dc.chkNull_0(item.Cells[4].Text));
            var price = Convert.ToDecimal(_dc.chkNull_0(item.Cells[6].Text));
            grossAmount = grossAmount + (qty * price);
            itemDiscount = itemDiscount + Convert.ToDecimal(_dc.chkNull_0(item.Cells[7].Text));
            itemGST = itemGST + Convert.ToDecimal(_dc.chkNull_0(item.Cells[8].Text));
        }

        DataTable dtConfig = GetCOAConfiguration();
        bool IsFinanceSetting = GetFinanceConfig();
        if (DrpDocumentType.SelectedIndex == 0) //Purchase
        {
            if(txtGstAmount.Enabled)//If GST Invoice Wise
            {
                if(txtGstAmount.Text.Trim().Length > 0)
                {
                    foreach(DataRow dr in dtPurchaseDetail.Rows)
                    {
                        dr["TAX"] = Convert.ToDecimal(_dc.chkNull_0(txtGstAmount.Text))/ grossAmount * Convert.ToDecimal(dr["AMOUNT"]);
                    }
                }
            }
            if (drpDocumentNo.Value.ToString() == Constants.LongNullValue.ToString())
            {
                PurchaseID = _mPurchaseCtrl.InsertPurchase(int.Parse(drpDistributorID.SelectedItem.Value.ToString()),
                    txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString()),
                    mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()),
                    int.Parse(drpPrincipal.SelectedItem.Value.ToString()), grossAmount,
                    false, dtPurchaseDetail, 0, txtBuiltyNo.Text,
                    int.Parse(Session["UserId"].ToString()),
                    int.Parse(drpPrincipal.SelectedItem.Value.ToString()), 
                    decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)), decimal.Parse(_dc.chkNull_0(txtAdvanceTax.Text)),
                    decimal.Parse(_dc.chkNull_0(txtDiscount.Text)) + itemDiscount,
                    decimal.Parse(_dc.chkNull_0(txtFreight.Text)), mNetAmount, 
                    drpPrincipal.SelectedItem.Text, Convert.ToInt32(ddlPaymentMode.SelectedItem.Value),
                    dtConfig, IsFinanceSetting);

                if (PurchaseID > 0)
                {
                    ShowReportPopUp2(PurchaseID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                mResult = _mPurchaseCtrl.UpdatePurchase(long.Parse(drpDocumentNo.SelectedItem.Value.ToString()),
                    int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text,
                    int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()),
                    int.Parse(drpPrincipal.SelectedItem.Value.ToString()), grossAmount,
                    false, dtPurchaseDetail, 0, txtBuiltyNo.Text,
                    int.Parse(Session["UserId"].ToString()),
                    int.Parse(drpPrincipal.SelectedItem.Value.ToString())
               , decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)) + itemGST, decimal.Parse(_dc.chkNull_0(txtAdvanceTax.Text)),
                    decimal.Parse(_dc.chkNull_0(txtDiscount.Text)) + itemDiscount, 
                    decimal.Parse(_dc.chkNull_0(txtFreight.Text)), mNetAmount,
                    drpPrincipal.SelectedItem.Text, Convert.ToInt32(ddlPaymentMode.SelectedItem.Value),
                    dtConfig, IsFinanceSetting);

                ShowReportPopUp(1);
                if (mResult)
                {
                }
                return mResult;
            }
        }
        else if (DrpDocumentType.SelectedIndex == 1)    // Transfer Out
        {
            if (drpDocumentNo.SelectedItem.Value.ToString() == Constants.LongNullValue.ToString())
            {
                mResult = _mPurchaseCtrl.InsertPurchaseDocument2(int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
                , mWorkDate, int.Parse(DrpTransferFor.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
                , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()), 0, dtConfig, IsFinanceSetting);
                ShowTransferOutPopUp(0);
            }
            else
            {
                mResult = _mPurchaseCtrl.UpdatePurchaseDocument2(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
                , mWorkDate, int.Parse(DrpTransferFor.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
                , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()), 0, dtConfig, IsFinanceSetting);
                ShowTransferOutPopUp(1);
            }

            return mResult;
        }
        else if (DrpDocumentType.SelectedIndex == 2)    //Purchase Return
        {
            foreach (DataRow item in dtPurchaseDetail.Rows)
            {
                item["Expiry_Date"] = ""; //As we don't want to save Expiry date with return yet.
            }

            if (drpDocumentNo.SelectedItem.Value.ToString() == Constants.LongNullValue.ToString())
            {
                PurchaseID = _mPurchaseCtrl.InsertPurchaseNew(int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
                , mWorkDate, int.Parse(drpPrincipal.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
                , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()), int.Parse(drpPrincipal.SelectedItem.Value.ToString())
                , decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)), decimal.Parse(_dc.chkNull_0(txtDiscount.Text)), decimal.Parse(_dc.chkNull_0(txtNetAmount.Text)), drpPrincipal.SelectedItem.Text, dtConfig, IsFinanceSetting);
                ShowReportReturnPopUp(0);
                if (PurchaseID > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                mResult = _mPurchaseCtrl.UpdatePurchaseNew(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpPrincipal.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
               , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()), int.Parse(drpPrincipal.SelectedItem.Value.ToString())
               , decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)), decimal.Parse(_dc.chkNull_0(txtDiscount.Text)), decimal.Parse(_dc.chkNull_0(txtNetAmount.Text)), drpPrincipal.SelectedItem.Text, dtConfig, IsFinanceSetting);
                ShowReportReturnPopUp(1);
                if (mResult)
                {
                }
                return mResult;
            }
        }
        else if (DrpDocumentType.SelectedIndex == 3)           // Damage
        {
            if (drpDocumentNo.SelectedItem.Value.ToString() == Constants.LongNullValue.ToString())
            {
                mResult = _mPurchaseCtrl.InsertPurchaseDocument(int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
               , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()),
               0, dtConfig, IsFinanceSetting, Constants.LongNullValue);
                ShowDamagePopUp(0);
                return mResult;
            }
            else
            {
                mResult = _mPurchaseCtrl.UpdatePurchaseDocument(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
               , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()),
               0, dtConfig, IsFinanceSetting, Constants.LongNullValue);
                ShowDamagePopUp(1);
                return mResult;
            }
        }
        else// Production In
        {
            if (drpDocumentNo.SelectedItem.Value.ToString() == Constants.LongNullValue.ToString())
            {
                mResult = _mPurchaseCtrl.InsertPurchaseDocument(int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
               , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()),
               0, dtConfig, IsFinanceSetting, Constants.LongNullValue);
                ShowProductionPopUp(0);
                return mResult;
            }
            else
            {
                mResult = _mPurchaseCtrl.UpdatePurchaseDocument(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString()), txtDocumentNo.Text, int.Parse(DrpDocumentType.SelectedItem.Value.ToString())
               , mWorkDate, int.Parse(drpDistributorID.SelectedItem.Value.ToString()), int.Parse(drpDistributorID.SelectedItem.Value.ToString())
               , mTotalAmount, false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()),
               0, dtConfig, IsFinanceSetting, Constants.LongNullValue);
                ShowProductionPopUp(1);
                return mResult;
            }
        }
    }

    private decimal CheckStockStatus(int skuId)
    {
        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributorID.Value.ToString())
            {
                if (dr["MaxDayClose"].ToString().Length > 0)
                {
                    CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                    break;
                }
            }
        }
        if (CurrentWorkDate != Constants.DateNullValue)
        {
            if (DrpDocumentType.SelectedIndex == 0 || DrpDocumentType.SelectedItem.Value.ToString() == "20")
            {
                return -1;
            }
            else
            {
                var mController = new PhaysicalStockController();
                DataTable dt = mController.SelectSKUClosingStock2(int.Parse(drpDistributorID.SelectedItem.Value.ToString()), skuId, "N/A", CurrentWorkDate, 15);
                if (dt.Rows.Count > 0)
                {
                    if (decimal.Parse(dt.Rows[0][0].ToString()) + Convert.ToDecimal(_privouseQty.Value) >= decimal.Parse(txtQuantity.Text))
                    {
                        return -1;
                    }
                    else
                    {
                        return decimal.Parse(dt.Rows[0][0].ToString()) + Convert.ToDecimal(_privouseQty.Value);
                    }
                }
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dayclose not found for selected location!');", true);
            return 0;
        }
        return 0;
    }

    private void DisAbaleOption(bool IsDisable)
    {
        if (IsDisable == true)
        {
            DrpDocumentType.Enabled = false;
            drpDistributorID.Enabled = false;
            drpDocumentNo.Enabled = false;
        }
        else
        {
            DrpDocumentType.Enabled = true;
            drpDistributorID.Enabled = true;
            drpDocumentNo.Enabled = true;
            drpDocumentNo.SelectedIndex = 0;
        }
    }

    private void ClearAll()
    {
        if (cbScan.Checked)
        {
            txtQuantity.Text = "1";
        }
        else
        {
            txtQuantity.Text = "";
        }
        ddlSkus.Enabled = true;
        txtPrice.Text = "";
        txtSKUCode.Text = "";
        txtBonus.Text = "";
        txtAmount.Text = "0";
        txtItemGST.Text = "0";
        txtItemDiscount.Text = "0";
        btnAdd.Text = "Add";
        _privouseQty.Value = "0";
        txtNetAmount.Text = "0";
        txtItemRemarks.Text = "";
    }

    private bool IsDayClosed()
    {
        DistributorController DistrCtl = new DistributorController();
        try
        {
            DataTable dtDayClose = DistrCtl.MaxDayClose(Convert.ToInt32(Session["DISTRIBUTOR_ID"]), 3);
            if (dtDayClose.Rows.Count > 0)
            {
                if (Convert.ToDateTime(Session["CurrentWorkDate"]) == Convert.ToDateTime(dtDayClose.Rows[0]["DayClose"]))
                {
                    return false;
                }
            }
            return true;
        }
        catch (Exception)
        {

            throw;
        }
    }

    public void ShowReportPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();
        CORNBusinessLayer.Reports.CrpPurchaseDocument CrpReport = new CORNBusinessLayer.Reports.CrpPurchaseDocument();
        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 2);
        }
        else
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp(Constants.IntNullValue, 1);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Purchase Document");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        Session.Add("CrpReport", CrpReport);
        Session.Add("ReportType", 0);
        const string url = "'Default.aspx'";
        const string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }
    public void ShowReportPopUp2(long type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();
        CrystalDecisions.CrystalReports.Engine.ReportDocument CrpReport = new CrystalDecisions.CrystalReports.Engine.ReportDocument();
        if (DrpDocumentType.SelectedIndex == 0)
        {
            CrpReport = new CORNBusinessLayer.Reports.CrpPurchaseDocument2();
        }
        else
        {
            CrpReport = new CORNBusinessLayer.Reports.CrpPurchaseDocument();
        }
        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        DataSet ds = null;
        if (type == 1)
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 2);
        }
        else
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp2(type, 7);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Purchase Document");
        //CrpReport.SetParameterValue("Principal", drpPrincipal.SelectedItem.Text);
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        Session.Add("CrpReport", CrpReport);
        Session.Add("ReportType", 0);
        const string url = "'Default.aspx'";
        const string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }
    public void ShowReportReturnPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();
        CORNBusinessLayer.Reports.CrpPurchaseDocument CrpReport = new CORNBusinessLayer.Reports.CrpPurchaseDocument();
        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 2);
        }
        else
        {
            ds = RptInventoryCtl.SelectPurchaseDocumentPopUp(Constants.IntNullValue, 1);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Purchase Return Document");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        Session.Add("CrpReport", CrpReport);
        Session.Add("ReportType", 0);
        const string url = "'Default.aspx'";
        const string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }
    public void ShowTransferOutPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();

        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        CrpTransferDocument CrpReport = new CrpTransferDocument();
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 3);
        }
        else
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(Constants.IntNullValue, 4);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Transfer Out Document");
        CrpReport.SetParameterValue("Principal", "");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        this.Session.Add("CrpReport", CrpReport);
        this.Session.Add("ReportType", 0);
        string url = "'Default.aspx'";
        string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }

    public void ShowDamagePopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();

        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        CrpDamageDocument CrpReport = new CrpDamageDocument();
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 5);
        }
        else
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(Constants.IntNullValue, 6);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Damage Document");
        CrpReport.SetParameterValue("Principal", "");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        this.Session.Add("CrpReport", CrpReport);
        this.Session.Add("ReportType", 0);
        string url = "'Default.aspx'";
        string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }

    public void ShowProductionPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();

        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributorID.SelectedItem.Value.ToString()));
        CrpDamageDocument CrpReport = new CrpDamageDocument();
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), 5);
        }
        else
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(Constants.IntNullValue, 6);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Production In Document");
        CrpReport.SetParameterValue("Principal", "");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        this.Session.Add("CrpReport", CrpReport);
        this.Session.Add("ReportType", 0);
        string url = "'Default.aspx'";
        string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }

    protected void cbScan_CheckedChanged(object sender, EventArgs e)
    {
        if (cbScan.Checked)
        {
            ddlSkus.Visible = false;
            txtSKUCode.Visible = true;            
            GrdPurchase.Columns[9].Visible = false;
            txtQuantity.Text = "1";
            txtSKUCode.Focus();
        }
        else
        {
            ddlSkus.Visible = true;
            txtSKUCode.Visible = false;
            GrdPurchase.Columns[9].Visible = true;
            ddlSkus.Focus();
        }
    }

    public void GetAppSettingDetail()
    {
        try
        {
            AppSettingDetail _cController = new AppSettingDetail();
            DataTable dtAppSetting = _cController.GetAppSettingDetail(1);
            if (dtAppSetting.Rows.Count > 0)
            {
                Session.Add("dtAppSettingDetail", dtAppSetting);
            }
        }
        catch (Exception ex)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + ex + "');", true);
        }
    }
}