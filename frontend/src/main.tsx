//entry point file for frontend
import React from 'react'
import ReactDOM from 'react-dom/client'
import "./globals.css";
import {BrowserRouter } from "react-router-dom";
import AppRoutes from './AppRoutes.tsx'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
 //auth0provider need access to router to redirect to differnt pages
//adding query provider to app

const queryClient=new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,//by default react -query fetches queries when user clicks away from chrome window and comes back
    }
  }
})
 ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <BrowserRouter>
   <QueryClientProvider client={queryClient}>
    {/* by adding above line entire app can use hooks provided by react query */}
   {/* components that are inside auth can access to login info */}
   {/* toaster */}
   <Auth0ProviderWithNavigate>
    <AppRoutes/>
    <Toaster visibleToasts={1} position="top-right" richColors/>
   </Auth0ProviderWithNavigate>
   </QueryClientProvider>
   </BrowserRouter>
  </React.StrictMode>,
)
  