import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  change,
  isPositive = true,
  comparisonText = 'so với kỳ trước',
  icon: Icon,
  iconColor = '#4f46e5',
  badgeText
}) {
  return (
    <div className="tail-stat-card">
      <div className="stat-card-icon-box" style={{ color: iconColor }}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="stat-card-text">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="stat-card-label">{title}</span>
          {badgeText && <span className="tail-badge-pill">{badgeText}</span>}
        </div>
        <div className="stat-card-val-row" style={{ marginTop: 4 }}>
          <h3 className="stat-card-number">{value}</h3>
          {change !== undefined && (
            <span className={`trend-badge ${isPositive ? 'trend-up' : 'trend-down'}`}>
              {isPositive ? <TrendingUp size={12} style={{ display: 'inline', marginRight: 2 }} /> : <TrendingDown size={12} style={{ display: 'inline', marginRight: 2 }} />}
              {change}
            </span>
          )}
        </div>
        <div className="stat-comparison-subtext" style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          {comparisonText}
        </div>
      </div>
    </div>
  );
}
