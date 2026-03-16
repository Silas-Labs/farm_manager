import Header from "../Header";

const Layout = ({ children }) => {
  return (
    <div className="min-width-screen flex ">
      
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;