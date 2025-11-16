"use client";
import React, { useState, useEffect } from "react";

import TextInput from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import DatePicker from "@/components/ui/datepicker";
import jobData from "@/data/job-list.json";
import RadioButton from "@/components/ui/radio-button";
import PhoneNumberInput from "@/components/ui/input-number";
import GestureCaptureModal from "@/components/candidate/profile-capture";
import { CameraIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/button";
import useMessageHelper from "@/helpers/useErrorHelper";
import { supabase } from "@/lib/supabaseClient";
import { countries } from "@/components/ui/input-number";
import { useSearchParams } from "next/navigation";

const Resume = ({ name, email, linkedin }) => {
  // Basic state
  const [cities, setCities] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(name || "");
  const [userEmail, setUserEmail] = useState(email || "");
  const [linkedinUser, setLinkedinUser] = useState(linkedin || "");
  const [pronoun, setPronoun] = useState("");
  const [domicile, setDomicile] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(countries[0]);

  const [linkedinStatus, setLinkedinStatus] = useState(null); // <-- DIBUAT PROPER

  const { message, type, showMessage } = useMessageHelper();
  const [error, setErrors] = useState({});

  const searchParams = useSearchParams();
  const position = searchParams.get("position");
  const company = searchParams.get("company");
  const jobId = searchParams.get("id");

  const [fieldRules, setFieldRules] = useState(null);

  // Helpers
  const isVisible = (status) => status !== "Off";
  const isRequired = (status) => status === "Mandatory";

  // City options
  useEffect(() => {
    if (jobData?.cityOptions) setCities(jobData.cityOptions);
  }, []);

  // Fetch field rules
  useEffect(() => {
    async function fetchFieldRules() {
      const { data, error } = await supabase
        .from("job_details")
        .select("field_rules")
        .eq("id", jobId)
        .single();

      if (error || !data) return;

      setFieldRules({
        fullName: data.field_rules.fullname_status,
        email: data.field_rules.email_status,
        linkedin: data.field_rules.linkedin_status,
        phone: data.field_rules.phone_status,
        dob: data.field_rules.dob_status,
        photo: data.field_rules.photo_status,
        domicile: data.field_rules.domicile_status,
        gender: data.field_rules.gender_status,
      });
    }

    fetchFieldRules();
  }, [jobId]);

  // LinkedIn validation
  const validateLinkedIn = (value) => {
    const regex =
      /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[A-Za-z0-9-_]+\/?$/;

    if (regex.test(value.trim())) {
      setLinkedinStatus("valid");
      return true;
    } else {
      setLinkedinStatus("invalid");
      return false;
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!fieldRules) return;

    const newErrors = {};

    if (isRequired(fieldRules.fullName) && !fullName.trim())
      newErrors.fullName = "Nama lengkap wajib.";

    if (isRequired(fieldRules.email) && !userEmail.trim())
      newErrors.userEmail = "Email wajib.";

    if (isRequired(fieldRules.linkedin) && !linkedinUser.trim())
      newErrors.linkedin = "LinkedIn wajib.";

    if (isRequired(fieldRules.phone) && !phone.trim())
      newErrors.phone = "Nomor HP wajib.";

    if (isRequired(fieldRules.gender) && !pronoun)
      newErrors.pronoun = "Gender wajib.";

    if (isRequired(fieldRules.dob) && !dateOfBirth)
      newErrors.dob = "Tanggal lahir wajib.";

    if (isRequired(fieldRules.photo) && !profilePhoto)
      newErrors.photo = "Foto wajib.";

    if (isRequired(fieldRules.domicile) && !domicile)
      newErrors.domicile = "Domicile wajib.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      full_name: fullName,
      email: userEmail,
      phone: `${country.dial}${phone}`,
      domicile,
      gender: pronoun,
      date_of_birth: dateOfBirth,
      linkedin: linkedinUser,
      profile_photo: profilePhoto,
      job_id: jobId,
    };

    const { error } = await supabase
      .from("candidate_list")
      .insert(payload)
      .select();

    if (error) {
      console.log(error);
      return message("Gagal menyimpan data kandidat.");
    }

    const slug = position?.toLowerCase().replace(/\s+/g, "-") || "job";
    window.location.href = `/${slug}/resume/success-apply`;
  };

  const handleBack = () => {
    window.location.href = `/`;
  };

  if (!fieldRules) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-neutral-20">
      <div className="w-[700px] bg-neutral-10 border border-neutral-40 rounded-md p-8 space-y-6">
        <div className="overflow-y-auto pr-2 space-y-6 flex-1">
          {/* HEADER */}
          <div className="flex items-center gap-x-5">
            <Button
              rightIcon={<ArrowLeftIcon width={20} />}
              size="small"
              variant="outline"
              onClick={handleBack}
            />
            <h1 className="text-xl font-semibold">
              Apply {position} at {company}
            </h1>
          </div>

          {/* GLOBAL MESSAGE */}
          {message && (
            <div
              className={`p-3 rounded-md mb-4 text-sm ${
                type === "error"
                  ? "bg-danger-main text-white"
                  : "bg-success-main text-white"
              }`}
            >
              {message}
            </div>
          )}

          {/* PHOTO */}
          {isVisible(fieldRules.photo) && (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Photo Profile{" "}
                {isRequired(fieldRules.photo) && (
                  <span className="text-red-600">*</span>
                )}
              </h3>

              <div className="flex items-center space-x-4">
                <div>
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 
                    ${
                      isRequired(fieldRules.photo)
                        ? "border-danger-main"
                        : "border-indigo-500"
                    }`}
                  >
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CameraIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>

                  <Button
                    label="Take Profile Picture"
                    leftIcon={<CameraIcon className="w-4 h-4" />}
                    variant="outline"
                    size="small"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3"
                  />

                  {error.photo && (
                    <p className="text-xs text-danger-main mt-1">
                      {error.photo}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <GestureCaptureModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPhotoCapture={setProfilePhoto}
          />

          {/* FULL NAME */}
          {isVisible(fieldRules.fullName) && (
            <div className="space-y-2">
              <TextInput
                label="Full name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={error.fullName}
                required={isRequired(fieldRules.fullName)}
              />
            </div>
          )}

          {/* DOB */}
          {isVisible(fieldRules.dob) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-70">
                Date of Birth{" "}
                {isRequired(fieldRules.dob) && (
                  <span className="text-danger-main ml-0.5">*</span>
                )}
              </label>

              <DatePicker
                selectedDate={dateOfBirth}
                onDateChange={setDateOfBirth}
                error={error.dob}
              />
            </div>
          )}

          {/* GENDER */}
          {isVisible(fieldRules.gender) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-70">
                Pronoun (gender)
                {isRequired(fieldRules.gender) && (
                  <span className="text-danger-main ml-0.5">*</span>
                )}
              </label>

              <RadioButton
                name="pronoun"
                value={pronoun}
                onChange={(val) => setPronoun(val)}
                options={["He/Him", "She/Her"]}
              />

              {error.pronoun && (
                <p className="text-danger-main text-xs">{error.pronoun}</p>
              )}
            </div>
          )}

          {/* DOMICILE */}
          {isVisible(fieldRules.domicile) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-70">
                Domicile{" "}
                {isRequired(fieldRules.domicile) && (
                  <span className="text-danger-main ml-0.5">*</span>
                )}
              </label>

              <Dropdown
                label="Choose your domicile"
                options={cities}
                value={domicile}
                onChange={(val) => setDomicile(val)}
                error={error.domicile}
              />
            </div>
          )}

          {/* PHONE */}
          {isVisible(fieldRules.phone) && (
            <div className="space-y-2">
              <PhoneNumberInput
                label="Phone number"
                required={isRequired(fieldRules.phone)}
                value={phone}
                onChange={(val) => setPhone(val)}
                country={country}
                onCountryChange={setCountry}
                error={error.phone}
              />
            </div>
          )}

          {/* EMAIL */}
          {isVisible(fieldRules.email) && (
            <div className="space-y-2">
              <TextInput
                label="Email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required={isRequired(fieldRules.email)}
                error={error.userEmail}
              />
            </div>
          )}

          {/* LINKEDIN */}
          {isVisible(fieldRules.linkedin) && (
            <div className="space-y-2">
              <TextInput
                label="Link LinkedIn"
                value={linkedinUser}
                onChange={(e) => {
                  setLinkedinUser(e.target.value);
                  setLinkedinStatus(null);
                }}
                onBlur={() => validateLinkedIn(linkedinUser)}
                placeholder="https://linkedin.com/in/username"
                required={isRequired(fieldRules.linkedin)}
                error={
                  linkedinStatus === "invalid"
                    ? "Link LinkedIn tidak valid."
                    : error.linkedin
                }
                success={
                  linkedinStatus === "valid" && (
                    <p className="text-green-600 text-xs">LinkedIn valid</p>
                  )
                }
              />
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <Button
            label="Submit Resume"
            variant="primary"
            size="full"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Resume;
