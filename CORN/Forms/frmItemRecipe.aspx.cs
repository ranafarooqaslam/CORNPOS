using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;
using System.Web;

public partial class Forms_frmItemRecipe : System.Web.UI.Page
{
    readonly SKUPriceDetailController PController = new SKUPriceDetailController();
    readonly SkuController SKUCtl = new SkuController();
    readonly DataControl dc = new DataControl();
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
        Response.Cache.SetNoStore();
        Response.AppendHeader("pragma", "no-cache");

        try
        {
            if (!IsPostBack)
            {
                LoadSKUFinished();
                LoadSKU();
                CreateSKUDataTable();
                LoadUOM();
                GetItemUnitAndQty();
                GetFinishedDetail();
                ddlSKU_SelectedIndexChanged(null, null);
            }
        }
        catch (Exception)
        {

            throw;
        }
    }
    private void LoadUOM()
    {

        GeoHierarchyController DptTpe = new GeoHierarchyController();

        drpSkuUnit.Items.Clear();
        DataTable dt = DptTpe.GetUOM(0, Constants.IntNullValue, Constants.IntNullValue);
        clsWebFormUtil.FillDxComboBoxList(drpSkuUnit, dt, 0, 1, true);
        if (dt.Rows.Count > 0)
        {
            drpSkuUnit.SelectedIndex = 0;
        }
    }
    private void LoadSKUFinished()
    {

        DataTable Dtsku_Price = SKUCtl.SelectSkuInfo(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, 5, int.Parse(Session["CompanyId"].ToString()),null);
        clsWebFormUtil.FillDxComboBoxList(this.ddlSKUFinished, Dtsku_Price, 0, 2, true);
        if (Dtsku_Price.Rows.Count > 0)
        {
            ddlSKUFinished.SelectedIndex = 0;
        }
    }
    
    private void LoadSKU()
    {
        DataTable Dtsku_Price = SKUCtl.SelectSkuInfo(Constants.IntNullValue, Constants.IntNullValue, Constants.IntNullValue, 6, int.Parse(Session["CompanyId"].ToString()), null);
        clsWebFormUtil.FillDxComboBoxList(this.ddlSKU, Dtsku_Price, 0, 2, true);
        if (Dtsku_Price.Rows.Count > 0)
        {
            ddlSKU.SelectedIndex = 0;
        }
    }
    
    protected void gvSKU_RowEditing(object sender, GridViewEditEventArgs e)
    {
        try
        {
            RowId.Value = e.NewEditIndex.ToString();
            ddlSKU.Value = gvSKU.Rows[e.NewEditIndex].Cells[0].Text;
            txtQuantity.Text = gvSKU.Rows[e.NewEditIndex].Cells[3].Text;
            txtUOM.Text = gvSKU.Rows[e.NewEditIndex].Cells[2].Text;
            hfRawUnitName.Value = gvSKU.Rows[e.NewEditIndex].Cells[2].Text;
            hfRawUnit.Value = gvSKU.Rows[e.NewEditIndex].Cells[4].Text;
            btnAdd.Text = "Update";
        }


        catch (Exception)
        {

            throw;
        }

    }
    protected void gvSKU_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            DataTable dtSKU = (DataTable)this.Session["dtSKU"];
            DataTable deletedSKU = (DataTable)this.Session["DeletedSKU"];

            DataRow dr = dtSKU.Rows[e.RowIndex];
            if (dr != null)
            {
                var newRow = deletedSKU.NewRow();
                newRow = dr;
                deletedSKU.ImportRow(newRow);

                Session.Add("DeletedSKU", deletedSKU);
            }

            dtSKU.Rows.RemoveAt(e.RowIndex);

            gvSKU.DataSource = dtSKU;
            gvSKU.DataBind();
        }
        catch (Exception)
        {

            throw;
        }
    }
    
    protected void btnAdd_Click(object sender, EventArgs e)
    {
        try
        {
            DataTable dtSKU = (DataTable)Session["dtSKU"];

            if (txtQuantity.Text.Length > 0)
            {
                if (btnAdd.Text == "Add")
                {
                    if (CheckDublicateSKU())
                    {
                        DataRow dr = dtSKU.NewRow();
                        dr["SKU_ID"] = Convert.ToInt32(ddlSKU.SelectedItem.Value);
                        dr["QUANTITY"] = decimal.Parse(txtQuantity.Text);
                        dr["SKU_NAME"] = ddlSKU.SelectedItem.Text;
                        dr["UOM_ID"] = hfRawUnit.Value;
                        dr["UOM_DESC"] = hfRawUnitName.Value;
                        dtSKU.Rows.Add(dr);
                        ddlSKU.SelectedIndex = 0;
                        txtQuantity.Text = string.Empty;
                    }
                    else
                    {
                        ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Item already exists')", true);
                    }
                }
                else
                {
                    DataRow dr = dtSKU.Rows[Convert.ToInt32(RowId.Value)];
                    dr["SKU_ID"] = Convert.ToInt32(ddlSKU.SelectedItem.Value);
                    dr["QUANTITY"] = decimal.Parse(txtQuantity.Text);
                    dr["SKU_NAME"] = ddlSKU.SelectedItem.Text;
                    dr["UOM_ID"] = hfRawUnit.Value;
                    dr["UOM_DESC"] = hfRawUnitName.Value;
                    ddlSKU.SelectedIndex = 0;
                    txtQuantity.Text = string.Empty;
                    btnAdd.Text = "Add";
                    RowId.Value = "0";
                }

                ScriptManager.GetCurrent(Page).SetFocus(ddlSKU);
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Quantity is required');", true);
                return;
            }

            LoadGrid();
        }
        catch (Exception)
        {

            throw;
        }
    }

    private void CreateSKUDataTable()
    {
        DataTable dtSKU = new DataTable();
        dtSKU.Columns.Add("SKU_ID", typeof(int));
        dtSKU.Columns.Add("QUANTITY", typeof(decimal));
        dtSKU.Columns.Add("SKU_NAME", typeof(string));
        dtSKU.Columns.Add("UOM_ID", typeof(int));
        dtSKU.Columns.Add("UOM_DESC", typeof(string));
        Session.Add("dtSKU", dtSKU);
        Session.Add("DeletedSKU", dtSKU.Clone());
    }
    private bool CheckDublicateSKU()
    {
        DataTable dtSKU = (DataTable)Session["dtSKU"];
        DataRow[] foundRows = dtSKU.Select("SKU_ID  = '" + ddlSKU.SelectedItem.Value + "'");
        if (foundRows.Length == 0)
        {
            return true;
        }
        return false;
    }

    protected void btnSave_Click(object sender, EventArgs e)
    {
        try
        {
            DataTable dtSKU = (DataTable)Session["dtSKU"];
            DataTable DeletedSKU = (DataTable)Session["DeletedSKU"];
            if (dtSKU.Rows.Count > 0)
            {
                int RecipeID = SKUCtl.InsertFinishedSKU(Convert.ToInt32(ddlSKUFinished.SelectedItem.Value),
                    decimal.Parse(dc.chkNull_0(txtRecipeQty.Text)), 
                    Convert.ToInt32(drpSkuUnit.SelectedItem.Value),
                    Convert.ToDateTime(System.DateTime.Now.ToShortDateString()),
                    Convert.ToInt32(Session["UserID"]), chkIsReqProduciotn.Checked,
                    dtSKU, DeletedSKU);
                if (RecipeID > 0)
                {
                    CreateSKUDataTable();
                    GetFinishedDetail();
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Record added succesfully.')", true);
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Some error occured')", true);
                }
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('No Raw Material Item found.')", true);
            }
        }
        catch (Exception ex)
        {

            ExceptionPublisher.PublishException(ex);
            ScriptManager.RegisterStartupScript(this, this.GetType(), "msg", "alert('Some error occured')", true);

        }
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        CreateSKUDataTable();
        GetItemUnitAndQty();
        GetFinishedDetail();
    }

    private void LoadGrid()
    {
        DataTable dtSKU = (DataTable)Session["dtSKU"];
        gvSKU.DataSource = dtSKU;
        gvSKU.DataBind();
    }

    public void GetItemUnitAndQty()
    {
        try
        {
            DataTable dt = new DataTable();

            dt = SKUCtl.SelectSkuInfo(Constants.IntNullValue, Constants.IntNullValue, DataControl.chkIntNull(ddlSKUFinished.SelectedItem.Value.ToString()), 10, Constants.IntNullValue, Constants.IntNullValue);
            if (dt.Rows.Count > 0)
            {
                drpSkuUnit.Value = dt.Rows[0]["UNIT"].ToString();
                txtRecipeQty.Text = dt.Rows[0]["QUANTITY"].ToString();
            }
        }
        catch (Exception ex)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + ex + "');", true);
        }
    }
    private void GetFinishedDetail()
    {
        try
        {
            gvSKU.DataSource = null;
            gvSKU.DataBind();


            if (ddlSKUFinished.Items.Count > 0)
            {
                DataTable dtSKU = SKUCtl.GetFinshedDetail(Convert.ToInt32(ddlSKUFinished.SelectedItem.Value),Constants.IntNullValue, Constants.IntNullValue);
                if (dtSKU.Rows.Count > 0)
                {
                    chkIsReqProduciotn.Checked = Convert.ToBoolean(dtSKU.Rows[0]["Is_Production"].ToString());
                    txtRecipeQty.Text = dtSKU.Rows[0]["Recipe_Qty"].ToString();
                    Session.Add("dtSKU", dtSKU);
                    LoadGrid();
                }
            }
        }
        catch (Exception ex)
        {
            ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + ex + "');", true);
        }
    }
    protected void ddlSKUFinished_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            ddlSKU.SelectedIndex = 0;


            txtQuantity.Text = string.Empty;
            btnAdd.Text = "Add";

            CreateSKUDataTable();

            GetItemUnitAndQty();

            GetFinishedDetail();
           
        }
        catch (Exception)
        {

            throw;
        }
    }

    protected void ddlSKU_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (ddlSKU.Items.Count > 0)
        {
            hfRawUnit.Value = "";
            DataTable dt = new DataTable();

            dt = SKUCtl.SelectSkuInfo(Convert.ToInt32(ddlSKU.SelectedItem.Value), Constants.IntNullValue, Constants.IntNullValue, 8, int.Parse(Session["CompanyId"].ToString()), null);
            if (dt.Rows.Count > 0)
            {
                txtUOM.Text = dt.Rows[0]["UOM_DESC"].ToString();
                hfRawUnitName.Value = dt.Rows[0]["UOM_DESC"].ToString();
                hfRawUnit.Value = dt.Rows[0]["UOM_ID"].ToString();
            }
            txtQuantity.Focus();
        }
    }
}