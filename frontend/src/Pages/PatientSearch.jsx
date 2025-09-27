import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Search,
  User,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText
} from "lucide-react";

// If you're using Shadcn/ui Select components:
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAge, setFilterAge] = useState("");

  // Flatten all encounters from all patients for stats
  const encounters = patients.flatMap(p => p.encounters || []);

  // Count recent visits (last 7 days)
  const recentVisitsCount = patients.filter(p => {
    const lastVisit = new Date(p.lastVisit);
    const diffDays = (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  // Search logic
  const q = searchQuery.trim().toLowerCase();
  const filteredPatients = patients.filter(patient => {
    const name = (patient.name || "").toLowerCase();
    const abha = ((patient.abhaId || patient.bhaId) || "").toLowerCase();
    const genderMatch = filterGender ? patient.gender === filterGender : true;
    const statusMatch = filterStatus ? patient.status === filterStatus : true;

    let ageMatch = true;
    if (filterAge) {
      if (filterAge === "0-18") ageMatch = patient.age <= 18;
      else if (filterAge === "19-40") ageMatch = patient.age >= 19 && patient.age <= 40;
      else if (filterAge === "40+") ageMatch = patient.age > 40;
    }

    return (name.includes(q) || abha.includes(q)) && genderMatch && statusMatch && ageMatch;
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
    const refreshed = updatedPatients.find(p => p.id === selectedPatient?.id) || null;
    setSelectedPatient(refreshed);
    setEncounterData({ diagnosis: "", notes: "" });
    setOpenNewEncounter(false);
  };

  return (
    <div className="space-y-10 animate-fade-in p-8 max-w-7xl mx-auto font-sans">
      {/* Header and Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-green-700 flex items-center gap-2">
            <User className="w-8 h-8 text-green-700" />
            Patient Search Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Search, manage, and analyze patient data seamlessly
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex gap-4 flex-wrap">
  {/* Total Patients */}
  <Card className="border border-gray-200 w-48  h-16 shadow-sm rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Users className="h-6 w-6 text-green-500" />
      <p className="text-gray-500 text-xs font-medium">Total Patients</p>
      <h3 className="text-xl font-bold text-green-700">{patients.length}</h3>
    </div>
    
  </Card>

  {/* Active Encounters */}
  <Card className="border border-gray-200 w-48  h-16 shadow-sm rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <FileText className="h-6 w-6 text-green-500" />
      <p className="text-gray-500 text-xs font-medium">Active Encounters</p>
      <h3 className="text-xl font-bold text-green-700">{encounters.length}</h3>
    </div>
    
  </Card>

  {/* Recent Visits */}
  <Card className="border border-gray-200 w-48  h-16 shadow-sm rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Calendar className="h-6 w-6 text-green-500" />
      <p className="text-gray-500 text-xs font-medium">Recent Visits (7 days)</p>
      <h3 className="text-xl font-bold text-green-700">{recentVisitsCount}</h3>
    </div>
    
  </Card>
</div>


      {/* Search & Patient Details */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Panel */}
        <div className="lg:w-1/3">
          <Card className="shadow-md border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 font-semibold">
                <Search className="h-5 w-5" /> Search Patients
              </CardTitle>
              <CardDescription className="text-gray-500">
                Find patients using ABHA ID, name, or demographics
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

  <div className="grid grid-cols-3 gap-3">
    <Select value={filterGender} onValueChange={setFilterGender}>
      <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Male">Male</SelectItem>
        <SelectItem value="Female">Female</SelectItem>
      </SelectContent>
    </Select>
    <Select value={filterStatus} onValueChange={setFilterStatus}>
      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
    <Select value={filterAge} onValueChange={setFilterAge}>
      <SelectTrigger><SelectValue placeholder="Age" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="0-18">0-18</SelectItem>
        <SelectItem value="19-40">19-40</SelectItem>
        <SelectItem value="40+">40+</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="space-y-3 mt-4">
    {(searchQuery || filterGender || filterStatus || filterAge) ? (
      filteredPatients.length > 0 ? (
        filteredPatients.map(patient => (
          <Card key={patient.id} className="cursor-pointer border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
            onClick={() => setSelectedPatient(patient)}>
            <CardContent className="p-4 flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-1 ring-gray-300">
                <AvatarFallback>{patient.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800">{patient.name}</p>
                <p className="text-xs text-gray-500">{patient.abhaId}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">{patient.status}</Badge>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-400 py-4 italic">No patients found</p>
      )
    ) : (
      <p className="text-center text-gray-400 py-4 italic">Start typing or apply a filter to see patients</p>
    )}
  </div>
</CardContent>

          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:w-2/3">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="shadow-md border border-gray-200 rounded-xl">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-1 ring-gray-300">
                      <AvatarFallback className="text-lg text-gray-700">{selectedPatient.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-green-700">{selectedPatient.name}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        ABHA ID: {selectedPatient.abhaId}
                      </CardDescription>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className="bg-green-100 text-green-800">{selectedPatient.age} yrs</Badge>
                        <Badge variant="outline" className="text-gray-700 border-gray-300">{selectedPatient.gender}</Badge>
                        <Badge variant="secondary" className="text-gray-500 bg-gray-100">{selectedPatient.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedPatient.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedPatient.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />  
                          <span>{selectedPatient.email}</span>
                        </div>
<div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>Conditions: {selectedPatient.conditions.join(", ")}</span>
                        </div>
                      <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Last Visit: {selectedPatient.lastVisit}</span>
                        </div>
                      </div>

                    </div>
                    <Button
                      variant="medical"
                      className="bg-green-700 hover:bg-green-800 text-white"
                      onClick={() => setOpenNewEncounter(true)}
                    >
                      <FileText className="mr-2 h-4 w-4" /> New Encounter
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Timeline */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Encounter Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPatient.encounters?.length ? (
                    selectedPatient.encounters.map((enc, i) => (
                      <div key={i} className="flex items-start gap-3 border-l-4 border-green-600 pl-3">
                        <Calendar className="h-4 w-4 mt-1 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{enc.date}</p>
                          <p className="text-xs text-gray-600">{enc.diagnosis}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No encounters yet</p>
                  )}
                </CardContent>
              </Card>

              {/* New Encounter Modal */}
              <Dialog open={openNewEncounter} onOpenChange={setOpenNewEncounter}>
                <DialogContent className="max-w-lg bg-white">
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
