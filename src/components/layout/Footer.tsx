export function Footer() {
  return (
    <footer className="text-center py-12 mt-12 border-t border-gray-200 dark:border-white/5">
      <p className="text-sm text-text-muted">
        &copy; {new Date().getFullYear()} Shanmukha Chatadi
      </p>
      <p className="text-xs text-text-muted/50 mt-1">
        Built with Next.js and a lot of caffeine
      </p>
    </footer>
  );
}
