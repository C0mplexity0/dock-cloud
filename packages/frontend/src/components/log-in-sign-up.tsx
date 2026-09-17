import { useState } from "react";
import { Field, FieldLabel, FieldSet } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Toggle } from "./ui/toggle";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Link } from "./ui/link";
import { H3, P } from "./ui/typography";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Form } from "./ui/form";

function PasswordInput({
  label = "Password",
  name = "password",
}: {
  label?: string;
  name?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          required
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <Toggle
            aria-label="Show password"
            size="icon-sm"
            defaultPressed={false}
            pressed={showPassword}
            onPressedChange={setShowPassword}
            className="bg-transparent!"
          >
            {showPassword ? <IconEye /> : <IconEyeOff />}
          </Toggle>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

/**
 * Used to show a toast message with some detailed information on why the input validation failed.
 * @param error The ZodError object containing validation issues.
 * @returns void
 */
/*function showMessageForInputError(error: z.ZodError) {
  const issue = error.issues[0];
  console.log(issue);

  if (!issue) {
    toast.error("Please fill in all fields.");
    return;
  }

  switch (issue.path[0]) {
    case "email":
      if (issue.code === "invalid_format") {
        toast.error("Please enter a valid email address.");
        return;
      }
      break;
    case "password":
      if (issue.code === "too_small") {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      break;
    case "name":
      if (issue.code === "invalid_type") {
        toast.error("Please enter a name.");
        return;
      }
      break;
  }

  toast.error("Please fill in all fields.");
  return;
}*/

export function LogInSignUpPages({ action }: { action: "login" | "signup" }) {
  const [loading /*, setLoading*/] = useState(false);

  /*function onRequest() {
    setLoading(true);
  }

  function onSuccess() {
    setLoading(false);
    window.location.reload();
  }

  function onError(error: Error) {
    setLoading(false);
    if (!error.message) {
      toast.error("An unknown error occurred. Please try again.");
      return;
    }
    toast.error(error.message);
  }*/

  return (
    <div className="flex size-full items-center justify-center">
      <Tabs className="w-100" defaultValue={action}>
        <TabsList>
          <TabsTrigger
            value="signup"
            nativeButton={false}
            render={<Link to="/signup" />}
          >
            Sign Up
          </TabsTrigger>
          <TabsTrigger
            value="login"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Log In
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              /*const formData = new FormData(e.currentTarget)

              const inputs = z.safeParse(SignUpFields, {
                email: formData.get("email"),
                password: formData.get("password"),
                name: formData.get("displayName"),
              })

              if (!inputs.success) {
                showMessageForInputError(inputs.error)
                return
              }

              signUp(
                inputs.data.email,
                inputs.data.password,
                inputs.data.name,
                onRequest,
                onSuccess,
                onError
                )*/
            }}
          >
            <FieldSet>
              <div>
                <H3>Sign Up</H3>
                <P className="text-muted-foreground">
                  Enter your email to create an account.
                </P>
              </div>
              <Field>
                <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                <Input
                  required
                  id="displayName"
                  name="displayName"
                  autoComplete="off"
                  placeholder="John Doe"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  required
                  id="email"
                  name="email"
                  autoComplete="off"
                  placeholder="m@example.com"
                />
              </Field>
              <PasswordInput />
              <PasswordInput label="Confirm Password" name="confirmPassword" />
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : null} Create Account
                </Button>
              </Field>
            </FieldSet>
          </Form>
        </TabsContent>
        <TabsContent value="login">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              /*const formData = new FormData(e.currentTarget)

              const inputs = z.safeParse(LogInFields, {
                email: formData.get("email"),
                password: formData.get("password"),
              })

              if (!inputs.success) {
                showMessageForInputError(inputs.error)
                return
              }

              logIn(
                inputs.data.email,
                inputs.data.password,
                onRequest,
                onSuccess,
                onError
                )*/
            }}
          >
            <FieldSet>
              <div>
                <H3>Log In</H3>
                <P className="text-muted-foreground">
                  Log in to your account using your email and password.
                </P>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  required
                  id="email"
                  name="email"
                  autoComplete="off"
                  placeholder="m@example.com"
                />
              </Field>
              <PasswordInput />
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : null} Log In
                </Button>
              </Field>
            </FieldSet>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
