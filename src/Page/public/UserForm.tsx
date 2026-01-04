import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Stepper } from '@/components/Stepper';
import { postOrder } from '@/api/folder_user/products';
import type { OrderParams } from '@/type/order';

const UserForm = () => {
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            tel: "",
            email: "",
            country: "",
            city: "",
            address: "",
            message: "",
        },
        mode: "onTouched",
    })

    const onSubmit = (data: any) => {
        const fullAddress = `${data.country}, ${data.city}, ${data.address}`;
        const nameData = `${data.firstName}, ${data.lastName}`
        const msg = data.message
        const submittedData:OrderParams = {
           data:{
             user:{
                name:nameData,
                email:data.email,
                tel:data.tel,
                address:fullAddress
            },
            message:msg
           }
        };
        
        postOrder(submittedData).then(res=>console.log(res)).catch(err=>console.log(err))
    }


    const steps = [
        { title: "Shopping Cart" },
        { title: "Complete Your Information" },
        { title: "Confirm Payment" },
    ]


    return (
        <>
            <div className="w-full max-w-2xl mx-auto px-4 py-12">
                <Stepper steps={steps} currentStep={2} className={'mb-10'} />
                <h1 className="text-3xl font-serif font-bold text-center mb-8 text-balance">Complete Your Information</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            rules={{ required: "First name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-foreground">
                                        First Name <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            rules={{ required: "Last name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Last Name <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tel"
                            rules={{
                                required: "Telephone is required",
                                pattern: {
                                    value: /^[0-9\-\+\(\)\s]{9,}$/,
                                    message: "Please enter a valid telephone number"
                                }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Telephone <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Telephone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address"
                                }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            rules={{ required: "Country is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Country <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            rules={{ required: "City is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        City <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            rules={{ required: "Address is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Address <span className="text-destructive">*</span>
                                    </Label>
                                    <FormControl>
                                        <Input placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>
                                        Message
                                    </Label>
                                    <FormControl>
                                        <Textarea placeholder="Enter your message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    );
}

export default UserForm;