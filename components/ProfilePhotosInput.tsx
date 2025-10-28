import { X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

interface ProfilePhotosInputProps {
  value: (File | undefined)[];
  onChange: (files: (File | undefined)[]) => void;
}

export default function ProfilePhotosInput({ value, onChange }: ProfilePhotosInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleFileChange(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const files = [...value];
      // Find the first empty slot
      const emptyIndex = files.findIndex((f) => f === undefined);
      // If there's an empty slot, use it; otherwise, use the clicked index
      const targetIndex = emptyIndex !== -1 ? emptyIndex : index;
      files[targetIndex] = file;
      onChange(files);
    };
  }

  function handlePhotoRemove(index: number) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = [...value];
      files.splice(index, 1); // remove the image at index
      files.push(undefined); // maintain array length
      onChange(files);

      // Reset all the input value so the same file can be selected again
      inputRefs.current.forEach((input) => {
        if (input) {
          input.value = "";
        }
      });
    };
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {value.map((image, index) => (
        <div key={index} className="group relative">
          {/* Hidden file input */}
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="file"
            accept="image/*"
            onChange={handleFileChange(index)}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          {/* Clickable photo box */}
          <div className="border-muted-foreground/25 bg-muted/20 group-hover:bg-muted/60 flex h-40 items-center justify-center rounded-lg border-2 border-dashed transition-colors">
            {image ? (
              <Image
                src={URL.createObjectURL(image)}
                alt={`Profile photo ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-muted-foreground mb-1 text-2xl">+</div>
                <div className="text-muted-foreground text-xs">Photo {index + 1}</div>
              </div>
            )}
          </div>
          {image && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handlePhotoRemove(index)}
              className="absolute -top-2 -right-2 z-20 size-6 rounded-full"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
