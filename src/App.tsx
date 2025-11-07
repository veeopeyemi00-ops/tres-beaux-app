import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Tres Beaux Admin</h1>
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link to="/library" className="text-blue-600 hover:underline">
            Wellness Library
          </Link>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
    </div>
  );
}
