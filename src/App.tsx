import NavBar, { type NavBarItem } from "./NavBar"
import { LayoutDashboard, ListTree, Compass, ChartColumnIncreasing, 
          Truck, Users, Settings } from "lucide-react";
import { Route, Routes } from "react-router";
import CreateArticlesPage from "./pages/CreateArticlesPage";

function App() {

  const primaryNavBarItems: NavBarItem[] = [
    {
      icon: <LayoutDashboard style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Create Articles",
      to: "/CreateArticles",
      element: <CreateArticlesPage/>
    },
    {
      icon: <ListTree style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Backlog",
      to: "/Backlog",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    },
    {
      icon: <Compass style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Roadmap",
      to: "/Roadmap",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    },
    {
      icon: <ChartColumnIncreasing style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Reports",
      to: "/Reports",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    },
    {
      icon: <Truck style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Releases",
      to: "/Releases",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    }

  ];

  const secundaryNavBarItems: NavBarItem[] = [
    {
      icon: <Users style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Teams",
      to: "/Teams",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    },
    {
      icon: <Settings style={{ width: '1.5rem', height: '1.5rem' }} />,
      label: "Project Settings",
      to: "/ProjectSettings",
      element: <h1 className="text-2xl font-bold">Ainda não implementado</h1>
    },
  ];



  return (
    <>
      <div className="flex justify-start left-0 min-h-screen">
        <div className="w-80 justify-start">
          <img
              className="w-30 h-30"
              src="/WIP_Logo.png"
            />
          <NavBar items={primaryNavBarItems} />
          <hr className="m-2 text-gray-700"/>
          <NavBar items={secundaryNavBarItems} />
        </div>
        <div className="border-l border-gray-300 flex-1">
          <Routes>
            {primaryNavBarItems.concat(secundaryNavBarItems).map((item, i) => (
              <Route
                key={i}
                path={item.to}
                element={item.element}
              />
            ))}
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
