import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a1a]">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/30">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <span className="text-xl font-bold text-white">Events</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              The ultimate platform for discovering and managing amazing events worldwide.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/events" className="transition-colors hover:text-purple-400">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Speakers
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Tickets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-500">
              Subscribe to get notified about upcoming events and exclusive offers.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <button className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-600/30 transition-all hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Events Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
