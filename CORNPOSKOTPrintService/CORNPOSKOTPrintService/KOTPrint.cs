using System;
using System.ServiceProcess;
using Timer = System.Timers.Timer;
using System.Drawing;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Data;
using System.Data.SqlClient;
using System.Timers;
using System.Drawing.Printing;
using System.Linq;

namespace CORNPOSKOTPrintService
{
    public partial class KOTPrint : ServiceBase
    {
        #region Printing Variables for windows printing                
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
        private static Font InvoiceFont3 = new Font("sans-serif", 9, FontStyle.Bold);
        private static Font InvoiceFont4 = new Font("sans-serif", 7, FontStyle.Regular);


        // Invoice Font height
        private static int InvoiceFontHeight;
        // Blue Color
        private static SolidBrush BlueBrush = new SolidBrush(Color.Blue);

        // Black Color
        private static SolidBrush BlackBrush = new SolidBrush(Color.Black);

        #endregion

        #region Form Variables 
        static string path = string.Empty;
        static string conString = "";
        Timer timer = new Timer();
        static string IsKOTLogOnServer = "0";
        static string SectionWisePrint = "1";
        static string[] PrinterNames;
        static string StickerSectionBoth = "0";
        static string[] XpeditorPrinterName;
        static string ExcludeCancelKOT = "0";
        static string IsLocationName = "0";
        static string IsFullKOT = "0";
        static string IsXpeditor = "0";
        static string IsPrintInvoice = "0";
        static string printerName = null;
        static string _section = null;
        static string customerType = null;
        static string bookerName = null;
        static string tableName = null;
        static string maxOrderNo = null;
        static string OrderNotes = null;
        static string KOTType = null;
        static byte byteKOTType = 0;
        static long OrderNo = 0;
        static string covertable = string.Empty;
        static DataTable dtValue = new DataTable();
        #endregion

        #region Windows Service Functions
        public KOTPrint()
        {
            InitializeComponent();
            path = AppDomain.CurrentDomain.BaseDirectory;
            conString = Decrypt(System.Configuration.ConfigurationManager.AppSettings["connString"].ToString(), "b0tin@74");
            timer.Elapsed += PerformTimerOperation;
            timer.Interval = TimeSpan.FromSeconds(10).TotalMilliseconds;
            timer.Start();            
        }

        protected override void OnStart(string[] args)
        {
            WriteLog("Service Started.", "OnStart(string[] args)");
            WriteLog("Version: 09-Feb-2026 06:50 PM", "OnStart");
            WriteLog("PerformTimerOperationCrystalReport", "OnStart");

            try
            {
                SectionWisePrint = System.Configuration.ConfigurationManager.AppSettings["SectionWisePrint"].ToString();
                string[] isfullkot = System.Configuration.ConfigurationManager.AppSettings["IsFullKOT"].ToString().Split(',');
                string[] isxpeditor = System.Configuration.ConfigurationManager.AppSettings["IsXpeditor"].ToString().Split(',');
                string checkXpeditor = System.Configuration.ConfigurationManager.AppSettings["IsXpeditor"].ToString();
                string[] excludecancelkot = System.Configuration.ConfigurationManager.AppSettings["ExcludeCancelKOT"].ToString().Split(',');
                string[] islocationname = System.Configuration.ConfigurationManager.AppSettings["IsLocationName"].ToString().Split(',');
                string[] isprintinvoice = System.Configuration.ConfigurationManager.AppSettings["IsPrintInvoice"].ToString().Split(',');
                PrinterNames = System.Configuration.ConfigurationManager.AppSettings["PrinterName"].Split(',');
                StickerSectionBoth = System.Configuration.ConfigurationManager.AppSettings["StickerSectionBoth"].ToString();

                XpeditorPrinterName = isxpeditor;

                foreach (string s in islocationname)
                {
                    if (s == "sectionPrinter")
                    {
                        IsLocationName = "1";
                        break;
                    }
                }

                if (checkXpeditor.Length > 0)
                {
                    IsXpeditor = "1";
                }

                if (isprintinvoice.Length > 0)
                {
                    IsPrintInvoice = "1";
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "OnStart(string[] args)");
            }

            if (IsPrintInvoice == "1")
            {
                timer.Stop();
                DataTable dtLocation = GetPrintOrders(4, 0);
                if (dtLocation.Rows.Count > 0)
                {
                    IsKOTLogOnServer = dtLocation.Rows[0]["IsKOTLogOnServer"].ToString();
                }
                timer.Start();
            }
            else
            {
                timer.Stop();
                DataTable dtLocation = GetPrintOrders(7, 0);
                if (dtLocation.Rows.Count > 0)
                {
                    IsKOTLogOnServer = dtLocation.Rows[0]["IsKOTLogOnServer"].ToString();
                }
                timer.Start();
            }
        }
        protected override void OnStop()
        {
            WriteLog("Service Stopped.", "OnStop()");
        }
        #endregion

        #region Timer Functions
        void PerformTimerOperation(object sender, ElapsedEventArgs e)
        {
            timer.Stop();
            try
            {
                if (SectionWisePrint == "1")
                {
                    PrintSectionWise();
                }
                else
                {
                    //PrintNonSection();
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "PerformTimerOperation(object sender, ElapsedEventArgs e)");
            }
            finally
            {
                timer.Start();
            }
        }
        #endregion

        #region Printing Functions
        private void PrintSectionWise()
        {
            try
            {
                DataTable dtOrders = GetPrintOrders(1, 0, 0);
                if (dtOrders.Rows.Count > 0)
                {
                    DataView view = new DataView(dtOrders);
                    DataTable dtKOTType = view.ToTable(true, "KOTType");

                    DataView view2 = new DataView(dtOrders);
                    DataTable dtSection = view2.ToTable(true, "SECTION");

                    KOTType = "NewKOT";
                    foreach (DataRow drKOTTyp in dtKOTType.Rows)
                    {
                        switch (drKOTTyp["KOTType"].ToString())
                        {
                            case "1":
                                KOTType = "NewKOT";
                                break;
                            case "2":
                                KOTType = "NewItemKOT";
                                break;
                            case "3":
                                KOTType = "AddQtyKOT";
                                break;
                            case "4":
                                KOTType = "LessQtyKOT";
                                break;
                            case "5":
                                KOTType = "CancelItemKOT";
                                break;
                            default:
                                KOTType = "NewKOT";
                                break;
                        }

                        foreach (DataRow drSection in dtSection.Rows)
                        {
                            dtValue = GetPrintOrders(2, Convert.ToInt64(dtOrders.Rows[0]["SaleInvoiceID"]), 0, Convert.ToInt32(drKOTTyp["KOTType"]), drSection["SECTION"].ToString());
                            if (dtValue.Rows.Count > 0)
                            {
                                printerName = dtValue.Rows[0]["PrinterName"].ToString();
                                _section = drSection["SECTION"].ToString();
                                customerType = dtValue.Rows[0]["CustomerType"].ToString();
                                bookerName = dtValue.Rows[0]["bookerName"].ToString();
                                tableName = dtValue.Rows[0]["tableName"].ToString();
                                maxOrderNo = dtValue.Rows[0]["maxOrderNo"].ToString();
                                OrderNotes = dtValue.Rows[0]["OrderNotes"].ToString();
                                OrderNo = Convert.ToInt64(dtValue.Rows[0]["SaleInvoiceID"]);
                                covertable = dtValue.Rows[0]["CoverTable"].ToString();
                                byteKOTType = Convert.ToByte(drKOTTyp["KOTType"]);
                                WriteLog(string.Format("Order No-{0}-" + KOTType + "-" + drSection["SECTION"].ToString() + " Started Printing.", dtValue.Rows[0]["SaleInvoiceID"].ToString()), string.Empty);
                                PrintReport(false);
                            }
                        }
                        //#region Xpeditor Print
                        //try
                        //{
                        //    if (IsXpeditor == "1")
                        //    {
                        //        foreach (string printer in XpeditorPrinterName)
                        //        {
                        //            DataTable dtOrderDetailX = GetOfersForPrintCrystalReport(3, Convert.ToInt64(dtOrders.Rows[0]["SaleInvoiceID"]), 0, Convert.ToInt32(drKOTTyp["KOTType"]), string.Empty);
                        //            if (dtOrderDetailX.Rows.Count > 0)
                        //            {
                        //                WriteLog(string.Format("Order No-{0}-" + KOTType + "-Xpeditor" + " Started Printing.", dtOrderDetailX.Rows[0]["SaleInvoiceID"].ToString()));
                        //                if (PrintKOTCrystalReportNew(dtOrderDetailX, printer, dtOrderDetailX.Rows[0]["SaleInvoiceID"].ToString(), 1, true, dtOrderDetailX.Rows[0]["OrderNotes"].ToString(), dtOrderDetailX.Rows[0]["LastUpdateDateTime"].ToString(), "Xpeditor", "X" + KOTType, Convert.ToByte(drKOTTyp["KOTType"]), IsXpeditor))
                        //                {

                        //                }
                        //            }
                        //        }
                        //    }
                        //}
                        //catch (Exception ex)
                        //{
                        //    WriteLog(ex.ToString());
                        //}
                        //#endregion
                    }
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "PrintCrystalReportSectionWiseNew");
            }
        }
        #endregion

        #region Print-KOT

        private static void PrintReport(bool IsXpeditor)
        {
            try
            {                
                if (IsXpeditor)
                {
                    PrintDocument prnDocument = new PrintDocument();
                    prnDocument.DefaultPageSettings.Margins = new Margins(0, 0, 0, 0);
                    prnDocument.PrinterSettings.PrinterName = XpeditorPrinterName[0].ToString();
                    prnDocument.PrintPage += new PrintPageEventHandler(prnDocument_PrintPage);
                    prnDocument.Print();
                }
                else
                {
                    PrintDocument prnDocument = new PrintDocument();
                    prnDocument.DefaultPageSettings.Margins = new Margins(0, 0, 0, 0);
                    prnDocument.PrinterSettings.PrinterName = printerName;
                    prnDocument.PrintPage += new PrintPageEventHandler(prnDocument_PrintPage);
                    prnDocument.Print();
                }

                if (!UpdatePrintedKOT(Convert.ToInt64(OrderNo), byteKOTType, _section, 1))
                    WriteLog("KOT Print not updated.", string.Empty);
                if (_section == "Xpeditor")
                {
                    if (!UpdatePrintedKOT(Convert.ToInt64(OrderNo), byteKOTType, string.Empty, 2))
                        WriteLog("Xpeditor KOT Print not updated.", string.Empty);
                }
                WriteLog($"Order No-{OrderNo}- {KOTType} Printed.", string.Empty);
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "PrintReport");
            }
        }

        private static void prnDocument_PrintPage(object sender, PrintPageEventArgs e)
        {
            leftMargin = 10;
            rightMargin = 10;
            topMargin = 10;
            bottomMargin = (int)e.MarginBounds.Bottom;//1069
            InvoiceWidth = (int)e.MarginBounds.Width;//115
            InvoiceHeight = (int)e.MarginBounds.Height;//969
            try
            {
                SetInvoiceHead(e.Graphics);
                SetInvoiceData(e.Graphics, e);
            }
            catch (Exception ex)
            {
                WriteLog(ex.Message, "prnDocument_PrintPage");
            }
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

            // Set Titles Left:
            InvSubTitle3 = _section;
            InvSubTitle4 = customerType;
            if (InvSubTitle3 != "")
            {
                CurrentY = CurrentY + InvSubTitleHeight + 10;
                float textWidth = g.MeasureString(InvSubTitle3, InvSubTitleFont).Width;
                float centerX = (InvoiceWidth - textWidth) / 2;
                g.DrawString(InvSubTitle3, InvSubTitleFont, BlueBrush, centerX, CurrentY);
            }
            CurrentY = CurrentY + 25;
            if (InvSubTitle4 != "")
            {
                float textWidth2 = g.MeasureString(InvSubTitle4, InvoiceFont).Width;
                float centerX2 = (InvoiceWidth - textWidth2) / 2;
                g.DrawString(InvSubTitle4, InvoiceFont, BlueBrush, centerX2, CurrentY);
            }
            if (customerType.ToLower() == "Delivery".ToLower())
            {
                CurrentY = CurrentY + 20;
                g.DrawString("D-M: " + bookerName, InvoiceFont, BlueBrush, 10, CurrentY);

                CurrentY = CurrentY + 20;
                g.DrawString("Customer: " + tableName, InvoiceFont, BlueBrush, 10, CurrentY);
            }
            else
            {
                CurrentY = CurrentY + 20;
                g.DrawString("O-T: " + bookerName, InvoiceFont, BlueBrush, 10, CurrentY);

                CurrentY = CurrentY + 20;
                g.DrawString("TABLE NO: " + tableName, InvoiceFont, BlueBrush, 10, CurrentY);
            }

            if (IsLocationName == "1")
            {
                CurrentY = CurrentY + 20;
                g.DrawString("Location Name: " + System.Configuration.ConfigurationManager.AppSettings["LocationName"].ToString(), InvoiceFont, BlueBrush, 10, CurrentY);
            }

            if(covertable.Length > 0)
            {
                CurrentY = CurrentY + 20;
                g.DrawString("Covers: " + covertable, InvoiceFont, BlueBrush, 10, CurrentY);
            }

            string RunningOrderText = string.Empty;
            switch (byteKOTType)
            {
                case 3:
                    RunningOrderText = "RUNNING ORDER - ADD ITEM Qty";
                    break;
                case 2:
                    RunningOrderText = "RUNNING ORDER - ADD ITEM";
                    break;
                case 5:
                    RunningOrderText = "RUNNING ORDER - CANCELED ITEM";
                    break;
                case 4:
                    RunningOrderText = "RUNNING ORDER - ITEM LESS";
                    break;
                default:
                    RunningOrderText = string.Empty;
                    break;
            }            

            CurrentY = CurrentY + 20;
            g.DrawString("DATE: " + DateTime.Now.ToString("dd-MMM-yyyy hh:mm tt"), InvoiceFont2, BlueBrush, 10, CurrentY);
            g.DrawString(maxOrderNo, InvOrderTitleFont, BlueBrush, 230, CurrentY - 20);

            if (RunningOrderText.Length > 0)
            {
                CurrentY = CurrentY + 20;

                // Measure text size
                SizeF textSize = g.MeasureString(RunningOrderText, InvoiceFont);

                float padding = 5; // space inside box

                float rectX = 10;
                float rectY = CurrentY - padding;
                float rectWidth = textSize.Width + (padding * 2);
                float rectHeight = textSize.Height + (padding * 2);

                // Draw rectangle
                g.DrawRectangle(Pens.Blue, rectX, rectY, rectWidth, rectHeight);

                // Draw text
                g.DrawString(RunningOrderText, InvoiceFont, BlueBrush, rectX + padding, CurrentY);
            }

            Utiltiy.DrawCircle(g, new Pen(Brushes.Black, 2), 250, CurrentY - 10, 27);

            int XNoOfuntit = (int)g.MeasureString("", InvoiceFont).Width + 180;
            int YNoOfUnit = CurrentY;

            CurrentY = CurrentY + 25;
            g.DrawLine(new Pen(Brushes.Black, 2), 10, CurrentY, 300, CurrentY);//            
            CurrentY = CurrentY + 5;
        }

        private static void SetInvoiceData(Graphics g, PrintPageEventArgs e)
        {
            // Set Invoice Table:
            int CurrentRecord = 0;

            // Table head X
            int xProductID = 10; // left padding
            int padding = 6;

            // Determine available printable width
            int availableWidth = (InvoiceWidth > 0) ? InvoiceWidth : e.PageBounds.Width;

            // Reserve fixed width for Qty column
            int qtyColWidth = 40;

            // Calculate name column width
            int nameColWidth = Math.Max(availableWidth - qtyColWidth - padding - xProductID, 50);

            // Draw headers
            CurrentY = CurrentY + 4;
            g.DrawString("Item Name", InvoiceFont, BlueBrush, xProductID, CurrentY);

            int xQtyColumn = xProductID + nameColWidth + padding;
            var qtyHeaderFormat = new StringFormat() { Alignment = StringAlignment.Far, LineAlignment = StringAlignment.Near };
            g.DrawString("Qty", InvoiceFont, BlueBrush, new RectangleF(xQtyColumn, CurrentY, qtyColWidth, InvoiceFont.GetHeight(g)), qtyHeaderFormat);

            CurrentY = CurrentY + 20;
            float lineEndX = xProductID + nameColWidth + padding + qtyColWidth;
            g.DrawLine(new Pen(Brushes.Black, 2), xProductID, CurrentY, lineEndX, CurrentY);
            CurrentY = CurrentY + 8;

            if (dtValue.Rows.Count > 0)
            {
                var wrapFormat = new StringFormat(StringFormat.GenericTypographic)
                {
                    FormatFlags = StringFormatFlags.LineLimit,
                    Trimming = StringTrimming.EllipsisCharacter
                };

                var qtyFormat = new StringFormat()
                {
                    Alignment = StringAlignment.Far,
                    LineAlignment = StringAlignment.Near
                };

                foreach (DataRow dr in dtValue.Rows)
                {
                    string skuName = Convert.ToString(dr["SKU_NAME"] ?? string.Empty).Trim();
                    string modifiers = Convert.ToString(dr["Modifiers"] ?? string.Empty).Trim();
                    string qty = Convert.ToString(dr["QTY"] ?? string.Empty).Trim();

                    string displayName = skuName;
                    if (!string.IsNullOrEmpty(modifiers))
                    {
                        displayName += Environment.NewLine + "  " + modifiers;
                    }

                    // Measure required block height for wrapping
                    SizeF measured = g.MeasureString(displayName, InvoiceFont2, nameColWidth, wrapFormat);
                    float blockHeight = measured.Height;

                    // Draw name block
                    var nameRect = new RectangleF(xProductID, CurrentY, nameColWidth, blockHeight);
                    g.DrawString(displayName, InvoiceFont2, BlackBrush, nameRect, wrapFormat);

                    // Draw qty right aligned
                    var qtyRect = new RectangleF(xQtyColumn, CurrentY, qtyColWidth, blockHeight);
                    g.DrawString(qty, InvoiceFont2, BlackBrush, qtyRect, qtyFormat);

                    // Advance Y and draw separator
                    CurrentY = CurrentY + (int)blockHeight + 6;
                    g.DrawLine(new Pen(Brushes.Black, 1), xProductID, CurrentY, lineEndX, CurrentY);

                    CurrentY = CurrentY + 6; // extra spacing after line
                    CurrentRecord++;
                }

                // Draw order notes if present
                if (!string.IsNullOrEmpty(OrderNotes))
                {
                    float notesWidth = nameColWidth + padding + qtyColWidth;
                    var notesFormat = new StringFormat(StringFormat.GenericTypographic)
                    {
                        FormatFlags = StringFormatFlags.LineLimit,
                        Trimming = StringTrimming.EllipsisCharacter
                    };
                    var notesRect = new RectangleF(xProductID, CurrentY, notesWidth, InvoiceFont.GetHeight(g) * 4f);
                    g.DrawString(OrderNotes, InvoiceFont, BlueBrush, notesRect, notesFormat);
                    CurrentY += (int)g.MeasureString(OrderNotes, InvoiceFont, (int)notesWidth, notesFormat).Height + 4;
                }
            }

            // Keep Graphics disposal to printing subsystem (do not dispose g here)
        }

        #endregion

        #region Decryp
        public static string Decrypt(string EncryptedText, string Key)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(Key);
            byte[] rgbIV = Encoding.UTF8.GetBytes(Key);
            byte[] buffer = Convert.FromBase64String(EncryptedText);
            MemoryStream stream = new MemoryStream();
            try
            {
                DES des = new DESCryptoServiceProvider();
                CryptoStream stream2 = new CryptoStream(stream, des.CreateDecryptor(bytes, rgbIV), CryptoStreamMode.Write);
                stream2.Write(buffer, 0, buffer.Length);
                stream2.FlushFinalBlock();
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(),"Decrypt");
            }
            return Encoding.UTF8.GetString(stream.ToArray());
        }
        #endregion

        #region Log Files
        private static void WriteLog(string Msg, string FunctionName)
        {
            string logFile = path + "CORNPOSKOTPrintLog.txt";
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
            if (IsKOTLogOnServer.ToLower() == "true")
            {
                try
                {
                    InsertKOTLog(FunctionName, Msg);
                }
                catch (Exception ex)
                {
                    WriteLog(ex.ToString(),"WriteLog");
                }
            }
        }
        #endregion

        #region Get Data
        public DataTable GetPrintOrders(int TypeID, long SaleInvoiceID)
        {
            DataTable dtOrders = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(conString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandTimeout = 120;
                        cmd.CommandText = "uspGetPrintInvoiceWS";
                        cmd.CommandType = CommandType.StoredProcedure;

                        IDataParameterCollection pparams = cmd.Parameters;
                        IDataParameter parameter = new SqlParameter() { ParameterName = "@DISTRIBUTOR_ID", DbType = DbType.Int32, Value = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["DistributorID"].ToString()) };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@TYPE_ID", DbType = DbType.Int32, Value = TypeID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@SALE_INVOICE_ID", DbType = DbType.Int64, Value = SaleInvoiceID };
                        pparams.Add(parameter);

                        IDbDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = cmd;
                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        dtOrders = ds.Tables[0];
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "GetPrintOrders(int TypeID, long SaleInvoiceID)");
            }
            return dtOrders;
        }
        public DataTable GetPrintOrders(int TypeID, long SaleInvoiceID, long CustomerID)
        {
            DataTable dtOrders = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(conString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandTimeout = 120;
                        cmd.CommandText = "uspGetOfersForPrintWSCrystalReportNew";
                        cmd.CommandType = CommandType.StoredProcedure;

                        IDataParameterCollection pparams = cmd.Parameters;
                        IDataParameter parameter = new SqlParameter() { ParameterName = "@DISTRIBUTOR_ID", DbType = DbType.Int32, Value = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["DistributorID"]) };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@TYPE_ID", DbType = DbType.Int32, Value = TypeID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@SALE_INVOICE_ID", DbType = DbType.Int64, Value = SaleInvoiceID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@CUSTOMER_ID", DbType = DbType.Int64, Value = CustomerID };
                        pparams.Add(parameter);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            dtOrders.Load(reader);
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "GetPrintOrders(int TypeID, long SaleInvoiceID, long CustomerID)");
            }
            return dtOrders;
        }
        public DataTable GetPrintOrders(int TypeID, long SaleInvoiceID, long CustomerID, int KOTType, string Section)
        {
            DataTable dtOrders = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(conString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandTimeout = 120;
                        cmd.CommandText = "uspGetOfersForPrintWSCrystalReportNew";
                        cmd.CommandType = CommandType.StoredProcedure;

                        IDataParameterCollection pparams = cmd.Parameters;
                        IDataParameter parameter = new SqlParameter() { ParameterName = "@DISTRIBUTOR_ID", DbType = DbType.Int32, Value = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["DistributorID"]) };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@TYPE_ID", DbType = DbType.Int32, Value = TypeID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@SALE_INVOICE_ID", DbType = DbType.Int64, Value = SaleInvoiceID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@CUSTOMER_ID", DbType = DbType.Int64, Value = CustomerID };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@KOTType", DbType = DbType.Int32, Value = KOTType };
                        pparams.Add(parameter);

                        parameter = new SqlParameter() { ParameterName = "@Section", DbType = DbType.String, Value = Section };
                        pparams.Add(parameter);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            dtOrders.Load(reader);
                        }
                    }
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                WriteLog(ex.ToString(), "GetPrintOrders(int TypeID, long SaleInvoiceID, long CustomerID,int KOTType,string Section)");
            }
            return dtOrders;
        }
        #endregion        

        #region Update Data
        public static bool UpdatePrintedKOT(long SaleInvoiceID, byte KOTType, string Section, byte TypeID)
        {
            bool flag = false;
            int maxRetries = 3;
            int delayMilliseconds = 2000;
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(conString))
                    {
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand("uspUpdatePrintedKOT", con))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandTimeout = 120;

                            cmd.Parameters.Add(new SqlParameter("@SaleInvoiceID", SqlDbType.BigInt) { Value = SaleInvoiceID });
                            cmd.Parameters.Add(new SqlParameter("@KOTType", SqlDbType.TinyInt) { Value = KOTType });
                            cmd.Parameters.Add(new SqlParameter("@Section", SqlDbType.VarChar, 50) { Value = Section });
                            cmd.Parameters.Add(new SqlParameter("@TypeID", SqlDbType.TinyInt) { Value = TypeID });

                            cmd.ExecuteNonQuery();
                            flag = true;
                        }
                    }
                    break;
                }
                catch (SqlException ex)
                {
                    if (IsTransientSqlError(ex))
                    {
                        WriteLog($"Transient SQL error on attempt {attempt}: {ex.Message}", "UpdatePrintedKOT");
                        if (attempt < maxRetries)
                            System.Threading.Thread.Sleep(delayMilliseconds * attempt);
                        else
                            flag = false;
                    }
                    else
                    {
                        WriteLog(ex.ToString(), "UpdatePrintedKOT");
                        flag = false;
                        break;
                    }
                }
                catch (Exception ex)
                {
                    WriteLog(ex.ToString(), "UpdatePrintedKOT");
                    flag = false;
                    break;
                }
            }

            return flag;
        }
        public static bool InsertKOTLog(string FunctionName, string ExceptionMessage)
        {
            bool flag = false;
            int maxRetries = 3; // Retry up to 3 times
            int delayMilliseconds = 2000; // Initial delay (2 seconds)

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(conString))
                    {
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand("uspInsertKOTLog", con))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandTimeout = 120;

                            cmd.Parameters.Add(new SqlParameter("@LocationID", SqlDbType.Int)
                            {
                                Value = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["DistributorID"].ToString())
                            });
                            cmd.Parameters.Add(new SqlParameter("@FunctionName", SqlDbType.VarChar, 100)
                            {
                                Value = FunctionName
                            });
                            cmd.Parameters.Add(new SqlParameter("@ExceptionMessage", SqlDbType.VarChar, -1)
                            {
                                Value = ExceptionMessage
                            });

                            cmd.ExecuteNonQuery();
                            flag = true;
                        }
                    }

                    break; // ✅ success, exit retry loop
                }
                catch (SqlException ex)
                {
                    // Check for transient SQL errors
                    if (IsTransientSqlError(ex))
                    {
                        WriteLog($"Transient SQL error on attempt {attempt}: {ex.Message}", "InsertKOTLog(string FunctionName, string ExceptionMessage)");
                        if (attempt < maxRetries)
                            System.Threading.Thread.Sleep(delayMilliseconds * attempt); // exponential backoff (2s, 4s, 6s)
                        else
                            flag = false;
                    }
                    else
                    {
                        WriteLog(ex.ToString(), "InsertKOTLog(string FunctionName, string ExceptionMessage)");
                        flag = false;
                        break;
                    }
                }
                catch (Exception ex)
                {
                    WriteLog(ex.ToString(), "InsertKOTLog(string FunctionName, string ExceptionMessage)");
                    flag = false;
                    break;
                }
            }

            return flag;
        }

        #endregion

        private static bool IsTransientSqlError(SqlException ex)
        {
            int[] transientErrorNumbers = { -2, 1205, 4060, 10928, 10929, 40197, 40501, 40613 };
            return ex.Errors.Cast<SqlError>().Any(e => transientErrorNumbers.Contains(e.Number));
        }
    }

    #region Classes
    static public class Utiltiy
    {
        public static void DrawCircle(this Graphics g, Pen pen, float centerX, float centerY, float radius)
        {
            g.DrawEllipse(pen, centerX - radius, centerY - radius, radius + radius, radius + radius);
        }
    }
    #endregion
}
