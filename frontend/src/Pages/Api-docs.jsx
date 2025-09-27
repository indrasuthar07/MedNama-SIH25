"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Search,
  Code,
  Plus,
  Code2Icon,
} from "lucide-react";

// ✅ API Documentation Data
const apiData = [
  {
    title: "ICD-11 Search API",
    method: "GET",
    endpoint: "/api/icd-search?q=<query>",
    description:
      "Search ICD-11 and NAMASTE disease codes using query keyword.",
    example: "GET http://localhost:5000/api/icd-search?q=Amlapitta",
    returns: [
      {
        resourceType: "Condition",
        id: "cond-001",
        clinicalStatus: "active",
        verificationStatus: "confirmed",
        code: {
          coding: [
            {
              system: "ICD-11",
              code: "DB11",
              display: "Acid dyspepsia",
            },
            {
              system: "NAMASTE",
              code: "NMT015",
              display: "Amlapitta (Hyperacidity)",
            },
            {
              system: "TM2",
              code: "TM2009",
              display: "Amlapitta (TM2)",
            },
            {
              system: "Biomedicine",
              code: "BIO009",
              display: "Gastroesophageal Reflux Disease (GERD)",
            },
          ],
          text: "Amlapitta / Acid Dyspepsia cross-system mapping",
        },
        note: [
          {
            text: "Mapped across ICD-11, NAMASTE, TM2, and Biomedicine.",
          },
        ],
      },
    ],
  },
  {
    title: "Save Diagnosis Bundle",
    method: "POST",
    endpoint: "/api/save-diagnosis",
    description:
      "Saves dual-coded ICD ↔ NAMASTE diagnosis bundle in FHIR format to MongoDB.",
    example: "POST http://localhost:5000/api/save-diagnosis",
    requestBody: {
      resourceType: "Bundle",
      type: "collection",
      entry: [
        {
          resource: {
            resourceType: "Condition",
            code: {
              coding: [
                {
                  system: "ICD-11",
                  code: "DB11",
                  display: "Acid dyspepsia",
                },
                {
                  system: "NAMASTE",
                  code: "NMT015",
                  display: "Amlapitta (Hyperacidity)",
                },
                {
                  system: "TM2",
                  code: "TM2009",
                  display: "Amlapitta (TM2)",
                },
                {
                  system: "Biomedicine",
                  code: "BIO009",
                  display: "Gastroesophageal Reflux Disease (GERD)",
                },
              ],
            },
          },
        },
      ],
    },
    returns: {
      success: true,
      message: "Bundle saved successfully",
      id: "<ObjectID>",
    },
  },
  {
    title: "Get Saved Bundles",
    method: "GET",
    endpoint: "/api/saved-bundles",
    description: "Fetches all FHIR bundles saved in database.",
    example: "GET http://localhost:5000/api/saved-bundles",
    returns: [
      {
        _id: "66e90e4f89d1b2c1e7b8a6f1",
        bundle: { resourceType: "Bundle", entry: [] },
        savedAt: "2025-09-25T10:00:00Z",
      },
    ],
  },
  {
    title: "Backend Health Check",
    method: "GET",
    endpoint: "/",
    description: "Returns a message if backend is running successfully.",
    example: "GET http://localhost:5000/",
    returns: "Backend running ✅",
  },
];

// ✅ Fetch diseases from backend
const fetchTerminologies = async (query) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `http://localhost:5000/api/icd-search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching from backend:", err);
    return [];
  }
};

export default function ApiDocs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // 🔍 Auto-search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm) {
        const terms = await fetchTerminologies(searchTerm);
        setResults(terms);
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSelect = (term) => {
    alert(`✅ Selected Disease: ${term.display} (${term.code})`);
  };

  return (
    <div className="px-6 md:px-12 py-8 space-y-8 font-sans">
      <div className="flex items-center text-gray-600">
      {/* Title */}
<div className="space-y-1">
      <h1 className="text-3xl font-extrabold text-green-700 flex gap-3">
        <Code2Icon className="w-8 h-8 text-green-700" />
        API Documentation
      </h1>
      <p className="text-gray-600 ml-8 text-xl">
        Explore all backend API endpoints integrated.
      </p>
      </div>

      {/* 🔍 Search Box */}
      <Card className="max-w-2xl w-full mx-auto mt-2 backdrop-blur-md border border-gray-200/50 bg-transparent rounded-2xl mr-1.5">
  <CardContent className="p-2">
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <div>
        <Label
          htmlFor="search"
          className="text-xl font-bold text-green-700 tracking-wide"
        >
          🔍 Search API
        </Label>
        <p className="text-gray-500 text-sm">
          ICD-11 / NAMASTE Disease Search Engine
        </p>
      </div>
      <div className="bg-green-100 px-1 py-1 rounded-full text-green-700 font-semibold text-xs shadow-sm">
        LIVE
      </div>
    </div>

    {/* Input */}
    <div className="relative">
      <Input
        id="search"
        placeholder="Search diseases (e.g. cholera, agnimandhya, vata shula)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-3 border-gray-300 rounded-xl text-gray-700 "
      />
      <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
    </div>

    {/* Results */}
    <div className="space-y-3 max-h-40 overflow-y-auto rounded-xl p- border border-gray-100">
      {results.length === 0 && searchTerm && (
        <p className="text-gray-500 text-sm italic text-center">
          ❌ No matches found for "{searchTerm}"
        </p>
      )}

      {results.map((term) => (
        <div
          key={term.code}
          className="group flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
        >
          {/* Disease info */}
         <div className="flex  text-sm">
  {/* Disease Name */}
  <p className="font-semibold text-gray-800 truncate group-hover:text-green-700 transition">
    {term.display}
  </p>

  {/* Right side: ICD + NAMASTE */}
  <div className="flex items-center gap-2 text-xs">
    <Badge className="bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
      ICD: {term.code}
    </Badge>
    <Badge className="bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
      NAMASTE: {term.namaste}
    </Badge>
  </div>
</div>

        </div>
      ))}
    </div>
  </CardContent>
</Card>

</div>
      {/* 🧠 API Docs Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {apiData.map((api, index) => (
          <Card
            key={index}
            className="shadow-lg border border-gray-200 hover:shadow-xl transition"
          >
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Code className="w-5 h-5" />
                {api.title}
              </CardTitle>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Badge
                  className={`${
                    api.method === "GET"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {api.method}
                </Badge>
                <code className="ml-2 text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  {api.endpoint}
                </code>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Example:</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {api.example}
                </pre>
              </div>

              {api.requestBody && (
                <div>
                  <p className="font-semibold text-gray-800">Request Body:</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(api.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {api.returns && (
                <div>
                  <p className="font-semibold text-gray-800">Response Example:</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(api.returns, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
