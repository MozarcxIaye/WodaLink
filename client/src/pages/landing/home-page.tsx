import { Link } from 'react-router';
import { Layers, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export function HomePage() {
  return (
    <div className="bg-neutral-50 dark:bg-[#0b0c10] text-neutral-900 dark:text-neutral-100 min-h-screen font-sans antialiased">
      {/* Header / Navbar */}
      <header className="border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-[#13141b]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-xl tracking-tight">WodaLink</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 py-2 px-4 rounded-lg shadow-sm transition-all">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/40 dark:border-blue-500/20">
            Now active in Kathmandu, Pokhara, Lalitpur and more
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
            Procure Official Documents in Nepal, <span className="text-blue-600 dark:text-blue-500">From Anywhere.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Nepali expats can request official municipality, ward, and government documents. Verified local runners physically obtain them and upload secure digital scans.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-md font-semibold text-white hover:bg-blue-700 shadow-md transition-all">
              Request a Document
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#13141b] border border-neutral-200 dark:border-neutral-800 px-6 py-3 text-md font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 border-t border-neutral-200/50 dark:border-neutral-800/50 px-6 bg-white dark:bg-[#13141b] transition-colors">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Simple, Secure Process</h2>
            <p className="text-neutral-500">WodaLink ensures a transparent lifecycle for every procurement request.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="space-y-4 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0b0c10]/40">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Submit Request</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Specify document details, ward code, upload proof of identity/address (POA), and fund the secure escrow account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0b0c10]/40">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Runner Procurement</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                A verified local runner claims the job, handles the physical paperwork at the municipal office, and pays the fees.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0b0c10]/40">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Secure Download</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                The runner uploads a digital scan of the document. You verify it and download your official document instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Built on Trust and State-of-the-Art Operations</h2>
            <p className="text-neutral-500 leading-relaxed">
              We understand the stakes of procuring government documents. WodaLink enforces verification and secure escrows to protect expats and runners.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">Verified Local Runners</h4>
                  <p className="text-sm text-neutral-500">Every runner undergoes strict KYC/identity checks before claiming jobs.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">Real-time status tracking</h4>
                  <p className="text-sm text-neutral-500">Follow the progress of your request live, step-by-step from submission to completion.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
              <CheckCircle2 className="h-4 w-4" />
              Trusted Network
            </div>
            <h3 className="text-2xl font-bold leading-snug">Empowering locals in Nepal while resolving bottlenecks for expats abroad.</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Expats avoid flights, timezone delays, and middleman markups. Runners earn reliable income performing local municipal services.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-12 px-6 bg-white dark:bg-[#13141b] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-500 text-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-neutral-900 dark:text-white">WodaLink</span>
          </div>
          <p>© 2026 WodaLink. Empowering Nepali citizens globally.</p>
        </div>
      </footer>
    </div>
  );
}
