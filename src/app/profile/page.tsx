"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    username: "",
    isVerified: "",
  });
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    async function getUserDetail() {
      try {
        setLoader(true);
        const res = await axios.get("/api/user/user_detail");
        console.log("user data:", res.data.data);
        if (res?.data?.data) {
          window.localStorage.setItem("username", res?.data?.data?.username);
          window.localStorage.setItem(
            "isVerified",
            res?.data?.data?.isVerified
          );
          setUserDetail(res?.data?.data);
        } else {
          toast.error("Error occurred");
        }
        setLoader(false);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error(String(error));
      }
    }
    if (
      window.localStorage.getItem("username") &&
      window.localStorage.getItem("isVerified")
    ) {
      setLoader(true);
      const nameData = window.localStorage.getItem("username")!;
      const verifiedData = window.localStorage.getItem("isVerified")!;

      setUserDetail({
        ...userDetail,
        username: nameData,
        isVerified: verifiedData,
      });
      setLoader(false);
    } else {
      getUserDetail();
    }
  }, []);
  function logoutHandler() {
    const loadingToast = toast.loading("Logging Out...");
    try {
      const res = axios.get("api/user/logout");
      console.log("logout successful");
      toast.success("Logout Successfully!", { id: loadingToast });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("isVerified");
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
  }
  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="p-2 flex-col justify-center items-center gap-4">
        {loader ? (
          <p>Loading...</p>
        ) : (
          <>
            {userDetail?.isVerified === "true" ? (
              <></>
            ) : (
              <p className="text-green-400 text-sm sm:max-w-[50vw]">
                Email verification is pending. Please verify your email!
              </p>
            )}
            <button
              onClick={logoutHandler}
              className="fixed top-2 right-2 border border-solid border-cyan-700 shadow-md shadow-cyan-800 px-2 py-1 text-sm rounded-sm"
            >
              logout
            </button>
            <h1 className="text-2xl font-bold tracking-wide">{`Howdy👋 ${userDetail?.username.toUpperCase()}`}</h1>
            <Link
              href={`/profile/${userDetail?.username}`}
              className="px-2 py-1 bg-cyan-300 text-slate-950 inline-block mt-2"
            >
              User Profile
            </Link>
          </>
        )}
      </div>
    </>
  );
}
