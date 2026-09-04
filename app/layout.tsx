import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'วรวุฒิ มุงธิสาร | 2 ปีแห่งการเรียนรู้และพัฒนา',
 description: 'การนำเสนอผลการเตรียมความพร้อมและพัฒนาอย่างเข้ม ตำแหน่งครูผู้ช่วย โรงเรียนบ้านขัวก่าย พ.ศ. 2567–2569',
 robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="th"><body>{children}</body></html>;
}
