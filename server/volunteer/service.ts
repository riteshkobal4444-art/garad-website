import crypto from 'node:crypto';
import path from 'node:path';
import { getSupabaseCredentials } from '../donations/config';
import { getSupabaseAdmin } from '../donations/supabaseClient';
import { ServiceError } from '../donations/service';

export const VOLUNTEER_STATUS_OPTIONS = [
  'Student',
  'Working Professional',
  'Self-employed',
  'Other',
] as const;

export const VOLUNTEER_INTEREST_OPTIONS = [
  'Teaching & Mentoring',
  'Event Volunteering',
  'Creative & Digital',
  'Community Outreach',
  'Operations & Administration',
  'Open to Opportunities',
] as const;

export const VOLUNTEER_AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Occasional Events',
  'Flexible',
] as const;

export const VOLUNTEER_PARTICIPATION_OPTIONS = [
  'In-person',
  'Remote',
  'Either',
] as const;

export type VolunteerStatusOption = (typeof VOLUNTEER_STATUS_OPTIONS)[number];
export type VolunteerInterestOption = (typeof VOLUNTEER_INTEREST_OPTIONS)[number];
export type VolunteerAvailabilityOption = (typeof VOLUNTEER_AVAILABILITY_OPTIONS)[number];
export type VolunteerParticipationOption = (typeof VOLUNTEER_PARTICIPATION_OPTIONS)[number];

export const MAX_RESUME_BYTES = 2.5 * 1024 * 1024; // 2.5 MB raw PDF ceiling

export interface ValidatedResumePayload {
  sanitizedFileName: string;
  buffer: Buffer;
  sizeBytes: number;
  sha256: string;
}

export interface ValidatedVolunteerApplication {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  currentStatus: VolunteerStatusOption;
  interests: VolunteerInterestOption[];
  availability: VolunteerAvailabilityOption;
  participationPreference: VolunteerParticipationOption;
  skillsAndInterests: string | null;
  whyVolunteer: string | null;
  resume: ValidatedResumePayload | null;
  privacyConsent: true;
}

export interface VolunteerSubmissionResponse {
  saved: boolean;
  referenceId: string;
  submittedAt: string;
  resumeStored: boolean;
  notificationEmailSent: boolean;
  confirmationEmailSent: boolean;
  deliveryNote: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,22}$/;
const BASE64_REGEX = /^[A-Za-z0-9+/=\s]+$/;

function cleanText(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function cleanMultilineText(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .slice(0, maxLen);
}

function stripHeaderControls(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizePdfFileName(rawName: string): string {
  const base = path.basename(rawName.trim()).replace(/[^a-zA-Z0-9._-]/g, '_');
  const withoutExt = base.replace(/\.pdf$/i, '').replace(/^\.+/, '') || 'resume';
  return `${withoutExt.slice(0, 72)}.pdf`;
}

function validateOptionalResume(
  rawResume: unknown
): { ok: true; resume: ValidatedResumePayload | null } | { ok: false; error: string } {
  if (rawResume === null || rawResume === undefined) {
    return { ok: true, resume: null };
  }
  if (typeof rawResume !== 'object') {
    return { ok: false, error: 'Invalid resume attachment format.' };
  }

  const obj = rawResume as Record<string, unknown>;
  const fileName = typeof obj.fileName === 'string' ? obj.fileName.trim() : '';
  const mimeType = typeof obj.mimeType === 'string' ? obj.mimeType.trim().toLowerCase() : '';
  const dataBase64 = typeof obj.dataBase64 === 'string' ? obj.dataBase64.trim() : '';

  if (!fileName || !dataBase64) {
    return { ok: false, error: 'Resume file could not be read. Please re-select a valid PDF.' };
  }

  if (!fileName.toLowerCase().endsWith('.pdf')) {
    return { ok: false, error: 'Only PDF files (.pdf) are accepted for resume upload.' };
  }

  if (mimeType && mimeType !== 'application/pdf' && mimeType !== 'application/x-pdf') {
    return { ok: false, error: 'Only PDF files are accepted for resume upload.' };
  }

  if (!BASE64_REGEX.test(dataBase64)) {
    return { ok: false, error: 'Resume file encoding is invalid. Please upload a valid PDF.' };
  }

  // Quick ceiling check before decoding base64 to avoid memory spikes
  const estimatedBytes = Math.ceil((dataBase64.length * 3) / 4);
  if (estimatedBytes > MAX_RESUME_BYTES + 1024) {
    return { ok: false, error: 'Resume PDF must be 2.5 MB or smaller.' };
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  if (buffer.length === 0) {
    return { ok: false, error: 'Uploaded PDF file appears to be empty.' };
  }
  if (buffer.length > MAX_RESUME_BYTES) {
    return { ok: false, error: 'Resume PDF must be 2.5 MB or smaller.' };
  }

  // Verify exact PDF magic-byte header (%PDF-)
  const header = buffer.subarray(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    return {
      ok: false,
      error: 'The selected file is not a valid PDF document. Please upload an authentic PDF file.',
    };
  }

  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  return {
    ok: true,
    resume: {
      sanitizedFileName: sanitizePdfFileName(fileName),
      buffer,
      sizeBytes: buffer.length,
      sha256,
    },
  };
}

export function validateVolunteerApplicationInput(raw: unknown):
  | {
      ok: true;
      data: ValidatedVolunteerApplication;
      isSpamBot: boolean;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid volunteer application payload.' };
  }

  const body = raw as Record<string, unknown>;

  // Honeypot spam trap: real visitors never fill the hidden `website` field.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot.length > 0) {
    return {
      ok: true,
      isSpamBot: true,
      data: {
        fullName: 'Spam Filtered',
        email: 'filtered@example.invalid',
        mobileNumber: '0000000000',
        city: 'Filtered',
        currentStatus: 'Other',
        interests: ['Open to Opportunities'],
        availability: 'Flexible',
        participationPreference: 'Either',
        skillsAndInterests: null,
        whyVolunteer: null,
        resume: null,
        privacyConsent: true,
      },
    };
  }

  // Minimum form dwell time (1.5s) to block automated bot posts
  if (typeof body.formLoadedAt === 'number' && Number.isFinite(body.formLoadedAt)) {
    const elapsedMs = Date.now() - body.formLoadedAt;
    if (elapsedMs >= 0 && elapsedMs < 1500) {
      return {
        ok: false,
        error: 'Please take a moment to review your application before submitting.',
      };
    }
  }

  const fieldErrors: Record<string, string> = {};

  const fullName = cleanText(body.fullName, 120);
  if (fullName.length < 2) {
    fieldErrors.fullName = 'Please enter your full name.';
  }

  const email = cleanText(body.email, 160).toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  const mobileNumber = cleanText(body.mobileNumber, 24);
  const digitsOnly = mobileNumber.replace(/\D/g, '');
  if (!PHONE_ALLOWED_REGEX.test(mobileNumber) || digitsOnly.length < 7 || digitsOnly.length > 15) {
    fieldErrors.mobileNumber = 'Please enter a valid mobile number (7–15 digits).';
  }

  const city = cleanText(body.city, 100);
  if (city.length < 2) {
    fieldErrors.city = 'Please enter your city.';
  }

  const currentStatusRaw = cleanText(body.currentStatus, 60);
  if (!VOLUNTEER_STATUS_OPTIONS.includes(currentStatusRaw as VolunteerStatusOption)) {
    fieldErrors.currentStatus = 'Please select your current status.';
  }

  const rawInterests = Array.isArray(body.interests) ? body.interests : [];
  const uniqueValidInterests = Array.from(
    new Set(
      rawInterests
        .map((item) => cleanText(item, 60))
        .filter((item): item is VolunteerInterestOption =>
          VOLUNTEER_INTEREST_OPTIONS.includes(item as VolunteerInterestOption)
        )
    )
  );
  if (uniqueValidInterests.length === 0) {
    fieldErrors.interests = 'Please select at least one area of volunteer interest.';
  }

  const availabilityRaw = cleanText(body.availability, 40);
  if (!VOLUNTEER_AVAILABILITY_OPTIONS.includes(availabilityRaw as VolunteerAvailabilityOption)) {
    fieldErrors.availability = 'Please select your availability.';
  }

  const participationRaw = cleanText(body.participationPreference, 40);
  if (
    !VOLUNTEER_PARTICIPATION_OPTIONS.includes(
      participationRaw as VolunteerParticipationOption
    )
  ) {
    fieldErrors.participationPreference = 'Please choose your participation preference.';
  }

  const skillsClean = cleanMultilineText(body.skillsAndInterests, 1200);
  const whyClean = cleanMultilineText(body.whyVolunteer, 1500);

  const resumeValidation = validateOptionalResume(body.resume);
  if (!resumeValidation.ok) {
    fieldErrors.resume = resumeValidation.error;
  }

  if (body.privacyConsent !== true) {
    fieldErrors.privacyConsent =
      'Please confirm your consent so Garad Foundation can contact you regarding volunteering.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: 'Please review the highlighted fields and try again.',
      fieldErrors,
    };
  }

  return {
    ok: true,
    isSpamBot: false,
    data: {
      fullName,
      email,
      mobileNumber,
      city,
      currentStatus: currentStatusRaw as VolunteerStatusOption,
      interests: uniqueValidInterests,
      availability: availabilityRaw as VolunteerAvailabilityOption,
      participationPreference: participationRaw as VolunteerParticipationOption,
      skillsAndInterests: skillsClean || null,
      whyVolunteer: whyClean || null,
      resume: resumeValidation.ok ? resumeValidation.resume : null,
      privacyConsent: true,
    },
  };
}

function generateVolunteerReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `GF-VOL-${datePart}-${randPart}`;
}

function getVolunteerEmailConfig() {
  // Never invent an email address — use only configured verified official env vars.
  const toEmail = (
    process.env.VOLUNTEER_ENQUIRY_TO_EMAIL ||
    process.env.ORG_CONTACT_EMAIL ||
    ''
  ).trim();
  const fromEmail = (
    process.env.VOLUNTEER_EMAIL_FROM ||
    process.env.CSR_EMAIL_FROM ||
    ''
  ).trim();
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  return {
    toEmail,
    fromEmail,
    resendApiKey,
    canSendEmail: Boolean(toEmail && fromEmail && resendApiKey),
  };
}

function getResumeBucketName(): string {
  const raw = (process.env.VOLUNTEER_RESUME_BUCKET || 'volunteer-resumes').trim();
  return /^[a-z0-9-_]{3,63}$/.test(raw) ? raw : 'volunteer-resumes';
}

async function sendResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: stripHeaderControls(params.from),
        to: [stripHeaderControls(params.to)],
        ...(params.replyTo ? { reply_to: stripHeaderControls(params.replyTo) } : {}),
        subject: stripHeaderControls(params.subject),
        html: params.html,
        text: params.text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function buildOrgNotificationEmail(
  referenceId: string,
  submittedAt: string,
  data: ValidatedVolunteerApplication,
  resumeStoragePath: string | null
) {
  const subject = `[Volunteer Application] ${data.fullName} — ${data.city} (${referenceId})`;
  const rows: [string, string][] = [
    ['Reference ID', referenceId],
    ['Submitted At', submittedAt],
    ['Full Name', data.fullName],
    ['Email', data.email],
    ['Mobile Number', data.mobileNumber],
    ['City', data.city],
    ['Current Status', data.currentStatus],
    ['Volunteer Interests', data.interests.join(', ')],
    ['Availability', data.availability],
    ['Participation Preference', data.participationPreference],
    ['Skills & Interests', data.skillsAndInterests || 'Not specified'],
    ['Why Garad Foundation', data.whyVolunteer || 'Not specified'],
    [
      'Resume Attachment',
      resumeStoragePath && data.resume
        ? `${data.resume.sanitizedFileName} (${Math.round(data.resume.sizeBytes / 1024)} KB) — stored privately at ${resumeStoragePath}`
        : 'None attached',
    ],
  ];

  const text = [
    'New Volunteer Application — Garad Foundation',
    ...rows.map(([k, v]) => `${k}: ${v}`),
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 640px;">
      <div style="background: #103A2B; color: #F7F5EF; padding: 18px 22px; border-bottom: 3px solid #C77956;">
        <h2 style="margin: 0; font-size: 18px;">Garad Foundation — New Volunteer Application</h2>
      </div>
      <div style="padding: 20px 22px; background: #F7F5EF; border: 1px solid #E5DDD0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding: 6px 10px 6px 0; font-weight: bold; color: #4A564F; width: 38%; vertical-align: top;">${escapeHtml(k)}</td>
              <td style="padding: 6px 0; color: #171C19; white-space: pre-wrap;">${escapeHtml(v)}</td>
            </tr>`
            )
            .join('')}
        </table>
      </div>
    </div>
  `;

  return { subject, html, text };
}

function buildApplicantConfirmationEmail(
  referenceId: string,
  data: ValidatedVolunteerApplication
) {
  const subject = `Thank you for applying to volunteer with Garad Foundation (${referenceId})`;
  const text = [
    `Dear ${data.fullName},`,
    '',
    'Thank you for your interest in volunteering with Garad Foundation.',
    `We have received your volunteer application (Reference: ${referenceId}) for ${data.interests.join(', ')}.`,
    '',
    'Our team in Thane, Maharashtra will review your application and get in touch about suitable opportunities.',
    '',
    'Warm regards,',
    'Garad Foundation',
    'Thane, Maharashtra, India',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 620px;">
      <div style="background: #103A2B; color: #F7F5EF; padding: 18px 22px; border-bottom: 3px solid #C77956;">
        <h2 style="margin: 0; font-size: 18px;">Garad Foundation</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #DCE8DC;">Volunteer Community · Thane, Maharashtra</p>
      </div>
      <div style="padding: 22px; background: #F7F5EF; border: 1px solid #E5DDD0; line-height: 1.65; font-size: 14px;">
        <p style="margin-top: 0;">Dear ${escapeHtml(data.fullName)},</p>
        <p>Thank you for your interest in volunteering with <strong>Garad Foundation</strong>.</p>
        <p>Your application has been recorded under reference <strong>${escapeHtml(referenceId)}</strong> (${escapeHtml(data.interests.join(', '))}).</p>
        <p>Our team will review your application and get in touch about suitable upcoming opportunities.</p>
        <p style="margin-bottom: 0;">Warm regards,<br/><strong>Garad Foundation</strong><br/>Thane, Maharashtra, India</p>
      </div>
    </div>
  `;

  return { subject, html, text };
}

export async function submitVolunteerApplication(
  rawBody: unknown
): Promise<VolunteerSubmissionResponse> {
  const validated = validateVolunteerApplicationInput(rawBody);
  if (!validated.ok) {
    const err = new ServiceError(validated.error, 400, 'VALIDATION_ERROR');
    (err as ServiceError & { fieldErrors?: Record<string, string> }).fieldErrors =
      validated.fieldErrors;
    throw err;
  }

  const referenceId = generateVolunteerReference();
  const submittedAt = new Date().toISOString();

  // Silently absorb honeypot spam bots without storing or emailing
  if (validated.isSpamBot) {
    return {
      saved: false,
      referenceId,
      submittedAt,
      resumeStored: false,
      notificationEmailSent: false,
      confirmationEmailSent: false,
      deliveryNote: 'Submission ignored.',
    };
  }

  const supaCreds = getSupabaseCredentials();
  if (!supaCreds.isConfigured) {
    // Strictly never confirm or fake success when persistent storage is not configured
    throw new ServiceError(
      'Volunteer application storage is not yet connected. Please configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and run migration 003_volunteer_applications.sql before accepting live submissions.',
      503,
      'BACKEND_NOT_CONFIGURED'
    );
  }

  const data = validated.data;
  const supabase = getSupabaseAdmin();
  let resumeStoragePath: string | null = null;
  let resumeStored = false;

  // Upload optional PDF resume strictly to private Supabase Storage with server-generated path
  if (data.resume) {
    const bucket = getResumeBucketName();
    const safeObjectPath = `applications/${referenceId}/${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(safeObjectPath, data.resume.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error(`[volunteer-api] Private resume upload failed for ${referenceId}`);
      throw new ServiceError(
        'We could not securely store your attached PDF resume right now. Please ensure the private "volunteer-resumes" storage bucket is set up in Supabase, or submit without a resume attachment.',
        503,
        'RESUME_STORAGE_UNAVAILABLE'
      );
    }

    resumeStoragePath = `${bucket}/${safeObjectPath}`;
    resumeStored = true;
  }

  // Persist application in RLS-protected volunteer_applications table
  const { error: insertError } = await supabase
    .from('volunteer_applications')
    .insert({
      reference_id: referenceId,
      full_name: data.fullName,
      email: data.email,
      mobile_number: data.mobileNumber,
      city: data.city,
      current_status: data.currentStatus,
      interests: data.interests,
      availability: data.availability,
      participation_preference: data.participationPreference,
      skills_and_interests: data.skillsAndInterests,
      why_volunteer: data.whyVolunteer,
      resume_storage_path: resumeStoragePath,
      resume_file_name: data.resume ? data.resume.sanitizedFileName : null,
      resume_file_size: data.resume ? data.resume.sizeBytes : null,
      resume_sha256: data.resume ? data.resume.sha256 : null,
      privacy_consent: true,
      source_path: '/volunteer',
      notification_email_sent: false,
      confirmation_email_sent: false,
      submitted_at: submittedAt,
    });

  if (insertError) {
    // Clean up orphaned resume upload if DB insert failed
    if (resumeStored && resumeStoragePath) {
      const bucket = getResumeBucketName();
      const objectKey = resumeStoragePath.replace(`${bucket}/`, '');
      await supabase.storage.from(bucket).remove([objectKey]).catch(() => {});
    }
    console.error(`[volunteer-api] Database insert failed for ${referenceId}`);
    throw new ServiceError(
      'We could not save your volunteer application right now. Please try again in a moment.',
      503,
      'DATABASE_WRITE_FAILED'
    );
  }

  // Send notification & optional confirmation email when Resend + official email env vars are configured
  const emailConfig = getVolunteerEmailConfig();
  let notificationEmailSent = false;
  let confirmationEmailSent = false;

  if (emailConfig.canSendEmail) {
    const orgMail = buildOrgNotificationEmail(
      referenceId,
      submittedAt,
      data,
      resumeStoragePath
    );
    notificationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: emailConfig.toEmail,
      replyTo: data.email,
      subject: orgMail.subject,
      html: orgMail.html,
      text: orgMail.text,
    });

    const applicantMail = buildApplicantConfirmationEmail(referenceId, data);
    confirmationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: data.email,
      replyTo: emailConfig.toEmail,
      subject: applicantMail.subject,
      html: applicantMail.html,
      text: applicantMail.text,
    });

    if (notificationEmailSent || confirmationEmailSent) {
      await supabase
        .from('volunteer_applications')
        .update({
          notification_email_sent: notificationEmailSent,
          confirmation_email_sent: confirmationEmailSent,
        })
        .eq('reference_id', referenceId);
    }
  }

  // Log only non-PII operational telemetry
  console.info(
    `[volunteer-api] Saved ${referenceId} (resume=${resumeStored}, notify=${notificationEmailSent}, confirm=${confirmationEmailSent})`
  );

  const deliveryNote =
    notificationEmailSent && confirmationEmailSent
      ? 'A confirmation copy has been sent to your email address.'
      : 'Your application has been securely recorded with our volunteer team.';

  return {
    saved: true,
    referenceId,
    submittedAt,
    resumeStored,
    notificationEmailSent,
    confirmationEmailSent,
    deliveryNote,
  };
}
