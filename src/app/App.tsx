import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes"; // Make sure this path is correct based on App.tsx location

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            // We use <route.component /> because your array stores the component itself
            element={<route.component />}
          />
        ))}
        
        {/* Simple 404 Fallback */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;