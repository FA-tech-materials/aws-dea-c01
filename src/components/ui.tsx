import type { ReactNode } from 'react';

export function ProgressBar({ percent, color = '#ff9900', height = 6 }: { percent: number; color?: string; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden bg-paper-3" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%`, background: color }}
      />
    </div>
  );
}

export function StatCard({ value, label, color }: { value: ReactNode; label: string; color?: string }) {
  return (
    <div className="stat-card">
      <div className="text-3xl font-black font-mono leading-none" style={{ color: color ?? '#ff9900' }}>
        {value}
      </div>
      <div className="text-[0.65rem] text-ink-3 mt-2 tracking-wider uppercase">{label}</div>
    </div>
  );
}

export function DomainChip({ name, color, icon }: { name: string; color: string; icon?: string }) {
  return (
    <span className="chip" style={{ background: `${color}1a`, color }}>
      {icon && <span>{icon}</span>}
      {name}
    </span>
  );
}

export function ServiceTag({ service }: { service?: string }) {
  if (!service) return null;
  return (
    <span className="chip bg-paper-3 text-ink-3 font-mono">
      {service}
    </span>
  );
}
