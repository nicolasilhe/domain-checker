export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Construit avec{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Next.js
          </a>
          . Le code source est disponible sur{" "}
          <a
            href="https://github.com/nicolasilhe/domain-checker"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
