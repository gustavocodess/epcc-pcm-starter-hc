const splitCompareKeys = (keyStr: string) =>
  keyStr
    .split(";")
    .filter(Boolean)
    .map((subStr) => subStr.split(","));

const STORECONFIG = process.env.REACT_APP_EP_STORE;

export const isInternal = () => {
  return STORECONFIG === "internal";
};

export const config = {
  clientId: 'Iip7rqkddgLXWqdoC7bH6NQ1aVFTlVqGHXWaaost7D',
  clientSecret: 'sYgFoO2eq7JwVElX09yjDs4SOonfFiPmudUr8e7ZB5',
  categoryPageSize: 52,
  maxCompareProducts: 4,
  compareKeys: process.env.REACT_APP_COMPARE_KEYS
    ? splitCompareKeys(process.env.REACT_APP_COMPARE_KEYS)
    : [],
  // endpointURL: "api.moltin.com",
  endpointURL: "useast.api.elasticpath.com",
  b2b: process.env.REACT_APP_B2B_ENABLE || false,
  supportedLocales: process.env.REACT_APP_SUPPORTED_LOCALES?.split(
    ","
  ).map((el) => JSON.parse(el)) || [
    {
      key: "en",
      name: "english",
    },
  ],
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE || "en",
  defaultCurrency: process.env.REACT_APP_DEFAULT_CURRENCY || "USD",
  searchProvider: process.env.REACT_APP_SEARCH_PROVIDER || "algolia",
  shippingFee: 20,
  freeShipping: 200,
  epContextTag: "EPCC",
  "X-MOLTIN-SDK-LANGUAGE": "JS",
  "X-MOLTIN-SDK-VERSION": "0.0.0-semantic-release",
  autoplaySpeed: 5000, // heroBanner auto play speed
};

export const WOMEN_NODE_ID = "4d861717-bde9-4591-a593-66b3c2e16753";
export const NAVIGATOR_CONTEXT_TAG = "Retail-Catalog";
export const STRIPE_ID =
  "pk_test_51JtPbuL0iM0ohrP4etlL3KzexefI71FdKGbfagO6DCOqQBy26BhMuKKjrQro5AtCu7v98ly2EWpErqEwco7LZqZ9006TWA8l71";
export const ORDERS_PER_PAGE: number = 10;

export const CAROUSEL = isInternal()
  ? "2291f428-1e91-4298-8ac8-4510cbec36f2"
  : "50df89e4-1e3b-45a1-853a-844dee95fb27";

export const ONSALES = isInternal()
  ? "a44dfd12-bb24-43d3-8207-c408b78429a2"
  : "b30427ec-1bc5-4ae6-a4c2-039b6eaddbcd";

export const BEST_SELLING = isInternal()
  ? "61fb98c6-afbe-4ddd-be9a-59e7c0cb58e9"
  : "542059c8-d38c-4971-ba56-70a0fb760147";

export const FEATURED_ITEMS = isInternal()
  ? "75df9ece-5dcb-42bb-a255-307207b6482f"
  : "c2c0e317-b6c2-4e85-8a63-469f8f3e3e27";

export const PROMOTION = isInternal()
  ? "742cb5d5-0f29-48b7-b4fb-3d8a30d5ea67"
  : "b36e52f2-4ac9-4d90-bc92-0b23b78c3820";

export const SHOP_BY_CATEGORY = isInternal()
  ? "9b360082-45de-4bf5-a9b1-c3497e8f3645"
  : "6cd9544b-8fe8-4c89-9077-67c1e28f7539";

export const BRAND = isInternal()
  ? "8d379297-6d9a-4334-9954-4711a97964b7"
  : "74828eaf-fdbf-4dfc-ad76-3ea8abc00139";

export const CATALOGID = isInternal()
  ? "257a3325-3369-4224-9438-a67ba579c8a6"
  : "bea30cc7-0b4c-4b76-8df2-4b0de5b0bbf8";

export const PRICEBOOKID = isInternal()
  ? "c2d3999f-6246-40f6-ba71-2b8fa19905b0"
  : "92ffa10d-4109-4ae4-b1ae-a1406d3dc5ee";

export const COUNTRIES_LIST = [
  { key: "AD", value: "Andorra" },
  { key: "AE", value: "United Arab Emirates" },
  { key: "AF", value: "Afghanistan" },
  { key: "AG", value: "Antigua and Barbuda" },
  { key: "AI", value: "Anguilla" },
  { key: "AL", value: "Albania" },
  { key: "AM", value: "Armenia" },
  { key: "AO", value: "Angola" },
  { key: "AQ", value: "Antarctica" },
  { key: "AR", value: "Argentina" },
  { key: "AS", value: "American Samoa" },
  { key: "AT", value: "Austria" },
  { key: "AU", value: "Australia" },
  { key: "AW", value: "Aruba" },
  { key: "AX", value: "Åland Islands" },
  { key: "AZ", value: "Azerbaijan" },
  { key: "BA", value: "Bosnia and Herzegovina" },
  { key: "BB", value: "Barbados" },
  { key: "BD", value: "Bangladesh" },
  { key: "BE", value: "Belgium" },
  { key: "BF", value: "Burkina Faso" },
  { key: "BG", value: "Bulgaria" },
  { key: "BH", value: "Bahrain" },
  { key: "BI", value: "Burundi" },
  { key: "BJ", value: "Benin" },
  { key: "BL", value: "Saint Barthélemy" },
  { key: "BM", value: "Bermuda" },
  { key: "BN", value: "Brunei Darussalam" },
  { key: "BO", value: "Bolivia, Plurinational State of" },
  { key: "BQ", value: "Bonaire, Sint Eustatius and Saba" },
  { key: "BR", value: "Brazil" },
  { key: "BS", value: "Bahamas" },
  { key: "BT", value: "Bhutan" },
  { key: "BV", value: "Bouvet Island" },
  { key: "BW", value: "Botswana" },
  { key: "BY", value: "Belarus" },
  { key: "BZ", value: "Belize" },
  { key: "CA", value: "Canada" },
  { key: "CC", value: "Cocos (Keeling) Islands" },
  { key: "CD", value: "Congo, Democratic Republic of the" },
  { key: "CF", value: "Central African Republic" },
  { key: "CG", value: "Congo" },
  { key: "CH", value: "Switzerland" },
  { key: "CI", value: "Côte d'Ivoire" },
  { key: "CK", value: "Cook Islands" },
  { key: "CL", value: "Chile" },
  { key: "CM", value: "Cameroon" },
  { key: "CN", value: "China" },
  { key: "CO", value: "Colombia" },
  { key: "CR", value: "Costa Rica" },
  { key: "CU", value: "Cuba" },
  { key: "CV", value: "Cabo Verde" },
  { key: "CW", value: "Curaçao" },
  { key: "CX", value: "Christmas Island" },
  { key: "CY", value: "Cyprus" },
  { key: "CZ", value: "Czechia" },
  { key: "DE", value: "Germany" },
  { key: "DJ", value: "Djibouti" },
  { key: "DK", value: "Denmark" },
  { key: "DM", value: "Dominica" },
  { key: "DO", value: "Dominican Republic" },
  { key: "DZ", value: "Algeria" },
  { key: "EC", value: "Ecuador" },
  { key: "EE", value: "Estonia" },
  { key: "EG", value: "Egypt" },
  { key: "EH", value: "Western Sahara" },
  { key: "ER", value: "Eritrea" },
  { key: "ES", value: "Spain" },
  { key: "ET", value: "Ethiopia" },
  { key: "FI", value: "Finland" },
  { key: "FJ", value: "Fiji" },
  { key: "FK", value: "Falkland Islands (Malvinas)" },
  { key: "FM", value: "Micronesia, Federated States of" },
  { key: "FO", value: "Faroe Islands" },
  { key: "FR", value: "France" },
  { key: "GA", value: "Gabon" },
  { key: "GB", value: "United Kingdom of Great Britain and Northern Ireland" },
  { key: "GD", value: "Grenada" },
  { key: "GE", value: "Georgia" },
  { key: "GF", value: "French Guiana" },
  { key: "GG", value: "Guernsey" },
  { key: "GH", value: "Ghana" },
  { key: "GI", value: "Gibraltar" },
  { key: "GL", value: "Greenland" },
  { key: "GM", value: "Gambia" },
  { key: "GN", value: "Guinea" },
  { key: "GP", value: "Guadeloupe" },
  { key: "GQ", value: "Equatorial Guinea" },
  { key: "GR", value: "Greece" },
  { key: "GS", value: "South Georgia and the South Sandwich Islands" },
  { key: "GT", value: "Guatemala" },
  { key: "GU", value: "Guam" },
  { key: "GW", value: "Guinea-Bissau" },
  { key: "GY", value: "Guyana" },
  { key: "HK", value: "Hong Kong" },
  { key: "HM", value: "Heard Island and McDonald Islands" },
  { key: "HN", value: "Honduras" },
  { key: "HR", value: "Croatia" },
  { key: "HT", value: "Haiti" },
  { key: "HU", value: "Hungary" },
  { key: "ID", value: "Indonesia" },
  { key: "IE", value: "Ireland" },
  { key: "IL", value: "Israel" },
  { key: "IM", value: "Isle of Man" },
  { key: "IN", value: "India" },
  { key: "IO", value: "British Indian Ocean Territory" },
  { key: "IQ", value: "Iraq" },
  { key: "IR", value: "Iran, Islamic Republic of" },
  { key: "IS", value: "Iceland" },
  { key: "IT", value: "Italy" },
  { key: "JE", value: "Jersey" },
  { key: "JM", value: "Jamaica" },
  { key: "JO", value: "Jordan" },
  { key: "JP", value: "Japan" },
  { key: "KE", value: "Kenya" },
  { key: "KG", value: "Kyrgyzstan" },
  { key: "KH", value: "Cambodia" },
  { key: "KI", value: "Kiribati" },
  { key: "KM", value: "Comoros" },
  { key: "KN", value: "Saint Kitts and Nevis" },
  { key: "KP", value: "Korea, Democratic People's Republic of" },
  { key: "KR", value: "Korea, Republic of" },
  { key: "KW", value: "Kuwait" },
  { key: "KY", value: "Cayman Islands" },
  { key: "KZ", value: "Kazakhstan" },
  { key: "LA", value: "Lao People's Democratic Republic" },
  { key: "LB", value: "Lebanon" },
  { key: "LC", value: "Saint Lucia" },
  { key: "LI", value: "Liechtenstein" },
  { key: "LK", value: "Sri Lanka" },
  { key: "LR", value: "Liberia" },
  { key: "LS", value: "Lesotho" },
  { key: "LT", value: "Lithuania" },
  { key: "LU", value: "Luxembourg" },
  { key: "LV", value: "Latvia" },
  { key: "LY", value: "Libya" },
  { key: "MA", value: "Morocco" },
  { key: "MC", value: "Monaco" },
  { key: "MD", value: "Moldova, Republic of" },
  { key: "ME", value: "Montenegro" },
  { key: "MF", value: "Saint Martin, (French part)" },
  { key: "MG", value: "Madagascar" },
  { key: "MH", value: "Marshall Islands" },
  { key: "MK", value: "North Macedonia" },
  { key: "ML", value: "Mali" },
  { key: "MM", value: "Myanmar" },
  { key: "MN", value: "Mongolia" },
  { key: "MO", value: "Macao" },
  { key: "MP", value: "Northern Mariana Islands" },
  { key: "MQ", value: "Martinique" },
  { key: "MR", value: "Mauritania" },
  { key: "MS", value: "Montserrat" },
  { key: "MT", value: "Malta" },
  { key: "MU", value: "Mauritius" },
  { key: "MV", value: "Maldives" },
  { key: "MW", value: "Malawi" },
  { key: "MX", value: "Mexico" },
  { key: "MY", value: "Malaysia" },
  { key: "MZ", value: "Mozambique" },
  { key: "NA", value: "Namibia" },
  { key: "NC", value: "New Caledonia" },
  { key: "NE", value: "Niger" },
  { key: "NF", value: "Norfolk Island" },
  { key: "NG", value: "Nigeria" },
  { key: "NI", value: "Nicaragua" },
  { key: "NL", value: "Netherlands" },
  { key: "NO", value: "Norway" },
  { key: "NP", value: "Nepal" },
  { key: "NR", value: "Nauru" },
  { key: "NU", value: "Niue" },
  { key: "NZ", value: "New Zealand" },
  { key: "OM", value: "Oman" },
  { key: "PA", value: "Panama" },
  { key: "PE", value: "Peru" },
  { key: "PF", value: "French Polynesia" },
  { key: "PG", value: "Papua New Guinea" },
  { key: "PH", value: "Philippines" },
  { key: "PK", value: "Pakistan" },
  { key: "PL", value: "Poland" },
  { key: "PM", value: "Saint Pierre and Miquelon" },
  { key: "PN", value: "Pitcairn" },
  { key: "PR", value: "Puerto Rico" },
  { key: "PS", value: "Palestine, State of" },
  { key: "PT", value: "Portugal" },
  { key: "PW", value: "Palau" },
  { key: "PY", value: "Paraguay" },
  { key: "QA", value: "Qatar" },
  { key: "RE", value: "Réunion" },
  { key: "RO", value: "Romania" },
  { key: "RS", value: "Serbia" },
  { key: "RU", value: "Russian Federation" },
  { key: "RW", value: "Rwanda" },
  { key: "SA", value: "Saudi Arabia" },
  { key: "SB", value: "Solomon Islands" },
  { key: "SC", value: "Seychelles" },
  { key: "SD", value: "Sudan" },
  { key: "SE", value: "Sweden" },
  { key: "SG", value: "Singapore" },
  { key: "SH", value: "Saint Helena, Ascension and Tristan da Cunha" },
  { key: "SI", value: "Slovenia" },
  { key: "SJ", value: "Svalbard and Jan Mayen" },
  { key: "SK", value: "Slovakia" },
  { key: "SL", value: "Sierra Leone" },
  { key: "SM", value: "San Marino" },
  { key: "SN", value: "Senegal" },
  { key: "SO", value: "Somalia" },
  { key: "SR", value: "Surivalue" },
  { key: "SS", value: "South Sudan" },
  { key: "ST", value: "Sao Tome and Principe" },
  { key: "SV", value: "El Salvador" },
  { key: "SX", value: "Sint Maarten, (Dutch part)" },
  { key: "SY", value: "Syrian Arab Republic" },
  { key: "SZ", value: "Eswatini" },
  { key: "TC", value: "Turks and Caicos Islands" },
  { key: "TD", value: "Chad" },
  { key: "TF", value: "French Southern Territories" },
  { key: "TG", value: "Togo" },
  { key: "TH", value: "Thailand" },
  { key: "TJ", value: "Tajikistan" },
  { key: "TK", value: "Tokelau" },
  { key: "TL", value: "Timor-Leste" },
  { key: "TM", value: "Turkmenistan" },
  { key: "TN", value: "Tunisia" },
  { key: "TO", value: "Tonga" },
  { key: "TR", value: "Turkey" },
  { key: "TT", value: "Trinidad and Tobago" },
  { key: "TV", value: "Tuvalu" },
  { key: "TW", value: "Taiwan, Province of China" },
  { key: "TZ", value: "Tanzania, United Republic of" },
  { key: "UA", value: "Ukraine" },
  { key: "UG", value: "Uganda" },
  { key: "UM", value: "United States Minor Outlying Islands" },
  { key: "US", value: "United States of America" },
  { key: "UY", value: "Uruguay" },
  { key: "UZ", value: "Uzbekistan" },
  { key: "VA", value: "Holy See" },
  { key: "VC", value: "Saint Vincent and the Grenadines" },
  { key: "VE", value: "Venezuela, Bolivarian Republic of" },
  { key: "VG", value: "Virgin Islands, British" },
  { key: "VI", value: "Virgin Islands, U.S." },
  { key: "VN", value: "Viet Nam" },
  { key: "VU", value: "Vanuatu" },
  { key: "WF", value: "Wallis and Futuna" },
  { key: "WS", value: "Samoa" },
  { key: "YE", value: "Yemen" },
  { key: "YT", value: "Mayotte" },
  { key: "ZA", value: "South Africa" },
  { key: "ZM", value: "Zambia" },
  { key: "ZW", value: "Zimbabwe" },
];

export const USA_STATE_LIST = [
  {
    name: "Alabama",
    code: "AL",
  },
  {
    name: "Alaska",
    code: "AK",
  },
  {
    name: "Arizona",
    code: "AZ",
  },
  {
    name: "Arkansas",
    code: "AR",
  },
  {
    name: "California",
    code: "CA",
  },
  {
    name: "Colorado",
    code: "CO",
  },
  {
    name: "Connecticut",
    code: "CT",
  },
  {
    name: "Delaware",
    code: "DE",
  },
  {
    name: "Florida",
    code: "FL",
  },
  {
    name: "Georgia",
    code: "GA",
  },
  {
    name: "Hawaii",
    code: "HI",
  },
  {
    name: "Idaho",
    code: "ID",
  },
  {
    name: "Illinois",
    code: "IL",
  },
  {
    name: "Indiana",
    code: "IN",
  },
  {
    name: "Iowa",
    code: "IA",
  },
  {
    name: "Kansas",
    code: "KS",
  },
  {
    name: "Kentucky",
    code: "KY",
  },
  {
    name: "Louisiana",
    code: "LA",
  },
  {
    name: "Maine",
    code: "ME",
  },
  {
    name: "Maryland",
    code: "MD",
  },
  {
    name: "Massachusetts",
    code: "MA",
  },
  {
    name: "Michigan",
    code: "MI",
  },
  {
    name: "Minnesota",
    code: "MN",
  },
  {
    name: "Mississippi",
    code: "MS",
  },
  {
    name: "Missouri",
    code: "MO",
  },
  {
    name: "Montana",
    code: "MT",
  },
  {
    name: "Nebraska",
    code: "NE",
  },
  {
    name: "Nevada",
    code: "NV",
  },
  {
    name: "New Hampshire",
    code: "NH",
  },
  {
    name: "New Jersey",
    code: "NJ",
  },
  {
    name: "New Mexico",
    code: "NM",
  },
  {
    name: "New York",
    code: "NY",
  },
  {
    name: "North Carolina",
    code: "NC",
  },
  {
    name: "North Dakota",
    code: "ND",
  },
  {
    name: "Ohio",
    code: "OH",
  },
  {
    name: "Oklahoma",
    code: "OK",
  },
  {
    name: "Oregon",
    code: "OR",
  },
  {
    name: "Pennsylvania",
    code: "PA",
  },
  {
    name: "Rhode Island",
    code: "RI",
  },
  {
    name: "South Carolina",
    code: "SC",
  },
  {
    name: "South Dakota",
    code: "SD",
  },
  {
    name: "Tennessee",
    code: "TN",
  },
  {
    name: "Texas",
    code: "TX",
  },
  {
    name: "Utah",
    code: "UT",
  },
  {
    name: "Vermont",
    code: "VT",
  },
  {
    name: "Virginia",
    code: "VA",
  },
  {
    name: "Washington",
    code: "WA",
  },
  {
    name: "West Virginia",
    code: "WV",
  },
  {
    name: "Wisconsin",
    code: "WI",
  },
  {
    name: "Wyoming",
    code: "WY",
  },
];
