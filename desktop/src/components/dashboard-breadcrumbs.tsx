
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import toTitleCase from "@/lib/title-case";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type BreadcrumbSegment = {
  link: string;
  name: string;
};

export default function HeaderBreadcrumbs() {
  const pathname = useLocation().pathname;
  const pieces = pathname.split("/").filter(Boolean);
  const items: BreadcrumbSegment[] =
    pieces.length === 0
      ? [
          {
            link: "/",
            name: "Dashboard",
          },
        ]
      : pieces.reduce<BreadcrumbSegment[]>(
          (acc, item) => [
            ...acc,
            {
              link: (acc[acc.length - 1]?.link ?? "") + "/" + item,
              name: toTitleCase(item),
            },
          ],
          [],
        );

  return (
    <>
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          {items.map((item, index) =>
            index !== items.length - 1 ? (
              [
                <BreadcrumbItem key={item.link}>
                  <BreadcrumbLink asChild>
                    <Link to={item.link}>{item.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>,
                <BreadcrumbSeparator key={item.link + "-separator"} />,
              ]
            ) : (
              <BreadcrumbItem key={item.link}>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            ),
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <Breadcrumb className="md:hidden">
        <BreadcrumbList>
          {items.length > 2 && (
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Show menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  {items.slice(0, -1).map((item) => (
                    <Link to={item.link} key={item.link}>
                      <DropdownMenuItem>{item.name}</DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          )}

          {items.length === 2 && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={items[0].link}>{items[0].name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}

          {items.length > 1 && <BreadcrumbSeparator />}

          <BreadcrumbItem key={items[items.length - 1].link}>
            <BreadcrumbPage>{items[items.length - 1].name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
