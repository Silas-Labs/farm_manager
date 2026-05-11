// Project: Farm Manager | Module: Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  Tractor,
  BicepsFlexed,
  ChartNoAxesCombined,
  User2,
  ChevronUp,
  Leaf,
  Menu,
  X,
  Package,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export const SideBar = () => {
  const { user, logout } = useAuth();
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      color: "text-emerald-600",
    },
    {
      path: "/crops",
      name: "Crop Management",
      icon: Sprout,
      color: "text-green-600",
    },
    {
      path: "/weather",
      name: "Weather",
      icon: CloudSun,
      color: "text-sky-600",
    },
    {
      path: "/equipment",
      name: "Equipment",
      icon: Tractor,
      color: "text-amber-600",
    },
    {
      path: "/labor",
      name: "Labor",
      icon: BicepsFlexed,
      color: "text-orange-600",
    },
    {
      path: "/expenses",
      name: "Expenses",
      icon: DollarSign,
      color: "text-red-600",
    },
    {
      path: "/harvests",
      name: "Harvests",
      icon: Package,
      color: "text-emerald-600",
    },
    {
      path: "/reports",
      name: "Reports",
      icon: ChartNoAxesCombined,
      color: "text-purple-600",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-farm-600 text-white rounded-lg shadow-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <Sidebar
        className={`border-r border-farm-100 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
          isMobile ? "fixed z-40 h-full" : ""
        }`}
      >
        <SidebarTrigger className="absolute -right-3 top-6 z-50 bg-farm-500 text-white hover:bg-farm-600 rounded-full p-1 shadow-md" />

        <SidebarHeader className="border-b border-farm-100 pb-4 mb-4">
          <div className="flex items-center gap-2 px-2">
            <div className="p-2 bg-gradient-to-br from-farm-500 to-farm-600 rounded-xl flex-shrink-0">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {open && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-farm-800 text-base sm:text-lg truncate">
                  Farm Manager
                </span>
                <span className="text-xs text-earth-500 hidden sm:block">
                  Smart Agriculture
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  onClick={() => isMobile && setOpen(false)}
                >
                  <SidebarMenuItem>
                    <div
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                        ${
                          isActive(item.path)
                            ? `bg-gradient-to-r ${item.color.replace("text", "bg")}/10 from-farm-50 to-farm-100 text-farm-700 shadow-sm`
                            : "text-earth-600 hover:bg-earth-50 hover:text-farm-600"
                        }
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? item.color : ""}`}
                      />
                      {open && (
                        <span
                          className={`text-sm font-medium truncate ${isActive(item.path) ? "text-farm-700" : ""}`}
                        >
                          {item.name}
                        </span>
                      )}
                    </div>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-farm-100 pt-4 mt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full hover:bg-farm-50 rounded-xl transition-colors p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-farm-400 to-farm-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User2 className="w-4 h-4 text-white" />
                      </div>
                      {open && (
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium text-farm-700 truncate">
                            {user?.name || "Farm Manager"}
                          </p>
                          <p className="text-xs text-earth-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      )}
                      {open && (
                        <ChevronUp className="ml-auto w-4 h-4 text-earth-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56">
                  <DropdownMenuItem className="cursor-pointer hover:bg-farm-50">
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-farm-50">
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-red-600 hover:bg-red-50"
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

// EOF: Sidebar.jsx
