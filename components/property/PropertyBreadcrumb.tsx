"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import type { Building } from "@schemas/models";

interface PropertyBreadcrumbProps {
  building: Building;
  variant?: "catalog" | "marketing" | "admin";
}

export function PropertyBreadcrumb({ building, variant = "catalog" }: PropertyBreadcrumbProps) {
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: "Inicio", href: "/", ariaLabel: "Ir al inicio" },
      { label: "Propiedades", href: "/catalog", ariaLabel: "Ver catálogo de propiedades" }
    ];

    if (variant === "marketing") {
      return [
        { label: "Inicio", href: "/", ariaLabel: "Ir al inicio" },
        { label: "Arrienda sin comisión", href: "/arrienda-sin-comision", ariaLabel: "Ver arriendos sin comisión" }
      ];
    }

    if (variant === "admin") {
      return [
        { label: "Admin", href: "/admin", ariaLabel: "Panel de administración" },
        { label: "Propiedades", href: "/admin/properties", ariaLabel: "Gestionar propiedades" }
      ];
    }

    return baseItems;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav
      aria-label="Navegación de migas de pan"
      className="mb-4 lg:mb-6"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-300:text-gray-400">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <li>
              <a
                href={item.href}
                className="hover:text-blue-600 transition-colors"
                aria-label={item.ariaLabel}
              >
                {item.label}
              </a>
            </li>
            {index < breadcrumbItems.length && (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
        <li className="text-white:text-white font-medium" aria-current="page">
          {building.name}
        </li>
      </ol>
    </nav>
  );
}






