import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  FileText,
  Handshake,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { ANNUAL_REPORT_2020_21 } from '../data/annualReport2020_21';
import { GARAD_CONTACT_INFO, GARAD_STORY_AND_VISION } from '../data/homepage';
import { usePageSeo } from '../utils/seo';
import { EASE_EDITORIAL, ResilientImage } from './motion/MotionPrimitives';

interface AboutPageProps {
  onNavigateArchive: () => void;
  onNavigateReports: () => void;
  onNavigateVolunteer: () => void;
  onNavigateCsr: () => void;
  onNavigateDonate: () => void;
}

export function AboutPage({
  onNavigateArchive,
  onNavigateReports,
  onNavigateVolunteer,
  onNavigateCsr,
  onNavigateDonate,
}: AboutPageProps) {
  const prefersReduced = useReducedMotion();

  usePageSeo({
    title: 'About Us | Garad Foundation',
    description: GARAD_STORY_AND_VISION.aboutLead,
    type: 'website',
  });

  return (
    <main className="bg-[#FAF8F4] text-[#171C19] pb-20">
      {/* Hero & Story */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#9A3B1E]">
              About Garad Foundation · Thane, Maharashtra
            </p>
            <h1 className="mt-3 font-serif text-[36px] sm:text-[48px] font-bold leading-[1.08] tracking-[-0.02em] text-[#142019] text-balance">
              {GARAD_STORY_AND_VISION.aboutHeading}
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17px] leading-[1.72] text-[#2F3933] max-w-[60ch]">
              {GARAD_STORY_AND_VISION.aboutLead}
            </p>
            {ANNUAL_REPORT_2020_21.about.overviewParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="mt-4 text-[15px] leading-[1.72] text-[#555E58] max-w-[60ch]"
              >
                {para}
              </p>
            ))}
          </motion.div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-[#E3DBCC] bg-[#E8E1D3]">
              <ResilientImage
                src={GARAD_STORY_AND_VISION.aboutImage.src}
                alt={GARAD_STORY_AND_VISION.aboutImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2.5 text-[12px] font-serif italic text-[#636D67]">
              {GARAD_STORY_AND_VISION.aboutImage.caption}
            </p>
          </div>
        </div>
      </section>

      {/* Verified Vision & Mission */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-3xl bg-[#0D3021] text-[#FAF8F4] p-8 sm:p-11">
            <p className="text-[12px] font-semibold tracking-[0.16em] text-[#E8BC66]">
              Our Vision
            </p>
            <blockquote className="mt-4 font-serif text-[24px] sm:text-[30px] italic leading-[1.35] text-[#FAF8F4]">
              &ldquo;{GARAD_STORY_AND_VISION.visionStatement}&rdquo;
            </blockquote>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E5DDD0] p-8 sm:p-11 flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.16em] text-[#9A3B1E]">
                Our Mission
              </p>
              <p className="mt-4 text-[16px] leading-[1.72] text-[#2A342E]">
                {ANNUAL_REPORT_2020_21.about.mission}
              </p>
            </div>
            <div className="mt-7 pt-5 border-t border-[#EEE8DC] flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onNavigateArchive}
                className="min-h-[42px] inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#0D3021] hover:text-[#9A3B1E] cursor-pointer"
              >
                <span>Explore Activities Archive</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateReports}
                className="min-h-[42px] inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#9A3B1E] hover:text-[#7E2D14] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Annual Reports</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Approach */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-[#0D3021]">
          How We Work
        </p>
        <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] font-bold text-[#142019]">
          Core Values &amp; Grassroots Approach
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ANNUAL_REPORT_2020_21.about.coreValues.map((value, idx) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white border border-[#E5DDD0] p-6"
            >
              <p className="font-mono text-[12px] text-[#9A3B1E] tabular-nums">
                0{idx + 1}
              </p>
              <h3 className="mt-2 font-serif text-[20px] font-bold text-[#142019]">
                {value.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.65] text-[#555E58]">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {ANNUAL_REPORT_2020_21.about.approachPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl bg-[#EEF4F0]/80 border border-[#D8E5DC] p-6"
            >
              <h3 className="font-serif text-[20px] font-bold text-[#0D3021]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#45524B]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Pathways */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#E5DDD0] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#9A3B1E]">
              Connect With Garad Foundation
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#142019]">
              Reach Our Team in Thane
            </h2>
            <p className="flex items-start gap-2.5 text-[14.5px] text-[#4A544E]">
              <MapPin className="w-4 h-4 text-[#9A3B1E] shrink-0 mt-1" />
              <span>{GARAD_CONTACT_INFO.address}</span>
            </p>
            <div className="flex flex-wrap gap-5 pt-1 text-[14.5px] font-medium">
              <a
                href={`mailto:${GARAD_CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 text-[#0D3021] hover:text-[#9A3B1E]"
              >
                <Mail className="w-4 h-4" />
                <span>{GARAD_CONTACT_INFO.email}</span>
              </a>
              <a
                href={GARAD_CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 text-[#0D3021] hover:text-[#9A3B1E]"
              >
                <Phone className="w-4 h-4" />
                <span>{GARAD_CONTACT_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={onNavigateVolunteer}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174C38] hover:bg-[#103A2B] text-white text-[13.5px] font-semibold cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Volunteer</span>
            </button>
            <button
              type="button"
              onClick={onNavigateCsr}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D3021] hover:bg-[#16402E] text-white text-[13.5px] font-semibold cursor-pointer"
            >
              <Handshake className="w-4 h-4" />
              <span>Partner With Us</span>
            </button>
            <button
              type="button"
              onClick={onNavigateDonate}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9A3B1E] hover:bg-[#822F16] text-white text-[13.5px] font-semibold cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donate</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
