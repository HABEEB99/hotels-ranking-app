"use client";

import { store } from "@/redux/store";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Provider } from "react-redux";

interface IProviderProps {
  children: React.ReactNode;
}

const Providers: React.FC<IProviderProps> = ({ children }) => {
  return (
    <div>
      <Provider store={store}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </Provider>
    </div>
  );
};

export default Providers;
