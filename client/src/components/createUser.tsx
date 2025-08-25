import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Paper,
} from "@mantine/core";
import { postData } from "../../utils/utils";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../hooks/useUser";

export default function CreateUser() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    await postData(
      `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}/user/register`,
      { firstName, lastName, email, password }
    );

    await login(
      email,
      password,
      `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}`
    );

    navigate({ to: "/" });
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
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderColor: "#333",
                },
              }}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            <Button type="submit" fullWidth radius="md" color="gray.8">
              Sign Up
            </Button>
          </Stack>
        </form>

        <Text size="sm" mt="lg" color="dimmed">
          Already have an account?{" "}
          <Button
            variant="subtle"
            color="gray"
            onClick={() => navigate({ to: "/login" })}
          >
            Login
          </Button>
        </Text>
      </Paper>
    </div>
  );
}
