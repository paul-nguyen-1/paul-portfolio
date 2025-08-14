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
  Divider,
} from "@mantine/core";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleLogin(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log({ email, password, remember });
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
              <Button variant="subtle" color="gray">
                Forgot password?
              </Button>
            </Group>
            <Button type="submit" fullWidth radius="md" color="gray.8">
              Continue
            </Button>
          </Stack>
        </form>

        <Divider
          my="lg"
          label={
            <Text color="dimmed" size="xs">
              or
            </Text>
          }
          labelPosition="center"
        />

        <Stack>
          <Button variant="default" fullWidth radius="md">
            Continue with Google
          </Button>
        </Stack>

        <Text size="sm" mt="lg">
          Don't have an account?{" "}
          <Button variant="subtle" color="gray">
            Create one
          </Button>
        </Text>
      </Paper>
    </div>
  );
}
