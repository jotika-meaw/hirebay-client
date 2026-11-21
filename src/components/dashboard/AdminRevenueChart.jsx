"use client";

import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function monthLabel(iso) {
  const d = new Date(`${iso}-01T00:00:00Z`);
  return MONTHS[d.getUTCMonth()];
}

// Revenue area (£lakh): theme-aware ink line, dots, yellow→transparent fill.
export default function AdminRevenueChart({ monthly }) {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const ink = dark ? "#FAFAF9" : "#111111";
  const grid = dark ? "#292524" : "#E7E5E4";
  const tickFill = dark ? "#A8A29E" : "#78716C";
  const data = (monthly ?? []).map((m) => ({
    m: monthLabel(m.month),
    v: Math.round((m.revenue / 100000) * 10) / 10,
  }));

  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="admin-rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFC727" stopOpacity={0.45} />
              <stop offset="1" stopColor="#FFC727" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis
            dataKey="m"
            tickLine={false}
            axisLine={false}
            tick={{ fill: tickFill, fontSize: 11, fontFamily: "var(--font-jetbrains)" }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={36}
            tick={{ fill: tickFill, fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              fontSize: 13,
            }}
            formatter={(value) => [`৳${value}L`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={ink}
            strokeWidth={2.5}
            fill="url(#admin-rev)"
            isAnimationActive={!reduce}
            dot={{ r: 3.5, fill: "#FFFFFF", stroke: ink, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
