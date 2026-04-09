'use client';

import { useActionState, Suspense, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmailCode } from './actions';
import {Field, PinInput, Button, Stack, Text} from "@chakra-ui/react"
import { useForm, Controller } from 'react-hook-form';
import { z } from "zod"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useStatus } from "@/components/context/errorMessage";


const formSchema = z.object({
  pin: z
    .array(z.string())
    .length(6, { message: "Code must be 6 digits long" })
    .refine((val) => val.every(digit => digit !== ""), {
        message: "Code is required"
    })
});

type FormValues = z.infer<typeof formSchema>

function VerificationContent(){
    const { showMessage } = useStatus();
    const searchParams = useSearchParams();
    const [state, formAction] = useActionState(verifyEmailCode, null);
    const [isPending, startTransition] = useTransition();
    const email = searchParams.get('email');

    if (!email) {
        return <Text>Invalid verification link. Please sign up again.</Text>
    }

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: standardSchemaResolver(formSchema),
        defaultValues: {pin: ["", "", "", "", "", ""]}
    })

    useEffect(() => {
        if (state?.error) {
        showMessage(state.error, "error");
        }
    }, [state?.error, showMessage]);
 
    const onSubmit = handleSubmit((data) => {
        if (!email) {
            showMessage("Email is missing. Please sign up again.", "error");
            return
        }

        const fullCode = data.pin.join("");
        const formData = new FormData();
        formData.append("code", fullCode);
        formData.append("email", email);

        
        
        startTransition(() => {
        formAction(formData);
        });
    });
    
    return(
        <form onSubmit={onSubmit}
        className="flex h-screen w-screen justify-center">
            <Stack
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            h="100%"
            w="100%">
                <Field.Root invalid={!!errors.pin || !!state?.error}
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4">
                    <Controller
                        control={control}
                        name="pin"
                        render={({ field }) => (
                        <PinInput.Root
                            value={field.value}
                            onValueChange={(e) => field.onChange(e.value)}
                            disabled={isPending}
                            otp
                        >
                            <PinInput.HiddenInput />
                            <PinInput.Control>
                            <PinInput.Input index={0} />
                            <PinInput.Input index={1} />
                            <PinInput.Input index={2} />
                            <PinInput.Input index={3} />
                            <PinInput.Input index={4} />
                            <PinInput.Input index={5} />
                            </PinInput.Control>
                        </PinInput.Root>
                        )}
                    />
                <Field.ErrorText>
                    {state?.error && (
                        <Text color="red.500" fontSize="sm">{state.error}</Text>
                    )}
                </Field.ErrorText>
                </Field.Root>
                <Button type="submit"
                loading={isPending}>Submit</Button>
            </Stack>
        </form>
    )
}


export default function VerificationPage() {
    return (
        <Suspense fallback={<Text>Loading verification...</Text>}>
            <VerificationContent />
        </Suspense>
    );
}