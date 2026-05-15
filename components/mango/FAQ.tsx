"use client";

import { useState } from "react";
import { Plus, Phone, MessageCircle } from "lucide-react";

const FAQS = [
  {
    q: "আম কি কার্বাইড বা ফরমালিন মুক্ত?",
    a: "হ্যাঁ, ১০০% নিশ্চিত। আমাদের সব আম প্রাকৃতিকভাবে গাছে পাকানো। কোনো রাসায়নিক, কার্বাইড বা ফরমালিন ব্যবহার করা হয় না। আপনি চাইলে পরীক্ষাও করতে পারেন।",
  },
  {
    q: "ডেলিভারিতে কত সময় লাগবে?",
    a: "আম রাজশাহী থেকে সরাসরি পাঠানো হয়, তাই ডেলিভারিতে সাধারণত ৪-৫ কার্যদিবস লাগে। ঢাকা ও আশেপাশের জেলায় ৩-৪ দিন, দূরবর্তী জেলায় ৫-৭ দিন লাগতে পারে। সঠিক ডেলিভারি তারিখ অর্ডার কনফার্মের সময় জানিয়ে দেওয়া হবে।",
  },
  {
    q: "পেমেন্ট কীভাবে করব?",
    a: "অর্ডার কনফার্ম হওয়ার পর মোট মূল্যের ৫০% অগ্রিম bKash বা Nagad-এ পাঠাতে হবে। বাকি ৫০% ডেলিভারির সময় পরিশোধ করতে হবে। পেমেন্ট নিশ্চিত হলে শিপমেন্ট শুরু হয়। ডেলিভারি দুইভাবে পাওয়া যায় — নিকটস্থ সুন্দরবন/AJR কুরিয়ার পয়েন্ট থেকে সংগ্রহ (বিনামূল্যে) অথবা হোম ডেলিভারি (অতিরিক্ত ৳১৫/কেজি)।",
  },
  {
    q: "আম পচা বা খারাপ পেলে কী করব?",
    a: "ডেলিভারির সময়েই প্যাকেট খুলে দেখুন। কোনো আম নষ্ট থাকলে সাথে সাথে ডেলিভারি ব্যক্তিকে জানান অথবা ২৪ ঘণ্টার মধ্যে আমাদের কল করুন। ১০০% রিপ্লেসমেন্ট বা টাকা ফেরত পাবেন।",
  },
  {
    q: "কাঁচা না পাকা আম পাবো?",
    a: 'ডিফল্ট হিসেবে আমরা আধা-পাকা আম পাঠাই, যাতে ১-২ দিনে সম্পূর্ণ পেকে যায়। আপনি চাইলে অর্ডার নোটে "একদম পাকা" বা "কাঁচা" উল্লেখ করতে পারেন।',
  },
  {
    q: "সর্বনিম্ন কত কেজি অর্ডার করতে হবে?",
    a: "সর্বনিম্ন ১০ কেজি অর্ডার করতে হবে। নিকটস্থ কুরিয়ার পয়েন্ট থেকে সংগ্রহ করলে ডেলিভারি সম্পূর্ণ বিনামূল্যে। হোম ডেলিভারিতে অতিরিক্ত ৳১৫/কেজি চার্জ প্রযোজ্য।",
  },
  {
    q: "কোন কোন এলাকায় ডেলিভারি দেন?",
    a: "বাংলাদেশের সব জেলায় ডেলিভারি দিই। ঢাকার ভেতরে নিজস্ব ডেলিভারি টিম, ঢাকার বাইরে কুরিয়ার সার্ভিসের মাধ্যমে।",
  },
  {
    q: "অর্ডার ক্যানসেল করতে পারব?",
    a: "প্যাকিং শুরু হওয়ার আগ পর্যন্ত যেকোনো সময় ক্যানসেল করতে পারবেন। হোয়াটসঅ্যাপ বা কলে জানালেই হবে।",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
            <p className="text-sm font-medium">সাধারণ প্রশ্ন</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-3">
            আপনার <span className=" text-primary">প্রশ্নের</span> উত্তর
          </h2>
          <p className="text-foreground/65">
            যা জানতে চান — সবকিছুর উত্তর এখানে
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`bg-card rounded-xl overflow-hidden border ${
                  isOpen
                    ? "border-primary/40 card-elevated"
                    : "border-border/60"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-muted/30"
                >
                  <span className="font-medium text-foreground text-base sm:text-lg flex-1">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-primary text-primary-foreground rotate-45"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-display px-5 sm:px-6 pb-5 text-foreground/75 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-muted/40 rounded-2xl p-7 border border-border/40">
          <p className="font-display text-2xl font-medium text-foreground mb-2">
            আরো প্রশ্ন আছে?
          </p>
          <p className="text-sm text-foreground/65 mb-5">
            আমাদের সাথে সরাসরি যোগাযোগ করুন — সাহায্য করতে প্রস্তুত
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+8801708467621"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90"
            >
              <Phone className="w-4 h-4" />
              01708467621
            </a>
            <a
              href="https://wa.me/8801708467621?text=আমার%20অর্ডার%20সম্পর্কে%20সাহায্য%20দরকার"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90"
            >
              <MessageCircle className="w-4 h-4" />
              হোয়াটসঅ্যাপ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
