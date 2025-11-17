"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import Avatar from "../../../../public/assets/image.png";
import SearchInput from "@/components/ui/search";
import ModalJobAdmin from "@/components/admin/modal-job";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/ui/button";
import ModalCreateJob from "@/components/admin/modal-create-job";
import Dropdown from "@/components/ui/dropdown";
import EmptyState from "../../../../public/assets/empty-state.svg";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/outline";

const JobList = () => {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loadingJob, setLoadingJob] = useState(true);
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  const scrollRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState("20%");
  const [thumbTop, setThumbTop] = useState("0%");

  const { role, loading } = useAdminAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    candidate_needed: "",
    salary_min: "",
    salary_max: "",
  });

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("job_details")
      .select("*")
      .order("created_at", { ascending: false });

    setJobs(data || []);
    setLoadingJob(false);
  };

  useEffect(() => {
    fetchJobs();

    // Realtime update
    const channel = supabase
      .channel("job_details_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "job_details" },
        (payload) => {
          setJobs((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "job_details" },
        (payload) => {
          setJobs((prev) =>
            prev.map((j) => (j.id === payload.new.id ? payload.new : j))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "job_details" },
        (payload) => {
          setJobs((prev) => prev.filter((j) => j.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scrollbar logic
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const visible = el.clientHeight;
    const total = el.scrollHeight;
    const scrollTop = el.scrollTop;

    const heightPercent = (visible / total) * 100;
    setThumbHeight(`${heightPercent}%`);

    const maxScroll = total - visible;
    const scrollPercent = scrollTop / maxScroll;
    const maxThumbTop = 100 - heightPercent;

    setThumbTop(`${scrollPercent * maxThumbTop}%`);
  };

  // FILTERS & SORTING
  let filteredJobs = [...jobs];

  // FILTER STATUS
  if (statusFilter !== "all") {
    filteredJobs = filteredJobs.filter(
      (job) => (job.status || "").toLowerCase() === statusFilter.toLowerCase()
    );
  }

  // FILTER SEARCH - FIXED (job.title bisa null)
  filteredJobs = filteredJobs.filter((job) =>
    (job.title || "").toLowerCase().includes(query.toLowerCase())
  );

  // SORTING - FIXED (title dan status bisa null)
  filteredJobs.sort((a, b) => {
    if (sortBy === "name-asc")
      return (a.title || "").localeCompare(b.title || "");

    if (sortBy === "name-desc")
      return (b.title || "").localeCompare(a.title || "");

    if (sortBy === "status-asc")
      return (a.status || "").localeCompare(b.status || "");

    if (sortBy === "status-desc")
      return (b.status || "").localeCompare(a.status || "");

    return 0;
  });

  const handleManageCandidateClick = (jobId) => {
    router.push(`/admin/job-list/${jobId}/manage-candidate`);
  };

  // Loading
  if (loading || loadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-60">Loading...</p>
      </div>
    );
  }

  if (role !== "admin") return null;

  return (
    <div className="w-full min-h-screen lg:h-screen overflow-hidden flex flex-col bg-neutral-20">
      <Navbar avatar={Avatar} />

      <div className="flex-1 flex flex-col lg:flex-row items-start justify-start pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-6 lg:px-10 gap-6 lg:gap-10 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="flex flex-col w-full lg:flex-1">
          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* FILTER STATUS */}
            <div className="w-full sm:w-40">
              <Dropdown
                label="Filter Status"
                value={
                  {
                    all: "All Status",
                    active: "Active",
                    inactive: "Inactive",
                    draft: "Draft",
                  }[statusFilter]
                }
                onChange={(val) => {
                  const map = {
                    "All Status": "all",
                    Active: "active",
                    Inactive: "inactive",
                    Draft: "draft",
                  };
                  setStatusFilter(map[val]);
                }}
                options={[
                  { label: "All Status" },
                  { label: "Active" },
                  { label: "Inactive" },
                  { label: "Draft" },
                ]}
              />
            </div>

            {/* SORTING */}
            <div className="w-full sm:w-48">
              <Dropdown
                label="Sort By"
                value={
                  {
                    "name-asc": "Name (A → Z)",
                    "name-desc": "Name (Z → A)",
                    "status-asc": "Status (A → Z)",
                    "status-desc": "Status (Z → A)",
                  }[sortBy]
                }
                onChange={(val) => {
                  const map = {
                    "Name (A → Z)": "name-asc",
                    "Name (Z → A)": "name-desc",
                    "Status (A → Z)": "status-asc",
                    "Status (Z → A)": "status-desc",
                  };
                  setSortBy(map[val]);
                }}
                options={[
                  { label: "Name (A → Z)" },
                  { label: "Name (Z → A)" },
                  { label: "Status (A → Z)" },
                  { label: "Status (Z → A)" },
                ]}
              />
            </div>
          </div>

          {/* Job List */}
          <div className="relative mt-4 sm:mt-6 w-full h-[calc(100vh-280px)] sm:h-[calc(100vh-240px)] lg:h-[70vh]">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="overflow-y-scroll scrollbar-hide h-full lg:pr-6"
            >
              <div className="flex flex-col gap-3 sm:gap-4 w-full pb-4">
                {filteredJobs.length === 0 ? (
                  <div className="flex flex-col gap-y-2 items-center justify-center py-8 sm:py-12 px-4">
                    <Image
                      src={EmptyState}
                      alt="empty state"
                      className="w-48 h-48 sm:w-64 sm:h-64"
                    />
                    <h1 className="mt-4 text-lg sm:text-xl font-semibold text-neutral-90 text-center">
                      No jobs openings available
                    </h1>
                    <p className="text-sm sm:text-[16px] text-neutral-60 text-center max-w-md">
                      Create a job opening now and start the candidate process.
                    </p>
                    <Button
                      label="Create a new job"
                      variant="secondary"
                      size="small"
                      onClick={() => setOpenCreateJob(true)}
                      className="mt-2"
                    />
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <ModalJobAdmin
                      key={job.id}
                      date={job.created_at}
                      salary={job.salary_range?.display_text}
                      title={job.title || "-"}
                      status={job.status || "Unknown"}
                      onClick={() => handleManageCandidateClick(job.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* custom scrollbar */}
            <div className="hidden lg:block absolute -top-16 -right-[360px] w-2.5 h-[80vh] bg-neutral-200 rounded-full">
              <div
                style={{ height: thumbHeight, top: thumbTop }}
                className="absolute w-full bg-primary-main rounded-full transition-all"
              ></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex relative flex-col w-full md:w-80 lg:w-[300px] shrink-0">
          <div
            className="relative w-full h-40 sm:h-44 lg:h-[168px] p-5 sm:p-6 rounded-2xl overflow-hidden shadow-lg 
            text-neutral-20 flex flex-col justify-center items-start bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/bg-modal.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 mb-4 sm:mb-6">
              <h1 className="text-sm sm:text-[16px] mb-1 font-semibold">
                Recruit the best candidates
              </h1>
              <p className="text-xs sm:text-sm font-semibold">
                Create jobs, invite, and hire with ease
              </p>
            </div>

            <div className="relative z-10 w-full">
              <Button
                label="Create new job"
                size="full"
                onClick={() => setOpenCreateJob(true)}
              />
            </div>
          </div>
        </div>

        {/* FAB Mobile */}
        <div className="rounded-full shadow-lg flex items-center justify-center z-50 active:scale-95 transition-transform md:hidden fixed bottom-6 right-6 w-14 h-14">
          <Button
            onClick={() => setOpenCreateJob(true)}
            leftIcon={<PlusIcon width={15} />}
          />
        </div>
      </div>

      <ModalCreateJob
        open={openCreateJob}
        onClose={() => setOpenCreateJob(false)}
        form={form}
        setForm={setForm}
        onSuccess={fetchJobs}
      />
    </div>
  );
};

export default JobList;
