'use client';

import { useActionState, useState, useMemo } from 'react';
import { loginWithEmail } from './actions';
import { useSearchParams } from 'next/navigation';
import {
  Field, 
  Heading, 
  Input, 
  Text, 
  Button, 
  SimpleGrid, 
  Stack, 
  Box,
  Flex
} from "@chakra-ui/react"
import {FaRegUserCircle} from "react-icons/fa"
import { strengthOptions } from '../sign-up/page';
import { passwordStrength } from "check-password-strength"
import {PasswordInput, PasswordStrengthMeter} from "@/components/ui/password-input"
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export type UserRole = "admin" | "owner"

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginWithEmail, null);
  const [userRole, setUserRole] = useState<UserRole>("admin")
  const showAdminOption = searchParams.get("admin") === "true"
  const [isUser, setIsUser] = useState(false)
  const availableRoles = useMemo(() => {
    return ["admin", "owner"]
  }, [isUser])
  const router = useRouter();

  const {watch, register,handleSubmit, formState: {errors}} = useForm({
      defaultValues: {email: "", password: ""}
    })

  const value = watch("password", "")

  const strength = useMemo(() => {
      if(!value) return 0
      const result = passwordStrength(value, strengthOptions)
      return result.id
    }, [value])

  const strengthLabel = useMemo(() => {
      const option = strengthOptions.find((opt: any) => opt.id === strength)
      return option ? option.value : "too short"
    }, [strength])

  const onInternalSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
  });

  const toggleMode = () => {
    setIsUser(!isUser)
  }

  return (
    <form action={formAction}
      onSubmit={onInternalSubmit}
      className="flex w-screen h-screen justify-center">
        <Stack
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        h="100%"
        w="500px">
        <Heading 
        display="flex"
        alignItems="center"
        gap="2"
        fontSize="25px"
        paddingBottom="4">
          <FaRegUserCircle/>
          Login
        </Heading>

        <SimpleGrid
        w="100%"
        gap="6"
        paddingX="8">
          <Field.Root invalid={!!errors.email}>
            <Input
            {...register("email", {
              required: "Email is required!",
              pattern: {value: /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/, message: "Invalid email address"}
            })}
            placeholder="Email"
            variant="outline"
            autoFocus
            borderRadius="full"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <PasswordInput
            {...register("password", {
              required: "Password is required!"
            })}
            placeholder="Password"
            variant="outline"
            autoFocus
            borderRadius="full"
            value={value}
            />
            {value && (
              <Stack w="full">
                <PasswordStrengthMeter value={strength} marginTop="2"/>
                <Text
                fontSize="xs"
                textAlign="right"
                fontWeight="bold">
                  {strengthLabel}
                </Text>
              </Stack>
            )}
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" rounded="full" fontWeight="bold"
          loading={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </SimpleGrid>
        
        <Flex
        alignItems="center"
        gap="4"
        paddingY="8">
          <Text
          fontSize="15px">
             New User?
          </Text>

          <Button
          rounded="full"
          onClick={() => router.push("/signup")}>
            Create an Account
          </Button>
        </Flex>
      </Stack>

      {/* <div className="w-sm">
       <h1 className="mt-10 text-center text-2xl/9 font-bold text-white">Sign in to your account</h1>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email address</label>
        <input id="email" name="email" type="email" required placeholder="john@my-company.com"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
        <input id="password" name="password" type="password" required placeholder="*****"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="flex w-sm justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400">
        {isPending ? "Signing in..." : "Sign in"}
      </button> */}
    </form>
  );
}