import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        festival_info: 'Festival Info',
        events: 'Events Schedule',
        funds: 'Donations & Funds',
        expenses: 'Expenses',
        gallery: 'Photo Gallery',
        audio: 'Audio Library',
        video: 'Video Library',
        location: 'Mandap Location',
        laddu: 'Laddu Auction',
        lucky_dip: 'Lucky Dip',
        manage_admins: 'Manage Admins'
      }
    }
  },
  te: {
    translation: {
      nav: {
        dashboard: 'డ్యాష్‌బోర్డ్',
        festival_info: 'పండుగ సమాచారం',
        events: 'కార్యక్రమాల షెడ్యూల్',
        funds: 'విరాళాలు & నిధులు',
        expenses: 'ఖర్చులు',
        gallery: 'ఫోటో గ్యాలరీ',
        audio: 'ఆడియో లైబ్రరీ',
        video: 'వీడియో లైబ్రరీ',
        location: 'మండపం స్థానం',
        laddu: 'లడ్డూ వేలం',
        lucky_dip: 'లక్కీ డిప్',
        manage_admins: 'అడ్మిన్‌లను నిర్వహించండి'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        dashboard: 'डैशबोर्ड',
        festival_info: 'त्योहार की जानकारी',
        events: 'कार्यक्रम अनुसूची',
        funds: 'दान और फंड',
        expenses: 'खर्च',
        gallery: 'फोटो गैलरी',
        audio: 'ऑडियो लाइब्रेरी',
        video: 'वीडियो लाइब्रेरी',
        location: 'मंडप का स्थान',
        laddu: 'लड्डू नीलामी',
        lucky_dip: 'लकी ड्रा',
        manage_admins: 'एडमिन प्रबंधित करें'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
