import { http } from '@/shared/api';

import type { GetUsersParams, UserDto } from '../model/user.dto';

export function getUsers({ page, q }: GetUsersParams) {
  const search = new URLSearchParams({ page: String(page), q });
  return http<UserDto[]>(`/users?${search.toString()}`);
}
