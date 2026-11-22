import crypto from 'node:crypto';
import { getSupabaseCredentials } from '../donations/config';
import { getSupabaseAdmin } from '../donations/supabaseClient';
import { ServiceError } from '../donations/service';

export const ALLOWED_AREAS_OF_INTEREST = [
  'Education',
  'Financial Literacy',
  'Rural and Tribal Development',
  'Youth Development',
  'Community Development',
  'Other',
] as const;

export const ALLOWED_PREFERRED_PROJECTS = [
  'Sabse Bada Rupaiya',
  'Mission Bharari',
  'Garad Granthalay',
  'Project Urja',
  'Open to Discussion',
] as const;

export type AreaOfInterest = (typeof ALLOWED_AREAS_OF_INTEREST)[number];
export type PreferredProjectOption = (typeof ALLOWED_PREFERRED_PROJECTS)[number];

export interface ValidatedCsrEnquiry {
  organisationName: string;
  contactPerson: string;
  designation: string;
  officialEmail: string;
  phoneNumber: string;
  areaOfInterest: AreaOfInterest;
  message: string;
  proposedFundingRange: string | null;
  preferredProject: PreferredProjectOption | null;
  preferredGeography: string | null;
  privacyConsent: true;
}

export interface CsrEnquirySubmissionResponse {
  referenceId: string;
  submittedAt: string;
  storedInDatabase: boolean;
  notificationEmailSent: boolean;
  confirmationEmailSent: boolean;
  emailDeliveryNote: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,22}$/;

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

export function validateCsrEnquiryInput(raw: unknown): {
  ok: true;
  data: ValidatedCsrEnquiry;
  isSpamBot: boolean;
} | {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
} {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid enquiry payload.' };
  }

  const body = raw as Record<string, unknown>;

  // Honeypot spam trap: real visitors never fill the hidden `website` field.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot.length > 0) {
    return {
      ok: true,
      isSpamBot: true,
      data: {
        organisationName: 'Spam Filtered',
        contactPerson: 'Spam Filtered',
        designation: 'Spam Filtered',
        officialEmail: 'filtered@example.invalid',
        phoneNumber: '0000000000',
        areaOfInterest: 'Other',
        message: 'Filtered',
        proposedFundingRange: null,
        preferredProject: null,
        preferredGeography: null,
        privacyConsent: true,
      },
    };
  }

  // Minimum form dwell time (1.5s) to reduce automated bot submissions
  if (typeof body.formLoadedAt === 'number' && Number.isFinite(body.formLoadedAt)) {
    const elapsedMs = Date.now() - body.formLoadedAt;
    if (elapsedMs >= 0 && elapsedMs < 1500) {
      return {
        ok: false,
        error: 'Please take a moment to review your enquiry details before submitting.',
      };
    }
  }

  const fieldErrors: Record<string, string> = {};

  const organisationName = cleanText(body.organisationName, 160);
  if (organisationName.length < 2) {
    fieldErrors.organisationName =
      'Please enter your organisation or company name.';
  }

  const contactPerson = cleanText(body.contactPerson, 120);
  if (contactPerson.length < 2) {
    fieldErrors.contactPerson = 'Please enter the contact person’s full name.';
  }

  const designation = cleanText(body.designation, 120);
  if (designation.length < 2) {
    fieldErrors.designation = 'Please enter your role or designation.';
  }

  const officialEmail = cleanText(body.officialEmail, 160).toLowerCase();
  if (!EMAIL_REGEX.test(officialEmail)) {
    fieldErrors.officialEmail = 'Please enter a valid official email address.';
  }

  const phoneNumber = cleanText(body.phoneNumber, 28);
  const digitCount = phoneNumber.replace(/\D/g, '').length;
  if (!PHONE_ALLOWED_REGEX.test(phoneNumber) || digitCount < 8 || digitCount > 15) {
    fieldErrors.phoneNumber =
      'Please enter a valid telephone or mobile number (8–15 digits).';
  }

  const rawArea = cleanText(body.areaOfInterest, 60);
  if (!ALLOWED_AREAS_OF_INTEREST.includes(rawArea as AreaOfInterest)) {
    fieldErrors.areaOfInterest = 'Please select a valid Area of Interest.';
  }

  const message = cleanMultilineText(body.message, 3000);
  if (message.length < 15) {
    fieldErrors.message =
      'Please share brief details about your CSR priorities or partnership enquiry (at least 15 characters).';
  }

  if (body.privacyConsent !== true) {
    fieldErrors.privacyConsent =
      'Please confirm privacy consent so Garad Foundation may respond to your enquiry.';
  }

  const rawProject = cleanText(body.preferredProject, 60);
  let preferredProject: PreferredProjectOption | null = null;
  if (rawProject.length > 0) {
    if (!ALLOWED_PREFERRED_PROJECTS.includes(rawProject as PreferredProjectOption)) {
      fieldErrors.preferredProject = 'Please select a valid Preferred Project option.';
    } else {
      preferredProject = rawProject as PreferredProjectOption;
    }
  }

  const proposedFundingRange = cleanText(body.proposedFundingRange, 100) || null;
  const preferredGeography = cleanText(body.preferredGeography, 160) || null;

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
      designation,
      officialEmail,
      phoneNumber,
      areaOfInterest: rawArea as AreaOfInterest,
      message,
      proposedFundingRange,
      preferredProject,
      preferredGeography,
      privacyConsent: true,
    },
  };
}

function generateEnquiryReference(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `GF-CSR-${datePart}-${randomPart}`;
}

function getEmailDispatchConfig() {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const toEmail = (
    process.env.CSR_ENQUIRY_TO_EMAIL ||
    process.env.ORG_CONTACT_EMAIL ||
    ''
  ).trim();
  const fromEmail = (process.env.CSR_EMAIL_FROM || '').trim();

  return {
    resendApiKey,
    toEmail,
    fromEmail,
    canSendEmail: Boolean(
      resendApiKey &&
        EMAIL_REGEX.test(toEmail) &&
        fromEmail.length > 3
    ),
  };
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
        from: params.from,
        to: [params.to],
        reply_to: params.replyTo,
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
  data: ValidatedCsrEnquiry
) {
  const subject = `[CSR Partnership Enquiry] ${data.organisationName} (${referenceId})`;
  const textLines = [
    'New Corporate CSR Partnership Enquiry — Garad Foundation',
    `Reference ID: ${referenceId}`,
    `Submitted At: ${submittedAt}`,
    '',
    `Organisation / Company: ${data.organisationName}`,
    `Contact Person: ${data.contactPerson}`,
    `Designation: ${data.designation}`,
    `Official Email: ${data.officialEmail}`,
    `Phone Number: ${data.phoneNumber}`,
    `Area of Interest: ${data.areaOfInterest}`,
    `Preferred Project: ${data.preferredProject || 'Not specified'}`,
    `Proposed Funding Range: ${data.proposedFundingRange || 'Not specified'}`,
    `Preferred Geography: ${data.preferredGeography || 'Not specified'}`,
    '',
    'Message:',
    data.message,
  ];

  const rows: [string, string][] = [
    ['Reference ID', referenceId],
    ['Submitted At', submittedAt],
    ['Organisation / Company', data.organisationName],
    ['Contact Person', data.contactPerson],
    ['Designation', data.designation],
    ['Official Email', data.officialEmail],
    ['Phone Number', data.phoneNumber],
    ['Area of Interest', data.areaOfInterest],
    ['Preferred Project', data.preferredProject || 'Not specified'],
    ['Proposed Funding Range', data.proposedFundingRange || 'Not specified'],
    ['Preferred Geography', data.preferredGeography || 'Not specified'],
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 640px;">
      <div style="background: #082417; color: #FAF8F4; padding: 18px 22px; border-bottom: 3px solid #9A3B1E;">
        <h2 style="margin: 0; font-size: 18px;">Garad Foundation — New CSR Partnership Enquiry</h2>
      </div>
      <div style="padding: 20px 22px; background: #FAF8F4; border: 1px solid #E5DDD0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding: 6px 10px 6px 0; font-weight: bold; color: #555E58; width: 38%; vertical-align: top;">${escapeHtml(k)}</td>
              <td style="padding: 6px 0; color: #171C19;">${escapeHtml(v)}</td>
            </tr>`
            )
            .join('')}
        </table>
        <hr style="border: 0; border-top: 1px solid #E5DDD0; margin: 16px 0;" />
        <p style="margin: 0 0 6px; font-weight: bold; color: #555E58; font-size: 13px;">Message</p>
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${escapeHtml(data.message)}</p>
      </div>
    </div>
  `;

  return { subject, html, text: textLines.join('\n') };
}

function buildEnquirerConfirmationEmail(
  referenceId: string,
  data: ValidatedCsrEnquiry
) {
  const subject = `Thank you for your CSR Partnership Enquiry — Garad Foundation (${referenceId})`;
  const text = [
    `Dear ${data.contactPerson},`,
    '',
    `Thank you for contacting Garad Foundation on behalf of ${data.organisationName}.`,
    `We have received your partnership enquiry (Reference: ${referenceId}) regarding ${data.areaOfInterest}${data.preferredProject ? ` — ${data.preferredProject}` : ''}.`,
    '',
    'Our team in Thane, Maharashtra will review your enquiry and get in touch to discuss potential collaboration, programme documentation, and due-diligence requirements.',
    '',
    'Warm regards,',
    'Garad Foundation',
    'Thane, Maharashtra, India',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171C19; max-width: 620px;">
      <div style="background: #082417; color: #FAF8F4; padding: 18px 22px; border-bottom: 3px solid #9A3B1E;">
        <h2 style="margin: 0; font-size: 18px;">Garad Foundation</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #CBE0D5;">CSR Partnerships &amp; Institutional Relations · Thane, Maharashtra</p>
      </div>
      <div style="padding: 22px; background: #FAF8F4; border: 1px solid #E5DDD0; line-height: 1.65; font-size: 14px;">
        <p style="margin-top: 0;">Dear ${escapeHtml(data.contactPerson)},</p>
        <p>Thank you for reaching out to Garad Foundation on behalf of <strong>${escapeHtml(data.organisationName)}</strong>.</p>
        <p>We have recorded your CSR partnership enquiry with reference number <strong>${escapeHtml(referenceId)}</strong>${data.preferredProject ? ` for <strong>${escapeHtml(data.preferredProject)}</strong>` : ''} (${escapeHtml(data.areaOfInterest)}).</p>
        <p>Our team will review your requirements and respond to schedule a discussion and share relevant institutional documentation.</p>
        <p style="margin-bottom: 0;">Warm regards,<br/><strong>Garad Foundation</strong><br/>Thane, Maharashtra, India</p>
      </div>
    </div>
  `;

  return { subject, html, text };
}

export async function submitCsrPartnershipEnquiry(
  rawBody: unknown
): Promise<CsrEnquirySubmissionResponse> {
  const validated = validateCsrEnquiryInput(rawBody);
  if (!validated.ok) {
    const err = new ServiceError(validated.error, 400, 'VALIDATION_ERROR');
    (err as ServiceError & { fieldErrors?: Record<string, string> }).fieldErrors =
      validated.fieldErrors;
    throw err;
  }

  const referenceId = generateEnquiryReference();
  const submittedAt = new Date().toISOString();

  // Quietly absorb obvious honeypot bot submissions without storing or emailing
  if (validated.isSpamBot) {
    return {
      referenceId,
      submittedAt,
      storedInDatabase: false,
      notificationEmailSent: false,
      confirmationEmailSent: false,
      emailDeliveryNote: 'Enquiry received.',
    };
  }

  const data = validated.data;
  const emailConfig = getEmailDispatchConfig();
  let notificationEmailSent = false;
  let confirmationEmailSent = false;

  if (emailConfig.canSendEmail) {
    const orgMail = buildOrgNotificationEmail(referenceId, submittedAt, data);
    notificationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: emailConfig.toEmail,
      replyTo: data.officialEmail,
      subject: orgMail.subject,
      html: orgMail.html,
      text: orgMail.text,
    });

    const confirmMail = buildEnquirerConfirmationEmail(referenceId, data);
    confirmationEmailSent = await sendResendEmail({
      apiKey: emailConfig.resendApiKey,
      from: emailConfig.fromEmail,
      to: data.officialEmail,
      replyTo: emailConfig.toEmail,
      subject: confirmMail.subject,
      html: confirmMail.html,
      text: confirmMail.text,
    });
  }

  let storedInDatabase = false;
  const supaCreds = getSupabaseCredentials();
  if (supaCreds.isConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('csr_enquiries').insert({
        reference_id: referenceId,
        organisation_name: data.organisationName,
        contact_person: data.contactPerson,
        designation: data.designation,
        official_email: data.officialEmail,
        phone_number: data.phoneNumber,
        area_of_interest: data.areaOfInterest,
        preferred_project: data.preferredProject,
        proposed_funding_range: data.proposedFundingRange,
        preferred_geography: data.preferredGeography,
        message: data.message,
        privacy_consent: true,
        source_path: '/csr-partnerships',
        notification_email_sent: notificationEmailSent,
        confirmation_email_sent: confirmationEmailSent,
        submitted_at: submittedAt,
      });
      if (!error) {
        storedInDatabase = true;
      } else {
        console.error(`[csr-enquiries] Database insert failed for ${referenceId}`);
      }
    } catch {
      console.error(`[csr-enquiries] Database unavailable for ${referenceId}`);
    }
  }

  // Log only non-PII telemetry reference
  console.info(
    `[csr-enquiries] Recorded ${referenceId} (db=${storedInDatabase}, notify=${notificationEmailSent}, confirm=${confirmationEmailSent})`
  );

  let emailDeliveryNote =
    'Your enquiry has been logged with a unique reference ID. Configure CSR_ENQUIRY_TO_EMAIL, CSR_EMAIL_FROM, and RESEND_API_KEY in server environment variables to activate automated email notifications.';
  if (notificationEmailSent && confirmationEmailSent) {
    emailDeliveryNote =
      'Our partnerships desk has been notified and a confirmation copy has been sent to your official email address.';
  } else if (notificationEmailSent) {
    emailDeliveryNote =
      'Our partnerships desk has been notified of your enquiry and will respond directly.';
  }

  return {
    referenceId,
    submittedAt,
    storedInDatabase,
    notificationEmailSent,
    confirmationEmailSent,
    emailDeliveryNote,
  };
}
