import { UserButton, SignIn, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      Eai meu camarada
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
