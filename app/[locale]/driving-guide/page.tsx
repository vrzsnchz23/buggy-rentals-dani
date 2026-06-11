import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLocale } from "next-intl/server";

export const metadata = {
  title: "Driving in Cozumel 101 | Buggy Rentals with Dani",
  description:
    "Your complete guide to driving in Cozumel — road rules, avoiding tickets, gas stations, hidden hazards, and the best spots to visit. From Buggy Rentals with Dani.",
};

export default async function DrivingGuidePage() {
  await getLocale();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">

        {/* ── HERO ── */}
        <div
          className="relative overflow-hidden pt-28 pb-20 text-center"
          style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 70%, #091e2d 100%)" }}
        >
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* glow blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4">
            {/* Course badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8836A] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span>🎓</span> COZUMEL UNIVERSITY · FREE ENROLLMENT
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-4 tracking-tight">
              Driving in<br />
              <span className="text-[#7FB5B5]">Cozumel 101</span>
            </h1>

            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              The unofficial survival manual for exploring paradise on four wheels.
              No textbooks required — just read this before you hit the road.
            </p>

            {/* Course card */}
            <div className="inline-grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden text-sm mt-2">
              {[
                { label: "Credits", value: "7 Modules" },
                { label: "Prereqs", value: "Valid Driver's License" },
                { label: "Grade", value: "No Speed Bumps = A+" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 px-5 py-3 text-center">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="text-white font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SYLLABUS STRIP ── */}
        <div className="bg-[#E8836A] py-4 overflow-x-auto">
          <div className="flex items-center gap-6 max-w-6xl mx-auto px-4 text-white font-bold text-sm whitespace-nowrap">
            {[
              "MOD 1 · The Grid",
              "MOD 2 · Road Rules",
              "MOD 3 · No Tickets",
              "MOD 4 · Gas Stations",
              "MOD 5 · Hazards",
              "MOD 6 · VIP Spots",
              "MOD 7 · The Wild East",
            ].map((m, i) => (
              <span key={i} className="flex items-center gap-2 opacity-90 hover:opacity-100">
                {i > 0 && <span className="opacity-40">·</span>}
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

          {/* ── MODULE 1: NAVIGATION ── */}
          <section id="mod-1">
            <ModuleHeader number="01" emoji="🗺️" title="Crack the Grid" subtitle="San Miguel's street system isn't random — it's a puzzle. Solve it once, navigate forever." />

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              {/* Avenidas card */}
              <div className="rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-[#1B4F72] px-6 pt-6 pb-8 relative overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#E8836A]/20 blur-xl" />
                  <span className="inline-block bg-white/15 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">Avenidas · N–S</span>
                  <div className="text-4xl mb-2">🏙️</div>
                  <h3 className="text-white font-black text-xl leading-tight">Run parallel to the sea</h3>
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Start at the seafront with <strong className="text-[#1B4F72]">Av. Rafael E. Melgar</strong>, then count inland in multiples of 5: 5a Av, 10a Av, 15a Av…
                  </p>
                  <div className="flex items-center gap-2 bg-[#E8836A]/8 rounded-2xl px-4 py-2.5">
                    <span className="text-[#E8836A] text-lg">⚡</span>
                    <span className="text-[#E8836A] font-bold text-sm">Right of way — always yield to them</span>
                  </div>
                </div>
              </div>

              {/* Calles card */}
              <div className="rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-[#7FB5B5] px-6 pt-6 pb-8 relative overflow-hidden">
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#1B4F72]/20 blur-xl" />
                  <span className="inline-block bg-white/20 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">Calles · E–W</span>
                  <div className="text-4xl mb-2">🧭</div>
                  <h3 className="text-white font-black text-xl leading-tight">Run perpendicular to the sea</h3>
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    The spine is <strong className="text-[#1B4F72]">Av. Juárez</strong>. North of it = even numbers (2, 4, 6…). South = odd numbers (1, 3, 5…).
                  </p>
                  <div className="flex items-center gap-2 bg-[#E8836A]/8 rounded-2xl px-4 py-2.5">
                    <span className="text-[#E8836A] text-lg">🛑</span>
                    <span className="text-[#E8836A] font-bold text-sm">Full stop — no yield, no rolling through</span>
                  </div>
                </div>
              </div>
            </div>

            <ProfessorNote>
              <strong>The Hidden Arrows:</strong> Forget traffic lights. One-way direction is shown by tiny arrows painted on building corners or low poles. Check them <em>before</em> you turn — nearly every block alternates direction.
            </ProfessorNote>

            <PhotoSlot label="Add photo: San Miguel street grid / map view" />
          </section>

          {/* ── MODULE 2: ROAD RULES ── */}
          <section id="mod-2">
            <ModuleHeader number="02" emoji="🚦" title="The Golden Rules" subtitle="Driving here is chill — as long as you know the three things that will trip you up." />

            <div className="mt-8 space-y-4">
              <RuleCard
                color="coral"
                icon="🛑"
                title="The Red Disco — Full Stop"
                body={`"Alto" means your vehicle stops completely. Not a California roll, not a slow creep — a full stop. Local police specifically watch tourists at these. You've been warned.`}
                verdict="EXAM QUESTION"
              />
              <RuleCard
                color="teal"
                icon="🔄"
                title="Roundabouts — Traffic Inside Has Priority"
                body="If cars are already circling, you wait. Pull up, stop fully, and merge only when there's a clear gap. No honking, no forcing it."
                verdict="EASY POINTS"
              />
              <RuleCard
                color="navy"
                icon="🏍️"
                title="The Moto Swarm — Eyes on Mirrors"
                body="Cozumel has more motorcycles per capita than almost anywhere in Mexico. They weave right, pass in blind spots, and materialize out of nowhere. Check your mirrors three times before changing lanes or opening your door."
                verdict="WILL BE ON TEST"
              />
            </div>

            <PhotoSlot label="Add photo: typical Cozumel street / roundabout" />
          </section>

          {/* ── MODULE 3: NO TICKETS ── */}
          <section id="mod-3">
            <ModuleHeader number="03" emoji="👮" title="The Anti-Ticket Playbook" subtitle="Don't be the tourist who loses a morning at City Hall. Two rules cover 95% of situations." />

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-7 shadow-sm border-l-4 border-[#E8836A]">
                <div className="text-2xl mb-3">🅿️</div>
                <h3 className="font-black text-[#1B4F72] text-lg mb-2">Where NOT to Park</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yellow or red curbs = no parking, ever. In Cozumel, they don't leave a ticket on your windshield — <strong>the police take your rear license plate</strong>. Getting it back means a trip to the Municipal Palace + a hefty fine. Not worth it.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-7 shadow-sm border-l-4 border-[#7FB5B5]">
                <div className="text-2xl mb-3">🤝</div>
                <h3 className="font-black text-[#1B4F72] text-lg mb-2">If You Get Pulled Over</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Stay calm. If you broke a rule, the officer <em>must</em> issue a written ticket. Never offer cash on the street. Just say: <strong className="text-[#1B4F72]">"Por favor, oficial, levante la infracción."</strong><br /><br />
                  Pay it at the municipal treasury within a few days → <span className="text-[#7FB5B5] font-bold">50% discount + immediate plate return.</span>
                </p>
              </div>
            </div>

            <ProfessorNote variant="warning">
              Never hand money to a police officer on the street. It's called a <em>mordida</em> and it only makes things worse. Ask for the written infraction — that's your right.
            </ProfessorNote>
          </section>

          {/* ── MODULE 4: GAS ── */}
          <section id="mod-4">
            <ModuleHeader number="04" emoji="⛽" title="Gas Station Survival" subtitle="There are zero gas stations outside San Miguel. Fill up before you leave town — no exceptions." />

            <div className="mt-8 bg-[#1B4F72] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <h3 className="text-xl font-black mb-6 relative">⚠️ Two-Step Scam Prevention Protocol</h3>
              <div className="grid md:grid-cols-2 gap-6 relative">
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-3xl font-black text-[#E8836A] mb-2">01</div>
                  <h4 className="font-bold text-white mb-1">Pump at Zero</h4>
                  <p className="text-white/70 text-sm">Before the attendant puts the nozzle in — get out, look at the digital display, and confirm it reads <strong className="text-white">$0.00</strong>. Don't skip this.</p>
                </div>
                <div className="bg-[#E8836A]/20 border border-[#E8836A]/30 rounded-2xl p-5">
                  <div className="text-3xl font-black text-[#E8836A] mb-2">02</div>
                  <h4 className="font-bold text-white mb-1">We've Got You Covered 🙌</h4>
                  <p className="text-white/80 text-sm">Our pickup &amp; drop-off point is right at a gas station — so at the end of your day, <strong className="text-white">we'll help you fill up</strong> and return the tank exactly as you got it. No stress, no guesswork.</p>
                </div>
              </div>
            </div>

            <PhotoSlot label="Add photo: Cozumel gas station" />
          </section>

          {/* ── MODULE 5: HAZARDS ── */}
          <section id="mod-5">
            <ModuleHeader number="05" emoji="🚧" title="Hidden Hazards" subtitle="Two things nobody warns you about. Both will ruin your day if you're not ready." />

            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-3xl p-7 shadow-sm flex gap-5">
                <div className="text-4xl shrink-0">🏔️</div>
                <div>
                  <h3 className="font-black text-[#1B4F72] text-lg mb-1">Topes — The Sneaky Speed Bumps</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Mexican speed bumps aren't polite little humps. They're designed to absolutely stop you. Many on beach roads aren't painted. Hit one at speed in a buggy and you'll feel it in your spine. <strong>Slow down approaching beach club entrances and residential zones.</strong>
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-7 shadow-sm flex gap-5">
                <div className="text-4xl shrink-0">🚢</div>
                <div>
                  <h3 className="font-black text-[#1B4F72] text-lg mb-1">Cruise Ship Traffic — Watch Your Timing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Cozumel is the #1 cruise destination in the Caribbean. The area near the piers gets busy — keep in mind that traffic picks up when passengers start heading back to their ships.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-[#7FB5B5]/10 text-[#7FB5B5] font-bold text-xs px-3 py-1.5 rounded-full">⏱️ Plan your return before the rush</span>
                    <span className="bg-[#7FB5B5]/10 text-[#7FB5B5] font-bold text-xs px-3 py-1.5 rounded-full">🗓️ Check the cruise calendar online</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── MODULE 6: VIP SPOTS ── */}
          <section id="mod-6">
            <ModuleHeader number="06" emoji="🏆" title="Your VIP Route" subtitle="Renting with Dani unlocks exclusive access. Here's where to point the buggy." />

            <div className="mt-8 space-y-6">
              {/* Beach clubs */}
              <div>
                <h3 className="font-black text-[#1B4F72] text-xl mb-4 flex items-center gap-2">
                  🏖️ Beach Clubs
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-[#1B4F72] px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-white text-lg">Banana Beach Club</h4>
                        <div className="bg-[#E8836A] text-white text-xs font-black px-3 py-1 rounded-full">DANI DEAL</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-black text-[#E8836A]">$10</span>
                        <span className="text-gray-400 text-sm line-through">$20</span>
                        <span className="text-gray-500 text-sm">/ person</span>
                      </div>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {["🤿 Snorkel & kayak included", "🥃 Tequila tasting", "🛏️ Lounge chairs + umbrella", "📶 WiFi"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">{item}</li>
                        ))}
                      </ul>
                      <p className="text-[#7FB5B5] font-semibold text-xs mt-4">Perfect for reef adventures + full chill mode</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-[#1B4F72] px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-white text-lg">San Francisco Beach</h4>
                        <div className="bg-[#7FB5B5] text-white text-xs font-black px-3 py-1 rounded-full">FREE ENTRY</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-black text-[#7FB5B5]">$0</span>
                        <span className="text-gray-500 text-sm">entry · $20 min. spend</span>
                      </div>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {["🏊 Full pool access", "🍹 Pool bar", "🛏️ Ocean-front chairs", "🍔 Great food"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">{item}</li>
                        ))}
                      </ul>
                      <p className="text-[#7FB5B5] font-semibold text-xs mt-4">Beach party vibes with killer food</p>
                    </div>
                  </div>
                </div>
              </div>

              <PhotoSlot label="Add photos: Banana Beach Club / San Francisco Beach Club" />

              {/* Cultural stops */}
              <div>
                <h3 className="font-black text-[#1B4F72] text-xl mb-4 flex items-center gap-2">
                  🎭 Free Cultural Stops
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#1B4F72] rounded-3xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#E8836A]/20 blur-2xl" />
                    <div className="text-3xl mb-3">🥃</div>
                    <h4 className="font-black text-lg mb-1">Hacienda Antigua</h4>
                    <p className="text-[#7FB5B5] text-xs font-bold uppercase tracking-wider mb-3">Tequila Tour — Free with Dani</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      See how tequila is actually made, taste the real stuff, and get a complimentary welcome margarita just for showing up with us.
                    </p>
                  </div>
                  <div className="bg-[#1B4F72] rounded-3xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-[#7FB5B5]/20 blur-2xl" />
                    <div className="text-3xl mb-3">🍫</div>
                    <h4 className="font-black text-lg mb-1">Sabores de Cozumel</h4>
                    <p className="text-[#7FB5B5] text-xs font-bold uppercase tracking-wider mb-3">Chocolate &amp; Tequila — Free with Dani</p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Learn the history of Mayan cacao, make your own chocolate from scratch, then pair it with premium tequilas. Zero cost with your Dani key.
                    </p>
                  </div>
                </div>
              </div>

              <PhotoSlot label="Add photos: Hacienda Antigua / Sabores de Cozumel" />
            </div>
          </section>

          {/* ── MODULE 7: EAST SIDE ── */}
          <section id="mod-7">
            <ModuleHeader number="07" emoji="🌊" title="The Wild East Coast" subtitle="Cross the island on the Transversal highway and you enter another world. Read this first." />

            <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#1B4F72]/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📵</div>
                  <h4 className="font-black text-[#1B4F72] mb-1">Zero Signal</h4>
                  <p className="text-gray-500 text-sm">You'll lose 90% of cell service on the east coast. One straight road — hard to get lost. <strong>Download offline maps before you leave town.</strong></p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#E8836A]/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🌊</div>
                  <h4 className="font-black text-[#1B4F72] mb-1">No Open Swimming</h4>
                  <p className="text-gray-500 text-sm">Beautiful beaches with <strong className="text-[#E8836A]">dangerous rip currents</strong>. Only swim at <strong>Chen Río</strong> or <strong>Punta Morena</strong> — natural rock pools, totally calm.</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#7FB5B5]/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🦎</div>
                  <h4 className="font-black text-[#1B4F72] mb-1">Wildlife Crossing</h4>
                  <p className="text-gray-500 text-sm">You're in a nature reserve. Giant iguanas, coatis, and in rainy season (Jun–Sep) — <strong>thousands of blue crabs</strong> migrating across the road. Slow down.</p>
                </div>
              </div>
            </div>

            <ProfessorNote>
              The east coast highway is one of the most scenic drives in the Caribbean. Pack water, a charged camera, and your offline map. Then just drive.
            </ProfessorNote>

            <PhotoSlot label="Add photos: East coast road / iguanas / Chen Río natural pools" />
          </section>

          {/* ── FINAL GRADE ── */}
          <div className="bg-[#1B4F72] rounded-3xl p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-3xl font-black mb-3">You just passed Driving in Cozumel 101</h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8">
                Now go rent a buggy, fill up the tank, and see the island properly. The reef won't visit itself.
              </p>
              <a
                href="/en/book"
                className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5"
              >
                Book Your Buggy →
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Reusable sub-components ── */

function ModuleHeader({
  number,
  emoji,
  title,
  subtitle,
}: {
  number: string;
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-5">
      {/* Big emoji bubble */}
      <div
        className="shrink-0 w-20 h-20 rounded-3xl flex flex-col items-center justify-center gap-0.5 shadow-lg"
        style={{ background: "linear-gradient(135deg, #1B4F72 0%, #0f2d42 100%)" }}
      >
        <span className="text-3xl leading-none">{emoji}</span>
        <span className="text-white/50 text-[10px] font-black tracking-widest">{number}</span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#E8836A]/15 text-[#E8836A] font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Module {number}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1B4F72] leading-tight">{title}</h2>
        <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

function ProfessorNote({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  const bg = variant === "warning" ? "bg-[#FFF4F1]" : "bg-[#F0FAF9]";
  const border = variant === "warning" ? "border-[#E8836A]" : "border-[#7FB5B5]";
  const iconBg = variant === "warning" ? "bg-[#E8836A]" : "bg-[#7FB5B5]";

  return (
    <div className={`mt-6 ${bg} border ${border} rounded-3xl px-6 py-5 flex gap-4 items-start`}>
      <div className={`shrink-0 w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center text-white text-base mt-0.5`}>
        📌
      </div>
      <p className="text-sm text-gray-700 leading-relaxed pt-1">{children}</p>
    </div>
  );
}

function RuleCard({
  color,
  icon,
  title,
  body,
  verdict,
}: {
  color: "coral" | "teal" | "navy";
  icon: string;
  title: string;
  body: string;
  verdict: string;
}) {
  const iconBg =
    color === "coral" ? "bg-[#E8836A]" : color === "teal" ? "bg-[#7FB5B5]" : "bg-[#1B4F72]";
  const badge =
    color === "coral"
      ? "bg-[#E8836A]/10 text-[#E8836A]"
      : color === "teal"
      ? "bg-[#7FB5B5]/10 text-[#7FB5B5]"
      : "bg-[#1B4F72]/10 text-[#1B4F72]";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex gap-5 items-start hover:shadow-md transition-shadow">
      {/* Icon bubble */}
      <div className={`shrink-0 w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-2xl shadow-sm`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-black text-[#1B4F72] text-lg leading-tight">{title}</h3>
          <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badge}`}>
            {verdict}
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function PhotoSlot({ label: _label }: { label: string }) {
  // TODO: add photo — _label contains the description for future reference
  return (
    <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-200 bg-white/60 flex items-center justify-center py-12 text-gray-300 hover:border-[#7FB5B5]/40 hover:bg-[#F0FAF9]/60 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}
