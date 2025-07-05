"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Star,
  StarOff,
  Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  getUserProfile 
} from "@/actions/profiles";
import { fetchLocations } from "@/actions/ManagesMisc/AddorRemoveLocation";

interface Location {
  id: string;
  city: string;
}

interface Address {
  id: string;
  addressLine: string;
  postalCode?: string | null;
  phone?: string | null;
  locationId: string;
  location?: Location;
  isDefault: boolean;
  createdAt: Date;
}

interface AddressFormData {
  addressLine: string;
  postalCode: string;
  phone: string;
  locationId: string;
  isDefault: boolean;
}

export default function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    addressLine: '',
    postalCode: '',
    phone: '',
    locationId: '',
    isDefault: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchLocationsData();
  }, []);

  const fetchAddresses = async () => {
    try {
      const result = await getUserProfile();
      if (result.error) {
        toast.error(result.error);
      } else if (result.user) {
        setAddresses(result.user.addresses || []);
      }
    } catch  {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsData = async () => {
    try {
      const locationsData = await fetchLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (editingAddress) {
        result = await updateAddress(editingAddress.id, formData);
      } else {
        result = await addAddress(formData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Address saved successfully");
        setIsDialogOpen(false);
        resetForm();
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const result = await deleteAddress(addressId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const result = await setDefaultAddress(addressId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch{
      toast.error("Failed to set default address");
    }
  };

  const resetForm = () => {
    setFormData({
      addressLine: '',
      postalCode: '',
      phone: '',
      locationId: '',
      isDefault: false
    });
    setEditingAddress(null);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      addressLine: address.addressLine,
      postalCode: address.postalCode || '',
      phone: address.phone || '',
      locationId: address.locationId,
      isDefault: address.isDefault
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, isDefault: addresses.length === 0 }));
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Addresses</h3>
          <p className="text-sm text-gray-600">Manage your delivery addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locationId">City *</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressLine">Address Line *</Label>
                <Input
                  id="addressLine"
                  value={formData.addressLine}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressLine: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="10-digit number"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    editingAddress ? "Update" : "Add"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No addresses found</p>
          <p className="text-sm text-gray-500">Add your first address to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{address.addressLine}</p>
                    <p className="text-gray-600">
                      {address.location?.city}
                      {address.postalCode && `, ${address.postalCode}`}
                    </p>
                    {address.phone && (
                      <p className="text-gray-600">Phone: {address.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        title="Set as default"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(address)}
                      title="Edit address"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      title="Delete address"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
