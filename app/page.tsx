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
import { PRESENTER_CHANNEL, type PresenterState } from './presenter-state';
const stops = [
  { id: 'intro', name: 'เริ่มต้น', note: 0 },
  { id: 'story', name: 'ภาพการทำงาน', note: 2 },
  { id: 'about', name: 'รู้จักครูวรวุฒิ', note: 1 },
  { id: 'values', name: 'การปฏิบัติตน · 1–3', note: 3 },
  { id: 'values-more', name: 'การปฏิบัติตน · 4–6', note: 5 },
  { id: 'practice', name: 'การปฏิบัติงาน · 1–3', note: 7 },
  { id: 'practice-more', name: 'การปฏิบัติงาน · 4–6', note: 14 },
  { id: 'project-1', name: 'สื่อคอมพิวเตอร์', note: 9 },
  { id: 'project-2', name: 'ฝึกทักษะการใช้เมาส์', note: 10 },
  { id: 'project-3', name: 'กิจกรรมหุ่นยนต์', note: 11 },
  { id: 'achievements', name: 'ผลงานและความสำเร็จ', note: 13 },
  { id: 'certificates', name: 'การพัฒนาวิชาชีพ', note: 13 },
  { id: 'recognition', name: 'เกียรติยศและบทบาท', note: 14 },
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
type Certificate = {
  src: string;
  category: string;
  title: string;
  detail: string;
};
const certificateGroups: Record<string, readonly Certificate[]> = {
  achievements: [
    {
      src: '/certificates/robotics-champion.png',
      category: 'ชนะเลิศ · เหรียญทอง',
      title: 'การแข่งขันหุ่นยนต์ระดับพื้นฐาน ม.1–ม.3',
      detail: 'ครูผู้สอนนักเรียน · งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73 ปีการศึกษา 2568',
    },
    {
      src: '/certificates/best-practice-indigo.jpg',
      category: 'Best Practice · ดีเยี่ยม',
      title: 'ผลงาน “สีสวยด้วยคราม”',
      detail: 'ครูที่ปรึกษาผลงาน · บ้านนักวิทยาศาสตร์น้อย ประเทศไทย ปีการศึกษา 2568',
    },
    {
      src: '/certificates/comic-strip-gold.png',
      category: 'เหรียญทอง · รองชนะเลิศอันดับ 1',
      title: 'การสร้างการ์ตูนเรื่องสั้น Comic Strip',
      detail: 'ครูผู้สอนนักเรียน ระดับ ม.1–ม.3 · ปีการศึกษา 2567',
    },
    {
      src: '/certificates/computer-graphic-gold.png',
      category: 'เหรียญทอง',
      title: 'การ์ตูนด้วยโปรแกรมคอมพิวเตอร์กราฟิก',
      detail: 'ครูผู้สอนนักเรียน ระดับ ป.1–ป.3 · ปีการศึกษา 2567',
    },
    {
      src: '/certificates/health-quiz-gold.png',
      category: 'เหรียญทอง · รองชนะเลิศอันดับ 1',
      title: 'ตอบปัญหาสุขศึกษาและพลศึกษา',
      detail: 'ครูผู้สอนนักเรียน ระดับ ป.1–ป.6 · ปีการศึกษา 2568',
    },
    {
      src: '/certificates/paint-secondary-gold.png',
      category: 'เหรียญทอง · รองชนะเลิศอันดับ 1',
      title: 'วาดภาพด้วยโปรแกรม Paint',
      detail: 'ครูผู้สอนนักเรียนที่มีความบกพร่องทางการเรียนรู้ ระดับ ม.1–ม.3',
    },
  ],
  certificates: [
    {
      src: '/certificates/assessment-literacy.jpg',
      category: 'การวัดและประเมินผล · 12 ชั่วโมง',
      title: 'การสร้างข้อสอบวัดความฉลาดรู้',
      detail: 'อบรมออนไลน์ รุ่นที่ 3 · 8–14 ธันวาคม 2567',
    },
    {
      src: '/certificates/digital-pr-ai.png',
      category: 'สื่อดิจิทัลและ AI',
      title: 'พัฒนาเครือข่ายประชาสัมพันธ์และผลิตสื่อ',
      detail: 'อบรมเชิงปฏิบัติการ · 20–21 ธันวาคม 2567',
    },
    {
      src: '/certificates/arduino-media.jpeg',
      category: 'นวัตกรรมและเทคโนโลยี',
      title: 'สร้างสรรค์สื่อและนวัตกรรมด้วย Arduino',
      detail: 'อบรมเชิงปฏิบัติการ · 10–11 กุมภาพันธ์ 2568',
    },
    {
      src: '/certificates/robot-programming.jpeg',
      category: 'หุ่นยนต์และสิ่งประดิษฐ์',
      title: 'การเขียนโปรแกรมควบคุมหุ่นยนต์',
      detail: 'อบรมและแลกเปลี่ยนเรียนรู้ · 17–18 มีนาคม 2568',
    },
    {
      src: '/certificates/blended-learning-ai.jpeg',
      category: 'Blended Learning',
      title: 'แพลตฟอร์มการเรียนรู้และ AI ในการสอน',
      detail: 'อบรมเชิงปฏิบัติการ · 16 สิงหาคม 2568',
    },
    {
      src: '/certificates/obec-content-center-2569.jpg',
      category: 'OBEC Content Center',
      title: 'จัดการเรียนรู้ด้วยเทคโนโลยีดิจิทัล',
      detail: 'อบรมเชิงปฏิบัติการ · 26 พฤษภาคม 2569',
    },
  ],
  recognition: [
    {
      src: '/certificates/outstanding-educator-province.png',
      category: 'เกียรติยศระดับจังหวัด',
      title: 'ผู้ประกอบวิชาชีพทางการศึกษาดีเด่น',
      detail: 'วันครู ครั้งที่ 70 ประจำปี 2569 · ศึกษาธิการจังหวัดสกลนคร',
    },
    {
      src: '/certificates/outstanding-educator-district.png',
      category: 'เกียรติยศระดับอำเภอ',
      title: 'ผู้ประกอบวิชาชีพทางการศึกษาดีเด่น',
      detail: 'วันครู ครั้งที่ 70 ประจำปี 2569 · อำเภอวานรนิวาส',
    },
    {
      src: '/certificates/rov-judge.jpg',
      category: 'บทบาทกรรมการ',
      title: 'กรรมการแข่งขัน ROV',
      detail: 'ระดับประถมศึกษาและมัธยมศึกษา · กิจกรรมวันวิทยาศาสตร์ 2568',
    },
    {
      src: '/certificates/mixed-robot-judge.png',
      category: 'บทบาทกรรมการตัดสิน',
      title: 'การแข่งขันหุ่นยนต์ผสม ป.1–ป.6',
      detail: 'งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73 ปีการศึกษา 2568',
    },
    {
      src: '/certificates/little-scientist-review.png',
      category: 'แลกเปลี่ยนเรียนรู้',
      title: 'ประเมินผลงานบ้านนักวิทยาศาสตร์น้อย',
      detail: 'เข้าร่วมนำเสนอ ตรวจ และประเมินผลงาน · 13 มีนาคม 2569',
    },
    {
      src: '/certificates/robotics-trainer.jpg',
      category: 'บทบาทวิทยากร',
      title: 'ถอดบทเรียนสู่แผนการเรียนรู้หุ่นยนต์',
      detail: 'วิทยากรอบรมเชิงปฏิบัติการ · 6–7 สิงหาคม 2569',
    },
  ],
};
export default function Home() {
  const root = useRef<HTMLElement>(null),
    marquee = useRef<HTMLElement>(null),
    portrait = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0),
    [menu, setMenu] = useState(false),
    [dockVisible, setDockVisible] = useState(true),
    [detail, setDetail] = useState<number | null>(null),
    [photo, setPhoto] = useState<Photo | null>(null),
    [certificate, setCertificate] = useState<Certificate | null>(null),
    [notice, setNotice] = useState('');
  const go = useCallback((n: number) => {
    const i = Math.min(stops.length - 1, Math.max(0, n));
    document.getElementById(stops[i].id)?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
    history.replaceState(null, '', `#${stops[i].id}`);
  }, []);
  const presenterWindow = useRef<Window | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const liveState = useRef<PresenterState | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const openPresenter = useCallback(() => {
    if (presenterWindow.current && !presenterWindow.current.closed) {
      presenterWindow.current.focus();
      return;
    }
    const windowRef = window.open(
      '/presenter',
      'worawut-presenter',
      'popup,width=920,height=820',
    );
    if (windowRef) {
      presenterWindow.current = windowRef;
      setNotice('');
    } else setNotice('เบราว์เซอร์ปิดกั้นหน้าต่างผู้บรรยาย กรุณาอนุญาตป๊อปอัปแล้วกด N อีกครั้ง');
  }, []);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const connection = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.current = connection;
    connection.onmessage = ({ data }) => {
      if (data?.type === 'request-state' && liveState.current)
        connection.postMessage({ type: 'state', state: liveState.current });
      if (data?.type === 'navigate' && (data.delta === 1 || data.delta === -1))
        go(activeRef.current + data.delta);
    };
    return () => {
      connection.postMessage({ type: 'disconnected' });
      connection.close();
      channel.current = null;
    };
  }, [go]);
  useEffect(() => {
    const scripts: Record<string, string> = {
      values:
        'อธิบายการรักษาวินัยและการตรงต่อเวลา โดยยกตัวอย่างหน้าที่เวรประจำวัน จากนั้นเชื่อมกับคุณธรรมและจรรยาบรรณ การมีเมตตา วางตนเหมาะสม และปฏิบัติต่อผู้เรียนอย่างเป็นธรรม สามารถเปิดรายละเอียดแต่ละข้อเพื่อดูภาพประกอบได้',
      'values-more':
        'เล่าการใช้ทรัพยากรอย่างพอประมาณและดูแลส่วนรวม ต่อด้วยการช่วยเหลือผู้เรียนระหว่างปฏิบัติงาน และความรับผิดชอบต่อวิชาชีพผ่านการพัฒนาตนเองและการร่วมงานกับเพื่อนครู',
      practice:
        'สรุปกระบวนการวิเคราะห์หลักสูตร ออกแบบกิจกรรม และติดตามจากชิ้นงาน จากนั้นอธิบายการจัดห้องคอมพิวเตอร์และบทบาทครูที่ปรึกษา ม.1 ปิดท้ายด้วยการอบรม Arduino หุ่นยนต์ สื่อดิจิทัล และงานวิชาการที่นำมาประยุกต์ใช้',
      'practice-more':
        'เล่าการแลกเปลี่ยนเรียนรู้และช่วยเหลืองานเทคโนโลยีกับเพื่อนครู งานประชาสัมพันธ์ เวรประจำวัน และงานส่งเสริมสุขภาพ ต่อด้วยการสื่อสารและใช้เทคโนโลยีให้เหมาะกับผู้เรียน โดยอ้างอิงบทบาทที่ระบุในรายงาน',
      achievements:
        'เริ่มจากผลลัพธ์ที่เกิดกับผู้เรียน โดยเน้นรางวัลชนะเลิศการแข่งขันหุ่นยนต์ ผลงาน Best Practice ระดับดีเยี่ยม และรางวัลเหรียญทองจากกิจกรรมคอมพิวเตอร์ สุขศึกษา และการวาดภาพ สามารถคลิกเกียรติบัตรเพื่อขยายได้',
      certificates:
        'สรุปการพัฒนาตนเองที่เชื่อมกับงานสอน ได้แก่ การวัดความฉลาดรู้ สื่อดิจิทัลและ AI, Arduino, การเขียนโปรแกรมหุ่นยนต์, Blended Learning และ OBEC Content Center เลือกเล่าสองถึงสามเรื่องที่นำไปใช้จริง',
      recognition:
        'นำเสนอเกียรติยศผู้ประกอบวิชาชีพทางการศึกษาดีเด่น ต่อด้วยบทบาทกรรมการการแข่งขัน ROV และหุ่นยนต์ การร่วมประเมินผลงานบ้านนักวิทยาศาสตร์น้อย และบทบาทวิทยากรด้านหุ่นยนต์',
    };
    const presenterPhotos: Record<string, number> = {};
    const selected = stops[active];
    liveState.current = {
      index: active,
      total: stops.length,
      title: selected.name,
      note: scripts[selected.id] || slides[selected.note].note,
      nextTitle: stops[active + 1]?.name || null,
      photoId:
        presenterPhotos[selected.id] ||
        slides[selected.note].photos[0]?.id ||
        55,
    };
    channel.current?.postMessage({ type: 'state', state: liveState.current });
  }, [active]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      setDockVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!document.querySelector('.presenter-dock :focus-visible'))
          setDockVisible(false);
      }, 3200);
    };
    reveal();
    window.addEventListener('pointermove', reveal, { passive: true });
    window.addEventListener('pointerdown', reveal, { passive: true });
    window.addEventListener('keydown', reveal);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointermove', reveal);
      window.removeEventListener('pointerdown', reveal);
      window.removeEventListener('keydown', reveal);
    };
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
        root.current
          ?.querySelectorAll<HTMLElement>('.project-card')
          .forEach((el, i) => {
            const next = document.getElementById(`project-${i + 2}`);
            const overlap = next
              ? Math.max(
                  0,
                  Math.min(
                    1,
                    (h * 0.35 - next.getBoundingClientRect().top) / (h * 0.35),
                  ),
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
        certificate ||
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
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openPresenter();
      }
      if (e.key.toLowerCase() === 'g') setMenu(true);
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
  }, [active, menu, detail, photo, certificate, go, fullscreen, openPresenter]);
  const openPhoto = (id: number, caption: string) => setPhoto({ id, caption });
  const certificateSection = (
    id: keyof typeof certificateGroups,
    eyebrow: string,
    title: string,
    description: string,
  ) => (
    <section id={id} className="scene certificate-section">
      <div className="section-top flex justify-between">
        <span>{eyebrow}</span>
        <span>คลิกภาพเพื่อขยาย · {certificateGroups[id].length} รายการ</span>
      </div>
      <div className="certificate-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="certificate-grid">
        {certificateGroups[id].map((item, index) => (
          <button
            key={item.src}
            className="certificate-card"
            onClick={() => setCertificate(item)}
          >
            <span className="certificate-image">
              <img src={item.src} alt={item.title} loading="lazy" />
              <span className="certificate-expand">
                <Plus size={20} />
              </span>
            </span>
            <span className="certificate-copy">
              <small>
                {String(index + 1).padStart(2, '0')} / {item.category}
              </small>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="source-note">หลักฐานจากไฟล์เกียรติบัตรที่แนบในแฟ้มประเมิน</p>
    </section>
  );
  const competency = (
    id: string,
    title: string,
    english: string,
    items: ReadonlyArray<readonly [string, string, number]>,
    offset = 0,
  ) => (
    <section
      className={`scene competency ${id.startsWith('practice') ? 'practice' : 'values'}`}
      id={id}
    >
      <div className="section-top flex justify-between">
        <span>{english}</span>
        <span>
          องค์ประกอบ {offset + 1}–{offset + 3} จาก 6
        </span>
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
            <span className="row-number">
              {String(i + offset + 1).padStart(2, '0')}
            </span>
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
          <button
            onClick={() => go(stops.findIndex((s) => s.id === 'project-1'))}
            className="nav-link"
          >
            ผลงานเด่น
          </button>
          <button
            onClick={() => go(stops.findIndex((s) => s.id === 'outcomes'))}
            className="nav-link"
          >
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
      <section id="about" className="scene about-section">
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
            <span key={t}>{t} </span>
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
      {competency(
        'values',
        'การปฏิบัติตน',
        '01 / PROFESSIONAL VALUES',
        values.slice(0, 3),
      )}
      {competency(
        'values-more',
        'การปฏิบัติตน',
        '01 / PROFESSIONAL VALUES',
        values.slice(3),
        3,
      )}
      {competency(
        'practice',
        'การปฏิบัติงาน',
        '02 / TEACHING PRACTICE',
        practice.slice(0, 3),
      )}
      {competency(
        'practice-more',
        'การปฏิบัติงาน',
        '02 / TEACHING PRACTICE',
        practice.slice(3),
        3,
      )}
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
              style={{ top: `${20 + i * 10}px` }}
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
      {certificateSection(
        'achievements',
        'STUDENT OUTCOMES / ผลงานที่เกิดกับผู้เรียน',
        'ความสำเร็จของผู้เรียน',
        'ผลลัพธ์ที่เห็นได้จากการแข่งขัน ชิ้นงาน และการเรียนรู้ที่เปิดโอกาสให้ผู้เรียนแสดงศักยภาพ',
      )}
      {certificateSection(
        'certificates',
        'PROFESSIONAL GROWTH / การพัฒนาตนเอง',
        'พัฒนาตนเองอย่างต่อเนื่อง',
        'พัฒนาความรู้ด้านการวัดผล สื่อดิจิทัล AI, Arduino และหุ่นยนต์อย่างต่อเนื่อง',
      )}
      {certificateSection(
        'recognition',
        'RECOGNITION & CONTRIBUTION / เกียรติยศและบทบาท',
        'เกียรติยศและบทบาท',
        'สะท้อนการทำงานร่วมกับเครือข่ายวิชาชีพ ทั้งในฐานะผู้รับการยกย่อง กรรมการ และวิทยากร',
      )}
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
      <nav
        className={`presenter-dock ${dockVisible ? '' : 'dock-hidden'}`}
        aria-label="ควบคุมการนำเสนอ"
        onFocusCapture={() => setDockVisible(true)}
      >
        <div className="dock-tools flex items-center">
          <button
            onClick={() => setMenu(true)}
            aria-label="สารบัญ (G)"
            title="สารบัญ (G)"
          >
            <Grid2X2 size={19} />
          </button>
          <button
            onClick={openPresenter}
            aria-label="เปิดหน้าต่างผู้บรรยาย (N)"
            title="เปิดหน้าต่างผู้บรรยาย (N)"
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
      <Dialog
        open={!!certificate}
        onOpenChange={(open) => {
          if (!open) setCertificate(null);
        }}
      >
        <DialogContent className="lightbox certificate-lightbox">
          <DialogTitle>{certificate?.title}</DialogTitle>
          <DialogDescription>
            {certificate?.category} · {certificate?.detail}
          </DialogDescription>
          {certificate && <img src={certificate.src} alt={certificate.title} />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
