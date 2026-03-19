using System;
using System.Data;
using CORNCommon.Classes;
using CORNDataAccessLayer.Classes;

namespace CORNDatabaseLayer.Classes
{
    public class DeleteSaleInvoiceDetail
    {
        #region Private Members
        private string sp_Name = "DeleteSaleInvoiceDetail";
        private IDbConnection m_connection;
        private IDbTransaction m_transaction;

        private string m_SaleInvoiceIds;
        #endregion
        #region Public Properties

        public string SaleInvoiceIds
        {
            set { m_SaleInvoiceIds = value; }
            get { return m_SaleInvoiceIds; }
        }

        public IDbConnection Connection
        {
            set
            {
                m_connection = value;
            }
            get
            {
                return m_connection;
            }
        }
        public IDbTransaction Transaction
        {
            set
            {
                m_transaction = value;
            }
            get
            {
                return m_transaction;
            }
        }
        #endregion
        #region Constructor
        public DeleteSaleInvoiceDetail()
        {
            
        }
        #endregion
        #region public Methods
        public bool ExecuteQuery()
        {
            try
            {
                IDbCommand cmd = ProviderFactory.GetCommand(EnumProviders.SQLClient);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = sp_Name;
                cmd.Connection = m_connection;
                if (m_transaction != null)
                {
                    cmd.Transaction = m_transaction;
                }
                GetParameterCollection(ref cmd);
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
            }
        }

        public void GetParameterCollection(ref IDbCommand cmd)
        {
            IDataParameterCollection pparams = cmd.Parameters;
            IDataParameter parameter;

            parameter = ProviderFactory.GetParameter(EnumProviders.SQLClient);
            parameter.ParameterName = "@SaleInvoiceIds";
            parameter.DbType = ProviderFactory.GetDBType(EnumProviders.SQLClient, EnumDBTypes.VarChar);
            if (m_SaleInvoiceIds == null)
            {
                parameter.Value = DBNull.Value;
            }
            else
            {
                parameter.Value = m_SaleInvoiceIds;
            }
            pparams.Add(parameter);


        }
        #endregion
    }
}