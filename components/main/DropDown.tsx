// components/DropDown.tsx
"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatorIcon from "./AvatarIcon";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ProfileDialog from "@/components/main/Profile/ProfileDialog";

const DropDown = () => {
  const { data: session } = useSession();

  // Profile dialog state
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-7 h-7 rounded-full p-0 m-0 border-none bg-transparent outline-none focus:outline-none active:outline-none"
            type="button"
          >
            <AvatorIcon session={session} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            Welcome {session?.user.name?.split(" ")[0]}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setProfileOpen(true);
              }}
            >
              Edit Profile
            </DropdownMenuItem>

            {session?.user.role === "ADMIN" && (
              <Link href="/admin">
                <DropdownMenuItem className="capitalize">
                  admin dashboard
                </DropdownMenuItem>
              </Link>
            )}

            <Link href="/orders">
              <DropdownMenuItem className="capitalize">
                My Orders
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog lives outside the dropdown */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
};

export default DropDown;
