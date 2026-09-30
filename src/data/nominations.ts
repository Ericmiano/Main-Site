/**
 * AAK nominations to boards and committees at local, regional and
 * international level. Generated from "Final AAK Leadership at National,
 * Regional and International Positions.xlsx" (sheet "Regional and National
 * Bodies"), September 2026. Names are as supplied; only obvious spelling in
 * body names was corrected. To update, edit here or regenerate from the sheet.
 */
export interface NominationRole {
  /** Seat or position on the body; empty when the sheet gives none. */
  position: string;
  names: string[];
  /** e.g. "Term expired", "Nominated in November 2025". */
  note?: string;
}

export interface NominationBody {
  name: string;
  roles: NominationRole[];
}

/** By chapter: national, regional and international bodies. */
export const nominationsByChapter: { chapter: string; bodies: NominationBody[] }[] = [
  {
    chapter: "Quantity Surveyors",
    bodies: [
      {
        name: "Africa Association of Quantity Surveyors (AAQS)",
        roles: [
          {
            position: "Chair of the Education, Research and Training Board",
            names: ["QS Mary Odhiambo"],
          },
          {
            position: "Member of the Digital Committee Board",
            names: ["QS Mary Odhiambo"],
          },
          {
            position: "Representative Young Quantity Surveyors Strategy committee",
            names: ["QS Moses Karani"],
          },
          {
            position:
              "Leading the Women QS Sub-committee for the chapter as part of the AAQS; Chapter rep at the convention committee",
            names: ["QS Ann Omufuria"],
          },
          {
            position: "Chapter Representative",
            names: ["QS Olivia Sally Mwembe"],
          },
          {
            position: "Secretary General",
            names: ["QS Alfred Aluvala"],
          },
          {
            position: "Hon. Treasurer of the AAK; member of the Membership Board of the AAQS",
            names: ["QS Diana Musyoka"],
          },
          {
            position: "Chapter Secretary; Member of AAQS",
            names: ["QS Abishag Wambugu"],
          },
        ],
      },
      {
        name: "Board of Registration of Architects and Quantity Surveyors (BORAQS)",
        roles: [
          {
            position: "Representative",
            names: ["QS Alfred Aluvala"],
            note: "Term expired",
          },
          {
            position: "Representative",
            names: ["QS Patience Mulondo"],
            note: "Term expired",
          },
        ],
      },
      {
        name: "Commonwealth Association of Surveying and Land Economy (CASLE)",
        roles: [
          {
            position: "AAK Representative",
            names: ["QS Patience Mulondo"],
          },
        ],
      },
    ],
  },
  {
    chapter: "Architects",
    bodies: [
      {
        name: "International Union of Architects (UIA)",
        roles: [
          {
            position: "Council member at UIA",
            names: ["Arch. Mugure Njendu"],
          },
          {
            position: "Alternate Council Member",
            names: ["Arch. Wilson Mugambi"],
          },
        ],
      },
      {
        name: "UIA Work Groups",
        roles: [
          {
            position: "Architecture for All Group",
            names: ["Arch. Alfred Omenya"],
          },
          {
            position: "Architecture, Cities and Territories",
            names: ["Arch. Steven Oundo"],
          },
          {
            position: "Sports & Leisure Group",
            names: ["Arch. Steven Oundo"],
          },
          {
            position: "Architecture & Children Group",
            names: ["Arch. Florence Nyole"],
          },
          {
            position: "International Competitions Commission",
            names: ["Arch. Florence Nyole"],
          },
          {
            position: "Public Spaces Group",
            names: ["Arch. Florence Nyole"],
          },
          {
            position: "Community Architecture Group",
            names: ["Arch. Arthur Adeya"],
          },
          {
            position: "Heritage & Cultural Identity Group",
            names: ["Dr. Arch. Kassim Omar"],
          },
          {
            position: "Social Habitat Group",
            names: ["Arch. George A. Ndege"],
          },
          {
            position: "Educational & Cultural Spaces Group",
            names: ["Arch. Mumbua Musyimi"],
          },
          {
            position: "Public Health Group",
            names: ["Arch. Musembi Mumo"],
          },
        ],
      },
      {
        name: "Commonwealth Association of Architects (CAA)",
        roles: [
          {
            position: "President",
            names: ["Arch. Steven Oundo"],
          },
          {
            position: "Vice President, Africa",
            names: ["Arch. Wilson Mugambi"],
          },
          {
            position: "Executive Director",
            names: ["Mr. Jacob Mwangi"],
          },
          {
            position: "Knowledge Sharing Partnership Member",
            names: ["Arch. George A. Ndege"],
          },
        ],
      },
      {
        name: "African Union of Architects (AUA)",
        roles: [
          {
            position: "Acting Co. Vice President / Co-Chairman East Africa Region",
            names: ["Arch. John Mwaniki"],
          },
          {
            position: "Senior Trustee",
            names: ["Arch. Jeremiah Ndong"],
          },
        ],
      },
      {
        name: "AUA Commissions",
        roles: [
          {
            position: "Commissioner Ethics and Practice Commission",
            names: ["Arch. John Mwaniki"],
          },
          {
            position: "Culture and heritage",
            names: ["Arch. Alfred Mango"],
          },
        ],
      },
      {
        name: "East Africa Institute of Architects (EAIA)",
        roles: [
          {
            position: "Immediate Past President",
            names: ["Arch. Wycliffe Waburiri"],
          },
          {
            position: "Honorary Secretary",
            names: ["Arch. Jacqueline Kairu"],
          },
          {
            position: "Council Member",
            names: ["Arch. George A. Ndege"],
          },
          {
            position: "Treasurer",
            names: ["Arch. Brendah Gitonga"],
          },
          {
            position: "Council Member",
            names: ["Arch. Josephine Mwangi"],
          },
          {
            position: "Board of Education Member",
            names: ["Arch. Margarer Mwihia"],
          },
          {
            position: "Board of Practice and Ethics Member",
            names: ["Arch. Brenda Nyawara"],
          },
          {
            position: "General Assembly Member",
            names: ["Arch. Wilson Mugambi"],
          },
          {
            position: "General Assembly Member",
            names: ["Arch. Florence Nyole"],
          },
          {
            position: "General Assembly Member",
            names: ["Arch. John Mwaniki"],
          },
          {
            position: "General Assembly Member",
            names: ["Arch. Alex Nyaga"],
          },
          {
            position: "General Assembly Member",
            names: ["Arch. Waweru Gathecha"],
          },
          {
            position: "Trustee",
            names: ["Arch. James Gitoho"],
          },
          {
            position: "Senior Trustee",
            names: ["Arch. Philip Kungu"],
          },
          {
            position: "AAK CEO",
            names: ["Mr. Jacob Mwangi"],
          },
        ],
      },
      {
        name: "Association of Professional Societies in East Africa (APSEA)",
        roles: [
          {
            position: "Asst. Secretary",
            names: ["Arch. Mumbua Musyimi"],
          },
        ],
      },
      {
        name: "Board of the National Construction Authority for the period 2025-2029",
        roles: [
          {
            position: "Board Member",
            names: ["Arch. Florence Nyole"],
          },
        ],
      },
      {
        name: "Independent committee of experts",
        roles: [
          {
            position: "",
            names: ["Arch. Alex Nyaga"],
          },
          {
            position: "",
            names: ["Qs. Diana Musyoka"],
          },
        ],
      },
      {
        name: "American Institute of Architects (AIA)",
        roles: [
          {
            position: "International Country Representative for Kenya",
            names: ["Arch. Florence Nyole"],
          },
        ],
      },
      {
        name: "Physical and Land Use Planning (PLUPA) liaison committee",
        roles: [
          {
            position: "",
            names: ["Dr. Gerryshom Munala"],
          },
        ],
      },
      {
        name: "Board of Registration of Architects and Quantity Surveyors (BORAQS)",
        roles: [
          {
            position: "Board Member",
            names: ["Arch. Wilson Mugambi"],
            note: "Term expired",
          },
          {
            position: "Board Member",
            names: ["Arch. Mumbua Musyimi"],
            note: "Term expired",
          },
        ],
      },
      {
        name: "Multisectoral Agency Consultative Committee (MSACC)",
        roles: [
          {
            position: "Member",
            names: ["Arch. Bernard Segecha"],
          },
        ],
      },
    ],
  },
  {
    chapter: "Landscape Architects",
    bodies: [
      {
        name: "International Federation of Landscape Architects (IFLA)",
        roles: [
          {
            position: "World Council Country Delegate",
            names: ["L.Arch. Anthony Kimondo"],
          },
          {
            position: "Chair Link Working Group",
            names: ["L.Arch. Fiona Nyadero"],
          },
          {
            position: "Emergent Professions Working Group",
            names: ["L.Arch. Loice Atieno"],
          },
          {
            position: "IFLA world: social media volunteer",
            names: ["L.Arch. Ivy Gitau"],
          },
          {
            position: "IFLA world: social media volunteer",
            names: ["L.Arch. Betty Mwendwa"],
          },
        ],
      },
      {
        name: "International Federation of Landscape Architects Africa (IFLA Africa)",
        roles: [
          {
            position: "President, IFLA Africa",
            names: ["L.Arch. Ruth Wanjiku"],
          },
          {
            position: "Chair, Education and Academic Affairs",
            names: ["L.Arch Cecily Murage"],
          },
          {
            position: "Member, IFLA Africa Communication Subcommittee",
            names: ["L.Arch. Caroline Wanza"],
          },
          {
            position: "IFLA world: social media volunteer",
            names: ["L.Arch. Ivy Gitau"],
          },
          {
            position: "IFLA world: social media volunteer",
            names: ["L.Arch. Betty Mwendwa"],
          },
          {
            position: "IFLA Africa: Social media team",
            names: ["L.Arch. Kennedy Mwobobia"],
          },
          {
            position: "",
            names: ["L.Arch. Ivy Gitau"],
          },
        ],
      },
      {
        name: "Landscape Architects Without Borders",
        roles: [
          {
            position: "Africa Representative",
            names: ["L.Arch. Hitesh Mehta"],
          },
        ],
      },
      {
        name: "African Journal of Landscape Architecture(AJLA)",
        roles: [
          {
            position: "Founder & Editor",
            names: ["L.Arch. Dennis Karanja"],
          },
        ],
      },
      {
        name: "Kenya Private Sector Alliance (KEPSA)",
        roles: [
          {
            position: "AAK Representative",
            names: ["L.Arch. Loice Atieno"],
          },
        ],
      },
    ],
  },
  {
    chapter: "Town Planners",
    bodies: [
      {
        name: "Status of Urban Planning in Kenya Assessment Task force",
        roles: [
          {
            position: "Representative",
            names: ["Plan. Cyrus Mbisi"],
          },
        ],
      },
      {
        name: "Kabarnet Municipality Board",
        roles: [
          {
            position: "Representative",
            names: ["Plan. Felix Swai"],
          },
        ],
      },
      {
        name: "Physical Planners Registration Board (PPRB)",
        roles: [
          {
            position: "Representative",
            names: ["Plan. Cyrus Mbisi Ogutu"],
          },
          {
            position: "Representative",
            names: ["Dr. Wilfred Ochieng Omollo"],
          },
          {
            position: "Representative",
            names: ["Dr. Peris Mangira"],
          },
          {
            position: "Representative",
            names: ["Dr. Jeremiah Ayonga"],
          },
          {
            position: "Representative",
            names: ["Plan. Silas Mbaabu Gichuru"],
            note: "Nominated in November 2025",
          },
          {
            position: "Representative",
            names: ["Plan. Dr. Fredrick Omondi Owino"],
            note: "Nominated in November 2025",
          },
          {
            position: "Representative",
            names: ["Plan. Ntabo Mogeni"],
          },
          {
            position: "Representative",
            names: ["Plan. Ann Mugo"],
          },
          {
            position: "Representative",
            names: ["Plan. Elizabeth Mburu"],
          },
          {
            position: "Representative",
            names: ["Plan. Alfred Mwanzia"],
          },
        ],
      },
      {
        name: "The Second Kenya Informal Settlement Improvement Project (KISIP2)",
        roles: [
          {
            position: "Strategy Consultant",
            names: ["Dr. Wilfred Ochieng Omollo"],
          },
        ],
      },
    ],
  },
  {
    chapter: "Environmental Design Consultants",
    bodies: [
      {
        name: "KEMRI- Assessing Housing Modification for Indoor Thermal Comfort and Malaria Control",
        roles: [
          {
            position: "Expert",
            names: ["Arch. Duncan Wamugi"],
          },
          {
            position: "Expert",
            names: ["Arch. Litunya Rosemary"],
          },
        ],
      },
    ],
  },
  {
    chapter: "Engineers",
    bodies: [
      {
        name: "World Council of Civil Engineers (WCCE)",
        roles: [
          {
            position: "President-Elect",
            names: ["Eng. Nathaniel Matalanga"],
            note: "Represents IEK",
          },
        ],
      },
      {
        name: "World Federation of Engineering Organizations (WFEO)",
        roles: [
          {
            position: "Executive Council Member",
            names: ["Eng. Nathaniel Matalanga"],
            note: "Represents IEK",
          },
        ],
      },
      {
        name: "National implementation committee on Eurocodes (NICE)",
        roles: [
          {
            position: "",
            names: ["Eng. Shammah Kiteme Munyoki"],
            note: "On individual Capacity",
          },
        ],
      },
    ],
  },
];

/** County government boards and committees, by county. */
export const nominationsByCounty: NominationBody[] = [
  {
    name: "Baringo County",
    roles: [
      {
        position: "Kabarnet Municipality Board",
        names: ["Plan. Felix Swai"],
      },
    ],
  },
  {
    name: "Bungoma County",
    roles: [
      {
        position: "Bungoma Municipal Board",
        names: ["Arch. Ham Wesonga"],
        note: "Chairperson",
      },
      {
        position: "",
        names: ["Arch. Stephen Khisa Simiyu"],
      },
      {
        position: "",
        names: ["Arch. Salome Nanjala Bukania"],
      },
    ],
  },
  {
    name: "Embu County",
    roles: [
      {
        position: "Physical and Land-use Planning Liaison Committee",
        names: ["Arch. David K. Nyaga"],
      },
    ],
  },
  {
    name: "Homa Bay County",
    roles: [
      {
        position: "Homa Bay",
        names: ["Arch. David Songoro"],
      },
      {
        position: "Oyugis",
        names: ["Arch. Gor Lango Robert"],
      },
      {
        position: "Mbita",
        names: ["Arch. Gor Lango Robert"],
      },
      {
        position: "Kendu Bay",
        names: ["Arch. Wanga Timon Wanga"],
      },
      {
        position: "UPTC (Nominated in 2026)",
        names: ["Arch. Aggrey Maganga", "Arch. Robinson Onyango Manguro"],
      },
    ],
  },
  {
    name: "Kajiado County",
    roles: [
      {
        position: "Member of the County Physical and Land Use Liaison Committee",
        names: ["Arch. Antonio Ombati"],
      },
    ],
  },
  {
    name: "Kakamega County",
    roles: [
      {
        position: "Kakamega Municipal Board",
        names: ["Arch. Timothy Mudome"],
      },
      {
        position:
          "Ad Hoc Committee on Conferment of Municipality Status to Butere, Malava, and Matunda Urban Centers",
        names: ["Arch. Linus Kibisu"],
      },
    ],
  },
  {
    name: "Kericho County",
    roles: [
      {
        position: "Kericho Municipal Board",
        names: ["Arch. Segecha Bernard Kipruto"],
      },
    ],
  },
  {
    name: "Kiambu County",
    roles: [
      {
        position: "Liaison Committee",
        names: ["Mr. David Kariuki"],
      },
      {
        position: "Ad Hoc Committee on Conferment of Thika City Status",
        names: ["Arch. Sylvia Kasanga"],
      },
    ],
  },
  {
    name: "Kilifi County",
    roles: [
      {
        position: "Ad Hoc Committee",
        names: ["Dr. Kassim Omar"],
      },
    ],
  },
  {
    name: "Kisumu County",
    roles: [
      {
        position: "Ad Hoc Committee on Classification of Urban Areas in Kisumu County",
        names: ["Arch. Victor Nyakundi"],
      },
      {
        position: "Kisumu County Physical and Land Use Planning Liaison Committee (2025-2028)",
        names: ["Arch. Dorothy Abonyo"],
        note: "1 October 2025",
      },
    ],
  },
  {
    name: "Laikipia County",
    roles: [
      {
        position: "Nanyuki Municipality",
        names: ["Arch. Elly Odero Deya"],
      },
    ],
  },
  {
    name: "Machakos County",
    roles: [
      {
        position: "",
        names: ["Arch. Marylyn Musyimi"],
      },
      {
        position:
          "Ad hoc committee on conferment to municipality status of 4 urban areas in Machakos County",
        names: ["Arch. Duncan Wamugi"],
      },
      {
        position: "Mbooni-Kee Municipality Ad Hoc Committee",
        names: ["Eng. Paul C.K. Kioko"],
      },
    ],
  },
  {
    name: "Makueni County",
    roles: [
      {
        position: "Makueni County Physical and Land Use Liaison Committee",
        names: ["Arch. Michael Kimunyu"],
      },
      {
        position: "Emali to Sultan Hamud",
        names: ["Arch. Stanley Mwania Kyalo"],
      },
      {
        position: "Mbooni-Kee Municipality Ad Hoc Committee",
        names: ["Eng. Paul C.K. Kioko"],
      },
    ],
  },
  {
    name: "Marsabit County",
    roles: [
      {
        position: "Ad Hoc Committee",
        names: ["Arch. Malinson Koech"],
      },
      {
        position: "Physical and Land Use Planning Consultative Forum",
        names: ["Arch. Bulle Lolo Hirbo"],
      },
      {
        position: "Physical and Land Use Planning Consultative Liaison Committee",
        names: ["Arch. Benson Kiarie Kimata"],
      },
    ],
  },
  {
    name: "Meru County",
    roles: [
      {
        position: "Physical and Land Use Planning Committee",
        names: ["Arch. Stephen Munene Ituma"],
      },
    ],
  },
  {
    name: "Mombasa County",
    roles: [
      {
        position: "Physical and Land Use Planning Committee",
        names: ["Arch. Imran Will Suleiman"],
      },
    ],
  },
  {
    name: "Murang'a County",
    roles: [
      {
        position: "Murang’a Municipal Board",
        names: ["Arch. Benson Githinji Mwangi"],
      },
    ],
  },
  {
    name: "Nairobi County",
    roles: [
      {
        position: "Urban Planning Technical Committee",
        names: ["Arch. Brenda Nyawara"],
        note: "Until 2025",
      },
      {
        position: "Liaison Committee",
        names: ["Arch. Juma Oino"],
        note: "Until 2025",
      },
      {
        position: "",
        names: ["Arch. Wilson Mugambi"],
        note: "Gazetted early 2026",
      },
      {
        position: "Building Audit Taskforce",
        names: ["Arch. Benson Githinji Mwangi"],
      },
      {
        position: "Development Application Technical Committee",
        names: ["Arch. Christopher Naicca"],
      },
      {
        position: "",
        names: ["Abdi Ismail"],
      },
      {
        position: "Physical And Land Use Planning Consultative Forum",
        names: ["Arch. Wilson Mugambi"],
        note: "Nominated in November 2025",
      },
    ],
  },
  {
    name: "Nakuru County",
    roles: [
      {
        position: "Naivasha Municipality",
        names: ["Arch. Duncan Wamugi"],
      },
      {
        position: "Gilgil Municipality Board",
        names: ["Arch. Kimani Fredrick Mbogo"],
      },
      {
        position: "Molo Municipality",
        names: ["Arch. Kaggai Thiongo"],
      },
      {
        position: "Naivasha Municipality",
        names: ["Arch. Duncan Wamugi"],
      },
      {
        position: "Mwisho Wa Lami (Njoro) & Tayari Settlement (Molo)",
        names: ["Arch. Githinji Mbugua"],
      },
      {
        position: "Mwisho Wa Lami (Njoro) & Tayari Settlement (Molo)",
        names: ["L. Arch. Ruth Wanjiku"],
      },
    ],
  },
  {
    name: "Nandi County",
    roles: [
      {
        position: "Physical and Land Use Planning Consultative Forum",
        names: ["Arch. Nicholas Koech"],
      },
    ],
  },
  {
    name: "Nyandarua County",
    roles: [
      {
        position: "Engineer and Mairo-Inya",
        names: ["Arch. Joel Oyuga"],
      },
    ],
  },
  {
    name: "Tharaka Nithi",
    roles: [
      {
        position: "Chuka Municipality",
        names: ["Arch. Brenda Gatwiri Gitonga"],
      },
    ],
  },
  {
    name: "Uasin Gishu County",
    roles: [
      {
        position: "Ad Hoc Committee on Conferment of Eldoret City Status",
        names: ["Arch. Florence Nyole"],
      },
      {
        position: "Ad hoc committee of Burnt Forest",
        names: ["Arch. Antonio Ombati"],
      },
      {
        position: "Kesses Cheboiywo Township",
        names: ["L.Arch. Jacqueline Legishon"],
      },
      {
        position: "Turbo Township",
        names: ["Eng. Nashon Tambo"],
      },
      {
        position: "Ziwa Township",
        names: ["L.Arch. Samuel Mugo Marwa"],
      },
      {
        position: "Moiben Township",
        names: ["Arch. Albert Kipleting Ruto"],
      },
      {
        position: "Moi's Bridge Township",
        names: ["Arch. Erick Kisang Plal"],
      },
      {
        position: "Burnt Forest",
        names: ["Arch. Michael Mathenge"],
      },
    ],
  },
  {
    name: "Vihiga County",
    roles: [
      {
        position: "Ad Hoc Committee for Conferment of Luanda and Kaimosi to Municipal Status",
        names: ["Arch. Wycliffe Tsalwa Waburiri"],
      },
    ],
  },
  {
    name: "West Pokot County",
    roles: [
      {
        position: "",
        names: ["Arch. Eric Kisang' Plal"],
      },
    ],
  },
];
