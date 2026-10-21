export type UserDto = {
  id: string;
  name: string;
  email: string;
};

export type GetUsersParams = {
  page: number;
  q: string;
};
