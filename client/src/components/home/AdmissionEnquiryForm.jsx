import axios from "axios";
import { X, GraduationCap, User, Users, Calendar, Phone, Mail, MapPin, Award } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../assets/constant";
import rmcp_campus from "../../assets/img/rmcp_campus.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdmissionEnquiryForm = ({ setShowEnq }) => {
  const [formData, setFormData] = useState({
    admissionClass: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dateOfBirth: "",
    fatherMobile: "",
    email: "",
    category: "",
    lastSchoolAttended: "",
    fatherOccupation: "",
    motherOccupation: "",
    address: "",
    referredBy: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.admissionClass ||
      !formData.studentName ||
      !formData.fatherName ||
      !formData.motherName ||
      !formData.gender ||
      !formData.dateOfBirth ||
      !formData.fatherMobile ||
      !formData.email ||
      !formData.category ||
      !formData.lastSchoolAttended ||
      !formData.fatherOccupation ||
      !formData.motherOccupation ||
      !formData.address ||
      !formData.referredBy
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }
    const toastId = toast.loading("Submitting Enquiry...");
    try {
      await axios.post(`${API}/api/enquiry`, formData).then((res) => {
        if (res.status === 201) {
          toast.update(toastId, {
            render: "Enquiry form submitted successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          if (setShowEnq) {
            setShowEnq(false);
          } else {
            navigate("/");
          }
        } else {
          throw new Error("failed to submit the enquiry");
        }
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to Submit Enquiry!",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      console.log("failed to submit the query", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6 overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${rmcp_campus})`,
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 relative my-8 max-h-[90vh] flex flex-col overflow-hidden"
      >
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 font-heading leading-tight">Admission Enquiry</h2>
              <p className="text-xs text-slate-500 font-medium">Academic Session {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEnq ? setShowEnq(false) : navigate("/")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Academic details */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block border-b border-slate-100 pb-1.5">1. Academic Preference</span>
              
              <div>
                <label htmlFor="admissionClass" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Admission Sought For Class *
                </label>
                <select
                  id="admissionClass"
                  name="admissionClass"
                  value={formData.admissionClass}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  required
                >
                  <option value="">-- Select Class --</option>
                  <option value="P.N.C">P.N.C</option>
                  <option value="N.C">N.C</option>
                  <option value="K.G">K.G</option>
                  {[...Array(12).keys()].map(i => (
                    <option key={i+1} value={String(i+1)}>{i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Student details */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue-light block border-b border-slate-100 pb-1.5">2. Student Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="studentName" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Gender *
                  </label>
                  <div className="flex gap-4 py-2.5">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="form-radio text-brand-blue focus:ring-brand-blue"
                        required
                      />
                      <span className="ml-2 text-sm text-slate-600 font-medium">Male</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="form-radio text-brand-blue focus:ring-brand-blue"
                        required
                      />
                      <span className="ml-2 text-sm text-slate-600 font-medium">Female</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="GENERAL">GENERAL</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="MINORITY">MINORITY</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lastSchoolAttended" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Last School Attended
                  </label>
                  <input
                    type="text"
                    id="lastSchoolAttended"
                    name="lastSchoolAttended"
                    value={formData.lastSchoolAttended}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Family details */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block border-b border-slate-100 pb-1.5">3. Parents Information</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fatherName" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="motherName" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Mother's Name *
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fatherOccupation" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Father's Occupation
                  </label>
                  <select
                    id="fatherOccupation"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  >
                    <option value="">Select Occupation</option>
                    <option value="Business">Business</option>
                    <option value="Govt.Employee">Govt. Employee</option>
                    <option value="Army">Army</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Private Job">Private Job</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="motherOccupation" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Mother's Occupation
                  </label>
                  <select
                    id="motherOccupation"
                    name="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  >
                    <option value="">Select Occupation</option>
                    <option value="Housewife">Housewife</option>
                    <option value="Govt.Employee">Govt. Employee</option>
                    <option value="Private Job">Private Job</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Contacts & Address */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue-light block border-b border-slate-100 pb-1.5">4. Communication Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fatherMobile" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Father's Mobile No. *
                  </label>
                  <input
                    type="tel"
                    id="fatherMobile"
                    name="fatherMobile"
                    value={formData.fatherMobile}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Permanent Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all resize-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="referredBy" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Referred By
                  </label>
                  <input
                    type="text"
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button Container */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-base hover:bg-brand-orange-dark shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Submit Enquiry Form
              </button>
            </div>

          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default AdmissionEnquiryForm;
