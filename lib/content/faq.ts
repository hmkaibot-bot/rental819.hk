import type { Locale } from "@/lib/i18n";

export interface QA {
  q: string;
  a: string;
}
export interface FaqGroup {
  category: string;
  items: QA[];
}

export const faq: Record<Locale, FaqGroup[]> = {
  "zh-hk": [
    {
      category: "租車資格",
      items: [
        {
          q: "暫準執照（俗稱 P 牌）亦可租車嗎？",
          a: "不能。我們只能向持有正式駕駛執照及有效國際車牌的人士租車。",
        },
        {
          q: "我今年 18 歲，可以租車嗎？",
          a: "可以。18 歲或以上並持有有效國際駕駛執照者，均可租賃 RENTAL819 的電單車。",
        },
        {
          q: "租車一定要會說日語嗎？",
          a: "不用。即使你不會英語或日語，我們的海外自駕客服可為你提供最大限度的傳譯協助。",
        },
      ],
    },
    {
      category: "預約及付款",
      items: [
        {
          q: "租車一定要預約嗎？",
          a: "如你有指定想租的電單車，請盡量提前最少一星期預約，讓我們預先安排。",
        },
        {
          q: "如何支付租車費用？何時支付？",
          a: "租貸者須於頭盔王海外自駕客服發出租車發票後的工作天內，以轉數快或銀行匯款繳付予頭盔王。",
        },
        {
          q: "我沒有信用卡，可以用現金或由朋友代付嗎？",
          a: "租金以轉數快／銀行匯款繳付。惟取車時日本店鋪一般需要出示信用卡作按金及身分核對之用，建議準備至少一張信用卡。",
        },
        {
          q: "我收不到預約的確認電郵",
          a: "確認電郵由系統自動發出，請先檢查垃圾郵件。或可透過 Facebook 或 WhatsApp 向我們查詢。",
        },
      ],
    },
    {
      category: "費用",
      items: [
        {
          q: "油錢有包括在租金裡嗎？",
          a: "油錢需自行負責。取車時油箱是滿的，還車時亦請入滿油，否則我們會收取加油費（費用可能比油站高）。",
        },
        {
          q: "有里程數限制或額外費用嗎？",
          a: "沒有里程限制。所有費用在你租車之先已詳細列明。",
        },
        {
          q: "車子可以行駛自動繳費的高速公路嗎？",
          a: "可以。出發前請聯絡租車店職員租借及安裝 ETC 機及 ETC 卡。高速公路費用於還車時按 ETC 紀錄結算。",
        },
      ],
    },
    {
      category: "保險及意外",
      items: [
        {
          q: "買了保險後，發生事故就不用賠償嗎？",
          a: "不是。每份保單都有免責額，一旦發生意外，客人需支付免責額以內的金額，免責額以上的由保險公司承擔。不同等級的電單車免責額不同，請小心駕駛。",
        },
        {
          q: "發生意外了，我該怎麼做？",
          a: "請進行以下四步：1. 了解狀況、檢查傷勢；2. 報警（110）；3. 聯絡保險公司；4. 聯絡 Rental819 中心。超過營業時間請通知道路救援（ERS），並記得向警察索取事故證明。",
        },
        {
          q: "什麼是電單車「營業損失」（NOC）？",
          a: "若因意外、竊盜、倒車等原因導致車輛需維修而無法出租，客人須負擔營業損失賠償：能自行騎回店家為 20,000 日圓；無法騎回為 50,000 日圓。即使已加購車輛補償，此項仍會額外計算。",
        },
        {
          q: "可以和朋友交換車開嗎？",
          a: "不能。一旦發生事故，因受保對象不同，保險不會作出賠償，敬請留意。",
        },
      ],
    },
    {
      category: "取車及還車",
      items: [
        {
          q: "我可以在營業時間結束後才還車嗎？",
          a: "請於營業時間內還車，否則租車店有權收取逾時費用。",
        },
        {
          q: "逾期還車的費用如何計算？",
          a: "逾時費用因車輛等級而異。若逾期歸還而未提前告知，將會收取罰金。如有特殊情況，請先聯絡我們。",
        },
        {
          q: "租車後可以再延長租借時間嗎？",
          a: "可以，請提前告知取車分店。若你租借的車輛已被下一位客人預約，則須如期歸還，無法延長。",
        },
        {
          q: "可以甲店租車、乙店還車嗎？",
          a: "不可以。請於營業時間內將車輛交還原出租分店。",
        },
        {
          q: "騎車時行李如何處置？",
          a: "大部分分店都可讓你寄存行李，事前請聯絡我們協助安排。",
        },
      ],
    },
    {
      category: "取消政策",
      items: [
        {
          q: "雨天可以取消嗎？",
          a: "如天氣惡劣，可於租車當日早上取消，但事前務必聯絡我們。",
        },
        {
          q: "取消政策是怎樣的？",
          a: "6 天前取消：租車發票總額之 20%；2 天前取消：30%；當日取消：50%。如「未出現（NO SHOW）」，將失去退款資格。各店舖有最終出租決定權。",
        },
      ],
    },
  ],
  en: [
    {
      category: "Eligibility",
      items: [
        {
          q: "Can I rent with a probationary (P) licence?",
          a: "No. We can only rent to holders of a full driving licence with a valid International Driving Permit.",
        },
        {
          q: "I'm 18 — can I rent?",
          a: "Yes. Anyone 18 or older holding a valid International Driving Permit may rent a RENTAL819 motorcycle.",
        },
        {
          q: "Do I need to speak Japanese to rent?",
          a: "No. Even if you speak neither English nor Japanese, our overseas self-drive team provides interpretation support to the fullest extent possible.",
        },
      ],
    },
    {
      category: "Booking & payment",
      items: [
        {
          q: "Do I have to book in advance?",
          a: "If you want a specific motorcycle, please book at least one week ahead so we can arrange it.",
        },
        {
          q: "How and when do I pay?",
          a: "Payment is made to Helmet King by FPS or bank transfer within a few working days after our overseas self-drive team issues your rental invoice.",
        },
        {
          q: "I don't have a credit card — can I pay cash or have a friend pay?",
          a: "Rental fees are paid by FPS/bank transfer. However, the branch in Japan usually requires a credit card at pick-up for deposit and identity verification, so please bring at least one.",
        },
        {
          q: "I didn't receive my confirmation email",
          a: "The confirmation email is sent automatically — please check your spam folder, or reach us on Facebook or WhatsApp.",
        },
      ],
    },
    {
      category: "Fees",
      items: [
        {
          q: "Is fuel included in the rental?",
          a: "Fuel is your responsibility. The tank is full at pick-up; please return it full, otherwise a refuelling charge applies (and it may cost more than a petrol station).",
        },
        {
          q: "Is there a mileage limit or extra charge?",
          a: "There is no mileage limit. All fees are itemised before you rent.",
        },
        {
          q: "Can the bike use electronic-toll expressways?",
          a: "Yes. Before departure, ask the branch staff to rent and fit an ETC unit and ETC card. Expressway tolls are settled from the ETC record when you return the bike.",
        },
      ],
    },
    {
      category: "Insurance & accidents",
      items: [
        {
          q: "If I buy insurance, am I free of any liability in an accident?",
          a: "No. Every policy has a deductible; in an accident you pay up to the deductible and the insurer covers the rest. Deductibles differ by bike class — please ride carefully.",
        },
        {
          q: "What should I do if there's an accident?",
          a: "Take these four steps: 1) assess the situation and check for injuries; 2) call the police (110); 3) contact the insurer; 4) contact the Rental819 centre. Outside business hours, call Emergency Road Service (ERS), and remember to get an accident certificate from the police.",
        },
        {
          q: "What is 'non-operation charge' (NOC)?",
          a: "If an accident, theft or fall means the bike needs repair and can't be rented out, you pay a NOC: 20,000 yen if you can ride it back to the branch, 50,000 yen if you cannot. This is charged in addition to the vehicle-compensation deductible.",
        },
        {
          q: "Can I swap bikes with a friend?",
          a: "No. If an accident occurs, insurance won't pay out because the insured party differs. Please note this.",
        },
      ],
    },
    {
      category: "Pick-up & return",
      items: [
        {
          q: "Can I return the bike after business hours?",
          a: "Please return within business hours, otherwise the branch may charge an overtime fee.",
        },
        {
          q: "How is a late return charged?",
          a: "Overtime fees vary by bike class. If you return late without telling us in advance, a penalty applies. For special circumstances, contact us first.",
        },
        {
          q: "Can I extend the rental after picking up?",
          a: "Yes — tell the pick-up branch in advance. If your bike is already booked by the next customer, you must return it on time and cannot extend.",
        },
        {
          q: "Can I pick up at one branch and return at another?",
          a: "No. Please return the bike to the original branch within business hours.",
        },
        {
          q: "What do I do with luggage while riding?",
          a: "Most branches can store your luggage — please contact us in advance to arrange it.",
        },
      ],
    },
    {
      category: "Cancellation",
      items: [
        {
          q: "Can I cancel on a rainy day?",
          a: "In severe weather you may cancel on the morning of the rental, but you must contact us beforehand.",
        },
        {
          q: "What is the cancellation policy?",
          a: "6 days before: 20% of the invoice total; 2 days before: 30%; same day: 50%. A no-show forfeits any refund. Each branch retains final discretion over rentals.",
        },
      ],
    },
  ],
};
