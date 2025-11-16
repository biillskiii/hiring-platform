"use client";

import React, { useState } from "react";
import Image from "next/image";
import { KeyIcon } from "@heroicons/react/24/solid";
import {
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  doc as firestoreDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import app from "@/lib/firebaseConfig"; // pastikan export default app

import Logo from "../../../public/assets/logo.png";
import GoogleIcon from "../../../public/assets/google.svg";
import TextInput from "@/components/ui/input";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/app/store/uiStore";

const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const router = useRouter();
  const { loading, alert, setLoading, showAlert, clearAlert } = useUIStore();
  const redirectBasedOnRole = async (user) => {
    try {
      const userRef = firestoreDoc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { roles: "candidate" });
        router.push("/");
        return;
      }

      const role = userSnap.data().roles;
      if (role === "admin") router.push("/admin/job-list");
      else router.push("/");
    } catch (err) {
      console.error("❌ Gagal cek role:", err);
      router.push("/"); // fallback
    }
  };

  const handleSendLink = async () => {
    if (!email) return showAlert("Isi email dulu, bro!", "danger");
    setLoading(true);
    clearAlert();

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login/verify-login?email=${email}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      showAlert("📧 Link login berhasil dikirim!", "primary");
    } catch (err) {
      console.error(err);
      showAlert("❌ Gagal mengirim link, cek email lo!", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password)
      return showAlert("Isi email dan password dulu!", "danger");
    setLoading(true);
    clearAlert();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await redirectBasedOnRole(userCredential.user);
      showAlert("✅ Login berhasil!", "primary");
    } catch (err) {
      console.error(err);
      showAlert("❌ Email atau password salah!", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    clearAlert();

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await redirectBasedOnRole(result.user);
      showAlert("✅ Login Google berhasil!", "primary");
    } catch (err) {
      console.error(err);
      showAlert("❌ Login Google gagal, coba lagi bro!", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-20 flex justify-center items-center">
      <div className="flex flex-col items-start">
        <Image src={Logo} alt="logo-rakamin" width={145} height={50} />
        <div className="bg-neutral-10 w-[500px] text-neutral-90 p-10 mt-6 shadow-button rounded-xl flex flex-col gap-4">
          <h1 className="font-semibold text-xl mb-2">Masuk ke Rakamin</h1>
          <p className="text-sm">
            Belum punya akun?{" "}
            <a href="/register" className="text-primary-main hover:underline">
              Daftar menggunakan email
            </a>
          </p>

          {alert && <Chip label={alert.label} variant={alert.variant} />}

          <TextInput
            label="Alamat Email"
            placeholder="email@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {usePassword && (
            <TextInput
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          <Button
            label={
              usePassword
                ? loading
                  ? "Memproses..."
                  : "Masuk"
                : loading
                ? "Mengirim..."
                : "Kirim Link"
            }
            variant="secondary"
            size="full"
            onClick={usePassword ? handlePasswordLogin : handleSendLink}
            disabled={loading}
          />

          <p className="text-center text-neutral-60">atau</p>

          <Button
            leftIcon={<KeyIcon width={15} height={15} />}
            label={
              usePassword
                ? "Masuk dengan email link"
                : "Masuk dengan kata sandi"
            }
            variant="outline"
            size="full"
            onClick={() => setUsePassword(!usePassword)}
          />

          <Button
            leftIcon={
              <Image src={GoogleIcon} alt="google" width={20} height={20} />
            }
            label="Masuk dengan Google"
            variant="outline"
            size="full"
            onClick={handleGoogleLogin}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
