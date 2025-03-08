import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  segments: {
    name: string;
    href?: string;
  }[];
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {segments.map((segment, index) => (
          <li key={segment.name} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {segment.href ? (
              <a
                href={segment.href}
                className="hover:text-foreground transition-colors"
              >
                {segment.name}
              </a>
            ) : (
              <span className="text-foreground font-medium">{segment.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}