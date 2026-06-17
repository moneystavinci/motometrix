export default function SiteAuditCTA() {
  const email = "sales@smartcontractsescrow.net";
  const subject = encodeURIComponent("Site Audit Request");
  const body = encodeURIComponent(
    "Hi,\n\nI'd like to request a site audit for my website.\n\nI found you through Motometrix and would love to improve my website performance.\n\nPlease get in touch!\n\nThanks,"
  );

  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(230,184,32,0.08), rgba(230,184,32,0.04))",
        border: "1px solid rgba(230,184,32,0.2)",
      }}
    >
      <div>
        <p className="text-white font-semibold text-lg">
          Looking to improve your website performance?
        </p>
        <p className="text-navy-300 text-sm mt-1">
          Get a professional audit and actionable recommendations tailored to your site.
        </p>
      </div>
      
        href={mailtoLink}
        className="shrink-0 font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm whitespace-nowrap"
        style={{ background: "#e6b820", color: "#0a1530" }}
      >
        Request a Site Audit ?
      </a>
    </div>
  );
}