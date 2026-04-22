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
using System.IO.Ports;
using DevExpress.Web;
using System.Drawing;

/// <summary>
/// From For Purchase, TranferOut, Purchase Return, TranferIn And Damage
/// </summary>
public partial class Forms_frmGRN : System.Web.UI.Page
{
    readonly DataControl _dc = new DataControl();
    readonly PurchaseController _mPurchaseCtrl = new PurchaseController();
    readonly SKUPriceDetailController _pController = new SKUPriceDetailController();
    DataTable _purchaseSkus;


    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            Session.Remove("dtGridData");
            GetAppSettingDetail();
            GSTSetting();
            LoadPrincipal();
            LoadLocations();
            LoadSkuDetail();
            LoadPurchase();
            ddlLocation.Focus();
            LoadGridData();
            LoadLookupGrid("");
            mPopUpLocation.Hide();
            CreatTable();
            if(Session["ItemWiseGSTOnPurchase"].ToString() == "1")
            {
                txtGstAmount.Enabled = false;
                txtDiscount.Enabled = false;
            }

            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == ddlLocation.Value.ToString())
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }

            foreach (GridViewRow row in GridViewPurchase.Rows)
            {
                TextBox dateTextBox = row.FindControl("txtExpiryDate") as TextBox;
                if (dateTextBox != null)
                {
                    if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
                    {
                        dateTextBox.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
                    }
                    dateTextBox.Attributes.Add("readonly", "readonly");
                }
            }
        }
    }

    private void GSTSetting()
    {
        txtGstAmount.Enabled = false;
        DataTable dt = (DataTable)Session["dtAppSettingDetail"];
        if (dt.Rows.Count > 0)
        {
            if (dt.Rows[0]["PurchaseGSTType"].ToString() == "2")
            {
                txtGstAmount.Enabled = true;
            }
        }
    }

    #region Load
    private void LoadLocations()
    {
        DistributorController DController = new DistributorController();
        DataTable dt = DController.GetDistributorWithMaxDayClose(Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), int.Parse(this.Session["CompanyId"].ToString()), 1);

        clsWebFormUtil.FillDxComboBoxList(ddlLocation, dt, "DISTRIBUTOR_ID", "DISTRIBUTOR_NAME");

        if (dt.Rows.Count > 0)
        {
            ddlLocation.SelectedIndex = 0;
        }

        Session.Add("dtLocationInfo", dt);
    }
    private void LoadPrincipal()
    {
        DataTable mDt = _pController.SelectDataPrice(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, int.Parse(Session["UserId"].ToString()), Constants.IntNullValue, 4, Constants.DateNullValue);
        clsWebFormUtil.FillDxComboBoxList(ddlSupplier, mDt, 0, 1, true);

        if (mDt.Rows.Count > 0)
        {
            ddlSupplier.SelectedIndex = 0;
        }
    }
    private void LoadPurchase()
    {
        if (ddlSupplier.SelectedIndex > -1)
        {
            bool IsGRNComplete = true;
            DataTable dtPur = new DataTable();
            dtPur.Columns.Add("ID", typeof(long));
            DataTable dt = _mPurchaseCtrl.SelectSupllierPurchases(Convert.ToInt32(ddlSupplier.SelectedItem.Value),Convert.ToInt32(_dc.chkNull_0(ddlLocation.SelectedItem.Value.ToString())));
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    IsGRNComplete = true;
                    var purchaseController = new PurchaseController();
                    DataTable dtPurDetail = purchaseController.getPurchaseOrderDetail(Convert.ToInt64(dr["ID"]));
                    foreach (DataRow item in dtPurDetail.Rows)
                    {
                        if (decimal.Parse(_dc.chkNull_0(item["QUANTITY"].ToString())) > 0)
                        {
                            DataRow drPur = dtPur.NewRow();
                            drPur["ID"] = Convert.ToInt64(dr["ID"]);
                            dtPur.Rows.Add(drPur);
                            IsGRNComplete = false;
                            break;
                        }
                    }
                    if(IsGRNComplete)
                    {
                        purchaseController.UpdateGRNCompleted(Convert.ToInt64(dr["ID"]));
                    }
                }
            }

            clsWebFormUtil.FillDxComboBoxList(ddlPurchase, dtPur, "ID", "ID", true);

            if (dtPur.Rows.Count > 0)
            {
                ddlPurchase.SelectedIndex = 0;
                GetPurchaseOrderDetail(Convert.ToInt64(ddlPurchase.SelectedItem.Value));
            }
            else
            {
                ddlPurchase.Items.Clear();
                ddlPurchase.SelectedIndex = -1;
                this.GridViewPurchase.DataSource = null;
                GridViewPurchase.DataBind();
                CreatTable();
                LoadGird();
                PurchaseOrderInfo.Visible = false;
            }
        }
        else
        {
            ddlPurchase.Items.Clear();
            ddlPurchase.SelectedIndex = -1;
            this.GridViewPurchase.DataSource = null;
            GridViewPurchase.DataBind();
            CreatTable();
            LoadGird();
        }
    }
    private void LoadSkuDetail()
    {
        SkuController SKUCtl = new SkuController();
        hfInventoryType.Value = "0";
        if (ddlLocation.Items.Count > 0)
        {
            DataTable dtskuPrice = SKUCtl.GetSKUInfo(Constants.IntNullValue,Constants.DateNullValue,5);
            if (dtskuPrice.Rows.Count > 0)
            {
                if (dtskuPrice.Rows[0]["IsInventoryWeight"].ToString() != "")
                {
                    if (Convert.ToBoolean(dtskuPrice.Rows[0]["IsInventoryWeight"]))
                    {
                        hfInventoryType.Value = "1";
                    }
                }
            }
            Session.Add("Dtsku_Price", dtskuPrice);
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
        _purchaseSkus.Columns.Add("EnteredQty", typeof(decimal));
        _purchaseSkus.Columns.Add("OrderedQty", typeof(decimal));
        _purchaseSkus.Columns.Add("ReceivedQty", typeof(decimal));
        _purchaseSkus.Columns.Add("AMOUNT", typeof(decimal));
        _purchaseSkus.Columns.Add("UOM_ID", typeof(int));
        _purchaseSkus.Columns.Add("S_UOM_ID", typeof(int));
        _purchaseSkus.Columns.Add("S_Quantity", typeof(decimal));
        _purchaseSkus.Columns.Add("DiscountPercentage", typeof(decimal));
        _purchaseSkus.Columns.Add("TaxPercentage", typeof(decimal));
        _purchaseSkus.Columns.Add("Expiry_Date", typeof(string));
        Session.Add("PurchaseSKUS", _purchaseSkus);

    }
    #endregion

    protected void GrdPurchase_RowEditing(object sender, GridViewEditEventArgs e)
    {
        mPopUpLocation.Show();
        _rowNo.Value = e.NewEditIndex.ToString();
        PurchaseMasterID.Value = Grid_users.Rows[e.NewEditIndex].Cells[1].Text;
        ddlLocation.Value = Grid_users.Rows[e.NewEditIndex].Cells[2].Text;
        ddlSupplier.Value = Grid_users.Rows[e.NewEditIndex].Cells[4].Text;
        ddlPurchase.Value = Grid_users.Rows[e.NewEditIndex].Cells[6].Text;
        ddlPaymentMode.Value = Grid_users.Rows[e.NewEditIndex].Cells[7].Text;
        txtRemarks.Text = Grid_users.Rows[e.NewEditIndex].Cells[10].Text.Replace("&nbsp;", "");
        txtFreight.Text = Grid_users.Rows[e.NewEditIndex].Cells[11].Text;
        txtDocumentNo.Text = Grid_users.Rows[e.NewEditIndex].Cells[16].Text.Replace("&nbsp;", "");
        txtAdvanceTax.Text = Grid_users.Rows[e.NewEditIndex].Cells[17].Text;
        GetPurchaseDetailForUpdate(Convert.ToInt64(ddlPurchase.Value), Convert.ToInt32(PurchaseMasterID.Value));
        btnSave_Document.Text = "Update";
        Document_Date.Value = Grid_users.Rows[e.NewEditIndex].Cells[15].Text;
    }

    public void GetPurchaseOrderDetail(long purchaseOrderMaster_ID)
    {
        CreatTable();

        var purchaseController = new PurchaseController();
        var purchaseDetail = purchaseController.getPurchaseOrderDetail(purchaseOrderMaster_ID);
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
        if (purchaseDetail.Rows.Count > 0)
        {
            DataTable purchaseOrderMasterDetail = purchaseController.SelectPuchaseOrder(
                Convert.ToInt32(ddlLocation.Value), Convert.ToInt32(ddlSupplier.Value), Convert.ToInt32(Session["UserID"]),1);
            var purchaseMasterSelectedDetail = purchaseOrderMasterDetail.Select("ID  = '" + purchaseOrderMaster_ID.ToString() + "'");
            if (purchaseMasterSelectedDetail != null && purchaseMasterSelectedDetail.Length > 0)
            {
                deliveryDate.InnerText = purchaseMasterSelectedDetail[0]["Delivery_Date"].ToString();
                expiryDate.InnerText = purchaseMasterSelectedDetail[0]["Expiry_Date"].ToString();
                ddlPaymentMode.Value = purchaseMasterSelectedDetail[0]["Payment_Mode"].ToString();
                PurchaseOrderInfo.Visible = true;
            }
            else
            {
                PurchaseOrderInfo.Visible = false;
            }
            foreach (DataRow item in purchaseDetail.Rows)
            {
                DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + item["SKU_ID"].ToString() + "'");
                if (foundRows.Length > 0)
                {
                    if (decimal.Parse(_dc.chkNull_0(item["QUANTITY"].ToString())) > 0)
                    {
                        DataRow dr = _purchaseSkus.NewRow();
                        dr["SKU_ID"] = Convert.ToInt32(item["SKU_ID"].ToString());
                        dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                        dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                        dr["UOM_ID"] = Convert.ToInt32(item["UOM_ID"].ToString());

                        dr["Quantity"] = decimal.Parse(item["QUANTITY"].ToString());
                        dr["EnteredQty"] = decimal.Parse(item["QUANTITY"].ToString());
                        dr["OrderedQty"] = decimal.Parse(item["OrderedQty"].ToString());
                        dr["ReceivedQty"] = decimal.Parse(item["ReceivedQty"].ToString());

                        dr["S_UOM_ID"] = foundRows[0]["S_UOM_ID"];
                        dr["UOM_DESC"] = item["UOM_DESC"].ToString();
                        dr["DiscountPercentage"] = decimal.Parse(item["Discount_Percentage"].ToString());
                        dr["TaxPercentage"] = decimal.Parse(item["Tax_Percentage"].ToString());
                        if (decimal.Parse(_dc.chkNull_0(foundRows[0]["UOM_ID"].ToString())) != decimal.Parse(_dc.chkNull_0(foundRows[0]["S_UOM_ID"].ToString())))
                        {
                            dr["S_Quantity"] = DataControl.QuantityConversion(Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["DEFAULT_QTY"].ToString())),
                                foundRows[0]["PS_OPERATOR"].ToString(),
                                Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["PS_FACTOR"].ToString())),
                                decimal.Parse(item["QUANTITY"].ToString()),
                            Constants.DecimalNullValue, "");
                        }
                        else
                        {
                            dr["S_Quantity"] = decimal.Parse(item["QUANTITY"].ToString());
                        }
                        dr["PRICE"] = decimal.Parse(item["PRICE"].ToString());
                        dr["AMOUNT"] = decimal.Parse(item["AMOUNT"].ToString());
                        dr["Expiry_Date"] = "";
                        _purchaseSkus.Rows.Add(dr);
                    }
                }
            }
        }
        else
        {
            PurchaseOrderInfo.Visible = false;
        }
        LoadGird();
    }

    public void GetPurchaseDetailForUpdate(long purchase_Master_Id, int purchaseId)
    {
        CreatTable();
        var purchaseController = new PurchaseController();
        var purchaseDetail = purchaseController.SelectPurchaseDetail(Constants.IntNullValue, purchaseId);
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];
        if (purchaseDetail.Rows.Count > 0)
        {
            DataTable purchaseOrderMasterDetail = purchaseController.SelectPuchaseOrder(
                Convert.ToInt32(ddlLocation.Value), Convert.ToInt32(ddlSupplier.Value), Convert.ToInt32(Session["UserID"]),1);
            var purchaseMasterSelectedDetail = purchaseOrderMasterDetail.Select("ID  = '" + purchase_Master_Id.ToString() + "'");
            if (purchaseMasterSelectedDetail != null && purchaseMasterSelectedDetail.Length > 0)
            {
                deliveryDate.InnerText = purchaseMasterSelectedDetail[0]["Delivery_Date"].ToString();
                expiryDate.InnerText = purchaseMasterSelectedDetail[0]["Expiry_Date"].ToString();
                PurchaseOrderInfo.Visible = true;
            }
            else
            {
                PurchaseOrderInfo.Visible = false;
            }
            var purchaseOrderDetail = purchaseController.getPurchaseOrderDetail(purchase_Master_Id);
            foreach (DataRow item in purchaseDetail.Rows)
            {
                DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + item["SKU_ID"].ToString() + "'");
                if (foundRows.Length > 0)
                {
                    DataRow dr = _purchaseSkus.NewRow();
                    dr["SKU_ID"] = Convert.ToInt32(item["SKU_ID"].ToString());
                    dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                    dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                    dr["UOM_ID"] = Convert.ToInt32(item["UOM_ID"].ToString());
                    dr["S_UOM_ID"] = foundRows[0]["S_UOM_ID"];
                    dr["UOM_DESC"] = item["UOM_DESC"].ToString();
                    //during saving the record entered qty
                    dr["EnteredQty"] = decimal.Parse(item["QUANTITY"].ToString());
                    DataRow[] dr1 = purchaseOrderDetail.Select("SKU_ID = '" + Convert.ToInt32(item["SKU_ID"].ToString()) + "'");
                    if (dr1.Length > 0)
                    {
                        dr["QUANTITY"] = decimal.Parse(dr1[0]["QUANTITY"].ToString()) + decimal.Parse(_dc.chkNull_0(dr["EnteredQty"].ToString()));
                        dr["EnteredQty"] = item["QUANTITY"];
                        dr["DiscountPercentage"] = item["DISCOUNT"];
                        dr["TaxPercentage"] = item["TAX"];
                        dr["OrderedQty"] = decimal.Parse(_dc.chkNull_0(dr1[0]["OrderedQty"].ToString()));
                        dr["ReceivedQty"] = decimal.Parse(_dc.chkNull_0(dr1[0]["ReceivedQty"].ToString())) - Convert.ToDecimal(item["QUANTITY"]);
                    }
                    if (decimal.Parse(_dc.chkNull_0(foundRows[0]["UOM_ID"].ToString())) != decimal.Parse(_dc.chkNull_0(foundRows[0]["S_UOM_ID"].ToString())))
                    {
                        dr["S_Quantity"] = DataControl.QuantityConversion(Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["DEFAULT_QTY"].ToString())),foundRows[0]["PS_OPERATOR"].ToString(),Convert.ToDecimal(_dc.chkNull_0(foundRows[0]["PS_FACTOR"].ToString())),decimal.Parse(item["QUANTITY"].ToString()),Constants.DecimalNullValue, "");
                    }
                    else
                    {
                        dr["S_Quantity"] = decimal.Parse(item["QUANTITY"].ToString());
                    }
                    dr["PRICE"] = decimal.Parse(item["PRICE"].ToString());
                    dr["AMOUNT"] = decimal.Parse(item["AMOUNT"].ToString());
                    dr["Expiry_Date"] = item["Expiry_Date"].ToString();
                    _purchaseSkus.Rows.Add(dr);
                }
            }
        }
        else
        {
            PurchaseOrderInfo.Visible = false;
        }
        LoadGird();
    }
    private void LoadGridData()
    {
        if (ddlLocation.Items.Count > 0)
        {
            DataTable dt = new DataTable();
            DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
            var purchaseController = new PurchaseController();
            dt = purchaseController.SelectGRN(Convert.ToInt32(Session["UserID"]), Constants.IntNullValue, currentWorkDate);
            Session.Add("dtGridData", dt);
        }
    }
    protected void LoadLookupGrid(string Type)
    {
        Grid_users.DataSource = null;
        Grid_users.DataBind();
        DataTable dt = (DataTable)Session["dtGridData"];
        if (Type == "")
        {
            if (txtSearch.Text != "" || txtSearch.Text != string.Empty)
            {
                dt.DefaultView.RowFilter = "DISTRIBUTOR_NAME LIKE '%" + txtSearch.Text + "%' OR SKU_HIE_NAME LIKE '%" + txtSearch.Text + "%' OR Convert(PURCHASE_MASTER_ID, System.String) LIKE '" + txtSearch.Text + "%' OR Convert(Purchase_Order_Master_ID, System.String) LIKE '" + txtSearch.Text + "'";
            }
            else
            {
                dt.DefaultView.RowFilter = "Purchase_Order_Master_ID > 0";
            }
        }
        Grid_users.DataSource = dt;
        Grid_users.DataBind();
    }

    protected void Grid_users_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        Grid_users.PageIndex = e.NewPageIndex;
        LoadLookupGrid("IndexChanged");
    }
    //#endregion

    //#region Click OPerations

    protected void btnFilter_Click(object sender, EventArgs e)
    {
        LoadLookupGrid("");
    }

    protected void btnSaveDocument_Click(object sender, EventArgs e)
    {
        try
        {
            mPopUpLocation.Show();
            if (Page.IsValid)
            {
                long PurchaseID = Constants.LongNullValue;
                bool updated = false;

                if (GridViewPurchase.Rows.Count > 0)
                {
                    var mDayClose = new DistributorController();
                    DataTable dt = mDayClose.SelectMaxDayClose(Constants.IntNullValue,Convert.ToInt32(ddlLocation.SelectedItem.Value));
                    if (dt.Rows.Count > 0)
                    {
                        //adding gridview rows to datatbale.
                        DataTable dt1 = new DataTable();
                        for (int i = 0; i < GridViewPurchase.Columns.Count; i++)
                        {
                            dt1.Columns.Add(i.ToString());
                        }
                        foreach (GridViewRow row in GridViewPurchase.Rows)
                        {
                            decimal amount = 0;
                            decimal price = 0;
                            decimal discount = 0;
                            decimal tax = 0;
                            DateTime expiryDate = Constants.DateNullValue;
                            DataRow dr = dt1.NewRow();
                            for (int j = 0; j < GridViewPurchase.Columns.Count; j++)
                            {
                                if (j == 7)
                                {
                                    TextBox T = (TextBox)row.FindControl("txtQty");
                                    TextBox P = (TextBox)row.FindControl("txtPrice");
                                    TextBox D = (TextBox)row.FindControl("txtDisc");
                                    TextBox Tx = (TextBox)row.FindControl("txtTax");
                                    TextBox txtExpiry = (TextBox)row.FindControl("txtExpiryDate");

                                    dr[j.ToString()] = T.Text;
                                    price = Convert.ToDecimal(_dc.chkNull_0(P.Text));
                                    amount = Convert.ToDecimal(_dc.chkNull_0(T.Text)) * price;
                                    discount = Convert.ToDecimal(_dc.chkNull_0(D.Text));
                                    tax = Convert.ToDecimal(_dc.chkNull_0(Tx.Text));
                                    expiryDate = Convert.ToDateTime(txtExpiry.Text);
                                    var netAmount = amount - discount;
                                    tax = netAmount * (tax / 100);
                                }
                                else if (j == 8)
                                {
                                    dr[j.ToString()] = price;
                                }
                                else if (j == 9)
                                {
                                    dr[j.ToString()] = discount;
                                }
                                else if (j == 10)
                                {
                                    dr[j.ToString()] = tax;
                                }
                                else if (j == 11)
                                {
                                    dr[j.ToString()] = amount;
                                }
                                else if (j == 14)
                                {
                                    dr[j.ToString()] = expiryDate;
                                }
                                else
                                {
                                    dr[j.ToString()] = row.Cells[j].Text;
                                }
                            }

                            dt1.Rows.Add(dr);
                        }

                        if (ValidateForm(dt1))
                        {
                            DateTime mWorkDate = DateTime.Parse(dt.Rows[0]["CLOSING_DATE"].ToString());

                            DataTable dtConfig = GetCOAConfiguration();
                            bool IsFinanceSetting = GetFinanceConfig();

                            DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                            var purchaseController = new PurchaseController();
                            if (btnSave_Document.Text == "Save")
                            {
                                PurchaseID = _mPurchaseCtrl.InsertGRNForPurchaseOrder(
                                    int.Parse(ddlLocation.SelectedItem.Value.ToString()),
                                    txtDocumentNo.Text, 2, mWorkDate,
                                    int.Parse(ddlLocation.SelectedItem.Value.ToString()),
                                    int.Parse(ddlSupplier.SelectedItem.Value.ToString()),
                                    Convert.ToDecimal(_dc.chkNull_0(txtTotalAmount.Text)),
                                    false, dt1, 0, "", int.Parse(Session["UserId"].ToString()),
                                    int.Parse(ddlSupplier.SelectedItem.Value.ToString()),
                                    decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)),
                                    decimal.Parse(_dc.chkNull_0(txtDiscount.Text)),
                                    Convert.ToDecimal(_dc.chkNull_0(txtNetAmount.Text)),
                                    ddlSupplier.SelectedItem.Text,
                                    Convert.ToInt32(ddlPaymentMode.SelectedItem.Value),
                                    long.Parse(ddlPurchase.SelectedItem.Value.ToString()),
                                    Convert.ToDecimal(_dc.chkNull_0(txtFreight.Text)),
                                    txtRemarks.Text,
                                    Convert.ToDecimal(_dc.chkNull_0(txtAdvanceTax.Text)),
                                    dtConfig, IsFinanceSetting);
                            }
                            else if (btnSave_Document.Text == "Update")
                            {
                                if (Document_Date.Value == "")
                                {
                                    Document_Date.Value = currentWorkDate.ToString();
                                }
                                updated = _mPurchaseCtrl.UpdateGRN(long.Parse(PurchaseMasterID.Value),int.Parse(ddlLocation.SelectedItem.Value.ToString()), txtDocumentNo.Text, 2, mWorkDate, int.Parse(ddlLocation.SelectedItem.Value.ToString()),int.Parse(ddlSupplier.SelectedItem.Value.ToString()), Convert.ToDecimal(_dc.chkNull_0(txtTotalAmount.Text)), false,dt1, 0, "", int.Parse(Session["UserId"].ToString()),int.Parse(ddlSupplier.SelectedItem.Value.ToString()), decimal.Parse(_dc.chkNull_0(txtGstAmount.Text)),decimal.Parse(_dc.chkNull_0(txtDiscount.Text)),Convert.ToDecimal(_dc.chkNull_0(txtNetAmount.Text)),ddlSupplier.SelectedItem.Text, Convert.ToInt32(ddlPaymentMode.SelectedItem.Value),long.Parse(ddlPurchase.Value.ToString()), Convert.ToDecimal(_dc.chkNull_0(txtFreight.Text)),txtRemarks.Text, Convert.ToDecimal(_dc.chkNull_0(txtAdvanceTax.Text)), dtConfig, IsFinanceSetting);
                            }

                            if (PurchaseID > 0 || updated == true)
                            {
                                mPopUpLocation.Hide();
                                ClearAll();
                                CreatTable();
                                txtRemarks.Text = "";
                                txtFreight.Text = "";
                                txtDocumentNo.Text = "";
                                LoadGird();
                                LoadGridData();
                                LoadLookupGrid("");
                                LoadLocations();
                                LoadPrincipal();
                                LoadPurchase();
                                btnSave_Document.Text = "Save";
                                ScriptManager.RegisterStartupScript(this, typeof(Page), "Alert", "alert('Record added successfully.');", true);
                            }
                            if (PurchaseID > 0)
                                ShowReportPopUp(PurchaseID);
                            else
                                ShowReportPopUp(long.Parse(PurchaseMasterID.Value));
                        }
                        else
                        {
                            ScriptManager.RegisterStartupScript(this, typeof(Page), "Alert", "alert('Entered Qty cannot be greater than Pending Qty');", true);
                        }
                    }
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "Alert", "alert('Please add Item Details');", true);
                }
            }
            else
            {
                mPopUpLocation.Show();
                //LoadApprovalBy();
            }
        }

        catch (Exception ex)
        {
            ExceptionPublisher.PublishException(ex);
            ScriptManager.RegisterStartupScript(this, typeof(Page), "CatchMsg", "alert('" + ex.Message.ToString() + "')", true);
            mPopUpLocation.Show();
        }
    }

    public void ShowReportPopUp(long p_purchaseID)
    {
        try
        {
            DocumentPrintController mController = new DocumentPrintController();
            var purchaseController = new PurchaseController();
            CrpPurchaseGRN CrpReport = new CrpPurchaseGRN();
            DataTable dt = mController.SelectReportTitle(int.Parse(ddlLocation.SelectedItem.Value.ToString()));
            DataSet ds = purchaseController.SelectGRNReport(p_purchaseID);

            CrpReport.SetDataSource(ds);
            CrpReport.Refresh();

            CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
            CrpReport.SetParameterValue("ReportName", "RECEIPT NOTE");
            CrpReport.SetParameterValue("Location", ddlLocation.SelectedItem.Text);

            Session.Add("CrpReport", CrpReport);
            Session.Add("ReportType", 0);
            const string url = "'Default.aspx'";
           ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "openpage", "window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");", true);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public bool ValidateForm(DataTable dt)
    {
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                var enteredQty = decimal.Parse(dr[7].ToString());
                var qty = decimal.Parse(dr[6].ToString());

                if (enteredQty > qty)
                {
                    return false;
                }
            }
        }
        return true;
    }

    protected void btnClose_Click(object sender, EventArgs e)
    {
        btnSave_Document.Text = "Save";
        mPopUpLocation.Hide();
        ClearAll();
        CreatTable();
        txtRemarks.Text = "";
        txtFreight.Text = "";
        txtDocumentNo.Text = "";
        LoadGird();
        PurchaseOrderInfo.Visible = false;
        LoadGridData();
        LoadLookupGrid("");
        LoadLocations();
        LoadPrincipal();
        LoadPurchase();
    }
    protected void btnAdd_Click(object sender, EventArgs e)
    {
        mPopUpLocation.Show();
        PurchaseOrderInfo.Visible = false;
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        //LoadGird();
        ClearAll();
    }
    
    #region Grid Operations

    private void LoadGird()
    {
        _purchaseSkus = (DataTable)Session["PurchaseSKUS"];

        decimal totalQty = 0;
        decimal totalGrossAmount = 0;
        decimal totalDiscountAmount = 0;
        decimal totalTaxAmount = 0;
        decimal totalFreighAmount = Convert.ToDecimal(_dc.chkNull_0(txtFreight.Text));
        decimal grandTotal = 0;

        if (_purchaseSkus != null)
        {
            GridViewPurchase.DataSource = _purchaseSkus;
            GridViewPurchase.DataBind();
            foreach (DataRow item in _purchaseSkus.Rows)
            {
                var qty = item["EnteredQty"].ToString();
                var price = item["PRICE"].ToString();
                var discountPercent = item["DiscountPercentage"].ToString();
                var taxPercent = item["TaxPercentage"].ToString();

                if (qty == null || qty == "")
                {
                    qty = "0";
                }
                if (price == null || price == "")
                {
                    price = "0";
                }
                if (discountPercent == null || discountPercent == "")
                {
                    discountPercent = "0";
                }
                if (taxPercent == null || taxPercent == "")
                {
                    taxPercent = "0";
                }

                totalQty = Convert.ToDecimal(totalQty) + Convert.ToDecimal(qty);
                var grossAmount = Convert.ToDecimal(qty) * Convert.ToDecimal(price);
                totalGrossAmount = totalGrossAmount + grossAmount;
                var discountAmount = grossAmount * (Convert.ToDecimal(discountPercent) / 100);
                totalDiscountAmount = totalDiscountAmount + discountAmount;
                var amountAfterDiscount = grossAmount - discountAmount;
                var taxAmount = amountAfterDiscount * (Convert.ToDecimal(taxPercent) / 100);
                totalTaxAmount = totalTaxAmount + taxAmount;
                var amountAfterTax = amountAfterDiscount + taxAmount;
                grandTotal = grandTotal + amountAfterTax;
            }
            for (int i = 0; i < _purchaseSkus.Rows.Count; i++)
            {
                decimal qty = decimal.Parse(_dc.chkNull_0(_purchaseSkus.Rows[i]["EnteredQty"].ToString()));
                TextBox T = (TextBox)GridViewPurchase.Rows[i].Cells[13].FindControl("rownetAmount");
                decimal amount = decimal.Parse(_dc.chkNull_0(_purchaseSkus.Rows[i]["AMOUNT"].ToString()));
                T.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", amount);

                TextBox expiry = (TextBox)GridViewPurchase.Rows[i].Cells[14].FindControl("txtExpiryDate");
                expiry.Text = _purchaseSkus.Rows[i]["Expiry_Date"].ToString();

            }
        }

        txtGstAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalTaxAmount);
        txtDiscount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalDiscountAmount);
        txtTotalQuantity.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalQty);
        txtTotalAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", totalGrossAmount);
        txtNetAmount.Text = String.Format(CultureInfo.InvariantCulture, "{0:0.00}", grandTotal + totalFreighAmount + decimal.Parse(_dc.chkNull_0(txtAdvanceTax.Text)));        
    }

    #endregion
    private void ClearAll()
    {

    }
    protected void ddlSupplier_SelectedIndexChanged(object sender, EventArgs e)
    {
        mPopUpLocation.Show();
        LoadPurchase();

        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == ddlLocation.Value.ToString())
            {
                if (dr["MaxDayClose"].ToString().Length > 0)
                {
                    CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                    break;
                }
            }
        }

        foreach (GridViewRow row in GridViewPurchase.Rows)
        {
            TextBox dateTextBox = row.FindControl("txtExpiryDate") as TextBox;
            if (dateTextBox != null)
            {
                if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
                {
                    dateTextBox.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
                }
            }
        }
    }
    protected void ddlPurchase_SelectedIndexChanged(object sender, EventArgs e)
    {
        mPopUpLocation.Show();
        if (ddlPurchase.SelectedIndex > -1)
        {
            GetPurchaseOrderDetail(Convert.ToInt64(ddlPurchase.SelectedItem.Value));

            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == ddlLocation.Value.ToString())
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }

            foreach (GridViewRow row in GridViewPurchase.Rows)
            {
                TextBox dateTextBox = row.FindControl("txtExpiryDate") as TextBox;
                if (dateTextBox != null)
                {
                    if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
                    {
                        dateTextBox.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
                    }
                }
            }
        }
    }
    protected void ddlLocation_SelectedIndexChanged(object sender, EventArgs e)
    {
        mPopUpLocation.Show();
        LoadPurchase();

        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == ddlLocation.Value.ToString())
            {
                if (dr["MaxDayClose"].ToString().Length > 0)
                {
                    CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                    break;
                }
            }
        }

        foreach (GridViewRow row in GridViewPurchase.Rows)
        {
            TextBox dateTextBox = row.FindControl("txtExpiryDate") as TextBox;
            if (dateTextBox != null)
            {
                if (CurrentWorkDate != null && CurrentWorkDate != Constants.DateNullValue)
                {
                    dateTextBox.Text = CurrentWorkDate.ToString("dd-MMM-yyyy");
                }
            }
        }
    }
    protected void GridViewPurchase_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TextBox qty = (TextBox)e.Row.FindControl("txtQty");
            TextBox price = (TextBox)e.Row.FindControl("txtPrice");
            TextBox txtDisc = (TextBox)e.Row.FindControl("txtDisc");
            TextBox txtTax = (TextBox)e.Row.FindControl("txtTax");
            qty.Attributes.Add("onblur", "javascript:return Calculations(" + qty.ClientID+"," + price.ClientID + ")");
            price.Attributes.Add("onblur", "javascript:return Calculations(" + qty.ClientID + "," + price.ClientID + ")");
            txtDisc.Attributes.Add("onblur", "javascript:return Calculations(" + qty.ClientID + "," + price.ClientID + ")");
            txtTax.Attributes.Add("onblur", "javascript:return Calculations(" + qty.ClientID + "," + price.ClientID + ")");
            if (Session["ItemWiseGSTOnPurchase"].ToString() == "0")
            {
                txtDisc.Enabled = false;
                txtTax.Enabled = false;
            }

            #region App Setting
            DataTable dt = (DataTable)Session["dtAppSettingDetail"];
            if (dt.Rows.Count > 0)
            {
                var canChange = dt.Rows[0]["CanChangeGRNPrice"].ToString();
                if (canChange == "0")
                {
                    price.Enabled = false;
                }
                else
                {
                    price.Enabled = true;
                }
            }
            #endregion
        }
    }
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