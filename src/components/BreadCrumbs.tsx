import { NavLink, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import type { BreadCrumbProps } from "@/type/product";

const BreadCrumb = ({ lastLabel }: BreadCrumbProps) => {
  const { pathname } = useLocation();
  const params = useParams();
    const isLast = Boolean(params.id && lastLabel);
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      {/* Home */}
      <NavLink to="/" className="hover:text-foreground">
        Home
      </NavLink>

      {segments.map((seg, index) => {
        const to = "/" + segments.slice(0, index + 1).join("/");
        let label = seg
        if (isLast && index === segments.length -1) {
          label = lastLabel||seg;
        }
        return (
          <span key={to} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
              <NavLink to={to} className="hover:text-foreground">
                {label}
              </NavLink>
        
          </span>
        );
      })}
    </nav>
  );
};

export default BreadCrumb;
