import { Button } from "@/src/components";
import { LegalPageLayout, LegalSection, LegalText } from "@/src/features/legal/components";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
	const router = useRouter();

	return (
		<LegalPageLayout>
			<View className="bg-surface dark:bg-surface rounded-3xl border border-border p-6 gap-5 shadow-sm">
				<View className="flex-row items-center justify-between">
					<View className="px-3 py-1 rounded-full bg-cobalt-500/10 border border-cobalt-200">
						<Text className="text-cobalt-600 text-xs font-sans-semi tracking-wide">ERROR 404</Text>
					</View>
				</View>

				<View className="gap-2">
					<Text className="text-[30px] leading-[36px] font-display-bold text-ink-950 dark:text-ink-100">
						We looked everywhere.
					</Text>
					<LegalText>
						The page you requested is unavailable, moved, or the link is invalid.
					</LegalText>
				</View>
			</View>

			<LegalSection title="Try this next">
				<LegalText variant="bullet">• Go back to the previous screen</LegalText>
				<LegalText variant="bullet">• Open Home to continue browsing</LegalText>
				<LegalText variant="bullet">• Check the URL and try again</LegalText>
			</LegalSection>

			<View className="gap-3 pt-2">
				<Button
					title="Open Home"
					onPress={() => router.replace("/(tabs)")}
					variant="primary"
				/>
				<Button
					title="Back to Previous"
					onPress={() => {
						if (router.canGoBack()) {
							router.back();
							return;
						}

						router.replace("/(tabs)");
					}}
					variant="secondary"
				/>
			</View>
		</LegalPageLayout>
	);
}
