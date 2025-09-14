

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scan, Users, User, Settings, QrCode } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User as UserEntity } from "@/api/entities";

const navigationItems = [
  {
    title: "Scanner",
    url: createPageUrl("Scanner"),
    icon: Scan,
    roles: ["visitor"]
  },
  {
    title: "My Collection",
    url: createPageUrl("Collection"),
    icon: Users,
    roles: ["visitor"]
  },
  {
    title: "My Stand",
    url: createPageUrl("MyStand"),
    icon: QrCode,
    roles: ["exhibitor"]
  },
  {
    title: "Email Whitelist",
    url: createPageUrl("AdminWhitelist"),
    icon: Settings,
    roles: ["admin"]
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
    roles: ["visitor", "exhibitor", "admin"]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    );
  }

  const filteredNavItems = navigationItems.filter(item => {
    if (item.roles.includes("admin")) {
      // Show admin items only to specific admin emails
      const adminEmails = ["admin@yourcompany.com"]; // Add your admin email here
      return adminEmails.includes(user.email);
    }
    return item.roles.includes(user.role);
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <Sidebar className="border-r border-white/20 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">ExpoConnect</h2>
                <p className="text-xs text-indigo-600 font-medium">
                  {user.role === 'exhibitor' ? 'Exhibitor' : 'Visitor'} Portal
                </p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-indigo-50 text-indigo-700 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.company_name || user.email}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-indigo-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">ExpoConnect</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

