"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// One shared user avatar: photo when the account has an image URL, brand
// initials otherwise. Plain <img> (via AvatarImage) so any http(s) photo
// works (imgbb, Google, pasted links); referrerPolicy lets Google photos
// load. The fallback shows automatically with no image or on load error.
function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserAvatar({ user, className, fallbackClassName, imageClassName }) {
  const name = user?.name ?? "?";
  return (
    <Avatar className={className}>
      {user?.image ? (
        <AvatarImage
          src={user.image}
          alt={`${name} profile photo`}
          referrerPolicy="no-referrer"
          className={imageClassName}
        />
      ) : null}
      <AvatarFallback className={fallbackClassName}>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
