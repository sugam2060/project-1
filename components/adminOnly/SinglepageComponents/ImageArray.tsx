'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react'; // or any icon you want

interface ServerImage {
  id: string;
  imageUrl: string;
}

type PreviewImage =
  | { id: string; src: string; isLocal: false }
  | { id: string; src: string; isLocal: true; file: File };

const MAX_IMAGES = 5;

const ImageArray = () => {
  const { watch, setValue } = useFormContext();

  // local files (uploaded by user)
  const localFiles = watch('image') as File[];

  // remote images stored as full objects { id, imageUrl }
  const remoteImages = watch('imageUrls') as ServerImage[];

  // Build previews for remote images filtered by form's remote images (to sync with deletes)
  const remotePreviews: PreviewImage[] = useMemo(
    () =>
      remoteImages.map((img) => ({
        id: img.id,
        src: img.imageUrl,
        isLocal: false as const,
      })),
    [remoteImages]
  );

  // Build previews for local uploaded files
  const localPreviews: PreviewImage[] = useMemo(
    () =>
      localFiles.map((file) => ({
        id: `local-${file.name}-${file.lastModified}`,
        src: URL.createObjectURL(file),
        file,
        isLocal: true as const,
      })),
    [localFiles]
  );

  // Revoke object URLs when local previews change to avoid memory leaks
  useEffect(() => {
    return () => {
      localPreviews.forEach((p) => URL.revokeObjectURL(p.src));
    };
  }, [localPreviews]);

  const totalImagesCount = remotePreviews.length + localPreviews.length;
  const atMaxImages = totalImagesCount >= MAX_IMAGES;
  const previews = [...remotePreviews, ...localPreviews];

  // Handle new uploads, limit total images to MAX_IMAGES
  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const incomingFiles = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - totalImagesCount;

    if (remainingSlots <= 0) {
      e.target.value = '';
      return;
    }

    const filesToAdd = incomingFiles.slice(0, remainingSlots);

    setValue('image', [...localFiles, ...filesToAdd], { shouldDirty: true });
    e.target.value = '';
  };

  // Remove a remote image by filtering it out from the form's imageUrls
  const removeRemoteImage = (id: string) => {
    setValue(
      'imageUrls',
      remoteImages.filter((img) => img.id !== id),
      { shouldDirty: true }
    );
  };

  // Remove a local file by filtering it out from the form's image array
  const removeLocalFile = (file: File) => {
    setValue(
      'image',
      localFiles.filter(
        (f) => !(f.name === file.name && f.lastModified === file.lastModified)
      ),
      { shouldDirty: true }
    );
  };

  return (
    <div className="mt-10 px-4">
      <h2 className="mb-4 text-center text-2xl font-semibold">Images</h2>

      {/* File picker label */}
      <label
        className={`mb-6 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-sm
          ${atMaxImages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
      >
        <span className="font-medium">
          {atMaxImages ? 'Maximum of 5 images reached' : 'Click or drop images to upload'}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePick}
          disabled={atMaxImages}
        />
      </label>

      {/* Image previews grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {previews.map((preview) => (
          <div
            key={preview.id}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-md shadow"
          >
            {/* Delete icon */}
            <button
              type="button"
              onClick={() =>
                preview.isLocal
                  ? removeLocalFile(preview.file)
                  : removeRemoteImage(preview.id)
              }
              className="absolute right-1 top-1 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            <Image
              src={preview.src}
              alt={preview.id}
              fill
              className="object-cover"
              unoptimized={preview.isLocal}
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageArray;
