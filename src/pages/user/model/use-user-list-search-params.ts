import { useQueryStates } from 'nuqs';

import { userListParsers } from './user-list-search-params';

export function useUserListSearchParams() {
  return useQueryStates(userListParsers);
}
