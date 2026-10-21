import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { userQueries } from '@/entities/user';
import { getQueryClient } from '@/shared/api';

import { loadUserListSearchParams } from './model/user-list-search-params';
import { UserListSection } from './ui/user-list-section';

type UserListPageProps = {
  searchParams: Promise<SearchParams>;
};

// 요청의 searchParams를 읽는 부분만 Suspense 안에 둬요(Cache Components).
async function UserListPrefetch({ searchParams }: UserListPageProps) {
  const { page, q } = await loadUserListSearchParams(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(userQueries.list({ page, q }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserListSection />
    </HydrationBoundary>
  );
}

export function UserListPage({ searchParams }: UserListPageProps) {
  return (
    <main>
      <h1>사용자</h1>
      <Suspense fallback={<p>불러오는 중이에요…</p>}>
        <UserListPrefetch searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
