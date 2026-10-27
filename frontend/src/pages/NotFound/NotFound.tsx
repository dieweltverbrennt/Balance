import { Link } from 'react-router-dom'

export const NotFound = () => (
  <main className="flex min-h-svh items-center justify-center px-6 py-12 text-center">
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
        &#x41E;&#x448;&#x438;&#x431;&#x43A;&#x430; 404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
        &#x421;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x430; &#x43D;&#x435; &#x43D;&#x430;&#x439;&#x434;&#x435;&#x43D;&#x430;
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
        &#x41F;&#x43E;&#x445;&#x43E;&#x436;&#x435;, &#x44D;&#x442;&#x43E;&#x439; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x44B; &#x43D;&#x435; &#x441;&#x443;&#x449;&#x435;&#x441;&#x442;&#x432;&#x443;&#x435;&#x442;.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#8375F2] px-6 text-sm font-medium text-white transition-colors hover:bg-[#8F82F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        &#x41D;&#x430; &#x433;&#x43B;&#x430;&#x432;&#x43D;&#x443;&#x44E;
      </Link>
    </div>
  </main>
)
