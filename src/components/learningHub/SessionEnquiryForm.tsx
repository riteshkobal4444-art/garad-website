import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Info,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import {
  ENQUIRY_ORGANISATION_TYPES,
  ENQUIRY_PROGRAMME_OPTIONS,
  EnquiryOrganisationType,
} from '../../data/learningHub';

export interface SessionEnquiryPrefill {
  organisationType?: EnquiryOrganisationType;
  programmeOfInterest?: string;
  customSessionRequirement?: string;
  nonce: number;
}

interface SessionEnquiryFormProps {
  prefill: SessionEnquiryPrefill | null;
}

interface FormState {
  organisationName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  organisationType: string;
  programmeOfInterest: string;
  customSessionRequirement: string;
  expectedParticipants: string;
  preferredDate: string;
  alternativeDate: string;
  location: string;
  additionalMessage: string;
  privacyConsent: boolean;
  website: string; // hidden honeypot
}

const INITIAL_FORM_STATE: FormState = {
  organisationName: '',
  contactPerson: '',
  email: '',
  phoneNumber: '',
  organisationType: '',
  programmeOfInterest: '',
  customSessionRequirement: '',
  expectedParticipants: '',
  preferredDate: '',
  alternativeDate: '',
  location: '',
  additionalMessage: '',
  privacyConsent: false,
  website: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,22}$/;

interface SubmissionSuccessData {
  referenceId: string;
  deliveryNote: string;
}

export function SessionEnquiryForm({ prefill }: SessionEnquiryFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<{
    message: string;
    code?: string;
  } | null>(null);
  const [successData, setSuccessData] = useState<SubmissionSuccessData | null>(
    null
  );
  const [backendReady, setBackendReady] = useState<boolean | null>(null);

  const formLoadedAtRef = useRef<number>(Date.now());
  const inFlightRef = useRef<boolean>(false);

  // Check read-only submission readiness on mount (never exposes secrets)
  useEffect(() => {
    let active = true;
    fetch('/api/learning-hub/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.submissionReady === 'boolean') {
          setBackendReady(data.submissionReady);
        }
      })
      .catch(() => {
        // Silently ignore network probe error; real submit handles errors explicitly
      });
    return () => {
      active = false;
    };
  }, []);

  // Apply external prefill from Programme Finder, Audience Cards, or Programme Detail View
  useEffect(() => {
    if (!prefill) return;
    setSuccessData(null);
    setServerError(null);
    setForm((prev) => ({
      ...prev,
      organisationType: prefill.organisationType || prev.organisationType,
      programmeOfInterest:
        prefill.programmeOfInterest || prev.programmeOfInterest,
      customSessionRequirement:
        prefill.customSessionRequirement !== undefined
          ? prefill.customSessionRequirement
          : prev.customSessionRequirement,
    }));
  }, [prefill]);

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
    if (serverError) setServerError(null);
  };

  const validateClient = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (form.organisationName.trim().length < 2) {
      errors.organisationName =
        'Please enter your organisation, school, or group name.';
    }
    if (form.contactPerson.trim().length < 2) {
      errors.contactPerson = 'Please enter the contact person’s full name.';
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    const phoneDigits = form.phoneNumber.replace(/\D/g, '').length;
    if (
      !PHONE_ALLOWED_REGEX.test(form.phoneNumber.trim()) ||
      phoneDigits < 8 ||
      phoneDigits > 15
    ) {
      errors.phoneNumber = 'Please enter a valid phone number (8–15 digits).';
    }
    if (!form.organisationType) {
      errors.organisationType = 'Please select your organisation type.';
    }
    if (!form.programmeOfInterest) {
      errors.programmeOfInterest = 'Please select a programme of interest.';
    }
    if (
      form.programmeOfInterest === 'Special Workshops (Custom Session)' &&
      form.customSessionRequirement.trim().length < 10
    ) {
      errors.customSessionRequirement =
        'Please briefly describe your custom session topic or goals (at least 10 characters).';
    }
    if (form.expectedParticipants.trim() !== '') {
      const n = Number(form.expectedParticipants.trim());
      if (!Number.isInteger(n) || n < 1 || n > 5000) {
        errors.expectedParticipants =
          'Please enter a whole number between 1 and 5,000.';
      }
    }
    if (form.location.trim().length < 2) {
      errors.location = 'Please enter the city or location for the session.';
    }
    if (!form.privacyConsent) {
      errors.privacyConsent =
        'Please confirm consent so the Garad team may contact you regarding your request.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlightRef.current || submitting) return;

    setServerError(null);
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    inFlightRef.current = true;
    setSubmitting(true);

    try {
      const res = await fetch('/api/learning-hub/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          formLoadedAt: formLoadedAtRef.current,
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.status === 201 && payload?.accepted === true && payload?.referenceId) {
        setSuccessData({
          referenceId: String(payload.referenceId),
          deliveryNote:
            typeof payload.deliveryNote === 'string'
              ? payload.deliveryNote
              : '',
        });
        setFieldErrors({});
        setForm(INITIAL_FORM_STATE);
        formLoadedAtRef.current = Date.now();
        return;
      }

      if (payload?.fieldErrors && typeof payload.fieldErrors === 'object') {
        setFieldErrors(payload.fieldErrors);
      }

      setServerError({
        message:
          typeof payload?.error === 'string'
            ? payload.error
            : 'We could not submit your session enquiry right now. Please try again shortly.',
        code: typeof payload?.code === 'string' ? payload.code : undefined,
      });
    } catch {
      setServerError({
        message:
          'Unable to reach the submission server. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  const isCustomSelected =
    form.programmeOfInterest === 'Special Workshops (Custom Session)';

  const inputBase =
    'w-full rounded-xl bg-[#FAF8F4] border px-3.5 py-2.5 text-[14px] text-[#171C19] placeholder:text-[#8A928C] transition-colors focus:outline-none focus:bg-white focus:border-[#0D3021] focus:ring-2 focus:ring-[#0D3021]/12';

  return (
    <section
      id="request-session"
      aria-labelledby="request-session-heading"
      className="py-18 sm:py-24 bg-[#FAF8F4]"
    >
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Editorial Framing Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
              Request a Training Session
            </p>
            <h2
              id="request-session-heading"
              className="mt-2 font-serif text-[32px] sm:text-[38px] font-bold tracking-[-0.02em] text-[#171C19] leading-[1.13] [text-wrap:balance]"
            >
              Bring Learning to Your Organisation.
            </h2>
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-[#4F5953]">
              Tell us what you have in mind. The Garad team will connect with
              you to discuss a suitable learning experience.
            </p>

            <div className="mt-7 space-y-4 pt-6 border-t border-[#E6DFD2] text-[13.5px] text-[#4E5751]">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold text-[#171C19]">
                    Enquiry, not an instant booking:
                  </strong>{' '}
                  Dates, facilitator availability, and session scope are
                  confirmed personally by the Garad team after review.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <p>
                  Based in Thane, Maharashtra — open to conversations with
                  schools, colleges, corporates, and community groups.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#0D3021] shrink-0 mt-0.5" />
                <p>
                  Your details are used solely to review and respond to your
                  learning session enquiry.
                </p>
              </div>
            </div>

            {backendReady === false && (
              <div className="mt-6 rounded-2xl bg-[#FAF6EC] border border-[#E5D4B2] p-4 text-[12.5px] leading-relaxed text-[#5C4924]">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#9A6414] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#171C19]">
                      Live Delivery Integration Pending
                    </p>
                    <p className="mt-1">
                      Form validation is active, and the backend route is wired.
                      Connect Supabase (migration{' '}
                      <code className="font-mono text-[11px]">
                        004_learning_hub_enquiries.sql
                      </code>
                      ) or Resend email credentials in server environment
                      variables to accept and store live enquiries.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-8">
            <div className="rounded-[24px] bg-white border border-[#E4DDD0] shadow-[0_24px_54px_-28px_rgba(13,48,33,0.16)] p-6 sm:p-8 lg:p-10">
              {successData ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-6 text-center max-w-lg mx-auto"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF4F0] text-[#0D3021] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <p className="mt-4 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0D3021]">
                    Enquiry Reference · {successData.referenceId}
                  </p>
                  <h3 className="mt-2 font-serif text-[26px] font-bold text-[#171C19]">
                    Session Enquiry Received
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#4F5953]">
                    Thank you for your interest. Your request will be reviewed
                    by the Garad team. We will contact you to discuss
                    availability and confirm the session.
                  </p>
                  {successData.deliveryNote && (
                    <p className="mt-2 text-[13px] text-[#66706A]">
                      {successData.deliveryNote}
                    </p>
                  )}
                  <p className="mt-4 text-[12px] font-medium text-[#7B6435] bg-[#FAF6EC] border border-[#E7D8B9] rounded-xl px-4 py-2.5">
                    Please note: This enquiry is not a confirmed booking. Final
                    session dates are confirmed directly by our team.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccessData(null)}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Hidden anti-spam honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="lh-website">Website</label>
                    <input
                      id="lh-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => updateField('website', e.target.value)}
                    />
                  </div>

                  {/* Row 1: Organisation & Contact Person */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lh-org-name"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Organisation / Institution Name{' '}
                        <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <input
                        id="lh-org-name"
                        type="text"
                        required
                        placeholder="e.g., Saraswati Vidyalaya or Acme India"
                        value={form.organisationName}
                        onChange={(e) =>
                          updateField('organisationName', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.organisationName)}
                        className={`${inputBase} ${
                          fieldErrors.organisationName
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.organisationName && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.organisationName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lh-contact-person"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Contact Person <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <input
                        id="lh-contact-person"
                        type="text"
                        required
                        placeholder="Full name"
                        value={form.contactPerson}
                        onChange={(e) =>
                          updateField('contactPerson', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.contactPerson)}
                        className={`${inputBase} ${
                          fieldErrors.contactPerson
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.contactPerson && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lh-email"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Email Address <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <input
                        id="lh-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@organisation.org"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.email)}
                        className={`${inputBase} ${
                          fieldErrors.email
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lh-phone"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Phone Number <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <input
                        id="lh-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+91 98XXX XXXXX"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          updateField('phoneNumber', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.phoneNumber)}
                        className={`${inputBase} ${
                          fieldErrors.phoneNumber
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.phoneNumber && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Organisation Type & Programme of Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lh-org-type"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Organisation Type{' '}
                        <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <select
                        id="lh-org-type"
                        required
                        value={form.organisationType}
                        onChange={(e) =>
                          updateField('organisationType', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.organisationType)}
                        className={`${inputBase} ${
                          fieldErrors.organisationType
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      >
                        <option value="">Select organisation type</option>
                        {ENQUIRY_ORGANISATION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.organisationType && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.organisationType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lh-programme"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Programme of Interest{' '}
                        <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <select
                        id="lh-programme"
                        required
                        value={form.programmeOfInterest}
                        onChange={(e) =>
                          updateField('programmeOfInterest', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.programmeOfInterest)}
                        className={`${inputBase} ${
                          fieldErrors.programmeOfInterest
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      >
                        <option value="">Select programme or custom session</option>
                        {ENQUIRY_PROGRAMME_OPTIONS.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.programmeOfInterest && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.programmeOfInterest}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Custom Session Requirement */}
                  <div>
                    <label
                      htmlFor="lh-custom-req"
                      className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                    >
                      Custom Session Requirement{' '}
                      {isCustomSelected ? (
                        <span className="text-[#9A3B1E]">*</span>
                      ) : (
                        <span className="font-normal text-[#747E78]">
                          (optional)
                        </span>
                      )}
                    </label>
                    <textarea
                      id="lh-custom-req"
                      rows={2}
                      placeholder="Describe specific topics, participant age group, or learning goals if requesting a customised session"
                      value={form.customSessionRequirement}
                      onChange={(e) =>
                        updateField('customSessionRequirement', e.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.customSessionRequirement)}
                      className={`${inputBase} resize-y ${
                        fieldErrors.customSessionRequirement
                          ? 'border-[#B43D25]'
                          : 'border-[#DDD5C7]'
                      }`}
                    />
                    {fieldErrors.customSessionRequirement && (
                      <p className="mt-1 text-[12px] text-[#B43D25]">
                        {fieldErrors.customSessionRequirement}
                      </p>
                    )}
                  </div>

                  {/* Row 5: Expected Participants & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lh-participants"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Expected Number of Participants{' '}
                        <span className="font-normal text-[#747E78]">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="lh-participants"
                        type="number"
                        min={1}
                        max={5000}
                        placeholder="e.g., 25"
                        value={form.expectedParticipants}
                        onChange={(e) =>
                          updateField('expectedParticipants', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.expectedParticipants)}
                        className={`${inputBase} tabular-nums ${
                          fieldErrors.expectedParticipants
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.expectedParticipants && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.expectedParticipants}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lh-location"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Location <span className="text-[#9A3B1E]">*</span>
                      </label>
                      <input
                        id="lh-location"
                        type="text"
                        required
                        placeholder="City, locality, or campus address"
                        value={form.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.location)}
                        className={`${inputBase} ${
                          fieldErrors.location
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.location && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 6: Preferred Date & Alternative Preferred Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lh-pref-date"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Preferred Date{' '}
                        <span className="font-normal text-[#747E78]">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="lh-pref-date"
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) =>
                          updateField('preferredDate', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.preferredDate)}
                        className={`${inputBase} ${
                          fieldErrors.preferredDate
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.preferredDate && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.preferredDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lh-alt-date"
                        className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                      >
                        Alternative Preferred Date{' '}
                        <span className="font-normal text-[#747E78]">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="lh-alt-date"
                        type="date"
                        value={form.alternativeDate}
                        onChange={(e) =>
                          updateField('alternativeDate', e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.alternativeDate)}
                        className={`${inputBase} ${
                          fieldErrors.alternativeDate
                            ? 'border-[#B43D25]'
                            : 'border-[#DDD5C7]'
                        }`}
                      />
                      {fieldErrors.alternativeDate && (
                        <p className="mt-1 text-[12px] text-[#B43D25]">
                          {fieldErrors.alternativeDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 7: Additional Message */}
                  <div>
                    <label
                      htmlFor="lh-message"
                      className="block text-[13px] font-semibold text-[#171C19] mb-1.5"
                    >
                      Additional Message{' '}
                      <span className="font-normal text-[#747E78]">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="lh-message"
                      rows={3}
                      placeholder="Any context about language preference, venue setup, or student grade levels"
                      value={form.additionalMessage}
                      onChange={(e) =>
                        updateField('additionalMessage', e.target.value)
                      }
                      className={`${inputBase} border-[#DDD5C7] resize-y`}
                    />
                  </div>

                  {/* Consent */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.privacyConsent}
                        onChange={(e) =>
                          updateField('privacyConsent', e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-[#C8BFB0] text-[#0D3021] focus:ring-[#0D3021]"
                      />
                      <span className="text-[12.5px] leading-relaxed text-[#555E58]">
                        I understand that this form submits a session enquiry
                        (not a confirmed booking) and consent to the Garad
                        Foundation team contacting me regarding this request.
                      </span>
                    </label>
                    {fieldErrors.privacyConsent && (
                      <p className="mt-1.5 text-[12px] text-[#B43D25]">
                        {fieldErrors.privacyConsent}
                      </p>
                    )}
                  </div>

                  {/* Server Error / Unconfigured Integration Notice */}
                  {serverError && (
                    <div
                      role="alert"
                      className={`rounded-2xl p-4 text-[13px] leading-relaxed flex items-start gap-3 ${
                        serverError.code === 'BACKEND_NOT_CONFIGURED'
                          ? 'bg-[#FAF6EC] border border-[#E5D3AF] text-[#5B4720]'
                          : 'bg-[#FCF1EE] border border-[#ECC8BF] text-[#7F2917]'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {serverError.code === 'BACKEND_NOT_CONFIGURED'
                            ? 'Enquiry not delivered — backend integration required'
                            : 'Could not submit session enquiry'}
                        </p>
                        <p className="mt-1">{serverError.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0D3021] hover:bg-[#16402E] disabled:opacity-65 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Session Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[12px] text-[#6E7771]">
                      Enquiries are reviewed by the Garad team before any
                      session is confirmed.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
