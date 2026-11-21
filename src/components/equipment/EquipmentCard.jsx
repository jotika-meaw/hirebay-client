"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useFavoriteIds, useToggleFavorite } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";
import { cn } from "@/lib/utils";

// Per-photo object-position from 03 §7 (keyed by image file name).
export const PHOTO_POSITIONS = {
  "excavator.jpg": "40% 55%",
  "cinema.jpg": "50% 45%",
  "van.jpg": "60% 88%",
  "tractor.jpg": "45% 40%",
  "drone.jpg": "30% 50%",
  "speaker.jpg": "50% 40%",
  "stage.jpg": "50% 50%",
  "camera-rig-fx3.jpg": "55% 50%",
  "studio-cinema-camera.jpg": "50% 50%",
  "generator.jpg": "50% 55%",
  "demolition-excavator.jpg": "50% 45%",
  "hero-excavator-site.jpg": "35% 45%",
};

export function shortCategory(category) {
  if (category === "Vehicles & Transportation") return "Vehicles";
  return category.replace(" Equipment", "");
}

const UNIT_LABEL = { daily: "day", weekly: "week", monthly: "month" };

// Equipment card (03 §3): equal heights, heart + View details route
// logged-out visitors to /login?redirect=/equipment/<id>.
export default function EquipmentCard({ item }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const isCustomer = user?.role === "customer";
  const { data: favoriteIds } = useFavoriteIds({ enabled: isCustomer });
  const toggleFavorite = useToggleFavorite();

  const isFavorite = Boolean(favoriteIds?.data?.includes(item.id));
  const available = item.quantity > 0;
  const detailsHref = user ? `/equipment/${item.id}` : `/login?redirect=/equipment/${item.id}`;
  const file = item.image?.split("/").pop() ?? "";

  function handleHeart() {
    if (!user) {
      router.push(`/login?redirect=/equipment/${item.id}`);
      return;
    }
    if (!isCustomer) {
      toast.error("Only customers can save favorites");
      return;
    }
    toggleFavorite.mutate({ equipmentId: item.id, isFavorite });
  }

  return (
    <article className="flex h-full flex-col rounded-[24px] border border-border bg-card p-2 transition-all duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgba(17,17,17,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
          className={cn("object-cover transition-transform duration-900 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:scale-[1.06]", !available && "grayscale-[0.7]")}
          style={{ objectPosition: PHOTO_POSITIONS[file] ?? "50% 50%" }}
        />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white px-[11px] py-[5px] text-xs font-semibold text-[#111111]">
          {shortCategory(item.category)}
        </span>
        <button
          type="button"
          onClick={handleHeart}
          aria-pressed={isFavorite}
          aria-label={`${isFavorite ? "Remove" : "Save"} ${item.name} ${isFavorite ? "from" : "to"} favorites`}
          className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full bg-white text-[#111111] transition-transform duration-200 hover:scale-105"
        >
          <Heart className={cn("size-[17px]", isFavorite && "fill-[#111111]")} strokeWidth={2} aria-hidden="true" />
        </button>
        {available ? (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-[11px] py-[5px] text-xs font-semibold text-white">
            <span className="size-[7px] rounded-full bg-[#4ADE80]" aria-hidden="true" />
            {item.quantity} available
          </span>
        ) : (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-danger-bg px-[11px] py-[5px] text-xs font-semibold text-danger">
            Unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2.5 pt-3.5 pb-2">
        <h3 className="m-0 line-clamp-2 min-h-[46px] font-display text-xl leading-[1.15] font-bold tracking-[-0.03em]">
          {item.name}
        </h3>
        <div className="flex items-center justify-between text-[13px] text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-[5px]">
            <MapPin className="size-3.5 flex-none" aria-hidden="true" />
            <span className="truncate">{item.location}</span>
          </span>
          <span className="flex-none rounded-md bg-muted px-[7px] py-[3px] font-mono text-[11px] font-semibold text-foreground">
            {item.rentalType.toUpperCase()}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-input pt-3">
          <span>
            <b className="font-display text-2xl tracking-[-0.03em]">{formatBDT(item.price)}</b>
            <span className="text-[13px] text-muted-foreground"> / {UNIT_LABEL[item.rentalType] ?? item.rentalType}</span>
          </span>
          <Link
            href={detailsHref}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
