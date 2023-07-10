"use client";

import React, { useState } from "react";
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
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const passwordValidation = () => {
    const password = user.password;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (password.trim().length >= 8 && passwordRegex.test(password)) {
      setIsValid(true);
      setUser({ ...user, password: password });
    } else {
      setUser({ ...user, password: "" });
      setIsValid(false);
    }
  };

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
          onBlur={passwordValidation}
          placeholder="password"
          className={`py-1 px-2 outline-none rounded text-black ${
            isValid === false
              ? "border-[2px] border-solid border-red-600"
              : "border-none"
          }`}
        />
        {isValid === false ? (
          <p className="text-red-700 text-xs font-light">
            Create a valid password
          </p>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="w-full bg-green-700 font-semibold rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
