"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addressSchema } from "@/schemas/addressSchema";
import { fetchLocations } from "@/actions/ManagesMisc/AddorRemoveLocation";
import { addAddress } from "@/actions/usersActions/addressActions";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddressDialog({ open, onOpenChange, onSuccess }: AddressDialogProps) {
  const [locations, setLocations] = useState<{ id: string; city: string }[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      locationId: "",
      addressLine: "",
      postalCode: "",
      phone: '',
    },
  });

  useEffect(() => {
    if (open) {
      setLocationsLoading(true);
      Promise.resolve(fetchLocations())
        .then((res) => {
          setLocations(Array.isArray(res) ? res : []);
        })
        .finally(() => setLocationsLoading(false));
    }
  }, [open]);

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    setFormError(null);
    setLoading(true);
    const res = await addAddress(values);
    setLoading(false);
    if (res?.error) {
      setFormError(typeof res.error === "string" ? res.error : "Failed to add address");
    } else {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>Enter your address details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-4 min-h-0">
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={locationsLoading || !locations.length}>
                        <SelectTrigger>
                          <SelectValue placeholder={locationsLoading ? "Loading cities..." : (!locations.length ? "No cities found" : "Select a city")}/>
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>{loc.city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    {!locationsLoading && !locations.length && (
                      <div className="text-xs text-red-500 mt-1">No cities found. Please add a location first.</div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        onChange={e => {
                          // Only allow digits
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
            </div>
            <DialogFooter className="mt-2  gap-2">
              <div className="flex flex-col gap-2 w-full">
                <Button type="submit" disabled={loading} className="w-full order-2">
                  {loading ? "Adding..." : "Add Address"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full order-3">Cancel</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 