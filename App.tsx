import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import {
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

import { useWalletBalance } from "./hooks/useWalletBalance";
import { useTokenBalances } from "./hooks/useTokenBalances";
import { useTransactionHistory } from "./hooks/useTransictionHistory";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [activeAddress, setActiveAddress] = useState("");
  const {
    history,
    loading: txLoading,
    error: txError,
  } = useTransactionHistory(activeAddress);

  const { balance, loading, error } = useWalletBalance(activeAddress);
  const {
    accounts,
    loading: tokensLoading,
    error: tokensError,
  } = useTokenBalances(activeAddress);

  const handleSearch = () => {
    if (inputText.trim().length > 0) {
      setActiveAddress(inputText.trim());
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#1E1E2E]">
        <View className="flex-1 w-full px-6">
          {/* Header */}
          <View className="flex justify-center items-center mt-7 mb-8">
            <Text className="text-white font-bold text-5xl">SolScan</Text>
          </View>

          {/* Input Area */}
          <View className="flex justify-center items-center w-full mb-6">
            <TextInput
              className="text-white border-2 border-white p-3 w-full rounded-xl text-center font-mono"
              placeholder="Enter Solana Address"
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText} // Updates as they type
              onSubmitEditing={handleSearch} // Triggers when they hit "Enter"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* If there is no active address, show a prompt. Otherwise, show the data! */}
          {!activeAddress ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 text-lg">
                Search a wallet to view details
              </Text>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* --- 1. BALANCE SECTION --- */}
              <View className="bg-gray-800 p-6 rounded-2xl items-center mt-4 border border-gray-700">
                <Text className="text-gray-400 font-bold uppercase tracking-widest mb-2">
                  Total Balance
                </Text>

                {loading ? (
                  <ActivityIndicator color="#14F195" size="large" />
                ) : error ? (
                  <Text className="text-red-400">Failed to load balance</Text>
                ) : (
                  <Text className="text-white font-black text-4xl">
                    {balance?.toFixed(4)}{" "}
                    <Text className="text-[#14F195] text-2xl">SOL</Text>
                  </Text>
                )}
              </View>

              {/* --- 2. TOKENS SECTION --- */}
              <View className="mt-8">
                <Text className="text-white font-bold text-xl mb-4 px-2">
                  SPL Tokens
                </Text>

                <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  {tokensLoading ? (
                    <ActivityIndicator
                      color="#14F195"
                      size="large"
                      className="my-4"
                    />
                  ) : tokensError ? (
                    <Text className="text-red-400 text-center my-4">
                      Failed to load tokens
                    </Text>
                  ) : !accounts || accounts.length === 0 ? (
                    <Text className="text-gray-500 text-center my-4">
                      No tokens found in this wallet.
                    </Text>
                  ) : (
                    accounts.map((token, index) => (
                      <View
                        key={token.mint}
                        className={`flex-row justify-between items-center py-3 px-2 ${
                          index !== accounts.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                      >
                        {/* Token Address (Truncated) */}
                        <Text className="text-gray-400 font-mono text-sm">
                          {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
                        </Text>

                        {/* Token Amount */}
                        <Text className="text-white font-bold text-base">
                          {token.amount.toLocaleString()}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* --- 3. TRANSACTION HISTORY SECTION --- */}
              <View className="mt-8 mb-12">
                <Text className="text-white font-bold text-xl mb-4 px-2">
                  Recent Activity
                </Text>

                <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  {txLoading ? (
                    <ActivityIndicator
                      color="#14F195"
                      size="large"
                      className="my-4"
                    />
                  ) : txError ? (
                    <Text className="text-red-400 text-center my-4">
                      Failed to load history
                    </Text>
                  ) : !history || history.length === 0 ? (
                    <Text className="text-gray-500 text-center my-4">
                      No recent transactions found.
                    </Text>
                  ) : (
                    history.map((tx, index) => (
                      <TouchableOpacity
                        key={tx.sig}
                        className={`py-3 px-2 rounded-lg active:bg-gray-700/50 ${
                          index !== history.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                        onPress={() => {
                          const url = `https://explorer.solana.com/tx/${tx.sig}?cluster=devnet`;
                          Linking.openURL(url);
                        }}
                      >
                        {/* Top Row: Signature & Status */}
                        <View className="flex-row justify-between items-center mb-1">
                          <Text className="text-gray-300 font-mono text-sm">
                            {tx.sig.slice(0, 6)}...{tx.sig.slice(-6)}
                          </Text>

                          {/* Dynamically color the status badge */}
                          <View
                            className={`px-2 py-1 rounded-md ${
                              tx.status === "finalized"
                                ? "bg-[#14F195]/20"
                                : "bg-yellow-500/20"
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold uppercase tracking-wider ${
                                tx.status === "finalized"
                                  ? "text-[#14F195]"
                                  : "text-yellow-500"
                              }`}
                            >
                              {tx.status}
                            </Text>
                          </View>
                        </View>

                        {/* Bottom Row: Human-Readable Time */}
                        <Text className="text-gray-500 text-xs">
                          {tx.time
                            ? new Date(tx.time * 1000).toLocaleString()
                            : "Unknown Date"}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
