"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import ModalJob from "@/components/candidate/modal-job";
import JobDetail from "@/components/candidate/job-detail";
import { auth, firestore } from "@/lib/firebaseConfig";
import { supabase } from "@/lib/supabaseClient";
import EmptyListSVG from "../../public/assets/empty-state.svg";
import Image from "next/image";
import Button from "@/components/ui/button";
import { ArrowLeftIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      await currentUser.reload();
      setUser(currentUser);

      // Ambil role dari Firestore
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || userSnap.data().role !== "candidate") {
        // kalau bukan candidate, redirect
        router.replace("/login");
        return;
      }

      setRole(userSnap.data().role);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // Fetch jobs
  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_details")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return;
    }

    setJobs(data || []);
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleJobSelect = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    setSelectedJob(job);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        avatar={user?.photoURL ?? null}
        fallback={user?.displayName?.[0] || user?.email?.[0] || "G"}
      />

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 sm:p-8">
          <div className="flex flex-col items-center justify-center max-w-md">
            <Image
              src={EmptyListSVG}
              alt="No job openings available"
              width={300}
              height={300}
              className="mb-6 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72"
            />
            <p className="text-lg sm:text-xl font-semibold text-neutral-80 text-center">
              No job openings available
            </p>
            <p className="text-sm sm:text-base text-neutral-60 text-center mt-2">
              Please wait for the next batch of openings.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet View dengan Slide Animation */}
          <div className="lg:hidden relative h-[calc(100vh-64px)] overflow-hidden">
            {/* LIST JOB */}
            <div
              className={`absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 flex flex-col items-center space-y-3 sm:space-y-4 bg-white transition-transform duration-500 ease-out ${
                showDetail ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              {jobs.map((job) => (
                <ModalJob
                  key={job.id}
                  id={job.id}
                  company={job.company}
                  img={job.company_logo || null}
                  location={job.location}
                  salary={job.salary_range.display_text}
                  title={job.title}
                  onClick={handleJobSelect}
                  isSelected={selectedJob?.id === job.id}
                />
              ))}
            </div>

            {/* JOB DETAIL */}
            <div
              className={`absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 bg-white transition-transform duration-500 ease-out ${
                showDetail ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {showDetail && (
                <>
                  <div className="w-full mb-5">
                    <Button
                      onClick={handleBackToList}
                      variant="primary"
                      size="small"
                      label="Back to jobs"
                      leftIcon={<ArrowLeftIcon width={15} />}
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <JobDetail job={selectedJob} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop View - Side by Side */}
          <div className="hidden lg:flex">
            {/* LIST JOB */}
            <div className="w-[450px] xl:w-[500px] max-h-[calc(100vh-64px)] flex flex-col items-center overflow-y-auto p-8 space-y-4 border-r border-neutral-20">
              {jobs.map((job) => (
                <ModalJob
                  key={job.id}
                  id={job.id}
                  company={job.company}
                  img={job.company_logo || null}
                  location={job.location}
                  salary={job.salary_range.display_text}
                  title={job.title}
                  onClick={handleJobSelect}
                  isSelected={selectedJob?.id === job.id}
                />
              ))}
            </div>

            {/* JOB DETAIL */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-64px)] p-8 flex flex-col items-center justify-start">
              {selectedJob ? (
                <JobDetail job={selectedJob} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-60">
                  <BriefcaseIcon className="h-16 w-16 mb-4 text-neutral-40" />
                  <p className="text-lg font-medium">
                    Select a job to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
