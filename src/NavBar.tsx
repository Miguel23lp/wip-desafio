import { NavLink, useLocation } from "react-router";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

export interface NavBarItem { 
    icon: React.ReactNode;
    label: string;
    to: string;
    element: React.ReactNode;
}

export default function NavBar({ items }: { items: NavBarItem[] }) {
    let location = useLocation();

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList className="flex-col">
                    {items.map((item, i) => (
                        <NavigationMenuItem key={i} className="self-start">
                            <NavigationMenuLink active={location.pathname===item.to} asChild className="SidebarNavMenuLink">
                                <NavLink to={item.to}>
                                    {item.icon}
                                    <span className="ml-2 text-lg font-semibold">{item.label}</span>
                                </NavLink>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}