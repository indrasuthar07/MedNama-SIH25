"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Zap, Layers } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analytics() {
  const [bundleStats, setBundleStats] = useState([]);
  const [backendStatus, setBackendStatus] = useState("");
  const [topDiseases, setTopDiseases] = useState([]);

  const fetchBundles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/saved-bundles");
      const data = await res.json();

      const bundles = data
        .map((b) => {
          const entries = b.bundle.entry || [];
          return entries.map((e) => {
            const codes = e.resource.code.coding;
            const icd = codes.find((c) => c.system === "ICD-11")?.code || "-";
            const namaste = codes.find((c) => c.system === "NAMASTE")?.code || "-";
            const display = codes[0]?.display || "Unknown Disease";
            return {
              id: b._id,
              savedAt: b.savedAt,
              display,
              icd,
              namaste,
            };
          });
        })
        .flat()
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

      setBundleStats(bundles);

      // Compute Top Diseases
      const counts = {};
      bundles.forEach((b) => {
        counts[b.display] = (counts[b.display] || 0) + 1;
      });
      const top = Object.entries(counts)
        .map(([name, count]) => ({ name, searches: count }))
        .sort((a, b) => b.searches - a.searches)
        .slice(0, 5);
      setTopDiseases(top);

    } catch (err) {
      console.error("Error fetching bundles:", err);
    }
  };

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/");
      const text = await res.text();
      setBackendStatus(text);
    } catch (err) {
      setBackendStatus("❌ Backend unreachable");
    }
  };

  useEffect(() => {
    fetchBundles();
    fetchBackendStatus();
  }, []);

  const chartData = {
    labels: topDiseases.map(d => d.name),
    datasets: [
      {
        label: 'Saved Count',
        data: topDiseases.map(d => d.searches),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 30,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function(context) {
            const disease = topDiseases[context.dataIndex];
            return `${disease.searches} saved`;
          }
        }
      },
      title: {
        display: true,
        text: 'Top Saved Diseases',
        font: { size: 18, weight: 'bold' },
        color: '#10B981',
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { ticks: { font: { size: 14 } } }
    }
  };

  return (
    <div className="px-6 md:px-12 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Activity className="w-8 h-8 text-green-700 animate-bounce" />
        <h1 className="text-3xl font-extrabold text-green-700">
          API Analytics Dashboard
        </h1>
      </div>

      {/* Metrics */}
      

      {/* Top Saved Diseases Chart */}
     <div className="flex flex-col md:flex-row gap-6">
  {/* Left Cards */}
  <div className="grid grid-cols-1 gap-4 md:w-1/3">
    <Card className="p-4 shadow-lg border border-gray-200">
      <CardHeader className="flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-600" />
        <CardTitle>Total Saved Bundles</CardTitle>
      
        <p className="text-2xl font-bold text-gray-800">{bundleStats.length}</p>
        <Badge className="bg-green-100 text-green-700 mt-2">Updated live</Badge>
      </CardHeader>
    </Card>

    <Card className="p-4 shadow-lg border border-gray-200">
      <CardHeader className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-600" />
        <CardTitle>Total API Usage</CardTitle>
        <p className="text-2xl font-bold text-gray-800">
          {bundleStats.length + topDiseases.reduce((a, c) => a + c.searches, 0)}
        </p>
        <Badge className="bg-purple-100 text-purple-700 mt-2">Estimated</Badge>
     </CardHeader>
    </Card>

    <Card className="p-4 shadow-lg border border-gray-200">
      <CardHeader className="flex items-center gap-2">
        <Server className="w-5 h-5 text-red-600" />
        <CardTitle>Backend Status</CardTitle>
    
        <p className={`font-semibold ${backendStatus.includes("❌") ? "text-red-600" : "text-green-700"}`}>
          {backendStatus}
        </p>
      </CardHeader>
    </Card>

    <Card className="p-4 shadow-lg text-center border border-gray-200">
      <CardHeader className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-teal-600" />
        <CardTitle>Unique Diseases</CardTitle>
     
        <p className="text-2xl font-bold text-gray-800">{new Set(bundleStats.map(b => b.display)).size}</p>
        <Badge className="bg-teal-100 text-teal-700 mt-2">Distinct entries</Badge>
       </CardHeader>
    </Card>
  </div>

  {/* Right Chart */}
  <div className="md:w-2/3">
    <Card className="p-2 shadow-lg border border-gray-200 h-full">
      <CardContent>
        <Bar data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  </div>
</div>


      {/* Recent Saved Bundles */}
      <Card className="p-4 shadow-lg border border-gray-200 hover:shadow-2xl transition">
        <CardHeader>
          <CardTitle className="text-green-700">Recent Saved Diseases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {bundleStats.length === 0 && <p>No bundles saved yet.</p>}
          {bundleStats.map((b) => (
            <div
              key={b.id + b.icd}
              className="p-2 bg-gray-50 rounded shadow-sm flex justify-between items-center hover:bg-green-50 transition cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800">{b.display}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-700">ICD: {b.icd}</Badge>
                  <Badge className="bg-green-100 text-green-700">NAMASTE: {b.namaste}</Badge>
                </div>
              </div>
              <p className="text-sm text-blue-400 font-bold">{new Date(b.savedAt).toLocaleString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
