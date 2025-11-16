"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import VerifyImage from "../../../../public/assets/verify.svg";
import { useUIStore } from "@/app/store/uiStore";
import Chip from "@/components/ui/chip";

export default function VerifyLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const { loading, setLoading, alert, showAlert } = useUIStore();
  const [status, setStatus] = useState("Mengecek link login...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      setLoading(true);
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem("emailForSignIn");

          if (!email) {
            email =
              emailParam ||
              window.prompt("Masukkan email kamu untuk verifikasi:");
          }

          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );

          console.log("✅ Login berhasil:", result.user);
          window.localStorage.removeItem("emailForSignIn");

          setStatus("Login berhasil! Mengarahkan ke halaman utama...");
          setSuccess(true);
          showAlert("✅ Login berhasil!", "primary");

          setTimeout(() => router.push("/"), 2500);
        } else {
          setStatus("Link login tidak valid atau sudah digunakan.");
          showAlert("❌ Link login tidak valid!", "danger");
        }
      } catch (error) {
        console.error("❌ Error verifying link:", error);
        setStatus("Gagal verifikasi link. Coba kirim ulang, bro!");
        showAlert("❌ Gagal verifikasi link!", "danger");
      } finally {
        setLoading(false);
      }
    };

    verifyLogin();
  }, [router, emailParam, setLoading, showAlert]);

  return (
    <div className="min-h-screen w-full bg-neutral-20 flex justify-center items-center">
      <div className="bg-neutral-10 shadow-button text-neutral-90 rounded-lg flex flex-col justify-center items-center w-[500px] p-6 gap-4">
        {alert && <Chip label={alert.label} variant={alert.variant} />}
        <h1 className="text-2xl font-semibold">
          {success ? "Login Berhasil ✅" : "Verifikasi Login"}
        </h1>

        <p className="text-sm text-center">{status}</p>

        <Image
          src={VerifyImage}
          alt="verify-login"
          width={150}
          height={150}
          className={`${success ? "animate-pulse" : ""}`}
        />

        {!success ? (
          <p className="text-xs text-neutral-60 text-center">
            Pastikan kamu membuka link login dari email yang dikirim.
          </p>
        ) : (
          <p className="text-primary-main text-sm text-center">
            Mengalihkan ke halaman utama...
          </p>
        )}
      </div>
    </div>
  );
}
