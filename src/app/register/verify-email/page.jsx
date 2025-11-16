"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, reload } from "firebase/auth";
import VerifyImage from "../../../../public/assets/verify.svg";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user);
        if (user.emailVerified) {
          setIsVerified(true);
          router.push("/login"); // ⬅️ otomatis pindah ke login
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-neutral-20 flex justify-center items-center">
      <div className="bg-neutral-10 shadow-button text-neutral-90 rounded-lg flex flex-col justify-center items-center w-[500px] p-6 gap-4">
        <h1 className="text-2xl font-semibold">
          {isVerified ? "Email Terverifikasi ✅" : "Periksa Email Anda"}
        </h1>

        {!isVerified ? (
          <>
            <p className="text-sm text-center">
              Kami sudah mengirimkan link verifikasi ke{" "}
              <span className="font-bold text-primary-main">{email}</span> yang
              berlaku selama <span className="font-bold">30 menit</span>.
            </p>
            <Image
              src={VerifyImage}
              alt="verify-email"
              width={150}
              height={150}
            />
            <p className="text-xs text-neutral-60 text-center">
              Setelah kamu klik link verifikasi, halaman ini akan otomatis
              mengarahkanmu ke halaman login.
            </p>
          </>
        ) : (
          <p className="text-primary-main text-sm text-center">
            Email kamu sudah terverifikasi! Mengalihkan ke halaman login...
          </p>
        )}
      </div>
    </div>
  );
}
