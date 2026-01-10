import { useAlertStore } from "@/src/store/alertStore";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { useVirtualLabsStore } from "../store/virtualLabsStore";

export function useExperimentsData() {
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const { experiments, loading } = useVirtualLabsStore();

  const handleBack = () => {
    router.back();
  };

  const handleExperimentPress = async (link: string) => {
    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        showAlert({
          title: "Error",
          message: "Cannot open this link",
        });
      }
    } catch (error) {
      console.error("Error opening link:", error);
      showAlert({
        title: "Error",
        message: "Failed to open the link",
      });
    }
  };

  return {
    experiments,
    loading,
    handleBack,
    handleExperimentPress,
  };
}
