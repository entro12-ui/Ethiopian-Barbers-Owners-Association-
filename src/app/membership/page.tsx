"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ToastContainer from "@/components/ui/ToastContainer";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useToast } from "@/hooks/useToast";
import { interpolate } from "@/lib/i18n";
import { createMembershipFormSchema, MembershipFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function MembershipPage() {
  const { locale, t } = useI18n();
  const { toasts, showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const schema = useMemo(() => createMembershipFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(schema),
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
        throw new Error(result.error || t.membership.submitError);
      }

      setApplicationId(result.applicationId);
      setIsSubmitted(true);
      showToast(t.membership.submitSuccess, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t.membership.submitError,
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
                {t.membership.successTitle}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t.membership.successBody}
              </p>
              <div className="bg-off-white p-4 rounded-sm mb-8">
                <p className="text-sm text-gray-500">{t.membership.reference}</p>
                <p className="text-xl font-bold text-gold">{applicationId}</p>
              </div>
              <Link href="/">
                <Button>{t.common.returnHome}</Button>
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
            {t.common.backHome}
          </Link>

          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Logo size="xl" alt={t.site.logoAlt} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {t.membership.title}
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t.membership.subtitle}
            </p>
          </div>

          <form key={locale} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.fullName}
                </label>
                <input
                  {...register("fullName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder={t.membership.fullNamePlaceholder}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.phone}
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
                  {t.membership.email} <span className="text-gray-400 font-normal">{t.membership.optional}</span>
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
                  {t.membership.barbershopName}
                </label>
                <input
                  {...register("barbershopName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder={t.membership.barbershopNamePlaceholder}
                />
                {errors.barbershopName && (
                  <p className="text-red-500 text-xs mt-1">{errors.barbershopName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.address}
                </label>
                <input
                  {...register("address")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder={t.membership.addressPlaceholder}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="applicantType" className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.memberType}
                </label>
                <select
                  id="applicantType"
                  {...register("applicantType")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="barber">{t.membership.barber}</option>
                  <option value="owner">{t.membership.owner}</option>
                </select>
                {errors.applicantType && (
                  <p className="text-red-500 text-xs mt-1">{errors.applicantType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="membershipLevel" className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.membershipLevel}
                </label>
                <select
                  id="membershipLevel"
                  {...register("membershipLevel")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="gold">{t.membership.gold}</option>
                  <option value="silver">{t.membership.silver}</option>
                  <option value="white">{t.membership.white}</option>
                </select>
                {errors.membershipLevel && (
                  <p className="text-red-500 text-xs mt-1">{errors.membershipLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t.membership.photos} <span className="text-gray-400 font-normal">{t.membership.optional}</span>
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
                        ? interpolate(t.membership.photosSelected, { count: photos.length })
                        : t.membership.photosHint}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.membership.submitting}
                </>
              ) : (
                t.membership.submit
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
