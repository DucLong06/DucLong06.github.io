using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Windows.Forms;

namespace QLBH
{
    class Connect
    {
        public string StrCon = @"Data Source=DESKTOP-FSJQ4OJ\SQLEXPRESS; Database=QLTV; Integrated Security=true";
        public DataSet ds;
        public SqlCommand cmd;
        SqlDataAdapter sda;
        SqlConnection conn;

        public DataSet truyvan(string sql)
        {
            conn = new SqlConnection(StrCon);
            conn.Open();

            cmd = new SqlCommand(sql, conn);
            sda = new SqlDataAdapter(cmd);
            ds = new DataSet();
            sda.Fill(ds);

            conn.Close();
            return ds;
        }

        public bool CapnhatDB(string sql)
        {
            bool ck = false;
            conn = new SqlConnection(StrCon);
            conn.Open();

            cmd = new SqlCommand(sql, conn);
            try {
                cmd.ExecuteNonQuery();
                ck = true;
            }
            catch (SqlException ex)
            {
                MessageBox.Show("Lỗi: Không cập nhật được !");
            }

            conn.Close();
            return ck;
        }
    }
}
