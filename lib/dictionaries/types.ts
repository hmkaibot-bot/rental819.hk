/** Shared shape for both language dictionaries so copy stays in sync. */
export interface Dictionary {
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    home: string;
    rental: string;
    tours: string;
    packages: string;
    roads: string;
    guide: string;
    about: string;
    faq: string;
    contact: string;
    book: string;
  };
  guideMenu: {
    planTrip: string;
    route: string;
    howManyDays: string;
    budget: string;
    fees: string;
    insurance: string;
    etc: string;
    trafficRules: string;
    pickup: string;
  };
  common: {
    readMore: string;
    learnMore: string;
    bookNow: string;
    contactUs: string;
    whatsapp: string;
    viewAll: string;
    backHome: string;
    getStarted: string;
    enquire: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    guideLinks: string;
    contact: string;
    hours: string;
    hoursValue: string;
    address: string;
    addressValue: string;
    rights: string;
    partnership: string;
    privacy: string;
    sisterBrands: string;
  };
}
