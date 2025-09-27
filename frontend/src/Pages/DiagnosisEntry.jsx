"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Stethoscope, Save, Eye, NotebookPen } from "lucide-react"

const dualMap = {
  "1A00": { code: "NAM001", display: "Cholera (NAMASTE)" },
  "1A01": { code: "NAM002", display: "Typhoid (NAMASTE)" }, 
  "1A02": { code: "NAM003", display: "Malaria (NAMASTE)" },
  "8E64.Z": { code: "NAM004", display: "Anxiety Disorder (NAMASTE)" },
  "5B50": { code: "NAM005", display: "Diabetes Mellitus (NAMASTE)" },
  "BA40": { code: "NAM006", display: "Hypertension (NAMASTE)" },
  "CA23": { code: "NAM007", display: "Asthma (NAMASTE)" },
  "DA11": { code: "NAM008", display: "Migraine (NAMASTE)" },
  "EA90": { code: "NAM009", display: "Tuberculosis (NAMASTE)" },
  "FA33": { code: "NAM010", display: "Pneumonia (NAMASTE)" },
  "GA12": { code: "NAM011", display: "Chickenpox (NAMASTE)" },  
  "HA45": { code: "NAM012", display: "Measles (NAMASTE)" },
  "IA27": { code: "NAM013", display: "Hepatitis B (NAMASTE)" },
  "JA99": { code: "NAM014", display: "COVID-19 (NAMASTE)" },
  "KA10": { code: "NAM015", display: "Influenza (NAMASTE)" },
  "LA77": { code: "NAM016", display: "Dengue Fever (NAMASTE)" },
  "MA32": { code: "NAM017", display: "Leprosy (NAMASTE)" },
  "NA55": { code: "NAM018", display: "Rabies (NAMASTE)" },
  "OA88": { code: "NAM019", display: "Tetanus (NAMASTE)" },
  "PA11": { code: "NAM020", display: "Scarlet Fever (NAMASTE)" },
  "QA66": { code: "NAM021", display: "Mumps (NAMASTE)" },
  "RA42": { code: "NAM022", display: "Whooping Cough (NAMASTE)" },
  "SA13": { code: "NAM023", display: "Ebola Virus Disease (NAMASTE)" },
  "TA09": { code: "NAM024", display: "Zika Virus Infection (NAMASTE)" },
  "UA34": { code: "NAM025", display: "Chikungunya (NAMASTE)" },
  "VA21": { code: "NAM026", display: "Yellow Fever (NAMASTE)" },
  "WA78": { code: "NAM027", display: "Lassa Fever (NAMASTE)" },
  "XA56": { code: "NAM028", display: "Marburg Virus Disease (NAMASTE)" },
  "YA89": { code: "NAM029", display: "Nipah Virus Infection (NAMASTE)" },
  "ZA90": { code: "NAM030", display: "Hantavirus Pulmonary Syndrome (NAMASTE)" },
  "SR12": { code: "AAA-2", display: "vatavriddh (NAMASTE)"},
  "SQ00": { code: "AAB-1", display: "atipralapa (NAMASTE)"},

}
const fetchDualCodes = async (code) => {
  return dualMap[code] ? [dualMap[code]] : []
}

const fetchTerminologies = async (query) => {
  if (!query) return []
  try {
    const res = await fetch(`http://localhost:5000/api/icd-search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error fetching from backend:", err)
    return []
  }
}

export default function DiagnosisEntry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState([])
  const [notes, setNotes] = useState("")
  const [fhirPreview, setFhirPreview] = useState(null)

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm) {
        const terms = await fetchTerminologies(searchTerm)
        setResults(terms)
      } else {
        setResults([])
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const addDiagn = async (term) => {
    if (!selected.find(d => d.code === term.code)) {
      const dual = await fetchDualCodes(term.code)
      setSelected([...selected, { ...term, dual }])
    }
  }

  const removeDiagn = (code) => {
    setSelected(selected.filter(d => d.code !== code))
  }

  const buildFHIR = () => ({
    resourceType: "Bundle",
    type: "collection",
    entry: selected.map(d => ({
      resource: {
        resourceType: "Condition",
        code: {
          coding: [
            { system: d.system, code: d.code, display: d.display },
            ...(d.dual?.map((m) => ({
              system: "NAMASTE",
              code: m.code,
              display: m.display
            })) || [])
          ],
          text: d.display
        },
        note: notes ? [{ text: notes }] : []
      }
    }))
  })

  const handlePreview = () => setFhirPreview(buildFHIR())

  const handleSave = async () => {
    const bundle = buildFHIR();
    try {
     const res = await fetch("http://localhost:5000/api/save-diagnosis", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bundle),
});

      if (res.ok) alert("✅ Synced successfully with EMR");
      else alert("❌ Failed to sync");
    } catch (err) {
      console.error(err);
      alert("Error syncing with EMR");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 px-6 md:px-10 py-10 font-sans">
  {/* Title Section */}
  <div className="text-center mb-10">
    <h1 className="text-4xl font-extrabold text-green-700 flex justify-center items-center gap-3">
      <Stethoscope className="w-9 h-9 text-green-600" />
      Diagnosis Search Portal
    </h1>
    <p className="text-gray-600 text-lg mt-2">
      Dual Coding — NAMASTE ↔ ICD-11 | FHIR Ready
    </p>
  </div>

  {/* Main Grid Layout */}
  <div className="grid lg:grid-cols-2 gap-10">
    {/* Left: Search Section */}
    <Card className="border-none bg-white shadow-md rounded-2xl">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Search className="w-6 h-6" /> Disease Search
        </CardTitle>
        <CardDescription className="text-gray-500">
          Explore diseases from dataset
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <Label htmlFor="search" className="font-semibold text-gray-700">
          Search Disease
        </Label>
        <Input
          id="search"
          placeholder="Type disease name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-400 rounded-lg"
        />

        {/* Results List */}
        <div className="mt-5 max-h-72 overflow-y-auto bg-gray-50 rounded-xl p-3 space-y-2">
          {results.length === 0 && searchTerm && (
            <p className="text-gray-500 text-sm italic text-center py-4">
              No matches found
            </p>
          )}

          {results.map((term) => (
            <div
              key={term.code}
              className="flex justify-between items-center bg-white rounded-xl border border-gray-100 p-3"
            >
              <div>
                <p className="text-gray-800 font-semibold text-sm">
                  {term.display}
                </p>
                <div className="flex gap-2 mt-1 text-xs">
                  <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    ICD: {term.code}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    NAMASTE: {term.namaste}
                  </Badge>
                </div>
              </div>

              <Button
                size="sm"
                className="bg-green-600 text-white rounded-md"
                onClick={() => addDiagn(term)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Right: Selected + Notes */}
    <div className="space-y-8">
      {/* Selected Diagnoses */}
      <Card className="border-none bg-white shadow-md rounded-2xl">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <NotebookPen className="w-6 h-6" /> Selected Diagnoses
          </CardTitle>
        </CardHeader>

        <CardContent>
          {selected.length > 0 ? (
            selected.map((d) => (
              <div
                key={d.code}
                className="border border-gray-100 bg-gray-50 rounded-lg p-3 mb-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {d.display}
                  </p>
                  <p className="text-xs text-gray-500">ICD: {d.code}</p>
                  {d.dual?.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Dual-coded: {d.dual[0].display} ({d.dual[0].code})
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-700 border-green-400"
                  onClick={() => removeDiagn(d.code)}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-6">
              No diagnoses selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card className="border-none bg-white shadow-md rounded-2xl">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <Save className="w-6 h-6" /> Clinical Notes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            placeholder="Write clinical notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-gray-300 focus:border-green-500 focus:ring-green-400 rounded-lg"
          />

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} className="bg-green-600 text-white">
              <Save className="mr-2" /> Save & Sync
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-green-400 text-green-700"
            >
              <Eye className="mr-2" /> Preview FHIR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* FHIR Preview Dialog */}
  <Dialog open={!!fhirPreview} onOpenChange={() => setFhirPreview(null)}>
    <DialogContent className="max-w-2xl bg-white rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-green-700">
          FHIR Bundle Preview
        </DialogTitle>
      </DialogHeader>
      <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-96">
        {JSON.stringify(fhirPreview, null, 2)}
      </pre>
    </DialogContent>
  </Dialog>
</div>


  )
}
