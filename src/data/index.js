// ============================================================
// CHURCH INFO — Update with your church's details
// ============================================================
export const CHURCH_INFO = {
  name: 'Your Church Name',
  shortName: 'Your Church',
  tagline: 'Your Denomination',
  website: 'https://yourwebsite.com',
  address: 'Your Street, City, State ZIP',
  phone: '(000) 000-0000',
  email: 'info@yourchurch.com',
  about: 'Write a brief description of your church here.',
  serviceTimes: [
    { day: 'Sunday', service: 'Holy Liturgy', time: '8:00 AM' },
    { day: 'Sunday', service: 'Sunday School', time: '10:30 AM' },
  ],
};

// ============================================================
// HOME CARDS — Cards shown on the home screen
// screen: name of the screen to navigate to
// givingUrl: URL for donations (if screen is 'Giving')
// ============================================================
export const HOME_CARDS = [
  {
    id: '1',
    title: 'Announcements',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?w=800&q=80',
    screen: 'Announcements',
  },
  {
    id: '2',
    title: 'Live Stream',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    screen: 'LiveStream',
    liveUrl: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID',
  },
  {
    id: '3',
    title: 'Sermons',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    screen: 'Sermons',
  },
  {
    id: '4',
    title: 'Sign-ups',
    subtitle: 'Register & Volunteer',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    screen: 'Signups',
  },
  {
    id: '5',
    title: 'Confession',
    subtitle: 'Book an Appointment',
    imageUrl: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?w=800&q=80',
    screen: 'Confession',
  },
  {
    id: '6',
    title: 'Donate',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
    screen: 'Giving',
    givingUrl: 'https://yourwebsite.com/donate',
  },
];

// ============================================================
// COMMUNITY CARDS — Cards shown in the Community tab
// url: opens in in-app WebView
// screen: navigates to a screen
// ============================================================
export const COMMUNITY_CARDS = [
  {
    id: '1',
    title: 'Home Visitation Request',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1508558936510-0af1e3b66af1?w=800&q=80',
    url: 'https://yourwebsite.com/home-visit-form',
  },
  {
    id: '2',
    title: 'Prayer Requests',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
    screen: 'PrayerRequest',
  },
];

// ============================================================
// SOCIAL LINKS — Shown in the Socials screen
// ============================================================
export const SOCIAL_LINKS = [
  {
    id: '1',
    name: 'Instagram',
    icon: 'logo-instagram',
    bg: '#E1306C',
    url: 'https://www.instagram.com/YOUR_HANDLE/',
  },
  {
    id: '2',
    name: 'YouTube',
    icon: 'logo-youtube',
    bg: '#FF0000',
    url: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID',
  },
  {
    id: '3',
    name: 'Facebook',
    icon: 'logo-facebook',
    bg: '#1877F2',
    url: 'https://www.facebook.com/YOUR_PAGE/',
  },
];
