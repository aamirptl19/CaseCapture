import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mb-10">Last updated: April 2025</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            Lexaro provides software that helps law firms manage and respond to client enquiries.
          </p>
          <p>
            When you submit an enquiry through a Lexaro form, your information is processed on behalf of the law firm you are contacting.
          </p>
          <p>
            The law firm is the data controller and is responsible for how your information is used. Lexaro acts as a data processor and only processes data to provide its services.
          </p>
          <p>
            We do not use your information for marketing or share it with third parties.
          </p>
          <p>
            Your data is stored securely using industry-standard infrastructure.
          </p>
          <p>
            If you have any questions about how your data is handled, please contact the law firm you submitted your enquiry to.
          </p>
        </div>
      </div>
    </div>
  );
}
