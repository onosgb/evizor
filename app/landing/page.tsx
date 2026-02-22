"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

const howItWorksSteps = [
  {
    id: "step1",
    label: "1. Get Started",
    title: "Create Your Account",
    desc: "Sign up securely and set up your profile in minutes to access licensed medical professionals instantly.",
  },
  {
    id: "step2",
    label: "2. Describe Symptoms",
    title: "Describe Your Symptoms",
    desc: "Provide details about your condition and upload photos or medical documents if needed.",
  },
  {
    id: "step3",
    label: "3. Join Queue",
    title: "Join the Live Queue",
    desc: "Enter the virtual waiting room and get matched with the next available licensed doctor.",
  },
  {
    id: "step4",
    label: "4. Consult Doctor",
    title: "Consult via Video or Chat",
    desc: "Speak with a certified doctor in real time through secure video or chat consultation.",
  },
  {
    id: "step5",
    label: "5. Get Prescription",
    title: "Receive Digital Prescription",
    desc: "Get your diagnosis, treatment plan, and secure digital prescription instantly.",
  },
];

const faqs = [
  {
    id: "faq1",
    q: "How do I get started with eVizor?",
    a: "Getting started is simple. Download the eVizor app, create your account, and you'll be ready to consult a licensed doctor within minutes. No prior setup or lengthy registration is required.",
  },
  {
    id: "faq2",
    q: "How does the virtual queue work?",
    a: "After describing your symptoms, you join a live virtual queue. You'll receive real-time updates on your position and estimated wait time. When it's your turn, you'll be connected to the next available licensed doctor.",
  },
  {
    id: "faq3",
    q: "Are the doctors on eVizor licensed and verified?",
    a: "Yes. All medical professionals on eVizor are fully licensed and verified. We conduct thorough credential checks before any doctor is allowed to practice on the platform.",
  },
  {
    id: "faq4",
    q: "Is my health data secure and private?",
    a: "Absolutely. eVizor uses end-to-end encryption for all consultations and stores your health data with strict security protocols. Your information is never shared without your explicit consent.",
  },
  {
    id: "faq5",
    q: "Can I receive a prescription through eVizor?",
    a: "Yes. After your consultation, the doctor can issue a secure digital prescription that you can download, print, or share directly with a pharmacy.",
  },
];

const testimonials = [
  {
    name: "Moritika Kazuki",
    role: "Finance Manager at Mangan",
    avatar: "/images/user/client-04.jpg",
    title: "No doubt, eVizor is the best!",
    text: "Without a doubt, eVizor stands out as the absolute best. Their exceptional quality, reliability, and doctor service are unmatched. I have complete confidence in the platform.",
  },
  {
    name: "Jimmy Bartney",
    role: "Product Manager at Picko Lab",
    avatar: "/images/user/client-05.jpg",
    title: "It's just incredible!",
    text: "I am extremely delighted with the exceptional service provided by eVizor. Their expert support system, efficient tools, and strategic solutions have truly transformed the way I access healthcare.",
  },
  {
    name: "Natasha Romanoff",
    role: "Healthcare Professional",
    avatar: "/images/user/client-07.jpg",
    title: "Satisfied user here!",
    text: "As a satisfied user, I can confidently say that my experience with eVizor has been outstanding. The service, support, and solutions provided have consistently exceeded my expectations.",
  },
  {
    name: "Barbara McIntosh",
    role: "Senior Software Developer",
    avatar: "/images/user/client-03.jpg",
    title: "Best service here!",
    text: "I've tried many services, but none compare to the excellence provided here! From start to finish, the team has been attentive, professional, and committed to delivering the best results.",
  },
];

const blogPosts = [
  {
    img: "/images/blog/05.jpg",
    title: "The Future of Virtual Healthcare: What Patients Need to Know",
    excerpt: "Virtual healthcare is reshaping the way patients interact with medical professionals. Discover how eVizor is leading the charge in making quality care accessible to everyone...",
    author: "Dr. Samuel Akin",
    authorImg: "/images/user/client-05.jpg",
    date: "Feb 10",
  },
  {
    img: "/images/blog/07.jpg",
    title: "How Digital Prescriptions Are Transforming Patient Care",
    excerpt: "Digital prescriptions eliminate delays and paperwork while making it easier for patients to receive and manage their medication details securely from anywhere...",
    author: "Jessica Smith",
    authorImg: "/images/user/client-03.jpg",
    date: "Feb 14",
  },
  {
    img: "/images/blog/04.jpg",
    title: "A Step-by-Step Guide to Your First Virtual Consultation",
    excerpt: "Feeling unsure about your first online doctor visit? We break down everything you need to know to make your virtual consultation smooth, safe, and effective...",
    author: "Petric Camp",
    authorImg: "/images/user/client-03.jpg",
    date: "Feb 18",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [activeStep, setActiveStep] = useState("step1");
  const [openFaq, setOpenFaq] = useState<string | null>("faq1");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const testimonialsLength = testimonials.length;
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    testimonialIntervalRef.current = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % testimonialsLength),
      5000
    );
    return () => {
      if (testimonialIntervalRef.current) clearInterval(testimonialIntervalRef.current);
    };
  }, [testimonialsLength]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const prevTestimonial = () => {
    if (testimonialIntervalRef.current) clearInterval(testimonialIntervalRef.current);
    setTestimonialIdx((i) => (i - 1 + testimonialsLength) % testimonialsLength);
    testimonialIntervalRef.current = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % testimonialsLength),
      5000
    );
  };

  const nextTestimonial = () => {
    if (testimonialIntervalRef.current) clearInterval(testimonialIntervalRef.current);
    setTestimonialIdx((i) => (i + 1) % testimonialsLength);
    testimonialIntervalRef.current = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % testimonialsLength),
      5000
    );
  };

  const navLinks = [
    { label: "About", id: "about_evizor" },
    { label: "For Patients", id: "for_patient" },
    { label: "For Doctors", id: "for_doctor" },
    { label: "How It Works", id: "how_it_works" },
    { label: "Why Choose Us", id: "why_evizor" },
    { label: "FAQ", id: "faqs" },
    { label: "Blog", id: "blog" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="font-[Poppins,sans-serif] overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 ${
          navScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* Logo */}
            <button onClick={() => scrollTo("home")} className="shrink-0 flex items-center">
              <Image
                src={navScrolled ? "/images/evizor_logo_dark.png" : "/images/evizor_logo_white.png"}
                alt="eVizor"
                width={110}
                height={36}
                className="h-9 w-auto hidden lg:block"
              />
              <Image
                src={navScrolled ? "/images/evizor_logo_dark.png" : "/images/evizor_logo_white.png"}
                alt="eVizor"
                width={110}
                height={36}
                className="h-9 w-auto block lg:hidden"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center justify-center mx-auto gap-1">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className={`text-base font-medium px-2 py-1 capitalize transition-colors hover:text-blue-600 ${
                    navScrolled ? "text-slate-700" : "text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="ms-auto hidden lg:flex gap-2 shrink-0">
              <Link
                href="/login"
                className="py-2 px-6 inline-flex items-center gap-2 rounded-md text-sm text-white bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                LOG IN
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden ml-auto p-2 rounded-md ${navScrolled ? "text-slate-700" : "text-white"}`}
              aria-label="Toggle menu"
            >
              <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="block w-full text-left text-sm text-slate-700 py-2.5 px-2 hover:text-blue-600 capitalize font-medium"
                >
                  {l.label}
                </button>
              ))}
              <div className="pt-2">
                <Link
                  href="/login"
                  className="block w-full text-center rounded-md bg-emerald-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  LOG IN
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative pt-44 pb-0 bg-[url('/images/home/bg-2.png')] bg-no-repeat bg-cover"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight capitalize">
              Care without limits. <br /> See a doctor in minutes
            </h1>
            <p className="text-base font-medium text-white/90 leading-7 mt-4 max-w-xl mx-auto capitalize">
              A secure virtual healthcare platform connecting you to licensed doctors through video, chat, and digital prescriptions.
            </p>
            <div className="flex flex-wrap items-center justify-center mt-9 gap-3">
              <button className="py-2 px-6 rounded-md text-white text-base bg-blue-600 hover:bg-blue-700 border border-blue-600 transition-all duration-300 font-medium">
                Download
              </button>
              <button
                onClick={() => scrollTo("about_evizor")}
                className="py-2 px-6 text-white rounded-md border border-white text-base hover:bg-white hover:text-blue-700 transition-all duration-300 font-medium"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Dashboard screenshot */}
          <div className="bg-white/30 px-4 pt-4 mt-16 rounded-t-xl mx-auto max-w-5xl">
            <Image
              src="/images/dashboard-1.png"
              alt="eVizor dashboard"
              width={1200}
              height={700}
              className="rounded-t-lg mx-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────── */}
      <section id="about_evizor" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="flex items-center justify-center">
              <Image
                src="/images/about.png"
                alt="About eVizor"
                width={520}
                height={650}
                className="rounded-xl max-h-[650px] w-auto"
              />
            </div>

            <div className="lg:pl-6">
              <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">ABOUT eVIZOR</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-black mt-4">Healthcare Without Boundaries</h2>
              <p className="text-lg font-medium mt-4 text-slate-500 leading-relaxed">
                eVizor envisions a future where quality healthcare is not limited by location, time, or infrastructure. By combining trusted medical expertise with smart digital technology, eVizor is making healthcare more connected, responsive, and accessible for everyone.
              </p>

              <hr className="border-gray-200 my-6" />

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Doctor Management</h4>
                  <p className="text-base font-normal text-gray-500 mt-1">Easily onboard, verify, and manage licensed medical professionals across the platform with secure access controls.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 mt-7">
                <div className="w-12 h-12 rounded-full border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Patient Management</h4>
                  <p className="text-base font-normal text-gray-500 mt-1">Access patient records, monitor consultations, and streamline communication in one centralized system.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 mt-7">
                <div className="w-12 h-12 rounded-full border border-dashed border-blue-300 bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Prescription Management</h4>
                  <p className="text-base font-normal text-gray-500 mt-1">Create, send, and track digital prescriptions securely with integrated clinical workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Patient ─────────────────────────────────────────────── */}
      <section id="for_patient" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">For Patient</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-black mt-4">Fast, Simple Access to Quality Care</h2>
            <p className="text-lg font-medium mt-4 text-slate-500">
              eVizor makes accessing healthcare simple and fast. Patients can describe their symptoms, upload photos or medical documents, and join a live virtual queue to consult a licensed doctor within minutes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 md:gap-y-16 lg:gap-y-20 md:pt-16 pt-12">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                ),
                title: "Virtual Doctor Visits",
                desc: "Consult licensed doctors from anywhere through easy, on-demand virtual appointments.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Live Virtual Queue",
                desc: "Patients can join a live consultation queue and receive real-time updates on wait times and position.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: "Smart Symptom Intake",
                desc: "Before the consultation begins, patients can describe their symptoms using guided forms, severity indicators, and free-text notes.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                ),
                title: "Upload Symptoms & Images",
                desc: "Share symptoms, photos, videos, or medical documents to help doctors better understand your condition.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                title: "Secure Video Consultations",
                desc: "Connect through encrypted, high-quality video calls that protect your privacy.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                title: "Digital Prescriptions",
                desc: "Receive prescriptions instantly after your consultation, ready to download or share.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center bg-blue-600 rounded-[49%_80%_40%_90%/50%_30%_70%_80%] h-20 w-20">
                    {f.icon}
                  </div>
                </div>
                <div className="px-3 mt-4">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-base text-gray-500 mt-2">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Parallax Banner ─────────────────────────────────────── */}
      <section
        className="relative py-20 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/images/home/parallax.png')" }}
      >
        <div className="absolute inset-0 w-full h-full bg-gray-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Talk to a Doctor Now</h2>
            <p className="text-lg font-normal max-w-xl text-white/90 mt-5 leading-relaxed">
              Access licensed medical professionals through secure video consultations, receive digital prescriptions instantly, and manage your health records safely — all from the comfort of your home.
            </p>
            <div className="flex flex-wrap mt-6 gap-3 justify-center">
              <button className="py-2 px-6 rounded-md text-white text-base bg-blue-600 hover:bg-blue-700 border border-blue-600 transition-all duration-300 font-medium">
                Download Now
              </button>
              <button
                onClick={() => scrollTo("how_it_works")}
                className="py-2 px-6 rounded-md border border-white text-base hover:bg-white hover:text-blue-700 transition-all duration-300 font-medium text-white"
              >
                Learn How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Doctor ──────────────────────────────────────────────── */}
      <section id="for_doctor" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div className="lg:pr-6">
              <span className="text-sm text-emerald-600 uppercase font-semibold tracking-wider">For Doctor</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-black mt-4">Fast Access to Trusted Doctors</h2>
              <p className="text-lg font-normal text-slate-500 mt-5 leading-relaxed">
                eVizor equips doctors with efficient tools to deliver high-quality virtual care. Clinicians can view a live patient queue, preview symptoms and uploaded files before consultations, and conduct secure video visits.
              </p>

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-9">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                    ),
                    title: "Live Patient Queue",
                    desc: "Monitor incoming patients in real time with symptom summaries and estimated wait times.",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    ),
                    title: "Secure Video Consultations",
                    desc: "Deliver encrypted, high-quality video visits directly from a centralized web dashboard.",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    ),
                    title: "Real-Time Clinical Notes",
                    desc: "Capture structured consultation notes efficiently with automatic saving and organization.",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                    ),
                    title: "E-Prescriptions & Case Management",
                    desc: "Generate digital prescriptions and manage patient cases seamlessly from intake to resolution.",
                  },
                ].map((f) => (
                  <div key={f.title}>
                    <div className="flex items-center justify-start">
                      <div className="flex items-center justify-center bg-emerald-500 rounded-full h-16 w-16">
                        {f.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mt-5">{f.title}</h3>
                    <p className="text-base text-gray-500 font-normal mt-2">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/images/feature-iphone.png"
                alt="eVizor doctor app"
                width={420}
                height={600}
                className="rounded-xl max-h-[600px] w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section id="how_it_works" className="py-20" style={{ background: "#2a27c2" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-base text-white uppercase font-semibold tracking-wider">How it works</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-4">Step-by-Step Guide to eVizor</h2>
            <p className="text-base max-w-xl mx-auto mt-5 text-blue-100">
              Fast, secure, and seamless virtual consultations—bringing professional healthcare directly to you.
            </p>
          </div>

          <div className="mt-12">
            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {howItWorksSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeStep === step.id
                      ? "bg-white text-blue-700 shadow-md"
                      : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-2xl mx-auto text-center bg-white shadow-xl rounded-xl">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.id}
                  className={`py-10 px-8 transition-all duration-300 ${
                    activeStep === step.id ? "block" : "hidden"
                  }`}
                >
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────── */}
      <section id="why_evizor" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">Why Choose eVizor</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-black mt-4">Better Care Starts Here</h2>
            <p className="text-lg font-medium mt-4 text-slate-500">
              Connect with licensed doctors, get prescriptions, and access your medical records—anytime, anywhere.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 md:gap-y-16 lg:gap-y-20 md:pt-16 pt-12">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: "Care Built Around You",
                desc: "No waiting rooms, fast access to trusted doctors, all through a simple and secure mobile app.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Trusted. Secure. Simple.",
                desc: "Private video consultations with licensed professionals, backed by strong security and easy access to care.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                ),
                title: "Quality Care, Without the Wait",
                desc: "See a doctor in minutes through a secure, easy-to-use app—anytime, anywhere.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center bg-blue-600 rounded-[49%_80%_40%_90%/50%_30%_70%_80%] h-20 w-20">
                    {f.icon}
                  </div>
                </div>
                <div className="px-3 mt-4">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-base text-gray-500 mt-2">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────────────── */}
      <section id="faqs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-sm text-blue-600 uppercase font-medium tracking-wider">FAQs</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl divide-y divide-gray-200 shadow-sm overflow-hidden">
            {faqs.map((f) => (
              <div key={f.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="flex justify-between items-center px-5 py-4 w-full text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-base pr-4">{f.q}</span>
                  <svg
                    className={`size-4 shrink-0 text-gray-500 transition-transform duration-300 ${openFaq === f.id ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {openFaq === f.id && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-500 text-base font-normal leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section id="testimonial" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">Our Clients</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4">Stories From Our Customers</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Slides */}
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl border border-gray-200 transition-all duration-500 ${
                    i === testimonialIdx || i === (testimonialIdx + 1) % testimonialsLength
                      ? "opacity-100"
                      : "opacity-0 hidden md:block md:opacity-0 md:pointer-events-none"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
                  <p className="text-sm font-normal mt-3 mb-4 text-slate-500 leading-relaxed">{t.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-blue-600">{t.name}</h4>
                      <p className="text-xs font-medium mt-0.5 text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={prevTestimonial}
                className="h-11 w-11 rounded-full shadow border border-gray-300 bg-gray-100 text-gray-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="h-11 w-11 rounded-full shadow border border-gray-300 bg-gray-100 text-gray-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted Companies ───────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Trusted by Leading Companies</h2>
          </div>

          <div className="grid md:grid-cols-6 grid-cols-3 justify-center gap-8 items-center">
            {["amazon", "google", "lenovo", "paypal", "shopify", "spotify"].map((brand) => (
              <div key={brand} className="mx-auto py-2 flex items-center justify-center">
                <Image
                  src={`/images/client/${brand}.svg`}
                  alt={brand}
                  width={100}
                  height={40}
                  className="h-9 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────────────────── */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">Blog</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4">Check the latest news about eVizor in our blog.</h2>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {blogPosts.map((post, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={post.img} alt={post.title} fill className="object-cover" />
                </div>
                <div className="py-6 px-6">
                  <a href="#" className="text-lg text-black font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                  <p className="mt-3 mb-5 text-gray-500 text-sm leading-6 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0">
                        <Image src={post.authorImg} alt={post.author} fill className="object-cover" />
                      </div>
                      <a href="#" className="text-black text-sm font-semibold hover:text-blue-600 transition-colors">
                        {post.author}
                      </a>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div>
              <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider">Contact Us</span>
              <h2 className="text-3xl md:text-4xl font-semibold mt-4">We&apos;re open to talk to good people.</h2>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start mt-10">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">123 King Street, London W60 10250</p>
                  <a href="#" className="text-xs text-blue-600 font-bold uppercase">See more</a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start mt-8">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">support@evizor.com</p>
                  <a href="mailto:support@evizor.com" className="text-xs text-blue-600 font-bold uppercase">Say hello</a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start mt-8">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">(+01) 1234 5678 00</p>
                  <a href="tel:+011234567800" className="text-xs text-blue-600 font-bold uppercase">Call now</a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:ms-10">
              <div className="p-6 md:p-10 rounded-xl shadow-lg bg-white">
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="Your first name..."
                        className="block w-full text-sm rounded-md py-3 px-4 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Your last name..."
                        className="block w-full text-sm rounded-md py-3 px-4 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Your email..."
                        className="block w-full text-sm rounded-md py-3 px-4 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Phone Number</label>
                      <input
                        type="text"
                        placeholder="Type phone number..."
                        className="block w-full text-sm rounded-md py-3 px-4 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-black mb-2">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Type your message..."
                        className="block w-full text-sm rounded-md py-3 px-4 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 resize-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-7 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-medium text-sm"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-4 bg-[#1C2940]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-sm text-white">eVizor &copy; {new Date().getFullYear()}</p>
            <div className="flex items-center gap-1">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="h-8 w-8 inline-flex justify-center items-center rounded-md text-white hover:bg-blue-600 transition-all duration-300">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#" aria-label="Twitter" className="h-8 w-8 inline-flex justify-center items-center rounded-md text-white hover:bg-blue-600 transition-all duration-300">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="h-8 w-8 inline-flex justify-center items-center rounded-md text-white hover:bg-blue-600 transition-all duration-300">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" aria-label="GitHub" className="h-8 w-8 inline-flex justify-center items-center rounded-md text-white hover:bg-blue-600 transition-all duration-300">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
