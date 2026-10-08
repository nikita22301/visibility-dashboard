import {create} from "zustand";

type State={
  sidebar:boolean;
  dark:boolean;
  toggleSidebar:()=>void;
  closeSidebar:()=>void;
  toggleDark:()=>void;
};

const isDesktop = typeof window !== "undefined" ? window.innerWidth > 720 : true;

export const useStore=create<State>((set)=>({
  sidebar:isDesktop,
  dark:false,
  toggleSidebar:()=>set(s=>({sidebar:!s.sidebar})),
  closeSidebar:()=>set({sidebar:false}),
  toggleDark:()=>set(s=>({dark:!s.dark}))
}));
