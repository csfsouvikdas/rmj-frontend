"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon, Sparkles, TrendingUp, Zap, Hexagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Sheet, SheetContent } from "./sheet";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "18rem";
const SIDEBAR_WIDTH_MOBILE = "20rem";
const SIDEBAR_WIDTH_ICON = "5.5rem";

// --- Context ---
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(openState);
      else _setOpen(openState);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full bg-slate-50/50", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// --- Main Sidebar Component ---
function Sidebar({ side = "left", variant = "sidebar", collapsible = "icon", className, children, ...props }: React.ComponentProps<"div">) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          className="bg-white text-sidebar-foreground w-(--sidebar-width) p-0 border-none shadow-2xl"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="group peer text-sidebar-foreground hidden md:block" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""}>
      <div className={cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-500 ease-in-out", "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")} />
      <div className={cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-500 ease-in-out md:flex shadow-2xl shadow-slate-200/50", side === "left" ? "left-0" : "right-0", "group-data-[collapsible=icon]:w-(--sidebar-width-icon) border-r border-slate-200/60 bg-white/90 backdrop-blur-xl", className)} {...props}>
        <div className="flex h-full w-full flex-col">{children}</div>
      </div>
    </div>
  );
}

// --- Brand Header ---
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();

  return (
    <div className={cn("flex flex-col items-center pt-10 pb-6 px-4", className)} {...props}>
      <motion.div layout className="relative flex flex-col items-center">
        {/* Animated Premium Logo Mark */}
        <div className="relative h-20 w-20 group-data-[collapsible=icon]:h-14 group-data-[collapsible=icon]:w-14 transition-all duration-500">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-amber-500/10 rounded-[35%] rotate-12 scale-110"
          />
          <div className="relative h-full w-full bg-slate-950 rounded-[32%] flex items-center justify-center border-2 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
             <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-black text-3xl group-data-[collapsible=icon]:text-xl tracking-tighter z-10"
            >
              RM
            </motion.span>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <Hexagon className="absolute h-full w-full text-amber-500/5 rotate-12 scale-150" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <AnimatePresence>
          {state === "expanded" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center whitespace-nowrap"
            >
              <h2 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                Radha Madhav
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-[1.5px] w-4 bg-amber-500/40" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Casting</span>
                <span className="h-[1.5px] w-4 bg-amber-500/40" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// --- Live Rates Footer ---
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();

  return (
    <div className={cn("p-4 mt-auto", className)} {...props}>
      <AnimatePresence mode="wait">
        {state === "expanded" ? (
          <motion.div
            key="expanded-footer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-slate-950 p-5 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 opacity-10">
                <TrendingUp className="text-amber-500 h-24 w-24" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black">24K Live Rate</span>
            </div>

            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-white tracking-tighter">₹7,240</h4>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Updated: Just Now</p>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center text-amber-500 border border-white/5 shadow-xl hover:scale-105 transition-transform cursor-pointer">
                        <TrendingUp size={24} />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-950 text-white font-bold border-none shadow-2xl">
                    Gold Rate: ₹7,240
                </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Menu Button Variants ---
const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-4 rounded-2xl p-3 text-sm font-bold transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-14! group-data-[collapsible=icon]:p-0!",
  {
    variants: {
      variant: {
        default: "text-slate-500 hover:text-amber-700 hover:bg-amber-50/80 hover:translate-x-1",
        active: "bg-slate-900 text-white shadow-2xl shadow-slate-400/20",
      },
      size: {
        default: "h-12",
        sm: "h-9 text-xs",
        lg: "h-14 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }: React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean; tooltip?: string; } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { state } = useSidebar();

  const button = (
    <Comp
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant: isActive ? "active" : variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip || state !== "collapsed") return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" className="bg-slate-950 text-white border-none rounded-xl px-4 py-2 font-bold shadow-2xl">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// --- Structural Helpers ---
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-auto py-8 px-5", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative flex w-full flex-col gap-1.5", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex w-full flex-col gap-2.5", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("group/menu-item relative", className)} {...props} />;
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-10 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all active:scale-95", className)}
      onClick={(e) => { onClick?.(e); toggleSidebar(); }}
      {...props}
    >
      <PanelLeftIcon className="size-6" />
    </Button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};