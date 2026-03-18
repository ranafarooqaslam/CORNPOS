using System;
using System.Data;
using CORNCommon.Classes;
using System.Data.SqlTypes;
using System.Data.SqlClient;
using System.Collections;
using CORNDataAccessLayer.Classes;
using System.Collections.Generic;
using CORNDatabaseLayer.Classes;
using System.Reflection;
using System.Linq;
using System.Web;
using System.IO;

namespace CORNBusinessLayer.Classes
{
    /// <summary>
    /// Class For Order/Invoice/Sale Return Related Tasks
    /// <example>
    /// <list type="bullet">
    /// <item>
    /// Insert Order/Invoice/Sale Return
    /// </item>
    /// <term>
    /// Update Order/Invoice/Sale Return
    /// </term>
    /// <item>
    /// Get Order/Invoice/Sale Return
    /// </item>spInsertSALE_INVOICE_DETAIL3
    /// </list>
    /// </example>
    /// </summary>
    public class OrderEntryController
    {
        #region Constructor

        /// <summary>
        /// Constructor for OrderEntryController
        /// </summary>
        public OrderEntryController()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        #endregion

        #region Select

        public DataTable SelectSyncDocument(int p_Distributor_Id, int p_TypeId, DateTime p_DocumentDate, DateTime pEndDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UspSelectRollBackDocument mOrder = new UspSelectRollBackDocument();
                mOrder.Connection = mConnection;
                mOrder.DISTRIBUTOR_ID = p_Distributor_Id;
                mOrder.DOCUMENT_TYPE = p_TypeId;
                mOrder.DOCUMENT_DATE = p_DocumentDate;
                mOrder.END_DATE = pEndDate;

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

        public DataTable SelectPendingBills(long pSaleInvoiceId, DateTime pDocumentDate, int pDistributorId, int pUSER_ID, int pCustomerType, int pTypeId)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPendingBills mOrder = new spSelectPendingBills
                {
                    Connection = mConnection,
                    SALE_INVOICE_ID = pSaleInvoiceId,
                    distributorId = pDistributorId,
                    Document_Date = pDocumentDate,
                    customerType = pCustomerType,
                    typeId = pTypeId,
                    USER_ID = pUSER_ID
                };
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

        public DataSet SelectPendingBillsDataSetQA(long pSaleInvoiceId, DateTime pDocumentDate, int pDistributorId, int pUSER_ID, int pCustomerType, int pTypeId)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPendingBills mOrder = new spSelectPendingBills
                {
                    Connection = mConnection,
                    SALE_INVOICE_ID = pSaleInvoiceId,
                    distributorId = pDistributorId,
                    Document_Date = pDocumentDate,
                    customerType = pCustomerType,
                    typeId = pTypeId,
                    USER_ID = pUSER_ID
                };
                DataSet ds = mOrder.ExecuteDataSet();
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

        public DataSet SelectPendingBillsDataset(long pSaleInvoiceId, DateTime pDocumentDate, int pDistributorId, int pUSER_ID, int pCustomerType,bool pIsKOTService, int pTypeId)
        {
            IDbConnection mConnection = null;
            try
            {
                DataTable dtSummary = new DataTable();
                dtSummary.Columns.Add("DineIn", typeof(int));
                dtSummary.Columns.Add("Delivery", typeof(int));
                dtSummary.Columns.Add("Takeaway", typeof(int));
                int DineIn = 0;
                int Delivery = 0;
                int Takeaway = 0;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPendingBills mOrder = new spSelectPendingBills
                {
                    Connection = mConnection,
                    SALE_INVOICE_ID = pSaleInvoiceId,
                    distributorId = pDistributorId,
                    Document_Date = pDocumentDate,
                    customerType = pCustomerType,
                    typeId = pTypeId,
                    USER_ID = pUSER_ID,
                    IsKOTService = pIsKOTService
                };
                DataSet ds = mOrder.ExecuteDataSet();
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    if (dr["CUSTOMER_TYPE_ID"].ToString() == "1")
                    {
                        DineIn++;
                    }
                    else if (dr["CUSTOMER_TYPE_ID"].ToString() == "2")
                    {
                        Delivery++;
                    }
                    else if (dr["CUSTOMER_TYPE_ID"].ToString() == "3")
                    {
                        Takeaway++;
                    }
                }

                DataRow drNew = dtSummary.NewRow();
                drNew["DineIn"] = DineIn;
                drNew["Delivery"] = Delivery;
                drNew["Takeaway"] = Takeaway;
                dtSummary.Rows.Add(drNew);

                if (ds.Tables.Count == 3)
                {
                    ds.Tables.RemoveAt(1);
                }

                ds.Tables.Add(dtSummary);
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

        public DataTable SELECT_PendingAndCompletedOrdersCount(DateTime pDocumentDate, int pDistributorId)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                GetPendingCompletedOrdersCount mOrder = new GetPendingCompletedOrdersCount
                {
                    Connection = mConnection,
                    Distributor_ID = pDistributorId,
                    DocumentDate = pDocumentDate,
                };
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

        /// <summary>
        /// For Reprint Invoice
        /// </summary>
        /// <param name="pFromDate"></param>
        /// <param name="pToDate"></param>
        /// <param name="pDistributorId"></param>
        /// <param name="pTypeId"></param>
        /// <returns></returns>
        public DataTable SelectPendingBills(DateTime pFromDate, DateTime pToDate, int pDistributorId, int pTypeId)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spSelectPendingBills mOrder = new spSelectPendingBills
                {
                    Connection = mConnection,
                    distributorId = pDistributorId,
                    Document_Date = pFromDate,
                    To_Date = pToDate,
                    typeId = pTypeId

                };
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

        #region Rollback

        /// <summary>
        /// Gets Rollback Data For Order, Invoice And Sale Return
        /// </summary>
        /// <param name="p_Distributor_Id">Location</param>
        /// <param name="p_Principal_Id">Principal</param>
        /// <param name="p_Order_Booker">OrderBooker</param>
        /// <param name="p_TypeId">Type</param>
        /// <param name="p_DocumentDate">Date</param>
        /// <returns>Rollback Data For Order, Invoice And Sale Return as Datatable</returns>
        public DataTable SelectRollBackDocument(int p_Distributor_Id, int p_Principal_Id, int p_Order_Booker, int p_TypeId, DateTime p_DocumentDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UspSelectRollBackDocument mOrder = new UspSelectRollBackDocument();
                mOrder.Connection = mConnection;
                mOrder.DISTRIBUTOR_ID = p_Distributor_Id;
                mOrder.DOCUMENT_TYPE = p_TypeId;

                mOrder.DOCUMENT_DATE = p_DocumentDate;
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
        #endregion

        #region Added By Hazrat Ali
        public DataTable GetNotificationData(int p_DISTRIBUTOR_ID, DateTime p_DOCUMENT_DATE, int p_TYPE_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetDataForNotification mOrder = new uspGetDataForNotification
                {
                    Connection = mConnection,
                    DISTRIBUTOR_ID = p_DISTRIBUTOR_ID,
                    DOCUMENT_DATE = p_DOCUMENT_DATE,
                    TYPE_ID = p_TYPE_ID
                };
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
        public DataTable GetItemSale(int p_SKU_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspCheckItemSales mOrder = new uspCheckItemSales
                {
                    Connection = mConnection,
                    SKU_ID = p_SKU_ID
                };
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
        #endregion

        #region Date Wise Item Consumption Report
        public DataSet GetDateWiseItemConsumptionReport(int p_DISTRIBUTOR_ID, DateTime p_FromDate, DateTime p_ToDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spDateWiseItemConsumption objPrint = new spDateWiseItemConsumption();
                Reports.DsReport ds = new Reports.DsReport();
                objPrint.Connection = mConnection;
                objPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                objPrint.FROM_DATE = p_FromDate;
                objPrint.TO_DATE = p_ToDate;
                DataTable dt = objPrint.ExecuteTable();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["spDateWiseItemConsumption"].ImportRow(dr);
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

        public DataSet GetChannelWiseSummaryReport(int p_DISTRIBUTOR_ID, DateTime p_FromDate, DateTime p_ToDate, int? p_deliveryChannel = null)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spDateWiseItemConsumption objPrint = new spDateWiseItemConsumption();
                Reports.DsReport ds = new Reports.DsReport();
                objPrint.Connection = mConnection;
                objPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                objPrint.FROM_DATE = p_FromDate;
                objPrint.TO_DATE = p_ToDate;

                if (p_deliveryChannel == -1)
                {
                    p_deliveryChannel = null;
                }

                objPrint.DELIVERY_CHANNEL = p_deliveryChannel;
                DataTable dt = objPrint.ExecuteTableForDeliveryChannelSalesSummary();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["RptDeliveryChannelSalesSummary"].ImportRow(dr);
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

        public DataSet GetChannelInvoiceWiseReport(int p_DISTRIBUTOR_ID, DateTime p_FromDate, DateTime p_ToDate, int? p_deliveryChannel = null)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spDateWiseItemConsumption objPrint = new spDateWiseItemConsumption();
                Reports.DsReport ds = new Reports.DsReport();
                objPrint.Connection = mConnection;
                objPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                objPrint.FROM_DATE = p_FromDate;
                objPrint.TO_DATE = p_ToDate;

                if (p_deliveryChannel == -1)
                {
                    p_deliveryChannel = null;
                }

                objPrint.DELIVERY_CHANNEL = p_deliveryChannel;
                DataTable dt = objPrint.ExecuteTableForDeliveryChannelSalesInvoiceWise();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["RptDeliveryChannelInvoiceWiseSale"].ImportRow(dr);
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
        public DataSet SelectInvoiceDetail(int p_DistributorId, DateTime p_From_Date, DateTime p_ToDate, int? p_DeliveryChannel)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                CORNBusinessLayer.Reports.DsReport ds = new CORNBusinessLayer.Reports.DsReport();

                UspBillWiseInvoiceReportNew mInvoice = new UspBillWiseInvoiceReportNew();

                mInvoice.Connection = mConnection;
                mInvoice.DISTRIBUTOR_ID = p_DistributorId;
                mInvoice.FROM_DATE = p_From_Date;
                mInvoice.TO_DATE = p_ToDate;

                if (p_DeliveryChannel == -1)
                {
                    p_DeliveryChannel = null;
                }

                mInvoice.DELIVERY_CHANNEL = p_DeliveryChannel;
                mInvoice.PaymentModeID = Constants.ByteNullValue;
                DataTable DT = mInvoice.ExecuteTableForDeliveryChannelItemWise();
                foreach (DataRow dr in DT.Rows)
                {
                    ds.Tables["UspBillWiseInvoiceReport"].ImportRow(dr);
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

        #region Order Time Tracking Report
        public DataSet GetOrderTimeTrackingReport(int p_DISTRIBUTOR_ID, DateTime p_FromDate, DateTime p_ToDate)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spDateWiseItemConsumption objPrint = new spDateWiseItemConsumption();
                Reports.DsReport ds = new Reports.DsReport();
                objPrint.Connection = mConnection;
                objPrint.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                objPrint.FROM_DATE = p_FromDate;
                objPrint.TO_DATE = p_ToDate;
                DataTable dt = objPrint.ExecuteTable_ForOrderTime_TrackingReport();
                foreach (DataRow dr in dt.Rows)
                {
                    ds.Tables["rptOrderTimeTracking"].ImportRow(dr);
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

        public static decimal GetAmountDue(long InvoiceID, IDbConnection mConnection, IDbTransaction mTransaction)
        {
            try
            {
                decimal AmountDue = 0;
                uspGetAmountDue mOrder = new uspGetAmountDue();
                mOrder.Connection = mConnection;
                mOrder.Transaction = mTransaction;
                mOrder.SALE_INVOICE_ID = InvoiceID;
                DataTable dt = mOrder.ExecuteTable();
                if (dt.Rows.Count > 0)
                {
                    AmountDue = Convert.ToDecimal(dt.Rows[0]["AmountDue"]);
                }
                return AmountDue;

            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return 0;
            }
        }

        #endregion

        #region Insert, Update, Deleted

        public static long Add_Invoice(int pPaymentModeId, int pCustomerTypeId, int pTableId, decimal pAmountdue, decimal pPaidin, decimal pBalance, decimal pGST, bool pIsHold, int pUserId, DateTime pDocumentDate, int pDistributorId, DataTable dtInvoiceDetail, int pOrderbookerId, string pCovertable, long pCustomerId, string pMaxOrderNo, string pTakeAwayCustomer, string pMANUAL_ORDER_NO, string pREMARKS, int pDeliveryType, int pDelChannel, int pSERVICE_CHARGES_TYPE, byte pFORM_ID, bool pDELIVERY_CHANNEL_CASH_IMPACT, bool pCreditCard_Impact, decimal pGSTPER, decimal pGSTPERCreditCard, string pBillFormat, decimal pAdvanceAmount, decimal pCustomerGST, decimal pCustomerDiscount, byte pCustomerDiscountType, decimal pCustomerServiceCharges, byte pCustomerServiceType, bool KDSImplemented, short pTakeawayType,decimal pPOSFee)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                long SALE_INVOICE_ID = 0;
                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();
                    mTransaction = ProviderFactory.GetTransaction(mConnection);

                    decimal amountDue = 0;
                    decimal DISCOUNTDeal = 0;
                    decimal itemDiscount = 0;
                    amountDue = calculateDealPrice(dtInvoiceDetail);
                    DISCOUNTDeal = calculateDealDiscount(dtInvoiceDetail);
                    bool IsFree = false;
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        IsFree = false;
                        if (!bool.Parse(dr["VOID"].ToString()))
                        {
                            if (dr["IS_FREE"].ToString() != "")
                            {
                                if (dr["IS_FREE"].ToString() == "1")
                                {
                                    IsFree = true;
                                }
                                else
                                {
                                    IsFree = false;
                                }
                            }
                            else
                            {
                                IsFree = false;
                            }

                            if (int.Parse(dr["I_D_ID"].ToString()) == 0 || Convert.ToInt32(dr["MODIFIER"]) == 1)
                            {
                                if (!IsFree)
                                {
                                    amountDue += decimal.Parse(dr["T_PRICE"].ToString()) * decimal.Parse(dr["QTY"].ToString());
                                }
                            }
                            try
                            {
                                if (!IsFree)
                                {
                                    itemDiscount += decimal.Parse(dr["DISCOUNT"].ToString());
                                }
                            }
                            catch (Exception)
                            {
                                itemDiscount += 0;
                            }
                        }
                    }

                    decimal GSTReverse = 0;
                    if (pBillFormat == "3")
                    {
                        GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                        pGST = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                    else if (pBillFormat == "4")
                    {
                        if (pPaymentModeId == 1)
                        {
                            GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                            pGST = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                        else
                        {
                            decimal GSTPER2 = pGSTPER - pGSTPERCreditCard;
                            GSTReverse = amountDue - (amountDue / ((GSTPER2 + 100) / 100));
                            pGST = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                    }
                    spInsertSALE_INVOICE_MASTER3 mISom = new spInsertSALE_INVOICE_MASTER3
                    {
                        Connection = mConnection,
                        Transaction = mTransaction,
                        AMOUNTDUE = amountDue,
                        BALANCE = pBalance,
                        DISTRIBUTOR_ID = pDistributorId,
                        DOCUMENT_DATE = pDocumentDate,
                        IS_HOLD = pIsHold,
                        PAIDIN = pPaidin,
                        GST = pGST,
                        CustomerGST = pCustomerGST,
                        PAYMENT_MODE_ID = pPaymentModeId,
                        CUSTOMER_TYPE_ID = pCustomerTypeId,
                        TABLE_ID = pTableId,
                        USER_ID = pUserId,
                        orderBookerId = pOrderbookerId,
                        approvedby = pCovertable,
                        CUSTOMER_ID = pCustomerId,
                        ORDER_NO = pMaxOrderNo,
                        TAKEAWAY_CUSTOMER = pTakeAwayCustomer,
                        MANUAL_ORDER_NO = pMANUAL_ORDER_NO,
                        REMARKS = pREMARKS,
                        DeliveryType = pDeliveryType,
                        DELIVERY_CHANNEL = pDelChannel,
                        ITEM_DISCOUNT = itemDiscount + DISCOUNTDeal,
                        SERVICE_CHARGES_TYPE = pSERVICE_CHARGES_TYPE,
                        FORM_ID = pFORM_ID,
                        DELIVERY_CHANNEL_CASH_IMPACT = pDELIVERY_CHANNEL_CASH_IMPACT,
                        CreditCard_Impact = pCreditCard_Impact,
                        GSTPER = pGSTPER,
                        AdvanceAmount = pAdvanceAmount,
                        CustomerDiscount = pCustomerDiscount,
                        CustomerDiscountType = pCustomerDiscountType,
                        CustomerServiceCharges = pCustomerServiceCharges,
                        CustomerServiceType = pCustomerServiceType,
                        TakeawayType = pTakeawayType,
                        POS_FEE = pPOSFee
                    };
                    DataTable dtInvoice = mISom.ExecuteTable();
                    SALE_INVOICE_ID = Convert.ToInt64(dtInvoice.Rows[0]["SALE_INVOICE_ID"]);
                    //----------------Insert into sale order detail-------------
                    spInsertSALE_INVOICE_DETAILKOT mSaleInvoiceDetail = new spInsertSALE_INVOICE_DETAILKOT
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        if (!bool.Parse(dr["VOID"].ToString()))
                        {
                            mSaleInvoiceDetail.SALE_INVOICE_ID = SALE_INVOICE_ID;
                            mSaleInvoiceDetail.IS_VOID = bool.Parse(dr["VOID"].ToString());
                            mSaleInvoiceDetail.PRICE = decimal.Parse(dr["T_PRICE"].ToString());
                            mSaleInvoiceDetail.PRODUCT_CATEGORY_ID = int.Parse(dr["CAT_ID"].ToString());
                            mSaleInvoiceDetail.QTY = decimal.Parse(dr["QTY"].ToString());
                            mSaleInvoiceDetail.ITEM_DEAL_ID = int.Parse(dr["I_D_ID"].ToString());
                            mSaleInvoiceDetail.DEAL_PRICE = decimal.Parse(dr["A_PRICE"].ToString());
                            mSaleInvoiceDetail.REMARKS = "H";
                            mSaleInvoiceDetail.C1 = decimal.Parse(dr["C1"].ToString());
                            mSaleInvoiceDetail.C2 = decimal.Parse(dr["C2"].ToString());
                            mSaleInvoiceDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                            mSaleInvoiceDetail.DealDetailQTY = decimal.Parse(dr["QTY"].ToString());
                            mSaleInvoiceDetail.DealQTY = decimal.Parse(dr["DEAL_QTY"].ToString());
                            mSaleInvoiceDetail.intDealID = int.Parse(dr["intDealID"].ToString());
                            mSaleInvoiceDetail.lngDealDetailID = long.Parse(dr["lngDealDetailID"].ToString());
                            mSaleInvoiceDetail.DISTRIBUTOR_ID = pDistributorId;
                            mSaleInvoiceDetail.VOID_BY = pUserId;
                            try
                            {
                                mSaleInvoiceDetail.ItemWiseGST = decimal.Parse(dr["ItemWiseGST"].ToString());
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.ItemWiseGST = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.GSTPER = decimal.Parse(dr["GSTPER"].ToString());
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.GSTPER = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.DISCOUNT = decimal.Parse(dr["DISCOUNT"].ToString());
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.DISCOUNT = 0;
                            }
                            if (dr["IS_FREE"].ToString() != "")
                            {
                                if (dr["IS_FREE"].ToString() == "0")
                                {
                                    mSaleInvoiceDetail.IS_FREE = false;
                                }
                                else
                                {
                                    mSaleInvoiceDetail.IS_FREE = true;
                                }
                            }
                            else
                            {
                                mSaleInvoiceDetail.IS_FREE = false;
                            }

                            try
                            {
                                mSaleInvoiceDetail.ORIGINAL_QTY = Convert.ToDecimal(dr["ORIGINAL_QTY"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.ORIGINAL_QTY = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.PRINT_QTY = Convert.ToDecimal(dr["PRINT_QTY"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.PRINT_QTY = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.MODIFIER_PARENT_ID = Convert.ToInt32(dr["MODIFIER_PARENT_ID"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.MODIFIER_PARENT_ID = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.ModifierParetn_Row_ID = Convert.ToInt32(dr["ModifierParetn_Row_ID"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.ModifierParetn_Row_ID = 0;
                            }
                            try
                            {
                                mSaleInvoiceDetail.ORDER_NOTES = dr["ItemComments"].ToString();
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.ORDER_NOTES = "";
                            }

                            try
                            {
                                mSaleInvoiceDetail.ComplimentaryReason = Convert.ToInt32(dr["ComplimentaryReason"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.ComplimentaryReason = 0;
                            }

                            try
                            {
                                mSaleInvoiceDetail.TIME_STAMP2 = Convert.ToDateTime(dr["TIME_STAMP"]).ToLocalTime();
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.TIME_STAMP2 = System.DateTime.Now;
                            }

                            try
                            {
                                mSaleInvoiceDetail.DISCOUNTDeal = Convert.ToDecimal(dr["DISCOUNTDeal"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.DISCOUNTDeal = 0;
                            }
                            mSaleInvoiceDetail.DealName = dr["DEAL_NAME"].ToString();
                            mSaleInvoiceDetail.ExecuteQuery();                            
                            if (KDSImplemented)
                            {
                                spInsertSALE_INVOICE_DETAIL3 detailLast = new spInsertSALE_INVOICE_DETAIL3();
                                detailLast.Connection = mConnection;
                                detailLast.Transaction = mTransaction;
                                detailLast.IsNewAdded = true;

                                // Iterate the Properties of the destination instance and  
                                // populate them from their source counterparts  
                                CopyProperties(mSaleInvoiceDetail, detailLast);
                                detailLast.ExecuteQueryForKDSHistory();
                            }
                        }
                    }

                    mTransaction.Commit();
                    return SALE_INVOICE_ID;
                }
                else
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();

                    spInsertSALE_INVOICE_MASTER mISom = new spInsertSALE_INVOICE_MASTER
                    {
                        Connection = mConnection,
                        AMOUNTDUE = 0,
                        BALANCE = pBalance,
                        DISTRIBUTOR_ID = pDistributorId,
                        DOCUMENT_DATE = pDocumentDate,
                        IS_HOLD = pIsHold,
                        PAIDIN = pPaidin,
                        PAYMENT_MODE_ID = pPaymentModeId,
                        CUSTOMER_TYPE_ID = pCustomerTypeId,
                        TABLE_ID = pTableId,
                        USER_ID = pUserId,
                        orderBookerId = pOrderbookerId,
                        approvedby = pCovertable,
                        CUSTOMER_ID = pCustomerId,
                        ORDER_NO = pMaxOrderNo,
                        TAKEAWAY_CUSTOMER = pTakeAwayCustomer,
                        DELIVERY_CHANNEL = pDelChannel,
                        SERVICE_CHARGES_TYPE = pSERVICE_CHARGES_TYPE,
                        FORM_ID = pFORM_ID,
                        DELIVERY_CHANNEL_CASH_IMPACT = pDELIVERY_CHANNEL_CASH_IMPACT,
                        CreditCard_Impact = pCreditCard_Impact,
                        GSTPER = pGSTPER,
                        TakeawayType = pTakeawayType
                    };
                    mISom.ExecuteQuery();

                    return mISom.SALE_INVOICE_ID;
                }
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

        public static bool HoldOrder(long pSaleInvoiceId, int pPaymentModeId, int pCustomerTypeId, int pTableId, decimal pAmountdue, decimal pDiscount, decimal pGst, decimal pPaidin, decimal pBalance, bool pIsHold, int pUserId, DateTime pDocumentDate, int pDistributorId, int pDiscType, DataTable dtInvoiceDetail, int pOrderBookerId, string pCovertTable, string pTakeAwayCustomer, int p_VOID_BY, string pMANUAL_ORDER_NO, string pREMARKS, int pserviceCharges, int pcustomerID, bool pInvoicePrinted, decimal pGSTPER, decimal pGSTPERCreditCard, string pBillFormat, decimal pAdvanceAmount, decimal pCustomerGST, decimal pCustomerDiscount, byte pCustomerDiscountType, decimal pCustomerServiceCharges, byte pCustomerServiceType, string pRecipeType, int pDelChannel, bool pDELIVERY_CHANNEL_CASH_IMPACT, bool pCreditCard_Impact, bool KDSImplemented, bool pIsItemChanged, short pTakeawayType,DataTable dt,string OldInvoiceJson, byte pFORM_ID, bool IsFinanceIntegrate, DataTable dtCOAConfig)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                LogParams(pSaleInvoiceId, pPaymentModeId, pCustomerTypeId, pTableId, pAmountdue, pDiscount, pGst, pPaidin, pBalance, pIsHold, pUserId, pDocumentDate, pDistributorId, pDiscType, dtInvoiceDetail, pOrderBookerId, pCovertTable, pTakeAwayCustomer, p_VOID_BY, pMANUAL_ORDER_NO, pREMARKS, pserviceCharges, pcustomerID, pInvoicePrinted, pGSTPER, pGSTPERCreditCard, pBillFormat, pAdvanceAmount, pCustomerGST, pCustomerDiscount, pCustomerDiscountType, pCustomerServiceCharges, pCustomerServiceType, pRecipeType, pDelChannel, pDELIVERY_CHANNEL_CASH_IMPACT, pCreditCard_Impact, KDSImplemented, pIsItemChanged, pTakeawayType, pFORM_ID, dt, OldInvoiceJson);
                DataTable dtItemLessCancel = dtInvoiceDetail.Clone();
                List<int> Deal = new List<int>();
                decimal itemDiscount = 0;
                decimal DISCOUNTDeal = 0;
                DISCOUNTDeal = calculateDealDiscount(dtInvoiceDetail);
                bool AllItemsCanceled = true;
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    int intLessCancelReasonID = 0;
                    int ItemType = 1;
                    long SALEINVOICEDETAILD = 0;
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        try
                        {
                            SALEINVOICEDETAILD = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                        }
                        catch (Exception)
                        {
                            SALEINVOICEDETAILD = 0;
                        }
                        try
                        {
                            intLessCancelReasonID = Convert.ToInt32(dr["LessCancelReasonID"]);
                        }
                        catch (Exception)
                        {
                            intLessCancelReasonID = 0;
                        }

                        try
                        {
                            ItemType = Convert.ToInt32(dr["ItemType"]);
                        }
                        catch (Exception)
                        {
                            ItemType = 1;
                        }

                        uspInsertSaleInvoiceItemLog mItemLesCancel = new uspInsertSaleInvoiceItemLog
                        {
                            Connection = mConnection,
                            Transaction = mTransaction,
                            SALE_INVOICE_ID = pSaleInvoiceId,
                            SALE_INVOICE_DETAIL_ID = SALEINVOICEDETAILD,
                            SKU_ID = Convert.ToInt32(dr["SKU_ID"]),
                            IS_VOID = Convert.ToBoolean(dr["VOID"]),
                            QTY = Convert.ToDecimal(dr["QTY"]),
                            VOID_BY = p_VOID_BY,
                            LessCancelReasonID = intLessCancelReasonID,
                            ItemType = ItemType,
                            DealQty = Convert.ToDecimal(dr["DEAL_QTY"])
                        };
                        DataTable dtItemLog = mItemLesCancel.ExecuteTable();
                        if (ItemType == 2)//Insert Consumption
                        {
                            dtItemLessCancel.ImportRow(dr);
                            foreach (DataRow drLessCancel in dtItemLessCancel.Rows)
                            {
                                if (drLessCancel["SKU_ID"].ToString() == dr["SKU_ID"].ToString())
                                {
                                    drLessCancel["QTY"] = dtItemLog.Rows[0]["RETURN_QTY"];
                                }
                            }
                        }
                    }

                    if (dtItemLessCancel.Rows.Count > 0)
                    {
                        InsertLessCancelItemConsumption(pSaleInvoiceId, pDocumentDate, pDistributorId, pCustomerTypeId, pUserId, pRecipeType, dtItemLessCancel, IsFinanceIntegrate, dtCOAConfig, mConnection, mTransaction);
                    }
                    //----------------Insert into sale order detail-------------\\
                    spInsertSALE_INVOICE_DETAILKOT2 mSaleInvoiceDetail = new spInsertSALE_INVOICE_DETAILKOT2
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        mSaleInvoiceDetail.SALE_INVOICE_ID = pSaleInvoiceId;
                        mSaleInvoiceDetail.IS_VOID = bool.Parse(dr["VOID"].ToString());
                        mSaleInvoiceDetail.PRICE = decimal.Parse(dr["T_PRICE"].ToString());
                        mSaleInvoiceDetail.PRODUCT_CATEGORY_ID = int.Parse(dr["CAT_ID"].ToString());
                        mSaleInvoiceDetail.QTY = decimal.Parse(dr["QTY"].ToString());
                        mSaleInvoiceDetail.REMARKS = "H";
                        mSaleInvoiceDetail.C1 = decimal.Parse(dr["C1"].ToString());
                        mSaleInvoiceDetail.C2 = decimal.Parse(dr["C2"].ToString());
                        mSaleInvoiceDetail.ITEM_DEAL_ID = int.Parse(dr["I_D_ID"].ToString());
                        mSaleInvoiceDetail.DEAL_PRICE = decimal.Parse(dr["A_PRICE"].ToString());
                        mSaleInvoiceDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        mSaleInvoiceDetail.DealDetailQTY = decimal.Parse(dr["QTY"].ToString());
                        mSaleInvoiceDetail.DealQTY = decimal.Parse(dr["DEAL_QTY"].ToString());
                        mSaleInvoiceDetail.intDealID = int.Parse(dr["intDealID"].ToString());
                        mSaleInvoiceDetail.lngDealDetailID = long.Parse(dr["lngDealDetailID"].ToString());
                        mSaleInvoiceDetail.DISTRIBUTOR_ID = pDistributorId;
                        mSaleInvoiceDetail.VOID_BY = p_VOID_BY;
                        mSaleInvoiceDetail.ItemWiseGST = decimal.Parse(dr["ItemWiseGST"].ToString());
                        mSaleInvoiceDetail.GSTPER = decimal.Parse(dr["GSTPER"].ToString());
                        try
                        {
                            mSaleInvoiceDetail.DISCOUNT = decimal.Parse(dr["DISCOUNT"].ToString());
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.DISCOUNT = 0;
                        }

                        if (dr["IS_FREE"].ToString() != "")
                        {
                            if (dr["IS_FREE"].ToString() == "0")
                            {
                                mSaleInvoiceDetail.IS_FREE = false;
                            }
                            else
                            {
                                mSaleInvoiceDetail.IS_FREE = true;
                            }
                        }
                        else
                        {
                            mSaleInvoiceDetail.IS_FREE = false;
                        }
                        try
                        {
                            mSaleInvoiceDetail.ORIGINAL_QTY = Convert.ToDecimal(dr["ORIGINAL_QTY"]);
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.ORIGINAL_QTY = 0;
                        }
                        if (!mSaleInvoiceDetail.IS_VOID)
                        {
                            AllItemsCanceled = false;
                        }
                        if (mSaleInvoiceDetail.IS_VOID)
                        {
                            mSaleInvoiceDetail.PRINT_QTY = 0;
                        }
                        else
                        {
                            try
                            {
                                mSaleInvoiceDetail.PRINT_QTY = Convert.ToDecimal(dr["PRINT_QTY"]);
                            }
                            catch (Exception)
                            {
                                mSaleInvoiceDetail.PRINT_QTY = 0;
                            }
                        }
                        try
                        {
                            mSaleInvoiceDetail.MODIFIER_PARENT_ID = Convert.ToInt32(dr["MODIFIER_PARENT_ID"]);
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.MODIFIER_PARENT_ID = 0;
                        }
                        try
                        {
                            mSaleInvoiceDetail.ModifierParetn_Row_ID = Convert.ToInt32(dr["ModifierParetn_Row_ID"]);
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.ModifierParetn_Row_ID = 0;
                        }
                        try
                        {
                            mSaleInvoiceDetail.ORDER_NOTES = dr["ItemComments"].ToString();
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.ORDER_NOTES = "";
                        }
                        try
                        {
                            mSaleInvoiceDetail.ComplimentaryReason = Convert.ToInt32(dr["ComplimentaryReason"]);
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.ComplimentaryReason = 0;
                        }
                        try
                        {
                            mSaleInvoiceDetail.TIME_STAMP2 = Convert.ToDateTime(dr["TIME_STAMP"]).ToLocalTime();
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.TIME_STAMP2 = System.DateTime.Now;
                        }
                        try
                        {
                            mSaleInvoiceDetail.DISCOUNTDeal = Convert.ToDecimal(dr["DISCOUNTDeal"]);
                        }
                        catch (Exception)
                        {
                            mSaleInvoiceDetail.DISCOUNTDeal = 0;
                        }
                        bool newitem = true;
                        //decimal KOTQty = 0;
                        //decimal KOTDealQty = 0;
                        //byte KOTType = 1;//1=NewKOT, 2=NewItem,3=Increase Qty,4=Decrease Qty,5=Calncel Item
                        foreach (DataRow row1 in dt.Rows)
                        {
                            var skuId = row1.Field<int>("SKU_ID");
                            var qty1 = row1.Field<decimal>("QTY");
                            //var dealqty1 = row1.Field<decimal>("DealQTY");
                            var SaleInvoiceDetailID = row1.Field<long>("SALE_INVOICE_DETAIL_ID");
                            var lastupdate = row1.Field<DateTime>("LASTUPDATE_DATE");
                            long SaleInvoiceDetailID2 = 0;
                            try
                            {
                                SaleInvoiceDetailID2 = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                            }
                            catch (Exception ex)
                            {
                                SaleInvoiceDetailID2 = 0;
                            }
                            if (skuId == mSaleInvoiceDetail.SKU_ID && SaleInvoiceDetailID == SaleInvoiceDetailID2)
                            {         
                                if (qty1 != mSaleInvoiceDetail.QTY)
                                {
                                    mSaleInvoiceDetail.LASTUPDATE_DATE = DateTime.Now;
                                }
                                else
                                {
                                    mSaleInvoiceDetail.LASTUPDATE_DATE = lastupdate;
                                }
                                newitem = false;
                                break;
                            }
                        }
                        if (newitem)
                        {
                            mSaleInvoiceDetail.LASTUPDATE_DATE = DateTime.Now;
                        }
                        try
                        {
                            mSaleInvoiceDetail.SALE_INVOICE_DETAIL_ID2 = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                        }
                        catch (Exception ex)
                        {
                            mSaleInvoiceDetail.SALE_INVOICE_DETAIL_ID2 = 0;
                        }
                        mSaleInvoiceDetail.OldInvoiceJson = OldInvoiceJson;
                        mSaleInvoiceDetail.DealName = dr["DEAL_NAME"].ToString();
                        mSaleInvoiceDetail.ExecuteQuery();
                        if (mSaleInvoiceDetail.IS_VOID == false)
                        {
                            if (mSaleInvoiceDetail.IS_FREE == false)
                            {
                                itemDiscount += mSaleInvoiceDetail.DISCOUNT;
                            }
                        }

                        #region KDS HISTORY
                        if (KDSImplemented)
                        {
                            if (mSaleInvoiceDetail.IS_VOID == false)
                            {
                                //if there is change in qty then it should insert new. PR_COUNT => previous qty AND QTY => New Qty
                                if (decimal.Parse(dr["PR_COUNT"].ToString()) != decimal.Parse(dr["QTY"].ToString()))
                                {
                                    spInsertSALE_INVOICE_DETAILKOT2 detail = new spInsertSALE_INVOICE_DETAILKOT2();

                                    detail = mSaleInvoiceDetail;
                                    var detailId = mSaleInvoiceDetail.SALE_INVOICE_DETAIL_ID;
                                    detail.SALE_INVOICE_DETAIL_ID = detailId;
                                    spInsertSALE_INVOICE_DETAILKOT2 detailLast = new spInsertSALE_INVOICE_DETAILKOT2();
                                    detailLast.Connection = mConnection;
                                    detailLast.Transaction = mTransaction;
                                    detail.QTY = decimal.Parse(dr["QTY"].ToString()) - decimal.Parse(dr["PR_COUNT"].ToString());
                                    detailLast = detail;
                                    detailLast.ExecuteQueryForKDSHistory();
                                }
                            }
                            else
                            {
                                spInsertSALE_INVOICE_DETAIL3 detail = new spInsertSALE_INVOICE_DETAIL3();
                                detail.Connection = mConnection;
                                detail.Transaction = mTransaction;
                                detail.SALE_INVOICE_ID = mSaleInvoiceDetail.SALE_INVOICE_ID;
                                detail.SKU_ID = mSaleInvoiceDetail.SKU_ID;
                                detail.VOID_BY = p_VOID_BY;
                                //detail.IsReady = true; done in sp side
                                detail.ExecuteQueryForKDSAsVOID();
                            }
                        }
                        //Order Notes in KDS History
                        if (KDSImplemented)
                        {
                            spInsertSALE_INVOICE_DETAIL3 detail1 = new spInsertSALE_INVOICE_DETAIL3();
                            detail1.Connection = mConnection;
                            detail1.Transaction = mTransaction;
                            detail1.SALE_INVOICE_ID = mSaleInvoiceDetail.SALE_INVOICE_ID;
                            detail1.SKU_ID = mSaleInvoiceDetail.SKU_ID;
                            detail1.ORDER_NOTES = mSaleInvoiceDetail.ORDER_NOTES;
                            detail1.ExecuteQueryForKDSUpdate();
                        }
                        #endregion
                    }

                    decimal GSTReverse = 0;
                    decimal amountDue = GetAmountDue(pSaleInvoiceId, mConnection, mTransaction);
                    if (pBillFormat == "3")
                    {
                        GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                    else if (pBillFormat == "4")
                    {
                        if (pPaymentModeId == 1)
                        {
                            decimal GSTPER2 = pGSTPER - pGSTPERCreditCard;
                            GSTReverse = amountDue - (amountDue / ((GSTPER2 + 100) / 100));
                            pGst = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                        else
                        {
                            GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                            pGst = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                    }
                    spUpdateSALE_INVOICE_MASTER mISom = new spUpdateSALE_INVOICE_MASTER();

                    mISom.Connection = mConnection;
                    mISom.Transaction = mTransaction;
                    mISom.AMOUNTDUE = amountDue;
                    mISom.DISCOUNT = pDiscount;
                    mISom.GST = pGst;
                    mISom.CustomerGST = pCustomerGST;
                    mISom.DISTRIBUTOR_ID = pDistributorId;
                    mISom.IS_HOLD = pIsHold;
                    mISom.PAIDIN = pPaidin;
                    if (mISom.IS_GST_VOID)
                    {
                        mISom.BALANCE = pPaidin - (pAmountdue - pDiscount);
                    }
                    else
                    {
                        mISom.BALANCE = pPaidin - (pAmountdue + pGst - pDiscount);
                    }
                    mISom.PAYMENT_MODE_ID = pPaymentModeId;
                    mISom.DISCOUNT_TYPE = pDiscType;
                    mISom.CUSTOMER_TYPE_ID = pCustomerTypeId;
                    mISom.TABLE_ID = pTableId;
                    mISom.USER_ID = pUserId;
                    mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                    mISom.IS_ACTIVE = true;
                    mISom.POSTING = 0;
                    mISom.orderBookerId = pOrderBookerId;
                    mISom.coverTable = pCovertTable;
                    mISom.TAKEAWAY_CUSTOMER = pTakeAwayCustomer;
                    mISom.MANUAL_ORDER_NO = pMANUAL_ORDER_NO;
                    mISom.REMARKS = pREMARKS;
                    mISom.SERVICE_CHARGES_TYPE = pserviceCharges;
                    mISom.SERVICE_CHARGES = 0;
                    mISom.CUSTOMER_ID = pcustomerID;
                    mISom.ITEM_DISCOUNT = itemDiscount + DISCOUNTDeal;
                    mISom.InvoicePrinted = pInvoicePrinted;
                    mISom.GSTPER = pGSTPER;
                    mISom.AdvanceAmount = pAdvanceAmount;
                    mISom.CustomerDiscount = pCustomerDiscount;
                    mISom.CustomerDiscountType = pCustomerDiscountType;
                    mISom.CustomerServiceCharges = pCustomerServiceCharges;
                    mISom.CustomerServiceType = pCustomerServiceType;
                    mISom.DELIVERY_CHANNEL = pDelChannel;
                    mISom.DELIVERY_CHANNEL_CASH_IMPACT = pDELIVERY_CHANNEL_CASH_IMPACT;
                    mISom.CreditCard_Impact = pCreditCard_Impact;
                    mISom.IsItemChanged = pIsItemChanged;
                    mISom.TakeawayType = pTakeawayType;
                    mISom.ExecuteQuery();


                    if (AllItemsCanceled)
                    {
                        spUpdateSALE_INVOICE_MASTER mISom2 = new spUpdateSALE_INVOICE_MASTER();
                        mISom2.Connection = mConnection;
                        mISom2.Transaction = mTransaction;
                        mISom2.TYPE_ID = 3;
                        mISom2.SALE_INVOICE_ID = pSaleInvoiceId;
                        mISom2.ExecuteQuery();
                    }
                    mTransaction.Commit();                    
                    return true;
                }
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();                
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

        public DataTable Update_Order(long pSaleInvoiceId, int pPaymentModeId, int pCustomerTypeId, int pTableId, decimal pDiscount, decimal pGst, decimal pPaidin, decimal pGstPerAge, bool pIsHold, int pUserId, DateTime pDocumentDate, int pDistributorId, int pDiscType, DataTable dtInvoiceDetail, decimal pServiceCharges, string pTakeAwayCustomer, int pCardType, string pCardNo, decimal pPoints, decimal pPurchasing, long pCustomerID, string pMANUAL_ORDER_NO, string pREMARKS, int porderBookerId, short pempDiscType, int pChargesType, bool pIS_GST_VOID, decimal pGSTPER, decimal pGSTPERCash, decimal pGSTPERCreditCard, int p_PrintInvoiceBy, string pDiscountRemarks, string pBillFormat, int pBankDiscountID, string pCreditCardNo, string pCreditCardAccountTile, decimal pAdvanceAmount, decimal pCustomerGST, decimal pCustomerDiscount, byte pCustomerDiscountType, decimal pCustomerServiceCharges, byte pCustomerServiceType, short pTakeawayType)
        {
            IDbConnection mConnection = null;
            DataTable dt = new DataTable();
            try
            {
                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();

                    decimal amountDue = GetAmountDue(pSaleInvoiceId, mConnection, null);
                    decimal GSTReverse = 0;
                    if (pBillFormat == "3")
                    {
                        GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                    else if (pBillFormat == "4")
                    {
                        if (pPaymentModeId == 1)
                        {
                            decimal GSTPER2 = pGSTPERCash - pGSTPERCreditCard;
                            GSTReverse = amountDue - (amountDue / ((GSTPER2 + 100) / 100));
                            pGst = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                        else
                        {
                            GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                            pGst = GSTReverse;
                            amountDue = amountDue - GSTReverse;
                        }
                    }

                    spUpdateSALE_INVOICE_MASTEROnPrintInvoice mISom = new spUpdateSALE_INVOICE_MASTEROnPrintInvoice();

                    mISom.Connection = mConnection;
                    mISom.AMOUNTDUE = amountDue;
                    mISom.DISCOUNT = pDiscount;
                    mISom.DISTRIBUTOR_ID = pDistributorId;
                    mISom.IS_HOLD = pIsHold;
                    mISom.PAIDIN = pPaidin;
                    mISom.SERVICE_CHARGES = pServiceCharges;
                    mISom.SERVICE_CHARGES_TYPE = pChargesType;
                    if (pIS_GST_VOID)
                    {
                        mISom.GST = 0;
                    }
                    else
                    {
                        mISom.GST = pGst;
                    }
                    mISom.CustomerGST = pCustomerGST;
                    mISom.BALANCE = pPaidin - (amountDue + mISom.SERVICE_CHARGES + mISom.GST - pDiscount);
                    mISom.DISCOUNT_TYPE = pDiscType;
                    mISom.CUSTOMER_TYPE_ID = pCustomerTypeId;
                    mISom.PAYMENT_MODE_ID = pPaymentModeId;
                    mISom.TABLE_ID = pTableId;
                    mISom.USER_ID = pUserId;
                    mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                    mISom.IS_ACTIVE = true;
                    mISom.POSTING = 0;
                    mISom.TAKEAWAY_CUSTOMER = pTakeAwayCustomer;
                    mISom.strCardNo = pCardNo;
                    mISom.CUSTOMER_ID = pCustomerID;
                    mISom.EmpDiscountType = pempDiscType;
                    mISom.IS_GST_VOID = pIS_GST_VOID;
                    if (pCardType == 2)
                    {
                        if ((amountDue + mISom.SERVICE_CHARGES + mISom.GST - pDiscount) > pPurchasing)
                        {
                            mISom.POINTS = pPoints;
                        }
                    }
                    else
                    {
                        mISom.POINTS = 0;
                    }
                    mISom.MANUAL_ORDER_NO = pMANUAL_ORDER_NO;
                    mISom.REMARKS = pREMARKS;
                    mISom.orderBookerId = porderBookerId;
                    mISom.InvoicePrinted = true;
                    mISom.IsInvoicePrint = true;
                    mISom.GSTPER = pGSTPER;
                    mISom.PrintInvoiceBy = p_PrintInvoiceBy;
                    mISom.DiscountRemarks = pDiscountRemarks;
                    mISom.BANK_DISCOUNT_ID = pBankDiscountID;
                    mISom.CreditCardNo = pCreditCardNo;
                    mISom.CreditCardAccountTile = pCreditCardAccountTile;
                    mISom.AdvanceAmount = pAdvanceAmount;
                    mISom.CustomerDiscount = pCustomerDiscount;
                    mISom.CustomerDiscountType = pCustomerDiscountType;
                    mISom.CustomerServiceCharges = pCustomerServiceCharges;
                    mISom.CustomerServiceType = pCustomerServiceType;
                    mISom.TakeawayType = pTakeawayType;
                    dt = mISom.ExecuteTable();
                    return dt;
                }
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
            };
            return dt;
        }

        public static DataTable Update_Invoice(long pSaleInvoiceId, int pDistributorId, int pCustomerTypeId, int pPaymentModeId, decimal pAmountDue, decimal pDiscount, decimal pGst, decimal pPaidin, decimal pGstPerAge, int pUserId, DateTime pDocumentDate, int pDiscType, DataTable dtInvoiceDetail, decimal pServiceCharges, string pTakeAwayCustomer, short empDiscType, int EMC_UserID, int Manager_UserID, string PASSWORD, long pCustomerID, string pCardNo, decimal pPurchasing, string pMANUAL_ORDER_NO, string pREMARKS, int pChargesType, int pDeliveryChannelID, string pInvoiceNumberFBR, long p_BANK_ID, bool pIS_GST_VOID, decimal pGSTPER, decimal pGSTPERCash, decimal pGSTPERCreditCard, decimal pCreaditAmount, int pRecordType, string pRecipeType, string pBillFormat, decimal pAdvanceAmount, decimal pBankPortion, string pItemWiseGST, string GSTCalculation, string pDiscountRemarks, decimal pPointsEarned, decimal pPointsDeducted, string pCreditCardNo, decimal pLOYALTY_POINTS, short pTakeawayType,string pInvoiceNumberPRA, bool IsFinanceIntegrate, DataTable dtCOAConfig)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            int RowIndex = 0;
            decimal ComplimentaryDiscount = 0;
            bool flagClosingStock = false;
            bool Is_Production = false;
            DataTable dtItems = new DataTable();
            try
            {

                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();
                    mTransaction = ProviderFactory.GetTransaction(mConnection);
                    decimal itemDiscount = 0;
                    decimal DISCOUNTDeal = 0;
                    DISCOUNTDeal = calculateDealDiscount(dtInvoiceDetail);
                    ComplimentaryDiscount = calculateComplimentaryDealAmount(dtInvoiceDetail);
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        if (!bool.Parse(dr["VOID"].ToString()))
                        {
                            try
                            {
                                itemDiscount += decimal.Parse(dr["DISCOUNT"].ToString());
                            }
                            catch (Exception)
                            {
                                itemDiscount += 0;
                            }
                        }

                        if (dr["IS_FREE"].ToString() != "")
                        {
                            if (dr["IS_FREE"].ToString() == "1")
                            {
                                if (int.Parse(dr["I_D_ID"].ToString()) == 0 || Convert.ToInt32(dr["MODIFIER"]) == 1)
                                {
                                    ComplimentaryDiscount += decimal.Parse(dr["T_PRICE"].ToString()) * decimal.Parse(dr["QTY"].ToString());
                                }
                            }
                        }
                    }
                    decimal GSTReverse = 0;
                    pAmountDue = GetAmountDue(pSaleInvoiceId, mConnection, mTransaction);
                    if (pItemWiseGST == "0")
                    {
                        decimal dis = 0;
                        if (pDiscount > 0)
                        {
                            if (pDiscType == 0)
                            {
                                dis = pAmountDue * pDiscount / 100;
                            }
                            else
                            {
                                dis = pDiscount;
                            }
                        }

                        if (GSTCalculation == "1")
                        {
                            pGst = pAmountDue * pGSTPER / 100;
                        }
                        else if (GSTCalculation == "2")
                        {
                            pGst = (pAmountDue - (dis + itemDiscount + DISCOUNTDeal)) * pGSTPER / 100;
                        }
                        else if (GSTCalculation == "3")
                        {
                            pGst = (pAmountDue + pServiceCharges) * pGSTPER / 100;
                        }
                        else
                        {
                            pGst = (pAmountDue - (dis + itemDiscount + DISCOUNTDeal) + pServiceCharges) * pGSTPER / 100;
                        }
                    }
                    if (pBillFormat == "3")
                    {
                        GSTReverse = pAmountDue - (pAmountDue / ((pGSTPER + 100) / 100));
                        pGst = GSTReverse;
                        pAmountDue = pAmountDue - GSTReverse;
                    }
                    else if (pBillFormat == "4")
                    {
                        if (pPaymentModeId == 1)
                        {
                            decimal GSTPER2 = pGSTPERCash - pGSTPERCreditCard;
                            GSTReverse = pAmountDue - (pAmountDue / ((GSTPER2 + 100) / 100));
                            pGst = GSTReverse;
                            pAmountDue = pAmountDue - GSTReverse;
                        }
                        else
                        {
                            GSTReverse = pAmountDue - (pAmountDue / ((pGSTPER + 100) / 100));
                            pGst = GSTReverse;
                            pAmountDue = pAmountDue - GSTReverse;
                        }
                    }
                    //Insert Customer Points
                    if (pCustomerID > 0 && (pPointsEarned > 0 || pPointsDeducted > 0))
                    {
                        uspInsertCustomerPoints mPoints = new uspInsertCustomerPoints()
                        {
                            Connection = mConnection,
                            Transaction = mTransaction
                        };
                        mPoints.CustomerID = pCustomerID;
                        mPoints.SaleInvoiceID = pSaleInvoiceId;
                        mPoints.PointsEarned = pPointsEarned;
                        mPoints.PointsDeducted = pPointsDeducted;
                        mPoints.ExecuteQuery();
                    }

                    uspInsertPayment mISom = new uspInsertPayment();

                    mISom.Connection = mConnection;
                    mISom.Transaction = mTransaction;
                    mISom.AMOUNTDUE = pAmountDue;
                    mISom.DISCOUNT = pDiscount;
                    mISom.PAIDIN = pPaidin;
                    mISom.SERVICE_CHARGES = pServiceCharges;
                    if (pIS_GST_VOID)
                    {
                        mISom.GST = 0;
                    }
                    else
                    {
                        mISom.GST = pGst;
                    }
                    if (pDiscType == 0)
                    {
                        if (pBillFormat == "3" || pBillFormat == "4")
                        {
                            mISom.BALANCE = pPaidin - (pAmountDue + mISom.GST + pServiceCharges - (itemDiscount + DISCOUNTDeal) - ((pAmountDue + mISom.GST) * pDiscount) / 100);
                        }
                        else
                        {
                            mISom.BALANCE = pPaidin - (pAmountDue + mISom.GST + pServiceCharges - (itemDiscount + DISCOUNTDeal) - (pAmountDue * pDiscount) / 100);
                        }
                    }
                    else
                    {
                        mISom.BALANCE = pPaidin - (pAmountDue + mISom.GST + pServiceCharges - (itemDiscount + DISCOUNTDeal) - pDiscount);
                    }
                    if (mISom.BALANCE < 1 && mISom.BALANCE > -1)
                    {
                        mISom.BALANCE = 0;
                    }
                    else
                    {
                        mISom.BALANCE = Math.Round(mISom.BALANCE);
                    }
                    mISom.PAYMENT_MODE_ID = pPaymentModeId;
                    mISom.DISCOUNT_TYPE = pDiscType;
                    mISom.USER_ID = pUserId;
                    mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                    mISom.TAKEAWAY_CUSTOMER = pTakeAwayCustomer;
                    mISom.EmpDiscountType = empDiscType;
                    mISom.EMC_UserID = EMC_UserID;
                    mISom.Manager_UserID = Manager_UserID;
                    mISom.ManagerPWD = PASSWORD;
                    mISom.CUSTOMER_ID = pCustomerID;
                    mISom.strCardNo = pCardNo;
                    mISom.PURCHASING = pPurchasing;
                    mISom.MANUAL_ORDER_NO = pMANUAL_ORDER_NO;
                    mISom.REMARKS = pREMARKS;
                    mISom.SERVICE_CHARGES_TYPE = pChargesType;
                    mISom.InvoiceNumberFBR = pInvoiceNumberFBR;
                    mISom.KDS_TIME = System.DateTime.Now;
                    mISom.BANK_ID = p_BANK_ID;
                    mISom.GSTPER = pGSTPER;
                    mISom.CREDIT_AMOUNT = pCreaditAmount;
                    mISom.RecordType = pRecordType;
                    mISom.DiscountRemarks = pDiscountRemarks;
                    mISom.CreditCardNo = pCreditCardNo;
                    mISom.LOYALTY_POINTS = pLOYALTY_POINTS;
                    mISom.TakeawayType = pTakeawayType;
                    mISom.InvoiceNumberPRA = pInvoiceNumberPRA;
                    dtItems = mISom.ExecuteTable();
                    if (dtItems.Rows.Count > 0)
                    {
                        dtInvoiceDetail.Columns.Add("ISEXEMPTED", typeof(bool));
                        dtInvoiceDetail.Columns.Add("IS_Recipe", typeof(bool));
                        dtInvoiceDetail.Columns.Add("BRAND_ID", typeof(int));
                        foreach (DataRow drItem in dtItems.Rows)
                        {
                            foreach (DataRow drOrder in dtInvoiceDetail.Rows)
                            {
                                if (drItem["SKU_ID"].ToString() == drOrder["SKU_ID"].ToString())
                                {
                                    drOrder["ISEXEMPTED"] = drItem["ISEXEMPTED"];
                                    drOrder["IS_Recipe"] = drItem["IS_Recipe"];
                                    drOrder["BRAND_ID"] = drItem["BRAND_ID"];
                                }
                            }
                        }
                        decimal GLConsumption = 0;
                        long SALE_INVOICE_DETAIL_ID = 0;
                        foreach (DataRow dr in dtInvoiceDetail.Rows)
                        {
                            SALE_INVOICE_DETAIL_ID = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);

                            #region Raw, Package and Consumption Material


                            uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                            {
                                Connection = mConnection,
                                Transaction = mTransaction
                            };

                            mSkuInfo.FINISHED_SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                            if (pRecipeType == "1")
                            {
                                mSkuInfo.TYPE_ID = 5;
                            }
                            else
                            {
                                mSkuInfo.TYPE_ID = 4;
                            }
                            mSkuInfo.DATE = pDocumentDate;
                            mSkuInfo.DISTRIBUTOR_ID = pDistributorId;

                            DataTable dtRaw = mSkuInfo.ExecuteTable();

                            if (dtRaw != null)
                            {
                                decimal StockQty = 0;
                                RowIndex = 0;
                                flagClosingStock = false;
                                Is_Production = false;
                                foreach (DataRow drRaw in dtRaw.Rows)
                                {
                                    RowIndex++;
                                    //===============INSERTION IN STOCK REGISETR===========================\\

                                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                    mStockUpdate.Connection = mConnection;
                                    mStockUpdate.Transaction = mTransaction;

                                    mStockUpdate.PRINCIPAL_ID = 0;
                                    mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                                    mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                                    mStockUpdate.STOCK_DATE = pDocumentDate;

                                    mStockUpdate.PRICE = 0;

                                    mStockUpdate.BATCHNO = "N/A";
                                    mStockUpdate.SKU_ID = int.Parse(drRaw["SKU_ID"].ToString());

                                    mStockUpdate.STOCK_QTY = 0;
                                    mStockUpdate.CONSUMED = 0;
                                    mStockUpdate.FREE_QTY = 0;
                                    if (RowIndex == 1 && Convert.ToDecimal(drRaw["CLOSING_STOCK"]) <= 0)
                                    {
                                        flagClosingStock = true;
                                    }
                                    if (RowIndex == 1 && drRaw["Is_Production"].ToString() == "1")
                                    {
                                        Is_Production = true;
                                    }

                                    if (drRaw["Type"].ToString() == "Finish")
                                    {
                                        if (drRaw["IsModifierdItem"].ToString() == "1")
                                        {
                                            StockQty = decimal.Parse(dr["QTY"].ToString());
                                        }
                                        else
                                        {
                                            StockQty = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, decimal.Parse(dr["QTY"].ToString()), 0, "Finish");
                                        }

                                        if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "1")
                                        {
                                            if (flagClosingStock)
                                            {
                                                mStockUpdate.STOCK_QTY = StockQty;
                                                mStockUpdate.CONSUMED = StockQty;
                                            }
                                        }
                                        //Committed on order of Sajjad Sb dated 17-Sep-2025 11:35 AM
                                        //else if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "0")
                                        //{
                                        //    mStockUpdate.STOCK_QTY = StockQty;
                                        //}
                                        else if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "NOT EXIST" && drRaw["Is_Production"].ToString() == "0")
                                        {
                                            mStockUpdate.STOCK_QTY = StockQty;
                                        }
                                    }
                                    else if (drRaw["Type"].ToString() == "Raw")
                                    {
                                        if (Is_Production)
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True" && flagClosingStock)
                                            {
                                                if (drRaw["IsModifierdItem"].ToString() == "1")
                                                {
                                                    mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                                }
                                                else
                                                {
                                                    mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True")
                                            {
                                                if (drRaw["IsModifierdItem"].ToString() == "1")
                                                {
                                                    mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                                }
                                                else
                                                {
                                                    mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                                }
                                            }
                                        }
                                    }
                                    else if (drRaw["Type"].ToString() == "Package")
                                    {
                                        if (drRaw["Is_Inventory"].ToString() == "True")
                                        {
                                            if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                            {
                                                if (drRaw["IsModifierdItem"].ToString() == "1")
                                                {
                                                    mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                                }
                                                else
                                                {
                                                    mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                                }
                                            }
                                        }
                                    }

                                    mStockUpdate.ExecuteQuery();

                                    //========================================================================\\

                                    //=========================== CONSUMPTION TABLE===========================\\
                                    #region Consumption

                                    if (drRaw["Type"].ToString() == "Finish")
                                    {
                                        //if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "1")
                                        if (drRaw["Is_Inventory"].ToString() == "True")
                                        {
                                            if (flagClosingStock)
                                            {
                                                decimal price = Convert.ToDecimal(drRaw["LastPurPrice"]);
                                                decimal consumedqty = mStockUpdate.CONSUMED;
                                                if (price == 0)
                                                {
                                                    price = decimal.Parse(dr["T_PRICE"].ToString());
                                                }
                                                if (consumedqty == 0)
                                                {
                                                    if (dr["UOM_ID"].ToString() != dr["intStockMUnitCode"].ToString())
                                                    {
                                                        consumedqty = Conversion(dr["Stock_to_SaleOperator"].ToString(), decimal.Parse(dr["Stock_to_SaleFactor"].ToString()), 1, decimal.Parse(dr["QTY"].ToString()), 0, "Finish");
                                                    }
                                                    else
                                                    {
                                                        consumedqty = decimal.Parse(dr["QTY"].ToString());
                                                    }
                                                }
                                                Consumption(pDistributorId, mISom.SALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(dr["CAT_ID"].ToString()), price, consumedqty, consumedqty, false, "Finish", false, 0, mTransaction, mConnection);

                                                GLConsumption += price * consumedqty;
                                            }
                                        }
                                    }
                                    else if (drRaw["Type"].ToString() == "Raw")
                                    {
                                        if (Is_Production)
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True" && flagClosingStock)
                                            {
                                                decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                                Consumption(pDistributorId, mISom.SALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Raw", false, 0, mTransaction, mConnection);

                                                GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                            }
                                        }
                                        else
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True")
                                            {
                                                decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                                Consumption(pDistributorId, mISom.SALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Raw", false, 0, mTransaction, mConnection);

                                                GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                            }
                                        }
                                    }
                                    else if (drRaw["Type"].ToString() == "Package")
                                    {
                                        if (drRaw["Is_Inventory"].ToString() == "True")
                                        {
                                            if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                            {
                                                decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                                Consumption(pDistributorId, mISom.SALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Package", false, 0, mTransaction, mConnection);

                                                GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                            }
                                        }
                                    }
                                    #endregion
                                    //========================================================================\\
                                }

                                if (RowIndex == 0 || (dr["BRAND_ID"].ToString() == "1" && dr["ISEXEMPTED"].ToString().ToLower() == "true" && dr["IS_Recipe"].ToString().ToLower() == "true"))
                                {
                                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                    mStockUpdate.Connection = mConnection;
                                    mStockUpdate.Transaction = mTransaction;

                                    mStockUpdate.PRINCIPAL_ID = 0;
                                    mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                                    mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                                    mStockUpdate.STOCK_DATE = pDocumentDate;
                                    mStockUpdate.PRICE = 0;
                                    mStockUpdate.BATCHNO = "N/A";
                                    mStockUpdate.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                                    mStockUpdate.STOCK_QTY = decimal.Parse(dr["QTY"].ToString());
                                    mStockUpdate.FREE_QTY = 0;
                                    mStockUpdate.ExecuteQuery();
                                }
                            }

                            #endregion
                        }
                        #region Consumption Of Packing Material Of Deal

                        DataView view = new DataView(dtInvoiceDetail);
                        DataTable distinctDealIDs = view.ToTable(true, "I_D_ID");
                        foreach (DataRow dr in distinctDealIDs.Rows)
                        {
                            if (dr["I_D_ID"].ToString() != "0")
                            {
                                #region Package Material Consumption
                                uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                                {
                                    Connection = mConnection,
                                    Transaction = mTransaction
                                };
                                int DealID = Convert.ToInt32(dr["I_D_ID"]);
                                mSkuInfo.FINISHED_SKU_ID = Convert.ToInt32(dr["I_D_ID"]);
                                mSkuInfo.TYPE_ID = 3;
                                mSkuInfo.DATE = pDocumentDate;
                                mSkuInfo.DISTRIBUTOR_ID = pDistributorId;
                                DataTable dtRaw = mSkuInfo.ExecuteTable();

                                if (dtRaw != null)
                                {
                                    RowIndex = 0;
                                    flagClosingStock = false;
                                    Is_Production = false;
                                    foreach (DataRow drRaw in dtRaw.Rows)
                                    {
                                        //===============INSERTION IN STOCK REGISETR===========================\\

                                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                        mStockUpdate.Connection = mConnection;
                                        mStockUpdate.Transaction = mTransaction;
                                        mStockUpdate.PRINCIPAL_ID = 0;
                                        mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                                        mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                                        mStockUpdate.STOCK_DATE = pDocumentDate;
                                        mStockUpdate.PRICE = 0;
                                        mStockUpdate.BATCHNO = "N/A";
                                        mStockUpdate.SKU_ID = int.Parse(drRaw["SKU_ID"].ToString());
                                        mStockUpdate.STOCK_QTY = 0;
                                        mStockUpdate.CONSUMED = 0;
                                        mStockUpdate.FREE_QTY = 0;

                                        if (drRaw["Type"].ToString() == "Package")
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True")
                                            {
                                                if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                                {
                                                    mStockUpdate.CONSUMED = Convert.ToDecimal(drRaw["QUANTITY"]);
                                                }
                                            }
                                        }

                                        mStockUpdate.ExecuteQuery();

                                        #region Consumption

                                        if (drRaw["Type"].ToString() == "Package")
                                        {
                                            if (drRaw["Is_Inventory"].ToString() == "True")
                                            {
                                                if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                                {
                                                    decimal SaleQty = Convert.ToDecimal(drRaw["QUANTITY"]);
                                                    Consumption(pDistributorId, mISom.SALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["DISTRIBUTOR_PRICE"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Package", true, DealID, mTransaction, mConnection);
                                                    GLConsumption += decimal.Parse(drRaw["DISTRIBUTOR_PRICE"].ToString()) * mStockUpdate.CONSUMED;
                                                }
                                            }
                                        }
                                        #endregion
                                    }
                                }

                                #endregion
                            }
                        }

                        #endregion
                        decimal DiscountAmount = 0;
                        if (pDiscType == 0)
                        {
                            DiscountAmount = pAmountDue * pDiscount / 100;
                        }
                        else
                        {
                            DiscountAmount = pDiscount;
                        }
                        DiscountAmount += itemDiscount + DISCOUNTDeal;

                        #region Credit Invoice
                        if (pPaymentModeId == 2)//Credit Sale
                        {
                            DataRow[] drConfig2 = null;

                            LedgerController LController2 = new LedgerController();
                            string VoucherNo2 = LController2.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorId, 0);

                            drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                            LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, pAmountDue + mISom.GST + pServiceCharges - DiscountAmount, 0, pDocumentDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CreditSale, mISom.orderBookerId.ToString());

                            drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                            LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, 0, pAmountDue + mISom.GST + pServiceCharges - DiscountAmount, pDocumentDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CreditSale, mISom.orderBookerId.ToString());
                        }
                        #endregion
                        bool IsVoucherPosted = true;
                        if (IsFinanceIntegrate)
                        {
                            #region GL Master, Detail
                            decimal BankDiscountPortion = pBankPortion;

                            BankDiscountPortion = DiscountAmount * pBankPortion / 100;
                            DiscountAmount = DiscountAmount - BankDiscountPortion;

                            LedgerController LController = new LedgerController();
                            string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, pDistributorId, pDocumentDate);

                            if (LController.PostingGLMaster(pDistributorId, 0, VoucherNo, Constants.Journal_Voucher, pDocumentDate, Constants.Document_SaleInvoice, Convert.ToString(mISom.SALE_INVOICE_ID), "Sale Voucher", pUserId, "Sale", Constants.Document_SaleInvoice, mISom.SALE_INVOICE_ID))
                            {
                                DataRow[] drConfig = null;

                                if (pCustomerTypeId == 2 && pDeliveryChannelID > 0)
                                {
                                    //Dr Third Party Delivery
                                    //Cr Credit Sale
                                    if (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion > 0)
                                    {
                                        drConfig = dtCOAConfig.Select("CODE = '" + pDeliveryChannelID + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion, 0, "Third Party Delivery Sale Voucher");
                                            }
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (pAmountDue - DiscountAmount - BankDiscountPortion > 0)
                                                {
                                                    if (IsVoucherPosted)
                                                    {
                                                        IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue, "Third Party Delivery Sale Voucher");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (DiscountAmount > 0)
                                    {
                                        //Cr  Discount on Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                            }
                                        }
                                    }
                                    if (BankDiscountPortion > 0)
                                    {
                                        //Cr  Discount on Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), BankDiscountPortion, 0, "Discount Bank Portion Sale Voucher");
                                            }
                                        }
                                    }
                                    if (mISom.GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.GST, "GST Sale Voucher");
                                            }
                                        }
                                    }

                                    if (mISom.SERVICE_CHARGES > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.SERVICE_CHARGES, "Service Charges Voucher");
                                            }
                                        }
                                    }

                                    if (ComplimentaryDiscount > 0)
                                    {
                                        //Dr Complimentary Discount
                                        //Cr Cash Sales
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Complimentary Discount Sale Voucher");
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (IsVoucherPosted)
                                            {
                                                IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Sale Voucher");
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (pPaymentModeId == 0)
                                    {
                                        //Dr Cash in Hand
                                        //Cr Cash Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion, 0, "Cash In Hand Sale Voucher");
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pAmountDue > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue + ComplimentaryDiscount, "Sale Voucher");
                                                }
                                            }
                                        }
                                        if (DiscountAmount > 0)
                                        {
                                            //Cr  Discount on Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                                }
                                            }
                                        }

                                        if (BankDiscountPortion > 0)
                                        {
                                            //Cr  Discount on Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), BankDiscountPortion, 0, "Discount Bank Portion Sale Voucher");
                                                }
                                            }
                                        }

                                        if (mISom.GST > 0)
                                        {
                                            //Cr  Sales Tax
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.GST, "GST Sale Voucher");
                                                }
                                            }
                                        }

                                        if (pServiceCharges > 0)
                                        {
                                            //Cr  Service Charges
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.SERVICE_CHARGES, "Service Charges Voucher");
                                                }
                                            }
                                        }
                                        if (ComplimentaryDiscount > 0)
                                        {
                                            //Dr Complimentary Discount
                                            //Cr Cash Sales
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Complimentary Discount Sale Voucher");
                                                }
                                            }
                                        }
                                    }
                                    else if (pPaymentModeId == 1)//Credit Card Sale
                                    {
                                        //Dr  Credit Card Sale Receivable
                                        //Cr  Credit Sales

                                        if (pPaidin > 0)
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pPaidin, 0, "Cash In Hand Sale Voucher");
                                                }
                                            }
                                        }

                                        if (p_BANK_ID > 0)
                                        {
                                            if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, p_BANK_ID, (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin, 0, "Credit Card Sale Voucher");
                                                }
                                            }
                                        }
                                        else
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSaleReceivable + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin > 0)
                                                {
                                                    if (IsVoucherPosted)
                                                    {
                                                        IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin, 0, "Credit Card Sale Voucher");
                                                    }
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pAmountDue - pPaidin > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue - pPaidin, "Credit Card Sale Voucher");
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pPaidin > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pPaidin + ComplimentaryDiscount, "Sale Voucher");
                                                }
                                            }
                                            else
                                            {
                                                if (ComplimentaryDiscount > 0)
                                                {
                                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                                    if (drConfig.Length > 0)
                                                    {
                                                        if (IsVoucherPosted)
                                                        {
                                                            IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Sale Voucher");
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (DiscountAmount > 0)
                                        {
                                            //Cr  Discount on Credit Card Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonCreditCardSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                                }
                                            }
                                        }

                                        if (BankDiscountPortion > 0)
                                        {
                                            //Cr  Discount on Credit Card Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), BankDiscountPortion, 0, "Discount Bank Portion Sale Voucher");
                                                }
                                            }
                                        }

                                        if (mISom.GST > 0)
                                        {
                                            //Cr  Sales Tax
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.GST, "GST Sale Voucher");
                                                }
                                            }
                                        }

                                        if (mISom.SERVICE_CHARGES > 0)
                                        {
                                            //Cr  Service Charges
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.SERVICE_CHARGES, "Service Charges Voucher");
                                                }
                                            }
                                        }

                                        if (ComplimentaryDiscount > 0)
                                        {
                                            //Dr Complimentary Discount
                                            //Cr Cash Sales
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Complimentary Discount Sale Voucher");
                                                }
                                            }
                                        }
                                    }
                                    else if (pPaymentModeId == 2)//Credit Sale
                                    {
                                        //Dr  Credit Sale Receivable
                                        //Cr  Credit Sales

                                        if (pPaidin > 0)
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pPaidin, 0, "Cash In Hand Sale Voucher");
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin, 0, "Credit Sale Voucher");
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pAmountDue > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue, "Credit Sale Voucher");
                                                }
                                            }
                                        }
                                        if (DiscountAmount > 0)
                                        {
                                            //Cr  Discount on Credit Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                                }
                                            }
                                        }

                                        if (BankDiscountPortion > 0)
                                        {
                                            //Cr  Discount on Credit Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), BankDiscountPortion, 0, "Discount Bank Portion Sale Voucher");
                                                }
                                            }
                                        }

                                        if (mISom.GST > 0)
                                        {
                                            //Cr  Sales Tax
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.GST, "GST Sale Voucher");
                                                }
                                            }
                                        }

                                        if (mISom.SERVICE_CHARGES > 0)
                                        {
                                            //Cr  Service Charges
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, mISom.SERVICE_CHARGES, "Service Charges Voucher");
                                                }
                                            }
                                        }

                                        if (ComplimentaryDiscount > 0)
                                        {
                                            //Dr Complimentary Discount
                                            //Cr Cash Sales
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Complimentary Discount Sale Voucher");
                                                }
                                            }
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if (IsVoucherPosted)
                                                {
                                                    IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Complimentary Discount Sale Voucher");
                                                }
                                            }
                                        }
                                    }
                                }

                                if (GLConsumption > 0)
                                {
                                    //Dr Consumption
                                    //Cr Stock in Trade
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Consumption + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (IsVoucherPosted)
                                        {
                                            IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), GLConsumption, 0, "Consumption Sale Voucher");
                                        }
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (IsVoucherPosted)
                                        {
                                            IsVoucherPosted = LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, GLConsumption, "Inventoryatstore Sale Voucher");
                                        }
                                    }
                                }
                            }
                            #endregion
                        }

                        #region Knock Off Advance
                        bool IsAdvanceknockOff = true;
                        if (pAdvanceAmount > 0)
                        {
                            DataRow[] drConfig3 = null;

                            LedgerController LController3 = new LedgerController();
                            string VoucherNo2 = LController3.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorId, 0);
                            drConfig3 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                            if (LController3.PostingCash_Bank_Account(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig3[0]["VALUE"].ToString()), pDistributorId, pAdvanceAmount, 0, pDocumentDate, "Advance Knock Off", DateTime.Now, int.Parse(pCustomerID.ToString()), 0, null, pUserId, mISom.SALE_INVOICE_ID, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, "AdvanceKnockOff", Constants.DateNullValue, Constants.CashSales, "") > 0)
                            {
                                IsAdvanceknockOff = true;
                            }
                            else
                            {
                                IsAdvanceknockOff = false;
                            }
                            if (IsAdvanceknockOff)
                            {
                                drConfig3 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                if (LController3.PostingCash_Bank_Account(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig3[0]["VALUE"].ToString()), pDistributorId, 0, pAdvanceAmount, pDocumentDate, "Advance Knock Off", DateTime.Now, int.Parse(pCustomerID.ToString()), 0, null, pUserId, mISom.SALE_INVOICE_ID, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, "AdvanceKnockOff", Constants.DateNullValue, Constants.CashSales, "") > 0)
                                {
                                    IsAdvanceknockOff = true;
                                }
                                else
                                {
                                    IsAdvanceknockOff = false;
                                }
                            }

                        }
                        #endregion
                        if (IsVoucherPosted && IsAdvanceknockOff)
                        {
                            mTransaction.Commit();
                        }
                        else
                        {
                            mTransaction.Rollback();
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
            return dtItems;
        }

        public static void InsertLessCancelItemConsumption(long pSALE_INVOICE_ID, DateTime pDocumentDate, int pDistributorId, int pCustomerTypeId, int pUserId, string pRecipeType, DataTable dtInvoiceDetail, bool IsFinanceIntegrate, DataTable dtCOAConfig, IDbConnection mConnection, IDbTransaction mTransaction)
        {
            decimal GLConsumption = 0;
            int RowIndex = 0;
            bool flagClosingStock = false;
            long SALE_INVOICE_DETAIL_ID = 0;
            bool Is_Production = false;
            try
            {
                foreach (DataRow dr in dtInvoiceDetail.Rows)
                {
                    SALE_INVOICE_DETAIL_ID = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);

                    #region Raw, Package and Consumption Material


                    uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };

                    mSkuInfo.FINISHED_SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    if (pRecipeType == "1")
                    {
                        mSkuInfo.TYPE_ID = 5;
                    }
                    else
                    {
                        mSkuInfo.TYPE_ID = 4;
                    }
                    mSkuInfo.DATE = pDocumentDate;
                    mSkuInfo.DISTRIBUTOR_ID = pDistributorId;

                    DataTable dtRaw = mSkuInfo.ExecuteTable();

                    if (dtRaw != null)
                    {
                        decimal StockQty = 0;
                        RowIndex = 0;
                        flagClosingStock = false;
                        Is_Production = false;
                        foreach (DataRow drRaw in dtRaw.Rows)
                        {
                            RowIndex++;
                            //===============INSERTION IN STOCK REGISETR===========================\\

                            UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                            mStockUpdate.Connection = mConnection;
                            mStockUpdate.Transaction = mTransaction;

                            mStockUpdate.PRINCIPAL_ID = 0;
                            mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                            mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                            mStockUpdate.STOCK_DATE = pDocumentDate;

                            mStockUpdate.PRICE = 0;

                            mStockUpdate.BATCHNO = "N/A";
                            mStockUpdate.SKU_ID = int.Parse(drRaw["SKU_ID"].ToString());

                            mStockUpdate.STOCK_QTY = 0;
                            mStockUpdate.CONSUMED = 0;
                            mStockUpdate.FREE_QTY = 0;
                            if (RowIndex == 1 && Convert.ToDecimal(drRaw["CLOSING_STOCK"]) <= 0)
                            {
                                flagClosingStock = true;
                            }
                            if (RowIndex == 1 && drRaw["Is_Production"].ToString() == "1")
                            {
                                Is_Production = true;
                            }

                            if (drRaw["Type"].ToString() == "Finish")
                            {
                                if (drRaw["IsModifierdItem"].ToString() == "1")
                                {
                                    StockQty = decimal.Parse(dr["QTY"].ToString());
                                }
                                else
                                {
                                    StockQty = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, decimal.Parse(dr["QTY"].ToString()), 0, "Finish");
                                }

                                if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "1")
                                {
                                    if (flagClosingStock)
                                    {
                                        mStockUpdate.STOCK_QTY = StockQty;
                                        mStockUpdate.CONSUMED = StockQty;
                                    }
                                }
                                else if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "0")
                                {
                                    mStockUpdate.STOCK_QTY = StockQty;
                                }
                                else if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "NOT EXIST" && drRaw["Is_Production"].ToString() == "0")
                                {
                                    mStockUpdate.STOCK_QTY = StockQty;
                                }
                            }
                            else if (drRaw["Type"].ToString() == "Raw")
                            {
                                if (Is_Production)
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True" && flagClosingStock)
                                    {
                                        if (drRaw["IsModifierdItem"].ToString() == "1")
                                        {
                                            mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                        }
                                        else
                                        {
                                            mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                        }
                                    }
                                }
                                else
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True")
                                    {
                                        if (drRaw["IsModifierdItem"].ToString() == "1")
                                        {
                                            mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                        }
                                        else
                                        {
                                            mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                        }
                                    }
                                }
                            }
                            else if (drRaw["Type"].ToString() == "Package")
                            {
                                if (drRaw["Is_Inventory"].ToString() == "True")
                                {
                                    if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                    {
                                        if (drRaw["IsModifierdItem"].ToString() == "1")
                                        {
                                            mStockUpdate.CONSUMED = decimal.Parse(dr["QTY"].ToString());
                                        }
                                        else
                                        {
                                            mStockUpdate.CONSUMED = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), 1, StockQty, decimal.Parse(drRaw["QUANTITY"].ToString()), "Raw");
                                        }
                                    }
                                }
                            }

                            mStockUpdate.ExecuteQuery();

                            //========================================================================\\

                            //=========================== CONSUMPTION TABLE===========================\\
                            #region Consumption

                            if (drRaw["Type"].ToString() == "Finish")
                            {
                                //if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST" && drRaw["Is_Production"].ToString() == "1")
                                if (drRaw["Is_Inventory"].ToString() == "True")
                                {
                                    if (flagClosingStock)
                                    {
                                        decimal price = Convert.ToDecimal(drRaw["LastPurPrice"]);
                                        decimal consumedqty = mStockUpdate.CONSUMED;
                                        if (price == 0)
                                        {
                                            price = decimal.Parse(dr["T_PRICE"].ToString());
                                        }
                                        if (consumedqty == 0)
                                        {
                                            if (dr["UOM_ID"].ToString() != dr["intStockMUnitCode"].ToString())
                                            {
                                                consumedqty = Conversion(dr["Stock_to_SaleOperator"].ToString(), decimal.Parse(dr["Stock_to_SaleFactor"].ToString()), 1, decimal.Parse(dr["QTY"].ToString()), 0, "Finish");
                                            }
                                            else
                                            {
                                                consumedqty = decimal.Parse(dr["QTY"].ToString());
                                            }
                                        }
                                        Consumption(pDistributorId, pSALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(dr["CAT_ID"].ToString()), price, consumedqty, consumedqty, false, "Finish", false, 0, mTransaction, mConnection);

                                        GLConsumption += price * consumedqty;
                                    }
                                }
                            }
                            else if (drRaw["Type"].ToString() == "Raw")
                            {
                                if (Is_Production)
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True" && flagClosingStock)
                                    {
                                        decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                        Consumption(pDistributorId, pSALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Raw", false, 0, mTransaction, mConnection);

                                        GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                    }
                                }
                                else
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True")
                                    {
                                        decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                        Consumption(pDistributorId, pSALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Raw", false, 0, mTransaction, mConnection);

                                        GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                    }
                                }
                            }
                            else if (drRaw["Type"].ToString() == "Package")
                            {
                                if (drRaw["Is_Inventory"].ToString() == "True")
                                {
                                    if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                    {
                                        decimal SaleQty = Conversion(drRaw["Stock_to_SaleOperator"].ToString(), decimal.Parse(drRaw["Stock_to_SaleFactor"].ToString()), decimal.Parse(drRaw["QUANTITY"].ToString()), mStockUpdate.CONSUMED, 0, "Raw");

                                        Consumption(pDistributorId, pSALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["LastPurPrice"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Package", false, 0, mTransaction, mConnection);

                                        GLConsumption += decimal.Parse(drRaw["LastPurPrice"].ToString()) * mStockUpdate.CONSUMED;
                                    }
                                }
                            }
                            #endregion
                            //========================================================================\\
                        }

                        if (RowIndex == 0)
                        {
                            UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                            mStockUpdate.Connection = mConnection;
                            mStockUpdate.Transaction = mTransaction;

                            mStockUpdate.PRINCIPAL_ID = 0;
                            mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                            mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                            mStockUpdate.STOCK_DATE = pDocumentDate;
                            mStockUpdate.PRICE = 0;
                            mStockUpdate.BATCHNO = "N/A";
                            mStockUpdate.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                            mStockUpdate.STOCK_QTY = decimal.Parse(dr["QTY"].ToString());
                            mStockUpdate.FREE_QTY = 0;
                            mStockUpdate.ExecuteQuery();
                        }
                    }

                    #endregion
                }
                #region Consumption Of Packing Material Of Deal

                DataView view = new DataView(dtInvoiceDetail);
                DataTable distinctDealIDs = view.ToTable(true, "I_D_ID");
                foreach (DataRow dr in distinctDealIDs.Rows)
                {
                    if (dr["I_D_ID"].ToString() != "0")
                    {
                        #region Package Material Consumption
                        uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                        {
                            Connection = mConnection,
                            Transaction = mTransaction
                        };
                        int DealID = Convert.ToInt32(dr["I_D_ID"]);
                        mSkuInfo.FINISHED_SKU_ID = Convert.ToInt32(dr["I_D_ID"]);
                        mSkuInfo.TYPE_ID = 3;
                        mSkuInfo.DATE = pDocumentDate;
                        mSkuInfo.DISTRIBUTOR_ID = pDistributorId;
                        DataTable dtRaw = mSkuInfo.ExecuteTable();

                        if (dtRaw != null)
                        {
                            RowIndex = 0;
                            flagClosingStock = false;
                            Is_Production = false;
                            foreach (DataRow drRaw in dtRaw.Rows)
                            {
                                //===============INSERTION IN STOCK REGISETR===========================\\

                                UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                mStockUpdate.Connection = mConnection;
                                mStockUpdate.Transaction = mTransaction;
                                mStockUpdate.PRINCIPAL_ID = 0;
                                mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                                mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                                mStockUpdate.STOCK_DATE = pDocumentDate;
                                mStockUpdate.PRICE = 0;
                                mStockUpdate.BATCHNO = "N/A";
                                mStockUpdate.SKU_ID = int.Parse(drRaw["SKU_ID"].ToString());
                                mStockUpdate.STOCK_QTY = 0;
                                mStockUpdate.CONSUMED = 0;
                                mStockUpdate.FREE_QTY = 0;

                                if (drRaw["Type"].ToString() == "Package")
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True")
                                    {
                                        if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                        {
                                            mStockUpdate.CONSUMED = Convert.ToDecimal(drRaw["QUANTITY"]);
                                        }
                                    }
                                }

                                mStockUpdate.ExecuteQuery();

                                #region Consumption

                                if (drRaw["Type"].ToString() == "Package")
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True")
                                    {
                                        if (pCustomerTypeId == int.Parse(drRaw["DineIn_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["Delivery_CUSTOMER_TYPE_ID"].ToString()) || pCustomerTypeId == int.Parse(drRaw["TakeAway_CUSTOMER_TYPE_ID"].ToString()))
                                        {
                                            decimal SaleQty = Convert.ToDecimal(drRaw["QUANTITY"]);
                                            Consumption(pDistributorId, pSALE_INVOICE_ID, SALE_INVOICE_DETAIL_ID, mStockUpdate.SKU_ID, int.Parse(drRaw["PRODUCT_CATEGORY_ID"].ToString()), decimal.Parse(drRaw["DISTRIBUTOR_PRICE"].ToString()), mStockUpdate.CONSUMED, SaleQty, false, "Package", true, DealID, mTransaction, mConnection);
                                            GLConsumption += decimal.Parse(drRaw["DISTRIBUTOR_PRICE"].ToString()) * mStockUpdate.CONSUMED;
                                        }
                                    }
                                }
                                #endregion
                            }
                        }

                        #endregion
                    }
                }

                #endregion

                if (IsFinanceIntegrate && GLConsumption > 0)
                {
                    #region GL Master, Detail
                    LedgerController LController = new LedgerController();
                    string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, pDistributorId, pDocumentDate);
                    if (LController.PostingGLMaster(pDistributorId, 0, VoucherNo, Constants.Journal_Voucher, pDocumentDate, Constants.Document_SaleInvoice, Convert.ToString(pSALE_INVOICE_ID), "Item LessCancel Consumption Voucher", pUserId, "Sale", Constants.Document_SaleInvoice, pSALE_INVOICE_ID))
                    {
                        DataRow[] drConfig = null;
                        //Dr Consumption
                        //Cr Stock in Trade
                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Consumption + "'");
                        if (drConfig.Length > 0)
                        {
                            LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), GLConsumption, 0, "Consumption Sale Voucher");
                        }
                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                        if (drConfig.Length > 0)
                        {
                            LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, GLConsumption, "Inventoryatstore Sale Voucher");
                        }
                    }
                    #endregion
                }
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
        }

        public static bool SplitOrder(long pSaleInvoiceId, string pBillFormat, int pPaymentMode, decimal pGSTPER, decimal pGSTPERCash, decimal pGSTPERCreditCard, decimal pGst, DataTable dtSplitDetail)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                List<int> Deal = new List<int>();
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                decimal amountdueNew = 0;
                decimal itemDiscount = 0;
                decimal DISCOUNTDeal = 0;
                DISCOUNTDeal = calculateDealDiscount(dtSplitDetail);
                amountdueNew = calculateDealPriceSplitOrder(dtSplitDetail);
                foreach (DataRow dr in dtSplitDetail.Rows)
                {
                    amountdueNew += decimal.Parse(dr["T_PRICE"].ToString()) * decimal.Parse(dr["QTY"].ToString());
                    itemDiscount += Convert.ToDecimal(dr["DISCOUNT"]);
                }
                itemDiscount = itemDiscount + DISCOUNTDeal;
                spUpdateSALE_INVOICE_MASTERSplitOrder mISomNew = new spUpdateSALE_INVOICE_MASTERSplitOrder();

                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.AMOUNTDUE = amountdueNew;
                mISomNew.GST = pGst;
                mISomNew.SALE_INVOICE_ID = pSaleInvoiceId;
                mISomNew.TYPE_ID = 1;
                mISomNew.ITEM_DISCOUNT = itemDiscount;
                mISomNew.ExecuteQuery();

                //Update Old Order
                foreach (DataRow dr in dtSplitDetail.Rows)
                {
                    uspDeleteItemInvoiceDetail mDelete = new uspDeleteItemInvoiceDetail();
                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.SALE_INVOICE_ID = mISomNew.SALE_INVOICE_ID2;
                    mDelete.SALE_INVOICE_DETAIL_ID = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                    mDelete.ITEM_DEAL_ID = Convert.ToInt32(dr["I_D_ID"]);
                    mDelete.QTY = Convert.ToDecimal(dr["QTY"]);
                    mDelete.ExecuteQuery();
                }
                decimal GSTReverse = 0;
                decimal amountDue = GetAmountDue(pSaleInvoiceId, mConnection, mTransaction);
                if (pBillFormat == "3")
                {
                    GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                    pGst = GSTReverse;
                    amountDue = amountDue - GSTReverse;
                }
                else if (pBillFormat == "4")
                {
                    if (pPaymentMode == 1)
                    {
                        decimal GSTPER2 = pGSTPERCash - pGSTPERCreditCard;
                        GSTReverse = amountDue - (amountDue / ((GSTPER2 + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                    else
                    {
                        GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                }
                spUpdateSALE_INVOICE_MASTERSplitOrder mISom = new spUpdateSALE_INVOICE_MASTERSplitOrder();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.AMOUNTDUE = amountDue;
                mISom.GST = pGst;
                mISom.ITEM_DISCOUNT = itemDiscount;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.TYPE_ID = 2;
                mISom.ExecuteQuery();
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public bool SplitOrderNew(long pSaleInvoiceId, string pBillFormat, int pPaymentMode, decimal pGSTPER, decimal pGSTPERCash, decimal pGSTPERCreditCard, decimal pGst, DataTable dtSplitDetail)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                List<int> Deal = new List<int>();
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                decimal amountdueNew = 0;
                amountdueNew = calculateDealPriceSplitOrder(dtSplitDetail);
                foreach (DataRow dr in dtSplitDetail.Rows)
                {
                    amountdueNew += decimal.Parse(dr["T_PRICE"].ToString()) * decimal.Parse(dr["QTY"].ToString());
                }

                spUpdateSALE_INVOICE_MASTERSplitOrder mISomNew = new spUpdateSALE_INVOICE_MASTERSplitOrder();

                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.AMOUNTDUE = amountdueNew;
                mISomNew.GST = pGst;
                mISomNew.SALE_INVOICE_ID = pSaleInvoiceId;
                mISomNew.TYPE_ID = 1;
                mISomNew.ExecuteQuery();

                //Update Old Order
                foreach (DataRow dr in dtSplitDetail.Rows)
                {
                    uspDeleteItemInvoiceDetail mDelete = new uspDeleteItemInvoiceDetail();
                    mDelete.Connection = mConnection;
                    mDelete.Transaction = mTransaction;
                    mDelete.SALE_INVOICE_ID = mISomNew.SALE_INVOICE_ID2;
                    mDelete.SALE_INVOICE_DETAIL_ID = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                    mDelete.ITEM_DEAL_ID = Convert.ToInt32(dr["I_D_ID"]);
                    mDelete.QTY = Convert.ToDecimal(dr["QTY"]);
                    mDelete.ExecuteQuery();
                }
                decimal GSTReverse = 0;
                decimal amountDue = GetAmountDue(pSaleInvoiceId, mConnection, mTransaction);
                if (pBillFormat == "3")
                {
                    GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                    pGst = GSTReverse;
                    amountDue = amountDue - GSTReverse;
                }
                else if (pBillFormat == "4")
                {
                    if (pPaymentMode == 1)
                    {
                        decimal GSTPER2 = pGSTPERCash - pGSTPERCreditCard;
                        GSTReverse = amountDue - (amountDue / ((GSTPER2 + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                    else
                    {
                        GSTReverse = amountDue - (amountDue / ((pGSTPER + 100) / 100));
                        pGst = GSTReverse;
                        amountDue = amountDue - GSTReverse;
                    }
                }
                spUpdateSALE_INVOICE_MASTERSplitOrder mISom = new spUpdateSALE_INVOICE_MASTERSplitOrder();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.AMOUNTDUE = amountDue;
                mISom.GST = pGst;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.TYPE_ID = 2;
                mISom.ExecuteQuery();
                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
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

        public static decimal calculateDealPrice(DataTable dtInvoiceDetail)
        {

            List<int> Deal = new List<int>();
            decimal amountDue = 0;
            bool IsFree = false;
            foreach (DataRow dr in dtInvoiceDetail.Rows)
            {
                if (!bool.Parse(dr["VOID"].ToString()))
                {
                    if (dr["IS_FREE"].ToString() != "")
                    {
                        if (dr["IS_FREE"].ToString() == "1")
                        {
                            IsFree = true;
                        }
                        else
                        {
                            IsFree = false;
                        }
                    }
                    else
                    {
                        IsFree = false;
                    }

                    if (int.Parse(dr["I_D_ID"].ToString()) > 0)
                    {
                        if (!IsFree)
                        {
                            if (!Deal.Contains(int.Parse(dr["I_D_ID"].ToString())))
                            {
                                Deal.Add(int.Parse(dr["I_D_ID"].ToString()));
                                amountDue += decimal.Parse(dr["A_PRICE"].ToString()) * decimal.Parse(dr["DEAL_QTY"].ToString());
                            }
                        }
                    }
                }
            }
            return amountDue;
        }
        public static decimal calculateDealDiscount(DataTable dtInvoiceDetail)
        {

            List<int> Deal = new List<int>();
            decimal discount = 0;
            bool IsFree = false;
            bool IsVoid = false;
            foreach (DataRow dr in dtInvoiceDetail.Rows)
            {
                try
                {
                    IsVoid = bool.Parse(dr["VOID"].ToString());
                }
                catch (Exception ex)
                {
                    IsVoid = false;
                }
                if (!IsVoid)
                {
                    try
                    {
                        if (dr["IS_FREE"].ToString() != "")
                        {
                            if (dr["IS_FREE"].ToString() == "1")
                            {
                                IsFree = true;
                            }
                            else
                            {
                                IsFree = false;
                            }
                        }
                        else
                        {
                            IsFree = false;
                        }
                    }
                    catch (Exception ex)
                    {
                        IsFree = false;
                    }

                    if (int.Parse(dr["I_D_ID"].ToString()) > 0)
                    {
                        if (!IsFree)
                        {
                            if (!Deal.Contains(int.Parse(dr["I_D_ID"].ToString())))
                            {
                                Deal.Add(int.Parse(dr["I_D_ID"].ToString()));
                                try
                                {
                                    discount += decimal.Parse(dr["DISCOUNTDeal"].ToString());
                                }
                                catch (Exception ex)
                                {
                                    discount += 0;
                                }
                            }
                        }
                    }
                }
            }
            return discount;
        }
        public static decimal calculateDealPriceSplitOrder(DataTable dtInvoiceDetail)
        {
            List<int> Deal = new List<int>();
            decimal amountDue = 0;
            foreach (DataRow dr in dtInvoiceDetail.Rows)
            {
                if (int.Parse(dr["I_D_ID"].ToString()) > 0)
                {
                    if (!Deal.Contains(int.Parse(dr["I_D_ID"].ToString())))
                    {
                        Deal.Add(int.Parse(dr["I_D_ID"].ToString()));
                        amountDue += decimal.Parse(dr["A_PRICE"].ToString()) * decimal.Parse(dr["QTY"].ToString());
                    }
                }
            }
            return amountDue;
        }
        public static decimal calculateComplimentaryDealAmount(DataTable dtInvoiceDetail)
        {

            List<int> Deal = new List<int>();
            decimal amountDue = 0;
            bool IsFree = false;
            foreach (DataRow dr in dtInvoiceDetail.Rows)
            {
                if (!bool.Parse(dr["VOID"].ToString()))
                {
                    if (dr["IS_FREE"].ToString() != "")
                    {
                        if (dr["IS_FREE"].ToString() == "1")
                        {
                            IsFree = true;
                        }
                        else
                        {
                            IsFree = false;
                        }
                    }
                    else
                    {
                        IsFree = false;
                    }

                    if (int.Parse(dr["I_D_ID"].ToString()) > 0)
                    {
                        if (IsFree)
                        {
                            if (!Deal.Contains(int.Parse(dr["I_D_ID"].ToString())))
                            {
                                Deal.Add(int.Parse(dr["I_D_ID"].ToString()));
                                amountDue += decimal.Parse(dr["A_PRICE"].ToString()) * decimal.Parse(dr["DEAL_QTY"].ToString());
                            }
                        }
                    }
                }
            }
            return amountDue;
        }

        private static Target CopyProperties<Source, Target>(Source source, Target target)
        {
            foreach (var sProp in source.GetType().GetProperties())
            {
                bool isMatched = target.GetType().GetProperties().Any(tProp => tProp.Name == sProp.Name && tProp.GetType() == sProp.GetType() && tProp.CanWrite);
                if (isMatched)
                {
                    var value = sProp.GetValue(source, null);
                    PropertyInfo propertyInfo = target.GetType().GetProperty(sProp.Name);
                    propertyInfo.SetValue(target, value, null);
                }
            }
            return target;
        }

        public static string Void_Order(long pSaleInvoiceId, int pUserId, DateTime pDocumentDate, int pDistributorId, int pTypeId, int pVoidReason)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdateSALE_INVOICE_MASTER mISom = new spUpdateSALE_INVOICE_MASTER();
                mISom.Connection = mConnection;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.USER_ID = pUserId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.IS_ACTIVE = false;
                mISom.POSTING = 0;
                mISom.TYPE_ID = pTypeId;
                mISom.ROLLBACK_REASON_ID = pVoidReason;
                string i = mISom.ExecuteScalar();
                return i;
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
        }
        public string Void_OrderNew(long pSaleInvoiceId, int pUserId, DateTime pDocumentDate, int pDistributorId, int pTypeId, int pVoidReason)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdateSALE_INVOICE_MASTER mISom = new spUpdateSALE_INVOICE_MASTER();
                mISom.Connection = mConnection;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.USER_ID = pUserId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.IS_ACTIVE = false;
                mISom.POSTING = 0;
                mISom.TYPE_ID = pTypeId;
                mISom.ROLLBACK_REASON_ID = pVoidReason;
                string i = mISom.ExecuteScalar();
                return i;
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
        }

        public static bool IsValidate(DataTable dtInvoiceDetail, DateTime Date, int DistributorId, IDbConnection mConnection, bool OversaleAllowed)
        {
            try
            {

                if (!OversaleAllowed)
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();

                    decimal QTY = 0;
                    decimal DEFAULT_QTY = 0;

                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        QTY = decimal.Parse(dr["QTY"].ToString());
                        DEFAULT_QTY = decimal.Parse(dr["DEFAULT_QTY"].ToString());
                        uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                        {
                            Connection = mConnection,
                        };

                        mSkuInfo.FINISHED_SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        mSkuInfo.TYPE_ID = 1;
                        mSkuInfo.DATE = Date;
                        mSkuInfo.DISTRIBUTOR_ID = DistributorId;

                        DataTable dtRaw = mSkuInfo.ExecuteTable();

                        if (dtRaw != null)
                        {
                            decimal STOCK_QTY = 0;

                            foreach (DataRow drRaw in dtRaw.Rows)
                            {
                                #region Finish

                                if (drRaw["Type"].ToString() == "Finish")
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "NOT EXIST")
                                    {
                                        if (STOCK_QTY > decimal.Parse(drRaw["CLOSING_STOCK"].ToString()))
                                        {
                                            if (mConnection != null && mConnection.State == ConnectionState.Open)
                                            {
                                                mConnection.Close();
                                            }

                                            throw new Exception("Closing Stock of " + drRaw["SKU_NAME"].ToString() + ": " + drRaw["CLOSING_STOCK"].ToString());
                                        }
                                    }
                                    if (drRaw["Is_Inventory"].ToString() == "True" && drRaw["CHECK"].ToString() == "EXIST")
                                    {
                                        if (drRaw["Is_Production"].ToString() == "1")
                                        {
                                            if (STOCK_QTY > decimal.Parse(drRaw["CLOSING_STOCK"].ToString()))
                                            {
                                                if (mConnection != null && mConnection.State == ConnectionState.Open)
                                                {
                                                    mConnection.Close();
                                                }

                                                throw new Exception("Closing Stock of " + drRaw["SKU_NAME"].ToString() + ": " + drRaw["CLOSING_STOCK"].ToString());
                                            }
                                        }
                                    }
                                }

                                #endregion

                                #region Raw and Pacakge

                                else if (drRaw["Type"].ToString() == "Raw" || drRaw["Type"].ToString() == "Package")
                                {
                                    if (drRaw["Is_Inventory"].ToString() == "True")
                                    {
                                        STOCK_QTY = Conversion(drRaw["Sale_to_StockOperator"].ToString(), decimal.Parse(drRaw["Sale_to_StockFactor"].ToString()), DEFAULT_QTY, QTY, decimal.Parse(drRaw["QUANTITY"].ToString()), drRaw["Type"].ToString());

                                        if (STOCK_QTY > decimal.Parse(drRaw["CLOSING_STOCK"].ToString()))
                                        {
                                            if (mConnection != null && mConnection.State == ConnectionState.Open)
                                            {
                                                mConnection.Close();
                                            }

                                            throw new Exception("Closing Stock of " + drRaw["SKU_NAME"].ToString() + ": " + drRaw["CLOSING_STOCK"].ToString());
                                        }
                                    }
                                }

                                #endregion
                            }
                        }
                    }
                    return true;
                }
                return true;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        /// <returns></returns>
        public static decimal Conversion(string Operator, decimal Factor, decimal DefaultQty, decimal Qty, decimal RawQty, string Type)
        {
            decimal STOCK_QTY = 0;
            if (Type == "Finish")
            {
                switch (Operator)
                {

                    case "+":
                        STOCK_QTY = Qty * (Factor + DefaultQty);
                        break;
                    case "-":
                        STOCK_QTY = Qty * (Factor - DefaultQty);
                        break;
                    case "/":
                        STOCK_QTY = Qty * (Factor / DefaultQty);
                        break;
                    case "%":
                        STOCK_QTY = Qty * (Factor % DefaultQty);
                        break;
                    default:
                        STOCK_QTY = Qty * (Factor * DefaultQty);
                        break;
                }
            }
            else
            {

                switch (Operator)
                {
                    case "+":
                        STOCK_QTY = (Factor + DefaultQty) * (Qty * RawQty);
                        break;
                    case "-":
                        STOCK_QTY = (Factor - DefaultQty) * (Qty * RawQty);
                        break;
                    case "/":
                        STOCK_QTY = (Factor / DefaultQty) * (Qty * RawQty);
                        break;
                    case "%":
                        STOCK_QTY = (Factor % DefaultQty) * (Qty * RawQty);
                        break;
                    default:
                        STOCK_QTY = (Factor * DefaultQty) * (Qty * RawQty);
                        break;
                }
            }
            return STOCK_QTY;
        }

        public static string Consumption(int p_Distributor_id, long p_SALE_INVOICE_ID, long p_SALE_INVOICE_DETAIL_ID, int p_SKU_ID, int p_PRODUCT_CATEGORY_ID, decimal p_PRICE, decimal p_Qty, decimal p_SaleQty, bool p_IS_VOID, string p_Remarks, bool p_IS_DEAL, int p_DEAL_ID, IDbTransaction mTransaction, IDbConnection mConnection)
        {
            try
            {
                spInsertSALE_INVOICE_CONSUMED mISom = new spInsertSALE_INVOICE_CONSUMED();
                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;

                //------------Insert into GL Master----------

                mISom.DISTRIBUTOR_ID = p_Distributor_id;
                mISom.SALE_INVOICE_ID = p_SALE_INVOICE_ID;
                mISom.SALE_INVOICE_DETAIL_ID = p_SALE_INVOICE_DETAIL_ID;
                mISom.SKU_ID = p_SKU_ID;
                mISom.PRODUCT_CATEGORY_ID = p_PRODUCT_CATEGORY_ID;
                mISom.PRICE = p_PRICE;
                mISom.QTY = p_Qty;
                mISom.SaleQty = p_SaleQty;
                mISom.IS_VOID = p_IS_VOID;
                mISom.REMARKS = p_Remarks;
                mISom.IS_DEAL = p_IS_DEAL;
                mISom.DEAL_ID = p_DEAL_ID;
                mISom.ExecuteQuery();

                return "true";

            }

            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                throw exp;
            }

        }

        public static bool Update_Invoice_AS_Paid(long pSaleInvoiceId, int pDistributorId)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.KDS_TIME = DateTime.Now;
                mISom.TYPE_ID = 2;
                string i = mISom.ExecuteScalar();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public static bool InvoiceCallback(long pSaleInvoiceId, int pDistributorId)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.KDS_TIME = DateTime.Now;
                mISom.TYPE_ID = 4;
                string i = mISom.ExecuteScalar();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public static bool RecallKDSQA(long pSaleInvoiceId, int pDistributorId)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.KDS_TIME = DateTime.Now;
                mISom.TYPE_ID = 5;
                string i = mISom.ExecuteScalar();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public static bool Update_Item_AS_Ready(long p_SaleInvoice_Detail_Id, bool p_IsReady)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.SALE_INVOICE_ID = p_SaleInvoice_Detail_Id;
                mISom.IS_HOLD = p_IsReady;
                string i = mISom.ExecuteScalarForItemAsReady();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public static bool Update_Item_AS_Served(long p_SaleInvoice_Detail_Id, bool p_IsReady)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.SALE_INVOICE_ID = p_SaleInvoice_Detail_Id;
                mISom.IS_HOLD = p_IsReady;
                string i = mISom.ExecuteScalarForItemAsServed();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }
        public static bool Update_kitchenInvoice(long pSaleInvoiceId, int pKitchenUserId, DateTime pCloseTime, int pDistributorId)
        {

            IDbConnection mConnection = null;

            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();


                spUpdateSALE_INVOICE_KITCHEN mISom = new spUpdateSALE_INVOICE_KITCHEN();

                mISom.Connection = mConnection;


                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.CLOSE_TIME = pCloseTime;
                mISom.USER_ID = pKitchenUserId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;

                mISom.ExecuteQuery();


                return true;
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
        }
        public DataTable UpdateOrder(long pSaleInvoiceId, int pKitchenUserId, int porderBookerId, int pDistributorId, int pTypeID)
        {
            IDbConnection mConnection = null;
            DataTable dt = new DataTable();
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                spUpdateSALE_INVOICE_DeliveryMan mISom = new spUpdateSALE_INVOICE_DeliveryMan();
                mISom.Connection = mConnection;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.orderBookerId = porderBookerId;
                mISom.USER_ID = pKitchenUserId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.TypeID = pTypeID;
                dt = mISom.ExecuteTable();
                return dt;
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
        }

        public static bool ShiftOrder(long pSaleInvoiceId, int pCustomerTypeId, int pTableId, int pUserId, DateTime pDocumentDate, int pDistributorId, int pOrderBookerId, string pCovertTable, string pTakeAwayCustomer, long pCustomerID)
        {

            IDbConnection mConnection = null;

            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();

                spUpdateSALE_INVOICE_MASTER mISom = new spUpdateSALE_INVOICE_MASTER();

                mISom.Connection = mConnection;

                mISom.DISTRIBUTOR_ID = pDistributorId;
                if (pCustomerTypeId == 1)
                {
                    mISom.TAKEAWAY_CUSTOMER = "";
                    mISom.CUSTOMER_ID = 0;
                }
                else if (pCustomerTypeId == 2)
                {
                    mISom.TAKEAWAY_CUSTOMER = "";
                    mISom.coverTable = "";
                    mISom.TABLE_ID = 0;
                    mISom.CUSTOMER_ID = pCustomerID;
                }
                else if (pCustomerTypeId == 3)
                {
                    mISom.coverTable = "";
                    mISom.TABLE_ID = 0;
                    mISom.CUSTOMER_ID = 0;
                }
                mISom.IS_HOLD = true;
                mISom.CUSTOMER_TYPE_ID = pCustomerTypeId;
                mISom.TABLE_ID = pTableId;
                mISom.USER_ID = pUserId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.IS_ACTIVE = true;
                mISom.POSTING = 0;
                mISom.orderBookerId = pOrderBookerId;
                mISom.coverTable = pCovertTable;
                mISom.TAKEAWAY_CUSTOMER = pTakeAwayCustomer;
                mISom.ExecuteQuery();


                return true;
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
        }

        public static bool UpdateTakeawayOrderStatus(long pSaleInvoiceId, int pOrderStatusID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UpdateTakeawayOrderStatus mISom = new UpdateTakeawayOrderStatus();
                mISom.Connection = mConnection;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.Order_Delivery_Status_ID = pOrderStatusID;
                mISom.ExecuteQuery();
                return true;
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
        }

        public static bool UpdatePrint(DataTable dtItem)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetUpdateSaleDetailPrintQtyWS mISom = new uspGetUpdateSaleDetailPrintQtyWS();
                mISom.Connection = mConnection;
                foreach (DataRow dr in dtItem.Rows)
                {
                    mISom.SALE_INVOICE_ID = Convert.ToInt64(dr["SALE_INVOICE_ID"]);
                    mISom.SKU_ID = Convert.ToInt32(dr["SKU_ID"]);
                    mISom.ExecuteQuery();
                }
                return true;
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
        }
        public bool UpdatePrintNew(DataTable dtItem)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetUpdateSaleDetailPrintQtyWS mISom = new uspGetUpdateSaleDetailPrintQtyWS();
                mISom.Connection = mConnection;
                foreach (DataRow dr in dtItem.Rows)
                {
                    mISom.SALE_INVOICE_ID = Convert.ToInt64(dr["SALE_INVOICE_ID"]);
                    mISom.SKU_ID = Convert.ToInt32(dr["SKU_ID"]);
                    mISom.ExecuteQuery();
                }
                return true;
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
        }

        #region Rollback

        /// <summary>
        /// Rollbacks Order, Invoice And Sale Return
        /// </summary>
        /// <param name="p_DocumentId">Document</param>
        /// <param name="p_Type_Id">Type</param>
        /// <param name="p_LegendId">Legend</param>
        /// <returns>True On Success And False On Failure</returns>
        public bool UpdateRollBackDocument(long p_DocumentId, int p_Type_Id, int p_LegendId, int p_VOID_BY, Int16 p_ROLLBACK_REASON_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UspRollBackDocument mOrder = new UspRollBackDocument();
                mOrder.Connection = mConnection;
                mOrder.DOCUMENT_ID = p_DocumentId;
                mOrder.DOCUMENT_TYPE = p_Type_Id;
                mOrder.LEGEND_ID = p_LegendId;
                mOrder.VOID_BY = p_VOID_BY;
                mOrder.ROLLBACK_REASON_ID = p_ROLLBACK_REASON_ID;
                mOrder.ExecuteQuery();
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
        public bool UpdateRollBackDocument(long p_DocumentId, int p_Type_Id, int p_LegendId, int p_VOID_BY, Int16 p_ROLLBACK_REASON_ID, string p_RollBackType, int p_DistributorID, DateTime p_DocumentDate
            , int p_ServiceTypeID, int p_PaymentModeId, int p_DeliveryChannelID, int p_BANK_ID, decimal p_ServiceCharges, decimal p_Amount, decimal p_GST, decimal p_Discount, decimal p_Paidin, bool IsFinanceIntegrate, DataTable dtCOAConfig)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UspRollBackDocument mOrder = new UspRollBackDocument();
                mOrder.Connection = mConnection;
                mOrder.DOCUMENT_ID = p_DocumentId;
                mOrder.DOCUMENT_TYPE = p_Type_Id;
                mOrder.LEGEND_ID = p_LegendId;
                mOrder.VOID_BY = p_VOID_BY;
                mOrder.ROLLBACK_REASON_ID = p_ROLLBACK_REASON_ID;
                if (mOrder.ExecuteQuery())
                {
                    if (p_RollBackType == "0")
                    {
                        if (IsFinanceIntegrate)
                        {
                            #region GL Master, Detail

                            LedgerController LController = new LedgerController();

                            string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, p_DistributorID, p_DocumentDate);

                            if (LController.PostingGLMaster(p_DistributorID, 0, VoucherNo, Constants.Journal_Voucher, p_DocumentDate, Constants.Document_SaleInvoice, Convert.ToString(p_DocumentId), "Sale Return Voucher, Inv#: " + p_DocumentId.ToString(), p_VOID_BY, "SaleRetrun", Constants.CashSaleReturn, p_DocumentId))
                            {
                                DataRow[] drConfig = null;

                                if (p_ServiceTypeID == 2 && p_DeliveryChannelID > 0)
                                {
                                    //Dr Third Party Delivery
                                    //Cr Credit Sale

                                    if (p_Amount + p_GST + p_ServiceCharges - p_Discount > 0)
                                    {
                                        drConfig = dtCOAConfig.Select("CODE = '" + p_DeliveryChannelID + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Amount + p_GST + p_ServiceCharges - p_Discount, "Third Party Delivery Sale Return Voucher");
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_Amount, 0, "Third Party Delivery Sale Return Voucher");
                                            }
                                        }
                                    }

                                    if (p_Discount > 0)
                                    {
                                        //Cr  Discount on Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Discount, "Discount Sale Return Voucher");
                                        }
                                    }

                                    if (p_GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_GST, 0, "GST Sale Return Voucher");
                                        }
                                    }

                                    if (p_ServiceCharges > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_ServiceCharges, 0, "Service Charges Return Voucher");
                                        }
                                    }
                                }
                                else
                                {
                                    if (p_PaymentModeId == 0)
                                    {
                                        //Dr Cash in Hand
                                        //Cr Cash Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (p_Amount + p_GST + p_ServiceCharges - p_Discount > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Amount + p_GST + p_ServiceCharges - p_Discount, "Cash In Hand Sale Return Voucher");
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_Amount, 0, "Sale Return Voucher");
                                        }
                                        if (p_Discount > 0)
                                        {
                                            //Cr  Discount on Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Discount, "Discount Sale Return Voucher");
                                            }
                                        }
                                    }
                                    else if (p_PaymentModeId == 1)//Credit Card Sale
                                    {
                                        //Dr  Credit Card Sale Receivable
                                        //Cr  Credit Sales

                                        if (p_Paidin > 0)
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Paidin, "Cash In Hand Sale Return Voucher");
                                            }
                                        }

                                        if (p_BANK_ID > 0)
                                        {
                                            if ((p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, p_BANK_ID, 0, (p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin, "Credit Card Sale Return Voucher");
                                            }
                                        }
                                        else
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSaleReceivable + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                if ((p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin > 0)
                                                {
                                                    LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, (p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin, "Credit Card Sale Return Voucher");
                                                }
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_Amount - p_Paidin, 0, "Credit Card Sale Return Voucher");
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_Paidin, 0, "Cash In Hand Sale Return Voucher");
                                        }

                                        if (p_Discount > 0)
                                        {
                                            //Cr  Discount on Credit Card Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonCreditCardSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Discount, "Discount Sale Return Voucher");
                                            }
                                        }
                                    }
                                    else if (p_PaymentModeId == 2)//Credit Sale
                                    {
                                        //Dr  Credit Sale Receivable
                                        //Cr  Credit Sales

                                        if (p_Paidin > 0)
                                        {
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Paidin, "Cash In Hand Sale Return Voucher");
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if ((p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, (p_Amount + p_GST + p_ServiceCharges - p_Discount) - p_Paidin, "Credit Sale Return Voucher");
                                            }
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_Amount, 0, "Credit Sale Return Voucher");
                                        }
                                        if (p_Discount > 0)
                                        {
                                            //Cr  Discount on Credit Sale
                                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                            if (drConfig.Length > 0)
                                            {
                                                LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, p_Discount, "Discount Sale Return Voucher");
                                            }
                                        }
                                    }
                                    if (p_GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_GST, 0, "GST Sale Return Voucher");
                                        }
                                    }
                                    if (p_ServiceCharges > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(p_DistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), p_ServiceCharges, 0, "Service Charges Return Voucher");
                                        }
                                    }
                                }
                            }
                            #endregion
                        }
                    }
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
        public bool UpdateRollBackDocumentStock(long p_DocumentId, int p_DistributorId, DateTime p_DocumentDate, int p_Type_Id, int p_VOID_BY, Int16 p_ROLLBACK_REASON_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                UspRollBackDocument mOrder = new UspRollBackDocument();
                mOrder.Connection = mConnection;
                mOrder.DOCUMENT_ID = p_DocumentId;
                mOrder.DOCUMENT_TYPE = p_Type_Id;
                mOrder.VOID_BY = p_VOID_BY;
                mOrder.ROLLBACK_REASON_ID = p_ROLLBACK_REASON_ID;
                mOrder.ExecuteQuery();

                DataTable dt = GetInvoiceDetail(p_DocumentId);
                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.TYPEID = 11;
                    mPurchaseStock.DISTRIBUTOR_ID = p_DistributorId;
                    mPurchaseStock.PURCHASE_DETAIL_ID = 0;
                    mPurchaseStock.DATE = p_DocumentDate;
                    mPurchaseStock.QTY = Convert.ToDecimal(dr["QTY"]);
                    mPurchaseStock.PURCHASE_MASTER_ID = p_DocumentId;
                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
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
        public bool UpdateInvoiceNumberRollBackTaxAuthority(long p_SALE_INVOICE_ID, string p_InvoiceNumberRollBackTaxAuthority)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspUpdateInvoiceNumberRollBackTaxAuthority mOrder = new uspUpdateInvoiceNumberRollBackTaxAuthority();
                mOrder.Connection = mConnection;
                mOrder.SALE_INVOICE_ID = p_SALE_INVOICE_ID;
                mOrder.InvoiceNumberRollBackTaxAuthority = p_InvoiceNumberRollBackTaxAuthority;
                mOrder.ExecuteQuery();
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

        #endregion

        #region RIMS

        public long Add_RIMSInvoice(int pTableId, int pDistributorId, int pUserId, long pInvoiceId)
        {

            IDbConnection mConnection = null;

            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();


                spInsertRIMS_INVOICE_MASTER mISom = new spInsertRIMS_INVOICE_MASTER
                {
                    Connection = mConnection,

                    DATE = DateTime.Now,
                    TIME = DateTime.Now,
                    TABLE_NO = pTableId,
                    DISTRIBUTOR_ID = pDistributorId,
                    USER_ID = pUserId,
                    INVOICE_ID = pInvoiceId

                };
                mISom.ExecuteQuery();


                //spInsertRIMS_INVOICE_DETAIL mSaleInvoiceDetail = new spInsertRIMS_INVOICE_DETAIL
                //{
                //    Connection = mConnection,
                //    Transaction = mTransaction
                //};
                //foreach (DataRow dr in dtInvoiceDetail.Rows)
                //{
                //    mSaleInvoiceDetail.ID = mISom.ID;
                //    mSaleInvoiceDetail.PRICE = decimal.Parse(dr["T_PRICE"].ToString());
                //    mSaleInvoiceDetail.QTY = Convert.ToInt32(Convert.ToDecimal(dr["QTY"].ToString()));
                //    mSaleInvoiceDetail.CODE = int.Parse(dr["SKU_CODE"].ToString());
                //    mSaleInvoiceDetail.NAME = dr["SKU_NAME"].ToString();
                //    mSaleInvoiceDetail.DISTRIBUTOR_ID = pDistributorId;
                //    mSaleInvoiceDetail.ExecuteQuery();
                //}
                //mTransaction.Commit();
                return mISom.ID;
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

        }

        public bool Update_RIMSInvoice(int pDistributorId, bool pSync, long pInvoiceId)
        {

            IDbConnection mConnection = null;

            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();


                spUpdateRIMS_INVOICE_MASTER mISom = new spUpdateRIMS_INVOICE_MASTER
                {
                    Connection = mConnection,


                    DISTRIBUTOR_ID = pDistributorId,
                    SYNC = pSync,
                    ID = pInvoiceId

                };
                mISom.ExecuteQuery();

                return true;

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

        }

        #endregion

        public long InsertSaleInvoice(decimal pAmountDue,int pDistributorID,DateTime pWorkingDate, long pCustomerID,decimal pPaidIn,int pPaymentMode,int pUserID,string pRemarks,decimal pItemDiscount,decimal pExtraDiscount, DataTable dtInvoiceDetail, bool IsFinanceIntegrate, DataTable dtCOAConfig)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();
                    mTransaction = ProviderFactory.GetTransaction(mConnection);

                    #region Insert Master Table
                    spInsertSALE_INVOICE_MASTER mISom = new spInsertSALE_INVOICE_MASTER
                    {
                        Connection = mConnection,
                        Transaction = mTransaction,
                        AMOUNTDUE = pAmountDue,
                        CUSTOMER_ID = pCustomerID,
                        DISTRIBUTOR_ID = pDistributorID,
                        DOCUMENT_DATE = pWorkingDate,
                        PAIDIN = pPaidIn,
                        PAYMENT_MODE_ID = pPaymentMode,
                        USER_ID = pUserID,
                        REMARKS = pRemarks,
                        ITEM_DISCOUNT = pItemDiscount,
                        EXTRA_DISCOUNT = pExtraDiscount,
                        CUSTOMER_TYPE_ID = 3,
                        DeliveryType = 0,
                        DELIVERY_CHANNEL = 0,
                        IS_HOLD = false,
                        FORM_ID = 10
                    };
                    mISom.ExecuteQuery();
                    #endregion

                    #region Insert Detail Table
                    spInsertSALE_INVOICE_DETAIL mSaleInvoiceDetail = new spInsertSALE_INVOICE_DETAIL
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        mSaleInvoiceDetail.SALE_INVOICE_ID = mISom.SALE_INVOICE_ID;
                        mSaleInvoiceDetail.IS_VOID = false;
                        mSaleInvoiceDetail.DISTRIBUTOR_ID = pDistributorID;
                        mSaleInvoiceDetail.REMARKS = "H";
                        mSaleInvoiceDetail.IS_FREE = false;
                        mSaleInvoiceDetail.PRICE = Convert.ToDecimal(dr["PRICE"]);
                        mSaleInvoiceDetail.QTY = decimal.Parse(dr["Quantity"].ToString());
                        mSaleInvoiceDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        mSaleInvoiceDetail.intSaleMUnitCode = int.Parse(dr["UOM_ID"].ToString());
                        mSaleInvoiceDetail.DealDetailQTY = decimal.Parse(dr["Quantity"].ToString());
                        mSaleInvoiceDetail.DISCOUNT = decimal.Parse(dr["DISCOUNT"].ToString());
                        mSaleInvoiceDetail.EXTRA_DISCOUNT = dr["DISCOUNT_PERCENT"].ToString();
                        mSaleInvoiceDetail.TIME_STAMP2 = System.DateTime.Now;
                        mSaleInvoiceDetail.ExecuteQuery();

                        #region Update Stock
                        UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                        mStockUpdate.Connection = mConnection;
                        mStockUpdate.Transaction = mTransaction;
                        mStockUpdate.PRINCIPAL_ID = 0;
                        mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                        mStockUpdate.DISTRIBUTOR_ID = pDistributorID;
                        mStockUpdate.STOCK_DATE = pWorkingDate;
                        mStockUpdate.PRICE = 0;
                        mStockUpdate.BATCHNO = "N/A";
                        mStockUpdate.SKU_ID = Convert.ToInt32(dr["SKU_ID"]);
                        mStockUpdate.STOCK_QTY = Convert.ToDecimal(dr["Quantity"]);
                        mStockUpdate.CONSUMED = 0;
                        mStockUpdate.FREE_QTY = 0;
                        mStockUpdate.ExecuteQuery();
                        #endregion
                    }
                    #endregion

                    #region Credit Invoice
                    if (pPaymentMode == 2)//Credit Sale
                    {
                        DataRow[] drConfig2 = null;

                        LedgerController LController2 = new LedgerController();
                        string VoucherNo2 = LController2.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorID, 0);

                        drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                        LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorID, pAmountDue - pItemDiscount - pExtraDiscount, 0, pWorkingDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, string.Empty, Constants.Document_SaleInvoice, pUserID, mTransaction, mConnection, Constants.CreditSale, string.Empty);
                        drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                        LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorID, 0, pAmountDue - pItemDiscount - pExtraDiscount, pWorkingDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, string.Empty, Constants.Document_SaleInvoice, pUserID, mTransaction, mConnection, Constants.CreditSale, string.Empty);
                    }
                    else if (pPaymentMode == 0)//Cash Sale
                    {
                        DataRow[] drConfig2 = null;

                        LedgerController LController2 = new LedgerController();
                        string VoucherNo2 = LController2.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorID, 0);

                        drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                        LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorID, pAmountDue + -pItemDiscount - pExtraDiscount, 0, pWorkingDate, "Cash Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, string.Empty, Constants.Document_SaleInvoice, pUserID, mTransaction, mConnection, Constants.CashSales, string.Empty);

                        drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                        LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorID, 0, pAmountDue + -pItemDiscount - pExtraDiscount, pWorkingDate, "Cash Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), mISom.SALE_INVOICE_ID, string.Empty, Constants.Document_SaleInvoice, pUserID, mTransaction, mConnection, Constants.CashSales, string.Empty);
                    }
                    #endregion

                    if (IsFinanceIntegrate)
                    {
                        #region GL Master, Detail

                        LedgerController LController = new LedgerController();
                        string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, pDistributorID, pWorkingDate);
                        if (LController.PostingGLMaster(pDistributorID, 0, VoucherNo, Constants.Journal_Voucher, pWorkingDate, Constants.Document_SaleInvoice, Convert.ToString(mISom.SALE_INVOICE_ID), "Sale Voucher", pUserID, "Sale", Constants.Document_SaleInvoice, mISom.SALE_INVOICE_ID))
                        {
                            DataRow[] drConfig = null;
                            if (pPaymentMode == 0)
                            {
                                //Dr Cash in Hand
                                //Cr Cash Sale
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                if (drConfig.Length > 0)
                                {
                                    if (pAmountDue - pItemDiscount - pExtraDiscount > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue + -pItemDiscount - pExtraDiscount, 0, "Cash In Hand Sale Voucher");
                                    }
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue, "Sale Voucher");
                                }
                                if (pItemDiscount + pExtraDiscount > 0)
                                {
                                    //Cr  Discount on Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pItemDiscount + pExtraDiscount, 0, "Discount Sale Voucher");
                                    }
                                }
                            }
                            else if (pPaymentMode == 2)//Credit Sale
                            {
                                //Dr  Credit Sale Receivable
                                //Cr  Credit Sales
                                
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                                if (drConfig.Length > 0)
                                {
                                    if ((pAmountDue - pItemDiscount - pExtraDiscount) > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue - pItemDiscount - pExtraDiscount, 0, "Credit Sale Voucher");
                                    }
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue, "Credit Sale Voucher");
                                }
                                if (pItemDiscount + pExtraDiscount > 0)
                                {
                                    //Cr  Discount on Credit Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pItemDiscount + pExtraDiscount, 0, "Discount Sale Voucher");
                                    }
                                }
                            }
                        }
                        #endregion
                    }

                    mTransaction.Commit();
                    return mISom.SALE_INVOICE_ID;
                }
                else
                {
                    return Constants.LongNullValue;
                }
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
        public long InsertSALE_INVOICE_MASTER(spInsertSALE_INVOICE_MASTER mISom)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spInsertSALE_INVOICE_MASTER mISomNew = new spInsertSALE_INVOICE_MASTER();
                mISomNew = mISom;
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.ExecuteQuery();
                mTransaction.Commit();
                return mISomNew.SALE_INVOICE_ID;
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

        public long InsertSALE_INVOICE_DETAIL(spInsertSALE_INVOICE_DETAIL mISom)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spInsertSALE_INVOICE_DETAIL mISomNew = new spInsertSALE_INVOICE_DETAIL();
                mISomNew = mISom;
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.ExecuteQuery();
                mTransaction.Commit();

                return mISomNew.SALE_INVOICE_DETAIL_ID;
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

        public void UpdateStockGLDetail(DataTable dtInvoiceDetail, DateTime pDocumentDate, int pDistributorId, bool IsFinanceIntegrate, DataTable dtCOAConfig, int pCustomerTypeId, int pDiscType, decimal pAmountdue, decimal pDiscount, decimal itemDiscount, int pPaymentModeId, int pDeliveryChannelID, decimal pServiceCharges, decimal gst, decimal pPaidin, int p_BANK_ID, long p_SaleInvoiceId, int pUserId, string pMANUAL_ORDER_NO, long pCustomerID, int orderBookerId)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;

            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                DataTable dt = GetInvoiceDetail(p_SaleInvoiceId, mConnection, mTransaction);
                foreach (DataRow dr in dt.Rows)
                {
                    UspUpdatePurchaseDetailStock mPurchaseStock = new UspUpdatePurchaseDetailStock();
                    mPurchaseStock.Connection = mConnection;
                    mPurchaseStock.Transaction = mTransaction;
                    mPurchaseStock.TYPEID = 11;
                    mPurchaseStock.DISTRIBUTOR_ID = pDistributorId;
                    mPurchaseStock.PURCHASE_DETAIL_ID = 0;
                    mPurchaseStock.DATE = pDocumentDate;
                    mPurchaseStock.QTY = Convert.ToDecimal(dr["QTY"]);
                    mPurchaseStock.PURCHASE_MASTER_ID = p_SaleInvoiceId;
                    mPurchaseStock.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                    mPurchaseStock.ExecuteQuery();
                }

                foreach (DataRow dr in dtInvoiceDetail.Rows)
                {
                    UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                    mStockUpdate.Connection = mConnection;
                    mStockUpdate.Transaction = mTransaction;
                    mStockUpdate.PRINCIPAL_ID = 0;
                    mStockUpdate.TYPE_ID = Constants.Document_Invoice;
                    mStockUpdate.DISTRIBUTOR_ID = pDistributorId;
                    mStockUpdate.STOCK_DATE = pDocumentDate;
                    mStockUpdate.PRICE = 0;
                    mStockUpdate.BATCHNO = "N/A";
                    mStockUpdate.SKU_ID = Convert.ToInt32(dr["SKU_ID"]);
                    mStockUpdate.STOCK_QTY = Convert.ToDecimal(dr["Quantity"]);
                    mStockUpdate.CONSUMED = 0;
                    mStockUpdate.FREE_QTY = 0;
                    mStockUpdate.ExecuteQuery();
                }

                decimal DiscountAmount = 0;
                if (pDiscType == 0)
                {
                    DiscountAmount = pAmountdue * pDiscount / 100;
                }
                else
                {
                    DiscountAmount = pDiscount;
                }
                DiscountAmount += itemDiscount;

                #region Credit Invoice
                if (pPaymentModeId == 2)//Credit Sale
                {
                    DataRow[] drConfig2 = null;

                    LedgerController LController2 = new LedgerController();
                    string VoucherNo2 = LController2.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorId, 0);

                    drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                    LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, pAmountdue + gst + pServiceCharges - DiscountAmount, 0, pDocumentDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), p_SaleInvoiceId, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CreditSale, orderBookerId.ToString());

                    drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                    LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, 0, pAmountdue + gst + pServiceCharges - DiscountAmount, pDocumentDate, "Credit Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), p_SaleInvoiceId, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CreditSale, orderBookerId.ToString());
                }
                else if (pPaymentModeId == 0)//Cash Sale
                {
                    DataRow[] drConfig2 = null;

                    LedgerController LController2 = new LedgerController();
                    string VoucherNo2 = LController2.SelectLedgerMaxDocumentId(Constants.Journal_Voucher, pDistributorId, 0);

                    drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                    LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, pAmountdue + gst + pServiceCharges - DiscountAmount, 0, pDocumentDate, "Cash Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), p_SaleInvoiceId, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CashSales, orderBookerId.ToString());

                    drConfig2 = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                    LController2.PostingInvoiceAccount(Constants.Journal_Voucher, long.Parse(VoucherNo2), long.Parse(drConfig2[0]["VALUE"].ToString()), pDistributorId, 0, pAmountdue + gst + pServiceCharges - DiscountAmount, pDocumentDate, "Cash Sale Default", DateTime.Now, 0, int.Parse(pCustomerID.ToString()), p_SaleInvoiceId, pMANUAL_ORDER_NO, Constants.Document_SaleInvoice, pUserId, mTransaction, mConnection, Constants.CashSales, orderBookerId.ToString());
                }
                #endregion

                if (IsFinanceIntegrate)
                {
                    #region GL Master, Detail

                    LedgerController LController = new LedgerController();

                    string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, pDistributorId, pDocumentDate);

                    if (LController.PostingGLMaster(pDistributorId, 0, VoucherNo, Constants.Journal_Voucher, pDocumentDate, Constants.Document_SaleInvoice, Convert.ToString(p_SaleInvoiceId), "Sale Voucher", pUserId, "Sale", Constants.Document_SaleInvoice, p_SaleInvoiceId))
                    {
                        DataRow[] drConfig = null;

                        if (pCustomerTypeId == 2 && pDeliveryChannelID > 0)
                        {
                            //Dr Third Party Delivery
                            //Cr Credit Sale

                            if (pAmountdue + gst + pServiceCharges - DiscountAmount > 0)
                            {
                                drConfig = dtCOAConfig.Select("CODE = '" + pDeliveryChannelID + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountdue + gst + pServiceCharges - DiscountAmount, 0, "Third Party Delivery Sale Voucher");
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountdue - DiscountAmount, "Third Party Delivery Sale Voucher");
                                    }
                                }
                            }

                            if (DiscountAmount > 0)
                            {
                                //Cr  Discount on Sale
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                }
                            }
                        }
                        else
                        {
                            if (pPaymentModeId == 0)
                            {
                                //Dr Cash in Hand
                                //Cr Cash Sale
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                if (drConfig.Length > 0)
                                {
                                    if (pAmountdue + gst + pServiceCharges - DiscountAmount > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountdue + gst + pServiceCharges - DiscountAmount, 0, "Cash In Hand Sale Voucher");
                                    }
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountdue, "Sale Voucher");
                                }
                                if (DiscountAmount > 0)
                                {
                                    //Cr  Discount on Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                    }
                                }
                            }
                            else if (pPaymentModeId == 1)//Credit Card Sale
                            {
                                //Dr  Credit Card Sale Receivable
                                //Cr  Credit Sales

                                if (pPaidin > 0)
                                {
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pPaidin - DiscountAmount, 0, "Cash In Hand Sale Voucher");
                                    }
                                }

                                if (p_BANK_ID > 0)
                                {
                                    if ((pAmountdue + gst + pServiceCharges - DiscountAmount) - pPaidin > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, p_BANK_ID, (pAmountdue + gst + pServiceCharges - DiscountAmount) - pPaidin, 0, "Credit Card Sale Voucher");
                                    }
                                }
                                else
                                {
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSaleReceivable + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if ((pAmountdue + gst + pServiceCharges - DiscountAmount) - pPaidin > 0)
                                        {
                                            LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), (pAmountdue + gst + pServiceCharges - DiscountAmount) - pPaidin, 0, "Credit Card Sale Voucher");
                                        }
                                    }
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountdue - pPaidin, "Credit Card Sale Voucher");
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pPaidin, "Cash In Hand Sale Voucher");
                                }

                                if (DiscountAmount > 0)
                                {
                                    //Cr  Discount on Credit Card Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonCreditCardSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                    }
                                }
                            }
                            else if (pPaymentModeId == 2)//Credit Sale
                            {
                                //Dr  Credit Sale Receivable
                                //Cr  Credit Sales
                                
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                                if (drConfig.Length > 0)
                                {
                                    if (pAmountdue + gst + pServiceCharges - DiscountAmount > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountdue + gst + pServiceCharges - DiscountAmount, 0, "Credit Sale Voucher");
                                    }
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountdue, "Credit Sale Voucher");
                                }
                                if (DiscountAmount > 0)
                                {
                                    //Cr  Discount on Credit Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), DiscountAmount, 0, "Discount Sale Voucher");
                                    }
                                }
                            }
                        }
                        if (gst > 0)
                        {
                            //Cr  Sales Tax
                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                            if (drConfig.Length > 0)
                            {
                                LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, gst, "GST Sale Voucher");
                            }
                        }

                        if (pServiceCharges > 0)
                        {
                            //Cr  Service Charges
                            drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                            if (drConfig.Length > 0)
                            {
                                LController.PostingGLDetail(pDistributorId, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pServiceCharges, "Service Charges Voucher");
                            }
                        }
                    }
                    #endregion
                }
                mTransaction.Commit();
            }
            catch (Exception ex)
            {

            }
        }
        public DataTable Select_Invoice_Lookup(int p_DISTRIBUTOR_ID, int p_USER_ID, DateTime p_DOCUMENT_DATE, int p_TYPE_ID)
        {
            IDbConnection mConnection;

            try
            {
                spSelectFRANCHISE_INVOICE_MASTER mFranchiseInvoiceMaster = new spSelectFRANCHISE_INVOICE_MASTER();
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mFranchiseInvoiceMaster.Connection = mConnection;
                mFranchiseInvoiceMaster.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mFranchiseInvoiceMaster.USER_ID = p_USER_ID;
                mFranchiseInvoiceMaster.DOCUMENT_DATE = p_DOCUMENT_DATE;
                mFranchiseInvoiceMaster.TYPE_ID = p_TYPE_ID;
                DataTable dt = mFranchiseInvoiceMaster.ExecuteTableForSaleInvoice();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
        }
        public DataTable Select_Invoice_Details(long p_FRANCHISE_MASTER_ID)
        {
            IDbConnection mConnection;
            try
            {
                spSelectFranchiseSaleInvoice_Detail mFranchiseDeatil = new spSelectFranchiseSaleInvoice_Detail();
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mFranchiseDeatil.Connection = mConnection;
                mFranchiseDeatil.FRANCHISE_MASTER_ID = p_FRANCHISE_MASTER_ID;
                DataTable dt = mFranchiseDeatil.ExecuteTableForSaleDetail();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
        }
        public long UpdateSALE_INVOICE_DETAIL(spInsertSALE_INVOICE_DETAIL mISom)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spInsertSALE_INVOICE_DETAIL mISomNew = new spInsertSALE_INVOICE_DETAIL();
                mISomNew = mISom;
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.ExecuteQueryForInvoiceUpdate();
                mTransaction.Commit();

                return mISomNew.SALE_INVOICE_DETAIL_ID;
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
        public long UpdateSALE_INVOICE_MASTER(spUpdateSALE_INVOICE_MASTER mISom)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTER mISomNew = new spUpdateSALE_INVOICE_MASTER();
                mISomNew = mISom;
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.ExecuteQuery();
                mTransaction.Commit();
                return mISomNew.SALE_INVOICE_ID;
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

        public long DeleteSaleInvoiceDetail(long p_Sale_Invoice_Id)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTER mISomNew = new spUpdateSALE_INVOICE_MASTER();
                mISomNew.SALE_INVOICE_ID = p_Sale_Invoice_Id;
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.ExecuteQueryForDeleteDetail();
                mTransaction.Commit();
                return mISomNew.SALE_INVOICE_ID;
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

        public static DataTable GetInvoiceDetail(long p_SALE_INVOICE_ID, IDbConnection PConnection, IDbTransaction PTransaction)
        {
            try
            {
                uspGetInvoiceDetail mFranchiseDeatil = new uspGetInvoiceDetail();
                mFranchiseDeatil.Connection = PConnection;
                mFranchiseDeatil.Transaction = PTransaction;
                mFranchiseDeatil.SALE_INVOICE_ID = p_SALE_INVOICE_ID;
                DataTable dt = mFranchiseDeatil.ExecuteTable();
                return dt;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                return null;
            }
        }

        public static DataTable GetInvoiceDetail(long p_SALE_INVOICE_ID)
        {
            IDbConnection mConnection = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                uspGetInvoiceDetail mOrder = new uspGetInvoiceDetail();
                mOrder.Connection = mConnection;
                mOrder.SALE_INVOICE_ID = p_SALE_INVOICE_ID;
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
        public static bool Update_Items_AS_Loaded(long pSaleInvoiceId, int pDistributorId)
        {

            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {

                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);

                spUpdateSALE_INVOICE_MASTERNew mISom = new spUpdateSALE_INVOICE_MASTERNew();

                mISom.Connection = mConnection;
                mISom.Transaction = mTransaction;
                mISom.DISTRIBUTOR_ID = pDistributorId;
                mISom.SALE_INVOICE_ID = pSaleInvoiceId;
                mISom.KDS_TIME = DateTime.Now;
                mISom.TYPE_ID = 3;
                string i = mISom.ExecuteScalar();

                mTransaction.Commit();
                return true;
            }
            catch (Exception exp)
            {
                ExceptionPublisher.PublishException(exp);
                mTransaction.Rollback();
                throw;
            }
            finally
            {
                if (mConnection != null && mConnection.State == ConnectionState.Open)
                {
                    mConnection.Close();
                }
            }
        }

        public bool InActiveInvoice(string p_SALE_INVOICE_IDs, int p_DISTRIBUTOR_ID, DateTime p_FROM_DATE, int p_USER_ID)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                mConnection.Open();
                mTransaction = ProviderFactory.GetTransaction(mConnection);
                uspInActiveInvoices mISomNew = new uspInActiveInvoices();
                mISomNew.Connection = mConnection;
                mISomNew.Transaction = mTransaction;
                mISomNew.SALE_INVOICE_IDs = p_SALE_INVOICE_IDs;
                mISomNew.DISTRIBUTOR_ID = p_DISTRIBUTOR_ID;
                mISomNew.FROM_DATE = p_FROM_DATE;
                mISomNew.USER_ID = p_USER_ID;
                mISomNew.ExecuteQuery();
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

        public long Add_SalesRefund(int pDISTRIBUTOR_ID, long pSALE_INVOICE_ID, int pCustomerTypeId, int pPaymentModeId, int pDeliveryChannelID, int p_BANK_ID, decimal pGROSS_AMOUNT, decimal pDISCOUNT, decimal pGST, decimal pSERVICE_CHARGES, decimal pITEM_DISCOUNT, decimal pGROSS_AMOUNTRef, decimal pDISCOUNTRef, decimal pGSTRef, decimal pSERVICE_CHARGESRef, decimal pITEM_DISCOUNTRef, int pUSER_ID, string pRecipeType, DateTime pDocumentDate, DataTable dtInvoiceDetail, bool IsFinanceIntegrate, DataTable dtCOAConfig)
        {
            IDbConnection mConnection = null;
            IDbTransaction mTransaction = null;
            try
            {
                decimal ComplimentaryDiscount = 0;
                decimal GLConsumption = 0;
                int RowIndex = 0;
                if (dtInvoiceDetail.Rows.Count > 0)
                {
                    ComplimentaryDiscount = calculateComplimentaryDealAmount(dtInvoiceDetail);

                    mConnection = ProviderFactory.GetConnection(Configuration.ConnectionString, EnumProviders.SQLClient);
                    mConnection.Open();
                    mTransaction = ProviderFactory.GetTransaction(mConnection);

                    spInsertSalesRefundMaster mISom = new spInsertSalesRefundMaster
                    {
                        Connection = mConnection,
                        Transaction = mTransaction,
                        DISTRIBUTOR_ID = pDISTRIBUTOR_ID,
                        SALE_INVOICE_ID = pSALE_INVOICE_ID,
                        GROSS_AMOUNT = pGROSS_AMOUNTRef,
                        DISCOUNT = pDISCOUNTRef,
                        ITEM_DISCOUNT = pITEM_DISCOUNTRef,
                        GST = pGSTRef,
                        SERVICE_CHARGES = pSERVICE_CHARGESRef,
                        USER_ID = pUSER_ID
                    };
                    mISom.ExecuteQuery();

                    //----------------Insert into sale order detail-------------
                    spInsertRefundDetail mSaleInvoiceDetail = new spInsertRefundDetail
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };
                    foreach (DataRow dr in dtInvoiceDetail.Rows)
                    {
                        mSaleInvoiceDetail.SALE_REFUND_ID = mISom.SALE_REFUND_ID;
                        mSaleInvoiceDetail.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                        mSaleInvoiceDetail.Quantity = int.Parse(dr["Quantity"].ToString());
                        mSaleInvoiceDetail.Price = decimal.Parse(dr["Price"].ToString());
                        mSaleInvoiceDetail.SALE_INVOICE_DETAIL_ID = Convert.ToInt64(dr["SALE_INVOICE_DETAIL_ID"]);
                        mSaleInvoiceDetail.IsDelete = Convert.ToBoolean(dr["IsDelete"]);
                        mSaleInvoiceDetail.ExecuteQuery();

                        if (dr["ItemType"].ToString() == "1")//If Item not cooked then update consumption
                        {
                            uspGetFinishedDetail mSkuInfo = new uspGetFinishedDetail
                            {
                                Connection = mConnection,
                                Transaction = mTransaction
                            };

                            mSkuInfo.FINISHED_SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                            if (pRecipeType == "1")
                            {
                                mSkuInfo.TYPE_ID = 5;
                            }
                            else
                            {
                                mSkuInfo.TYPE_ID = 4;
                            }
                            mSkuInfo.DATE = pDocumentDate;
                            mSkuInfo.DISTRIBUTOR_ID = pDISTRIBUTOR_ID;
                            DataTable dtRaw = mSkuInfo.ExecuteTable();
                            RowIndex = 0;
                            foreach (DataRow drRaw in dtRaw.Rows)
                            {
                                RowIndex++;
                                UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                mStockUpdate.Connection = mConnection;
                                mStockUpdate.Transaction = mTransaction;
                                mStockUpdate.PRINCIPAL_ID = 0;
                                mStockUpdate.TYPE_ID = 21;
                                mStockUpdate.DISTRIBUTOR_ID = pDISTRIBUTOR_ID;
                                mStockUpdate.STOCK_DATE = pDocumentDate;
                                mStockUpdate.PRICE = 0;
                                mStockUpdate.BATCHNO = "N/A";
                                mStockUpdate.STOCK_QTY = 0;
                                mStockUpdate.CONSUMED = 0;
                                mStockUpdate.SKU_ID = int.Parse(drRaw["SKU_ID"].ToString());
                                if (drRaw["Type"].ToString() == "Finish")
                                {
                                    mStockUpdate.STOCK_QTY = mSaleInvoiceDetail.Quantity;
                                    GLConsumption += mStockUpdate.STOCK_QTY * Convert.ToDecimal(drRaw["LastPurPrice"]);
                                }
                                else
                                {
                                    mStockUpdate.CONSUMED = Convert.ToDecimal(drRaw["QUANTITY"]) * Convert.ToDecimal(drRaw["LastPurPrice"]);
                                    GLConsumption += mStockUpdate.CONSUMED;
                                }
                                mStockUpdate.ExecuteQuery();


                            }
                            if (RowIndex == 0 || (dr["BRAND_ID"].ToString() == "1" && dr["ISEXEMPTED"].ToString().ToLower() == "true" && dr["IS_Recipe"].ToString().ToLower() == "true"))
                            {
                                UspProcessStockRegister mStockUpdate = new UspProcessStockRegister();
                                mStockUpdate.Connection = mConnection;
                                mStockUpdate.Transaction = mTransaction;

                                mStockUpdate.PRINCIPAL_ID = 0;
                                mStockUpdate.TYPE_ID = 21;
                                mStockUpdate.DISTRIBUTOR_ID = pDISTRIBUTOR_ID;
                                mStockUpdate.STOCK_DATE = pDocumentDate;
                                mStockUpdate.PRICE = 0;
                                mStockUpdate.BATCHNO = "N/A";
                                mStockUpdate.SKU_ID = int.Parse(dr["SKU_ID"].ToString());
                                mStockUpdate.STOCK_QTY = decimal.Parse(dr["Quantity"].ToString());
                                mStockUpdate.FREE_QTY = 0;
                                mStockUpdate.ExecuteQuery();
                            }
                        }
                    }
                    spUpdateInvoice mUpdate = new spUpdateInvoice
                    {
                        Connection = mConnection,
                        Transaction = mTransaction
                    };
                    mUpdate.SALE_INVOICE_ID = pSALE_INVOICE_ID;
                    mUpdate.AMOUNTDUE = pGROSS_AMOUNT - pGROSS_AMOUNTRef;
                    mUpdate.DISCOUNT = pDISCOUNT - pDISCOUNTRef;
                    mUpdate.ITEM_DISCOUNT = pITEM_DISCOUNT - pITEM_DISCOUNTRef;
                    mUpdate.GST = pGST - pGSTRef;
                    mUpdate.SERVICE_CHARGES = pSERVICE_CHARGES - pSERVICE_CHARGESRef;
                    mUpdate.PaymentMode = pPaymentModeId;
                    mUpdate.ExecuteQuery();

                    decimal DiscountAmount = 0;
                    DiscountAmount = mUpdate.DISCOUNT + mUpdate.ITEM_DISCOUNT;
                    decimal pBankPortion = 0;
                    decimal pPaidin = 0;
                    decimal pAmountDue = pGROSS_AMOUNTRef;
                    decimal pServiceCharges = pSERVICE_CHARGESRef;
                    if (IsFinanceIntegrate)
                    {
                        #region GL Master, Detail
                        decimal BankDiscountPortion = pBankPortion;

                        BankDiscountPortion = DiscountAmount * pBankPortion / 100;
                        DiscountAmount = DiscountAmount - BankDiscountPortion;

                        LedgerController LController = new LedgerController();
                        string VoucherNo = LController.SelectMaxVoucherId(Constants.Journal_Voucher, pDISTRIBUTOR_ID, pDocumentDate);
                        if (LController.PostingGLMaster(pDISTRIBUTOR_ID, 0, VoucherNo, Constants.Journal_Voucher, pDocumentDate, Constants.Document_Sale_Return, Convert.ToString(mISom.SALE_REFUND_ID), "Sales Refund Voucher", pUSER_ID, "Sales Refund", Constants.Document_Sale_Return, mISom.SALE_REFUND_ID))
                        {
                            DataRow[] drConfig = null;

                            if (pCustomerTypeId == 2 && pDeliveryChannelID > 0)
                            {
                                //Dr Third Party Delivery
                                //Cr Credit Sale
                                if (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion > 0)
                                {
                                    drConfig = dtCOAConfig.Select("CODE = '" + pDeliveryChannelID + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion, "Third Party Delivery Sales Refund Voucher");
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if (pAmountDue - DiscountAmount - BankDiscountPortion > 0)
                                            {
                                                LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue, 0, "Third Party Delivery Sales Refund Voucher");
                                            }
                                        }
                                    }
                                }
                                if (DiscountAmount > 0)
                                {
                                    //Cr  Discount on Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, DiscountAmount, "Discount Sales Refund Voucher");
                                    }
                                }
                                if (BankDiscountPortion > 0)
                                {
                                    //Cr  Discount on Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, BankDiscountPortion, "Discount Bank Portion Sales Refund Voucher");
                                    }
                                }
                                if (mISom.GST > 0)
                                {
                                    //Cr  Sales Tax
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.GST, 0, "GST Sales Refund Voucher");
                                    }
                                }

                                if (mISom.SERVICE_CHARGES > 0)
                                {
                                    //Cr  Service Charges
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.SERVICE_CHARGES, 0, "Service Charges Sales Refund Voucher");
                                    }
                                }

                                if (ComplimentaryDiscount > 0)
                                {
                                    //Dr Complimentary Discount
                                    //Cr Cash Sales
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Complimentary Discount Sales Refund Voucher");
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Sales Refund Voucher");
                                    }
                                }
                            }
                            else
                            {
                                if (pPaymentModeId == 0)
                                {
                                    //Dr Cash in Hand
                                    //Cr Cash Sale
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion, "Cash In Hand Sales Refund Voucher");
                                        }
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (pAmountDue > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue + ComplimentaryDiscount, 0, "Sales Refund Voucher");
                                        }
                                    }
                                    if (DiscountAmount > 0)
                                    {
                                        //Cr  Discount on Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, DiscountAmount, "Discount Sales Refund Voucher");
                                        }
                                    }

                                    if (BankDiscountPortion > 0)
                                    {
                                        //Cr  Discount on Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, BankDiscountPortion, "Discount Bank Portion Sales Refund Voucher");
                                        }
                                    }

                                    if (mISom.GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.GST, 0, "GST Sales Refund Voucher");
                                        }
                                    }

                                    if (pServiceCharges > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.SERVICE_CHARGES, 0, "Service Charges Sales Refund Voucher");
                                        }
                                    }
                                    if (ComplimentaryDiscount > 0)
                                    {
                                        //Dr Complimentary Discount
                                        //Cr Cash Sales
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Complimentary Discount Sales Refund Voucher");
                                        }
                                    }
                                }
                                else if (pPaymentModeId == 1)//Credit Card Sale
                                {
                                    //Dr  Credit Card Sale Receivable
                                    //Cr  Credit Sales

                                    if (pPaidin > 0)
                                    {
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashInHand + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, pPaidin, "Cash In Hand Sales Refund Voucher");
                                        }
                                    }

                                    if (p_BANK_ID > 0)
                                    {
                                        if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, p_BANK_ID, 0, (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin, "Credit Card Sales Refund Voucher");
                                        }
                                    }
                                    else
                                    {
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSaleReceivable + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin > 0)
                                            {
                                                LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) - pPaidin, "Credit Card Sales Refund Voucher");
                                            }
                                        }
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditCardSales + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (pAmountDue - pPaidin > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue - pPaidin, 0, "Credit Card Sales Refund Voucher");
                                        }
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (pPaidin > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pPaidin + ComplimentaryDiscount, 0, "Sales Refund Voucher");
                                        }
                                        else
                                        {
                                            if (ComplimentaryDiscount > 0)
                                            {
                                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                                if (drConfig.Length > 0)
                                                {
                                                    LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Sales Refund Voucher");
                                                }
                                            }
                                        }
                                    }

                                    if (DiscountAmount > 0)
                                    {
                                        //Cr  Discount on Credit Card Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonCreditCardSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, DiscountAmount, "Discount Sales Refund Voucher");
                                        }
                                    }

                                    if (BankDiscountPortion > 0)
                                    {
                                        //Cr  Discount on Credit Card Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, BankDiscountPortion, "Discount Bank Portion Sales Refund Voucher");
                                        }
                                    }

                                    if (mISom.GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.GST, 0, "GST Sales Refund Voucher");
                                        }
                                    }

                                    if (mISom.SERVICE_CHARGES > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.SERVICE_CHARGES, 0, "Service Charges Sales Refund Voucher");
                                        }
                                    }

                                    if (ComplimentaryDiscount > 0)
                                    {
                                        //Dr Complimentary Discount
                                        //Cr Cash Sales
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Complimentary Discount Sales Refund Voucher");
                                        }
                                    }

                                }
                                else if (pPaymentModeId == 2)//Credit Sale
                                {
                                    //Dr  Credit Sale Receivable
                                    //Cr  Credit Sales

                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSaleReceivable + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if ((pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion) > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, (pAmountDue + mISom.GST + pServiceCharges - DiscountAmount - BankDiscountPortion), "Credit Sales Refund Voucher");
                                        }
                                    }
                                    drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CreditSales + "'");
                                    if (drConfig.Length > 0)
                                    {
                                        if (pAmountDue > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), pAmountDue, 0, "Credit Sales Refund Voucher");
                                        }
                                    }
                                    if (DiscountAmount > 0)
                                    {
                                        //Cr  Discount on Credit Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.DiscountonSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, DiscountAmount, "Discount Sales Refund Voucher");
                                        }
                                    }

                                    if (BankDiscountPortion > 0)
                                    {
                                        //Cr  Discount on Credit Sale
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.BankDiscountPortion + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, BankDiscountPortion, "Discount Bank Portion Sales Refund Voucher");
                                        }
                                    }

                                    if (mISom.GST > 0)
                                    {
                                        //Cr  Sales Tax
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.SalesTax + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.GST, 0, "GST Sales Refund Voucher");
                                        }
                                    }

                                    if (mISom.SERVICE_CHARGES > 0)
                                    {
                                        //Cr  Service Charges
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ServiceCharges + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), mISom.SERVICE_CHARGES, 0, "Service Charges Sales Refund Voucher");
                                        }
                                    }

                                    if (ComplimentaryDiscount > 0)
                                    {
                                        //Dr Complimentary Discount
                                        //Cr Cash Sales
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.ComplimentaryDiscount + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, ComplimentaryDiscount, "Complimentary Discount Sales Refund Voucher");
                                        }
                                        drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.CashSale + "'");
                                        if (drConfig.Length > 0)
                                        {
                                            LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), ComplimentaryDiscount, 0, "Complimentary Discount Sales Refund Voucher");
                                        }
                                    }
                                }
                            }

                            if (GLConsumption > 0)
                            {
                                //Dr Consumption
                                //Cr Stock in Trade
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Consumption + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), 0, GLConsumption, "Consumption Sales Refund Voucher");
                                }
                                drConfig = dtCOAConfig.Select("CODE = '" + (int)Enums.COAMapping.Inventoryatstore + "'");
                                if (drConfig.Length > 0)
                                {
                                    LController.PostingGLDetail(pDISTRIBUTOR_ID, 0, Constants.Journal_Voucher, VoucherNo, Convert.ToInt64(drConfig[0]["VALUE"].ToString()), GLConsumption, 0, "Inventoryatstore Sales Refund Voucher");
                                }
                            }
                        }
                        #endregion
                    }

                    mTransaction.Commit();
                    return mISom.SALE_INVOICE_ID;
                }
                else
                {
                    return Constants.LongNullValue;
                }
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

        private static void WriteLog(string Msg)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory;
            string logFile = path + "\\TestLog.txt";
            for (int i = 0; i < 3; i++)
            {
                try
                {
                    using (FileStream fs = new FileStream(logFile, FileMode.Append, FileAccess.Write, FileShare.ReadWrite))
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        sw.WriteLine($"{DateTime.Now}: {Msg}");
                        sw.Flush();
                        fs.Flush(true);
                    }
                    break;
                }
                catch (IOException)
                {
                    System.Threading.Thread.Sleep(100);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Logging failed: " + ex.Message);
                    break;
                }
            }

        }

        private static void LogParams(long pSaleInvoiceId, int pPaymentModeId, int pCustomerTypeId, int pTableId, decimal pAmountdue, decimal pDiscount, decimal pGst, decimal pPaidin, decimal pBalance, bool pIsHold, int pUserId, DateTime pDocumentDate, int pDistributorId, int pDiscType, DataTable dtInvoiceDetail, int pOrderBookerId, string pCovertTable, string pTakeAwayCustomer, int p_VOID_BY, string pMANUAL_ORDER_NO, string pREMARKS, int pserviceCharges, int pcustomerID, bool pInvoicePrinted, decimal pGSTPER, decimal pGSTPERCreditCard, string pBillFormat, decimal pAdvanceAmount, decimal pCustomerGST, decimal pCustomerDiscount, byte pCustomerDiscountType, decimal pCustomerServiceCharges, byte pCustomerServiceType, string pRecipeType, int pDelChannel, bool pDELIVERY_CHANNEL_CASH_IMPACT, bool pCreditCard_Impact, bool KDSImplemented, bool pIsItemChanged, short pTakeawayType, byte pFORM_ID, DataTable dt,string OldInvoiceJson)
        {
            WriteLog("mTransaction.Rollback()");
            try
            {
                WriteLog("pSaleInvoiceId:" + pSaleInvoiceId.ToString());
                WriteLog("pPaymentModeId:" + pPaymentModeId.ToString());
                WriteLog("pCustomerTypeId:" + pCustomerTypeId.ToString());
                WriteLog("pTableId:" + pTableId.ToString());
                WriteLog("pAmountdue:" + pAmountdue.ToString());
                WriteLog("pDiscount:" + pDiscount.ToString());
                WriteLog("pGst:" + pGst.ToString());
                WriteLog("pPaidin:" + pPaidin.ToString());
                WriteLog("pBalance:" + pBalance.ToString());
                WriteLog("pIsHold:" + pIsHold.ToString());
                WriteLog("pUserId:" + pUserId.ToString());
                WriteLog("pDocumentDate:" + pDocumentDate.ToString());
                WriteLog("pDistributorId:" + pDistributorId.ToString());
                WriteLog("pDiscType:" + pDiscType.ToString());
                WriteLog("pOrderBookerId:" + pOrderBookerId.ToString());
                WriteLog("pCovertTable:" + pCovertTable);
                WriteLog("pTakeAwayCustomer:" + pTakeAwayCustomer);
                WriteLog("p_VOID_BY:" + p_VOID_BY.ToString());
                WriteLog("pMANUAL_ORDER_NO:" + pMANUAL_ORDER_NO);
                WriteLog("pREMARKS:" + pREMARKS);
                WriteLog("pserviceCharges:" + pserviceCharges);
                WriteLog("pcustomerID:" + pcustomerID.ToString());
                WriteLog("pInvoicePrinted:" + pInvoicePrinted.ToString());
                WriteLog("pGSTPER:" + pGSTPER);
                WriteLog("pGSTPERCreditCard:" + pGSTPERCreditCard.ToString());
                WriteLog("pBillFormat:" + pBillFormat.ToString());
                WriteLog("pAdvanceAmount:" + pAdvanceAmount.ToString());
                WriteLog("pCustomerGST:" + pCustomerGST.ToString());
                WriteLog("pCustomerDiscount:" + pCustomerDiscount.ToString());
                WriteLog("pCustomerDiscountType:" + pCustomerDiscountType.ToString());
                WriteLog("pCustomerServiceCharges:" + pCustomerServiceCharges.ToString());
                WriteLog("pCustomerServiceType:" + pCustomerServiceType.ToString());
                WriteLog("pRecipeType:" + pRecipeType.ToString());
                WriteLog("pDelChannel:" + pDelChannel.ToString());
                WriteLog("pDELIVERY_CHANNEL_CASH_IMPACT:" + pDELIVERY_CHANNEL_CASH_IMPACT.ToString());
                WriteLog("pCreditCard_Impact:" + pCreditCard_Impact.ToString());
                WriteLog("KDSImplemented:" + KDSImplemented.ToString());
                WriteLog("pIsItemChanged:" + pIsItemChanged.ToString());
                WriteLog("pTakeawayType:" + pTakeawayType.ToString());
                WriteLog("OldInvoiceJson:" + OldInvoiceJson.ToString());
                WriteLog("pFORM_ID" + pFORM_ID.ToString());
                WriteLog("dtInvoiceDetail: started");
                int rowNo = 1;
                foreach (DataRow row in dtInvoiceDetail.Rows)
                {
                    WriteLog("rowNo:" + rowNo.ToString());
                    foreach (DataColumn col in dtInvoiceDetail.Columns)
                    {
                        string value = row[col] == DBNull.Value ? "NULL" : row[col].ToString();
                        WriteLog($"{col.ColumnName}: {value}");
                    }
                    rowNo++;
                }
                rowNo = 1;
                WriteLog("dtOld: started");
                foreach (DataRow row in dt.Rows)
                {
                    WriteLog("rowNo:" + rowNo.ToString());
                    foreach (DataColumn col in dt.Columns)
                    {
                        string value = row[col] == DBNull.Value ? "NULL" : row[col].ToString();
                        WriteLog($"{col.ColumnName}: {value}");
                    }
                    rowNo++;
                }
            }
            catch (Exception ex)
            {
                ExceptionPublisher.PublishException(ex);
            }
        }
        #endregion
    }
}