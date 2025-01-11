"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-indigo-100">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 text-indigo-100"
              >
                <div className="bg-indigo-600 p-3 rounded-full">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-200">Call Us</p>
                  <a href="tel:0780077368" className="text-lg hover:underline">
                    078 007 7368
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 text-indigo-100"
              >
                <div className="bg-indigo-600 p-3 rounded-full">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-200">
                    Email Us
                  </p>
                  <a
                    href="mailto:wesleyolivier443@gmail.com"
                    className="text-lg hover:underline"
                  >
                    wesleyolivier443@gmail.com
                  </a>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 text-indigo-100"
              >
                <div className="bg-indigo-600 p-3 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-200">
                    Visit Us
                  </p>
                  <p className="text-lg">Durban, South Africa</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-full min-h-[400px] rounded-2xl overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src="https://img.freepik.com/free-photo/high-tech-portrait-young-girl-with-futuristic-style_23-2151133545.jpg?t=st=1736624403~exp=1736628003~hmac=e2c12d19c44c4e835c1d9a1913d90279d84eeb75c283a9beee02d8b39cfa01b8&w=2000"
                alt="Contact"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 " />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
