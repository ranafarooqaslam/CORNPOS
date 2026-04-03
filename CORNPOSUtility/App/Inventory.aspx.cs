using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class Inventory : System.Web.UI.Page
{
    string CryptographyKey = "b0tin@74";
    string conStringCorn = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDb(conStringCorn);
            LoadLocations(true, conStringCorn);
            DateTime dtDate = DateTime.Now.AddDays(-1);
            txtDate.Text = dtDate.ToString("dd-MMM-yyyy");            
        }
    }
    private void LoadDb(string conString)
    {
        List<string> list = new List<string>();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' ORDER BY name", con))
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
        lblError.Text = string.Empty;
        lblError.ForeColor = System.Drawing.Color.Green;
        bool flag = true;
        if (rblActionType.SelectedValue == "1")//Delete
        {
                if (DocumentDelete(Convert.ToInt32(rblType.SelectedItem.Value)))
                {
                    lblError.Text = rblType.SelectedItem.Text + " Deleted successfully.";
                }
                else
                {
                    flag = false;
                    lblError.ForeColor = System.Drawing.Color.Red;
                    lblError.Text = "Some error occured.";
                }
            
        }
        else//Edit
        {
            
        }
        if (flag)
        {
            LoadData(Convert.ToInt32(rblType.SelectedItem.Value));
            GetDocDetail();
        }
    }
    private bool DocumentDelete(int DocType)
    {
        DataTable dtPurchaseDetail = GetData(Convert.ToInt32(ddlLocation.SelectedValue), Convert.ToInt64(ddlRecord.SelectedValue), 10);
        StringBuilder sbPurchaseDetail = new StringBuilder();
        foreach (DataRow dr in dtPurchaseDetail.Rows)
        {
            sbPurchaseDetail = new StringBuilder();
            sbPurchaseDetail.Append(Environment.NewLine);
            sbPurchaseDetail.Append("DELETE FROM PURCHASE_DETAIL WHERE PURCHASE_DETAIL_ID = " + Convert.ToInt64(dr["PURCHASE_DETAIL_ID"]));
            if (!ExecuteScript(sbPurchaseDetail.ToString(), ddlDB.SelectedValue))
            {
                return false;
            }
            else
            {
                StockUpdate(txtDate.Text, Convert.ToInt32(dr["SKU_ID"]), Convert.ToInt32(ddlLocation.SelectedValue), Convert.ToInt32(dr["QUANTITY"]), DocType);
            }
        }

        StringBuilder sbPurchaseMaster = new StringBuilder();
        sbPurchaseMaster.Append(Environment.NewLine);
        sbPurchaseMaster.Append("DELETE FROM PURCHASE_MASTER WHERE PURCHASE_MASTER_ID = " + Convert.ToInt64(ddlRecord.SelectedValue));
        if (!ExecuteScript(sbPurchaseMaster.ToString(), ddlDB.SelectedValue))
        {
            return false;
        }
        if (DocType == 2)
        {
            StringBuilder sbVendorLedger = new StringBuilder();
            sbVendorLedger.Append(Environment.NewLine);
            sbVendorLedger.Append("UPDATE VENDOR_LEDGER SET IS_DELETED = 1 WHERE DOCUMENT_NO = " + Convert.ToInt64(ddlRecord.SelectedValue));
            if (!ExecuteScript(sbVendorLedger.ToString(), ddlDB.SelectedValue))
            {
                return false;
            }
        }

        StringBuilder sbGLMaster = new StringBuilder();
        sbGLMaster.Append(Environment.NewLine);
        sbGLMaster.Append("UPDATE GL_MASTER SET IS_DELETED = 1 WHERE INVOICE_TYPE = " + DocType + " AND INVOICE_ID = " + Convert.ToInt64(ddlRecord.SelectedValue));
        if (!ExecuteScript(sbGLMaster.ToString(), ddlDB.SelectedValue))
        {
            return false;
        }
        return true;
    }
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        string connString = conStringCorn;
        LoadLocations(true, connString);
        LoadData(Convert.ToInt32(rblType.SelectedItem.Value));
        GetDocDetail();
    }
    public void LoadLocations(bool Select, string conString)
    {
        ddlLocation.Items.Clear();
        ListItem listCol = new ListItem();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        listCol = new ListItem();
                        listCol.Value = dr[0].ToString();
                        listCol.Text = dr[1].ToString();
                        ddlLocation.Items.Add(listCol);
                    }
                }
            }
            con.Close();
        }
    }
    private bool ExecuteScript(string script, string DatabaseName)
    {
        bool flag = true;
        try
        {
            string conString = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
            using (SqlConnection con = new SqlConnection(conString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("USE " + DatabaseName + script, con))
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
            flag = false;
        }
        return flag;
    }

    protected void btnLoad_Click(object sender, EventArgs e)
    {
        LoadData(Convert.ToInt32(rblType.SelectedItem.Value));
        GetDocDetail();
    }    

    private void LoadData(int DocType)
    {
        StringBuilder sbQuery = new StringBuilder();
        sbQuery.Append("SELECT ");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("PM.PURCHASE_MASTER_ID");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append(",PM.TOTAL_AMOUNT");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append(",SH.SKU_HIE_NAME AS SupplierName");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("FROM PURCHASE_MASTER PM");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("LEFT OUTER JOIN SKU_HIERARCHY SH ON SH.SKU_HIE_ID = PM.PRINCIPAL_ID");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("WHERE PM.DISTRIBUTOR_ID = " + ddlLocation.SelectedValue);
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("AND PM.[TYPE_ID] = " + DocType);
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("AND PM.DOCUMENT_DATE = '" + txtDate.Text+ "'");

        ddlRecord.Items.Clear();
        ListItem listCol = new ListItem();
        using (SqlConnection con = new SqlConnection(conStringCorn))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} " +sbQuery.ToString() +  "", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        listCol = new ListItem();
                        listCol.Value = dr[0].ToString();
                        listCol.Text = dr[0].ToString() + "-" + dr[2].ToString() + "-" + dr[1].ToString();
                        ddlRecord.Items.Add(listCol);
                    }
                }
            }
            con.Close();
        }        
    }

    protected void rblType_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadData(Convert.ToInt32(rblType.SelectedItem.Value));
        GetDocDetail();
        rblActionType_SelectedIndexChanged(null, null);
    }

    protected void ddlLocation_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadData(Convert.ToInt32(rblType.SelectedItem.Value));
        GetDocDetail();
    }

    protected void ddlRecord_SelectedIndexChanged(object sender, EventArgs e)
    {
        GetDocDetail();
    }

    protected void rblActionType_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (rblActionType.SelectedItem.Value == "1")
        {
            btnUpdate.Text = "Delete " + rblType.SelectedItem.Text;
            gvInvoice.Visible = false;
        }
        else
        {
            btnUpdate.Text = "Update " + rblType.SelectedItem.Text;
            gvInvoice.Visible = true;
            GetDocDetail();
        }
    }

    public DataTable GetData(int SelectedLocation, long pDocumentID, int pTypeID)
    {
        string conString2 = "server=" + System.Configuration.ConfigurationManager.AppSettings["server"].ToString()
            + ";uid=" + System.Configuration.ConfigurationManager.AppSettings["uid"].ToString()
            + ";pwd=" + System.Configuration.ConfigurationManager.AppSettings["pwd"].ToString()
            + ";database=" + ddlDB.SelectedValue;
        DataSet ds = new DataSet();
        try
        {

            using (SqlConnection con = new SqlConnection(conString2))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.CommandText = "uspGetDataUtility";
                    cmd.CommandType = CommandType.StoredProcedure;

                    IDataParameterCollection pparams = cmd.Parameters;

                    IDataParameter parameter = new SqlParameter() { ParameterName = "@DISTRIBUTOR_ID", DbType = DbType.Int32, Value = SelectedLocation };
                    pparams.Add(parameter);

                    parameter = new SqlParameter() { ParameterName = "@TypeID", DbType = DbType.Int32, Value = pTypeID };
                    pparams.Add(parameter);

                    parameter = new SqlParameter() { ParameterName = "@DocumentID", DbType = DbType.Int64, Value = pDocumentID };
                    pparams.Add(parameter);

                    IDbDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(ds);
                    return ds.Tables[0];
                }
                con.Close();
            }
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private void StockUpdate(string StockDate, int SKU_ID, int DistributorID, int Qty, int DocType)
    {
        StringBuilder sbQuery = new StringBuilder();
        StringBuilder sbQuery2 = new StringBuilder();
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("UPDATE SKU_STOCK_REGISTER");
        sbQuery.Append(Environment.NewLine);
        if (DocType == 2)
        {
            sbQuery.Append("SET CLOSING_STOCK = CLOSING_STOCK - " + Qty);
        }
        else if (DocType == 5)
        {
            sbQuery.Append("SET CLOSING_STOCK = CLOSING_STOCK + " + Qty);
        }
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("WHERE STOCK_DATE = '" + StockDate + "'");
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("AND SKU_ID = " + SKU_ID);
        sbQuery.Append(Environment.NewLine);
        sbQuery.Append("AND DISTRIBUTOR_ID = " + DistributorID);

        ExecuteScript(sbQuery.ToString(), ddlDB.SelectedValue);

        sbQuery2.Append(Environment.NewLine);
        sbQuery2.Append("UPDATE SKU_STOCK_REGISTER");
        sbQuery2.Append(Environment.NewLine);
        if (DocType == 2)
        {
            sbQuery2.Append("SET OPENING_STOCK = OPENING_STOCK - " + Qty + ",CLOSING_STOCK = CLOSING_STOCK - " + Qty);
        }
        else if (DocType == 5)
        {
            sbQuery2.Append("SET OPENING_STOCK = OPENING_STOCK + " + Qty + ",CLOSING_STOCK = CLOSING_STOCK + " + Qty);
        }

        sbQuery2.Append(Environment.NewLine);
        sbQuery2.Append("WHERE STOCK_DATE > '" + StockDate + "'");
        sbQuery2.Append(Environment.NewLine);
        sbQuery2.Append("AND SKU_ID = " + SKU_ID);
        sbQuery2.Append(Environment.NewLine);
        sbQuery2.Append("AND DISTRIBUTOR_ID = " + DistributorID);

        ExecuteScript(sbQuery2.ToString(), ddlDB.SelectedValue);
    }

    private void GetDocDetail()
    {

        if (ddlRecord.Items.Count > 0)
        {
            DataTable dtDetail = GetData(Convert.ToInt32(ddlLocation.SelectedValue), Convert.ToInt64(ddlRecord.SelectedValue), 10);
            gvInvoice.DataSource = dtDetail;
            gvInvoice.DataBind();
        }
    }
    protected void gvInvoice_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TextBox txtQuantity = (TextBox)e.Row.Cells[4].FindControl("txtQuantity");
            TextBox txtPrice = (TextBox)e.Row.Cells[5].FindControl("txtPrice");
            txtQuantity.Text = e.Row.Cells[1].Text;
            txtPrice.Text = e.Row.Cells[2].Text;
        }
    }
}