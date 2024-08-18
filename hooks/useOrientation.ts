import { useState, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

interface OrientationState {
  orientation: ScreenOrientation.Orientation | null;
}

const useScreenOrientation = (): OrientationState => {
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation | null>(null);

  useEffect(() => {
    // Function to get current screen orientation
    const fetchOrientation = async () => {
      try {
        const orientationInfo = await ScreenOrientation.getOrientationAsync();
        setOrientation(orientationInfo);
      } catch (error) {
        console.error("Failed to get screen orientation:", error);
      }
    };

    fetchOrientation();

    // Listener to handle orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    // Cleanup listener on unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  return { orientation };
};

export default useScreenOrientation;
