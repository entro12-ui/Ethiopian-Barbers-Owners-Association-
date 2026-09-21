"use client";

import Button from "@/components/ui/Button";
import {
  MEMBERSHIP_ID_CARD_TYPE,
  PAYMENT_INVOICE_TYPE,
  PHOTO_DOCUMENT_TYPES,
  STAMPED_INVOICE_TYPE,
} from "@/lib/membership";
import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

interface MembershipApplication {
  id: string;
  applicationRef: string;
  membershipId: string | null;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  barbershopName: string | null;
  applicantType: string;
  membershipLevel: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  documents?: Array<{
    documentType: string;
    fileName: string;
    mimeType: string;
  }>;
}

const FILTERS: Array<{ id: "all" | ApplicationStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "under_review", label: "Under review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

function statusColor(status: string) {
  if (status === "approved") return "bg-green-100 text-green-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  if (status === "under_review") return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
}

export default function MembershipQueue() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MembershipApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      const url =
        filter === "all" ? "/api/admin/memberships" : `/api/admin/memberships?status=${filter}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      setApplications(data.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let cancelled = false;
    const url =
      filter === "all" ? "/api/admin/memberships" : `/api/admin/memberships?status=${filter}`;
    fetch(url, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setApplications(data.applications || []);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setApplications([]);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const openDetail = async (id: string) => {
    setSelectedId(id);
    setError("");
    const response = await fetch(`/api/admin/memberships/${id}`, { cache: "no-store" });
    const data = await response.json();
    setDetail(data.application || null);
    setReviewNotes(data.application?.reviewNotes || "");
  };

  const updateStatus = async (status: "approved" | "rejected") => {
    if (!selectedId) return;
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/memberships/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update application");
      }
      setDetail(data.application);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update application");
    } finally {
      setIsSaving(false);
    }
  };

  const photos = detail?.documents?.filter((doc) =>
    PHOTO_DOCUMENT_TYPES.includes(doc.documentType as (typeof PHOTO_DOCUMENT_TYPES)[number])
  ) || [];
  const invoice = detail?.documents?.find((doc) => doc.documentType === PAYMENT_INVOICE_TYPE);
  const idCard = detail?.documents?.find((doc) => doc.documentType === MEMBERSHIP_ID_CARD_TYPE);
  const stamped = detail?.documents?.find((doc) => doc.documentType === STAMPED_INVOICE_TYPE);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((item) => (
            <button
              key={item.id}
                onClick={() => {
                  setIsLoading(true);
                  setFilter(item.id);
                }}
              className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                filter === item.id
                  ? "bg-gold text-charcoal font-semibold"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gold"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-gray-100">
            <p className="text-gray-500">No membership applications yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Level</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      onClick={() => openDetail(application.id)}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer ${
                        selectedId === application.id ? "bg-gold/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-charcoal">{application.fullName}</div>
                        <div className="text-xs text-gray-500">{application.applicationRef}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{application.membershipLevel}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(application.status)}`}>
                          {application.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-5 min-h-[420px]">
        {!detail ? (
          <p className="text-gray-500 text-sm">Select an application to review photos, invoice, and payment details.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-charcoal">{detail.fullName}</h2>
              <p className="text-sm text-gray-500">{detail.applicationRef}</p>
              {detail.membershipId && (
                <p className="text-sm font-semibold text-gold mt-1">{detail.membershipId}</p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="text-charcoal">{detail.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-charcoal">{detail.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Type</dt>
                <dd className="text-charcoal capitalize">{detail.applicantType}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Level</dt>
                <dd className="text-charcoal capitalize">{detail.membershipLevel}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Barbershop</dt>
                <dd className="text-charcoal">{detail.barbershopName || "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Address</dt>
                <dd className="text-charcoal">{detail.address}</dd>
              </div>
            </dl>

            {photos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-2">Photos</h3>
                <div className="flex gap-2 flex-wrap">
                  {photos.map((photo) => (
                    <a
                      key={photo.documentType}
                      href={`/api/admin/memberships/${detail.id}/document?type=${photo.documentType}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/admin/memberships/${detail.id}/document?type=${photo.documentType}`}
                        alt={photo.fileName}
                        className="w-24 h-24 object-cover rounded-sm border border-gray-200"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {invoice && (
              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-2">Payment invoice</h3>
                {invoice.mimeType.startsWith("image/") ? (
                  <a
                    href={`/api/admin/memberships/${detail.id}/document?type=${PAYMENT_INVOICE_TYPE}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/admin/memberships/${detail.id}/document?type=${PAYMENT_INVOICE_TYPE}`}
                      alt={invoice.fileName}
                      className="max-h-56 rounded-sm border border-gray-200"
                    />
                  </a>
                ) : (
                  <iframe
                    title={invoice.fileName}
                    src={`/api/admin/memberships/${detail.id}/document?type=${PAYMENT_INVOICE_TYPE}`}
                    className="w-full h-56 border border-gray-200 rounded-sm"
                  />
                )}
              </div>
            )}

            {(idCard || stamped) && (
              <div className="flex flex-wrap gap-2">
                {idCard && (
                  <a
                    href={`/api/admin/memberships/${detail.id}/document?type=${MEMBERSHIP_ID_CARD_TYPE}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gold hover:underline"
                  >
                    View ID card
                  </a>
                )}
                {stamped && (
                  <a
                    href={`/api/admin/memberships/${detail.id}/document?type=${STAMPED_INVOICE_TYPE}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gold hover:underline"
                  >
                    View stamped invoice
                  </a>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Review notes</label>
              <textarea
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {detail.status !== "approved" && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => updateStatus("approved")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus("rejected")}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
