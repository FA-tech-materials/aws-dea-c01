import type { Page } from '../types';

interface HeaderProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: Array<{ key: Page; label: string }> = [
  { key: 'home', label: 'ホーム' },
  { key: 'study', label: '学習' },
  { key: 'stats', label: '統計' },
];

export function Header({ page, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/90 border-b border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <button
          className="flex items-center gap-2 font-black text-base"
          onClick={() => onNavigate('home')}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-aws to-aws-d text-paper flex items-center justify-center font-mono text-xs font-black">
            DEA
          </span>
          <span className="hidden sm:inline text-white">DEA-C01 Master</span>
        </button>
        <nav className="flex gap-1 ml-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                page === item.key
                  ? 'bg-aws text-paper'
                  : 'text-ink-3 hover:text-white hover:bg-paper-3'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
