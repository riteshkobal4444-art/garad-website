import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Send,
  ShieldCheck,
} from 'lucide-react';

export const CSR_AREA_OPTIONS = [
  'Education',
  'Financial Literacy',
  'Rural and Tribal Development',
  'Youth Development',
  'Community Development',
  'Other',
] as const;

export const CSR_PREFERRED_PROJECT_OPTIONS = [
  'Sabse Bada Rupaiya',
  'Mission Bharari',
  'Garad Granthalay',
  'Project Urja',
  'Open to Discussion',
] as const;

export type CsrAreaOption = (typeof CSR_AREA_OPTIONS)[number];
export type CsrPreferredProjectOption =
  (typeof CSR_PREFERRED_PROJECT_OPTIONS)[number];

interface CsrEnquiryFormProps {
  initialPreferredProject?: CsrPreferredProjectOption | '';
  initialAreaOfInterest?: CsrAreaOption | '';
}

interface SubmissionSuccess {
  referenceId: string;
  submittedAt: string;
  storedInDatabase: boolean;
  notificationEmailSent: boolean;
  confirmationEmailSent: boolean;
  emailDeliveryNote: string;
}

interface FormState {
  organisationName: string;
  contactPerson: string;
  designation: string;
  officialEmail: string;
  phoneNumber: string;
  areaOfInterest: string;
  message: string;
  proposedFundingRange: string;
  preferredProject: string;
  preferredGeography: string;
  privacyConsent: boolean;
  /** Hidden anti-spam honeypot — must remain empty */
  website: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CsrEnquiryForm({
  initialPreferredProject = '',
  initialAreaOfInterest = '',
}: CsrEnquiryFormProps) {
  const formLoadedAtRef = useRef<number>(Date.now());

  const [form, setForm] = useState<FormState>({
    organisationName: '',
    contactPerson: '',
    designation: '',
    officialEmail: '',
    phoneNumber: '',
    areaOfInterest: initialAreaOfInterest,
    message: '',
    proposedFundingRange: '',
    preferredProject: initialPreferredProject,
    preferredGeography: '',
    privacyConsent: false,
    website: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SubmissionSuccess | null>(null);

  useEffect(() => {
    if (initialPreferredProject || initialAreaOfInterest) {
      setForm((prev) => ({
        ...prev,
        preferredProject: initialPreferredProject || prev.preferredProject,
        areaOfInterest: initialAreaOfInterest || prev.areaOfInterest,
      }));
    }
  }, [initialPreferredProject, initialAreaOfInterest]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (formError) setFormError(null);
  };

  const validateClient = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (form.organisationName.trim().length < 2) {
      errors.organisationName =
        'Please enter your organisation or company name.';
    }
    if (form.contactPerson.trim().length < 2) {
      errors.contactPerson = 'Please enter the contact person’s full name.';
    }
    if (form.designation.trim().length < 2) {
      errors.designation = 'Please enter your role or designation.';
    }
    if (!EMAIL_RE.test(form.officialEmail.trim())) {
      errors.officialEmail = 'Please enter a valid official email address.';
    }
    const digits = form.phoneNumber.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      errors.phoneNumber =
        'Please enter a valid phone or mobile number (8–15 digits).';
    }
    if (!form.areaOfInterest) {
      errors.areaOfInterest = 'Please select an Area of Interest.';
    }
    if (form.message.trim().length < 15) {
      errors.message =
        'Please provide a brief overview of your partnership interest (at least 15 characters).';
    }
    if (!form.privacyConsent) {
      errors.privacyConsent =
        'Please confirm privacy consent to submit your enquiry.';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError('Please complete all required fields highlighted below.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/csr/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organisationName: form.organisationName,
          contactPerson: form.contactPerson,
          designation: form.designation,
          officialEmail: form.officialEmail,
          phoneNumber: form.phoneNumber,
          areaOfInterest: form.areaOfInterest,
          message: form.message,
          proposedFundingRange: form.proposedFundingRange,
          preferredProject: form.preferredProject,
          preferredGeography: form.preferredGeography,
          privacyConsent: form.privacyConsent,
          website: form.website,
          formLoadedAt: formLoadedAtRef.current,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: Record<string, string>;
      } & Partial<SubmissionSuccess>;

      if (!response.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setFormError(
          payload.error ||
            'Unable to submit your enquiry right now. Please try again shortly.'
        );
        return;
      }

      setSuccess({
        referenceId: payload.referenceId || 'GF-CSR',
        submittedAt: payload.submittedAt || new Date().toISOString(),
        storedInDatabase: Boolean(payload.storedInDatabase),
        notificationEmailSent: Boolean(payload.notificationEmailSent),
        confirmationEmailSent: Boolean(payload.confirmationEmailSent),
        emailDeliveryNote:
          payload.emailDeliveryNote ||
          'Thank you. Your partnership enquiry has been recorded.',
      });
      setFieldErrors({});
    } catch {
      setFormError(
        'A network error occurred while submitting your enquiry. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForNewEnquiry = () => {
    formLoadedAtRef.current = Date.now();
    setSuccess(null);
    setFormError(null);
    setFieldErrors({});
    setForm({
      organisationName: '',
      contactPerson: '',
      designation: '',
      officialEmail: '',
      phoneNumber: '',
      areaOfInterest: '',
      message: '',
      proposedFundingRange: '',
      preferredProject: '',
      preferredGeography: '',
      privacyConsent: false,
      website: '',
    });
  };

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="chrome-card rounded-[22px] bg-white p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#EEF4F0] border border-[#D4E4DA] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#0D3021]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
              Enquiry Submitted
            </p>
            <h3 className="mt-1 font-serif text-[24px] sm:text-[27px] font-bold text-[#171C19] leading-snug">
              Thank you for initiating a partnership conversation
            </h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.7] text-[#4C554F]">
              Garad Foundation has received your corporate CSR enquiry. Our team
              will review your priorities and follow up to schedule a discussion
              and share requested institutional documentation.
            </p>

            <div className="mt-5 rounded-xl bg-[#FAF8F4] border border-[#E6DFD2] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                  Enquiry Reference ID
                </p>
                <p className="mt-0.5 font-mono font-semibold text-[#171C19]">
                  {success.referenceId}
                </p>
              </div>
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A827D]">
                  Recorded On
                </p>
                <p className="mt-0.5 font-medium text-[#171C19]">
                  {new Date(success.submittedAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[12.5px] leading-relaxed text-[#5C6660]">
              {success.emailDeliveryNote}
            </p>

            <button
              type="button"
              onClick={resetForNewEnquiry}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F4] hover:bg-[#F1EBE0] border border-[#E2D9C9] text-[12.5px] font-semibold text-[#171C19] transition-colors cursor-pointer"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    'w-full rounded-xl bg-[#FAF8F4] border px-3.5 py-2.5 text-[14px] text-[#171C19] placeholder:text-[#8C948F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0D3021]/20 transition-colors';

  const getFieldBorder = (field: string) =>
    fieldErrors[field]
      ? 'border-[#B83A1A] focus:border-[#B83A1A]'
      : 'border-[#DFD8CB] focus:border-[#0D3021]';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="chrome-card rounded-[22px] bg-white p-6 sm:p-8 space-y-6"
    >
      {/* Hidden Honeypot Anti-Spam Field (visually and keyboard hidden from users) */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      >
        <label htmlFor="csr-website-hp">Company Website (leave blank)</label>
        <input
          id="csr-website-hp"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => updateField('website', e.target.value)}
        />
      </div>

      {formError && (
        <div
          role="alert"
          className="rounded-xl bg-[#FDF0EC] border border-[#EBC7BC] px-4 py-3 flex items-start gap-2.5 text-[13px] text-[#7D2912]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* Required Institutional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="sm:col-span-2">
          <label
            htmlFor="csr-org-name"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Organisation / Company Name{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="csr-org-name"
            name="organisationName"
            type="text"
            required
            autoComplete="organization"
            placeholder="e.g. Acme Industries India Pvt. Ltd."
            value={form.organisationName}
            onChange={(e) => updateField('organisationName', e.target.value)}
            aria-invalid={Boolean(fieldErrors.organisationName)}
            className={`${inputBase} ${getFieldBorder('organisationName')}`}
          />
          {fieldErrors.organisationName && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.organisationName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-contact-person"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Contact Person{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="csr-contact-person"
            name="contactPerson"
            type="text"
            required
            autoComplete="name"
            placeholder="Full name"
            value={form.contactPerson}
            onChange={(e) => updateField('contactPerson', e.target.value)}
            aria-invalid={Boolean(fieldErrors.contactPerson)}
            className={`${inputBase} ${getFieldBorder('contactPerson')}`}
          />
          {fieldErrors.contactPerson && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.contactPerson}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-designation"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Designation{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="csr-designation"
            name="designation"
            type="text"
            required
            autoComplete="organization-title"
            placeholder="e.g. CSR Manager / Head of Sustainability"
            value={form.designation}
            onChange={(e) => updateField('designation', e.target.value)}
            aria-invalid={Boolean(fieldErrors.designation)}
            className={`${inputBase} ${getFieldBorder('designation')}`}
          />
          {fieldErrors.designation && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.designation}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-email"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Official Email Address{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="csr-email"
            name="officialEmail"
            type="email"
            required
            autoComplete="email"
            placeholder="name@company.com"
            value={form.officialEmail}
            onChange={(e) => updateField('officialEmail', e.target.value)}
            aria-invalid={Boolean(fieldErrors.officialEmail)}
            className={`${inputBase} ${getFieldBorder('officialEmail')}`}
          />
          {fieldErrors.officialEmail && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.officialEmail}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-phone"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Phone Number{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="csr-phone"
            name="phoneNumber"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 98XXXXXXXX"
            value={form.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            aria-invalid={Boolean(fieldErrors.phoneNumber)}
            className={`${inputBase} ${getFieldBorder('phoneNumber')}`}
          />
          {fieldErrors.phoneNumber && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-area"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Area of Interest{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="csr-area"
            name="areaOfInterest"
            required
            value={form.areaOfInterest}
            onChange={(e) => updateField('areaOfInterest', e.target.value)}
            aria-invalid={Boolean(fieldErrors.areaOfInterest)}
            className={`${inputBase} ${getFieldBorder('areaOfInterest')}`}
          >
            <option value="">Select primary focus area</option>
            {CSR_AREA_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors.areaOfInterest && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.areaOfInterest}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="csr-preferred-project"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Preferred Project{' '}
            <span className="text-[#7A827D] font-normal">(Optional)</span>
          </label>
          <select
            id="csr-preferred-project"
            name="preferredProject"
            value={form.preferredProject}
            onChange={(e) => updateField('preferredProject', e.target.value)}
            className={`${inputBase} ${getFieldBorder('preferredProject')}`}
          >
            <option value="">Select a project (optional)</option>
            {CSR_PREFERRED_PROJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="csr-funding-range"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Proposed Funding Range{' '}
            <span className="text-[#7A827D] font-normal">(Optional)</span>
          </label>
          <input
            id="csr-funding-range"
            name="proposedFundingRange"
            type="text"
            placeholder="e.g. ₹1,00,000 – ₹5,00,000 or To Be Discussed"
            value={form.proposedFundingRange}
            onChange={(e) =>
              updateField('proposedFundingRange', e.target.value)
            }
            className={`${inputBase} ${getFieldBorder('proposedFundingRange')}`}
          />
        </div>

        <div>
          <label
            htmlFor="csr-geography"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Preferred Implementation Geography{' '}
            <span className="text-[#7A827D] font-normal">(Optional)</span>
          </label>
          <input
            id="csr-geography"
            name="preferredGeography"
            type="text"
            placeholder="e.g. Thane, Pune District, Rural Maharashtra"
            value={form.preferredGeography}
            onChange={(e) => updateField('preferredGeography', e.target.value)}
            className={`${inputBase} ${getFieldBorder('preferredGeography')}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="csr-message"
            className="block text-[12.5px] font-semibold text-[#1E2822] mb-1.5"
          >
            Message{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="csr-message"
            name="message"
            required
            rows={4}
            placeholder="Share your organisation’s CSR focus areas, preferred timeline, due-diligence requirements, or questions for our team."
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            className={`${inputBase} ${getFieldBorder('message')} resize-y min-h-[112px]`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-[12px] text-[#B83A1A]">
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      {/* Privacy Consent Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.privacyConsent}
            onChange={(e) => updateField('privacyConsent', e.target.checked)}
            aria-invalid={Boolean(fieldErrors.privacyConsent)}
            className="mt-1 w-4 h-4 rounded border-[#C8BFB0] text-[#0D3021] focus:ring-[#0D3021]"
          />
          <span className="text-[12.5px] leading-relaxed text-[#4F5953]">
            I consent to Garad Foundation storing and using the contact details
            submitted above solely to respond to this partnership enquiry and
            share requested institutional documentation. Submitted details are
            never published publicly.{' '}
            <span className="text-[#9A3B1E]" aria-hidden="true">
              *
            </span>
          </span>
        </label>
        {fieldErrors.privacyConsent && (
          <p className="mt-1.5 text-[12px] text-[#B83A1A]">
            {fieldErrors.privacyConsent}
          </p>
        )}
      </div>

      {/* Submit Bar */}
      <div className="pt-2 border-t border-[#EFEAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[12px] text-[#66706A]">
          <Lock className="w-3.5 h-3.5 text-[#0D3021] shrink-0" />
          <span>Protected submission · Never displayed publicly</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] disabled:opacity-65 text-white text-[13.5px] font-semibold shadow-[0_8px_20px_-10px_rgba(8,36,23,0.45)] transition-colors cursor-pointer w-full sm:w-auto whitespace-nowrap"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry…</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Partnership Enquiry</span>
            </>
          )}
        </button>
      </div>

      <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-[#6E7771]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#9A3B1E] shrink-0 mt-0.5" />
        <span>
          Submitting this form initiates an exploratory CSR conversation and
          does not constitute a binding funding commitment.
        </span>
      </p>
    </form>
  );
}
