"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Rental-status donut: Completed (yellow), Confirmed (blue),
// Pending payment (orange). Total in the centre, legend on the side.
const SEGMENTS = [
  { key: "completed", label: "Completed", color: "#FFC727" },
  { key: "confirmed", label: "Confirmed", color: "#0EA5E9" },
  { key: "pending", label: "Pending payment", color: "#F59E0B" },
];

export default function StatusDonut({ mix }) {
  const data = SEGMENTS.map((s) => ({ ...s, value: mix?.[s.key] ?? 0 }));
  const completed = mix?.completed ?? 0;

  return (
    <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center">
      <div className="relative h-[190px] w-full max-w-[220px] flex-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--card-foreground)",
                fontSize: 13,
              }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="68%" outerRadius="92%" paddingAngle={2} strokeWidth={0}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <b className="font-display text-[34px] leading-none font-extrabold">{completed}</b>
          <span className="text-xs text-muted-foreground">completed</span>
        </div>
        <span className="sr-only">Rental status: {data.map((d) => `${d.label} ${d.value} percent`).join(", ")}</span>
      </div>
      <ul className="m-0 w-full list-none space-y-2.5 p-0 text-sm">
        {data.map((d) => (
          <li key={d.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: d.color }} />
            <span className="flex-1">{d.label}</span>
            <b>{d.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
