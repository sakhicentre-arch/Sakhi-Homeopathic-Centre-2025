'use client';
import useSWR from 'swr';
import { useState } from 'react';
const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function NewVisitPage() {
const { data: patients } = useSWR('/api/patients', fetcher);
const { data: clinics } = useSWR('/api/clinics', fetcher);
const [form, setForm] = useState({ patientId: '', clinicId: '', symptoms: '', fee: '0', paymentMode: 'CASH', paid: true });
const [msg, setMsg] = useState<{type:'ok'|'err'|''; text:string}>({type:'', text:''});

const submit = async (e: React.FormEvent) => {
e.preventDefault();
setMsg({type:'', text:''});
const res = await fetch('/api/visits', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
patientId: Number(form.patientId),
clinicId: Number(form.clinicId),
symptoms: form.symptoms,
fee: Number(form.fee || 0),
paymentMode: form.paymentMode,
paid: form.paid,
}),
});
setMsg(res.ok ? {type:'ok', text:'Visit created'} : {type:'err', text:'Error'});
};

return (
<section className="space-y-4">
<h2 className="text-xl font-semibold">New Visit</h2>
<form onSubmit={submit} className="grid max-w-2xl gap-3 bg-white p-4 rounded-lg shadow">
<div className="grid grid-cols-2 gap-3">
<label className="grid gap-1">
<span className="text-sm text-slate-600">Patient</span>
<select value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required>
<option value="">Select patient</option>
{patients?.map((p:any)=>(<option key={p.id} value={p.id}>{p.name} ({p.mobile})</option>))}
</select>
</label>
<label className="grid gap-1">
<span className="text-sm text-slate-600">Clinic</span>
<select value={form.clinicId} onChange={e=>setForm({...form, clinicId:e.target.value})} required>
<option value="">Select clinic</option>
{clinics?.map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}
</select>
</label>
</div>
<label className="grid gap-1">
<span className="text-sm text-slate-600">Symptoms</span>
<textarea value={form.symptoms} onChange={e=>setForm({...form, symptoms:e.target.value})} />
</label>
<div className="grid grid-cols-3 gap-3">
<label className="grid gap-1">
<span className="text-sm text-slate-600">Fee</span>
<input type="number" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})} />
</label>
<label className="grid gap-1">
<span className="text-sm text-slate-600">Payment</span>
<select value={form.paymentMode} onChange={e=>setForm({...form, paymentMode:e.target.value})}>
<option value="CASH">Cash</option>
<option value="UPI">UPI</option>
<option value="CARD">Card</option>
<option value="NONE">None</option>
</select>
</label>
<label className="flex items-center gap-2">
<input type="checkbox" checked={form.paid} onChange={e=>setForm({...form, paid:e.target.checked})} />
<span className="text-sm text-slate-600">Paid</span>
</label>
</div>
<button type="submit" className="mt-2">Create Visit</button>
{msg.text ? (
<p className={msg.type==='ok' ? 'text-green-700 text-sm' : 'text-red-600 text-sm'}>{msg.text}</p>
) : null}
</form>
</section>
);
}