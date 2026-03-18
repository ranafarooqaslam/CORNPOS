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
using System.Threading.Tasks;

namespace Forms
{
    public partial class frmOrderPOS : System.Web.UI.Page
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
                hfLocationID.Value = Session["DISTRIBUTOR_ID"].ToString();
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
                hfShowDatesOnPOSReports.Value = HttpContext.Current.Session["ShowDatesOnPOSReports"].ToString();

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
                    hfServiceChargesLabel.Value = ds.Tables[0].Rows[0]["ServiceChargesLabel"].ToString();
                    hfPOSFee.Value = ds.Tables[0].Rows[0]["POS_FEE"].ToString();
                    hfQRCodeImageName.Value = ds.Tables[0].Rows[0]["QRCodeImageName"].ToString();
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
                    hfIsSplitBill.Value = ds.Tables[2].Rows[0]["IsSplitBill"].ToString();
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
                        if(dtTaxAuthority.Rows.Count > 0)
                        {
                            hfTaxInvoiceLable.Value = dtTaxAuthority.Rows[0]["TaxAuthorityLabel"].ToString();
                        }
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
                    hfPartialPayment.Value = ds.Tables[6].Rows[0]["PartialPayment"].ToString();
                    Session.Add("CallCenter", ds.Tables[6].Rows[0]["CallCenter"].ToString());
                    hfPendigBillRefreshTime.Value = ds.Tables[6].Rows[0]["PendigBillRefreshTime"].ToString();
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
                        dvParentCategory.Visible = true;
                    }
                }
                if (ds.Tables[7].Rows.Count > 0)
                {
                    hfEmployeeDiscountType.Value = GetJson(ds.Tables[7]);
                }
                if(ds.Tables[8].Rows.Count > 0)
                {
                    hfLoyaltyRewardSalb.Value = GetJson(ds.Tables[8]);
                }
                if (ds.Tables[9].Rows.Count > 0)
                {
                    hfPaymentModes.Value = GetJson(ds.Tables[9]);
                    Session.Add("tblPaymentMode", ds.Tables[9]);
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

            SaleForceController mDController = new SaleForceController();
            DataTable dt = mDController.SelectSaleForceAssignedArea(customerTypeId, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, int.Parse(HttpContext.Current.Session["companyId"].ToString()), Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        [ScriptMethod]
        public static string LoadDiscountUser()
        {
            SaleForceController mDController = new SaleForceController();
            DataSet ds = mDController.SelectSaleForceUsers(0, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["companyId"].ToString()));
            return ds.GetXml();
        }

        [WebMethod]
        [ScriptMethod]
        public static string ValidateUser(string UserId, string UserPass, string UserClick)
        {
            DataTable dtConfigDefault = (DataTable)HttpContext.Current.Session["dtAppSettingDetail"];
            var _mController = new UserController();
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
            SkuHierarchyController mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, 1, null, null, true, 22, Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        public static string GetOpenItemCategory()
        {
            SkuHierarchyController mController = new SkuHierarchyController();
            DataTable dt = mController.SelectSkuHierarchy(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, 1, null, null, true, 23, Constants.IntNullValue);
            return GetJson(dt);
        }

        [WebMethod]
        public static string LoadParentCategroy()
        {
            SkuHierarchyController mController = new SkuHierarchyController();

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
        public static string LoadAllProducts()
        {
            var mSkuController = new SkuController();
            try
            {
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]), 1);
                if (Convert.ToInt32(HttpContext.Current.Session["TodayMenuID"]) > 0)
                {
                    for (int i = dtSkus.Rows.Count - 1; i >= 0; i--)
                    {
                        DataRow dr = dtSkus.Rows[i];
                        if (dr["CAT_ID"].ToString() == HttpContext.Current.Session["TodayMenuID"].ToString())
                            dr.Delete();
                    }
                    dtSkus.AcceptChanges();
                    DataTable dtTodayMenu = mSkuController.GetTodayMenuItems(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]));
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
        public static string LoadDealCategory()
        {
            var mSkuController = new SkuController();
            try
            {
                DataTable dtDealCategory = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]), 7);
                return GetJson(dtDealCategory);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [WebMethod]
        public static string LoadModifiers()
        {
            var mSkuController = new SkuController();
            try
            {
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]), 4);
                return GetJson(dtSkus);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [WebMethod]
        public static string LoadProductStatus(int id)
        {
            var mSkuController = new SkuController();

            try
            {
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, id, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]), 2);
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
        public static string GetOpenItems()
        {
            var mSkuController = new SkuController();
            try
            {
                DataTable dtSkus = mSkuController.SelectSkusforOrder(int.Parse(HttpContext.Current.Session["CompanyId"].ToString()), Constants.IntNullValue, 1, Constants.IntNullValue, int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]), 6);
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
        public static string SelectPendingBills(string customerType)
        {
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
            long SaleInvoiceID = 0;
            if(HttpContext.Current.Session["CallCenter"].ToString() == "1")
            {
                SaleInvoiceID = 1;
            }
            var mSkuController = new OrderEntryController();
            DataSet ds = mSkuController.SelectPendingBillsDataset(
                SaleInvoiceID,
                DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()),
                int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()),
                int.Parse(HttpContext.Current.Session["UserID"].ToString()),
                customerTypeId,Convert.ToBoolean(HttpContext.Current.Session["hfPrintKOT"]), 16
            );
            return JsonConvert.SerializeObject(ds, Formatting.None);
        }

        [WebMethod]
        public static string GetPendingBill(long saleInvoiceMasterId)
        {
            var mSkuController = new SkuController();
            DataTable dtSkus = mSkuController.SpGetPendingBill(saleInvoiceMasterId, 1, Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            if (dtSkus.Rows.Count > 0)
            {
                HttpContext.Current.Session.Add("InvoicePrinted", dtSkus.Rows[0]["InvoicePrinted"]);
            }
            return GetJson(dtSkus);
        }

        [WebMethod]
        public static string GetPendingBill2(long saleInvoiceMasterId)
        {
            var mSkuController = new SkuController();
            DataTable dtSkus = mSkuController.SpGetPendingBill(saleInvoiceMasterId, 7, Convert.ToInt32(HttpContext.Current.Session["UserID"]));
            if (dtSkus.Rows.Count > 0)
            {
            }
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
        public static string LoadLoyaltyCardDetail(string cardNo, string SALE_INVOICE_ID)
        {
            var mController = new LoyaltyController();
            try
            {
                DataTable dtCardDetail = mController.GetLoyaltyCardDetail(cardNo, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), Convert.ToInt64(SALE_INVOICE_ID));
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
        public static string LoadAllCustomers(string customerName, string type)
        {
            var mController = new CustomerDataController();
            try
            {
                DataTable dtCustomers = mController.UspSelectCustomer(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), type, customerName, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()));
                return GetJson(dtCustomers);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [WebMethod]
        [ScriptMethod]
        public static string InsertCustomer(string cardID, string CNIC, string contactNumer, string contactNumer2, string customerName, string address, string DOB, string OpeningAmount, string Nature, string email, string gender, string occupation)
        {
            try
            {
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
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
        public static void InsertCustomerThirdParty(string ThirdPartyDeliveryID,string Name,string Address,string ContactNo)
        {
            try
            {
                int LocationID = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
                int UserID = Convert.ToInt32(HttpContext.Current.Session["UserID"]);
                CustomerDataController.InsertCustomerThirdPartyDelivery(Convert.ToInt32(ThirdPartyDeliveryID), LocationID, UserID,Name, Address, ContactNo);
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
                if (CustomerDataController.UpdateCustomerAddress(customerId, Address))
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

        #endregion

        #region  Order Hold, Update, Invoice, Split Bill

        [WebMethod]
        [ScriptMethod]
        public static string HoldOrder(string orderedProducts, string orderBooker, string coverTable, string customerType, string CustomerName, string maxOrderNo, string printType, string tableName, string takeAwayCustomer, string bookerName, string tabId, string CustomerNo, string VoidBy, string manualOrderNo, string remarks, string Gst, string Customer, string delChannel, string serviceCharges, string formid,string AdvanceAmount,string CustomerGST,string CustomerDiscount,string CustomerDiscountType,string CustomerServiceCharges,string CustomerServiceType,string InvoiceNo,string IsItemChanged,string TakeawayType)
        {

            if (IsDayClosed())
            {
                UserController UserCtl = new UserController();
                UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                HttpContext.Current.Session.Clear();
                System.Web.Security.FormsAuthentication.SignOut();
                HttpContext.Current.Response.Redirect("../Login.aspx");
            }
            #region Validation
            try
            {
                Convert.ToInt32(delChannel);
            }
            catch (Exception ex)
            {
                delChannel = "0";
            }
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
                intVoidBy = 0;
            }
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
                DataTable dtDCs = (DataTable)HttpContext.Current.Session["dtDCs"];
                bool CashImpact = true;
                bool CreditCard_Impact = true;
                if (customerTypeId == 2)
                {
                    foreach (DataRow dr in dtDCs.Rows)
                    {
                        if (dr["intDCValue"].ToString() == delChannel)
                        {
                            CashImpact = Convert.ToBoolean(dr["Cash_Impact"]);
                            CreditCard_Impact = Convert.ToBoolean(dr["CreditCard_Impact"]);
                            break;
                        }
                    }
                }

                DataTable dtValue = new DataTable();
                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
                DataTable dtStk = new DataTable();
                dtStk.Columns.Add("SKU_NAME", typeof(string));
                dtStk.Columns.Add("Stock", typeof(decimal));
                dtStk.Columns.Add("OrderNO", typeof(long));
                if (orderedProducts != "")
                {
                    dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
                    HttpContext.Current.Session.Add("dtValue", dtValue);
                    #region Stock Validation
                    if (HttpContext.Current.Session["ValidateStockOnPOS"].ToString() == "1")
                    {
                        DataTable dtItems = (DataTable)HttpContext.Current.Session["dtItems"];
                        var mStockController = new PhaysicalStockController();
                        foreach (DataRow dr in dtValue.Rows)
                        {
                            if (!bool.Parse(dr["VOID"].ToString()))
                            {
                                DataRow[] foundRows = dtItems.Select("SKU_ID  = '" + dr["SKU_ID"].ToString() + "'");
                                if (foundRows.Length > 0)
                                {
                                    if (foundRows[0]["BRAND_ID"].ToString() == "1" && foundRows[0]["ISEXEMPTED"].ToString().ToLower() == "true")
                                    {
                                        DataTable dtStock = mStockController.SelectSKUClosingStock2(distributerId, Convert.ToInt32(dr["SKU_ID"]), "N/A", currentWorkDate, 15);
                                        if (dtStock.Rows.Count > 0)
                                        {
                                            if (decimal.Parse(dtStock.Rows[0][0].ToString()) < decimal.Parse(dr["QTY"].ToString()))
                                            {
                                                DataRow drStock = dtStk.NewRow();
                                                drStock["SKU_NAME"] = dr["SKU_NAME"].ToString();
                                                drStock["Stock"] = decimal.Parse(dtStock.Rows[0][0].ToString());
                                                drStock["OrderNO"] = 0;
                                                dtStk.Rows.Add(drStock);
                                                break;
                                            }
                                        }
                                        else
                                        {
                                            DataRow drStock = dtStk.NewRow();
                                            drStock["SKU_NAME"] = dr["SKU_NAME"].ToString();
                                            drStock["Stock"] = 0;
                                            drStock["OrderNO"] = 0;
                                            dtStk.Rows.Add(drStock);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (dtStk.Rows.Count > 0)
                {
                    return GetJson(dtStk);
                }
                if (dtValue != null && dtValue.Rows.Count > 0 && Convert.ToInt64(InvoiceNo) > 0)
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
                    bool ItemChanged = false;
                    if(IsItemChanged == "1")
                    {
                        ItemChanged = true;
                    }
                    DataTable dtInvoice = OrderEntryController.GetInvoiceDetail(Convert.ToInt64(dtValue.Rows[0]["INVOICE_ID"]));
                    string OldInvoiceJson = GetJson(dtInvoice);
                    OrderEntryController.HoldOrder(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()), Constants.IntNullValue, customerTypeId, tableId, 0,
                        0, decGST, 0, 0, true, userId, currentWorkDate, distributerId, 0, dtValue, int.Parse(orderBooker), coverTable,
                        takeAwayCustomer, intVoidBy, manualOrderNo, remarks, Convert.ToInt32(serviceCharges), Convert.ToInt32(customerId),
                        Convert.ToBoolean(HttpContext.Current.Session["InvoicePrinted"]), GSTPER, GSTPERCreditCard, HttpContext.Current.Session["BillFormat"].ToString(), Convert.ToDecimal(AdvanceAmount),
                        Convert.ToDecimal(CustomerGST), Convert.ToDecimal(CustomerDiscount), Convert.ToByte(CustomerDiscountType), Convert.ToDecimal(CustomerServiceCharges), 
                        Convert.ToByte(CustomerServiceType), HttpContext.Current.Session["LocationWiseRecipe"].ToString(), Convert.ToInt32(delChannel), CashImpact, CreditCard_Impact,
                        Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]), ItemChanged,Convert.ToInt16(TakeawayType),dtInvoice, OldInvoiceJson,1, IsFinanceIntegrate, dtCOAConfig);
                    DataRow drStock = dtStk.NewRow();
                    drStock["SKU_NAME"] = "InvoiceID";
                    drStock["Stock"] = dtValue.Rows[0]["INVOICE_ID"].ToString();
                    drStock["OrderNO"] = 0;
                    dtStk.Rows.Add(drStock);
                    #region SMS
                    if (dtValue.Rows.Count > 0)
                    {
                        if (customerTypeId == 2)
                        {
                            if (HttpContext.Current.Session["IsSMSonDeliveryHoldOrder"].ToString() == "True")
                            {
                                String message = HttpUtility.UrlEncode(HttpContext.Current.Session["MessageonDeliveryHoldOrder"].ToString()) + " " + Customer + "! our mouth-watering ";
                                foreach (DataRow row3 in dtValue.Rows)
                                {
                                    message += row3["SKU_NAME"].ToString() + "-" + row3["QTY"].ToString() + ", ";
                                }
                                if (message.Length > 0)
                                {
                                    message = message.Remove(message.Length - 2);
                                }
                                message += " will be reaching you soon";
                                SendSMS(CustomerNo, message, distributerId);
                            }
                        }
                    }
                    #endregion
                }
                else
                {
                    #region Check Table
                    if (customerType == "Dine In" && HttpContext.Current.Session["EatIn"].ToString() == "0")
                    {
                        OrderEntryController mTableController = new OrderEntryController();
                        DataTable dtTables = mTableController.SelectPendingBills(Constants.LongNullValue, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, tableId, 13);
                        if (dtTables.Rows.Count > 0)
                        {
                            DataRow drStock2 = dtStk.NewRow();
                            drStock2["SKU_NAME"] = "TableID";
                            drStock2["Stock"] = "0";
                            drStock2["OrderNO"] = 0;
                            dtStk.Rows.Add(drStock2);
                            return GetJson(dtStk);
                        }
                    }
                    #endregion

                    decimal GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                    decimal GSTPERCreditCard = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                        GSTPERCreditCard = 0;
                    }
                    long InvoiceID = OrderEntryController.Add_Invoice(Constants.IntNullValue, customerTypeId, tableId, 0, 0,
                        0, decGST, true, userId, currentWorkDate, distributerId,
                        dtValue, int.Parse(orderBooker), coverTable, customerId, maxOrderNo,
                        takeAwayCustomer, manualOrderNo, remarks, 0, Convert.ToInt32(delChannel),
                        Convert.ToInt32(HttpContext.Current.Session["hfServiceChargesType"]), Convert.ToByte(formid), CashImpact, CreditCard_Impact, GSTPER,
                        GSTPERCreditCard, HttpContext.Current.Session["BillFormat"].ToString(), Convert.ToDecimal(AdvanceAmount), Convert.ToDecimal(CustomerGST), Convert.ToDecimal(CustomerDiscount),
                        Convert.ToByte(CustomerDiscountType), Convert.ToDecimal(CustomerServiceCharges), Convert.ToByte(CustomerServiceType), Convert.ToBoolean(HttpContext.Current.Session["KDSImplemented"]),
                        Convert.ToInt16(TakeawayType),Convert.ToDecimal(HttpContext.Current.Session["POSFee"]));
                    var mController = new SkuController();
                    DataTable dtOrder = mController.SpGetPendingBill(InvoiceID, 6, Constants.IntNullValue);
                    DataRow drStock = dtStk.NewRow();
                    drStock["SKU_NAME"] = "InvoiceID";
                    drStock["Stock"] = InvoiceID;
                    drStock["OrderNO"] = dtOrder.Rows[0][0].ToString();
                    dtStk.Rows.Add(drStock);

                    #region SMS
                    if (dtValue.Rows.Count > 0)
                    {
                        if (customerTypeId == 2)
                        {
                            if (HttpContext.Current.Session["IsSMSonDeliveryHoldOrder"].ToString() == "True")
                            {
                                String message = HttpUtility.UrlEncode(HttpContext.Current.Session["MessageonDeliveryHoldOrder"].ToString()) + " " + Customer + "! our mouth-watering ";
                                foreach (DataRow row3 in dtValue.Rows)
                                {
                                    message += row3["SKU_NAME"].ToString() + "-" + row3["QTY"].ToString() + ", ";
                                }
                                if (message.Length > 0)
                                {
                                    message = message.Remove(message.Length - 2);
                                }
                                message += " will be reaching you soon";
                                SendSMS(CustomerNo, message, distributerId);
                            }
                        }
                    }
                    #endregion

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
        [ScriptMethod]
        public static string UpdateOrder(string orderedProducts, string amountDue, string discount, string Gst, string DiscType, string gstPerAge, string Service, string takeAwayCustomer, int cardType, string cardNo, decimal points, decimal purchasing, string customerID, string manualOrderNo, string remarks, string orderBookerId, string empDiscType, string chargestype, string payType, string IsGSTVoid,string DiscountRemarks,string BankDiscountID,string CreditCardNo,string CreditCardAccountTile,string AdvanceAmount,string CustomerGST, string CustomerDiscount, string CustomerDiscountType, string CustomerServiceCharges, string CustomerServiceType, string TakeawayType)
        {
            DataTable dtReturn = new DataTable();
            try
            {
                if (IsDayClosed())
                {
                    UserController UserCtl = new UserController();
                    UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                    HttpContext.Current.Session.Clear();
                    System.Web.Security.FormsAuthentication.SignOut();
                    HttpContext.Current.Response.Redirect("../Login.aspx");
                }
                if (DiscType == "null")
                {
                    DiscType = "0";
                }
                long CustomerID = Constants.LongNullValue;
                try
                {
                    CustomerID = Convert.ToInt64(customerID);
                }
                catch (Exception ex)
                {
                    CustomerID = 0;
                }
                var dc = new DataControl();
                decimal gst = 0;

                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());

                var dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
                decimal taxRate = 0;
                decimal dis = 0;
                if (decimal.Parse(dc.chkNull_0(discount)) > 0)
                {
                    if (int.Parse(dc.chkNull_0(DiscType)) == 0)
                    {
                        dis = decimal.Parse(amountDue) * decimal.Parse(dc.chkNull_0(discount)) / 100;
                    }
                    else
                    {
                        dis = decimal.Parse(dc.chkNull_0(discount));
                    }
                }
                if (Convert.ToDecimal(CustomerGST) > 0)
                {
                    taxRate = Convert.ToDecimal(CustomerGST);
                }
                else
                {
                    if (int.Parse(payType) == 1)
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    }
                    else
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                        DataTable tblPaymentMode = new DataTable();
                        if (HttpContext.Current.Session["tblPaymentMode"] != null)
                        {
                            tblPaymentMode = (DataTable)HttpContext.Current.Session["tblPaymentMode"];
                        }
                        if (int.Parse(payType) > 2)
                        {
                            foreach(DataRow dr in tblPaymentMode.Rows)
                            {
                                if(payType.ToString() == dr["POSID"].ToString())
                                {
                                    taxRate = Convert.ToDecimal(dr["Tax"]);
                                    break;
                                }
                            }
                        }
                    }
                }
                if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "0")
                {
                    decimal itemWiseDiscount = 0;
                    foreach(DataRow dr in dtValue.Rows)
                    {
                        if (!bool.Parse(dr["VOID"].ToString()))
                        {
                            try
                            {
                                itemWiseDiscount += decimal.Parse(dr["DISCOUNT"].ToString());
                            }
                            catch (Exception)
                            {
                                itemWiseDiscount += 0;
                            }
                        }
                    }
                    string GSTCalculation = HttpContext.Current.Session["GSTCalculation"].ToString();
                    if (GSTCalculation == "1")
                    {
                        gst = decimal.Parse(amountDue) * taxRate / 100;
                    }
                    else if (GSTCalculation == "2")
                    {
                        gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount)) * taxRate / 100;
                    }
                    else if (GSTCalculation == "3")
                    {
                        gst = (decimal.Parse(amountDue) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                    }
                    else
                    {
                        gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                    }
                }
                else
                {
                    gst = Convert.ToDecimal(Gst);
                }
                gst = Math.Round(gst, MidpointRounding.AwayFromZero);

                decimal GSTPER = 0;
                if(payType == "1")
                {
                    GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                }
                else
                {
                    GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                    if (int.Parse(payType) > 2)
                    {
                        GSTPER = taxRate;
                    }
                }
                if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                {
                    GSTPER = 0;
                }
                if (dtValue != null && dtValue.Rows.Count > 0 && long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()) > 0)
                {
                    OrderEntryController order = new OrderEntryController();
                    dtReturn = order.Update_Order(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()), int.Parse(payType), Constants.IntNullValue, Constants.IntNullValue, decimal.Parse(dc.chkNull_0(discount)),
                        gst, decimal.Parse(dc.chkNull_0("0")), Convert.ToDecimal(gstPerAge), true, userId, currentWorkDate,
                        distributerId, int.Parse(dc.chkNull_0(DiscType)), dtValue, Convert.ToDecimal(dc.chkNull_0(Service)), takeAwayCustomer,
                        cardType, cardNo, points, purchasing, CustomerID, manualOrderNo,
                        remarks, Convert.ToInt32(orderBookerId), short.Parse(empDiscType), Convert.ToInt32(chargestype), Convert.ToBoolean(IsGSTVoid), GSTPER,
                        Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]), Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]), int.Parse(HttpContext.Current.Session["UserID"].ToString()), DiscountRemarks, HttpContext.Current.Session["BillFormat"].ToString(),
                        Convert.ToInt32(BankDiscountID), CreditCardNo, CreditCardAccountTile, Convert.ToDecimal(AdvanceAmount), Convert.ToDecimal(CustomerGST),
                        Convert.ToDecimal(CustomerDiscount), Convert.ToByte(CustomerDiscountType), Convert.ToDecimal(CustomerServiceCharges), Convert.ToByte(CustomerServiceType),Convert.ToInt16(TakeawayType));
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return GetJson(dtReturn);
        }

        // Run on Payment

        [WebMethod]
        [ScriptMethod]
        public static string InsertInvoice(string orderedProducts, string Type, string amountDue, string discount, string paidIn,string payType, string Gst, string DiscType, string gstPerAge, string Service, string takeAwayCustomer,string empDiscType, string EMC_UserID, string Manager_UserID, string PASSWORD, string customerID, string cardNo, string purchasing, string manualOrderNo, string remarks, string CustomerNo,string netAmount, string chargestype, string DeliveryChannelType, string BankID, string IsGSTVoid,string RecordType, string AdvanceAmount,string BankPortion,string DiscountRemarks,string PointsEarned,string PointsDeducted,string CreditCardNo,decimal LoyaltyPoints, string TakeawayType)
        {
            try
            {
                string strQRCode = "";
                string strQRCodePRA = "";
                DataTable dtItem = new DataTable();
                if (IsDayClosed())
                {
                    UserController UserCtl = new UserController();
                    UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                    HttpContext.Current.Session.Clear();
                    System.Web.Security.FormsAuthentication.SignOut();
                    HttpContext.Current.Response.Redirect("../Login.aspx");
                }

                int customerTypeId = 3;
                if (Type == "Dine In")
                {
                    customerTypeId = 1;
                }
                else if (Type == "Delivery")
                {
                    customerTypeId = 2;
                }

                long CustomerID = Constants.LongNullValue;
                string CardNo = null;
                decimal Purchasing = Constants.DecimalNullValue;
                decimal gst = 0;
                decimal NetAmount = 0;
                if (netAmount.Length > 0)
                {
                    try
                    {
                        NetAmount = Convert.ToDecimal(netAmount);
                    }
                    catch (Exception)
                    {
                        NetAmount = 0;
                    }
                }
                if (customerID.Length > 0)
                {
                    try
                    {
                        CustomerID = Convert.ToInt64(customerID);
                    }
                    catch (Exception)
                    {
                        CustomerID = Constants.LongNullValue;
                    }
                }
                if (DiscType == "null")
                {
                    DiscType = "0";
                }
                if (short.Parse(empDiscType) == 2)
                {
                    CardNo = cardNo;
                    Purchasing = Convert.ToDecimal(purchasing);
                }
                var dc = new DataControl();
                DataTable dtCOAConfig = (DataTable)HttpContext.Current.Session["dtCOAConfig"];
                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());

                var dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));

                if (dtValue != null && dtValue.Rows.Count > 0 &&
                    long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()) > 0)
                {
                    bool IsFinanceIntegrate = (bool)HttpContext.Current.Session["IsFinanceIntegrate"];
                    DataTable dtTaxAuthority = (DataTable)HttpContext.Current.Session["dtTaxAuthority"];
                    string strInvoiceNumberFBR = "";
                    string strInvoiceNumberPRA = "";
                    if (HttpContext.Current.Session["TaxIntegration"].ToString() != "0" && Convert.ToBoolean(HttpContext.Current.Session["CanTaxIntegrate"]))
                    {
                        if (dtTaxAuthority.Rows.Count > 0)
                        {
                            int PaymentMode = 1;
                            double TaxRate = 0;
                            decimal Discount = 0;
                            if (decimal.Parse(dc.chkNull_0(discount)) > 0)
                            {
                                if (int.Parse(dc.chkNull_0(DiscType)) == 0)
                                {
                                    Discount = decimal.Parse(amountDue) * decimal.Parse(dc.chkNull_0(discount)) / 100;
                                }
                                else
                                {
                                    Discount = decimal.Parse(dc.chkNull_0(discount));
                                }
                            }

                            if (int.Parse(payType) == 0)
                            {
                                PaymentMode = 1;
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTRate"]);

                            }
                            else if (int.Parse(payType) == 1)
                            {
                                PaymentMode = 2;
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTCardRate"]);
                            }
                            else
                            {
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTRate"]);
                                PaymentMode = 6;//Cheque For Credit invoices                                
                            }
                            if (HttpContext.Current.Session["TaxIntegration"].ToString() == "3")//Khyber PukhtunKhwa Revenue Authority
                            {
                                PostDataToKPRA(dtValue.Rows[0]["INVOICE_ID"].ToString(), Convert.ToDecimal(amountDue), Convert.ToDecimal(Gst), Discount, dtTaxAuthority);
                            }
                            else if (HttpContext.Current.Session["TaxIntegration"].ToString() == "4")//Sindh Revenu Board
                            {
                                strQRCode = PostDataToSRB(dtValue.Rows[0]["INVOICE_ID"].ToString(), Convert.ToDecimal(amountDue), Convert.ToDecimal(Gst), TaxRate, "", dtTaxAuthority);
                                strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                            }
                            else if (HttpContext.Current.Session["TaxIntegration"].ToString() == "5")//FBR & PRA Both
                            {
                                if (dtTaxAuthority.Rows.Count > 0)
                                {
                                    string UrlFBR = "https://gw.fbr.gov.pk/imsp/v1/api/Live/PostData";
                                    string UrlPRA = "https://ims.pral.com.pk/ims/production/api/Live/PostData";
                                    DataRow[] rows = dtTaxAuthority.Select("FBRURL = '" + UrlFBR.Replace("'", "''") + "'");
                                    DataTable dtFBR = dtTaxAuthority.Clone();
                                    if (rows.Length > 0)
                                    {
                                        dtFBR.ImportRow(rows[0]);
                                        strQRCode = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtFBR);
                                        strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                                    }
                                    DataRow[] rowsPRA = dtTaxAuthority.Select("FBRURL = '" + UrlPRA.Replace("'", "''") + "'");
                                    DataTable dtPRA = dtTaxAuthority.Clone();

                                    if (rowsPRA.Length > 0)
                                    {
                                        dtPRA.ImportRow(rowsPRA[0]);
                                        strQRCodePRA = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtPRA);
                                        strInvoiceNumberPRA = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                                    }                                    
                                }
                            }
                            else//Punjab Revenu Authority and Federal Board of Revenue
                            {
                                strQRCode = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtTaxAuthority);
                                strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                            }
                        }
                    }
                    decimal taxRate = 0;
                    decimal dis = 0;
                    if (decimal.Parse(dc.chkNull_0(discount)) > 0)
                    {
                        if (int.Parse(dc.chkNull_0(DiscType)) == 0)
                        {
                            dis = decimal.Parse(amountDue) * decimal.Parse(dc.chkNull_0(discount)) / 100;
                        }
                        else
                        {
                            dis = decimal.Parse(dc.chkNull_0(discount));
                        }
                    }
                    if (int.Parse(payType) == 1)
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    }
                    else
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                        DataTable tblPaymentMode = new DataTable();
                        if (HttpContext.Current.Session["tblPaymentMode"] != null)
                        {
                            tblPaymentMode = (DataTable)HttpContext.Current.Session["tblPaymentMode"];
                        }
                        if (int.Parse(payType) > 2)
                        {
                            foreach (DataRow dr in tblPaymentMode.Rows)
                            {
                                if (payType.ToString() == dr["POSID"].ToString())
                                {
                                    taxRate = Convert.ToDecimal(dr["Tax"]);
                                    break;
                                }
                            }
                        }
                    }
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "0")
                    {
                        decimal itemWiseDiscount = 0;
                        foreach (DataRow dr in dtValue.Rows)
                        {
                            if (!bool.Parse(dr["VOID"].ToString()))
                            {
                                try
                                {
                                    itemWiseDiscount += decimal.Parse(dr["DISCOUNT"].ToString());
                                }
                                catch (Exception)
                                {
                                    itemWiseDiscount += 0;
                                }
                            }
                        }

                        string GSTCalculation = HttpContext.Current.Session["GSTCalculation"].ToString();
                        if (GSTCalculation == "1")
                        {
                            gst = decimal.Parse(amountDue) * taxRate / 100;
                        }
                        else if (GSTCalculation == "2")
                        {
                            gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount)) * taxRate / 100;
                        }
                        else if (GSTCalculation == "3")
                        {
                            gst = (decimal.Parse(amountDue) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                        }
                        else
                        {
                            gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                        }
                    }
                    else
                    {
                        gst = Convert.ToDecimal(Gst);
                    }
                    gst = Math.Round(gst, MidpointRounding.AwayFromZero);
                    decimal GSTPER = 0;
                    if (payType == "1")
                    {
                        GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    }
                    else
                    {
                        GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                        if (int.Parse(payType) > 2)
                        {
                            GSTPER = taxRate;
                        }
                    }
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                    }
                    dtItem = OrderEntryController.Update_Invoice(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()),distributerId, customerTypeId, int.Parse(payType),
                        Convert.ToDecimal(amountDue), decimal.Parse(dc.chkNull_0(discount)),gst, decimal.Parse(dc.chkNull_0(paidIn)), Convert.ToDecimal(gstPerAge),userId,
                        currentWorkDate,int.Parse(dc.chkNull_0(DiscType)), dtValue, Convert.ToDecimal(dc.chkNull_0(Service)), takeAwayCustomer,
                        short.Parse(empDiscType), int.Parse(EMC_UserID), int.Parse(Manager_UserID), PASSWORD, CustomerID, CardNo,
                        Purchasing, manualOrderNo, remarks, Convert.ToInt32(chargestype), int.Parse(DeliveryChannelType),
                        strInvoiceNumberFBR, Convert.ToInt64(BankID), Convert.ToBoolean(IsGSTVoid),GSTPER, Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]), Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]),
                        NetAmount,Convert.ToInt32(RecordType), HttpContext.Current.Session["LocationWiseRecipe"].ToString(), HttpContext.Current.Session["BillFormat"].ToString(),Convert.ToDecimal(AdvanceAmount),
                        Convert.ToDecimal(BankPortion), HttpContext.Current.Session["ItemWiseGST"].ToString(), HttpContext.Current.Session["GSTCalculation"].ToString(),DiscountRemarks, Convert.ToDecimal(PointsEarned), Convert.ToDecimal(PointsDeducted),CreditCardNo, LoyaltyPoints,Convert.ToInt16(TakeawayType), strInvoiceNumberPRA, IsFinanceIntegrate, dtCOAConfig);
                    if (customerTypeId == 2)
                    {
                        if (HttpContext.Current.Session["IsSMSonDeliveryHoldOrder"].ToString() == "True" && CustomerNo.Length > 0)
                        {
                            //SendSMS(CustomerNo, HttpContext.Current.Session["MessageOnDeliveryCompleted"].ToString() + " " + amountDue + "/- has been received. " + HttpContext.Current.Session["MessageOnDeliveryCompleted2"].ToString());
                            StringBuilder sbSMS = new StringBuilder();
                            sbSMS.Append(HttpContext.Current.Session["MessageOnDeliveryCompleted"].ToString());
                            sbSMS.Append("\n");
                            sbSMS.Append("Warm regards,");
                            sbSMS.Append(HttpContext.Current.Session["MessageOnDeliveryCompleted2"].ToString());
                            SendSMS(CustomerNo, sbSMS.ToString(), distributerId);
                        }
                    }
                }

                DataColumn newColumn = new DataColumn("strQRCode", typeof(System.String));
                newColumn.DefaultValue = strQRCode;
                dtItem.Columns.Add(newColumn);

                DataColumn newColumnPRA = new DataColumn("strQRCodePRA", typeof(System.String));
                newColumnPRA.DefaultValue = strQRCodePRA;
                dtItem.Columns.Add(newColumnPRA);

                return GetJson(dtItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        [ScriptMethod]
        public static string InsertInvoice2(string orderedProducts, string Type, string amountDue, string discount, string paidIn,string payType, string Gst, string DiscType, string gstPerAge, string Service, string takeAwayCustomer,string empDiscType, string EMC_UserID, string Manager_UserID, string PASSWORD, string customerID, string cardNo, string purchasing, string manualOrderNo, string remarks, string contactNumer, string customerName, string address, string netAmount, string chargestype, string DeliveryChannelType, string BankID, string IsGSTVoid,string RecordType,string AdvanceAmount, string BankPortion, string DiscountRemarks, string PointsEarned, string PointsDeducted, string CreditCardNo,decimal LoyaltyPoints, string TakeawayType)
        {
            try
            {
                long CustomerID = Constants.LongNullValue;
                if (customerID.Length > 0)
                {
                    try
                    {
                        CustomerID = Convert.ToInt64(customerID);
                    }
                    catch (Exception)
                    {
                        CustomerID = Constants.LongNullValue;
                    }
                }

                string strQRCode = "";
                string strQRCodePRA = "";
                DataTable dtItem = new DataTable();
                if (IsDayClosed())
                {
                    UserController UserCtl = new UserController();
                    UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                    HttpContext.Current.Session.Clear();
                    System.Web.Security.FormsAuthentication.SignOut();
                    HttpContext.Current.Response.Redirect("../Login.aspx");
                }

                if ((contactNumer.Length > 0 || customerName.Length > 0) && CustomerID == Constants.LongNullValue)
                {
                    customerID = InsertCustomer2("0", "0", contactNumer, contactNumer, customerName, address, "", "0", "", "");
                    CustomerID = Convert.ToInt64(customerID);
                }

                int customerTypeId = 3;
                if (Type == "Dine In")
                {
                    customerTypeId = 1;
                }
                else if (Type == "Delivery")
                {
                    customerTypeId = 2;
                }

                
                string CardNo = null;
                decimal gst = 0;
                decimal Purchasing = Constants.DecimalNullValue;
                decimal NetAmount = 0;
                if(netAmount.Length>0)
                {
                    try
                    {
                        NetAmount = Convert.ToDecimal(netAmount);
                    }
                    catch (Exception)
                    {
                        NetAmount = 0;
                    }
                }
                
                if (DiscType == "null")
                {
                    DiscType = "0";
                }
                if (short.Parse(empDiscType) == 2)
                {
                    CardNo = cardNo;
                    Purchasing = Convert.ToDecimal(purchasing);
                }
                var dc = new DataControl();
                DataTable dtCOAConfig = (DataTable)HttpContext.Current.Session["dtCOAConfig"];
                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());

                var dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));

                if (dtValue != null && dtValue.Rows.Count > 0 &&
                    long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()) > 0)
                {
                    bool IsFinanceIntegrate = (bool)HttpContext.Current.Session["IsFinanceIntegrate"];

                    DataTable dtTaxAuthority = (DataTable)HttpContext.Current.Session["dtTaxAuthority"];
                    string strInvoiceNumberFBR = "";
                    string strInvoiceNumberPRA = "";
                    if (HttpContext.Current.Session["TaxIntegration"].ToString() != "0" && Convert.ToBoolean(HttpContext.Current.Session["CanTaxIntegrate"]))
                    {
                        if (dtTaxAuthority.Rows.Count > 0)
                        {
                            int PaymentMode = 1;
                            double TaxRate = 0;
                            decimal Discount = 0;
                            if (decimal.Parse(dc.chkNull_0(discount)) > 0)
                            {
                                if (int.Parse(dc.chkNull_0(DiscType)) == 0)
                                {
                                    Discount = decimal.Parse(amountDue) * decimal.Parse(dc.chkNull_0(discount)) / 100;
                                }
                                else
                                {
                                    Discount = decimal.Parse(dc.chkNull_0(discount));
                                }
                            }

                            if (int.Parse(payType) == 0)
                            {
                                PaymentMode = 1;
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTRate"]);
                            }
                            else if (int.Parse(payType) == 1)
                            {
                                PaymentMode = 2;
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTCardRate"]);
                            }
                            else
                            {
                                TaxRate = Convert.ToDouble(HttpContext.Current.Session["GSTRate"]);
                                PaymentMode = 6;//Cheque For Credit invoices
                            }
                            if (HttpContext.Current.Session["TaxIntegration"].ToString() == "3")
                            {
                                PostDataToKPRA(dtValue.Rows[0]["INVOICE_ID"].ToString(), Convert.ToDecimal(amountDue), Convert.ToDecimal(Gst), Discount, dtTaxAuthority);
                            }
                            else if (HttpContext.Current.Session["TaxIntegration"].ToString() == "4")//Sindh Revenu Board
                            {
                                strQRCode = PostDataToSRB(dtValue.Rows[0]["INVOICE_ID"].ToString(), Convert.ToDecimal(amountDue), Convert.ToDecimal(Gst), TaxRate, "", dtTaxAuthority);
                                strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                            }
                            else if (HttpContext.Current.Session["TaxIntegration"].ToString() == "5")//FBR & PRA Both
                            {
                                if (dtTaxAuthority.Rows.Count > 0)
                                {
                                    string UrlFBR = "https://gw.fbr.gov.pk/imsp/v1/api/Live/PostData";
                                    string UrlPRA = "https://ims.pral.com.pk/ims/production/api/Live/PostData";
                                    DataRow[] rows = dtTaxAuthority.Select("FBRURL = '" + UrlFBR.Replace("'", "''") + "'");
                                    DataTable dtFBR = dtTaxAuthority.Clone();
                                    if (rows.Length > 0)
                                    {
                                        dtFBR.ImportRow(rows[0]);
                                        strQRCode = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtFBR);
                                        strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                                    }
                                    DataRow[] rowsPRA = dtTaxAuthority.Select("FBRURL = '" + UrlPRA.Replace("'", "''") + "'");
                                    DataTable dtPRA = dtTaxAuthority.Clone();

                                    if (rowsPRA.Length > 0)
                                    {
                                        dtPRA.ImportRow(rowsPRA[0]);
                                        strQRCodePRA = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtPRA);
                                        strInvoiceNumberPRA = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                                    }                                    
                                }
                            }
                            else
                            {
                                strQRCode = PostDataToFBR(dtValue.Rows[0]["INVOICE_ID"].ToString(), "", "", "", "", PaymentMode, TaxRate, 0, Discount, 1, dtValue, dtTaxAuthority);
                                strInvoiceNumberFBR = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                            }
                        }
                    }

                    decimal taxRate = 0;
                    decimal dis = 0;
                    if (decimal.Parse(dc.chkNull_0(discount)) > 0)
                    {
                        if (int.Parse(dc.chkNull_0(DiscType)) == 0)
                        {
                            dis = decimal.Parse(amountDue) * decimal.Parse(dc.chkNull_0(discount)) / 100;
                        }
                        else
                        {
                            dis = decimal.Parse(dc.chkNull_0(discount));
                        }
                    }
                    if (int.Parse(payType) == 1)
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    }
                    else
                    {
                        taxRate = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                        DataTable tblPaymentMode = new DataTable();
                        if (HttpContext.Current.Session["tblPaymentMode"] != null)
                        {
                            tblPaymentMode = (DataTable)HttpContext.Current.Session["tblPaymentMode"];
                        }
                        if (int.Parse(payType) > 2)
                        {
                            foreach (DataRow dr in tblPaymentMode.Rows)
                            {
                                if (payType.ToString() == dr["POSID"].ToString())
                                {
                                    taxRate = Convert.ToDecimal(dr["Tax"]);
                                    break;
                                }
                            }
                        }
                    }
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "0")
                    {
                        decimal itemWiseDiscount = 0;
                        foreach (DataRow dr in dtValue.Rows)
                        {
                            if (!bool.Parse(dr["VOID"].ToString()))
                            {
                                try
                                {
                                    itemWiseDiscount += decimal.Parse(dr["DISCOUNT"].ToString());
                                }
                                catch (Exception)
                                {
                                    itemWiseDiscount += 0;
                                }
                            }
                        }

                        string GSTCalculation = HttpContext.Current.Session["GSTCalculation"].ToString();
                        if (GSTCalculation == "1")
                        {
                            gst = decimal.Parse(amountDue) * taxRate / 100;
                        }
                        else if (GSTCalculation == "2")
                        {
                            gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount)) * taxRate / 100;
                        }
                        else if (GSTCalculation == "3")
                        {
                            gst = (decimal.Parse(amountDue) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                        }
                        else
                        {
                            gst = (decimal.Parse(amountDue) - (dis + itemWiseDiscount) + Convert.ToDecimal(dc.chkNull_0(Service))) * taxRate / 100;
                        }
                    }
                    else
                    {
                        gst = Convert.ToDecimal(Gst);
                    }
                    gst = Math.Round(gst, MidpointRounding.AwayFromZero);
                    decimal GSTPER = 0;
                    if (payType == "1")
                    {
                        GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]);
                    }
                    else
                    {
                        GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                        if (int.Parse(payType) > 2)
                        {
                            GSTPER = taxRate;
                        }
                    }
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                    }

                    dtItem = OrderEntryController.Update_Invoice(long.Parse(dtValue.Rows[0]["INVOICE_ID"].ToString()), distributerId, customerTypeId, int.Parse(payType),
                        Convert.ToDecimal(amountDue), decimal.Parse(dc.chkNull_0(discount)), gst, decimal.Parse(dc.chkNull_0(paidIn)), Convert.ToDecimal(gstPerAge), userId,
                        currentWorkDate, int.Parse(dc.chkNull_0(DiscType)), dtValue, Convert.ToDecimal(dc.chkNull_0(Service)), takeAwayCustomer,
                        short.Parse(empDiscType), int.Parse(EMC_UserID), int.Parse(Manager_UserID), PASSWORD, CustomerID, CardNo,
                        Purchasing, manualOrderNo, remarks, Convert.ToInt32(chargestype), int.Parse(DeliveryChannelType),
                        strInvoiceNumberFBR, Convert.ToInt64(BankID), Convert.ToBoolean(IsGSTVoid), GSTPER, Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]), Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]),
                        NetAmount, Convert.ToInt32(RecordType), HttpContext.Current.Session["LocationWiseRecipe"].ToString(), HttpContext.Current.Session["BillFormat"].ToString(), Convert.ToDecimal(AdvanceAmount), 
                        Convert.ToDecimal(BankPortion), HttpContext.Current.Session["ItemWiseGST"].ToString(), HttpContext.Current.Session["GSTCalculation"].ToString(), DiscountRemarks, Convert.ToDecimal(PointsEarned), Convert.ToDecimal(PointsDeducted),CreditCardNo, LoyaltyPoints,Convert.ToInt16(TakeawayType), strInvoiceNumberPRA, IsFinanceIntegrate, dtCOAConfig);
                        if (dtItem.Rows.Count > 0)
                        {
                            if (HttpContext.Current.Session["IsSMSonTakeAway"].ToString() == "True" && contactNumer.Length > 0)
                            {
                                //SendSMS(contactNumer, HttpContext.Current.Session["MessageonTakeAway"].ToString() + " " + netAmount);
                                StringBuilder sbSMS = new StringBuilder();
                                sbSMS.Append(HttpContext.Current.Session["MessageOnDeliveryCompleted"].ToString());
                                sbSMS.Append("\n");
                                sbSMS.Append("Warm regards,");
                                sbSMS.Append(HttpContext.Current.Session["MessageOnDeliveryCompleted2"].ToString());
                                SendSMS(contactNumer, sbSMS.ToString(), distributerId);
                            }
                        }
                }

                DataColumn newColumn = new DataColumn("strQRCode", typeof(System.String));
                newColumn.DefaultValue = strQRCode;
                dtItem.Columns.Add(newColumn);

                DataColumn newColumnPRA = new DataColumn("strQRCodePRA", typeof(System.String));
                newColumnPRA.DefaultValue = strQRCodePRA;
                dtItem.Columns.Add(newColumnPRA);

                return GetJson(dtItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Run on Void Payment
        [WebMethod]
        [ScriptMethod]
        public static void VoidOrder(long orderId,int VoidReasonID)
        {
            try
            {
                if (IsDayClosed())
                {
                    UserController UserCtl = new UserController();
                    UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                    HttpContext.Current.Session.Clear();
                    System.Web.Security.FormsAuthentication.SignOut();
                    HttpContext.Current.Response.Redirect("../Login.aspx");
                }
                int userId = int.Parse(HttpContext.Current.Session["UserID"].ToString());
                DateTime currentWorkDate = DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString());
                int distributerId = int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString());
                string i = OrderEntryController.Void_Order(orderId, userId, currentWorkDate, distributerId,1, VoidReasonID);
                if (i == "0")
                {
                    throw new Exception("You are not authorized!");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public static void UpdatePrintRecords(string orderedProducts)
        {
            DataTable dtValue = (DataTable)JsonConvert.DeserializeObject(orderedProducts, (typeof(DataTable)));
            OrderEntryController.UpdatePrint(dtValue);
        }

        [WebMethod]
        [ScriptMethod]
        public static bool SaveSplitOrder(string tblProducts,long SaleInvoiceID, decimal decGST,int PaymentMode)
        {

            if (IsDayClosed())
            {
                UserController UserCtl = new UserController();
                UserCtl.InsertUserLogoutTime(Convert.ToInt32(HttpContext.Current.Session["User_Log_ID"]), Convert.ToInt32(HttpContext.Current.Session["UserID"]));
                HttpContext.Current.Session.Clear();
                System.Web.Security.FormsAuthentication.SignOut();
                HttpContext.Current.Response.Redirect("../Login.aspx");
            }
            try
            {
                DataTable dtValue = new DataTable();
                dtValue = (DataTable)JsonConvert.DeserializeObject(tblProducts, (typeof(DataTable)));
                if (dtValue.Rows.Count > 0 )
                {
                    decimal GSTPER = Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]);
                    if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                    {
                        GSTPER = 0;
                    }
                    OrderEntryController.SplitOrder(SaleInvoiceID, HttpContext.Current.Session["BillFormat"].ToString(),PaymentMode,GSTPER, Convert.ToDecimal(HttpContext.Current.Session["GSTRate"]), Convert.ToDecimal(HttpContext.Current.Session["GSTCardRate"]), decGST, dtValue);                    
                }
                return true;
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                throw;
            }
        }

        #endregion        

        #region Reports

        [WebMethod]
        [ScriptMethod]
        public static string GetDailySummary(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach(string s in HiddenReportsDetail.Split(','))
            {
                if(s == "1")
                {
                    HiddenReport = true;
                    break;
                }
            }
            RptSaleController rptSaleCtl = new RptSaleController();
            DataSet ds = rptSaleCtl.SelectSaleReportDataSet(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate), 7, HiddenReport);
            return JsonConvert.SerializeObject(ds, Formatting.None);
        }

        [WebMethod]
        [ScriptMethod]
        public static string SelectSalesSummary(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach (string s in HiddenReportsDetail.Split(','))
            {
                if (s == "2")
                {
                    HiddenReport = true;
                    break;
                }
            }
            RptSaleController rptSaleCtl = new RptSaleController();
            DataSet ds = rptSaleCtl.SelectSaleReportDataSet(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate),Convert.ToDateTime(toDate), 1, HiddenReport);
            return JsonConvert.SerializeObject(ds, Formatting.None);

        }

        [WebMethod]
        [ScriptMethod]
        public static string SelectSalesDetail(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach (string s in HiddenReportsDetail.Split(','))
            {
                if (s == "2")
                {
                    HiddenReport = true;
                    break;
                }
            }
            var rptSaleCtl = new RptSaleController();
            DataTable dt = rptSaleCtl.SelectSaleReport(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate),Convert.ToDateTime(toDate), 2,HiddenReport);
            return GetJson(dt);
        }

        [WebMethod]
        [ScriptMethod]
        public static string SelectItemSalesDetail(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach (string s in HiddenReportsDetail.Split(','))
            {
                if (s == "2")
                {
                    HiddenReport = true;
                    break;
                }
            }
            var rptSaleCtl = new RptSaleController();
            DataSet ds = rptSaleCtl.SelectSaleReportDataSet(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate),Convert.ToDateTime(toDate), 3,HiddenReport);
            return JsonConvert.SerializeObject(ds, Formatting.None);
        }

        [WebMethod]
        [ScriptMethod]
        public static string GetDailySaleData(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach (string s in HiddenReportsDetail.Split(','))
            {
                if (s == "2")
                {
                    HiddenReport = true;
                    break;
                }
            }
            var rptSaleCtl = new RptSaleController();
            DataTable dt = rptSaleCtl.SelectSaleReport(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate), 4,HiddenReport);
            return GetJson(dt);
        }

        [WebMethod]
        [ScriptMethod]
        public static string GetServiceWiseSales(string fromDate, string toDate)
        {
            string HiddenReportsDetail = HttpContext.Current.Session["HiddenReportsDetail"].ToString();
            bool HiddenReport = false;
            foreach (string s in HiddenReportsDetail.Split(','))
            {
                if (s == "2")
                {
                    HiddenReport = true;
                    break;
                }
            }
            var rptSaleCtl = new RptSaleController();
            DataSet ds = rptSaleCtl.SelectSaleReportDataSet(int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), int.Parse(HttpContext.Current.Session["UserId"].ToString()), Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate), 8,HiddenReport);
            return JsonConvert.SerializeObject(ds, Formatting.None);
        }

        #endregion

        #region Table

        [WebMethod]
        public static string SelectPendingTables()
        {
            var mTableController = new OrderEntryController();
            DataTable dtTables = mTableController.SelectPendingBills(Constants.LongNullValue, DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), int.Parse(HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString()), Constants.IntNullValue, Constants.IntNullValue, 1);
            return GetJson(dtTables);
        }

        #endregion

        #region Delivery Channel

        [WebMethod]
        public static string GetDeliveryChannel()
        {
            var mDistributor = new DistributorController();
            DataTable dtDCs = mDistributor.GetDeliveryChannel(Constants.IntNullValue);
            HttpContext.Current.Session.Add("dtDCs", dtDCs);
            return GetJson(dtDCs);
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

        #region Banks

        [WebMethod]
        public static string GetBanks()
        {
            var mAccountController = new AccountHeadController();
            DataTable dtBanks = mAccountController.SelectAccountHeadByMapping(Constants.AC_AccountHeadId, Constants.LongNullValue, 2, Constants.AC_BankAccountHead);
            return GetJson(dtBanks);
        }

        [WebMethod]
        [ScriptMethod]
        public static string GetBankDiscount()
        {
            var mDisController = new BankDiscountController();
            DataTable dt = mDisController.GetBankDiscount("", 2, HttpContext.Current.Session["DISTRIBUTOR_ID"].ToString(), DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()), DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()));
            return GetJson(dt);
        }

        #endregion

        #region SMS


        //msgType: 1 for hold, 2 for Ride

        [WebMethod]
        [ScriptMethod]
        public static string SendSMS(string customerNo, string msg, int DistributorID)
        {
            DistributorController smsCtrl = new DistributorController();
            DataTable dt = smsCtrl.GetSMSSetting(DistributorID);
            customerNo = CheckNumber(customerNo);
            if (dt != null)
            {
                if (dt.Rows.Count > 0)
                {
                    if (dt.Rows[0]["TypeID"].ToString() == "3")//3= Outreach
                    {
                        String result = "";
                        String strPost = "id=" + dt.Rows[0]["USERID"].ToString() + "&pass=" + dt.Rows[0]["PASSWORD"].ToString() + "&msg=" + msg + "&to=" + customerNo + "" + "&mask=" + dt.Rows[0]["MASK"].ToString() + "&type=xml&lang=English";
                        StreamWriter myWriter = null;
                        HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(dt.Rows[0]["URL"].ToString());

                        objRequest.Method = "POST";
                        objRequest.ContentLength = Encoding.UTF8.GetByteCount(strPost);
                        objRequest.ContentType = "application/x-www-form-urlencoded";
                        try
                        {
                            myWriter = new StreamWriter(objRequest.GetRequestStream());
                            myWriter.Write(strPost);
                        }
                        catch (Exception e)
                        {
                            return e.Message;
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
                        var xml2 = System.Xml.Linq.XElement.Parse(result);
                        if (xml2.Elements("type").FirstOrDefault().Value.ToLower() == "success")
                        {
                            result = xml2.Elements("response").FirstOrDefault().Value;
                        }
                        else
                        {
                            result = "Message not sent";
                        }
                    }
                }
            }
            return "";
        }

        private static string SendSMS(string customerNo, string userid, string password, string msg, string mask, string Url)
        {
            //String url = "http://www.outreach.pk/api/sendsms.php/sendsms/url";
            customerNo = CheckNumber(customerNo);
            String result = "";
            String strPost = "id=" + userid + "&pass=" + password + "&msg=" + msg + "&to=" + customerNo + "" + "&mask=" + mask + "&type=xml&lang=English";
            StreamWriter myWriter = null;
            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(Url);

            objRequest.Method = "POST";
            objRequest.ContentLength = Encoding.UTF8.GetByteCount(strPost);
            objRequest.ContentType = "application/x-www-form-urlencoded";
            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(strPost);
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                myWriter.Close();
            }
            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();   // Close and clean up the StreamReader   
                sr.Close();
            }
            return result;
        }

        private static string SendSMSTelenor(string customerNo, string userid, string password, string msg, string mask, string Url)
        {

            customerNo = CheckNumber(customerNo);
            String result = "";
            String strPost = Url + "auth.jsp?msisdn=" + userid + "&password=" + password;
            StreamWriter myWriter = null;
            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(Url + "auth.jsp?msisdn=" + userid + "&password=" + password);

            objRequest.Method = "POST";
            objRequest.ContentLength = Encoding.UTF8.GetByteCount(strPost);
            objRequest.ContentType = "application/x-www-form-urlencoded";
            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(strPost);
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                myWriter.Close();
            }
            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();   // Close and clean up the StreamReader   
                sr.Close();
            }

            var xml = System.Xml.Linq.XElement.Parse(result);
            if (xml.Elements("response").FirstOrDefault().Value.ToLower() == "ok")
            {
                string sessionID = xml.Elements("data").FirstOrDefault().Value;
                if (sessionID.Length > 0)
                {
                    String result2 = "";
                    String strPost2 = Url + "sendsms.jsp?session_id=" + sessionID + "&to=" + customerNo;
                    StreamWriter myWriter2 = null;
                    HttpWebRequest objRequest2 = (HttpWebRequest)WebRequest.Create(Url + "sendsms.jsp?session_id=" + sessionID + "&to=" + customerNo + "&text=" + msg + "&mask=" + mask);

                    objRequest2.Method = "POST";
                    objRequest2.ContentLength = Encoding.UTF8.GetByteCount(strPost2);
                    objRequest2.ContentType = "application/x-www-form-urlencoded";
                    try
                    {
                        myWriter2 = new StreamWriter(objRequest2.GetRequestStream());
                        myWriter2.Write(strPost2);
                    }
                    catch (Exception e)
                    {
                        return e.Message;
                    }
                    finally
                    {
                        myWriter2.Close();
                    }
                    HttpWebResponse objResponse2 = (HttpWebResponse)objRequest2.GetResponse();
                    using (StreamReader sr = new StreamReader(objResponse2.GetResponseStream()))
                    {
                        result2 = sr.ReadToEnd();   // Close and clean up the StreamReader   
                        sr.Close();
                    }

                    var xml2 = System.Xml.Linq.XElement.Parse(result2);
                    if (xml2.Elements("response").FirstOrDefault().Value.ToLower() == "ok")
                    {
                        return "SMS sent successfully";
                    }
                    else
                    {
                        return xml2.Elements("data").FirstOrDefault().Value;
                    }
                }
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

        #region FBR PRA Integration
        [WebMethod]
        [ScriptMethod]
        public static string PostDataToFBR(string InvoiceNo, string ClientNTN, string ClientCNIC, string ClientName, string ClientPhone, int PaymentMode, double TaxRate, decimal FurtherTax, decimal Discount, int InvoiceType, DataTable dtDetail,DataTable dtTaxAuthority)
        {
            try
            {
                if (dtTaxAuthority.Rows.Count > 0)
                {
                    InvoiceFBR objInvoice = new InvoiceFBR();
                    List<InvoiceFBRDetail> lstItems = new List<InvoiceFBRDetail>();                    
                    int TotalQty = 0;
                    double GrossValue = 0;
                    double NetAmount = 0;
                    double TotalTax = 0;
                    List<int> Deal = new List<int>();
                    foreach (DataRow dr in dtDetail.Rows)
                    {
                        InvoiceFBRDetail ObjInvoiceDetail = new InvoiceFBRDetail();
                        if (int.Parse(dr["I_D_ID"].ToString()) > 0)
                        {
                            if (!Deal.Contains(int.Parse(dr["I_D_ID"].ToString())))
                            {
                                Deal.Add(int.Parse(dr["I_D_ID"].ToString()));
                                ObjInvoiceDetail.ItemCode = dr["SKU_ID"].ToString();
                                ObjInvoiceDetail.ItemName = dr["DEAL_NAME"].ToString();
                                ObjInvoiceDetail.Quantity = Convert.ToInt32(dr["DEAL_QTY"]);
                                ObjInvoiceDetail.SaleValue = Convert.ToDouble(dr["A_PRICE"]);
                                if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                                {
                                    ObjInvoiceDetail.TaxCharged = Convert.ToDouble(dr["ItemWiseGST"]);
                                    ObjInvoiceDetail.TaxRate = Convert.ToDouble(dr["GSTPER"]);
                                }
                                else
                                {
                                    ObjInvoiceDetail.TaxCharged = Convert.ToDouble(dr["A_PRICE"]) * TaxRate / 100;
                                    ObjInvoiceDetail.TaxRate = TaxRate;
                                }
                                ObjInvoiceDetail.TotalAmount = Convert.ToDouble(dr["A_PRICE"]) + ObjInvoiceDetail.TaxCharged;
                                ObjInvoiceDetail.PCTCode = "10101";
                                ObjInvoiceDetail.FurtherTax = 0;
                                ObjInvoiceDetail.InvoiceType = InvoiceType;//1=New,2=Debit,3=Credit
                                ObjInvoiceDetail.Discount = Discount / dtDetail.Rows.Count;
                                ObjInvoiceDetail.RefUSIN = null;
                                lstItems.Add(ObjInvoiceDetail);
                            }
                        }
                        else
                        {
                            ObjInvoiceDetail.ItemCode = dr["SKU_ID"].ToString();
                            ObjInvoiceDetail.ItemName = dr["SKU_NAME"].ToString();
                            ObjInvoiceDetail.Quantity = Convert.ToInt32(dr["QTY"]);
                            ObjInvoiceDetail.SaleValue = Convert.ToDouble(dr["AMOUNT"]);
                            if (HttpContext.Current.Session["ItemWiseGST"].ToString() == "1")
                            {
                                ObjInvoiceDetail.TaxCharged = Convert.ToDouble(dr["ItemWiseGST"]);
                                ObjInvoiceDetail.TaxRate = Convert.ToDouble(dr["GSTPER"]);
                            }
                            else
                            {
                                ObjInvoiceDetail.TaxCharged = Convert.ToDouble(dr["AMOUNT"]) * TaxRate / 100;
                                ObjInvoiceDetail.TaxRate = TaxRate;
                            }
                            ObjInvoiceDetail.TotalAmount = Convert.ToDouble(dr["AMOUNT"]) + ObjInvoiceDetail.TaxCharged;
                            ObjInvoiceDetail.PCTCode = "10101";
                            ObjInvoiceDetail.FurtherTax = 0;
                            ObjInvoiceDetail.InvoiceType = InvoiceType;//1=New,2=Debit,3=Credit
                            ObjInvoiceDetail.Discount = Discount / dtDetail.Rows.Count;
                            ObjInvoiceDetail.RefUSIN = null;
                            lstItems.Add(ObjInvoiceDetail);                            
                        }

                        TotalQty += ObjInvoiceDetail.Quantity;
                        GrossValue += ObjInvoiceDetail.SaleValue;
                        NetAmount += ObjInvoiceDetail.TotalAmount;
                        TotalTax += ObjInvoiceDetail.TaxCharged;
                    }
                    objInvoice.Items = lstItems;
                    objInvoice.InvoiceNumber = string.Empty;
                    objInvoice.POSID = dtTaxAuthority.Rows[0]["POSID"].ToString();
                    objInvoice.USIN = InvoiceNo;
                    objInvoice.DateTime = DateTime.Now.Date;
                    objInvoice.BuyerNTN = ClientNTN;
                    objInvoice.BuyerCNIC = ClientCNIC;
                    objInvoice.BuyerName = ClientName;
                    objInvoice.BuyerPhoneNumber = ClientPhone;
                    objInvoice.PaymentMode = PaymentMode;//1=Cash,2=Card,3=Gift Voucher,4=Loyality Card,5=Mixed,6=Cheque
                    objInvoice.TotalSaleValue = GrossValue;
                    objInvoice.TotalQuantity = TotalQty;
                    objInvoice.TotalBillAmount = NetAmount;
                    objInvoice.TotalTaxCharged = TotalTax;
                    objInvoice.Discount = Discount;
                    objInvoice.FurtherTax = FurtherTax;
                    objInvoice.InvoiceType = InvoiceType;
                    objInvoice.RefUSIN = null;

                    HttpClient Client = new HttpClient();

                    Client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dtTaxAuthority.Rows[0]["Token"].ToString());
                    var content = new StringContent(JsonConvert.SerializeObject(objInvoice), Encoding.UTF8, "application/json");
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                    HttpResponseMessage response = Client.PostAsync(dtTaxAuthority.Rows[0]["FBRURL"].ToString(), content).Result;

                    string InvoiceNumberFBR = string.Empty;
                    string CodeFBR = string.Empty;
                    if (response.IsSuccessStatusCode)
                    {
                        string responseFBR = response.Content.ReadAsStringAsync().Result;
                        InvoiceNumberFBR = JObject.Parse(responseFBR)["InvoiceNumber"].ToString();
                        CodeFBR = JObject.Parse(responseFBR)["Code"].ToString();
                        HttpContext.Current.Session.Add("InvoiceNumberFBR", InvoiceNumberFBR);
                    }
                    else
                    {
                        InvoiceNumberFBR = response.StatusCode.ToString();
                        CodeFBR = response.StatusCode.ToString();
                        HttpContext.Current.Session.Add("InvoiceNumberFBR", InvoiceNumberFBR);
                    }

                    DataTable dtQr = new DataTable();
                    dtQr.Columns.Add("QrString", typeof(string));
                    dtQr.Columns.Add("FBRInvoiceNumber", typeof(string));
                    QRCodeGenerator qrGenerator = new QRCodeGenerator();
                    QRCodeGenerator.QRCode qrCode = qrGenerator.CreateQrCode(InvoiceNumberFBR, QRCodeGenerator.ECCLevel.Q);
                    Bitmap bitmap = qrCode.GetGraphic(20);
                    MemoryStream ms = new MemoryStream();
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] byteImage = ms.ToArray();
                    DataRow drQr = dtQr.NewRow();
                    drQr["QrString"] = Convert.ToBase64String(byteImage);
                    drQr["FBRInvoiceNumber"] = InvoiceNumberFBR;
                    dtQr.Rows.Add(drQr);
                    return GetJson(dtQr);
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                DataTable dtQr = new DataTable();
                dtQr.Columns.Add("QrString", typeof(string));
                dtQr.Columns.Add("FBRInvoiceNumber", typeof(string));
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeGenerator.QRCode qrCode = qrGenerator.CreateQrCode("FBR Server Down", QRCodeGenerator.ECCLevel.Q);
                Bitmap bitmap = qrCode.GetGraphic(20);
                MemoryStream ms = new MemoryStream();
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] byteImage = ms.ToArray();
                DataRow drQr = dtQr.NewRow();
                drQr["QrString"] = Convert.ToBase64String(byteImage);
                drQr["FBRInvoiceNumber"] = "FBR Server Down";
                dtQr.Rows.Add(drQr);
                HttpContext.Current.Session.Add("InvoiceNumberFBR", "FBR Server Down");
                return GetJson(dtQr);
            }
        }
        #endregion

        #region KPRA Integration
        [WebMethod]
        [ScriptMethod]
        public static void PostDataToKPRA(string InvoiceNo,decimal Amount, decimal TaxAmount, decimal Discount, DataTable dtTaxAuthority)
        {
            try
            {
                if (dtTaxAuthority.Rows.Count > 0)
                {
                    string URL = dtTaxAuthority.Rows[0]["FBRURL"].ToString() + "?ntn=" + dtTaxAuthority.Rows[0]["POSID"].ToString() + "&key=" + dtTaxAuthority.Rows[0]["Token"].ToString()
                        + "&invoice_no=" + InvoiceNo + "&amount=" + Amount.ToString() + "&sts=" + TaxAmount.ToString() + "&date="+ Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]).ToString("MM/dd/yyyy");
                    string myParams = "";
                    using (WebClient wc = new WebClient())
                    {
                        System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;
                        wc.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";
                        string HtmlResult = wc.UploadString(URL,myParams);
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region SRB Integration
        [WebMethod]
        [ScriptMethod]
        public static string PostDataToSRB(string InvoiceNo, decimal Amount, decimal TaxAmount, double TaxRate,string NTN, DataTable dtTaxAuthority)
        {
            try
            {
                HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create(dtTaxAuthority.Rows[0]["FBRURL"].ToString());
                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                myReq.ContentType = "application/x-www-form-urlencoded";
                myReq.Method = "POST";
                using (var streamWriter = new StreamWriter(myReq.GetRequestStream()))
                {
                    string json = "{'posId':" + dtTaxAuthority.Rows[0]["POSID"].ToString() + ",'name':'" + dtTaxAuthority.Rows[0]["Token"].ToString() + "', 'ntn':'4694034', 'invoiceId':'" + InvoiceNo + "', 'invoiceDateTime':'" + Convert.ToDateTime(HttpContext.Current.Session["CurrentWorkDate"]).ToString("yyyy-MM-dd") + " " + System.DateTime.Now.ToString("HH:mm:ss") + "', 'rateValue':'" + TaxRate.ToString() + "', 'saleValue':'" + Amount.ToString() + "', 'taxAmount':'" + TaxAmount.ToString() + "', 'consumerName':'N/A', 'consumerNTN':'N/A', 'address':'N/A', 'tariffCode':'N/A', 'extraInf':'N/A', 'invoiceType':1, 'pos_user' : '" + dtTaxAuthority.Rows[0]["POSUser"].ToString() + "', 'pos_pass':'" + dtTaxAuthority.Rows[0]["POSPassword"].ToString() + "'}";
                    json = json.Replace("'", "\"");
                    streamWriter.Write(json);
                }
                var httpResponse = (HttpWebResponse)myReq.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    if (JObject.Parse(result)["resCode"].ToString() == "00")
                    {
                        HttpContext.Current.Session.Add("InvoiceNumberFBR", JObject.Parse(result)["srbInvoceId"].ToString());
                    }
                    else
                    {
                        HttpContext.Current.Session.Add("InvoiceNumberFBR", "Error.");
                    }
                }
                DataTable dtQr = new DataTable();
                dtQr.Columns.Add("QrString", typeof(string));
                dtQr.Columns.Add("FBRInvoiceNumber", typeof(string));
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeGenerator.QRCode qrCode = qrGenerator.CreateQrCode(HttpContext.Current.Session["InvoiceNumberFBR"].ToString(), QRCodeGenerator.ECCLevel.Q);
                Bitmap bitmap = qrCode.GetGraphic(20);
                MemoryStream ms = new MemoryStream();
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] byteImage = ms.ToArray();
                DataRow drQr = dtQr.NewRow();
                drQr["QrString"] = Convert.ToBase64String(byteImage);
                drQr["FBRInvoiceNumber"] = HttpContext.Current.Session["InvoiceNumberFBR"].ToString();
                dtQr.Rows.Add(drQr);
                return GetJson(dtQr);

            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
                DataTable dtQr = new DataTable();
                dtQr.Columns.Add("QrString", typeof(string));
                dtQr.Columns.Add("FBRInvoiceNumber", typeof(string));
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeGenerator.QRCode qrCode = qrGenerator.CreateQrCode("FBR Server Down", QRCodeGenerator.ECCLevel.Q);
                Bitmap bitmap = qrCode.GetGraphic(20);
                MemoryStream ms = new MemoryStream();
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] byteImage = ms.ToArray();
                DataRow drQr = dtQr.NewRow();
                drQr["QrString"] = Convert.ToBase64String(byteImage);
                drQr["FBRInvoiceNumber"] = "FBR Server Down";
                dtQr.Rows.Add(drQr);
                HttpContext.Current.Session.Add("InvoiceNumberFBR", "FBR Server Down");
                return GetJson(dtQr);
            }
        }

        #endregion

        #region Stock Demand Data for Notification
        [WebMethod]
        [ScriptMethod]
        public static string GetStockDemandData()
        {
            var mPurCtrl = new PurchaseController();
            DataTable dtSkus = mPurCtrl.GetStockDemandData(Convert.ToInt32(HttpContext.Current.Session["DISTRIBUTOR_ID"]), DateTime.Parse(HttpContext.Current.Session["CurrentWorkDate"].ToString()));
            return GetJson(dtSkus);
        }
        #endregion

        #region Form Data
        protected void lnkExit_OnClick(object sender, EventArgs e)
        {

            Response.Redirect("Home.aspx");

        }

        private static bool IsDayClosed()
        {
            var DistrCtl = new DistributorController();
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