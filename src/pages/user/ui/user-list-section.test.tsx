import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { renderWithQuery, server } from '@/shared/testing';

import { UserListSection } from './user-list-section';

describe('UserListSection', () => {
  it('사용자 목록을 보여 줘요', async () => {
    renderWithQuery(<UserListSection />);

    expect(await screen.findByText('김소닉 1')).toBeInTheDocument();
    expect(screen.getByText('kim1@example.com')).toBeInTheDocument();
  });

  it('사용자가 없으면 빈 상태를 보여 줘요', async () => {
    server.use(http.get('*/api/users', () => HttpResponse.json([])));

    renderWithQuery(<UserListSection />);

    expect(await screen.findByText('사용자가 없어요.')).toBeInTheDocument();
  });

  it('서버 에러가 나면 실패 문구와 다시 시도 버튼을 보여 줘요', async () => {
    server.use(
      http.get('*/api/users', () => new HttpResponse(null, { status: 500 })),
    );

    renderWithQuery(<UserListSection />);

    expect(
      await screen.findByText('사용자를 불러오지 못했어요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  });

  it('다시 시도를 누르면 목록을 다시 불러와요', async () => {
    const user = userEvent.setup();
    server.use(
      http.get('*/api/users', () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );

    renderWithQuery(<UserListSection />);
    await user.click(await screen.findByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('김소닉 1')).toBeInTheDocument();
  });

  it('URL의 검색어와 페이지로 목록을 불러와요', async () => {
    renderWithQuery(<UserListSection />, { searchParams: '?page=2&q=kim' });

    expect(await screen.findByText('박바다 23')).toBeInTheDocument();
    expect(screen.queryByText('김소닉 1')).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: '사용자 검색' })).toHaveValue(
      'kim',
    );
  });

  it('검색어를 입력하면 그 결과만 보여 줘요', async () => {
    const user = userEvent.setup();
    renderWithQuery(<UserListSection />);
    await screen.findByText('김소닉 1');

    await user.type(
      screen.getByRole('searchbox', { name: '사용자 검색' }),
      'lee',
    );

    expect(await screen.findByText('lee2@example.com')).toBeInTheDocument();
    expect(screen.queryByText('kim1@example.com')).not.toBeInTheDocument();
  });

  it('다음을 누르면 다음 페이지를 보여 줘요', async () => {
    const user = userEvent.setup();
    renderWithQuery(<UserListSection />);
    await screen.findByText('김소닉 1');

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(await screen.findByText('김소닉 11')).toBeInTheDocument();
    expect(screen.queryByText('김소닉 1')).not.toBeInTheDocument();
  });

  it('첫 페이지에서는 이전 버튼을 누를 수 없어요', async () => {
    renderWithQuery(<UserListSection />);
    await screen.findByText('김소닉 1');

    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
  });

  it('마지막 페이지에서는 다음 버튼을 누를 수 없어요', async () => {
    renderWithQuery(<UserListSection />, { searchParams: '?page=3' });
    await screen.findByText('김소닉 21');

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });
});
