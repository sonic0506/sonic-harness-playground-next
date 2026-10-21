import { http, HttpResponse } from 'msw';

import { USERS_PAGE_SIZE } from '../model/user.constant';
import type { UserDto } from '../model/user.dto';

const NAMES = ['김소닉', '이하늘', '박바다', '최나무', '정구름'];

export const MOCK_USERS: UserDto[] = Array.from({ length: 25 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `${NAMES[index % NAMES.length]} ${index + 1}`,
  email: `${index % 2 === 0 ? 'kim' : 'lee'}${index + 1}@example.com`,
}));

// 서버 컴포넌트의 prefetch(절대 주소)와 브라우저 요청(상대 주소)을 모두 받으려고 '*'로 시작해요.
export const userHandlers = [
  http.get('*/api/users', ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Math.max(Number(params.get('page') ?? 1) || 1, 1);
    const keyword = (params.get('q') ?? '').trim().toLowerCase();
    const matched = MOCK_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword),
    );
    const start = (page - 1) * USERS_PAGE_SIZE;
    return HttpResponse.json(matched.slice(start, start + USERS_PAGE_SIZE));
  }),
];
