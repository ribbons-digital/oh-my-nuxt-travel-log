import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("authStore",
// modern way, which uses Vue's composition function (types are automatically inferred)
  () => {
    const session = authClient.useSession();

    const user = computed(() => session.value.data?.user);
    const loading = computed(() => session.value.isPending || session.value.isRefetching);
    async function signIn() {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
    }

    async function signOut() {
      await authClient.signOut();
      navigateTo("/");
    }

    return {
      loading,
      signIn,
      signOut,
      user,
    };

    // older way, which is using object
    // {
    //   state: () => ({
    //     loading: false,
    //   }),
    //   actions: {
    //     async signIn() {
    //       this.loading = true;
    //       await authClient.signIn.social({
    //         provider: "github",
    //         callbackURL: "/dashboard",
    //       });
    //       this.loading = false;
    //     },
    //   },
    // });
  });
