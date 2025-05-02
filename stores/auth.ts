import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export const useAuthStore = defineStore("authStore",
// modern way, which uses Vue's composition function (types are automatically inferred)
  () => {
    const loading = ref(false);
    async function signIn() {
      loading.value = true;
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });
      loading.value = false;
    }

    return {
      loading,
      signIn,
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
