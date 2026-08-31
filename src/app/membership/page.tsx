"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/ToastContainer";
import { useToast } from "@/hooks/useToast";
import { membershipFormSchema, MembershipFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Briefcase,
  FileUp,
  Camera,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MembershipPage() {
  const { toasts, showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [applicantType, setApplicantType] = useState<"owner" | "barber">("barber");

  const [files, setFiles] = useState<Record<string, File | null>>({
    nationalId: null,
    businessLicense: null,
    cocCertificate: null,
    workExperience: null,
    photo1: null,
    photo2: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      applicantType: "barber",
      agreement: undefined,
    },
  });

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const onSubmit = async (data: MembershipFormData) => {
    if (!files.nationalId) {
      showToast("Please upload your National ID or Driver's License", "error");
      return;
    }
    if (!files.photo1 || !files.photo2) {
      showToast("Please upload both membership photographs", "error");
      return;
    }
    if (data.applicantType === "owner" && !files.businessLicense) {
      showToast("Please upload your business license", "error");
      return;
    }
    if (data.applicantType === "barber" && !files.cocCertificate && !files.workExperience) {
      showToast("Please upload COC certificate or proof of work experience", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const response = await fetch("/api/membership", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setApplicationId(result.applicationId);
      setIsSubmitted(true);
      showToast("Application submitted successfully!", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to submit application",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUpload = ({
    label,
    field,
    required = false,
    accept = "image/jpeg,image/png,image/webp,application/pdf",
  }: {
    label: string;
    field: string;
    required?: boolean;
    accept?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-sm hover:border-gold transition-colors bg-gray-50">
          <Upload className="w-5 h-5 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-500 truncate">
            {files[field]?.name || "Click to upload or drag file here"}
          </span>
        </div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-off-white pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-4">
                Application Submitted Successfully
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thank you for applying to join the Ethiopian Hairdressers and Owners
                Association. Your application has been received and is under review.
              </p>
              <div className="bg-off-white p-4 rounded-sm mb-8">
                <p className="text-sm text-gray-500">Application Reference</p>
                <p className="text-xl font-bold text-gold">{applicationId}</p>
              </div>
              <p className="text-sm text-gray-500 mb-8">
                You will be contacted once your application has been reviewed. Please
                keep your application reference number for future inquiries.
              </p>
              <Link href="/">
                <Button>Return to Homepage</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <main className="min-h-screen bg-off-white pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Membership Application
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Complete the form below to apply for membership in the Ethiopian
              Hairdressers and Owners Association.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">Personal Information</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                  <input
                    {...register("fullName")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Date of Birth *</label>
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="+251..."
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                  <input
                    {...register("city")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
                  <input
                    {...register("address")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="Full address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">Professional Information</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-3">I am a: *</label>
                <div className="flex gap-4">
                  {(["barber", "owner"] as const).map((type) => (
                    <label
                      key={type}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-sm cursor-pointer transition-all ${
                        applicantType === type
                          ? "border-gold bg-gold/10 text-charcoal font-semibold"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("applicantType")}
                        onChange={(e) => {
                          setApplicantType(e.target.value as "owner" | "barber");
                          setValue("applicantType", e.target.value as "owner" | "barber");
                        }}
                        className="sr-only"
                      />
                      {type === "barber" ? "Professional Barber" : "Barbershop Owner"}
                    </label>
                  ))}
                </div>
                {errors.applicantType && <p className="text-red-500 text-xs mt-1">{errors.applicantType.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Profession *</label>
                  <input
                    {...register("profession")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="e.g., Barber, Hairdresser"
                  />
                  {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Years of Experience *</label>
                  <input
                    {...register("yearsOfExperience")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="e.g., 5"
                  />
                  {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Barbershop Name</label>
                  <input
                    {...register("barbershopName")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="Name of barbershop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Barbershop Address</label>
                  <input
                    {...register("barbershopAddress")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder="Barbershop location"
                  />
                </div>
              </div>
            </section>

            {/* Identification */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">Identification</h2>
              </div>
              <FileUpload
                label="National ID / Driver's License"
                field="nationalId"
                required
              />
            </section>

            {/* Professional Documentation */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">Professional Documentation</h2>
              </div>

              {applicantType === "owner" ? (
                <FileUpload label="Business License" field="businessLicense" required />
              ) : (
                <div className="space-y-4">
                  <FileUpload label="COC Certificate" field="cocCertificate" />
                  <p className="text-sm text-gray-500 text-center">— OR —</p>
                  <FileUpload label="Proof of Work Experience" field="workExperience" />
                </div>
              )}
            </section>

            {/* Membership Photos */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-charcoal">Membership Photos</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Upload two recent head photographs for your membership ID.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <FileUpload label="Photo 1" field="photo1" required accept="image/jpeg,image/png,image/webp" />
                <FileUpload label="Photo 2" field="photo2" required accept="image/jpeg,image/png,image/webp" />
              </div>
            </section>

            {/* Agreement */}
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agreement")}
                  className="mt-1 w-4 h-4 accent-gold"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I confirm that the information and documents provided in this application
                  are accurate and authentic. *
                </span>
              </label>
              {errors.agreement && <p className="text-red-500 text-xs mt-2">{errors.agreement.message}</p>}
            </section>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Membership Application"
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
