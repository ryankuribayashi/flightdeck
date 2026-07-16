export type Story = {
  id: string;
  username: string;
  callsign: string;
  airport: string;
  seen: boolean;
  live: boolean;
  avatar: string;
};

export type Post = {
  id: string;
  username: string;
  callsign: string;
  avatar: string;
  airport: string;
  timeAgo: string;
  image: string;
  aircraft: string;
  icaoType: string;
  airline: string;
  flightNum: string;
  origin: string;
  destination: string;
  altitude: string;
  speed: string;
  likes: number;
  comments: number;
  isLive: boolean;
  isInstant: boolean;
  caption: string;
};

export type Squadron = {
  id: string;
  name: string;
  tailCode: string;
  color: string;
  members: number;
  lastMessage: string;
  lastUser: string;
  timeAgo: string;
  unread: number;
  image: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  tag: string;
  image: string;
  summary: string;
};

export type HubWeather = {
  icao: string;
  city: string;
  condition: string;
  temp: string;
  icon: string;
};

export type AircraftLog = {
  id: string;
  type: string;
  icao: string;
  count: number;
  image: string;
  firstSpotted: string;
};

export type TailWatch = {
  id: string;
  reg: string;
  type: string;
  airline: string;
  status: string;
  location: string;
  lastSeen: string;
  alert: boolean;
};

export const STORIES: Story[] = [
  { id: '1', username: 'tanaka_spots', callsign: 'JA-7701', airport: 'RJTT', seen: false, live: true, avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: '2', username: 'lax_spotter', callsign: 'N-4428', airport: 'KLAX', seen: false, live: false, avatar: 'https://i.pravatar.cc/100?img=7' },
  { id: '3', username: 'heathrow_james', callsign: 'G-SPTR', airport: 'EGLL', seen: true, live: false, avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: '4', username: 'dubai_aviation', callsign: 'A6-EEK', airport: 'OMDB', seen: false, live: true, avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: '5', username: 'fco_watcher', callsign: 'I-BIKA', airport: 'LIRF', seen: true, live: false, avatar: 'https://i.pravatar.cc/100?img=20' },
  { id: '6', username: 'cdg_aviation', callsign: 'F-SPOT', airport: 'LFPG', seen: false, live: false, avatar: 'https://i.pravatar.cc/100?img=25' },
  { id: '7', username: 'syd_planespotter', callsign: 'VH-OQA', airport: 'YSSY', seen: true, live: false, avatar: 'https://i.pravatar.cc/100?img=30' },
];

export const POSTS: Post[] = [
  {
    id: '1',
    username: 'tanaka_spots',
    callsign: 'JA-7701',
    avatar: 'https://i.pravatar.cc/100?img=3',
    airport: 'RJTT',
    timeAgo: '2m ago',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    aircraft: 'Boeing 777-300ER',
    icaoType: 'B77W',
    airline: 'JAL',
    flightNum: 'JL716',
    origin: 'RJTT',
    destination: 'KLAX',
    altitude: 'FL350',
    speed: '487kt',
    likes: 1284,
    comments: 47,
    isLive: true,
    isInstant: false,
    caption: 'Perfect morning light at Narita. JL716 heavy pushing back for LAX. The 777 always looks magnificent on the long-haul runs. #JAL #B777 #NaritaSpotting',
  },
  {
    id: '2',
    username: 'dubai_aviation',
    callsign: 'A6-EEK',
    avatar: 'https://i.pravatar.cc/100?img=15',
    airport: 'OMDB',
    timeAgo: '18m ago',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    aircraft: 'Airbus A380-800',
    icaoType: 'A388',
    airline: 'Emirates',
    flightNum: 'EK001',
    origin: 'OMDB',
    destination: 'EGLL',
    altitude: 'FL390',
    speed: '492kt',
    likes: 3847,
    comments: 121,
    isLive: false,
    isInstant: true,
    caption: 'EK001 climbing out of DXB into the golden hour. The A380 on long-haul never disappoints. Caught this one clean off the threshold. #Emirates #A380 #Dubai',
  },
  {
    id: '3',
    username: 'lax_spotter',
    callsign: 'N-4428',
    avatar: 'https://i.pravatar.cc/100?img=7',
    airport: 'KLAX',
    timeAgo: '42m ago',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    aircraft: 'Boeing 787-9',
    icaoType: 'B789',
    airline: 'ANA',
    flightNum: 'NH106',
    origin: 'RJAA',
    destination: 'KLAX',
    altitude: 'FL410',
    speed: '476kt',
    likes: 892,
    comments: 33,
    isLive: false,
    isInstant: false,
    caption: 'ANA 787 touching down on 24L after a long Pacific crossing. Star Alliance livery hits different in the late afternoon light. #ANA #Dreamliner #LAX',
  },
  {
    id: '4',
    username: 'heathrow_james',
    callsign: 'G-SPTR',
    avatar: 'https://i.pravatar.cc/100?img=12',
    airport: 'EGLL',
    timeAgo: '1h ago',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
    aircraft: 'Concorde',
    icaoType: 'CONC',
    airline: 'British Airways',
    flightNum: 'BA002',
    origin: 'KJFK',
    destination: 'EGLL',
    altitude: 'FL600',
    speed: 'M2.02',
    likes: 12400,
    comments: 407,
    isLive: false,
    isInstant: false,
    caption: 'Throwback: BA002 on final at LHR circa 1997. Found this in the archives. Nothing will ever touch Concorde. Some things should never have been retired. #Concorde #BritishAirways #Supersonic',
  },
];

export const SQUADRONS: Squadron[] = [
  {
    id: '1',
    name: 'NARITA SPOTTERS',
    tailCode: 'NRT-1',
    color: '#F0A020',
    members: 14,
    lastMessage: 'Perfect conditions today, get down here!',
    lastUser: 'tanaka_spots',
    timeAgo: '2m',
    unread: 3,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
  },
  {
    id: '2',
    name: 'WIDEBODY HUNTERS',
    tailCode: 'WB-7',
    color: '#00D4FF',
    members: 9,
    lastMessage: 'A380 taxiing to gate 41. Get ready!',
    lastUser: 'dubai_aviation',
    timeAgo: '14m',
    unread: 1,
    image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=400&q=80',
  },
  {
    id: '3',
    name: 'PACIFIC TRACKERS',
    tailCode: 'PAC-3',
    color: '#00FF88',
    members: 22,
    lastMessage: 'NH106 just landed, beautiful 789',
    lastUser: 'lax_spotter',
    timeAgo: '1h',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80',
  },
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    headline: 'Emirates orders 50 additional A350-900s in historic deal',
    source: 'Simple Flying',
    timeAgo: '1h ago',
    tag: 'ORDERS',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80',
    summary: 'The Dubai-based carrier has committed to 50 new Airbus A350s as part of a major fleet modernization push valued at over $17 billion.',
  },
  {
    id: '2',
    headline: 'JAL launches new ultra-long-haul route: Tokyo to New York non-stop',
    source: 'The Points Guy',
    timeAgo: '3h ago',
    tag: 'ROUTES',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    summary: 'Japan Airlines will operate the 13-hour 40-minute flight using its Boeing 777X fleet starting September 2026.',
  },
  {
    id: '3',
    headline: 'Boom Supersonic completes first supersonic test flight of XB-1',
    source: 'Aviation Week',
    timeAgo: '5h ago',
    tag: 'TECH',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80',
    summary: 'The Denver-based company reached Mach 1.1 during its latest test flight, marking a major milestone toward the Overture commercial aircraft.',
  },
  {
    id: '4',
    headline: 'Singapore Airlines A380 returns from retirement for peak season',
    source: 'ch-aviation',
    timeAgo: '8h ago',
    tag: 'FLEET',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80',
    summary: 'SIA confirms two mothballed A380s will re-enter service ahead of the summer travel surge, flying SIN-LHR and SIN-LAX routes.',
  },
];

export const HUB_WEATHER: HubWeather[] = [
  { icao: 'RJTT', city: 'Tokyo', condition: 'Partly Cloudy', temp: '28°C', icon: '⛅' },
  { icao: 'KLAX', city: 'Los Angeles', condition: 'Clear', temp: '22°C', icon: '☀' },
  { icao: 'EGLL', city: 'London', condition: 'Rain', temp: '16°C', icon: '🌧' },
  { icao: 'OMDB', city: 'Dubai', condition: 'Hot & Clear', temp: '42°C', icon: '🌤' },
  { icao: 'KJFK', city: 'New York', condition: 'Overcast', temp: '25°C', icon: '☁' },
  { icao: 'YSSY', city: 'Sydney', condition: 'Clear', temp: '18°C', icon: '☀' },
];

export const AIRCRAFT_LOG: AircraftLog[] = [
  { id: '1', type: 'Boeing 777-300ER', icao: 'B77W', count: 47, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80', firstSpotted: '2022-04-12' },
  { id: '2', type: 'Airbus A380-800', icao: 'A388', count: 31, image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=200&q=80', firstSpotted: '2021-08-07' },
  { id: '3', type: 'Boeing 787-9', icao: 'B789', count: 58, image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=200&q=80', firstSpotted: '2020-11-15' },
  { id: '4', type: 'Airbus A350-900', icao: 'A359', count: 29, image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=200&q=80', firstSpotted: '2023-01-03' },
  { id: '5', type: 'Boeing 747-8', icao: 'B748', count: 12, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', firstSpotted: '2022-06-20' },
  { id: '6', type: 'Airbus A220-300', icao: 'BCS3', count: 22, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80', firstSpotted: '2023-03-18' },
];

export const TAIL_WATCHLIST: TailWatch[] = [
  { id: '1', reg: 'JA8119', type: 'B747-100SR', airline: 'JAL (Historic)', status: 'MUSEUM', location: 'Osaka, Japan', lastSeen: '2026-06-28', alert: false },
  { id: '2', reg: 'A6-EUH', type: 'A380-800', airline: 'Emirates', status: 'AIRBORNE', location: 'FL390 over Arabian Sea', lastSeen: '2026-07-03', alert: true },
  { id: '3', reg: 'N905NA', type: 'B747 Shuttle Carrier', airline: 'NASA', status: 'STATIC', location: 'Space Center Houston', lastSeen: '2026-05-12', alert: false },
  { id: '4', reg: 'G-BOAB', type: 'Concorde', airline: 'British Airways', status: 'PRESERVED', location: 'Heathrow T5 Forecourt', lastSeen: '2026-07-01', alert: false },
  { id: '5', reg: 'JA8963', type: 'B787-9', airline: 'ANA', status: 'AIRBORNE', location: 'FL410 over Pacific', lastSeen: '2026-07-03', alert: true },
];

export const HISTORY_TODAY = {
  date: 'July 3',
  events: [
    { year: 1988, event: 'Iran Air Flight 655 shot down by USS Vincennes over Persian Gulf, killing 290 passengers.' },
    { year: 2012, event: 'Airbus delivers the 7,000th A320-family aircraft to Delta Air Lines.' },
    { year: 1971, event: 'First flight of the Douglas DC-10 wide-body jet airliner.' },
  ],
};

export const CHALLENGES = [
  { id: '1', title: 'Widebody Wednesday', desc: 'Photograph 3 different widebody aircraft', progress: 2, total: 3, badge: '🏆', expires: '2d 4h', xp: 250 },
  { id: '2', title: 'Sunrise Spotter', desc: 'Post a sunrise shot at any airport', progress: 0, total: 1, badge: '🌅', expires: '4d 12h', xp: 150 },
  { id: '3', title: 'Jet Setter', desc: 'Check in at 3 different airports this week', progress: 1, total: 3, badge: '🗺️', expires: '5d 8h', xp: 300 },
];
