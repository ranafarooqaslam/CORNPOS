using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class Truncate : System.Web.UI.Page
{
    string CryptographyKey = "b0tin@74";
    string conStringCorn = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDb(conStringCorn);
            LoadLocations(true, conStringCorn);
            DateTime dtLicenseDate = DateTime.Now.AddDays(-1);
            txtDate.Text = dtLicenseDate.ToString("dd-MMM-yyyy");
        }
    }
    private void LoadDb(string conString)
    {
        List<string> list = new List<string>();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE database_id > 4 AND compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' ORDER BY name", con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        list.Add(dr[0].ToString());
                    }
                }
            }
            con.Close();
        }
        ddlDB.DataSource = list;
        ddlDB.DataBind();
    }
    protected void btnUpdate_Click(object sender, EventArgs e)
    {
        string connString = conStringCorn;
        lblError.Text = string.Empty;
        bool flag = false;
        if(rblTruncateType.SelectedValue == "1")
        {
            try
            {
                TruncateSingleLocationDate(Convert.ToInt32(ddlLocation.SelectedItem.Value));
                flag = true;
            }
            catch (Exception ex)
            {
                flag = false;
            }
            if (flag)
            {
                lblError.ForeColor = System.Drawing.Color.Green;
                lblError.Text = ddlLocation.SelectedItem.Text + " Location Data Truncated";
            }
            else
            {
                lblError.ForeColor = System.Drawing.Color.Red;
                lblError.Text = "No database selected or Some error occured.";
            }
        }
        else
        {
            try
            {
                TruncateDayCloseTable();
                List<string> lst = GetDistribuor();
                InsertDayClose(lst);
                UpdateSKUPriceTable();
                TruncateTransactions();
                DropConstraints();
                TruncateConstraintTables();
                AddConstraints();
                flag = true;
            }
            catch (Exception ex)
            {
                flag = false;
            }
            if (flag)
            {
                txtDBName.Text = string.Empty;
                lblError.ForeColor = System.Drawing.Color.Green;
                lblError.Text = "Transaction Truncated of " + txtDBName.Text.Trim() + " Database";
            }
            else
            {
                lblError.ForeColor = System.Drawing.Color.Red;
                lblError.Text = "No database selected or Some error occured.";
            }
        }        
    }
    private void TruncateDayCloseTable()
    {
        StringBuilder scriptDayCloseTable = new StringBuilder();
        scriptDayCloseTable.Append(Environment.NewLine);
        scriptDayCloseTable.Append(" TRUNCATE TABLE DAILY_CLOSE ");
        ExecuteScript(scriptDayCloseTable.ToString());
    }
    private List<string> GetDistribuor()
    {
        List<string> lst = new List<string>();
        StringBuilder scripDistributor = new StringBuilder();

        scripDistributor.Append(Environment.NewLine);
        scripDistributor.Append("SELECT DISTRIBUTOR_ID FROM DISTRIBUTOR WHERE ISDELETED = 0 ");
        return ExecuteGetTableScript(scripDistributor.ToString());
    }
    private void InsertDayClose(List<string> lst)
    {
        StringBuilder scriptDayClose = new StringBuilder();
        foreach (string distributorid in lst)
        {
            scriptDayClose = new StringBuilder();
            scriptDayClose.Append(Environment.NewLine);
            scriptDayClose.Append(" INSERT INTO DAILY_CLOSE(CLOSING_DATE,DISTRIBUTOR_ID,OPENING_CASH,TIME_STAMP) VALUES('" + Convert.ToDateTime(txtDate.Text).ToString("yyyy-MM-dd") + "'," + distributorid + ",0,'" + System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')");
            ExecuteScript(scriptDayClose.ToString());
        }
    }
    private void UpdateSKUPriceTable()
    {
        StringBuilder scriptDayCloseTable = new StringBuilder();
        scriptDayCloseTable.Append(Environment.NewLine);
        scriptDayCloseTable.Append(" UPDATE SKU_PRICES SET DATE_EFFECTED = '" + Convert.ToDateTime(txtDate.Text).AddDays(1).ToString("yyyy-MM-dd") + "'");
        ExecuteScript(scriptDayCloseTable.ToString());
    }
    private void TruncateTransactions()
    {
        StringBuilder scriptTruncateTran = new StringBuilder();

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE Attendance ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE CASH_SKIMMING ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE CHECK_BOOK ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE CHEQUE_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE CHEQUE_PROCESS ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE CHEQUE_PROCESS_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE GL_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE GL_MASTER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE LEDGER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE PURCHASE_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE PURCHASE_MASTER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE RIMS_INVOICE_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE RIMS_INVOICE_MASTER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE SALE_INVOICE_CONSUMED ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE SALE_INVOICE_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE SKU_STOCK_REGISTER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE VENDOR_LEDGER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblSplitItemMaster ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblSplitItemDetail ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblTodayMenu ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblProductionPlanMaster ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblProductionPlanDetail ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblBOMIssuanceMaster ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblBOMIssuanceDetail ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE tblSaleInvoiceItemLog ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE Purchase_Order_Master ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE Purchase_Order_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE FRANCHISE_SALE_INVOICE_MASTER ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE FRANCHISE_SALE_INVOICE_DETAIL ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE KDS_HISTORY ");

        scriptTruncateTran.Append(Environment.NewLine);
        scriptTruncateTran.Append(" TRUNCATE TABLE SHIFT_CLOSE ");

        ExecuteScript(scriptTruncateTran.ToString());
    }
    private void DropConstraints()
    {
        StringBuilder scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER = new StringBuilder();
        StringBuilder scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER = new StringBuilder();
        StringBuilder sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL = new StringBuilder();
        StringBuilder sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster = new StringBuilder();

        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(" ALTER TABLE [dbo].[SALE_INVOICE_CONSUMED] DROP CONSTRAINT [FK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER] ");
        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        ExecuteScript(scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.ToString());


        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(" ALTER TABLE [dbo].[SALE_INVOICE_DETAIL] DROP CONSTRAINT [FK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER] ");
        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        ExecuteScript(scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.ToString());

        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] DROP CONSTRAINT [FK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL] ");
        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        ExecuteScript(sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.ToString());

        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] DROP CONSTRAINT [FK_tblRecipeProductionDetail_tblRecipeProductionMaster] ");
        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        ExecuteScript(sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.ToString());

    }
    private void TruncateConstraintTables()
    {
        StringBuilder scriptSaleInvoiceMasterTable = new StringBuilder();
        StringBuilder scriptRecipeProdMasterTable = new StringBuilder();
        StringBuilder scriptRecipeProdDetailTable = new StringBuilder();

        scriptSaleInvoiceMasterTable.Append(Environment.NewLine);
        scriptSaleInvoiceMasterTable.Append(" TRUNCATE TABLE SALE_INVOICE_MASTER ");
        ExecuteScript(scriptSaleInvoiceMasterTable.ToString());

        scriptRecipeProdMasterTable.Append(Environment.NewLine);
        scriptRecipeProdMasterTable.Append(" TRUNCATE TABLE tblRecipeProductionMaster ");
        ExecuteScript(scriptRecipeProdMasterTable.ToString());

        scriptRecipeProdDetailTable.Append(Environment.NewLine);
        scriptRecipeProdDetailTable.Append(" TRUNCATE TABLE tblRecipeProductionDetail ");
        ExecuteScript(scriptRecipeProdDetailTable.ToString());
    }
    private void AddConstraints()
    {
        StringBuilder scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER = new StringBuilder();
        StringBuilder scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER = new StringBuilder();
        StringBuilder sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL = new StringBuilder();
        StringBuilder sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster = new StringBuilder();

        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(" ALTER TABLE [dbo].[SALE_INVOICE_CONSUMED] ADD CONSTRAINT [FK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER] FOREIGN KEY ([SALE_INVOICE_ID]) REFERENCES [dbo].[SALE_INVOICE_MASTER]([SALE_INVOICE_ID]) ");
        scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        ExecuteScript(scriptFK_SALE_INVOICE_CONSUMED_SALE_INVOICE_MASTER.ToString());

        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(" ALTER TABLE [dbo].[SALE_INVOICE_DETAIL] ADD CONSTRAINT [FK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER] FOREIGN KEY ([SALE_INVOICE_ID]) REFERENCES [dbo].[SALE_INVOICE_MASTER]([SALE_INVOICE_ID]) ");
        scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.Append(Environment.NewLine);
        ExecuteScript(scriptFK_SALE_INVOICE_DETAIL_SALE_INVOICE_MASTER.ToString());

        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] ADD CONSTRAINT [FK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL] FOREIGN KEY ([FINISHED_GOOD_DETAIL_ID]) REFERENCES [dbo].[FINISHED_GOOD_DETAIL]([FINISHED_GOOD_DETAIL_ID]) ");
        sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        ExecuteScript(sciptFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.ToString());

        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] ADD CONSTRAINT [FK_tblRecipeProductionDetail_tblRecipeProductionMaster] FOREIGN KEY ([lngRecipeProductionCode]) REFERENCES [dbo].[tblRecipeProductionMaster]([lngRecipeProductionCode]) ");
        sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        ExecuteScript(sciptFK_tblRecipeProductionDetail_tblRecipeProductionMaster.ToString());
    }
    private List<string> ExecuteGetTableScript(string script)
    {
        List<string> list = new List<string>();
        try
        {
            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("USE " + txtDBName.Text.Trim() + script, con))
                {
                    using (IDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            list.Add(dr[0].ToString());
                        }
                    }
                }
                con.Close();
            }
            return list;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        string connString = conStringCorn;
        LoadLocations(true, connString);
    }
    public void LoadLocations(bool Select, string conString)
    {
        ddlLocation.Items.Clear();
        ListItem listCol = new ListItem();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME,(SELECT MAX(CLOSING_DATE) FROM DAILY_CLOSE WHERE DISTRIBUTOR_ID = D.DISTRIBUTOR_ID) AS WorkingDate FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        listCol = new ListItem();
                        listCol.Value = dr[0].ToString();
                        listCol.Text = dr[1].ToString() + '-' + dr[2].ToString();
                        ddlLocation.Items.Add(listCol);
                    }
                }
            }
            con.Close();
        }
    }
    protected void rblTruncateType_SelectedIndexChanged(object sender, EventArgs e)
    {
        if(rblTruncateType.SelectedValue == "1")
        {
            rowSingleLocation.Visible = true;
            rowWholeDB.Visible = false;
            btnUpdate.Text = "Truncate Single Location";
        }
        else
        {
            rowSingleLocation.Visible = false;
            rowWholeDB.Visible = true;
            btnUpdate.Text = "Truncate Whole Database";
        }
    }
    private void TruncateSingleLocationDate(int DistributorID)
    {
        StringBuilder scriptCASH_SKIMMINGTable = new StringBuilder();
        scriptCASH_SKIMMINGTable.Append(Environment.NewLine);
        scriptCASH_SKIMMINGTable.Append(" DELETE FROM CASH_SKIMMING WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptCASH_SKIMMINGTable.ToString());

        StringBuilder scriptCHEQUE_PROCESSTable = new StringBuilder();
        scriptCHEQUE_PROCESSTable.Append(Environment.NewLine);
        scriptCHEQUE_PROCESSTable.Append(" DELETE FROM CHEQUE_PROCESS WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptCHEQUE_PROCESSTable.ToString());

        StringBuilder scriptCHEQUE_PROCESS_DETAILTable = new StringBuilder();
        scriptCHEQUE_PROCESS_DETAILTable.Append(Environment.NewLine);
        scriptCHEQUE_PROCESS_DETAILTable.Append(" DELETE FROM CHEQUE_PROCESS_DETAIL WHERE CHEQUE_PROCESS_ID IN( SELECT CHEQUE_PROCESS_ID FROM CHEQUE_PROCESS WHERE DISTRIBUTOR_ID = " + DistributorID + ")");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptCHEQUE_PROCESS_DETAILTable.ToString());

        StringBuilder scriptDAILY_CLOSETable = new StringBuilder();
        scriptDAILY_CLOSETable.Append(Environment.NewLine);
        scriptDAILY_CLOSETable.Append(" DELETE FROM DAILY_CLOSE WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptDAILY_CLOSETable.ToString());

        StringBuilder scriptGL_DETAILTable = new StringBuilder();
        scriptGL_DETAILTable.Append(Environment.NewLine);
        scriptGL_DETAILTable.Append(" DELETE FROM GL_DETAIL WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptGL_DETAILTable.ToString());

        StringBuilder scriptGL_MASTERTable = new StringBuilder();
        scriptGL_MASTERTable.Append(Environment.NewLine);
        scriptGL_MASTERTable.Append(" DELETE FROM GL_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptGL_MASTERTable.ToString());

        StringBuilder scriptLEDGERTable = new StringBuilder();
        scriptLEDGERTable.Append(Environment.NewLine);
        scriptLEDGERTable.Append(" DELETE FROM LEDGER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptLEDGERTable.ToString());

        StringBuilder scriptVENDOR_LEDGERable = new StringBuilder();
        scriptVENDOR_LEDGERable.Append(Environment.NewLine);
        scriptVENDOR_LEDGERable.Append(" DELETE FROM VENDOR_LEDGER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptVENDOR_LEDGERable.ToString());

        DeletePurchaseDetail(DistributorID);

        StringBuilder scriptSKU_STOCK_REGISTERTable = new StringBuilder();
        scriptSKU_STOCK_REGISTERTable.Append(Environment.NewLine);
        scriptSKU_STOCK_REGISTERTable.Append(" DELETE FROM SKU_STOCK_REGISTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSKU_STOCK_REGISTERTable.ToString());

        StringBuilder scriptPURCHASE_MASTERTable = new StringBuilder();
        scriptPURCHASE_MASTERTable.Append(Environment.NewLine);
        scriptPURCHASE_MASTERTable.Append(" DELETE FROM PURCHASE_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptPURCHASE_MASTERTable.ToString());

        StringBuilder scriptSALE_INVOICE_CONSUMEDTable = new StringBuilder();
        scriptSALE_INVOICE_CONSUMEDTable.Append(Environment.NewLine);
        scriptSALE_INVOICE_CONSUMEDTable.Append(" DELETE FROM SALE_INVOICE_CONSUMED WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSALE_INVOICE_CONSUMEDTable.ToString());

        StringBuilder scriptSALE_INVOICE_DETAILTable = new StringBuilder();
        scriptSALE_INVOICE_DETAILTable.Append(Environment.NewLine);
        scriptSALE_INVOICE_DETAILTable.Append(" DELETE FROM SALE_INVOICE_DETAIL WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSALE_INVOICE_DETAILTable.ToString());

        StringBuilder scriptSALE_INVOICE_MASTERTable = new StringBuilder();
        scriptSALE_INVOICE_MASTERTable.Append(Environment.NewLine);
        scriptSALE_INVOICE_MASTERTable.Append(" DELETE FROM SALE_INVOICE_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSALE_INVOICE_MASTERTable.ToString());

        StringBuilder scriptSHIFT_CLOSETable = new StringBuilder();
        scriptSHIFT_CLOSETable.Append(Environment.NewLine);
        scriptSHIFT_CLOSETable.Append(" DELETE FROM SHIFT_CLOSE WHERE LOCATION_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSHIFT_CLOSETable.ToString());

        StringBuilder scriptSHIFT_OPENING_AMOUNTTable = new StringBuilder();
        scriptSHIFT_OPENING_AMOUNTTable.Append(Environment.NewLine);
        scriptSHIFT_OPENING_AMOUNTTable.Append(" DELETE FROM SHIFT_OPENING_AMOUNT WHERE[USER_ID] IN( SELECT[USER_ID] FROM DISTRIBUTOR_USER WHERE DISTRIBUTOR_ID = " + DistributorID + " ) ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSHIFT_OPENING_AMOUNTTable.ToString());

        StringBuilder scriptSTOCK_DEMAND_DETAILTable = new StringBuilder();
        scriptSTOCK_DEMAND_DETAILTable.Append(Environment.NewLine);
        scriptSTOCK_DEMAND_DETAILTable.Append(" DELETE FROM STOCK_DEMAND_DETAIL WHERE STOCK_DEMAND_ID IN( SELECT STOCK_DEMAND_ID FROM STOCK_DEMAND_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID + " ) ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSTOCK_DEMAND_DETAILTable.ToString());

        StringBuilder scriptSTOCK_DEMAND_MASTERTable = new StringBuilder();
        scriptSTOCK_DEMAND_MASTERTable.Append(Environment.NewLine);
        scriptSTOCK_DEMAND_MASTERTable.Append(" DELETE FROM STOCK_DEMAND_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptSTOCK_DEMAND_MASTERTable.ToString());

        StringBuilder scripttblSplitItemDetailTable = new StringBuilder();
        scripttblSplitItemDetailTable.Append(Environment.NewLine);
        scripttblSplitItemDetailTable.Append(" DELETE FROM tblSplitItemDetail WHERE lngSplitItemCode IN(SELECT lngSplitItemCode FROM tblSplitItemMaster WHERE DistributorID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblSplitItemDetailTable.ToString());

        StringBuilder scripttblSplitItemMasterTable = new StringBuilder();
        scripttblSplitItemMasterTable.Append(Environment.NewLine);
        scripttblSplitItemMasterTable.Append(" DELETE FROM tblSplitItemMaster WHERE DistributorID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblSplitItemMasterTable.ToString());

        StringBuilder scripttblTodayMenuTable = new StringBuilder();
        scripttblTodayMenuTable.Append(Environment.NewLine);
        scripttblTodayMenuTable.Append(" DELETE FROM tblTodayMenu WHERE intLocationID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblTodayMenuTable.ToString());

        StringBuilder scripttblProductionPlanDetailTable = new StringBuilder();
        scripttblProductionPlanDetailTable.Append(Environment.NewLine);
        scripttblProductionPlanDetailTable.Append(" DELETE FROM tblProductionPlanDetail WHERE lngProductionPlanCode IN(SELECT lngProductionPlanCode FROM tblProductionPlanMaster WHERE DistributorID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblProductionPlanDetailTable.ToString());

        StringBuilder scripttblProductionPlanMasterTable = new StringBuilder();
        scripttblProductionPlanMasterTable.Append(Environment.NewLine);
        scripttblProductionPlanMasterTable.Append(" DELETE FROM tblProductionPlanMaster WHERE DistributorID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblProductionPlanMasterTable.ToString());

        StringBuilder scripttblBOMIssuanceDetailTable = new StringBuilder();
        scripttblBOMIssuanceDetailTable.Append(Environment.NewLine);
        scripttblBOMIssuanceDetailTable.Append(" DELETE FROM tblBOMIssuanceDetail WHERE lngBOMIssuanceCode IN(SELECT lngBOMIssuanceCode FROM tblBOMIssuanceMaster WHERE DistributorID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblBOMIssuanceDetailTable.ToString());

        StringBuilder scripttblBOMIssuanceMasterTable = new StringBuilder();
        scripttblBOMIssuanceMasterTable.Append(Environment.NewLine);
        scripttblBOMIssuanceMasterTable.Append(" DELETE FROM tblBOMIssuanceMaster WHERE DistributorID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblBOMIssuanceMasterTable.ToString());

        StringBuilder scripttPurchase_Order_DetailTable = new StringBuilder();
        scripttPurchase_Order_DetailTable.Append(Environment.NewLine);
        scripttPurchase_Order_DetailTable.Append(" DELETE FROM Purchase_Order_Detail WHERE Purchase_Order_Master_ID IN(SELECT ID FROM Purchase_Order_Master WHERE DISTRIBUTOR_ID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttPurchase_Order_DetailTable.ToString());

        StringBuilder scriptPurchase_Order_MasterTable = new StringBuilder();
        scriptPurchase_Order_MasterTable.Append(Environment.NewLine);
        scriptPurchase_Order_MasterTable.Append(" DELETE FROM Purchase_Order_Master WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptPurchase_Order_MasterTable.ToString());

        StringBuilder scriptFRANCHISE_SALE_INVOICE_DETAILTable = new StringBuilder();
        scriptFRANCHISE_SALE_INVOICE_DETAILTable.Append(Environment.NewLine);
        scriptFRANCHISE_SALE_INVOICE_DETAILTable.Append(" DELETE FROM FRANCHISE_SALE_INVOICE_DETAIL WHERE FRANCHISE_MASTER_ID IN(SELECT FRANCHISE_MASTER_ID FROM FRANCHISE_SALE_INVOICE_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptFRANCHISE_SALE_INVOICE_DETAILTable.ToString());

        StringBuilder scriptFRANCHISE_SALE_INVOICE_MASTERTable = new StringBuilder();
        scriptFRANCHISE_SALE_INVOICE_MASTERTable.Append(Environment.NewLine);
        scriptFRANCHISE_SALE_INVOICE_MASTERTable.Append(" DELETE FROM FRANCHISE_SALE_INVOICE_MASTER WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptFRANCHISE_SALE_INVOICE_MASTERTable.ToString());

        StringBuilder scriptDropFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL = new StringBuilder();
        scriptDropFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        scriptDropFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] DROP CONSTRAINT [FK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL] ");
        scriptDropFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptDropFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.ToString());

        StringBuilder scriptDropFK_tblRecipeProductionDetail_tblRecipeProductionMaster = new StringBuilder();
        scriptDropFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        scriptDropFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] DROP CONSTRAINT [FK_tblRecipeProductionDetail_tblRecipeProductionMaster] ");
        scriptDropFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptDropFK_tblRecipeProductionDetail_tblRecipeProductionMaster.ToString());

        StringBuilder scripttblRecipeProductionDetailTable = new StringBuilder();
        scripttblRecipeProductionDetailTable.Append(Environment.NewLine);
        scripttblRecipeProductionDetailTable.Append(" DELETE FROM tblRecipeProductionDetail WHERE lngRecipeProductionCode IN(SELECT lngRecipeProductionCode FROM tblRecipeProductionMaster WHERE DISTRIBUTOR_ID = " + DistributorID + ") ");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblRecipeProductionDetailTable.ToString());

        StringBuilder scripttblRecipeProductionMasterTable = new StringBuilder();
        scripttblRecipeProductionMasterTable.Append(Environment.NewLine);
        scripttblRecipeProductionMasterTable.Append(" DELETE FROM tblRecipeProductionMaster WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scripttblRecipeProductionMasterTable.ToString());

        StringBuilder scriptKDS_HISTORYTable = new StringBuilder();
        scriptKDS_HISTORYTable.Append(Environment.NewLine);
        scriptKDS_HISTORYTable.Append(" DELETE FROM KDS_HISTORY WHERE DISTRIBUTOR_ID = " + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptKDS_HISTORYTable.ToString());

        StringBuilder scriptAddFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL = new StringBuilder();
        scriptAddFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        scriptAddFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] ADD CONSTRAINT [FK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL] FOREIGN KEY ([FINISHED_GOOD_DETAIL_ID]) REFERENCES [dbo].[FINISHED_GOOD_DETAIL]([FINISHED_GOOD_DETAIL_ID]) ");
        scriptAddFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.Append(Environment.NewLine);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptAddFK_tblRecipeProductionDetail_FINISHED_GOOD_DETAIL.ToString());

        StringBuilder scriptAddFK_tblRecipeProductionDetail_tblRecipeProductionMaster = new StringBuilder();
        scriptAddFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        scriptAddFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(" ALTER TABLE [dbo].[tblRecipeProductionDetail] ADD CONSTRAINT [FK_tblRecipeProductionDetail_tblRecipeProductionMaster] FOREIGN KEY ([lngRecipeProductionCode]) REFERENCES [dbo].[tblRecipeProductionMaster]([lngRecipeProductionCode]) ");
        scriptAddFK_tblRecipeProductionDetail_tblRecipeProductionMaster.Append(Environment.NewLine);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptAddFK_tblRecipeProductionDetail_tblRecipeProductionMaster.ToString());

        StringBuilder scriptDayClose = new StringBuilder();
        scriptDayClose.Append(Environment.NewLine);
        scriptDayClose.Append(" INSERT INTO DAILY_CLOSE(CLOSING_DATE,DISTRIBUTOR_ID,OPENING_CASH,TIME_STAMP) VALUES('" + Convert.ToDateTime(txtDate.Text).AddDays(-1).ToString("yyyy-MM-dd") + "'," + DistributorID + ",0,'" + System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')");
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptDayClose.ToString());

        StringBuilder scriptDayCloseTable = new StringBuilder();

        scriptDayCloseTable.Append(Environment.NewLine);
        scriptDayCloseTable.Append(" UPDATE SKU_PRICES SET DATE_EFFECTED = '" + Convert.ToDateTime(txtDate.Text).ToString("yyyy-MM-dd") + "' WHERE DISTRIBUTOR_ID=" + DistributorID);
        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptDayCloseTable.ToString());
    }
    private void ExecuteScript(string DBName, string script)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("USE " + DBName.Trim() + script, con))
                {
                    if (cmd.ExecuteNonQuery() > 0)
                    {
                    }
                }
                con.Close();
            }
        }
        catch (Exception ex)
        {
        }
    }
    private void ExecuteScript(string script)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("USE " + txtDBName.Text.Trim() + script, con))
                {
                    if (cmd.ExecuteNonQuery() > 0)
                    {
                    }
                }
                con.Close();
            }
        }
        catch (Exception ex)
        {
        }
    }
    private void DeletePurchaseDetail(int DistributorID)
    {
        StringBuilder scriptPURCHASE_DETAILTable = new StringBuilder();
        using (SqlConnection con = new SqlConnection(conStringCorn))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT PURCHASE_DETAIL_ID FROM PURCHASE_DETAIL WHERE DISTRIBUTOR_ID = " + DistributorID, ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        scriptPURCHASE_DETAILTable = new StringBuilder();
                        scriptPURCHASE_DETAILTable.Append(Environment.NewLine);
                        scriptPURCHASE_DETAILTable.Append(" DELETE FROM PURCHASE_DETAIL WHERE PURCHASE_DETAIL_ID = " + Convert.ToInt32(dr[0]));
                        ExecuteScript(ddlDB.SelectedItem.ToString(), scriptPURCHASE_DETAILTable.ToString());
                    }
                }
            }
            con.Close();
        }
    }
}