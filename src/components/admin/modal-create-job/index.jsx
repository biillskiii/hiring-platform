"use client";

import React, { useState } from "react";
import TextInput from "@/components/ui/input";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Dropdown from "@/components/ui/dropdown";
import TextArea from "@/components/ui/text-area";
import SwitchGroup from "@/components/admin/switch-group";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

const ModalCreateJob = ({ open, onClose, onSuccess }) => {
  const [errors, setErrors] = useState({});

  const initialForm = {
    title: "",
    company: "",
    company_logo: "",
    location: "",
    type: "",
    description: [],
    candidate_needed: "",
    salary_min: "",
    salary_max: "",
    fullname_status: "Mandatory",
    photo_status: "Mandatory",
    gender_status: "Mandatory",
    domicile_status: "Mandatory",
    email_status: "Mandatory",
    phone_status: "Mandatory",
    linkedin_status: "Mandatory",
    dob_status: "Mandatory",
    cta: "Apply",
    status: "active",
  };

  const [form, setForm] = useState(initialForm);
  if (!open) return null;

  const jobTypes = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
  ];

  // -------------------
  // VALIDATION
  // -------------------
  function validate() {
    let newErrors = {};

    if (!form.title) newErrors.title = "Job name is required";
    if (!form.company) newErrors.company = "Company name is required";
    if (!form.type) newErrors.type = "Job type is required";
    if (!form.description || form.description.length === 0)
      newErrors.description = "Description is required";
    if (!form.candidate_needed) newErrors.candidate_needed = "Required";
    if (!form.salary_min) newErrors.salary_min = "Required";
    if (!form.salary_max) newErrors.salary_max = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // -------------------
  // SUBMIT
  // -------------------
  async function handleSubmit() {
    if (!validate()) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      slug: form.title.toLowerCase().replace(/ /g, "-"),
      title: form.title,
      company: form.company,
      company_logo: form.company_logo || null,

      location: form.location || null,
      type: form.type,

      salary_range: {
        min: Number(form.salary_min),
        max: Number(form.salary_max),
        currency: "IDR",
        display_text: `Rp${Number(form.salary_min).toLocaleString(
          "id-ID"
        )} - Rp${Number(form.salary_max).toLocaleString("id-ID")}`,
      },

      job_details: [
        {
          key: "description",
          title: "Deskripsi Pekerjaan",
          items: form.description.filter((d) => d.trim() !== ""),
        },
      ],

      field_rules: {
        fullname_status: form.fullname_status,
        photo_status: form.photo_status,
        gender_status: form.gender_status,
        domicile_status: form.domicile_status,
        email_status: form.email_status,
        phone_status: form.phone_status,
        linkedin_status: form.linkedin_status,
        dob_status: form.dob_status,
      },

      cta: form.cta,
      created_at: new Date().toISOString(),
      position_type: form.type,
      min_candidate: Number(form.candidate_needed),
      status: form.status,
    };

    const { error } = await supabase.from("job_details").insert(payload);

    if (error) {
      console.error("Supabase error:", error);
      toast.error("Failed to create job", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.success("Job successfully created!", {
        position: "top-right",
        autoClose: 3000,
      });

      setForm(initialForm);
      setErrors({});
      onClose();
      if (onSuccess) onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-lg z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-neutral-900">
            Job Opening
          </h1>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-neutral-700 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          {/* Job Name */}
          <TextInput
            label="Job Name"
            placeholder="Ex. Front End Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
          />

          {/* Company Name */}
          <TextInput
            label="Company Name"
            placeholder="Ex. Tokopedia"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            error={errors.company}
          />

          {/* Job Type */}
          <div>
            <label className="text-sm font-medium mb-1 block">Job Type *</label>
            <Dropdown
              options={jobTypes}
              value={form.type}
              placeholder="Select job type"
              onChange={(val) => setForm({ ...form, type: val })}
              error={errors.type}
            />
          </div>

          {/* Location */}
          <TextInput
            label="Company Location"
            placeholder="Ex. Jakarta, Bandung"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          {/* Description */}
          <TextArea
            label="Job Description"
            placeholder="Write job description..."
            value={form.description.map((d) => `• ${d}`).join("\n")}
            error={errors.description}
            onChange={(e) => {
              const lines = e.target.value
                .split("\n")
                .map((line) => line.replace(/^•\s?/, ""));
              setForm({ ...form, description: lines });
            }}
          />

          {/* Candidate Needed */}
          <TextInput
            label="Number of Candidate Needed"
            placeholder="Ex. 2"
            value={form.candidate_needed}
            onChange={(e) =>
              setForm({ ...form, candidate_needed: e.target.value })
            }
            error={errors.candidate_needed}
          />

          {/* Salary */}
          <div>
            <label className="text-sm font-medium text-neutral-700">
              Job Salary
            </label>

            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <TextInput
                  label="Minimum Estimated Salary"
                  placeholder="Rp 7.000.000"
                  value={form.salary_min}
                  onChange={(e) =>
                    setForm({ ...form, salary_min: e.target.value })
                  }
                  error={errors.salary_min}
                />
              </div>

              <div>
                <TextInput
                  label="Maximum Estimated Salary"
                  placeholder="Rp 10.000.000"
                  value={form.salary_max}
                  onChange={(e) =>
                    setForm({ ...form, salary_max: e.target.value })
                  }
                  error={errors.salary_max}
                />
              </div>
            </div>

            {/* Company Logo URL */}
            <div className="mt-4">
              <TextInput
                label="Company Logo URL"
                placeholder="https://example.com/logo.png"
                value={form.company_logo}
                onChange={(e) =>
                  setForm({ ...form, company_logo: e.target.value })
                }
              />
            </div>

            {/* MINIMUM PROFILE */}
            <div className="mt-8 bg-neutral-20 border border-neutral-40 rounded-lg p-5">
              <h2 className="text-base font-semibold mb-4">
                Minimum Profile Information Required
              </h2>

              <div className="flex flex-col gap-3">
                {[
                  ["Full name", "fullname_status"],
                  ["Photo Profile", "photo_status"],
                  ["Gender", "gender_status"],
                  ["Domicile", "domicile_status"],
                  ["Email", "email_status"],
                  ["Phone number", "phone_status"],
                  ["LinkedIn link", "linkedin_status"],
                  ["Date of birth", "dob_status"],
                ].map(([label, key]) => (
                  <SwitchGroup
                    key={key}
                    label={label}
                    value={form[key]}
                    onChange={(v) => setForm({ ...form, [key]: v })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-8">
          <Button
            label="Create Job"
            variant="primary"
            size="small"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalCreateJob;
