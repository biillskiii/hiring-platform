"use client";
import Image from "next/image";
import Button from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { useRouter } from "next/navigation";

const JobDetail = ({ job }) => {
  const router = useRouter();

  if (!job) return null;

  const {
    title,
    company,
    type,
    salary_range,
    job_details,
    company_logo,
    cta,
    location,
    slug,
    id,
  } = job;

  // FIX PENTING
  const mainDescription = Array.isArray(job_details)
    ? job_details.find((d) => d.key === "description")
    : null;

  // Handler Apply
  const handleApply = () => {
    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

    router.push(
      `/${cleanSlug}/resume?position=${encodeURIComponent(
        title
      )}&company=${encodeURIComponent(company)}&id=${id}`
    );
  };

  return (
    <div className="w-full max-w-[802px] border border-neutral-40 rounded-lg p-4 sm:p-5 lg:p-6 bg-neutral-5">
      {/* Header Detail */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        {/* Company Info */}
        <div className="flex items-start space-x-3 sm:space-x-4 lg:space-x-5 flex-1">
          <div className="border border-neutral-40 rounded-sm w-10 h-10 sm:w-12 sm:h-12 wrap-flex-shrink-0 overflow-hidden">
            <Image
              src={company_logo || "/placeholder.png"}
              alt={title}
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="w-fit">
              <Chip label={type} variant="primary" />
            </div>
            <h1 className="text-base sm:text-lg lg:text-[18px] font-bold wrao-break-words">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-70 wrap-break-words">
              {company}
            </p>
          </div>
        </div>

        {/* Tombol Apply */}
        <div className="w-full sm:w-auto shrink-0">
          <Button
            label={cta}
            variant="secondary"
            size="small"
            onClick={handleApply}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <hr className="my-3 sm:my-4 border-neutral-20" />

      {/* Salary & Location */}
      <div className="mb-4 sm:mb-5 lg:mb-6 space-y-2 text-xs sm:text-sm text-neutral-60">
        <div className="flex items-start gap-2">
          <span className="shrink-0">💰</span>
          <p className="wrap-break-words">
            <span className="font-medium">Gaji:</span>{" "}
            {salary_range?.display_text}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="shrink-0">📍</span>
          <p className="wrap-break-words">
            <span className="font-medium">Lokasi:</span> {location}
          </p>
        </div>
      </div>

      {/* Detail Pekerjaan (Description) */}
      {mainDescription && (
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 wrap-break-words">
            {mainDescription.title}
          </h2>

          <ul className="list-disc space-y-1.5 sm:space-y-2 pl-5 sm:pl-6 text-sm sm:text-base text-neutral-80">
            {mainDescription.items?.map((item, index) => (
              <li key={index} className="wrap-break-words leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
