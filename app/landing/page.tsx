"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import AOS from "aos";
import "aos/dist/aos.css";

const heroSlides = [
  { heading: "Care Without Limits" },
  { heading: "See a Doctor in Minutes" },
];

const howItWorksSteps = [
  { id: "tab1", label: "Get Started", screen: "/images/software-screen-a.jpg" },
  { id: "tab2", label: "Describe Symptoms", screen: "/images/software-screen-b.jpg" },
  { id: "tab3", label: "Join Queue", screen: "/images/software-screen-c.jpg" },
  { id: "tab4", label: "Consult Virtually", screen: "/images/software-screen-d.jpg" },
  { id: "tab5", label: "Receive Care", screen: "/images/software-screen-a.jpg" },
];

const faqs = [
  { id: "faq1", q: "Is this app free to use for business or commercial use?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
  { id: "faq2", q: "How do I make a support request with this app?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
  { id: "faq3", q: "How and where can we download the latest update?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
  { id: "faq4", q: "Is there any premium version with extended features?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
  { id: "faq5", q: "Where do I find any detailed documentation?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
  { id: "faq6", q: "Are you guys available for making custom apps?", a: "Internal audit is an independent, objective assurance and consulting activity designed to add value and improve an organization—an independent, objective assurance and consulting activity." },
];

const testimonials = [
  { name: "Andy Lovell", avatar: "/images/user1.jpg", text: "Nam et sagittis diam. Sed tempor augue sit amet egestas scelerisque. Orci varius natoque penatibus et magnis dis parturient montes nascetur." },
  { name: "Sarah Mitchell", avatar: "/images/user1.jpg", text: "Nam et sagittis diam. Sed tempor augue sit amet egestas scelerisque. Orci varius natoque penatibus et magnis dis parturient montes nascetur." },
  { name: "James Okoro", avatar: "/images/user1.jpg", text: "Nam et sagittis diam. Sed tempor augue sit amet egestas scelerisque. Orci varius natoque penatibus et magnis dis parturient montes nascetur." },
];

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [heroSlide, setHeroSlide] = useState(0);
  const [activeStep, setActiveStep] = useState("tab1");
  const [openFaq, setOpenFaq] = useState<string | null>("faq1");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const heroInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    heroInterval.current = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => { if (heroInterval.current) clearInterval(heroInterval.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  // AOS scroll animations
  useEffect(() => {
    AOS.init({ duration: 750, once: true, easing: "ease-out-cubic", offset: 60 });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "For Patients", id: "forpatient" },
    { label: "For Doctors", id: "fordoctor" },
    { label: "How It Works", id: "how_it_works" },
    { label: "Why Choose Us", id: "why_choose_us" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contacts" },
  ];

  return (
    <div className="font-[Poppins,sans-serif] overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo("home")} className="shrink-0">
              <Image
                src={navScrolled ? "/images/evizor_logo.png" : "/images/evizor_logo_w.png"}
                alt="eVizor"
                width={110}
                height={36}
                className="h-9 w-auto"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className={`text-sm font-medium transition-colors hover:text-purple-400 ${navScrolled ? "text-slate-700" : "text-white"}`}
                >
                  {l.label}
                </button>
              ))}
              <Link
                href="/login"
                className="ml-2 rounded-full bg-white text-purple-700 px-5 py-1.5 text-sm font-semibold shadow hover:bg-purple-50 transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md ${navScrolled ? "text-slate-700" : "text-white"}`}
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-sm text-slate-700 py-2 hover:text-purple-600">
                  {l.label}
                </button>
              ))}
              <Link href="/login" className="block w-full text-center rounded-full bg-purple-700 text-white px-5 py-2 text-sm font-semibold mt-2">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section id="home" className="relative bg-linear-to-br from-purple-900 via-purple-700 to-indigo-800 min-h-screen flex flex-col overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-white/5" />
        <div className="absolute top-20 -right-20 size-72 rounded-full bg-white/5" />
        <div className="absolute bottom-10 left-1/3 size-48 rounded-full bg-white/5" />

        <div className="flex-1 flex flex-col items-center justify-center text-center pt-24 pb-10 px-4">
          <div className="relative w-full max-w-2xl mx-auto min-h-[80px] mb-8">
            {heroSlides.map((s, i) => (
              <h1
                key={i}
                className={`absolute inset-0 text-4xl sm:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 ${i === heroSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
              >
                {s.heading}
              </h1>
            ))}
          </div>

          {/* Slide dots */}
          <div className="flex gap-2 mb-8">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} className={`size-2 rounded-full transition-all ${i === heroSlide ? "bg-white w-6" : "bg-white/40"}`} />
            ))}
          </div>

          <div data-aos="fade-up" data-aos-delay="300" className="flex flex-wrap gap-3 justify-center">
            <a href="#" className="rounded-full bg-white text-purple-700 px-8 py-3 text-sm font-semibold shadow hover:bg-purple-50 transition-colors">
              Download
            </a>
            <button onClick={() => scrollTo("about")} className="rounded-full border-2 border-white text-white px-8 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Mockup images */}
        <div className="max-w-4xl mx-auto w-full px-4 pb-0 flex justify-center items-end gap-4">
          <div data-aos="fade-up" data-aos-delay="400" className="relative w-full max-w-[520px] rounded-t-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="h-5 bg-slate-800 rounded-t-xl flex items-center px-3 gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <Image src="/images/software-screen-a.jpg" alt="eVizor software" width={800} height={500} className="w-full" />
          </div>
          <div data-aos="fade-up" data-aos-delay="500" className="relative w-32 sm:w-40 shrink-0 rounded-t-3xl overflow-hidden shadow-2xl border border-white/20">
            <Image src="/images/app-screen-a.jpg" alt="eVizor app" width={200} height={400} className="w-full" />
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">About <span className="text-purple-700">eVizor</span></h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto leading-relaxed">
              eVizor envisions a future where quality healthcare is not limited by location, time, or infrastructure. By combining trusted medical expertise with smart digital technology, eVizor is making healthcare more connected, responsive, and accessible for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-left" className="flex justify-center">
              <Image src="/images/about.png" alt="About eVizor" width={480} height={400} className="w-full max-w-md rounded-2xl" />
            </div>
            <div data-aos="fade-right">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Trusted Medical Care—Anywhere, Anytime</h3>
              <p className="text-slate-500 leading-relaxed mb-4">
                eVizor is a secure virtual healthcare platform that connects patients with licensed medical professionals through real-time video consultations, digital prescriptions, and smart clinical workflows.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Designed for convenience, safety, and speed, eVizor removes the barriers of traditional healthcare—no long waiting rooms, no unnecessary travel, and no delays in care. Whether it's a quick medical concern or a follow-up consultation, eVizor puts professional healthcare just minutes away.
              </p>
              <a href="#" className="inline-block rounded-full bg-purple-700 text-white px-8 py-3 text-sm font-semibold hover:bg-purple-800 transition-colors shadow">
                Download
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Patient ──────────────────────────────────────────── */}
      <section id="forpatient" className="py-24 bg-emerald-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">For Patient</h2>
            <p className="mt-4 text-emerald-100 max-w-xl mx-auto leading-relaxed">
              eVizor makes accessing healthcare simple and fast. Patients can describe their symptoms, upload photos or medical documents, and join a live virtual queue to consult a licensed doctor within minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎧", title: "Virtual Doctor Visits", desc: "Consult licensed doctors from anywhere through easy, on-demand virtual appointments.", delay: "100" },
              { icon: "⏰", title: "Live Virtual Queue", desc: "Patients can join a live consultation queue and receive real-time updates on wait times and position.", delay: "200" },
              { icon: "💬", title: "Smart Symptom Intake", desc: "Before the consultation begins, patients can describe their symptoms using guided forms, severity indicators, and free-text notes.", delay: "300" },
              { icon: "🖼️", title: "Upload Symptoms & Images", desc: "Share symptoms, photos, videos, or medical documents to help doctors better understand your condition.", delay: "150" },
              { icon: "📹", title: "Secure Video Consultations", desc: "Connect through encrypted, high-quality video calls that protect your privacy.", delay: "250" },
              { icon: "📋", title: "Digital Prescriptions", desc: "Receive prescriptions instantly after your consultation, ready to download or share.", delay: "350" },
            ].map((f) => (
              <div key={f.title} data-aos="fade-up" data-aos-delay={f.delay} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h4 className="text-white font-semibold text-lg mb-2">{f.title}</h4>
                <p className="text-emerald-100 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Doctor ───────────────────────────────────────────── */}
      <section id="fordoctor" className="py-24 bg-blue-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">For Doctor</h2>
              <p className="text-blue-100 leading-relaxed mb-10">
                eVizor equips doctors with efficient tools to deliver high-quality virtual care. Clinicians can view a live patient queue, preview symptoms and uploaded files before consultations, and conduct secure video visits.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: "⏰", title: "Live Patient Queue", desc: "View and manage incoming patients in real time with symptom previews and wait times." },
                  { icon: "📹", title: "Secure Video Consultations", desc: "Conduct reliable, encrypted video visits from a single web-based dashboard." },
                  { icon: "✏️", title: "Real-Time Clinical Notes", desc: "Document consultations efficiently with structured, auto-saved notes." },
                  { icon: "📋", title: "E-Prescriptions & Case Management", desc: "Create digital prescriptions and manage cases from intake to closure with ease." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3">
                    <div className="text-2xl shrink-0 mt-1">{f.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{f.title}</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div data-aos="fade-right" className="relative flex justify-center items-end gap-4">
              <div className="relative w-72 rounded-t-2xl overflow-hidden shadow-2xl border border-white/20">
                <div className="h-5 bg-slate-800 rounded-t-xl flex items-center px-3 gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" /><span className="size-2.5 rounded-full bg-yellow-400" /><span className="size-2.5 rounded-full bg-green-400" />
                </div>
                <Image src="/images/software-screen-b.jpg" alt="Doctor dashboard" width={600} height={400} className="w-full" />
              </div>
              <div className="w-28 rounded-t-3xl overflow-hidden shadow-2xl border border-white/20 shrink-0">
                <Image src="/images/app-screen-a.jpg" alt="App screen" width={200} height={400} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section id="how_it_works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Step by Step <span className="text-purple-700">of eVizor</span></h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
              Fast, secure, and seamless virtual consultations—bringing professional healthcare directly to you.
            </p>
          </div>

          {/* Step tabs */}
          <div data-aos="fade-up" data-aos-delay="150" className="flex flex-wrap justify-center gap-2 mb-10">
            {howItWorksSteps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStep === step.id ? "bg-purple-700 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                <span className={`size-5 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === step.id ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700"}`}>{i + 1}</span>
                {step.label}
              </button>
            ))}
          </div>

          {/* Step content */}
          {howItWorksSteps.map((step) => (
            <div key={step.id} className={`transition-all duration-500 ${activeStep === step.id ? "block" : "hidden"}`}>
              <div className="flex justify-center items-end gap-4 max-w-3xl mx-auto">
                <div className="w-full max-w-[500px] rounded-t-2xl overflow-hidden shadow-xl border border-slate-200">
                  <div className="h-5 bg-slate-800 rounded-t-xl flex items-center px-3 gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400" /><span className="size-2.5 rounded-full bg-yellow-400" /><span className="size-2.5 rounded-full bg-green-400" />
                  </div>
                  <Image src={step.screen} alt={step.label} width={800} height={500} className="w-full" />
                </div>
                <div className="w-24 rounded-t-3xl overflow-hidden shadow-xl border border-slate-200 shrink-0">
                  <Image src="/images/app-screen-a.jpg" alt="App" width={200} height={400} className="w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <section id="why_choose_us" className="py-24" style={{ background: "#ecf4fd" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Why Choose <span className="text-emerald-600">eVizor</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
              Connect with licensed doctors, get prescriptions, and access your medical records—anytime, anywhere.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: "❤️", title: "Care Built Around You", desc: "No waiting rooms, fast access to trusted doctors, all through a simple and secure mobile app.", delay: "100" },
              { icon: "🔒", title: "Trusted. Secure. Simple.", desc: "Private video consultations with licensed professionals, backed by strong security and easy access to care.", delay: "250" },
              { icon: "🏅", title: "Quality Care, Without the Wait", desc: "See a doctor in minutes through a secure, easy-to-use app—anytime, anywhere.", delay: "400" },
            ].map((f) => (
              <div key={f.title} data-aos="zoom-in" data-aos-delay={f.delay} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-12">
            <div data-aos="fade-left" className="md:col-span-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">eVizor <span className="text-purple-700">FAQ</span></h2>
              <p className="text-slate-500 leading-relaxed mb-3">
                Find answers to common questions about eVizor, virtual consultations, and using the app with ease.
              </p>
              <p className="text-slate-500">
                For more information, please{" "}
                <button onClick={() => scrollTo("contacts")} className="text-purple-700 font-medium hover:underline">
                  contact us
                </button>
              </p>
            </div>
            <div data-aos="fade-right" data-aos-delay="150" className="md:col-span-3 space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    <span className="pr-4 text-sm">{f.q}</span>
                    <svg className={`size-4 shrink-0 text-purple-600 transition-transform ${openFaq === f.id ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  {openFaq === f.id && (
                    <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section id="testimonial" className="py-24 relative overflow-hidden" style={{ background: "#eae9fb" }}>
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/testimonial-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">What our <span className="text-purple-700">clients say!</span></h2>
            <p className="text-slate-500 mb-12">Stories from people who chose eVizor for easier healthcare.</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200" className="relative min-h-[200px]">
            {testimonials.map((t, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === testimonialIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <Image src="/images/quote-icon.png" alt="quote" width={40} height={30} className="mx-auto mb-6 opacity-60" />
                <blockquote className="text-slate-600 text-lg italic leading-relaxed mb-6">
                  "{t.text}"
                </blockquote>
                <h6 className="font-semibold text-slate-800 mb-3">{t.name}</h6>
                <div className="mx-auto size-14 rounded-full overflow-hidden border-4 border-white shadow">
                  <Image src={t.avatar} alt={t.name} width={56} height={56} className="size-full object-cover" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-16">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} className={`size-2.5 rounded-full transition-all ${i === testimonialIdx ? "bg-purple-700 w-6" : "bg-slate-300"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section id="contacts" className="py-24 bg-linear-to-br from-purple-900 via-purple-700 to-indigo-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Get In Touch</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Form */}
            <div data-aos="fade-left" className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Contact Us</h3>
              <p className="text-slate-500 text-sm mb-6">Working contact form along send mail feature with contact form validation.</p>
              <form className="space-y-4 text-left">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none" />
                  <input type="email" placeholder="Email *" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Phone Number *" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none" />
                  <input type="text" placeholder="Subject *" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none" />
                </div>
                <textarea placeholder="Messages *" rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full rounded-full bg-purple-700 text-white py-3 text-sm font-semibold hover:bg-purple-800 transition-colors">
                  Submit
                </button>
              </form>
            </div>

            {/* Info */}
            <div data-aos="fade-right" data-aos-delay="150" className="flex flex-col gap-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-xl">✉️</span>
                    <span className="text-sm">example@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-xl">📞</span>
                    <span className="text-sm">(+123) 456-7890</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-xl">📍</span>
                  <span className="text-sm">217 Summit Boulevard, Birmingham, AL 35243</span>
                </div>
              </div>
              <div className="flex-1 bg-white/10 rounded-2xl overflow-hidden border border-white/20 min-h-[200px] flex items-center justify-center">
                <p className="text-white/50 text-sm">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-10">
        <div data-aos="fade-in" className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm text-slate-400 hover:text-white transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4 mb-6">
            {["facebook", "twitter", "google-plus", "pinterest", "linkedin", "instagram"].map((s) => (
              <a key={s} href="#" className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-purple-700 hover:text-white transition-colors text-xs font-bold">
                {s[0].toUpperCase()}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-slate-500">
            <span>eVizor © {new Date().getFullYear()}</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
