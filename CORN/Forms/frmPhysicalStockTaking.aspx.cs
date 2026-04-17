using System;
using System.Data;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;
using System.Web;
using System.IO.Ports;
using CORNBusinessLayer.Reports;
using OfficeOpenXml;
using System.IO;

/// <summary>
/// From To Adjust Stock
/// </summary>
public partial class Forms_frmPhysicalStockTaking : System.Web.UI.Page
{
    readonly SKUPriceDetailController _pController = new SKUPriceDetailController();
    readonly PhaysicalStockController PhyscalStock = new PhaysicalStockController();
    readonly DataControl _dc = new DataControl();
    DataTable _purchaseSku;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
        Response.Cache.SetNoStore();
        Response.AppendHeader("pragma", "no-cache");

        if (!Page.IsPostBack)
        {
            if (Session["EnableAutoStockAdjustment"] != null)
            {
                if (Convert.ToBoolean(Session["EnableAutoStockAdjustment"]) == true)
                {
                    secAuto.Visible = true;
                }
                else
                {
                    secAuto.Visible = false;
                    chkAutoAdjust.Checked = false;
                }
            }
            else
            {
                secAuto.Visible = false;
                chkAutoAdjust.Checked = false;
            }
            this.GetAppSettingDetail();
            LoadGridData();
            LoadLookupGrid("");
            contentBox.Visible = false;
            lookupBox.Visible = true;
            CreatTable();
            LoadDistributor();
            LoadSkuDetail();
        }
    }

    #region Lookup & Buttons
    protected void btnClose_Click(object sender, EventArgs e)
    {
        contentBox.Visible = false;
        lookupBox.Visible = true;
        searchBox.Visible = true;
        searchBtn.Visible = true;
        btnCancel.Visible = false;
        btnSave.Visible = false;
        btnAdd.Visible = true;
        ClearAll();
        CreatTable();
        txtRemarks.Text = "";
        LoadGird();
        drpDistributor.Enabled = true;
        btnSaveDocument.Text = "Save";
        hfPhysical_Stock_ID.Value = "0";
        chkAutoAdjust.Checked = false;
    }
    protected void btnAdd_Click(object sender, EventArgs e)
    {
        contentBox.Visible = true;
        lookupBox.Visible = false;
        searchBox.Visible = false;
        searchBtn.Visible = false;
        btnCancel.Visible = true;
        btnSave.Visible = true;
        btnAdd.Visible = false;
    }
    
    protected void Grid_users_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        Grid_users.PageIndex = e.NewPageIndex;
        LoadLookupGrid("IndexChanged");
    }
    protected void Grid_users_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            // ((LinkButton)e.Row.FindControl("btnEdit")).OnClientClick = "return HideUnhideFields("+e+ "',' " + chkIsTemporaryClosed+ ");";
        }
    }
    protected void Grid_users_RowEditing(object sender, GridViewEditEventArgs e)
    {
        _rowNo.Value = e.NewEditIndex.ToString();
        hfPhysical_Stock_ID.Value = Grid_users.Rows[e.NewEditIndex].Cells[0].Text;
        drpDistributor.Value = Grid_users.Rows[e.NewEditIndex].Cells[1].Text;
        txtRemarks.Text = Grid_users.Rows[e.NewEditIndex].Cells[4].Text;
        LoadDocumentDetail();

        contentBox.Visible = true;
        lookupBox.Visible = false;
        contentBox.Visible = true;
        lookupBox.Visible = false;
        searchBox.Visible = false;
        searchBtn.Visible = false;
        btnCancel.Visible = true;
        btnSave.Visible = true;
        btnAdd.Visible = false;

        secAuto.Visible = false;
        chkAutoAdjust.Checked = false;
        drpDistributor.Enabled = false;
        btnSaveDocument.Text = "Update";
    }
    private void LoadGridData()
    {
        DataTable dt = new DataTable();
        dt = PhyscalStock.SelectPhysicalStock(Convert.ToDateTime(Session["CurrentWorkDate"]),Convert.ToInt32(Session["UserID"]), 2);
        Session.Add("dtGridData", dt);
    }

    protected void LoadLookupGrid(string Type)
    {
        Grid_users.DataSource = null;
        Grid_users.DataBind();

        DataTable dt = (DataTable)Session["dtGridData"];

        if (dt != null && dt.Rows.Count > 0)
        {
            if (Type == "")
            {
                if (txtSearch.Text != "" || txtSearch.Text != string.Empty)
                {
                    dt.DefaultView.RowFilter = "DISTRIBUTOR_NAME LIKE '%" + txtSearch.Text + "%' OR DOCUMENT_DATE LIKE '%" + txtSearch.Text + "%' OR Convert(Physical_Stock_Master_ID, System.String) LIKE '" + txtSearch.Text + "'";
                }
                else
                {
                    dt.DefaultView.RowFilter = "Physical_Stock_Master_ID > 0";
                }
            }
        }
        Grid_users.DataSource = dt;
        Grid_users.DataBind();

    }
    protected void btnFilter_Click(object sender, EventArgs e)
    {
        LoadLookupGrid("");
    }
    protected void Grid_users_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            DataTable dtMaster = (DataTable)this.Session["dtGridData"];

            if (dtMaster.Rows.Count > 0)
            {
                var selectedRow = Grid_users.Rows[e.RowIndex];
                if (PhyscalStock.DeletePhysicalStockTaking(long.Parse(selectedRow.Cells[0].Text), Convert.ToInt32(Session["UserID"])))
                {
                    LoadGridData();
                    LoadLookupGrid("filter");
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Succesfully deleted.')", true);
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Some error occured.')", true);
                }
            }
        }
        catch (Exception)
        {

            throw;
        }
    }
    #endregion
    private void CreatTable()
    {
        _purchaseSku = new DataTable();
        _purchaseSku.Columns.Add("SKU_ID", typeof(int));
        _purchaseSku.Columns.Add("SKU_Code", typeof(string));
        _purchaseSku.Columns.Add("SKU_Name", typeof(string));
        _purchaseSku.Columns.Add("UOM_DESC", typeof(string));
        _purchaseSku.Columns.Add("UNIT_RATE", typeof(decimal));
        _purchaseSku.Columns.Add("Quantity", typeof(decimal));
        _purchaseSku.Columns.Add("DateTime", typeof(DateTime));
        _purchaseSku.Columns.Add("UOM_ID", typeof(int));
        _purchaseSku.Columns.Add("strERPCode", typeof(string));
        Session.Add("PurchaseSKU", _purchaseSku);
    }

    private void LoadDistributor()
    {
        DistributorController DController = new DistributorController();
        DataTable dt = DController.GetDistributorWithMaxDayClose(Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), int.Parse(this.Session["CompanyId"].ToString()), 1);
        clsWebFormUtil.FillDxComboBoxList(drpDistributor, dt, "DISTRIBUTOR_ID", "DISTRIBUTOR_NAME");

        if (dt.Rows.Count > 0)
        {
            drpDistributor.SelectedIndex = 0;
        }
        Session.Add("dtLocationInfo", dt);
    }

    protected void drpDistributor_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadSkuDetail();
    }

    private void LoadSkuDetail()
    {
        hfInventoryType.Value = "0";
        DataTable dtskuPrice = new DataTable();
        DateTime CurrentWorkingDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        SkuController SKUCtl = new SkuController();
        ddlSkus.Items.Clear();
        foreach(DataRow dr in dtLocationInfo.Rows)
        {
            if(dr["DISTRIBUTOR_ID"].ToString() == drpDistributor.Value.ToString())
            {
                CurrentWorkingDate = Convert.ToDateTime(dr["MaxDayClose"]);
                break;
            }
        }
        if (Session["IsLocationWiseItem"].ToString() == "1")
        {
            dtskuPrice = SKUCtl.GetSKUInfo(Convert.ToInt32(drpDistributor.Value), CurrentWorkingDate,2);
        }
        else
        {
            dtskuPrice = SKUCtl.GetSKUInfo(Convert.ToInt32(drpDistributor.Value), CurrentWorkingDate,1);
        }

        clsWebFormUtil.FillDxComboBoxList(ddlSkus, dtskuPrice, "SKU_ID", "SKU_NAME", true);
        if (dtskuPrice.Rows.Count > 0)
        {
            txtUOM.Text = dtskuPrice.Rows[0]["UOM_DESC"].ToString();
            ddlSkus.SelectedIndex = 0;
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

    private void LoadGird()
    {
        _purchaseSku = (DataTable)Session["PurchaseSKU"];
        GrdPurchase.DataSource = _purchaseSku;
        GrdPurchase.DataBind();
    }

    protected void GrdPurchase_RowEditing(object sender, GridViewEditEventArgs e)
    {
        _rowNo.Value = e.NewEditIndex.ToString();
        ddlSkus.Value = GrdPurchase.Rows[e.NewEditIndex].Cells[0].Text;
        txtQuantity.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[4].Text;
        txtItemCode.Text = GrdPurchase.Rows[e.NewEditIndex].Cells[5].Text;
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + ddlSkus.SelectedItem.Value + "'");
        if (foundRows.Length > 0)
        {
            txtUOM.Text = foundRows[0]["UOM_DESC"].ToString();
        }
        txtQuantity.Focus();
        cbScan.Checked = false;
        cbScan_CheckedChanged(null, null);
        btnSave.Text = "Update";
    }

    protected void GrdPurchase_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        _purchaseSku = (DataTable)Session["PurchaseSKU"];
        if (_purchaseSku.Rows.Count > 0)
        {
            _purchaseSku.Rows.RemoveAt(e.RowIndex);
            Session.Add("PurchaseSKU", _purchaseSku);
            LoadGird();
        }
    }
    private void LoadDocumentDetail()
    {
        DateTime MWorkDate = System.DateTime.Now;
        PurchaseController mPurchase = new PurchaseController();
        DataTable dt = mPurchase.SelectPurchaseDocumentNo(10, Constants.IntNullValue, long.Parse(hfPhysical_Stock_ID.Value.ToString()), Constants.IntNullValue, Constants.IntNullValue);
        if (dt.Rows.Count > 0)
        {
            drpDistributor.Value = dt.Rows[0]["DISTRIBUTOR_ID"].ToString();
            txtRemarks.Text = dt.Rows[0]["REMARKS"].ToString();
            _purchaseSku = PhyscalStock.SelectPhysicalStockTakingDetail(Constants.IntNullValue, long.Parse(dt.Rows[0][0].ToString()),1);
            Session.Add("PurchaseSKU", _purchaseSku);
            LoadGird();
        }
    }

    private bool CheckDublicateSku()
    {
        _purchaseSku = (DataTable)Session["PurchaseSKU"];
        DataRow[] foundRows;
        decimal Qty = 0;
        if (cbScan.Checked)
        {
            foundRows = _purchaseSku.Select("strERPCode  = '" + txtItemCode.Text + "'");
            if (foundRows.Length > 0)
            {
                foreach (DataRow dr in _purchaseSku.Rows)
                {
                    if (dr["strERPCode"].ToString() == txtItemCode.Text.Trim())
                    {
                        Qty = Convert.ToDecimal(dr["Quantity"]);
                        dr["Quantity"] = Qty + decimal.Parse(txtQuantity.Text);
                        dr["DateTime"] = System.DateTime.Now;
                        break;
                    }
                }
                DataView dv = new DataView(_purchaseSku);
                dv.Sort = "DateTime DESC";
                _purchaseSku = dv.ToTable();
                Session.Add("PurchaseSKU", _purchaseSku);
                ClearAll();
                LoadGird();
                DisAbaleOption(true);
                ScriptManager.GetCurrent(Page).SetFocus(txtItemCode);
                return false;
            }
        }
        else
        {
            foundRows = _purchaseSku.Select("SKU_ID  = '" + ddlSkus.Value + "'");
            if (foundRows.Length > 0)
            {
                foreach (DataRow dr in _purchaseSku.Rows)
                {
                    if (dr["SKU_ID"].ToString() == ddlSkus.Value.ToString())
                    {
                        Qty = Convert.ToDecimal(dr["Quantity"]);
                        dr["Quantity"] = Qty + decimal.Parse(txtQuantity.Text);
                        dr["DateTime"] = System.DateTime.Now;
                        break;
                    }
                }
                DataView dv = new DataView(_purchaseSku);
                dv.Sort = "DateTime DESC";
                _purchaseSku = dv.ToTable();
                Session.Add("PurchaseSKU", _purchaseSku);
                ClearAll();
                LoadGird();
                DisAbaleOption(true);
                ScriptManager.GetCurrent(Page).SetFocus(ddlSkus);
                return false;
            }
        }
        
        
        return true;
    }

    /// <summary>
    /// Adds Document Detail To Document Detail Grid
    /// </summary>
    /// <param name="sender">object</param>
    /// <param name="e">EventArgs</param>  
    protected void btnSave_Click(object sender, EventArgs e)
    {
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        DataRow[] foundRows;
        if (cbScan.Checked)
        {
            foundRows = dtskuPrice.Select("strERPCode  = '" + txtItemCode.Text + "'");            
        }
        else
        {
            foundRows = dtskuPrice.Select("SKU_ID  = '" + ddlSkus.Value + "'");
        }
        if (foundRows.Length > 0)
        {
            _purchaseSku = (DataTable)Session["PurchaseSKU"];
            if (btnSave.Text == "Add")
            {
                if (CheckDublicateSku())
                {
                    DataRow dr = _purchaseSku.NewRow();
                    dr["SKU_ID"] = foundRows[0]["SKU_ID"];
                    dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                    dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                    dr["strERPCode"] = txtItemCode.Text.Trim();
                    dr["UNIT_RATE"] = foundRows[0]["DISTRIBUTOR_PRICE"];
                    dr["Quantity"] = decimal.Parse(_dc.chkNull_0(txtQuantity.Text));
                    dr["UOM_DESC"] = txtUOM.Text;
                    dr["UOM_ID"] = foundRows[0]["UOM_ID"];
                    dr["DateTime"] = System.DateTime.Now;
                    _purchaseSku.Rows.InsertAt(dr, 0);
                }
            }
            else if (btnSave.Text == "Update")
            {
                DataRow dr = _purchaseSku.Rows[Convert.ToInt32(_rowNo.Value)];
                dr["SKU_ID"] = foundRows[0]["SKU_ID"];
                dr["SKU_Code"] = foundRows[0]["SKU_CODE"];
                dr["SKU_Name"] = foundRows[0]["SKU_NAME"];
                dr["UNIT_RATE"] = foundRows[0]["DISTRIBUTOR_PRICE"];
                dr["Quantity"] = decimal.Parse(txtQuantity.Text);
                dr["UOM_DESC"] = txtUOM.Text;
                dr["strERPCode"] = txtItemCode.Text.Trim();
                dr["UOM_ID"] = foundRows[0]["UOM_ID"];
                dr["DateTime"] = System.DateTime.Now;
            }
            DataView dv = new DataView(_purchaseSku);
            dv.Sort = "DateTime DESC";
            _purchaseSku = dv.ToTable();
            Session.Add("PurchaseSKU", _purchaseSku);
            ClearAll();
            LoadGird();
            DisAbaleOption(true);
            ScriptManager.GetCurrent(Page).SetFocus(ddlSkus);
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Wrong item please check in list');", true);
        }
    }
    protected void btnSaveDocument_Click(object sender, EventArgs e)
    {
        var mDayClose = new DistributorController();
        DataTable dt = mDayClose.SelectMaxDayClose(Constants.IntNullValue, int.Parse(drpDistributor.Value.ToString()));
        if (dt.Rows.Count > 0)
        {
            DateTime mWorkDate = DateTime.Parse(dt.Rows[0]["CLOSING_DATE"].ToString());
            DataTable dtPurchaseDetail = (DataTable)Session["PurchaseSKU"];

            if (dtPurchaseDetail.Rows.Count > 0)
            {
                long mResult = 0;
                if (btnSaveDocument.Text == "Save")
                {
                    mResult = PhyscalStock.InsertPhysicalStockTaking(
                        int.Parse(drpDistributor.SelectedItem.Value.ToString()), mWorkDate, txtRemarks.Text,
                        int.Parse(Session["UserId"].ToString()), dtPurchaseDetail);
                }
                else
                {
                    mResult = PhyscalStock.UpdatePhysicalStockTaking(
                        long.Parse(hfPhysical_Stock_ID.Value.ToString()),
                        int.Parse(drpDistributor.SelectedItem.Value.ToString()), mWorkDate,
                        int.Parse(Session["UserId"].ToString()), txtRemarks.Text, dtPurchaseDetail);
                }

                if (mResult > 0 && chkAutoAdjust.Checked == false)
                {
                    ShowReport(mWorkDate);
                }
                if (chkAutoAdjust.Checked == true && btnSaveDocument.Text == "Save")
                {
                    RptInventoryController RptInventoryCtl = new RptInventoryController();

                    var ds = RptInventoryCtl.GetStockVariation(
                        int.Parse(drpDistributor.SelectedItem.Value.ToString()),
                        mWorkDate);

                    DataTable varianceDt = ds.Tables["uspGetStockVariation"];

                    DataTable excessDt = new DataTable();
                    excessDt.Columns.Add("SKU_ID", typeof(int));
                    excessDt.Columns.Add("PRICE", typeof(decimal));
                    excessDt.Columns.Add("Quantity", typeof(decimal));
                    excessDt.Columns.Add("AMOUNT", typeof(decimal));
                    excessDt.Columns.Add("UOM_ID", typeof(int));
                    excessDt.Columns.Add("S_Quantity", typeof(decimal));
                    excessDt.Columns.Add("S_UOM_ID", typeof(int));
                    excessDt.Columns.Add("Remarks", typeof(string));
                    excessDt.Columns.Add("Expiry_Date", typeof(string));

                    DataTable shortDt = excessDt.Clone();

                    DataTable dtConfig = GetCOAConfiguration();
                    bool IsFinanceSetting = GetFinanceConfig();

                    foreach (DataRow dr in dtPurchaseDetail.Rows)
                    {
                        decimal physicalStock = 0;
                        decimal closingStock = 0;

                        DataRow[] dr1 = varianceDt.Select("SKU_ID = '" + int.Parse(dr["SKU_ID"].ToString()) + "'");
                        if (dr1.Length > 0)
                        {
                            physicalStock = decimal.Parse(dr1[0]["Physical Stock"].ToString());
                            closingStock = decimal.Parse(dr1[0]["CORN Closing Stock"].ToString());

                            var difference = physicalStock - closingStock;
                            if (difference > 0) //Excess
                            {
                                DataRow row = excessDt.NewRow();
                                row["SKU_ID"] = dr["SKU_ID"];
                                row["PRICE"] = dr["UNIT_RATE"];
                                row["Quantity"] = difference;
                                row["AMOUNT"] = decimal.Parse(dr["UNIT_RATE"].ToString()) * difference;
                                row["UOM_ID"] = dr["UOM_ID"];
                                row["S_UOM_ID"] = dr["UOM_ID"];
                                row["S_Quantity"] = difference;
                                excessDt.Rows.Add(row);
                            }
                            else if (difference < 0) //Short
                            {
                                difference = closingStock - physicalStock;
                                DataRow row = shortDt.NewRow();
                                row["SKU_ID"] = dr["SKU_ID"];
                                row["PRICE"] = dr["UNIT_RATE"];
                                row["Quantity"] = difference;
                                row["AMOUNT"] = decimal.Parse(dr["UNIT_RATE"].ToString()) * difference;
                                row["UOM_ID"] = dr["UOM_ID"];
                                row["S_UOM_ID"] = dr["UOM_ID"];
                                row["S_Quantity"] = difference;
                                shortDt.Rows.Add(row);
                            }
                        }
                    }

                    //Excess
                    decimal mTotalAmountExcess = excessDt.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["AMOUNT"].ToString()));
                    decimal mTotalAmountShort = shortDt.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["AMOUNT"].ToString()));                    

                    if (excessDt.Rows.Count > 0)
                    {
                        PurchaseController mController = new PurchaseController();
                        bool mResult1 = mController.InsertPurchaseDocument(int.Parse(drpDistributor.SelectedItem.Value.ToString()),txtRemarks.Text,9, mWorkDate,int.Parse(drpDistributor.SelectedItem.Value.ToString()), 0,mTotalAmountExcess, false, excessDt, 0, null,int.Parse(Session["UserId"].ToString()), 0, dtConfig,IsFinanceSetting, mResult);
                        ShowExcessPopUp(0);
                    }
                    //Short
                    if (shortDt.Rows.Count > 0)
                    {
                        PurchaseController mController = new PurchaseController();
                        bool mResult1 = mController.InsertPurchaseDocument(int.Parse(drpDistributor.SelectedItem.Value.ToString()),txtRemarks.Text,8, mWorkDate,int.Parse(drpDistributor.SelectedItem.Value.ToString()), 0,mTotalAmountShort, false, shortDt, 0, null,int.Parse(Session["UserId"].ToString()), 0, dtConfig,IsFinanceSetting, mResult);
                        ShowShortPopUp(0);
                    }
                    if (shortDt.Rows.Count > 0 || excessDt.Rows.Count > 0)
                    {
                        ShowReport(mWorkDate);
                        StockVariationReport(0, mWorkDate);
                    }
                }
                lblErrorMsg.Text = "Record Upated";
                btnSaveDocument.Text = "Save";
                chkAutoAdjust.Checked = false;
                hfPhysical_Stock_ID.Value = "0";
                _purchaseSku = (DataTable)Session["PurchaseSKU"];
                _purchaseSku.Rows.Clear();
                Session.Add("PurchaseSKU", _purchaseSku);
                LoadGird();
                ClearAll();
                txtRemarks.Text = "";
                DisAbaleOption(false);
                LoadGridData();
                LoadLookupGrid("");

                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Successfully Save');", true);
            }
            else
            {
              ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please add some items in grid!');", true);
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dayclose not found for selected location!');", true);
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

    /// <summary>
    /// Enables/Disables Controls
    /// </summary>
    /// <param name="IsDisable">bool</param>
    private void DisAbaleOption(bool IsDisable)
    {
        if (IsDisable == true)
        {
            drpDistributor.Enabled = false;

        }
        else
        {
            drpDistributor.Enabled = true;
        }
    }

    /// <summary>
    /// Clears Form Controls
    /// </summary>
    private void ClearAll()
    {
        txtQuantity.Text = "1";
        ddlSkus.Enabled = true;
        btnSave.Text = "Add";
        lblErrorMsg.Text = "";
        txtItemCode.Text = "";
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
    
    protected void ddlSkus_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtQuantity.Enabled = true;
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + ddlSkus.SelectedItem.Value + "'");
        if (foundRows.Length > 0)
        {
            txtUOM.Text = foundRows[0]["UOM_DESC"].ToString();
            if (foundRows[0]["IsInventoryWeight"].ToString() != "")
            {
                if (Convert.ToBoolean(foundRows[0]["IsInventoryWeight"]))
                {
                    //txtQuantity.Enabled = false;
                    hfInventoryType.Value = "1";
                }
                else
                {
                    txtQuantity.Text = string.Empty;
                    hfInventoryType.Value = "0";
                }
            }
            else
            {
                txtQuantity.Text = string.Empty;
            }
        }
        txtQuantity.Focus();
    }

    private void ShowReportPhysicalStock(DateTime CurrentWorkDate, DataTable dtPurchaseDetail)
    {
        try
        {
            DsReport ds = new DsReport();
            DataTable dt = new DataTable();
            dt.Columns.Add("PhysiclaStockTaking_ID", typeof(long));
            dt.Columns.Add("REMARKS", typeof(string));
            dt.Columns.Add("SKU_ID", typeof(int));
            dt.Columns.Add("SKU_NAME", typeof(string));
            dt.Columns.Add("QUANTITY", typeof(decimal));
            dt.Columns.Add("UOM", typeof(string));
            dt.Columns.Add("DATE", typeof(DateTime));
            dt.Columns.Add("UNIT_RATE", typeof(decimal));
            int i = 0;
            foreach (DataRow dr in dtPurchaseDetail.Rows)
            {
                dt.Rows.Add();
                dt.Rows[i]["PhysiclaStockTaking_ID"] = 0;
                dt.Rows[i]["REMARKS"] = "Added by Import excel";
                dt.Rows[i]["SKU_ID"] = Convert.ToInt32(dr["SKU_ID"]);
                dt.Rows[i]["SKU_NAME"] = dr["SKU_NAME"];
                dt.Rows[i]["QUANTITY"] = Convert.ToDecimal(dr["QUANTITY"]);
                dt.Rows[i]["UOM"] = dr["UOM_DESC"];
                dt.Rows[i]["DATE"] = CurrentWorkDate;
                dt.Rows[i]["UNIT_RATE"] = Convert.ToDecimal(dr["UNIT_RATE"]);
                i += 1;
            }
            foreach (DataRow dr in dt.Rows)
            {
                ds.Tables["PhysicalStockTaking"].ImportRow(dr);
            }
            var crpReport = new CrpPhysicalStockTaking();
            crpReport.SetDataSource(ds);
            crpReport.Refresh();
            crpReport.SetParameterValue("Location", drpDistributor.SelectedItem.Text);
            crpReport.SetParameterValue("user", this.Session["UserName"].ToString());
            Session.Add("CrpReport3", crpReport);
            Session.Add("ReportType3", 0);
            const string url = "'DefaultRpt.aspx'";
            Response.Write("<script>window.open(" + url + ",'_blank');</script>");
        }
        catch (Exception ex)
        {
            ex.Message.ToString();
        }
    }
    private void ShowReport(DateTime CurrentWorkDate)
    {
        try
        {
            DsReport ds = new DsReport();
            DataTable dt = new DataTable();
            dt.Columns.Add("PhysiclaStockTaking_ID", typeof(long));
            dt.Columns.Add("REMARKS", typeof(string));
            dt.Columns.Add("SKU_ID", typeof(int));
            dt.Columns.Add("SKU_NAME", typeof(string));
            dt.Columns.Add("QUANTITY", typeof(decimal));
            dt.Columns.Add("UOM", typeof(string));
            dt.Columns.Add("DATE", typeof(DateTime));
            dt.Columns.Add("UNIT_RATE", typeof(decimal));
            int i = 0;
            DataTable dtPurchaseDetail = (DataTable)Session["PurchaseSKU"];
            foreach (DataRow dr in dtPurchaseDetail.Rows)
            {
                dt.Rows.Add();
                dt.Rows[i]["PhysiclaStockTaking_ID"] = 0;
                dt.Rows[i]["REMARKS"] = txtRemarks.Text;
                dt.Rows[i]["SKU_ID"] = Convert.ToInt32(dr["SKU_ID"]);
                dt.Rows[i]["SKU_NAME"] = dr["SKU_NAME"];
                dt.Rows[i]["QUANTITY"] = Convert.ToDecimal(dr["QUANTITY"]);
                dt.Rows[i]["UOM"] = dr["UOM_DESC"];
                dt.Rows[i]["DATE"] = CurrentWorkDate;
                dt.Rows[i]["UNIT_RATE"] = Convert.ToDecimal(dr["UNIT_RATE"]); ;
                i += 1;
            }
            foreach (DataRow dr in dt.Rows)
            {
                ds.Tables["PhysicalStockTaking"].ImportRow(dr);
            }
            var crpReport = new CrpPhysicalStockTaking();
            crpReport.SetDataSource(ds);
            crpReport.Refresh();
            crpReport.SetParameterValue("Location", drpDistributor.SelectedItem.Text);
            crpReport.SetParameterValue("user", this.Session["UserName"].ToString());
            Session.Add("CrpReport3", crpReport);
            Session.Add("ReportType3", 0);
            const string url = "'DefaultRpt.aspx'";
            Response.Write("<script>window.open(" + url + ",'_blank');</script>");
        }
        catch (Exception ex)
        {
            ex.Message.ToString();
        }
    }

    protected void btnImport_Click(object sender, EventArgs e)
    {
        mPOPImport.Show();
    }

    protected void btnExportOpeningTemplate_Click(object sender, EventArgs e)
    {
        OfficeOpenXml.ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

        using (ExcelPackage p = new ExcelPackage())
        {
            ExcelWorksheet ws = p.Workbook.Worksheets.Add("ItemList");

            var headerCells = ws.Cells[1, 1, 1, ExcelPackage.MaxColumns];
            var headerFont = headerCells.Style.Font;
            headerFont.Bold = true;

            GenerateItemPreFilled(ws, p);

            Byte[] fileBytes = p.GetAsByteArray();

            Response.Clear();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment;filename=PhysicalStockTakingDetail.xlsx");
            Response.Charset = "";
            Response.ContentType = "application/vnd.ms-excel";
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.BinaryWrite(fileBytes);
            Response.End();
        }
    }

    protected void btnImportOpening_Click(object sender, EventArgs e)
    {
        if (txtFile.PostedFile.ContentLength == 0)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Please select a file and then upload');", true);
            return;
        }
        else if (txtFile.PostedFile.ContentType != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Only excel file are supported');", true);
            return;
        }

        string pathFolder = AppDomain.CurrentDomain.BaseDirectory + "ImportFiles";
        if (!Directory.Exists(pathFolder))
        {
            Directory.CreateDirectory(pathFolder);
        }

        string path = System.IO.Path.GetFullPath(txtFile.PostedFile.FileName);
        string filename = path.Substring(path.LastIndexOf('\\'), path.Length - path.LastIndexOf('\\'));
        if (File.Exists(pathFolder + filename))
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('File already Exist in folder. Save file with other name');", true);
            return;
        }
        else
        {
            DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
            DataTable dtItemDetail = new DataTable();
            dtItemDetail.Columns.Add("SKU_ID", typeof(int));
            dtItemDetail.Columns.Add("SKU_NAME", typeof(string));
            dtItemDetail.Columns.Add("UNIT_RATE", typeof(decimal));
            dtItemDetail.Columns.Add("QUANTITY", typeof(decimal));
            dtItemDetail.Columns.Add("UOM_ID", typeof(int));
            dtItemDetail.Columns.Add("UOM_DESC", typeof(string));


            txtFile.PostedFile.SaveAs(pathFolder + filename);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var package = new ExcelPackage(txtFile.PostedFile.InputStream);
            ExcelWorksheet workSheet = package.Workbook.Worksheets[0];
            var startRow = workSheet.Dimension.Start.Row;
            var endRow = workSheet.Dimension.End.Row;
            int totalCols = 6;

            for (int row = startRow; row <= endRow; row++)
            {
                int SKUID = 0;
                decimal qty = 0;
                bool skip = false;
                for (int col = startRow; col <= totalCols; col++)
                {
                    var cellValue = workSheet.Cells[row + 1, col].Text;
                    if (!string.IsNullOrEmpty(cellValue))
                    {
                        if (col == 1)
                            SKUID = Convert.ToInt32(cellValue.ToString());
                        if (col == 4)
                            qty = Convert.ToDecimal(_dc.chkNull_0(cellValue.ToString()));
                    }
                    if (string.IsNullOrEmpty(cellValue) && col == 4)
                        skip = true;
                }
                if (skip == false)
                {
                    DataRow[] foundRows = dtskuPrice.Select("SKU_ID  = '" + SKUID.ToString() + "'");
                    if (foundRows.Length > 0)
                    {
                        DataRow dr = dtItemDetail.NewRow();
                        dr["SKU_ID"] = SKUID;
                        dr["SKU_NAME"] = foundRows[0]["SKU_NAME"];
                        dr["UNIT_RATE"] = foundRows[0]["DISTRIBUTOR_PRICE"];
                        dr["QUANTITY"] = qty;
                        dr["UOM_ID"] = foundRows[0]["UOM_ID"];
                        dr["UOM_DESC"] = foundRows[0]["UOM_DESC"];
                        dtItemDetail.Rows.Add(dr);
                    }
                }
            }
            var mDayClose = new DistributorController();
            DataTable dt = mDayClose.SelectMaxDayClose(Constants.IntNullValue, int.Parse(drpDistributor.Value.ToString()));
            if (dt.Rows.Count > 0 && dtItemDetail.Rows.Count > 0)
            {
                DateTime mWorkDate = DateTime.Parse(dt.Rows[0]["CLOSING_DATE"].ToString());
                long mResult = PhyscalStock.InsertPhysicalStockTaking(int.Parse(drpDistributor.SelectedItem.Value.ToString()), mWorkDate, "Physcial Stock Imported", int.Parse(Session["UserId"].ToString()), dtItemDetail);
                if (mResult > 0)
                {
                    if (chkAutoAdjust.Checked == true)
                    {
                        RptInventoryController RptInventoryCtl = new RptInventoryController();
                        var ds = RptInventoryCtl.GetStockVariation(int.Parse(drpDistributor.SelectedItem.Value.ToString()), mWorkDate);
                        DataTable varianceDt = ds.Tables["uspGetStockVariation"];
                        DataTable excessDt = new DataTable();
                        excessDt.Columns.Add("SKU_ID", typeof(int));
                        excessDt.Columns.Add("PRICE", typeof(decimal));
                        excessDt.Columns.Add("Quantity", typeof(decimal));
                        excessDt.Columns.Add("AMOUNT", typeof(decimal));
                        excessDt.Columns.Add("UOM_ID", typeof(int));
                        excessDt.Columns.Add("S_Quantity", typeof(decimal));
                        excessDt.Columns.Add("S_UOM_ID", typeof(int));
                        excessDt.Columns.Add("Remarks", typeof(string));
                        excessDt.Columns.Add("Expiry_Date", typeof(string));
                        DataTable shortDt = excessDt.Clone();
                        DataTable dtConfig = GetCOAConfiguration();
                        bool IsFinanceSetting = GetFinanceConfig();
                        foreach (DataRow dr in dtItemDetail.Rows)
                        {
                            decimal physicalStock = 0;
                            decimal closingStock = 0;
                            DataRow[] dr1 = varianceDt.Select("SKU_ID = '" + int.Parse(dr["SKU_ID"].ToString()) + "'");
                            if (dr1.Length > 0)
                            {
                                physicalStock = decimal.Parse(dr["QUANTITY"].ToString());
                                closingStock = decimal.Parse(dr1[0]["CORN Closing Stock"].ToString());
                                var difference = physicalStock - closingStock;
                                if (difference > 0) //Excess
                                {
                                    DataRow row = excessDt.NewRow();
                                    row["SKU_ID"] = dr["SKU_ID"];
                                    row["PRICE"] = dr["UNIT_RATE"];
                                    row["Quantity"] = difference;
                                    row["AMOUNT"] = decimal.Parse(dr["UNIT_RATE"].ToString()) * difference;
                                    row["UOM_ID"] = dr["UOM_ID"];
                                    row["S_UOM_ID"] = dr["UOM_ID"];
                                    row["S_Quantity"] = difference;
                                    excessDt.Rows.Add(row);
                                }
                                else if (difference < 0) //Short
                                {
                                    difference = closingStock - physicalStock;
                                    DataRow row = shortDt.NewRow();
                                    row["SKU_ID"] = dr["SKU_ID"];
                                    row["PRICE"] = dr["UNIT_RATE"];
                                    row["Quantity"] = difference;
                                    row["AMOUNT"] = decimal.Parse(dr["UNIT_RATE"].ToString()) * difference;
                                    row["UOM_ID"] = dr["UOM_ID"];
                                    row["S_UOM_ID"] = dr["UOM_ID"];
                                    row["S_Quantity"] = difference;
                                    shortDt.Rows.Add(row);
                                }
                            }
                        }
                        //Excess
                        decimal mTotalAmount = excessDt.Rows.Cast<DataRow>().Sum(dr =>
                        decimal.Parse(dr["AMOUNT"].ToString()));
                        mTotalAmount = shortDt.Rows.Cast<DataRow>().Sum(dr => decimal.Parse(dr["AMOUNT"].ToString()));
                        if (excessDt.Rows.Count > 0)
                        {
                            PurchaseController mController = new PurchaseController();
                            bool mResult1 = mController.InsertPurchaseDocument(int.Parse(drpDistributor.SelectedItem.Value.ToString()), txtRemarks.Text, 9, mWorkDate, int.Parse(drpDistributor.SelectedItem.Value.ToString()), 0, mTotalAmount, false, excessDt, 0, null, int.Parse(Session["UserId"].ToString()), 0, dtConfig, IsFinanceSetting, mResult);
                            ShowExcessPopUp(0);
                        }
                        //Short
                        if (shortDt.Rows.Count > 0)
                        {
                            PurchaseController mController = new PurchaseController();
                            bool mResult1 = mController.InsertPurchaseDocument(int.Parse(drpDistributor.SelectedItem.Value.ToString()), txtRemarks.Text, 8, mWorkDate, int.Parse(drpDistributor.SelectedItem.Value.ToString()), 0, mTotalAmount, false, shortDt, 0, null, int.Parse(Session["UserId"].ToString()), 0, dtConfig, IsFinanceSetting, mResult);
                            ShowShortPopUp(0);
                        }
                        if (shortDt.Rows.Count > 0 || excessDt.Rows.Count > 0)
                        {
                            ShowReportPhysicalStock(mWorkDate, dtItemDetail);
                            StockVariationReport(0, mWorkDate);
                        }
                    }

                    LoadGridData();
                    LoadLookupGrid("");
                    ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Successfully Save');", true);
                }
            }
        }
        File.Delete(pathFolder + filename);
    }

    protected void btnClose_Import_ServerClick(object sender, EventArgs e)
    {
        mPOPImport.Hide();
    }

    public void GenerateItemPreFilled(ExcelWorksheet ws, ExcelPackage p)
    {
        DataTable dtskuPrice = (DataTable)Session["Dtsku_Price"];
        DataTable dtItems = new DataTable();
        dtItems.Columns.Add("SKU_ID", typeof(int));
        dtItems.Columns.Add("SKU_NAME", typeof(string));
        dtItems.Columns.Add("UOM", typeof(string));
        dtItems.Columns.Add("SKU_HIE_NAME", typeof(string));

        foreach (DataRow drItem in dtskuPrice.Rows)
        {
            DataRow dr = dtItems.NewRow();
            dr["SKU_ID"] = drItem["SKU_ID"];
            dr["SKU_NAME"] = drItem["SKU_NAME"];
            dr["UOM"] = drItem["UOM_DESC"];
            dr["SKU_HIE_NAME"] = drItem["SKU_HIE_NAME"];
            dtItems.Rows.Add(dr);
        }

        int rowIndex = 1;
        ws.Cells[1, 1].Value = "Item ID";
        ws.Cells[1, 2].Value = "Item Name";
        ws.Cells[1, 3].Value = "UOM";
        ws.Cells[1, 4].Value = "Quantity";
        ws.Cells[1, 5].Value = "Category";
        foreach (DataRow DataTableRow in dtItems.Rows)
        {
            int colIndex = 1;
            rowIndex++;
            foreach (DataColumn DataTableColumn in dtItems.Columns)
            {
                if (colIndex == 4)
                {
                    var cell = ws.Cells[rowIndex, 5];
                    cell.Value = DataTableRow[DataTableColumn.ColumnName];
                }
                else
                {
                    var cell = ws.Cells[rowIndex, colIndex];
                    cell.Value = DataTableRow[DataTableColumn.ColumnName];
                }
                colIndex++;
            }
        }
    }

    public void ShowExcessPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();
        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributor.SelectedItem.Value.ToString()));
        CORNBusinessLayer.Reports.CrpShortDocument CrpReport = new CORNBusinessLayer.Reports.CrpShortDocument();
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(int.Parse(hfPhysical_Stock_ID.Value.ToString()), 5);
        }
        else
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(Constants.IntNullValue, 6);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Excess Document");
        CrpReport.SetParameterValue("Principal", "");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());

        this.Session.Add("CrpReport2", CrpReport);
        this.Session.Add("ReportType2", 0);
        const string url = "'Default2.aspx'";
        Response.Write("<script>window.open(" + url + ",'_blank');</script>");
    }
    public void ShowShortPopUp(int type)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();
        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributor.SelectedItem.Value.ToString()));
        CORNBusinessLayer.Reports.CrpShortDocument CrpReport = new CORNBusinessLayer.Reports.CrpShortDocument();
        DataSet ds = null;
        if (type != 0)
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(int.Parse(hfPhysical_Stock_ID.Value.ToString()), 5);
        }
        else
        {
            ds = RptInventoryCtl.SelectTransferDocumentPopUp(Constants.IntNullValue, 6);
        }

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Short Document");
        CrpReport.SetParameterValue("Principal", "");
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());

        this.Session.Add("CrpReport1", CrpReport);
        this.Session.Add("ReportType1", 0);
        const string url = "'Default1.aspx'";
        Response.Write("<script>window.open(" + url + ",'_blank');</script>");
    }
    private void StockVariationReport(int reporType, DateTime mWorkDate)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();

        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributor.SelectedItem.Value.ToString()));
        DataSet ds = RptInventoryCtl.GetStockVariation(int.Parse(drpDistributor.SelectedItem.Value.ToString()),
            mWorkDate);
        CrpStockVariation CrpReport = new CrpStockVariation();
        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();


        CrpReport.SetParameterValue("Location", drpDistributor.SelectedItem.Text);
        CrpReport.SetParameterValue("Date", mWorkDate);
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("Username", Session["UserName"].ToString());

        Session.Add("CrpReport", CrpReport);
        Session.Add("ReportType", reporType);
        const string url = "'Default.aspx'";
        Response.Write("<script>window.open(" + url + ",'_blank');</script>");
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

    protected void cbScan_CheckedChanged(object sender, EventArgs e)
    {
        if(cbScan.Checked)
        {
            txtItemCode.Visible = true;
            ddlSkus.Visible = false;
            txtItemCode.Focus();
        }
        else
        {
            txtItemCode.Visible = false;
            ddlSkus.Visible = true;
            ddlSkus.Focus();
        }
    }
}