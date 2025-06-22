"use client";
import React, { useTransition, useState } from "react";
import {
  getAllAdmins,
  revokeAdminAccess,
} from "@/actions/usersActions/getAdminByEmail";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

// Define the Admin type
interface Admin {
  id: string;
  name: string;
  email: string;
}

export default function AdminRevocation() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isPending, setTransition] = useTransition();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTransition(() => {
      getAllAdmins().then((res) => {
        setAdmins(res || []);
      });
    });
  }, []);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    setError(null);
    const res = await revokeAdminAccess(id);
    if (res.success) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } else {
      setError(res.error || "Failed to revoke access");
    }
    setRevokingId(null);
  };

  return (
    <div className="w-full border-2  rounded-md shadow-xs max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 mt-6 text-center capitalize">Admin Revocation</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ScrollArea className="h-96">
        {isPending ? (
          <div className="text-center">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="text-center">No admin users found.</div>
        ) : (
          <ul className="space-y-2 mx-2">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="font-medium">{admin.name}</div>
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </div>
                <Button
                  variant="destructive"
                  disabled={revokingId === admin.id}
                  onClick={() => handleRevoke(admin.id)}
                >
                  {revokingId === admin.id ? "Revoking..." : "Revoke Access"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
