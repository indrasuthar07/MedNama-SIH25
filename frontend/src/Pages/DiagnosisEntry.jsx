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
    <div className="space-y-6 px-4 md:px-8 font-sans">
      <h1 className="text-4xl mt-6 font-extrabold text-green-700 flex items-center gap-2">
        <Stethoscope className="w-8 h-8 text-green-700" />
        Diagnosis Search
      </h1>
      <p className="text-gray-600 ml-10 text-lg">Dual coding NAMASTE ↔ ICD-11 with FHIR export</p>

      <div className="grid gap-6 mt-16 lg:grid-cols-2">
        {/* Search Section */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-xl text-green-700 flex items-center gap-2">
              <Search className="inline w-6 h-6" /> Disease Search
            </CardTitle>
            <CardDescription className="text-gray-500">
              Searching From stored dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="search" className="font-semibold">Search</Label>
            <Input
              id="search"
              placeholder="e.g. cholera"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 border-gray-300 focus:border-gray-50  "
            />

            <div className="space-y-2 mt-4 max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {results.length === 0 && searchTerm && (
                <p className="text-gray-500 text-sm italic">No matches found</p>
              )}

              {results.map((term) => (
                <div
                  key={term.code}
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:bg-green-50 transition"
                >
                  <div className="space-y-1">
                    <p className="text-gray-800 font-bold uppercase tracking-wide">{term.display}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-700">ICD: {term.code}</Badge>
                      <Badge className="bg-green-100 text-green-700">NAMASTE: {term.namaste}</Badge>
                    </div>
                    {term.description && (
                      <p className="text-xs">{term.description}</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="bg-green-700 hover:bg-green-400 text-white"
                    onClick={() => addDiagn(term)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Diagnoses & Notes */}
        <div className="space-y-4">
          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <NotebookPen className="w-6 h-6" /> Selected Diagnoses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selected.length > 0 ? selected.map(d => (
                <Card key={d.code} className="mb-2 border hover:shadow-md transition">
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{d.display}</p>
                      <p className="text-sm text-gray-600">{d.code}</p>
                      {d.dual?.length > 0 && (
                        <p className="text-sm text-green-600">
                          Dual-coded: {d.dual[0].display} ({d.dual[0].code})
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-400 hover:bg-green-50"
                      onClick={() => removeDiagn(d.code)}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              )) : <p className="text-gray-500 italic">No diagnoses selected</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
                <Save className="w-6 h-6" /> Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleSave}
                  className="bg-green-400 hover:bg-green-500 text-white"
                >
                  <Save className="mr-2" /> Save & Sync
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="border-green-400 text-green-600 hover:bg-green-50"
                >
                  <Eye className="mr-2" /> Preview FHIR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!fhirPreview} onOpenChange={() => setFhirPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700">
              FHIR Bundle Preview
            </DialogTitle>
          </DialogHeader>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto max-h-96">
            {JSON.stringify(fhirPreview, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
