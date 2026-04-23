using System;
using System.Data;
using CORNCommon.Classes;
using CORNDataAccessLayer.Classes;
using CORNDatabaseLayer.Classes;
using System.IO;
using System.Web.UI.WebControls;
using System.Collections.Generic;

namespace CORNBusinessLayer.Classes
{
    /// <summary>
    /// Class For Purchase, TranferOut, Purchase Return, TranferIn And Damage Related Tasks
    /// <example>
    /// <list type="bullet">
    /// <item>
    /// Insert Purchase, TranferOut, Purchase Return, TranferIn And Damage
    /// </item>
    /// <term>
    /// Update Purchase, TranferOut, Purchase Return, TranferIn And Damage
    /// </term>
    /// <item>
    /// Get Purchase, TranferOut, Purchase Return, TranferIn And Damage
    /// </item>
    /// </list>
    /// </example>
    /// </summary>
    public class PurchaseController
    {
        #region Constructor

        /// <summary>
        /// Constructor for PurchaseController
        /// </summary>
        public PurchaseController()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        #endregion

        #region Private Variables

        IDbTransaction mTransaction;
        IDbConnection mConnection;

        #endregion

        #region Public Methods

        #region Select

        /// <summary>
        /// Get Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail
        /// </summary>
        /// <remarks>
        /// Returns Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail as Datatable
        /// </remarks>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <param name="PConnection">Connection</param>
        /// <param name="PTransaction">Transaction</param>
        /// <returns>Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail as Datatable</returns>
        public DataTable SelectPrivousePurchaseDetail(int p_DISTRIBUTOR_ID, long p_PURCHASE_MASTER_ID, IDbConnection PConnection, IDbTransaction PTransaction)
        {
            try
            {
                spSelectPURCHASE_DETAIL mPurchaseDetail = new spSelectPURCHASE_DETAIL();
                mPurchaseDetail.Connection = PConnection;
                mPurchaseDetail.Transaction = PTransaction;
                mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseDetail.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                DataTable dt = mPurchaseDetail.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
        }

        public DataTable SelectPrivousePurchaseDetail(int p_DISTRIBUTOR_ID, long p_PURCHASE_MASTER_ID)
        {
            try
            {
                spSelectPURCHASE_DETAIL mPurchaseDetail = new spSelectPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseDetail.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                DataTable dt = mPurchaseDetail.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
        }

        /// <summary>
        /// Gets Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No
        /// </summary>
        /// <remarks>
        /// Returns Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No as Datatable
        /// </remarks>
        /// <param name="p_TYPE_ID">Type</param>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <param name="p_User_Id">InsertedBy</param>
        /// <param name="p_Posting">Posting</param>
        /// <returns>Purchase, TranferOut, Purchase Return, TranferIn And Damage  Document No as Datatable</returns>
        public DataTable SelectPurchaseDocumentNo(int p_TYPE_ID, int p_DISTRIBUTOR_ID, long p_PURCHASE_MASTER_ID, int p_User_Id, int p_Posting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_MASTER mPurchaseMaster = new spSelectPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.USER_ID = p_User_Id;
                mPurchaseMaster.POSTING = p_Posting;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }


        /// <summary>
        /// Gets Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No
        /// </summary>
        /// <remarks>
        /// Returns Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No as Datatable
        /// </remarks>
        /// <param name="p_TYPE_ID">Type</param>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="P_DocumentDate">Date</param>
        /// <returns>Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No as Datatable</returns>
        public DataTable SelectPurchaseDocumentNo(int p_TYPE_ID, int p_DISTRIBUTOR_ID, DateTime P_DocumentDate)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_MASTER mPurchaseMaster = new spSelectPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.DOCUMENT_DATE = P_DocumentDate;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public DataTable SelectPurchaseDocumentNo(int p_TYPE_ID, int p_DISTRIBUTOR_ID,int p_USER_ID, DateTime P_DocumentDate)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_MASTER mPurchaseMaster = new spSelectPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.DOCUMENT_DATE = P_DocumentDate;
                mPurchaseMaster.USER_ID = p_USER_ID;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        /// <summary>
        /// Gets Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No
        /// </summary>
        /// <remarks>
        /// Returns Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No as Datatable
        /// </remarks>
        /// <param name="p_TYPE_ID">Type</param>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <param name="p_User_Id">InsertedBy</param>
        /// <param name="p_Posting">Posting</param>
        /// <param name="p_SOLD_TO">SoldTo</param>
        /// <returns>Purchase, TranferOut, Purchase Return, TranferIn And Damage Document No as Datatable</returns>
        public DataTable SelectPurchaseDocumentNo(int p_TYPE_ID, int p_DISTRIBUTOR_ID, long p_PURCHASE_MASTER_ID, int p_User_Id, int p_Posting, int p_SOLD_TO)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_MASTER mPurchaseMaster = new spSelectPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.USER_ID = Constants.IntNullValue;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        /// <summary>
        /// Get Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail
        /// </summary>
        /// <remarks>
        /// Returns Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail as Datatable
        /// </remarks>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <returns>Purchase, TranferOut, Purchase Return, TranferIn And Damage Detail as Datatable</returns>
        public DataTable SelectPurchaseDetail(int p_DISTRIBUTOR_ID, long p_PURCHASE_MASTER_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_DETAIL mPurchaseDetail = new spSelectPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseDetail.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                DataTable dt = mPurchaseDetail.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }
        public DataTable SelectInvoiceBookingDetail(string p_ContractType, long p_PURCHASE_MASTER_ID,int p_TypeID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectInvBooking_DETAIL mPurchaseDetail = new spSelectInvBooking_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.BATCH_NO = p_ContractType;
                mPurchaseDetail.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseDetail.TYPE_ID = p_TypeID;
                DataTable dt = mPurchaseDetail.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public DataTable selectStockDemandDetail(int p_DISTRIBUTOR_ID, int p_DemandStockId,DateTime p_DAY_CLOSE)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectStockDemandDetail mDemandDetail = new spSelectStockDemandDetail();
                mDemandDetail.Connection = mConnection;

                mDemandDetail.DEMAND_ID = p_DemandStockId;
                mDemandDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mDemandDetail.DAY_CLOSE = p_DAY_CLOSE;
                DataTable dt = mDemandDetail.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public DataTable SelectPrincipalOpening(int p_DISTRIBUTOR_ID, int pPrincipalId,int p_TYPE_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPURCHASE_MASTER mPurchaseMaster = new spSelectPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.ORDER_NUMBER = "opng";
                mPurchaseMaster.SOLD_FROM = pPrincipalId;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        #endregion

        #region Insert, Update


        /// <summary>
        /// Inserts Purchase, TranferOut, Purchase Return, TranferIn And Damage Document
        /// </summary>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_ORDER_NUMBER">DocumentNo</param>
        /// <param name="p_TYPE_ID">Type</param>
        /// <param name="p_DOCUMENT_DATE">Date</param>
        /// <param name="p_SOLD_TO">SoldTo</param>
        /// <param name="p_SOLD_FROM">SoldFrom</param>
        /// <param name="p_TOTAL_AMOUNT">Amount</param>
        /// <param name="p_IS_DELETE">IsDeleted</param>
        /// <param name="dtPurchaseDetail">PurchaseDetailDatatable</param>
        /// <param name="p_Posting">Posting</param>
        /// <param name="p_BuiltyNo">Builty</param>
        /// <param name="p_UserId">InsertedBy</param>
        /// <param name="p_PrincipalId">Principal</param>
        /// <returns>True On Success And False On Failure</returns>
        /// 
        public bool InsertPurchaseDocument(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
         , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting
         , string p_BuiltyNo, int p_UserId, int p_PrincipalId, DataTable dtConfig,
            bool IsFinanceSetting, long p_physicalStockTaking_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.PhysicalStock_Taking_ID = p_physicalStockTaking_ID;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());
                    mPurchaseDetail.REMARKS = dr["Remarks"].ToString();
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    LedgerController LController = new LedgerController();

                    #region GL Master, Detail

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;


                    if (p_TYPE_ID == Constants.Document_Opening)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                        long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2,
                            Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Opening,
                            Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Opening Stock, Doc#: " 
                            + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId,
                            "OpeningStock",p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {

                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Opening Stock Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT, "Opening Stock Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Damaged)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockDamage + "'");
                        long StockDamage = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Damaged, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Damage Stock Voucher, Doc#: " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_BuiltyNo, p_UserId, "Damage", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {

                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Damage Stock Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockDamage, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Damage Stock Voucher", mTransaction, mConnection);

                        }
                    }

                    else if (p_TYPE_ID == Constants.Document_Transfer_Out)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Transfer_In)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_In, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer In Voucher", p_UserId, "Transfer In", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Transfer In Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, 0, p_TOTAL_AMOUNT, "Account(s) Payable Transfer In Voucher", mTransaction, mConnection);

                        }
                    }

                    else if (p_TYPE_ID == Constants.Document_Short)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                        long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Short, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Short Voucher, Doc# :" + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId, "Short", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Short Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, p_TOTAL_AMOUNT, 0, "Account(s) Payable Short Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Acess)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                        long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2,
                            Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Acess,
                            Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Excess Stock Voucher, Doc# :" 
                            + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId,
                            "Excess", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, 0, p_TOTAL_AMOUNT, "Excess Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Account(s) Payable Excess Voucher", mTransaction, mConnection);

                        }
                    }
                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool InsertPurchaseDocument2(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
      , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting
      , string p_BuiltyNo, int p_UserId, int p_PrincipalId, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TAX = decimal.Parse(dr["TAX"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    if (p_TYPE_ID != Constants.Document_Opening)
                    {
                        LedgerController LController = new LedgerController();

                        #region GL Master, Detail

                        string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                        DataRow[] drConfig = null;



                        if (p_TYPE_ID == Constants.Document_Damaged)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockDamage + "'");
                            long StockDamage = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Damaged, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Damage Stock Voucher", p_UserId, "Damage", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {

                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Damage Stock Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockDamage, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Damage Stock Voucher", mTransaction, mConnection);

                            }
                        }

                        else if (p_TYPE_ID == Constants.Document_Transfer_Out)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                            long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Transfer_In)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                            long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_In, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer In Voucher", p_UserId, "Transfer In", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Transfer In Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, 0, p_TOTAL_AMOUNT, "Account(s) Payable Transfer In Voucher", mTransaction, mConnection);

                            }
                        }

                        else if (p_TYPE_ID == Constants.Document_Short)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Short, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Short Voucher", p_UserId, "Short", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Short Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, p_TOTAL_AMOUNT, 0, "Account(s) Payable Short Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Acess)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Acess, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Excess Voucher", p_UserId, "Excess", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, 0, p_TOTAL_AMOUNT, "Excess Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Account(s) Payable Excess Voucher", mTransaction, mConnection);

                            }
                        }
                        #endregion
                    }
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public long InsertTransferOut(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE,
            int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail,
            int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId, DataTable dtConfig,
            bool IsFinanceSetting, int p_stock_Demand_Id)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.STOCK_DEMAND_ID = p_stock_Demand_Id;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (decimal.Parse(dr["QUANTITY"].ToString()) > 0)
                    {
                        mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                        mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        mPurchaseDetail.BATCH_NO = "N/A";
                        mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                        mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                        mPurchaseDetail.FREE_SKU = 0;
                        mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                        mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                        mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                        mPurchaseDetail.TAX = decimal.Parse(dr["TAX"].ToString());
                        mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());

                        mPurchaseDetail.ExecuteQuery();

                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                        mStockUpdate.Connection = mConnection;
                        mStockUpdate.Transaction = mTransaction;
                        mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                        mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                        mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                        mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                        mStockUpdate.STOCK_QTY = decimal.Parse(dr["QUANTITY"].ToString());
                        mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                        mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                        mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                        mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                        mStockUpdate.ExecuteQuery();
                    }
                }
                #region GL Master, Detail
                if (IsFinanceSetting)
                {
                    LedgerController LController = new LedgerController();
                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                    long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Against Demand Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                    {
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                    }
                    
                }
                #endregion
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool InsertTransferIn(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
      , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting
      , string p_BuiltyNo, int p_UserId, int p_PrincipalId, DataTable dtConfig, bool IsFinanceSetting,DataTable dtItemAssignment)
        {
            try
            {
                DataTable dtPurchaseNew = new DataTable();
                dtPurchaseNew.Columns.Add("SKU_ID", typeof(int));
                dtPurchaseNew.Columns.Add("ParentID", typeof(int));
                dtPurchaseNew.Columns.Add("ParentExist", typeof(bool));
                dtPurchaseNew.Columns.Add("PRICE", typeof(decimal));
                dtPurchaseNew.Columns.Add("QUANTITY", typeof(decimal));
                dtPurchaseNew.Columns.Add("AMOUNT", typeof(decimal));
                dtPurchaseNew.Columns.Add("UOM_ID", typeof(int));
                dtPurchaseNew.Columns.Add("S_UOM_ID", typeof(int));
                dtPurchaseNew.Columns.Add("ChildPackSize", typeof(decimal));

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    bool ParentExist = false;
                    foreach (DataRow drItems in dtItemAssignment.Rows)
                    {
                        if (dr["SKU_ID"].ToString() == drItems["ChildID"].ToString())
                        {
                            ParentExist = true;
                            DataRow drNew = dtPurchaseNew.NewRow();
                            drNew["SKU_ID"] = drItems["ChildID"];
                            drNew["ParentID"] = drItems["ParentID"];
                            try
                            {
                                drNew["ChildPackSize"] = drItems["ChildPackSize"];
                            }
                            catch (Exception)
                            {
                                drNew["ChildPackSize"] = 1;
                            }
                            drNew["ParentExist"] = ParentExist;
                            drNew["PRICE"] = dr["PRICE"];
                            drNew["QUANTITY"] = dr["QUANTITY"];
                            drNew["AMOUNT"] = dr["AMOUNT"];
                            drNew["UOM_ID"] = dr["UOM_ID"];
                            drNew["S_UOM_ID"] = dr["S_UOM_ID"];
                            dtPurchaseNew.Rows.Add(drNew);
                        }
                    }
                    if(!ParentExist)
                    {
                        DataRow drNew = dtPurchaseNew.NewRow();
                        drNew["SKU_ID"] = dr["SKU_ID"];
                        drNew["ParentID"] = 0;
                        drNew["ChildPackSize"] = 1;
                        drNew["ParentExist"] = false;
                        drNew["PRICE"] = dr["PRICE"];
                        drNew["QUANTITY"] = dr["QUANTITY"];
                        drNew["AMOUNT"] = dr["AMOUNT"];
                        drNew["UOM_ID"] = dr["UOM_ID"];
                        drNew["S_UOM_ID"] = dr["S_UOM_ID"];
                        dtPurchaseNew.Rows.Add(drNew);
                    }
                }

                //Remove Child Items
                DataTable dtParentItems = dtPurchaseNew.Clone();
                foreach(DataRow drNew in dtPurchaseNew.Rows)
                {
                    if(Convert.ToBoolean(drNew["ParentExist"]))
                    {
                        if (!ParentExist(dtParentItems, drNew["ParentID"].ToString()))
                        {
                            DataRow drParent = dtParentItems.NewRow();
                            drParent["SKU_ID"] = drNew["ParentID"];
                            drParent["ParentID"] = drNew["ParentID"];
                            drParent["ParentExist"] = true;
                            drParent["PRICE"] = drNew["PRICE"];
                            drParent["QUANTITY"] = drNew["QUANTITY"];
                            drParent["AMOUNT"] = drNew["AMOUNT"];
                            drParent["UOM_ID"] = drNew["UOM_ID"];
                            drParent["S_UOM_ID"] = drNew["S_UOM_ID"];
                            drParent["ChildPackSize"] = drNew["ChildPackSize"];
                            dtParentItems.Rows.Add(drParent);
                        }
                    }
                    else
                    {
                        DataRow drParent = dtParentItems.NewRow();
                        drParent["SKU_ID"] = drNew["SKU_ID"];
                        drParent["ParentID"] = 0;
                        drParent["ParentExist"] = false;
                        drParent["PRICE"] = drNew["PRICE"];
                        drParent["QUANTITY"] = drNew["QUANTITY"];
                        drParent["AMOUNT"] = drNew["AMOUNT"];
                        drParent["UOM_ID"] = drNew["UOM_ID"];
                        drParent["S_UOM_ID"] = drNew["S_UOM_ID"];
                        drParent["ChildPackSize"] = 1;
                        dtParentItems.Rows.Add(drParent);
                    }
                }

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtParentItems.Rows)
                {  
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";                    
                    if (!Convert.ToBoolean(dr["ParentExist"]))
                    {
                        mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                        mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    }
                    else
                    {
                        mPurchaseDetail.PRICE = GetAvgPriceForParentItem(dtPurchaseNew, dr["ParentID"].ToString(),dr["ChildPackSize"].ToString());
                        mPurchaseDetail.QUANTITY = GetQtyForParentItem(dtPurchaseDetail, dtItemAssignment,dr["ParentID"].ToString());
                    }
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = mPurchaseDetail.PRICE * mPurchaseDetail.QUANTITY;
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = mPurchaseDetail.QUANTITY;
                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    if (p_TYPE_ID != Constants.Document_Opening)
                    {
                        LedgerController LController = new LedgerController();

                        #region GL Master, Detail

                        string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                        DataRow[] drConfig = null;



                        if (p_TYPE_ID == Constants.Document_Damaged)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockDamage + "'");
                            long StockDamage = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Damaged, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Damage Stock Voucher", p_UserId, "Damage", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {

                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Damage Stock Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockDamage, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Damage Stock Voucher", mTransaction, mConnection);

                            }
                        }

                        else if (p_TYPE_ID == Constants.Document_Transfer_Out)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                            long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Transfer_In)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                            long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_In, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer In Voucher", p_UserId, "Transfer In", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Transfer In Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, 0, p_TOTAL_AMOUNT, "Account(s) Payable Transfer In Voucher", mTransaction, mConnection);

                            }
                        }

                        else if (p_TYPE_ID == Constants.Document_Short)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Short, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Short Voucher", p_UserId, "Short", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Short Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, p_TOTAL_AMOUNT, 0, "Account(s) Payable Short Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Acess)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Acess, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Excess Voucher", p_UserId, "Excess", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, 0, p_TOTAL_AMOUNT, "Excess Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Account(s) Payable Excess Voucher", mTransaction, mConnection);

                            }
                        }
                        #endregion
                    }
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public bool ParentExist(DataTable dt, string ParentID)
        {
            bool flag = false;
            foreach(DataRow dr in dt.Rows)
            {
                if(dr["ParentID"].ToString() == ParentID)
                {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        public decimal GetQtyForParentItem(DataTable dtPurchase, DataTable dtItem, string ParentID)
        {
            decimal convertedqty = 1;
            decimal actualQty = 0;
            decimal actualconvertedQty = 0;
            try
            {
                foreach (DataRow dr in dtItem.Rows)
                {
                    convertedqty = 1;
                    actualQty = 0;
                    if (dr["ParentID"].ToString() == ParentID)
                    {
                        foreach (DataRow drPur in dtPurchase.Rows)
                        {
                            if (drPur["SKU_ID"].ToString() == dr["ChildID"].ToString())
                            {
                                convertedqty = Convert.ToDecimal(dr["ChildPackSize"]);
                                actualQty = Convert.ToDecimal(drPur["Quantity"]);
                            }
                        }
                    }
                    actualconvertedQty += convertedqty * actualQty;
                }
            }
            catch (Exception)
            {
                actualconvertedQty = 0;
            }
            return actualconvertedQty;
        }
        public decimal GetAvgPriceForParentItem(DataTable dtItem, string ParentID,string ChildPackSize)
        {
            decimal AveragePrice = 0;
            int NoOfItems = 0;
            try
            {
                foreach (DataRow dr in dtItem.Rows)
                {
                    if (dr["ParentID"].ToString() == ParentID)
                    {
                        NoOfItems++;
                        try
                        {
                            AveragePrice += Convert.ToDecimal(dr["PRICE"]) / Convert.ToDecimal(dr["ChildPackSize"]);
                        }
                        catch (Exception)
                        {
                            AveragePrice += 0;
                        }
                    }
                }
            }
            catch (Exception)
            {
                AveragePrice = 0;
            }
            return AveragePrice / NoOfItems;
        }
        public int InsertStockDemand(int p_DISTRIBUTOR_ID,  DateTime p_DOCUMENT_DATE, DataTable dtPurchaseDetail,
            int p_UserId,string p_REMARKS, bool p_IsFranchiseDemand)
        {
            int id=Constants.IntNullValue;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertStockDemandMaster mDemadnMaster = new spInsertStockDemandMaster();
                mDemadnMaster.Connection = mConnection;
                mDemadnMaster.Transaction = mTransaction;
                mDemadnMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mDemadnMaster.DEMAND_DATE = p_DOCUMENT_DATE;
                mDemadnMaster.USER_ID = p_UserId;
                mDemadnMaster.REMARKS = p_REMARKS;
                mDemadnMaster.IsFranchiseDemand = p_IsFranchiseDemand;
                mDemadnMaster.ExecuteQuery();

                spInsertStockDemandDetail mStockDemandDetail = new spInsertStockDemandDetail();
                mStockDemandDetail.Connection = mConnection;
                mStockDemandDetail.Transaction = mTransaction;
                id = mDemadnMaster.STOCK_DEMANT_ID;
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (decimal.Parse(dr["QUANTITY"].ToString()) > 0)
                    {
                        mStockDemandDetail.STOCK_DEMAND_MASTER_ID = mDemadnMaster.STOCK_DEMANT_ID;
                        mStockDemandDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        try
                        {
                            mStockDemandDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                        }
                        catch (Exception ex)
                        {
                            mStockDemandDetail.PRICE = 0;
                        }
                        mStockDemandDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                        mStockDemandDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                        mStockDemandDetail.FINISHED_GOOD_ID = int.Parse(dr["FINISHED_GOOD_ID"].ToString());
                        mStockDemandDetail.FINISHED_GOOD_QTY = Convert.ToDecimal(dr["FINISHED_GOOD_QTY"]);
                        mStockDemandDetail.ExecuteQuery();
                    }
                }
                mTransaction.Commit();
                return id;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return id;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool updateStockDemand(int p_DISTRIBUTOR_ID, DateTime p_DOCUMENT_DATE, DataTable dtPurchaseDetail
          , int p_UserId, string p_REMARKS,int p_Stock_demand_Master_id, bool p_IsFranchiseDemand)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdateStockDemand mDemadnMaster = new spUpdateStockDemand();
                mDemadnMaster.Connection = mConnection;
                mDemadnMaster.Transaction = mTransaction;
                mDemadnMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mDemadnMaster.DEMAND_DATE = p_DOCUMENT_DATE;
                mDemadnMaster.USER_ID = p_UserId;
                mDemadnMaster.REMARKS = p_REMARKS;
                mDemadnMaster.STOCK_DEMAND_ID = p_Stock_demand_Master_id;
                mDemadnMaster.IsFranchiseDemand = p_IsFranchiseDemand;
                mDemadnMaster.ExecuteQuery();

                spInsertStockDemandDetail mStockDemandDetail = new spInsertStockDemandDetail();
                mStockDemandDetail.Connection = mConnection;
                mStockDemandDetail.Transaction = mTransaction;
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (decimal.Parse(dr["QUANTITY"].ToString()) > 0)
                    {
                        mStockDemandDetail.STOCK_DEMAND_MASTER_ID = p_Stock_demand_Master_id;
                        mStockDemandDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        try
                        {
                            mStockDemandDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                        }
                        catch (Exception ex)
                        {
                            mStockDemandDetail.PRICE = 0;
                        }
                        mStockDemandDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                        mStockDemandDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                        mStockDemandDetail.FINISHED_GOOD_ID = int.Parse(dr["FINISHED_GOOD_ID"].ToString());
                        mStockDemandDetail.FINISHED_GOOD_QTY = Convert.ToDecimal(dr["FINISHED_GOOD_QTY"]);
                        mStockDemandDetail.ExecuteQuery();
                    }
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool UpdateStockDemand(int p_STOCK_DEMAND_ID,long p_TRANSFER_OUT_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdateStockDemand2 mDemadnMaster = new spUpdateStockDemand2();
                mDemadnMaster.Connection = mConnection;
                mDemadnMaster.STOCK_DEMAND_ID = p_STOCK_DEMAND_ID;
                mDemadnMaster.TRANSFER_OUT_ID = p_TRANSFER_OUT_ID;
                mDemadnMaster.ExecuteQuery();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        //insert purchase and purchase return
        public long InsertPurchase(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                    #region Vendor Ledger

                    LedgerController LController = new LedgerController();
                    // Configuration.GetAccountHead();

                    string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                    #endregion

                    #region GL Master, Detail

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long PurchaseAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                    long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseTax + "'");
                    long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher", p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {

                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher", mTransaction, mConnection);
                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                            }
                            if (p_GST_AMOUNT> 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax,p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                else if (p_TYPE_ID == Constants.Document_Purchase_Return)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Return Voucher", p_UserId, "Purchase Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, 0, p_TOTAL_AMOUNT, "Purchase Return Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, 0, "Account(s) Payable Purchase Return Voucher", mTransaction, mConnection);

                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, p_DISCOUNT, 0, "Account(s) Payable Discount" + "Purchase Return Voucher", mTransaction, mConnection);
                            }

                            if (p_GST_AMOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Purchase Return Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                    #endregion
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public long InsertPurchaseNew(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT,string p_Supplier, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                #region Vendor Ledger

                LedgerController LController = new LedgerController();
                // Configuration.GetAccountHead();

                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                #endregion

                #region GL Master, Detail

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long PurchaseAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher", p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {

                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher", mTransaction, mConnection);
                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                            }
                            if (p_GST_AMOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                else if (p_TYPE_ID == Constants.Document_Purchase_Return)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Return Voucher, Manual Inv# " + p_ORDER_NUMBER + " Supplier: " + p_Supplier + " , " + p_BuiltyNo, p_UserId, "Purchase Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, 0, p_TOTAL_AMOUNT, "Purchase Return Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, 0, "Account(s) Payable Purchase Return Voucher", mTransaction, mConnection);

                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, p_DISCOUNT, 0, "Account(s) Payable Discount" + "Purchase Return Voucher", mTransaction, mConnection);
                            }

                            if (p_GST_AMOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Purchase Return Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                #endregion
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public long InsertPurchase(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT,string p_Supplier_Name, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                #region Vendor Ledger

                LedgerController LController = new LedgerController();
                // Configuration.GetAccountHead();

                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                #endregion

                #region GL Master, Detail

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long PurchaseAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo , DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {

                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher", mTransaction, mConnection);
                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                            }
                            if (p_GST_AMOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                else if (p_TYPE_ID == Constants.Document_Purchase_Return)
                {
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                    if (IsFinanceSetting)
                    {
                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Return Voucher", p_UserId, "Purchase Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, 0, p_TOTAL_AMOUNT, "Purchase Return Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, 0, "Account(s) Payable Purchase Return Voucher", mTransaction, mConnection);

                            if (p_DISCOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, p_DISCOUNT, 0, "Account(s) Payable Discount" + "Purchase Return Voucher", mTransaction, mConnection);
                            }

                            if (p_GST_AMOUNT > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Purchase Return Voucher", mTransaction, mConnection);
                            }
                        }
                    }
                }

                #endregion
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public long InsertPurchase(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name,int p_PaymentMode, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.PAYMENT_MODE = p_PaymentMode;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                
                #region GL Master, Detail

                LedgerController LController = new LedgerController();
                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    if (p_PaymentMode == 1)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else
                    {
                        //Cash Purchase
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");

                        //Cash Payment
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");

                        if (IsFinanceSetting)
                        {
                            //Purchase Voucher
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher");
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher");
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher");
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher");
                                }
                            }

                            string VoucherNo3 = LController.SelectMaxVoucherIdTest(Constants.CashPayment_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);
                            //Payment Voucher
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo3, Constants.CashPayment_Voucher, p_DOCUMENT_DATE, Constants.Cash_Relization, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Cash Payment Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "-1", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.CashPayment_Voucher, VoucherNo3, PayableAccount, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Cash Purchase Voucher");
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.CashPayment_Voucher, VoucherNo3, CashInHand, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Cash Purchase ");
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.CashPayment_Voucher, VoucherNo3, PurchaseDiscount, p_DISCOUNT, 0, "Account(s) Payable Discount Cash Purchase  Voucher");
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.CashPayment_Voucher, VoucherNo3, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Cash Purchase  Voucher");
                                }
                            }
                        }
                    }
                }
                #endregion

                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public long InsertPurchase(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId, decimal p_GST_AMOUNT,decimal p_GST_ADVANCE, decimal p_DISCOUNT,decimal p_FREIGHT_AMOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name, int p_PaymentMode, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.PAYMENT_MODE = p_PaymentMode;
                mPurchaseMaster.FREIGHT_AMOUNT = p_FREIGHT_AMOUNT;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = decimal.Parse(dr["FREE_SKU"].ToString());
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.DISCOUNT = decimal.Parse(dr["DISCOUNT"].ToString());
                    mPurchaseDetail.TAX = decimal.Parse(dr["TAX"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                #region GL Master, Detail

                LedgerController LController = new LedgerController();
                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Freight + "'");
                long Freight = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceForLocalPurchase + "'");
                long advance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceTax+ "'");
                long advanceTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    if (p_PaymentMode == 1)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Account(s) Payable Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT> 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_ADVANCE> 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "Advance GST on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else if (p_PaymentMode == 3)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), advance, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advance, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT, "Advance For Local Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_ADVANCE> 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "Advance GST on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else
                    {
                        //Cash Purchase
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");

                        //Cash Payment
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");

                        if (IsFinanceSetting)
                        {
                            //Cash Purchase Voucher
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Inventory at Store Purchase Voucher");                                
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE -p_DISCOUNT, "CashInHand Purchase Voucher");

                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "PurchaseDiscount Purchase Voucher");
                                }
                                if (p_FREIGHT_AMOUNT> 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Freight Purchase Voucher");
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "PurchaseTax Purchase Voucher");
                                }
                                if (p_GST_ADVANCE > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "Advance PurchaseTax Purchase Voucher");
                                }
                            }
                        }
                    }
                }
                #endregion

                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }
        public long InsertFranchisePurchase(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId, decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_FREIGHT_AMOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name, int p_PaymentMode,long p_FranchiseMasterID, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.PAYMENT_MODE = p_PaymentMode;
                mPurchaseMaster.FREIGHT_AMOUNT = p_FREIGHT_AMOUNT;
                mPurchaseMaster.FranchiseMasterID = p_FranchiseMasterID;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = decimal.Parse(dr["FREE_SKU"].ToString());
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mPurchaseDetail.EXPIRY_DATE = Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                #region GL Master, Detail

                LedgerController LController = new LedgerController();
                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Freight + "'");
                long Freight = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceForLocalPurchase + "'");
                long advance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    if (p_PaymentMode == 1)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "FranchisePurchase", Constants.Document_FranchisePurchase, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT, "Account(s) Payable Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else if (p_PaymentMode == 3)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), advance, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "FranchisePurchase", Constants.Document_FranchisePurchase, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advance, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT, "Advance For Local Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else
                    {
                        //Cash Purchase
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");

                        //Cash Payment
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), Constants.Document_FranchisePurchase, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");

                        if (IsFinanceSetting)
                        {
                            //Cash Purchase Voucher
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "FranchisePurchase", Constants.Document_FranchisePurchase, mPurchaseMaster.PURCHASE_MASTER_ID))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Inventory at Store Purchase Voucher");
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT + p_FREIGHT_AMOUNT - p_DISCOUNT, "Account(s) Payable Purchase Voucher");

                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT + p_FREIGHT_AMOUNT - p_DISCOUNT, 0, "Account(s) Payable Purchase Voucher");
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT + p_GST_AMOUNT - p_DISCOUNT, "CashInHand Purchase Voucher");

                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "PurchaseDiscount Purchase Voucher");
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Freight Purchase Voucher");
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "PurchaseTax Purchase Voucher");
                                }
                            }
                        }
                    }
                }
                #endregion

                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }
        public long InsertInvoiceBooking(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , decimal p_GST_AMOUNT,decimal p_GST_ADVANCE, decimal p_DISCOUNT, decimal p_NET_AMOUNT, string Remarks,
            string p_Supplier, DataTable dtConfig, bool IsFinanceIntegrate, GridView accountHeadGrid)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTERInvoiceBooking mPurchaseMaster = new spInsertPURCHASE_MASTERInvoiceBooking();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = Constants.Document_Purchase;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.REMARKS = Remarks;
                mPurchaseMaster.ACCOUNT_HEAD_ID = Constants.LongNullValue;
                if (p_TYPE_ID == 11)
                {
                    mPurchaseMaster.FranchiseMasterID = 1;
                }
                else
                {
                    mPurchaseMaster.FranchiseMasterID = 0;
                }
                mPurchaseMaster.ExecuteQuery();


                foreach (GridViewRow dr in accountHeadGrid.Rows)
                {
                    spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr.Cells[1].Text);
                    mPurchaseDetail.ACCOUNT_HEAD_ID = long.Parse(dr.Cells[2].Text);
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.EXPIRY_DATE = Constants.DateNullValue;
                    mPurchaseDetail.TIME_STAMP = Constants.DateNullValue;
                    mPurchaseDetail.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mPurchaseDetail.PRICE = mPurchaseDetail.AMOUNT;
                    mPurchaseDetail.QUANTITY = 1;
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.SKU_ID = 1;

                    mPurchaseDetail.ExecuteQuery();
                }

                if (IsFinanceIntegrate)
                {
                    LedgerController LController = new LedgerController();

                    DataRow[] drConfig = dtConfig.Select(string.Format("CODE = '{0}'", (int)Enums.COAMapping.AccountPayable));
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);
                    foreach (GridViewRow dr in accountHeadGrid.Rows)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, 
                            long.Parse(VoucherNo), long.Parse(dr.Cells[2].Text), p_DISTRIBUTOR_ID, 0,
                            decimal.Parse(dr.Cells[1].Text), 
                            mPurchaseMaster.DOCUMENT_DATE, "Booking Purchase Voucher", DateTime.Now,
                            p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, 
                            Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID,
                            p_UserId, mTransaction, mConnection, Constants.CreditSale,
                            "Booking Purchase");
                    }
                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Booking Purchase Voucher", DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Booking Purchase");

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);


                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Invoice Booking Voucher, Inv#: " + p_ORDER_NUMBER + ", Supplier: " + p_Supplier + ", " + Remarks, p_UserId, "Booking Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                    {
                        foreach (GridViewRow dr in accountHeadGrid.Rows)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher,
                            VoucherNo2, long.Parse(dr.Cells[2].Text), decimal.Parse(dr.Cells[1].Text), 0, "Booking Purchase Voucher",
                            mTransaction, mConnection);
                        }

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_NET_AMOUNT, "Account(s) Payable " + "Booking Purchase Voucher", mTransaction, mConnection);
                    }
                }
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public long InsertOrUpdateFranchiseInvoiceBooking(long franchise_royalty_id, int p_DISTRIBUTOR_ID,
            string p_ORDER_NUMBER, DateTime p_DOCUMENT_DATE, int p_SOLD_FROM, 
            decimal p_TOTAL_AMOUNT,int p_Posting, int p_UserId, int p_PrincipalId, 
            decimal p_GST_AMOUNT,decimal p_GST_ADVANCE, decimal p_DISCOUNT,decimal p_NET_AMOUNT, string Remarks,
            string p_Supplier, DataTable dtConfig,bool IsFinanceIntegrate, GridView accountHeadGrid)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTERInvoiceBooking mPurchaseMaster = new spInsertPURCHASE_MASTERInvoiceBooking();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.REMARKS = Remarks;
                mPurchaseMaster.ACCOUNT_HEAD_ID = Constants.LongNullValue;                
                mPurchaseMaster.FRANCHISE_ROYALTY_ID = franchise_royalty_id;
                var savedDt = mPurchaseMaster.ExecuteQueryForFranchiseRoyaltyBooking();
                long savedId = 0;
                if (savedDt != null && savedDt.Rows.Count > 0)
                {
                    savedId = long.Parse(savedDt.Rows[0]["FRANCHISE_ROYALTY_ID"].ToString());
                }

                if (franchise_royalty_id > 0)
                {
                    foreach (GridViewRow dr in accountHeadGrid.Rows)
                    {
                        spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                        mPurchaseDetail.Connection = mConnection;
                        mPurchaseDetail.Transaction = mTransaction;
                        mPurchaseDetail.PURCHASE_MASTER_ID = savedId;
                        mPurchaseDetail.ACCOUNT_HEAD_ID = long.Parse(dr.Cells[2].Text);
                        mPurchaseDetail.Contract_Type = "Franchise";

                        mPurchaseDetail.ExecuteQueryDelete();
                    }
                }

                foreach (GridViewRow dr in accountHeadGrid.Rows)
                {
                    spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.PURCHASE_MASTER_ID = savedId;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr.Cells[1].Text);
                    mPurchaseDetail.ACCOUNT_HEAD_ID = long.Parse(dr.Cells[2].Text);
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.EXPIRY_DATE = Constants.DateNullValue;
                    mPurchaseDetail.TIME_STAMP = Constants.DateNullValue;
                    mPurchaseDetail.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mPurchaseDetail.PRICE = mPurchaseDetail.AMOUNT;
                    mPurchaseDetail.QUANTITY = 1;
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.SKU_ID = 1;

                    mPurchaseDetail.ExecuteQueryForFranchiseRoyaltyDetails();
                }

                if (IsFinanceIntegrate)
                {
                    if (franchise_royalty_id > 0)
                    {
                        uspDeleteVoucher mDelete = new uspDeleteVoucher();

                        var mConnectionNew = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                        mConnectionNew.Open();
                        var mTransactionNew = ProviderFactory.GetTransaction(mConnectionNew);

                        mDelete.Connection = mConnectionNew;
                        mDelete.Transaction = mTransactionNew;
                        mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mDelete.INVOICE_ID = savedId;
                        mDelete.INVOICE_TYPE = 13;
                        mDelete.ExecuteQuery();
                        mTransactionNew.Commit();
                        mConnectionNew.Close();
                    }

                    #region GL Master, Detail

                    LedgerController LController = new LedgerController();

                    string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, 0, VoucherNo, Constants.Journal_Voucher, p_DOCUMENT_DATE,
                        Constants.Document_SaleInvoice, savedId.ToString(), "Booking Franchise Voucher", p_UserId, "BookingFranchise",
                        Constants.Document_SaleInvoice, savedId))
                    {
                        DataRow[] drConfig = null;
                        //Dr  Credit Sale Receivable
                        //Cr  Credit Sales

                        if (p_TOTAL_AMOUNT > 0)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                            if (drConfig.Length > 0)
                            {
                                foreach (GridViewRow dr in accountHeadGrid.Rows)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, 
                                        Constants.Journal_Voucher, VoucherNo, long.Parse(dr.Cells[2].Text),
                                    decimal.Parse(dr.Cells[1].Text), 0, "Cash In Hand Sale Voucher");
                                }
                            }
                        }
                        //drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                        //if (drConfig.Length > 0)
                        //{
                        //    if ((p_TOTAL_AMOUNT + p_GST_AMOUNT - p_DISCOUNT) - p_TOTAL_AMOUNT > 0)
                        //    {
                        //        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo,
                        //            Convert.ToInt64(drConfig[0]["VALUE"].ToString()),
                        //            (p_TOTAL_AMOUNT + p_GST_AMOUNT - p_DISCOUNT) - p_TOTAL_AMOUNT, 0, "Credit Sale Voucher");
                        //    }
                        //}
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                        if (drConfig.Length > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_TOTAL_AMOUNT - p_DISCOUNT, "Credit Sale Voucher");
                        }
                        if (p_DISCOUNT > 0)
                        {
                            //Cr  Discount on Credit Sale
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                            if (drConfig.Length > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_DISCOUNT, 0, "Discount Sale Voucher");
                            }
                        }
                        if (p_GST_AMOUNT > 0)
                        {
                            //Cr  Sales Tax
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                            if (drConfig.Length > 0)
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_GST_AMOUNT, "GST Sale Voucher");
                            }
                        }
                    }


                    #endregion
                                       
                }
                mTransaction.Commit();
                return savedId;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return 0;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }


        /// <summary>
        /// Updates Purchase, TranferOut, Purchase Return, TranferIn And Damage Document
        /// </summary>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <param name="p_DISTRIBUTOR_ID">Location</param>
        /// <param name="p_ORDER_NUMBER">DocumentNo</param>
        /// <param name="p_TYPE_ID">Type</param>
        /// <param name="p_DOCUMENT_DATE">Date</param>
        /// <param name="p_SOLD_TO">SoldTo</param>
        /// <param name="p_SOLD_FROM">SoldFrom</param>
        /// <param name="p_TOTAL_AMOUNT">Amount</param>
        /// <param name="p_IS_DELETE">IsDeleted</param>
        /// <param name="dtPurchaseDetail">PurchaseDetailDatatable</param>
        /// <param name="p_Posting">Posting</param>
        /// <param name="p_BuiltyNo">Builty</param>
        /// <param name="p_UserId">InsertedBy</param>
        /// <param name="p_Principal">Principal</param>
        /// <returns>True On Success And False On Failure</returns>
        public bool UpdatePurchaseDocument(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
            , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo
            , int p_UserId, int p_PrincipalId, DataTable dtConfig, bool IsFinanceSetting, long p_physicalStock_Taking_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PhysicalStock_Taking_ID = p_physicalStock_Taking_ID;
                mPurchaseMaster.ExecuteQuery();

                //Get Privouse Update Purchase Detail and Rollback
                //LedgerController LController = new LedgerController();

                //string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID);

                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {

                    //update stock;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());
                    mPurchaseDetail.REMARKS = dr["Remarks"].ToString();
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    #region GL Master, Detail

                    LedgerController LController = new LedgerController();

                    uspDeleteVoucher mDelete = new uspDeleteVoucher();

                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                    mDelete.INVOICE_TYPE = p_TYPE_ID;

                    mDelete.ExecuteQuery();


                    UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                    mMaxDNo2.Connection = mConnection;
                    mMaxDNo2.Transaction = mTransaction;

                    mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                    mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                    mMaxDNo2.Month = p_DOCUMENT_DATE;
                    DateTime mDate = p_DOCUMENT_DATE;
                    DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                    string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                    if (MaxVoucherId.Length == 1)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 2)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 3)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 4)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }

                    }
                    else
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                    }

                    string VoucherNo2 = MaxVoucherId;

                    DataRow[] drConfig = null;


                    if (p_TYPE_ID == Constants.Document_Opening)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                        long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Opening, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Opening Stock Voucher, Doc#: " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId, "OpeningStock", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Opening Stock Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT,"Opening Stock Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Damaged)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockDamage + "'");
                        long StockDamage = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Damaged, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Damage Stock Voucher, Doc#: " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_BuiltyNo, p_UserId, "Damage", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Damage Stock Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockDamage, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Damage Stock Voucher", mTransaction, mConnection);

                        }
                    }

                    else if (p_TYPE_ID == Constants.Document_Transfer_Out)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Short)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                        long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Short, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Short Voucher, Doc# :" + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId, "Short", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Short Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, p_TOTAL_AMOUNT, 0, "Account(s) Payable Short Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Acess)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                        long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Acess, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Excess Stock Voucher, Doc# :" + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + " , " + p_ORDER_NUMBER, p_UserId, "Excess", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, 0, p_TOTAL_AMOUNT, "Excess Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Account(s) Payable Excess Voucher", mTransaction, mConnection);

                        }
                    }
                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool UpdatePurchaseDocument2(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
          , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo
          , int p_UserId, int p_PrincipalId, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.ExecuteQuery();

                //Get Privouse Update Purchase Detail and Rollback
                //LedgerController LController = new LedgerController();

                //string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID);

                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {

                    //update stock;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.TAX = decimal.Parse(dr["TAX"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_QUANTITY"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    if (p_TYPE_ID != Constants.Document_Opening)
                    {
                        #region GL Master, Detail

                        LedgerController LController = new LedgerController();

                        uspDeleteVoucher mDelete = new uspDeleteVoucher();

                        mDelete.Connection = mConnection;
                        mDelete.Transaction = mTransaction;
                        mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                        mDelete.INVOICE_TYPE = p_TYPE_ID;

                        mDelete.ExecuteQuery();


                        UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                        mMaxDNo2.Connection = mConnection;
                        mMaxDNo2.Transaction = mTransaction;

                        mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                        mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                        mMaxDNo2.Month = p_DOCUMENT_DATE;
                        DateTime mDate = p_DOCUMENT_DATE;
                        DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                        string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                        if (MaxVoucherId.Length == 1)
                        {
                            if (mDate.Month.ToString().Length == 1)
                            {
                                MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                            }
                            else
                            {
                                MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                            }

                        }
                        else if (MaxVoucherId.Length == 2)
                        {
                            if (mDate.Month.ToString().Length == 1)
                            {
                                MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                            }
                            else
                            {
                                MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                            }

                        }
                        else if (MaxVoucherId.Length == 3)
                        {
                            if (mDate.Month.ToString().Length == 1)
                            {
                                MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                            }
                            else
                            {
                                MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                            }

                        }
                        else if (MaxVoucherId.Length == 4)
                        {
                            if (mDate.Month.ToString().Length == 1)
                            {
                                MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                            }
                            else
                            {
                                MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                            }

                        }
                        else
                        {
                            if (mDate.Month.ToString().Length == 1)
                            {
                                MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                            }
                            else
                            {
                                MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                            }
                        }
                        string VoucherNo2 = MaxVoucherId;

                        DataRow[] drConfig = null;



                        if (p_TYPE_ID == Constants.Document_Damaged)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockDamage + "'");
                            long StockDamage = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Damaged, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Damage Stock Voucher", p_UserId, "Damage", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {

                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Damage Stock Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockDamage, 0, p_TOTAL_AMOUNT, "Account(s) Payable " + "Damage Stock Voucher", mTransaction, mConnection);

                            }
                        }

                        else if (p_TYPE_ID == Constants.Document_Transfer_Out)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                            long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Transfer_Out, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Transfer Out Voucher", p_UserId, "Transfer Out", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Transfer Out Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, p_TOTAL_AMOUNT, 0, "Account(s) Payable Transfer Out Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Short)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Short, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Short Voucher", p_UserId, "Short", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, p_TOTAL_AMOUNT, "Short Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, p_TOTAL_AMOUNT, 0, "Account(s) Payable Short Voucher", mTransaction, mConnection);

                            }
                        }
                        else if (p_TYPE_ID == Constants.Document_Acess)
                        {
                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                            long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.ShortExcessstock + "'");
                            long ShortExcessstock = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Acess, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Excess Voucher", p_UserId, "Excess", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, ShortExcessstock, 0, p_TOTAL_AMOUNT, "Excess Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Account(s) Payable Excess Voucher", mTransaction, mConnection);

                            }
                        }
                        #endregion
                    }
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        //update purchase and purchase return
        public bool UpdatePurchase(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
            , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.ExecuteQuery();


                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;

                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {

                    //update stock;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_Principal;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    #region Vendor Ledger

                    LedgerController LController = new LedgerController();


                    UspSelectMaxDocumentNo mMaxLNo = new UspSelectMaxDocumentNo();
                    mMaxLNo.Connection = mConnection;
                    mMaxLNo.Transaction = mTransaction;
                    mMaxLNo.Document_TypeId = Constants.Journal_Voucher;
                    mMaxLNo.Distributor_id = mPurchaseMaster.DISTRIBUTOR_ID;
                    mMaxLNo.TypeId = 1;
                    DataTable MaxLedgerId = mMaxLNo.ExecuteTable();
                    string VoucherNo = MaxLedgerId.Rows[0][0].ToString();

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long PurchaseAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                    long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseTax+ "'");
                    long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    if (p_TYPE_ID == 2)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    }
                    else if (p_TYPE_ID == 3)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");

                    }
                    #endregion

                    #region GLMaster, Detail

                    uspDeleteVoucher mDelete = new uspDeleteVoucher();

                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                    mDelete.INVOICE_TYPE = p_TYPE_ID;

                    mDelete.ExecuteQuery();


                    UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                    mMaxDNo2.Connection = mConnection;
                    mMaxDNo2.Transaction = mTransaction;

                    mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                    mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                    mMaxDNo2.Month = p_DOCUMENT_DATE;
                    DateTime mDate = p_DOCUMENT_DATE;
                    DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                    string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                    if (MaxVoucherId.Length == 1)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 2)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 3)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 4)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }

                    }
                    else
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                    }
                    string VoucherNo2 = MaxVoucherId;


                    if (p_TYPE_ID == Constants.Document_Purchase)
                    {
                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, 0, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher", p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Vendors(s) Payable " + "Purchase Voucher", mTransaction, mConnection);

                        if (p_DISCOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Vendors(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                        }
                        if (p_GST_AMOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Purchase_Return)
                    {
                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, 0, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Return Voucher", p_UserId, "Purchase Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, 0, p_TOTAL_AMOUNT, "Purchase Return Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, 0, "Vendors(s) Payable " + "Purchase Return Voucher", mTransaction, mConnection);
                        if (p_DISCOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, p_DISCOUNT, 0, "Vendors(s) Payable Discount" + "Purchase Return Voucher", mTransaction, mConnection);
                        }

                        if (p_GST_AMOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Purchase Return Voucher", mTransaction, mConnection);
                        }
                    }

                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool UpdatePurchaseNew(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
            , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT,string p_Supplier, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.ExecuteQuery();


                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;

                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {

                    //update stock;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_Principal;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    #region Vendor Ledger

                    LedgerController LController = new LedgerController();


                    UspSelectMaxDocumentNo mMaxLNo = new UspSelectMaxDocumentNo();
                    mMaxLNo.Connection = mConnection;
                    mMaxLNo.Transaction = mTransaction;
                    mMaxLNo.Document_TypeId = Constants.Journal_Voucher;
                    mMaxLNo.Distributor_id = mPurchaseMaster.DISTRIBUTOR_ID;
                    mMaxLNo.TypeId = 1;
                    DataTable MaxLedgerId = mMaxLNo.ExecuteTable();
                    string VoucherNo = MaxLedgerId.Rows[0][0].ToString();

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long PurchaseAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                    long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseTax + "'");
                    long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    if (p_TYPE_ID == 2)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                    }
                    else if (p_TYPE_ID == 3)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PurchaseAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Return Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase Return");

                    }
                    #endregion

                    #region GLMaster, Detail

                    uspDeleteVoucher mDelete = new uspDeleteVoucher();

                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                    mDelete.INVOICE_TYPE = p_TYPE_ID;

                    mDelete.ExecuteQuery();


                    UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                    mMaxDNo2.Connection = mConnection;
                    mMaxDNo2.Transaction = mTransaction;

                    mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                    mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                    mMaxDNo2.Month = p_DOCUMENT_DATE;
                    DateTime mDate = p_DOCUMENT_DATE;
                    DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                    string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                    if (MaxVoucherId.Length == 1)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 2)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 3)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 4)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }

                    }
                    else
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                    }
                    string VoucherNo2 = MaxVoucherId;


                    if (p_TYPE_ID == Constants.Document_Purchase)
                    {
                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, 0, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher", p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Vendors(s) Payable " + "Purchase Voucher", mTransaction, mConnection);

                        if (p_DISCOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Vendors(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                        }
                        if (p_GST_AMOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Purchase_Return)
                    {
                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, 0, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Return Voucher, Manual Inv# " + p_ORDER_NUMBER + " Supplier: " + p_Supplier + " , " + p_BuiltyNo, p_UserId, "Purchase Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseAccount, 0, p_TOTAL_AMOUNT, "Purchase Return Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PayableAccount, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, 0, "Vendors(s) Payable " + "Purchase Return Voucher", mTransaction, mConnection);
                        if (p_DISCOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, p_DISCOUNT, 0, "Vendors(s) Payable Discount" + "Purchase Return Voucher", mTransaction, mConnection);
                        }

                        if (p_GST_AMOUNT > 0)
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Purchase Return Voucher", mTransaction, mConnection);
                        }
                    }

                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool UpdatePurchase(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
            , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
            , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name, int p_PaymentMode, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.ExecuteQuery();


                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;

                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {

                    //update stock;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_Principal;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {

                    #region GL Master, Detail
                    LedgerController LController = new LedgerController();
                    string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                    long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                    long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                    long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    if (p_TYPE_ID == Constants.Document_Purchase)
                    {
                        if (p_PaymentMode == 1)
                        {
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                            if (IsFinanceSetting)
                            {
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher", mTransaction, mConnection);
                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher", mTransaction, mConnection);
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher", mTransaction, mConnection);
                                    }
                                }
                            }
                        }
                        else
                        {
                            //Cash Purchase
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), CashInHand, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");

                            //Cash Payment
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), CashInHand, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");

                            if (IsFinanceSetting)
                            {
                                //Purchase Voucher
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher");
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Account(s) Payable " + "Purchase Voucher");
                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount" + "Purchase Voucher");
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher");
                                    }
                                }

                                string VoucherNo3 = LController.SelectMaxVoucherIdTest(Constants.CashPayment_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);
                                //Payment Voucher
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo3, Constants.CashPayment_Voucher, p_DOCUMENT_DATE, Constants.Cash_Relization, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Cash Payment Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "-1", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.CashPayment_Voucher, VoucherNo3, PayableAccount, p_TOTAL_AMOUNT, 0, "Account(s) Payable " + "Cash Purchase Voucher");
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.CashPayment_Voucher, VoucherNo3, CashInHand, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_GST_AMOUNT, "Cash Purchase ");
                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.CashPayment_Voucher, VoucherNo3, PurchaseDiscount, p_DISCOUNT, 0, "Account(s) Payable Discount Cash Purchase  Voucher");
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.CashPayment_Voucher, VoucherNo3, PurchaseTax, 0, p_GST_AMOUNT, "GST on " + "Cash Purchase  Voucher");
                                    }
                                }
                            }
                        }
                    }
                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public bool UpdatePurchase(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
            , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
            , decimal p_GST_AMOUNT, decimal p_GST_ADVANCE, decimal p_DISCOUNT,decimal p_FREIGHT_AMOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name, int p_PaymentMode, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT + p_FREIGHT_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.FREIGHT_AMOUNT = p_FREIGHT_AMOUNT;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.ExecuteQuery();

                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;

                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr["QUANTITY"].ToString());
                    mPurchaseDetail.FREE_SKU = decimal.Parse(dr["FREE_SKU"].ToString());
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.DISCOUNT = decimal.Parse(dr["DISCOUNT"].ToString());
                    mPurchaseDetail.TAX = decimal.Parse(dr["TAX"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mPurchaseDetail.EXPIRY_DATE = !string.IsNullOrEmpty(dr["Expiry_Date"].ToString()) ?
                        Convert.ToDateTime(dr["Expiry_Date"].ToString()) : Constants.DateNullValue;

                    mPurchaseDetail.ExecuteQuery();

                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.PRINCIPAL_ID = p_Principal;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["S_Quantity"].ToString());
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }
                if (IsFinanceSetting)
                {
                    #region GL Master, Detail
                    LedgerController LController = new LedgerController();
                    string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                    long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                    long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                    long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                    long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Freight + "'");
                    long Freight = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceForLocalPurchase + "'");
                    long advance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceTax + "'");
                    long advanceTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    if (p_TYPE_ID == Constants.Document_Purchase)
                    {
                        if (p_PaymentMode == 1)
                        {
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CreditSale, "Purchase");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CreditSale, "Purchase");
                            if (IsFinanceSetting)
                            {
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher");
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Account(s) Payable " + "Purchase Voucher");
                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount " + "Purchase Voucher");
                                    }
                                    if (p_FREIGHT_AMOUNT> 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight " + "Purchase Voucher");
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher");
                                    }
                                    if (p_GST_ADVANCE > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "Advance GST on Purchase Voucher");
                                    }
                                }
                            }
                        }
                        else if (p_PaymentMode == 3)
                        {
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), advance, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                            if (IsFinanceSetting)
                            {
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advance, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Advance For Local Purchase Voucher", mTransaction, mConnection);
                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                    }
                                    if (p_FREIGHT_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                    }
                                    if (p_GST_ADVANCE> 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_AMOUNT, 0, "Advance GST on Purchase Voucher", mTransaction, mConnection);
                                    }
                                }
                            }
                        }
                        else
                        {
                            //Cash Purchase
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashSales, "Purchase Cash");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashSales, "Purchase Cash");

                            //Cash Payment
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashPayment, "Cash Payment");
                            LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashPayment, "Cash Payment");

                            if (IsFinanceSetting)
                            {
                                //Cash Purchase Voucher
                                if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Inventory at Store Purchase Voucher");
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE + p_FREIGHT_AMOUNT - p_DISCOUNT, "CashInHand " + "Purchase Voucher");

                                    if (p_DISCOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount " + "Purchase Voucher");
                                    }
                                    if (p_FREIGHT_AMOUNT> 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight " + "Purchase Voucher");
                                    }
                                    if (p_GST_AMOUNT > 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on " + "Purchase Voucher");
                                    }

                                    if (p_GST_ADVANCE> 0)
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_AMOUNT, 0, "Advance GST on Purchase Voucher");
                                    }
                                }
                            }
                        }
                    }
                    #endregion
                }
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public bool UpdateInvoiceBooking(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
            , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
            , decimal p_GST_AMOUNT,decimal p_GST_ADVANCE, decimal p_DISCOUNT, decimal p_NET_AMOUNT, string Remarks,
            string p_Supplier, DataTable dtConfig, bool IsFinanceSetting, GridView accountHeadGrid)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = Constants.Document_Purchase;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.REMARKS = Remarks;
                mPurchaseMaster.ExecuteQuery();

                foreach (GridViewRow dr in accountHeadGrid.Rows)
                {
                    spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.ACCOUNT_HEAD_ID = long.Parse(dr.Cells[2].Text);
                    mPurchaseDetail.Contract_Type = "Supplier";

                    mPurchaseDetail.ExecuteQueryDelete();
                }

                foreach (GridViewRow dr in accountHeadGrid.Rows)
                {
                    spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr.Cells[1].Text);
                    mPurchaseDetail.ACCOUNT_HEAD_ID = long.Parse(dr.Cells[2].Text);
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.EXPIRY_DATE = Constants.DateNullValue;
                    mPurchaseDetail.TIME_STAMP = Constants.DateNullValue;
                    mPurchaseDetail.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mPurchaseDetail.PRICE = mPurchaseDetail.AMOUNT;
                    mPurchaseDetail.QUANTITY = 1;
                    mPurchaseDetail.FREE_SKU = 0;
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.SKU_ID = 1;

                    mPurchaseDetail.ExecuteQuery();
                }

                if (IsFinanceSetting)
                {
                    #region Vendor Ledger

                    LedgerController LController = new LedgerController();


                    UspSelectMaxDocumentNo mMaxLNo = new UspSelectMaxDocumentNo();
                    mMaxLNo.Connection = mConnection;
                    mMaxLNo.Transaction = mTransaction;
                    mMaxLNo.Document_TypeId = Constants.Journal_Voucher;
                    mMaxLNo.Distributor_id = mPurchaseMaster.DISTRIBUTOR_ID;
                    mMaxLNo.TypeId = 1;
                    DataTable MaxLedgerId = mMaxLNo.ExecuteTable();
                    string VoucherNo = MaxLedgerId.Rows[0][0].ToString();

                    DataRow[] drConfig = dtConfig.Select(string.Format("CODE = '{0}'", (int)Enums.COAMapping.AccountPayable));
                    long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                    foreach (GridViewRow dr in accountHeadGrid.Rows)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher,
                            long.Parse(VoucherNo), long.Parse(dr.Cells[2].Text), p_DISTRIBUTOR_ID, 0,
                            decimal.Parse(dr.Cells[1].Text),
                            mPurchaseMaster.DOCUMENT_DATE, "Booking Purchase Voucher", DateTime.Now,
                            p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID,
                            Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID),
                            p_TYPE_ID, p_UserId, mTransaction, mConnection,
                            Constants.CreditSale, "Booking Purchase");
                    }

                    LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Booking Purchase Voucher", DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Booking Purchase");


                    #endregion

                    #region GLMaster, Detail

                    uspDeleteVoucher mDelete = new uspDeleteVoucher();

                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                    mDelete.INVOICE_TYPE= p_TYPE_ID;

                    mDelete.ExecuteQuery();


                    UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                    mMaxDNo2.Connection = mConnection;
                    mMaxDNo2.Transaction = mTransaction;

                    mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                    mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                    mMaxDNo2.Month = p_DOCUMENT_DATE;
                    DateTime mDate = p_DOCUMENT_DATE;
                    DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                    string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                    if (MaxVoucherId.Length == 1)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 2)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 3)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 4)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }

                    }
                    else
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                    }

                    string VoucherNo2 = MaxVoucherId;

                    LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Invoice Booking Voucher, Inv#: " + p_ORDER_NUMBER + ", Supplier: " + p_Supplier + ", " + Remarks, p_UserId, "Booking Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                    foreach (GridViewRow dr in accountHeadGrid.Rows)
                    {
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, 
                            Constants.Journal_Voucher, VoucherNo2, long.Parse(dr.Cells[2].Text),
                            decimal.Parse(dr.Cells[1].Text), 0, "Booking Purchase Voucher", mTransaction, mConnection);
                    }

                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_NET_AMOUNT, "Account(s) Payable " + "Booking  Purchase Voucher", mTransaction, mConnection);


                    #endregion
                }

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }



        /// <summary>
        /// Posts Pending Purchase, TranferOut, Purchase Return, TranferIn And Damage Document
        /// </summary>
        /// <param name="p_PURCHASE_MASTER_ID">Purchase</param>
        /// <param name="p_Type_Id">Type</param>
        /// <param name="p_Distributor_Id">Location</param>
        /// <param name="p_Posting">Posting</param>
        /// <returns>True On Success And False On Failure</returns>
        public bool PostPendingDocument(long p_PURCHASE_MASTER_ID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspUpdateTransferOut mPurchaseMaster = new uspUpdateTransferOut();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.ExecuteQuery();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        /// <summary>
        /// Inserts Or Updates SKU Price From Excel File
        /// </summary>
        /// Returns True On Success And False On Failure
        /// <param name="p_DistributorId">Location</param>
        /// <param name="pFileName">ExcelFile</param>
        /// <param name="p_Principal_Id">Principal</param>
        /// <returns>True On Success And False On Failure</returns>
        public bool ImportOpeningStock(int p_DISTRIBUTOR_ID, string pFileName, int p_PRINCIPAL_ID, DateTime p_DOCUMENT_DATE, int p_USER_ID)
        {
            IDbConnection mConnection = null;
            FileStream Sourcefile = null;
            StreamReader ReadSourceFile = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = 7;//Opening Stock
                mPurchaseMaster.ORDER_NUMBER = "";
                mPurchaseMaster.SOLD_FROM = p_PRINCIPAL_ID;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TOTAL_AMOUNT = 0;
                mPurchaseMaster.USER_ID = p_USER_ID;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = 0;
                mPurchaseMaster.BUILTY_NO = "";
                mPurchaseMaster.PRINCIPAL_ID = p_PRINCIPAL_ID;
                mPurchaseMaster.ExecuteQuery();


                Sourcefile = new FileStream(pFileName, FileMode.Open);
                ReadSourceFile = new StreamReader(Sourcefile);
                string FileContents = "";
                while ((FileContents = ReadSourceFile.ReadLine()) != null)
                {

                    string[] ParametersArr = FileContents.Split(Constants.File_Delimiter);
                    spSelectSKUS mSKUS = new spSelectSKUS();
                    mSKUS.Connection = mConnection;
                    mSKUS.Transaction = mTransaction;
                    mSKUS.SKU_CODE = ParametersArr[0].ToString();
                    mSKUS.ISACTIVE = true;
                    DataTable dt = mSKUS.ExecuteTable();
                    if (dt.Rows.Count > 0)
                    {
                        spInsertPURCHASE_DETAIL mStockDetail = new spInsertPURCHASE_DETAIL();
                        mStockDetail.Connection = mConnection;
                        mStockDetail.Transaction = mTransaction;
                        mStockDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                        mStockDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mStockDetail.SKU_ID = int.Parse(dt.Rows[0]["SKU_ID"].ToString());
                        mStockDetail.BATCH_NO = "";
                        mStockDetail.PRICE = decimal.Parse(ParametersArr[2].ToString());
                        mStockDetail.QUANTITY = int.Parse(ParametersArr[1].ToString());
                        mStockDetail.FREE_SKU = 0;
                        mStockDetail.AMOUNT = decimal.Parse(ParametersArr[3].ToString());
                        mStockDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockDetail.TIME_STAMP = p_DOCUMENT_DATE;
                        mStockDetail.ExecuteQuery();

                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                        mStockUpdate.Connection = mConnection;
                        mStockUpdate.Transaction = mTransaction;
                        mStockUpdate.PRINCIPAL_ID = p_PRINCIPAL_ID;
                        mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                        mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                        mStockUpdate.SKU_ID = mStockDetail.SKU_ID;
                        mStockUpdate.STOCK_QTY = mStockDetail.QUANTITY;
                        mStockUpdate.FREE_QTY = mStockDetail.FREE_SKU;
                        mStockUpdate.BATCHNO = mStockDetail.BATCH_NO;
                        // mStockUpdate.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                        mStockUpdate.ExecuteQuery();
                    }

                }
                mTransaction.Commit();
                return true;
            }

            catch (Exception)
            {
                mTransaction.Rollback();
                ReadSourceFile.Close();
                mConnection.Close();
                return false;
            }
            finally
            {
                ReadSourceFile.Close();
                mConnection.Close();
            }
        }

        public bool ImportPurchaseStock(int p_DISTRIBUTOR_ID, string pFileName, int p_PRINCIPAL_ID, DateTime p_DOCUMENT_DATE, int p_USER_ID)
        {
            IDbConnection mConnection = null;
            FileStream Sourcefile = null;
            StreamReader ReadSourceFile = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = 2;//Purchase Stock
                mPurchaseMaster.ORDER_NUMBER = "";
                mPurchaseMaster.SOLD_FROM = p_PRINCIPAL_ID;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TOTAL_AMOUNT = 0;
                mPurchaseMaster.USER_ID = p_USER_ID;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = 0;
                mPurchaseMaster.BUILTY_NO = "";
                mPurchaseMaster.PRINCIPAL_ID = p_PRINCIPAL_ID;
                mPurchaseMaster.ExecuteQuery();


                Sourcefile = new FileStream(pFileName, FileMode.Open);
                ReadSourceFile = new StreamReader(Sourcefile);
                string FileContents = "";
                while ((FileContents = ReadSourceFile.ReadLine()) != null)
                {

                    string[] ParametersArr = FileContents.Split(Constants.File_Delimiter);
                    spSelectSKUS mSKUS = new spSelectSKUS();
                    mSKUS.Connection = mConnection;
                    mSKUS.Transaction = mTransaction;
                    mSKUS.SKU_CODE = ParametersArr[0].ToString();
                    mSKUS.ISACTIVE = true;
                    DataTable dt = mSKUS.ExecuteTable();
                    if (dt.Rows.Count > 0)
                    {
                        spInsertPURCHASE_DETAIL mStockDetail = new spInsertPURCHASE_DETAIL();
                        mStockDetail.Connection = mConnection;
                        mStockDetail.Transaction = mTransaction;
                        mStockDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                        mStockDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mStockDetail.SKU_ID = int.Parse(dt.Rows[0]["SKU_ID"].ToString());
                        mStockDetail.BATCH_NO = "";
                        mStockDetail.PRICE = decimal.Parse(ParametersArr[2].ToString());
                        mStockDetail.QUANTITY = int.Parse(ParametersArr[1].ToString());
                        mStockDetail.FREE_SKU = 0;
                        mStockDetail.AMOUNT = decimal.Parse(ParametersArr[3].ToString());
                        mStockDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockDetail.TIME_STAMP = p_DOCUMENT_DATE;
                        mStockDetail.ExecuteQuery();

                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                        mStockUpdate.Connection = mConnection;
                        mStockUpdate.Transaction = mTransaction;
                        mStockUpdate.PRINCIPAL_ID = p_PRINCIPAL_ID;
                        mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                        mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                        mStockUpdate.SKU_ID = mStockDetail.SKU_ID;
                        mStockUpdate.STOCK_QTY = mStockDetail.QUANTITY;
                        mStockUpdate.FREE_QTY = mStockDetail.FREE_SKU;
                        mStockUpdate.BATCHNO = mStockDetail.BATCH_NO;
                        mStockUpdate.ExecuteQuery();
                    }

                }
                mTransaction.Commit();
                return true;
            }

            catch (Exception)
            {
                mTransaction.Rollback();
                ReadSourceFile.Close();
                mConnection.Close();
                return false;
            }
            finally
            {
                ReadSourceFile.Close();
                mConnection.Close();
            }
        }

        #endregion

        #region Issuance

        public long InsertIssuance(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM
            , decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_PrincipalId
            , DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                decimal amount = 0;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = 0;
                    mPurchaseDetail.FREE_SKU = decimal.Parse(dr["FREE_SKU"].ToString());
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.ExecuteQuery();
                    amount+= decimal.Parse(dr["AMOUNT"].ToString());
                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = decimal.Parse(dr["PS_QUANTITY"].ToString());
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                if (IsFinanceSetting)
                {
                    #region GL Master, Detail

                    LedgerController LController = new LedgerController();

                    string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                    DataRow[] drConfig = null;



                    if (p_TYPE_ID == 19)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, 19, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Stock Issuance Voucher, Doc# " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + ", " + p_BuiltyNo, p_UserId, "Issuance", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, amount, "Issuance Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, amount, 0, "Account(s) Payable Issuance Voucher", mTransaction, mConnection);

                        }
                    }
                    else if (p_TYPE_ID == Constants.Document_Issue_Return)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Issue_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Stock Return Voucher, Doc# " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + ", " + p_BuiltyNo, p_UserId, "Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                        {
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, amount, 0, "Stock Return Voucher", mTransaction, mConnection);
                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, StockInTransit, 0, amount, "Account(s) Payable Return Voucher", mTransaction, mConnection);

                        }
                    }


                    #endregion
                }
                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return 0;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public bool UpdateIssuance(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE
            , int p_SOLD_TO, int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo
            , int p_UserId, int p_Principal, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                decimal amount = 0;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.ExecuteQuery();

                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID, mConnection, mTransaction);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                spInsertPURCHASE_DETAIL2 mPurchaseDetail = new spInsertPURCHASE_DETAIL2();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                    mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());

                    mPurchaseDetail.BATCH_NO = "N/A";
                    mPurchaseDetail.PRICE = decimal.Parse(dr["PRICE"].ToString());
                    mPurchaseDetail.QUANTITY = 0;
                    mPurchaseDetail.FREE_SKU = decimal.Parse(dr["FREE_SKU"].ToString());
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr["AMOUNT"].ToString());
                    mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                    mPurchaseDetail.UOM_ID = int.Parse(dr["UOM_ID"].ToString());
                    mPurchaseDetail.ExecuteQuery();
                    amount+= decimal.Parse(dr["AMOUNT"].ToString());
                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = p_Principal;
                    mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                    mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                    mStockUpdate.STOCK_DATE = p_DOCUMENT_DATE;
                    mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                    mStockUpdate.STOCK_QTY = mPurchaseDetail.QUANTITY;
                    mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                    mStockUpdate.FREE_QTY = decimal.Parse(dr["PS_QUANTITY"].ToString());
                    mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                    mStockUpdate.UOM_ID = int.Parse(dr["S_UOM_ID"].ToString());
                    mStockUpdate.ExecuteQuery();
                }

                if (IsFinanceSetting)
                {
                    #region GLMaster, Detail

                    uspDeleteVoucher mDelete = new uspDeleteVoucher();

                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mDelete.INVOICE_ID = p_PURCHASE_MASTER_ID;
                    mDelete.INVOICE_TYPE = p_TYPE_ID;

                    mDelete.ExecuteQuery();


                    UspSelectMaxVoucherNo mMaxDNo2 = new UspSelectMaxVoucherNo();
                    mMaxDNo2.Connection = mConnection;
                    mMaxDNo2.Transaction = mTransaction;

                    mMaxDNo2.Document_TypeId = Constants.Journal_Voucher;
                    mMaxDNo2.Distributor_id = p_DISTRIBUTOR_ID;
                    mMaxDNo2.Month = p_DOCUMENT_DATE;
                    DateTime mDate = p_DOCUMENT_DATE;
                    DataTable MaxId2 = mMaxDNo2.ExecuteTable();
                    string MaxVoucherId = MaxId2.Rows[0][0].ToString();

                    if (MaxVoucherId.Length == 1)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 2)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-000" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 3)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-00" + MaxVoucherId;
                        }

                    }
                    else if (MaxVoucherId.Length == 4)
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-0" + MaxVoucherId;
                        }

                    }
                    else
                    {
                        if (mDate.Month.ToString().Length == 1)
                        {
                            MaxVoucherId = "0" + mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                        else
                        {
                            MaxVoucherId = mDate.Month.ToString() + mDate.Year.ToString().Substring(2, 2) + "-" + MaxVoucherId;
                        }
                    }
                    string VoucherNo2 = MaxVoucherId;




                    DataRow[] drConfig = null;


                    LedgerController LController = new LedgerController();

                    if (p_TYPE_ID == 19)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, 19, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Stock Issuance Voucher, Doc# " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + ", " + p_BuiltyNo, p_UserId, "Issuance", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, 0, amount, "Issuance Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, StockInTransit, amount, 0, "Account(s) Payable Issuance Voucher", mTransaction, mConnection);
                    }
                    else if (p_TYPE_ID == Constants.Document_Issue_Return)
                    {
                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.StockInTransit + "'");
                        long StockInTransit = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Issue_Return, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Stock Return Voucher, Doc# " + mPurchaseMaster.PURCHASE_MASTER_ID.ToString() + ", " + p_BuiltyNo, p_UserId, "Return", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection);

                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, amount, 0, "Return Voucher", mTransaction, mConnection);
                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, StockInTransit, 0, amount, "Account(s) Payable Return Voucher", mTransaction, mConnection);
                    }


                    #endregion
                }
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        #endregion

        #region Purchase Order Day Wise
        public DataSet GetDayWisePurchaseItems(int p_DISTRIBUTOR_ID, DateTime p_FromDate, DateTime p_ToDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spDayWisePurchaseReport objPrint = new spDayWisePurchaseReport();
                Reports.DsReport ds = new Reports.DsReport();
                objPrint.Connection = mConnection;
                objPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                objPrint.FROM_DATE = p_FromDate;
                objPrint.TO_DATE = p_ToDate;
                DataTable dt = objPrint.ExecuteTable();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["spDayWisePurchaseReport"].ImportRow(dr);
                }

                return ds;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        #endregion

        #region Purchase Order
        public long InsertPurchaseOrder(int p_principal_Id, int p_location_Id, int p_payment_mode, DateTime? p_delivery_Date,
            DateTime? p_expiry_date, decimal p_freight_charges, string p_remarks, decimal p_gross_Amount,
            decimal p_total_GST, decimal p_discount_Amount, decimal p_net_Amount, int p_user_Id, DateTime p_document_Date,
            GridView purchaseGrid)
        {
            try
            {
                IDbConnection mConnection = null;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spInsertPurchaseOrderMaster mPurchaseMaster = new spInsertPurchaseOrderMaster();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Distributor_ID = p_location_Id;
                mPurchaseMaster.PRINCIPAL_ID = p_principal_Id;
                mPurchaseMaster.Payment_Mode = p_payment_mode;
                mPurchaseMaster.Delivery_Date = p_delivery_Date;
                mPurchaseMaster.Expiry_Date = p_expiry_date;
                mPurchaseMaster.Freight_Charges = p_freight_charges;
                mPurchaseMaster.Remarks = p_remarks;
                mPurchaseMaster.Gross_Amount = p_gross_Amount;
                mPurchaseMaster.GST_Amount = p_total_GST;
                mPurchaseMaster.Discount_Amount = p_discount_Amount;
                mPurchaseMaster.Net_Amount = p_net_Amount;
                mPurchaseMaster.DOCUMENT_DATE = p_document_Date;
                mPurchaseMaster.USER_ID = p_user_Id;
                mPurchaseMaster.ExecuteQuery();

                foreach (GridViewRow dr in purchaseGrid.Rows)
                {
                    spInsertPurchaseOrderDetail mPurchaseDetail = new spInsertPurchaseOrderDetail();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.Purchase_Order_Master_ID = mPurchaseMaster.ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr.Cells[0].Text);
                    mPurchaseDetail.PRICE = decimal.Parse(dr.Cells[5].Text);
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr.Cells[4].Text);
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr.Cells[8].Text);
                    mPurchaseDetail.UOM_ID = int.Parse(dr.Cells[9].Text);
                    mPurchaseDetail.Tax_Percentage = decimal.Parse(dr.Cells[7].Text);
                    mPurchaseDetail.Discount_Percentage = decimal.Parse(dr.Cells[6].Text);

                    mPurchaseDetail.ExecuteQuery();
                }

                return mPurchaseMaster.ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                throw;
            }
        }


        public long UpdatePurchaseOrder(int p_principal_Id, int p_location_Id, int p_payment_mode, DateTime? p_delivery_Date,
            DateTime? p_expiry_date, decimal p_freight_charges, string p_remarks, decimal p_gross_Amount,
            decimal p_total_GST, decimal p_discount_Amount, decimal p_net_Amount, int p_user_Id, DateTime p_document_Date,
            long p_purchase_Order_Master_ID, GridView purchaseGrid)
        {
            try
            {
                IDbConnection mConnection = null;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdatePurchaseOrderMaster mPurchaseMaster = new spUpdatePurchaseOrderMaster();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Distributor_ID = p_location_Id;
                mPurchaseMaster.PRINCIPAL_ID = p_principal_Id;
                mPurchaseMaster.Payment_Mode = p_payment_mode;
                mPurchaseMaster.Delivery_Date = p_delivery_Date;
                mPurchaseMaster.Expiry_Date = p_expiry_date;
                mPurchaseMaster.Freight_Charges = p_freight_charges;
                mPurchaseMaster.Remarks = p_remarks;
                mPurchaseMaster.Gross_Amount = p_gross_Amount;
                mPurchaseMaster.GST_Amount = p_total_GST;
                mPurchaseMaster.Discount_Amount = p_discount_Amount;
                mPurchaseMaster.Net_Amount = p_net_Amount;
                mPurchaseMaster.DOCUMENT_DATE = p_document_Date;
                mPurchaseMaster.USER_ID = p_user_Id;
                mPurchaseMaster.ID = p_purchase_Order_Master_ID;
                mPurchaseMaster.ExecuteQuery();

                foreach (GridViewRow dr in purchaseGrid.Rows)
                {
                    spInsertPurchaseOrderDetail mPurchaseDetail = new spInsertPurchaseOrderDetail();
                    mPurchaseDetail.Connection = mConnection;
                    mPurchaseDetail.Transaction = mTransaction;
                    mPurchaseDetail.Purchase_Order_Master_ID = p_purchase_Order_Master_ID;
                    mPurchaseDetail.SKU_ID = int.Parse(dr.Cells[0].Text);
                    mPurchaseDetail.PRICE = decimal.Parse(dr.Cells[5].Text);
                    mPurchaseDetail.QUANTITY = decimal.Parse(dr.Cells[4].Text);
                    mPurchaseDetail.AMOUNT = decimal.Parse(dr.Cells[8].Text);
                    mPurchaseDetail.UOM_ID = int.Parse(dr.Cells[9].Text);
                    mPurchaseDetail.Tax_Percentage = decimal.Parse(dr.Cells[7].Text);
                    mPurchaseDetail.Discount_Percentage = decimal.Parse(dr.Cells[6].Text);

                    mPurchaseDetail.ExecuteQuery();
                }

                return p_purchase_Order_Master_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                throw;
            }
        }
        public bool ForceClosePurchaseOrder(long p_purchase_Order_Master_ID)
        {
            try
            {
                IDbConnection mConnection = null;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spForceClosePurchaseOrder mPurchaseMaster = new spForceClosePurchaseOrder();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.ID = p_purchase_Order_Master_ID;
                mPurchaseMaster.ExecuteQuery();
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
            return true;
        }

        public bool UpdateGRNCompleted(long p_purchase_Order_Master_ID)
        {
            try
            {
                IDbConnection mConnection = null;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspUpdateGRNCompleted mPurchaseMaster = new uspUpdateGRNCompleted();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.ID = p_purchase_Order_Master_ID;
                mPurchaseMaster.ExecuteQuery();
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
            return true;
        }

        public long InsertGRNForPurchaseOrder(int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER,
            int p_TYPE_ID,DateTime p_DOCUMENT_DATE, int p_SOLD_TO, int p_SOLD_FROM,
            decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail,
            int p_Posting,string p_BuiltyNo, int p_UserId, int p_PrincipalId,
            decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT,
            string p_Supplier_Name,int p_PaymentMode, long p_purchase_order_Master_Id,
            decimal p_FREIGHT_AMOUNT,string p_REMARKS,decimal p_GST_ADVANCE, DataTable dtConfig, bool IsFinanceSetting)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                spInsertPURCHASE_MASTER mPurchaseMaster = new spInsertPURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.Transaction = mTransaction;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.TIME_STAMP = DateTime.Now;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.PRINCIPAL_ID = p_PrincipalId;
                mPurchaseMaster.PAYMENT_MODE = p_PaymentMode;
                mPurchaseMaster.Purchase_Order_Master_ID = p_purchase_order_Master_Id;
                mPurchaseMaster.FREIGHT_AMOUNT = p_FREIGHT_AMOUNT;
                mPurchaseMaster.REMARKS = p_REMARKS;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.ExecuteQuery();

                spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                mPurchaseDetail.Connection = mConnection;
                mPurchaseDetail.Transaction = mTransaction;

                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (decimal.Parse(dr[7].ToString()) > 0)
                    {
                        mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                        mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                        mPurchaseDetail.SKU_ID = int.Parse(dr[0].ToString());
                        mPurchaseDetail.BATCH_NO = "N/A";
                        mPurchaseDetail.PRICE = decimal.Parse(dr[8].ToString());
                        mPurchaseDetail.QUANTITY = decimal.Parse(dr[7].ToString());
                        mPurchaseDetail.FREE_SKU = 0;
                        mPurchaseDetail.AMOUNT = decimal.Parse(dr[11].ToString());
                        mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mPurchaseDetail.UOM_ID = int.Parse(dr[12].ToString());
                        mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                        mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr[7].ToString());
                        mPurchaseDetail.DISCOUNT = decimal.Parse(dr[9].ToString());
                        mPurchaseDetail.TAX = decimal.Parse(dr[10].ToString());
                        mPurchaseDetail.EXPIRY_DATE = Convert.ToDateTime(dr[14].ToString());
                        mPurchaseDetail.ExecuteQuery();

                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                        mStockUpdate.Connection = mConnection;
                        mStockUpdate.Transaction = mTransaction;
                        mStockUpdate.PRINCIPAL_ID = p_PrincipalId;
                        mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                        mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                        mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                        mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                        mStockUpdate.STOCK_QTY = decimal.Parse(dr[7].ToString());
                        mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                        mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                        mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                        mStockUpdate.UOM_ID = int.Parse(dr[12].ToString());
                        mStockUpdate.ExecuteQuery();
                    }
                }

                #region GL Master, Detail

                LedgerController LController = new LedgerController();
                string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);

                string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                DataRow[] drConfig = null;

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Freight + "'");
                long Freight = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceForLocalPurchase + "'");
                long advance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceTax + "'");
                long TaxAdvance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                if (p_TYPE_ID == Constants.Document_Purchase)
                {
                    if (p_PaymentMode == 1)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CreditSale, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_AMOUNT, "Account(s) Payable Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                                if(p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, TaxAdvance, p_GST_ADVANCE, 0, "GST Advance on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else if (p_PaymentMode == 3)
                    {
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), advance, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                        if (IsFinanceSetting)
                        {
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, advance, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Advance For Local Purchase Voucher", mTransaction, mConnection);
                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                }
                                if(p_GST_ADVANCE > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, TaxAdvance, p_GST_ADVANCE, 0, "GST Advance on Purchase Voucher", mTransaction, mConnection);
                                }
                            }
                        }
                    }
                    else
                    {
                        //Cash Purchase
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashSales, "Purchase Cash");

                        //Cash Payment
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");
                        LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_PrincipalId, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.CashPayment, "Cash Payment");

                        if (IsFinanceSetting)
                        {
                            //Cash Purchase Voucher
                            if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_PrincipalId, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                            {
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Inventory at Store Purchase Voucher");
                                LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT + p_GST_AMOUNT+p_GST_ADVANCE - p_DISCOUNT, "CashInHand Purchase Voucher");

                                if (p_DISCOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "PurchaseDiscount Purchase Voucher");
                                }
                                if (p_FREIGHT_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Freight Purchase Voucher");
                                }
                                if (p_GST_AMOUNT > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "PurchaseTax Purchase Voucher");
                                }
                                if (p_GST_ADVANCE > 0)
                                {
                                    LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_PrincipalId, Constants.Journal_Voucher, VoucherNo2, TaxAdvance, p_GST_ADVANCE, 0, "GST Advance Purchase Voucher");
                                }
                            }
                        }
                    }
                }
                #endregion

                mTransaction.Commit();
                return mPurchaseMaster.PURCHASE_MASTER_ID;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                return Constants.LongNullValue;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public bool UpdateGRN(long p_PURCHASE_MASTER_ID, int p_DISTRIBUTOR_ID, string p_ORDER_NUMBER, int p_TYPE_ID, DateTime p_DOCUMENT_DATE, int p_SOLD_TO
           , int p_SOLD_FROM, decimal p_TOTAL_AMOUNT, bool p_IS_DELETE, DataTable dtPurchaseDetail, int p_Posting, string p_BuiltyNo, int p_UserId, int p_Principal
           , decimal p_GST_AMOUNT, decimal p_DISCOUNT, decimal p_NET_AMOUNT, string p_Supplier_Name,
            int p_PaymentMode, long p_purchase_order_Master_Id,decimal p_FREIGHT_AMOUNT,string p_REMARKS,decimal p_GST_ADVANCE, DataTable dtConfig, bool IsFinanceSetting)
        {
            int DetailCount = 0;
            try
            {
                foreach (DataRow dr in dtPurchaseDetail.Rows)
                {
                    if (decimal.Parse(dr[7].ToString()) > 0)
                    {
                        DetailCount++;
                        break;
                    }
                }
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdatePURCHASE_MASTER mPurchaseMaster = new spUpdatePURCHASE_MASTER();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mPurchaseMaster.TYPE_ID = p_TYPE_ID;
                mPurchaseMaster.ORDER_NUMBER = p_ORDER_NUMBER;
                mPurchaseMaster.SOLD_FROM = p_SOLD_FROM;
                mPurchaseMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mPurchaseMaster.SOLD_TO = p_SOLD_TO;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.TOTAL_AMOUNT = p_TOTAL_AMOUNT;
                mPurchaseMaster.GST_AMOUNT = p_GST_AMOUNT;
                mPurchaseMaster.DISCOUNT = p_DISCOUNT;
                mPurchaseMaster.NET_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.DEBIT_AMOUNT = p_NET_AMOUNT;
                mPurchaseMaster.USER_ID = p_UserId;
                mPurchaseMaster.LAST_UPDATE = DateTime.Now;
                mPurchaseMaster.POSTING = p_Posting;
                mPurchaseMaster.BUILTY_NO = p_BuiltyNo;
                mPurchaseMaster.FREIGHT_AMOUNT = p_FREIGHT_AMOUNT;
                mPurchaseMaster.REMARKS = p_REMARKS;
                mPurchaseMaster.GST_ADVANCE = p_GST_ADVANCE;
                mPurchaseMaster.ExecuteQuery();


                DataTable dt = SelectPrivousePurchaseDetail(p_DISTRIBUTOR_ID, p_PURCHASE_MASTER_ID);

                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.TYPEID = p_TYPE_ID;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                    mPurchaseStock.PURCHASE_DETAIL_ID = long.Parse(dr["PURCHASE_DETAIL_ID"].ToString());
                    mPurchaseStock.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;

                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }
                if (DetailCount > 0)
                {
                    spInsertPURCHASE_DETAIL mPurchaseDetail = new spInsertPURCHASE_DETAIL();
                    mPurchaseDetail.Connection = mConnection;

                    foreach (DataRow dr in dtPurchaseDetail.Rows)
                    {

                        //update stock;
                        if (decimal.Parse(dr[7].ToString()) > 0)
                        {
                            DetailCount++;
                            mPurchaseDetail.PURCHASE_MASTER_ID = mPurchaseMaster.PURCHASE_MASTER_ID;
                            mPurchaseDetail.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                            mPurchaseDetail.SKU_ID = int.Parse(dr[0].ToString());
                            mPurchaseDetail.BATCH_NO = "N/A";
                            mPurchaseDetail.PRICE = decimal.Parse(dr[8].ToString());
                            mPurchaseDetail.QUANTITY = decimal.Parse(dr[7].ToString());
                            mPurchaseDetail.FREE_SKU = 0;
                            mPurchaseDetail.AMOUNT = decimal.Parse(dr[11].ToString());
                            mPurchaseDetail.TYPE_ID = mPurchaseMaster.TYPE_ID;
                            mPurchaseDetail.UOM_ID = int.Parse(dr[12].ToString());
                            mPurchaseDetail.TIME_STAMP = p_DOCUMENT_DATE;
                            mPurchaseDetail.STOCK_UNIT_QTY = decimal.Parse(dr[7].ToString());
                            mPurchaseDetail.EXPIRY_DATE = Convert.ToDateTime(dr[14].ToString());

                            mPurchaseDetail.ExecuteQuery();

                            UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                            mStockUpdate.Connection = mConnection;
                            mStockUpdate.PRINCIPAL_ID = p_Principal;
                            mStockUpdate.TYPE_ID = mPurchaseMaster.TYPE_ID;
                            mStockUpdate.DISTRIBUTOR_ID = mPurchaseMaster.DISTRIBUTOR_ID;
                            mStockUpdate.STOCK_DATE = mPurchaseMaster.DOCUMENT_DATE;
                            mStockUpdate.SKU_ID = mPurchaseDetail.SKU_ID;
                            mStockUpdate.STOCK_QTY = decimal.Parse(dr[7].ToString());
                            mStockUpdate.PRICE = mPurchaseDetail.PRICE;
                            mStockUpdate.FREE_QTY = mPurchaseDetail.FREE_SKU;
                            mStockUpdate.BATCHNO = mPurchaseDetail.BATCH_NO;
                            mStockUpdate.UOM_ID = int.Parse(dr[12].ToString());
                            mStockUpdate.ExecuteQuery();
                        }
                    }
                    if (IsFinanceSetting)
                    {
                        #region GL Master, Detail
                        LedgerController LController = new LedgerController();
                        string VoucherNo = LController.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, 1);
                        string VoucherNo2 = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DISTRIBUTOR_ID, p_DOCUMENT_DATE);

                        DataRow[] drConfig = null;

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        long Inventoryatstore = Convert.ToInt64(drConfig[0]["VALUE"].ToString());


                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AccountPayable + "'");
                        long PayableAccount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                        long CashInHand = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.PurchaseDiscount + "'");
                        long PurchaseDiscount = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                        long PurchaseTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.Freight + "'");
                        long Freight = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceForLocalPurchase + "'");
                        long advance = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        drConfig = dtConfig.Select("CODE = '" + (int)Enums.COAMapping.AdvanceTax+ "'");
                        long advanceTax = Convert.ToInt64(drConfig[0]["VALUE"].ToString());

                        if (p_TYPE_ID == Constants.Document_Purchase)
                        {
                            if (p_PaymentMode == 1)
                            {
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CreditSale, "Purchase");
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CreditSale, "Purchase");
                                if (IsFinanceSetting)
                                {
                                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher");
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PayableAccount, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Account(s) Payable Purchase Voucher");
                                        if (p_DISCOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher");
                                        }
                                        if (p_FREIGHT_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher");
                                        }
                                        if (p_GST_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher");
                                        }
                                        if (p_GST_ADVANCE> 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "GST Advance on Purchase Voucher");
                                        }
                                    }
                                }
                            }
                            else if (p_PaymentMode == 3)
                            {
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), advance, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, mTransaction, mConnection, Constants.AdvancePurchase, "Purchase");
                                if (IsFinanceSetting)
                                {
                                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID, mTransaction, mConnection))
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Purchase Voucher", mTransaction, mConnection);
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advance, 0, p_TOTAL_AMOUNT - p_DISCOUNT + p_FREIGHT_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE, "Advance For Local Purchase Voucher", mTransaction, mConnection);
                                        if (p_DISCOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "Account(s) Payable Discount Purchase Voucher", mTransaction, mConnection);
                                        }
                                        if (p_FREIGHT_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Account(s) Payable Freight Purchase Voucher", mTransaction, mConnection);
                                        }
                                        if (p_GST_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "GST on Purchase Voucher", mTransaction, mConnection);
                                        }
                                        if (p_GST_ADVANCE > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "GST Advance on Purchase Voucher", mTransaction, mConnection);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                //Cash Purchase
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashSales, "Purchase Cash");
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Purchase Cash, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashSales, "Purchase Cash");

                                //Cash Payment
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), PayableAccount, p_DISTRIBUTOR_ID, 0, p_NET_AMOUNT + p_FREIGHT_AMOUNT, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashPayment, "Cash Payment");
                                LController.PostingPrinvipalInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo), Inventoryatstore, p_DISTRIBUTOR_ID, p_NET_AMOUNT + p_FREIGHT_AMOUNT, 0, mPurchaseMaster.DOCUMENT_DATE, "Cash Purchase Payment, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, DateTime.Now, p_Principal, mPurchaseMaster.PURCHASE_MASTER_ID, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), p_TYPE_ID, p_UserId, Constants.CashPayment, "Cash Payment");

                                if (IsFinanceSetting)
                                {
                                    //Cash Purchase Voucher
                                    if (LController.PostingGLMaster(p_DISTRIBUTOR_ID, p_Principal, VoucherNo2, Constants.Journal_Voucher, p_DOCUMENT_DATE, Constants.Document_Purchase, Convert.ToString(mPurchaseMaster.PURCHASE_MASTER_ID), "Purchase Voucher, INV#: " + p_ORDER_NUMBER + " , Supplier: " + p_Supplier_Name + " ," + p_BuiltyNo, p_UserId, "Purchase", p_TYPE_ID, mPurchaseMaster.PURCHASE_MASTER_ID))
                                    {
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Inventoryatstore, p_TOTAL_AMOUNT, 0, "Inventory at Store Purchase Voucher");
                                        LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, CashInHand, 0, p_TOTAL_AMOUNT + p_GST_AMOUNT + p_GST_ADVANCE - p_DISCOUNT, "CashInHand Purchase Voucher");

                                        if (p_DISCOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseDiscount, 0, p_DISCOUNT, "PurchaseDiscount Purchase Voucher");
                                        }
                                        if (p_FREIGHT_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, Freight, p_FREIGHT_AMOUNT, 0, "Freight Purchase Voucher");
                                        }
                                        if (p_GST_AMOUNT > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, PurchaseTax, p_GST_AMOUNT, 0, "PurchaseTax Purchase Voucher");
                                        }
                                        if (p_GST_ADVANCE > 0)
                                        {
                                            LController.PostingGLDetail(p_DISTRIBUTOR_ID, p_Principal, Constants.Journal_Voucher, VoucherNo2, advanceTax, p_GST_ADVANCE, 0, "PurchaseTax Purchase Voucher");
                                        }
                                    }
                                }
                            }
                        }
                        #endregion
                    }
                }
                else
                {
                    //Delete Purchase Master
                    uspDeletePurchase mDel = new uspDeletePurchase();
                    mDel.Connection = mConnection;
                    mDel.PURCHASE_MASTER_ID = p_PURCHASE_MASTER_ID;
                    mDel.ExecuteQuery();
                }
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return false;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public DataTable SelectPuchaseOrder(int p_Distributor_Id, int p_supplier_Id, int p_userId,int p_TypeID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPurchaseOrder mOrder = new spSelectPurchaseOrder();
                mOrder.Connection = mConnection;
                mOrder.Distributor_ID = p_Distributor_Id;
                mOrder.PRINCIPAL_ID = p_supplier_Id;
                mOrder.USER_ID = p_userId;
                mOrder.TYPE_ID = p_TypeID;
                DataTable dt = mOrder.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public DataTable SelectGRN(int p_USER_ID, int p_supplier_Id, DateTime? document_Date)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectGRN mOrder = new spSelectGRN();
                mOrder.Connection = mConnection;
                mOrder.USER_ID = p_USER_ID;
                mOrder.PRINCIPAL_ID = p_supplier_Id;
                mOrder.DOCUMENT_DATE = document_Date;
                DataTable dt = mOrder.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public DataTable getPurchaseOrderDetail(long p_purchase_Order_Master_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPurchaseOrderDetail mOrder = new spSelectPurchaseOrderDetail();
                mOrder.Connection = mConnection;
                mOrder.ID = p_purchase_Order_Master_ID;
                DataTable dt = mOrder.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public DataTable GetPurchaseOrderDetailForUpdate(long p_purchase_Order_Master_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPurchaseOrderDetail mOrder = new spSelectPurchaseOrderDetail();
                mOrder.Connection = mConnection;
                mOrder.ID = p_purchase_Order_Master_ID;
                DataTable dt = mOrder.ExecuteTableForPurchaseOrder_Update();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public DataSet SelectPurchaseOrderReport(long p_Purchase_Order_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                RptPurchaseOrder ObjPrint = new RptPurchaseOrder();
                CORNBusinessLayer.Reports.DsReport ds = new CORNBusinessLayer.Reports.DsReport();
                ObjPrint.Connection = mConnection;
                ObjPrint.ID = p_Purchase_Order_ID;
                DataTable dt = ObjPrint.ExecuteTable();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["RptPurchaseOrder"].ImportRow(dr);
                }

                return ds;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public DataSet SelectGRNReport(long p_Purchase_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                RptPurchaseOrder ObjPrint = new RptPurchaseOrder();
                CORNBusinessLayer.Reports.DsReport ds = new CORNBusinessLayer.Reports.DsReport();
                ObjPrint.Connection = mConnection;
                ObjPrint.ID = p_Purchase_ID;
                DataTable dt = ObjPrint.ExecuteTableGRNReport();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["RptPurchaseOrder"].ImportRow(dr);
                }

                return ds;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public DataTable getPurchaseByPurchaseOrderMasterID(long p_purchaseOrder_Master_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectGRN mOrder = new spSelectGRN();
                mOrder.Connection = mConnection;
                mOrder.Purchase_Order_Master_ID = p_purchaseOrder_Master_ID;
                DataTable dt = mOrder.ExecuteTableForPurchaseOrderINGRN();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        #endregion

        public DataTable SelectSupllierPurchases(int p_Principal_ID, int p_location_Id)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spGetSupplierPurchaseForGRN mPurchaseMaster = new spGetSupplierPurchaseForGRN();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.PRINCIPAL_ID = p_Principal_ID;
                mPurchaseMaster.DISTRIBUTOR_ID = p_location_Id;
                mPurchaseMaster.USER_ID = Constants.IntNullValue;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }

        }

        public DataTable GetStockDemandData(int p_WarehouseID, DateTime p_StockDate)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetStockDemandNotification mPurchaseMaster = new uspGetStockDemandNotification();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.WarehouseID = p_WarehouseID;
                mPurchaseMaster.StockDate = p_StockDate;
                DataTable dt = mPurchaseMaster.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public DataTable SelectPurchaseMasterIDByStockTakingID(long p_stockTaking_ID, int p_typeID)
        {
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetPhysicalStockTaking mPurchaseMaster = new uspGetPhysicalStockTaking();
                mPurchaseMaster.Connection = mConnection;
                mPurchaseMaster.PhysicalStock_Taking_ID = p_stockTaking_ID;
                mPurchaseMaster.TYPE_ID = p_typeID;
                DataTable dt = mPurchaseMaster.ExecuteTableForPurchaseMasterByStockTakingID();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public DataSet GetCategoryWisePurchase(string p_DISTRIBUTOR_ID, string p_CATEGORY_ID,
            DateTime p_FromDate, DateTime p_ToDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetItemWisePurchase ObjPrint = new uspGetItemWisePurchase();
                Reports.DSReportNew ds = new Reports.DSReportNew();
                ObjPrint.Connection = mConnection;
                ObjPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                ObjPrint.CATEGORY_ID = p_CATEGORY_ID;
                ObjPrint.FROM_DATE = p_FromDate;
                ObjPrint.TO_DATE = p_ToDate;
                DataTable dt = ObjPrint.ExecuteTableForCategoryWisePur();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["spCategoryWisePurchase"].ImportRow(dr);
                }

                return ds;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public bool OpeningStockExist(int p_DISTRIBUTOR_ID, int p_SKU_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                OpeningStockExist ObjPrint = new OpeningStockExist();
                Reports.DSReportNew ds = new Reports.DSReportNew();
                ObjPrint.Connection = mConnection;
                ObjPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                ObjPrint.SKU_ID = p_SKU_ID;
                DataTable dt = ObjPrint.ExecuteTable();
                if(dt.Rows.Count >0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return true;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        #endregion
    }
}