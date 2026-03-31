using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web.UI.WebControls;

public partial class Default : System.Web.UI.Page
{
    string CryptographyKey = "b0tin@74";
    string conStringCorn = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDb(conStringCorn);
            LoadLocations(true, conStringCorn);
            SetDate();
            LoadMenu();
            if (Session["UserID"] != null)
            {
                rowLogin.Visible = false;
                rowLicense.Visible = true;
            }
        }
    }
    private void SetDate()
    {
        switch (rblType.SelectedValue)
        {
            case "1":
                DateTime dtMonthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                DateTime dtLicenseDate = dtMonthStart.AddMonths(1).AddDays(19);
                if (DateTime.Now < dtMonthStart.AddDays(19))
                {
                    dtLicenseDate = dtMonthStart.AddDays(19);
                }
                txtDate.Text = dtLicenseDate.ToString("dd-MMM-yyyy");
                CEEndDate.SelectedDate = Convert.ToDateTime(txtDate.Text);
                break;
            case "2":
                DateTime dtDayClose = DateTime.Now.AddDays(-1);
                txtDate.Text = dtDayClose.ToString("dd-MMM-yyyy");
                CEEndDate.SelectedDate = Convert.ToDateTime(txtDate.Text);
                break;
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
        switch(rblType.SelectedValue)
        {
            case "1":
                UpdateLicense();
                break;
            case "2":
                ActivateLocation();
                break;
            case "3":
                UpdateInvoiceFooter();
                break;
            case "4":
                UpdateGSTNTNLabel();
                break;
            case "5":
                UpdateMenu();
                break;
            case "6":
                DeleteKOTs();
                break;
            case "7":
                InsertPrices();
                break;
        }
    }
    private void UpdateMenu()
    {
        int count = 0;
        lblError.Text = string.Empty;
        StringBuilder sbScript = new StringBuilder();
        foreach (ListItem li in cblMenu.Items)
        {
            if(li.Selected)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(conStringCorn))
                    {
                        string IDs = "";
                        if (li.Value == "28")
                        {
                            IDs = "IN (28,52)";
                        }
                        else if (li.Value == "29")
                        {
                            IDs = "IN (29,51)";
                        }
                        else if (li.Value == "32")
                        {
                            IDs = "IN (32,53)";
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("UPDATE tblAppSettingDetail");
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("SET strColumnValue = '1'");
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("WHERE strColumnName = 'IsFinanceIntegrate'");
                        }
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE MODULE SET IS_ACTIVE = 1 WHERE MODULE_ID " + IDs + sbScript.ToString(), ddlDB.SelectedItem), con))
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
            else
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(conStringCorn))
                    {
                        string IDs = "";
                        if (li.Value == "28")
                        {
                            IDs = "IN (28,52)";
                        }
                        else if (li.Value == "29")
                        {
                            IDs = "IN (29,51)";
                        }
                        else if (li.Value == "32")
                        {
                            IDs = "IN (32,53)";
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("UPDATE tblAppSettingDetail");
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("SET strColumnValue = '0'");
                            sbScript.Append(Environment.NewLine);
                            sbScript.Append("WHERE strColumnName = 'IsFinanceIntegrate'");
                        }
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE MODULE SET IS_ACTIVE = 0 WHERE [MODULE_ID] " + IDs + sbScript.ToString(), ddlDB.SelectedItem), con))
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
            lblError.Text = "Menu updated successfully.";            
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void UpdateLicense()
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
                        using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE DISTRIBUTOR SET LICENSE_DATE = '" + Encrypt(Convert.ToDateTime(txtDate.Text).ToString("yyyy-MM-dd"), CryptographyKey) + "' WHERE DISTRIBUTOR_ID=" + li.Value, ddlDB.SelectedItem), con))
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
            lblError.Text = "License update for selected Location(s)";
            switch(rblType.SelectedValue)
            {
                case "1":
                    LoadLocations(false, connString);
                    break;
                case "2":
                    LoadLocationsInactive(false, connString);
                    break;
                case "3":
                    LoadLocationsGridView(connString);
                    break;
                case "4":
                    LoadLocationsGridView2(connString);
                    break;
                case "5":
                    LoadMenu();
                    break;
            }
            cbAll.Checked = false;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void ActivateLocation()
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
            LoadLocationsInactive(false, connString);
            cbAll.Checked = false;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void UpdateInvoiceFooter()
    {
        string connString = conStringCorn;
        lblError.Text = string.Empty;
        int count = 0;
        
        foreach(GridViewRow gvr in gvLocation.Rows)
        {
            int LocationID = Convert.ToInt32(gvr.Cells[0].Text);
            RadioButtonList rb = (RadioButtonList)gvr.FindControl("rbType");
            int InvoiceGSTFooter = Convert.ToInt32(rb.SelectedValue);
            try
            {
                using (SqlConnection con = new SqlConnection(connString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE DISTRIBUTOR SET InvoiceGSTFooter = " + InvoiceGSTFooter + " WHERE DISTRIBUTOR_ID=" + LocationID, ddlDB.SelectedItem), con))
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
            lblError.Text = "Invoice Footer Format updated successfully.";
            switch (rblType.SelectedValue)
            {
                case "1":
                    LoadLocations(false, connString);
                    break;
                case "2":
                    LoadLocationsInactive(false, connString);
                    break;
                case "3":
                    LoadLocationsGridView(connString);
                    break;
                case "4":
                    LoadLocationsGridView2(connString);
                    break;
                case "5":
                    LoadMenu();
                    break;
            }
            cbAll.Checked = false;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void UpdateGSTNTNLabel()
    {
        string connString = conStringCorn;
        lblError.Text = string.Empty;
        int count = 0;

        foreach (GridViewRow gvr in gvLocation2.Rows)
        {
            int LocationID = Convert.ToInt32(gvr.Cells[0].Text);
            TextBox txtGST = (TextBox)gvr.FindControl("txtGST");
            TextBox txtNTN = (TextBox)gvr.FindControl("txtNTN");
            string GSTLabel = string.Empty;
            string NTNLabel = string.Empty;
            if(txtGST.Text != "0")
            {
                GSTLabel = txtGST.Text;
            }
            if (txtNTN.Text != "0")
            {
                NTNLabel = txtNTN.Text;
            }
            try
            {
                using (SqlConnection con = new SqlConnection(connString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE DISTRIBUTOR SET TAX_AUTHORITY = '" + GSTLabel + "', TAX_AUTHORITY2 = '" + NTNLabel + "' WHERE DISTRIBUTOR_ID=" + LocationID, ddlDB.SelectedItem), con))
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
            lblError.Text = "Invoice Footer Format updated successfully.";
            switch (rblType.SelectedValue)
            {
                case "1":
                    LoadLocations(false, connString);
                    break;
                case "2":
                    LoadLocationsInactive(false, connString);
                    break;
                case "3":
                    LoadLocationsGridView(connString);
                    break;
                case "4":
                    LoadLocationsGridView2(connString);
                    break;
                case "5":
                    LoadMenu();
                    break;
            }
            cbAll.Checked = false;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void DeleteKOTs()
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
                        using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} DELETE FROM tblKOTDetail WHERE LocationID=" + li.Value, ddlDB.SelectedItem), con))
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
            lblError.Text = "Kots deleted of selected Location(s)";
            switch (rblType.SelectedValue)
            {
                case "1":
                    LoadLocations(false, connString);
                    break;
                case "2":
                    LoadLocationsInactive(false, connString);
                    break;
                case "3":
                    LoadLocationsGridView(connString);
                    break;
                case "4":
                    LoadLocationsGridView2(connString);
                    break;
                case "5":
                    LoadMenu();
                    break;
                case "6":
                    LoadLocations(false, connString);
                    break;
            }
            cbAll.Checked = false;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void InsertPrices()
    {
        if (ddlFrom.SelectedValue != ddlTo.SelectedValue)
        {
            try
            {
                DataTable dtResult = GetData(Convert.ToInt32(ddlFrom.SelectedValue), Convert.ToInt64(ddlTo.SelectedValue), 9);
                if (dtResult.Rows.Count > 0)
                {
                    if(dtResult.Rows[0]["Result"].ToString() == "0")
                    {
                        lblError.ForeColor = System.Drawing.Color.Red;
                        lblError.Text = "Entry found in Stock Register Table for " + ddlTo.SelectedItem.Text;
                    }
                    else if (dtResult.Rows[0]["Result"].ToString() == "2")
                    {
                        lblError.ForeColor = System.Drawing.Color.Red;
                        lblError.Text = "Day Close entry not found for " + ddlTo.SelectedItem.Text;
                    }
                    else
                    {
                        lblError.ForeColor = System.Drawing.Color.Green;
                        lblError.Text = "Prices inserted successfully!";
                    }
                }
                else
                {
                    lblError.ForeColor = System.Drawing.Color.Red;
                    lblError.Text = "Some error occured.";
                }
            }
            catch (Exception ex)
            {
                lblError.ForeColor = System.Drawing.Color.Red;
                lblError.Text = ex.Message;
            }
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "From Location & To Location must not be same.";
        }
    }
    public static string Encrypt(string PlainText, string Key)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(Key);
        byte[] rgbIV = Encoding.UTF8.GetBytes(Key);

        byte[] buffer = Encoding.UTF8.GetBytes(PlainText);
        MemoryStream stream = new MemoryStream();
        try
        {
            DES des = new DESCryptoServiceProvider();
            CryptoStream stream2 = new CryptoStream(stream, des.CreateEncryptor(bytes, rgbIV), CryptoStreamMode.Write);
            stream2.Write(buffer, 0, buffer.Length);
            stream2.FlushFinalBlock();
        }
        catch (Exception ex)
        {

        }
        return Convert.ToBase64String(stream.ToArray());
    }
    public static string Decrypt(string EncryptedText, string Key)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(Key);
        byte[] rgbIV = Encoding.UTF8.GetBytes(Key);

        byte[] buffer = Convert.FromBase64String(EncryptedText);
        MemoryStream stream = new MemoryStream();
        try
        {
            DES des = new DESCryptoServiceProvider();
            CryptoStream stream2 = new CryptoStream(stream, des.CreateDecryptor(bytes, rgbIV), CryptoStreamMode.Write);
            stream2.Write(buffer, 0, buffer.Length);
            stream2.FlushFinalBlock();
        }
        catch (Exception ex)
        {

        }



        return Encoding.UTF8.GetString(stream.ToArray());
    }
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        switch (rblType.SelectedValue)
        {
            case "1":
                LoadLocations(true, conStringCorn);
                break;
            case "2":
                LoadLocationsInactive(true, conStringCorn);
                break;
            case "3":
                LoadLocationsGridView(conStringCorn);
                break;
            case "4":
                LoadLocationsGridView2(conStringCorn);
                break;
            case "5":
                LoadMenu();
                break;
            case "6":
                LoadLocations(true, conStringCorn);
                break;
            case "7":
                LoadPriceLocations(conStringCorn);
                break;
        }
    }
    public void LoadLocations(bool Select,string conString)
    {
        cblLocation.Items.Clear();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME,D.LICENSE_DATE FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        if (rblType.SelectedValue == "1")
                        {
                            ListItem li = new ListItem();
                            li.Value = dr[0].ToString();
                            if (dr[2].ToString().Length > 0)
                            {
                                li.Text = dr[1].ToString() + "-" + Convert.ToDateTime(Decrypt(dr[2].ToString(), CryptographyKey)).ToString("dd-MMM-yyyy");
                            }
                            else
                            {
                                li.Text = dr[1].ToString() + "-" + DateTime.Now.ToString("dd-MMM-yyyy");
                            }
                            li.Selected = Select;
                            cblLocation.Items.Add(li);
                        }
                        else
                        {
                            ListItem li = new ListItem();
                            li.Value = dr[0].ToString();
                            li.Text = dr[1].ToString();                            
                            li.Selected = Select;
                            cblLocation.Items.Add(li);
                        }
                    }
                }
            }
            con.Close();
        }
        cblLocation.DataTextField = "Text";
        cblLocation.DataValueField = "Value";
        cbAll.Checked = true;
    }
    public void LoadPriceLocations(string conString)
    {
        ddlFrom.Items.Clear();
        ddlTo.Items.Clear();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME,D.LICENSE_DATE FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        ListItem li = new ListItem();
                        li.Value = dr[0].ToString();
                        li.Text = dr[1].ToString();
                        ddlFrom.Items.Add(li);
                        ddlTo.Items.Add(li);
                    }
                }
            }
            con.Close();
        }
        ddlFrom.DataTextField = "Text";
        ddlFrom.DataValueField = "Value";

        ddlTo.DataTextField = "Text";
        ddlTo.DataValueField = "Value";
    }
    public void LoadLocationsGridView(string conString)
    {
        gvLocation.DataSource = null;
        gvLocation.DataBind();
        DataTable dtLocation = new DataTable();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME,ISNULL(InvoiceGSTFooter,0) AS InvoiceGSTFooter FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    dtLocation.Load(dr);
                }
            }
            con.Close();
        }
        gvLocation.DataSource = dtLocation;
        gvLocation.DataBind();
    }
    public void LoadLocationsGridView2(string conString)
    {
        gvLocation2.DataSource = null;
        gvLocation2.DataBind();
        DataTable dtLocation = new DataTable();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT D.DISTRIBUTOR_ID,D.DISTRIBUTOR_NAME,TAX_AUTHORITY,TAX_AUTHORITY2 FROM DISTRIBUTOR D WHERE D.ISDELETED = 0", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    dtLocation.Load(dr);
                }
            }
            con.Close();
        }
        foreach(DataRow dr in dtLocation.Rows)
        {
            if(dr["TAX_AUTHORITY"].ToString().Length == 0)
            {
                dr["TAX_AUTHORITY"] = "0";
            }
            if (dr["TAX_AUTHORITY2"].ToString().Length == 0)
            {
                dr["TAX_AUTHORITY2"] = "0";
            }
        }
        gvLocation2.DataSource = dtLocation;
        gvLocation2.DataBind();
    }
    public void LoadLocationsInactive(bool Select, string conString)
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
    protected void btnLogin_Click(object sender, EventArgs e)
    {
        if(txtUser.Text == "mypos" && txtPass.Text == "pos++")
        {            
            Session.Add("UserID", 1);
            Response.Redirect(Request.RawUrl);
        }
        else if (txtUser.Text == "support" && txtPass.Text == "jayho")
        {
            Session.Add("UserID", 2);
            Response.Redirect(Request.RawUrl);
        }
    }
    protected void rblType_SelectedIndexChanged(object sender, EventArgs e)
    {
        divButton.Visible = true;
        cbAll.Visible = true;
        cblLocation.Visible = true;
        gvLocation.Visible = false;
        gvLocation2.Visible = false;
        cblMenu.Visible = false;
        dvPrices.Visible = false;
        cblLocation.Visible = true;
        cbAll.Visible = true;
        SetDate();
        switch (rblType.SelectedValue)
        {
            case "1":
                lblDate.Text = "Select Date";
                btnUpdate.Text = "Update License";
                LoadLocations(true, conStringCorn);
                break;
            case "2":
                lblDate.Text = "Select Day Close";
                btnUpdate.Text = "Activate Location";
                LoadLocationsInactive(true, conStringCorn);
                break;
            case "3":
                btnUpdate.Text = "Update Invocie Footer";
                LoadLocationsGridView(conStringCorn);
                divButton.Visible = false;
                cbAll.Visible = false;
                cblLocation.Visible = false;
                gvLocation.Visible = true;
                break;
            case "4":
                btnUpdate.Text = "Update GST-NTN Label";
                LoadLocationsGridView2(conStringCorn);
                divButton.Visible = false;
                cbAll.Visible = false;
                cblLocation.Visible = false;
                gvLocation2.Visible = true;
                break;
            case "5":
                btnUpdate.Text = "Update Menu";
                LoadMenu();
                divButton.Visible = false;
                cbAll.Visible = false;
                cblLocation.Visible = false;
                gvLocation2.Visible = false;
                cblMenu.Visible = true;
                break;
            case "6":
                btnUpdate.Text = "Delete Pending KOTs";
                divButton.Visible = false;
                LoadLocations(true, conStringCorn);
                break;
            case "7":
                btnUpdate.Text = "Insert Prices";
                divButton.Visible = false;
                dvPrices.Visible = true;
                cblLocation.Visible = false;
                cbAll.Visible = false;
                LoadPriceLocations(conStringCorn);
                break;
        }
    }
    protected void gvLocation_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            RadioButtonList rb = (RadioButtonList)e.Row.Cells[2].FindControl("rbType");
            rb.SelectedValue = e.Row.Cells[3].Text;
        }
    }
    protected void gvLocation2_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TextBox txtGST = (TextBox)e.Row.Cells[2].FindControl("txtGST");
            TextBox txtNTN = (TextBox)e.Row.Cells[3].FindControl("txtNTN");
            txtGST.Text = e.Row.Cells[4].Text;
            txtNTN.Text = e.Row.Cells[5].Text;
        }
    }
    public void LoadMenu()
    {

        cblMenu.Items.Clear();
        using (SqlConnection con = new SqlConnection(conStringCorn))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT MODULE_ID,MODULE_DESCRIPTION,IS_ACTIVE FROM [MODULE] WHERE MODULE_ID IN(28,29,32)", ddlDB.SelectedItem), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        ListItem li = new ListItem();
                        li.Value = dr[0].ToString();
                        li.Text = dr[1].ToString();
                        if (dr[2].ToString().ToLower() == "true")
                        {
                            li.Selected = true;
                        }
                        cblMenu.Items.Add(li);                        
                    }
                }
            }
            con.Close();
        }
        cblMenu.DataTextField = "Text";
        cblMenu.DataValueField = "Value";
    }
    public DataTable GetData(int SelectedLocation, long pDocumentID, int pTypeID)
    {
        string conString2 = "server=" + System.Configuration.ConfigurationManager.AppSettings["server"].ToString()
            + ";uid=" + System.Configuration.ConfigurationManager.AppSettings["uid"].ToString()
            + ";pwd=" + System.Configuration.ConfigurationManager.AppSettings["pwd"].ToString()
            + ";database=" + ddlDB.Text;
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
}