"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { log } from "console";

function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [validPassword, setValidPassword] = useState({
    valid: false,
    active: false,
  });
  const VALID_PASSWORD =
    "A valid password must contain 8 alphanumeric characters with atleast 1 number(0-9) & alphabet(a-z).";
  useEffect(() => {
    const password = user.password;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (password.trim().length >= 8 && passwordRegex.test(password)) {
      setValidPassword({ valid: true, active: true });
    } else {
      setValidPassword({ ...validPassword, valid: false });
    }
  }, [user.password]);

  function focusHandler() {
    setValidPassword({ ...validPassword, active: true });
  }

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const loadingToast = toast.loading("Loging in...");
    try {
      const res = await axios.post("/api/user/login", user);
      console.log(res.data);
      toast.success(res.data.message, {
        id: loadingToast,
      });
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error, {
          id: loadingToast,
        });
        console.error(error.response.data); // The error response data from the server
        console.error(error.response.status); // The error status code
        console.error(error.response.headers); // The response headers
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
      } else {
        toast.error(error.message, {
          id: loadingToast,
        });
        // Something happened in setting up the request that triggered an error
        console.error("Error", error.message);
      }
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="flex flex-col justify-center items-center text-xl border border-solid border-white rounded-lg py-6 px-4 shadow-xl shadow-slate-900">
        <h1 className="font-extrabold text-3xl tracking-wide">Login</h1>
        <form
          className="flex flex-col justify-center items-center gap-4 mt-8"
          onSubmit={onLogin}
        >
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
            required
            className="py-1 px-2 border-none outline-none rounded text-black"
          />
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            onBlur={focusHandler}
            placeholder="password"
            required
            className={`py-1 px-2 outline-none rounded text-black ${
              !validPassword.valid && validPassword.active
                ? "border-[2px] border-solid border-red-600"
                : "border-none"
            }`}
          />
          {!validPassword.valid && validPassword.active ? (
            <p className="text-red-700 text-[10px] leading-3 font-light max-w-[300px] text-center">
              {VALID_PASSWORD}
            </p>
          ) : (
            <></>
          )}
          <button
            type="submit"
            className="w-full bg-green-700 font-semibold rounded mt-2 py-1 px-2"
          >
            Login
          </button>
        </form>
        <p className="text-sm mt-1">
          New here?{" "}
          <Link href={"/signup"} className="text-sm underline">
            create an account
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
