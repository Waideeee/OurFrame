import { APP_NAME, FOOTER_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-section-gap border-t border-outline-variant/30 py-12">
      <div className="container-edge flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <span className="text-title-md font-extrabold uppercase tracking-tight text-primary">
          {APP_NAME}
        </span>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-body-md text-metadata transition-colors hover:text-on-surface"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <p className="container-edge mt-8 text-label-sm text-metadata">
        Made with love. Our Story, Our Way. &copy; 2024
      </p>
    </footer>
  );
}
