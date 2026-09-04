'use client';
import {useCallback,useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Grid2X2,Maximize,NotebookPen,ArrowUpRight} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {slides, type Photo} from './slides';
export default function Home(){
 const [index,setIndex]=useState(0),[overview,setOverview]=useState(false),[notes,setNotes]=useState(false),[photo,setPhoto]=useState<Photo|null>(null),[error,setError]=useState('');
 const go=useCallback((n:number)=>{const next=Math.max(0,Math.min(slides.length-1,n));setIndex(next);history.replaceState(null,'',`#${next+1}`);},[]);
 const fullscreen=useCallback(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();setError('');}catch{setError('เปิดเต็มจอไม่ได้ในหน้าต่างนี้ กรุณาเปิดลิงก์ในเบราว์เซอร์แล้วลองอีกครั้ง');}},[]);
 useEffect(()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>0&&n<=slides.length)setIndex(n-1);},[]);
 useEffect(()=>{function key(e:KeyboardEvent){if(overview||photo||e.ctrlKey||e.metaKey||e.altKey)return;if((e.target as HTMLElement).closest('button,input,textarea'))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(index+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(index-1);}if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(e.key.toLowerCase()==='f')void fullscreen();if(e.key.toLowerCase()==='n')setNotes(v=>!v);if(e.key.toLowerCase()==='g')setOverview(true);}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[index,overview,photo,go,fullscreen]);
 const s=slides[index];
 return <main className="presentation">
 <section className={`stage ${s.type||'feature'}`} aria-label={`หน้า ${index+1} ${s.title.replace('\n',' ')}`}>
 <header className="masthead"><span className="brand"><img src="/photos/image67.webp" alt=""/>โรงเรียนบ้านขัวก่าย</span><span>การเตรียมความพร้อมและพัฒนาอย่างเข้ม <b>ครั้งที่ 04</b></span></header>
 <div key={index} className="slide-body">
 <div className="copy"><div className="eyebrow"><span className="dot"/>{s.chapter}</div><h1>{s.title.split('\n').map((t,i)=><span key={i}>{t}</span>)}</h1><p className="lead">{s.lead}</p>
 {s.type==='cover'&&<><p className="role">ครูผู้ช่วย · โรงเรียนบ้านขัวก่าย<br/>สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสกลนคร เขต 3</p><div className="period">ช่วงรายงาน <b>1 พ.ย. 2567 — 31 ต.ค. 2569</b></div><button className="start" onClick={()=>go(index+1)}>เริ่มการนำเสนอ <ArrowUpRight/></button></>}
 {s.points&&<ul className="points">{s.points.map((p,i)=><li key={p}><span>{String(i+1).padStart(2,'0')}</span>{p}</li>)}</ul>}
 {s.number&&<div className="metric"><strong>{s.number}</strong><span>{s.label}</span></div>}
 </div>
 <div className={`visual photos-${s.photos.length}`}>{s.photos.map((p,i)=><button key={p.id} className={`photo photo-${i} ${p.contain?'contain':''}`} onClick={()=>setPhoto(p)} aria-label={`ขยายภาพ ${p.caption}`}><img src={`/photos/image${p.id}.webp`} alt={p.caption} style={{objectPosition:p.position||'center'}} loading={index===0?'eager':'lazy'}/><span className="caption">{p.caption}<ArrowUpRight/></span></button>)}{s.type==='cover'&&<span className="photo-badge">เรียนรู้ · ลงมือทำ · พัฒนา</span>}</div>
 </div>
 <footer className="slide-footer"><span>WORAWUT MUNGTHISAN <span className="footer-sep">/</span> TEACHING PORTFOLIO</span><span>{String(index+1).padStart(2,'0')} <i>/ {slides.length}</i></span></footer>
 <div className="progress" style={{width:`${(index+1)/slides.length*100}%`}}/>
 </section>
 <nav className="controls" aria-label="ควบคุมการนำเสนอ"><div className="tools"><button onClick={()=>setOverview(true)} title="เลือกหน้า (G)"><Grid2X2/><span>ทุกหน้า</span></button><button onClick={()=>setNotes(v=>!v)} aria-pressed={notes} title="บันทึกช่วยพูด (N)"><NotebookPen/><span>บันทึกช่วยพูด</span></button><button onClick={fullscreen} title="เต็มจอ (F)"><Maximize/><span>เต็มจอ</span></button></div><span className="key-hint">กด ← → เพื่อเปลี่ยนหน้า</span><div className="paging"><button disabled={index===0} onClick={()=>go(index-1)} aria-label="หน้าก่อนหน้า"><ArrowLeft/></button><span aria-live="polite">{index+1} / {slides.length}</span><button className="next" disabled={index===slides.length-1} onClick={()=>go(index+1)} aria-label="หน้าถัดไป"><ArrowRight/></button></div></nav>
 {error&&<p role="status" className="notice">{error}</p>}
 {notes&&<aside className="speaker"><div><b>บันทึกช่วยพูด · หน้า {index+1}</b><button onClick={()=>setNotes(false)}>ปิด ×</button></div><p>{s.note}</p><small>บันทึกนี้แสดงบนจอเดียวกัน กด N เพื่อซ่อนก่อนนำเสนอ</small></aside>}
 <Dialog open={overview} onOpenChange={setOverview}><DialogContent className="overview"><DialogTitle>เลือกหน้าที่ต้องการนำเสนอ</DialogTitle><DialogDescription>ผลงานตลอดช่วงรายงาน 2567–2569 · {slides.length} หน้า</DialogDescription><div className="slide-grid">{slides.map((slide,i)=><button className={i===index?'selected':''} key={i} onClick={()=>{go(i);setOverview(false);}}><img src={`/photos/image${slide.photos[0]?.id||55}.webp`} alt=""/><span><small>{String(i+1).padStart(2,'0')} · {slide.chapter}</small><b>{slide.title.replace('\n',' ')}</b></span></button>)}</div></DialogContent></Dialog>
 <Dialog open={!!photo} onOpenChange={v=>{if(!v)setPhoto(null);}}><DialogContent className="lightbox"><DialogTitle>{photo?.caption}</DialogTitle><DialogDescription>ภาพหลักฐานจากภาคผนวกรายงานการประเมินครั้งที่ 4</DialogDescription>{photo&&<img src={`/photos/image${photo.id}.webp`} alt={photo.caption}/>}</DialogContent></Dialog>
 </main>;
}
