import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import { 
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, History, 
  MessageCircle, CreditCard, ChevronRight, CheckCircle2, Clock, 
  X, AlertCircle, CheckCircle, ArrowRight
} from 'lucide-react';


export default function StudentWallet() {
    const { user } = useAuth();
  // رقم الواتساب الخاص بالدعم/الشحن (استبدله برقمك أو رقم المنصة)
  const WHATSAPP_NUMBER = "201559039258"; 
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0); // الرصيد الحالي   
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState('vodafone_cash'); // vodafone_cash | instapay

  // سجل المعاملات المالية
  const [transactions, setTransactions] = useState([]);
  const [loadingWallet, setLoadingWallet] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
        try {
        setLoadingWallet(true);

        const response = await api.get(
            "/courses/wallet/transactions/"
        );

        setBalance(Number(response.data.balance || 0));
        setTransactions(response.data.transactions || []);

        } catch (error) {
        console.error("Wallet Error:", error);
        } finally {
        setLoadingWallet(false);
        }
    };
    fetchWallet();
  }, []);
  // التحويل للواتساب مع رسالة تلقائية مجهزة

    
    const handleGoToWhatsApp = (e) => {
        e.preventDefault();

        if (!depositAmount || Number(depositAmount) <= 0) return;

        const methodName =
            paymentMethod === "vodafone_cash"
            ? "فودافون كاش"
            : "InstaPay";

        const studentName =
            `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
            user?.username ||
            "غير محدد";

        const message = `السلام عليكم ورحمة الله وبركاته 👋

        أرغب في شحن رصيدي في منصة عِلّْم التعليمية.

        📚 بيانات الطالب:
        👤 الاسم: ${studentName}
        🔹 اسم المستخدم: ${user?.username || "غير محدد"}
        📱 رقم الهاتف: ${user?.phone_number || "غير محدد"}

        💰 مبلغ الشحن: ${depositAmount} جنيه
        💳 طريقة الدفع: ${methodName}

        📌 أرجو تزويدي بتفاصيل التحويل المطلوبة، وبعد إتمام التحويل سأرسل لحضراتكم إثبات الدفع لتأكيد عملية الشحن.

        شكراً لحضراتكم ❤️
        منصة عِلّْم التعليمية 🎓`;

        const encodedMessage = encodeURIComponent(message);

        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");

    setShowDepositModal(false);
    };





  return (
    <div className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right p-4 md:p-8" dir="rtl">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-amber-100/60 shadow-sm max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#00406E] font-bold text-sm hover:text-[#C5922E] transition"
        >
          <ArrowRight className="w-5 h-5" /> العودة للوحة التحكم
        </button>
        <h1 className="text-base sm:text-lg font-black text-[#00406E] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#C5922E]" /> محفظتي المالية
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Wallet Main Balance Banner */}
        <div className="bg-gradient-to-r from-[#00406E] to-[#002845] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 z-10">
            <span className="text-xs font-bold text-amber-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 inline-block">
              الرصيد المتاح حالياً
            </span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl sm:text-5xl font-black">{balance}</span>
              <span className="text-base font-bold text-amber-300">جنيه مصري</span>
            </div>
            <p className="text-xs text-gray-300">يمكنك استخدام هذا الرصيد للاشتراك في الكورسات والمحاضرات فوراً.</p>
          </div>

          {/* Deposit Action Button */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="z-10 bg-[#C5922E] hover:bg-amber-600 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm border border-amber-400/30 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> شحن الرصيد (Deposit)
          </button>

          {/* Background Decorative Graphic */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#C5922E]/10 rounded-full blur-2xl"></div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100/60 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-lg font-extrabold text-[#00406E] flex items-center gap-2">
              <History className="w-5 h-5 text-[#C5922E]" /> سجل المعاملات المالية (Transaction History)
            </h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              إجمالي {transactions.length} معاملات
            </span>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="p-4 rounded-2xl border border-gray-100 hover:border-amber-200 bg-white hover:bg-amber-50/20 transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                    <div
                        className={`p-3 rounded-2xl ${
                            tx.type === "DEPOSIT" || tx.type === "REFUND"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                        >
                        {tx.type === "DEPOSIT" || tx.type === "REFUND" ? (
                            <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                            <ArrowUpRight className="w-5 h-5" />
                        )}
                    </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#00406E]">
                        {tx.description || (
                            tx.type === "DEPOSIT"
                            ? "شحن رصيد"
                            : tx.type === "COURSE_PURCHASE"
                            ? "شراء كورس"
                            : "استرداد مبلغ"
                        )}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                        <span>{new Date(tx.created_at).toLocaleDateString("ar-EG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}</span>
                        <span>•</span>
                        <span className="font-mono">{tx.id}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <p
                        className={`font-black text-sm sm:text-base dir-ltr ${
                            tx.type === "DEPOSIT" || tx.type === "REFUND"
                            ? "text-emerald-600"
                            : "text-gray-800"
                        }`}
                        >
                        {tx.type === "DEPOSIT" || tx.type === "REFUND"
                            ? `+${tx.amount}`
                            : `-${tx.amount}`}{" "}
                        ج.م
                    </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle className="w-3 h-3" /> مكتملة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 📱 Deposit Modal (النافذة المنبثقة للتحويل للواتساب) */}
      {/* ----------------------------------------------------------------- */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-100 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-[#00406E] text-base sm:text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#C5922E]" /> طلب شحن محفظة جديد
              </h3>
              <button 
                onClick={() => setShowDepositModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGoToWhatsApp} className="space-y-5">
              
              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#00406E]">المبلغ المراد شحنه (بالجنية المصري):</label>
                <input 
                  type="number" 
                  min="10"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#00406E] focus:outline-none focus:border-[#00406E] focus:ring-1 focus:ring-[#00406E]"
                  placeholder="أدخل المبلغ (مثال: 200)"
                />
                
                {/* Quick Amounts */}
                <div className="flex gap-2 pt-1">
                  {['50', '100', '200', '500'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        depositAmount === amt 
                          ? 'bg-[#00406E] text-white border-[#00406E]' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50'
                      }`}
                    >
                      {amt} ج.م
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Option */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#00406E]">طريقة التحويل المفضلة:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`p-3 rounded-2xl border cursor-pointer text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'vodafone_cash' 
                        ? 'border-[#00406E] bg-amber-50/50 text-[#00406E]' 
                        : 'border-gray-200 hover:border-amber-300 bg-white text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <span>فودافون كاش</span>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-3 rounded-2xl border cursor-pointer text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'instapay' 
                        ? 'border-[#00406E] bg-amber-50/50 text-[#00406E]' 
                        : 'border-gray-200 hover:border-amber-300 bg-white text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span>انستا باي (InstaPay)</span>
                  </label>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-[#C5922E] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  عند الضغط على الزر، سيتم توجيهك لشات الواتساب الخاص بالدعم مباشرة مع رسالة مجهزة بالتفاصيل لتأكيد التحويل والشحن فوراً.
                </p>
              </div>

              {/* WhatsApp Submit Button */}
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-white" /> الانتقال للواتساب لإتمام الشحن
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}