import React from 'react';
import type { TabId } from '../types';

interface Tab { id: TabId; label: string; shortLabel: string; }

const TABS: Tab[] = [
  { id: 'scores',     label: 'Live Scores',   shortLabel: 'Scores'    },
  { id: 'scorers',    label: 'Goal Leaders',   shortLabel: 'Goals'     },
  { id: 'assists',    label: 'Assists',        shortLabel: 'Assists'   },
  { id: 'standings',  label: 'Standings',      shortLabel: 'Table'     },
  { id: 'schedule',   label: 'Schedule',       shortLabel: 'Schedule'  },
  { id: 'discipline', label: 'Discipline',     shortLabel: 'Cards'     },
];

interface NavTabsProps { activeTab: TabId; onChange: (tab: TabId) => void; }

export const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onChange }) => (
  <nav className="sticky top-0 z-20 bg-fifa-blue border-b border-fifa-gold-muted/20" aria-label="Main navigation">
    <div className="max-w-5xl mx-auto">
      <div className="flex overflow-x-auto" role="tablist" aria-label="Content sections">
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`relative flex-shrink-0 flex items-center px-4 py-3 text-xs sm:text-sm font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fifa-gold whitespace-nowrap
                ${isActive ? 'tab-active text-fifa-gold-bright' : 'text-fifa-silver/50 hover:text-fifa-silver hover:bg-fifa-blue-mid/50'}`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  </nav>
);
