import { auth, firestore } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/** REGISTER EMAIL + PASSWORD + SIMPAN ROLE DI FIRESTORE + KIRIM VERIF */
export const registerWithEmail = async (
  email,
  password,
  role = "candidate"
) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  // Simpan role di Firestore
  await setDoc(doc(firestore, "users", user.uid), {
    email: user.email,
    role, 
    createdAt: new Date(),
  });

  // Kirim email verifikasi
  await sendEmailVerification(user, {
    url: `${window.location.origin}/login`,
  });

  console.log("📨 Email verifikasi dikirim ke:", email);
  return user;
};

/** REGISTER / LOGIN GOOGLE */
export const registerWithGoogle = async (role = "candidate") => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Simpan role di Firestore jika belum ada
  const userRef = doc(firestore, "users", user.uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    await setDoc(userRef, {
      email: user.email,
      role,
      createdAt: new Date(),
    });
  }

  // Kirim email verifikasi kalau belum verified
  if (!user.emailVerified) {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/verify-email`,
    });
    console.log("📨 Email verifikasi Google dikirim ke:", user.email);
  }

  return user;
};

/** KIRIM MAGIC LINK */
export const sendMagicLink = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify-login?email=${email}`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
  console.log("🔗 Magic link dikirim ke:", email);
  return true;
};

/** VERIFIKASI MAGIC LINK */
export const verifyMagicLink = async (email, url) => {
  if (!email) email = window.localStorage.getItem("emailForSignIn");
  if (!email) throw new Error("Email tidak ditemukan di session.");

  await signInWithEmailLink(auth, email, url);
  window.localStorage.removeItem("emailForSignIn");
  console.log("✅ Login magic link sukses:", email);
  return true;
};
