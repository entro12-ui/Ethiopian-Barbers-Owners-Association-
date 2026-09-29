"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/ToastContainer";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { useCmsSection, useSiteContent } from "@/components/i18n/SiteContentProvider";
import { createContactFormSchema, ContactFormData } from "@/lib/validations";
import { useToast } from "@/hooks/useToast";
import { FacebookIcon, YoutubeIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Contact() {
  const { locale, t } = useI18n();
  const contact = useCmsSection("contact", {
    title: t.contact.title,
    subtitle: t.contact.subtitle,
    phone: t.contact.phone,
    email: t.contact.email,
    officeAddress: t.contact.officeAddress,
    addressValue: t.contact.addressValue,
    addressValueAmharic: t.contact.addressValueAmharic,
    followUs: t.contact.followUs,
    mapsOpen: t.contact.mapsOpen,
    mapsTitle: t.contact.mapsTitle,
    formTitle: t.contact.formTitle,
  });
  const { contactSettings } = useSiteContent();
  const { toasts, showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = useMemo(() => createContactFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || t.contact.error);
      }

      showToast(t.contact.success, "success");
      reset();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t.contact.error,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-off-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <SectionHeading
          title={contact.title as string}
          subtitle={contact.subtitle as string}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          <AnimatedCard>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{contact.phone as string}</h3>
                  <a href={`tel:${contactSettings.phone}`} className="text-gray-600 hover:text-gold transition-colors">
                    {contactSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{contact.email as string}</h3>
                  <a href={`mailto:${contactSettings.email}`} className="text-gray-600 hover:text-gold transition-colors">
                    {contactSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{contact.officeAddress as string}</h3>
                  <p className="text-gray-600">{contact.addressValue as string}</p>
                  <p className="text-sm text-[#1a5a6e] mt-0.5">{contact.addressValueAmharic as string}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal mb-4">{contact.followUs as string}</h3>
                <div className="flex gap-3">
                  <a
                    href={contactSettings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gradient-to-br from-charcoal to-brown text-white rounded-sm flex items-center justify-center hover:from-gold hover:to-gold-light hover:text-charcoal transition-all shadow-sm"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={contactSettings.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gradient-to-br from-charcoal to-brown text-white rounded-sm flex items-center justify-center hover:from-gold hover:to-gold-light hover:text-charcoal transition-all shadow-sm"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={contactSettings.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gradient-to-br from-charcoal to-brown text-white rounded-sm flex items-center justify-center hover:from-gold hover:to-gold-light hover:text-charcoal transition-all shadow-sm"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="rounded-sm overflow-hidden border border-[#ffd8a8] shadow-sm shadow-gold/10">
                <div className="relative w-full h-56 md:h-64 bg-[#fff0de]">
                  <iframe
                    title={contact.mapsTitle as string}
                    src={contactSettings.mapEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <a
                  href={contactSettings.mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-sm font-semibold text-charcoal hover:text-gold hover:bg-gold/10 transition-colors border-t border-[#ffd8a8]"
                >
                  <MapPin className="w-4 h-4 text-gold" />
                  {contact.mapsOpen as string}
                </a>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <form key={locale} onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-sm shadow-lg shadow-gold/10 border border-[#ffd8a8]">
              <h3 className="font-display text-xl font-bold text-charcoal mb-6">{contact.formTitle as string}</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                    {t.contact.name}
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="form-field-input"
                    placeholder={t.contact.namePlaceholder}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-1">
                      {t.contact.phoneLabel}
                    </label>
                    <input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      className="form-field-input"
                      placeholder="+251..."
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      className="form-field-input"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1">
                    {t.contact.subject}
                  </label>
                  <input
                    {...register("subject")}
                    id="subject"
                    type="text"
                    className="form-field-input"
                    placeholder={t.contact.subjectPlaceholder}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">
                    {t.contact.message}
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={5}
                    className="form-field-input resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.contact.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.contact.send}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
