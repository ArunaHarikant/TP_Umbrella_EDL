import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import NotFound from "@/pages/not-found";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Makes routing work when deployed under a subpath on GitHub Pages, e.g. /<repo-name>/
  const base =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <TooltipProvider>
          <Toaster />
          <Routes />
        </TooltipProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
