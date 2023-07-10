"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { text } from "stream/consumers";

function Signup() {
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

  const onSignup = async () => {};
  return (
    <div className="flex flex-col justify-center items-center text-xl border border-solid border-white rounded-lg py-6 px-4 shadow-xl shadow-slate-900">
      <h1 className="font-extrabold text-3xl tracking-wide">Signup</h1>
      <form className="flex flex-col justify-center items-center gap-4 mt-8">
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="username"
          className="py-1 px-2 border-none outline-none rounded text-black"
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email"
          className="py-1 px-2 border-none outline-none rounded text-black"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          onBlur={focusHandler}
          placeholder="password"
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
  );
}

export default Signup;
