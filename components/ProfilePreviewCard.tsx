"use client";

import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Card } from "@/components/ui/card";

import { calculateAge } from "@/lib/date-utils";
import { Profile } from "@/types";

import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProfilePreviewCardProps {
  currentUser: Profile;
  showBio?: boolean;
  className?: string;
}

export default function ProfilePreviewCard({
  currentUser,
  showBio,
  className,
}: ProfilePreviewCardProps) {
  const age = calculateAge(new Date(currentUser.birthday));

  return (
    <Card className={cn("group relative h-full overflow-hidden py-0", className)}>
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        allowTouchMove={false}
        speed={0}
        className="size-full"
      >
        {currentUser.profilePhotos.map((photo, index) => (
          <SwiperSlide key={index}>
            <Image
              src={photo}
              alt={`${currentUser.name} photo ${index + 1}`}
              fill
              draggable={false}
              objectFit="cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom gradient and details */}
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-black via-black/78 to-transparent p-4 pt-6 pb-12",
          !showBio && "pb-4",
        )}
      >
        <div className="text-white">
          <div className="mb-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{currentUser.name}</h3>
            <span className="text-2xl">{age}</span>
          </div>
          {showBio && (
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                focusable="false"
                role="img"
                className="mr-1 inline size-4 -translate-y-1"
              >
                <title></title>
                <g fill="currentColor">
                  <path d="M7.713 3.826c-.699-.568-1.7-.607-2.388-.027C2.022 6.584 0 10.285 0 14.493c0 4.181 2.75 6.644 5.842 6.644 2.864 0 5.27-2.406 5.27-5.327 0-2.807-2.005-4.697-4.41-4.697-.595 0-1.088-.531-.8-1.051.455-.82 1.109-1.642 1.829-2.36C8.76 6.678 8.918 4.806 7.79 3.89zm12.888 0c-.699-.568-1.7-.607-2.388-.027-3.303 2.785-5.325 6.486-5.325 10.694 0 4.181 2.807 6.644 5.9 6.644 2.806 0 5.212-2.406 5.212-5.327 0-2.807-1.948-4.697-4.41-4.697-.586 0-1.07-.534-.782-1.044.46-.818 1.108-1.639 1.819-2.356 1.023-1.032 1.178-2.908.05-3.824z"></path>
                </g>
              </svg>
              {currentUser.bio}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
