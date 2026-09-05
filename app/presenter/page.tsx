'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Monitor } from 'lucide-react';
import {
  PRESENTER_CHANNEL,
  isPresenterState,
  type PresenterState,
} from '../presenter-state';
export default function Presenter() {
  const [state, setState] = useState<PresenterState | null>(null);
  const [connected, setConnected] = useState(false);
  const [supported, setSupported] = useState(true);
  const channel = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      setSupported(false);
      return;
    }
    const c = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.current = c;
    c.onmessage = ({ data }) => {
      if (data?.type === 'state' && isPresenterState(data.state)) {
        setState(data.state);
        setConnected(true);
      }
      if (data?.type === 'disconnected') setConnected(false);
    };
    c.postMessage({ type: 'request-state' });
    const onFocus = () => c.postMessage({ type: 'request-state' });
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        c.postMessage({
          type: 'navigate',
          delta: event.key === 'ArrowRight' ? 1 : -1,
        });
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('keydown', onKey);
    return () => {
      c.close();
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
    <main className="speaker-workspace">
      <header className="speaker-header">
        <span>
          <Monitor size={23} /> หน้าต่างผู้บรรยาย
        </span>
        <span
          className={connected ? 'connection-live' : 'connection-wait'}
          role="status"
        >
          {connected ? 'เชื่อมต่อกับหน้าฉายแล้ว' : 'รอหน้าฉายเชื่อมต่อ'}
        </span>
      </header>
      <p className="speaker-instruction">
        ใช้การแสดงผลแบบขยายจอ (Extend) วางหน้าต่างนี้บนคอมพิวเตอร์ และวางหน้าฉายบนทีวี
      </p>
      {!supported ? (
        <p className="speaker-empty">
          เบราว์เซอร์นี้ไม่รองรับการเชื่อมต่อหน้าต่าง กรุณาเปิดด้วยเบราว์เซอร์รุ่นปัจจุบัน
        </p>
      ) : state ? (
        <>
          <div className="speaker-current">
            <span>
              ช่วง {state.index + 1} / {state.total}
            </span>
            <h1>{state.title}</h1>
          </div>
          <div className="speaker-content">
            <article>
              <h2>บันทึกช่วยพูด</h2>
              <p>{state.note}</p>
            </article>
            <img
              src={`/photos/image${state.photoId}.webp`}
              alt={`ภาพประกอบช่วง ${state.title}`}
            />
          </div>
          <footer className="speaker-controls">
            <button
              disabled={!connected || state.index === 0}
              onClick={() =>
                channel.current?.postMessage({ type: 'navigate', delta: -1 })
              }
            >
              <ArrowLeft size={22} /> ย้อนกลับ
            </button>
            <span>ถัดไป: {state.nextTitle || 'จบการนำเสนอ'}</span>
            <button
              disabled={!connected || state.index === state.total - 1}
              onClick={() =>
                channel.current?.postMessage({ type: 'navigate', delta: 1 })
              }
            >
              ถัดไป <ArrowRight size={22} />
            </button>
          </footer>
        </>
      ) : (
        <div className="speaker-empty">
          <h1>เปิดหน้าฉายไว้ในเบราว์เซอร์เดียวกัน</h1>
          <p>บันทึกจะเปลี่ยนตามช่วงที่กำลังนำเสนอโดยอัตโนมัติ</p>
          <a href="/" target="worawut-audience" className="outline-pill">
            เปิดหน้าฉาย <ArrowRight size={20} />
          </a>
        </div>
      )}
    </main>
  );
}
