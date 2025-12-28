import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUserLogin } from "../api/folder_admin/admin";
import type { UserLoginInput } from "../type/user";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert"

const Login = () => {

  const [form, setForm] = useState<UserLoginInput>({
    username: "",
    password: "",
  });

  const hasInfo = form.username.trim() !== "" || form.password.trim() !== ""
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    if (!hasInfo) {
      setError("請填寫帳號密碼");
      setLoading(false);
      return;
    }

    try {
      const res = await apiUserLogin(form);
      const { success, message, token, expired } = res.data;

      if (!success) {
        throw new Error(message || "登入失敗");
      }
      if (!token || !expired) {
        throw new Error("Login response missing token/expired");
      }
      // 寫入 cookie，名稱要跟攔截器抓的一樣：hexToken
      document.cookie = `hexToken=${token}; expires=${new Date(
        expired
      )}`;
      // 成功後導到後台頁面
      navigate("/admin");
      // setIsLoggedIn(true)
      setError("");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const handleLogout = () => {
  //   setIsLoggedIn(false)

  //   setError("")
  // }

  return (
    loading ? <Loader /> :
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          {!isLoggedIn ? (<>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Login Here!</CardTitle>
              <CardDescription className="text-center">Enter correct Account and Password</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Account</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Account"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" name="password" value={form.password} onChange={handleChange} required className="w-full" />
                </div>
                {error && (
                  <Alert className="mt-3">
                    <AlertDescription className="text-destructive">{error}</AlertDescription>
                  </Alert>
                )}

              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:opacity-90 mt-4" disabled={loading} >
                  {loading ? "Logging..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </>) : (

            <>
              {/* <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">歡迎回來！</CardTitle>
              <CardDescription className="text-center">您已成功登入系統</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">登入帳號</p>
                <p className="text-lg font-semibold">{form.username}</p>
              </div>
              <Alert className="bg-primary/10 border-primary/20">
                <AlertDescription className="text-foreground">✓ 登入成功！歡迎使用系統</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                登出
              </Button>
            </CardFooter> */}

            </>
          )}
        </Card>
      </div>
  );
}
export default Login;