import { BowlIcon, HeartIcon, CalendarIcon, BagIcon } from "./Icons";

const TABS = [
  { key: "recipes", label: "Resep", icon: BowlIcon },
  { key: "favorites", label: "Favorit", icon: HeartIcon },
  { key: "planner", label: "Rencana", icon: CalendarIcon },
  { key: "grocery", label: "Belanja", icon: BagIcon },
];

export default function BottomNav({ active, onChange, groceryCount }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            className={`nav-btn${isActive ? " active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            <span className="nav-icon">
              <Icon />
              {tab.key === "grocery" && groceryCount > 0 && (
                <span className="nav-badge">{groceryCount}</span>
              )}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
