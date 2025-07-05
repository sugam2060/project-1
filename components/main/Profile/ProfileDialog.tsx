"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import AddressSection from "./AddressSection";
import PasswordSection from "./PasswordSection";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProfileDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-h-[70vh] h-[90vh] max-h-[95vh] min-w-[70vw] max-w-7xl flex-col overflow-hidden bg-white">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5" />
            Account Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Manage your profile information, addresses, and security settings.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="addresses" className="h-full flex flex-col">
            <div className="px-6 py-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="addresses" className="h-full m-0">
                <AddressSection />
              </TabsContent>
              
              <TabsContent value="password" className="h-full m-0">
                <PasswordSection />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
