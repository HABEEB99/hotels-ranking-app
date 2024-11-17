"use client";

import { store } from "@/redux/store";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

interface IProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const Providers: React.FC<IProviderProps> = ({ children }) => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </Provider>
      </QueryClientProvider>
    </div>
  );
};

export default Providers;
