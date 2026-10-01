/** Full chapter council rosters (2025/2027 term), sourced from aak.or.ke/about-us/. */

export interface CouncilRole {
  name: string;
  role: string;
}

export const chapterCouncils: Record<string, CouncilRole[]> = {
  architects: [
    { name: "Kairu Jacqueline", role: "Chairperson" },
    { name: "Brenda Gitonga", role: "Vice Chairperson" },
    { name: "Michael Muriuki", role: "Secretary" },
    { name: "Kimberly Mong'are", role: "Assistant Secretary" },
    { name: "Yassin Munyanya", role: "Treasurer" },
    { name: "Samuel Nyagaya", role: "Registrar" },
    { name: "Kimata Kiarie", role: "Corporate Representative" },
    { name: "Dr. Joseph Kedogo", role: "Corporate Representative and Council Member" },
    { name: "James Muhanji", role: "Corporate Representative" },
    { name: "Brian Nyagonchonga", role: "Graduate Representative" },
    { name: "Brian Boit", role: "Graduate Representative" },
    { name: "Kevin Kariuki", role: "Licentiate Representative" },
    { name: "Kipkagat Komen", role: "Licentiate Representative" },
    { name: "Sheila Gacii", role: "Student Representative" },
    { name: "Mitchelle Sigilai", role: "Student Representative" },
    { name: "Jamila Chelagat", role: "Student Representative" },
    { name: "Tsalwa Waburiri", role: "Immediate Past Chairperson" },
  ],
  "quantity-surveyors": [
    { name: "Moses Karani", role: "Chairperson" },
    { name: "Adson Meme", role: "Vice Chairperson" },
    { name: "Abishag Wambugu", role: "Secretary" },
    { name: "Meshack Omondi", role: "Assistant Secretary" },
    { name: "Everlyn Njeri Irungu", role: "Treasurer" },
    { name: "Rhema Njuguna", role: "Registrar" },
    { name: "Samuel Kamau", role: "Corporate Representative" },
    { name: "Kevin Odhiambo", role: "Licentiate Representative" },
    { name: "Meshack Were", role: "Student Representative" },
    { name: "Favour Walela", role: "Student Representative" },
    { name: "Elvin Gitari", role: "Student Representative" },
    { name: "Phineas Wakoli", role: "Graduate Representative" },
  ],
  "town-planners": [
    { name: "Christine Muchiri", role: "Chairperson" },
    { name: "Joan Watetu", role: "Vice Chairperson" },
    { name: "Abigail Rugendo", role: "Secretary" },
    { name: "Beverlyne Sambay", role: "Assistant Secretary" },
    { name: "Eunice Wahiga", role: "Treasurer" },
    { name: "Mercy Ateka", role: "Registrar" },
    { name: "Billy Paul Thuo", role: "Graduate Representative" },
    { name: "Aaron Baraka", role: "Student Representative" },
  ],
  engineers: [
    { name: "Muguru Wairimu", role: "Chairperson" },
    { name: "Martin Gathukia", role: "Vice Chairperson" },
    { name: "Cecilia Mwangi", role: "Secretary" },
    { name: "John Tonui", role: "Treasurer" },
    { name: "John Robert Ogallo", role: "Registrar" },
    { name: "George Abuto", role: "Assistant Secretary" },
    { name: "Douglas Mwoge", role: "Licentiate Representative" },
    { name: "Isabela Oyoo", role: "Graduate Representative" },
    { name: "Abigael Wanja", role: "Graduate Representative" },
    { name: "Gregory Onsembe", role: "Graduate Representative" },
    { name: "Matilda Nimatsutsu", role: "Events Committee Chair and Student Representative" },
  ],
  "landscape-architects": [
    { name: "Anthony Kimondo", role: "Chairperson" },
    { name: "Loice Ouma Atieno", role: "Vice Chairperson" },
    { name: "Jackline Karagai", role: "Secretary" },
    { name: "Sheila Tanui", role: "Assistant Secretary" },
    { name: "Augustine Shitote", role: "Treasurer" },
    { name: "Brenda Waruinu", role: "Registrar" },
    { name: "Betty Mwendwa", role: "Graduate Representative" },
  ],
  "environmental-design-consultants": [
    { name: "Njoroge Gladys", role: "Chairperson" },
    { name: "Duncan Wamugi", role: "Secretary" },
    { name: "Margaret Kiboi", role: "Assistant Secretary" },
    { name: "Rosemary Litunya", role: "Treasurer" },
    { name: "Gerald Cheruiyot", role: "Registrar" },
    { name: "Gideon Olawo", role: "Ex-Official" },
    { name: "Musau Kimeu", role: "Co-opted Member" },
  ],
  "construction-project-managers": [
    { name: "Ndindiri Waweru", role: "Chairperson" },
    { name: "Maloba Nakoli", role: "Vice Chairperson" },
    { name: "Martin Mbugua", role: "Secretary" },
    { name: "Donald Oduok", role: "Assistant Secretary" },
    { name: "Lameck Mwambi", role: "Treasurer" },
    { name: "Steve Mahindu", role: "Registrar" },
    { name: "Alphage Mwazi", role: "Immediate Past Chairperson" },
    { name: "Christine Mukami", role: "Student Representative" },
    { name: "Philip Sambu", role: "Student Representative" },
  ],
  "interior-designers": [
    { name: "Daisy Nyeresa", role: "Chairperson" },
    { name: "Bundi Marita", role: "Vice Chairperson" },
    { name: "Jacinta Serem", role: "Secretary" },
    { name: "Eric Mwagene", role: "Treasurer" },
    { name: "John Mungai", role: "Assistant Secretary" },
    { name: "Emily Muchika", role: "Registrar" },
    { name: "Lynette Sange", role: "Graduate Representative" },
    { name: "Tyrone Lawrence", role: "Student Representative" },
  ],
};

export interface ChapterBranch {
  name: string;
  members: CouncilRole[];
}

/**
 * Regional branch rosters for chapters with sub-national council structures.
 * Western Region and South Rift updated from AAK's 2026 AGM Report, which
 * records both branches' February 2026 elections (Western's leadership
 * remains styled "interim"; South Rift's does not).
 */
export const chapterBranches: Record<string, ChapterBranch[]> = {
  "landscape-architects": [
    {
      name: "Coast Branch",
      members: [
        { name: "Duncan Odhiambo", role: "Chairperson" },
        { name: "Onesmus Mwatu", role: "Vice Chairperson" },
        { name: "Wilson Nyange", role: "Secretary" },
        { name: "Stephanie J. Maina", role: "Assistant Secretary" },
        { name: "Ashley Mwangi", role: "Treasurer" },
        { name: "John Mbatia", role: "Registrar" },
        { name: "Felix Kawundi", role: "Council Member" },
      ],
    },
    {
      name: "Western Region Branch",
      members: [
        { name: "Alfred Mango", role: "Interim Chairperson" },
        { name: "Steve Gome", role: "Interim Secretary" },
        { name: "Alexander Muge", role: "Interim Treasurer" },
      ],
    },
    {
      name: "South Rift Branch",
      members: [
        { name: "Thiongo Kaggai", role: "Chair" },
        { name: "Moses Gatonye", role: "Vice Chair" },
        { name: "Janet Ruto", role: "Secretary" },
        { name: "Margaret Muthoni", role: "Treasurer" },
        { name: "Albert Ruto", role: "Registrar" },
      ],
    },
  ],
};
