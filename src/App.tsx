import { useState } from "react";
import { getState, setNav, type PageId } from "./lib/store";
import { Brief } from "./pages/Brief";
import { Train } from "./pages/Train";
import { Fuel } from "./pages/Fuel";
import { Body } from "./pages/Body";
import { Race } from "./pages/Race";

const NAV: { id: PageId; label: string; icon: string }[] = [
  { id: "brief", label: "Home", icon: "home" },
  { id: "train", label: "Workout", icon: "lift" },
  { id: "fuel", label: "Fuel", icon: "flame" },
  { id: "body", label: "Body", icon: "body" },
  { id: "race", label: "Race", icon: "flag" },
];

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#5B8CFF" : "#7C89A8";
  if (name === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
  if (name === "lift") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M6 8v8M18 8v8M4 10h4M16 10h4M8 12h8M6 8h0M18 8h0" />
        <rect x="2" y="9" width="3" height="6" rx="1" />
        <rect x="19" y="9" width="3" height="6" rx="1" />
      </svg>
    );
  }
  if (name === "flame") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M12 3s5 5 5 9a5 5 0 1 1-10 0c0-2 2-4 3-6 1 2 2 2 2 3" />
      </svg>
    );
  }
  if (name === "body") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
        <circle cx="12" cy="5" r="2.2" />
        <path d="M8 21v-4l-2-6 6-3 6 3-2 6v4" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8">
      <path d="M5 20V6l7-3 7 3v14" />
      <path d="M5 11h14" />
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState<PageId>(getState().lastPage);

  function go(next: PageId) {
    setNav(next);
    setPage(next);
  }

  return (
    <div className="phone">
      <div className="app">
        {page === "brief" && <Brief go={go} />}
        {page === "train" && <Train />}
        {page === "fuel" && <Fuel />}
        {page === "body" && <Body />}
        {page === "race" && <Race />}
        <nav className="nav">
          {NAV.map((item) => (
            <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => go(item.id)}>
              <Icon name={item.icon} active={page === item.id} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
