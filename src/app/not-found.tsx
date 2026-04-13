import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
      <p className="text-6xl font-bold font-display text-slate-200 mb-4">404</p>
      <h1 className="text-2xl font-display text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
      >
        Go home
      </Link>
    </div>
  );
}
