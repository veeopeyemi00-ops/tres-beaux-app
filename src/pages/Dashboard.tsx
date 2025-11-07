
import React, { useEffect, useState } from 'react';

const API = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080';

type Finding = { prob: number; severity: string };
type Row = {
  image_id: string;
  ts?: number;
  quality?: { blur: number; glare: number; usable: boolean };
  findings?: Record<string, Finding>;
  model_version?: string;
};

export default function Dashboard(){
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRows(){
    setLoading(true);
    try{
      const r = await fetch(`${API}/admin/records`);
      const j = await r.json();
      setRows(j.items || []);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchRows(); },[]);

  function topFindings(r: Row){
    if (!r.findings) return '—';
    const ordered = Object.entries(r.findings)
      .sort((a,b)=> b[1].prob - a[1].prob)
      .slice(0,3);
    return ordered.map(([k,v])=> `${k}: ${v.severity}`).join(' · ');
  }

  async function del(image_id: string){
    if (!confirm('Delete this record?')) return;
    await fetch(`${API}/admin/record/${image_id}`, { method:'DELETE' });
    fetchRows();
  }

  return (
    <div style={{fontFamily:'system-ui', padding:24}}>
      <h1>Tres Beaux Admin</h1>
      <p>Scans logged by the backend (local JSONL store). </p>
      <button onClick={fetchRows} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
      <table style={{width:'100%', marginTop:16, borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>When</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>Image ID</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>Quality</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>Top findings</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>{
            const when = r.ts ? new Date(r.ts*1000).toLocaleString() : '—';
            const q = r.quality ? `blur ${r.quality.blur} · glare ${r.quality.glare}` : '—';
            return (
              <tr key={r.image_id}>
                <td style={{borderBottom:'1px solid #eee', padding:8}}>{when}</td>
                <td style={{borderBottom:'1px solid #eee', padding:8}}>{r.image_id}</td>
                <td style={{borderBottom:'1px solid #eee', padding:8}}>{q}</td>
                <td style={{borderBottom:'1px solid #eee', padding:8}}>{topFindings(r)}</td>
                <td style={{borderBottom:'1px solid #eee', padding:8}}>
                  <a href={`${API}/report/${r.image_id}`} target="_blank" rel="noreferrer">View report</a>
                  {'  ·  '}
                  <button onClick={()=>del(r.image_id)} style={{background:'none', border:'none', color:'#b00', cursor:'pointer'}}>Delete</button>
                </td>
              </tr>
            );
          })}
          {!rows.length && !loading && (
            <tr><td colSpan={5} style={{padding:12, color:'#777'}}>No records yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
