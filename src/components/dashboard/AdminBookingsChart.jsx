"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function monthLabel(iso) {
  const d = new Date(`${iso}-01T00:00:00Z`);
  return MONTHS[d.getUTCMonth()];
}

// Monthly bookings bars; latest month yellow.
export default function AdminBookingsChart({ monthly }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const track = dark ? "#292524" : "#E7E5E4";
  const tickFill = dark ? "#A8A29E" : "#78716C";
  const data = (monthly ?? []).map((m, i, arr) => ({
    m: monthLabel(m.month),
    v: m.bookings,
    last: i === arr.length - 1,
  }));

  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 4, bottom: 0, left: 4 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={track} />
          <XAxis
            dataKey="m"
            tickLine={false}
            axisLine={false}
            tick={{ fill: tickFill, fontSize: 11, fontFamily: "var(--font-jetbrains)" }}
            dy={8}
          />
          <Tooltip
            cursor={{ fill: track, opacity: 0.4 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              fontSize: 13,
            }}
            formatter={(value) => [`${value} bookings`, ""]}
          />
          <Bar dataKey="v" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="v" position="top" fill={tickFill} fontSize={12} fontWeight={600} />
            {data.map((d, i) => (
              <Cell key={i} fill={d.last ? "#FFC727" : track} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
