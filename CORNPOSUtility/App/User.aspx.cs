using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class User : System.Web.UI.Page
{
    string conStringCorn = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDb();
            LoadUsers();
        }
    }
    private void LoadDb()
    {
        string connString = conStringCorn;
        List<string> list = new List<string>();
        using (SqlConnection con = new SqlConnection(connString))
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
    public void LoadUsers()
    {
        gvUser.DataSource = null;
        gvUser.DataBind();
        DataTable dtLocation = new DataTable();
        using (SqlConnection con = new SqlConnection(conStringCorn))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT USER_ID,LOGIN_ID + '-' + PASSWORD AS LOGIN_ID,ISNULL(IsMobileInsightAllowed,0) AS IsMobileInsightAllowed,ISNULL(CanVoidGST,0) AS CanVoidGST,ISNULL(ShowDatesOnPOSReports,0) AS ShowDatesOnPOSReports, ISNULL(CanTaxIntegrate,1) AS CanTaxIntegrate FROM [USER]", ddlDB.SelectedValue), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    dtLocation.Load(dr);
                }
            }
            con.Close();
        }
        gvUser.DataSource = dtLocation;
        gvUser.DataBind();

    }
    protected void btnUpdate_Click(object sender, EventArgs e)
    {
        lblError.Text = string.Empty;
        int count = 0;
        int IsMobileInsightAllowed = 0;
        int CanVoidGST = 0;
        int ShowDatesOnPOSReports = 0;
        int CanTaxIntegrate = 0;
        foreach (GridViewRow gvr in gvUser.Rows)
        {
            IsMobileInsightAllowed = 0;
            CanVoidGST = 0;
            ShowDatesOnPOSReports = 0;
            CanTaxIntegrate = 0;
            CheckBox cbMobile = (CheckBox)gvr.Cells[3].FindControl("cbMobile");
            CheckBox cbVoidGST = (CheckBox)gvr.Cells[4].FindControl("cbVoidGST");
            CheckBox cbShowDatesOnPOSReports = (CheckBox)gvr.Cells[5].FindControl("cbShowDatesOnPOSReports");
            CheckBox cbCanTaxIntegrate = (CheckBox)gvr.Cells[8].FindControl("cbCanTaxIntegrate");

            if (cbMobile.Checked)
            {
                IsMobileInsightAllowed = 1;
            }
            if (cbVoidGST.Checked)
            {
                CanVoidGST = 1;
            }
            if(cbShowDatesOnPOSReports.Checked)
            {
                ShowDatesOnPOSReports = 1;
            }
            if(cbCanTaxIntegrate.Checked)
            {
                CanTaxIntegrate = 1;
            }
            try
            {
                string connString = conStringCorn;
                using (SqlConnection con = new SqlConnection(connString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE [USER] SET IsMobileInsightAllowed = " + IsMobileInsightAllowed  + ",CanVoidGST= " + CanVoidGST + ",ShowDatesOnPOSReports= " + ShowDatesOnPOSReports + ",CanTaxIntegrate= " + CanTaxIntegrate + " WHERE [USER_ID] = " + gvr.Cells[0].Text, ddlDB.SelectedValue), con))
                    {
                        if (cmd.ExecuteNonQuery() > 0)
                        {
                            count++;
                        }
                    }

                    con.Close();
                }
            }
            catch (Exception ex)
            {
                break;
            }
        }

        if (count > 0)
        {
            lblError.ForeColor = System.Drawing.Color.Green;
            lblError.Text = "User(s) updated successfully.";
        }
    }
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadUsers();
    }
    protected void gvUser_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            CheckBox cbMobile = (CheckBox)e.Row.Cells[3].FindControl("cbMobile");
            CheckBox cbVoidGST = (CheckBox)e.Row.Cells[4].FindControl("cbVoidGST");
            CheckBox cbShowDatesOnPOSReports = (CheckBox)e.Row.Cells[5].FindControl("cbShowDatesOnPOSReports");
            CheckBox cbCanTaxIntegrate = (CheckBox)e.Row.Cells[8].FindControl("cbCanTaxIntegrate");
            cbMobile.Checked = Convert.ToBoolean(e.Row.Cells[5].Text);
            cbVoidGST.Checked = Convert.ToBoolean(e.Row.Cells[6].Text);
            cbShowDatesOnPOSReports.Checked = Convert.ToBoolean(e.Row.Cells[7].Text);
            cbCanTaxIntegrate.Checked = Convert.ToBoolean(e.Row.Cells[9].Text);
        }
    }
}