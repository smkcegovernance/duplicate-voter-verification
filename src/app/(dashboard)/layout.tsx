import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200 backdrop-blur-xl shadow-sm">
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shrink-0 hover:scale-105 transition-transform">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900">
                  मतदार प्रमाणित
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">स्मार्ट डुप्लिकेट शोध</p>
              </div>
            </Link>
            
            <Navigation />
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">{children}</main>
    </>
  );
}
