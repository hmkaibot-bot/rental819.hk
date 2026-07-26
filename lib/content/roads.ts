import type { Locale } from "@/lib/i18n";

export interface RoadItem {
  name: string;
  pref: string; // prefecture(s)
  blurb: string;
}
export interface RoadRegion {
  region: string;
  roads: RoadItem[];
}
export interface RoadsContent {
  hero: { eyebrow: string; title: string; intro: string };
  regions: RoadRegion[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaTours: string; // → external 26adventure tours
  ctaBook: string;
}

// The Rental819 store list root — not used here, kept for reference.
export const TOURS_URL = "https://26adventure.com/tours";

export const roadsContent: Record<Locale, RoadsContent> = {
  "zh-hk": {
    hero: {
      eyebrow: "日本名道",
      title: "日本名道圖鑑",
      intro:
        "由北海道的無盡直路到沖繩的跨海道路，精選全日本最值得騎的名道與絕景公路。揀定心水路線，租車自駕，或者交俾我們編成旅行團。",
    },
    regions: [
      {
        region: "北海道",
        roads: [
          { name: "知床橫斷道路", pref: "北海道", blurb: "穿越世界遺產知床半島，兩旁殘雪與硫磺山景。" },
          { name: "日本海 Ororon Line", pref: "北海道", blurb: "沿日本海筆直延伸，一邊風車、一邊無盡海岸線。" },
          { name: "Esanuka 線", pref: "北海道", blurb: "宗谷原野中筆直到天邊、零電線桿的療癒直路。" },
          { name: "三國峠", pref: "北海道", blurb: "北海道最高的山口，橫跨大雪山的森林綠海。" },
          { name: "Naitai 高原牧場道路", pref: "北海道", blurb: "登上日本最大牧場的丘頂，盡覽十勝平原。" },
        ],
      },
      {
        region: "東北",
        roads: [
          { name: "磐梯吾妻 Skyline", pref: "福島県", blurb: "攀上淨土平，火山荒原與硫磺煙景。" },
          { name: "藏王 Echo Line", pref: "宮城県・山形県", blurb: "通往御釜火口湖的高原越嶺路。" },
          { name: "八幡平 Aspite Line", pref: "岩手県・秋田県", blurb: "高山濕原與雲上展望的爽快山道。" },
          { name: "鳥海 Blue Line", pref: "秋田県・山形県", blurb: "一路爬升至鳥海山五合目，海天一色。" },
          { name: "十和田湖・奧入瀨溪流", pref: "青森県・秋田県", blurb: "沿溪流與湖畔而行的紅葉名景。" },
        ],
      },
      {
        region: "關東",
        roads: [
          { name: "榛名山（秋名山）", pref: "群馬県", blurb: "動漫聖地，經典髮夾彎連發。" },
          { name: "赤城山", pref: "群馬県", blurb: "另一條漫畫名山，長距離爬坡彎路。" },
          { name: "碓冰峠", pref: "群馬県・長野県", blurb: "184 個彎的舊國道，峠道經典。" },
          { name: "伊呂波坂", pref: "栃木県", blurb: "通往日光奧地，48 個彎接連而上。" },
          { name: "箱根 Turnpike", pref: "神奈川県", blurb: "望富士、下相模灣的收費爽快道。" },
          { name: "蘆之湖 Skyline", pref: "神奈川県・静岡県", blurb: "沿箱根外輪山，富士與蘆之湖同框。" },
        ],
      },
      {
        region: "中部・北陸",
        roads: [
          { name: "維納斯公路 Venus Line", pref: "長野県", blurb: "霧之峰高原上的天空稜線路。" },
          { name: "志賀草津高原路線", pref: "群馬県・長野県", blurb: "日本最高國道之一，穿越白根火山。" },
          { name: "伊豆 Skyline", pref: "静岡県", blurb: "沿伊豆半島山脊，一路海景與富士。" },
          { name: "西伊豆 Skyline", pref: "静岡県", blurb: "免費稜線路，駿河灣夕陽絕景。" },
          { name: "千里濱沙灘公路", pref: "石川県", blurb: "可騎上沙灘、貼著日本海行駛的渚公路。" },
        ],
      },
      {
        region: "關西",
        roads: [
          { name: "比叡山 Driveway", pref: "滋賀県・京都府", blurb: "俯瞰琵琶湖與京都盆地的山上道。" },
          { name: "伊吹山 Driveway", pref: "滋賀県・岐阜県", blurb: "直上近畿最高峰的展望收費路。" },
          { name: "高野龍神 Skyline", pref: "和歌山県・奈良県", blurb: "沿護摩壇山的高野山靈境稜線。" },
          { name: "鈴鹿 Skyline", pref: "三重県・滋賀県", blurb: "越過鈴鹿山脈的彎路，賽道之名由來。" },
          { name: "淡路島 Sunset Line", pref: "兵庫県", blurb: "淡路島西岸，追著瀨戶內海夕陽。" },
        ],
      },
      {
        region: "中國・四國",
        roads: [
          { name: "角島大橋", pref: "山口県", blurb: "跨越翡翠海的絕景大橋，廣告常客。" },
          { name: "秋吉台喀斯特公路", pref: "山口県", blurb: "穿過日本最大喀斯特台地的草原路。" },
          { name: "蒜山大山 Skyline", pref: "岡山県・鳥取県", blurb: "望大山的高原稜線兜風路。" },
          { name: "島波海道", pref: "広島県・愛媛県", blurb: "跳島跨海、單車電單車皆宜的海道。" },
          { name: "四國喀斯特天空之路", pref: "愛媛県・高知県", blurb: "稜線牧場與風車的「天空之路」。" },
          { name: "UFO Line（瓶森林道）", pref: "高知県", blurb: "雲上稜線細路，汽車廣告名場面。" },
        ],
      },
      {
        region: "九州・沖繩",
        roads: [
          { name: "山並 Highway", pref: "大分県・熊本県", blurb: "貫穿九重連山與草原的高原大道。" },
          { name: "阿蘇牛奶之路", pref: "熊本県", blurb: "阿蘇外輪山上的牧歌牛奶之路。" },
          { name: "Kenny Road", pref: "熊本県", blurb: "阿蘇北外輪的展望農道，騎士暱稱。" },
          { name: "阿蘇 Panorama Line", pref: "熊本県", blurb: "直上阿蘇中岳火口的草千里全景路。" },
          { name: "指宿 Skyline", pref: "鹿児島県", blurb: "沿薩摩半島稜線，望開聞岳與錦江灣。" },
          { name: "沖繩海中道路", pref: "沖縄県", blurb: "貼海而行、連接離島的跨海道路。" },
        ],
      },
    ],
    ctaTitle: "想親身騎呢啲路？",
    ctaSubtitle: "交俾我們——租車自駕或參加電單車旅行團，一條龍為你編排路線、住宿與後勤。",
    ctaTours: "睇電單車旅行團",
    ctaBook: "立即租車預約",
  },
  en: {
    hero: {
      eyebrow: "Japan Roads",
      title: "Japan's Legendary Roads",
      intro:
        "From Hokkaido's endless straights to Okinawa's sea-crossing causeway, a curated field guide to Japan's greatest riding roads. Pick your route and self-drive, or let us build it into a guided tour.",
    },
    regions: [
      {
        region: "Hokkaido",
        roads: [
          { name: "Shiretoko Pass", pref: "Hokkaido", blurb: "Over the World-Heritage Shiretoko Peninsula amid lingering snow and sulphur peaks." },
          { name: "Ororon Line", pref: "Hokkaido", blurb: "A dead-straight run along the Japan Sea — wind turbines one side, endless coast the other." },
          { name: "Esanuka Line", pref: "Hokkaido", blurb: "A pole-free arrow through the Soya grasslands, straight to the horizon." },
          { name: "Mikuni Pass", pref: "Hokkaido", blurb: "Hokkaido's highest pass, over the green forest sea of the Daisetsu range." },
          { name: "Naitai Kogen Ranch Road", pref: "Hokkaido", blurb: "Climb Japan's largest ranch for a sweep over the Tokachi plain." },
        ],
      },
      {
        region: "Tohoku",
        roads: [
          { name: "Bandai-Azuma Skyline", pref: "Fukushima", blurb: "Up to Jododaira through a smoking volcanic wasteland." },
          { name: "Zao Echo Line", pref: "Miyagi · Yamagata", blurb: "A highland crossing to the Okama crater lake." },
          { name: "Hachimantai Aspite Line", pref: "Iwate · Akita", blurb: "Alpine marshes and above-the-clouds views." },
          { name: "Chokai Blue Line", pref: "Akita · Yamagata", blurb: "Climbs to Mt. Chokai's 5th station where sea meets sky." },
          { name: "Towada & Oirase Gorge", pref: "Aomori · Akita", blurb: "Along a stream and lakeshore famed for autumn colour." },
        ],
      },
      {
        region: "Kanto",
        roads: [
          { name: "Mt. Haruna (Akina)", pref: "Gunma", blurb: "Anime-legend hairpins, one after another." },
          { name: "Mt. Akagi", pref: "Gunma", blurb: "Another manga-famous climb of long sweeping bends." },
          { name: "Usui Pass", pref: "Gunma · Nagano", blurb: "The classic old highway of 184 corners." },
          { name: "Irohazaka", pref: "Tochigi", blurb: "48 stacked hairpins up into the Nikko highlands." },
          { name: "Hakone Turnpike", pref: "Kanagawa", blurb: "A toll blast with Fuji above and Sagami Bay below." },
          { name: "Ashinoko Skyline", pref: "Kanagawa · Shizuoka", blurb: "The Hakone caldera rim, Fuji and Lake Ashi in one frame." },
        ],
      },
      {
        region: "Chubu · Hokuriku",
        roads: [
          { name: "Venus Line", pref: "Nagano", blurb: "A sky-high ridge road across the Kirigamine highlands." },
          { name: "Shiga-Kusatsu Kogen Route", pref: "Gunma · Nagano", blurb: "One of Japan's highest national roads, past Mt. Shirane." },
          { name: "Izu Skyline", pref: "Shizuoka", blurb: "The spine of the Izu Peninsula, sea and Fuji throughout." },
          { name: "West Izu Skyline", pref: "Shizuoka", blurb: "A free ridge road with sunset views over Suruga Bay." },
          { name: "Chirihama Nagisa Driveway", pref: "Ishikawa", blurb: "Ride right on the beach along the Japan Sea." },
        ],
      },
      {
        region: "Kansai",
        roads: [
          { name: "Hieizan Driveway", pref: "Shiga · Kyoto", blurb: "A mountain road above Lake Biwa and the Kyoto basin." },
          { name: "Ibukiyama Driveway", pref: "Shiga · Gifu", blurb: "A toll climb to Kansai's highest peak." },
          { name: "Koya-Ryujin Skyline", pref: "Wakayama · Nara", blurb: "A sacred Koyasan ridge along Mt. Gomadanzan." },
          { name: "Suzuka Skyline", pref: "Mie · Shiga", blurb: "Winding over the Suzuka range — the name behind the circuit." },
          { name: "Awaji Sunset Line", pref: "Hyogo", blurb: "Chasing the Seto Inland Sea sunset down Awaji's west coast." },
        ],
      },
      {
        region: "Chugoku · Shikoku",
        roads: [
          { name: "Tsunoshima Bridge", pref: "Yamaguchi", blurb: "A postcard bridge across emerald water." },
          { name: "Akiyoshidai Karst Road", pref: "Yamaguchi", blurb: "Grassland riding over Japan's largest karst plateau." },
          { name: "Hiruzen-Daisen Skyline", pref: "Okayama · Tottori", blurb: "A highland cruise facing Mt. Daisen." },
          { name: "Shimanami Kaido", pref: "Hiroshima · Ehime", blurb: "Island-hopping sea bridges, great by bike or motorcycle." },
          { name: "Shikoku Karst Skyline", pref: "Ehime · Kochi", blurb: "A ridge of pastures and wind turbines — the 'road in the sky'." },
          { name: "UFO Line", pref: "Kochi", blurb: "A slim cloud-top ridge road, a car-ad favourite." },
        ],
      },
      {
        region: "Kyushu · Okinawa",
        roads: [
          { name: "Yamanami Highway", pref: "Oita · Kumamoto", blurb: "A highland run through the Kuju range and grasslands." },
          { name: "Aso Milk Road", pref: "Kumamoto", blurb: "A pastoral 'milk road' on the Aso outer rim." },
          { name: "Kenny Road", pref: "Kumamoto", blurb: "A rider-nicknamed farm road on Aso's north rim." },
          { name: "Aso Panorama Line", pref: "Kumamoto", blurb: "Straight up to the Nakadake crater and Kusasenri." },
          { name: "Ibusuki Skyline", pref: "Kagoshima", blurb: "A Satsuma ridge facing Mt. Kaimon and Kinko Bay." },
          { name: "Okinawa Kaichu Road", pref: "Okinawa", blurb: "A sea-level causeway linking the outer islands." },
        ],
      },
    ],
    ctaTitle: "Want to ride these roads?",
    ctaSubtitle: "Leave it to us — self-drive rental or a guided motorcycle tour, with routes, lodging and support all arranged.",
    ctaTours: "See guided tours",
    ctaBook: "Book a rental",
  },
};
