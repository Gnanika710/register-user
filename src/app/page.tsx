import { RegisteredUsers } from "@/components/registered-users";
import { RegistrationForm } from "@/components/registration-form";
import { api, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  void api.user.read.prefetch();
  return (
    <HydrateClient>
      <div className="flex h-full w-full flex-row gap-4">
        <div className="flex h-full w-full items-center justify-center">
          <RegistrationForm />
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <RegisteredUsers />
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
