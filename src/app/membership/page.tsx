"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ToastContainer from "@/components/ui/ToastContainer";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useToast } from "@/hooks/useToast";
import { MEMBERSHIP_PAYMENT, telegramInvoiceBotDeepLink } from "@/lib/constants";
import { interpolate } from "@/lib/i18n";
import { ALLOWED_INVOICE_TYPES, MAX_FILE_SIZE } from "@/lib/membership";
import { createMembershipFormSchema, MembershipFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  Upload,
  Copy,
  Check,
  X,
  Scissors,
  Store,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

type MembershipLevel = "gold" | "silver" | "white";
type PayMethod = "bank" | "telebirr";
type ApplicantType = "barber" | "owner";

const LEVEL_ORDER: MembershipLevel[] = ["gold", "silver", "white"];

function FieldHelp({ children }: { children: ReactNode }) {
  return <p className="text-xs text-[#1a5a6e] mt-1.5 leading-relaxed">{children}</p>;
}

function StepLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-sm font-semibold tabular-nums ring-1 ring-gold/35">
        {step}
      </span>
      <h2 className="font-display text-xl md:text-2xl text-charcoal tracking-tight">{label}</h2>
    </div>
  );
}

export default function MembershipPage() {
  const { locale, t } = useI18n();
  const { toasts, showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [telegramBotLink, setTelegramBotLink] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("bank");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const schema = useMemo(() => createMembershipFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      applicantType: "barber",
      membershipLevel: "white",
      email: "",
      telegramUsername: "",
    },
  });

  const selectedLevel = watch("membershipLevel") as MembershipLevel;
  const selectedType = watch("applicantType") as ApplicantType;
  const amountDue = MEMBERSHIP_PAYMENT.fees[selectedLevel];

  useEffect(() => {
    if (!invoice || !invoice.type.startsWith("image/")) {
      setInvoicePreview(null);
      return;
    }
    const url = URL.createObjectURL(invoice);
    setInvoicePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [invoice]);

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      showToast(t.membership.copied, "success");
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast(t.membership.submitError, "error");
    }
  };

  const levelLabel = (level: MembershipLevel) => {
    if (level === "gold") return t.membership.gold;
    if (level === "silver") return t.membership.silver;
    return t.membership.white;
  };

  const levelBenefit = (level: MembershipLevel) => {
    if (level === "gold") return t.membership.goldBenefit;
    if (level === "silver") return t.membership.silverBenefit;
    return t.membership.whiteBenefit;
  };

  const onSubmit = async (data: MembershipFormData) => {
    if (!invoice) {
      showToast(t.membership.invoiceRequired, "error");
      return;
    }
    if (invoice.size > MAX_FILE_SIZE || !ALLOWED_INVOICE_TYPES.includes(invoice.type)) {
      showToast(t.membership.invoiceHint, "error");
      return;
    }

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
      formData.append("telegramUsername", String(data.telegramUsername));
      photos.forEach((photo) => formData.append("photos", photo));
      formData.append("invoice", invoice);

      const response = await fetch("/api/membership", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t.membership.submitError);
      }

      setApplicationId(result.applicationId);
      setTelegramBotLink(
        result.telegramBotLink || telegramInvoiceBotDeepLink(result.applicationId)
      );
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
        <main className="relative min-h-screen membership-atmosphere pt-24 pb-16 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center relative z-10">
            <div className="bg-[#ffffff]/95 backdrop-blur-sm p-8 md:p-12 border border-gold/25 shadow-[0_20px_50px_-24px_rgba(18,20,26,0.35)] animate-soft-reveal">
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-brown/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-gold/25">
                <CheckCircle className="w-8 h-8 text-gold" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-charcoal mb-4">
                {t.membership.successTitle}
              </h1>
              <p className="text-[#1a5a6e] mb-6 leading-relaxed">{t.membership.successBody}</p>
              <div className="bg-off-white border border-gold/25 p-4 mb-8">
                <p className="text-xs uppercase tracking-[0.15em] text-[#1a5a6e]">
                  {t.membership.reference}
                </p>
                <p className="text-xl font-semibold text-gold mt-1 tabular-nums">{applicationId}</p>
              </div>
              <p className="text-sm text-[#1a5a6e] mb-4">{t.membership.telegramStartHint}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={telegramBotLink || telegramInvoiceBotDeepLink(applicationId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button>{t.membership.telegramStartCta}</Button>
                </a>
                <Link href={`/membership/status?ref=${encodeURIComponent(applicationId)}`}>
                  <Button variant="outline">{t.membership.checkStatus}</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">{t.common.returnHome}</Button>
                </Link>
              </div>
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

      <main className="relative min-h-screen membership-atmosphere pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1a5a6e] hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common.backHome}
          </Link>

          <header className="text-center mb-12 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <Logo size="xl" alt={t.site.logoAlt} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-3">
              {t.membership.eyebrow}
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal mb-4 tracking-tight">
              {t.membership.title}
            </h1>
            <div className="mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
            <p className="text-[#1a5a6e] max-w-xl mx-auto leading-relaxed">
              {t.membership.subtitle}
            </p>
            <p className="mt-4">
              <Link href="/membership/status" className="text-sm text-gold hover:underline">
                {t.membership.checkStatus}
              </Link>
            </p>
          </header>

          <form key={locale} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 — Role */}
            <section className="bg-[#ffffff]/95 backdrop-blur-sm p-6 md:p-8 border border-gold/20 shadow-[0_12px_40px_-20px_rgba(18,20,26,0.22)] animate-fade-in-up animation-delay-200">
              <StepLabel step={1} label={t.membership.stepRole} />
              <p className="text-sm text-[#1a5a6e] mb-4 leading-relaxed">
                {t.membership.memberTypeIntro}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      id: "barber" as const,
                      label: t.membership.barber,
                      help: t.membership.barberHelp,
                      Icon: Scissors,
                    },
                    {
                      id: "owner" as const,
                      label: t.membership.owner,
                      help: t.membership.ownerHelp,
                      Icon: Store,
                    },
                  ] as const
                ).map(({ id, label, help, Icon }) => {
                  const selected = selectedType === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        setValue("applicantType", id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`text-left p-4 border transition-all duration-300 ${
                        selected
                          ? "border-gold bg-gradient-to-br from-gold/18 to-brown/8 ring-1 ring-gold/45 shadow-sm shadow-gold/15"
                          : "border-[#ffd8a8] bg-white hover:border-gold/55"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon
                          className={`w-5 h-5 shrink-0 ${selected ? "text-gold" : "text-[#8aa0a8]"}`}
                        />
                        <span className="font-semibold text-charcoal">{label}</span>
                      </div>
                      <p className="text-xs text-[#1a5a6e] leading-relaxed">{help}</p>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("applicantType")} />
              {errors.applicantType && (
                <p className="text-red-500 text-xs mt-2">{errors.applicantType.message}</p>
              )}
            </section>

            {/* Step 2 — Details */}
            <section className="bg-[#ffffff]/95 backdrop-blur-sm p-6 md:p-8 border border-gold/20 shadow-[0_12px_40px_-20px_rgba(18,20,26,0.22)] space-y-5 animate-fade-in-up animation-delay-400">
              <StepLabel step={2} label={t.membership.stepDetails} />

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.fullName}
                </label>
                <input
                  {...register("fullName")}
                  className="form-field-input"
                  placeholder={t.membership.fullNamePlaceholder}
                />
                <FieldHelp>{t.membership.fullNameHelp}</FieldHelp>
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
                  className="form-field-input"
                  placeholder={t.membership.phonePlaceholder}
                />
                <FieldHelp>{t.membership.phoneHelp}</FieldHelp>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.email}{" "}
                  <span className="text-[#8aa0a8] font-normal">{t.membership.optional}</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="form-field-input"
                  placeholder="your@email.com"
                />
                <FieldHelp>{t.membership.emailHelp}</FieldHelp>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t.membership.telegramUsername}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[#1a5a6e] font-medium">@</span>
                  <input
                    {...register("telegramUsername")}
                    className="form-field-input"
                    placeholder={t.membership.telegramUsernamePlaceholder}
                    autoComplete="off"
                  />
                </div>
                <FieldHelp>{t.membership.telegramNotice}</FieldHelp>
                {errors.telegramUsername && (
                  <p className="text-red-500 text-xs mt-1">
                    {String(errors.telegramUsername.message)}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#ffd8a8]">
                <p className="text-xs uppercase tracking-[0.12em] text-gold font-semibold mb-4">
                  {selectedType === "owner" ? t.membership.owner : t.membership.barber}
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t.membership.barbershopName}
                    </label>
                    <input
                      {...register("barbershopName")}
                      className="form-field-input"
                      placeholder={t.membership.barbershopNamePlaceholder}
                    />
                    <FieldHelp>{t.membership.barbershopNameHelp}</FieldHelp>
                    {errors.barbershopName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.barbershopName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t.membership.address}
                    </label>
                    <input
                      {...register("address")}
                      className="form-field-input"
                      placeholder={t.membership.addressPlaceholder}
                    />
                    <FieldHelp>{t.membership.addressHelp}</FieldHelp>
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3 — Level */}
            <section className="bg-[#ffffff]/95 backdrop-blur-sm p-6 md:p-8 border border-gold/20 shadow-[0_12px_40px_-20px_rgba(18,20,26,0.22)] animate-fade-in-up animation-delay-600">
              <StepLabel step={3} label={t.membership.stepLevel} />
              <p className="text-xs text-[#1a5a6e] mb-4">{t.membership.feeSelectHint}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {LEVEL_ORDER.map((level) => {
                  const selected = selectedLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setValue("membershipLevel", level, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`text-left border px-4 py-4 transition-all duration-300 ${
                        selected
                          ? "border-gold bg-gradient-to-br from-gold/18 to-brown/8 ring-1 ring-gold/45 shadow-sm shadow-gold/15"
                          : "border-[#ffd8a8] bg-white hover:border-gold/55"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-charcoal">
                        {levelLabel(level)}
                      </span>
                      <span className="block mt-1 text-lg font-bold text-gold tabular-nums">
                        {MEMBERSHIP_PAYMENT.fees[level]}
                      </span>
                      <span className="block mt-2 text-xs text-[#1a5a6e] leading-snug">
                        {levelBenefit(level)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("membershipLevel")} />
              {errors.membershipLevel && (
                <p className="text-red-500 text-xs mt-2">{errors.membershipLevel.message}</p>
              )}
            </section>

            {/* Step 4 — Photos */}
            <section className="bg-[#ffffff]/95 backdrop-blur-sm p-6 md:p-8 border border-gold/20 shadow-[0_12px_40px_-20px_rgba(18,20,26,0.22)]">
              <StepLabel step={4} label={t.membership.stepPhotos} />
              <label className="block text-sm font-medium text-charcoal mb-1">
                {t.membership.photos}{" "}
                <span className="text-[#8aa0a8] font-normal">{t.membership.optional}</span>
              </label>
              <FieldHelp>{t.membership.photosHelp}</FieldHelp>
              <div className="relative mt-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-6 border border-dashed border-gold/50 bg-gradient-to-br from-gold/[0.07] to-brown/[0.04] hover:from-gold/[0.12] hover:to-brown/[0.06] transition-colors">
                  <Camera className="w-6 h-6 text-gold shrink-0" />
                  <div className="text-center sm:text-left">
                    <span className="block text-sm text-charcoal font-medium">
                      {photos.length > 0
                        ? interpolate(t.membership.photosSelected, { count: photos.length })
                        : t.membership.photosHint}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 5 — Payment */}
            <section className="bg-[#ffffff]/95 backdrop-blur-sm p-6 md:p-8 border border-gold/20 shadow-[0_12px_40px_-20px_rgba(18,20,26,0.22)] space-y-5">
              <StepLabel step={5} label={t.membership.stepPayment} />
              <p className="text-sm text-[#1a5a6e] leading-relaxed -mt-2">
                {t.membership.paymentIntro}
              </p>

              <div className="border border-gold/35 bg-gradient-to-br from-gold/20 via-gold/10 to-brown/10 px-5 py-5 flex flex-wrap items-end justify-between gap-3 shadow-sm shadow-gold/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#1a5a6e] font-semibold">
                    {t.membership.amountDue}
                  </p>
                  <p className="text-sm text-charcoal mt-1">{levelLabel(selectedLevel)}</p>
                </div>
                <p className="font-display text-3xl md:text-4xl text-gold tabular-nums">
                  {amountDue}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal mb-2">
                  {t.membership.paymentMethod}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "bank" as const, label: t.membership.payByBank },
                      { id: "telebirr" as const, label: t.membership.payByTelebirr },
                    ] as const
                  ).map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPayMethod(method.id)}
                      className={`px-3 py-2.5 text-sm border transition-colors ${
                        payMethod === method.id
                          ? "bg-gold/20 text-charcoal border-gold font-semibold"
                          : "bg-white text-[#1a5a6e] border-[#ffd8a8] hover:border-gold"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-off-white border border-[#ffd8a8] p-4 space-y-3 text-sm">
                {payMethod === "bank" ? (
                  <>
                    <p>
                      <span className="text-[#1a5a6e]">{t.membership.bankName}:</span>{" "}
                      <span className="font-medium text-charcoal">
                        {MEMBERSHIP_PAYMENT.bankName}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#1a5a6e]">{t.membership.accountName}:</span>{" "}
                      <span className="font-medium text-charcoal">
                        {MEMBERSHIP_PAYMENT.accountName}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p>
                        <span className="text-[#1a5a6e]">{t.membership.accountNumber}:</span>{" "}
                        <span className="font-semibold text-charcoal tracking-wide">
                          {MEMBERSHIP_PAYMENT.accountNumber}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          copyValue("account", MEMBERSHIP_PAYMENT.accountNumber)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 border border-[#ffd8a8] bg-white text-charcoal hover:border-gold transition-colors"
                      >
                        {copiedField === "account" ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedField === "account" ? t.membership.copied : t.membership.copy}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p>
                      <span className="text-[#1a5a6e]">{t.membership.telebirr}:</span>{" "}
                      <span className="font-semibold text-charcoal tracking-wide">
                        {MEMBERSHIP_PAYMENT.telebirr}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => copyValue("telebirr", MEMBERSHIP_PAYMENT.telebirr)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 border border-[#ffd8a8] bg-white text-charcoal hover:border-gold transition-colors"
                    >
                      {copiedField === "telebirr" ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedField === "telebirr" ? t.membership.copied : t.membership.copy}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t.membership.invoice}
                </label>
                {!invoice ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setInvoice(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 px-4 py-4 border border-dashed border-gold/50 bg-gradient-to-br from-gold/[0.07] to-brown/[0.04] hover:from-gold/[0.12] hover:to-brown/[0.06] transition-colors">
                      <Upload className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-sm text-[#1a5a6e] truncate">
                        {t.membership.invoiceHint}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gold/40 bg-gradient-to-br from-gold/10 to-brown/5 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {interpolate(t.membership.invoiceSelected, { name: invoice.name })}
                        </p>
                        <p className="text-xs text-[#1a5a6e] mt-0.5">
                          {(invoice.size / 1024).toFixed(0)} KB · {invoice.type || "file"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInvoice(null)}
                        className="inline-flex items-center gap-1 text-xs text-[#1a5a6e] hover:text-red-600 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                        {t.membership.removeReceipt}
                      </button>
                    </div>
                    {invoicePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={invoicePreview}
                        alt={invoice.name}
                        className="max-h-48 border border-[#ffd8a8] object-contain bg-white"
                      />
                    )}
                  </div>
                )}
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
