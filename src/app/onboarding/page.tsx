import Link from "next/link";

const steps = [
  { number: "01", title: "Create a Google Analytics 4 Account", description: "Go to analytics.google.com and sign in with your Google account. Click Start measuring, enter your account name, and follow the prompts to create a new GA4 property for your website.", link: { label: "Open Google Analytics", href: "https://analytics.google.com" } },
  { number: "02", title: "Add the Tracking Code to Your Website", description: "Once your GA4 property is created, Google will give you a Measurement ID (G-XXXXXXXXXX) and a code snippet. Paste this into the head section of every page on your site. WordPress, Wix, and Squarespace all have a built-in field for this.", link: { label: "How to add GA4 to your site", href: "https://support.google.com/analytics/answer/9304153" } },
  { number: "03", title: "You're Connected Automatically", description: "Once GA4 is set up on your website, Motometrix automatically detects your property the moment you sign in with Google — no extra steps needed. Your real data will appear on your dashboard within 24-48 hours. If you use Search Console and want to point Motometrix to a specific verified site, you can add that URL in Settings.", link: { label: "Go to Settings", href: "/settings" } }, 
];

export default function OnboardingPage() {
  const subject = encodeURIComponent("GA4 Setup Help Request");
  const body = encodeURIComponent("Hi,\n\nI need help setting up Google Analytics 4 for my website.\n\nPlease get in touch!\n\nThanks,");
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #060d1f 0%, #0a1530 40%, #0f1f45 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm mb-10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to dashboard
        </Link>
        <div className="mb-12">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#e6b820" }}>Getting Started</p>
          <h1 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>Set Up Google Analytics 4</h1>
          <p className="text-navy-300 text-base leading-relaxed">Follow these 3 steps to connect your website data to Motometrix. Most founders complete this in under 15 minutes.</p>
          <div className="h-px mt-6" style={{ background: "linear-gradient(90deg, #e6b820, transparent)" }} />
        </div>
        <div className="space-y-6 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm" style={{ background: "rgba(230,184,32,0.15)", color: "#e6b820" }}>{step.number}</div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-base mb-2">{step.title}</h2>
                  <p className="text-navy-300 text-sm leading-relaxed mb-4">{step.description}</p>
                  {step.link && (
                    <a href={step.link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors" style={{ color: "#e6b820" }}>{step.link.label}</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, rgba(230,184,32,0.08), rgba(230,184,32,0.04))", border: "1px solid rgba(230,184,32,0.2)" }}>
          <h3 className="text-white font-semibold text-lg mb-2">Need a hand setting this up?</h3>
          <p className="text-navy-300 text-sm mb-6 leading-relaxed">If the steps above feel overwhelming, you do not have to do this alone. Reach out to your developer or browse our network of verified developers.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={mailtoLink} className="flex-1 text-center font-bold px-6 py-3 rounded-xl text-sm" style={{ background: "#e6b820", color: "#0a1530" }}>Contact Your Developer</a>
            <a href="https://www.smartcontractsescrow.net/find-seller" target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-bold px-6 py-3 rounded-xl text-sm" style={{ background: "transparent", border: "1px solid rgba(230,184,32,0.4)", color: "#e6b820" }}>Check Out Our Verified Developers</a>
          </div>
        </div>
      </div>
    </div>
  );
}
