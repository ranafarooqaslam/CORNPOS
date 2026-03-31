using System;

public partial class MasterPageMain : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Session["UserID"] != null)
            {
                if (Session["UserID"].ToString() == "1")
                {
                    //Bread Crum
                    //Location Setup
                    string Url = Request.Url.AbsoluteUri;
                    if (Url.ToLower().Contains("default.aspx"))
                    {
                        ltrlBreadCrum.Text = "Location Setup";
                    }
                    //User Setp
                    else if (Url.ToLower().Contains("user.aspx"))
                    {
                        ltrlBreadCrum.Text = "User Setup";
                    }
                    //Last Day Close
                    else if (Url.ToLower().Contains("lastdayclose.aspx"))
                    {
                        ltrlBreadCrum.Text = "Last Day Close";
                    }
                    //App Setting
                    else if (Url.ToLower().Contains("appsetting.aspx"))
                    {
                        ltrlBreadCrum.Text = "App Setting";
                    }
                    //Indexing
                    else if (Url.ToLower().Contains("index.aspx"))
                    {
                        ltrlBreadCrum.Text = "Indexing";
                    }
                    //Create New Database
                    else if (Url.ToLower().Contains("adddb.aspx") || Url.ToLower().Contains("adddb.index.aspx") || Url.ToLower().Contains("adddb.aspx"))
                    {
                        ltrlBreadCrum.Text = "Create New Database";
                    }
                    //Truncate
                    else if (Url.ToLower().Contains("truncate.aspx"))
                    {
                        ltrlBreadCrum.Text = "Truncate Transactions";
                    }
                    //Invoice Data
                    else if (Url.ToLower().Contains("invoice.aspx"))
                    {
                        ltrlBreadCrum.Text = "Invoice";
                    }
                    //Inventory
                    else if (Url.ToLower().Contains("inventory.aspx"))
                    {
                        ltrlBreadCrum.Text = "Inventory";
                    }
                    //License Date
                    //else if (Url.ToLower().Contains("licensedate.aspx"))
                    //{
                    //    ltrlBreadCrum.Text = "License Date";
                    //}

                    //Menu
                    System.Text.StringBuilder sbMenu = new System.Text.StringBuilder();
                    sbMenu.Append("<nav>");

                    //Location Setup
                    sbMenu.Append("<ul class='nav topnav'>");
                    if (Url.ToLower().Contains("default.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id='menuLicense'>");
                    }
                    else
                    {
                        sbMenu.Append("<li id='menuLicense'>");
                    }
                    sbMenu.Append("<a href = 'Default.aspx' > Location Setup</a>");
                    sbMenu.Append("</li>");

                    //User Setup
                    if (Url.ToLower().Contains("user.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='user.aspx'>User Setup</ a >");
                    sbMenu.Append("</ li>");

                    //Last Day Close
                    if (Url.ToLower().Contains("lastdayclose.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='LastDayClose.aspx'>Last Day Close</ a >");
                    sbMenu.Append("</ li>");

                    //App Setting
                    if (Url.ToLower().Contains("appsetting.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='AppSetting.aspx'>App Setting</ a >");
                    sbMenu.Append("</ li>");

                    //Indexing
                    if (Url.ToLower().Contains("index.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='Index.aspx'>Indexing</ a >");
                    sbMenu.Append("</ li>");

                    //Create New Database
                    if (Url.ToLower().Contains("adddb.aspx") || Url.ToLower().Contains("adddb.index.aspx") || Url.ToLower().Contains("adddb.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuAddDb' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuAddDb' >");
                    }
                    sbMenu.Append("<a href='AddDB.aspx'>Create New Database</ a >");
                    sbMenu.Append("</ li>");

                    //Activate Location
                    if (Url.ToLower().Contains("truncate.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='Truncate.aspx'>Truncate Transactions</ a >");
                    sbMenu.Append("</ li>");

                    //Invoice Data
                    if (Url.ToLower().Contains("invoice.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='Invoice.aspx'>Invoice</ a >");
                    sbMenu.Append("</ li>");

                    //Inventory
                    if (Url.ToLower().Contains("inventory.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='Inventory.aspx'>Inventory</ a >");
                    sbMenu.Append("</ li>");

                    //License Date
                    //if (Url.ToLower().Contains("licensedate.aspx"))
                    //{
                    //    sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    //}
                    //else
                    //{
                    //    sbMenu.Append("<li id = 'menuInsight' >");
                    //}
                    //sbMenu.Append("<a href='LicenseDate.aspx'>License Date</ a >");
                    //sbMenu.Append("</ li>");

                    sbMenu.Append("<li>");
                    sbMenu.Append("<a href = 'Logout.aspx' > Logout </ a >");
                    sbMenu.Append("</ li>");
                    sbMenu.Append("</ ul>");

                    sbMenu.Append("</ nav>");

                    ltrlMenu.Text = sbMenu.ToString();
                }
                else if (Session["UserID"].ToString() == "2")
                {
                    //Bread Crum
                    //Location Setup
                    string Url = Request.Url.AbsoluteUri;
                    if (Url.ToLower().Contains("default.aspx"))
                    {
                        ltrlBreadCrum.Text = "Location Setup";
                    }
                    //User Setp
                    else if (Url.ToLower().Contains("user.aspx"))
                    {
                        ltrlBreadCrum.Text = "User Setup";
                    }
                    
                    //Menu
                    System.Text.StringBuilder sbMenu = new System.Text.StringBuilder();
                    sbMenu.Append("<nav>");

                    //Location Setup
                    sbMenu.Append("<ul class='nav topnav'>");
                    if (Url.ToLower().Contains("default.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id='menuLicense'>");
                    }
                    else
                    {
                        sbMenu.Append("<li id='menuLicense'>");
                    }
                    sbMenu.Append("<a href = 'Default.aspx' > Location Setup</a>");
                    sbMenu.Append("</li>");

                    //User Setup
                    if (Url.ToLower().Contains("user.aspx"))
                    {
                        sbMenu.Append("<li class='dropdown active' id = 'menuInsight' >");
                    }
                    else
                    {
                        sbMenu.Append("<li id = 'menuInsight' >");
                    }
                    sbMenu.Append("<a href='user.aspx'>User Setup</ a >");
                    sbMenu.Append("</ li>");
                                        
                    sbMenu.Append("<li>");
                    sbMenu.Append("<a href = 'Logout.aspx' > Logout </ a >");
                    sbMenu.Append("</ li>");
                    sbMenu.Append("</ ul>");

                    sbMenu.Append("</ nav>");

                    ltrlMenu.Text = sbMenu.ToString();
                }
            }
        }
    }
}