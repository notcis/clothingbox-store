import {
  DollarSignIcon,
  HeadsetIcon,
  ShoppingBagIcon,
  WalletCardsIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function IconBoxes() {
  return (
    <div>
      <Card>
        <CardContent className=" grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBagIcon />
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on orders above 1,000 THB
            </div>
          </div>
          <div className="space-y-2">
            <DollarSignIcon />
            <div className="text-sm font-bold">Money Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCardsIcon />
            <div className="text-sm font-bold">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with credit card, PayPal or COD
            </div>
          </div>
          <div className="space-y-2">
            <HeadsetIcon />
            <div className="text-sm font-bold">24/7 Support</div>
            <div className="text-sm text-muted-foreground">
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
