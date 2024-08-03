import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { AppContextProvider } from "./context/AppContext";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { Icon } from "@shopify/polaris";
import "./index.css";
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <AppContextProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: "Home",
                    destination: "/",
                  },
                  {
                    label: "Discount Settings",
                    destination: "/marginsettings",
                  },
                  {
                    label: "Setup",
                    destination: "/setup",
                  }
                ]}
              />
              <Routes pages={pages} />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </AppContextProvider>
    </PolarisProvider>
  );
}
