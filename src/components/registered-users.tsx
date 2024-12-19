"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Suspense } from "react";

const useUsers = () => api.user.read.useSuspenseQuery()[0];

export const RegisteredUsers = () => {
  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Registered Users</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-72px)] w-full flex-col-reverse overflow-scroll p-0">
        <Suspense fallback={<UsersSuspense />}>
          <Users />
        </Suspense>
      </CardContent>
    </Card>
  );
};

const UsersSuspense = () => {
  const users = [...new Array(5)];
  return (
    <>
      {users.map((i) => (
        <User.Suspense key={i} />
      ))}
    </>
  );
};

const Users = () => {
  const users = useUsers();
  if (users.length === 0)
    return (
      <div className="flex h-[calc(100%-72px)] w-full flex-col items-center justify-center gap-2">
        <Avatar className="h-24 w-24 opacity-35">
          <AvatarImage src={`/avatar/01.png`} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-muted-foreground">No users found</div>
      </div>
    );
  return (
    <>
      {users.map((user, i) => (
        <User key={user.id} {...user} index={i} />
      ))}
    </>
  );
};
Users.Suspense = UsersSuspense;

const UserSuspense = () => {
  return (
    <div className="flex w-full flex-row items-center justify-between border-b p-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex flex-col items-start justify-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-2 w-32" />
        </div>
      </div>
      <Skeleton className="h-2 w-40" />
    </div>
  );
};

const User = (
  props: ReturnType<typeof useUsers>[number] & { index: number },
) => {
  const index = (props.index % 5) + 1;
  return (
    <div className="flex w-full flex-row items-center justify-between border-b p-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <Avatar>
          <AvatarImage src={`/avatar/0${index}.png`} />
          <AvatarFallback>{props.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="text-base font-bold">{props.name}</div>
          <div className="text-xs text-muted-foreground">{props.email}</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Registered {getTimeDifference(props.created_at)} ago
      </div>
    </div>
  );
};
User.Suspense = UserSuspense;

function getTimeDifference(timestamp: string): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - new Date(timestamp).getTime();

  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  if (diffInMinutes < 1) return `few seconds`;

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
  }

  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`;
  }

  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
}
