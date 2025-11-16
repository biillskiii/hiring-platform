"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { auth } from "@/lib/firebaseConfig"; // hanya import auth
import { onAuthStateChanged } from "firebase/auth";
import VerifyImage from "../../../../public/assets/verify.svg";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // reload ini method dari user object
        if (user.emailVerified) {
          setIsVerified(true);
          setTimeout(() => router.push("/login"), 1500);
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

// Disable SSR supaya aman dengan useSearchParams
const VerifyEmail = dynamic(() => Promise.resolve(VerifyEmailContent), {
  ssr: false,
});

export default function Page() {
  return <VerifyEmail />;
}
