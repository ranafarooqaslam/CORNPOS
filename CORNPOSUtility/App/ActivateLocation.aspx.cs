using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class ActivateLocation : System.Web.UI.Page
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
        int count = 0;

        foreach (ListItem li in cblLocation.Items)
        {
            if (li.Selected)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(connString))
                    {
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} INSERT INTO DAILY_CLOSE (CLOSING_DATE,DISTRIBUTOR_ID,OPENING_CASH,TIME_STAMP) VALUES( '" + Convert.ToDateTime(txtDate.Text).ToString("yyyy-MM-dd") + "'," + li.Value + ",0,'" + DateTime.Now.ToString() + "')", ddlDB.SelectedItem), con))
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
        }
        if (count > 0)
        {
            lblError.ForeColor = System.Drawing.Color.Green;
            lblError.Text = "Location(s) activated successfully.";
            LoadLocations(false, connString);
            cbAll.Checked = false;
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
    }
    public void LoadLocations(bool Select, string conString)
    {
        cblLocation.Items.Clear();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME FROM DISTRIBUTOR D WHERE D.DISTRIBUTOR_ID NOT IN (SELECT DISTRIBUTOR_ID FROM DAILY_CLOSE)", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        ListItem li = new ListItem();
                        li.Value = dr[0].ToString();
                        li.Text = dr[1].ToString();
                        li.Selected = Select;
                        cblLocation.Items.Add(li);
                    }
                }
            }
            con.Close();
        }
        cblLocation.DataTextField = "Text";
        cblLocation.DataValueField = "Value";
        cbAll.Checked = true;
    }
}