import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-6">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            1 Level Up
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          It never gets easier,
          <br />
          <span className="text-gold">you just get stronger.</span>
        </h1>

        <p className="text-dark-muted text-lg mb-10 max-w-lg mx-auto">
          Track your weight, nutrition, and workouts. Stay accountable to your
          coach. See real results.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-gold text-center text-lg px-8 py-3">
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-dark-border text-dark-text px-8 py-3 rounded-lg hover:border-gold transition-colors text-center text-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="card gold-glow">
            <div className="text-gold text-2xl mb-3">⚖️</div>
            <h3 className="font-semibold text-lg mb-2">Weight Tracking</h3>
            <p className="text-dark-muted text-sm">
              Log daily weigh-ins, visualise trends, and track progress toward
              your goal.
            </p>
          </div>
          <div className="card gold-glow">
            <div className="text-gold text-2xl mb-3">🏋️</div>
            <h3 className="font-semibold text-lg mb-2">Exercise Logger</h3>
            <p className="text-dark-muted text-sm">
              Schedule workouts, track sets and reps, and never miss a session.
            </p>
          </div>
          <div className="card gold-glow">
            <div className="text-gold text-2xl mb-3">🍎</div>
            <h3 className="font-semibold text-lg mb-2">Food & Calories</h3>
            <p className="text-dark-muted text-sm">
              Search foods, scan barcodes, and hit your daily macro targets with
              ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
