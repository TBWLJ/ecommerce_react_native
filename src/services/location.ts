import * as Location from "expo-location";

export type LocationPermissionStatus = "granted" | "denied" | "undetermined" | "restricted";

export interface LocationPermissionState {
    status: LocationPermissionStatus;
    canAskAgain: boolean;
    granted: boolean;
}

class LocationService {
    /**
     * Check the current foreground location permission status.
     * This DOES NOT trigger a permission prompt
    */
   async getPermissionStatus(): Promise<LocationPermissionState> {
    const permission = await Location.getForegroundPermissionsAsync();
    return {
        status: permission.status,
        canAskAgain: permission.canAskAgain,
        granted: permission.granted,
    }; 
   }

   /**
    * Request foreground location permission from the user.
    * This will trigger a permission prompt if the user has not already granted or denied permission.
    * Returns the updated permission status after the request.
    */
   async requestPermission(): Promise<LocationPermissionState> {
    const permission = await Location.requestForegroundPermissionsAsync();
    return {
        status: permission.status,
        canAskAgain: permission.canAskAgain,
        granted: permission.granted,
    };
   }

   /**
    * Check permission first
    * if already granted -> do nothing
    * if not granted and the OS allows us to ask
    * request permission
    * 
    * if the OS no longer allows us to ask -<
    * return the current state and let UI redirect user to Settings.
    */

   async ensurePermission(): Promise<LocationPermissionState> {
    const current = await this.getPermissionStatus();
    if (current.granted) {
        return current;
    }

    if (!current.canAskAgain) {
        return current
    }

    return this.requestPermission();

   }
}

/**
 * Get user's current foreground location.
 * permission must already be granted
 */
async function getCurrentLocation(): Promise<Location.LocationObject | null> {
    const permission = await Location.getForegroundPermissionsAsync();
    if (!permission.granted) {
        console.warn("Location permission not granted. Cannot get current location.");
        return null;
    }

    try {
        const location = await Location.getCurrentPositionAsync({});
        return location;
    } catch (error) {
        console.error("Error getting current location:", error);
        return null;
    }
}

export const locationService = new LocationService();
export { getCurrentLocation };