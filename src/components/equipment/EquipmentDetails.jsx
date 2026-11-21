"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import BookingModal from "@/components/equipment/BookingModal";
import { PHOTO_POSITIONS, shortCategory } from "@/components/equipment/EquipmentCard";
import OwnerCard, { EquipmentNotFound } from "@/components/equipment/OwnerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useEquipment, useFavoriteIds, useToggleFavorite } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";
import { useState } from "react";
import { cn } from "@/lib/utils";

const UNIT_LABEL = { daily: "day", weekly: "week", monthly: "month" };

// /equipment/[id]: gallery, badges, specs, price card, owner card,
// description, terms, favorite toggle. Owners/admins see a notice instead
// of Book now. Unknown ids render a 404 state.
export default function EquipmentDetails() {
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role ?? null;
  const isCustomer = role === "customer";
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data, isPending, isError } = useEquipment(id);
  const { data: favoriteIds } = useFavoriteIds({ enabled: isCustomer });
  const toggleFavorite = useToggleFavorite();

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-7 pt-10 pb-[90px]" aria-label="Loading equipment details">
        <Skeleton className="h-5 w-64" />
        <div className="mt-5 grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Skeleton className="aspect-[4/3] rounded-[26px]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-[76px] w-full rounded-[20px]" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const item = data?.data;
  if (isError || !item) {
    return <EquipmentNotFound />;
  }

  const isFavorite = Boolean(favoriteIds?.data?.includes(item.id));
  const available = item.quantity > 0;
  const [titleMain, ...titleRest] = item.name.split(" — ");
  const unit = UNIT_LABEL[item.rentalType] ?? item.rentalType;
  const file = item.image?.split("/").pop() ?? "";
  const specs = [
    { k: "Rental type", v: item.rentalType[0].toUpperCase() + item.rentalType.slice(1) },
    { k: "Available qty", v: `${item.quantity} unit${item.quantity === 1 ? "" : "s"}` },
    { k: "Condition", v: item.condition },
    { k: "Brand", v: item.brand },
    { k: "Model", v: item.model },
    { k: "Category", v: shortCategory(item.category) },
  ];

  function handleFavorite() {
    if (!isCustomer) {
      toast.error("Only customers can save favorites");
      return;
    }
    toggleFavorite.mutate({ equipmentId: item.id, isFavorite });
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-7 pt-10 pb-[90px]">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/equipment" className="transition-colors hover:text-foreground">
          All equipment
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/equipment?category=${encodeURIComponent(item.category)}`}
          className="transition-colors hover:text-foreground"
        >
          {shortCategory(item.category)}
        </Link>
        <span aria-hidden="true">/</span>
        <b className="text-foreground">{titleMain}</b>
      </nav>

      <div className="mt-5 grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <div className="rounded-[26px] border border-border bg-card p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 1080px) 100vw, 55vw"
                className="object-cover"
                style={{ objectPosition: PHOTO_POSITIONS[file] ?? "50% 50%" }}
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{item.category}</Badge>
            {available ? (
              <Badge variant="success">● {item.quantity} of {item.quantity} available</Badge>
            ) : (
              <Badge variant="danger">Unavailable</Badge>
            )}
            <Badge variant="neutral">{item.rentalType[0].toUpperCase() + item.rentalType.slice(1)} rental</Badge>
          </div>
          <h1 className="m-0 font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.04em] sm:text-[44px]">
            {titleMain}
            {titleRest.length > 0 && (
              <>
                {" "}— <span className="highlight">{titleRest.join(" — ")}</span>
              </>
            )}
          </h1>
          <span className="flex items-center gap-1.5 text-[15px] text-muted-foreground">
            <MapPin className="size-4 text-[#C2410C]" aria-hidden="true" />
            {item.location}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-2.5 rounded-[20px] border border-border bg-card px-5 py-[18px]">
            <span className="font-display text-4xl font-extrabold tracking-[-0.03em]">{formatBDT(item.price)}</span>
            <span className="text-muted-foreground">per {unit}</span>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {specs.map((s) => (
              <div key={s.k} className="rounded-2xl border border-border bg-card px-3.5 py-3">
                <dt className="text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">{s.k}</dt>
                <dd className="m-0 mt-0.5 text-[15px] font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
          {isCustomer || !role ? (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setBookingOpen(true)}
                disabled={!available}
                className="min-h-[52px] flex-[1_1_200px] px-[15px] text-base"
              >
                {available ? "Book now" : "Unavailable"}
              </Button>
              <Button variant="outline" onClick={handleFavorite} aria-pressed={isFavorite} className="min-h-[52px] px-5">
                <Heart className={cn("size-[18px] text-[#C2410C]", isFavorite && "fill-[#C2410C]")} aria-hidden="true" />
                {isFavorite ? "Saved to favorites" : "Add to favorites"}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-warning bg-warning-bg px-5 py-4 text-sm leading-6 text-warning" role="note">
              <b>Only customers can book equipment.</b> You are signed in as {role === "admin" ? "an admin" : "an owner"} —
              manage listings from your dashboard instead.
            </div>
          )}
          <OwnerCard owner={item.owner} />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] border border-border bg-card p-6">
          <h2 className="m-0 text-xl font-bold">Description</h2>
          <p className="m-0 mt-2 leading-7 text-muted-foreground">{item.description}</p>
        </div>
        <div className="rounded-[24px] border border-border bg-card p-6">
          <h2 className="m-0 text-xl font-bold">Rental terms &amp; conditions</h2>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-[18px] text-muted-foreground">
            {(Array.isArray(item.terms) ? item.terms : [item.terms]).map((term) => (
              <li key={term} className="leading-7">{term}</li>
            ))}
          </ul>
        </div>
      </div>

      {isCustomer && (
        <BookingModal item={item} open={bookingOpen} onOpenChange={setBookingOpen} />
      )}
    </div>
  );
}
