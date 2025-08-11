import { PromotionBadge as UiPromotionBadge } from "@components/ui/PromotionBadge";

type Props = {
  label?: string;
  tag?: string;
  variant?: 'default' | 'hero';
};

export function PromotionBadge(props: Props) {
  return <UiPromotionBadge {...props} />;
}


