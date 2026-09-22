import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbCrumb {
  label: string;
  /** Omit on the current page's own crumb (rendered as plain text). */
  href?: string;
}

interface PageBreadcrumbProps {
  /** Crumbs after Home, which is always prepended automatically. */
  trail: BreadcrumbCrumb[];
}

export function PageBreadcrumb({ trail }: PageBreadcrumbProps) {
  const items: BreadcrumbCrumb[] = [{ label: "Home", href: "/" }, ...trail];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
