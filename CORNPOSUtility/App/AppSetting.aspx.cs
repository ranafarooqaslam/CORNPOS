using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI.WebControls;

public partial class AppSetting : System.Web.UI.Page
{
    string conStringCorn = System.Configuration.ConfigurationManager.AppSettings["connString"].ToString();
    static DataTable dtSetting;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            dtSetting = new DataTable();
            dtSetting.Columns.Add("intCode", typeof(int));
            dtSetting.Columns.Add("strColumnName", typeof(string));
            dtSetting.Columns.Add("strColumnValue", typeof(string));
            dtSetting.Columns.Add("strDescription", typeof(string));
            dtSetting.Columns.Add("strRemarks", typeof(string));

            LoadDb(conStringCorn);
            LoadSetting();
            ddlSetting_SelectedIndexChanged(null, null);
        }
    }
    private void LoadDb(string conString)
    {
        List<string> list = new List<string>();
        using (SqlConnection con = new SqlConnection(conString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' ORDER BY name", con))
            //using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' ORDER BY name", con))
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
    public void LoadSetting()
    {
        dtSetting.Rows.Clear();
        ListItem listCol = new ListItem();
        ddlSetting.Items.Clear();
        string connString = conStringCorn;
        using (SqlConnection con = new SqlConnection(connString))
        {
            con.Open();
            using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} SELECT intCode , strColumnName , strColumnValue, strDescription, strRemarks FROM tblAppSettingDetail WHERE strColumnName NOT IN('AppPath','ComputerInfo','Deployed','IsDeployed') ORDER BY strColumnName", ddlDB.SelectedValue), con))
            {
                using (IDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        listCol = new ListItem();
                        DataRow drSetting = dtSetting.NewRow();
                        drSetting["intCode"] = dr[0];
                        if (dr[1].ToString() == "BillFormat")
                        {
                            drSetting["strColumnName"] = "InvoiceCalculation";
                        }
                        else
                        {
                            drSetting["strColumnName"] = dr[1];
                        }
                        drSetting["strColumnValue"] = dr[2];
                        drSetting["strDescription"] = dr[3];
                        drSetting["strRemarks"] = dr[4];
                        dtSetting.Rows.Add(drSetting);

                        if (dr[1].ToString() == "BillFormat")
                        {
                            listCol.Text = "InvoiceCalculation";
                        }
                        else
                        {
                            listCol.Text = dr[1].ToString();
                        }
                        listCol.Value = dr[0].ToString();
                        ddlSetting.Items.Add(listCol);
                    }
                }
            }
            con.Close();
        }        
    }
    protected void btnUpdate_Click(object sender, EventArgs e)
    {
        string connString = conStringCorn;
        lblError.Text = string.Empty;
        int count = 0;
        string strColumnValue = "";
        switch (ddlSetting.SelectedItem.Text)
        {
            case "AWSAccessKeyID":
            case "AWSBucketName":
            case "AWSSecretAccessKeyID":
            case "PasswordChangeDays":
                strColumnValue = txtValue.Text;
                break;
            case "GoogleMapsAPIKey":
                strColumnValue = txtValue.Text;
                break;
            case "DailySalesReportColumns":
                if(cbComplimentarySales.Checked)
                {
                    strColumnValue += "1,";
                }
                if(cbVoidSales.Checked)
                {
                    strColumnValue += "2,";
                }
                if(cbVoidOrder.Checked)
                {
                    strColumnValue += "3,";
                }
                if(cbItemLess.Checked)
                {
                    strColumnValue += "4,";
                }
                if(cbItemCancel.Checked)
                {
                    strColumnValue += "5,";
                }
                if(strColumnValue.Length > 1)
                {
                    strColumnValue = strColumnValue.Remove(strColumnValue.Length - 1);
                }
                break;
            case "HiddenReportsDetail":
                if (cbDailySummaryPOS.Checked)
                {
                    strColumnValue += "1,";
                }
                if (cbSalesSummaryPOS.Checked)
                {
                    strColumnValue += "2,";
                }
                if (cbCashRegisterClosingForm.Checked)
                {
                    strColumnValue += "3,";
                }
                if (strColumnValue.Length > 1)
                {
                    strColumnValue = strColumnValue.Remove(strColumnValue.Length - 1);
                }
                break;
            case "PendigBillRefreshTime":
                strColumnValue = txtValue.Text;
                break;
            default:
                strColumnValue = ddlAvailableValues.SelectedValue;
                break;
        }
        if (strColumnValue.Length > 0 || ddlSetting.SelectedItem.Text == "DailySalesReportColumns")
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand(string.Format("USE {0} UPDATE tblAppSettingDetail SET strColumnValue = '" + strColumnValue + "' WHERE intCode=" + ddlSetting.SelectedValue, ddlDB.SelectedItem), con))
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
            }
        }
        if (count > 0)
        {
            lblError.ForeColor = System.Drawing.Color.Green;
            lblError.Text = "Record updated successfully.";
            LoadSetting();
            ddlSetting_SelectedIndexChanged(null, null);
        }
    }
    protected void ddlDB_SelectedIndexChanged(object sender, EventArgs e)
    {
        LoadSetting();
        ShowSetting();
    }
    protected void ddlSetting_SelectedIndexChanged(object sender, EventArgs e)
    {
        lblText.Text = "Select Value";
        ddlAvailableValues.Visible = true;
        txtValue.Visible = false;
        dvDailySalesReportColumnsCheckBoxes.Visible = false;
        dvHiddenReportsDetailCheckBoxes.Visible = false;
        cbComplimentarySales.Checked = false;
        cbVoidSales.Checked = false;
        cbVoidOrder.Checked = false;
        cbItemLess.Checked = false;
        cbItemCancel.Checked = false;
        cbDailySummaryPOS.Checked = false;
        cbSalesSummaryPOS.Checked = false;
        cbCashRegisterClosingForm.Checked = false;
        ddlAvailableValues.Items.Clear();
        ShowSetting();
    }
    private void ShowSetting()
    {
        ddlAvailableValues.Items.Clear();
        foreach (DataRow dr in dtSetting.Rows)
        {
            if (dr["intCode"].ToString() == ddlSetting.SelectedItem.Value)
            {
                lblRemarks.Text = dr["strRemarks"].ToString();
                switch(dr["strColumnName"].ToString())
                {
                    case "AvgPurchasePriceFormula":
                        ListItem lstAvgPurchasePriceFormula = new ListItem();
                        lstAvgPurchasePriceFormula.Text = "Default: Avg of all purchases price";
                        lstAvgPurchasePriceFormula.Value = "0";
                        ddlAvailableValues.Items.Add(lstAvgPurchasePriceFormula);

                        lstAvgPurchasePriceFormula = new ListItem();
                        lstAvgPurchasePriceFormula.Text= "Avg of last 2 purchases price";
                        lstAvgPurchasePriceFormula.Value = "1";
                        ddlAvailableValues.Items.Add(lstAvgPurchasePriceFormula);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "AWSAccessKeyID":
                        lblText.Text = "Enter Value";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "AWSBucketName":
                        lblText.Text = "Enter Value";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "AWSSecretAccessKeyID":
                        lblText.Text = "Enter Value";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "GoogleMapsAPIKey":
                        lblText.Text = "Enter Value";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "InvoiceCalculation":
                        ListItem lstBillFormat = new ListItem();
                        lstBillFormat.Text = "Default";
                        lstBillFormat.Value = "1";
                        ddlAvailableValues.Items.Add(lstBillFormat);

                        lstBillFormat = new ListItem();
                        lstBillFormat.Text= "Inclusive GST";
                        lstBillFormat.Value = "2";
                        ddlAvailableValues.Items.Add(lstBillFormat);

                        lstBillFormat = new ListItem();
                        lstBillFormat.Text= "Gross-GST";
                        lstBillFormat.Value = "3";
                        ddlAvailableValues.Items.Add(lstBillFormat);

                        lstBillFormat = new ListItem();
                        lstBillFormat.Text = "Gross-GST-Tabaq";
                        lstBillFormat.Value = "4";
                        ddlAvailableValues.Items.Add(lstBillFormat);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "CustomerContactMandatory":
                        ListItem lstCustomerContactMandatory = new ListItem();
                        lstCustomerContactMandatory.Text = "Default: Yes";
                        lstCustomerContactMandatory.Value = "1";
                        ddlAvailableValues.Items.Add(lstCustomerContactMandatory);

                        lstCustomerContactMandatory = new ListItem();
                        lstCustomerContactMandatory.Text= "No";
                        lstCustomerContactMandatory.Value = "0";
                        ddlAvailableValues.Items.Add(lstCustomerContactMandatory);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "CustomerInfoOnBill":
                        ListItem lstCustomerInfoOnBill = new ListItem();
                        lstCustomerInfoOnBill.Text= "Default";
                        lstCustomerInfoOnBill.Value = "0";
                        ddlAvailableValues.Items.Add(lstCustomerInfoOnBill);

                        lstCustomerInfoOnBill = new ListItem();
                        lstCustomerInfoOnBill.Text = "Membership,CustomerName";
                        lstCustomerInfoOnBill.Value = "1";
                        ddlAvailableValues.Items.Add(lstCustomerInfoOnBill);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "DailySalesReportColumns":
                        lblText.Text = "Select Option(s)";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = true;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        string[] ColumnValues = dr["strColumnValue"].ToString().Split(',');
                        if (ColumnValues.Length > 0)
                        {
                            foreach (string s in ColumnValues)
                            {
                                switch (s)
                                {
                                    case "1":
                                        cbComplimentarySales.Checked = true;
                                        break;
                                    case "2":
                                        cbVoidSales.Checked = true;
                                        break;
                                    case "3":
                                        cbVoidOrder.Checked = true;
                                        break;
                                    case "4":
                                        cbItemLess.Checked = true;
                                        break;
                                    case "5":
                                        cbItemCancel.Checked = true;
                                        break;
                                }
                            }
                        }
                        break;
                    case "GSTCalculation":
                        ListItem lstGSTCalculation = new ListItem();
                        lstGSTCalculation.Text = "Default: Grross Only";
                        lstGSTCalculation.Value = "1";
                        ddlAvailableValues.Items.Add(lstGSTCalculation);

                        lstGSTCalculation = new ListItem();
                        lstGSTCalculation.Text = "Gross - Discount";
                        lstGSTCalculation.Value = "2";
                        ddlAvailableValues.Items.Add(lstGSTCalculation);

                        lstGSTCalculation = new ListItem();
                        lstGSTCalculation.Text = "Gross + Service Charges";
                        lstGSTCalculation.Value = "3";
                        ddlAvailableValues.Items.Add(lstGSTCalculation);

                        lstGSTCalculation = new ListItem();
                        lstGSTCalculation.Text = "Gross - Discount + Service Charges";
                        lstGSTCalculation.Value = "4";
                        ddlAvailableValues.Items.Add(lstGSTCalculation);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "HiddenReportsDetail":
                        lblText.Text = "Select Option(s)";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = true;
                        string[] ColumnValues2 = dr["strColumnValue"].ToString().Split(',');
                        if (ColumnValues2.Length > 0)
                        {
                            foreach (string s in ColumnValues2)
                            {
                                switch (s)
                                {
                                    case "1":
                                        cbDailySummaryPOS.Checked = true;
                                        break;
                                    case "2":
                                        cbSalesSummaryPOS.Checked = true;
                                        break;
                                    case "3":
                                        cbCashRegisterClosingForm.Checked = true;
                                        break;
                                }
                            }
                        }
                        break;
                    case "InvoiceFormat":
                        ListItem lstInvoiceFormat = new ListItem();
                        lstInvoiceFormat.Text= "Default";
                        lstInvoiceFormat.Value = "1";
                        ddlAvailableValues.Items.Add(lstInvoiceFormat);

                        lstInvoiceFormat = new ListItem();
                        lstInvoiceFormat.Text= "Tabaq Format";
                        lstInvoiceFormat.Value = "2";
                        ddlAvailableValues.Items.Add(lstInvoiceFormat);

                        lstInvoiceFormat = new ListItem();
                        lstInvoiceFormat.Text= "SajLabenese Format";
                        lstInvoiceFormat.Value = "3";
                        ddlAvailableValues.Items.Add(lstInvoiceFormat);

                        lstInvoiceFormat = new ListItem();
                        lstInvoiceFormat.Text = "EatAllYear Format";
                        lstInvoiceFormat.Value = "4";
                        ddlAvailableValues.Items.Add(lstInvoiceFormat);
                        
                        lstInvoiceFormat = new ListItem();
                        lstInvoiceFormat.Text = "CafeBeddar Format";
                        lstInvoiceFormat.Value = "5";
                        ddlAvailableValues.Items.Add(lstInvoiceFormat);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "ItemsType":
                        ListItem lstItemsType = new ListItem();
                        lstItemsType.Text = "Default: Finish Items Only";
                        lstItemsType.Value = "1";
                        ddlAvailableValues.Items.Add(lstItemsType);

                        lstItemsType = new ListItem();
                        lstItemsType.Text = "All Items (Finish,Raw,Packing)";
                        lstItemsType.Value = "2";
                        ddlAvailableValues.Items.Add(lstItemsType);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "KOTFormat":
                        ListItem lstKOTFormat = new ListItem();
                        lstKOTFormat.Text = "Default: Type-1";
                        lstKOTFormat.Value = "1";
                        ddlAvailableValues.Items.Add(lstKOTFormat);

                        lstKOTFormat = new ListItem();
                        lstKOTFormat.Text = "Type-2";
                        lstKOTFormat.Value = "2";
                        ddlAvailableValues.Items.Add(lstKOTFormat);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        
                        break;
                    case "NegativeStockAllowed":
                        ListItem lstNegativeStockAllowed = new ListItem();
                        lstNegativeStockAllowed.Text = "Default: Yes";
                        lstNegativeStockAllowed.Value = "1";
                        ddlAvailableValues.Items.Add(lstNegativeStockAllowed);

                        lstNegativeStockAllowed = new ListItem();
                        lstNegativeStockAllowed.Text = "No";
                        lstNegativeStockAllowed.Value = "0";
                        ddlAvailableValues.Items.Add(lstNegativeStockAllowed);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "PasswordChangeDays":
                        lblText.Text = "Enter Integer Value";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "ProvisionalBillHeaderFormat":
                        ListItem lstProvisionalBillHeaderFormat = new ListItem();
                        lstProvisionalBillHeaderFormat.Text = "Default";
                        lstProvisionalBillHeaderFormat.Value = "0";
                        ddlAvailableValues.Items.Add(lstProvisionalBillHeaderFormat);

                        lstProvisionalBillHeaderFormat = new ListItem();
                        lstProvisionalBillHeaderFormat.Text = "Same As Final Bill Header";
                        lstProvisionalBillHeaderFormat.Value = "1";
                        ddlAvailableValues.Items.Add(lstProvisionalBillHeaderFormat);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "RollBackInvoiceType":
                        ListItem lstRollBackInvoiceType = new ListItem();
                        lstRollBackInvoiceType.Text = "Default";
                        lstRollBackInvoiceType.Value = "0";
                        ddlAvailableValues.Items.Add(lstRollBackInvoiceType);

                        lstRollBackInvoiceType = new ListItem();
                        lstRollBackInvoiceType.Text = "Convert back to Order";
                        lstRollBackInvoiceType.Value = "1";
                        ddlAvailableValues.Items.Add(lstRollBackInvoiceType);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "ServiceChargesCalculation":
                        ListItem lstServiceChargesCalculation = new ListItem();
                        lstServiceChargesCalculation.Text = "Default: On Grross Only";
                        lstServiceChargesCalculation.Value = "1";
                        ddlAvailableValues.Items.Add(lstServiceChargesCalculation);

                        lstServiceChargesCalculation = new ListItem();
                        lstServiceChargesCalculation.Text = "On Gross - Discount";
                        lstServiceChargesCalculation.Value = "2";
                        ddlAvailableValues.Items.Add(lstServiceChargesCalculation);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "ShowClosingStockStatus":
                        ListItem lstShowClosingStockStatus = new ListItem();
                        lstShowClosingStockStatus.Text= "Default: Yes";
                        lstShowClosingStockStatus.Value = "1";
                        ddlAvailableValues.Items.Add(lstShowClosingStockStatus);

                        lstShowClosingStockStatus = new ListItem();
                        lstShowClosingStockStatus.Text = "No";
                        lstShowClosingStockStatus.Value = "0";
                        ddlAvailableValues.Items.Add(lstShowClosingStockStatus);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "ShowNTNOnProvissionalBill":
                        ListItem lstShowNTNOnProvissionalBill = new ListItem();
                        lstShowNTNOnProvissionalBill.Text = "Default: Yes";
                        lstShowNTNOnProvissionalBill.Value = "1";
                        ddlAvailableValues.Items.Add(lstShowNTNOnProvissionalBill);

                        lstShowNTNOnProvissionalBill = new ListItem();
                        lstShowNTNOnProvissionalBill.Text = "No";
                        lstShowNTNOnProvissionalBill.Value = "0";
                        ddlAvailableValues.Items.Add(lstShowNTNOnProvissionalBill);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "TaxAuthority":
                        ListItem lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "Default: No";
                        lstTaxAuthority.Value = "0";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);

                        lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "FBR(Federal Board Of Revenue)";
                        lstTaxAuthority.Value = "1";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);

                        lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "PRA(Punjab Revenue Authority)";
                        lstTaxAuthority.Value = "2";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);

                        lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "KPRA(Khyber Pakhtunkhwa Revenue Authority)";
                        lstTaxAuthority.Value = "3";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);

                        lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "SRB(Sindh Revenue Board)";
                        lstTaxAuthority.Value = "4";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);

                        lstTaxAuthority = new ListItem();
                        lstTaxAuthority.Text = "FBR & PRA Both";
                        lstTaxAuthority.Value = "5";
                        ddlAvailableValues.Items.Add(lstTaxAuthority);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "PendigBillRefreshTime":
                        lblText.Text = "Enter Value(Miliseconds)";
                        ddlAvailableValues.Visible = false;
                        dvDailySalesReportColumnsCheckBoxes.Visible = false;
                        dvHiddenReportsDetailCheckBoxes.Visible = false;
                        txtValue.Visible = true;
                        txtValue.Text = dr["strColumnValue"].ToString();
                        break;
                    case "VoucherEntryMinimumDate":
                        ListItem lstVoucherEntryMinimumDate = new ListItem();
                        lstVoucherEntryMinimumDate.Text = "Default(Fiscal Year)";
                        lstVoucherEntryMinimumDate.Value = "1";
                        ddlAvailableValues.Items.Add(lstVoucherEntryMinimumDate);

                        lstVoucherEntryMinimumDate = new ListItem();
                        lstVoucherEntryMinimumDate.Text = "5 Days";
                        lstVoucherEntryMinimumDate.Value = "2";
                        ddlAvailableValues.Items.Add(lstVoucherEntryMinimumDate);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    case "ProfitLossConsumptionFormula":
                        ListItem lstProfitLossConsumptionFormula = new ListItem();
                        lstProfitLossConsumptionFormula.Text = "Default";
                        lstProfitLossConsumptionFormula.Value = "1";
                        ddlAvailableValues.Items.Add(lstProfitLossConsumptionFormula);

                        lstProfitLossConsumptionFormula = new ListItem();
                        lstProfitLossConsumptionFormula.Text = "Exlude Transfer In";
                        lstProfitLossConsumptionFormula.Value = "2";
                        ddlAvailableValues.Items.Add(lstProfitLossConsumptionFormula);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                    default:
                        ListItem lstDefault = new ListItem();
                        lstDefault.Text = "Default: No";
                        lstDefault.Value = "0";
                        ddlAvailableValues.Items.Add(lstDefault);

                        lstDefault = new ListItem();
                        lstDefault.Text = "Yes";
                        lstDefault.Value = "1";
                        ddlAvailableValues.Items.Add(lstDefault);
                        ddlAvailableValues.SelectedValue = dr["strColumnValue"].ToString();
                        break;
                }
            }
        }
    }
}