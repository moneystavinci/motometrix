"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDate, formatNumber } from "@/lib/utils";

interface DailyVisitor {
  date: string;
  visitors: number;
}

interface VisitorChartProps {
  data: DailyVisitor[] | null;
  loading: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "#0f1f45",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="text-navy-300 text-xs mb-1">{label ? formatDate(label) : ""}</p>
      <p className="text-white font-semibold text-sm">
        {formatNumber(payload[0].value)}{" "}
        <span className="text-navy-300 font-normal">visitors</span>
      </p>
    </div>
  );
}

export default function VisitorChart({ data, loading }: VisitorChartProps) {
  return (
    <div
      className="glass-card rounded-2xl p-6"
      style={{ minHeight: "280px" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-navy-300 text-xs font-medium tracking-wide uppercase mb-1">
            Visitor Trend
          </p>
          <h2
            className="text-white font-semibold"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
          >
            Daily Visitors — Last 30 Days
          </h2>
        </div>
        <div
          className="flex items-center gap-2 text-xs text-navy-300 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-2 h-2 rounded-full bg-gold-500" />
          Unique visitors
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="space-y-3 pt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-4" style={{ width: `${60 + i * 8}%` }} />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data ?? []} margin={{ top: 5, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e6b820" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e6b820" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatDate(v)}
              tick={{ fill: "#8892a4", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={6}
            />
            <YAxis
              tickFormatter={(v) => formatNumber(v)}
              tick={{ fill: "#8892a4", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#e6b820"
              strokeWidth={2}
              fill="url(#visitorGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#e6b820", stroke: "#0a1530", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
