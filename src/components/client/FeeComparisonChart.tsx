import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

export function FeeComparisonChart() {
  const data = [
    { name: 'Upwork', fee: 100 },
    { name: 'Fiverr', fee: 100 },
    { name: 'WorQu', fee: 0.001 },
  ]

  return (
    <div style={{ height: 240, width: '100%', marginTop: 32, marginBottom: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
          <XAxis
            dataKey="name"
            stroke="var(--text-muted)"
            style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--text-muted)"
            style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }}
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)'
            }}
            itemStyle={{ color: 'var(--text-primary)', fontSize: 13 }}
            formatter={(value: number) => [`$${value}`, 'Fee on $500 job']}
          />
          <Bar dataKey="fee" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'WorQu' ? 'var(--quai-green)' : 'var(--border-strong)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
