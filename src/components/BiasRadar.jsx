// components/BiasRadar.jsx
'use client';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const DIMENSIONS = [
  { key: 'emotional_intensity', label: 'Emotional' },
  { key: 'attribution_bias', label: 'Attribution' },
  { key: 'humanitarian_framing', label: 'Humanitarian' },
  { key: 'national_framing', label: 'Nationalism' },
  { key: 'factual_density', label: 'Factual' },
];

export default function BiasRadar({ sources }) {
  if (!sources?.length) return null;

  const chartData = DIMENSIONS.map(dim => {
    const point = { metric: dim.label };
    sources.forEach(s => {
      point[s.name] = s.dimensions?.[dim.key] || 0;
    });
    return point;
  });

  return (
    <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
      <h2 className="text-white font-semibold mb-1">📊 Framing Dimensions</h2>
      <p className="text-gray-500 text-xs mb-4">
        Higher = stronger presence of that framing type
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#1f2937" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          {sources.map(s => (
            <Radar
              key={s.id}
              name={s.name}
              dataKey={s.name}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}