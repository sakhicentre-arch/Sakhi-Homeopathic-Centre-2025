'use client';
import useSWR from 'swr';
const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function QueuePage() {
const { data: visits, mutate } = useSWR('/api/visits', fetcher, { refreshInterval: 4000 });
const statuses = ['ARRIVED','IN_CONSULT','DONE'];

const setStatus = async (id:number, status:string)=>{
await fetch('/api/visits', {
method: 'PATCH',
headers: { 'Content-Type':'application/json' },
body: JSON.stringify({ id, status }),
});
mutate();
};

return (
<section className="space-y-4">
<h2 className="text-xl font-semibold">Today’s Queue</h2>
<div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow">
<table className="min-w-[720px]">
<thead>
<tr>
<th className="px-3 py-2">ID</th>
<th className="px-3 py-2">Time</th>
<th className="px-3 py-2">Clinic</th>
<th className="px-3 py-2">Patient</th>
<th className="px-3 py-2">Mobile</th>
<th className="px-3 py-2">Status</th>
<th className="px-3 py-2">Actions</th>
</tr>
</thead>
<tbody>
{visits?.map((v:any)=>(
<tr key={v.id}>
<td className="px-3 py-2">{v.id}</td>
<td className="px-3 py-2">{new Date(v.date).toLocaleTimeString()}</td>
<td className="px-3 py-2">{v.clinic?.name}</td>
<td className="px-3 py-2">{v.patient?.name}</td>
<td className="px-3 py-2">{v.patient?.mobile}</td>
<td className="px-3 py-2">{v.status}</td>
<td className="px-3 py-2">
<div className="flex gap-2">
{statuses.map(s=>(
<button key={s} onClick={()=>setStatus(v.id, s)} disabled={v.status===s} className="px-2 py-1 text-xs">
{s}
</button>
))}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
);
}