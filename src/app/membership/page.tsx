"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ToastContainer from "@/components/ui/ToastContainer";
import { useToast } from "@/hooks/useToast";
import { membershipFormSchema, MembershipFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MembershipPage() {
  const { toasts, showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      applicantType: "barber",
      membershipLevel: "white",
      email: "",
    },
  });

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email);
      formData.append("barbershopName", data.barbershopName);
      formData.append("address", data.address);
      formData.append("applicantType", data.applicantType);
      formData.append("membershipLevel", data.membershipLevel);
      photos.forEach((photo) => formData.append("photos", photo));

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
                Thank you for applying to join the Ethiopian Barbers and Owners
                Association. Your application has been received and is under review.
              </p>
              <div className="bg-off-white p-4 rounded-sm mb-8">
                <p className="text-sm text-gray-500">Application Reference</p>
                <p className="text-xl font-bold text-gold">{applicationId}</p>
              </div>
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
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>

          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Logo size="xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Membership Application
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Complete the form below to apply for membership.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Full Name of the Member *
                </label>
                <input
                  {...register("fullName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Phone Number *
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="+251..."
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Barbershop Name *
                </label>
                <input
                  {...register("barbershopName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="Name of barbershop"
                />
                {errors.barbershopName && (
                  <p className="text-red-500 text-xs mt-1">{errors.barbershopName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Address *
                </label>
                <input
                  {...register("address")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="Full address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="applicantType" className="block text-sm font-medium text-charcoal mb-1">
                  Member Type *
                </label>
                <select
                  id="applicantType"
                  {...register("applicantType")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="barber">Barber</option>
                  <option value="owner">Barbershop Owner</option>
                </select>
                {errors.applicantType && (
                  <p className="text-red-500 text-xs mt-1">{errors.applicantType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="membershipLevel" className="block text-sm font-medium text-charcoal mb-1">
                  Membership Level *
                </label>
                <select
                  id="membershipLevel"
                  {...register("membershipLevel")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="gold">Gold Level</option>
                  <option value="silver">Silver Level</option>
                  <option value="white">White Level</option>
                </select>
                {errors.membershipLevel && (
                  <p className="text-red-500 text-xs mt-1">{errors.membershipLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Photos <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-sm hover:border-gold transition-colors bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-500 truncate">
                      {photos.length > 0
                        ? `${photos.length} photo(s) selected`
                        : "Click to upload photos (optional)"}
                    </span>
                  </div>
                </div>
              </div>
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
