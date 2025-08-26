// Property Page V3 Components
export { StickyCtaBar, StickyCtaSidebar } from '../ui/StickyCtaBar';
export { PriceBreakdown } from './PriceBreakdown';
export { AmenityChips, AmenityChipsSkeleton, type AmenityChip } from './AmenityChips';
export { BuildingLinkCard, BuildingLinkCardSkeleton, BuildingLinkCardCompact } from '../building/BuildingLinkCard';
export { PropertyGallery } from './PropertyGallery';
export { RelatedProperties } from './RelatedProperties';
export { PropertyFAQ } from './PropertyFAQ';

// Types
export interface PropertyPageV3Props {
  propertyId: string;
  commune: string;
  priceMonthly: number;
  amenities: import('./AmenityChips').AmenityChip[];
  buildingData: {
    name: string;
    photo: string;
    href: string;
    unitCount?: number;
    description?: string;
  };
}
