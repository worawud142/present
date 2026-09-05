'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Grid2X2,
  NotebookPen,
  X,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { slides, type Photo } from './slides';
const stops = [
  { id: 'intro', name: 'เริ่มต้น', note: 0 },
  { id: 'story', name: 'ภาพการทำงาน', note: 2 },
  { id: 'about', name: 'รู้จักครูวรวุฒิ', note: 1 },
  { id: 'values', name: 'การปฏิบัติตน', note: 3 },
  { id: 'practice', name: 'การปฏิบัติงาน', note: 7 },
  { id: 'project-1', name: 'สื่อคอมพิวเตอร์', note: 9 },
  { id: 'project-2', name: 'ฝึกทักษะการใช้เมาส์', note: 10 },
  { id: 'project-3', name: 'กิจกรรมหุ่นยนต์', note: 11 },
  { id: 'outcomes', name: 'ผลที่เกิดขึ้น', note: 17 },
  { id: 'next', name: 'ก้าวต่อไป', note: 18 },
  { id: 'thanks', name: 'ขอบคุณ', note: 19 },
];
const values = [
  ['วินัยและการรักษาวินัย', 'รับผิดชอบหน้าที่ ตรงต่อเวลา และปฏิบัติตามระเบียบ', 3],
  ['คุณธรรม จริยธรรม', 'มีเมตตา ร่วมสืบสานศาสนาและวัฒนธรรม', 4],
  ['จรรยาบรรณวิชาชีพ', 'วางตนเหมาะสม และปฏิบัติต่อผู้เรียนอย่างเป็นธรรม', 4],
  ['หลักปรัชญาของเศรษฐกิจพอเพียง', 'ใช้ทรัพยากรอย่างพอประมาณและมีเหตุผล', 5],
  ['จิตวิญญาณความเป็นครู', 'ใส่ใจผู้เรียนและช่วยเหลือระหว่างการเรียนรู้', 6],
  ['จิตสำนึกความรับผิดชอบในวิชาชีพ', 'พัฒนางานและร่วมมือกับเพื่อนครู', 6],
] as const;
const practice = [
  ['การจัดการเรียนการสอน', 'วิเคราะห์หลักสูตร ออกแบบกิจกรรม และติดตามจากชิ้นงาน', 7],
  ['การบริหารจัดการชั้นเรียน', 'เตรียมห้องคอมพิวเตอร์และดูแลผู้เรียนรายบุคคล', 8],
  ['การพัฒนาตนเอง', 'อบรม Arduino หุ่นยนต์ สื่อดิจิทัล และงานวิชาการ', 13],
  ['การทำงานเป็นทีม', 'แลกเปลี่ยนเรียนรู้และช่วยเหลืองานเทคโนโลยี', 14],
  ['งานตามภารกิจของสถานศึกษา', 'งานประชาสัมพันธ์ เวรประจำวัน และส่งเสริมสุขภาพ', 15],
  ['การใช้ภาษาและเทคโนโลยีดิจิทัล', 'สื่อสารให้เหมาะกับผู้เรียนและใช้สื่อสนับสนุนการสอน', 16],
] as const;
const projects = [
  {
    name: 'สื่อที่เห็นภาพ\nและจับต้องได้',
    category: '01 / LEARNING MEDIA',
    desc: 'นำเรื่องคอมพิวเตอร์มาเล่าผ่านสื่อภาพ สัญลักษณ์ และชิ้นงาน',
    photos: [49, 50, 58],
    captions: ['สื่อโปรแกรมสำนักงาน', 'สัญลักษณ์และผังงาน', 'ชิ้นงานของผู้เรียน'],
    detail: 9,
    tags: ['Word · PowerPoint · Excel', 'เรียนรู้ผ่านชิ้นงาน'],
  },
  {
    name: 'ทักษะเล็ก ๆ\nที่ต่อยอดได้',
    category: '02 / INTERACTIVE LEARNING',
    desc: 'แอปพลิเคชันฝึกใช้เมาส์ เรียนรู้จากการคลิกและการฝึกซ้ำ',
    photos: [31, 56, 52],
    captions: ['การฝึกใช้คอมพิวเตอร์', 'ให้คำแนะนำระหว่างเรียน', 'แอปพลิเคชันฝึกใช้เมาส์'],
    detail: 10,
    tags: ['คลิก · คลิกขวา · ดับเบิลคลิก', 'กิจกรรมโต้ตอบ'],
  },
  {
    name: 'คิด ทดลอง\nและลงมือทำ',
    category: '03 / ROBOTICS',
    desc: 'กิจกรรมหุ่นยนต์ที่เปิดโอกาสให้ผู้เรียนสังเกต ทดลอง และเรียนรู้ร่วมกัน',
    photos: [41, 59, 51],
    captions: ['การฝึกปฏิบัติด้านหุ่นยนต์', 'การแบ่งปันความรู้', 'กิจกรรมหุ่นยนต์กับผู้เรียน'],
    detail: 11,
    tags: ['การคิดเป็นลำดับขั้น', 'เรียนรู้ร่วมกัน'],
  },
];
const gallery = [
  [55, 58, 51, 49, 36, 56],
  [60, 64, 9, 27, 40, 59],
];
const galleryLabels: Record<number, string> = {
  55: 'การสอนในห้องคอมพิวเตอร์',
  58: 'ชิ้นงานของผู้เรียน',
  51: 'กิจกรรมหุ่นยนต์',
  49: 'สื่อคอมพิวเตอร์',
  36: 'กิจกรรมในชั้นเรียน',
  56: 'การดูแลระหว่างเรียน',
  60: 'ร่วมงานกับเพื่อนครู',
  64: 'ส่งเสริมสุขภาพ',
  9: 'กิจกรรมวัฒนธรรม',
  27: 'ดูแลพื้นที่ส่วนรวม',
  40: 'พัฒนาตนเอง',
  59: 'แบ่งปันความรู้',
};
export default function Home() {
  const root = useRef<HTMLElement>(null),
    marquee = useRef<HTMLElement>(null),
    about = useRef<HTMLElement>(null),
    portrait = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0),
    [menu, setMenu] = useState(false),
    [notes, setNotes] = useState(false),
    [detail, setDetail] = useState<number | null>(null),
    [photo, setPhoto] = useState<Photo | null>(null),
    [notice, setNotice] = useState('');
  const go = useCallback((n: number) => {
    const i = Math.min(stops.length - 1, Math.max(0, n));
    document
      .getElementById(stops[i].id)
      ?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      });
    history.replaceState(null, '', `#${stops[i].id}`);
  }, []);
  const fullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice('');
    } catch {
      setNotice('เปิดเต็มจอไม่ได้ในหน้าต่างนี้ กรุณาเปิดลิงก์ในเบราว์เซอร์แล้วกด F อีกครั้ง');
    }
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = innerHeight;
      let current = 0;
      stops.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < h * 0.46) current = i;
      });
      setActive(current);
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        const y = marquee.current?.getBoundingClientRect().top || 0;
        marquee.current?.style.setProperty(
          '--marquee-shift',
          `${Math.max(-220, Math.min(220, (h * 0.5 - y) * 0.2))}px`,
        );
        const t = about.current?.getBoundingClientRect().top || 0;
        const p = Math.max(0, Math.min(1, (h * 0.8 - t) / (h * 0.75)));
        about.current
          ?.querySelectorAll<HTMLElement>('[data-word]')
          .forEach((el, i) => {
            el.style.opacity = String(
              0.23 + 0.77 * Math.max(0, Math.min(1, p * 8 - i * 0.65)),
            );
          });
        root.current
          ?.querySelectorAll<HTMLElement>('.project-card')
          .forEach((el, i) => {
            const next = document.getElementById(`project-${i + 2}`);
            const overlap = next
              ? Math.max(
                  0,
                  Math.min(1, (h - next.getBoundingClientRect().top) / h),
                )
              : 0;
            el.style.setProperty('--card-scale', String(1 - overlap * 0.035));
          });
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    const timer = setTimeout(() => {
      const target = stops.findIndex((s) => s.id === location.hash.slice(1));
      if (target >= 0) go(target);
    }, 100);
    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [go]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        menu ||
        detail !== null ||
        photo ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return;
      if ((e.target as HTMLElement).closest('input,textarea,[contenteditable]'))
        return;
      if (['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(active + (['ArrowRight', 'PageDown'].includes(e.key) ? 1 : -1));
      }
      if (e.key === ' ' && !(e.target as HTMLElement).closest('button,a')) {
        e.preventDefault();
        go(active + 1);
      }
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        void fullscreen();
      }
      if (e.key.toLowerCase() === 'n') setNotes((v) => !v);
      if (e.key.toLowerCase() === 'g') setMenu(true);
      if (e.key === 'Escape') setNotes(false);
      if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        go(stops.length - 1);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [active, menu, detail, photo, go, fullscreen]);
  const openPhoto = (id: number, caption: string) => setPhoto({ id, caption });
  const competency = (
    id: string,
    title: string,
    english: string,
    items: typeof values | typeof practice,
  ) => (
    <section className={`scene competency ${id}`} id={id}>
      <div className="section-top flex justify-between">
        <span>{english}</span>
        <span>6 องค์ประกอบ / การประเมินครั้งที่ 4</span>
      </div>
      <h2 className="display-heading">
        {title}
        <span>✳</span>
      </h2>
      <div className="competency-list">
        {items.map(([name, description, n], i) => (
          <button
            key={name}
            onClick={() => setDetail(n)}
            className="competency-row group"
          >
            <span className="row-number">0{i + 1}</span>
            <span className="row-copy">
              <b>{name}</b>
              <span>{description}</span>
            </span>
            <span className="row-link group-hover:rotate-45">
              <ArrowUpRight />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
  return (
    <main ref={root}>
      <section
        className="hero scene"
        id="intro"
        onPointerMove={(e) => {
          if (
            e.pointerType !== 'mouse' ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const r = e.currentTarget.getBoundingClientRect();
          portrait.current?.style.setProperty(
            '--mx',
            `${(e.clientX - r.width / 2) / 45}px`,
          );
          portrait.current?.style.setProperty(
            '--my',
            `${(e.clientY - r.top - r.height / 2) / 45}px`,
          );
        }}
        onPointerLeave={() => {
          portrait.current?.style.setProperty('--mx', '0px');
          portrait.current?.style.setProperty('--my', '0px');
        }}
      >
        <nav className="hero-nav flex items-center justify-between">
          <button onClick={() => go(2)} className="nav-link">
            เกี่ยวกับผม
          </button>
          <button onClick={() => go(3)} className="nav-link">
            การปฏิบัติตน
          </button>
          <button onClick={() => go(5)} className="nav-link">
            ผลงานเด่น
          </button>
          <button onClick={() => go(8)} className="nav-link">
            ผลลัพธ์
          </button>
        </nav>
        <div className="hero-title">
          <span className="hero-kicker">
            การเตรียมความพร้อมและพัฒนาอย่างเข้ม ครั้งที่ 4 · โรงเรียนบ้านขัวก่าย
          </span>
          <h1>
            วรวุฒิ
            <span className="name-spark" aria-hidden="true">
              ✳
            </span>
          </h1>
          <span className="hero-surname">มุงธิสาร</span>
        </div>
        <div className="hero-bottom">
          <p>
            2 ปีแห่งการเรียนรู้
            <br />
            การลงมือทำ
            <br />
            <b>และการเติบโตในวิชาชีพครู</b>
            <small>ช่วงรายงาน 1 พ.ย. 2567 — 31 ต.ค. 2569</small>
          </p>
          <figure className="portrait" ref={portrait}>
            <img
              src="/photos/image1.webp"
              alt="นายวรวุฒิ มุงธิสาร ครูผู้ช่วย"
              fetchPriority="high"
            />
            <figcaption>
              <span>COMPUTER EDUCATION</span>
              <ArrowUpRight />
            </figcaption>
          </figure>
          <button onClick={() => go(1)} className="gradient-pill">
            สำรวจผลงาน <ArrowDown size={20} />
          </button>
        </div>
        <span className="hero-side">TEACH • LEARN • CREATE</span>
      </section>
      <section id="story" ref={marquee} className="scene marquee-section">
        <div className="section-top flex justify-between px-[4vw]">
          <span>THE PAST TWO YEARS</span>
          <span>ภาพกิจกรรมจากรายงาน</span>
        </div>
        <h2 className="gallery-heading">
          ทุกการลงมือทำ
          <br />
          <span>คือส่วนหนึ่งของการเรียนรู้</span>
        </h2>
        <div className="marquee-window">
          {gallery.map((row, r) => (
            <div key={r} className={`marquee-row row-${r}`}>
              {[...row, ...row].map((id, i) => (
                <button
                  key={`${id}-${i}`}
                  onClick={() => openPhoto(id, galleryLabels[id])}
                  tabIndex={i >= row.length ? -1 : 0}
                  aria-hidden={i >= row.length ? true : undefined}
                >
                  <img
                    src={`/photos/image${id}.webp`}
                    alt={i >= row.length ? '' : galleryLabels[id]}
                    loading="lazy"
                  />
                  <span>
                    {galleryLabels[id]}
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section id="about" ref={about} className="scene about-section">
        <span className="section-top">ABOUT ME / รู้จักครูวรวุฒิ</span>
        <h2 className="display-heading">
          ครูผู้ช่วย<span>✳</span>
        </h2>
        <p className="about-text">
          {[
            'ผมเชื่อในการเรียนรู้',
            'ที่ให้ผู้เรียนได้ลงมือทำ',
            'ใช้ความรู้ด้านคอมพิวเตอร์',
            'ออกแบบสื่อและกิจกรรม',
            'เพื่อให้ห้องเรียน',
            'เป็นพื้นที่ของการทดลอง',
            'และการพัฒนาตนเอง',
          ].map((t) => (
            <span data-word key={t}>
              {t}{' '}
            </span>
          ))}
        </p>
        <div className="about-facts grid grid-cols-3">
          <div>
            <strong>20</strong>
            <span>คาบสอน / สัปดาห์</span>
          </div>
          <div>
            <strong>ป.1–ม.3</strong>
            <span>คอมพิวเตอร์และวิทยาการคำนวณ</span>
          </div>
          <div>
            <strong>ม.1</strong>
            <span>ครูที่ปรึกษา</span>
          </div>
        </div>
        <button onClick={() => setDetail(1)} className="outline-pill">
          ประวัติและบทบาท <ArrowUpRight size={20} />
        </button>
        <img
          className="about-photo about-photo-left"
          src="/photos/image49.webp"
          alt="สื่อคอมพิวเตอร์"
          loading="lazy"
        />
        <img
          className="about-photo about-photo-right"
          src="/photos/image51.webp"
          alt="กิจกรรมหุ่นยนต์"
          loading="lazy"
        />
      </section>
      {competency('values', 'การปฏิบัติตน', '01 / PROFESSIONAL VALUES', values)}
      {competency('practice', 'การปฏิบัติงาน', '02 / TEACHING PRACTICE', practice)}
      <section className="projects-section">
        <div className="project-heading">
          <span className="section-top">SELECTED WORK / ผลงานเด่น</span>
          <h2 className="display-heading">
            ผลงานที่ลงมือทำ<span>✳</span>
          </h2>
          <p>ความถนัดด้านคอมพิวเตอร์ สู่กิจกรรมและสื่อในห้องเรียน</p>
        </div>
        <div className="project-stack">
          {projects.map((p, i) => (
            <article
              key={p.name}
              id={`project-${i + 1}`}
              className={`project-card project-${i + 1}`}
              style={{ top: `${24 + i * 15}px` }}
            >
              <div className="project-top">
                <span className="project-number">0{i + 1}</span>
                <div>
                  <span className="section-top">{p.category}</span>
                  <h3>{p.name.replace('\n', ' ')}</h3>
                </div>
                <button
                  className="outline-pill"
                  onClick={() => setDetail(p.detail)}
                >
                  ดูรายละเอียด <ArrowUpRight size={20} />
                </button>
              </div>
              <div className="project-images">
                {p.photos.map((id, j) => (
                  <button
                    key={id}
                    className={`project-image image-${j} ${id === 52 ? 'app-screenshot' : ''}`}
                    onClick={() => openPhoto(id, p.captions[j])}
                  >
                    <img
                      src={`/photos/image${id}.webp`}
                      alt={p.captions[j]}
                      loading="lazy"
                    />
                    <span>
                      {p.captions[j]}
                      <Plus size={20} />
                    </span>
                  </button>
                ))}
              </div>
              <div className="project-bottom">
                <p>{p.desc}</p>
                <div>
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="outcomes" className="scene outcomes">
        <div className="section-top flex justify-between">
          <span>WHAT WE CREATED</span>
          <span>ผลที่ปรากฏจากหลักฐาน</span>
        </div>
        <h2 className="display-heading">
          สิ่งที่เกิดขึ้น<span>↗</span>
        </h2>
        <div className="outcome-grid grid md:grid-cols-3">
          {[
            { id: 58, title: 'ผู้เรียน', text: 'ได้ฝึกปฏิบัติและสร้างชิ้นงาน', n: 12 },
            {
              id: 49,
              title: 'การเรียนรู้',
              text: 'มีสื่อและกิจกรรมคอมพิวเตอร์ที่หลากหลาย',
              n: 9,
            },
            {
              id: 53,
              title: 'สถานศึกษา',
              text: 'ห้องคอมพิวเตอร์และงานเทคโนโลยีได้รับการดูแล',
              n: 8,
            },
          ].map((x, i) => (
            <button
              className="outcome-item text-left"
              key={x.id}
              onClick={() => setDetail(x.n)}
            >
              <img
                src={`/photos/image${x.id}.webp`}
                alt={x.text}
                loading="lazy"
              />
              <div className="flex justify-between items-center">
                <h3>{x.title}</h3>
                <span>0{i + 1}</span>
              </div>
              <p>{x.text}</p>
              <span className="outcome-link">
                ดูหลักฐาน <ArrowUpRight size={18} />
              </span>
            </button>
          ))}
        </div>
        <p className="source-note">
          สรุปจากผลงานและภาพภาคผนวกในรายงานการประเมินครั้งที่ 4
        </p>
      </section>
      <section id="next" className="scene next-section">
        <span className="section-top">THE NEXT CHAPTER / แนวทางพัฒนาต่อไป</span>
        <div className="next-layout">
          <h2>
            เรียนรู้ต่อ
            <br />
            พัฒนาต่อ<span>↗</span>
          </h2>
          <div className="next-list">
            {[
              'พัฒนาสื่อให้เหมาะกับทักษะที่แตกต่าง',
              'เก็บชิ้นงานและพัฒนาการรายบุคคล',
              'ใช้ผลสะท้อนกลับปรับกิจกรรมการสอน',
            ].map((t, i) => (
              <div key={t}>
                <span>0{i + 1}</span>
                <p>{t}</p>
              </div>
            ))}
            <button className="gradient-pill" onClick={() => setDetail(18)}>
              แนวทางการพัฒนา <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
        <p className="source-note">แนวทางสำหรับการทำงานในระยะต่อไป</p>
      </section>
      <section id="thanks" className="scene closing-section">
        <span className="section-top">THANK YOU / ขอบคุณคณะกรรมการ</span>
        <h2>
          พร้อมเรียนรู้
          <br />
          <span>และเติบโตต่อไป</span>
        </h2>
        <div className="closing-bottom">
          <div>
            <p>นายวรวุฒิ มุงธิสาร</p>
            <span>
              ครูผู้ช่วย โรงเรียนบ้านขัวก่าย
              <br />
              สพป.สกลนคร เขต 3
            </span>
          </div>
          <button className="gradient-pill" onClick={() => setMenu(true)}>
            ทบทวนผลงาน <ArrowUpRight size={20} />
          </button>
        </div>
        <div className="closing-strip">
          {[55, 51, 58, 60].map((id) => (
            <img
              key={id}
              src={`/photos/image${id}.webp`}
              alt={galleryLabels[id]}
              loading="lazy"
            />
          ))}
        </div>
      </section>
      <nav className="presenter-dock" aria-label="ควบคุมการนำเสนอ">
        <div className="dock-tools flex items-center">
          <button
            onClick={() => setMenu(true)}
            aria-label="สารบัญ (G)"
            title="สารบัญ (G)"
          >
            <Grid2X2 size={19} />
          </button>
          <button
            onClick={() => setNotes((v) => !v)}
            aria-label="บันทึกช่วยพูด (N)"
            title="บันทึกช่วยพูด (N)"
            aria-pressed={notes}
          >
            <NotebookPen size={19} />
          </button>
          <button onClick={fullscreen} aria-label="เต็มจอ (F)" title="เต็มจอ (F)">
            <Maximize size={18} />
          </button>
        </div>
        <span className="dock-title">{stops[active].name}</span>
        <div className="flex items-center gap-2">
          <button
            disabled={active === 0}
            onClick={() => go(active - 1)}
            aria-label="ช่วงก่อนหน้า"
          >
            <ArrowLeft size={19} />
          </button>
          <span className="dock-counter" aria-live="polite">
            {String(active + 1).padStart(2, '0')}
            <i> / {stops.length}</i>
          </span>
          <button
            disabled={active === stops.length - 1}
            onClick={() => go(active + 1)}
            aria-label="ช่วงถัดไป"
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </nav>
      {notes && (
        <aside className="speaker-notes">
          <div className="flex justify-between items-center">
            <b>{stops[active].name} · บันทึกช่วยพูด</b>
            <button onClick={() => setNotes(false)} aria-label="ปิดบันทึก">
              <X size={20} />
            </button>
          </div>
          <p>{slides[stops[active].note].note}</p>
          <small>บันทึกนี้แสดงบนจอเดียวกัน กด N เพื่อซ่อน</small>
        </aside>
      )}
      {notice && (
        <div role="status" className="notice">
          {notice}
          <button onClick={() => setNotice('')} aria-label="ปิด">
            <X size={18} />
          </button>
        </div>
      )}
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent className="contents-dialog">
          <DialogTitle>เลือกช่วงการนำเสนอ</DialogTitle>
          <DialogDescription>
            ผลงานครูผู้ช่วย · ช่วงรายงาน 2567–2569
          </DialogDescription>
          <div className="contents-grid">
            {stops.map((s, i) => (
              <button
                className={active === i ? 'selected' : ''}
                key={s.id}
                onClick={() => {
                  setMenu(false);
                  go(i);
                }}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <b>{s.name}</b>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={detail !== null}
        onOpenChange={(v) => {
          if (!v) setDetail(null);
        }}
      >
        <DialogContent className="detail-dialog">
          {detail !== null && (
            <>
              <DialogTitle>
                {slides[detail].title.replace('\n', ' ')}
              </DialogTitle>
              <DialogDescription>{slides[detail].chapter}</DialogDescription>
              <p className="detail-lead">{slides[detail].lead}</p>
              <div className="detail-photos">
                {slides[detail].photos.map((p) => (
                  <button key={p.id} onClick={() => setPhoto(p)}>
                    <img src={`/photos/image${p.id}.webp`} alt={p.caption} />
                    <span>{p.caption}</span>
                  </button>
                ))}
              </div>
              <ul>
                {slides[detail].points?.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="source-note">
                อ้างอิงรายงานและภาพภาคผนวก การประเมินครั้งที่ 4
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!photo}
        onOpenChange={(v) => {
          if (!v) setPhoto(null);
        }}
      >
        <DialogContent className="lightbox">
          <DialogTitle>{photo?.caption}</DialogTitle>
          <DialogDescription>ภาพกิจกรรมจากภาคผนวกรายงาน</DialogDescription>
          {photo && (
            <img src={`/photos/image${photo.id}.webp`} alt={photo.caption} />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
