'use client';
import { useState } from 'react';

export default function NewPatientPage() {
const [form, setForm] = useState({ name: '', mobile: '', age: '', gender: '' });
const [msg, setMsg] = useState<{type:'ok'|'err'|''; text:string}>({type:'', text:''});

const submit = async (e: React.FormEvent) => {
e.preventDefault();
setMsg({type:'', text:''});
const res = await fetch('/api/patients', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
name: form.name.trim(),
mobile: form.mobile.trim(),
age: form.age,
gender: form.gender || null,
}),
});
if (res.ok) {
setMsg({type:'ok', text:'Patient saved'});
setForm({ name: '', mobile: '', age: '', gender: '' });
} else {
const text = await res.text().catch(()=> 'Error');
setMsg({type:'err', text});
}
};

return (
<section className="space-y-4">
<h2 className="text-xl font-semibold">New Patient</h2>
<form onSubmit={submit} className="grid max-w-md gap-3 bg-white p-4 rounded-lg shadow">
<label className="grid gap-1">
<span className="text-sm text-slate-600">Name</span>
<input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
</label>
<label className="grid gap-1">
<span className="text-sm text-slate-600">Mobile</span>
<input value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} required />
</label>
<div className="grid grid-cols-2 gap-3">
<label className="grid gap-1">
<span className="text-sm text-slate-600">Age</span>
<input type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
</label>
<label className="grid gap-1">
<span className="text-sm text-slate-600">Gender</span>
<select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
<option value="">Select</option>
<option value="M">Male</option>
<option value="F">Female</option>
<option value="O">Other</option>
</select>
</label>
</div>
<button type="submit" className="mt-2">Save Patient</button>
{msg.text ? (
<p className={msg.type==='ok' ? 'text-green-700 text-sm' : 'text-red-600 text-sm'}>{msg.text}</p>
) : null}
</form>
<div className="text-sm">
<a className="text-blue-700 hover:underline" href="/visits/new">Go to New Visit</a>
</div>
</section>
);
}