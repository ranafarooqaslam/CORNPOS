using System;
using System.Data;
using System.Web.UI;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;
using CORNBusinessLayer.Reports;
using CrystalDecisions.CrystalReports.Engine;
using System.Web.UI.WebControls;

/// <summary>
/// Form For General Ledger Report
/// </summary>
public partial class Forms_rptSupplierLedgr : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            LoadPrincipal();
            LoadDistributor();

            Configuration.SystemCurrentDateTime = (DateTime)this.Session["CurrentWorkDate"];
            txtStartDate.Text = Configuration.SystemCurrentDateTime.ToString("dd-MMM-yyyy");
            txtEndDate.Text = Configuration.SystemCurrentDateTime.ToString("dd-MMM-yyyy");
        }
    }
    
    private void LoadPrincipal()
    {
        DrpPrincipal.Items.Clear();

        if (Session["FranchiseModule"].ToString() == "1")
        {
            DataTable dtVendors = (DataTable)Session["dtVendors"];
            DrpPrincipal.Items.Add("All", Constants.IntNullValue.ToString());
            clsWebFormUtil.FillDxComboBoxList(DrpPrincipal, dtVendors, "VendorID", "VendorName");
        }
        else
        {
            SKUPriceDetailController PController = new SKUPriceDetailController();
            DataTable m_dt = PController.SelectDataPrice(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), Constants.IntNullValue, 0, DateTime.Parse(this.Session["CurrentWorkDate"].ToString()));
            DrpPrincipal.Items.Add("All", Constants.IntNullValue.ToString());
            clsWebFormUtil.FillDxComboBoxList(this.DrpPrincipal, m_dt, 0, 1);
        }
        if (DrpPrincipal.Items.Count > 0)
        {
            DrpPrincipal.SelectedIndex = 0;
        }
        else
        {
            DrpPrincipal.SelectedIndex = -1;
        }
    }

    private void LoadDistributor()
    {
        DistributorController DController = new DistributorController();
        DataTable dt = DController.SelectDistributorInfo(Constants.IntNullValue, int.Parse(this.Session["UserId"].ToString()), int.Parse(this.Session["CompanyId"].ToString()));
        drpDistributor.Items.Add(new DevExpress.Web.ListEditItem("All", Constants.IntNullValue.ToString()));
        clsWebFormUtil.FillDxComboBoxList(drpDistributor, dt, 0, 2);
        if (dt.Rows.Count > 0)
        {
            drpDistributor.SelectedIndex = 0;
        }
    }
    private decimal LoadVendoerOpBalance(int pTypeID,int pVendorID)
    {
        if (drpDistributor.Items.Count > 0 && DrpPrincipal.Items.Count > 0)
        {
            VenderEntryController mController = new VenderEntryController();
            DataTable dt = mController.GetVendorOpening(pVendorID, int.Parse(drpDistributor.SelectedItem.Value.ToString()),DateTime.Parse(txtStartDate.Text + " 00:00:00"), pTypeID);
            if (decimal.Parse(dt.Rows[0][0].ToString()) > 0)
            {
                opType.Value = "DR";
            }
            else
            {
                opType.Value = "CR";
            }
            return decimal.Parse(dt.Rows[0][0].ToString());
        }
        return 0;
    }

    private void showReport(int reportType)
    {
        DocumentPrintController DPrint = new DocumentPrintController();
        VenderEntryController RptCustCtl = new VenderEntryController();
        int TypeID = 1;
        System.Text.StringBuilder sbDistributorID = new System.Text.StringBuilder();
        if(drpDistributor.Value.ToString() == Constants.IntNullValue.ToString())
        {
            foreach(DevExpress.Web.ListEditItem li in drpDistributor.Items)
            {
                sbDistributorID.Append(li.Value.ToString());
                sbDistributorID.Append(",");
            }
        }
        else
        {
            sbDistributorID.Append(drpDistributor.Value.ToString());
        }
        System.Text.StringBuilder sbVendorID = new System.Text.StringBuilder();
        if (DrpPrincipal.Value.ToString() == Constants.IntNullValue.ToString())
        {
            foreach (DevExpress.Web.ListEditItem li in DrpPrincipal.Items)
            {
                sbVendorID.Append(li.Value);
                sbVendorID.Append(",");
            }
        }
        else
        {
            sbVendorID.Append(DrpPrincipal.Value.ToString());
            sbVendorID.Append(",");
        }
        if (Session["FranchiseModule"].ToString() == "1")
        {
            TypeID = 2;
            DataTable dtVendors = (DataTable)Session["dtVendors"];
            if (DrpPrincipal.SelectedItem.Value.ToString() == Constants.IntNullValue.ToString())
            {                
                foreach (DataRow dr in dtVendors.Rows)
                {
                    if (dr["VendorID"].ToString() == DrpPrincipal.SelectedItem.Value.ToString())
                    {
                        sbVendorID.Append(dr["SupplierLocationID"].ToString());
                        break;
                    }
                }
            }
            else
            {
                sbVendorID = new System.Text.StringBuilder();
                foreach (DataRow dr in dtVendors.Rows)
                {
                    if (dr["VendorID"].ToString() == DrpPrincipal.SelectedItem.Value.ToString())
                    {
                        sbVendorID.Append(dr["SupplierLocationID"].ToString());
                        break;
                    }
                }
            }
        }        
        DataSet ds = RptCustCtl.GetVendorLedger(sbVendorID.ToString(), sbDistributorID.ToString(), DateTime.Parse(txtStartDate.Text + " 00:00:00"), DateTime.Parse(txtEndDate.Text + " 23:59:59"),DrpPrincipal.SelectedItem.Text, TypeID);
        DataTable dt = DPrint.SelectReportTitle(int.Parse(drpDistributor.SelectedItem.Value.ToString()));
        CrpSupplierLedger CrpReport = new CrpSupplierLedger();
        ReportDocument subReport = CrpReport.OpenSubreport("SubReport");
        CrpReport.SetDataSource(ds);
        subReport.SetDataSource(ds);
        CrpReport.Refresh();
        CrpReport.SetParameterValue("FromDate", DateTime.Parse(txtStartDate.Text));
        CrpReport.SetParameterValue("To_date", DateTime.Parse(txtEndDate.Text));
        CrpReport.SetParameterValue("Location", drpDistributor.SelectedItem.Text);
        CrpReport.SetParameterValue("CompanyName", dt.Rows[0]["COMPANY_NAME"].ToString());
        Session.Add("CrpReport", CrpReport);
        Session.Add("ReportType", reportType);
        const string url = "'Default.aspx'";
        const string script = "<script language='JavaScript' type='text/javascript'> window.open(" + url + ",\"Link\",\"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800,height=600,left=10,top=10\");</script>";
        Type cstype = this.GetType();
        ClientScriptManager cs = Page.ClientScript;
        cs.RegisterStartupScript(cstype, "OpenWindow", script);
    }
    protected void btnViewPDF_Click(object sender, EventArgs e)
    {
        showReport(0);
    }

    protected void btnViewExcel_Click(object sender, EventArgs e)
    {
        showReport(1);
    }
}