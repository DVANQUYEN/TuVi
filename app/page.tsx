'use client';

import { useState, type FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StarryBackground } from '@/components/animation/StarryBackground';
import { IntroAnimation } from '@/components/animation/IntroAnimation';
import { ZodiacWheel } from '@/components/animation/ZodiacWheel';

export default function Home(): React.ReactElement {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // TODO: navigate to chart result page
  };

  return (
    <>
      <IntroAnimation />
      <StarryBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative flex flex-col items-center justify-center gap-8 px-4 py-16 md:flex-row md:py-24 lg:py-32">
            <div className="max-w-xl text-center md:text-left">
              <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Khám phá vận mệnh theo <span className="text-gold">Tử Vi Đẩu Số</span>
              </h1>
              <p className="mt-4 text-lg text-muted">
                Lập lá số chính xác theo trường phái Việt Nam, lịch âm UTC+7.
              </p>
            </div>
            <ZodiacWheel />
          </section>

          <section className="mx-auto max-w-3xl px-4 py-12">
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-center">Lập lá số nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="birthDate"
                      className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Ngày sinh (dương lịch)
                    </label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="birthHour"
                      className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Giờ sinh
                    </label>
                    <Select
                      id="birthHour"
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                      required
                    >
                      <option value="">Chọn giờ</option>
                      <option value="0">Tý (23:00 - 01:00)</option>
                      <option value="1">Sửu (01:00 - 03:00)</option>
                      <option value="2">Dần (03:00 - 05:00)</option>
                      <option value="3">Mão (05:00 - 07:00)</option>
                      <option value="4">Thìn (07:00 - 09:00)</option>
                      <option value="5">Tỵ (09:00 - 11:00)</option>
                      <option value="6">Ngọ (11:00 - 13:00)</option>
                      <option value="7">Mùi (13:00 - 15:00)</option>
                      <option value="8">Thân (15:00 - 17:00)</option>
                      <option value="9">Dậu (17:00 - 19:00)</option>
                      <option value="10">Tuất (19:00 - 21:00)</option>
                      <option value="11">Hợi (21:00 - 23:00)</option>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Giới tính
                    </label>
                    <Select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </Select>
                  </div>

                  <div className="sm:col-span-3">
                    <Button type="submit" className="w-full">
                      Lập lá số
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Lá số chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  Hiển thị đầy đủ 12 cung, chính tinh, phụ tinh và các yếu tố theo trường phái Nam
                  phái.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tử vi hàng ngày</CardTitle>
                </CardHeader>
                <CardContent>
                  Xem vận hạn, sao hạn và lờii khuyên theo từng ngày dựa trên lá số của bạn.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hợp tuổi</CardTitle>
                </CardHeader>
                <CardContent>
                  So sánh lá số, ngũ hành và độ hợp nhau trong quan hệ đối tác, hôn nhân.
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
