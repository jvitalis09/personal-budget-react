import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as d3 from "d3";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Charts() {
  const [labels, setLabels] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const baseURL =
          import.meta?.env?.VITE_API_URL ||
          process.env.REACT_APP_API_URL ||
          "http://localhost:3001";
        const { data } = await axios.get(`${baseURL}/api/budget/summary`);
        setLabels(data?.labels ?? []);
        setAmounts(data?.amounts ?? []);
      } catch (e) {
        console.warn("API failed, using fallback demo data:", e?.message);
        setLabels(["rent", "food", "utilities"]);
        setAmounts([1200, 450, 150]);
        setErr(e?.message || "Failed to load API, showing demo data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>loading…</p>;

  const chartData = {
    labels,
    datasets: [{ label: "Spending", data: amounts }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Budget Summary" },
    },
  };

  return (
    <section>
      {err && <p role="alert">note: {err}</p>}
      <div style={{ maxWidth: 720 }}>
        <Bar data={chartData} options={options} />
      </div>
      <DonutD3
        data={labels.map((label, i) => ({ label, value: amounts[i] ?? 0 }))}
      />
    </section>
  );
}

function DonutD3({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const width = 320;
    const height = 320;
    const r = Math.min(width, height) / 2;

    d3.select(el).selectAll("*").remove();

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc().innerRadius(r * 0.6).outerRadius(r - 2);
    const pie = d3.pie().value((d) => d.value);
    const arcs = pie(data);

    svg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc);

    svg
      .selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => d.data.label);
  }, [data]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="donut chart of budget categories"
      style={{ marginTop: 24 }}
    />
  );
}
