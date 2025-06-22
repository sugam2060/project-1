'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { CardContent, CardFooter } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ScrollArea } from '../ui/scroll-area';

import { InteriorSchema } from '@/schemas/InteriorSchema';
import { deleteImages, getRecentInteriorImages, uploadRecentInteriorImage } from '@/actions/ManagesMisc/InteriorPageMgmt';

export type InteriorFormValues = z.infer<typeof InteriorSchema>;


const RecentInteriorProjectsMgmt = () => {
  const [isPending, startTransition] = useTransition();
  const [removingImage, setRemovingImage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: images = [] } = useQuery({
    queryKey: ['recent-interior-images'],
    queryFn: getRecentInteriorImages,
  });

  const form = useForm<InteriorFormValues>({
    resolver: zodResolver(InteriorSchema),
    defaultValues: {
      images: [],
    },
  });
  

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: File[]) => void
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onChange(files);
  };

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      uploadRecentInteriorImage(data.images).then((res) => {
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success || 'Uploaded successfully');
          form.reset();
          queryClient.invalidateQueries({ queryKey: ['recent-interior-images'] });
        }
      });
    });
  });

  const handleRemoveImage = async (imageUrl: string) => {
    setRemovingImage(imageUrl);
    try {
      await deleteImages({imageUrl});
      toast.success('Image removed');
      queryClient.invalidateQueries({ queryKey: ['recent-interior-images'] });
    } catch {
      toast.error('Failed to remove image');
    } finally {
      setRemovingImage(null);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base capitalize">
                    Upload Images (Max 3)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full relative">
              {isPending ? (
                <>
                  Uploading...
                  <Loader2 className="ml-2 animate-spin" />
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      <hr className="border" />

      {/* Uploaded Image List */}
      <ScrollArea className="max-h-[120px] min-h-[120px] overflow-auto px-4 rounded shadow-inner">
        {images.length === 0 ? (
          <p className="text-muted-foreground text-sm">No images uploaded yet.</p>
        ) : (
          images.map((image: string, idx: number) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <Image
                src={image}
                alt={`uploaded-${idx}`}
                width={100}
                height={100}
                className="object-cover rounded-md max-h-[50px]"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveImage(image)}
                disabled={removingImage === image}
              >
                {removingImage === image ? (
                  <>
                    Removing <Loader2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  'Remove'
                )}
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default RecentInteriorProjectsMgmt;
