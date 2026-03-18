using System;
using System.Collections.Generic;
using System.Data;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.IO;
using CORNBusinessLayer.Classes;
using CORNCommon.Classes;
using Newtonsoft.Json;
using System.Drawing.Printing;
using System.Drawing;
using GsmComm.GsmCommunication;
using GsmComm.PduConverter;
using System.Net;
using System.Text;
using System.Xml;
using System.Linq;

namespace Forms
{
    public partial class frmCallCenterOld : System.Web.UI.Page
    {
        #region Printing Variables
        // for Report:
        private static int CurrentY;
        private static int CurrentX;
        private static int leftMargin;
        private static int rightMargin;
        private static int topMargin;
        private static int bottomMargin;
        private static int InvoiceWidth;
        private static int InvoiceHeight;
        

        // Font and Color:------------------
        // Title Font
        private static Font InvTitleFont = new Font("sans-serif", 22, FontStyle.Regular);
        // Title Font height
        private static int InvTitleHeight;
        // SubTitle Font
        private static Font InvSubTitleFont = new Font("sans-serif", 12, FontStyle.Regular);
        private static Font InvOrderTitleFont = new Font("sans-serif", 14, FontStyle.Bold);
        // SubTitle Font height
        private static int InvSubTitleHeight;
        // Invoice Font
        private static Font InvoiceFont = new Font("sans-serif", 11, FontStyle.Regular);

        private static Font InvoiceFont2 = new Font("sans-serif", 9, FontStyle.Regular);

       // Blue Color
        private static SolidBrush BlueBrush = new SolidBrush(Color.Blue);

        // Black Color
        private static SolidBrush BlackBrush = new SolidBrush(Color.Black);

        #endregion

        private readonly GeoHierarchyController _gCtl = new GeoHierarchyController();

        protected void Page_Load(object sender, EventArgs e)
        {

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();
            Response.AppendHeader("pragma", "no-cache");


            if (!Page.IsPostBack)
            {
                GetAppSettingDetail();
                txtCustomerDOB.Attributes.Add("readonly", "readonly");
                hfCompanyName.Value = Session["COMPANY_NAME"].ToString();
                lblUserName.Text = Session["UserName"].ToString();
                DateTime date = DateTime.Parse(Session["CurrentWorkDate"].ToString());
                lblDateTime.Text = date.ToString("dd-MMMM-yyyy");
                hfCurrentWorkDate.Value = date.ToString("dd-MMM-yyyy");
                hfUserId.Value = HttpContext.Current.Session["UserID"].ToString();//for default user add in orderbooker dropdown
                hfIS_CanGiveDiscount.Value = HttpContext.Current.Session["IS_CanGiveDiscount"].ToString();

                #region Location Information

                DataSet ds = _gCtl.SelectDataForPosLoad(int.Parse(hfUserId.Value), int.Parse(Session["DISTRIBUTOR_ID"].ToString()), DateTime.Parse(Session["CurrentWorkDate"].ToString()), int.Parse(Session["RoleID"].ToString()));

                if (ds.Tables[0].Rows.Count > 0)
                {
                    hfSalesTax.Value = ds.Tables[0].Rows[0]["GST"].ToString();
                    hfIsCoverTable.Value = ds.Tables[0].Rows[0]["ISCOVERTABLE"].ToString();
                    hfServiceCharges.Value = ds.Tables[0].Rows[0]["SERVICE_CHARGES"].ToString();
                    hfLocationName.Value = ds.Tables[0].Rows[0]["DISTRIBUTOR_NAME"].ToString();
                    hfAddress.Value = ds.Tables[0].Rows[0]["ADDRESS1"].ToString();
                    hfPhoneNo.Value = ds.Tables[0].Rows[0]["CONTACT_NUMBER"].ToString();
                    hfRegNo.Value = ds.Tables[0].Rows[0]["GST_NUMBER"].ToString();
                    hfFacebkId.Value = ds.Tables[0].Rows[0]["FACEBOOK"].ToString();
                    hfIsCard.Value = ds.Tables[0].Rows[0]["CARD_TYPE_ID"].ToString();

                    Session.Add("HOLD_MSG", ds.Tables[0].Rows[0]["HOLD_MSG"].ToString());
                    Session.Add("RIDE_MSG", ds.Tables[0].Rows[0]["RIDE_MSG"].ToString());
                    Session.Add("IsSMSonDeliveryHoldOrder", ds.Tables[0].Rows[0]["IsSMSonDeliveryHoldOrder"].ToString());
                    Session.Add("MessageonDeliveryHoldOrder", ds.Tables[0].Rows[0]["strMessageonDeliveryHoldOrder"].ToString());
                    if (ds.Tables[0].Rows[0]["SHOW_LOGO"].ToString() == "True")
                    {
                        imgLogo.Src = "../Pics/" + ds.Tables[0].Rows[0]["PIC"].ToString();
                        imgLogo2.Src = "../Pics/" + ds.Tables[0].Rows[0]["PIC"].ToString();
                    }
                    hfPrintKOT.Value = ds.Tables[0].Rows[0]["PrintKOT"].ToString();
                    hfPrintKOTDelivery.Value = ds.Tables[0].Rows[0]["PrintKOTDelivery"].ToString();
                    hfPrintKOTTakeaway.Value = ds.Tables[0].Rows[0]["PrintKOTTakeaway"].ToString();
                    Session.Add("hfServiceChargesType", ds.Tables[0].Rows[0]["SERVICE_CHARGES_TYPE"]);

                    string url = HttpContext.Current.Request.Url.AbsoluteUri;
                }
                else
                {
                    Response.Redirect("Home.aspx");
                }

                if (ds.Tables[1].Rows.Count > 0)
                {
                    hfCompanyEmail.Value = ds.Tables[1].Rows[0]["EMAIL_ADDRESS"].ToString();
                }
                if (ds.Tables[2].Rows.Count > 0)
                {
                    hfCan_DineIn.Value = ds.Tables[2].Rows[0]["Can_DineIn"].ToString();
                    hfCan_Delivery.Value = ds.Tables[2].Rows[0]["Can_Delivery"].ToString();
                    hfCan_TakeAway.Value = ds.Tables[2].Rows[0]["Can_TakeAway"].ToString();

                }
                if (ds.Tables[3].Rows.Count > 0)
                {
                    hfReport.Value = GetJson(ds.Tables[3]);

                }
                if (ds.Tables[4].Rows.Count > 0)//sLIP notes
                {
                    System.Text.StringBuilder sb = new System.Text.StringBuilder();

                    foreach (DataRow dr in ds.Tables[4].Rows)
                    {
                        sb.Append(dr["SLIP_NOTE"]);
                        sb.Append("<br />");
                    }
                    ltrlSlipNote.Text = sb.ToString();
                }

                if (ds.Tables[6].Rows.Count > 0)
                {
                    hfGSTCalculation.Value = ds.Tables[6].Rows[0]["GSTCalculation"].ToString();
                    Session.Add("BillFormat", ds.Tables[6].Rows[0]["BillFormat"].ToString());
                }
                #endregion

                #region Stock Validation

                DataTable dtAppSettingDetail = (DataTable)Session["dtAppSettingDetail"];
                if (dtAppSettingDetail.Rows.Count > 0)
                {
                    if (dtAppSettingDetail.Rows[0]["ShowClosingStockStatus"].ToString() == "1")
                    {
                        hfStockStatus.Value = "True";
                    }
                    else
                    {
                        hfStockStatus.Value = "False";
                    }
                }

                bool IsFinanceIntegrate = false;

                if (dtAppSettingDetail.Rows[0]["IsFinanceIntegrate"].ToString() == "1")
                {
                    IsFinanceIntegrate = true;
                }

                DataTable dtCOAConfig = GetCOAConfiguration();
                HttpContext.Current.Session.Add("dtCOAConfig", dtCOAConfig);
                HttpContext.Current.Session.Add("IsFinanceIntegrate", IsFinanceIntegrate);
                #endregion
            }
        }

        //=======  Page Load #Stock Validation region==============\\
        public string GetConfigValue(int Code, DataTable dt, DataRow[] dr)
        {
            try
            {
                dr = dt.Select("CODE = '" + Code + "' ");
                return dr[0][2].ToString();
            }
            catch (Exception EX)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + EX + "');", true);
                return null;
            }
        }

        private DataTable GetCOAConfiguration()
        {
            try
            {
                COAMappingController _cController = new COAMappingController();
                DataTable dtCOAConfig = _cController.SelectCOAConfiguration(5, Constants.ShortNullValue, Constants.LongNullValue, "Level 4");

                if (dtCOAConfig.Rows.Count > 0)
                {
                    return dtCOAConfig;
                }

                return null;
            }
            catch (Exception)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Plz Configure Financial Integration Settings');", true);

                return null;
            }
        }

        
        //==========================================on Page Load
        [WebMethod]
        [ScriptMethod]
        public static string LoadSaleForce(string customerType)
        {
            int customerTypeId = Constants.SALES_FORCE_ORDERBOOKER;

            if (customerType == "Delivery")
            {
                customerTypeId = Constants.SALES_FORCE_DELIVERYMAN;
            }

            SaleForceController mDController = new SaleForceController();
            DataTable dt = mDController.SelectSaleForceAssignedArea(customerTypeId, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, int.Parse(HttpContext.Current.Session["companyId"].ToString()), Constants.IntNullValue);
            return GetJson(dt);
        }


        //on Page Load, After Payment Save, Cancel
        [WebMethod]
        [ScriptMethod]
        public static string LoadDiscountUser()
        {
            SaleForceController mDController = new SaleForceController();

            DataSet ds = mDController.SelectSaleForceUsers(0, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()),
                 int.Parse(HttpContext.Current.Session["companyId"].ToString()));

            return ds.GetXml();
        }


        [WebMethod]
        public static void UnlockRecord()
        {
            GeoHierarchyController _gCtl = new GeoHierarchyController();
            _gCtl.UnlockRecord(DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
        }

        public static int CustomerType(string pCustomerType)
        {
            if (pCustomerType == "Dine In")
            {
                return 1;
            }
            else if (pCustomerType == "Delivery")
            {
                return 2;
            }
            return 3;
        }
        
        #region Category, Products, Product Stock Status

        [WebMethod]
        public static string LoadProductCategroy(bool ItemType, int ItemId)
        {
            SkuHierarchyController mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), ItemId, 1, null, null, ItemType, 14, Constants.IntNullValue);
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();

            foreach (DataRow row in dt.Rows)
            {
                Dictionary<string, object> dRow = new Dictionary<string, object>
                {
                    {"CAT_ID", row["SKU_HIE_ID"]},
                    {"CAT_NAME", row["SKU_HIE_NAME"]},
                    {"ParentCategoryID",row["PARENT_SKU_HIE_TYPE_ID"] },
                    {"IsDealCategory", row["IsDealCategory"] }
                };
                rows.Add(dRow);
            }
            System.Web.Script.Serialization.JavaScriptSerializer jSearializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            return jSearializer.Serialize(rows);
        }

        [WebMethod]
        public static string LoadAllProducts(string LocationID)
        {
            var mSkuController = new SkuController();
            try
            {
                DateTime CurrentWorkDate = Constants.DateNullValue;
                DataTable dtLocationInfo = (DataTable)HttpContext.Current.Session["dtLocationInfo"];
                foreach (DataRow dr in dtLocationInfo.Rows)
                {
                    if (dr["DISTRIBUTOR_ID"].ToString() == LocationID)
                    {
                        if (dr["MaxDayClose"].ToString().Length > 0)
                        {
                            CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                            break;
                        }
                    }
                }

                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()),Constants.IntNullValue, 1, Constants.IntNullValue,int.Parse(LocationID), CurrentWorkDate, 1);
                return GetJson(dtSkus);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [WebMethod]
        public static string LoadProductStatus(int id, string LocationID)
        {
            var mSkuController = new SkuController();
            try
            {
                DateTime CurrentWorkDate = Constants.DateNullValue;
                DataTable dtLocationInfo = (DataTable)HttpContext.Current.Session["dtLocationInfo"];
                foreach (DataRow dr in dtLocationInfo.Rows)
                {
                    if (dr["DISTRIBUTOR_ID"].ToString() == LocationID)
                    {
                        if (dr["MaxDayClose"].ToString().Length > 0)
                        {
                            CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                            break;
                        }
                    }
                }

                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()),Constants.IntNullValue, 1, id,int.Parse(LocationID), CurrentWorkDate, 2);
                return GetJson(dtSkus);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [WebMethod]
        public static string LoadModifierItems()
        {
            SkuController SKUs = new SkuController();
            DataTable dtModifiers = SKUs.SelectModifier(0);
            return GetJson(dtModifiers);
        }
        #endregion

        #region Bills

        [WebMethod]
        [ScriptMethod]
        public static string SelectPendingBills(string customerType, string LocationID)
        {
            if(LocationID == null)
            {
                LocationID = "0";
            }
            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)HttpContext.Current.Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == LocationID)
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }

            int customerTypeId = -1;

            if (customerType == "Dine In")
            {
                customerTypeId = 1;
            }
            else if (customerType == "Delivery")
            {
                customerTypeId = 2;
            }
            else if (customerType == "Takeaway")
            {
                customerTypeId = 3;
            }

            var mSkuController = new OrderEntryController();
            DataSet ds = mSkuController.SelectPendingBillsDataset(Constants.LongNullValue,CurrentWorkDate, int.Parse(LocationID), int.Parse(HttpContext.Current.Session["UserID"].ToString()), customerTypeId,false, 7);
            return JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
        }

        [WebMethod]
        public static string GetPendingBill(long saleInvoiceMasterId)
        {
            var mSkuController = new SkuController();
            DataTable dtSkus = mSkuController.SpGetPendingBill(saleInvoiceMasterId,1, Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            if (dtSkus.Rows.Count > 0)
            {
                HttpContext.Current.Session.Add("InvoicePrinted", dtSkus.Rows[0]["InvoicePrinted"]);
            }
            return GetJson(dtSkus);
        }

        #endregion

        #region Loyalty 

        [WebMethod]
        [ScriptMethod]
        public static string LoadLoyaltyCardDetail(string cardNo)
        {
            var mController = new LoyaltyController();
            try
            {
                DataTable dtCardDetail = mController.GetLoyaltyCardDetail(cardNo, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()),0);
                return GetJson(dtCardDetail);
            }
            catch (Exception)
            {
                throw;
            }
        }


        #endregion

        #region Customer

        [WebMethod]
        [ScriptMethod]
        public static string LoadLocation()
        {
            var mController = new DistributorController();
            try
            {
                DataTable dtLocations = mController.GetDistributorWithMaxDayClose(Constants.IntNullValue, Convert.ToInt32(HttpContext.Current.Session["UserId"]), Convert.ToInt32(HttpContext.Current.Session["CompanyId"]), 1);
                HttpContext.Current.Session.Add("dtLocationInfo", dtLocations);
                return GetJson(dtLocations);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static string LoadAllCustomers(string customerName, string type, string LocationID)
        {
            DateTime CurrentWorkDate = Constants.DateNullValue;
            DataTable dtLocationInfo = (DataTable)HttpContext.Current.Session["dtLocationInfo"];
            foreach (DataRow dr in dtLocationInfo.Rows)
            {
                if (dr["DISTRIBUTOR_ID"].ToString() == LocationID)
                {
                    if (dr["MaxDayClose"].ToString().Length > 0)
                    {
                        CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                        break;
                    }
                }
            }

            var mController = new CustomerDataController();
            try
            {
                DataTable dtCustomers = mController.UspSelectCustomer(int.Parse(LocationID), type, customerName, CurrentWorkDate);
                return GetJson(dtCustomers);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static void InsertCustomer(string cardID, string CNIC, string contactNumer, string contactNumer2, string customerName, string address, string DOB, string OpeningAmount, string Nature, string email, string LocationID)
        {
            try
            {
                int distributerId = int.Parse(LocationID);
                var dc = new DataControl();
                CustomerDataController.InsertCustomer(distributerId, cardID, CNIC, DOB, contactNumer, email, customerName, address, null, Convert.ToDecimal(dc.chkNull_0(OpeningAmount)), Nature, contactNumer2, 0, 0, 0, 0, 0,0,0);
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        #endregion

        #region  Order Hold, Update, Invoice

        [WebMethod]
        [ScriptMethod]
        public static void HoldOrder(string orderedProducts, string orderBooker, string coverTable, string customerType, string CustomerName
            , string maxOrderNo, string printType, string tableName, string takeAwayCustomer, string bookerName, string tabId, string CustomerNo
            , string VoidBy,string manualOrderNo, string remarks, string LocationID)
        {

            //if (IsDayClosed())
            //{
            //    UserController UserCtl = new UserController();

            //    UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            //    HttpContext.Current.Session.Clear();
            //    System.Web.Security.FormsAuthentication.SignOut();
            //    HttpContext.Current.Response.Redirect("../Login.aspx");
            //}

            #region Validation


            int tableId = 0;
            int customerId = 0;

            int customerTypeId = CustomerType(customerType);


            if (customerTypeId == 1)
            {
                tableId = int.Parse(tabId);
            }
            else if (customerTypeId == 2)
            {
                customerId = Convert.ToInt32(CustomerName);
            }

            int intVoidBy = Convert.ToInt32(HttpContext.Current.Session["UserID"]);
            
            #endregion

            try
            {
                DateTime CurrentWorkDate = Constants.DateNullValue;
                DataTable dtLocationInfo = (DataTable)HttpContext.Current.Session["dtLocationInfo"];
                foreach (DataRow dr in dtLocationInfo.Rows)
                {
                    if (dr["DISTRIBUTOR_ID"].ToString() == LocationID)
                    {
                        if (dr["MaxDayClose"].ToString().Length > 0)
                        {
                            CurrentWorkDate = Convert.ToDateTime(dr["MaxDayClose"]);
                            break;
                        }
                    }
                }

                DataTable  dtValue = new DataTable();

                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                
                int distributerId = int.Parse(LocationID);

                if (orderedProducts != "")
                {
                    dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
                    HttpContext.Current.Session.Add("dtValue", dtValue);
                }

                if (dtValue != null && dtValue.Rows.Count > 0 &&
                    dtValue.Rows[0]["INVOICE_ID"].ToString().Trim() != "N/A")
                {
                    DataTable dtCOAConfig = (DataTable)HttpContext.Current.Session["dtCOAConfig"];
                    bool IsFinanceIntegrate = (bool)HttpContext.Current.Session["IsFinanceIntegrate"];
                    DataTable dtInvoice = OrderEntryController.GetInvoiceDetail(Convert.ToInt64(dtValue.Rows[0]["INVOICE_ID"]));
                    string OldInvoiceJson = GetJson(dtInvoice);
                    OrderEntryController.HoldOrder(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()), Constants.IntNullValue,customerTypeId, tableId, 0, 0, 0, 0, 0, true, userId, CurrentWorkDate, distributerId, 0,dtValue, int.Parse(orderBooker), coverTable, takeAwayCustomer,intVoidBy, manualOrderNo, remarks,0, customerId, Convert.ToBoolean(HttpContext.Current.Session["InvoicePrinted"]),0,0,"1",0,0, 0, 0, 0, 0, HttpContext.Current.Session["LocationWiseRecipe"].ToString(),0,true,true, Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]),true,1,dtInvoice,OldInvoiceJson,5, IsFinanceIntegrate,dtCOAConfig);
                }
                else
                {
                    decimal GSTPER = 0;
                    decimal GSTPERCreditCard = 0;
                    OrderEntryController.Add_Invoice(Constants.IntNullValue, customerTypeId, tableId, 0, 0, 0,0, true,userId, CurrentWorkDate, distributerId, dtValue, int.Parse(orderBooker), coverTable, customerId, maxOrderNo, takeAwayCustomer, manualOrderNo, remarks,1,1, Convert.ToInt32(HttpContext.Current.Session["hfServiceChargesType"]),5,true, true, GSTPER, GSTPERCreditCard, HttpContext.Current.Session["BillFormat"].ToString(),0,0,0,0, 0, 0, Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]),1,0);

                    if (dtValue.Rows.Count > 0)
                    {
                        if (customerTypeId == 2)
                        {
                            if (HttpContext.Current.Session["IsSMSonDeliveryHoldOrder"].ToString() == "True")
                            {
                                String message = HttpUtility.UrlEncode(HttpContext.Current.Session["MessageonDeliveryHoldOrder"].ToString()) + " ";
                                foreach (DataRow row in dtValue.Rows)
                                {
                                    message += row["SKU_NAME"].ToString() + "-" + row["QTY"].ToString() + ", ";
                                }
                                if (message.Length > 0)
                                {
                                    message = message.Remove(message.Length - 2);
                                }
                                SendSMS(CustomerNo, message);
                            }
                        }
                    }
                }


            }
            catch (FormatException ex)
            {
                throw new Exception("Please enter price", ex);
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;

            }
        }

        #endregion
        
        #region Print-INvoice       

        private static void PrintReport()
        {
            try
            {
                PrintDocument prnDocument = new PrintDocument();
                prnDocument.PrinterSettings.PrinterName = (System.Configuration.ConfigurationManager.AppSettings["PrinterName"]);
                prnDocument.PrintPage += new PrintPageEventHandler(prnDocument_PrintPage);
                prnDocument.Print();
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        private static void prnDocument_PrintPage(object sender, PrintPageEventArgs e)
        {
            leftMargin = (int)e.MarginBounds.Left;//100
            rightMargin = (int)e.MarginBounds.Right;//215
            topMargin = (int)e.MarginBounds.Top;//100
            topMargin = 1;
            bottomMargin = (int)e.MarginBounds.Bottom;//1069
            InvoiceWidth = (int)e.MarginBounds.Width;//115
            InvoiceHeight = (int)e.MarginBounds.Height;//969

            SetInvoiceHead(e.Graphics); // Draw Invoice Head
            SetInvoiceData(e.Graphics, e); // Draw Invoice Data
        }


        private static void SetInvoiceHead(Graphics g)
        {
            // for Invoice Head:
            string InvSubTitle3 = string.Empty;
            string InvSubTitle4 = string.Empty;
            CurrentY = topMargin;
            CurrentX = leftMargin;

            InvTitleHeight = (int)(InvTitleFont.GetHeight(g));
            InvSubTitleHeight = (int)(InvSubTitleFont.GetHeight(g));

            // Get Titles Length:

            int lenInvSubTitle3 = (int)g.MeasureString(InvSubTitle3, InvSubTitleFont).Width;
            int lenInvSubTitle4 = (int)g.MeasureString(InvSubTitle4, InvSubTitleFont).Width;
            // Set Titles Left:

            int xInvSubTitle3 = CurrentX + (InvoiceWidth - lenInvSubTitle3) / 2;
            int xInvSubTitle4 = CurrentX + (InvoiceWidth - lenInvSubTitle4) / 2;

            InvSubTitle3 = "SECTION: " + HttpContext.Current.Session["_section"].ToString();

            if (InvSubTitle3 != "")
            {
                CurrentY = CurrentY + InvSubTitleHeight + 10;
                g.DrawString(InvSubTitle3, InvSubTitleFont, BlueBrush, 10, CurrentY);
            }
            CurrentY = CurrentY + 25;
            g.DrawString("Service Type: " + HttpContext.Current.Session["customerType"], InvoiceFont, BlueBrush, 10, CurrentY);

            if (HttpContext.Current.Session["customerType"].ToString() == "Delivery")
            {
                CurrentY = CurrentY + 20;
                g.DrawString("D-M: " + HttpContext.Current.Session["bookerName"], InvoiceFont, BlueBrush, 10, CurrentY);

                CurrentY = CurrentY + 20;
                g.DrawString("Customer: " + HttpContext.Current.Session["tableName"], InvoiceFont, BlueBrush, 10, CurrentY);
            }

            else if (HttpContext.Current.Session["customerType"].ToString() == "Dine In")
            {
                CurrentY = CurrentY + 20;
                g.DrawString("O-T: " + HttpContext.Current.Session["bookerName"], InvoiceFont, BlueBrush, 10, CurrentY);

                CurrentY = CurrentY + 20;
                g.DrawString("Table No: " + HttpContext.Current.Session["tableName"], InvoiceFont, BlueBrush, 10, CurrentY);
            }
            else
            {
                CurrentY = CurrentY + 20;
                g.DrawString("O-T: " + HttpContext.Current.Session["bookerName"], InvoiceFont, BlueBrush, 10, CurrentY);

                CurrentY = CurrentY + 20;
                g.DrawString("Customer: " + HttpContext.Current.Session["tableName"], InvoiceFont, BlueBrush, 10, CurrentY);
            }

            CurrentY = CurrentY + 20;
            g.DrawString("Date: " + DateTime.Now.ToString("dd-MMM-yyyy hh:mm tt"), InvoiceFont2, BlueBrush, 10, CurrentY);
            g.DrawString(HttpContext.Current.Session["maxOrderNo"].ToString(), InvOrderTitleFont, BlueBrush, 150, CurrentY - 20);

            int XNoOfuntit = (int)g.MeasureString("", InvoiceFont).Width + 180;
            int YNoOfUnit = CurrentY;

            CurrentY = CurrentY + 25;
            g.DrawLine(new Pen(Brushes.Black, 2), 10, CurrentY, 300, CurrentY);//
            CurrentY = CurrentY + 5;
        }


        private static void SetInvoiceData(Graphics g, PrintPageEventArgs e)
        {

            // Set Invoice Table:
            string FieldValue = "";
            int CurrentRecord = 0;

            // Set Table Head:
            int xProductID = 10;//leftMargin;

            CurrentY = CurrentY + 4;//InvoiceFontHeight;
            g.DrawString("Item Name", InvoiceFont, BlueBrush, xProductID, CurrentY);

            int xProductName = xProductID + (int)g.MeasureString("Item Name", InvoiceFont).Width + 70;//162 Edit by safdar om 20160806
            g.DrawString("Qty", InvoiceFont, BlueBrush, xProductName, CurrentY);

            CurrentY = CurrentY + 20;
            g.DrawLine(new Pen(Brushes.Black, 2), 10, CurrentY, 300, CurrentY);
            CurrentY = CurrentY + 10;
            DataTable dtValue = HttpContext.Current.Session["dtValue"] as DataTable;
            DataView dv = dtValue.DefaultView;
            dv.Sort = "C1";
            dtValue = dv.ToTable();

            if (dtValue.Rows.Count > 0)
            {
                foreach (DataRow dr in dtValue.Rows)
                {
                    if (dr["SECTION"].ToString() == HttpContext.Current.Session["_section"].ToString())
                    {
                        decimal qty = Convert.ToDecimal(dr["QTY"].ToString()) - Convert.ToInt32(dr["PR_COUNT"].ToString());

                        string IS_VOID = dr["VOID"].ToString();

                        if (IS_VOID == "false")
                        {
                            if (qty > 0)
                            {

                                FieldValue = Convert.ToString(dr["C1"]) + "-" + Convert.ToString(dr["SKU_NAME"]);// name
                                if (FieldValue.Length > 30)
                                {
                                    string FieldValue2 = FieldValue.Substring(0, 31);
                                    g.DrawString(FieldValue2, InvoiceFont2, BlackBrush, xProductID, CurrentY);

                                    FieldValue = FieldValue.Substring(31);
                                    g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductID, CurrentY + 20);

                                    FieldValue = Convert.ToString(qty);// Qty
                                    g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductName, CurrentY);

                                    CurrentY = CurrentY + 40;
                                    g.DrawLine(new Pen(Brushes.Black, 1), 10, CurrentY, 300, CurrentY);

                                }
                                else
                                {
                                    g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductID, CurrentY);


                                    FieldValue = Convert.ToString(qty);// Qty
                                    g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductName, CurrentY);

                                    CurrentY = CurrentY + 20;
                                    g.DrawLine(new Pen(Brushes.Black, 1), 10, CurrentY, 300, CurrentY);
                                }
                                CurrentY = CurrentY + 10;
                                CurrentRecord++;
                            }
                            if (Convert.ToDecimal(dr["QTY"].ToString()) == 0)
                            {
                                if (qty == 0)
                                {
                                    FieldValue = Convert.ToString(dr["C1"]) + "-" + Convert.ToString(dr["SKU_NAME"]);// name
                                    if (FieldValue.Length > 30)
                                    {
                                        string FieldValue2 = FieldValue.Substring(0, 31);
                                        g.DrawString(FieldValue2, InvoiceFont2, BlackBrush, xProductID, CurrentY);

                                        FieldValue = FieldValue.Substring(31);
                                        g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductID, CurrentY + 20);

                                        FieldValue = Convert.ToString(qty);// Qty
                                        g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductName, CurrentY);

                                        CurrentY = CurrentY + 40;
                                        g.DrawLine(new Pen(Brushes.Black, 1), 10, CurrentY, 300, CurrentY);

                                    }
                                    else
                                    {
                                        g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductID, CurrentY);


                                        FieldValue = Convert.ToString(qty);// Qty
                                        g.DrawString(FieldValue, InvoiceFont2, BlackBrush, xProductName, CurrentY);

                                        CurrentY = CurrentY + 20;
                                        g.DrawLine(new Pen(Brushes.Black, 1), 10, CurrentY, 300, CurrentY);
                                    }
                                    CurrentY = CurrentY + 10;
                                    CurrentRecord++;
                                }
                            }
                        }
                    }
                }
            }

            if (CurrentRecord > 0)
            {

                g.Dispose();
            }
        }



        #endregion

        [WebMethod]
        [ScriptMethod]
        public static string ValidateUser(string UserId, string UserPass, string UserClick)
        {
            DataTable dtAppSettingDetail = (DataTable)HttpContext.Current.Session["dtAppSettingDetail"];
            var _mController = new UserController();
            var mSkuController = new OrderEntryController();
            int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
            bool IsEncrypted = false;
            if(dtAppSettingDetail.Rows[0]["IsEncreptedCredentials"].ToString() == "1")
            {
                IsEncrypted = true;
            }
            if (IsEncrypted)
            {
                if (dtAppSettingDetail.Rows[0]["Deployed"].ToString() == Cryptography.Encrypt("Deployed", "b0tin@74"))
                {
                    UserPass = Cryptography.Encrypt(UserPass, "b0tin@74");
                }
            }
            DataTable dt = _mController.SelectValidateUser(distributerId, UserId, UserPass);
            if (dt != null)
            {
                DataRow[] foundRow = null;
                if (UserClick == "Delete")
                {
                    foundRow = dt.Select("IsDelRight=" + 1);
                }
                else
                {
                    foundRow = dt.Select("IsLessRight=" + 1);
                }
                if (foundRow.Length > 0)
                {
                    return GetJson(dt);
                }
                return null;
            }
            return null;

        }

        protected void lnkExit_OnClick(object sender, EventArgs e)
        {

            Response.Redirect("Home.aspx");

        }

        private static bool IsDayClosed()
        {
            DistributorController DistrCtl = new DistributorController();
            try
            {
                DataTable dtDayClose = DistrCtl.MaxDayClose(Convert.ToInt32(HttpContext.Current.Session["DISTRIBUTOR_ID"]), 3);
                if (dtDayClose.Rows.Count > 0)
                {
                    if (Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]) == Convert.ToDateTime(dtDayClose.Rows[0]["DayClose"]))
                    {
                        return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;

            }
        }

        #region SMS


        //msgType: 1 for hold, 2 for Ride

        [WebMethod]
        [ScriptMethod]
        public static string SendSMS(string customerNo, string msg)
        {
            customerNo = CheckNumber(customerNo);
            string connString = System.Configuration.ConfigurationManager.AppSettings["DBAuthentication"].ToString() +
            "," + System.Configuration.ConfigurationManager.AppSettings["Server"].ToString()
            + "," + System.Configuration.ConfigurationManager.AppSettings["DBName"].ToString()
            + "," + System.Configuration.ConfigurationManager.AppSettings["DBUser"].ToString()
            + "," + System.Configuration.ConfigurationManager.AppSettings["DBPassword"].ToString();
            string result = "";
            StreamWriter myWriter = null;
            string SMSServiceURL = "";
            try
            {
                SMSServiceURL = System.Configuration.ConfigurationManager.AppSettings["SMSServiceURL"].ToString();
            }
            catch (Exception)
            {
                return "SMS Service URL not found in web.config";
            }
            string strPost = "DistributorID=" + HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString() + "&message=" + msg + "&receipients=" + customerNo + "&connString=" + connString;
            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(SMSServiceURL + "SendSMS");

            objRequest.Method = "POST";
            objRequest.ContentLength = Encoding.UTF8.GetByteCount(strPost);
            objRequest.ContentType = "application/x-www-form-urlencoded";
            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(strPost);
            }
            catch (Exception exp)
            {
                return exp.ToString();
            }
            finally
            {
                myWriter.Close();
            }
            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();
                sr.Close();
            }
            return result;
        }

        private static string CheckNumber(string CNO)
        {
            string Customer_No = "";
            string CONTACT_NO = CNO;
            if (CONTACT_NO.Length == 11) // 0300xxxxxxx
            {
                string str = CNO.Substring(0, 2);
                if (str.ToString() == "03")
                {
                    string str1 = CNO.Substring(1, 10);
                    Customer_No = "92" + str1;
                }
                else
                {
                    Customer_No = "0";
                }
            }
            else if (CONTACT_NO.Length == 12) // 92300xxxxxxx
            {
                string str = CNO.Substring(0, 3);
                if (str.ToString() == "923")
                {
                    Customer_No = CNO;
                }
                else
                {
                    Customer_No = "0";
                }
            }
            else if (CONTACT_NO.Length == 13) // 920300xxxxxxx
            {
                string str = CNO.Substring(0, 3);
                if (str.ToString() == "920")
                {
                    string str1 = CNO.Substring(0, 2);
                    string str2 = CNO.Substring(3, 10);
                    Customer_No = str1 + str2;
                }
                else
                {
                    Customer_No = "0";
                }

            }
            else if (CONTACT_NO.Length == 14) // 0092300xxxxxxx
            {
                string str = CNO.Substring(0, 5);
                if (str.ToString() == "00923")
                {
                    string str1 = CNO.Substring(2, 2);
                    string str2 = CNO.Substring(4, 10);
                    Customer_No = str1 + str2;
                }
                else
                {
                    Customer_No = "0";
                }
            }
            else if (CONTACT_NO.Length == 15) // 00920300xxxxxxx
            {
                string str = CNO.Substring(0, 5);
                if (str.ToString() == "00920")
                {
                    string str1 = CNO.Substring(2, 2);
                    string str2 = CNO.Substring(5, 10);
                    Customer_No = str1 + str2;
                }
                else
                {
                    Customer_No = "0";
                }
            }
            return Customer_No;
        }

        #endregion

        #region SMS GSM 

        public class CommSetting : IDisposable
        {
           public GsmCommMain comm;
            
            public CommSetting()
            {

            }
            

            ~CommSetting()
            {
                Dispose(false);
            }

            public void Dispose()
            {
                Dispose(true);
                GC.SuppressFinalize(this.comm);
            }

            private void Dispose(bool disposing)
            {
                if (this.comm.IsOpen())
                {
                    this.comm.Close();
                }
           }
        }

        #endregion

        public static string GetJson(DataTable dt)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            serializer.MaxJsonLength = Int32.MaxValue;
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row = null;

            foreach (DataRow dr in dt.Rows)
            {
                row = dt.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => dr[col]);
                rows.Add(row);
            }
            return serializer.Serialize(rows);
        }

        public void GetAppSettingDetail()
        {
            try
            {
                AppSettingDetail _cController = new AppSettingDetail();
                DataTable dtAppSetting = _cController.GetAppSettingDetail(1);
                if (dtAppSetting.Rows.Count > 0)
                {
                    Session.Add("dtAppSettingDetail", dtAppSetting);
                }
            }
            catch (Exception ex)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "msg3", "alert('Error Occured: \n" + ex + "');", true);
            }
        }
    }
}