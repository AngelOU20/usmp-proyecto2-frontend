import { signIn } from "@/lib/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 flex items-center justify-center space-x-2"
        type="submit"
      >
        <span>Iniciar sesión con Microsoft Entra ID</span>
      </button>
    </form>
  );
}
