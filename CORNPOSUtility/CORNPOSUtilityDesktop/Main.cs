using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace CORNPOSUtilityDesktop
{
    public partial class Main : Form
    {
        public static List<string> list = new List<string>();
        public Main()
        {
            InitializeComponent();
            
            string conString = System.Configuration.ConfigurationSettings.AppSettings["connString"].ToString();
            using (SqlConnection con = new SqlConnection(conString))
            {
                con.Open();
                //using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' AND name NOT LIKE 'DEMO%' ORDER BY name", con))
                using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE database_id > 4 AND compatibility_level <> 140 AND NAME NOT LIKE 'FASHION%' AND name <> 'CORNAPI' ORDER BY name", con))
                //using (SqlCommand cmd = new SqlCommand("SELECT name from sys.databases WHERE name = 'DemoCafe'", con))
                {
                    using (IDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            list.Add(dr[0].ToString());
                        }
                    }
                }
                con.Close();
            }

            firstMenu1_MouseSelected(null, null);
        }
        
        FirstMenu firstMenu = new FirstMenu();

        Point mouseOffset;
        Point FormLocation;
        bool isMouseDown;
        private void PnlTop_MouseMove(object sender, MouseEventArgs e)
        {
            int _x = 0;
            int _y = 0;
            if (isMouseDown)
            {
                Point pt = Control.MousePosition;
                _x = mouseOffset.X - pt.X;
                _y = mouseOffset.Y - pt.Y;
                this.Location = new Point(FormLocation.X - _x, FormLocation.Y - _y);
            }
        }

        private void PnlTop_MouseUp(object sender, MouseEventArgs e)
        {
            isMouseDown = false;
        }

        private void PnlTop_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                isMouseDown = true;
                FormLocation = this.Location;
                mouseOffset = Control.MousePosition;
            }
        }

        private void firstMenu1_MouseSelected(object sender, EventArgs e)
        {
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.White;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = true;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlTerminal.Dock = DockStyle.Fill;

            if (pnlTerminal.Controls.Count == 0)
            {
                frmEncryptDecrypt encryptDecryptForm = new frmEncryptDecrypt(this);
                encryptDecryptForm.TopLevel = false;
                this.pnlTerminal.Controls.Add(encryptDecryptForm);
                encryptDecryptForm.Show();
            }
        }

        private void firstMenu2_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.White;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = true;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlUser.Dock = DockStyle.Fill;

            if (pnlUser.Controls.Count == 0)
            {
                frmUpdateLicense updateLicenseForm = new frmUpdateLicense(this);
                updateLicenseForm.TopLevel = false;
                this.pnlUser.Controls.Add(updateLicenseForm);
                updateLicenseForm.Show();
            }
        }

        private void firstMenu3_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.White;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = true;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlPersonalize.Dock = DockStyle.Fill;

            if (pnlPersonalize.Controls.Count == 0)
            {
                frmAllowInsight allowInsightForm = new frmAllowInsight(this);
                allowInsightForm.TopLevel = false;
                this.pnlPersonalize.Controls.Add(allowInsightForm);
                allowInsightForm.Show();
            }
        }

        private void PicSmall_MouseClick(object sender, MouseEventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void PicClose_MouseClick(object sender, MouseEventArgs e)
        {
            DialogResult dr = ZKMessgeBox.Show("Exit the program?", "Warning!", ZKMessgeBox.I8Buttons.OKCancel);
            if (dr == DialogResult.OK)
            {
                Application.Exit();
            }
        }

        private void PicHome_MouseClick(object sender, MouseEventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            this.PnlMiddle.Controls.Add(labAD);
        }


        private void firstMenu4_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.White;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = true;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlData.Dock = DockStyle.Fill;

            if (pnlData.Controls.Count == 0)
            {
                frmRemoveModule removeModuleForm = new frmRemoveModule(this);
                removeModuleForm.TopLevel = false;
                this.pnlData.Controls.Add(removeModuleForm);
                removeModuleForm.Show();
            }
        }

        private void firstMenu5_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.White;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = true;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlAccess.Dock = DockStyle.Fill;

            if (pnlAccess.Controls.Count == 0)
            {
                frmUpdateBuild uploadBuildForm = new frmUpdateBuild(this);
                uploadBuildForm.TopLevel = false;
                this.pnlAccess.Controls.Add(uploadBuildForm);
                uploadBuildForm.Show();
            }
        }

        private void firstMenu6_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu8.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.White;
            firstMenu7.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = true;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlTruncate.Dock = DockStyle.Fill;

            if (pnlTruncate.Controls.Count == 0)
            {
                frmTruncateData truncateTranForm = new frmTruncateData(this);
                truncateTranForm.TopLevel = false;
                this.pnlTruncate.Controls.Add(truncateTranForm);
                truncateTranForm.Show();
            }
        }
        private void firstMenu7_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.White;
            firstMenu8.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = true;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlDayClose.Dock = DockStyle.Fill;

            if (pnlDayClose.Controls.Count == 0)
            {
                frmInsertDay dayCloseForm = new frmInsertDay(this);
                dayCloseForm.TopLevel = false;
                this.pnlDayClose.Controls.Add(dayCloseForm);
                dayCloseForm.Show();
            }
        }

        private void Main_Load(object sender, EventArgs e)
        {

        }

        private void firstMenu8_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;
            firstMenu10.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu8.TextColor = Color.White;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = true;
            pnlDocument.Visible = false;
            pnlScript.Visible = false;

            pnlAppSetting.Dock = DockStyle.Fill;

            if (pnlAppSetting.Controls.Count == 0)
            {
                frmAppSetting appSettingForm = new frmAppSetting(this);
                appSettingForm.TopLevel = false;
                this.pnlAppSetting.Controls.Add(appSettingForm);
                appSettingForm.Show();
            }
        }

        private void firstMenu9_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu7.BackColor = Color.Transparent;
            
            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu9.TextColor = Color.White;
            firstMenu8.TextColor = Color.Black;
            firstMenu10.TextColor = Color.Black;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = true;
            pnlScript.Visible = false;

            pnlDocument.Dock = DockStyle.Fill;

            if (pnlDocument.Controls.Count == 0)
            {
                frmDataManagement documentForm = new frmDataManagement(this);
                documentForm.TopLevel = false;
                this.pnlDocument.Controls.Add(documentForm);
                documentForm.Show();
            }
        }

        private void firstMenu10_MouseSelected(object sender, EventArgs e)
        {
            firstMenu1.BackColor = Color.Transparent;
            firstMenu2.BackColor = Color.Transparent;
            firstMenu3.BackColor = Color.Transparent;
            firstMenu4.BackColor = Color.Transparent;
            firstMenu5.BackColor = Color.Transparent;
            firstMenu6.BackColor = Color.Transparent;
            firstMenu9.BackColor = Color.Transparent;

            firstMenu1.TextColor = Color.Black;
            firstMenu2.TextColor = Color.Black;
            firstMenu3.TextColor = Color.Black;
            firstMenu4.TextColor = Color.Black;
            firstMenu5.TextColor = Color.Black;
            firstMenu6.TextColor = Color.Black;
            firstMenu7.TextColor = Color.Black;
            firstMenu9.TextColor = Color.Black;
            firstMenu8.TextColor = Color.Black;
            firstMenu10.TextColor = Color.White;

            pnlTerminal.Visible = false;
            pnlUser.Visible = false;
            pnlPersonalize.Visible = false;
            pnlData.Visible = false;
            pnlAccess.Visible = false;
            pnlTruncate.Visible = false;
            pnlDayClose.Visible = false;
            pnlAppSetting.Visible = false;
            pnlDocument.Visible = false;
            pnlScript.Visible = true;

            pnlScript.Dock = DockStyle.Fill;

            if (pnlScript.Controls.Count == 0)
            {
                frmScript scriptForm = new frmScript(this);
                scriptForm.TopLevel = false;
                this.pnlScript.Controls.Add(scriptForm);
                scriptForm.Show();
            }
        }
    }
}