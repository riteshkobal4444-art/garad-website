import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import {
  ActivityCategory,
  ActivityMedia,
  FiscalYearId,
  getActivityBySlug,
} from './data/activities';
import { getCsrProjectBySlug } from './data/csrHub';
import {
  EnquiryOrganisationType,
  getLearningProgrammeBySlug,
} from './data/learningHub';
import {
  AppRoute,
  getActivityPath,
  getCsrPartnershipsPath,
  getCsrProjectPath,
  getDonatePath,
  getDonationSuccessPath,
  getInTheNewsPath,
  getLearningHubPath,
  getLearningProgrammePath,
  getReportsPath,
  getVolunteerPath,
  parseCurrentRoute,
  pushRoute,
} from './utils/router';
import { VerifiedReceipt } from './utils/razorpayCheckout';
import { Navbar, NavSectionKey } from './components/Navbar';
import { InitiativesPage } from './components/InitiativesPage';
import { LearningHubPage } from './components/LearningHubPage';
import { ProgrammeDetailView } from './components/learningHub/ProgrammeDetailView';
import { InTheNewsPage } from './components/InTheNewsPage';
import { ActivityDetailPage } from './components/ActivityDetailPage';
import { ReportsPage } from './components/ReportsPage';
import { CsrPartnershipsPage } from './components/CsrPartnershipsPage';
import { CsrProjectDetailPage } from './components/CsrProjectDetailPage';
import {
  CsrAreaOption,
  CsrPreferredProjectOption,
} from './components/CsrEnquiryForm';
import { DonatePage } from './components/DonatePage';
import { DonationSuccessPage } from './components/DonationSuccessPage';
import { VolunteerPage } from './components/VolunteerPage';
import { SiteFooter } from './components/SiteFooter';
import { AccountingExportModal } from './components/AccountingExportModal';
import {
  EditorialDialogType,
  EditorialModal,
  LightboxModal,
} from './components/InfoModals';
import {
  EASE_EDITORIAL,
  ScrollProgressBar,
} from './components/motion/MotionPrimitives';

function getNavKeyForRoute(r: AppRoute): NavSectionKey | null {
  if (r.view === 'donate' || r.view === 'donation-success') return null;
  if (r.view === 'learning-hub' || r.view === 'learning-hub-programme') {
    return 'learning-hub';
  }
  if (r.view === 'in-the-news') return 'in-the-news';
  if (
    r.view === 'reports' ||
    r.view === 'csr' ||
    r.view === 'csr-project' ||
    r.view === 'volunteer'
  ) {
    return 'about';
  }
  return 'initiatives';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseCurrentRoute());
  const [activeNav, setActiveNav] = useState<NavSectionKey | null>(() =>
    getNavKeyForRoute(parseCurrentRoute())
  );

  // Archive Filter State (defaults to All documented activities across populated editions)
  const [selectedYear, setSelectedYear] = useState<FiscalYearId>('all');
  const [selectedCategory, setSelectedCategory] =
    useState<ActivityCategory>('All');

  // Optional prefill state when navigating from a CSR project profile directly to the enquiry form
  const [csrEnquiryPrefill, setCsrEnquiryPrefill] = useState<{
    project?: CsrPreferredProjectOption;
    area?: CsrAreaOption;
    scrollToEnquiry?: boolean;
  } | null>(null);

  // Optional prefill state when navigating from a Learning Hub programme detail back to the enquiry form
  const [learningHubPrefill, setLearningHubPrefill] = useState<{
    programmeOfInterest?: string;
    organisationType?: EnquiryOrganisationType;
    customSessionRequirement?: string;
    scrollToEnquiry?: boolean;
  } | null>(null);

  // Transient in-memory receipt cache for smooth post-checkout transition
  const [lastVerifiedReceipt, setLastVerifiedReceipt] = useState<{
    reference: string;
    receipt: VerifiedReceipt;
  } | null>(null);

  // Modals & Lightbox state
  const [dialog, setDialog] = useState<EditorialDialogType>(null);
  const [accountingExportOpen, setAccountingExportOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{
    mediaItems: ActivityMedia[];
    index: number | null;
  }>({ mediaItems: [], index: null });

  // Listen to browser Back/Forward (popstate) and hashchange
  useEffect(() => {
    const syncRoute = () => {
      const next = parseCurrentRoute();
      setRoute(next);
      setActiveNav(getNavKeyForRoute(next));
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateToArchive = () => {
    pushRoute('/activities');
    setRoute({ view: 'archive' });
    setActiveNav('initiatives');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToActivity = (slug: string) => {
    pushRoute(getActivityPath(slug));
    setRoute({ view: 'activity', slug });
    setActiveNav('initiatives');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLearningHub = (prefill?: {
    programmeOfInterest?: string;
    organisationType?: EnquiryOrganisationType;
    customSessionRequirement?: string;
    scrollToEnquiry?: boolean;
  }) => {
    setLearningHubPrefill(prefill ? { ...prefill } : null);
    pushRoute(getLearningHubPath());
    setRoute({ view: 'learning-hub' });
    setActiveNav('learning-hub');
    if (!prefill?.scrollToEnquiry) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToLearningProgramme = (slug: string) => {
    pushRoute(getLearningProgrammePath(slug));
    setRoute({ view: 'learning-hub-programme', slug });
    setActiveNav('learning-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToInTheNews = () => {
    pushRoute(getInTheNewsPath());
    setRoute({ view: 'in-the-news' });
    setActiveNav('in-the-news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToReports = () => {
    pushRoute(getReportsPath());
    setRoute({ view: 'reports' });
    setActiveNav('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCsr = (prefill?: {
    project?: CsrPreferredProjectOption;
    area?: CsrAreaOption;
    scrollToEnquiry?: boolean;
  }) => {
    setCsrEnquiryPrefill(prefill ? { ...prefill } : null);
    pushRoute(getCsrPartnershipsPath());
    setRoute({ view: 'csr' });
    setActiveNav('about');
    if (!prefill?.scrollToEnquiry) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCsrProject = (slug: string) => {
    pushRoute(getCsrProjectPath(slug));
    setRoute({ view: 'csr-project', slug });
    setActiveNav('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVolunteer = () => {
    pushRoute(getVolunteerPath());
    setRoute({ view: 'volunteer' });
    setActiveNav('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDonate = () => {
    pushRoute(getDonatePath());
    setRoute({ view: 'donate' });
    setActiveNav(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDonationSuccess = ({
    reference,
    token,
    receipt,
  }: {
    reference: string;
    token: string;
    receipt: VerifiedReceipt;
  }) => {
    setLastVerifiedReceipt({ reference, receipt });
    pushRoute(getDonationSuccessPath(reference, token));
    setRoute({ view: 'donation-success', reference, token });
    setActiveNav(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNav = (key: NavSectionKey) => {
    if (key === 'initiatives') {
      navigateToArchive();
      return;
    }
    if (key === 'learning-hub') {
      navigateToLearningHub();
      return;
    }
    if (key === 'in-the-news') {
      navigateToInTheNews();
      return;
    }
    setActiveNav(key);
    setDialog({ kind: 'section', section: key });
  };

  const currentActivity =
    route.view === 'activity' ? getActivityBySlug(route.slug) : undefined;
  const currentCsrProject =
    route.view === 'csr-project' ? getCsrProjectBySlug(route.slug) : undefined;
  const currentLearningProgramme =
    route.view === 'learning-hub-programme'
      ? getLearningProgrammeBySlug(route.slug)
      : undefined;

  const isDonateFlow =
    route.view === 'donate' || route.view === 'donation-success';
  const isCsrFlow = route.view === 'csr' || route.view === 'csr-project';
  const isLearningHubFlow =
    route.view === 'learning-hub' || route.view === 'learning-hub-programme';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-editorial-canvas text-[#171C19] flex flex-col">
        <Navbar
          activeNav={activeNav}
          isDonateRoute={isDonateFlow}
          isLearningHubRoute={isLearningHubFlow}
          isNewsRoute={route.view === 'in-the-news'}
          isReportsRoute={route.view === 'reports'}
          isCsrRoute={isCsrFlow}
          isVolunteerRoute={route.view === 'volunteer'}
          onNavigateHome={navigateToArchive}
          onNavigateLearningHub={() => navigateToLearningHub()}
          onNavigateNews={navigateToInTheNews}
          onSelectNav={handleSelectNav}
          onNavigateReports={navigateToReports}
          onNavigateCsr={() => navigateToCsr()}
          onNavigateVolunteer={navigateToVolunteer}
          onNavigateDonate={navigateToDonate}
          onOpenPortal={() =>
            setDialog({ kind: 'section', section: 'portal' })
          }
        />

        <ScrollProgressBar />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {route.view === 'archive' ? (
              <motion.div
                key="route-archive"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
              >
                <InitiativesPage
                  selectedYear={selectedYear}
                  selectedCategory={selectedCategory}
                  onSelectYear={setSelectedYear}
                  onSelectCategory={setSelectedCategory}
                  onNavigateActivity={navigateToActivity}
                />
              </motion.div>
            ) : route.view === 'learning-hub' ? (
              <motion.div
                key="route-learning-hub"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <LearningHubPage
                  initialEnquiryPrefill={learningHubPrefill}
                  onNavigateProgramme={navigateToLearningProgramme}
                  onNavigateArchive={navigateToArchive}
                />
              </motion.div>
            ) : route.view === 'learning-hub-programme' &&
              currentLearningProgramme ? (
              <motion.div
                key={`route-learning-programme-${currentLearningProgramme.slug}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <ProgrammeDetailView
                  programme={currentLearningProgramme}
                  onBackToHub={() => navigateToLearningHub()}
                  onEnquireProgramme={(programmeOption) =>
                    navigateToLearningHub({
                      programmeOfInterest: programmeOption,
                      scrollToEnquiry: true,
                    })
                  }
                />
              </motion.div>
            ) : route.view === 'in-the-news' ? (
              <motion.div
                key="route-in-the-news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <InTheNewsPage
                  onNavigateArchive={navigateToArchive}
                  onNavigateActivity={navigateToActivity}
                  onNavigateReports={navigateToReports}
                />
              </motion.div>
            ) : route.view === 'reports' ? (
              <motion.div
                key="route-reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <ReportsPage
                  onNavigateArchive={navigateToArchive}
                  onNavigateActivity={navigateToActivity}
                  onNavigateDonate={navigateToDonate}
                />
              </motion.div>
            ) : route.view === 'csr' ? (
              <motion.div
                key="route-csr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <CsrPartnershipsPage
                  initialPrefill={csrEnquiryPrefill}
                  onNavigateCsrProject={navigateToCsrProject}
                  onNavigateArchive={navigateToArchive}
                  onNavigateActivity={navigateToActivity}
                  onNavigateReports={navigateToReports}
                  onOpenAbout={() =>
                    setDialog({ kind: 'section', section: 'about' })
                  }
                />
              </motion.div>
            ) : route.view === 'csr-project' && currentCsrProject ? (
              <motion.div
                key={`route-csr-project-${currentCsrProject.slug}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <CsrProjectDetailPage
                  project={currentCsrProject}
                  onNavigateCsrHub={navigateToCsr}
                  onNavigateCsrProject={navigateToCsrProject}
                  onNavigateActivity={navigateToActivity}
                  onNavigateReports={navigateToReports}
                />
              </motion.div>
            ) : route.view === 'volunteer' ? (
              <motion.div
                key="route-volunteer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <VolunteerPage />
              </motion.div>
            ) : route.view === 'donate' ? (
              <motion.div
                key="route-donate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <DonatePage
                  onNavigateArchive={navigateToArchive}
                  onDonationVerified={navigateToDonationSuccess}
                  onOpenAccountingExport={() => setAccountingExportOpen(true)}
                />
              </motion.div>
            ) : route.view === 'donation-success' ? (
              <motion.div
                key={`route-donation-success-${route.reference}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <DonationSuccessPage
                  reference={route.reference}
                  token={route.token}
                  initialReceipt={
                    lastVerifiedReceipt?.reference === route.reference
                      ? lastVerifiedReceipt.receipt
                      : null
                  }
                  onNavigateDonate={navigateToDonate}
                  onNavigateArchive={navigateToArchive}
                />
              </motion.div>
            ) : currentActivity ? (
              <motion.div
                key={`route-activity-${currentActivity.slug}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
              >
                <ActivityDetailPage
                  activity={currentActivity}
                  onNavigateArchive={navigateToArchive}
                  onNavigateActivity={navigateToActivity}
                  onNavigateReports={navigateToReports}
                  onOpenLightbox={(mediaItems, index) =>
                    setLightboxState({ mediaItems, index })
                  }
                  onNavigateDonate={navigateToDonate}
                />
              </motion.div>
            ) : (
              <motion.main
                key="route-not-found"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
                className="max-w-2xl mx-auto px-6 py-24 text-center"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A3B1E]">
                  Garad Foundation · Record Not Found
                </p>
                <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#171C19]">
                  We couldn&apos;t locate that page
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-[#555E58]">
                  The requested URL does not match a published activity or CSR
                  project profile.
                </p>
                <button
                  type="button"
                  onClick={navigateToArchive}
                  className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D3021] hover:bg-[#16402E] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to All Activities</span>
                </button>
              </motion.main>
            )}
          </AnimatePresence>
        </div>

        <SiteFooter
          onNavigateArchive={navigateToArchive}
          onNavigateLearningHub={() => navigateToLearningHub()}
          onNavigateNews={navigateToInTheNews}
          onNavigateVolunteer={navigateToVolunteer}
          onNavigateCsr={() => navigateToCsr()}
          onNavigateReports={navigateToReports}
          onNavigateDonate={navigateToDonate}
        />

        {/* Modals & Lightbox */}
        <EditorialModal
          dialog={dialog}
          onClose={() => {
            setDialog(null);
            setActiveNav(getNavKeyForRoute(route));
          }}
          onNavigateActivity={navigateToActivity}
          onNavigateReports={navigateToReports}
          onNavigateCsr={() => navigateToCsr()}
          onNavigateVolunteer={navigateToVolunteer}
          onNavigateDonate={navigateToDonate}
        />

        <AccountingExportModal
          open={accountingExportOpen}
          onClose={() => setAccountingExportOpen(false)}
        />

        <LightboxModal
          mediaItems={lightboxState.mediaItems}
          activeIndex={lightboxState.index}
          onClose={() =>
            setLightboxState((prev) => ({ ...prev, index: null }))
          }
          onChangeIndex={(nextIndex) =>
            setLightboxState((prev) => ({ ...prev, index: nextIndex }))
          }
        />
      </div>
    </MotionConfig>
  );
}
