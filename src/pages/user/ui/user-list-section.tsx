'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useDeferredValue } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { UserRow, USERS_PAGE_SIZE, useUsersQuery } from '@/entities/user';

import { useUserListSearchParams } from '../model/use-user-list-search-params';

type UserListResultProps = {
  page: number;
  q: string;
  onPageChange: (page: number) => void;
};

function UserListResult({ page, q, onPageChange }: UserListResultProps) {
  const { data: users } = useUsersQuery({ page, q });
  const isLastPage = users.length < USERS_PAGE_SIZE;
  return (
    <>
      {users.length === 0 ? (
        <p>사용자가 없어요.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </ul>
      )}
      <nav aria-label="페이지 이동">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          이전
        </button>
        <span>{page}페이지</span>
        <button
          type="button"
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
        >
          다음
        </button>
      </nav>
    </>
  );
}

export function UserListSection() {
  const [{ page, q }, setSearchParams] = useUserListSearchParams();
  // 입력은 바로 반영하고, 목록은 새 결과가 올 때까지 이전 화면을 유지해요.
  const deferredPage = useDeferredValue(page);
  const deferredQ = useDeferredValue(q);

  return (
    <section>
      <input
        type="search"
        aria-label="사용자 검색"
        placeholder="이름이나 이메일"
        value={q}
        onChange={(event) =>
          void setSearchParams({ q: event.target.value, page: 1 })
        }
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <div role="alert">
                <p>사용자를 불러오지 못했어요.</p>
                <button type="button" onClick={resetErrorBoundary}>
                  다시 시도
                </button>
              </div>
            )}
          >
            <Suspense fallback={<p>불러오는 중이에요…</p>}>
              <UserListResult
                page={deferredPage}
                q={deferredQ}
                onPageChange={(next) => void setSearchParams({ page: next })}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </section>
  );
}
