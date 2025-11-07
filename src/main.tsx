import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard'
import WellnessLibrary from './pages/WellnessLibrary'

function App(){
  const [tab, setTab] = useState<'dashboard'|'library'>('dashboard')
  const API = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080';

  return (
    <div>
      <div style={{display:'flex', gap:12, padding:16, borderBottom:'1px solid #eee', fontFamily:'system-ui'}}>
        <button onClick={()=>setTab('dashboard')} style={{padding:'8px 12px', cursor:'pointer', border:'1px solid #ddd', background: tab==='dashboard' ? '#f7f7f7' : '#fff'}}>Dashboard</button>
        <button onClick={()=>setTab('library')}   style={{padding:'8px 12px', cursor:'pointer', border:'1px solid #ddd', background: tab==='library'   ? '#f7f7f7' : '#fff'}}>Wellness Library</button>
        <div style={{marginLeft:'auto', color:'#666'}}>API: {API}</div>
      </div>
      {tab==='dashboard' ? <Dashboard/> : <WellnessLibrary/>}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App/>)
