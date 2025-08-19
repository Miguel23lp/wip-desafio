import { NavLink } from "react-router";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

export interface NavBarItem { 
    icon: React.ReactNode;
    label: string;
    to: string;
    element: React.ReactNode;
}

export default function NavBar({ items }: { items: NavBarItem[] }) {
    return (
        <>
            <NavigationMenu>
                <NavigationMenuList className="flex-col">
                    {items.map((item, i) => (
                        <NavigationMenuItem key={i} className="self-start">
                            <NavigationMenuLink asChild className="flex-row rounded-none items-center">
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