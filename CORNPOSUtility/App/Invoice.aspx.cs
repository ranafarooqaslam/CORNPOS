using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class Invoice : System.Web.UI.Page
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
            CEEndDate.SelectedDate = Convert.ToDateTime(txtDate.Text);
            LoadInvoice();
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
        int count = 0;
        string strQuery = string.Empty;
        foreach (GridViewRow gvr in gvInvoice.Rows)
        {
            strQuery = string.Empty;
            CheckBox cbInvocie = (CheckBox)gvr.Cells[0].FindControl("cbInvocie");
            if (cbInvocie.Checked)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(conStringCorn))
                    {
                        if (rblType.SelectedItem.Value == "1")
                        {
                            strQuery = string.Format("USE {0} UPDATE SALE_INVOICE_MASTER SET IS_ACTIVE = 0,LASTUPDATE_DATE = '" + System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff") + "' WHERE SALE_INVOICE_ID=" + Convert.ToInt64(gvr.Cells[1].Text) + " UPDATE GL_MASTER SET IS_DELETED = 1 WHERE INVOICE_TYPE = 13 AND INVOICE_ID = " + Convert.ToInt64(gvr.Cells[1].Text) + " UPDATE [LEDGER] SET IS_DELETED = 1 WHERE DOCUMENT_NO = " + Convert.ToInt64(gvr.Cells[1].Text), ddlDB.SelectedItem);
                        }
                        else if (rblType.SelectedItem.Value == "2")
                        {
                            if (txtNewDate.Text.Length > 0)
                            {
                                strQuery = string.Format("USE {0} UPDATE SALE_INVOICE_MASTER SET DOCUMENT_DATE = '" + Convert.ToDateTime(txtNewDate.Text).ToString("yyyy-MM-dd") + "' ,LASTUPDATE_DATE = '" + System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff") + "' WHERE SALE_INVOICE_ID=" + Convert.ToInt64(gvr.Cells[1].Text) + " UPDATE GL_MASTER SET VOUCHER_DATE = '" + Convert.ToDateTime(txtNewDate.Text).ToString("yyyy-MM-dd") + "' WHERE INVOICE_TYPE = 13 AND INVOICE_ID = " + Convert.ToInt64(gvr.Cells[1].Text) + " UPDATE [LEDGER] SET LEDGER_DATE = '" + Convert.ToDateTime(txtNewDate.Text).ToString("yyyy-MM-dd") + "' WHERE DOCUMENT_NO = " + Convert.ToInt64(gvr.Cells[1].Text), ddlDB.SelectedItem);
                            }
                        }
                        if (strQuery.Length > 0)
                        {
                            con.Open();
                            using (SqlCommand cmd = new SqlCommand(strQuery, con))
                            {
                                if (cmd.ExecuteNonQuery() > 0)
                                {
                                    count++;
                                }
                            }
                            con.Close();
                        }
                    }
                }
                catch (Exception ex)
                {
                    break;
                }
            }
        }
        if(count > 0)
        {
            lblError.ForeColor = System.Drawing.Color.Green;
            if(rblType.SelectedItem.Value == "1")
            {
                lblError.Text = "Selected Invoice(s) rollbacked successfully.";
            }
            else
            {
                lblError.Text = "Selected Invoice(s) Date changed successfully.";
            }
            LoadInvoice();
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }    
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        string connString = conStringCorn;
        LoadLocations(true, connString);
        LoadInvoice();
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

    protected void btnLoad_Click(object sender, EventArgs e)
    {        
        LoadInvoice();
    }    
    private void LoadInvoice()
    {
        if (ddlLocation.Items.Count > 0)
        {
            gvInvoice.DataSource = null;
            gvInvoice.DataBind();
            DataTable dtLocation = new DataTable();
            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT SALE_INVOICE_ID,InvoiceNo,AMOUNTDUE FROM SALE_INVOICE_MASTER WHERE IS_ACTIVE = 1 AND IS_HOLD = 0 AND DISTRIBUTOR_ID = " + ddlLocation.SelectedItem.Value + " AND DOCUMENT_DATE = '" + Convert.ToDateTime(txtDate.Text).ToString("yyyy-MM-dd") + "'", ddlDB.SelectedItem), con))
                {
                    using (IDataReader dr = cmd.ExecuteReader())
                    {
                        dtLocation.Load(dr);
                    }
                }
                con.Close();
            }
            gvInvoice.DataSource = dtLocation;
            gvInvoice.DataBind();
        }
    }

    protected void rblType_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtNewDate.Visible = false;
        lblNewDate.Visible = false;
        btnUpdate.Text = "Rollback Invocie";
        if(rblType.SelectedItem.Value == "2")
        {
            btnUpdate.Text = "Change Date";
            txtNewDate.Visible = true;
            lblNewDate.Visible = true;
        }
    }

    protected void ddlLocation_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadInvoice();
    }
}