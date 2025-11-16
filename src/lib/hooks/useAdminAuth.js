"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "@/lib/firebaseConfig";

export const useAdminAuth = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/unauthorized");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists() || docSnap.data().roles !== "admin") {
          router.replace("/unauthorized");
          setLoading(false);
          return;
        }

        setRole("admin");
      } catch (err) {
        console.error("❌ Error cek role:", err);
        router.replace("/unauthorized");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, router]);

  return { role, loading };
};
