import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarHeart,
  Check,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Loader2,
  Megaphone,
  Palette,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { EASE_EDITORIAL } from './motion/MotionPrimitives';

export type VolunteerStatus =
  | 'Student'
  | 'Working Professional'
  | 'Self-employed'
  | 'Other';

export type VolunteerInterest =
  | 'Teaching & Mentoring'
  | 'Event Volunteering'
  | 'Creative & Digital'
  | 'Community Outreach'
  | 'Operations & Administration'
  | 'Open to Opportunities';

export type VolunteerAvailability =
  | 'Weekdays'
  | 'Weekends'
  | 'Occasional Events'
  | 'Flexible';

export type VolunteerParticipation = 'In-person' | 'Remote' | 'Either';

interface InterestCardConfig {
  value: VolunteerInterest;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_OPTIONS: VolunteerStatus[] = [
  'Student',
  'Working Professional',
  'Self-employed',
  'Other',
];

const INTEREST_CARDS: InterestCardConfig[] = [
  {
    value: 'Teaching & Mentoring',
    description: 'Guide students, lead sessions & build foundational skills',
    icon: BookOpen,
  },
  {
    value: 'Event Volunteering',
    description: 'Support drives, workshops & on-ground school events',
    icon: CalendarHeart,
  },
  {
    value: 'Creative & Digital',
    description: 'Design, photography, storytelling & digital outreach',
    icon: Palette,
  },
  {
    value: 'Community Outreach',
    description: 'Connect with local neighbourhoods, schools & partners',
    icon: Megaphone,
  },
  {
    value: 'Operations & Administration',
    description: 'Help plan logistics, coordination & documentation',
    icon: ClipboardList,
  },
  {
    value: 'Open to Opportunities',
    description: 'Happy to contribute wherever the team needs help most',
    icon: Compass,
  },
];

const AVAILABILITY_OPTIONS: VolunteerAvailability[] = [
  'Weekdays',
  'Weekends',
  'Occasional Events',
  'Flexible',
];

const PARTICIPATION_OPTIONS: VolunteerParticipation[] = [
  'In-person',
  'Remote',
  'Either',
];

const MAX_RESUME_BYTES = 2.5 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,22}$/;

const STEP_1_FIELDS = new Set([
  'fullName',
  'email',
  'mobileNumber',
  'city',
  'currentStatus',
]);

interface SelectedResume {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  dataBase64: string;
}

interface ConfirmedSubmission {
  referenceId: string;
  submittedAt: string;
  resumeStored: boolean;
  deliveryNote: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function VolunteerApplicationForm() {
  const prefersReduced = useReducedMotion();
  const baseId = useId();
  const formLoadedAtRef = useRef<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardTopRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [currentStatus, setCurrentStatus] = useState<VolunteerStatus | ''>('');

  // Step 2 fields
  const [interests, setInterests] = useState<VolunteerInterest[]>([]);
  const [availability, setAvailability] = useState<VolunteerAvailability | ''>('');
  const [participationPreference, setParticipationPreference] = useState<
    VolunteerParticipation | ''
  >('');
  const [skillsAndInterests, setSkillsAndInterests] = useState('');
  const [whyVolunteer, setWhyVolunteer] = useState('');
  const [resume, setResume] = useState<SelectedResume | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Anti-spam hidden honeypot
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');

  // UI states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<{
    message: string;
    code?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedSubmission | null>(null);

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep1 = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    const trimmedPhone = mobileNumber.trim();
    const digits = trimmedPhone.replace(/\D/g, '');
    if (
      !PHONE_ALLOWED_REGEX.test(trimmedPhone) ||
      digits.length < 7 ||
      digits.length > 15
    ) {
      errors.mobileNumber = 'Please enter a valid mobile number (7–15 digits).';
    }
    if (city.trim().length < 2) {
      errors.city = 'Please enter your city.';
    }
    if (!currentStatus) {
      errors.currentStatus = 'Please select your current status.';
    }
    return errors;
  };

  const validateStep2 = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (interests.length === 0) {
      errors.interests = 'Please select at least one area of interest.';
    }
    if (!availability) {
      errors.availability = 'Please select your availability.';
    }
    if (!participationPreference) {
      errors.participationPreference =
        'Please select how you prefer to participate.';
    }
    if (!privacyConsent) {
      errors.privacyConsent =
        'Please confirm your consent so our team can contact you about volunteering.';
    }
    return errors;
  };

  const handleContinue = () => {
    setServerError(null);
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`${baseId}-${firstKey}`);
      el?.focus();
      return;
    }
    setFieldErrors({});
    setDirection(1);
    setStep(2);
    cardTopRef.current?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'nearest',
    });
  };

  const handleBack = () => {
    setServerError(null);
    setDirection(-1);
    setStep(1);
  };

  const toggleInterest = (interest: VolunteerInterest) => {
    clearError('interests');
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError('resume');
    setServerError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.name.toLowerCase().endsWith('.pdf') ||
      (file.type && file.type !== 'application/pdf' && file.type !== 'application/x-pdf')
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        resume: 'Only PDF files (.pdf) are accepted.',
      }));
      e.target.value = '';
      return;
    }

    if (file.size === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        resume: 'The selected PDF file appears to be empty.',
      }));
      e.target.value = '';
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        resume: 'Resume PDF must be 2.5 MB or smaller.',
      }));
      e.target.value = '';
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const header = new TextDecoder('ascii').decode(new Uint8Array(buffer.slice(0, 5)));
      if (header !== '%PDF-') {
        setFieldErrors((prev) => ({
          ...prev,
          resume: 'This file does not appear to be a valid PDF document.',
        }));
        e.target.value = '';
        return;
      }

      setResume({
        fileName: file.name,
        mimeType: 'application/pdf',
        sizeBytes: file.size,
        dataBase64: arrayBufferToBase64(buffer),
      });
    } catch {
      setFieldErrors((prev) => ({
        ...prev,
        resume: 'Could not read the selected PDF. Please try another file.',
      }));
      e.target.value = '';
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
    clearError('resume');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      handleContinue();
      return;
    }

    setServerError(null);
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    const combinedErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(combinedErrors).length > 0) {
      setFieldErrors(combinedErrors);
      if (Object.keys(step1Errors).length > 0) {
        setDirection(-1);
        setStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/volunteer/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
          city: city.trim(),
          currentStatus,
          interests,
          availability,
          participationPreference,
          skillsAndInterests: skillsAndInterests.trim() || undefined,
          whyVolunteer: whyVolunteer.trim() || undefined,
          resume: resume
            ? {
                fileName: resume.fileName,
                mimeType: resume.mimeType,
                dataBase64: resume.dataBase64,
              }
            : null,
          privacyConsent,
          website: websiteHoneypot,
          formLoadedAt: formLoadedAtRef.current,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
          setFieldErrors(data.fieldErrors);
          const hasStep1Err = Object.keys(data.fieldErrors).some((k) =>
            STEP_1_FIELDS.has(k)
          );
          if (hasStep1Err) {
            setDirection(-1);
            setStep(1);
          }
        }
        setServerError({
          message:
            typeof data?.error === 'string'
              ? data.error
              : 'We could not submit your application right now. Please try again.',
          code: typeof data?.code === 'string' ? data.code : undefined,
        });
        return;
      }

      // Strictly show the success state ONLY when backend explicitly confirms saved === true
      if (data?.saved === true && typeof data?.referenceId === 'string') {
        setConfirmed({
          referenceId: data.referenceId,
          submittedAt: data.submittedAt || new Date().toISOString(),
          resumeStored: Boolean(data.resumeStored),
          deliveryNote:
            typeof data.deliveryNote === 'string'
              ? data.deliveryNote
              : 'Your application has been securely recorded with our volunteer team.',
        });
        cardTopRef.current?.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });
        return;
      }

      setServerError({
        message:
          'We could not confirm that your application was saved. Please try again shortly.',
        code: 'UNCONFIRMED_SAVE',
      });
    } catch {
      setServerError({
        message:
          'A network error occurred while submitting your application. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <motion.div
        ref={cardTopRef}
        initial={prefersReduced ? false : { opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
        role="status"
        aria-live="polite"
        className="chrome-card chrome-card-subtle rounded-3xl bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={prefersReduced ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 20,
            delay: prefersReduced ? 0 : 0.1,
          }}
          className="w-16 h-16 rounded-full bg-[#DCE8DC] text-[#174C38] flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
        </motion.div>

        <p className="mt-6 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#9A3B1E]">
          Application Confirmed
        </p>

        <h3 className="mt-2 font-serif text-2xl sm:text-[32px] font-bold text-[#103A2B] leading-tight text-balance">
          You&apos;re One Step Closer to Making a Difference!
        </h3>

        <p className="mt-4 text-[15.5px] leading-relaxed text-[#4E5A53] max-w-xl mx-auto">
          Thank you for your interest in volunteering with Garad Foundation. Our
          team will review your application and get in touch about suitable
          opportunities.
        </p>

        <div className="mt-7 pt-6 border-t border-[#EAE4D7] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[13px] text-[#55615A]">
          <span>
            Reference:{' '}
            <strong className="font-mono text-[#103A2B] font-semibold">
              {confirmed.referenceId}
            </strong>
          </span>
          {confirmed.resumeStored && (
            <>
              <span aria-hidden="true" className="hidden sm:inline text-[#C5BDB0]">
                ·
              </span>
              <span>Resume PDF securely attached</span>
            </>
          )}
        </div>

        <p className="mt-3 text-[13px] text-[#66726B]">{confirmed.deliveryNote}</p>
      </motion.div>
    );
  }

  return (
    <div
      ref={cardTopRef}
      className="chrome-card chrome-card-subtle rounded-3xl bg-white overflow-hidden"
    >
      {/* Top Card Header & Animated Progress Indicator */}
      <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-[#ECE6DA] bg-gradient-to-b from-[#FCFBF8] to-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#9A3B1E]">
              Volunteer Application
            </p>
            <h2 className="mt-1.5 font-serif text-[28px] sm:text-[34px] font-bold text-[#103A2B] leading-[1.15] text-balance">
              Let&apos;s Get to Know You.
            </h2>
            <p className="mt-2 text-[15px] text-[#55615A] leading-relaxed max-w-xl">
              Tell us a little about yourself and how you would like to
              contribute.
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-[12.5px] font-semibold text-[#174C38] tabular-nums">
              Step {step} of 2
            </p>
            <p className="text-[12px] text-[#66726B] mt-0.5">
              {step === 1 ? 'About You' : 'Your Interests'}
            </p>
          </div>
        </div>

        {/* Compositor-only progress bar (scaleX) */}
        <div
          className="mt-6 h-1.5 w-full rounded-full bg-[#EAE5DA] overflow-hidden"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={2}
          aria-label={`Application progress: Step ${step} of 2`}
        >
          <motion.div
            className="h-full w-full rounded-full bg-[#174C38] origin-left"
            initial={false}
            animate={{ scaleX: step === 1 ? 0.5 : 1 }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.35,
              ease: EASE_EDITORIAL,
            }}
          />
        </div>
      </div>

      {/* Form Body */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="px-6 sm:px-10 py-8 sm:py-10"
      >
        {/* Hidden spam honeypot field (never visible or focusable to real visitors) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${baseId}-website`}>Website</label>
          <input
            id={`${baseId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHoneypot}
            onChange={(e) => setWebsiteHoneypot(e.target.value)}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="volunteer-step-1"
              initial={
                prefersReduced ? false : { opacity: 0, x: direction * 20 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -20 }
              }
              transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor={`${baseId}-fullName`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    Full Name <span className="text-[#9A3B1E]">*</span>
                  </label>
                  <input
                    id={`${baseId}-fullName`}
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g., Aarav Kulkarni"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearError('fullName');
                    }}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={
                      fieldErrors.fullName ? `${baseId}-fullName-err` : undefined
                    }
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FCFBF8] text-[15px] text-[#171C19] placeholder:text-[#8E9791] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38] ${
                      fieldErrors.fullName
                        ? 'border-[#B42318] bg-[#FFF8F7]'
                        : 'border-[#DDD6C7] hover:border-[#BEB5A3]'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p
                      id={`${baseId}-fullName-err`}
                      className="mt-1.5 text-[12.5px] text-[#B42318] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor={`${baseId}-email`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    Email Address <span className="text-[#9A3B1E]">*</span>
                  </label>
                  <input
                    id={`${baseId}-email`}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError('email');
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? `${baseId}-email-err` : undefined
                    }
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FCFBF8] text-[15px] text-[#171C19] placeholder:text-[#8E9791] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38] ${
                      fieldErrors.email
                        ? 'border-[#B42318] bg-[#FFF8F7]'
                        : 'border-[#DDD6C7] hover:border-[#BEB5A3]'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p
                      id={`${baseId}-email-err`}
                      className="mt-1.5 text-[12.5px] text-[#B42318] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor={`${baseId}-mobileNumber`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    Mobile Number <span className="text-[#9A3B1E]">*</span>
                  </label>
                  <input
                    id={`${baseId}-mobileNumber`}
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      clearError('mobileNumber');
                    }}
                    aria-invalid={Boolean(fieldErrors.mobileNumber)}
                    aria-describedby={
                      fieldErrors.mobileNumber
                        ? `${baseId}-mobileNumber-err`
                        : undefined
                    }
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FCFBF8] text-[15px] text-[#171C19] placeholder:text-[#8E9791] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38] ${
                      fieldErrors.mobileNumber
                        ? 'border-[#B42318] bg-[#FFF8F7]'
                        : 'border-[#DDD6C7] hover:border-[#BEB5A3]'
                    }`}
                  />
                  {fieldErrors.mobileNumber && (
                    <p
                      id={`${baseId}-mobileNumber-err`}
                      className="mt-1.5 text-[12.5px] text-[#B42318] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.mobileNumber}</span>
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor={`${baseId}-city`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    City <span className="text-[#9A3B1E]">*</span>
                  </label>
                  <input
                    id={`${baseId}-city`}
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="e.g., Thane, Mumbai, Pune"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      clearError('city');
                    }}
                    aria-invalid={Boolean(fieldErrors.city)}
                    aria-describedby={
                      fieldErrors.city ? `${baseId}-city-err` : undefined
                    }
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FCFBF8] text-[15px] text-[#171C19] placeholder:text-[#8E9791] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38] ${
                      fieldErrors.city
                        ? 'border-[#B42318] bg-[#FFF8F7]'
                        : 'border-[#DDD6C7] hover:border-[#BEB5A3]'
                    }`}
                  />
                  {fieldErrors.city && (
                    <p
                      id={`${baseId}-city-err`}
                      className="mt-1.5 text-[12.5px] text-[#B42318] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.city}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Current Status */}
              <fieldset>
                <legend className="block text-[13.5px] font-semibold text-[#17231D] mb-2.5">
                  Current Status <span className="text-[#9A3B1E]">*</span>
                </legend>
                <div
                  id={`${baseId}-currentStatus`}
                  role="radiogroup"
                  aria-label="Current Status"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  {STATUS_OPTIONS.map((option) => {
                    const selected = currentStatus === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setCurrentStatus(option);
                          clearError('currentStatus');
                        }}
                        className={`min-h-[46px] px-4 py-2.5 rounded-xl text-[14px] font-medium border text-left sm:text-center flex items-center justify-between sm:justify-center gap-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] focus-visible:ring-offset-1 ${
                          selected
                            ? 'bg-[#DCE8DC]/75 border-[#174C38] text-[#103A2B] font-semibold shadow-[0_0_0_1px_#174C38]'
                            : 'bg-[#FCFBF8] border-[#DDD6C7] text-[#3B4740] hover:border-[#174C38]/55 hover:bg-white'
                        }`}
                      >
                        <span>{option}</span>
                        {selected && (
                          <Check className="w-4 h-4 text-[#174C38] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.currentStatus && (
                  <p className="mt-2 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.currentStatus}</span>
                  </p>
                )}
              </fieldset>

              <div className="pt-4 border-t border-[#EFEAE0] flex items-center justify-end">
                <motion.button
                  type="button"
                  onClick={handleContinue}
                  whileHover={prefersReduced ? undefined : { y: -1 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#174C38] hover:bg-[#103A2B] text-white text-[14.5px] font-semibold shadow-[0_8px_20px_-8px_rgba(16,58,43,0.45)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] focus-visible:ring-offset-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="volunteer-step-2"
              initial={
                prefersReduced ? false : { opacity: 0, x: direction * 20 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -20 }
              }
              transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
              className="space-y-7"
            >
              {/* Multi-Select Volunteer Interests */}
              <fieldset>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <legend className="text-[14px] font-semibold text-[#17231D]">
                    Where would you like to contribute?{' '}
                    <span className="text-[#9A3B1E]">*</span>
                  </legend>
                  <span className="text-[12.5px] text-[#5F6C64]">
                    Select one or more
                    {interests.length > 0 ? ` · ${interests.length} selected` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {INTEREST_CARDS.map((card) => {
                    const Icon = card.icon;
                    const selected = interests.includes(card.value);
                    return (
                      <motion.button
                        key={card.value}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => toggleInterest(card.value)}
                        whileHover={prefersReduced ? undefined : { y: -2 }}
                        whileTap={prefersReduced ? undefined : { scale: 0.99 }}
                        transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                        className={`relative text-left p-4 rounded-2xl border transition-all duration-180 cursor-pointer flex flex-col justify-between min-h-[112px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] focus-visible:ring-offset-2 ${
                          selected
                            ? 'bg-[#DCE8DC]/60 border-[#174C38] shadow-[0_0_0_1px_#174C38,0_10px_22px_-14px_rgba(16,58,43,0.35)]'
                            : 'bg-[#FCFBF8] border-[#E0D9CA] hover:border-[#174C38]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-[#174C38] text-white'
                                : 'bg-[#F0ECE3] text-[#174C38]'
                            }`}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                          </span>

                          <span
                            aria-hidden="true"
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-150 ${
                              selected
                                ? 'bg-[#174C38] border-[#174C38] text-white scale-100'
                                : 'bg-white border-[#C8C0B2] text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                        </div>

                        <div className="mt-3">
                          <p
                            className={`text-[14.5px] font-semibold leading-snug ${
                              selected ? 'text-[#103A2B]' : 'text-[#171C19]'
                            }`}
                          >
                            {card.value}
                          </p>
                          <p className="mt-1 text-[12.5px] leading-snug text-[#58655E]">
                            {card.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {fieldErrors.interests && (
                  <p className="mt-2 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.interests}</span>
                  </p>
                )}
              </fieldset>

              {/* Availability & Participation Preference */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <fieldset>
                  <legend className="block text-[13.5px] font-semibold text-[#17231D] mb-2.5">
                    Availability <span className="text-[#9A3B1E]">*</span>
                  </legend>
                  <div
                    role="radiogroup"
                    aria-label="Availability"
                    className="grid grid-cols-2 gap-2.5"
                  >
                    {AVAILABILITY_OPTIONS.map((option) => {
                      const selected = availability === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            setAvailability(option);
                            clearError('availability');
                          }}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-[13.5px] font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] ${
                            selected
                              ? 'bg-[#DCE8DC]/75 border-[#174C38] text-[#103A2B] font-semibold shadow-[0_0_0_1px_#174C38]'
                              : 'bg-[#FCFBF8] border-[#DDD6C7] text-[#3B4740] hover:border-[#174C38]/55 hover:bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.availability && (
                    <p className="mt-2 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.availability}</span>
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="block text-[13.5px] font-semibold text-[#17231D] mb-2.5">
                    Participation Preference{' '}
                    <span className="text-[#9A3B1E]">*</span>
                  </legend>
                  <div
                    role="radiogroup"
                    aria-label="Participation Preference"
                    className="grid grid-cols-3 gap-2.5"
                  >
                    {PARTICIPATION_OPTIONS.map((option) => {
                      const selected = participationPreference === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            setParticipationPreference(option);
                            clearError('participationPreference');
                          }}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-[13.5px] font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] ${
                            selected
                              ? 'bg-[#DCE8DC]/75 border-[#174C38] text-[#103A2B] font-semibold shadow-[0_0_0_1px_#174C38]'
                              : 'bg-[#FCFBF8] border-[#DDD6C7] text-[#3B4740] hover:border-[#174C38]/55 hover:bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.participationPreference && (
                    <p className="mt-2 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.participationPreference}</span>
                    </p>
                  )}
                </fieldset>
              </div>

              {/* Skills & Motivation Textareas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor={`${baseId}-skills`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    Skills and Interests
                  </label>
                  <textarea
                    id={`${baseId}-skills`}
                    rows={3}
                    maxLength={1200}
                    placeholder="e.g., Marathi/English tutoring, graphic design, photography, event planning..."
                    value={skillsAndInterests}
                    onChange={(e) => setSkillsAndInterests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FCFBF8] text-[14.5px] text-[#171C19] placeholder:text-[#8E9791] border border-[#DDD6C7] hover:border-[#BEB5A3] transition-colors resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38]"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${baseId}-whyVolunteer`}
                    className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                  >
                    Why would you like to volunteer with Garad Foundation?{' '}
                    <span className="font-normal text-[#6B766F]">(Optional)</span>
                  </label>
                  <textarea
                    id={`${baseId}-whyVolunteer`}
                    rows={3}
                    maxLength={1500}
                    placeholder="Share a few lines about what inspires you to join..."
                    value={whyVolunteer}
                    onChange={(e) => setWhyVolunteer(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FCFBF8] text-[14.5px] text-[#171C19] placeholder:text-[#8E9791] border border-[#DDD6C7] hover:border-[#BEB5A3] transition-colors resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]/35 focus-visible:border-[#174C38]"
                  />
                </div>
              </div>

              {/* Optional PDF Resume Upload */}
              <div>
                <label
                  htmlFor={`${baseId}-resume`}
                  className="block text-[13.5px] font-semibold text-[#17231D] mb-2"
                >
                  Resume Upload{' '}
                  <span className="font-normal text-[#6B766F]">
                    (Optional · PDF only, up to 2.5 MB)
                  </span>
                </label>

                <input
                  ref={fileInputRef}
                  id={`${baseId}-resume`}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeChange}
                  className="sr-only"
                />

                {!resume ? (
                  <label
                    htmlFor={`${baseId}-resume`}
                    className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 rounded-xl border border-dashed transition-colors cursor-pointer ${
                      fieldErrors.resume
                        ? 'border-[#B42318] bg-[#FFF8F7]'
                        : 'border-[#C9C0B0] bg-[#FCFBF8] hover:border-[#174C38] hover:bg-[#F5F9F6]'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-left">
                      <span className="w-10 h-10 rounded-lg bg-[#EEF4F0] text-[#174C38] flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold text-[#17231D]">
                          Choose a PDF file
                        </span>
                        <span className="block text-[12.5px] text-[#647069]">
                          Stored privately for Garad Foundation volunteer review
                        </span>
                      </span>
                    </span>
                    <span className="px-3.5 py-2 rounded-lg bg-white border border-[#D7CFC0] text-[13px] font-semibold text-[#174C38] whitespace-nowrap">
                      Browse PDF
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[#F3F8F4] border border-[#174C38]/35">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-[#174C38] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#103A2B] truncate">
                          {resume.fileName}
                        </p>
                        <p className="text-[12px] text-[#55635B] tabular-nums">
                          PDF · {formatFileSize(resume.sizeBytes)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      aria-label={`Remove selected resume ${resume.fileName}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold text-[#8A2E1B] hover:bg-white transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                {fieldErrors.resume && (
                  <p className="mt-1.5 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.resume}</span>
                  </p>
                )}
              </div>

              {/* Required Privacy Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id={`${baseId}-privacyConsent`}
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => {
                      setPrivacyConsent(e.target.checked);
                      clearError('privacyConsent');
                    }}
                    className="mt-0.5 w-5 h-5 rounded border-[#BEB5A3] accent-[#174C38] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]"
                  />
                  <span className="text-[13.5px] leading-relaxed text-[#45514A]">
                    I consent to Garad Foundation reviewing the information I
                    have shared and contacting me regarding volunteer
                    opportunities. My personal details will be kept confidential
                    and never shared publicly.{' '}
                    <span className="text-[#9A3B1E] font-semibold">*</span>
                  </span>
                </label>

                {fieldErrors.privacyConsent && (
                  <p className="mt-2 text-[12.5px] text-[#B42318] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.privacyConsent}</span>
                  </p>
                )}
              </div>

              {/* Honest Backend Error Banner */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-2xl bg-[#FFF6F2] border border-[#E5BFB0] p-4 flex items-start gap-3 text-[13.5px] leading-relaxed text-[#6E2614]"
                >
                  <AlertCircle className="w-5 h-5 text-[#9A3B1E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#5A1E0F]">
                      {serverError.code === 'BACKEND_NOT_CONFIGURED'
                        ? 'Application Storage Setup Required'
                        : 'Could Not Submit Application'}
                    </p>
                    <p className="mt-1">{serverError.message}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-5 border-t border-[#EFEAE0] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#D8D0C1] bg-white hover:bg-[#F7F5EF] text-[#17231D] text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <span className="hidden lg:inline-flex items-center gap-1.5 text-[12px] text-[#647069]">
                    <ShieldCheck className="w-4 h-4 text-[#174C38]" />
                    <span>Private &amp; secure submission</span>
                  </span>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={
                      prefersReduced || isSubmitting ? undefined : { y: -1 }
                    }
                    whileTap={
                      prefersReduced || isSubmitting ? undefined : { scale: 0.98 }
                    }
                    transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#174C38] hover:bg-[#103A2B] text-white text-[14.5px] font-semibold shadow-[0_8px_20px_-8px_rgba(16,58,43,0.45)] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174C38] focus-visible:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
