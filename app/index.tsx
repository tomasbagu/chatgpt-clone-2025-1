import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ThemedView } from "@/components/ThemedView";
import { auth } from "@/utils/FirebaseConfig";

export default function Index() {

  const router = useRouter();
  const [email, setEmail] = useState("hans@test.com");
  const [password, setPassword] = useState("123456");

  const login = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        router.push("/main");
      }
    } catch (error) {
      console.log("Error Login: ", { error })
    }
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Screens"
        onPress={login}
      />
    </ThemedView>
  );
}
