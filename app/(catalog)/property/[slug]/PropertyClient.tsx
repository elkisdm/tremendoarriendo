"use client";
import React from "react";
import type { Building } from "@schemas/models";
import { PropertyClient as BasePropertyClient } from "@components/property/PropertyClient";

interface PropertyClientProps {
  building: Building;
  relatedBuildings: Building[];
  defaultUnitId?: string;
}

export function PropertyClient({ building, relatedBuildings, defaultUnitId }: PropertyClientProps) {
  return (
    <BasePropertyClient
      building={building}
      relatedBuildings={relatedBuildings}
      defaultUnitId={defaultUnitId}
      variant="catalog"
    />
  );
}

