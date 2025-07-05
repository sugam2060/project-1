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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Manage Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base capitalize">
                    Add New Location
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter city name" 
                      {...field} 
                      disabled={actionLoading}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formError && (
              <div className="py-1 mt-2 rounded-md bg-red-500/90 text-black font-semibold text-center px-2 space-y-1">
                {formError}
              </div>
            )}
            <Button
              disabled={actionLoading}
              type="submit"
              className="w-full cursor-pointer my-2 relative"
            >
              Add Location
              {actionLoading && (
                <span className="absolute right-8 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full inline-block"></span>
              )}
            </Button>
          </form>
        </Form>
        <hr className="border-black my-4" />

        {/* Existing Locations Display */}
        <div className="h-[210px]">
          <div className="font-semibold mb-2">Existing Locations:</div>
          <ScrollArea className="h-[180px]">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-400 rounded-full inline-block"></span>
                Loading...
              </div>
            ) : locations.length === 0 ? (
              <div className="text-gray-500">No locations found.</div>
            ) : (
              locations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between p-2">
                  <span className="font-medium">{loc.city}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() => handleDelete(loc.id)}
                  >
                    Remove
                    {actionLoading && (
                      <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full inline-block ml-2"></span>
                    )}
                  </Button>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
