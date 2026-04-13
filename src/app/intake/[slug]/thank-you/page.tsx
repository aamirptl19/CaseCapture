import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { CheckCircle, Phone, Mail, Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

export default async function ThankYouPage({ params }: Props) {
  const service = createServiceClient();
  const { data: firm } = await service
    .from("firms")
    .select("name, contact_email")
    .eq("slug", params.slug)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center shadow-sm">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl text-slate-900 mb-3">
          Enquiry received
        </h1>
        <p className="text-slate-600 text-base leading-relaxed mb-8">
          Thank you for getting in touch with{" "}
          <span className="font-semibold">{firm?.name ?? "the firm"}</span>.
          Your enquiry has been submitted and a member of the team will review
          it and be in touch with you shortly.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            What happens next
          </h2>
          <div className="space-y-4">
            <Step
              icon={Clock}
              title="Your enquiry is being reviewed"
              description="A qualified member of the team will read through your matter and assess how we can help."
            />
            <Step
              icon={Phone}
              title="We will contact you"
              description="We'll be in touch by email or phone to discuss your matter and advise on next steps."
            />
            <Step
              icon={Mail}
              title="Check your inbox"
              description="Keep an eye on your email. If you don't hear from us within 2 business days, please follow up."
            />
          </div>
        </div>

        {/* Important note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-8">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Important:</span> This form is not
            monitored 24/7. If your matter is a genuine legal emergency — such
            as imminent court action, risk of harm, or immediate risk of
            homelessness — please contact the firm directly by telephone or seek
            emergency legal assistance.
          </p>
        </div>

        {/* Contact info */}
        {firm?.contact_email && (
          <p className="text-sm text-slate-500 mb-8">
            You can also email the firm directly at{" "}
            <a
              href={`mailto:${firm.contact_email}`}
              className="text-primary font-medium hover:underline"
            >
              {firm.contact_email}
            </a>
          </p>
        )}

        {/* Back link */}
        <Link
          href={`/intake/${params.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          ← Submit another enquiry
        </Link>
      </div>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
