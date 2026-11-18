import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TerminologyReview() {
  const [mappings, setMappings] = useState([]);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMappings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/api/v1/terminology/mappings`);
      const data = await response.json();
      setMappings((data.results || []).filter((mapping) => mapping.review.status === "PENDING"));
    } catch {
      setMessage("Could not connect to the terminology API.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadMappings(); }, []);

  const decide = async (mapping, status) => {
    if (reason.trim().length < 5) return setMessage("Enter a clinical review reason (at least 5 characters).");
    const response = await fetch(`${api}/api/v1/terminology/mappings/${mapping.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Demo-Actor": "Dr. Jhatka" },
      body: JSON.stringify({ status, reviewer: "Dr. Jhatka", reason: reason.trim() }),
    });
    if (!response.ok) return setMessage("The review could not be saved.");
    setReason("");
    setMessage(`${mapping.namasteCode} marked ${status.toLowerCase()}. An audit event was recorded.`);
    await loadMappings();
  };

  return <div className="max-w-6xl mx-auto space-y-6">
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div><h1 className="text-3xl font-bold text-green-700 flex gap-2 items-center"><ClipboardCheck /> Terminology Review Queue</h1><p className="text-muted-foreground mt-1">Clinical validation of curated NAMASTE ↔ ICD-11 TM2 mapping assertions.</p></div>
      <Button variant="outline" onClick={loadMappings}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
    </div>
    <Card><CardHeader><CardTitle>Reviewer decision</CardTitle><CardDescription>A reason and reviewer identity are required. Decisions are kept in the append-only audit trail.</CardDescription></CardHeader><CardContent><Label htmlFor="reason">Clinical rationale</Label><Input id="reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="e.g. Verified against official terminology reference." className="mt-2" />{message && <p className="mt-3 text-sm text-green-700">{message}</p>}</CardContent></Card>
    {loading ? <p>Loading mapping assertions…</p> : mappings.length === 0 ? <Card><CardContent className="p-6 text-center">No pending mappings in the current catalogue.</CardContent></Card> : mappings.slice(0, 50).map((mapping) => <Card key={mapping.id}><CardHeader><div className="flex justify-between gap-3"><div><CardTitle>{mapping.namasteDisplay}</CardTitle><CardDescription>NAMASTE: {mapping.namasteCode} · {mapping.mappingType}</CardDescription></div><Badge variant="outline">{mapping.review.status}</Badge></div></CardHeader><CardContent><p className="text-sm mb-3"><span className="font-semibold">Evidence:</span> {mapping.evidence.note || "Source crosswalk assertion"}</p><div className="flex flex-wrap gap-2 mb-4">{mapping.targets.map((target) => <Badge key={`${target.system}-${target.code}`} className="bg-blue-100 text-blue-800">{target.system}: {target.code} — {target.display}</Badge>)}</div><p className="text-sm text-muted-foreground mb-4">Confidence {Math.round(mapping.confidence * 100)}% — {mapping.confidenceReason}</p><div className="flex gap-2"><Button onClick={() => decide(mapping, "ACCEPTED")} className="bg-green-700"><CheckCircle2 className="mr-2 h-4 w-4" /> Accept</Button><Button variant="destructive" onClick={() => decide(mapping, "REJECTED")}><XCircle className="mr-2 h-4 w-4" /> Reject</Button></div></CardContent></Card>)}
  </div>;
}
