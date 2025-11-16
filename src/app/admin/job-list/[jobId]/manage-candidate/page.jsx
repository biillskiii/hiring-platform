"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Chip from "@/components/ui/chip";
import DataTable from "@/components/admin/table";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import Dropdown from "@/components/ui/dropdown";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";
const ManageCandidate = () => {
  const { jobId } = useParams();
  const { role } = useAdminAuth();

  const [jobTitle, setJobTitle] = useState("");
  const [jobStatus, setJobStatus] = useState("active");
  const [candidate, setCandidate] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const columns = [
    { key: "full_name", label: "Nama Lengkap" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "domicile", label: "Domicile" },
    { key: "gender", label: "Gender" },
    { key: "linkedin", label: "LinkedIn" },
  ];

  // Ambil job title + status
  useEffect(() => {
    if (!jobId) return;

    const numericId = Number(jobId);
    if (isNaN(numericId)) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("job_details")
        .select("title, status")
        .eq("id", numericId)
        .single();

      if (!error && data) {
        setJobTitle(data.title);
        setJobStatus(data.status || "active");
      }
    };

    fetchJob();
  }, [jobId]);

  // Ambil candidate berdasarkan job_id
  useEffect(() => {
    if (!jobId) return;

    const numericId = Number(jobId);
    if (isNaN(numericId)) return;

    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from("candidate_list")
        .select("*")
        .eq("job_id", numericId);

      if (!error) setCandidate(data || []);
      setLoadingData(false);
    };

    fetchCandidate();
  }, [jobId]);

  // Handler update status
  const handleUpdateStatus = async () => {
    if (!jobId) return;

    setSavingStatus(true);

    const numericId = Number(jobId);

    const { error } = await supabase
      .from("job_details")
      .update({ status: jobStatus })
      .eq("id", numericId);

    setSavingStatus(false);

    if (error) {
      toast.error("Gagal mengupdate status!");
      return;
    }

    toast.success("Job status berhasil diperbarui!");
  };

  if (role !== "admin") return null;

  return (
    <div className="min-h-screen w-full p-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-x-2 mb-6">
        <Chip label={"Job List"} variant="tertiary" />
        <ChevronRightIcon className="w-3 h-3 text-black" />
        <Chip label={"Manage Candidate"} variant="outline" />
      </div>

      {/* Job Title */}
      <h1 className="text-xl font-semibold text-neutral-100 mb-4">
        {jobTitle}
      </h1>

      {/* STATUS DROPDOWN + SAVE BUTTON */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-48">
          <Dropdown
            label="Job Status"
            value={
              {
                active: "Active",
                inactive: "Inactive",
                draft: "Draft",
              }[jobStatus]
            }
            onChange={(val) => {
              const map = {
                Active: "active",
                Inactive: "inactive",
                Draft: "draft",
              };
              setJobStatus(map[val]);
            }}
            options={[
              { label: "Active" },
              { label: "Inactive" },
              { label: "Draft" },
            ]}
          />
        </div>

        <Button
          label={savingStatus ? "Saving..." : "Save Status"}
          size="small"
          onClick={handleUpdateStatus}
          disabled={savingStatus}
        />
      </div>

      {/* Table Candidate */}
      {loadingData ? (
        <p className="text-neutral-70">Loading candidate data...</p>
      ) : (
        <DataTable columns={columns} data={candidate} />
      )}
    </div>
  );
};

export default ManageCandidate;
