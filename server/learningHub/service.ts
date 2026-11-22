import crypto from 'node:crypto';
import { getSupabaseCredentials } from '../donations/config';
import { getSupabaseAdmin } from '../donations/supabaseClient';
import { ServiceError } from '../donations/service';

export const ALLOWED_LEARNING_ORG_TYPES = [
  'School',
  'College',
  'Corporate Organisation',
  'Community / Youth Group',
  'Other',
] as const;

export const ALLOWED_LEARNING_PROGRAMMES = [
  'Sabse Bada Rupaiya — Money Smart Starts Young',
  'Shiv Shala',
  'Youth Leadership Program',
  'Special Workshops (Custom Session)',
  'Not sure yet — please advise',
] as const;

export type LearningOrgType = (typeof ALLOWED_LEARNING_ORG_TYPES)[number];
export type LearningProgrammeInterest =
  (typeof ALLOWED_LEARNING_PROGRAMMES)[number];

export interface ValidatedLearningHubEnquiry {
  organisationName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  organisationType: LearningOrgType;
  programmeOfInterest: LearningProgrammeInterest;
  customSessionRequirement: string | null;
  expectedParticipants: number | null;
  preferredDate: string | null;
  alternativeDate: string | null;
  location: string;
  additionalMessage: string | null;
  privacyConsent: true;
}

export interface LearningHubSubmissionResponse {
  accepted: boolean;
  referenceId: string;
  submittedAt: string;
  storedInDatabase: boolean;
  notificationEmailSent: boolean;
  confirmationEmailSent: boolean;
  deliveryNote: string;
}

export interface LearningHubPublicConfig {
  submissionReady: boolean;
  databaseConfigured: boolean;
  emailConfigured: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,22}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Short-lived in-memory deduplication cache to guard against accidental double-clicks
const RECENT_SUBMISSION_TTL_MS = 2 * 60_000;
const recentSubmissionHashes = new Map<string, number>();

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

function isValidCalendarDate(dateStr: string): boolean {
  if (!ISO_DATE_REGEX.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() === m - 1 &&
    parsed.getUTCDate() === d
  );
}

function getLearningHubEmailConfig() {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const toEmail = (
    process.env.LEARNING_HUB_ENQUIRY_TO_EMAIL ||
    process.env.ORG_CONTACT_EMAIL ||
    process.env.CSR_ENQUIRY_TO_EMAIL ||
    ''
  ).trim();
  const fromEmail = (
    process.env.LEARNING_HUB_EMAIL_FROM ||
    process.env.CSR_EMAIL_FROM ||
    process.env.VOLUNTEER_EMAIL_FROM ||
    ''
  ).trim();

  return {
    resendApiKey,
    toEmail,
    fromEmail,
    canSendEmail: Boolean(
      resendApiKey && EMAIL_REGEX.test(toEmail) && fromEmail.length > 3
    ),
  };
}

export function getLearningHubPublicConfig(): LearningHubPublicConfig {
  const supaCreds = getSupabaseCredentials();
  const emailConfig = getLearningHubEmailConfig();
  return {
    submissionReady: supaCreds.isConfigured || emailConfig.canSendEmail,
    databaseConfigured: supaCreds.isConfigured,
    emailConfigured: emailConfig.canSendEmail,
  };
}

export function validateLearningHubEnquiryInput(raw: unknown):
  | {
      ok: true;
      data: ValidatedLearningHubEnquiry;
      isSpamBot: boolean;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid session enquiry payload.' };
  }

  const body = raw as Record<string, unknown>;

  // Honeypot spam trap
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot.length > 0) {
    return {
      ok: true,
      isSpamBot: true,
      data: {
        organisationName: 'Spam Filtered',
        contactPerson: 'Spam Filtered',
        email: 'filtered@example.invalid',
        phoneNumber: '0000000000',
        organisationType: 'Other',
        programmeOfInterest: 'Not sure yet — please advise',
        customSessionRequirement: null,
        expectedParticipants: null,
        preferredDate: null,
        alternativeDate: null,
        location: 'Filtered',
        additionalMessage: null,
        privacyConsent: true,
      },
    };
  }

  // Minimum dwell time (1.5s) against automated scripts
  if (typeof body.formLoadedAt === 'number' && Number.isFinite(body.formLoadedAt)) {
    const elapsedMs = Date.now() - body.formLoadedAt;
    if (elapsedMs >= 0 && elapsedMs < 1500) {
      return {
        ok: false,
        error:
          'Please take a moment to review your enquiry details before submitting.',
      };
    }
  }

  const fieldErrors: Record<string, string> = {};

  const organisationName = cleanText(body.organisationName, 160);
  if (organisationName.length < 2) {
    fieldErrors.organisationName =
      'Please enter your organisation, school, or group name.';
  }

  const contactPerson = cleanText(body.contactPerson, 120);
  if (contactPerson.length < 2) {
    fieldErrors.contactPerson = 'Please enter the contact person’s full name.';
  }

  const email = cleanText(body.email, 160).toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  const phoneNumber = cleanText(body.phoneNumber, 28);
  const digitCount = phoneNumber.replace(/\D/g, '').length;
  if (
    !PHONE_ALLOWED_REGEX.test(phoneNumber) ||
    digitCount < 8 ||
    digitCount > 15
  ) {
    fieldErrors.phoneNumber =
      'Please enter a valid phone number (8–15 digits).';
  }

  const orgTypeRaw = cleanText(body.organisationType, 60);
  if (
    !ALLOWED_LEARNING_ORG_TYPES.includes(orgTypeRaw as LearningOrgType)
  ) {
    fieldErrors.organisationType = 'Please select your organisation type.';
  }

  const programmeRaw = cleanText(body.programmeOfInterest, 100);
  if (
    !ALLOWED_LEARNING_PROGRAMMES.includes(
      programmeRaw as LearningProgrammeInterest
    )
  ) {
    fieldErrors.programmeOfInterest =
      'Please select a programme of interest or custom session option.';
  }

  const customSessionRequirement =
    cleanMultilineText(body.customSessionRequirement, 1500) || null;
  if (
    programmeRaw === 'Special Workshops (Custom Session)' &&
    (!customSessionRequirement || customSessionRequirement.length < 10)
  ) {
    fieldErrors.customSessionRequirement =
      'Please briefly describe your custom session topic or goals (at least 10 characters).';
  }

  let expectedParticipants: number | null = null;
  const rawParticipants = body.expectedParticipants;
  if (
    rawParticipants !== undefined &&
    rawParticipants !== null &&
    String(rawParticipants).trim() !== ''
  ) {
    const parsedNum = Number(String(rawParticipants).trim());
    if (
      !Number.isInteger(parsedNum) ||
      parsedNum < 1 ||
      parsedNum > 5000
    ) {
      fieldErrors.expectedParticipants =
        'Please enter a whole number between 1 and 5,000.';
    } else {
      expectedParticipants = parsedNum;
    }
  }

  const preferredDateRaw = cleanText(body.preferredDate, 20);
  let preferredDate: string | null = null;
  if (preferredDateRaw) {
    if (!isValidCalendarDate(preferredDateRaw)) {
      fieldErrors.preferredDate = 'Please choose a valid preferred date.';
    } else {
      preferredDate = preferredDateRaw;
    }
  }

  const alternativeDateRaw = cleanText(body.alternativeDate, 20);
  let alternativeDate: string | null = null;
  if (alternativeDateRaw) {
    if (!isValidCalendarDate(alternativeDateRaw)) {
      fieldErrors.alternativeDate =
        'Please choose a valid alternative preferred date.';
    } else {
      alternativeDate = alternativeDateRaw;
    }
  }

  const location = cleanText(body.location, 160);
  if (location.length < 2) {
    fieldErrors.location = 'Please enter the session city or location.';
  }

  const additionalMessage =
    cleanMultilineText(body.additionalMessage, 2500) || null;

  if (body.privacyConsent !== true) {
    fieldErrors.privacyConsent =
      'Please confirm your consent so the Garad team may contact you regarding this enquiry.';
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
      organisationName,
      contactPerson,
      email,
      phoneNumber,
      organisationType: orgTypeRaw as LearningOrgType,
      programmeOfInterest: programmeRaw as LearningProgrammeInterest,
      customSessionRequirement,
      expectedParticipants,
      preferredDate,
      alternativeDate,
      location,
      additionalMessage,
      privacyConsent: true,
    },
  };
}

function generateReferenceId(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `GF-LH-${datePart}-${randomPart}`;
}

function computeSubmissionFingerprint(data: ValidatedLearningHubEnquiry): string {
  const payload = [
    data.organisationName.toLowerCase(),
    data.email.toLowerCase(),
    data.programmeOfInterest,
    data.preferredDate || '',
    data.location.toLowerCase(),
  ].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function pruneExpiredFingerprints(now: number) {
  for (const [key, timestamp] of recentSubmissionHashes.entries()) {
    if (now - timestamp > RECENT_SUBMISSION_TTL_MS) {
      recentSubmissionHashes.delete(key);
    }
  }
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: stripHeaderControls(params.from),
        to: [stripHeaderControls(params.to)],
        ...(params.replyTo
          ? { reply_to: stripHeaderControls(params.replyTo) }
          : {}),
        subject: stripHeaderControls(params.subject),
        html: params.html,
        text: params.text,
      }),
      signal: controller.signal,
    });
    return resp.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function buildOrgNotificationEmail(
  referenceId: string,
  submittedAt: string,
  data: ValidatedLearningHubEnquiry
) {
  const subject = `[Garad Learning Hub Enquiry] ${data.organisationName} — ${data.programmeOfInterest} (${referenceId})`;
  const rows: [string, string][] = [
    ['Reference ID', referenceId],
    ['Submitted At', submittedAt],
    ['Organisation / Institution', data.organisationName],
    ['Contact Person', data.contactPerson],
    ['Email Address', data.email],
    ['Phone Number', data.phoneNumber],
    ['Organisation Type', data.organisationType],
    ['Programme of Interest', data.programmeOfInterest],
    [
      'Custom Session Requirement',
      data.customSessionRequirement || 'Not specified',
    ],
    [
      'Expected Participants',
      data.expectedParticipants !== null
        ? String(data.expectedParticipants)
        : 'Not specified',
    ],
    ['Preferred Date', data.preferredDate || 'Flexible / Not specified'],
    [
      'Alternative Preferred Date',
      data.alternativeDate || 'Not specified',
    ],
    ['Location', data.location],
    ['Additional Message', data.additionalMessage || 'Not specified'],
  ];

  const text = [
    'New Garad Learning Hub Session Enquiry',
    ...rows.map(([k, v]) => `${k}: ${v}`),
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 640px;">
      <div style="background: #0D3021; color: #FAF8F4; padding: 18px 22px; border-bottom: 3px solid #C98A2E;">
        <h2 style="margin: 0; font-size: 18px;">Garad Learning Hub — Session Enquiry</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #D7E5DD;">A Garad Foundation Initiative · Learn. Lead. Grow.</p>
      </div>
      <div style="padding: 20px 22px; background: #FAF8F4; border: 1px solid #E5DDD0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding: 6px 10px 6px 0; font-weight: bold; color: #4C5650; width: 38%; vertical-align: top;">${escapeHtml(k)}</td>
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

function buildEnquirerConfirmationEmail(
  referenceId: string,
  data: ValidatedLearningHubEnquiry
) {
  const subject = `We received your Garad Learning Hub enquiry (${referenceId})`;
  const text = [
    `Dear ${data.contactPerson},`,
    '',
    'Thank you for your interest in Garad Learning Hub.',
    `We have received your session enquiry (Reference: ${referenceId}) for ${data.organisationName} regarding ${data.programmeOfInterest}.`,
    '',
    'Please note that this enquiry is not a confirmed booking. Your request will be reviewed by the Garad team, and we will contact you to discuss availability and confirm the session.',
    '',
    'Warm regards,',
    'Garad Learning Hub · A Garad Foundation Initiative',
    'Thane, Maharashtra, India',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 620px;">
      <div style="background: #0D3021; color: #FAF8F4; padding: 18px 22px; border-bottom: 3px solid #C98A2E;">
        <h2 style="margin: 0; font-size: 18px;">Garad Learning Hub</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #D7E5DD;">A Garad Foundation Initiative · Learn. Lead. Grow.</p>
      </div>
      <div style="padding: 22px; background: #FAF8F4; border: 1px solid #E5DDD0; line-height: 1.65; font-size: 14px;">
        <p style="margin-top: 0;">Dear ${escapeHtml(data.contactPerson)},</p>
        <p>Thank you for your interest in <strong>Garad Learning Hub</strong> on behalf of <strong>${escapeHtml(data.organisationName)}</strong>.</p>
        <p>Your session enquiry has been recorded under reference <strong>${escapeHtml(referenceId)}</strong> for <strong>${escapeHtml(data.programmeOfInterest)}</strong>.</p>
        <p><strong>Please note:</strong> An enquiry is not a confirmed booking. Your request will be reviewed by the Garad team, and we will contact you to discuss availability and confirm the session.</p>
        <p style="margin-bottom: 0;">Warm regards,<br/><strong>Garad Learning Hub</strong><br/>A Garad Foundation Initiative · Thane, Maharashtra</p>
      </div>
    </div>
  `;

  return { subject, html, text };
}

export async function submitLearningHubEnquiry(
  rawBody: unknown
): Promise<LearningHubSubmissionResponse> {
  const validated = validateLearningHubEnquiryInput(rawBody);
  if (!validated.ok) {
    const err = new ServiceError(validated.error, 400, 'VALIDATION_ERROR');
    (err as ServiceError & { fieldErrors?: Record<string, string> }).fieldErrors =
      validated.fieldErrors;
    throw err;
  }

  const referenceId = generateReferenceId();
  const submittedAt = new Date().toISOString();

  // Quietly absorb honeypot bots without storing or confirming
  if (validated.isSpamBot) {
    return {
      accepted: false,
      referenceId,
      submittedAt,
      storedInDatabase: false,
      notificationEmailSent: false,
      confirmationEmailSent: false,
      deliveryNote: 'Submission ignored.',
    };
  }

  const data = validated.data;
  const now = Date.now();
  pruneExpiredFingerprints(now);
  const fingerprint = computeSubmissionFingerprint(data);
  if (recentSubmissionHashes.has(fingerprint)) {
    throw new ServiceError(
      'An identical session enquiry was already submitted moments ago. Please wait a couple of minutes before submitting again.',
      409,
      'DUPLICATE_ENQUIRY'
    );
  }

  const supaCreds = getSupabaseCredentials();
  const emailConfig = getLearningHubEmailConfig();

  // Strictly refuse to fake acceptance when neither database nor email backend is configured
  if (!supaCreds.isConfigured && !emailConfig.canSendEmail) {
    throw new ServiceError(
      'Live enquiry delivery is not yet connected in this environment. Configure Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY with migration 004_learning_hub_enquiries.sql) or Resend email (RESEND_API_KEY + LEARNING_HUB_ENQUIRY_TO_EMAIL + LEARNING_HUB_EMAIL_FROM) on the server to accept enquiries.',
      503,
      'BACKEND_NOT_CONFIGURED'
    );
  }

  let storedInDatabase = false;
  let notificationEmailSent = false;
  let confirmationEmailSent = false;

  if (supaCreds.isConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('learning_hub_enquiries').insert({
        reference_id: referenceId,
        organisation_name: data.organisationName,
        contact_person: data.contactPerson,
        email: data.email,
        phone_number: data.phoneNumber,
        organisation_type: data.organisationType,
        programme_of_interest: data.programmeOfInterest,
        custom_session_requirement: data.customSessionRequirement,
        expected_participants: data.expectedParticipants,
        preferred_date: data.preferredDate,
        alternative_date: data.alternativeDate,
        location: data.location,
        additional_message: data.additionalMessage,
        privacy_consent: true,
        source_path: '/learning-hub',
        notification_email_sent: false,
        confirmation_email_sent: false,
        submitted_at: submittedAt,
      });
      if (!error) {
        storedInDatabase = true;
      } else {
        console.error(
          `[learning-hub-api] Database insert failed for ${referenceId}`
        );
      }
    } catch {
      console.error(
        `[learning-hub-api] Database unavailable for ${referenceId}`
      );
    }
  }

  if (emailConfig.canSendEmail) {
    const orgMail = buildOrgNotificationEmail(referenceId, submittedAt, data);
    notificationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: emailConfig.toEmail,
      replyTo: data.email,
      subject: orgMail.subject,
      html: orgMail.html,
      text: orgMail.text,
    });

    const confirmMail = buildEnquirerConfirmationEmail(referenceId, data);
    confirmationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: data.email,
      replyTo: emailConfig.toEmail,
      subject: confirmMail.subject,
      html: confirmMail.html,
      text: confirmMail.text,
    });

    if (storedInDatabase && (notificationEmailSent || confirmationEmailSent)) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from('learning_hub_enquiries')
          .update({
            notification_email_sent: notificationEmailSent,
            confirmation_email_sent: confirmationEmailSent,
          })
          .eq('reference_id', referenceId);
      } catch {
        // Non-fatal flag sync
      }
    }
  }

  // Only accept if at least one real backend channel actually succeeded
  if (!storedInDatabase && !notificationEmailSent) {
    throw new ServiceError(
      'We could not deliver or store your session enquiry right now. Please try again in a moment.',
      503,
      'DELIVERY_UNAVAILABLE'
    );
  }

  recentSubmissionHashes.set(fingerprint, now);

  console.info(
    `[learning-hub-api] Accepted ${referenceId} (db=${storedInDatabase}, notify=${notificationEmailSent}, confirm=${confirmationEmailSent})`
  );

  const deliveryNote =
    notificationEmailSent && confirmationEmailSent
      ? 'Our team has been notified and a copy of your enquiry has been sent to your email address.'
      : storedInDatabase
      ? 'Your enquiry has been securely recorded for review by the Garad team.'
      : 'Your enquiry has been sent to the Garad team for review.';

  return {
    accepted: true,
    referenceId,
    submittedAt,
    storedInDatabase,
    notificationEmailSent,
    confirmationEmailSent,
    deliveryNote,
  };
}
