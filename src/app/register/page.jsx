"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../../public/assets/logo.png";
import GoogleIcon from "../../../public/assets/google.svg";
import TextInput from "@/components/ui/input";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { registerWithEmail, registerWithGoogle } from "@/lib/firebaseAuth";
import { useUIStore } from "@/app/store/uiStore";

export default function Register() {
  const router = useRouter();
  const { loading, setLoading, alert, showAlert, clearAlert } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      showAlert("Isi email dan password dulu bro!", "danger");
      return;
    }

    setLoading(true);
    clearAlert();

    try {
      const user = await registerWithEmail(email, password);
      console.log("User registered:", user);
      showAlert(
        "✅ Pendaftaran berhasil! Cek email untuk verifikasi.",
        "primary"
      );
      router.push(`/register/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      showAlert(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    clearAlert();
    try {
      const user = await registerWithGoogle();
      console.log("Google login success:", user);
      showAlert(
        "✅ Berhasil daftar dengan Google! Cek email untuk verifikasi.",
        "primary"
      );
    } catch (err) {
      console.error(err);
      showAlert(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-20 flex justify-center items-center">
      <div className="flex flex-col items-start">
        <Image src={Logo} alt="logo-rakamin" width={145} height={50} />

        <div className="bg-neutral-10 w-[500px] text-neutral-90 p-10 mt-6 shadow-button rounded-2xl flex flex-col gap-4">
          <h1 className="font-semibold text-xl mb-2">
            Bergabung dengan Rakamin
          </h1>
          <p className="text-sm">
            Sudah punya akun?{" "}
            <a href="/login" className="text-primary-main hover:underline">
              Masuk
            </a>
          </p>

          {alert && <Chip label={alert.label} variant={alert.variant} />}

          <div className="flex flex-col gap-y-4 mt-4">
            <TextInput
              label="Alamat Email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              label={loading ? "Mendaftarkan..." : "Daftar dengan Email"}
              variant="secondary"
              size="full"
              onClick={handleRegister}
              disabled={loading}
            />

            <p className="text-center text-neutral-60">atau</p>

            <Button
              leftIcon={
                <Image src={GoogleIcon} alt="google" width={20} height={20} />
              }
              label="Daftar dengan Google"
              variant="outline"
              size="full"
              onClick={handleGoogleRegister}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
