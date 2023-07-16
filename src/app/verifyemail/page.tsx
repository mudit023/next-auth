"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verifyEmail() {
    setLoading(true);
    try {
      const res = await axios.post("api/user/verifyemail", { token });
      setIsVerified(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    const tokenUrl = window.location.search.split("=")[1];
    if (tokenUrl && tokenUrl.length > 0) {
      setToken(tokenUrl);
    }
  }, []);
  useEffect(() => {
    if (token && token.length > 0) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center gap-2 p-2">
      <h1 className="text-2xl mb-10">Email Verification</h1>
      {loading ? (
        <p>Loading...</p>
      ) : isVerified ? (
        <>
          <p className="text-green-400 font-semibold text-xl max-w-[90vw]">
            Your email verified successfully!
          </p>
          <p>
            You'll be redirected to the login page shortly. Or you can click
            <Link href={"/login"}> here</Link>
          </p>
        </>
      ) : (
        <p className="">Unable to verify please try again.</p>
      )}
    </div>
  );
}
