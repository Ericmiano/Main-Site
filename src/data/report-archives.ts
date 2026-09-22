/**
 * Document lists for the Resource Centre's report-archive pages. Extracted
 * into a shared module (rather than declared inline in each route file) so
 * the search index can import them without pulling in whole route modules.
 */

export interface ArchiveDocument {
  title: string;
  year?: string;
  href: string;
}

export const agmReportsDocuments: ArchiveDocument[] = [
  {
    title: "2026 AGM Report and Audited Financial Statements for the year 2025",
    year: "2026",
    href: "/documents/AAK-AGM-Report-2026.pdf",
  },
  {
    title: "AAK AGM Report",
    year: "2025",
    href: "/documents/AAK-AGM-Report-2025_compressed.pdf",
  },
  {
    title: "AAK AGM Report",
    year: "2020",
    href: "/documents/20210325-AAK-AGM-Report-2020-1.pdf",
  },
  {
    title: "AAK AGM Report",
    year: "2020",
    href: "/documents/20210325-AAK-AGM-Report-2020.pdf",
  },
];

export const billsDocuments: ArchiveDocument[] = [
  {
    title: "AAK Memorandum on the Finance Bill",
    year: "2025",
    href: "/documents/AAK-Memorandum-on-Finance-Bill-2025.pdf",
  },
  {
    title: "AAK Memorandum on the Finance Bill",
    year: "2026",
    href: "/documents/AAK-Memorandum-on-the-Finance-Bill-2026-7.pdf",
  },
];

export const buildingRegulationsDocuments: ArchiveDocument[] = [
  {
    title: "Automation of Development Control in Kenya",
    href: "/documents/FINAL_AUTOMATION-OF-DEVELOPMENT-CONTROLAUTOMATION-OF-DEVELOPMENT-CONTROL.pdf",
  },
  {
    title: "Feasibility of Centralization of Development Control Systems in Kenya",
    year: "2020",
    href: "/documents/FEASIBILITY-OF-CENTRALIZATION-OF-DEVELOPMENT-CONTROL-SYSTEMS-IN-KENYA-2.pdf",
  },
  {
    title: "Safe Learning Handbook",
    year: "2020",
    href: "/documents/26.11.20-Safe-Learning-Handbook-2.pdf",
  },
  {
    title: "Development Control Frameworks in Kenya",
    year: "2011",
    href: "/documents/Study-on-Development-Control-Frameworks-in-Kenya.pdf",
  },
  {
    title: "Safety Standards Manual for Schools, Kenya",
    year: "2008",
    href: "/documents/2008-Safety-Standards-Manual-for-Schools_Kenya.pdf",
  },
];

export const buildpressMagazineDocuments: ArchiveDocument[] = [
  {
    title: "BuildPress Magazine",
    year: "2021",
    href: "/documents/BuildPress-Magazine-2021f.pdf",
  },
  {
    title: "BuildPress — Kisumu",
    year: "2025",
    href: "/documents/AAK_BuildPress2025_Kisumu.pdf",
  },
  {
    title: "BuildPress, Issue 2",
    year: "2020",
    href: "/documents/Buildpress-Issue-2-v1-15.9.20.pdf",
  },
  {
    title: "BuildPress — The Architect, Issue 14",
    year: "2018",
    href: "/documents/The-Architect-2018-Issue-14.pdf",
  },
  {
    title: "BuildPress — The Architect, Issue 13",
    year: "2017",
    href: "/documents/The-Architect-Issue-13-2017.pdf",
  },
];

export const cpdRapporteurReportsDocuments: ArchiveDocument[] = [
  {
    title: "Pecha Kucha Rapporteurs Report",
    href: "/documents/PECHA-KUCHA-Rappoteurs-Report.pdf",
  },
  {
    title: "AAK 2025 Convention Rapporteur General's Report",
    year: "2025",
    href: "/documents/AAK-Convention-2025-Rapporteur-Generals-Report.pdf",
  },
];

export const liaisonCommitteesReportsDocuments: ArchiveDocument[] = [
  {
    title: "AAK Leadership at National, Regional and International Positions",
    year: "2026",
    href: "/documents/AAK-Leadership-at-National-Regional-and-International-Positions.pdf",
  },
  {
    title: "Nairobi Physical and Land Use Planning Liaison Committee Report",
    year: "2026",
    href: "/documents/Nairobi-Physical-and-Land-Use-Planning-Liaison-Committee.pdf",
  },
];

export const mulikaMjengoReportDocuments: ArchiveDocument[] = [
  {
    title: "Mulika Mjengo Initiative",
    href: "/documents/MULIKA-MJENGO-INITIATIVE.pdf",
  },
];

export const opinionEditorialsDocuments: ArchiveDocument[] = [
  {
    title: "Feasibility of Centralization of Development Control Systems in Kenya",
    year: "2026",
    href: "/documents/FEASIBILITY-OF-CENTRALIZATION-OF-DEVELOPMENT-CONTROL-SYSTEMS-IN-KENYA.pdf",
  },
  {
    title: "Proposal for Safe School Dormitories in Kenya",
    year: "2026",
    href: "/documents/Proposal-for-Safe-School-Dormitories-in-Kenya-1.pdf",
  },
];

export const pressStatementsDocuments: ArchiveDocument[] = [
  {
    title: "Built Environment Associations Press Statement",
    year: "2025",
    href: "/documents/Built-Environment-Associations-Press-Statement-20260108.pdf",
  },
  {
    title: "AAK Memorandum on the Finance Bill",
    year: "2025",
    href: "/documents/AAK-Memorandum-on-Finance-Bill-2025.pdf",
  },
  {
    title: "South-C Building Collapse — Built Environment Associations Press Statement",
    year: "2026",
    href: "/documents/South-C-Building-Collapse-Built-Environment-Associations-Press-Statement-20260108-2.pdf",
  },
];

export const salarySurveyDocuments: ArchiveDocument[] = [
  {
    title: "AAK Salary Survey Report",
    year: "2022",
    href: "/documents/AAK-Salary-Survey-Report-2022-1.pdf",
  },
  {
    title: "AAK Salary Survey",
    year: "2019",
    href: "/documents/AAK-2019-Salary-Survey.pdf",
  },
];

export const statusOfTheBuiltEnvironmentDocuments: ArchiveDocument[] = [
  {
    title: "AAK Status of the Built Environment Report 2025",
    year: "2025",
    href: "/documents/AAK-Status-of-the-Built-Environment-Report-2025-1.pdf",
  },
  {
    title: "Status of the Built Environment Report",
    year: "2024",
    href: "/documents/Status-of-the-Built-Environment-Report-2024.pdf",
  },
  {
    title: "Status of the Built Environment Report",
    year: "2023",
    href: "/documents/STATUS-OF-THE-BUILT-ENVIRONMENT-REPORT-2023.pdf",
  },
  {
    title: "Status of the Built Environment Report",
    year: "2022",
    href: "/documents/THE-STATUS-OF-THE-BUILT-ENVIRONMENT-REPORT-2022.pdf",
  },
  {
    title: "Status of the Built Environment Report, August",
    year: "2021",
    href: "/documents/AAK-SBE-REPORT-AUG-1.2.21.pdf",
  },
  {
    title: "Status of the Built Environment Report, January–June",
    year: "2021",
    href: "/documents/AAK-SBE-REPORT-JAN-JUN-2021-1.pdf",
  },
  {
    title: "Status of the Built Environment Report",
    year: "2020",
    href: "/documents/AAK-SBE-REPORT-2020-v2-3.pdf",
  },
  {
    title: "SBE Report — AAK Presentation",
    year: "2019",
    href: "/documents/SBE-Report-AAK-Presentation-31072019.pdf",
  },
  {
    title: "Status of the Built Environment, January–June",
    year: "2018",
    href: "/documents/STATUS-OF-THE-BUILT-ENVIRONMENT.-JANUARY-JUNE-2018-2.pdf",
  },
  {
    title: "Status of the Built Environment Report",
    year: "2018",
    href: "/documents/STATUS-OF-THE-BUILT-ENVIRONMENT-2018-FINAL.pdf",
  },
];

export const generalDownloadsDocuments: ArchiveDocument[] = [
  {
    title: "AAK Memorandum on the Finance Bill",
    year: "2025",
    href: "/documents/AAK-Memorandum-on-Finance-Bill-2025.pdf",
  },
  {
    title: "AAK Constitution",
    year: "2022",
    href: "/documents/Constitution-2022-3.pdf",
  },
  {
    title: "AAK Health and Safety Initiatives",
    year: "2026",
    href: "/documents/6.-AAK-Health-and-Safety-initiatives-1.pdf",
  },
  {
    title: "Convention x Biennale Partnership Deck",
    year: "2026",
    href: "/documents/Convention-x-Biennale-Sponsorship-Deck.pdf",
  },
  {
    title: "Drainage and Floods, completely revised",
    href: "/documents/Drainage-and-Floods-completely-revised.pdf",
  },
  {
    title: "Safe Learning Handbook",
    href: "/documents/26.11.20-Safe-Learning-Handbook.pdf",
  },
  {
    title: "Doing Business in Kenya",
    year: "2020",
    href: "/documents/Doing-Business-in-Kenya-2020.pdf",
  },
  {
    title: "Safari Green Building Index Rating",
    year: "2019",
    href: "/documents/Safari-Green-Building-Index-Rating_2019.pdf",
  },
  {
    title: "Proposed Feminist Republik Healing Farm",
    year: "2011",
    href: "/documents/Proposed-Feminist-Republik-Healing-Farm.pdf",
  },
];

/** Every report-archive page's document list, tagged with the page that lists it — for the search index. */
export const reportArchivePages: { category: string; to: string; documents: ArchiveDocument[] }[] =
  [
    { category: "AGM Reports", to: "/agm-reports", documents: agmReportsDocuments },
    { category: "Bills", to: "/bills", documents: billsDocuments },
    {
      category: "Building Regulations",
      to: "/building-regulations",
      documents: buildingRegulationsDocuments,
    },
    {
      category: "BuildPress Magazine",
      to: "/buildpress-magazine",
      documents: buildpressMagazineDocuments,
    },
    {
      category: "CPD Rapporteur Reports",
      to: "/cpd-rapporteur-reports",
      documents: cpdRapporteurReportsDocuments,
    },
    {
      category: "Liaison Committees Reports",
      to: "/liaison-committees-reports",
      documents: liaisonCommitteesReportsDocuments,
    },
    {
      category: "Mulika Mjengo Report",
      to: "/mulika-mjengo-report",
      documents: mulikaMjengoReportDocuments,
    },
    {
      category: "Opinion Editorials",
      to: "/opinion-editorials",
      documents: opinionEditorialsDocuments,
    },
    { category: "Press Statements", to: "/press-statements", documents: pressStatementsDocuments },
    { category: "Salary Survey", to: "/salary-survey", documents: salarySurveyDocuments },
    {
      category: "Status of the Built Environment Report",
      to: "/status-of-the-built-environment",
      documents: statusOfTheBuiltEnvironmentDocuments,
    },
    {
      category: "General Downloads",
      to: "/general-downloads",
      documents: generalDownloadsDocuments,
    },
  ];
