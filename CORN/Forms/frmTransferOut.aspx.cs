using System;
using System.Data;
using System.Web.UI;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;
using System.Web.UI.WebControls;
using CORNBusinessLayer.Reports;

public partial class Forms_frmTransferOut : System.Web.UI.Page
{
    PhaysicalStockController mPhysical = new PhaysicalStockController();
    DataTable _PurchaseSKUS;
    private void CreateTable()
    {
        _PurchaseSKUS = new DataTable();
        _PurchaseSKUS.Columns.Add("SKU_ID", typeof(int));
        _PurchaseSKUS.Columns.Add("SKU_Code", typeof(string));
        _PurchaseSKUS.Columns.Add("SKU_Name", typeof(string));
        _PurchaseSKUS.Columns.Add("Quantity", typeof(decimal));
        _PurchaseSKUS.Columns.Add("PRICE", typeof(decimal));
        _PurchaseSKUS.Columns.Add("AMOUNT", typeof(decimal));
        _PurchaseSKUS.Columns.Add("UOM_ID", typeof(int));
        _PurchaseSKUS.Columns.Add("S_UOM_ID", typeof(int));
        _PurchaseSKUS.Columns.Add("S_Quantity", typeof(decimal));
        _PurchaseSKUS.Columns.Add("TAX", typeof(decimal));
        this.Session.Add("PurchaseSKUS", _PurchaseSKUS);
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            this.GetAppSettingDetail();
            this.LoadDistributor();
            this.LoadToDistributor();
            this.GetDocumentNo();            
            this.LoadDocumentDetail();
        }
    }
   
    private void GetDocumentNo()
    {
        try
        {
            drpDocumentNo.Items.Clear();
            PurchaseController mPurchase = new PurchaseController();
            DataTable dt = mPurchase.SelectPurchaseDocumentNo(23, int.Parse(Session["DISTRIBUTOR_ID"].ToString()), Constants.LongNullValue, int.Parse(Session["UserId"].ToString()), 0);
            clsWebFormUtil.FillDxComboBoxList(drpDocumentNo, dt, "STOCK_DEMAND_ID", "DISTRIBUTOR_NAME", true);
            if (dt.Rows.Count > 0)
            {
                drpDocumentNo.SelectedIndex = 0;
            }
            else
            {
                drpDistributor.SelectedIndex = -1;
            }
            Session.Add("dtPurchase", dt);            
        }
        catch (Exception EX)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert(' Error:   " + EX.Message.ToString() + " ');", true);
        }
    }
    protected void drpDocumentNo_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.LoadDocumentDetail();
    }
    private void LoadDocumentDetail()
    {
        if (drpDocumentNo.Items.Count > 0)
        {
            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributor.Value.ToString())
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }
            PurchaseController mPurchase = new PurchaseController();
            {
                DataTable dt = mPurchase.selectStockDemandDetail(int.Parse(drpDistributor.Value.ToString()), int.Parse(drpDocumentNo.Value.ToString()),CurrentWorkDate);
                if (dt.Rows.Count > 0)
                {
                    DrpTransferTo.Value = dt.Rows[0]["DISTRIBUTOR_ID"].ToString();
                    txtBuiltyNo.Text = dt.Rows[0]["REMARKS"].ToString();
                }
                this.Session.Add("PurchaseSKUS", dt);
                LoadGird();
            }
        }
    }
    private void LoadDistributor()
    {
        try
        {
            DistributorController DController = new DistributorController();
            DataTable dt = DController.GetDistributorWithMaxDayClose(Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), int.Parse(this.Session["CompanyId"].ToString()), 4);
            clsWebFormUtil.FillDxComboBoxList(DrpTransferTo, dt, "CUSTOMER_ID", "CUSTOMER_NAME");
            if (dt.Rows.Count > 0)
            {
                DrpTransferTo.SelectedIndex = 0;
            }            
        }
        catch (Exception EX)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert(' Error:   " + EX.Message.ToString() + " ');", true);
        }
    }
    private void LoadToDistributor()
    {
        try
        {
            DistributorController DController = new DistributorController();
            DataTable dt = DController.GetDistributorWithMaxDayClose(Constants.IntNullValue, Constants.IntNullValue, 5, 2);
            clsWebFormUtil.FillDxComboBoxList(drpDistributor, dt, "DISTRIBUTOR_ID", "DISTRIBUTOR_NAME");
            Session.Add("dtLocationInfo", dt);
            if (dt.Rows.Count > 0)
            {
                drpDistributor.SelectedIndex = 0;
            }
        }
        catch (Exception EX)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert(' Error:   " + EX.Message.ToString() + " ');", true);
        }
    }
    public DataTable GetCOAConfiguration()
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
    protected void btnSave_Click(object sender, EventArgs e)
    {
        DateTime CurrentWorkDate = Constants.DateNullValue;
        DataTable dtLocationInfo = (DataTable)Session["dtLocationInfo"];
        foreach (DataRow dr in dtLocationInfo.Rows)
        {
            if (dr["DISTRIBUTOR_ID"].ToString() == drpDistributor.Value.ToString())
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
            DataTable dtItemAssignment = (DataTable)Session["dtItemAssignment"];
            PurchaseController mController = new PurchaseController();
            DataTable dtPurchaseDetail = (DataTable)this.Session["PurchaseSKUS"];
            decimal mTotalAmount = 0;
            bool checkstock = true;
            bool checkqty = true;
            decimal stock = 0;
            foreach (GridViewRow gvr in GrdPurchase.Rows)
            {
                stock = 0;
                TextBox txtQuantity = gvr.FindControl("txtQuantity") as TextBox;
                if (Convert.ToDecimal(DataControl.chkNull_Zero(txtQuantity.Text)) > Convert.ToDecimal(gvr.Cells[5].Text))
                {
                    checkqty = false;
                    break;
                }
            }
            if(!checkqty)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dispatch Qty can not be greater than demand Qty. ');", true);
                return;
            }
            foreach (GridViewRow gvr in GrdPurchase.Rows)
            {
                stock = 0;
                TextBox txtQuantity = gvr.FindControl("txtQuantity") as TextBox;
                DataTable dt = mPhysical.SelectSKUClosingStock2(int.Parse(drpDistributor.SelectedItem.Value.ToString()), Convert.ToInt32(gvr.Cells[0].Text), "N/A", CurrentWorkDate, 15);
                if(dt.Rows.Count>0)
                {
                    stock = Convert.ToDecimal(dt.Rows[0][0]);
                }
                if (Convert.ToDecimal(DataControl.chkNull_Zero(txtQuantity.Text)) > stock)
                {
                    checkstock = false;                    
                    break;
                }
            }

            if(!checkstock)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dispatch Qty can not be greater than available stock. ');", true);
                return;
            }
            foreach (GridViewRow gvr in GrdPurchase.Rows)
            {
                TextBox txtQuantity = gvr.FindControl("txtQuantity") as TextBox;
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (gvr.Cells[0].Text == dr["SKU_ID"].ToString())
                    {
                        mTotalAmount += decimal.Parse(dr["AMOUNT"].ToString());
                        dr["Quantity"] = DataControl.chkNull_Zero(txtQuantity.Text);
                    }
                }
            }
            DataTable dtConfig = GetCOAConfiguration();
            bool IsFinanceSetting = GetFinanceConfig();
            long mResult = Constants.LongNullValue;
            mResult = mController.InsertTransferOut(int.Parse(drpDistributor.SelectedItem.Value.ToString()),
                txtDocumentNo.Text, Constants.Document_Transfer_Out,CurrentWorkDate,
                int.Parse(DrpTransferTo.SelectedItem.Value.ToString()),
                int.Parse(drpDistributor.SelectedItem.Value.ToString()),mTotalAmount, 
                false, dtPurchaseDetail, 0, txtBuiltyNo.Text, int.Parse(Session["UserId"].ToString()),
                int.Parse(DrpTransferTo.SelectedItem.Value.ToString()),dtConfig,
                IsFinanceSetting, int.Parse(drpDocumentNo.SelectedItem.Value.ToString()));
            if (mResult > 0)
            {
                var demandNo = drpDocumentNo.SelectedItem.Text;

                //mController.UpdateStockDemand(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), Convert.ToInt64(mResult));
                ShowTransferOutPopUp(mResult,demandNo);
                GrdPurchase.DataSource = null;
                GrdPurchase.DataBind();
                Session.Remove("PurchaseSKUS");
                GetDocumentNo();
                LoadDocumentDetail();
                txtBuiltyNo.Text = "";
                txtDocumentNo.Text = "";                
                ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Transfer Out saved successfully. ');", true);                
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dayclose not found for selected location!');", true);
        }
    }
    private void LoadGird()
    {
        try
        {
            _PurchaseSKUS = (DataTable)this.Session["PurchaseSKUS"];
            GrdPurchase.DataSource = _PurchaseSKUS;
            GrdPurchase.DataBind();
        }
        catch (Exception EX)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert(' Error:   " + EX.Message.ToString() + " ');", true);
        }
    }
    protected void btnCancel_Click(object sender, EventArgs e)
    {
        //  Respo
    }

    protected void GrdPurchase_RowDataBound(object sender, System.Web.UI.WebControls.GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TextBox qty = (TextBox)e.Row.FindControl("txtQuantity");
            qty.Attributes.Add("onblur", "javascript:return Calculations(" + qty.ClientID + ")");
        }
    }
    public void ShowTransferOutPopUp(long PurchaseMasterID,string demandNo)
    {
        DocumentPrintController mController = new DocumentPrintController();
        RptInventoryController RptInventoryCtl = new RptInventoryController();

        DataTable dt = mController.SelectReportTitle(int.Parse(drpDistributor.SelectedItem.Value.ToString()));
        CrpTransferOutDemand CrpReport = new CrpTransferOutDemand();
        DataSet ds = null;
        ds = RptInventoryCtl.SelectTransferDocumentPopUp(PurchaseMasterID, 8);

        CrpReport.SetDataSource(ds);
        CrpReport.Refresh();

        CrpReport.SetParameterValue("DocumentType", "Transfer Out Against Demand Document");
        CrpReport.SetParameterValue("Principal", demandNo);
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        CrpReport.SetParameterValue("user", this.Session["UserName"].ToString());

        this.Session.Add("CrpReport", CrpReport);
        this.Session.Add("ReportType", 0);
        const string url = "'Default.aspx'";
        const string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
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