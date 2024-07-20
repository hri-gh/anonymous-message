'use client';

import React from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';


//COMPONENTS IMPORT
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

// SCHEMA IMPORT
import { VerifySchema } from '@/schemas';

//
import { ApiResponse } from '@/types/api-response';


const VerifyAccount = () => {
    const router = useRouter();
    const { toast } = useToast();
    const params = useParams<{ username: string }>();


    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
    })


    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const username = params.username;
            const code = data.code;

            const response = await axios.post<ApiResponse>(`/api/verify-code`, { username, code });

            router.replace('/sign-in');
            toast({
                title: 'Success',
                description: response.data.message,
            });

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Verification Failed',
                description:
                    axiosError.response?.data.message ??
                    'An error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    }


    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify Your Account
                        </h1>
                        <p className="mb-4">Enter the verification code sent to your email</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <Input placeholder='xxxxxx' {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Verify</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default VerifyAccount
