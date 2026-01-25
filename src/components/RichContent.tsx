"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as Icons from "react-icons/fa";

interface TableData {
  type: "table";
  headers: string[];
  rows: string[][];
}

interface ChartData {
  type: "chart";
  chartType: "line" | "bar" | "pie";
  data: any[];
  title?: string;
}

interface IconData {
  type: "icon";
  name: string;
  size?: number;
  color?: string;
}

interface TextData {
  type: "text";
  content: string;
}

type RichContentType = TableData | ChartData | IconData | TextData;

export function RichContent({ content }: { content: RichContentType }) {
  try {
    if (content.type === "table") {
      return (
        <table className="w-full border-collapse border border-[#C5A059]/30">
          <thead>
            <tr className="bg-gray-800/50">
              {content.headers.map((h, i) => (
                <th
                  key={i}
                  className="border border-[#C5A059]/20 px-3 py-2 text-left text-[#C5A059] font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border border-[#C5A059]/10 px-3 py-2 text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (content.type === "chart") {
      const { data, chartType, title } = content;
      const colors = ["#C5A059", "#8B7043", "#D4B896", "#A0826D"];

      return (
        <div className="w-full">
          {title && <h3 className="text-center text-[#C5A059] mb-4">{title}</h3>}
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" && (
              <LineChart data={data}>
                <CartesianGrid stroke="#444" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#C5A059" />
              </LineChart>
            )}
            {chartType === "bar" && (
              <BarChart data={data}>
                <CartesianGrid stroke="#444" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#C5A059" />
              </BarChart>
            )}
            {chartType === "pie" && (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      );
    }

    if (content.type === "icon") {
      const { name, size = 32, color = "#C5A059" } = content;
      const IconComponent = (Icons as any)[name];

      if (!IconComponent) {
        return <span className="text-gray-500">Icon not found: {name}</span>;
      }

      return (
        <div className="inline-flex justify-center">
          <IconComponent size={size} color={color} />
        </div>
      );
    }

    if (content.type === "text") {
      return <p className="text-gray-300">{content.content}</p>;
    }

    return null;
  } catch (error) {
    return <span className="text-red-500">Error rendering content</span>;
  }
}
