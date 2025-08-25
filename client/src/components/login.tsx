import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Group,
  Stack,
  Title,
  Text,
  Paper,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../hooks/useUser";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT as string;
      await login(email, password, apiBase);
      navigate({ to: "/" });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{ backgroundColor: "#1a1a1a", color: "#fff", width: 380 }}
      >
        <Title order={2} mb="sm">
          Welcome back
        </Title>
        <Text size="sm" color="dimmed" mb="md">
          Sign in to continue
        </Text>

        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderColor: "#333",
                },
              }}
            />
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderColor: "#333",
                },
              }}
            />
            <Group>
              <Checkbox
                label={
                  <Text size="sm" color="dimmed">
                    Remember me
                  </Text>
                }
                checked={remember}
                onChange={(e) => setRemember(e.currentTarget.checked)}
              />
              {/* <Button variant="subtle" color="gray">
                Forgot password?
              </Button> */}
            </Group>
            <Button type="submit" fullWidth radius="md" color="gray.8">
              Continue
            </Button>
          </Stack>
        </form>

        <Text size="sm" mt="lg">
          Don't have an account?{" "}
          <Button
            variant="subtle"
            color="gray"
            onClick={() => navigate({ to: "/createUser" })}
          >
            Create one
          </Button>
        </Text>
      </Paper>
    </div>
  );
}
