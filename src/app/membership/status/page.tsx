"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Button from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface StatusResult {
  applicationRef: string;
  fullName: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  membershipId: string | null;
  reviewNotes: string | null;
  documents: {
    idCard: boolean;
    invoice: boolean;
  };
}

function MembershipStatusForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref")?.trim() || "";
  const [reference, setReference] = useState(urlRef);
  const [queriedRef, setQueriedRef] = useState(urlRef);
  const [isLoading, setIsLoading] = useState(Boolean(urlRef));
  const [error, setError] = useState("");
  const [result, setResult] = useState<StatusResult | null>(null);

  useEffect(() => {
    if (!queriedRef) return;
    let cancelled = false;
    fetch(`/api/membership?ref=${encodeURIComponent(queriedRef)}`)
      .then(async (response) => {
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
      })
      .then(({ ok, status, data }) => {
        if (cancelled) return;
        if (!ok) {
          setResult(null);
          setError(status === 404 ? t.membership.notFound : t.membership.lookupError);
        } else {
          setError("");
          setResult(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setResult(null);
        setError(t.membership.lookupError);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queriedRef, t.membership.lookupError, t.membership.notFound]);

  const statusMessage =
    result?.status === "approved"
      ? t.membership.statusApproved
      : result?.status === "rejected"
        ? t.membership.statusRejected
        : t.membership.statusPending;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-off-white pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.membership.title}
          </Link>

          <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
              {t.membership.statusTitle}
            </h1>
            <p className="text-gray-600 mb-6">{t.membership.statusIntro}</p>

            <form
              className="flex flex-col sm:flex-row gap-3 mb-8"
              onSubmit={(event) => {
                event.preventDefault();
                const trimmed = reference.trim();
                if (!trimmed) return;
                setIsLoading(true);
                setError("");
                setQueriedRef(trimmed);
              }}
            >
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder={t.membership.statusPlaceholder}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t.membership.lookingUp : t.membership.statusLookup}
              </Button>
            </form>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {result && (
              <div className="space-y-4">
                <div className="bg-off-white p-4 rounded-sm">
                  <p className="text-sm text-gray-500">{t.membership.reference}</p>
                  <p className="font-semibold text-charcoal">{result.applicationRef}</p>
                  <p className="mt-3 text-gray-700">{statusMessage}</p>
                  {result.status === "rejected" && result.reviewNotes && (
                    <p className="mt-2 text-sm text-gray-600">{result.reviewNotes}</p>
                  )}
                  {result.status === "approved" && result.membershipId && (
                    <p className="mt-3">
                      <span className="text-sm text-gray-500">{t.membership.membershipIdLabel}: </span>
                      <span className="font-bold text-gold">{result.membershipId}</span>
                    </p>
                  )}
                </div>

                {result.status === "approved" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {result.documents.idCard && (
                      <a href={`/api/membership/${encodeURIComponent(result.applicationRef)}/documents?type=id-card`}>
                        <Button>
                          <Download className="w-4 h-4 mr-2" />
                          {t.membership.downloadIdCard}
                        </Button>
                      </a>
                    )}
                    {result.documents.invoice && (
                      <a href={`/api/membership/${encodeURIComponent(result.applicationRef)}/documents?type=invoice`}>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          {t.membership.downloadInvoice}
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function MembershipStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-off-white">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      }
    >
      <MembershipStatusForm />
    </Suspense>
  );
}
