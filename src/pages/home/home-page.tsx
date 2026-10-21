import Link from 'next/link';

export function HomePage() {
  return (
    <main>
      <h1>시작</h1>
      <Link href="/users">사용자 목록</Link>
    </main>
  );
}
