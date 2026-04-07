using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public partial class AddDB : System.Web.UI.Page
{
    string server = System.Configuration.ConfigurationManager.AppSettings["server"].ToString();
    string uid = System.Configuration.ConfigurationManager.AppSettings["uid"].ToString();
    string pwd = System.Configuration.ConfigurationManager.AppSettings["pwd"].ToString();
    private const string _keyString = "pokjmngf76174g59";
    private const string _ivString = "3254rv72tyv22ygh";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // no initialization required
        }
    }

    protected void btnCreate_Click(object sender, EventArgs e)
    {
        lblError.Text = string.Empty;
        string newDb = txtDbName.Text.Trim();
        string company = txtCompanyName.Text.Trim();
        string pin = txtPIN.Text.Trim();
        if (string.IsNullOrEmpty(newDb))
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "Database name is required.";
            return;
        }

        if (string.IsNullOrEmpty(company))
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "Company name is required.";
            return;
        }

        if (string.IsNullOrEmpty(pin))
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = "PIN is required.";
            return;
        }

        string connection = GetConnectionString("Data Source=" + server + ";Initial Catalog=" + newDb + ";Persist Security Info=True;User ID=" + uid + ";Password=" + pwd + ";Encrypt=False;");
        string connectionInsight = GetConnectionStringInsight("server=" + server + ";database=" + newDb + ";uid=" + uid + ";password=" + pwd + ";Encrypt=False;");

        try
        {
            string conStringCorn = "server=" + System.Configuration.ConfigurationManager.AppSettings["server"].ToString()
            + ";uid=Ali;pwd=Ali@Fast1234#;database=master";

            using (SqlConnection con = new SqlConnection(conStringCorn))
            {
                using (SqlCommand cmd = new SqlCommand("uspCreateNewDbFromMOZ", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@NewDbName", newDb);
                    cmd.Parameters.AddWithValue("@CompanyName", company);
                    cmd.Parameters.AddWithValue("@PIN", pin);
                    cmd.Parameters.AddWithValue("@Connection", string.IsNullOrEmpty(connection) ? (object)DBNull.Value : connection);
                    cmd.Parameters.AddWithValue("@ConnectionInsight", string.IsNullOrEmpty(connectionInsight) ? (object)DBNull.Value : connectionInsight);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
            }
            txtDbName.Text = string.Empty;
            txtCompanyName.Text = string.Empty;
            txtPIN.Text = string.Empty;

            lblError.ForeColor = System.Drawing.Color.Green;
            lblError.Text = "Database created successfully (or operation executed).";
        }
        catch (Exception ex)
        {
            lblError.ForeColor = System.Drawing.Color.Red;
            lblError.Text = ex.Message;
        }
    }

    private string GetConnectionString(string plainText)
    {
        byte[] cipherData;
        Aes aes = Aes.Create();

        aes.Key = Encoding.UTF8.GetBytes(_keyString);
        aes.IV = Encoding.UTF8.GetBytes(_ivString);
        aes.Mode = CipherMode.CBC;
        ICryptoTransform cipher = aes.CreateEncryptor(aes.Key, aes.IV);
        using (MemoryStream ms = new MemoryStream())
        {
            using (CryptoStream cs = new CryptoStream(ms, cipher, CryptoStreamMode.Write))
            {
                using (StreamWriter sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                }
            }

            cipherData = ms.ToArray();
        }
        byte[] combinedData = new byte[aes.IV.Length + cipherData.Length];
        Array.Copy(aes.IV, 0, combinedData, 0, aes.IV.Length);
        Array.Copy(cipherData, 0, combinedData, aes.IV.Length, cipherData.Length);
        return Convert.ToBase64String(combinedData);
    }

    private string GetConnectionStringInsight(string plainText)
    {
        string strKeyInsight = "Attendance2017";
        bool flag = true;
        byte[] bytes = Encoding.UTF8.GetBytes(plainText);
        byte[] numArray;
        if (flag)
        {
            MD5CryptoServiceProvider cryptoServiceProvider = new MD5CryptoServiceProvider();
            numArray = cryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(strKeyInsight));
            cryptoServiceProvider.Clear();
        }
        else
            numArray = Encoding.UTF8.GetBytes(strKeyInsight);
        TripleDESCryptoServiceProvider cryptoServiceProvider1 = new TripleDESCryptoServiceProvider();
        cryptoServiceProvider1.Key = numArray;
        cryptoServiceProvider1.Mode = CipherMode.ECB;
        cryptoServiceProvider1.Padding = PaddingMode.PKCS7;
        byte[] inArray = cryptoServiceProvider1.CreateEncryptor().TransformFinalBlock(bytes, 0, bytes.Length);
        cryptoServiceProvider1.Clear();
        return Convert.ToBase64String(inArray, 0, inArray.Length);
    }
}