"use client";
import React, { useEffect, useState } from "react";
import AddressDialog from "@/components/RootOnly/AddressDialog";
import { fetchAddresses, deleteAddress } from "@/actions/usersActions/addressActions";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash } from "lucide-react";

interface AddressSectionProps {
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
}

// Define Address type for better type safety
// type Address = { id: string; addressLine: string; location: { city: string }; postalCode?: string; phone?: string };

export default function AddressSection({ selectedAddressId, setSelectedAddressId }: AddressSectionProps) {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const { data: addresses = [], refetch: refetchAddresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      const addressesAfter = await fetchAddresses();
      if (!addressesAfter.length) {
        setSelectedAddressId('');
      } else if (!addressesAfter.some((a: { id: string }) => a.id === selectedAddressId)) {
        setSelectedAddressId(addressesAfter[0].id);
      }
      refetchAddresses();
    },
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  const handleDelete = async (addressId: string) => {
    console.log('clicked',addressId)
    deleteMutation.mutate(addressId);
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Shipping Address</span>
        <Button size="sm" variant="outline" onClick={() => setAddressDialogOpen(true)}>
          {addresses.length ? "Add New" : "Add Address"}
        </Button>
      </div>
      {addressesLoading ? (
        <div className="text-gray-500 text-sm">Loading addresses...</div>
      ) : addresses.length ? (
        <div>
          <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Select address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr) => (
                <SelectItem key={addr.id} value={addr.id}>
                  {addr.addressLine}, {addr.location.city}
                  {addr.postalCode && `, ${addr.postalCode}`}
                  {addr.phone && `, ${addr.phone}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAddressId && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="mt-2"
              onClick={() => handleDelete(selectedAddressId)}
            >
              <Trash className="w-4 h-4 mr-1" />
              Delete Selected Address
            </Button>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No address found. <Button size="sm" variant="link" onClick={() => setAddressDialogOpen(true)}>Add Address</Button></div>
      )}
      <AddressDialog open={addressDialogOpen} onOpenChange={open => {
        setAddressDialogOpen(open);
        if (!open) refetchAddresses();
      }} onSuccess={refetchAddresses} />
    </div>
  );
} 