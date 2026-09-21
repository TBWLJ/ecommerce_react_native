import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
    LocationPermissionState, locationService,
} from "@/services/location";


interface UseLocationPermissionReturn extends LocationPermissionState {
    loading: boolean;
    refresh: () => Promise<void>;
    requestPermission: () => Promise<LocationPermissionState>;
}

export function useLocationPermission(): UseLocationPermissionReturn {
    const [permissionState, setPermissionState] = useState<LocationPermissionState>({
        status: "undetermined",
        canAskAgain: true,
        granted: false,
    });
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const state = await locationService.getPermissionStatus();
        setPermissionState(state);
        setLoading(false);
    }, []);

    const requestPermission = useCallback(async () => {
        setLoading(true);
        const state = await locationService.requestPermission();
        setPermissionState(state);
        setLoading(false);
        return state;
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                await refresh();
            }
            return () => subscription.remove();
        });
    }, [refresh]);

    return { ...permissionState, loading, refresh, requestPermission };
}