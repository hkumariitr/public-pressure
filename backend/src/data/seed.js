// ============================================================================
// Public Pressure — seed content.
// Investigative / civic-accountability short news, ~60 words each, bilingual.
// In production this comes from a CMS + editorial pipeline; here it is static
// so the whole stack runs with zero infrastructure.
// ============================================================================

const IMG = 'https://images.newsinshorts.example/placeholder'; // swap for your CDN

/** @type {import('../../../shared/types').NewsCard[]} */
export const SEED_CARDS = [
  {
    hashId: 'pp-0001', tenant: 'public-pressure', lang: 'en',
    title: "Who owns the city's water? We found out.",
    content:
      "An RTI reply obtained by Public Pressure shows three private firms now " +
      "hold 61% of the city's bulk water-supply contracts, up from 18% in 2019. " +
      "None of the tenders were published on the municipal portal. The water " +
      "board says the files are 'under review'. Councillors were not shown the " +
      "awards before signing.",
    imageUrl: IMG, sourceName: 'RTI reply · 12 Mar', sourceUrl: null,
    categories: ['investigation', 'civic'], authorName: 'PP Desk',
    createdAt: '2026-03-12T09:03:00Z', readMoreUrl: null,
    live: false, breaking: false, poll: null,
  },
  {
    hashId: 'pp-0001-hi', tenant: 'public-pressure', lang: 'hi',
    title: 'शहर का पानी किसका है? हमने पता लगाया।',
    content:
      'पब्लिक प्रेशर को मिली एक आरटीआई के जवाब से पता चलता है कि शहर के थोक ' +
      'जल-आपूर्ति अनुबंधों का 61% हिस्सा अब तीन निजी कंपनियों के पास है, जो ' +
      '2019 में 18% था। कोई भी टेंडर नगरपालिका पोर्टल पर प्रकाशित नहीं हुआ। ' +
      'जल बोर्ड का कहना है कि फाइलें समीक्षाधीन हैं।',
    imageUrl: IMG, sourceName: 'आरटीआई जवाब · 12 मार्च', sourceUrl: null,
    categories: ['investigation', 'civic'], authorName: 'पीपी डेस्क',
    createdAt: '2026-03-12T09:03:00Z', readMoreUrl: null,
    live: false, breaking: false, poll: null,
  },
  {
    hashId: 'pp-0002', tenant: 'public-pressure', lang: 'en',
    title: 'Audit report leaked · council to respond',
    content:
      "A leaked draft of the state auditor's report flags \u20B9240 crore in road " +
      "works billed but not verified on the ground across four wards. The " +
      "contractor list overlaps with two firms named in last year's drainage " +
      "scandal. The council's standing committee meets Thursday and has put the " +
      "item last on the agenda.",
    imageUrl: IMG, sourceName: 'Audit draft · leaked', sourceUrl: null,
    categories: ['investigation', 'money'], authorName: 'PP Desk',
    createdAt: '2026-03-18T14:20:00Z', readMoreUrl: null,
    live: false, breaking: true, poll: null,
  },
  {
    hashId: 'pp-0003', tenant: 'public-pressure', lang: 'en',
    title: 'Town hall debate · mayor speaks at 8',
    content:
      "The mayor will face questions on the water contracts at tonight's town " +
      "hall after 2,000 residents signed Public Pressure's petition. Opposition " +
      "councillors say they will table the unpublished tenders. We are covering " +
      "it live; follow this card for updates as they happen.",
    imageUrl: IMG, sourceName: 'Live · Town Hall', sourceUrl: null,
    categories: ['civic', 'live'], authorName: 'PP Live',
    createdAt: '2026-03-20T13:30:00Z', readMoreUrl: null,
    live: true, breaking: false, poll: null,
  },
  {
    hashId: 'pp-0003-hi', tenant: 'public-pressure', lang: 'hi',
    title: 'सदन में बहस · मेयर 8 बजे बोलेंगे',
    content:
      'पब्लिक प्रेशर की याचिका पर 2,000 निवासियों के हस्ताक्षर के बाद मेयर आज ' +
      'रात टाउन हॉल में जल अनुबंधों पर सवालों का सामना करेंगे। विपक्षी पार्षद ' +
      'अप्रकाशित टेंडर पेश करने की बात कह रहे हैं। हम इसे लाइव कवर कर रहे हैं।',
    imageUrl: IMG, sourceName: 'लाइव · टाउन हॉल', sourceUrl: null,
    categories: ['civic', 'live'], authorName: 'पीपी लाइव',
    createdAt: '2026-03-20T13:30:00Z', readMoreUrl: null,
    live: true, breaking: false, poll: null,
  },
  {
    hashId: 'pp-0004', tenant: 'public-pressure', lang: 'en',
    title: 'Should the water tenders be re-floated in public?',
    content:
      "Public Pressure asked its readers whether the 2024 bulk-water tenders — " +
      "awarded without being published — should be cancelled and re-floated " +
      "openly. Vote below; results update live and will be sent to every " +
      "councillor before Thursday's meeting.",
    imageUrl: null, sourceName: 'Reader poll', sourceUrl: null,
    categories: ['civic', 'poll'], authorName: 'PP Desk',
    createdAt: '2026-03-19T10:00:00Z', readMoreUrl: null,
    live: false, breaking: false,
    poll: {
      pollId: 'poll-water-2024', question: 'Re-float the water tenders publicly?',
      totalVotes: 1840,
      options: [
        { id: 'yes', label: 'Yes, cancel and re-tender', votes: 1512 },
        { id: 'no', label: 'No, let the contracts stand', votes: 190 },
        { id: 'unsure', label: 'Need more information', votes: 138 },
      ],
    },
  },
  {
    hashId: 'pp-0005', tenant: 'public-pressure', lang: 'en',
    title: 'Six wards, one contractor, zero site checks',
    content:
      "Cross-referencing 14 pages of work orders with the auditor's draft, we " +
      "found a single contractor billed for streetlight upgrades in six wards " +
      "on the same week in 2025. Municipal engineers signed completion in all " +
      "six without a recorded site visit. The firm did not respond to our " +
      "questions.",
    imageUrl: IMG, sourceName: 'Documents · 14 pages', sourceUrl: null,
    categories: ['investigation', 'money'], authorName: 'PP Desk',
    createdAt: '2026-03-16T08:45:00Z', readMoreUrl: null,
    live: false, breaking: false, poll: null,
  },
  {
    hashId: 'pp-0006', tenant: 'public-pressure', lang: 'en',
    title: 'Your RTI, our newsroom',
    content:
      "Public Pressure is built on documents, not anonymous quotes. Readers can " +
      "now submit their own RTI replies through the app; our desk verifies, " +
      "redacts personal data, and turns the strongest ones into cards. Three of " +
      "this month's lead stories started as reader uploads.",
    imageUrl: IMG, sourceName: 'About · Newsroom', sourceUrl: null,
    categories: ['civic'], authorName: 'PP Desk',
    createdAt: '2026-03-10T11:15:00Z', readMoreUrl: null,
    live: false, breaking: false, poll: null,
  },
];

/** Topics surfaced by search / header chips. */
export const SEED_TOPICS = [
  'Water', 'Audit', 'RTI', 'Council', 'Roads', 'Tenders', 'Town Hall', 'Money',
];
