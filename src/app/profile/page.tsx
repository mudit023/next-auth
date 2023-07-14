"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
export default function ProfilePage() {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    username: "",
    email: "",
    created_at: "",
    isAdmin: "",
    isVerified: "",
  });
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    async function getUserDetail() {
      try {
        const res = await axios.get("/api/user/user_detail");
        console.log("user data:", res.data.data);
        if (res?.data?.data) {
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
    getUserDetail();
  }, []);
  function logoutHandler() {
    const loadingToast = toast.loading("Logging Out...");
    try {
      const res = axios.get("api/user/logout");
      console.log("logout successful");
      toast.success("Logout Successfully!", { id: loadingToast });
      setTimeout(() => {
        router.push("/login");
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
  }
  return (
    <div>
      <div>
        <Toaster />
      </div>
      <h1>{`Howdy👋 ${userDetail?.username.toLocaleUpperCase()}`}</h1>
      <button
        onClick={logoutHandler}
        className="border border-solid border-yellow-400 p-2"
      >
        Logout
      </button>
    </div>
  );
}
