"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Code, Globe, Database, Upload } from "lucide-react"

const apiData = [
  {
    title: "ICD-11 Search API",
    method: "GET",
    endpoint: "/api/icd-search?q=<query>",
    description: "Search ICD-11 and NAMASTE disease codes using query keyword.",
    example: "GET http://localhost:5000/api/icd-search?q=malaria",
    returns: [
     {
  "resourceType": "Condition",
  "id": "cond-001",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "code": {
    "coding": [
      {
        "system": "ICD-11",
        "code": "DB11",
        "display": "Acid dyspepsia"
      },
      {
        "system": "NAMASTE",
        "code": "NMT015",
        "display": "Amlapitta (Hyperacidity)"
      },
      {
        "system": "TM2",
        "code": "TM2009",
        "display": "Amlapitta (TM2)"
      },
      {
        "system": "Biomedicine",
        "code": "BIO009",
        "display": "Gastroesophageal Reflux Disease (GERD)"
      }
    ],
    "text": "Amlapitta / Acid Dyspepsia cross-system mapping"
  },
  "note": [
    {
      "text": "Mapped across ICD-11, NAMASTE, TM2, and Biomedicine as per Problem Statement 26."
    }
  ]
}

    ]
  },
  {
    title: "Save Diagnosis Bundle",
    method: "POST",
    endpoint: "/api/save-diagnosis",
    description: "Saves dual-coded ICD ↔ NAMASTE diagnosis bundle in FHIR format to MongoDB.",
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
        "system": "ICD-11",
        "code": "DB11",
        "display": "Acid dyspepsia"
      },
      {
        "system": "NAMASTE",
        "code": "NMT015",
        "display": "Amlapitta (Hyperacidity)"
      },
      {
        "system": "TM2",
        "code": "TM2009",
        "display": "Amlapitta (TM2)"
      },
      {
        "system": "Biomedicine",
        "code": "BIO009",
        "display": "Gastroesophageal Reflux Disease (GERD)"
      }
              ]
            }
          }
        }
      ]
    },
    returns: { success: true, message: "Bundle saved successfully", id: "<ObjectID>" }
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
        savedAt: "2025-09-25T10:00:00Z"
      }
    ]
  },
  {
    title: "Backend Health Check",
    method: "GET",
    endpoint: "/",
    description: "Returns a message if backend is running successfully.",
    example: "GET http://localhost:5000/",
    returns: "Backend running ✅"
  }
]

export default function ApiDocs() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredApis = apiData.filter(api =>
    api.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="px-6 md:px-12 py-8 space-y-8 font-sans">
      <h1 className="text-4xl font-extrabold text-green-700 flex items-center gap-3">
        <Globe className="w-8 h-8 text-green-700" />
        API Documentation
      </h1>
      <p className="text-gray-600 ml-10 text-lg">
        Explore all backend API endpoints integrated with your SIH-2025 Healthcare project.
      </p>

      {/* Search Box */}
      <div className="max-w-xl mt-8">
        <label htmlFor="search" className="font-semibold text-gray-800">Search API</label>
        <div className="flex items-center gap-2 mt-2">
          <Search className="text-green-700 w-5 h-5" />
          <Input
            id="search"
            placeholder="Search by name, path, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300 focus:border-green-400 focus:ring-green-400"
          />
        </div>
      </div>

      {/* API Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {filteredApis.map((api, index) => (
          <Card key={index} className="shadow-lg border border-gray-200 hover:shadow-xl transition">
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

      {filteredApis.length === 0 && (
        <p className="text-gray-500 italic mt-6 text-center">No APIs found for "{searchTerm}"</p>
      )}
    </div>
  )
}
