export const useLocationStore = defineStore("useLocationStore", () => {
  const { data: locations, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (locations.value) {
      sidebarStore.sidebarItems = locations.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin",
        href: `/dashboard/locations/${location.id}`,
      }));
    }

    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations,
    status,
    refresh,
  };
});
