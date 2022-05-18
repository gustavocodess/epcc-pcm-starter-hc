export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: Array<BreadcrumbItem>;
  current?: string;
  loading?: boolean;
}
