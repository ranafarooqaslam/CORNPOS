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
        
        if (ddlDB.Items.Count > 0)
        {
            //SALE_INVOICE_MASTER
            StringBuilder sbIndex1 = new StringBuilder();
            sbIndex1.Append(Environment.NewLine);
            sbIndex1.Append("DROP INDEX IF EXISTS [SALE_INVOICE_MASTER_DISCOUNT_TYPE] ON [dbo].[SALE_INVOICE_MASTER]");
            sbIndex1.Append(Environment.NewLine);
            sbIndex1.Append("CREATE NONCLUSTERED INDEX [SALE_INVOICE_MASTER_DISCOUNT_TYPE] ON [dbo].[SALE_INVOICE_MASTER] ( [DISCOUNT_TYPE] ASC, [CUSTOMER_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex1.ToString());

            StringBuilder sbIndex2 = new StringBuilder();
            sbIndex2.Append(Environment.NewLine);
            sbIndex2.Append("DROP INDEX IF EXISTS [SALE_INVOICE_MASTER_LOCKED_BY] ON [dbo].[SALE_INVOICE_MASTER]");
            sbIndex2.Append(Environment.NewLine);
            sbIndex2.Append("CREATE NONCLUSTERED INDEX [SALE_INVOICE_MASTER_LOCKED_BY] ON [dbo].[SALE_INVOICE_MASTER] ( [LOCKED_BY] ASC, [LOCKED] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");            
            ExecuteScript(sbIndex2.ToString());

            StringBuilder sbIndex3 = new StringBuilder();
            sbIndex3.Append(Environment.NewLine);
            sbIndex3.Append("DROP INDEX IF EXISTS [SALE_INVOICE_MASTER_FORM_ID] ON [dbo].[SALE_INVOICE_MASTER]");
            sbIndex3.Append(Environment.NewLine);
            sbIndex3.Append("CREATE NONCLUSTERED INDEX [SALE_INVOICE_MASTER_FORM_ID] ON [dbo].[SALE_INVOICE_MASTER] ( [FORM_ID] ASC, [TABLE_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex3.ToString());

            StringBuilder sbIndex4 = new StringBuilder();
            sbIndex4.Append(Environment.NewLine);
            sbIndex4.Append("DROP INDEX IF EXISTS [SMI_SALE_INVOICE_MASTERCUSTOMER_TYPE_IDIS_HOLDIS_ACTIVEDOCUMENT_DATEDISTRIBUTOR_ID_9738] ON [dbo].[SALE_INVOICE_MASTER]");
            sbIndex4.Append(Environment.NewLine);
            sbIndex4.Append("CREATE NONCLUSTERED INDEX [SMI_SALE_INVOICE_MASTERCUSTOMER_TYPE_IDIS_HOLDIS_ACTIVEDOCUMENT_DATEDISTRIBUTOR_ID_9738] ON [dbo].[SALE_INVOICE_MASTER] ( [CUSTOMER_TYPE_ID] ASC, [IS_HOLD] ASC, [IS_ACTIVE] ASC ) INCLUDE([ORDER_NO]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex4.ToString());

            StringBuilder sbIndex5 = new StringBuilder();
            sbIndex5.Append(Environment.NewLine);
            sbIndex5.Append("DROP INDEX IF EXISTS [SMI_SALE_INVOICE_MASTERDOCUMENT_DATEDISTRIBUTOR_ID_12227] ON [dbo].[SALE_INVOICE_MASTER]");
            sbIndex5.Append(Environment.NewLine);
            sbIndex5.Append("CREATE NONCLUSTERED INDEX [SMI_SALE_INVOICE_MASTERDOCUMENT_DATEDISTRIBUTOR_ID_12227] ON [dbo].[SALE_INVOICE_MASTER] ( [DOCUMENT_DATE] ASC, [DISTRIBUTOR_ID] ASC, [DeliveryType] ASC ) INCLUDE([ORDER_NO]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex5.ToString());

            //SALE_INVOICE_DETAIL
            StringBuilder sbIndex6 = new StringBuilder();
            sbIndex6.Append(Environment.NewLine);
            sbIndex6.Append("DROP INDEX IF EXISTS [NonClusteredIndex-20220129-221651] ON [dbo].[SALE_INVOICE_DETAIL]");
            sbIndex6.Append(Environment.NewLine);
            sbIndex6.Append("CREATE NONCLUSTERED INDEX [NonClusteredIndex-20220129-221651] ON [dbo].[SALE_INVOICE_DETAIL] ( [SALE_INVOICE_ID] ASC, [SKU_ID] ASC, [PRICE] ASC, [QTY] ASC, [DISTRIBUTOR_ID] ASC, [ITEM_DEAL_ID] ASC, [intDealID] ASC, [DealQTY] ASC, [lngDealDetailID] ASC, [DealDetailQTY] ASC, [DEAL_PRICE] ASC, [SaleQty] ASC, [ORIGINAL_QTY] ASC, [PRINT_QTY] ASC, [DISCOUNT] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY] ");
            ExecuteScript(sbIndex6.ToString());

            StringBuilder sbIndex7 = new StringBuilder();
            sbIndex7.Append(Environment.NewLine);
            sbIndex7.Append("DROP INDEX IF EXISTS [NonClusteredIndex-20220129-221826] ON [dbo].[SALE_INVOICE_DETAIL]");
            sbIndex7.Append(Environment.NewLine);
            sbIndex7.Append("CREATE NONCLUSTERED INDEX [NonClusteredIndex-20220129-221826] ON [dbo].[SALE_INVOICE_DETAIL] ( [SALE_INVOICE_ID] ASC, [SKU_ID] ASC, [PRICE] ASC, [QTY] ASC, [DISTRIBUTOR_ID] ASC, [SaleQty] ASC, [ORIGINAL_QTY] ASC, [PRINT_QTY] ASC, [DISCOUNT] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex7.ToString());

            //PURCHASE_MASTER
            StringBuilder sbIndex8 = new StringBuilder();
            sbIndex8.Append(Environment.NewLine);
            sbIndex8.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_DISTRIBUTOR_ID] ON [dbo].[PURCHASE_MASTER]");
            sbIndex8.Append(Environment.NewLine);
            sbIndex8.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_DISTRIBUTOR_ID] ON [dbo].[PURCHASE_MASTER] ( [DISTRIBUTOR_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex8.ToString());

            StringBuilder sbIndex9 = new StringBuilder();
            sbIndex9.Append(Environment.NewLine);
            sbIndex9.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_DOCUMENT_DATE] ON [dbo].[PURCHASE_MASTER]");
            sbIndex9.Append(Environment.NewLine);
            sbIndex9.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_DOCUMENT_DATE] ON [dbo].[PURCHASE_MASTER] ( [DOCUMENT_DATE] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");

            StringBuilder sbIndex10 = new StringBuilder();
            sbIndex10.Append(Environment.NewLine);
            sbIndex10.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_POSTING] ON [dbo].[PURCHASE_MASTER]");
            sbIndex10.Append(Environment.NewLine);
            sbIndex10.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_POSTING] ON [dbo].[PURCHASE_MASTER] ( [POSTING] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex10.ToString());

            StringBuilder sbIndex11 = new StringBuilder();
            sbIndex11.Append(Environment.NewLine);
            sbIndex11.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_SOLD_TO] ON [dbo].[PURCHASE_MASTER]");
            sbIndex11.Append(Environment.NewLine);
            sbIndex11.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_SOLD_TO] ON [dbo].[PURCHASE_MASTER] ( [SOLD_TO] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex11.ToString());

            StringBuilder sbIndex12 = new StringBuilder();
            sbIndex12.Append(Environment.NewLine);
            sbIndex12.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_TYPE_ID] ON [dbo].[PURCHASE_MASTER]");
            sbIndex12.Append(Environment.NewLine);
            sbIndex12.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_TYPE_ID] ON [dbo].[PURCHASE_MASTER] ( [TYPE_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex12.ToString());

            StringBuilder sbIndex13 = new StringBuilder();
            sbIndex13.Append(Environment.NewLine);
            sbIndex13.Append("DROP INDEX IF EXISTS [PURCHASE_MASTER_USER_ID] ON [dbo].[PURCHASE_MASTER]");
            sbIndex13.Append(Environment.NewLine);
            sbIndex13.Append("CREATE NONCLUSTERED INDEX [PURCHASE_MASTER_USER_ID] ON [dbo].[PURCHASE_MASTER] ( [USER_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex13.ToString());

            //PURCHASE_DETAIL
            StringBuilder sbIndex14 = new StringBuilder();
            sbIndex14.Append(Environment.NewLine);
            sbIndex14.Append("DROP INDEX IF EXISTS [PURCHASE_DETAIL_SKU_IF] ON [dbo].[PURCHASE_DETAIL]");
            sbIndex14.Append(Environment.NewLine);
            sbIndex14.Append("CREATE NONCLUSTERED INDEX [PURCHASE_DETAIL_SKU_IF] ON [dbo].[PURCHASE_DETAIL] ( [SKU_ID] ASC )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex14.ToString());

            StringBuilder sbIndex15 = new StringBuilder();
            sbIndex15.Append(Environment.NewLine);
            sbIndex15.Append("DROP INDEX IF EXISTS [SMI_PURCHASE_DETAILDISTRIBUTOR_ID_106] ON [dbo].[PURCHASE_DETAIL]");
            sbIndex15.Append(Environment.NewLine);
            sbIndex15.Append("CREATE NONCLUSTERED INDEX [SMI_PURCHASE_DETAILDISTRIBUTOR_ID_106] ON [dbo].[PURCHASE_DETAIL] ( [DISTRIBUTOR_ID] ASC, [QUANTITY] ASC ) INCLUDE([PURCHASE_MASTER_ID],[SKU_ID]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex15.ToString());

            StringBuilder sbIndex16 = new StringBuilder();
            sbIndex16.Append(Environment.NewLine);
            sbIndex16.Append("DROP INDEX IF EXISTS [SMI_PURCHASE_DETAILDISTRIBUTOR_IDTYPE_ID_61] ON [dbo].[PURCHASE_DETAIL]");
            sbIndex16.Append(Environment.NewLine);
            sbIndex16.Append("CREATE NONCLUSTERED INDEX [SMI_PURCHASE_DETAILDISTRIBUTOR_IDTYPE_ID_61] ON [dbo].[PURCHASE_DETAIL] ( [TYPE_ID] ASC, [TIME_STAMP] ASC ) INCLUDE([PURCHASE_MASTER_ID],[QUANTITY],[PRICE]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex16.ToString());

            StringBuilder sbIndex17 = new StringBuilder();
            sbIndex17.Append(Environment.NewLine);
            sbIndex17.Append("DROP INDEX IF EXISTS [SMI_PURCHASE_DETAILPURCHASE_MASTER_IDDISTRIBUTOR_ID_102] ON [dbo].[PURCHASE_DETAIL]");
            sbIndex17.Append(Environment.NewLine);
            sbIndex17.Append("CREATE NONCLUSTERED INDEX [SMI_PURCHASE_DETAILPURCHASE_MASTER_IDDISTRIBUTOR_ID_102] ON [dbo].[PURCHASE_DETAIL] ( [PURCHASE_MASTER_ID] ASC, [PURCHASE_DETAIL_ID] ASC ) INCLUDE([SKU_ID],[QUANTITY]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 80) ON[PRIMARY]");
            ExecuteScript(sbIndex17.ToString());

            StringBuilder sbIndex18 = new StringBuilder();
            sbIndex18.Append(Environment.NewLine);
            sbIndex18.Append("DROP INDEX IF EXISTS [SALE_INVOICE_DETAIL_Index] ON [dbo].[SALE_INVOICE_DETAIL]");
            sbIndex18.Append(Environment.NewLine);
            sbIndex18.Append("CREATE NONCLUSTERED INDEX [SALE_INVOICE_DETAIL_Index] ON [dbo].[SALE_INVOICE_DETAIL] ( [SALE_INVOICE_ID] ASC, [PRINT_QTY] ASC, [QTY] ASC ) INCLUDE([SALE_INVOICE_DETAIL_ID]) WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY]");
            ExecuteScript(sbIndex18.ToString());


            lblError.ForeColor = System.Drawing.Color.Green;
            lblError.Text = "Indexing done for " + ddlDB.SelectedItem.Value;
        }
        else
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "No database selected or Some error occured.";
        }
    }
    private void ExecuteScript(string script)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("USE " + ddlDB.SelectedItem.Value + script, con))
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
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = ex.ToString();
        }
    }
}