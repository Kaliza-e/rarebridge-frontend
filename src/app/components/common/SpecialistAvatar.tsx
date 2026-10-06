import { useState } from "react";
import { UserRound } from "lucide-react";

type SpecialistAvatarProps = {
  name: string;
  photoUrl?: string | null;
  className?: string;
};

export default function SpecialistAvatar({ name, photoUrl, className }: SpecialistAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarClass = className || "h-16 w-16";

  if (photoUrl && /^https:\/\//i.test(photoUrl) && !imageFailed) {
    return (
      <img
        src={photoUrl}
        alt={`${name} profile`}
        onError={() => setImageFailed(true)}
        className={`${avatarClass} shrink-0 rounded-full border border-[#E7E2CE] object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#E7E2CE] bg-[#F5F4F0] text-[#3B507D] ${avatarClass}`}
      role="img"
      aria-label={photoUrl ? `No usable profile photo available for ${name}` : `No verified photo available for ${name}`}
    >
      <UserRound className="h-7 w-7" aria-hidden="true" />
    </div>
  );
}
