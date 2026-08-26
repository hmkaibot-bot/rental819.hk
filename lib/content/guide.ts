import type { Locale } from "@/lib/i18n";
import type { GuideDoc } from "./blocks";

export const guideDocs: Record<Locale, GuideDoc[]> = {
  "zh-hk": [
    {
      slug: "licence",
      title: "香港／澳門車牌可以在日本租電單車嗎？",
      intro:
        "可以。只要你持有香港或澳門的正式電單車駕駛執照，並帶同國際駕駛執照（IDP）及護照，即可在日本租用 RENTAL819 的電單車；暫準執照（俗稱 P 牌）恕不受理。",
      seoTitle: "香港車牌可以在日本租電單車嗎？｜國際駕駛執照 IDP 須知",
      seoDescription:
        "可以。持香港或澳門的正式電單車駕駛執照，連同國際駕駛執照（IDP）及護照三者齊備，即可在日本租電單車；暫準執照（P 牌）恕不受理，租車人須年滿 18 歲，IDP 亦須清楚顯示可駕駛電單車。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "三份證件，缺一不可" },
        {
          type: "p",
          text: "在日本取車當日，你必須同時出示以下三份文件。缺少任何一份，日本分店都無法把車交給你。",
        },
        {
          type: "ul",
          items: [
            "護照（於租車時出示）",
            "香港／澳門的正式駕駛執照（本國駕照）",
            "國際駕駛執照（IDP）",
          ],
        },
        {
          type: "note",
          text: "請確保國際駕駛執照清楚展示獲許可駕駛電單車，並留意有效日期須覆蓋整段租車期間。",
        },
        { type: "h", text: "暫準執照（P 牌）可以嗎？" },
        {
          type: "p",
          text: "不能。我們只能向持有正式駕駛執照及有效國際車牌的人士租車，暫準執照（俗稱 P 牌）恕無法辦理。",
        },
        { type: "h", text: "年齡限制" },
        {
          type: "p",
          text: "Rental819 只向 18 歲以上的成年人提供服務，未滿 18 歲恕無法提供電單車出租服務。18 歲或以上並持有有效國際駕駛執照者，均可租賃 RENTAL819 的電單車。",
        },
        { type: "h", text: "在香港／澳門以外簽發的駕駛執照" },
        {
          type: "p",
          text: "如你的駕駛執照在其他國家申請，請先聯絡我們確認，我們會按你手上的證件查證能否在日本使用。",
        },
        { type: "h", text: "證件以外還要準備甚麼？" },
        {
          type: "p",
          text: "建議準備至少一張你本人名下的實體信用卡：取車時日本店鋪一般需要出示信用卡作按金及身分核對之用。租金本身則以轉數快或銀行匯款繳付予頭盔王。",
        },
        {
          type: "note",
          text: "本頁只說明在日本租車時所需的證件。國際駕駛執照的申請手續請向發證機關查詢；如不肯定手上的證件是否合用，歡迎 WhatsApp 我們的團隊：wa.me/85298686569。",
        },
        {
          type: "link",
          items: [
            {
              href: "/zh-hk/guide/pickup",
              label: "預約及取車流程",
              text: "由確認證件、選擇分店到取車還車的完整步驟。",
            },
            {
              href: "/zh-hk/guide/fees",
              label: "租金及費用",
              text: "各車輛等級的租金、保險及裝備收費表。",
            },
          ],
        },
      ],
    },
    {
      slug: "plan-trip",
      title: "如何規劃行程",
      intro:
        "規劃日本電單車自駕遊，只需回答三條問題：打算開幾天車、預算怎樣計、路線如何串連。以下逐條拆解，並附上由決定日期到出發的時間表。",
      seoTitle: "日本電單車自駕遊行程規劃",
      seoDescription:
        "日本電單車自駕遊行程規劃只需回答三條問題：打算開幾多日車、預算怎樣計、路線如何串連。走一般道路每日約 100 至 150 公里較舒適，天數直接影響預算，普通汽油約每公升 160 日圓。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "安排行程很簡單！" },
        {
          type: "p",
          text: "在開始之前，我們先說明一些在日本開車自駕遊的規則及工具給你參考，同時亦有一些我們過往的行程範例，令你旅途能更加順利。",
        },
        { type: "p", text: "你只需圍繞以下 3 個問題解答即可：" },
        {
          type: "link",
          items: [
            {
              href: "/zh-hk/guide/how-many-days",
              label: "打算開幾天車？",
              text: "走一般道路、在路上吃吃看看，每天大概 100 到 150 公里比較舒適，天數亦直接影響預算。",
            },
            {
              href: "/zh-hk/guide/budget",
              label: "預算怎樣計？",
              text: "租金、油費（普通汽油約 160 日圓一公升）、高速公路費、飲食、住宿及泊車逐項計算。",
            },
            {
              href: "/zh-hk/guide/route",
              label: "路線如何規劃？",
              text: "先揀定必到的景觀道路、溫泉鄉或世界文化遺產，再串連成順路而不走回頭路的行程。",
            },
          ],
        },
        { type: "h", text: "由決定日期到出發的時間表" },
        {
          type: "p",
          text: "三條問題有了答案，餘下就是把行程落實。以下是我們建議的時間表：",
        },
        {
          type: "ol",
          items: [
            "出發前一個月至一星期：填寫租車表格，列出想租的地區、心儀車款首三位及租還車時間。預約以先到先得安排，最遲請在一星期前預約。",
            "遞交表格後三至五個工作天：我們會以確認電郵回覆車款、分店及報價。",
            "收到租車單據後三個工作天內：以轉數快或銀行匯款將租金繳付予頭盔王。",
            "出發前：核對護照、香港／澳門駕駛執照及國際駕駛執照，並留意國際駕照的有效日期。",
            "取車當日：預早到店，取車需時大概 15 分鐘，職員會說明租車條款、檢查車況及說明保險內容。",
          ],
        },
        {
          type: "note",
          text: "各店舖的定休日不同，定休日不能租還車輛；而租還車輛必須在同一間店舖進行，編排路線時請把最後一日駛回取車分店的時間計算在內。",
        },
        { type: "h", text: "出發前仲要睇邊幾篇？" },
        {
          type: "p",
          text: "行程定好之後，以下幾篇會幫你處理費用、保險與上路後的細節：",
        },
        {
          type: "link",
          items: [
            {
              href: "/zh-hk/guide/licence",
              label: "香港／澳門車牌可以在日本租電單車嗎？",
              text: "護照、本國駕駛執照及國際駕駛執照三者缺一不可。",
            },
            {
              href: "/zh-hk/guide/fees",
              label: "租金及費用",
              text: "車輛等級租金、保險加購及頭盔、尾箱等裝備的完整價目表。",
            },
            {
              href: "/zh-hk/guide/insurance",
              label: "保險",
              text: "強制及任意保險的保障範圍、自負額，以及營業損失賠償（NOC）。",
            },
            {
              href: "/zh-hk/guide/etc",
              label: "ETC",
              text: "高速公路無線自動繳費系統的用法，以及 ETC 卡的租用安排。",
            },
            {
              href: "/zh-hk/guide/traffic-rules",
              label: "日本交通規則",
              text: "靠左行駛、時速限制、停止標誌與泊車規定。",
            },
            {
              href: "/zh-hk/guide/pickup",
              label: "預約及取車流程",
              text: "由填表、選店到取車還車的七個步驟。",
            },
          ],
        },
        {
          type: "p",
          text: "自己編排行程有自己的樂趣。如果人數多、日程趕，又或者想有人幫手睇一睇行程行唔行得通，WhatsApp 香港團隊即可，我們會按你的日數與想去的景點提供意見。",
        },
      ],
    },
    {
      slug: "route",
      title: "路線如何規劃？",
      intro:
        "先決定必到的景點，再把它們串連成順路而不走回頭路的行程，並按每日景點數目、遊覽時間及行車距離決定住宿地點。",
      seoTitle: "日本電單車自駕遊路線規劃",
      seoDescription:
        "路線規劃由必到景點開始：可以是一段有名的景觀道路、溫泉鄉，或者世界文化遺產。再把各點串連成順路而不走回頭路的行程，並按每日景點數目、遊覽時間及行車距離決定住宿地點。",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "請你先問問自己和同伴，有哪些景點是此行一定要看的呢？有哪些行程和景點你是一定想到訪參觀的？這些景點可以是一段有名的景觀道路、可以是到訪溫泉鄉泡溫泉，亦可以是世界文化遺產。",
        },
        { type: "p", text: "以下是日本有關這方面的景點資料及各都府道縣的景點：" },
        {
          type: "ul",
          items: [
            "日本國家旅遊局：比較大路的景點都有記載，而且是用中文介紹。",
            "GOOBIKE、Bikebros：日本各縣有名的出車路線推薦。",
            "紅葉、櫻花開花情報：Weathernews 在每年春天或秋天都會刊登日本各地賞楓賞櫻地點的狀況，並列出最佳觀賞期。",
          ],
        },
        { type: "h", text: "大概這樣就完成了！" },
        {
          type: "p",
          text: "最後就是將各個目的地串聯起來，串聯時當然最好經過一些漂亮、有趣味性的路，同時盡量不走回頭路，減少總行車距離。再決定每日住宿地點，並結合每日遊覽景點數目、遊覽時間以及行車距離和時間來考慮。",
        },
        {
          type: "p",
          text: "自己編排有自己的樂趣；當然如果你覺得麻煩，又或者太多人一起行動擔心行程出現阻滯，亦歡迎隨時聯絡富有經驗的我們協助！我們亦能協助你確認行程在執行上會否有任何問題。",
        },
      ],
    },
    {
      slug: "how-many-days",
      title: "打算開幾天車？",
      intro:
        "走一般道路、在路上吃吃看看的話，每天大概 100 到 150 公里比較舒適；天數會直接影響行程節奏，亦直接影響你的行程預算。",
      seoTitle: "日本電單車自駕遊要幾多日",
      seoDescription:
        "走一般道路、沿途吃吃看看，每日約 100 至 150 公里最為舒適，實際仍視乎車種。秋冬日短要預留時間，天數亦直接影響預算；用 Google Map 輸入兩個地點即可估算距離及所需行車時間。",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "如果你打算看很多不同的景點，那就請你要預鬆一點的時間了。如果是公路旅行，走一般道路、在路上吃吃看看的話，一般每天大概 100 到 150 公里範圍內就比較舒適，當然還視乎車種，例如需要大量體力的跑車就不要安排得太長了。",
        },
        {
          type: "p",
          text: "同時要留意，如果是在秋冬時份，太陽會提早下山，行程編排太長的話，有機會要摸黑到旅館。此外，天數會直接影響你的行程預算，而高速公路和一般道路、山路等的需時亦會有所不同。",
        },
        { type: "h", text: "計算公路距離和路況" },
        {
          type: "p",
          text: "基本上只需使用 Google Map，輸入兩個地點，Google 就會自動計算兩者距離及所需行車時間，你可以利用它大概推算所需的行車時間。",
        },
        {
          type: "note",
          text: "如果你要到訪日本一些有名景點及休閒地區如海邊或溫泉，請盡量避開日本的假期才到訪，否則有可能要和當地人一起塞車，而旅館的費用亦會昂貴！",
        },
      ],
    },
    {
      slug: "budget",
      title: "預算怎樣計？",
      intro:
        "預算基本上包含電單車租金、油費、高速公路費、飲食、住宿及泊車，其中日本的油價（普通油）大概徘徊在 160 日圓一公升。",
      seoTitle: "日本電單車自駕遊預算點計",
      seoDescription:
        "日本電單車自駕遊預算包括電單車租金、油費、高速公路費、飲食、住宿及泊車。普通汽油約每公升 160 日圓，商務旅館每晚約 300 至 500 港元，一泊二食溫泉旅館約 700 至 2,000 港元。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "租金" },
        {
          type: "p",
          text: "這個是最能在事前確實的。請參考我們的租金計算表（見「租金及費用」）。",
        },
        { type: "h", text: "油費" },
        {
          type: "p",
          text: "日本的油價（普通油）大概徘徊在 160 日圓一公升。請使用 Google Map 大概得出你的騎乘距離後再計算。",
        },
        { type: "h", text: "高速公路費用" },
        {
          type: "p",
          text: "日本的高速公路收費，是按照高速公路入口至出口的距離計算。你可以使用高速公路計算器（如 NEXCO 西日本、NEXCO 中日本）計算，並設定成使用 ETC 及輕型自動車。留意高速公路在夜間、假日和繁忙時間的收費會有所不同。",
        },
        { type: "h", text: "飲食" },
        {
          type: "p",
          text: "這很視乎你吃什麼……由一個大概 40 港元的便當，到大概 80 元的迴轉壽司也有。如住一泊二食的溫泉旅館，早晚餐一般都是包含的。",
        },
        { type: "h", text: "住宿" },
        {
          type: "p",
          text: "商務旅館大概 300 至 500 港元一晚，包兩餐的溫泉旅館大概 700 至 2000 元一晚。如需要了解旅館有否提供停車設施，請聯絡我們。",
        },
        { type: "h", text: "車位" },
        {
          type: "note",
          text: "請不要隨便泊在路邊！日本的違泊費用高得驚人，而且被抄牌後的手續亦相當麻煩（需要立即到就近警察署報到並付費），請盡量使用停車場。",
        },
        { type: "p", text: "可使用以下工具尋找合法的電單車停車場／停車位：" },
        {
          type: "ul",
          items: [
            "全国バイク駐車場・駐輪場案内：www.jmpsa.or.jp/society/parking/",
            "NAVITIME 電單車停車場搜尋：www.navitime.co.jp/motorbike/parking/",
          ],
        },
      ],
    },
    {
      slug: "fees",
      title: "租金及費用",
      intro:
        "日本租電單車幾錢？實際租金會因車輛等級、租期及所選配件而有所不同，以下是完整價目表。",
      seoTitle: "日本租電單車價錢｜租金、保險及裝備收費表",
      seoDescription:
        "日本租電單車幾錢？P-1 至 P-7 一天租金由 HK$295 至 HK$1,765，已包強制及任意保險，但不包括燃油、高速公路費及泊車。另附車輛損傷補償、MamoRide 補償，以及頭盔、尾箱、ETC 卡等裝備的收費表。",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "以下為車輛租金及各項費用的參考價目。實際租金會因車輛等級、租用日期及分店而略有不同，最終報價以租車預約表格確認為準。",
        },
        { type: "h", text: "日本二輪租車費一覽（港元）" },
        {
          type: "table",
          head: ["等級", "4 小時", "8 小時", "1 天（24 小時）", "第 2 天以後每天", "延遲費用／小時"],
          rows: [
            ["P-1", "$220", "$245", "$295", "$195", "$50"],
            ["P-2", "$330", "$365", "$440", "$295", "$75"],
            ["P-3", "$605", "$675", "$810", "$540", "$135"],
            ["P-4", "$770", "$855", "$1,030", "$685", "$170"],
            ["P-5", "$880", "$980", "$1,175", "$785", "$195"],
            ["P-6", "$990", "$1,100", "$1,320", "$880", "$220"],
            ["P-7", "$1,320", "$1,470", "$1,765", "$1,175", "$295"],
          ],
        },
        {
          type: "note",
          text: "上表已包含強制及任意保險，但不包含燃油、高速公路費及泊車。租金收費時段分為 4 小時、8 小時、1 天，及第 2 天以後按每 24 小時計算。",
        },
        { type: "h", text: "強制保險（已包含在租車費用內）" },
        {
          type: "table",
          head: ["項目", "保障"],
          rows: [
            ["第三者受傷或死亡", "賠償金額無上限"],
            ["第三者財物損失", "單一件事故最高 1,000 萬日圓（自付額 5 萬日圓）"],
            ["乘客受傷或死亡", "賠償上限 500 萬日圓，只限有後遺症或身亡（125cc 以下車款不予支付）"],
            ["竊盜補償", "損害上限額 50%（自付額 50%）"],
          ],
        },
        { type: "h", text: "車輛損傷補償（費用不含在上表）（港元）" },
        {
          type: "table",
          head: ["等級（自付額）", "1 天（24 小時）", "第 2 天以後每天"],
          rows: [
            ["P-1・P-2（自付額 3 萬日圓）", "$85", "$50"],
            ["P-3（自付額 5 萬日圓）", "$140", "$75"],
            ["P-4（自付額 5 萬日圓）", "$195", "$105"],
            ["P-5（自付額 10 萬日圓）", "$195", "$105"],
            ["P-6（自付額 10 萬日圓）", "$215", "$115"],
            ["P-7（自付額 10 萬日圓）", "$245", "$130"],
          ],
        },
        { type: "h", text: "MamoRide 補償（車輛補償加購者專屬，可選加購）（港元）" },
        {
          type: "table",
          head: ["等級（減半後自付額）", "1 天（24 小時）", "第 2 天以後每天"],
          rows: [
            ["P-1（自付額 1.5 萬日圓）", "$110", "$40"],
            ["P-2（自付額 1.5 萬日圓）", "$110", "$40"],
            ["P-3（自付額 2.5 萬日圓）", "$150", "$55"],
            ["P-4（自付額 2.5 萬日圓）", "$160", "$65"],
            ["P-5（自付額 5 萬日圓）", "$160", "$65"],
            ["P-6（自付額 5 萬日圓）", "$175", "$70"],
            ["P-7（自付額 5 萬日圓）", "$185", "$75"],
          ],
        },
        {
          type: "note",
          text: "MamoRide 只可加購於 15 日以內的預約，且只在停車、上下車、牽車等「原地倒車」（非行駛狀態）造成損傷時，令車輛補償自付額減半；行駛中造成的損壞不在補償範圍內。",
        },
        { type: "h", text: "可預約租用之配備（供應因車款而異）（港元）" },
        {
          type: "table",
          head: ["裝備項目", "1 天（24 小時）", "第 2 天以後每天"],
          rows: [
            ["頭盔", "$60", "$10"],
            ["尾箱", "$90", "$20"],
            ["側袋", "$60", "$10"],
            ["側箱", "$90", "$20"],
            ["手機架", "免費", "免費"],
          ],
        },
        { type: "h", text: "只供出發日當天租用（費用於還車時以日元結算）" },
        {
          type: "table",
          head: ["裝備項目", "1 天（24 小時）", "第 2 天以後每天"],
          rows: [
            ["尾座收納包", "¥500", "¥100"],
            ["行李網", "¥200", "¥100"],
            ["油缸收納包", "¥200", "¥100"],
            ["防盜鎖", "¥200", "¥200"],
            ["ETC 卡", "¥220", "¥110"],
            ["手套", "¥330", "¥110"],
            ["防摔外套", "¥550", "¥330"],
            ["胸板", "¥330", "¥110"],
          ],
        },
        { type: "h", text: "費用組成" },
        {
          type: "ul",
          items: [
            "車輛租金：按車輛等級及租用時段（4 小時、8 小時、1 天，及第 2 天起按 24 小時）計算。",
            "燃油：油費需自行負責，還車時須注滿油。",
            "高速公路費（ETC）：ETC 卡租金為每天 220 日圓，過路費於還車時一併結算。",
            "保險：基本費用已含強制及任意保險，另可加購車輛補償及 MamoRide 補償。",
            "頭盔／裝備：可自備，或按尺碼租用頭盔等裝備。",
            "泊車：泊車費用按停車場而定，請盡量使用停車場。",
          ],
        },
        {
          type: "note",
          text: "溫馨提示：租賃者須於租車單據發出後三個工作天內以銀行匯款／轉數快繳付予頭盔王。僅限 18 歲以上、持有效港／澳駕照、國際駕照及護照人士，並只接受租賃者本人之實體信用卡或扣帳卡付款。如需報價，請使用租車預約表格，或 WhatsApp 我們的團隊：wa.me/85298686569。",
        },
      ],
    },
    {
      slug: "insurance",
      title: "保險",
      intro:
        "基本費用已包含日本國內的強制險及任意保險，另有車輛補償及 MamoRide 補償。",
      seoTitle: "日本租電單車保險｜強制險、車輛補償及 MamoRide",
      seoDescription:
        "基本費用已包強制險、任意保險及竊盜險：對人賠償無上限，對物每件事故最高 1,000 萬日圓。另可加購車輛補償及 MamoRide。營業損失賠償為能騎回店家 20,000 日圓、需拖吊 50,000 日圓。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "包含在基本費用中的保險" },
        { type: "h3", text: "任意保險" },
        {
          type: "p",
          text: "基本費用中已包含日本國內的強制險及任意保險。萬一發生事故，將於以下額度範圍內賠償保險金：",
        },
        {
          type: "ul",
          items: [
            "對人賠償：無上限",
            "對物賠償：每件事故最高 1,000 萬日圓（自負額／免責金額 5 萬日圓）",
            "搭乘者傷害賠償：死亡或留有後遺症時，每人最高 500 萬日圓（租用排氣量 125cc 以下車款（原付一種、原付二種）時，死亡或後遺症狀況不予支付保險金）",
          ],
        },
        {
          type: "note",
          text: "※ 後遺症及理賠金額由保險公司根據保險條款審核。因特定事由可能無法支付理賠金，請詳閱以下保險與賠償的注意事項。",
        },
        { type: "h3", text: "道路救援服務" },
        {
          type: "p",
          text: "任意保險附帶全年無休 24 小時道路救援。20 公里以內免費拖吊，拖吊途中如行經收費道路，該路段過路費及超過 20 公里後之拖吊費用由顧客負擔。自 2025 年 6 月起，任意保險不再提供補胎、電瓶沒電時的救援，一律以拖吊車將車輛運至附近可協助維修的車行；建議長途或長期旅行者自行攜帶補胎工具及行動電源型救車啟動器。",
        },
        { type: "h3", text: "車輛遭到偷竊時（竊盜險）" },
        {
          type: "p",
          text: "基本費用已包含竊盜險。車輛於租借期間遭偷竊時，顧客只需負擔該車輛市場價格的 50% 及營業損失賠償；竊盜險以車輛市價的 50% 為賠償上限。",
        },
        {
          type: "note",
          text: "如未將車輛上鎖，或將鑰匙遺留在車輛上，竊盜險將不理賠。離開車輛時請務必上龍頭鎖並拔下鑰匙。",
        },
        { type: "h3", text: "車輛補償" },
        {
          type: "p",
          text: "透過支付額外費用可加入「車輛補償」。若因意外摔車或事故而產生需由顧客負擔的修理費，超過免責額的部分將由補償承擔。",
        },
        { type: "h3", text: "MamoRide 補償（可選加入）" },
        {
          type: "p",
          text: "MamoRide 是車輛補償加購者專屬的追加方案，無法單獨購買。在停車、上下車、牽車等「原地倒車」（非行駛狀態）情況下造成車輛損傷時，車輛補償的自負額可減半。適用範圍限日本國內，租賃期間內最多可適用 1 次，且僅限 15 日以內的預約加購（16 日以上預約無法加購）。行駛中造成的損壞不在補償範圍內。",
        },
        { type: "h3", text: "關於自負額（免責金額）" },
        {
          type: "p",
          text: "自負額是指發生事故或摔倒時，顧客必須自行負擔的金額。以 P-4 等級為例，自負額上限為 50,000 日圓：只要修理費在 50,000 日圓以內，顧客僅需支付實際修理費用；當修理費達 200,000 日圓時，顧客最多仍只需支付 50,000 日圓，其餘 150,000 日圓由保險承擔。若修理費未能即時確定，會先收取自負額上限作為押金，待實際費用確定後退回差額。",
        },
        { type: "h", text: "事故・倒車・車輛故障" },
        { type: "h3", text: "CASE 1. 與他人發生事故或損壞他人財產時" },
        { type: "p", text: "遇到事故請保持冷靜，切勿慌張，並依下列步驟處理：" },
        {
          type: "ol",
          items: [
            "確認是否有人受傷，如需醫療協助請立刻撥打 119。",
            "請務必撥打 110 報警。",
            "拍攝現場照片，並盡可能記錄對方的車牌、姓名及電話等聯絡方式。",
            "聯繫保險公司報告事故狀況（保險公司電話請從預約內容頁面確認，並提供日文以外語言的翻譯服務）。",
            "向取車店鋪報告事故情況，並遵循本公司員工的指示處理。",
          ],
        },
        { type: "h3", text: "CASE 2. 無其他第三人的事故或車輛故障時" },
        {
          type: "p",
          text: "若為單獨事故（如單獨倒車、未與他人物品碰撞），請先聯絡出發店家或 +81-50-6861-5819，並遵照本公司人員指示處理。即使已加保車輛補償，仍有可能被收取至自負額上限的賠償費用。",
        },
        { type: "h3", text: "CASE 3. 車輛遭到偷竊時" },
        {
          type: "ol",
          items: [
            "請務必撥打 110 報警。",
            "聯絡出發店家或 +81-50-6861-5819，並遵照本公司人員指示處理。",
          ],
        },
        {
          type: "p",
          text: "基本費用已包含竊盜險，理賠範圍為本公司為車輛設定的市場價值的 50%，另外 50% 由顧客負擔。如未將車輛上鎖或將鑰匙遺留在車上，竊盜險將不理賠。如租車期間遇到任何問題，請隨時聯絡 Rental819 預約中心（提供中、英語服務）。",
        },
        { type: "h", text: "營業損失賠償（NOC）" },
        {
          type: "p",
          text: "租車期間若因事故、竊盜、倒車等原因，導致車輛需要維修而無法維持可租借狀態時，顧客須自行負擔營業損失賠償。即使已加入「車輛補償」，此賠償仍會額外計算，無法免除。若在後照鏡、方向燈、大燈、尾燈或其他安全部件脫落、損壞的情況下行駛，不僅危險更觸犯日本道路交通法；如強行駕駛返回店家，仍可能被收取 5 萬日圓的營業損失賠償。",
        },
        {
          type: "table",
          head: ["情況", "顧客負擔之營業損失賠償"],
          rows: [
            ["承租人能騎乘車輛並歸還至取車店家", "20,000 日圓"],
            ["承租人無法騎乘車輛，需拖吊歸還", "50,000 日圓 + 超過免費拖吊距離之拖吊費"],
            ["車輛於租賃期間遭竊", "50,000 日圓 + 承租車輛之 50% 市場價值"],
            ["車輛鑰匙遺失", "20,000 日圓 + 鑰匙製作費"],
          ],
        },
        { type: "h3", text: "車輛受損程度及營業損失賠償" },
        {
          type: "p",
          text: "由 Rental819 提供之所有車輛，皆以「車輛損害基準」計算修理費用。受損程度達中度以上時，顧客須負擔營業損失賠償。",
        },
        {
          type: "table",
          head: ["程度", "受損狀況", "營業損失賠償"],
          rows: [
            ["輕度", "修理費用未達 2 萬日圓，能簡單更換修復的拉桿、後照鏡、腳踏等", "不收取"],
            ["低度", "車殼、排氣管等未達損傷查定比率 50%，補修後不影響行駛的輕微受損", "不收取"],
            ["中度", "受損達損傷查定比率 50% 以上，或需更換，車輛暫時無法出租", "20,000 日圓"],
            ["重度", "車輛被判斷為「全損」", "50,000 日圓"],
          ],
        },
        { type: "h3", text: "損傷查定比率" },
        {
          type: "p",
          text: "針對可「補修」的「傷痕・凹損」，Rental819 依下列標準決定受損比率（以價值 10,000 日圓的零部件為例）：",
        },
        {
          type: "table",
          head: ["傷痕／凹損範圍", "損傷查定比率", "顧客負擔金額（10,000 日圓零件）"],
          rows: [
            ["1 個 500 日圓硬幣（～25mm）", "30%", "3,000 日圓"],
            ["2 個 500 日圓硬幣（26～50mm）", "40%", "4,000 日圓"],
            ["3 個 500 日圓硬幣（51～75mm）", "50%", "5,000 日圓"],
            ["4 個 500 日圓硬幣（75mm～）", "100%（更換）", "10,000 日圓 + 更換工資"],
          ],
        },
        {
          type: "note",
          text: "※「斷裂・破裂・彎曲・變形・撕裂」的受損零部件不在損傷查定比率範圍內。",
        },
        { type: "h3", text: "零部件更換工資" },
        {
          type: "p",
          text: "Rental819 設有全店鋪統一工資標準：全日本一律 11,000 日圓／1 小時（含稅）。補修的情況不收取工資。實際工資為各廠牌原廠「工時」乘以「工資」，例如 HONDA CB400SF 的拉桿更換工時為 0.1，工資即 11,000 × 0.1 = 1,100 日圓。",
        },
        { type: "h3", text: "全損的定義及負擔金額" },
        {
          type: "p",
          text: "「全損」是指車輛已無法修理、修理金額超過車輛市場價格，或修理後無法如普通車輛般正常行駛的狀況。",
        },
        {
          type: "table",
          head: ["是否加購車輛補償", "顧客須負擔金額"],
          rows: [
            ["有加購", "該車輛等級之車輛補償自負額上限 + 營業損失賠償 50,000 日圓"],
            ["未加購", "承租車輛之市場價格 + 營業損失賠償 50,000 日圓"],
          ],
        },
        { type: "h3", text: "所交付證件遺失" },
        {
          type: "table",
          head: ["種類", "手續費"],
          rows: [["車檢証、登錄証或自賠責保險證明書", "16,500 日圓（含稅）"]],
        },
        { type: "h3", text: "不適用保險賠償的情況" },
        {
          type: "p",
          text: "如有以下情況，保險將不予理賠，相關損害賠償由承租人自行負擔：",
        },
        {
          type: "ul",
          items: [
            "無照駕駛",
            "酒後駕駛",
            "不配戴安全帽駕駛",
            "由承租人以外的第三者駕車所導致的事故",
            "未向警察備案（無事故證明）時",
            "未經授權與對方私下和解",
            "未能於事故現場聯繫出發店家或 Rental819 預約中心",
            "發生事故時已超出預定租用時間，且未事先聯絡店鋪或 Rental819 預約中心而逕自繼續使用車輛時",
            "車輛遭竊時",
            "搭載超過車輛法定上限人數或貨物時",
            "於公共道路以外區域發生的事故",
            "將車輛用於測試、比賽或牽引其他車輛等情況",
            "因不當使用而造成的損壞或腐蝕的維修費用",
            "於店鋪所有地內造成該店鋪其他車輛或財物損壞時",
            "錯誤操作車輛或操作失誤所造成的事故",
            "其他違反租賃條款的事項",
            "符合其他保險公司免責條款所列事項的事故",
          ],
        },
      ],
    },
    {
      slug: "etc",
      title: "ETC",
      intro: "ETC 是日本高速公路的無線自動繳費系統，讓你不用停車即可通過收費閘。",
      seoTitle: "日本高速公路 ETC｜電單車 ETC 卡租用",
      seoDescription:
        "ETC 是日本高速公路的無線自動繳費系統，插卡即可不停車過閘。Rental819 大部分車輛已裝設 ETC 機，ETC 卡租金每天 220 日圓，過路費於還車時一併結算；125cc 以下的電單車不能在高速公路行駛。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "甚麼是 ETC？" },
        {
          type: "p",
          text: "ETC 是 Electronic Toll Collection system 的簡稱，是日本高速公路使用的無線付費系統，使駕駛者能在不用停車的情況下通過收費通道。系統包括 ETC 讀卡器、ETC 卡及 ETC 提示燈：只需把 ETC 卡插入專用讀卡器，若車上提示燈顯示持續的綠色閃燈，即代表 ETC 系統正常運作。",
        },
        {
          type: "note",
          text: "125cc 以下的電單車不能在高速公路上行駛，因此不能裝設 ETC 系統。",
        },
        { type: "h", text: "如何使用 ETC" },
        {
          type: "ol",
          items: [
            "抵達高速公路收費處時，駛進 ETC 專用道。",
            "不用停車，只需在藍線中間慢駛（時速少於 20 公里）。",
            "待閘口打開後，慢慢駛出收費處。",
          ],
        },
        { type: "h", text: "在 Rental819 租借 ETC" },
        {
          type: "p",
          text: "在 Rental819 租用的車輛大部分已裝有 ETC 系統，你只需租用 ETC 卡即可使用。租車時可確認車輛有沒有裝設 ETC 系統，以及該分店有沒有 ETC 卡可供租用。",
        },
        {
          type: "p",
          text: "ETC 卡因供應有限，請到店取車時向職員查詢。租車當日除車輛租金外，你亦要繳付 ETC 卡租金，費用為每天 220 日圓。還車時請一併繳交高速公路費用；如延遲還車則需繳付額外延遲費用。",
        },
        { type: "h", text: "使用 ETC 卡的注意事項" },
        {
          type: "ul",
          items: [
            "通過收費閘時，請與前車保持距離並慢駛，防止碰撞。",
            "請與其他車輛保持距離，以時速少於 20 公里、與前車保持 5 米距離，直線通過收費閘。",
            "不要在 ETC 專用道內超越前車。",
            "如 ETC 專用道不能正常運作或閘口未能打開，請小心離開行車道並注意後方車輛。",
            "離開後，請盡快通知收費道職員，讓你可在安全環境下停泊及等待指示。",
            "請不要倒後、U-turn 或移到另一條行車道。",
            "如沒有可通過的 ETC 專用道，或未能以 ETC 出閘，請使用普通收費閘並向職員出示 ETC 卡。",
          ],
        },
      ],
    },
    {
      slug: "traffic-rules",
      title: "日本交通規則",
      intro: "以下是在日本駕駛需要遵守的主要交通規則。",
      seoTitle: "日本電單車交通規則",
      seoDescription:
        "日本與港澳同樣靠左行駛；無標示時國道時速上限 100 公里、其他道路 50 公里。停止標誌必須完全停車、腳板觸地，平交道亦要停。違例泊車須自行到警署繳款，否則我們會另收 20,000 日圓。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "靠左行駛" },
        {
          type: "p",
          text: "日本和香港及澳門一樣，道路靠左行駛。在高速公路駕駛時，右線一樣是超車線。",
        },
        { type: "h", text: "日本主要交通標誌" },
        {
          type: "ul",
          items: [
            "一般國道、都道府県道",
            "不准進入、不准泊車、不准停靠、不准 U-turn、前方不准進入",
            "時速限制、停止",
            "50cc 車輛不能兩段右轉",
            "只准按標示方向行駛、單行線",
          ],
        },
        { type: "h", text: "停止標誌" },
        {
          type: "p",
          text: "停止標誌通常出現在道路交滙處、路線滙合處，以及學校、醫院等特殊公共場所。你必須讓車輛完全停止；駕駛電單車時，腳板要觸碰到地面才算完全停止。如以群體出行，所有車輛都必需停駛。此外，如見到類似鐵路交滙處的紅色交通燈，當紅燈閃亮時，即使沒有停止標誌你都必須停車。",
        },
        { type: "h", text: "時速限制" },
        {
          type: "p",
          text: "如果道路上沒有時速標示，日本的時速上限為國道 100km/h、其他道路 50km/h。但大部分快速公路的時速為 90km/h，有些更會是 80km/h。時速限制有時亦會按天氣狀況調整，請留意當時的時速標示。",
        },
        { type: "h", text: "超車" },
        {
          type: "ul",
          items: [
            "白色虛線：沒有特別限制，可以過線超越前車。",
            "白色實線：通常在特別路段或滙合處前，不能過線。",
            "黃色實線：通常在特別路段或滙合處前，不能過線超越前車。",
          ],
        },
        { type: "h", text: "特別道路" },
        {
          type: "p",
          text: "在十字路口，馬路上通常會有箭咀指示可行駛的方向：普遍最右線可轉右、中間線向前、最左線轉左。在十字路口前大約 30 至 40 米便會轉換成黃色實線，此時不能轉線，你必須按地上指示的方向行駛。通過路口前請慢駛及小心查看地上指示。",
        },
        { type: "h", text: "斑馬線及平交道" },
        {
          type: "p",
          text: "行人和單車可優先使用斑馬線，通過時請確保左右沒有行人及單車，如有行人準備通過請先讓行。在平交道前必需完全停車，即使閘口完全打開；如沒有遵守規例可能需要罰款。",
        },
        { type: "h", text: "交通燈" },
        {
          type: "p",
          text: "在日本很多交通燈都有箭咀指示可前進的方向，如箭咀顯示為綠色即可向該方向行駛。大部份交通燈設置在馬路對面，所以在十字路口要留意對面馬路的交通燈。",
        },
        { type: "h", text: "50cc 或以下車輛的交通規則" },
        {
          type: "ul",
          items: [
            "不能搭載乘客",
            "最高時速：30 公里",
            "必須在馬路左邊一米內行駛",
            "不能在高速公路行駛",
            "在三條線的馬路上轉右，必須使用兩段式轉彎（部分情況不能使用）",
          ],
        },
        {
          type: "note",
          text: "東京首都高速部分路線不能搭載乘客，請留意圖示橙色的路線。",
        },
        { type: "h", text: "關於泊車" },
        {
          type: "p",
          text: "在城市必須把車輛停泊在停車處，如在路上違例泊車，執法人員便會發出告票。50cc 以下的車輛可停泊在單車停泊處，50cc 或以上的電單車建議停泊在電單車位，但停泊在私家車位亦是合法的。使用超級市場、百貨公司或購物中心的停車處前，請先確定使用條款；一般便利商店的泊車處都不能停泊長時間。",
        },
        {
          type: "note",
          text: "如收到違例泊車告票（駐車違反），你需到負責的警署辦理手續及繳交罰款。如果在還車前沒有按指引到警署辦理及繳費，我們將向你收取該罰款以及額外 20,000 日圓的罰款。",
        },
      ],
    },
    {
      slug: "pickup",
      title: "預約及取車流程",
      intro: "為了提供最佳服務，請花幾分鐘了解在日本租用電單車的詳情及限制。",
      seoTitle: "日本租電單車流程｜預約及取車須知",
      seoDescription:
        "在日本租電單車須出示護照、香港／澳門駕駛執照及國際駕駛執照，並須年滿 18 歲。最遲一星期前預約、先到先得，租還車必須於同一分店；取車手續約需 15 分鐘，還車前請注滿指定汽油。",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "出發前" },
        { type: "h3", text: "STEP 1 確認證件" },
        {
          type: "p",
          text: "請確認你持有可在日本使用的駕駛執照。Rental819 只向 18 歲以上的成年人提供服務，未滿 18 歲恕無法提供電單車出租服務。",
        },
        { type: "p", text: "租車前必備之證件：" },
        {
          type: "ul",
          items: [
            "護照（於租車時出示）",
            "信用卡（建議準備一張以上，避免刷卡時發生臨時狀況）",
            "駕駛執照：請帶同香港／澳門的駕駛執照以及國際駕駛執照。如你的駕駛執照在其他國家申請，請先聯絡我們確認。",
          ],
        },
        {
          type: "note",
          text: "請確保國際駕駛執照清楚展示獲許可駕駛電單車，並留意有效日期。",
        },
        { type: "h3", text: "STEP 2 選擇分店" },
        {
          type: "p",
          text: "RENTAL819 的店鋪遍佈日本全國，所有分店都可提供租車服務。如你未能以日語溝通，職員會安排駐場英語或國語員工協助。填表時請填寫想租借的地區，如有心儀店舖可在表格內列明。租還車輛必須在同一間店舖進行。",
        },
        { type: "h3", text: "STEP 3 選擇電單車" },
        {
          type: "p",
          text: "如你已有心儀車款，請在表格中列出首三位，我們會按順序及供應情況安排。如沒有頭緒，可按車重、座高、傳動方式、車輛類型及氣缸容量向客服查詢。",
        },
        { type: "p", text: "選擇車款時額外需要留意：" },
        {
          type: "ul",
          items: [
            "50cc 或以下，或車輛登記文件列明只有一個座位的車輛不能搭載乘客",
            "首都高速公路（例如中央環狀線、灣岸線等）不能搭載乘客",
            "125cc 以下的電單車不可以使用高速公路",
            "50cc 以上的車輛必須停泊在電單車位，50cc 或以下可停泊在單車位",
          ],
        },
        {
          type: "p",
          text: "每架車可安裝的配件（如 ETC／尾箱／側箱）都有所不同，請於租借前確定。部份分店提供 ETC 卡租用服務，供你在高速公路使用自動繳費。",
        },
        { type: "h3", text: "STEP 4 選擇日期" },
        {
          type: "p",
          text: "車輛供應按季節或日期而有所不同，建議提早預約，最遲請在一星期前預約。預約以先到先得安排。另外各店舖的定休日不同，定休日不能租還車輛。",
        },
        { type: "h3", text: "STEP 5 填寫租車表格" },
        {
          type: "p",
          text: "請在租車表格上填寫個人資料、租還車時間、是否需要頭盔或寄存行李等。收到你的租車資料後，我們會在三至五個工作天內發送確認電郵；收到確認電郵後便可準備出發。",
        },
        { type: "h", text: "到埗後" },
        { type: "h3", text: "STEP 6 租車當日" },
        { type: "p", text: "租車時請出示以下有效證件：" },
        {
          type: "ul",
          items: [
            "護照",
            "國際及本國的駕駛執照",
            "合適的駕駛電單車衣著（包括但不限於：頭盔、防摔衣、防摔長褲及電單車靴）",
          ],
        },
        {
          type: "p",
          text: "取車需時大概 15 分鐘，屆時職員會說明租車條款、檢查車況及說明保險內容，請預早到店。簽署租車合約後，我們會影印你的護照及駕駛執照；出發前檢查好車況後就可出發。",
        },
        { type: "h3", text: "STEP 7 還車" },
        {
          type: "p",
          text: "取車時我們會為車注滿油，因此還車時也請為電單車注滿指定汽油。如還車時不是滿油，我們會按汽油量收取相關費用。職員檢查油量、外裝及性能後如無問題，本次租車服務便完成。（若租了 ETC 卡，所有路費亦於還車時一併結算。）",
        },
        {
          type: "note",
          text: "如需比預定時間延遲還車，請提早在預定時間之前聯絡我們；如車輛接下來沒有預約，我們便可為你延長租賃時間。",
        },
      ],
    },
  ],
  en: [
    {
      slug: "licence",
      title: "Can I rent a motorcycle in Japan with a Hong Kong licence?",
      intro:
        "Yes. If you hold a full Hong Kong or Macau motorcycle licence and bring your International Driving Permit (IDP) and passport, you can rent a RENTAL819 motorcycle in Japan. Probationary (P) licences cannot be accepted.",
      seoTitle: "Can I rent a motorcycle in Japan with a Hong Kong licence?",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Three documents — all of them required" },
        {
          type: "p",
          text: "On pick-up day in Japan you must present all three of the following. If any one of them is missing, the branch cannot hand over the bike.",
        },
        {
          type: "ul",
          items: [
            "Passport (presented at the time of rental)",
            "Your full Hong Kong or Macau driving licence (the national licence)",
            "International Driving Permit (IDP)",
          ],
        },
        {
          type: "note",
          text: "Make sure your International Driving Permit clearly shows motorcycle authorisation, and that it stays valid for the whole rental period.",
        },
        { type: "h", text: "What about a probationary (P) licence?" },
        {
          type: "p",
          text: "No. We can only rent to holders of a full driving licence with a valid International Driving Permit, so a probationary (P) licence cannot be accepted.",
        },
        { type: "h", text: "Age limit" },
        {
          type: "p",
          text: "Rental819 serves only adults aged 18 or older; if you are under 18, we are unable to provide motorcycle rental services. Anyone 18 or older holding a valid International Driving Permit may rent a RENTAL819 motorcycle.",
        },
        { type: "h", text: "Licences issued outside Hong Kong or Macau" },
        {
          type: "p",
          text: "If your licence was issued in another country, please contact us first and we will check whether it can be used in Japan.",
        },
        { type: "h", text: "What else should you bring?" },
        {
          type: "p",
          text: "Bring at least one physical credit card in your own name: the branch in Japan usually requires a credit card at pick-up for deposit and identity verification. The rent itself is paid to Helmet King by FPS or bank transfer.",
        },
        {
          type: "note",
          text: "This page covers only the documents needed to rent in Japan. For how to apply for an International Driving Permit, ask the issuing authority. If you are unsure whether your documents qualify, WhatsApp our team: wa.me/85298686569.",
        },
        {
          type: "link",
          items: [
            {
              href: "/en/guide/pickup",
              label: "Reservation and pick-up process",
              text: "Every step from checking documents and choosing a branch to returning the bike.",
            },
            {
              href: "/en/guide/fees",
              label: "Rent and fees",
              text: "Rental rates by vehicle class, plus insurance and gear pricing.",
            },
          ],
        },
      ],
    },
    {
      slug: "plan-trip",
      title: "How to plan your trip",
      intro:
        "Planning a Japan motorcycle trip comes down to three questions: how many days you'll ride, how the budget adds up, and how to link your must-see spots into a route. Here is each one, plus the timeline from booking to departure.",
      seoTitle: "Planning a Japan motorcycle trip",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Scheduling is easy!" },
        {
          type: "p",
          text: "Before we begin, we'll explain some of the rules and tools for driving in Japan for your reference, as well as some examples of our past itineraries to make your trip smoother.",
        },
        { type: "p", text: "All you need to do is answer the following 3 questions:" },
        {
          type: "link",
          items: [
            {
              href: "/en/guide/how-many-days",
              label: "Planning to drive for a few days?",
              text: "About 100 to 150 kilometres per day is comfortable on general roads, and the day count drives your budget.",
            },
            {
              href: "/en/guide/budget",
              label: "How is the budget calculated?",
              text: "Rent, fuel (regular petrol is around 160 yen a litre), expressway tolls, food, accommodation and parking, item by item.",
            },
            {
              href: "/en/guide/route",
              label: "How is the route planned?",
              text: "Pick the scenic roads, hot-spring towns or World Heritage Sites you must see, then link them without doubling back.",
            },
          ],
        },
        { type: "h", text: "The timeline from booking to departure" },
        {
          type: "p",
          text: "Once you have answers to those three questions, the rest is just putting the trip in place. This is the timeline we suggest:",
        },
        {
          type: "ol",
          items: [
            "One month to one week before departure: send the rental form with the region you want, your top three bikes and your pick-up and return times. Reservations are first-come, first-served, and at least one week ahead.",
            "Three to five working days after the form: we send a confirmation email with the bike, the branch and the quote.",
            "Within three working days of the rental invoice: pay Helmet King by bank transfer or FPS.",
            "Before you fly: check your passport, Hong Kong / Macau licence and International Driving Permit, and confirm the IDP has not expired.",
            "On pick-up day: arrive early — it takes about 15 minutes for staff to explain the contract and insurance and check the bike over.",
          ],
        },
        {
          type: "note",
          text: "Each shop has different closing days, on which you cannot pick up or return a vehicle; pick-up and return must also be at the same store, so build the ride back to that branch into your last day.",
        },
        { type: "h", text: "What else to read before you go" },
        {
          type: "p",
          text: "With the itinerary settled, these pages cover the money, the cover and the details of riding there:",
        },
        {
          type: "link",
          items: [
            {
              href: "/en/guide/licence",
              label: "Can I rent a motorcycle in Japan with a Hong Kong licence?",
              text: "Passport, national licence and International Driving Permit — all three are required.",
            },
            {
              href: "/en/guide/fees",
              label: "Rent and fees",
              text: "Full price list for rental classes, insurance add-ons and gear such as helmets and tail boxes.",
            },
            {
              href: "/en/guide/insurance",
              label: "Insurance",
              text: "What compulsory and voluntary insurance cover, the deductible, and business loss compensation (NOC).",
            },
            {
              href: "/en/guide/etc",
              label: "ETC",
              text: "How Japan's electronic toll system works and how to hire an ETC card.",
            },
            {
              href: "/en/guide/traffic-rules",
              label: "Japanese traffic rules",
              text: "Keeping left, speed limits, stop signs and where you may park.",
            },
            {
              href: "/en/guide/pickup",
              label: "Reservation and pick-up process",
              text: "The seven steps from filling in the form to returning the bike.",
            },
          ],
        },
        {
          type: "p",
          text: "Planning it yourself is half the fun. If the group is large, the schedule is tight, or you simply want someone to sanity-check the plan, WhatsApp our Hong Kong team — we'll give you feedback based on your day count and the places you want to reach.",
        },
      ],
    },
    {
      slug: "route",
      title: "How is the route planned?",
      intro:
        "Decide the must-see spots first, then link them into a route that flows without doubling back, choosing where to stay each night from the number of sights, the time spent seeing them and the riding distance.",
      seoTitle: "Japan motorcycle route planning",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "Please ask yourself and your companions first: what are the attractions that you must see on this trip? What itineraries and attractions would you definitely like to visit? These spots can be a famous scenic road, a visit to a hot spring town, or a World Heritage Site.",
        },
        {
          type: "p",
          text: "Here is information on sightseeing spots in Japan and in each prefecture:",
        },
        {
          type: "ul",
          items: [
            "Japan National Tourism Organization: the larger spots are recorded, and they are introduced in Chinese.",
            "GOOBIKE and Bikebros: recommended riding routes for each prefecture in Japan.",
            "Autumn leaves and cherry blossom information: every spring or autumn, Weathernews publishes the status of each viewing spot in Japan and lists the best time to see them.",
          ],
        },
        { type: "h", text: "That's probably it!" },
        {
          type: "p",
          text: "Finally, connect the various destinations in series. When connecting them, it is best to pass through some beautiful and interesting roads, while trying not to backtrack so as to reduce the total driving distance. Then decide where to stay each day, taking into account the number of attractions per day, the time spent sightseeing, and the driving distance and time.",
        },
        {
          type: "p",
          text: "Planning it yourself has its own fun; but if you find it troublesome, or if there are too many people travelling together and you worry the trip may hit snags, you are welcome to contact our experienced team at any time. We can also help you check whether there are any problems carrying out your itinerary.",
        },
      ],
    },
    {
      slug: "how-many-days",
      title: "Planning to drive for a few days?",
      intro:
        "On general roads, eating and sightseeing as you go, about 100 to 150 kilometres a day is comfortable — and the number of days directly shapes both the pace and the budget of your trip.",
      seoTitle: "How many days to ride in Japan?",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "If you're planning to see a lot of different attractions, give yourself a little more time to relax. On a road trip along general roads, eating and sightseeing as you go, it is generally more comfortable to stay within a range of about 100 to 150 kilometres per day, of course depending on the type of bike; for example, sports bikes that demand a lot of physical strength should not be scheduled too long.",
        },
        {
          type: "p",
          text: "At the same time, note that in autumn and winter the sun sets early, so if the schedule is too long you may have to reach your inn in the dark. In addition, the number of days directly affects your trip budget, and the time required for expressways, general roads and mountain roads will also vary.",
        },
        { type: "h", text: "Calculate road distances and conditions" },
        {
          type: "p",
          text: "Basically, just use Google Maps: enter two locations and it will automatically calculate the distance between them and the travel time required. You can use it to approximate the riding time needed.",
        },
        {
          type: "note",
          text: "If you are visiting some of Japan's famous attractions and leisure areas such as beaches or hot springs, try to avoid Japanese holidays, or you may end up stuck in traffic with the locals and paying more for accommodation!",
        },
      ],
    },
    {
      slug: "budget",
      title: "How is the budget calculated?",
      intro:
        "The budget basically consists of motorcycle rent, fuel — regular petrol in Japan hovers around 160 yen a litre — plus highway tolls, food, accommodation and parking.",
      seoTitle: "Japan motorcycle trip budget",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Rent" },
        {
          type: "p",
          text: "This is the most accurate to work out in advance. Take a look at our rental calculation table (see Rent and fees).",
        },
        { type: "h", text: "Fuel costs" },
        {
          type: "p",
          text: "Japan's oil price (regular oil) hovers around 160 yen a litre. Please use Google Maps to approximate your riding distance before calculating.",
        },
        { type: "h", text: "Highway fees" },
        {
          type: "p",
          text: "Expressway tolls in Japan are calculated based on the distance from the entrance to the exit. You can use a highway calculator (such as NEXCO West Japan or NEXCO Central Japan), setting it to use ETC and a light automatic vehicle. Keep in mind that tolls vary at night, on holidays and during peak hours.",
        },
        { type: "h", text: "Food" },
        {
          type: "p",
          text: "It depends on what you eat… from a bento box of about 40 Hong Kong dollars to conveyor-belt sushi of about 80. If you stay at a hot spring inn with half board, breakfast and dinner are usually included.",
        },
        { type: "h", text: "Accommodation" },
        {
          type: "p",
          text: "Business hotels cost about 300–500 Hong Kong dollars a night, and hot spring inns with two meals about 700–2000 a night. To find out whether an inn offers parking facilities, please contact us.",
        },
        { type: "h", text: "Parking" },
        {
          type: "note",
          text: "Please don't just park on the side of the road! Illegal parking fees in Japan are surprisingly high, and the procedures after being ticketed are cumbersome (you must report to the nearest police station immediately and pay), so use parking lots as much as possible.",
        },
        { type: "p", text: "You can use these tools to find legal motorcycle parking:" },
        {
          type: "ul",
          items: [
            "Nationwide motorcycle parking guide: www.jmpsa.or.jp/society/parking/",
            "NAVITIME motorcycle parking search: www.navitime.co.jp/motorbike/parking/",
          ],
        },
      ],
    },
    {
      slug: "fees",
      title: "Rent and fees",
      intro:
        "How much does it cost to rent a motorcycle in Japan? The actual rent depends on the vehicle class, rental period and the accessories you choose — here is the full price list.",
      seoTitle: "Japan motorcycle rental prices & fees",
      updated: "2026-08-06",
      blocks: [
        {
          type: "p",
          text: "Below are reference prices for vehicle rent and the various add-ons. The actual rent varies slightly by vehicle class, rental dates and branch, and the final quote is confirmed on the rental booking form.",
        },
        { type: "h", text: "Japan motorcycle rental rates (HK$)" },
        {
          type: "table",
          head: ["Class", "4 hrs", "8 hrs", "1 day (24 hrs)", "Each day from day 2", "Overtime / hour"],
          rows: [
            ["P-1", "$220", "$245", "$295", "$195", "$50"],
            ["P-2", "$330", "$365", "$440", "$295", "$75"],
            ["P-3", "$605", "$675", "$810", "$540", "$135"],
            ["P-4", "$770", "$855", "$1,030", "$685", "$170"],
            ["P-5", "$880", "$980", "$1,175", "$785", "$195"],
            ["P-6", "$990", "$1,100", "$1,320", "$880", "$220"],
            ["P-7", "$1,320", "$1,470", "$1,765", "$1,175", "$295"],
          ],
        },
        {
          type: "note",
          text: "The table above already includes compulsory and voluntary insurance, but not fuel, expressway tolls or parking. Rental bands are 4 hours, 8 hours, 1 day, and per 24 hours from the 2nd day onward.",
        },
        { type: "h", text: "Compulsory insurance (already included in the rental fee)" },
        {
          type: "table",
          head: ["Item", "Cover"],
          rows: [
            ["Third-party injury or death", "No upper limit"],
            ["Third-party property damage", "Up to 10,000,000 yen per accident (50,000-yen deductible)"],
            ["Passenger injury or death", "Up to 5,000,000 yen — only for lasting disability or death (not paid for models under 125cc)"],
            ["Theft cover", "Up to 50% of damage value (50% deductible)"],
          ],
        },
        { type: "h", text: "Vehicle damage compensation (not in the table above) (HK$)" },
        {
          type: "table",
          head: ["Class (deductible)", "1 day (24 hrs)", "Each day from day 2"],
          rows: [
            ["P-1 & P-2 (30,000-yen deductible)", "$85", "$50"],
            ["P-3 (50,000-yen deductible)", "$140", "$75"],
            ["P-4 (50,000-yen deductible)", "$195", "$105"],
            ["P-5 (100,000-yen deductible)", "$195", "$105"],
            ["P-6 (100,000-yen deductible)", "$215", "$115"],
            ["P-7 (100,000-yen deductible)", "$245", "$130"],
          ],
        },
        { type: "h", text: "MamoRide compensation (exclusive to Vehicle Compensation subscribers, optional) (HK$)" },
        {
          type: "table",
          head: ["Class (halved deductible)", "1 day (24 hrs)", "Each day from day 2"],
          rows: [
            ["P-1 (15,000-yen deductible)", "$110", "$40"],
            ["P-2 (15,000-yen deductible)", "$110", "$40"],
            ["P-3 (25,000-yen deductible)", "$150", "$55"],
            ["P-4 (25,000-yen deductible)", "$160", "$65"],
            ["P-5 (50,000-yen deductible)", "$160", "$65"],
            ["P-6 (50,000-yen deductible)", "$175", "$70"],
            ["P-7 (50,000-yen deductible)", "$185", "$75"],
          ],
        },
        {
          type: "note",
          text: "MamoRide can only be added to reservations of 15 days or less, and only halves the vehicle-compensation deductible for on-the-spot tip-overs (non-riding state) while parking, mounting/dismounting or pushing the bike. Damage caused while riding is not covered.",
        },
        { type: "h", text: "Accessories available to reserve (availability varies by bike) (HK$)" },
        {
          type: "table",
          head: ["Item", "1 day (24 hrs)", "Each day from day 2"],
          rows: [
            ["Helmet", "$60", "$10"],
            ["Tail box", "$90", "$20"],
            ["Side bag", "$60", "$10"],
            ["Side box (pannier)", "$90", "$20"],
            ["Phone mount", "Free", "Free"],
          ],
        },
        { type: "h", text: "Available on the departure day only (settled in yen on return)" },
        {
          type: "table",
          head: ["Item", "1 day (24 hrs)", "Each day from day 2"],
          rows: [
            ["Rear-seat bag", "¥500", "¥100"],
            ["Cargo net", "¥200", "¥100"],
            ["Tank bag", "¥200", "¥100"],
            ["Anti-theft lock", "¥200", "¥200"],
            ["ETC card", "¥220", "¥110"],
            ["Gloves", "¥330", "¥110"],
            ["Anti-fall jacket", "¥550", "¥330"],
            ["Chest protector", "¥330", "¥110"],
          ],
        },
        { type: "h", text: "Fee components" },
        {
          type: "ul",
          items: [
            "Vehicle rent: charged by vehicle class and rental band (4 hours, 8 hours, 1 day, and per 24 hours from the 2nd day).",
            "Fuel: you pay for your own fuel and must return the bike with a full tank.",
            "Expressway tolls (ETC): the ETC card rental is 220 yen per day, and tolls are settled when you return the bike.",
            "Insurance: the basic fee already includes compulsory and voluntary insurance; vehicle compensation and MamoRide compensation can be added.",
            "Helmet / gear: bring your own, or rent a helmet and gear by size.",
            "Parking: parking fees depend on the car park; please use parking lots where possible.",
          ],
        },
        {
          type: "note",
          text: "Note: payment is made to Helmet King by bank transfer / FPS within three working days after the rental invoice is issued. Rentals are for those aged 18+ holding a valid HK/Macau licence, International Driving Permit and passport, and only the renter's own physical credit or debit card is accepted. For a quote, use the rental booking form or WhatsApp our team: wa.me/85298686569.",
        },
      ],
    },
    {
      slug: "insurance",
      title: "Insurance",
      intro:
        "The basic fee already includes Japan's compulsory and voluntary insurance, with vehicle compensation and MamoRide compensation also available.",
      seoTitle: "Japan motorcycle rental insurance explained",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Insurance included in the basic fee" },
        { type: "h3", text: "Compulsory and voluntary insurance" },
        {
          type: "p",
          text: "The basic fee already includes Japan's compulsory and voluntary insurance. In the event of an accident, compensation is paid within the following limits:",
        },
        {
          type: "ul",
          items: [
            "Personal injury: no upper limit",
            "Property damage: up to 10,000,000 yen per accident (deductible / excess of 50,000 yen)",
            "Rider injury: up to 5,000,000 yen per person for death or lasting disability (for models of 125cc or below — moped classes 1 and 2 — no benefit is paid for death or disability)",
          ],
        },
        {
          type: "note",
          text: "※ Disability and claim amounts are assessed by the insurer under the policy terms. Benefits may not be payable for certain reasons, so please read the insurance and compensation notes below carefully.",
        },
        { type: "h3", text: "Roadside assistance" },
        {
          type: "p",
          text: "Voluntary insurance includes 24-hour, year-round roadside assistance. Towing within 20 km is free; if the tow passes through a toll road, that toll and any towing beyond 20 km are borne by the customer. From June 2025, voluntary insurance no longer covers tyre repair or a dead battery — the bike is towed to the nearest shop that can help repair it. For long or long-term trips, we recommend carrying your own tyre repair kit and a portable jump starter.",
        },
        { type: "h3", text: "If the vehicle is stolen (theft insurance)" },
        {
          type: "p",
          text: "The basic fee already includes theft insurance. If the vehicle is stolen during the rental period, the customer only bears 50% of the vehicle's market value plus the business loss compensation; theft insurance covers up to 50% of the vehicle's market value.",
        },
        {
          type: "note",
          text: "Theft insurance does not apply if the vehicle was not locked, or if the key was left in the vehicle. When leaving the bike, always engage the steering lock and remove the key.",
        },
        { type: "h3", text: "Vehicle compensation" },
        {
          type: "p",
          text: "For an extra fee you can add Vehicle Compensation. If a crash or accident results in repair costs that the customer would have to bear, the portion above the deductible is covered by the compensation.",
        },
        { type: "h3", text: "MamoRide compensation (optional add-on)" },
        {
          type: "p",
          text: "MamoRide is an add-on exclusive to Vehicle Compensation subscribers and cannot be purchased on its own. When the bike tips over on the spot in a non-riding state (while parked, mounting or dismounting, or pushing the bike), the vehicle-compensation deductible is halved. It applies only within Japan, can be used at most once per rental period, and can only be added to reservations of 15 days or less (reservations of 16 days or more cannot add MamoRide). Damage caused while riding is not covered.",
        },
        { type: "h3", text: "About the deductible (excess)" },
        {
          type: "p",
          text: "The deductible is the amount the customer must pay in the event of an accident or fall. At the P-4 level, for example, the maximum deductible is 50,000 yen: as long as the repair cost is 50,000 yen or less, the customer pays only the actual repair cost; when the repair cost reaches 200,000 yen, the customer still pays at most 50,000 yen, and the other 150,000 yen is covered by insurance. If the repair cost cannot be determined immediately, we first charge the maximum deductible as a deposit and refund the difference once the actual cost is known.",
        },
        { type: "h", text: "Accident, tip-over and breakdown" },
        { type: "h3", text: "CASE 1. Accident with another party or damage to their property" },
        { type: "p", text: "Stay calm and do not panic. Follow the steps below:" },
        {
          type: "ol",
          items: [
            "Check whether anyone is injured; if medical help is needed, call 119 immediately.",
            "Be sure to call the police on 110.",
            "Photograph the scene and, as far as possible, record the other party's licence plate, name and phone or other contact details.",
            "Contact the insurance company to report the accident (the insurer's number is on your reservation page; translation in languages other than Japanese is provided).",
            "Report the accident to the pick-up shop and follow the instructions of our staff.",
          ],
        },
        { type: "h3", text: "CASE 2. Single-vehicle accident or breakdown with no third party" },
        {
          type: "p",
          text: "For a single-vehicle incident (such as a solo tip-over with no contact with anyone else's property), first contact the departure shop or +81-50-6861-5819 and follow our staff's instructions. Even if you added Vehicle Compensation, you may still be charged up to the deductible limit.",
        },
        { type: "h3", text: "CASE 3. If the vehicle is stolen" },
        {
          type: "ol",
          items: [
            "Be sure to call the police on 110.",
            "Contact the departure shop or +81-50-6861-5819 and follow our staff's instructions.",
          ],
        },
        {
          type: "p",
          text: "The basic fee already includes theft insurance, which covers 50% of the market value the company sets for the vehicle; the other 50% is borne by the customer. Theft insurance does not apply if the vehicle was left unlocked or the key was left in it. If you run into any trouble during the rental, contact the Rental819 reservation centre at any time (Chinese and English service available).",
        },
        { type: "h", text: "Business loss compensation (NOC)" },
        {
          type: "p",
          text: "If, during the rental, an accident, theft, tip-over or similar cause requires repairs that leave the vehicle un-rentable, the customer must pay business loss compensation. This is charged additionally even if you added Vehicle Compensation and cannot be waived. Riding with a mirror, indicator, headlight, tail light or other safety part fallen off or damaged is dangerous and violates Japan's road traffic law; if you force the bike back to the shop, you may still be charged 50,000 yen in business loss compensation.",
        },
        {
          type: "table",
          head: ["Situation", "Business loss compensation borne by customer"],
          rows: [
            ["The renter can ride the vehicle back to the pick-up shop", "20,000 yen"],
            [
              "The renter cannot ride the vehicle back and it must be towed",
              "50,000 yen + towing beyond the free towing distance",
            ],
            ["The vehicle is stolen during the rental period", "50,000 yen + 50% of the vehicle's market value"],
            ["The vehicle key is lost", "20,000 yen + key-making fee"],
          ],
        },
        { type: "h3", text: "Damage grade and business loss compensation" },
        {
          type: "p",
          text: "All vehicles provided by Rental819 have repair costs calculated using the Vehicle Damage Standard. When damage reaches the moderate grade or above, the customer bears the business loss compensation.",
        },
        {
          type: "table",
          head: ["Grade", "Condition", "Business loss compensation"],
          rows: [
            [
              "Light",
              "Repair under 20,000 yen; levers, mirrors, footpegs and the like that can be simply replaced",
              "None",
            ],
            [
              "Low",
              "Shell, exhaust and similar minor damage below 50% of the assessment ratio, repairable without affecting riding",
              "None",
            ],
            [
              "Moderate",
              "Damage at 50% or more of the assessment ratio, or parts needing replacement; vehicle temporarily un-rentable",
              "20,000 yen",
            ],
            ["Severe", "The vehicle is judged a total loss", "50,000 yen"],
          ],
        },
        { type: "h3", text: "Damage assessment ratio" },
        {
          type: "p",
          text: "For repairable scratches and dents, Rental819 sets the damage ratio by the following standard (example based on a part worth 10,000 yen):",
        },
        {
          type: "table",
          head: ["Scratch / dent size", "Assessment ratio", "Customer pays (10,000-yen part)"],
          rows: [
            ["One 500-yen coin (~25mm)", "30%", "3,000 yen"],
            ["Two 500-yen coins (26–50mm)", "40%", "4,000 yen"],
            ["Three 500-yen coins (51–75mm)", "50%", "5,000 yen"],
            ["Four 500-yen coins (75mm+)", "100% (replacement)", "10,000 yen + replacement labour"],
          ],
        },
        {
          type: "note",
          text: "※ Parts that are fractured, cracked, bent, deformed or torn are not subject to the damage assessment ratio.",
        },
        { type: "h3", text: "Parts replacement labour" },
        {
          type: "p",
          text: "Rental819 uses one labour rate across all shops: 11,000 yen per hour (tax included) throughout Japan. No labour is charged for repairs. Actual labour is the manufacturer's standard hours multiplied by the rate — for example, replacing the lever on a HONDA CB400SF is 0.1 hours, so 11,000 × 0.1 = 1,100 yen.",
        },
        { type: "h3", text: "Definition of total loss and amount payable" },
        {
          type: "p",
          text: "A total loss means the vehicle can no longer be repaired, the repair cost exceeds the vehicle's market value, or it cannot run normally after repair.",
        },
        {
          type: "table",
          head: ["Vehicle Compensation added?", "Amount borne by customer"],
          rows: [
            ["Added", "The deductible cap for that vehicle class + 50,000 yen business loss compensation"],
            ["Not added", "The rented vehicle's market price + 50,000 yen business loss compensation"],
          ],
        },
        { type: "h3", text: "Loss of issued documents" },
        {
          type: "table",
          head: ["Type", "Handling fee"],
          rows: [
            [
              "Vehicle inspection / registration certificate or compulsory insurance certificate",
              "16,500 yen (tax included)",
            ],
          ],
        },
        { type: "h3", text: "Cases not covered by insurance" },
        {
          type: "p",
          text: "In the following cases, insurance will not pay out and the renter bears the damages:",
        },
        {
          type: "ul",
          items: [
            "Driving without a licence",
            "Drunk driving",
            "Driving without wearing a helmet",
            "An accident caused by someone other than the renter driving",
            "No report filed with the police (no accident certificate)",
            "Settling privately with the other party without authorisation",
            "Failing to contact the departure shop or the Rental819 reservation centre at the scene",
            "Continuing to use the vehicle past the reserved rental time without first contacting the shop or the Rental819 reservation centre when an accident occurs",
            "When the vehicle is stolen",
            "Carrying more people or cargo than the vehicle's legal limit",
            "Accidents off public roads",
            "Using the vehicle for testing, racing or towing other vehicles",
            "Repair costs for damage or corrosion caused by improper use",
            "Damaging the shop's other vehicles or property within the shop premises",
            "Accidents caused by mis-operating the vehicle or operational error",
            "Other breaches of the rental terms",
            "Accidents that fall under the exclusions of another insurer's policy",
          ],
        },
      ],
    },
    {
      slug: "etc",
      title: "ETC",
      intro:
        "ETC is Japan's wireless electronic toll system, letting you pass toll gates on the expressway without stopping.",
      seoTitle: "ETC on Japan expressways for motorcycles",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "What is ETC?" },
        {
          type: "p",
          text: "ETC stands for Electronic Toll Collection system, a wireless payment system used on Japanese highways that lets drivers cross toll lanes without stopping. It consists of an ETC card reader, an ETC card and an ETC indicator light: simply insert the card into the dedicated reader, and if the indicator shows a continuous green flash, the ETC system is working normally.",
        },
        {
          type: "note",
          text: "Motorcycles under 125cc cannot be driven on highways, so the ETC system cannot be installed on them.",
        },
        { type: "h", text: "How to use ETC" },
        {
          type: "ol",
          items: [
            "When you reach the expressway toll gate, pull into the ETC lane.",
            "No need to stop — just drive slowly down the middle of the blue line (less than 20 km/h).",
            "Once the gate opens, drive slowly out of the toll booth.",
          ],
        },
        { type: "h", text: "Renting ETC at Rental819" },
        {
          type: "p",
          text: "Most vehicles rented at Rental819 are already fitted with the ETC system; you only need to rent an ETC card to use it. At the time of rental, you can check whether the vehicle has an ETC system and whether the branch has an ETC card available.",
        },
        {
          type: "p",
          text: "ETC cards are limited in supply — please ask staff at the branch when you collect the bike. On the rental day, besides the vehicle rent you also pay the ETC card rental of 220 yen per day. When returning the bike, settle the highway tolls at the same time; a late return incurs an additional late fee.",
        },
        { type: "h", text: "Precautions when using an ETC card" },
        {
          type: "ul",
          items: [
            "When passing a toll gate, keep your distance from the vehicle ahead and drive slowly to avoid a collision.",
            "Keep your distance from other vehicles, travel at under 20 km/h and 5 metres behind the vehicle in front, and pass straight through the gate.",
            "Do not overtake within the ETC lane.",
            "If the ETC lane malfunctions or the gate fails to open, leave the lane carefully and watch for vehicles behind you.",
            "After leaving, inform the toll staff as soon as possible so you can park safely and wait for instructions.",
            "Do not reverse, make a U-turn, or move to another lane.",
            "If there is no ETC lane available, or you cannot exit via ETC, use a regular toll gate and show your ETC card to the staff.",
          ],
        },
      ],
    },
    {
      slug: "traffic-rules",
      title: "Japanese traffic rules",
      intro: "Here are the main traffic rules you need to follow when driving in Japan.",
      seoTitle: "Japan traffic rules for riders",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Keep left" },
        {
          type: "p",
          text: "As in Hong Kong and Macau, traffic in Japan drives on the left. On the expressway, the right lane is likewise the overtaking lane.",
        },
        { type: "h", text: "Major traffic signs in Japan" },
        {
          type: "ul",
          items: [
            "General national highways and prefectural roads",
            "No entry, no parking, no stopping, no U-turn, no entry ahead",
            "Speed limit, stop",
            "50cc vehicles may not make a two-stage right turn",
            "Drive only in the direction shown, one-way street",
          ],
        },
        { type: "h", text: "Stop signs" },
        {
          type: "p",
          text: "Stop signs usually appear at road junctions, where routes merge, and near special public places such as schools and hospitals. You must bring the vehicle to a complete stop; on a motorcycle, your foot must touch the ground to count as a full stop. If you ride in a group, every vehicle must stop. Also, if you see a red light like the one at a railway crossing, you must stop when it flashes even without a stop sign.",
        },
        { type: "h", text: "Speed limits" },
        {
          type: "p",
          text: "If there is no speed sign on the road, the maximum in Japan is 100 km/h on national highways and 50 km/h on other roads. But most expressways are 90 km/h, and some are 80 km/h. Speed limits may also be adjusted for weather, so watch the current speed signs.",
        },
        { type: "h", text: "Overtaking" },
        {
          type: "ul",
          items: [
            "White dotted line: no special restriction — you may cross to overtake the vehicle ahead.",
            "White solid line: usually before special sections or merges — you may not cross.",
            "Solid yellow line: usually before special sections or merges — you may not cross to overtake.",
          ],
        },
        { type: "h", text: "Special roads" },
        {
          type: "p",
          text: "At intersections there are usually arrows on the road showing which way you may go: generally the rightmost lane turns right, the middle goes straight, and the leftmost turns left. About 30 to 40 metres before the intersection the line becomes solid yellow, and you may no longer change lanes — you must follow the direction marked on the ground. Slow down and check the ground markings carefully before crossing.",
        },
        { type: "h", text: "Zebra crossings and level crossings" },
        {
          type: "p",
          text: "Pedestrians and bicycles have priority at zebra crossings; when crossing, make sure no pedestrians or bicycles are passing on either side, and let any waiting pedestrian go first. At a level crossing you must stop completely even if the gate is fully open; failing to comply may result in a fine.",
        },
        { type: "h", text: "Traffic lights" },
        {
          type: "p",
          text: "In Japan many traffic lights have arrows showing which way you may go; when an arrow shows green, you may proceed in that direction. Most lights are mounted on the far side of the road, so at intersections remember to watch the lights across the junction.",
        },
        { type: "h", text: "Rules for vehicles 50cc or under" },
        {
          type: "ul",
          items: [
            "May not carry passengers",
            "Maximum speed: 30 km/h",
            "Must ride within one metre of the left edge of the road",
            "May not use highways",
            "To turn right on a three-lane road, a two-stage turn must be used (in some cases it is not allowed)",
          ],
        },
        {
          type: "note",
          text: "On the Tokyo Metropolitan Expressway some routes may not carry passengers — watch for the orange routes shown on the map.",
        },
        { type: "h", text: "About parking" },
        {
          type: "p",
          text: "In cities you must park in a parking area; if you park illegally on the road, an officer will issue you a ticket. Vehicles under 50cc can be parked in bicycle parking; motorcycles over 50cc should use motorcycle spaces, though parking in a private car space is also legal. Before using a supermarket, department store or mall car park, confirm the terms of use; convenience-store parking generally cannot be used for long periods.",
        },
        {
          type: "note",
          text: "If you receive a parking violation ticket, you must go to the responsible police station to complete the formalities and pay the fine. If you do not do so before returning the car, we will charge you the fine plus an additional 20,000 yen.",
        },
      ],
    },
    {
      slug: "pickup",
      title: "Reservation and pick-up process",
      intro:
        "To give you the best service, please take a few minutes to learn the details and restrictions of renting a motorcycle in Japan.",
      seoTitle: "How to book & collect a rental motorcycle in Japan",
      updated: "2026-08-06",
      blocks: [
        { type: "h", text: "Before departure" },
        { type: "h3", text: "STEP 1 Confirm the documents" },
        {
          type: "p",
          text: "Please check that you hold a driver's licence usable in Japan. Rental819 serves only adults aged 18 or older; if you are under 18, we are unable to provide motorcycle rental services.",
        },
        { type: "p", text: "Documents required before renting:" },
        {
          type: "ul",
          items: [
            "Passport (presented at the time of rental)",
            "Credit card (bring more than one in case there is a problem when swiping)",
            "Driving licence: if you are a Hong Kong or Macau driver, bring your HK/Macau licence and your International Driving Permit. If your licence was issued in another country, please contact us first to confirm.",
          ],
        },
        {
          type: "note",
          text: "Make sure your International Driving Permit clearly shows motorcycle authorisation and check that it has not expired.",
        },
        { type: "h3", text: "STEP 2 Select a branch" },
        {
          type: "p",
          text: "RENTAL819 has stores all over Japan and every branch can provide rental services. If you cannot communicate in Japanese, we will arrange a branch with English- or Mandarin-speaking staff. On the form, enter the region where you want to rent; if you have a preferred store, list it. Pick-up and return must be at the same store.",
        },
        { type: "h3", text: "STEP 3 Choose a motorcycle" },
        {
          type: "p",
          text: "If you already have a bike in mind, list your top three on the form and we will arrange them in order of preference and availability. If you're not sure, ask our staff based on the bike's weight, seat height, drivetrain, type and engine capacity.",
        },
        { type: "p", text: "Additional points to note when choosing a bike:" },
        {
          type: "ul",
          items: [
            "A vehicle 50cc or under, or one whose registration lists only a single seat, cannot carry a passenger",
            "The Capital Expressway (e.g. the Central Ring Road, the Bayshore Route) cannot carry passengers",
            "Motorcycles under 125cc cannot use the expressway",
            "Vehicles over 50cc must park in a motorcycle space; those 50cc or under may park in a bicycle space",
          ],
        },
        {
          type: "p",
          text: "The accessories each bike can take (such as ETC / tail box / side box) vary, so confirm the details before renting. Some branches offer ETC card hire so you can use automatic toll payment on the expressway.",
        },
        { type: "h3", text: "STEP 4 Select the date" },
        {
          type: "p",
          text: "You can book up to four months in advance, and at least one week ahead. Reservations are first-come, first-served, so book early to secure your preferred bike. Each shop also has different closing days, on which you cannot pick up or return a vehicle.",
        },
        { type: "h3", text: "STEP 5 Fill out the rental form" },
        {
          type: "p",
          text: "Fill in your personal details, pick-up and return times, and whether you need a helmet or other accessories. Once we receive your details, we will send a confirmation email within 3–5 working days; once you have it, you're ready to go.",
        },
        { type: "h", text: "After arriving" },
        { type: "h3", text: "STEP 6 On the day of rental" },
        { type: "p", text: "When renting, please present the following valid documents:" },
        {
          type: "ul",
          items: [
            "Passport",
            "International and national driving permits",
            "Appropriate motorcycling gear (including but not limited to a helmet, anti-fall jacket, anti-fall trousers and motorcycle boots)",
          ],
        },
        {
          type: "p",
          text: "It takes about 15 minutes to explain the contract and insurance and check the bike, so please arrive before your scheduled time. After you sign the rental contract, we photocopy your passport and licence; once the bike is checked before departure, you can set off.",
        },
        { type: "h3", text: "STEP 7 Return the car" },
        {
          type: "p",
          text: "We fill the tank when you rent, so please return the bike with a full tank of the specified fuel. If it is not full on return, we charge back the fuel difference. After checking the fuel level, exterior and performance, if there are no problems the rental is complete. (If you rented an ETC card, all tolls are also settled on return.)",
        },
        {
          type: "note",
          text: "If you need to return later than scheduled, contact us well before the scheduled time; if there is no reservation after yours, we can extend the rental period for you.",
        },
      ],
    },
  ],
};
