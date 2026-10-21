import type { UserDto } from '../model/user.dto';

type UserRowProps = {
  user: UserDto;
};

export function UserRow({ user }: UserRowProps) {
  return (
    <li>
      {user.name} <span>{user.email}</span>
    </li>
  );
}
