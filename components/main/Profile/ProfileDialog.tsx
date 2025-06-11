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
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { User } from "lucide-react";



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
        <div className="flex justify-center items-center">
          <Tabs defaultValue="account">
            <TabsList className="gap-2 w-full">
              <TabsTrigger value="account" className="w-full">Account</TabsTrigger>
              <TabsTrigger value="addresses" className="w-full">Addresses</TabsTrigger>
              {/* <TabsTrigger value="password" className="w-full">Password</TabsTrigger> */}
            </TabsList>
            <TabsContent value="account" className="min-w-[50vw]">
                <Card className="w-full">
                  <CardContent className="space-y-2">
                        <div>
                            
                        </div>
                  </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
