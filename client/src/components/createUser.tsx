import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Stack,
  Title,
  Text,
  Paper,
  Divider,
} from "@mantine/core";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  function handleCreate(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log({ name, email, password, confirmPassword, termsAccepted });
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
          Create your account
        </Title>
        <Text size="sm" color="dimmed" mb="md">
          Fill in the details to sign up
        </Text>

        <form onSubmit={handleCreate}>
          <Stack>
            <TextInput
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderColor: "#333",
                },
              }}
            />
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
              placeholder="Password"
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
            <PasswordInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderColor: "#333",
                },
              }}
            />
            <Checkbox
              label={
                <Text size="sm" color="dimmed">
                  I accept the terms and conditions
                </Text>
              }
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
            />
            <Button type="submit" fullWidth radius="md" color="gray.8">
              Sign Up
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
            Sign up with Google
          </Button>
        </Stack>

        <Text size="sm" mt="lg" color="dimmed">
          Already have an account?{" "}
          <Button variant="subtle" color="gray">
            Login
          </Button>
        </Text>
      </Paper>
    </div>
  );
}
