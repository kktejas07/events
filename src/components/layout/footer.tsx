import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-dark text-dark-foreground">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">E</span>
              </div>
              <span className="text-xl font-bold text-white">Events</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              The ultimate platform for discovering and managing amazing events worldwide.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/events" className="hover:text-white">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Speakers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Tickets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400">
              Subscribe to get notified about upcoming events and exclusive offers.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Events Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
