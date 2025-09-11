import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const mockPatients = [
  {
    id: "1",
    name: "Harsh sankhla",
    abhaId: "12-3424-7890-1234",
    age: 25,
    gender: "Male",
    location: "Udaipur, Rajasthan",
    phone: "+91 9192XXXXXX",
    email: "harsh@gmail.com",
    lastVisit: "2024-01-15",
    conditions: ["Hypertension", "Diabetes Type 2", "Anxiety"],
    status: "Active",
    encounters: []
  },
  {
    id: "2",
    name: "Ekansh Gupta",
    abhaId: "12-0926-7890-1234",
    age: 45,
    gender: "Male",
    location: "Barieli, Uttar Pradesh",
    phone: "+91 98XXX XXX10",
    email: "ekansh@email.com",
    lastVisit: "2024-01-15",
    conditions: ["Hypertension", "Diabetes Type 2", "Anxiety"],
    status: "Active",
    encounters: []
  },
  {
    id: "3",
    name: "Nivedita kausodhan",
    abhaId: "12-3456-7890-5678",
    age: 32,
    gender: "Female",
    location: "Kanpur, Uttar Pradesh",
    phone: "+91 87654 32109",
    email: "nivedita@email.com",
    lastVisit: "2024-01-20",
    conditions: ["Migraine", "COVID-19"],
    status: "Active",
    encounters: []
  },
  {
    id: "4",
    name: "Kartik Gupta",
    abhaId: "12-3276-7890-5679", 
    age: 29,
    gender: "Male",
    location: "Bariely, Uttar Pradesh",
    phone: "+91 87654 XXXX9",
    email: "kartik@email.com",
    lastVisit: "2024-01-20",
    conditions: ["Malaria", "cholera"],
    status: "Active",
    encounters: []
  },
  {
    id: "5",
    name: "Vinayak Mishra",
    abhaId: "12-9856-7890-5680",
    age: 38,
    gender: "Male",
    location: "Bariely, Uttar Pradesh",
    phone: "+91 8XXXX 32109",
    email: "vinyak@email.com",
    lastVisit: "2024-01-20",
    conditions: ["Malaria", "Migraine"],
    status: "Active",
    encounters: []
  },
];

export default function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState(mockPatients);
  const [openNewEncounter, setOpenNewEncounter] = useState(false);
  const [encounterData, setEncounterData] = useState({ diagnosis: "", notes: "" });

  // make search safe (won't call includes on undefined)
  const q = searchQuery.trim().toLowerCase();
  const filteredPatients = q === "" ? [] : patients.filter(patient => {
    const name = (patient.name || "").toLowerCase();
    // accept either abhaId or possible typo bhaId (defensive)
    const abha = ((patient.abhaId || patient.bhaId) || "").toLowerCase();
    return name.includes(q) || abha.includes(q);
  });

  const handleCreateEncounter = () => {
    if (!encounterData.diagnosis) {
      alert("Please enter a diagnosis");
      return;
    }

    const updatedPatients = patients.map(p => {
      if (p.id === selectedPatient?.id) {
        return {
          ...p,
          encounters: [...(p.encounters || []), { ...encounterData, date: new Date().toLocaleDateString() }]
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    // update selectedPatient with the fresh object from state
    const refreshed = updatedPatients.find(p => p.id === selectedPatient?.id) || null;
    setSelectedPatient(refreshed);
    setEncounterData({ diagnosis: "", notes: "" });
    setOpenNewEncounter(false);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-green-700">Patient Search</h1>
          <p className="text-gray-600 mt-1">
            Search patients by ABHA ID, name, or demographics
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Panel */}
        <div className="lg:w-1/3">
          <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 font-semibold">
                <Search className="h-5 w-5" />
                Search Patients
              </CardTitle>
              <CardDescription className="text-gray-500">
                Find patients using ABHA ID or personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-gray-700 font-medium">ABHA ID or Name</Label>
                <Input
                  id="search"
                  placeholder="Search by ABHA ID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg"
                />
              </div>

              <Button variant="medical" className="w-full bg-green-700 hover:bg-green-800 text-white mt-2">
                <Search className="mr-2 h-4 w-4" />
                Advanced Search
              </Button>

              {/* Search Results */}
              <div className="space-y-3 mt-4">
                {searchQuery === "" ? (
                  <p className="text-center text-gray-400 py-4 italic">
                    Start typing to search patients
                  </p>
                ) : filteredPatients.length > 0 ? (
                  <>
                    <h3 className="font-medium text-sm text-gray-700">
                      Search Results ({filteredPatients.length})
                    </h3>
                    {filteredPatients.map((patient) => (
                      <Card
                        key={patient.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 rounded-lg"
                        onClick={() => {
                          // make sure we select the object from the current state array
                          const actual = patients.find(p => p.id === patient.id) || patient;
                          setSelectedPatient(actual);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-1 ring-gray-300">
                              <AvatarFallback>
                                {patient.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-800">{patient.name}</p>
                              <p className="text-xs text-gray-500">{patient.abhaId || patient.bhaId}</p>
                            </div>
                            <Badge variant={patient.status === "Active" ? "default" : "secondary"} className="bg-green-100 text-green-800">
                              {patient.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-gray-400 py-4 italic">
                    No patients found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Profile */}
        <div className="lg:w-2/3">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Header */}
              <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-200 rounded-xl">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-1 ring-gray-300">
                      <AvatarFallback className="text-lg text-gray-700">
                        {selectedPatient.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-green-700">{selectedPatient.name}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        ABHA ID: {selectedPatient.abhaId || selectedPatient.bhaId}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800">{selectedPatient.age} years</Badge>
                        <Badge variant="outline" className="text-gray-700 border-gray-300">{selectedPatient.gender}</Badge>
                        <Badge variant="secondary" className="text-gray-500 bg-gray-100">{selectedPatient.status}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="medical"
                      className="bg-green-700 hover:bg-green-800 text-white"
                      onClick={() => setOpenNewEncounter(true)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      New Encounter
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Patient Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-sm border border-gray-200 rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-700" />
                      <span className="text-sm">{selectedPatient.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-700" />
                      <span className="text-sm">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-700" />
                      <span className="text-sm">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-700" />
                      <span className="text-sm">Last visit: {selectedPatient.lastVisit}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border border-gray-200 rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">Active Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                          <span className="text-sm text-gray-700">{condition}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* New Encounter Modal */}
              <Dialog open={openNewEncounter} onOpenChange={setOpenNewEncounter}>
                <DialogContent className={"max-w-lg bg-white"}>
                  <DialogHeader>
                    <DialogTitle>New Encounter for {selectedPatient.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input
                        id="diagnosis"
                        placeholder="Enter diagnosis"
                        value={encounterData.diagnosis}
                        onChange={(e) => setEncounterData({ ...encounterData, diagnosis: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        placeholder="Enter notes"
                        value={encounterData.notes}
                        onChange={(e) => setEncounterData({ ...encounterData, notes: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpenNewEncounter(false)}>Cancel</Button>
                    <Button onClick={handleCreateEncounter}>Save Encounter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg">
              <div className="text-center text-gray-400">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No Patient Selected</h3>
                <p className="text-sm">Search and select a patient to view their profile</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
