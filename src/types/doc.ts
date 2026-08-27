export interface DocSection {
  slug: string;
  title: string;
  content: string;
  project: string;
}

export interface DocNavItem {
  slug: string;
  title: string;
}

export interface DocPage {
  title: string;
  description: string;
  sections: DocSection[];
  navItems: DocNavItem[];
}

export interface ProjectDocs {
  title: string;
  description: string;
  sections: DocSection[];
  navItems: DocNavItem[];
}
