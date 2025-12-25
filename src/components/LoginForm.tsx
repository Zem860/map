import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUserLogin } from "../api/folder_admin/admin";

const Login=()=> {
  const [form, setForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiUserLogin(form);
      console.log("登入成功:", res.data);

      // 🔥 跟你 Vue 版做一樣的事
      const { token, expired } = res.data;

      // 寫入 cookie，名稱要跟攔截器抓的一樣：hexToken
      document.cookie = `hexToken=${token}; expires=${new Date(
        expired
      )}; path=/;`;

      // 成功後導到後台頁面
      navigate("/admin"); // 或 "/product-management"，看你路由怎麼設

    } catch (err) {
      console.error(err);
      setError("登入失敗，帳號或密碼錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>登入</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>帳號</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>密碼</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}
export default Login;