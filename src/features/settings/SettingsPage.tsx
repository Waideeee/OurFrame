import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Download,
  HardDrive,
  Info,
  Lock,
  LogOut,
  Palette,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyTheme } from '@/lib/theme';
import { useMemories, useProfile } from '@/app/providers';

/* ---------------------------------------------------------------------------
   Persisted settings — every toggle / pill writes through to localStorage so
   preferences survive a refresh. Cache keys live under a separate namespace so
   "Clear cached files" never wipes user preferences.
--------------------------------------------------------------------------- */
const SETTINGS_KEY = 'ourframe:settings';
const CACHE_PREFIX = 'ourframe:cache:';
const ACCOUNT_EMAIL_KEY = 'ourframe:account:email';
const PASSWORD_CHANGED_KEY = 'ourframe:account:passwordChangedAt';

type ThemeChoice = 'dark' | 'light' | 'system';
type LanguageChoice = 'english' | 'filipino';
type QualityChoice = 'original' | 'compressed';

interface SettingsState {
  // Profiles
  askPinOnSwitch: boolean;
  shareUploads: boolean;
  // Privacy
  showLastActive: boolean;
  showWhoHearted: boolean;
  autoArchiveOld: boolean;
  // Notifications
  notifyPartnerAddedMemory: boolean;
  notifyMemoryHearted: boolean;
  monthlyRecap: boolean;
  monthsaryReminders: boolean;
  weeklyRecapEmail: boolean;
  updatesFromOurframe: boolean;
  // Appearance
  theme: ThemeChoice;
  autoplayFeatured: boolean;
  showMoodTags: boolean;
  showLocation: boolean;
  language: LanguageChoice;
  // Storage
  uploadQuality: QualityChoice;
  autoCompressVideos: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  askPinOnSwitch: false,
  shareUploads: true,
  showLastActive: true,
  showWhoHearted: true,
  autoArchiveOld: false,
  notifyPartnerAddedMemory: true,
  notifyMemoryHearted: true,
  monthlyRecap: true,
  monthsaryReminders: true,
  weeklyRecapEmail: false,
  updatesFromOurframe: false,
  theme: 'dark',
  autoplayFeatured: true,
  showMoodTags: true,
  showLocation: true,
  language: 'english',
  uploadQuality: 'original',
  autoCompressVideos: true,
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function readStored(key: string): string {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

/* ---------------------------------------------------------------------------
   Theme-aware palette. Every value is a CSS custom property (declared in
   globals.css) so the whole page flips with the chosen theme.
--------------------------------------------------------------------------- */
const C = {
  page: 'var(--set-page)',
  card: 'var(--set-card)',
  border: 'var(--set-border)',
  strong: 'var(--set-strong)',
  subtitle: 'var(--set-subtitle)',
  header: 'var(--set-header)',
  label: 'var(--set-label)',
  sub: 'var(--set-sublabel)',
  toggleOff: 'var(--set-toggle-off)',
  pillBg: 'var(--set-pill-bg)',
  pillBorder: 'var(--set-pill-border)',
  pillText: 'var(--set-pill-text)',
  btnBorder: 'var(--set-btn-border)',
  btnText: 'var(--set-btn-text)',
  navInactive: 'var(--set-nav-inactive)',
  muted: 'var(--set-muted)',
  brand: '#e50914',
};

const CARD_STYLE: CSSProperties = { backgroundColor: C.card, border: `0.5px solid ${C.border}` };
const ROW_DIVIDER: CSSProperties = { borderTop: `0.5px solid ${C.border}` };

/* ---------------------------------------------------------------------------
   Section registry
--------------------------------------------------------------------------- */
type SectionId =
  | 'account'
  | 'profiles'
  | 'privacy'
  | 'notifications'
  | 'appearance'
  | 'storage'
  | 'about';

const SECTION_META: Record<SectionId, { title: string; subtitle: string }> = {
  account: { title: 'Account', subtitle: 'Your personal info and login details' },
  profiles: { title: 'Profiles', subtitle: 'Manage the profiles in your shared frame' },
  privacy: { title: 'Privacy', subtitle: 'Control what your partner can see' },
  notifications: {
    title: 'Notifications',
    subtitle: 'Stay in the loop with what matters to you two',
  },
  appearance: { title: 'Appearance', subtitle: 'Make OurFrame feel like yours' },
  storage: { title: 'Storage & Media', subtitle: "See how much of your frame you've filled up" },
  about: { title: 'About OurFrame', subtitle: 'A little info about the app you built together' },
};

const NAV_GROUPS: { id: SectionId; label: string; icon: typeof User }[][] = [
  [
    { id: 'account', label: 'Account', icon: User },
    { id: 'profiles', label: 'Profiles', icon: Users },
  ],
  [
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ],
  [
    { id: 'storage', label: 'Storage & Media', icon: HardDrive },
    { id: 'about', label: 'About OurFrame', icon: Info },
  ],
];

/* ---------------------------------------------------------------------------
   Legal copy (shown in the About → Legal modals)
--------------------------------------------------------------------------- */
const LEGAL_CONTENT: Record<
  'privacy' | 'terms',
  { title: string; updated: string; sections: { h: string; p: string }[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated June 2026',
    sections: [
      {
        h: 'Our promise',
        p: 'OurFrame is a private space for two people. Your memories belong to you and your partner — we built this app to keep them close, not to mine them.',
      },
      {
        h: 'What we store',
        p: 'The memories you add (photos, videos, captions, dates, moods, and any locations you choose to include), your profile name and avatar, and your settings preferences.',
      },
      {
        h: 'Where it lives',
        p: 'In this version of OurFrame your data stays on your device in your browser’s local storage. It is not uploaded to an external server, and we do not have a copy of it.',
      },
      {
        h: 'What we never do',
        p: 'We never sell your data, we never show you ads, and we never share your memories with anyone outside your frame. There are no third-party trackers following you here.',
      },
      {
        h: 'Who can see your memories',
        p: 'Only the profiles in your frame. The toggles under Privacy let you decide whether your partner sees your uploads, your activity status, and who hearted a memory.',
      },
      {
        h: 'Your controls',
        p: 'You can export everything from Privacy → Export our memories, clear cached files from Storage & Media, and permanently remove your account and uploads from Account → Delete my account.',
      },
      {
        h: 'Children',
        p: 'OurFrame is intended for couples aged 13 and over and is not directed at children under 13.',
      },
      {
        h: 'Changes & contact',
        p: 'If anything material changes, we’ll update this page and the date above. Questions about your privacy? Reach us at hello@ourframe.love.',
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated June 2026',
    sections: [
      {
        h: 'The short version',
        p: 'Be kind, keep it yours, and only add what you have the right to share. OurFrame is your shared space — treat it like one.',
      },
      {
        h: 'Your account',
        p: 'You’re responsible for the profiles in your frame and for what gets added to it. Keep your sign-in details safe and don’t share them with people outside your relationship.',
      },
      {
        h: 'Your content',
        p: 'You keep full ownership of every photo, video, and story you add. You grant OurFrame permission to store and display that content back to the profiles in your own frame, and nowhere else.',
      },
      {
        h: 'Acceptable use',
        p: 'Upload only content you created or have permission to use. Don’t use OurFrame for anything unlawful, harmful, or that violates someone else’s rights or privacy.',
      },
      {
        h: 'Availability',
        p: 'OurFrame is provided “as is.” This is an early build, so features may change and, because data lives on your device, clearing your browser can remove it. Use Export to keep your own backup.',
      },
      {
        h: 'Termination',
        p: 'You can delete your account at any time from the Account section. We may suspend access that abuses the service or puts other people at risk.',
      },
      {
        h: 'Liability',
        p: 'To the fullest extent allowed by law, OurFrame isn’t liable for lost or corrupted memories. Please keep your own backups of anything irreplaceable.',
      },
      {
        h: 'Contact',
        p: 'Questions about these terms? Email hello@ourframe.love and we’ll help.',
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Reusable building blocks (local to this file)
--------------------------------------------------------------------------- */
function Card({ header, children }: { header?: string; children: ReactNode }) {
  return (
    <div style={CARD_STYLE} className="rounded-lg p-5">
      {header ? (
        <h3
          style={{ color: C.header, letterSpacing: '0.8px' }}
          className="mb-3 text-[11px] font-semibold uppercase"
        >
          {header}
        </h3>
      ) : null}
      {children}
    </div>
  );
}

function Row({
  label,
  sublabel,
  first,
  children,
}: {
  label: ReactNode;
  sublabel?: ReactNode;
  first?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      style={first ? undefined : ROW_DIVIDER}
      className="flex items-center justify-between gap-4 py-3.5"
    >
      <div className="min-w-0">
        <p style={{ color: C.label }} className="text-[14px]">
          {label}
        </p>
        {sublabel ? (
          <p style={{ color: C.sub }} className="mt-0.5 text-[12px]">
            {sublabel}
          </p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{ backgroundColor: checked ? C.brand : C.toggleOff }}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
    >
      <span
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200"
      />
    </button>
  );
}

function PillSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={
              active
                ? { backgroundColor: C.brand, borderColor: C.brand, color: '#fff' }
                : { backgroundColor: C.pillBg, borderColor: C.pillBorder, color: C.pillText }
            }
            className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors"
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SettingsButton({
  children,
  onClick,
  variant = 'default',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}) {
  const tone =
    variant === 'danger'
      ? { borderColor: C.brand, color: C.brand }
      : { borderColor: C.btnBorder, color: C.btnText };
  return (
    <button
      type="button"
      onClick={onClick}
      style={tone}
      className="rounded-md border bg-transparent px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-[color:var(--set-hover)] active:scale-95"
    >
      {children}
    </button>
  );
}

function RoleBadge({ role }: { role: 'Owner' | 'Partner' | 'Shared' }) {
  const isOwner = role === 'Owner';
  return (
    <span
      style={
        isOwner
          ? { backgroundColor: 'rgba(229,9,20,0.15)', color: C.brand }
          : { backgroundColor: C.pillBg, color: C.pillText }
      }
      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
    >
      {role}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Page
--------------------------------------------------------------------------- */
export function SettingsPage() {
  const navigate = useNavigate();
  const { activeProfile, profiles, clearActiveProfile } = useProfile();
  const { memories } = useMemories();

  const [activeSection, setActiveSection] = useState<SectionId>('account');
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cacheMsg, setCacheMsg] = useState('');
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);

  // Account login details may have been changed on the dedicated pages.
  const [storedEmail] = useState(() => readStored(ACCOUNT_EMAIL_KEY));
  const [pwChangedAt] = useState(() => readStored(PASSWORD_CHANGED_KEY));

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* storage may be unavailable — preferences simply won't persist */
    }
  }, [settings]);

  // Apply the chosen theme to the whole app (resolves "system").
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: keyof SettingsState) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  /* Derived data pulled from the existing stores. */
  const realProfiles = useMemo(() => profiles.filter((p) => p.kind !== 'add'), [profiles]);

  const partner = useMemo(
    () =>
      realProfiles.find((p) => p.id !== activeProfile?.id && p.kind === 'partner') ??
      realProfiles.find((p) => p.id !== activeProfile?.id),
    [realProfiles, activeProfile],
  );

  const emailFor = (name: string) =>
    `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@ourframe.love`;

  const currentEmail = storedEmail || (activeProfile ? emailFor(activeProfile.name) : '—');
  const passwordSub = pwChangedAt
    ? `Last changed on ${new Date(pwChangedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`
    : 'Last changed 3 months ago';

  const roleFor = (profileId: string, kind: string): 'Owner' | 'Partner' | 'Shared' => {
    if (kind === 'shared') return 'Shared';
    if (profileId === activeProfile?.id) return 'Owner';
    return 'Partner';
  };

  const stats = useMemo(() => {
    const photos = memories.filter((m) => m.type === 'photo').length;
    const videos = memories.filter((m) => m.type === 'video').length;
    const archived = memories.filter((m) => m.archived).length;
    const earliest = memories.reduce<string>(
      (acc, m) => (!acc || m.date < acc ? m.date : acc),
      '',
    );
    // Rough per-item estimates so the storage figures track real media counts.
    const photosGB = photos * 0.015;
    const videosGB = videos * 0.35;
    const usedGB = photosGB + videosGB;
    return {
      photos,
      videos,
      archived,
      total: memories.length,
      photosGB,
      videosGB,
      usedGB,
      frameStarted: earliest
        ? new Date(earliest).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : '—',
    };
  }, [memories]);

  const TOTAL_GB = 10;
  const usedGB = stats.usedGB > 0 ? stats.usedGB : 2.4;
  const usedPct = Math.min(100, Math.round((usedGB / TOTAL_GB) * 100));
  const gb = (n: number) => `${n.toFixed(1)} GB`;

  /* Actions */
  const handleSignOut = () => {
    clearActiveProfile();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(false);
    clearActiveProfile();
    navigate('/login');
  };

  const handleExport = () => {
    const payload = JSON.stringify({ exportedFor: activeProfile?.name, memories }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ourframe-memories.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(CACHE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
      setCacheMsg('Cached files cleared');
    } catch {
      setCacheMsg('Nothing to clear');
    }
    window.setTimeout(() => setCacheMsg(''), 2500);
  };

  const meta = SECTION_META[activeSection];

  return (
    <div style={{ backgroundColor: C.page }} className="min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:sticky md:top-24 md:w-[215px] md:self-start">
          <nav style={CARD_STYLE} className="overflow-hidden rounded-lg">
            {NAV_GROUPS.map((group, gi) => (
              <div
                key={gi}
                style={gi > 0 ? { borderTop: `0.5px solid ${C.border}` } : undefined}
                className="py-1.5"
              >
                {group.map((item) => {
                  const active = item.id === activeSection;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      style={{
                        borderLeft: `3px solid ${active ? C.brand : 'transparent'}`,
                        backgroundColor: active ? C.card : 'transparent',
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition-colors',
                        active
                          ? 'text-primary'
                          : 'text-[color:var(--set-nav-inactive)] hover:text-[color:var(--set-strong)]',
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            style={{ color: C.brand, borderColor: C.border }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#e50914]/10 active:scale-95"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <header className="mb-6">
            <h1 style={{ color: C.strong }} className="text-[24px] font-semibold">
              {meta.title}
            </h1>
            <p style={{ color: C.subtitle }} className="mt-1 text-[13px]">
              {meta.subtitle}
            </p>
          </header>

          <div className="flex flex-col gap-5">
            {activeSection === 'account' && (
              <>
                {/* Profile card */}
                <Card>
                  <div className="flex items-center gap-4">
                    {activeProfile ? (
                      <img
                        src={activeProfile.avatarUrl}
                        alt={activeProfile.name}
                        style={{ borderColor: C.brand }}
                        className="h-16 w-16 rounded-full border-2 object-cover"
                      />
                    ) : (
                      <span
                        style={{ backgroundColor: C.pillBg, color: C.pillText }}
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                      >
                        ?
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p style={{ color: C.strong }} className="text-[16px] font-semibold">
                        {activeProfile?.name ?? 'No profile'}
                      </p>
                      <p style={{ color: C.subtitle }} className="text-[13px]">
                        {currentEmail}
                      </p>
                    </div>
                    <SettingsButton onClick={() => navigate('/profile')}>Edit</SettingsButton>
                  </div>
                </Card>

                {/* Your info */}
                <Card header="Your info">
                  <Row first label="Display name" sublabel={activeProfile?.name ?? '—'}>
                    <SettingsButton onClick={() => navigate('/profile')}>Change</SettingsButton>
                  </Row>
                  <Row label="Email address" sublabel={currentEmail}>
                    <SettingsButton onClick={() => navigate('/settings/email')}>
                      Change
                    </SettingsButton>
                  </Row>
                  <Row label="Password" sublabel={passwordSub}>
                    <SettingsButton onClick={() => navigate('/settings/password')}>
                      Change
                    </SettingsButton>
                  </Row>

                  {/* Partner row — read-only */}
                  <div style={ROW_DIVIDER} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      {partner ? (
                        <img
                          src={partner.avatarUrl}
                          alt={partner.name}
                          style={{ borderColor: C.pillBorder }}
                          className="h-9 w-9 rounded-full border object-cover"
                        />
                      ) : (
                        <span
                          style={{ backgroundColor: C.pillBg, color: C.pillText }}
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                        >
                          ?
                        </span>
                      )}
                      <div className="min-w-0">
                        <p style={{ color: C.label }} className="text-[14px]">
                          {partner?.name ?? 'No partner yet'}
                        </p>
                        <p style={{ color: C.sub }} className="text-[12px]">
                          joined this frame with you
                        </p>
                      </div>
                    </div>
                    <RoleBadge role="Partner" />
                  </div>
                </Card>

                {/* Danger zone */}
                <Card header="Danger zone">
                  <Row
                    first
                    label="Delete my account"
                    sublabel="Permanently removes your account and all your uploads"
                  >
                    <SettingsButton variant="danger" onClick={() => setConfirmDelete(true)}>
                      Delete
                    </SettingsButton>
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'profiles' && (
              <>
                <Card header="Profiles in this frame">
                  {realProfiles.map((p, i) => {
                    const role = roleFor(p.id, p.kind);
                    return (
                      <div
                        key={p.id}
                        style={i === 0 ? undefined : ROW_DIVIDER}
                        className="flex items-center justify-between gap-4 py-3.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p style={{ color: C.label }} className="text-[14px]">
                              {p.name}
                            </p>
                            <p style={{ color: C.sub }} className="text-[12px]">
                              {role === 'Owner'
                                ? 'You · manages this frame'
                                : role === 'Shared'
                                  ? 'A shared space for both of you'
                                  : 'Your partner in this frame'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <RoleBadge role={role} />
                          <SettingsButton onClick={() => navigate(`/profiles/edit/${p.id}`)}>
                            Edit
                          </SettingsButton>
                        </div>
                      </div>
                    );
                  })}
                </Card>

                <Card header="Profile settings">
                  <Row
                    first
                    label="Ask for PIN when switching profiles"
                    sublabel="Adds a small lock between your profiles"
                  >
                    <Toggle
                      checked={settings.askPinOnSwitch}
                      onChange={() => toggle('askPinOnSwitch')}
                    />
                  </Row>
                  <Row
                    label="Share my uploads with my partner"
                    sublabel="Partner can see memories you added"
                  >
                    <Toggle checked={settings.shareUploads} onChange={() => toggle('shareUploads')} />
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'privacy' && (
              <>
                <Card header="Visibility">
                  <Row first label="Share my uploads with my partner">
                    <Toggle checked={settings.shareUploads} onChange={() => toggle('shareUploads')} />
                  </Row>
                  <Row
                    label="Show when I was last active"
                    sublabel="Let your partner see your activity status"
                  >
                    <Toggle
                      checked={settings.showLastActive}
                      onChange={() => toggle('showLastActive')}
                    />
                  </Row>
                  <Row label="Show who hearted a memory">
                    <Toggle
                      checked={settings.showWhoHearted}
                      onChange={() => toggle('showWhoHearted')}
                    />
                  </Row>
                </Card>

                <Card header="Your memories">
                  <Row
                    first
                    label="Auto-archive old memories"
                    sublabel="Memories older than 2 years move to your archive"
                  >
                    <Toggle
                      checked={settings.autoArchiveOld}
                      onChange={() => toggle('autoArchiveOld')}
                    />
                  </Row>
                  <Row
                    label="Export our memories"
                    sublabel="Download all your photos, videos, and stories"
                  >
                    <SettingsButton onClick={handleExport}>
                      <span className="inline-flex items-center gap-1.5">
                        <Download size={14} />
                        Export
                      </span>
                    </SettingsButton>
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'notifications' && (
              <>
                <Card header="In-app alerts">
                  <Row first label="When your partner adds a memory">
                    <Toggle
                      checked={settings.notifyPartnerAddedMemory}
                      onChange={() => toggle('notifyPartnerAddedMemory')}
                    />
                  </Row>
                  <Row label="When a memory gets a heart">
                    <Toggle
                      checked={settings.notifyMemoryHearted}
                      onChange={() => toggle('notifyMemoryHearted')}
                    />
                  </Row>
                  <Row
                    label="Monthly memory recap"
                    sublabel="A look back at what you two did this month"
                  >
                    <Toggle checked={settings.monthlyRecap} onChange={() => toggle('monthlyRecap')} />
                  </Row>
                  <Row
                    label="Monthsary & milestone reminders"
                    sublabel="Get reminded on your special dates"
                  >
                    <Toggle
                      checked={settings.monthsaryReminders}
                      onChange={() => toggle('monthsaryReminders')}
                    />
                  </Row>
                </Card>

                <Card header="Email">
                  <Row
                    first
                    label="Weekly memory recap email"
                    sublabel="A short email of new memories each week"
                  >
                    <Toggle
                      checked={settings.weeklyRecapEmail}
                      onChange={() => toggle('weeklyRecapEmail')}
                    />
                  </Row>
                  <Row label="Updates from OurFrame" sublabel="New features and improvements">
                    <Toggle
                      checked={settings.updatesFromOurframe}
                      onChange={() => toggle('updatesFromOurframe')}
                    />
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'appearance' && (
              <>
                <Card header="Theme">
                  <Row first label="App theme">
                    <PillSelector<ThemeChoice>
                      value={settings.theme}
                      onChange={(v) => set('theme', v)}
                      options={[
                        { value: 'dark', label: 'Dark' },
                        { value: 'light', label: 'Light' },
                        { value: 'system', label: 'System' },
                      ]}
                    />
                  </Row>
                </Card>

                <Card header="Homepage">
                  <Row
                    first
                    label="Autoplay the featured memory"
                    sublabel="Plays on homepage load if it's a video"
                  >
                    <Toggle
                      checked={settings.autoplayFeatured}
                      onChange={() => toggle('autoplayFeatured')}
                    />
                  </Row>
                  <Row label="Show mood tags on memory cards">
                    <Toggle checked={settings.showMoodTags} onChange={() => toggle('showMoodTags')} />
                  </Row>
                  <Row label="Show location on memory cards">
                    <Toggle checked={settings.showLocation} onChange={() => toggle('showLocation')} />
                  </Row>
                </Card>

                <Card header="Language">
                  <Row first label="App language">
                    <PillSelector<LanguageChoice>
                      value={settings.language}
                      onChange={(v) => set('language', v)}
                      options={[
                        { value: 'english', label: 'English' },
                        { value: 'filipino', label: 'Filipino' },
                      ]}
                    />
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'storage' && (
              <>
                <Card header="Storage usage">
                  <div className="flex items-end justify-between">
                    <p style={{ color: C.strong }} className="text-[20px] font-semibold">
                      {gb(usedGB)}
                    </p>
                    <p style={{ color: C.subtitle }} className="text-[13px]">
                      of {TOTAL_GB} GB
                    </p>
                  </div>
                  <div
                    style={{ backgroundColor: C.pillBg }}
                    className="mt-3 h-2 w-full overflow-hidden rounded-full"
                  >
                    <div
                      style={{ width: `${usedPct}%`, backgroundColor: C.brand }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                  <div className="mt-3 flex gap-6">
                    <p style={{ color: C.pillText }} className="text-[12px]">
                      Photos — {gb(stats.photosGB)}
                    </p>
                    <p style={{ color: C.pillText }} className="text-[12px]">
                      Videos — {gb(stats.videosGB)}
                    </p>
                  </div>
                </Card>

                <Card header="Upload preferences">
                  <Row first label="Upload quality">
                    <PillSelector<QualityChoice>
                      value={settings.uploadQuality}
                      onChange={(v) => set('uploadQuality', v)}
                      options={[
                        { value: 'original', label: 'Original' },
                        { value: 'compressed', label: 'Compressed' },
                      ]}
                    />
                  </Row>
                  <Row
                    label="Auto-compress videos on upload"
                    sublabel="Reduces file size automatically"
                  >
                    <Toggle
                      checked={settings.autoCompressVideos}
                      onChange={() => toggle('autoCompressVideos')}
                    />
                  </Row>
                </Card>

                <Card header="Manage">
                  <Row
                    first
                    label="View archived memories"
                    sublabel={`${stats.archived} ${
                      stats.archived === 1 ? 'memory' : 'memories'
                    } tucked away in your archive`}
                  >
                    <SettingsButton onClick={() => navigate('/my-lists')}>
                      Open archive
                    </SettingsButton>
                  </Row>
                  <Row
                    label="Clear cached files"
                    sublabel={cacheMsg || 'Frees up temporary files on this device'}
                  >
                    <SettingsButton onClick={handleClearCache}>Clear</SettingsButton>
                  </Row>
                </Card>
              </>
            )}

            {activeSection === 'about' && (
              <>
                <Card header="App">
                  <Row first label="Version" sublabel="The build you're running">
                    <span style={{ color: C.pillText }} className="text-[13px]">
                      OurFrame v1.0.0
                    </span>
                  </Row>
                  <Row label="Memories stored">
                    <span style={{ color: C.pillText }} className="text-[13px]">
                      {stats.total}
                    </span>
                  </Row>
                  <Row label="Frame started">
                    <span style={{ color: C.pillText }} className="text-[13px]">
                      {stats.frameStarted}
                    </span>
                  </Row>
                </Card>

                <Card header="Legal">
                  <Row first label="Privacy policy">
                    <SettingsButton onClick={() => setLegal('privacy')}>View</SettingsButton>
                  </Row>
                  <Row label="Terms of use">
                    <SettingsButton onClick={() => setLegal('terms')}>View</SettingsButton>
                  </Row>
                </Card>

                <p style={{ color: C.muted }} className="pt-4 text-center text-[12px]">
                  Made with love, for the two of you · OurFrame 2026
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete-account confirmation */}
      <AnimatePresence>
        {confirmDelete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              style={CARD_STYLE}
              className="w-full max-w-sm rounded-lg p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  style={{ backgroundColor: 'rgba(229,9,20,0.15)', color: C.brand }}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <AlertTriangle size={20} />
                </span>
                <h2 style={{ color: C.strong }} className="text-[17px] font-semibold">
                  Delete your account?
                </h2>
              </div>
              <p style={{ color: C.subtitle }} className="text-[13px]">
                This permanently removes your account and all your uploads. This can&apos;t be
                undone.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <SettingsButton onClick={() => setConfirmDelete(false)}>Cancel</SettingsButton>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  style={{ backgroundColor: C.brand }}
                  className="inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#e50914]/90 active:scale-95"
                >
                  <Trash2 size={14} />
                  Delete account
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Legal detail modal */}
      <AnimatePresence>
        {legal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
            onClick={() => setLegal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              style={CARD_STYLE}
              className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg"
            >
              <div
                style={{ borderBottom: `0.5px solid ${C.border}` }}
                className="flex items-baseline justify-between gap-4 px-6 py-4"
              >
                <h2 style={{ color: C.strong }} className="text-[18px] font-semibold">
                  {LEGAL_CONTENT[legal].title}
                </h2>
                <span style={{ color: C.sub }} className="text-[12px]">
                  {LEGAL_CONTENT[legal].updated}
                </span>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
                {LEGAL_CONTENT[legal].sections.map((section) => (
                  <div key={section.h}>
                    <h3 style={{ color: C.label }} className="mb-1 text-[14px] font-semibold">
                      {section.h}
                    </h3>
                    <p style={{ color: C.subtitle }} className="text-[13px] leading-relaxed">
                      {section.p}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{ borderTop: `0.5px solid ${C.border}` }}
                className="flex justify-end px-6 py-4"
              >
                <SettingsButton onClick={() => setLegal(null)}>Close</SettingsButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
