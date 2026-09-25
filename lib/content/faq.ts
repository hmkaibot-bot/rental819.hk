import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export interface QA {
  q: string;
  a: string;
  /** Locale-less path of the page that answers this in depth (e.g. "/guide/fees"). */
  href?: string;
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
          q: "香港／澳門車牌可以在日本租電單車嗎？要帶甚麼證件？",
          a: "可以。只要持有香港或澳門的正式電單車駕駛執照，並帶同國際駕駛執照（IDP）及護照，三者缺一不可，即可在日本租用 RENTAL819 的電單車；暫準執照（P 牌）恕不受理，租車人須年滿 18 歲。",
          href: "/guide/licence",
        },
        {
          q: "暫準執照（俗稱 P 牌）亦可租車嗎？",
          a: "不能。我們只能向持有正式駕駛執照及有效國際車牌的人士租車。",
          href: "/guide/licence",
        },
        {
          q: "我今年 18 歲，可以租車嗎？",
          a: "可以。只要年滿 18 歲，並同時持有香港／澳門正式駕駛執照、有效國際駕駛執照（IDP）及護照，即可租賃 RENTAL819 的電單車；暫準執照（P 牌）恕不受理。",
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
          a: "租貸者須於頭盔王海外自駕客服發出租車發票後的三個工作天內，以轉數快或銀行匯款繳付予頭盔王。",
          href: "/guide/fees",
        },
        {
          q: "我沒有信用卡，可以用現金或由朋友代付嗎？",
          a: "租金以轉數快／銀行匯款繳付。惟取車時日本店鋪一般需要出示信用卡作按金及身分核對之用，建議準備至少一張信用卡。",
        },
        {
          q: "香港 Rental819 與日本 Rental819 的租車費用有分別嗎？",
          a: "沒有分別，租金與日本相同。透過香港頭盔王預約，更可享免費中文咨詢及全程協助安排，毋須額外收費。",
        },
        {
          q: "我收不到預約的確認電郵",
          a: "確認電郵由系統自動發出，請先檢查垃圾郵件。或可透過 Facebook 或 WhatsApp 向我們查詢。",
        },
        {
          q: "自駕套票包括機票及住宿嗎？",
          a: `自駕套票分兩種：「機票＋電單車」（不含住宿，3日2夜起）及「機票＋住宿連早餐＋電單車」（5日4夜；沖繩為 4日3夜），兩者均包括香港來回經濟客位機票。套票價格不包括香港及當地離境稅、香港機場保安稅、旅遊保險及燃油附加費。套票由 ${site.travelAgent.name}（旅行代理商牌照號碼 ${site.travelAgent.licence}）提供。`,
          href: "/packages",
        },
      ],
    },
    {
      category: "車輛選擇",
      items: [
        {
          q: "可以指定車款的年份及顏色嗎？",
          a: "車輛的年份及顏色有可能會變更，未必能完全指定。如你有特別需要，請於預約時提早告知，我們會盡量為你安排。",
        },
        {
          q: "可以車人（搭載乘客）嗎？",
          a: "以下情況不能搭載乘客：50cc 或以下，或車輛登記文件列明只有一個座位的車輛；首都高速公路部分路線（例如中央環狀線、灣岸線）。另外，租用 125cc 以下車款時，強制保險的乘客傷亡賠償不予支付。",
          href: "/guide/traffic-rules",
        },
      ],
    },
    {
      category: "費用",
      items: [
        {
          q: "日本租電單車一天要多少錢？",
          a: "以 1 天（24 小時）計，P-1 至 P-7 級參考租金由 HK$295 至 HK$1,765，第 2 天起每天 HK$195 至 HK$1,175；已包含強制及任意保險，但不包括燃油、高速公路費及泊車。車輛損傷補償及裝備另計，最終報價以預約確認為準。",
          href: "/guide/fees",
        },
        {
          q: "可以租頭盔及其他裝備嗎？",
          a: "可以。頭盔可預先預約，首天 HK$60，第 2 天起每天 HK$10；尾箱、側袋及側箱亦可預約（供應因車款而異），手機架免費。手套、防摔外套等只供出發日當天於分店租用，以日圓結算。取車時須穿著合適的電單車衣著，包括頭盔、防摔衣、防摔長褲及電單車靴。",
          href: "/guide/gear",
        },
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
          a: "可以，但 125cc 以下的電單車不能行駛高速公路。Rental819 大部分車輛已裝設 ETC 機，ETC 卡因供應有限，請到店取車時向職員查詢；ETC 卡首天租金 220 日圓，高速公路費用於還車時按 ETC 紀錄結算。",
          href: "/guide/etc",
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
          href: "/guide/insurance",
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
          q: "可以在機場取車嗎？",
          a: "預約表格的分店名單包括以機場命名的分店，例如新千歳空港店、関西国際空港店、大阪国際空港店（伊丹空港）、福岡空港店、熊本空港店、鹿児島空港店及那覇空港店；實際取車地點及交通請向我們查詢。租車及還車必須在同一分店。",
        },
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
          href: "/guide/pickup",
        },
        {
          q: "騎車時行李如何處置？",
          a: "大部分分店都可讓你寄存行李，事前請聯絡我們協助安排。",
        },
        {
          q: "可以把自己的車輛停放在租車店嗎？",
          a: "租車店一般沒有多餘空間停放客人的私家車或電單車，建議乘搭公共交通工具前往取車。",
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
          href: "/booking",
        },
      ],
    },
  ],
  en: [
    {
      category: "Eligibility",
      items: [
        {
          q: "Can I rent a motorcycle in Japan with a Hong Kong or Macau licence? What do I need?",
          a: "Yes. Bring your full Hong Kong or Macau motorcycle licence, an International Driving Permit (IDP) and your passport — all three are required. Probationary (P) licences are not accepted, and the renter must be 18 or older.",
          href: "/guide/licence",
        },
        {
          q: "Can I rent with a probationary (P) licence?",
          a: "No. We can only rent to holders of a full driving licence with a valid International Driving Permit.",
          href: "/guide/licence",
        },
        {
          q: "I'm 18 — can I rent?",
          a: "Yes. Anyone 18 or older who holds a full Hong Kong or Macau licence, a valid International Driving Permit (IDP) and a passport may rent a RENTAL819 motorcycle. Probationary (P) licences are not accepted.",
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
          a: "Payment is made to Helmet King by FPS or bank transfer within three working days after our overseas self-drive team issues your rental invoice.",
          href: "/guide/fees",
        },
        {
          q: "I don't have a credit card — can I pay cash or have a friend pay?",
          a: "Rental fees are paid by FPS/bank transfer. However, the branch in Japan usually requires a credit card at pick-up for deposit and identity verification, so please bring at least one.",
        },
        {
          q: "Is the rental fee different between Rental819 Hong Kong and Rental819 Japan?",
          a: "No — the rent is the same as in Japan. Booking through Helmet King in Hong Kong also gives you free Chinese-language consultation and full arrangement support at no extra charge.",
        },
        {
          q: "I didn't receive my confirmation email",
          a: "The confirmation email is sent automatically — please check your spam folder, or reach us on Facebook or WhatsApp.",
        },
        {
          q: "Do self-drive packages include flights and hotels?",
          a: `There are two versions: flight + bike (no hotel, from 3 days / 2 nights) and flight + hotel with breakfast + bike (5 days / 4 nights; 4 days / 3 nights for Okinawa). Both include a return economy flight from Hong Kong. Prices exclude HK and Japanese departure taxes, HK airport security charge, travel insurance and fuel surcharges. Packages are provided by ${site.travelAgent.name} (Travel Agent Licence No. ${site.travelAgent.licence}).`,
          href: "/packages",
        },
      ],
    },
    {
      category: "Choosing a bike",
      items: [
        {
          q: "Can I specify the model year and colour of the bike?",
          a: "The year and colour of the vehicle may change and cannot always be guaranteed. If you have a specific requirement, let us know early when booking and we will do our best to arrange it.",
        },
        {
          q: "Can I carry a passenger?",
          a: "Passengers are not allowed on bikes of 50cc or under, on bikes registered with a single seat, or on some Metropolitan Expressway routes (e.g. the Central Circular and Bayshore routes). On bikes under 125cc, the included insurance does not pay passenger injury or death benefits.",
          href: "/guide/traffic-rules",
        },
      ],
    },
    {
      category: "Fees",
      items: [
        {
          q: "How much does it cost to rent a motorcycle in Japan per day?",
          a: "For 1 day (24 hours), reference rates for classes P-1 to P-7 run from HK$295 to HK$1,765, then HK$195 to HK$1,175 per day from day 2. Compulsory and voluntary insurance are included; fuel, expressway tolls and parking are not. Vehicle-damage compensation and gear are charged separately, and your final quote is confirmed after you book.",
          href: "/guide/fees",
        },
        {
          q: "Can I rent a helmet and other gear?",
          a: "Yes. Helmets can be reserved in advance at HK$60 for the first day and HK$10 per day after that; tail boxes, side bags and side boxes can also be reserved (availability varies by bike), and a phone mount is free. Gloves, jackets and similar items can only be rented at the branch on departure day and are paid in yen. At pick-up you must wear proper riding gear, including a helmet, protective jacket, protective trousers and riding boots.",
          href: "/guide/gear",
        },
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
          a: "Yes, except bikes under 125cc, which may not use expressways. Most Rental819 bikes already have an ETC unit; ETC cards are limited in supply, so ask staff at the branch when you collect the bike. The card costs 220 yen for the first day, and tolls are settled from the ETC record when you return it.",
          href: "/guide/etc",
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
          href: "/guide/insurance",
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
          q: "Can I pick up at an airport?",
          a: "The branch list on our booking form includes branches named after airports — for example New Chitose Airport, Kansai International Airport, Osaka International (Itami) Airport, Fukuoka Airport, Kumamoto Airport, Kagoshima Airport and Naha Airport. Ask us about the exact pick-up location and how to get there. Pick-up and return must be at the same branch.",
        },
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
          href: "/guide/pickup",
        },
        {
          q: "What do I do with luggage while riding?",
          a: "Most branches can store your luggage — please contact us in advance to arrange it.",
        },
        {
          q: "Can I leave my own vehicle parked at the rental shop?",
          a: "Rental shops generally don't have spare space to store customers' cars or motorcycles, so we recommend taking public transport to pick up your bike.",
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
          href: "/booking",
        },
      ],
    },
  ],
};
