import Header from "../Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSideBar";

const Layout = ({ children }) => {
  return (
    <div className="min-width-screen flex ">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
