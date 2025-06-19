'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { fetchLocations, AddLocation, DeleteLocation } from '@/actions/ManagesMisc/AddorRemoveLocation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const citySchema = z.object({
  city: z.string().min(1, 'City is required'),
});

type CityForm = z.infer<typeof citySchema>;

type Location = { id: string; city: string };

export default function ManageLocations() {
  const form = useForm<CityForm>({
    resolver: zodResolver(citySchema),
    defaultValues: { city: '' },
  });

  const {
    data: locations = [],
    isLoading,
    refetch,
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const [actionLoading, setActionLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const onSubmit = async (data: CityForm) => {
    setFormError(null);
    setActionLoading(true);
    try {
      await AddLocation(data.city);
      form.reset();
      await refetch();
    } catch (err) {
      // Prisma unique constraint error or custom error from server
      if ((err as Error)?.message?.toLowerCase().includes('unique') || (err as Error)?.message?.toLowerCase().includes('exists')) {
        setFormError('Location already exists.');
      } else {
        setFormError('Could not add location. Please try again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await DeleteLocation(id);
      if (res?.error) {
        setFormError(res.error); // Show the error to the user
      } else {
        setFormError(null);
        await refetch();
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="border-2 rounded-lg p-4 space-y-4" style={{ minHeight: 350, maxHeight: 350, height: 350 }}>
      <h3 className="text-center font-semibold text-xl mb-2">Manage Locations</h3>
      <div className="mb-4 flex flex-col h-[170px]">
        <div className="font-semibold mb-1">Existing Locations:</div>
        <ScrollArea className="w-full h-full max-h-[130px] rounded">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500"><span className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-400 rounded-full inline-block"></span>Loading...</div>
          ) : locations.length === 0 ? (
            <div className="text-gray-500">No locations found.</div>
          ) : (
            <ul className="flex flex-col gap-2 pr-2">
              {locations.map((loc) => (
                <li key={loc.id} className="bg-gray-100 justify-between  px-3 py-1 rounded text-sm flex items-center gap-2">
                  <span>{loc.city}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(loc.id)}
                    disabled={actionLoading}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Add new city" {...field} disabled={actionLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={actionLoading}>
            {actionLoading ? <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full inline-block"></span> : 'Add'}
          </Button>
        </form>
      </Form>
      {formError && (
        <div className="text-red-500 text-sm text-center mt-2">{formError}</div>
      )}
    </div>
  );
}
