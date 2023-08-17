'use client'
import { request } from "@/server/request";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { User } from "@/types"; 
import { TOKEN } from "@/constants";
import { setAuth, setUser } from "@/redux/slices/authSlice";

interface LoginProps {
  // Define any props if needed
}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (form: { username: string; password: string }) => {
    try {
      setLoading(true);
      const {
        data: { accesstoken, user },
      } = await request.post<{ accesstoken: string; user: User }>(
        "auth/login",
        form
      );
      setCookie(TOKEN, accesstoken);
      dispatch(setAuth());
      dispatch(setUser(user));
      if (user?.role === 1) {
        router.push("/admin/dashboard");
      } else {
        message.error('Admin User or Password is incorrect!')
      }
      request.defaults.headers.Authorization = `Bearer ${accesstoken}`;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formItemLayout = {
    labelCol: {
      md: { span: 6 },
    },
  };

  return (
    <div className="rounded mb-6 pt-36 main_login">
      <h2 className="containr text-center text-white text-4xl py-5 font-semibold">
        Login as Administrator
      </h2>
      <div className="containr register p-10 bg-white bg-opacity-20 backdrop-blur-md rounded-md lg:px-40 md:px-20 xl:w-[50%] md:w-[80%] m-auto">
        <Form
          name="login"
          onFinish={login}
          {...formItemLayout}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
            hasFeedback
          >
            <Input style={{ padding: "6px 10px" }} placeholder="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            hasFeedback
          >
            <Input.Password
              style={{ padding: "6px 10px" }}
              placeholder="Password"
            />
          </Form.Item>

          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="bg-white mx-auto w-1/3 my-3 h-10 text-lg "
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
