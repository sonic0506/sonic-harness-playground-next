import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server';

// 서버(첫 화면 prefetch)와 브라우저(use-user-list-search-params)가 같은 파서를 써요.
export const userListParsers = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(''),
};

export const loadUserListSearchParams = createLoader(userListParsers);
