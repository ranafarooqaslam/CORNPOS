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
using System.Drawing;
using GsmComm.GsmCommunication;
using System.Net;
using System.Text;
using System.Linq;
using QRCoder;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace Forms
{
    public partial class frmOrderPOSCallCenter : System.Web.UI.Page
    {
        private readonly GeoHierarchyController _gCtl = new GeoHierarchyController();
        private readonly TaxAuthorityController objTax = new TaxAuthorityController();

        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();
            Response.AppendHeader("pragma", "no-cache");
            if (!Page.IsPostBack)
            {
                GetAppSettingDetail();
                DataTable configDt = (DataTable)Session["dtAppSettingDetail"];
                lnkCashRegisterClosing.Visible = false;
                if (configDt != null && configDt.Rows.Count > 0)
                {
                    bool showCashRegisterClosingBtn = Convert.ToBoolean(Convert.ToInt32(configDt.Rows[0]["EnableCashRegsiterOnPOS"]));
                    if (showCashRegisterClosingBtn == true)
                    {
                        lnkCashRegisterClosing.Visible = true;
                        ShiftController mController = new ShiftController();
                        DataTable dtClosedShifts = mController.SelectSales(int.Parse(Session["DISTRIBUTOR_ID"].ToString()),int.Parse(HttpContext.Current.Session["UserID"].ToString()),DateTime.Parse(Session["CurrentWorkDate"].ToString()),Constants.DateNullValue, 7, Convert.ToInt32(Session["ShiftId"]));
                        if (dtClosedShifts.Rows.Count > 0)
                        {
                            ScriptManager.RegisterStartupScript(this, this.GetType(),
                            "alert",
                            "alert('Shift is already Closed, Cannot use POS');window.location ='Home.aspx';",
                            true);
                            return;
                        }
                        DataTable dtpeningAmount = mController.SelectSales(int.Parse(Session["DISTRIBUTOR_ID"].ToString()),int.Parse(HttpContext.Current.Session["UserID"].ToString()),DateTime.Parse(Session["CurrentWorkDate"].ToString()),Constants.DateNullValue, 10, Convert.ToInt32(Session["ShiftId"]));
                        if (dtpeningAmount == null || dtpeningAmount.Rows.Count == 0)
                        {
                            ScriptManager.RegisterStartupScript(this, this.GetType(),
                           "alert",
                           "alert('Please enter Cash Register Opening Amount');window.location ='Home.aspx';",
                           true);
                            return;
                        }
                    }
                }
                try
                {
                    lblLicense.Text = Session["LicenseMessage"].ToString();
                }
                catch (Exception)
                {
                }
                if (IsDayClosed())
                {
                    UserController UserCtl = new UserController();
                    UserCtl.InsertUserLogoutTime(Convert.ToInt32(Session["User_Log_ID"]), Convert.ToInt32(Session["UserID"]));
                    Session.Clear();
                    System.Web.Security.FormsAuthentication.SignOut();
                    Response.Redirect("../Login.aspx");
                }
                txtCustomerDOB.Attributes.Add("readonly", "readonly");
                hfCompanyName.Value = Session["COMPANY_NAME"].ToString();
                lblUserName.Text = Session["UserName"].ToString();
                DateTime date = DateTime.Parse(Session["CurrentWorkDate"].ToString());
                lblDateTime.Text = date.ToString("dd-MMM-yyyy");
                hfCurrentWorkDate.Value = date.ToString("dd-MMM-yyyy");
                hfUserId.Value = HttpContext.Current.Session["UserID"].ToString();//for default user add in orderbooker dropdown
                hfIS_CanGiveDiscount.Value = HttpContext.Current.Session["IS_CanGiveDiscount"].ToString();
                hfUserType.Value = HttpContext.Current.Session["UserType"].ToString();
                hfItemWiseGST.Value = HttpContext.Current.Session["ItemWiseGST"].ToString();
                hfShowParentCategory.Value = HttpContext.Current.Session["ShowParentCategory"].ToString();
                hfPrintInvoiceFromWS.Value = HttpContext.Current.Session["PrintInvoiceFromWS"].ToString();
                hfHiddenReports.Value = HttpContext.Current.Session["HiddenReports"].ToString();
                
                #region Location Information

                DataSet ds = _gCtl.SelectDataForPosLoad(int.Parse(hfUserId.Value), int.Parse(Session["DISTRIBUTOR_ID"].ToString()), DateTime.Parse(Session["CurrentWorkDate"].ToString()), int.Parse(Session["RoleID"].ToString()));

                if (ds.Tables[0].Rows.Count > 0)
                {
                    hfSalesTax.Value = ds.Tables[0].Rows[0]["GST"].ToString();
                    Session.Add("GSTRate", hfSalesTax.Value);
                    hfSalesTaxCreditCard.Value = ds.Tables[0].Rows[0]["GST_CREDIT_CARD"].ToString();
                    Session.Add("GSTCardRate", hfSalesTaxCreditCard.Value);
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
                    Session.Add("MessageonDeliveryHoldOrder", ds.Tables[0].Rows[0]["strMessageonDeliveryHoldOrder"].ToString());
                    Session.Add("MessageonTakeAway", ds.Tables[0].Rows[0]["strMessageonTakeAway"].ToString());
                    hfDeliveryStartedSMSText.Value = ds.Tables[0].Rows[0]["strMessageOnDeliveryStarted"].ToString();
                    hfDeliveryCompletedSMSText.Value = ds.Tables[0].Rows[0]["strMessageOnDeliveryCompleted"].ToString();
                    Session.Add("IsSMSonTakeAway", ds.Tables[0].Rows[0]["IsSMSonTakeAway"].ToString());
                    Session.Add("IsSMSonDeliveryHoldOrder", ds.Tables[0].Rows[0]["IsSMSonDeliveryHoldOrder"].ToString());
                    Session.Add("MessageOnDeliveryCompleted", ds.Tables[0].Rows[0]["strMessageOnDeliveryCompleted"].ToString());
                    Session.Add("MessageOnDeliveryCompleted2", ds.Tables[0].Rows[0]["strMessageOnDeliveryCompleted2"].ToString());
                    hfIsSMSonTakeAway.Value = ds.Tables[0].Rows[0]["IsSMSonTakeAway"].ToString();
                    if (ds.Tables[0].Rows[0]["SHOW_LOGO"].ToString() == "True")
                    {
                        imgLogo.Src = "../Pics/" + ds.Tables[0].Rows[0]["PIC"].ToString();
                        imgLogo2.Src = "../Pics/" + ds.Tables[0].Rows[0]["PIC"].ToString();
                        imgLogo22.Src = "../Pics/" + ds.Tables[0].Rows[0]["PIC"].ToString();
                    }
                    hfPrintKOT.Value = ds.Tables[0].Rows[0]["PrintKOT"].ToString();
                    Session.Add("hfPrintKOT", hfPrintKOT.Value);
                    hfPrintKOTDelivery.Value = ds.Tables[0].Rows[0]["PrintKOTDelivery"].ToString();
                    hfPrintKOTTakeaway.Value = ds.Tables[0].Rows[0]["PrintKOTTakeaway"].ToString();
                    hfTaxAuthorityLabel.Value = ds.Tables[0].Rows[0]["TAX_AUTHORITY"].ToString();
                    hfTaxAuthorityLabel2.Value = ds.Tables[0].Rows[0]["TAX_AUTHORITY2"].ToString();
                    hfServiceChargesType.Value = ds.Tables[0].Rows[0]["SERVICE_CHARGES_TYPE"].ToString();
                    Session.Add("hfServiceChargesType", hfServiceChargesType.Value);
                    hfServiceChargesValue.Value = ds.Tables[0].Rows[0]["SERVICE_CHARGES_VALUE"].ToString();
                    hfBookingType.Value = ds.Tables[0].Rows[0]["IsDirectKOTPrint"].ToString();
                    hfSTRN.Value = ds.Tables[0].Rows[0]["STRN"].ToString();
                    hfInvoiceFooterType.Value = ds.Tables[0].Rows[0]["InvoiceFooterType"].ToString();
                    hfIsDeliveryCharges.Value = ds.Tables[0].Rows[0]["IsDeliveryCharges"].ToString();
                    hfDELIVERY_CHARGES_TYPE.Value = ds.Tables[0].Rows[0]["DELIVERY_CHARGES_TYPE"].ToString();
                    hfDELIVERY_CHARGES_VALUE.Value = ds.Tables[0].Rows[0]["DELIVERY_CHARGES_VALUE"].ToString();
                    hfAutoPromotion.Value = ds.Tables[0].Rows[0]["AutoPromotion"].ToString();
                    hfPOSFee.Value = ds.Tables[0].Rows[0]["POS_FEE"].ToString();
                    Session.Add("POSFee", hfPOSFee.Value);
                    string url = HttpContext.Current.Request.Url.AbsoluteUri;
                    if (url.Contains("46"))//Order Taking for Tab
                    {
                        if (Session["IsKOTServiceInstalled"].ToString() == "1")
                        {
                            hfBookingType.Value = "0";
                        }
                        else
                        {
                            hfBookingType.Value = "1";
                        }
                    }
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
                    hfCan_ComplimentaryItem.Value = ds.Tables[2].Rows[0]["Can_ComplimentaryItem"].ToString();
                    hfCan_PrintOrder.Value = ds.Tables[2].Rows[0]["Can_PrintOrder"].ToString();
                    hfCanVoidGST.Value = ds.Tables[2].Rows[0]["CanVoidGST"].ToString();
                    hfDefaultServiceType.Value = ds.Tables[2].Rows[0]["DefaultServiceType"].ToString();
                    hfCanAlterServiceCharges.Value = ds.Tables[2].Rows[0]["CanAlterServiceCharges"].ToString();
                    hfCanAlterDeliveryCharges.Value = ds.Tables[2].Rows[0]["CanAlterDeliveryCharges"].ToString();
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
                        sb.Append("<br /> &nbsp;");
                    }
                    ltrlSlipNote.Text = sb.ToString();
                    ltrlSlipNote2.Text = sb.ToString();
                }
                if (ds.Tables[5].Rows.Count > 0)
                {
                    Session.Add("dbSMSSetting", ds.Tables[5]);
                }

                if (ds.Tables[6].Rows.Count > 0)
                {
                    hfGSTCalculation.Value = ds.Tables[6].Rows[0]["GSTCalculation"].ToString();
                    hfServiceChargesCalculation.Value = ds.Tables[6].Rows[0]["ServiceChargesCalculation"].ToString();
                    Session.Add("GSTCalculation", hfGSTCalculation.Value);
                    hfIsKOTMandatory.Value = ds.Tables[6].Rows[0]["IsKOTMandatory"].ToString();
                    hfIsKOTUniquePerDay.Value = ds.Tables[6].Rows[0]["IsKOTUniquePerDay"].ToString();
                    hfPrintCustomerOnDelivery.Value = ds.Tables[6].Rows[0]["PrintCustomerOnDelivery"].ToString();
                    hfShowNTNOnProvissionalBill.Value = ds.Tables[6].Rows[0]["ShowNTNOnProvissionalBill"].ToString();
                    hfBillFormat.Value = ds.Tables[6].Rows[0]["BillFormat"].ToString();
                    Session.Add("BillFormat", hfBillFormat.Value);
                    hfTaxAuthority.Value = ds.Tables[6].Rows[0]["TaxAuthority"].ToString();
                    Session.Add("TaxIntegration", hfTaxAuthority.Value);
                    if (hfTaxAuthority.Value != "0")
                    {
                        DataTable dtTaxAuthority = objTax.GetTaxAuthority(Constants.IntNullValue, 2, int.Parse(Session["DISTRIBUTOR_ID"].ToString()));
                        Session.Add("dtTaxAuthority", dtTaxAuthority);

                        if (dtTaxAuthority.Rows.Count == 0)
                        {
                            hfTaxAuthority.Value = "0";
                            Session.Add("TaxIntegration", "0");
                        }
                    }
                    hfProvisionalBillHeaderFormat.Value = ds.Tables[6].Rows[0]["ProvisionalBillHeaderFormat"].ToString();
                    hfIsFullKOT.Value = ds.Tables[6].Rows[0]["IsFullKOT"].ToString();
                    hfHideOrderInvoieNo.Value = ds.Tables[6].Rows[0]["HideOrderInvoieNo"].ToString();                    
                    hfCustomerEngagement.Value = ds.Tables[6].Rows[0]["CustomerEngagement"].ToString();
                    hfCustomerInfoOnBill.Value = ds.Tables[6].Rows[0]["CustomerInfoOnBill"].ToString();                    
                    hfLocationNameOnKOT.Value = ds.Tables[6].Rows[0]["LocationNameOnKOT"].ToString();
                    hfDiscountAuthentication.Value = ds.Tables[6].Rows[0]["DiscountAuthentication"].ToString();
                    hfCustomerAdvance.Value = ds.Tables[6].Rows[0]["CustomerAdvance"].ToString();
                    hfCanVoidOrder.Value = ds.Tables[6].Rows[0]["CanVoidOrder"].ToString();
                    hfTakeawayTokenIDMandatory.Value = ds.Tables[6].Rows[0]["TakeawayTokenIDMandatory"].ToString();
                    hfShowModifirPriceOnBills.Value = ds.Tables[6].Rows[0]["ShowModifirPriceOnBills"].ToString();
                    hfEatIn.Value = ds.Tables[6].Rows[0]["EatIn"].ToString();
                    hfOwnOrderBookerDataOnTab.Value = ds.Tables[6].Rows[0]["OwnOrderBookerDataOnTab"].ToString();
                    hfServiceChargesOnTakeaway.Value = ds.Tables[6].Rows[0]["ServiceChargesOnTakeaway"].ToString();
                    hfHideBillNo.Value = ds.Tables[6].Rows[0]["HideBillNo"].ToString();
                    Session.Add("EatIn", hfEatIn.Value);
                    hfInvoiceFormat.Value = ds.Tables[6].Rows[0]["InvoiceFormat"].ToString();
                    hfKOTFormat.Value = ds.Tables[6].Rows[0]["KOTFormat"].ToString();
                    hfCustomerMandatoryOnPOS.Value = ds.Tables[6].Rows[0]["CustomerMandatoryOnPOS"].ToString();
                    hfOrderNOInPendingBills.Value = ds.Tables[6].Rows[0]["OrderNOInPendingBills"].ToString();
                    hfDailySalesReportColumns.Value = ds.Tables[6].Rows[0]["DailySalesReportColumns"].ToString();
                    hfHidePrintInvoiceButton.Value = ds.Tables[6].Rows[0]["HidePrintInvoiceButton"].ToString();
                    if (hfAutoPromotion.Value == "1")
                    {
                        PromotionController or = new PromotionController();
                        SKUGroupController gController = new SKUGroupController();

                        DataTable dtPromotion = or.GetPromotion(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]));
                        hftblPromotion.Value = GetJson(dtPromotion);

                        DataTable dtGroup = gController.GetSKUGroupDetail();
                        hftblGroupDetail.Value = GetJson(dtGroup);
                    }
                    if (hfShowParentCategory.Value == "1")
                    {
                        ddlParentCategory.Visible = true;
                    }
                }
                if (ds.Tables[7].Rows.Count > 0)
                {
                    hfEmployeeDiscountType.Value = GetJson(ds.Tables[7]);
                }
                #endregion

                #region Stock Validation

                DataTable dt = (DataTable)Session["dtAppSettingDetail"];

                if (dt.Rows.Count > 0)
                {
                    bool ClosingStockStatus = false;
                    if(dt.Rows[0]["ShowClosingStockStatus"].ToString() == "1")
                    {
                        ClosingStockStatus = true;
                    }
                    hfStockStatus.Value = Convert.ToString(ClosingStockStatus);
                    bool IsFinanceIntegrate = Convert.ToInt32(dt.Rows[0]["IsFinanceIntegrate"]) == 1 ? true : false;
                    DataTable dtCOAConfig = GetCOAConfiguration();
                    HttpContext.Current.Session.Add("dtCOAConfig", dtCOAConfig);
                    HttpContext.Current.Session.Add("IsFinanceIntegrate", IsFinanceIntegrate);
                }
                #endregion
            }
        }

        #region Configuration
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

        #endregion

        #region User Data
        [WebMethod]
        [ScriptMethod]
        public static string LoadSaleForce(string customerType)
        {
            int customerTypeId = Constants.SALES_FORCE_ORDERBOOKER;

            if (customerType == "Delivery")
            {
                customerTypeId = Constants.SALES_FORCE_DELIVERYMAN;
            }

            var mDController = new SaleForceController();

            DataTable dt = mDController.SelectSaleForceAssignedArea(customerTypeId, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, int.Parse(HttpContext.Current.Session["companyId"].ToString()), Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        [ScriptMethod]
        public static string LoadDiscountUser()
        {
            var mDController = new SaleForceController();
            DataSet ds = mDController.SelectSaleForceUsers(0, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["companyId"].ToString()));
            return ds.GetXml();
        }

        [WebMethod]
        [ScriptMethod]
        public static string ValidateUser(string UserId, string UserPass, string UserClick)
        {
            DataTable dtConfigDefault = (DataTable)HttpContext.Current.Session["dtAppSettingDetail"];
            var _mController = new UserController();
            var mSkuController = new OrderEntryController();
            int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
            bool IsEncrypted = Convert.ToBoolean(Convert.ToInt32(dtConfigDefault.Rows[0]["IsEncreptedCredentials"]));
            if (IsEncrypted)
            {
                UserPass = Cryptography.Encrypt(UserPass, "b0tin@74");
            }
            DataTable dt = _mController.SelectValidateUserActive(distributerId, UserId, UserPass);
            if (dt != null)
            {
                DataRow[] foundRow = null;
                if (UserClick == "Delete")
                {
                    foundRow = dt.Select("IsDelRight=" + 1);
                }
                else if(UserClick == "Decrease")
                {
                    foundRow = dt.Select("IsLessRight=" + 1);
                }
                else
                {
                    foundRow = dt.Select("IS_CanGiveDiscount=" + 1);
                }
                if (foundRow.Length > 0)
                {
                    return GetJson(dt);
                }
                return null;
            }
            return null;
        }

        #endregion

        #region Section, Category, Products, Product Stock Status
        [WebMethod]
        public static string LoadSection()
        {
            var mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, 1, null, null, true, 22, Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        public static string GetOpenItemCategory()
        {
            var mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, 1, null, null, true, 23, Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        public static string LoadParentCategroy()
        {
            var mController = new SkuHierarchyController();
            DataTable dt = mController.GetParentCategory(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()));
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            foreach (DataRow row in dt.Rows)
            {
                Dictionary<string, object> dRow = new Dictionary<string, object>
                    {
                        {"CAT_ID", row["SKU_HIE_ID"]},
                        {"CAT_NAME", row["SKU_HIE_NAME"]}
                    };
                rows.Add(dRow);
            }
            System.Web.Script.Serialization.JavaScriptSerializer jSearializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            return jSearializer.Serialize(rows);
        }

        [WebMethod]
        public static string LoadProductCategroy(bool ItemType, int ItemId, int LocationID)
        {
            var mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(LocationID, ItemId, 1, null, null, ItemType, 14, Constants.IntNullValue);
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
                var mController = new DistributorController();
                DataTable dtLocations = mController.GetDistributorWithMaxDayClose(Constants.IntNullValue, Convert.ToInt32(HttpContext.Current.Session["UserId"]), Convert.ToInt32(HttpContext.Current.Session["CompanyId"]), 1);
                HttpContext.Current.Session.Add("dtLocationInfo", dtLocations);
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

                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(LocationID.ToString()), CurrentWorkDate, 1);
                if (Convert.ToInt32(HttpContext.Current.Session["TodayMenuID"]) > 0)
                {
                    for (int i = dtSkus.Rows.Count - 1; i >= 0; i--)
                    {
                        DataRow dr = dtSkus.Rows[i];
                        if (dr["CAT_ID"].ToString() == HttpContext.Current.Session["TodayMenuID"].ToString())
                            dr.Delete();
                    }
                    dtSkus.AcceptChanges();
                    DataTable dtTodayMenu = mSkuController.GetTodayMenuItems(int.Parse(LocationID.ToString()), CurrentWorkDate);
                    foreach (DataRow dr in dtTodayMenu.Rows)
                    {
                        dtSkus.ImportRow(dr);
                    }
                }
                HttpContext.Current.Session.Add("dtItems", dtSkus);
                return GetJson(dtSkus);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [WebMethod]
        public static string LoadModifiers(string LocationID)
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
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(LocationID), CurrentWorkDate, 4);
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
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, id, int.Parse(LocationID.ToString()), CurrentWorkDate, 2);
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
            var SKUs = new SkuController();
            DataTable dtModifiers = SKUs.SelectModifier(0);
            return GetJson(dtModifiers);
        }

        [WebMethod]
        public static string GetOpenItems(string LocationID)
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
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(LocationID), CurrentWorkDate, 6);
                HttpContext.Current.Session.Add("dtItems", dtSkus);
                return GetJson(dtSkus);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [WebMethod]
        public static string InsertOpenItem(string ItemName, int CategoryID, int SectionID)
        {
            var SKUs = new SkuController();
            int skuid = SKUs.InsertOpenItem(ItemName, CategoryID, SectionID, Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            return skuid.ToString();
        }

        #endregion

        #region Bills

        [WebMethod]
        public static void UnlockRecord()
        {
            var _gCtl = new GeoHierarchyController();
            _gCtl.UnlockRecord(DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
        }

        [WebMethod]
        [ScriptMethod]
        public static string SelectPendingBills(string customerType, string LocationID)
        {
            if (LocationID == null)
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

            if (customerType == "Delivery")
            {
                customerTypeId = 2;
            }
            else if (customerType == "Takeaway")
            {
                customerTypeId = 3;
            }
            var mSkuController = new OrderEntryController();
            DataSet ds = mSkuController.SelectPendingBillsDataset(Constants.LongNullValue, CurrentWorkDate, int.Parse(LocationID.ToString()), int.Parse(HttpContext.Current.Session["UserID"].ToString()), customerTypeId, Convert.ToBoolean(HttpContext.Current.Session["hfPrintKOT"]), 7);
            return JsonConvert.SerializeObject(ds, Formatting.None);
        }

        [WebMethod]
        public static string GetPendingBill(long saleInvoiceMasterId)
        {
            var mSkuController = new SkuController();
            DataTable dtSkus = mSkuController.SpGetPendingBill(saleInvoiceMasterId, 8, Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            if (dtSkus.Rows.Count > 0)
            {
                HttpContext.Current.Session.Add("InvoicePrinted", dtSkus.Rows[0]["InvoicePrinted"]);
            }
            return GetJson(dtSkus);
        }

        [WebMethod]
        [ScriptMethod]
        public static string GetCentralizedOrders()
        {
            var mSkuController = new OrderEntryController();
            DataTable dtSkus = mSkuController.SelectPendingBills(Constants.LongNullValue, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserID"].ToString()), Constants.IntNullValue, 8);
            return GetJson(dtSkus);
        }

        [WebMethod]
        public static string CheckKOTNo(string manualOrderNo, string isOldOder, string OldOrderID)
        {
            int pType = 0;
            long pOldOrderID = 0;
            try
            {
                pType = Convert.ToInt32(isOldOder);
            }
            catch (Exception)
            {
                pType = 0;
            }
            try
            {
                pOldOrderID = Convert.ToInt64(OldOrderID);
            }
            catch (Exception)
            {
                pOldOrderID = 0;
            }
            var mSkuController = new SkuController();
            DataTable dtKOT = mSkuController.GetKOTNo(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), manualOrderNo, pOldOrderID, pType);
            return GetJson(dtKOT);
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
                DataTable dtCardDetail = mController.GetLoyaltyCardDetail(cardNo, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), 0);
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
        public static string LoadCustomerThirdPartyDelivery(string customerName, string type)
        {
            var mController = new CustomerDataController();
            try
            {
                DataTable dtCustomers = mController.UspGetCustomerThirdPartyDelivery(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), type, customerName, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()));
                return GetJson(dtCustomers);
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
        public static string InsertCustomer(string cardID, string CNIC, string contactNumer, string contactNumer2, string customerName, string address, string DOB, string OpeningAmount, string Nature, string email, string gender, string occupation, string LocationID)
        {
            try
            {
                int distributerId = int.Parse(LocationID);
                var dc = new DataControl();
                DataTable dtCustomer = CustomerDataController.InsertCustomer(distributerId, cardID, CNIC, DOB, contactNumer, email, customerName, address, Convert.ToDecimal(dc.chkNull_0(OpeningAmount)), Nature, contactNumer2, Convert.ToInt32(gender), Convert.ToInt32(occupation));
                return GetJson(dtCustomer);
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static string UpdateCustomerAddress(string CustomerID, string Address)
        {
            try
            {
                long customerId = Convert.ToInt64(CustomerID);
                var dc = new DataControl();
                if(CustomerDataController.UpdateCustomerAddress(customerId,Address))
                {
                    return "1";
                }
                else
                {
                    return "0";
                }
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static string InsertCustomer2(string cardID, string CNIC, string contactNumer, string contactNumer2, string customerName, string address, string DOB, string OpeningAmount, string Nature, string email)
        {
            try
            {
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
                var dc = new DataControl();
                long CustomerID = CustomerDataController.InsertCustomer2(distributerId, cardID, CNIC, DOB, contactNumer, email, customerName, address
                    , null, Convert.ToDecimal(dc.chkNull_0(OpeningAmount)), Nature, contactNumer2, 0, 0, 0
                    , 0, 0);
                return CustomerID.ToString();
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static void InsertCustomerThirdParty(string ThirdPartyDeliveryID,string Name, string Address, string ContactNo)
        {
            try
            {
                int LocationID = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
                int UserID = Convert.ToInt32(HttpContext.Current.Session["UserID"]);
                CustomerDataController.InsertCustomerThirdPartyDelivery(Convert.ToInt32(ThirdPartyDeliveryID), LocationID, UserID,Name,Address,ContactNo);
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        #endregion

        #region  Order Hold

        [WebMethod]
        [ScriptMethod]
        public static string HoldOrder(string orderedProducts, string orderBooker, string coverTable, string customerType, string CustomerName, string maxOrderNo, string printType, string tableName, string takeAwayCustomer, string bookerName, string tabId, string CustomerNo, string VoidBy, string manualOrderNo, string remarks, string Gst, string Customer, string delChannel, string serviceCharges, string formid,string AdvanceAmount,string CustomerGST,string CustomerDiscount,string CustomerDiscountType,string CustomerServiceCharges,string CustomerServiceType, string LocationID,string PaymentMode)
        {
            #region Validation


            int tableId = 0;
            long customerId = 0;
            decimal decGST = 0;
            int customerTypeId = 3;
            if (customerType == "Dine In")
            {
                customerTypeId = 1;
            }
            else if (customerType == "Delivery")
            {
                customerTypeId = 2;
            }

            if (customerTypeId == 1)
            {
                tableId = int.Parse(tabId);
            }
            customerId = Convert.ToInt64(CustomerName);

            int intVoidBy = 0;
            try
            {
                intVoidBy = Convert.ToInt32(VoidBy);
            }
            catch (Exception ex)
            {
                intVoidBy = Convert.ToInt32(HttpContext.Current.Session["UserID"]);
            }
            int PaymentModeID = Convert.ToInt32(PaymentMode);            
            try
            {
                decGST = Convert.ToDecimal(Gst);
            }
            catch (Exception)
            {

            }
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

                DataTable dtValue = new DataTable();
                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                int distributerId = int.Parse(LocationID.ToString());
                DataTable dtStk = new DataTable();
                dtStk.Columns.Add("SKU_NAME", typeof(string));
                dtStk.Columns.Add("Stock", typeof(decimal));
                dtStk.Columns.Add("OrderNO", typeof(long));
                if (orderedProducts != "")
                {
                    dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
                    HttpContext.Current.Session.Add("dtValue", dtValue);                    
                }
                if (dtValue != null && dtValue.Rows.Count > 0 && dtValue.Rows[0]["INVOICE_ID"].ToString().Trim() != "N/A")
                {
                    DataTable dtCOAConfig = (DataTable)HttpContext.Current.Session["dtCOAConfig"];
                    bool IsFinanceIntegrate = (bool)HttpContext.Current.Session["IsFinanceIntegrate"];
                    decimal GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                    decimal GSTPERCreditCard = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                        GSTPERCreditCard = 0;
                    }
                    DataTable dtInvoice = OrderEntryController.GetInvoiceDetail(Convert.ToInt64(dtValue.Rows[0]["INVOICE_ID"]));
                    string OldInvoiceJson = GetJson(dtInvoice);
                    OrderEntryController.HoldOrder(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()), Constants.IntNullValue,customerTypeId, tableId, 0, 0, decGST, 0, 0, true, userId, CurrentWorkDate, distributerId, 0,dtValue, int.Parse(orderBooker), coverTable, takeAwayCustomer, intVoidBy, manualOrderNo, remarks, Convert.ToInt32(serviceCharges), Convert.ToInt32(customerId),Convert.ToBoolean(HttpContext.Current.Session["InvoicePrinted"]),GSTPER, GSTPERCreditCard, HttpContext.Current.Session["BillFormat"].ToString(), Convert.ToDecimal(AdvanceAmount),Convert.ToDecimal(CustomerGST), Convert.ToDecimal(CustomerDiscount), Convert.ToByte(CustomerDiscountType), Convert.ToDecimal(CustomerServiceCharges), Convert.ToByte(CustomerServiceType), HttpContext.Current.Session["LocationWiseRecipe"].ToString(),0,true,true, Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]),true,1,dtInvoice,OldInvoiceJson,5, IsFinanceIntegrate,dtCOAConfig);
                    DataRow drStock = dtStk.NewRow();
                    drStock["SKU_NAME"] = "InvoiceID";
                    drStock["Stock"] = dtValue.Rows[0]["INVOICE_ID"].ToString();
                    drStock["OrderNO"] = 0;
                    dtStk.Rows.Add(drStock);
                }
                else
                {
                    decimal GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                    decimal GSTPERCreditCard = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                        GSTPERCreditCard = 0;
                    }

                    long InvoiceID = OrderEntryController.Add_Invoice(PaymentModeID, customerTypeId, tableId, 0, 0, 0, decGST, true,userId, CurrentWorkDate, distributerId, dtValue, int.Parse(orderBooker), coverTable, customerId, maxOrderNo, takeAwayCustomer, manualOrderNo, remarks, 1, 1, Convert.ToInt32(HttpContext.Current.Session["hfServiceChargesType"]), 5,true, true, GSTPER, GSTPERCreditCard, HttpContext.Current.Session["BillFormat"].ToString(),Convert.ToDecimal(AdvanceAmount),Convert.ToDecimal(CustomerGST),Convert.ToDecimal(CustomerDiscount),Convert.ToByte(CustomerDiscountType), Convert.ToDecimal(CustomerServiceCharges), Convert.ToByte(CustomerServiceType), Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]),1, Convert.ToDecimal(HttpContext.Current.Session["POSFee"]));
                    var mController = new SkuController();
                    DataTable dtOrder = mController.SpGetPendingBill(InvoiceID, 6, Constants.IntNullValue);
                    DataRow drStock = dtStk.NewRow();
                    drStock["SKU_NAME"] = "InvoiceID";
                    drStock["Stock"] = InvoiceID;
                    drStock["OrderNO"] = dtOrder.Rows[0][0].ToString();
                    dtStk.Rows.Add(drStock);
                }
                return GetJson(dtStk);
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

        [WebMethod]
        public static void UpdatePrintRecords(string orderedProducts)
        {
            DataTable dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
            var Ord = new OrderEntryController();
            Ord.UpdatePrintNew(dtValue);
        }

        #endregion

        #region Item Less/Cancel Reason

        [WebMethod]
        public static string GetItemLessCancelReason()
        {
            var mReason = new FranchiseSaleInvoiceController();
            DataTable dtReason = mReason.SelectROLLBACK_REASON(34);
            return GetJson(dtReason);
        }

        #endregion        

        #region Form Data
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
        
        protected void lnkCashRegisterClosing_OnClick(object sender, EventArgs e)
        {
            Response.Redirect("frmShiftClose.aspx");
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
        #endregion
    }
}