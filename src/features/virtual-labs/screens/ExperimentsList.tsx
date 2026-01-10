import { Text, View } from "@/src/components";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useSafeAreaStore } from "@/src/store/safeAreaStore";
import { commonStyles } from "@/src/styles/commonStyles";
import { ChevronLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ExperimentCard } from "../components";
import { useExperimentsData } from "../hooks/useExperimentsData";

export default function ExperimentsList() {
  const { colors } = useTheme();
  const { bottomOffset } = useSafeAreaStore();
  const { experiments, loading, handleBack, handleExperimentPress } =
    useExperimentsData();

  const renderExperimentItem = ({ item }: { item: any }) => (
    <ExperimentCard
      serialNumber={item.sl}
      subjectCode={item.subject_code}
      experimentName={item.experiment}
      onPress={() => handleExperimentPress(item.link)}
    />
  );

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack} style={commonStyles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.headerTitle, { color: colors.text }]}>
          Available Experiments
        </Text>
        <View style={commonStyles.placeholder} />
      </View>

      <View style={styles.experimentsContainer}>
        {loading ? (
          <View style={commonStyles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                commonStyles.loadingText,
                { color: colors.textSecondary },
              ]}
            >
              Loading experiments...
            </Text>
          </View>
        ) : experiments.length === 0 ? (
          <View style={commonStyles.centerContainer}>
            <Text
              style={[commonStyles.emptyText, { color: colors.textSecondary }]}
            >
              No experiments available
            </Text>
          </View>
        ) : (
          <FlatList
            data={experiments}
            renderItem={renderExperimentItem}
            keyExtractor={(item, index) => `${item.sl}-${index}`}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: bottomOffset + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.headerRow,
    ...commonStyles.header,
    paddingBottom: 7,
  },
  experimentsContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
});
