'use client'

import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { X } from 'lucide-react'

interface ServerImage { id: string; imageUrl: string }
type Preview =
  | { id: string; src: string; isLocal: false }
  | { id: string; src: string; isLocal: true; file: File }

const MAX = 5

const ImageArray = () => {
  const { watch, setValue } = useFormContext()

  const local = watch('image') as File[]
  const remote = watch('imageUrls') as ServerImage[]

  const remotePrev: Preview[] = useMemo(
    () => remote.map(i => ({ id: i.id, src: i.imageUrl, isLocal: false })),
    [remote]
  )
  const localPrev: Preview[] = useMemo(
    () =>
      local.map(f => ({
        id: `local-${f.name}-${f.lastModified}`,
        src: URL.createObjectURL(f),
        file: f,
        isLocal: true,
      })),
    [local]
  )

  /* revoke blob URLs */
  useEffect(() => () => localPrev.forEach(p => URL.revokeObjectURL(p.src)), [localPrev])

  const total = remotePrev.length + localPrev.length
  const atMax = total >= MAX
  const previews = [...remotePrev, ...localPrev]

  const pickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  if (!e.target.files) return;

  const incoming = Array.from(e.target.files).slice(0, MAX - total);

  if (incoming.length) {
    // Place newly selected images before existing ones, so first upload is always index 0
    setValue("image", [...incoming, ...local], { shouldDirty: true });
  }

  e.target.value = ""; // Reset input
};


  const removeRemote = (id: string) =>
    setValue('imageUrls', remote.filter(i => i.id !== id), { shouldDirty: true })

  const removeLocal = (file: File) =>
    setValue(
      'image',
      local.filter(
        f => !(f.name === file.name && f.lastModified === file.lastModified)
      ),
      { shouldDirty: true }
    )

  return (
    <div className="pt-2">
      <h2 className="mb-4 text-center text-xl font-semibold md:text-2xl">
        Images
      </h2>

      {/* picker */}
      <label
        className={`mb-6 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm
          ${atMax ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}
      >
        {atMax ? 'Max 5 images reached' : 'Click or drop images to upload'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={pickFiles}
          disabled={atMax}
          className="hidden"
        />
      </label>

      {/* grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {previews.map(p => (
          <div
            key={p.id}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-md shadow"
          >
            <button
              type="button"
              aria-label="Remove"
              onClick={() => (p.isLocal ? removeLocal(p.file) : removeRemote(p.id))}
              className="absolute right-1 top-1 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>

            <Image
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
              unoptimized={p.isLocal}
              src={p.src}
              alt={p.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageArray
