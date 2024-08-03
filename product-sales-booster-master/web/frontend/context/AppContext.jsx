import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

const initialConfig = {
  updatedProductMargins: [],
};

export const AppContext = createContext(initialConfig);

export function AppContextProvider({ children }) {
  const [context, setContext] = useState(initialConfig);

  console.log("context", context)


  return (
    <AppContext.Provider
      value={{
        context,
        setContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(`useConfig must be used within a ConfigProvider`);
  }
  return context;
};
