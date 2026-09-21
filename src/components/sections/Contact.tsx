"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/ToastContainer";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { CONTACT } from "@/lib/constants";
import { createContactFormSchema, ContactFormData } from "@/lib/validations";
import { useToast } from "@/hooks/useToast";
import { FacebookIcon, YoutubeIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Contact() {
  const { locale, t } = useI18n();
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
    <section id="contact" className="py-20 md:py-28 bg-off-white">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          <AnimatedCard>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{t.contact.phone}</h3>
                  <a href={`tel:${CONTACT.phone}`} className="text-gray-600 hover:text-gold transition-colors">
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{t.contact.email}</h3>
                  <a href={`mailto:${CONTACT.email}`} className="text-gray-600 hover:text-gold transition-colors">
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">{t.contact.officeAddress}</h3>
                  <p className="text-gray-600">{t.contact.addressValue}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal mb-4">{t.contact.followUs}</h3>
                <div className="flex gap-3">
                  <a
                    href={CONTACT.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-charcoal text-white rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={CONTACT.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-charcoal text-white rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={CONTACT.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-charcoal text-white rounded-sm flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="rounded-sm overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t.contact.mapsPlaceholder}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.contact.addressValue}</p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <form key={locale} onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-charcoal mb-6">{t.contact.formTitle}</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                    {t.contact.name}
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none"
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
