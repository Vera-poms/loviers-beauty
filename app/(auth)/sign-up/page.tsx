'use client';

import { useActionState, useMemo, useTransition, useEffect } from 'react';
import { signUpWithEmail } from './actions';
import {PasswordInput, PasswordStrengthMeter} from "@/components/ui/password-input"
import {Field, Heading, Input, Text, Button, SimpleGrid, Stack, Box} from "@chakra-ui/react"
import { type Options, passwordStrength } from "check-password-strength"
import { useForm } from 'react-hook-form';
import {FaRegUserCircle} from "react-icons/fa"
import {IoLogInSharp} from "react-icons/io5"
import { useRouter } from 'next/navigation';
import { useStatus } from "@/components/context/errorMessage";

export const strengthOptions:Options<string> = [
  {id:1, value: "weak", minDiversity: 0, minLength: 0},
  {id:2, value: "medium", minDiversity: 2, minLength: 6},
  {id:3, value: "strong", minDiversity: 3, minLength: 8},
  {id:4, value: "very-strong", minDiversity: 4, minLength: 10},
]



export default function SignUpForm() {
  const [state, formAction] = useActionState(signUpWithEmail, null);
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useStatus();
  const router = useRouter();

  const {watch, register,handleSubmit, formState: {errors}} = useForm({
    defaultValues: {name: "", email: "", password: ""}
  })
  const value = watch("password", "")

  useEffect(() => {
    if (!state?.error) return;
    
    if (state.error.includes("User already exists")) {
        router.push('/verify'); 
      } else {
        showMessage(state.error, "error");
      }
  }, [state?.error, showMessage, router]);

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
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form
      action={formAction} 
      onSubmit={onInternalSubmit}
      className="flex h-screen w-screen justify-center">
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
          fontSize="20px"
          paddingBottom="4">
            <FaRegUserCircle/>
            Create a new account
          </Heading>

          <SimpleGrid
          w="100%"
          gap="6"
          paddingX="8">
            <Field.Root>
              <Input
              {...register("name", {
                required: "Name is required for sign up"
              })}
              placeholder="Name"
              variant="outline"
              autoFocus
              borderRadius="full"
              />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>
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
              Sign Up
              <IoLogInSharp />
            </Button>
          </SimpleGrid>
        </Stack>
      

      {/* <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="name" className="block text-sm font-medium text-gray-100">Name</label>
        <input id="name" name="name" type="text" required placeholder="John Doe"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10 focus:outline-indigo-500"
        />
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
        {isPending ? 'Creating account...' : 'Create Account'}
      </button> */}
    </form>
  );
}