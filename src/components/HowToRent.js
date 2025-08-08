// components/HowToRent.js
"use client";

import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export default function HowToRent() {
  const steps = [
    {
      id: "01",
      title: "Konsultasi",
      subtitle: "WhatsApp Admin",
      description:
        "Diskusikan kebutuhan detail acara Anda dengan tim profesional kami",
      icon: ChatBubbleLeftRightIcon,
      image:
        "https://imgsrv2.voi.id/CIr-uKm0lGrzoKPl6TwDkReqLuDKtLnPXKchbdywPL4/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy8xMDQ4MjIvdm9pLWNhcmEtY2VrLWtvbnRhay13aGF0c2FwcC15YW5nLXNlcmluZy1jaGF0LmpwZw.jpg",
      features: [
        "Konsultasi 24/7",
        "Estimasi Real-time",
        "Rekomendasi Expert",
        "Survey Lokasi",
      ],
      accent: "from-violet-600 to-purple-600",
      bgAccent: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      id: "02",
      title: "Reservasi",
      subtitle: "Booking & Payment",
      description:
        "Amankan jadwal dan peralatan dengan sistem booking yang mudah dan aman",
      icon: CreditCardIcon,
      image:
        "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit%2Cfl_lossy%2Ch_9000%2Cw_1200%2Cf_auto%2Cq_auto/8103728/225639_419736.jpeg",
      features: [
        "Booking Instan",
        "Payment Fleksibel",
        "Garansi Jadwal",
        "Konfirmasi Otomatis",
      ],
      accent: "from-emerald-600 to-teal-600",
      bgAccent: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "03",
      title: "Eksekusi",
      subtitle: "Setup & Support",
      description:
        "Tim ahli kami menangani instalasi dan memberikan support penuh selama acara",
      icon: TruckIcon,
      image:
        "https://theoneupgroup.com/wp-content/uploads/2023/06/Rigging-Staging-The-One-Up-Group-scaled.jpeg",
      features: [
        "Delivery Tepat Waktu",
        "Setup Profesional",
        "Technical Support",
        "Pickup Service",
      ],
      accent: "from-orange-600 to-red-600",
      bgAccent: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-orange-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-50/30 to-teal-50/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Advanced Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Tiga Tahap Menuju
            <br />
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Acara Sempurna
            </span>
          </h2>

          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Pengalaman menyewa multimedia yang dirancang untuk memberikan
              hasil terbaik dengan proses yang efisien dan profesional
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* Advanced Step Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-12 lg:gap-20`}
              >
                {/* Content Side */}
                <div className="flex-1 space-y-8">
                  {/* Step Number with Advanced Design */}
                  <div className="flex items-center space-x-6">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`relative w-20 h-20 bg-gradient-to-br ${step.accent} rounded-2xl flex items-center justify-center shadow-xl group overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="text-2xl font-bold text-white relative z-10">
                        {step.id}
                      </span>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full"></div>
                    </motion.div>

                    <div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p
                        className={`text-lg font-semibold bg-gradient-to-r ${step.accent} bg-clip-text text-transparent`}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    {step.description}
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {step.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center space-x-3 p-4 ${step.bgAccent} rounded-xl border border-white/50 hover:shadow-md transition-all duration-300`}
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${step.accent} rounded-full`}
                        ></div>
                        <span className="text-gray-700 font-medium text-sm">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      className={`inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r ${step.accent} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                      <step.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Mulai {step.title}</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                {/* Visual Side */}
                <div className="flex-1 relative">
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative group"
                  >
                    {/* Main Image Container */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                      {/* Floating Icon */}
                      <div className="absolute bottom-6 left-6">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                          <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div
                      className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${step.accent} opacity-20 rounded-2xl -z-10 group-hover:rotate-12 transition-transform duration-500`}
                    ></div>
                    <div
                      className={`absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br ${step.accent} opacity-10 rounded-3xl -z-10 group-hover:-rotate-6 transition-transform duration-500`}
                    ></div>
                  </motion.div>

                  {/* Connection Line to Next Step */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                      viewport={{ once: true }}
                      className="hidden lg:block absolute -bottom-10 left-1/2 w-0.5 h-20 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2 origin-top"
                    ></motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          {/* Service Area Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="inline-block bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-xl px-6 py-3">
              <p className="text-amber-800 font-medium">
                <span className="font-bold">Area Layanan:</span> Yogyakarta,
                Bantul, Sleman, Gunung Kidul, Kulonprogo
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
