/**
 * The College of Fellows: AAK's senior membership category. Admission, roles
 * and affix from the AAK Constitution and By-Laws (2022 amendments: By-Laws
 * 3.2, 8.1 and 22.1) and the former aak.or.ke/college-of-fellows page; the
 * videos are AAK's "Meet the Fellows Campaign" playlist on YouTube. The names
 * are AAK's register of Fellow members (fellowsRegister below).
 */

export const fellowsIntro =
  "The College of Fellows is the apex level of membership of the Association. It consists of Corporate Members nominated by the Governing Council to the Class of Fellows and subsequently invited by the College of Fellows.";

export const fellowsRoles = [
  {
    title: "Advising the Council",
    body: "Complementing the Governing Council in guiding the activities of the Association, with advisory opinions on matters of interest in the built and natural environments.",
  },
  {
    title: "Advocacy",
    body: "Carrying out advocacy in line with the objects of the Association.",
  },
  {
    title: "Mentorship",
    body: "Providing mentorship to students and young professionals.",
  },
  {
    title: "Mediation",
    body: "Providing mediation within the Association.",
  },
  {
    title: "Exhibitions and innovation",
    body: "Staging exhibitions and making technical innovations, locally and internationally.",
  },
];

/** How Corporate Members become Fellows (By-Laws 3.2.1 and 8.1); fees per the
 * Secretariat, 19 Oct 2026. */
export const fellowsAdmission =
  "Fellowship isn't applied for. Corporate Members are nominated by the Governing Council, or invited by the College of Fellows, into the Class of Fellows. Fellows pay no fees, and are entitled to the affix F.A.A.K.";

/** "Meet the Fellows Campaign" playlist on AAK's YouTube channel. */
export const MEET_THE_FELLOWS_PLAYLIST = "PL2WvnH1y-v8PTqAOUX6T0ZNmBH0YnqA2Y";

export const meetTheFellowsIntro =
  "The Association's Meet the Fellows campaign features members of the College and the counsel they have gathered in practice and in the industry over the years.";

/** One conversation per Fellow, in the playlist's order. */
export const meetTheFellowsVideos: { id: string; name: string }[] = [
  { id: "CviHb-6qFCs", name: "QS Onesmus Gichuiri" },
  { id: "usB9LWRn_FY", name: "QS Daniel Kimoro" },
  { id: "vW4Cx3PhjpA", name: "Arch. Waweru Gathecha" },
  { id: "y833C3vI2sY", name: "Plan. Peter Kibinda" },
  { id: "XrbDI0kWQSQ", name: "Eng. Hirani Ratna" },
  { id: "k4paPOiWt4M", name: "QS Alfred Aluvaala" },
  { id: "aphYVew1fzc", name: "QS Kimani Mathu" },
  { id: "7Wt1V0nX-uI", name: "Prof. Jerry Magutu" },
  { id: "z6HL-XDe5Tg", name: "QS Festus Litiku" },
  { id: "FFWW7SqD2ao", name: "Dr. Susan Kibue" },
  { id: "qi2f0N3sWpM", name: "Eng. Austin Kitololo" },
  { id: "Pubq53eM1eM", name: "Arch. Reuben Mutiso" },
  { id: "WCT9HXWq2_o", name: "Arch. Steven Oundo" },
  { id: "zIB9sE9KNWU", name: "Arch. James Gitoho" },
  { id: "rPlOjCtXLwI", name: "Arch. James Waweru" },
  { id: "D9v375E0uw0", name: "Arch. Kamau Njendu" },
  { id: "tlYv47dhcVY", name: "Arch. Dr. James Kimathi" },
  { id: "BPXRIKcsXR0", name: "Arch. Hitesh Mehta" },
  { id: "sJ1oGgy73dw", name: "Arch. Philip Kungu" },
];

export interface Fellow {
  /** As written in AAK's register (mostly surname first). */
  name: string;
  chapters: string[];
  /** Their Meet the Fellows film, when there is one (YouTube id). */
  video?: string;
}

/**
 * AAK's register of Fellow members (AAK Fellow Members.xlsx, from the
 * Secretariat, 19 Oct 2026): 58 rows, one per membership record, merged into
 * one entry per person with all their chapters. Films are matched by name to
 * the Meet the Fellows playlist; four films (Peter Kibinda, Festus Litiku,
 * James Waweru, Kamau Njendu) don't match a name in the register.
 */
export const fellowsRegister: Fellow[] = [
  { name: "Alfred Omenya (Prof.)", chapters: ["Architects"] },
  { name: "Aluvaala Alfred", chapters: ["Quantity Surveyors"], video: "k4paPOiWt4M" },
  { name: "Chanzu Yusuf", chapters: ["Quantity Surveyors"] },
  { name: "Emma Miloyo", chapters: ["Architects"] },
  { name: "Eshani Mehraz", chapters: ["Architects"] },
  { name: "F. Kairu Bachia", chapters: ["Quantity Surveyors"] },
  { name: "Gathecha Waweru", chapters: ["Architects"], video: "vW4Cx3PhjpA" },
  { name: "Gichuiri Onesimus", chapters: ["Quantity Surveyors"], video: "CviHb-6qFCs" },
  { name: "Gichunge Hezekiah", chapters: ["Quantity Surveyors"] },
  { name: "Gitoho James", chapters: ["Architects", "Landscape Architects"], video: "zIB9sE9KNWU" },
  { name: "Goro Evans", chapters: ["Engineers"] },
  { name: "Hajee Bashir", chapters: ["Quantity Surveyors"] },
  { name: "Hirani Ratna", chapters: ["Engineers"], video: "XrbDI0kWQSQ" },
  { name: "Kagondu Grace", chapters: ["Engineers"] },
  { name: "Karuri Lee", chapters: ["Architects"] },
  { name: "Kebathi Stanley", chapters: ["Architects", "Town Planners"] },
  { name: "Kibue Susan (Dr.)", chapters: ["Architects"], video: "FFWW7SqD2ao" },
  { name: "Kimani Mathu", chapters: ["Quantity Surveyors"], video: "aphYVew1fzc" },
  { name: "Kimathi James", chapters: ["Architects"], video: "tlYv47dhcVY" },
  { name: "Kimeu Musau", chapters: ["Architects", "Environmental Design Consultants"] },
  { name: "Kimoro Daniel", chapters: ["Quantity Surveyors"], video: "usB9LWRn_FY" },
  { name: "Kitololo Austin", chapters: ["Engineers"], video: "qi2f0N3sWpM" },
  { name: "Kungu Philip", chapters: ["Architects"], video: "sJ1oGgy73dw" },
  { name: "Magutu Jerry", chapters: ["Architects"], video: "7Wt1V0nX-uI" },
  { name: "Mangat Harcharan", chapters: ["Engineers"] },
  { name: "Maringa Paul", chapters: ["Architects"] },
  { name: "Masinde Augustine", chapters: ["Town Planners"] },
  { name: "Masu Sylvester", chapters: ["Quantity Surveyors"] },
  { name: "Matalanga Nathaniel", chapters: ["Engineers"] },
  { name: "Mehta Hitesh", chapters: ["Architects", "Landscape Architects"], video: "BPXRIKcsXR0" },
  { name: "Muchungu Anna", chapters: ["Quantity Surveyors"] },
  { name: "Mugure Njendu", chapters: ["Architects"] },
  { name: "Mulyungi Gideon", chapters: ["Architects"] },
  { name: "Munyanya Mohammed", chapters: ["Architects"] },
  { name: "Murage Stanley", chapters: ["Quantity Surveyors"] },
  { name: "Musyoki Norbert", chapters: ["Architects"] },
  { name: "Mutiso David", chapters: ["Architects"] },
  { name: "Mutiso Reuben", chapters: ["Architects", "Landscape Architects"], video: "Pubq53eM1eM" },
  { name: "Mwangi Benson", chapters: ["Architects"] },
  { name: "Ndong Jeremiah", chapters: ["Architects"] },
  { name: "Ngummo Robert", chapters: ["Landscape Architects"] },
  { name: "Njau Gilbert", chapters: ["Town Planners"] },
  { name: "Njendu James", chapters: ["Architects"] },
  { name: "Njuguna David", chapters: ["Quantity Surveyors"] },
  { name: "Ogoda James", chapters: ["Quantity Surveyors"] },
  { name: "Ohas J.M.", chapters: ["Town Planners"] },
  { name: "Oino Evans Juma", chapters: ["Architects"] },
  { name: "Oketch Tom", chapters: ["Quantity Surveyors"] },
  { name: "Otwani Justus", chapters: ["Engineers"] },
  {
    name: "Oundo Steven",
    chapters: ["Architects", "Construction Project Managers"],
    video: "WCT9HXWq2_o",
  },
  { name: "Sika Philip", chapters: ["Architects"] },
  { name: "Simu Allan", chapters: ["Architects"] },
];

/** Officers of the College, confirmed by the Secretariat (19 Oct 2026). */
export const fellowsOfficers = [
  { role: "Chair", name: "QS Alfred Aluvaala" },
  { role: "Vice-Chair", name: "Dr. Susan Kibue" },
];
