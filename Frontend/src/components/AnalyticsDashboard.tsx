import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', amount: 12400 },
  { day: 'Tue', amount: 8200 },
  { day: 'Wed', amount: 15600 },
  { day: 'Thu', amount: 9800 },
  { day: 'Fri', amount: 21000 },
  { day: 'Sat', amount: 6400 },
  { day: 'Sun', amount: Math.floor(Math.random() * 20000) + 3000 },
];

const riskData = [
  { name: 'Safe', value: 62, color: 'hsl(145, 72%, 45%)' },
  { name: 'Medium', value: 23, color: 'hsl(38, 92%, 55%)' },
  { name: 'High', value: 11, color: 'hsl(0, 72%, 55%)' },
  { name: 'Blocked', value: 4, color: 'hsl(0, 60%, 25%)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-popover border border-border px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono font-semibold text-foreground">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-popover border border-border px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value}%</p>
    </div>
  );
};

const AnalyticsDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in" style={{ animationDelay: '0.2s' }}>
      {/* Bar Chart */}
      <div className="rounded-3xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Weekly Activity Trend</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 12%, 55%)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 12%, 55%)', fontSize: 11 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(220, 14%, 14%)' }} />
              <Bar dataKey="amount" fill="hsl(170, 80%, 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="rounded-3xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Risk Categories</h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-56 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<PieTooltip />} />
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-mono font-semibold text-foreground ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
