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
import { CheckCircle, Loader2, ArrowLeft, Upload, Copy, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type MembershipLevel = "gold" | "silver" | "white";
type PayMethod = "bank" | "telebirr";

const LEVEL_ORDER: MembershipLevel[] = ["gold", "silver", "white"];

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
              <p className="text-sm text-gray-600 mb-4">{t.membership.telegramStartHint}</p>
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
            <p className="mt-4">
              <Link href="/membership/status" className="text-sm text-gold hover:underline">
                {t.membership.checkStatus}
              </Link>
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
                  {t.membership.telegramUsername}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">@</span>
                  <input
                    {...register("telegramUsername")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    placeholder={t.membership.telegramUsernamePlaceholder}
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.membership.telegramNotice}</p>
                {errors.telegramUsername && (
                  <p className="text-red-500 text-xs mt-1">{String(errors.telegramUsername.message)}</p>
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
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t.membership.membershipLevel}
                </label>
                <p className="text-xs text-gray-500 mb-3">{t.membership.feeSelectHint}</p>
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
                        className={`text-left rounded-sm border px-4 py-3 transition-all ${
                          selected
                            ? "border-gold bg-gold/10 ring-2 ring-gold/40 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gold/60"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-charcoal">
                          {levelLabel(level)}
                        </span>
                        <span className="block mt-1 text-lg font-bold text-gold">
                          {MEMBERSHIP_PAYMENT.fees[level]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" {...register("membershipLevel")} />
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

            <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-2">{t.membership.paymentTitle}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{t.membership.paymentIntro}</p>
              </div>

              <div className="rounded-sm border border-gold/30 bg-gold/10 px-4 py-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                    {t.membership.amountDue}
                  </p>
                  <p className="text-sm text-charcoal mt-1">{levelLabel(selectedLevel)}</p>
                </div>
                <p className="text-3xl font-bold text-gold tabular-nums">{amountDue}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal mb-2">{t.membership.paymentMethod}</p>
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
                      className={`px-3 py-2.5 text-sm rounded-sm border transition-colors ${
                        payMethod === method.id
                          ? "bg-charcoal text-white border-charcoal font-semibold"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gold"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-off-white p-4 rounded-sm space-y-3 text-sm">
                {payMethod === "bank" ? (
                  <>
                    <p>
                      <span className="text-gray-500">{t.membership.bankName}:</span>{" "}
                      <span className="font-medium text-charcoal">{MEMBERSHIP_PAYMENT.bankName}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">{t.membership.accountName}:</span>{" "}
                      <span className="font-medium text-charcoal">{MEMBERSHIP_PAYMENT.accountName}</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p>
                        <span className="text-gray-500">{t.membership.accountNumber}:</span>{" "}
                        <span className="font-semibold text-charcoal tracking-wide">
                          {MEMBERSHIP_PAYMENT.accountNumber}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          copyValue("account", MEMBERSHIP_PAYMENT.accountNumber)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm border border-gray-200 bg-white text-charcoal hover:border-gold transition-colors"
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
                      <span className="text-gray-500">{t.membership.telebirr}:</span>{" "}
                      <span className="font-semibold text-charcoal tracking-wide">
                        {MEMBERSHIP_PAYMENT.telebirr}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => copyValue("telebirr", MEMBERSHIP_PAYMENT.telebirr)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm border border-gray-200 bg-white text-charcoal hover:border-gold transition-colors"
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
                    <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-sm hover:border-gold transition-colors bg-gray-50">
                      <Upload className="w-5 h-5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-500 truncate">
                        {t.membership.invoiceHint}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-sm border border-gold/40 bg-gold/5 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {interpolate(t.membership.invoiceSelected, { name: invoice.name })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(invoice.size / 1024).toFixed(0)} KB · {invoice.type || "file"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInvoice(null)}
                        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 shrink-0"
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
                        className="max-h-48 rounded-sm border border-gray-200 object-contain bg-white"
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
