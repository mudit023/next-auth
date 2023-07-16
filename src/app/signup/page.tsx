"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Signup() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [user, setUser] = useState({
    username: "",
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

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const laodingToast = toast.loading("Signing up...");
    try {
      const res = await axios.post("/api/user/signup", user);
      toast.success("Signed up successfully!", {
        id: laodingToast,
      });
      console.log("successfully signed up!");
      setSignup(true);
      setTimeout(() => {
        router.push("/login");
      }, 3500);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);

      console.log("Something Went wrong in signup", error);
      toast.error(message, {
        id: laodingToast,
      });
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      {signup ? (
        <p className="flex justify-center items-center text-green-400 text-sm sm:max-w-[50vw]">
          Email verification is pending. Please check your email!
        </p>
      ) : (
        <></>
      )}
      <div className="flex flex-col justify-center items-center text-xl border border-solid border-white rounded-lg py-6 px-4 shadow-xl shadow-slate-900">
        <h1 className="font-extrabold text-3xl tracking-wide">Signup</h1>
        <form
          className="flex flex-col justify-center items-center gap-4 mt-8"
          onSubmit={onSignup}
        >
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="username"
            required
            className="py-1 px-2 border-none outline-none rounded text-black"
          />
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
            disabled={validPassword.active && !validPassword.valid}
            className={`w-full bg-green-700 font-semibold rounded mt-2 py-1 px-2 ${
              !validPassword.valid && validPassword.active
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            Signup
          </button>
        </form>
        <p className="text-sm mt-1">
          Already have an account?{" "}
          <Link href={"/login"} className="text-sm underline">
            login here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
