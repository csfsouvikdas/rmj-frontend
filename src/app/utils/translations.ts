type Language = 'en' | 'hi' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড' },
  orders: { en: 'Orders', hi: 'ऑर्डर', bn: 'অর্ডার' },
  clients: { en: 'Clients', hi: 'ग्राहक', bn: 'ক্লায়েন্ট' },
  workflow: { en: 'Workflow', hi: 'कार्यप्रवाह', bn: 'কর্মপ্রবাহ' },
  billing: { en: 'Billing', hi: 'बिलिंग', bn: 'বিলিং' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', bn: 'সেটিংস' },
  
  // Dashboard
  ordersReceivedToday: { en: 'Orders Received Today', hi: 'आज प्राप्त ऑर्डर', bn: 'আজ প্রাপ্ত অর্ডার' },
  goldReceivedToday: { en: 'Gold Received Today', hi: 'आज प्राप्त सोना', bn: 'আজ প্রাপ্ত স্বর্ণ' },
  profitGoldToday: { en: 'Profit Gold Today', hi: 'आज का लाभ सोना', bn: 'আজ মুনাফা স্বর্ণ' },
  pendingDeliveries: { en: 'Pending Deliveries', hi: 'लंबित डिलीवरी', bn: 'বিতরণ অপেক্ষমাণ' },
  delivered: { en: 'Delivered', hi: 'डिलीवर', bn: 'বিতরিত' },
  overdueOrders: { en: 'Overdue Orders', hi: 'अतिदेय ऑर्डर', bn: 'মেয়াদোত্তীর্ণ অর্ডার' },
  readyToDeliver: { en: 'Ready to Deliver', hi: 'डिलीवरी के लिए तैयार', bn: 'বিতরণের জন্য প্রস্তুত' },
  
  // Orders
  newOrder: { en: 'New Order', hi: 'नया ऑर्डर', bn: 'নতুন অর্ডার' },
  clientName: { en: 'Client Name', hi: 'ग्राहक का नाम', bn: 'ক্লায়েন্টের নাম' },
  jewelleryType: { en: 'Jewellery Type', hi: 'आभूषण प्रकार', bn: 'গহনা প্রকার' },
  fineGoldReceived: { en: 'Fine Gold Received', hi: 'प्राप्त शुद्ध सोना', bn: 'প্রাপ্ত খাঁটি স্বর্ণ' },
  profitType: { en: 'Profit Type', hi: 'लाभ प्रकार', bn: 'মুনাফার ধরন' },
  percentage: { en: 'Percentage', hi: 'प्रतिशत', bn: 'শতাংশ' },
  fixedGrams: { en: 'Fixed Grams', hi: 'निश्चित ग्राम', bn: 'নির্দিষ্ট গ্রাম' },
  profitValue: { en: 'Profit Value', hi: 'लाभ मूल्य', bn: 'মুনাফার মান' },
  expectedDelivery: { en: 'Expected Delivery', hi: 'अपेक्षित डिलीवरी', bn: 'প্রত্যাশিত বিতরণ' },
  profitGold: { en: 'Profit Gold', hi: 'लाभ सोना', bn: 'মুনাফা স্বর্ণ' },
  netGoldUsed: { en: 'Net Gold Used', hi: 'उपयोग किया गया सोना', bn: 'ব্যবহৃত স্বর্ণ' },
  balanceGold: { en: 'Balance Gold', hi: 'शेष सोना', bn: 'অবশিষ্ট স্বর্ণ' },
  
  // Clients
  newClient: { en: 'New Client', hi: 'नया ग्राहक', bn: 'নতুন ক্লায়েন্ট' },
  phone: { en: 'Phone', hi: 'फोन', bn: 'ফোন' },
  address: { en: 'Address', hi: 'पता', bn: 'ঠিকানা' },
  gstNumber: { en: 'GST Number', hi: 'जीएसटी नंबर', bn: 'জিএসটি নম্বর' },
  totalGoldGiven: { en: 'Total Gold Given', hi: 'कुल दिया गया सोना', bn: 'মোট প্রদত্ত স্বর্ণ' },
  totalGoldDelivered: { en: 'Total Gold Delivered', hi: 'कुल डिलीवर सोना', bn: 'মোট বিতরিত স্বর্ণ' },
  
  // Workflow
  received: { en: 'Gold Received', hi: 'सोना प्राप्त', bn: 'স্বর্ণ প্রাপ্ত' },
  making: { en: 'In Making', hi: 'निर्माणाधीन', bn: 'তৈরি হচ্ছে' },
  polishing: { en: 'Polishing', hi: 'पॉलिशिंग', bn: 'পলিশিং' },
  ready: { en: 'Ready', hi: 'तैयार', bn: 'প্রস্তুত' },
  
  // Common
  save: { en: 'Save', hi: 'सहेजें', bn: 'সংরক্ষণ' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', bn: 'বাতিল' },
  create: { en: 'Create', hi: 'बनाएं', bn: 'তৈরি করুন' },
  update: { en: 'Update', hi: 'अपडेट करें', bn: 'আপডেট' },
  delete: { en: 'Delete', hi: 'हटाएं', bn: 'মুছুন' },
  search: { en: 'Search', hi: 'खोजें', bn: 'অনুসন্ধান' },
  notes: { en: 'Notes', hi: 'नोट्स', bn: 'নোট' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें', bn: 'বিবরণ দেখুন' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key;
}
