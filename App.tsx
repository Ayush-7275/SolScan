import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import { Text, TextInput, View } from "react-native";
import { useSolanaRpc } from "./hooks/useSolanaRpc";


export default function App() {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className = "flex-1 bg-[#1E1E2E] text-white">
        <View className="flex-1 ">
          {/*header*/}
          <View className="flex">
            <Text>SolScan</Text>
            
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
