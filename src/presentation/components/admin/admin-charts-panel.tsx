"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/presentation/components/ui/card";
import type { AdminAnalytics } from "@/presentation/lib/admin-analytics";
import { useThemeStore } from "@/presentation/stores/theme-store";

const STATUS_COLORS: Record<string, string> = {
  Ganado: "#10b981",
  Perdido: "#ef4444",
  Pendiente: "#f59e0b",
};

const GAME_TYPE_COLOR = "#F04623";

export function AdminChartsPanel({ analytics }: { analytics: AdminAnalytics }) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  const chartTheme = useMemo(
    () => ({
      grid: isDark ? "#334155" : "#e2e8f0",
      text: isDark ? "#cbd5e1" : "#475569",
      tooltipBg: isDark ? "#1e293b" : "#ffffff",
      tooltipBorder: isDark ? "#475569" : "#e2e8f0",
    }),
    [isDark],
  );

  const statusData = analytics.byStatus.map((r) => ({
    name: r.label,
    value: r.count,
    fill: STATUS_COLORS[r.label] ?? "#8b5cf6",
  }));

  const gameTypeData = analytics.byGameType.map((r) => ({
    name: r.label,
    cantidad: r.count,
  }));

  if (statusData.length === 0 && gameTypeData.length === 0) {
    return (
      <Card title="Sin datos">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Aún no hay boletas registradas para generar gráficas.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {statusData.length > 0 ? (
        <Card title="Distribución por estado">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Proporción de boletas ganadas, perdidas y pendientes en el sistema.
          </p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: "12px",
                    color: chartTheme.text,
                  }}
                  formatter={(value) => [`${value ?? 0} boletas`, "Cantidad"]}
                />
                <Legend
                  wrapperStyle={{ color: chartTheme.text, fontSize: "13px" }}
                  formatter={(value) => <span style={{ color: chartTheme.text }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      {gameTypeData.length > 0 ? (
        <Card title="Boletas por tipo de juego">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Cantidad registrada por lotería, rifa, sorteo y demás categorías.
          </p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gameTypeData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: chartTheme.text, fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis tick={{ fill: chartTheme.text, fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: "12px",
                    color: chartTheme.text,
                  }}
                  formatter={(value) => [`${value ?? 0}`, "Boletas"]}
                  cursor={{ fill: isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.15)" }}
                />
                <Bar
                  dataKey="cantidad"
                  fill={GAME_TYPE_COLOR}
                  radius={[8, 8, 0, 0]}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
