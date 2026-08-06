import Link from "next/link";
import { SignInForm } from "../../components/SignInForm";

export default function SignInPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(90,140,200,0.08),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col items-center justify-center px-6 pb-16 pt-28 md:px-8">
        <SignInForm />
        <Link
          href="/"
          className="mt-10 text-sm text-mist transition hover:text-white"
        >
          ← Назад на главную
        </Link>
      </div>
    </main>
  );
}
