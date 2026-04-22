using System;
using System.Data;
using System.Web.UI;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;


public partial class Forms_frmTransferOutIn : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            this.GetAppSettingDetail();
            this.GetItemAssignment();
            this.LoadDistributor();
            this.GetDocumentNo();
            this.LoadToDistributor();
            this.LoadDocumentDetail();            
        }
    }
    private void GetDocumentNo()
    {
        try
        {   
            PurchaseController mPurchase = new PurchaseController();
            DataTable dt = mPurchase.SelectPurchaseDocumentNo(21, Constants.IntNullValue, Constants.LongNullValue, int.Parse(this.Session["UserId"].ToString()), 0, Convert.ToInt32(Session["DISTRIBUTOR_ID"]));
            clsWebFormUtil.FillDxComboBoxList(drpDocumentNo, dt, 0, 0,true);
            if (dt.Rows.Count > 0)
            {
                drpDocumentNo.SelectedIndex = 0;
            }
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
            PurchaseController mPurchase = new PurchaseController();
            DataTable dt = mPurchase.SelectPurchaseDocumentNo(Constants.IntNullValue, Constants.IntNullValue, long.Parse(drpDocumentNo.Value.ToString()), Constants.IntNullValue, Constants.IntNullValue);
            if (dt.Rows.Count > 0)
            {
                txtDocumentNo.Text = dt.Rows[0]["ORDER_NUMBER"].ToString();
                txtBuiltyNo.Text = dt.Rows[0]["BUILTY_NO"].ToString();
                DrpTransferFor.Value = dt.Rows[0]["SOLD_FROM"].ToString();
                drpDistributor.Value = dt.Rows[0]["SOLD_TO"].ToString();
                DataTable PurchaseSKUS = mPurchase.SelectPurchaseDetail(Constants.IntNullValue, long.Parse(dt.Rows[0][0].ToString()));
                GrdPurchase.DataSource = PurchaseSKUS;
                GrdPurchase.DataBind();
                this.Session.Add("PurchaseSKUS", PurchaseSKUS);
            }
        }
    }
    private void LoadDistributor()
    {
        try
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
            DataTable dt = DController.SelectDistributorInfo(Constants.IntNullValue, Constants.IntNullValue, int.Parse(this.Session["CompanyId"].ToString()));
            clsWebFormUtil.FillDxComboBoxList(DrpTransferFor, dt, 0, 2, true);
            if (dt.Rows.Count > 0)
            {
                DrpTransferFor.SelectedIndex = 0;
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
    private void GetItemAssignment()
    {
        SkuController _SKU = new SkuController();
        DataTable dtItemAssignment = _SKU.GetItemAssignment(4, Constants.IntNullValue, Constants.IntNullValue);
        Session.Add("dtItemAssignment", dtItemAssignment);
    }
    protected void btnTransferIn_Click(object sender, EventArgs e)
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

            foreach (DataRow dr in dtPurchaseDetail.Rows)
            {
                mTotalAmount += decimal.Parse(dr["AMOUNT"].ToString());

            }
            DataTable dtConfig = GetCOAConfiguration();
            bool IsFinanceSetting = GetFinanceConfig();
            bool mResult = false;
            if (dtItemAssignment.Rows.Count == 0)
            {
                mResult = mController.InsertPurchaseDocument2(int.Parse(drpDistributor.SelectedItem.Value.ToString()), txtDocumentNo.Text, Constants.Document_Transfer_In,
                     CurrentWorkDate, int.Parse(drpDistributor.SelectedItem.Value.ToString()), int.Parse(DrpTransferFor.SelectedItem.Value.ToString())
                    , mTotalAmount, false, dtPurchaseDetail, 1, txtBuiltyNo.Text, int.Parse(this.Session["UserId"].ToString()), int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), dtConfig, IsFinanceSetting);
            }
            else
            {
                mResult = mController.InsertTransferIn(int.Parse(drpDistributor.SelectedItem.Value.ToString()), txtDocumentNo.Text, Constants.Document_Transfer_In,
                     CurrentWorkDate, int.Parse(drpDistributor.SelectedItem.Value.ToString()), int.Parse(DrpTransferFor.SelectedItem.Value.ToString())
                    , mTotalAmount, false, dtPurchaseDetail, 1, txtBuiltyNo.Text, int.Parse(this.Session["UserId"].ToString()), int.Parse(drpDocumentNo.SelectedItem.Value.ToString()), dtConfig, IsFinanceSetting, dtItemAssignment);
            }
            if (mResult == true)
            {
                mController.PostPendingDocument(int.Parse(drpDocumentNo.SelectedItem.Value.ToString()));
                GrdPurchase.DataSource = null;
                GrdPurchase.DataBind();
                Session.Remove("PurchaseSKUS");
                GetDocumentNo();
                LoadDocumentDetail();
                txtBuiltyNo.Text = "";
                txtDocumentNo.Text = "";
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg", "alert('Dayclose not found for selected location!');", true);
        }
    }
    protected void btnCancel_Click(object sender, EventArgs e)
    {
        //  Respo
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